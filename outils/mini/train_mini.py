"""Entraînement de casô-mini (numpy seul, quelques minutes sur un ordinateur portable).
Entrées : labels.json, train.jsonl, test.jsonl (produits par gen-data.js), et en option feedback.jsonl
(phrases confirmées ou corrigées par les artisans, même format).
Sortie : caso-mini-model.json (tables int8 + couches de sortie), chargé par caso-mini.js dans le téléphone.
Usage : python3 train_mini.py [dimension] [époques]"""
import json, sys, time, base64, os
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
D = int(sys.argv[1]) if len(sys.argv) > 1 else 48
EPOCHS = int(sys.argv[2]) if len(sys.argv) > 2 else 5
rng = np.random.default_rng(7)

lab = json.load(open(os.path.join(HERE, "labels.json")))
INT, TAG, BI, BT = lab["intents"], lab["tags"], lab["BI"], lab["BT"]
iI = {k: i for i, k in enumerate(INT)}; iT = {k: i for i, k in enumerate(TAG)}

def load(name):
    p = os.path.join(HERE, name)
    if not os.path.exists(p): return []
    return [json.loads(l) for l in open(p, encoding="utf8") if l.strip()]

train, test, testnew = load("train.jsonl"), load("test.jsonl"), load("testnew.jsonl")
FINAL = os.environ.get("FINAL") == "1"
if FINAL: train += testnew + test
fb = load("feedback.jsonl")
train += fb * 5  # les vraies corrections pèsent plus lourd

def ragged(lists):
    lens = np.array([len(x) for x in lists], dtype=np.int64)
    flat = np.concatenate([np.asarray(x, dtype=np.int64) for x in lists]) if lists else np.zeros(0, np.int64)
    seg = np.repeat(np.arange(len(lists)), lens)
    starts = np.concatenate([[0], np.cumsum(lens)[:-1]])
    return flat, seg, lens, starts

class FastText:
    def __init__(self, B, K, d):
        self.E = ((rng.random((B, d), dtype=np.float32) - 0.5) / d).astype(np.float32)
        self.W = np.zeros((K, d), np.float32); self.b = np.zeros(K, np.float32); self.B = B; self.K = K; self.d = d; self.drop = 0.0
    def hidden(self, flat, seg, lens, n):
        H = np.zeros((n, self.d), np.float32); np.add.at(H, seg, self.E[flat]); return H / lens[:, None]
    def probs(self, H):
        Z = H @ self.W.T + self.b; Z -= Z.max(1, keepdims=True); P = np.exp(Z); return P / P.sum(1, keepdims=True)
    def fit(self, X, y, epochs, lr0=0.1, bs=32, name=""):
        n = len(X); steps = epochs * ((n + bs - 1) // bs); step = 0
        for ep in range(epochs):
            order = rng.permutation(n); t0 = time.time(); loss = 0.0
            for s in range(0, n, bs):
                idx = order[s:s + bs]; lr = lr0 * (1 - step / steps) + 1e-3; step += 1
                xs = [X[i] for i in idx]
                if self.drop: xs = [[f for f in x if f == x[0] or rng.random() > self.drop] or x[:1] for x in xs]
                flat, seg, lens, _ = ragged(xs); m = len(idx)
                H = self.hidden(flat, seg, lens, m); P = self.probs(H); Y = y[idx]
                loss -= np.log(P[np.arange(m), Y] + 1e-9).sum()
                G = P; G[np.arange(m), Y] -= 1
                dH = G @ self.W
                self.W -= lr * (G.T @ H); self.b -= lr * G.sum(0)
                np.add.at(self.E, flat, -lr * (dH / lens[:, None])[seg])
            print(f"  {name} époque {ep+1}/{epochs} perte {loss/n:.4f} ({time.time()-t0:.0f} s)", flush=True)
    def predict(self, X):
        out = []
        for s in range(0, len(X), 2048):
            flat, seg, lens, _ = ragged(X[s:s + 2048]); out.append(self.probs(self.hidden(flat, seg, lens, len(X[s:s + 2048]))).argmax(1))
        return np.concatenate(out) if out else np.zeros(0, int)
    def export(self):
        a = np.abs(self.E).max(1); sc = np.where(a > 0, a / 127.0, 0).astype(np.float32)
        q = np.where(sc[:, None] > 0, np.round(self.E / np.where(sc[:, None] > 0, sc[:, None], 1)), 0).clip(-127, 127).astype(np.int8)
        return {"emb": {"B": self.B, "d": self.d, "q": base64.b64encode(q.tobytes()).decode(), "s": [round(float(x), 7) for x in sc]},
                "head": {"K": self.K, "d": self.d, "W": [round(float(x), 6) for x in self.W.ravel()], "b": [round(float(x), 6) for x in self.b]}}

t0 = time.time()
print(f"Exemples : {len(train)} (dont {len(fb)} corrections réelles x5), test : {len(test)}, d={D}, époques={EPOCHS}")
# --- intention ---
Xi = [e["fi"] for e in train]; yi = np.array([iI[e["intent"]] for e in train])
mi = FastText(BI, len(INT), D); mi.drop = 0.2; mi.fit(Xi, yi, EPOCHS, name="intention")
# --- éléments (un exemple par mot) ---
Xt, yt = [], []
for e in train:
    if not e.get("tags"): continue  # corrections réelles : seulement l'intention
    for f, g in zip(e["ft"], e["tags"]): Xt.append(f); yt.append(iT[g])
yt = np.array(yt); mt = FastText(BT, len(TAG), D); mt.fit(Xt, yt, max(3, EPOCHS - 2), lr0=0.05, bs=64, name="éléments")

def evaluate(data, label):
    if not data: return {}
    pi = mi.predict([e["fi"] for e in data]); acc = float((pi == np.array([iI[e["intent"]] for e in data])).mean())
    toks = [(f, g) for e in data for f, g in zip(e["ft"], e["tags"])]
    pt = mt.predict([f for f, _ in toks]); gold = np.array([iT[g] for _, g in toks])
    ent = gold != 0; tacc = float((pt[ent] == gold[ent]).mean()) if ent.any() else 0.0
    fp = float(((pt != 0) & (gold == 0)).mean())
    byl = {}
    for e, p in zip(data, pi): byl.setdefault(e["lang"], []).append(p == iI[e["intent"]])
    res = {"intention": round(acc, 4), "elements_mots": round(tacc, 4), "faux_elements": round(fp, 4), "par_langue": {k: round(float(np.mean(v)), 3) for k, v in byl.items()}}
    print(label, json.dumps(res, ensure_ascii=False)); return res

stats = {"phrases_nouvelles": evaluate(test, "Phrases jamais vues :"), "tournures_nouvelles": evaluate(testnew, "Tournures jamais vues (mots nouveaux) :"), "final": FINAL}
cnt = np.bincount(np.concatenate([np.asarray(x) for x in Xi]), minlength=BI)
frozen = np.packbits((cnt >= 150).astype(np.uint8), bitorder="little")
model = {"version": time.strftime("%Y%m%d%H%M"), "intents": INT, "tags": TAG, "intent": mi.export(), "slots": mt.export(), "stats": stats,
         "frozen": base64.b64encode(frozen.tobytes()).decode()}
json.dump(model, open(os.path.join(HERE, "caso-mini-model.json"), "w"), separators=(",", ":"))
print(f"Modèle écrit ({os.path.getsize(os.path.join(HERE, 'caso-mini-model.json'))/1e6:.1f} Mo) en {time.time()-t0:.0f} s")
