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

let job = null;
export function stop() { if ( job ) job.stop = true; }
export async function casoPhoto( o ) {
	stop();
	const me = { stop: false };
	job = me;
	OPT = o; texCache.clear(); matCache.clear(); geoCache.clear();
	const { canvas, w, h } = o;
	const renderer = new THREE.WebGLRenderer( { canvas, antialias: false, preserveDrawingBuffer: true, powerPreference: 'high-performance' } );
	renderer.setPixelRatio( 1 );
	renderer.setSize( w, h, false );
	renderer.toneMapping = THREE.ACESFilmicToneMapping;
	renderer.toneMappingExposure = o.exposure || 1;
	renderer.outputColorSpace = THREE.SRGBColorSpace;
	const scene = convScene( o.scene, o );
	const cam = new THREE.PerspectiveCamera( o.cam.fov, w / h, o.cam.near, o.cam.far );
	cam.position.fromArray( o.cam.p );
	cam.quaternion.fromArray( o.cam.q );
	cam.updateMatrixWorld();
	let env = null;
	try { env = await new HDRLoader().setDataType( THREE.HalfFloatType ).loadAsync( o.env + '.hdr' ); } catch ( e ) { env = null; }
	if ( ! env ) { try { env = await new THREE.TextureLoader().loadAsync( o.env + '.jpg' ); env.colorSpace = THREE.SRGBColorSpace; } catch ( e ) { env = null; } }
	if ( env ) { env.mapping = THREE.EquirectangularReflectionMapping; scene.environment = env; scene.background = env; scene.environmentIntensity = o.envIntensity || 1; scene.backgroundIntensity = o.envIntensity || 1; }
	if ( o.envRotation ) { scene.environmentRotation.y = o.envRotation; scene.backgroundRotation.y = o.envRotation; }
	// éclairage d'intérieur : panneaux doux au plafond de chaque pièce (comme un photographe d'architecture)
	for ( const l of o.lights || [] ) {
		const a = new THREE.RectAreaLight( 0xfff0dc, l.i, l.w, l.d );
		a.position.set( l.x, l.y, l.z );
		a.lookAt( l.x, l.y - 1, l.z );
		a.updateMatrixWorld();
		scene.add( a );
	}
	const pt = new WebGLPathTracer( renderer );
	pt.bounces = o.bounces || 6;
	pt.transmissiveBounces = 6;
	pt.filterGlossyFactor = 0.5;
	pt.minSamples = 1;
	pt.renderScale = 1;
	pt.tiles.set( o.tiles || 2, o.tiles || 2 );
	pt.renderDelay = 0;
	pt.fadeDuration = 0;
	// débruitage doux (filtre qui respecte les arêtes), de moins en moins fort à mesure que l'image converge
	const dq = new FullScreenQuad( new DenoiseMaterial( { map: null, blending: THREE.NoBlending, premultipliedAlpha: renderer.getContextAttributes().premultipliedAlpha } ) );
	if ( ! o.noDenoise ) pt.renderToCanvasCallback = ( target, r, quad ) => {
		const m = dq.material, n = pt.samples;
		m.map = quad.material.map; m.sigma = Math.max( 1.2, 5.5 - n / 40 ); m.threshold = n < 30 ? 0.08 : 0.04; m.kSigma = 1;
		const ac = r.autoClear; r.autoClear = false; dq.render( r ); r.autoClear = ac;
	};
	pt.setScene( scene, cam );
	if ( o.pcg !== false ) { const mm = pt._pathTracer.material; if ( mm.setDefine ) mm.setDefine( 'RANDOM_TYPE', 0 ); else { mm.defines.RANDOM_TYPE = 0; mm.needsUpdate = true; } }
	const max = o.samples || 300, t0 = performance.now();
	await new Promise( res => {
		const loop = () => {
			if ( me.stop ) return res();
			pt.renderSample();
			if ( o.onProgress ) o.onProgress( Math.floor( pt.samples ), max, performance.now() - t0 );
			if ( pt.samples >= max ) return res();
			requestAnimationFrame( loop );
		};
		loop();
	} );
	const out = { samples: pt.samples, url: me.stop && ! o.keepOnStop ? null : canvas.toDataURL( 'image/jpeg', 0.92 ) };
	if ( o.dispose !== false ) { dq.material.dispose(); pt.dispose(); renderer.dispose(); scene.traverse( x => { if ( x.geometry ) x.geometry.dispose(); } ); if ( env ) env.dispose(); }
	return out;
}

// chargement par simple balise <script> (sans module) : utilisable partout
if ( typeof window !== "undefined" ) window.CasoPhoto = { casoPhoto, stop };
