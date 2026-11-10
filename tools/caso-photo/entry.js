// casô : rendu photoréaliste par lancer de rayons (three r187 + three-gpu-pathtracer), à partir de la scène du module 3D (three r128)
import * as THREE from 'three';
import { WebGLPathTracer, DenoiseMaterial } from 'three-gpu-pathtracer';
import { FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass.js';
import { HDRLoader } from 'three/examples/jsm/loaders/HDRLoader.js';

THREE.ColorManagement.enabled = false; // les couleurs du module sont déjà linéaires

let OPT = {};
const texCache = new Map();
function convTex( t ) {
	if ( ! t || ! t.image ) return null;
	let o = texCache.get( t.uuid );
	if ( o ) return o;
	o = new THREE.Texture( t.image );
	o.wrapS = t.wrapS === 1000 ? THREE.RepeatWrapping : t.wrapS === 1002 ? THREE.MirroredRepeatWrapping : THREE.ClampToEdgeWrapping;
	o.wrapT = t.wrapT === 1000 ? THREE.RepeatWrapping : t.wrapT === 1002 ? THREE.MirroredRepeatWrapping : THREE.ClampToEdgeWrapping;
	o.repeat.copy( t.repeat ); o.offset.copy( t.offset ); o.center.copy( t.center ); o.rotation = t.rotation; o.flipY = t.flipY;
	o.colorSpace = t.encoding === 3001 ? THREE.SRGBColorSpace : THREE.NoColorSpace;
	o.anisotropy = 4; o.needsUpdate = true;
	texCache.set( t.uuid, o );
	return o;
}
const matCache = new Map();
function convMat( m ) {
	let o = matCache.get( m.uuid );
	if ( o ) return o;
	const c = x => new THREE.Color( x.r, x.g, x.b );
	o = new THREE.MeshPhysicalMaterial( {
		color: m.color ? c( m.color ) : new THREE.Color( 1, 1, 1 ),
		roughness: m.roughness !== undefined ? m.roughness : 0.8,
		metalness: m.metalness !== undefined ? m.metalness : 0,
		map: convTex( m.map ), normalMap: OPT.noNormals ? null : convTex( m.normalMap ), roughnessMap: convTex( m.roughnessMap ), alphaMap: convTex( m.alphaMap ),
		emissive: m.emissive ? c( m.emissive ) : new THREE.Color( 0, 0, 0 ), emissiveIntensity: m.emissiveIntensity || 1, emissiveMap: convTex( m.emissiveMap ),
		transparent: !! m.transparent, opacity: m.opacity !== undefined ? m.opacity : 1, side: m.side === 2 ? THREE.DoubleSide : m.side === 1 ? THREE.BackSide : THREE.FrontSide,
	} );
	if ( m.normalScale ) o.normalScale.set( m.normalScale.x, m.normalScale.y );
	// verre : vraie transmission plutôt qu'une simple transparence
	if ( m.transparent && m.opacity < 0.35 && m.roughness < 0.2 ) { o.transparent = false; o.opacity = 1; o.transmission = 1; o.ior = 1.5; o.thickness = 0.01; o.roughness = 0.02; o.color.setRGB( 1, 1, 1 ); }
	// eau
	else if ( m.transparent && m.roughness <= 0.06 ) { o.transparent = false; o.opacity = 1; o.transmission = 0.9; o.ior = 1.33; o.thickness = 1.2; o.attenuationColor = new THREE.Color( 0.55, 0.8, 0.85 ); o.attenuationDistance = 2; }
	matCache.set( m.uuid, o );
	return o;
}
const geoCache = new Map();
function convGeo( g ) {
	let o = geoCache.get( g.uuid );
	if ( o ) return o;
	o = new THREE.BufferGeometry();
	for ( const k of [ 'position', 'normal', 'uv' ] ) {
		const a = g.attributes[ k ];
		if ( a ) o.setAttribute( k, new THREE.BufferAttribute( a.array, a.itemSize, a.normalized ) );
	}
	if ( g.index ) o.setIndex( new THREE.BufferAttribute( g.index.array, 1 ) );
	if ( g.groups ) for ( const gr of g.groups ) o.addGroup( gr.start, gr.count, gr.materialIndex );
	geoCache.set( g.uuid, o );
	return o;
}
// scène r128 → scène r187 : maillages visibles seulement, sans les ombres peintes (le lancer de rayons les calcule)
function convScene( src, opts ) {
	const out = new THREE.Scene();
	src.updateMatrixWorld( true );
	const vis = o => { for ( let p = o; p; p = p.parent ) if ( ! p.visible ) return false; return true; };
	src.traverse( o => {
		// soleil de la maquette (unités « anciennes » de three r128 : ×π en unités physiques)
		if ( o.isDirectionalLight && o.intensity > 0.5 && vis( o ) && opts.sun !== false ) {
			const l = new THREE.DirectionalLight( new THREE.Color( o.color.r, o.color.g, o.color.b ), o.intensity * Math.PI * ( opts.sun || 1 ) );
			const p = new THREE.Vector3().setFromMatrixPosition( o.matrixWorld ), t = new THREE.Vector3().setFromMatrixPosition( o.target.matrixWorld );
			l.position.copy( p ); l.target.position.copy( t ); out.add( l ); out.add( l.target ); l.updateMatrixWorld(); l.target.updateMatrixWorld();
			return;
		}
		if ( ! o.isMesh || o.isInstancedMesh || ! vis( o ) || ! o.geometry || ! o.geometry.attributes || ! o.geometry.attributes.position ) return;
		const mats = Array.isArray( o.material ) ? o.material : [ o.material ];
		if ( mats.some( m => ! m || m.isMeshBasicMaterial && ( m.transparent || m.color && m.color.r + m.color.g + m.color.b < 0.05 ) ) ) return; // ombres et occlusions peintes
		if ( mats.some( m => m.isMeshBasicMaterial && opts.skipBasic ) ) return;
		const conv = mats.map( m => m.isMeshBasicMaterial ? new THREE.MeshBasicMaterial( { color: new THREE.Color( m.color.r, m.color.g, m.color.b ) } ) : convMat( m ) );
		const mesh = new THREE.Mesh( convGeo( o.geometry ), Array.isArray( o.material ) ? conv : conv[ 0 ] );
		mesh.matrixAutoUpdate = false;
		mesh.matrix.fromArray( o.matrixWorld.elements );
		mesh.matrixWorld.copy( mesh.matrix );
		out.add( mesh );
	} );
	return out;
}

// ciel HDR : on vérifie d'abord que le fichier en est bien un (certains serveurs renvoient une page à la place d'un fichier absent)
async function loadHDR( url ) {
	const r = await fetch( url );
	if ( ! r.ok ) throw new Error( 'hdr' );
	const b = await r.arrayBuffer();
	const head = new TextDecoder().decode( new Uint8Array( b, 0, Math.min( 10, b.byteLength ) ) );
	if ( ! head.startsWith( '#?' ) ) throw new Error( 'hdr' );
	const d = new HDRLoader().setDataType( THREE.HalfFloatType ).parse( b );
	if ( ! d || ! d.data || ! d.width ) throw new Error( 'hdr' );
	const t = new THREE.DataTexture( d.data, d.width, d.height, THREE.RGBAFormat, d.type );
	t.colorSpace = THREE.LinearSRGBColorSpace; t.minFilter = THREE.LinearFilter; t.magFilter = THREE.LinearFilter; t.generateMipmaps = false; t.flipY = true; t.needsUpdate = true;
	return t;
}

// ciel en JPG : converti en données linéaires (le lancer de rayons échantillonne le ciel à partir de ses pixels)
async function loadSkyJpg( url ) {
	const img = await new Promise( ( ok, ko ) => { const i = new Image(); i.onload = () => ok( i ); i.onerror = ko; i.src = url; } );
	const w = Math.min( 1024, img.naturalWidth ), h = Math.round( w * img.naturalHeight / img.naturalWidth );
	const c = document.createElement( 'canvas' ); c.width = w; c.height = h;
	const x = c.getContext( '2d' ); x.drawImage( img, 0, 0, w, h );
	const p = x.getImageData( 0, 0, w, h ).data, out = new Uint16Array( w * h * 4 ), lin = v => { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow( ( v + 0.055 ) / 1.055, 2.4 ); };
	for ( let yy = 0; yy < h; yy ++ ) for ( let xx = 0; xx < w; xx ++ ) {
		const i = ( yy * w + xx ) * 4, j = i; // même orientation qu'un ciel HDR (lignes de haut en bas, flipY)
		for ( let k = 0; k < 3; k ++ ) out[ j + k ] = THREE.DataUtils.toHalfFloat( lin( p[ i + k ] ) * 1.35 ); // un JPG plafonne la lumière : on la remonte un peu
		out[ j + 3 ] = THREE.DataUtils.toHalfFloat( 1 );
	}
	const t = new THREE.DataTexture( out, w, h, THREE.RGBAFormat, THREE.HalfFloatType );
	t.colorSpace = THREE.LinearSRGBColorSpace; t.minFilter = THREE.LinearFilter; t.magFilter = THREE.LinearFilter; t.generateMipmaps = false; t.flipY = true; t.needsUpdate = true;
	return t;
}

let job = null, eng = null;
export function stop() { if ( job ) job.stop = true; }
// moteur gardé d'un rendu à l'autre : le shader (long à compiler sur téléphone) ne l'est qu'une fois
function engine( canvas, o ) {
	if ( eng && ( eng.canvas !== canvas || eng.renderer.getContext().isContextLost() ) ) { try { eng.dq.material.dispose(); eng.pt.dispose(); eng.renderer.dispose(); } catch ( e ) {} eng = null; }
	if ( eng ) return eng;
	const renderer = new THREE.WebGLRenderer( { canvas, antialias: false, preserveDrawingBuffer: true, powerPreference: 'high-performance' } );
	renderer.setPixelRatio( 1 );
	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.outputColorSpace = THREE.SRGBColorSpace;
	const pt = new WebGLPathTracer( renderer );
	// réglages du shader fixés d'avance (tirage PCG, sans flou de mise au point ni brouillard, ciel en fond) : une seule compilation au lieu de quatre
	Object.assign( pt._pathTracer.material.defines, { RANDOM_TYPE: 0, FEATURE_DOF: 0, FEATURE_FOG: 0, FEATURE_BACKGROUND_MAP: 1 } );
	pt.filterGlossyFactor = 0.5;
	pt.minSamples = 1;
	pt.renderScale = 1;
	pt.renderDelay = 0;
	pt.fadeDuration = 0;
	pt.rasterizeScene = false; // pas d'image intermédiaire en rendu classique (elle compilerait d'autres shaders)
	const n = o.mobile ? 512 : 1024;
	pt.textureSize.set( n, n );
	// débruitage doux (filtre qui respecte les arêtes), de moins en moins fort à mesure que l'image converge ; dessiné au plus 4 fois par seconde
	const dq = new FullScreenQuad( new DenoiseMaterial( { map: null, blending: THREE.NoBlending, premultipliedAlpha: renderer.getContextAttributes().premultipliedAlpha } ) );
	eng = { canvas, renderer, pt, dq, dn: [ 1.2, 0.035 ], draw: false, env: null, envUrl: '', scene: null, compiled: false };
	pt.renderToCanvasCallback = ( target, r, quad ) => {
		if ( ! eng.draw ) return;
		eng.draw = false;
		const m = dq.material, s = pt.samples;
		m.map = quad.material.map; m.sigma = Math.max( eng.dn[ 0 ], 5.5 - s / 40 ); m.threshold = Math.min( 0.2, Math.max( eng.dn[ 1 ], 0.3 / Math.sqrt( s ) ) ); m.kSigma = 1;
		const ac = r.autoClear; r.autoClear = false; dq.render( r ); r.autoClear = ac;
	};
	return eng;
}
function freeScene( sc ) { if ( sc ) sc.traverse( x => { if ( x.geometry ) x.geometry.dispose(); } ); }
async function sky( E, url ) {
	if ( E.env && E.envUrl === url ) return E.env;
	let env = null;
	try { env = await loadHDR( url + '.hdr' ); } catch ( e ) { env = null; }
	if ( ! env ) { try { env = await loadSkyJpg( url + '.jpg' ); } catch ( e ) { env = null; } }
	if ( env ) { env.mapping = THREE.EquirectangularReflectionMapping; if ( E.env ) E.env.dispose(); E.env = env; E.envUrl = url; }
	return env;
}
/* o : scene (three r128), canvas, w, h, cam, env (adresse du ciel sans extension), exposure, lights, bounces, tBounces,
   samples (objectif), budget (ms de calcul au plus après la première passe), mobile, preview (image affichée pendant la préparation), onProgress(n, objectif, ms, part), onStage(étape, ms) pour mesurer */
export async function casoPhoto( o ) {
	stop();
	const me = { stop: false };
	job = me;
	OPT = o; texCache.clear(); matCache.clear(); geoCache.clear();
	const { canvas, w, h } = o, st = o.onStage || ( () => {} ), t00 = performance.now();
	const E = engine( canvas, o ), { renderer, pt } = E;
	st( 'engine', performance.now() - t00 );
	renderer.setSize( w, h, false );
	renderer.toneMappingExposure = o.exposure || 1;
	E.dn = o.denoise || [ 1.2, 0.035 ]; // débruitage le plus faible atteint en fin de calcul (rayon, seuil)
	// aperçu immédiat : la vue 3D habituelle, remplacée par l'image calculée dès qu'elle est prête
	if ( o.preview ) {
		try {
			const tx = new THREE.CanvasTexture( o.preview ); tx.colorSpace = THREE.SRGBColorSpace;
			const q = new FullScreenQuad( new THREE.MeshBasicMaterial( { map: tx, toneMapped: false } ) );
			const ac = renderer.autoClear; renderer.setRenderTarget( null ); renderer.autoClear = false; q.render( renderer ); renderer.autoClear = ac;
			q.material.dispose(); q.dispose(); tx.dispose();
		} catch ( e ) {}
	}
	st( 'preview', performance.now() - t00 );
	const scene = convScene( o.scene, o );
	st( 'conv ' + texCache.size + ' tex ' + matCache.size + ' mat', performance.now() - t00 );
	const cam = new THREE.PerspectiveCamera( o.cam.fov, w / h, o.cam.near, o.cam.far );
	cam.position.fromArray( o.cam.p );
	cam.quaternion.fromArray( o.cam.q );
	cam.updateMatrixWorld();
	const env = await sky( E, o.env );
	if ( me.stop ) { freeScene( scene ); return { samples: 0, url: null }; }
	if ( env ) { scene.environment = env; scene.background = env; scene.environmentIntensity = o.envIntensity || 1; scene.backgroundIntensity = o.envIntensity || 1; }
	if ( o.envRotation ) { scene.environmentRotation.y = o.envRotation; scene.backgroundRotation.y = o.envRotation; }
	// éclairage d'intérieur : panneaux doux au plafond de chaque pièce (comme un photographe d'architecture)
	for ( const l of o.lights || [] ) {
		const a = new THREE.RectAreaLight( 0xfff0dc, l.i, l.w, l.d );
		a.position.set( l.x, l.y, l.z );
		a.lookAt( l.x, l.y - 1, l.z );
		a.updateMatrixWorld();
		scene.add( a );
	}
	pt.bounces = o.bounces || 4;
	pt.transmissiveBounces = o.tBounces || 4;
	const tl = o.tiles || ( o.mobile ? 2 : 1 );
	pt.tiles.set( tl, tl );
	const mm = pt._pathTracer.material;
	pt.setScene( scene, cam );
	freeScene( E.scene ); E.scene = scene;
	for ( const t of texCache.values() ) t.dispose(); // déjà recopiées dans la texture du lancer de rayons
	st( 'setScene', performance.now() - t00 );
	if ( ! E.compiled ) { E.compiled = true; mm.defines.FEATURE_BACKGROUND_MAP = env ? 1 : 0; mm.needsUpdate = true; } // compilation unique, en tâche de fond quand le navigateur le permet
	else mm.setDefine( 'FEATURE_BACKGROUND_MAP', env ? 1 : 0 );
	const max = o.samples || 200, budget = o.budget || 30000, per0 = tl * tl;
	// cadence réglée sur l'appareil : plus de calcul par image tant que les images restent rapides (moins de 20 ms d'écart),
	// moins dès qu'elles ralentissent. L'interface reste fluide et le travail ne s'accumule pas sur la carte graphique.
	const cap = ( o.mobile ? 2 : 8 ) * per0;
	let tF = 0, per = 1, lastDraw = 0, tPrev = 0;
	await new Promise( res => {
		const end = () => { if ( job === me && tF ) { E.draw = true; pt.pausePathTracing = true; try { pt.renderSample(); } catch ( e ) {} pt.pausePathTracing = false; E.draw = false; } res(); };
		const loop = now => {
			if ( me.stop ) return end();
			if ( tF && tPrev ) { const dt = now - tPrev; if ( dt > 80 ) per = Math.max( 1, per >> 1 ); else if ( dt > 40 ) per = Math.max( 1, per - 1 ); else if ( dt < 20 ) per = Math.min( cap, per + 1 ); }
			tPrev = now;
			for ( let i = 0; i < per; i ++ ) {
				const s0 = pt.samples;
				if ( ! tF && Math.floor( s0 ) >= 1 ) { tF = performance.now(); st( 'firstSample', tF - t00 ); }
				if ( i === per - 1 && tF && performance.now() - lastDraw > 250 && Math.floor( s0 ) >= 2 ) { E.draw = true; lastDraw = performance.now(); }
				pt.renderSample();
				E.draw = false;
			}
			const n = Math.floor( pt.samples ), ms = tF ? performance.now() - tF : 0;
			if ( o.onProgress ) o.onProgress( n, max, ms, Math.min( 1, Math.max( n / max, ms / budget ) ) );
			if ( n >= max || tF && ms >= budget ) { st( 'end ' + n + ' per ' + per, performance.now() - t00 ); return end(); }
			requestAnimationFrame( loop );
		};
		requestAnimationFrame( loop );
	} );
	const out = { samples: pt.samples, url: me.stop && ! o.keepOnStop ? null : canvas.toDataURL( 'image/jpeg', 0.92 ) };
	return out;
}

// redessine la dernière image avec un autre débruitage (réglages)
export function redraw( dn ) { if ( ! eng ) return null; eng.dn = dn; eng.draw = true; eng.pt.pausePathTracing = true; eng.pt.renderSample(); eng.pt.pausePathTracing = false; eng.draw = false; return eng.canvas.toDataURL( 'image/jpeg', 0.92 ); }

// chargement par simple balise <script> (sans module) : utilisable partout
if ( typeof window !== "undefined" ) window.CasoPhoto = { casoPhoto, stop, redraw };
