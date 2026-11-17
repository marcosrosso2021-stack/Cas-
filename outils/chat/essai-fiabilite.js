/* casô · essai : rien d'inventé (quantités à préciser) et jamais la rénovation d'un autre client, dans l'appli (navigateur automatisé, Playwright).
   node outils/chat/essai-fiabilite.js [adresse]   (par défaut http://localhost:8767/index.html ; casô servi depuis la racine du dépôt)
   Chaque essai part d'une appli neuve avec quelques données (clients, devis, factures, rendez-vous, plan, pointage), envoie ses phrases
   et vérifie que la réponse contient le texte attendu. Sortie 1 si un essai échoue. */
const {chromium}=require("playwright"),fs=require("fs");
const URL0=process.argv[2]||"http://localhost:8767/index.html";
const DONNEES=`(()=>{const d=n=>{const x=new Date();x.setDate(x.getDate()+n);return x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0')};
db.clients.push({id:'c1',nom:'Martin',tel:'0611111111',adr:'3 rue Victor Hugo, Lyon'},{id:'c2',nom:'Dupont',tel:'0622222222',adr:'12 rue des Lilas, Marseille'},{id:'c3',nom:'Petit',tel:'0633333333',adr:'8 avenue Foch, Paris'});
db.prices.push({id:'p1',nom:'Carrelage',unit:'m²',prix:45,tva:10},{id:'p2',nom:'Faïence',unit:'m²',prix:50,tva:10},{id:'p3',nom:'Dépose carrelage',unit:'m²',prix:15,tva:10},{id:'p4',nom:'Receveur de douche',unit:'u',prix:350,tva:10},{id:'p5',nom:"Main d'œuvre",unit:'h',prix:45,tva:10},{id:'p6',nom:'Colle carrelage',unit:'sac',prix:18,tva:10});
db.quotes.push({id:'q1',num:'D2026-001',client:'Martin',date:'2026-10-20',status:'accepte',lines:[{label:'Carrelage',qty:20,unit:'m²',pu:45,tva:10},{label:'Colle carrelage',qty:4,unit:'sac',pu:18,tva:10},{label:"Main d'œuvre",qty:16,unit:'h',pu:45,tva:10}],remise:0},
 {id:'q2',num:'D2026-002',client:'Petit',date:'2026-09-10',status:'accepte',lines:[{label:'Carrelage',qty:30,unit:'m²',pu:42,tva:10},{label:"Main d'œuvre",qty:21,unit:'h',pu:45,tva:10}],remise:0});
db.invoices.push({id:'f1',kind:'facture',num:'F2026-001',qid:'q1',date:'2026-10-25',client:{nom:'Martin'},lines:[{label:'Carrelage',qty:20,unit:'m²',pu:45,tva:10}],pays:[{amt:900,d:'2026-10-25',mode:'virement'}],remise:0});
db.suppliers.push({id:'s1',nom:'Point P'},{id:'s2',nom:'Cedeo'});
db.achats=[{id:'a1',four:'Point P',type:'facture',date:'2026-10-14',ttc:300,ht:250,cid:'c1',lines:[]}];
db.hist.push({date:'2026-10-14',nom:'PLAQUE BA13 STD 2500x1200',four:'Point P',prix:8.95,unit:'u'},{date:'2026-10-02',nom:'Plaque BA13',four:'Cedeo',prix:9.4,unit:'u'},{date:'2026-10-14',nom:'Faïence',four:'Point P',prix:21,unit:'m²'});
db.events.push({id:'e1',t:'rdv',d:agToday()===agWeekStart(agToday())?agToday():d(-1),a:'10:00',b:'11:00',title:'Dupont',cid:'c2'},{id:'e2',t:'rdv',d:agAdd(agWeekStart(agToday()),-5),a:'08:00',b:'17:00',title:'Pose carrelage',cid:'c1'},{id:'e3',t:'rdv',d:agAdd(agWeekStart(agToday()),8),a:'08:00',b:'12:00',title:'Plinthes',cid:'c1'},{id:'e4',t:'rdv',d:agAdd(agWeekStart(agToday()),9),a:'14:00',b:'16:00',title:'Devis cuisine',cid:'c3'},{id:'e5',t:'rdv',d:agAdd(agWeekStart(agToday()),8),a:'09:00',b:'10:00',title:'Métré',cid:'c2'});
db.plans.push({id:'pl1',pid:'pr1',cid:'c1',nom:'Salle de bain',date:Date.now()-864e5,th:'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',pts:[],wm:[],h:{ok:true},ops:[]});
db.quotes.push({id:'q3',num:'',client:'Martin',date:'2026-11-10',status:'brouillon',lines:[{label:'Peinture',qty:25,unit:'m²',pu:20,tva:10}],remise:0});
db.chantiers=db.chantiers||[];db.pts=db.pts||[];db.chantiers.push({id:'ch1',cid:'c1',nom:'Martin',adr:'3 rue Victor Hugo, Lyon'});
{const t0=new Date('2026-10-21T08:00:00').getTime();db.pts.push({id:'t1',c:'ch1',p:'moi',t:'in',ts:t0},{id:'t2',c:'ch1',p:'moi',t:'out',ts:t0+8*36e5},{id:'t3',c:'ch1',p:'moi',t:'in',ts:t0+864e5},{id:'t4',c:'ch1',p:'moi',t:'out',ts:t0+864e5+8*36e5});}
db.maq3d=[{id:'m1',at:Date.now(),d:{estimation:{lignes:[{poste:'Rebouchage de fissures',unite:'ml',quantite:3,prix_min:20,prix_max:40},{poste:'Peinture murs',unite:'m2',quantite:25,prix_min:15,prix_max:25}]}}}];save();})()`;
/* [langue, phrases, textes attendus dans les réponses (dans l'ordre des phrases ; "" = pas de contrôle)] */
const ESSAIS=[
 /* rien d'inventé : sans surface, la quantité reste à préciser, puis la réponse « 20 m² » la calcule */
 ["fr",["Il faut refaire le sol chez Martin, mettre du carrelage et prévoir les plinthes.","20 m²"],[/Carrelage m² .*Plinthes ml.*Quantités à préciser : Carrelage \(m²\), Plinthes \(ml\)/,/Carrelage 20 m² × 45 € 900 €.*Plinthes 17,1 ml.*pièce carrée de 20 m²/]],
 ["fr",["ajoute du carrelage et des plinthes au devis de Martin","4 m sur 3,5 m"],[/Quantités à préciser/,/Carrelage 14 m² × 45 € 630 €.*Plinthes 14,2 ml/]],
 ["fr",["ajoute du carrelage au devis de Martin"],[/Quantités à préciser : Carrelage \(m²\)/]],
 ["fr",["ajoute du carrelage au devis de Martin","envoie le devis"],[/Quantités à préciser/,/Il manque des (prix|quantités)/]],
 ["fr",["salle de bain 6 m², dépose carrelage, faïence, receveur"],[/Dépose carrelage 6 m².*Receveur de douche 1 u.*pièce carrée de 6 m²/]],
 ["fr",["client Martin, 20 m² de carrelage, 6 heures de main d'oeuvre"],[/Carrelage 20 m² × 45,00 €.*Main d'œuvre 6 h/]],
 ["fr",["ajoute 20 m2 de carrelage au devis de Martin"],[/Carrelage|20 m²/]],
 /* plusieurs actions dans une phrase : la commande, puis la description pour le devis (plus de « maquette 3D ») */
 ["fr",["nouveau devis pour Dupont et ajoute du carrelage"],[/nouveau devis pour Dupont.*\/.*Carrelage m² × 45 €.*Quantités à préciser/]],
 ["fr",["nouveau devis pour Dupont et ajoute 20 m² de carrelage"],[/nouveau devis pour Dupont.*\/.*Carrelage 20 m² × 45 € 900 €/]],
 ["fr",["nouveau devis pour Petit, ajoute du carrelage et des plinthes puis envoie-le"],[/Petit.*\/.*Carrelage m².*Plinthes ml.*\/.*envoyer/]],
 ["en",["new quote for Dupont and add tiling"],[/new quote for Dupont.*\/.*Carrelage m²/]],
 /* l'exemple du cahier des charges : chantier Martin, douche italienne, carrelage, surfaces à donner */
 ["fr",["Pour le chantier Martin, ajoute la rénovation de la salle de bain, prévois une douche italienne, remplace le carrelage, calcule les surfaces et prépare un devis.","4 m sur 2 m"],[/Douche italienne 1 u.*prix à remplir.*Carrelage m².*Quantités à préciser.*550 € TTC/,/Carrelage 8 m² × 45 € 360 €.*946 € TTC/]],
 /* jamais le devis d'un autre client : les lignes de Martin vont sur le brouillon de Martin, pas sur celui de Dupont ouvert */
 ["fr",["nouveau devis pour Dupont","carrelage 10 m² à 40 €","ajoute du carrelage et des plinthes au devis de Martin"],["","",/Quantités à préciser.*Total du devis 550 € TTC/]],
 /* la description garde le client de la phrase ; l'envoi prend le devis du client dont on parle */
 ["fr",["crée le client Bernard et ajoute de la faïence","12 m²"],[/Nouveau client : Bernard.*\/.*Faïence m².*Quantités à préciser/,"js:q.client==='Bernard'&&q.lines.some(l=>l.label==='Faïence'&&l.qty==33)"]],
 ["fr",["appelle Martin et envoie-lui le devis"],["js:q.client==='Martin'&&q.id==='q3'"]],
 ["en",["call Martin and send him the quote"],["js:q.client==='Martin'&&q.id==='q3'"]],
 ["fr",["nouveau devis pour Dupont","carrelage 10 m² à 40 €","envoie le devis de Martin"],["","","js:q.client==='Martin'&&q.id==='q3'"]],
 ["fr",["envoie le devis de Dupont"],[/Je ne trouve pas de devis à envoyer pour Dupont/]],
 ["fr",["nouveau devis pour Dupont","carrelage 10 m² à 40 €","ajoute du carrelage et des plinthes au devis de Martin"],["","","js:(db.quotes.find(o=>o.client==='Dupont'&&o.status!=='accepte')||{lines:[]}).lines.every(l=>l.label!=='Plinthes')"]],
 /* une question ou une modification, pas une mauvaise action */
 ["fr",["Montre-moi ce qu'on a fait la semaine dernière chez Martin."],[/Chantier Martin.*Passages.*Pose carrelage.*Heures pointées : 16 h/]],
 ["fr",["montre-moi Martin"],[/Chantier Martin.*Prochains rendez-vous/]],
 ["fr",["nouveau devis pour Dupont","carrelage 10 m² à 40 €","Remplace le carrelage de cette salle de bain par du parquet imitation bois.","non"],["","",/Carrelage remplacé par Parquet imitation bois.*Parquet imitation bois 10 m².*prix à remplir/,"js:q.lines[0].label==='Carrelage'&&q.lines[0].pu==40"]],
 ["fr",["remplace la peinture par du parquet dans le devis de Martin"],["js:q.id==='q3'&&q.lines[0].label==='Parquet'&&q.lines[0].qty==25&&q.lines[0].pu==null"]],
 ["en",["replace the paint with parquet in Martin's quote"],["js:q.id==='q3'&&q.lines[0].label==='Parquet'"]],
 ["es",["cambia la pintura por parquet en el presupuesto de Martin"],["js:q.id==='q3'&&q.lines[0].label==='Parquet'"]],
 ["ru",["замени покраску на паркет в смете Martin"],["js:q.id==='q3'&&q.lines[0].label==='Parquet'"]],
 ["fr",["remplace le carrelage par de la faïence dans le devis de Dupont"],[/Aucun devis en cours pour Dupont/]],
 ["fr",["change le sol en beige"],[/maquette 3D/]],
 ["fr",["enlève les plinthes du devis"],[/Je ne trouve pas « plinthes »/]],
 ["fr",["y a-t-il des conflits dans mon planning ?"],[/1 conflit dans ton planning.*8h – 12h Martin \/ 9h – 10h Dupont/]],
 ["en",["are there any conflicts in my schedule?"],[/1 conflict in your schedule/]],
 ["fr",["des conflits la semaine dernière ?"],[/Aucun conflit sur cette période/]],
 /* ---- détails d'usage : le devis en cours ---- */
 ["fr",["devis pour Martin : 12 m² de carrelage","ajoute 2 sacs de colle","et 6h de main d'oeuvre","en fait mets 14 m²","enlève la colle","combien ça fait ?","le carrelage c'est 15 m² pas 14","mets le carrelage à 50 €","finalement 8 h","c'est quoi le total ?"],
  ["","","","js:q.lines.length===3&&q.lines[0].label==='Carrelage'&&q.lines[0].qty==14",/Colle carrelage retiré du devis/,/Devis en cours \(Martin\) : 900 € HT, 1 017 € TTC/,"js:q.lines[0].qty==15&&q.lines.length===2","js:q.lines.length===2&&q.lines[0].pu==50&&q.lines[0].qty==15","js:q.lines[1].qty==8&&q.lines.length===2",/1 110 € HT, 1 257 € TTC/]],
 ["fr",["devis pour Martin : 12 m² de carrelage","supprime la main d'oeuvre","en fait 14","enlève le carrelage","non"],["",/Je ne trouve pas « main d oeuvre » dans le devis/,"js:q.lines.length===1&&q.lines[0].qty==14",/Carrelage retiré du devis/,"js:q.lines.length===1&&q.lines[0].label==='Carrelage'"]],
 ["fr",["devis pour Martin : 12 m² de carrelage","mets 2 sacs de colle","non, 3 sacs"],["","","js:q.lines.length===2&&q.lines[1].qty==3"]],
 ["en",["new quote for Martin: 12 m² of tiling","how much is that?","remove the tiling"],["",/Current quote \(Martin\): 540 € excl\. VAT, 594 € incl\. VAT/,"js:!q.lines.some(l=>l.label==='Carrelage')"]],
 /* ---- rendez-vous : celui du client nommé, le prochain ---- */
 ["fr",["décale le rdv de Martin à jeudi 14h"],["js:db.events.find(e=>e.id==='e3').a==='14:00'&&db.events.find(e=>e.id==='e1').a==='10:00'&&db.events.find(e=>e.id==='e5').a==='09:00'"]],
 ["fr",["décale le rdv de Bernard à jeudi 14h"],[/Je ne trouve pas ce rendez-vous/]],
 ["fr",["annule le rdv de Martin"],["js:!db.events.some(e=>e.id==='e3')&&db.events.some(e=>e.id==='e2')"]],
 ["fr",["rdv Petit vendredi 8h pour le métré de la cuisine"],["js:db.events.some(e=>e.title==='Métré de la cuisine'&&e.cid==='c3'&&e.a==='08:00')"]],
 ["fr",["j'ai quoi cette semaine ?"],[/10h – 11h Dupont/]],
 ["fr",["qu'est-ce que j'ai de prévu la semaine prochaine ?"],[/Martin · Plinthes.*Dupont · Métré.*Petit · Devis cuisine/]],
 /* ---- état d'un devis : après un Oui seulement ---- */
 ["fr",["le devis de Martin est signé","oui"],[/Passer le devis de Martin \(550 € TTC\) en « accepté » \?/,"js:db.quotes.find(o=>o.id==='q3').status==='accepte'"]],
 ["fr",["Martin a refusé le devis","non"],[/en « refusé » \?/,"js:db.quotes.find(o=>o.id==='q3').status==='brouillon'"]],
 ["fr",["le devis de Martin est signé"],["js:db.quotes.find(o=>o.id==='q3').status==='brouillon'"]],
 ["fr",["Dupont a accepté le devis"],[/Je ne trouve pas de devis en attente pour Dupont/]],
 ["fr",["est-ce que Martin a signé le devis ?"],[/brouillon 550 € TTC.*D2026-001.*accepté/]],
 ["en",["Martin signed the quote"],[/Mark Martin's quote \(550 € incl\. VAT\) as “accepted”\?/]],
 /* ---- prix : les miens, sinon ceux payés chez les fournisseurs ---- */
 ["fr",["quel est le prix du carrelage ?"],[/Carrelage : 45 € HT \/ m²/]],
 ["fr",["le carrelage est à combien ?"],[/Carrelage : 45 € HT \/ m²/]],
 ["es",["¿cuál es el precio del alicatado?"],[/Carrelage : 45 € HT \/ m²/]],
 ["fr",["prix du parquet"],[/« parquet » n’est pas dans tes services/]],
 ["fr",["prix de la faïence chez Point P"],[/Point P 21 € \/ m²/]],
 ["fr",["combien coûte une plaque de BA13 ?"],[/Point P 8,95 €.*Cedeo 9,40 €/]],
 ["fr",["ajoute un service : pose de parquet 35 € le m²"],["js:db.prices.some(p=>p.nom==='Pose de parquet'&&p.prix==35&&p.unit==='m²')"]],
 /* ---- heures pointées ---- */
 ["fr",["combien d'heures j'ai fait chez Martin ?"],[/Heures pointées chez Martin : 16 h/]],
 /* ---- clients, encaissement, relance ---- */
 ["fr",["nouveau client : Mme Leroy, 06 11 22 33 44, 5 rue des Roses à Lyon"],["js:db.clients.some(c=>c.nom==='Leroy'&&c.tel==='06 11 22 33 44'&&c.adr==='5 rue des Roses à Lyon')&&!db.clients.some(c=>c.nom==='Lyon')"]],
 ["fr",["ajoute le client Jean Moreau, jean.moreau@mail.fr, 07 55 44 33 22"],["js:db.clients.some(c=>c.nom==='Jean Moreau'&&c.email==='jean.moreau@mail.fr'&&c.tel==='07 55 44 33 22')"]],
 ["fr",["Martin a tout payé","oui"],[/Enregistrer le paiement du reste dû par Martin : 90 € \(F2026-001\) \?/,"js:faDue(db.invoices[0])<0.01"]],
 ["fr",["Martin a tout payé"],["js:Math.abs(faDue(db.invoices[0])-90)<0.01"]],
 ["fr",["Petit a tout payé"],["js:db.quotes.length===3&&!/Petites fournitures/.test(JSON.stringify(q.lines))"]],
 ["fr",["relance Martin"],[/Relance de la facture F2026-001 \(90 € restant dû\)/]],
 ["fr",["relance Dupont"],[/Rien à relancer pour Dupont/]],
 ["fr",["mes devis en attente"],[/Martin.*brouillon 550 € TTC/]],
 ["fr",["dernier devis de Petit"],[/D2026-002.*accepté 2 425,50 € TTC/]],
 ["fr",["rdv demain 9h chez Martin","mets-le plutôt à 10h","finalement annule"],["","js:db.events.filter(e=>e.src==='chat'&&e.cid==='c1').length===1&&db.events.find(e=>e.src==='chat'&&e.cid==='c1').a==='10:00'","js:db.events.find(e=>e.src==='chat'&&e.cid==='c1').a==='09:00'"]],
 ["fr",["devis pour Martin : 12 m² de carrelage","arrondis à 600 €"],["","js:q.lines.length===1&&!db.prices.some(p=>/arrondi/i.test(p.nom))"]],
 /* ---- langage de chantier (chat/langage.js) : fautes, abréviations, parler familier ---- */
 ["fr",["faut refaire le bati et changer 2 fenetre"],[/À faire : Refaire le bâti et changer 2 fenêtre/]],
 /* un mot à plusieurs sens : la ligne garde le mot tapé, une seule question, la réponse (touchée ou tapée) précise la ligne */
 ["fr",["devis pour Martin : faut refaire le bati et changer 2 fenetre","de porte"],[/Bâti 1 u.*Fenêtre 2 u.*« Bâti » : bâti de porte, bâti de fenêtre, ou bâti-support de WC \?/,"js:q.lines.some(l=>l.label==='Bâti de porte'&&l.qty==1)&&q.lines.length===3"]],
 ["fr",["Il faut changer le rail.","de cloison"],[/À faire : Changer le rail.*« Rail » : rail de cloison, rail de porte coulissante, ou rail de volet ou de store \?/,"js:(q.notes||[]).some(n=>n.t==='Changer le rail de cloison')"]],
 ["fr",["Il faut changer le rail du placard."],[/^(?![\s\S]*« Rail »)[\s\S]*À faire : Changer le rail du placard/]],
 ["fr",["devis Martin : cloison placo 12 m²","faut changer le rail"],["",/^(?![\s\S]*« Rail »)[\s\S]*rail de cloison/]],
 /* un projet décrit en plusieurs messages ; les murs ne sont pas devinés */
 ["fr",["Je dois refaire ma salle de bain.","Elle fait 8 mètres carrés.","On enlève tout le carrelage.","On met du nouveau au sol et aux murs.","Fais-moi le devis.","18 m²"],
  [/Salle de bain : je note/,/Salle de bain : 8 m²/,/Noté : dépose carrelage/,/Noté : carrelage, carrelage mural/,/Dépose carrelage 8 m² × 15 €.*Carrelage 8 m² × 45 €.*Carrelage mural m².*Quantités à préciser : Carrelage mural \(m²\)/,"js:q.lines.some(l=>l.label==='Carrelage mural'&&l.qty==18)&&q.lines.some(l=>l.label==='Carrelage'&&l.qty==8)"]],
 ["fr",["Je dois refaire la cuisine de Martin","4 m sur 3","faut virer le vieux lino","on met du parquet","et on change l'évier","fais le devis"],
  ["","","","","","js:q.client==='Martin'&&q.lines.some(l=>/pose lino/i.test(l.label)&&l.qty==12&&!l.pu)&&q.lines.some(l=>l.label==='Parquet'&&l.qty==12)&&q.lines.some(l=>l.label==='Évier'&&l.qty==1)"]],
 ["fr",["Je dois refaire ma salle de bain.","Fais-moi le devis."],["",/Dis-moi d’abord les travaux/]],
 /* douze mots à plusieurs sens ; un mot fort de la même phrase suffit (« doublage + bandes ») */
 ["fr",["devis Martin : doublage 30 m² + bandes"],[/^(?![\s\S]*« Bandes »)[\s\S]*Doublage 30 m².*Bandes à joint m²/]],
 ["fr",["faut refaire les joints","silicone"],[/À faire : Refaire les joints.*« Joints » : joints de carrelage, joints silicone, ou joints de plaques de plâtre \?/,"js:(q.notes||[]).some(n=>n.t==='Refaire les joints silicone')"]],
 ["fr",["faut refaire les joints de la baignoire"],[/^(?![\s\S]*« Joints »)[\s\S]*À faire : Refaire les joints de la baignoire/]],
 ["fr",["devis Martin : changer la plaque et la hotte"],[/^(?![\s\S]*« Plaque »)[\s\S]*Plaque de cuisson 1 u.*Hotte 1 u/]],
 ["fr",["il faut changer la colonne","de douche"],[/« Colonne » : colonne de douche, colonne d'évacuation, ou colonne électrique \?/,"js:(q.notes||[]).some(n=>n.t==='Changer la colonne de douche')"]],
 ["fr",["devis Martin : poser une trappe"],[/Trappe 1 u.*« Trappe » : trappe de visite ou trappe de combles \?/]],
 ["fr",["devis Martin : 10 plaques de BA13"],["js:q.lines.some(l=>/plaques (de )?BA13/i.test(l.label)&&l.qty==10&&l.unit==='u')"]],
 ["fr",["devis Martin : carrelage 10 m² et joints"],[/Carrelage 10 m².*oints de carrelage/]],
 /* un travail dit sans « faut » : gardé dans les notes À faire au lieu de « Je n'ai pas compris » */
 ["fr",["refaire la gouttiere"],[/À faire : Refaire la gouttière/]],
 ["fr",["evacuation des gravas à la benne"],[/À faire : Évacuation des gravats à la benne/]],
 ["fr",["poser un ipn pour l ouverture"],["js:(q.notes||[]).some(n=>n.k==='todo'&&/ipn/i.test(n.t))"]],
 ["fr",["azfk qsdjl mwx"],[/Je n’ai pas compris/]],
 /* constats rédigés : le mot familier devient le mot du compte rendu, accordé ; la phrase tapée est gardée avec la note */
 ["fr",["le sol est mort"],["js:(q.notes||[]).some(n=>n.t===\"Sol hors d'usage\"&&n.o==='le sol est mort')"]],
 ["fr",["les plinthes sont pourries"],[/Remarques : Plinthes dégradées/]],
 ["fr",["La fenêtre est abimee","Celle de la cuisine."],[/Remarques : Fenêtre abîmée/,/Remarques : Fenêtre de la cuisine abîmée/]],
 /* les autres langues : projet en plusieurs messages, constats, mots du lexique dans un devis */
 ["en",["I have to redo my bathroom.","It is 8 square meters.","We remove all the tiling.","We put new tiles on the floor and on the walls.","Make me the quote.","18 m²"],[/Noted\. Give me the area/,/Area: 8 m²/,/Noted: dépose carrelage/,/Noted: carrelage, carrelage mural/,/Dépose carrelage 8 m².*Carrelage 8 m².*Carrelage mural m².*Quantities to be specified: Carrelage mural/,"js:q.lines.some(l=>l.label==='Carrelage mural'&&l.qty==18)"]],
 ["es",["Tengo que reformar el baño.","Mide 8 metros cuadrados.","Quitamos todo el alicatado.","Ponemos azulejos nuevos en el suelo y en las paredes.","Hazme el presupuesto."],["","","","","js:q.lines.some(l=>l.label==='Dépose carrelage'&&l.qty==8)&&q.lines.some(l=>l.label==='Carrelage'&&l.qty==8)&&q.lines.some(l=>l.label==='Carrelage mural'&&l.qty==null)"]],
 ["pt",["Tenho de renovar a casa de banho.","Tem 8 metros quadrados.","Tiramos todo o azulejo.","Pomos azulejo novo no chão e nas paredes.","Faz-me o orçamento."],["","","","","js:q.lines.length===3&&q.lines.some(l=>l.label==='Carrelage mural'&&l.qty==null)&&q.lines.some(l=>l.label==='Carrelage'&&l.qty==8)"]],
 ["it",["Devo rifare il bagno.","Misura 8 metri quadrati.","Togliamo tutte le piastrelle.","Mettiamo piastrelle nuove a pavimento e alle pareti.","Fammi il preventivo."],["","","","","js:q.lines.length===3&&q.lines.some(l=>l.label==='Carrelage mural'&&l.qty==null)&&q.lines.some(l=>l.label==='Dépose carrelage'&&l.qty==8)"]],
 ["ro",["Trebuie să refac baia.","Are 8 metri pătrați.","Scoatem toată gresia.","Punem gresie nouă pe jos și faianță pe pereți.","Fă-mi devizul."],["","","","","js:q.lines.some(l=>l.label==='Carrelage'&&l.qty==8)&&q.lines.some(l=>l.label==='Faïence'&&l.qty==null)"]],
 ["pl",["Muszę wyremontować łazienkę.","Ma 8 metrów kwadratowych.","Zrywamy wszystkie płytki.","Kładziemy nowe płytki na podłodze i na ścianach.","Zrób mi kosztorys."],["","","","","js:q.lines.length===3&&q.lines.some(l=>l.label==='Carrelage mural'&&l.qty==null)"]],
 ["tr",["Banyoyu yenilemem lazım.","8 metrekare.","Bütün fayansları söküyoruz.","Yere ve duvarlara yeni fayans döşüyoruz.","Bana teklifi hazırla."],["","","","","js:q.lines.length===3&&q.lines.some(l=>l.label==='Carrelage mural'&&l.qty==null)"]],
 ["ru",["Мне нужно переделать ванную.","Она 8 квадратных метров.","Снимаем всю плитку.","Кладём новую плитку на пол и на стены.","Сделай мне смету."],["","","","","js:q.lines.length===3&&q.lines.some(l=>l.label==='Carrelage mural'&&l.qty==null)"]],
 ["ar",["يجب أن أجدد الحمام.","مساحته 8 متر مربع.","نزيل كل البلاط.","نضع بلاطاً جديداً على الأرض والجدران.","جهز لي عرض السعر."],["","","","","js:q.lines.length===3&&q.lines.some(l=>l.label==='Carrelage mural'&&l.qty==null)"]],
 ["en",["The wall is damaged."],["js:(q.notes||[]).some(n=>n.t==='The wall is damaged')"]],
 ["es",["La pared está dañada."],["js:(q.notes||[]).some(n=>n.t==='La pared está dañada')"]],
 ["en",["quote for Martin: replace the water heater, 3 sockets and plasterboard 20 m²"],[/Chauffe-eau 1 u.*Prise 3 u.*Placo 20 m²/]],
 /* constats : gardés dans les notes du devis, sans rien en déduire */
 ["fr",["Le mur est abîmé.","Celui de droite.","Il faut le reprendre aussi derrière la porte."],[/Remarques : Mur abîmé/,/Remarques : Mur de droite abîmé/,/À faire : Reprendre le mur de droite, aussi derrière la porte/]],
 /* devis d'après un modèle du métier : pas de surface ni d'heures inventées */
 ["fr",["fais un devis pour Dupont pour refaire sa cuisine"],[/Quantités à préciser : Crédence \(m²\), Main d’œuvre \(h\)/]],
 ["fr",["faut peter le vieux carlage et remettre du neuf"],[/^(?![\s\S]*9)[\s\S]*À faire : Déposer l'ancien carrelage et remettre du carrelage/]],
 ["fr",["faut peter le vieux carlage et remettre du neuf"],["js:CHAT.m.some(m=>m.who==='me'&&m.text==='faut peter le vieux carlage et remettre du neuf')"]],
 ["fr",["devis Martin faut peter le vieux carlage et remettre du neuf","12 m²"],[/Dépose carrelage m² × 15 €.*Carrelage m² × 45 €.*Quantités à préciser/,/Dépose carrelage 12 m².*Carrelage 12 m²/]],
 ["fr",["dep comp sol sdb + pose carrelage"],[/À faire : Dépose complète sol salle de bain et pose carrelage/]],
 ["fr",["devis Martin : dep comp sol sdb + pose carrelage"],[/Dépose complète sol salle de bain m².*Carrelage m² × 45 €.*Quantités à préciser/]],
 /* la surface dite avec un travail est la sienne : plus de « 43,1 m² » calculés */
 ["fr",["devis Martin : virer le vieux placo 20 m² et mettre du ba13, faire les bandes"],[/^(?![\s\S]*43,1)[\s\S]*Dépose placo 20 m².*BA13 m².*Bandes à joint m².*Quantités à préciser : BA13 \(m²\), Bandes à joint \(m²\)/]],
 ["fr",["devis Martin : dépose placo 20 m²"],["js:q.lines.some(l=>l.label==='Dépose placo'&&l.qty==20&&!l.pu)&&!q.lines.some(l=>l.label==='Dépose carrelage')"]],
 ["fr",["devis Martin : remplacer le chauffe-eau, tirer une ligne pour le four, et repeindre le salon 25 m²"],[/Chauffe-eau 1 u.*Ligne électrique pour le four 1 u.*Peinture.*estimés pour une pièce carrée de 25 m²/]],
 ["fr",["devis Dupont : 3 prises, 2 inter, 1 radiateur et de la laine de verre dans les combles"],[/Prises 3 u.*Interrupteur 2 u.*Radiateur 1 u.*aine de verre dans les combles m²/]],
 /* une commande de l'appli sort du nettoyage identique */
 ["fr",["passe le carrelage à 48 € le m²"],["js:db.prices.find(p=>p.nom==='Carrelage').prix==48"]],
 /* les fonctions arrivées depuis (Newsletter, métier, prix en ligne, pages de « Mon entreprise », vidéo, Face ID) */
 ["fr",["ouvre la newsletter"],["js:document.querySelector('section.on').id==='s-news'"]],
 ["en",["open the newsletter"],["js:document.querySelector('section.on').id==='s-news'"]],
 ["fr",["quoi de neuf"],["js:document.querySelector('section.on').id==='s-chat'"]],
 ["fr",["mon métier c'est plombier"],["js:db.prof.metier==='plombiers-chauffagistes'"]],
 ["fr",["je suis carreleur"],["js:db.prof.metier==='autre'&&!q.lines.length"]],
 ["fr",["je suis électricien"],[/Électricien/]],
 ["fr",["je suis arrivé"],["js:!db.prof.metier"]],
 ["fr",["mon métier"],["js:document.querySelector('section.on').id==='s-cpt'&&cptCur==='ent'"]],
 ["fr",["ma zone d'assurance c'est la France entière"],["js:db.prof.zone==='la France entière'"]],
 ["fr",["change mon siret"],["js:document.querySelector('section.on').id==='s-cpt'&&cptCur==='ent'"]],
 ["fr",["cherche le prix du placo en ligne"],["js:document.querySelector('section.on').id==='s-fou'&&FOU_M==='web'&&document.getElementById('fouQ').value==='placo'"]],
 ["fr",["compare les prix de la laine de verre"],["js:FOU_M==='web'&&document.getElementById('fouQ').value==='laine de verre'"]],
 ["fr",["prix du BA13 en magasin"],["js:document.querySelector('section.on').id==='s-chat'"]],
 ["fr",["cherche le devis de Martin en ligne"],["js:document.querySelector('section.on').id!=='s-fou'"]],
 ["fr",["mon équipe"],["js:cptCur==='team'&&document.getElementById('teamList').closest('[data-cp]').style.display!=='none'"]],
 ["fr",["invite un ouvrier"],["js:cptCur==='team'&&document.getElementById('nuName').closest('[data-cp]').style.display!=='none'"]],
 ["fr",["change la langue"],["js:cptCur==='app'&&document.getElementById('uiLang').offsetParent!==null"]],
 ["fr",["ouvre les notifications"],["js:cptCur==='app'"]],
 ["fr",["mon entreprise"],["js:cptCur==='ent'&&document.getElementById('eNom').offsetParent!==null"]],
 ["fr",["mon équipe","mon entreprise"],["js:cptCur==='team'","js:cptCur==='ent'"]],
 ["fr",["où en est la vidéo"],[/Aucune analyse vidéo en cours/]],
 ["fr",["filme la pièce pour la maquette"],["js:!!M3D&&!document.getElementById('m3d').hidden"]],
 ["fr",["active Face ID"],["js:CHAT.m.slice(-3).some(m=>/faceid/.test(m.html||''))"]],
 /* des réponses qui tiennent compte de la situation (chat/reponses.js) */
 ["fr",["où j'en suis"],[/Aujourd’hui :.*Brouillons : Martin.*À encaisser : 90/]],
 ["fr",["fais le point"],[/À encaisser : 90/]],
 ["fr",["le point sur Martin"],[/Martin.*Devis :.*brouillon.*accepté.*À encaisser : 90.*F2026-001.*Prochain rendez-vous/]],
 ["fr",["où en est Petit"],[/Petit.*Devis :.*accepté.*À encaisser : rien/]],
 ["fr",["où en est le devis de Martin"],[/D2026-001/]],
 ["fr",["c'est bon ?"],[/Aucun devis en cours/]],
 ["fr",["devis Petit carrelage 30m2 à 5 euros","c'est bon ?"],[/./,/À vérifier :.*Carrelage à 5.*d’habitude 45.*1 ligne, 150/]],
 ["fr",["nouveau devis pour Dupont","ajoute 20 m² de carrelage","vérifie le devis"],[/./,/./,/Rien à signaler : 1 ligne, 900.*990/]],
 ["fr",["nouveau devis pour Dupont","ajoute 20 m² de carrelage","ajoute du carrelage","il manque quelque chose ?"],[/./,/./,"js:q.lines.filter(l=>l.label).length===2&&q.lines[1].qty==null",/quantité à préciser : Carrelage.*en double : Carrelage/]],
 ["fr",["nouveau devis pour Dupont","ajoute 20 m² de carrelage","ajoute 5 sacs de colle","supprime la dernière ligne","annule"],[/./,/./,/./,"js:q.lines.filter(l=>l.label).length===1","js:q.lines.filter(l=>l.label).length===2"]],
 ["fr",["supprime la dernière ligne"],[/Aucun devis en cours/]],
 ["fr",["annule"],[/Rien à annuler/]],
 ["fr",["Martin a payé 50","oui"],[/Enregistrer un paiement de 50.*Martin.*F2026-001/,"js:Math.abs(faDue(db.invoices[0])-40)<0.01"]],
 ["fr",["Martin a payé 50","non"],[/./,"js:Math.abs(faDue(db.invoices[0])-90)<0.01"]],
 ["fr",["Martin a payé 500"],["js:Math.abs(faDue(db.invoices[0])-90)<0.01"]],
 ["fr",["Petit a payé 200"],[/Aucune facture à encaisser pour Petit/]],
 ["fr",["combien j'ai facturé cette année"],[/Facturé 2026 : 900.*990.*1 facture\).*Reste à encaisser : 90/]],
 ["fr",["combien me doit Martin","et Petit ?"],[/90/,/Aucune facture à encaisser pour Petit/]],
 ["fr",["le point sur Martin","et pour Petit ?"],[/./,/Petit.*Devis :/]],
 ["fr",["rdv Martin demain 10h","et Petit"],[/./,"js:db.events.filter(e=>e.cid==='c3').length===1"]],
 ["en",["where am I at"],["js:true"]],
 /* fiabilité : une phrase qui n'est pas un travail n'écrit rien dans le devis (phrases du cahier « Intelligence Evolution ») */
 ["fr",["retiens que le code du portail de Martin est 4521"],[/C’est retenu/,"js:!db.quotes.some(o=>(o.lines||[]).some(l=>/portail|retiens/i.test(l.label||'')))&&!(q.lines||[]).some(l=>/portail|retiens/i.test(l.label||''))"]],
 ["fr",["nouveau devis pour Martin","Ajoute deux heures sur le devis.","Mets plutôt 3.","annule"],[/./,"js:q.lines.filter(l=>l.label).length===1&&/main/i.test(q.lines[0].label)&&q.lines[0].qty==2","js:q.lines.filter(l=>l.label).length===1&&q.lines[0].qty==3","js:q.lines[0].qty==2"]],
 ["fr",["nouveau devis pour Martin","ajoute 2h de main d'oeuvre","Fais la même chose pour Petit."],[/./,/./,"js:q.client==='Martin'&&q.lines.filter(l=>l.label).length===1&&!(q.notes||[]).length"]],
 ["fr",["nouveau devis pour Dupont","ajoute 20 m² de carrelage","Chez moi, quand je dis dépose complète, ça veut dire enlever le carrelage et la colle jusqu'au support."],[/./,/./,"js:q.lines.filter(l=>l.label).length===1&&!(q.notes||[]).length"]],
 ["fr",["Dans mes devis, écris toujours dépose et évacuation des anciens matériaux au lieu de juste dépose."],["js:document.querySelector('section.on').id==='s-chat'"]],
 ["fr",["Chez Martin, on a déposé le carrelage, il y avait de l'humidité derrière, on a arrêté pour voir d'où ça vient."],["js:!db.quotes.some(o=>(o.lines||[]).some(l=>/d[ée]pose/i.test(l.label||'')&&o.id==='q3'))&&!(q.lines||[]).some(l=>/d[ée]pose/i.test(l.label||''))"]],
 ["fr",["Mets la même chose que sur le chantier précédent."],["js:!(q.lines||[]).some(l=>l.label)&&!(q.notes||[]).length"]],
 ["fr",["ouvre le devis de Martin","ajoute 2h de main d'oeuvre"],[/./,"js:q.client==='Martin'&&q.lines.filter(l=>l.label).length>=2"]],
 ["fr",["acompte de 30% pour Martin"],["js:q.client==='Martin'&&q.acompte==30"]],
 ["fr",["nouveau client Martin"],[/Martin est déjà dans tes clients/]],
 ["fr",["nouveau client Durand"],["js:db.clients.some(c=>c.nom==='Durand')"]],
 ["fr",["nouveau devis pour Dupont","ajoute du carrelage","plutôt 12"],[/./,"js:q.lines.filter(l=>l.label).length===1&&q.lines[0].qty==null","js:q.lines[0].qty==12"]],
 ["fr",["mon taux horaire c'est 50","annule"],[/./,"js:String(db.prof.tauxH||'')!=='50'"]],
 ["fr",["mets plutôt le rdv de Martin à 15h"],[/déplacé/]],
 ["fr",["Faut refaire le bas du mur."],[/À faire : Refaire le bas du mur/]],
 ["fr",["Martin m'a appelé, il veut que je repasse lundi."],[/Tu veux : ajouter un rendez-vous lundi/]],
 /* jamais la rénovation d'un autre client */
 ["fr",["mets la rénovation sur le devis de Dupont","oui","mets la rénovation sur le devis de Petit"],[/n’est liée à aucun client.*devis de Dupont/,/Rebouchage de fissures 3 ml/,/Aucune rénovation enregistrée pour Petit/]],
 ["fr",["mets la rénovation sur le devis de Dupont","oui","fiche chantier Dupont","fiche chantier Martin"],[/aucun client/,/Rebouchage/,/Chantier Dupont.*Rénovation 3D.*2 postes/,/^(?![\s\S]*Rénovation 3D)[\s\S]*Chantier Martin/]],
 ["fr",["mets la rénovation sur le devis de Dupont","non"],[/n’est liée à aucun client/,/D’accord/]],
 ["fr",["fais le devis de la rénovation"],[/Rebouchage de fissures 3 ml.*Prix indicatifs/]],
 ["en",["add tiling and skirting to Martin's quote","20 m²"],[/Quantities to be specified/,/20 m²/]],
 ["es",["pon la reforma en el presupuesto de Dupont"],[/no está vinculada a ningún cliente/]]
];
(async()=>{const b=await chromium.launch();let ko=0;const out=[];
 for(const [lg,phr,att] of ESSAIS){const ctx=await b.newContext({serviceWorkers:"block"}),p=await ctx.newPage();const err=[];p.on("pageerror",e=>err.push(e.message));
  await p.addInitScript(l=>{localStorage.setItem("caso_account",JSON.stringify({prenom:"Paul",email:"t@e.fr",mode:"artisan",lang:l}));localStorage.setItem("caso_lang",l);},lg);
  await p.goto(URL0);await p.waitForTimeout(1200);await p.evaluate(()=>{document.body.classList.remove("starting");tab("chat")});
  await p.waitForFunction(()=>window.casoPont&&casoPont.ready&&casoPont.question,null,{timeout:20000});await p.evaluate(s=>eval(s),DONNEES);
  for(let i=0;i<phr.length;i++){const n=await p.evaluate(()=>CHAT.m.length);await p.evaluate(t=>chatSend(t),phr[i]);await p.waitForTimeout(900);await p.waitForFunction(()=>!chatMulti.busy,null,{timeout:15000});await p.waitForTimeout(300);
   const rep=await p.evaluate(n=>CHAT.m.slice(n).filter(m=>m.who==="bot").map(m=>String(m.html||"").replace(/<[^>]+>/g," ").replace(/&#39;/g,"'").replace(/\s+/g," ")).join(" / "),n);
   /* attendu : une expression régulière sur la réponse, ou "js:…" vérifié dans l'appli (le devis ouvert, la base) */
   const a=att[i],ok=!a||(typeof a==="string"?await p.evaluate(x=>{try{return !!eval(x)}catch(e){return false}},a.slice(3)):a.test(rep));if(!ok)ko++;out.push((ok?"ok   ":"RATÉ ")+"["+lg+"] "+phr[i]+"\n      réponse : "+rep.slice(0,260));}
  if(err.length){ko++;out.push("ERREUR ["+lg+"] "+phr.join(" / ")+" : "+err.join(" ; "));}
  await ctx.close();}
 await b.close();const rapport="# Quantités et rénovation par client\n\n```\n"+out.join("\n")+"\n```\n\n"+(ko?ko+" essai(s) raté(s).":"Tous les essais passent.");
 console.log(rapport);if(process.env.GITHUB_STEP_SUMMARY)fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY,rapport+"\n");process.exit(ko?1:0);})();
