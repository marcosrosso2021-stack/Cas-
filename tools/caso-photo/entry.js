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
// matières « photo » : vernis des parquets et laques, émail des sanitaires, feuilles cirées (le velours a été essayé : il scintille aux faibles nombres de passes) (selon le nom donné par le module 3D)
const FABRIC = /^(fabric|linen|duvet|uph|towel|accent)$/, SATIN = /^(lacq|front|doorInt|doorPan|trim|plinth)$/;
function enrich( o, name, hint ) {
	if ( FABRIC.test( name ) ) { o.roughness = 1; }
	else if ( SATIN.test( name ) ) { o.clearcoat = 0.35; o.clearcoatRoughness = 0.22; }
	else if ( name === 'cer' || name === 'screen' ) { o.clearcoat = 1; o.clearcoatRoughness = 0.04; }
	else if ( name === 'top' ) { o.clearcoat = 0.6; o.clearcoatRoughness = 0.15; }
	else if ( name === 'wood' || name === 'woodD' ) { o.clearcoat = 0.18; o.clearcoatRoughness = 0.35; }
	else if ( name === 'leaf' || name === 'leaf2' ) { o.roughness = 0.55; }
	else if ( hint && hint.floor && o.roughness <= 0.62 ) { o.clearcoat = 0.4; o.clearcoatRoughness = 0.16; } // parquet vitrifié, carrelage : les fenêtres s'y reflètent
}
function convMat( m, hint ) {
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
	if ( ! OPT.plain ) enrich( o, m.name || '', hint );
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
// plans de coupe (plafonds en pente) : le lancer de rayons ne les connaît pas, les triangles sont découpés ici, en coordonnées du monde
function clipGeo( g, mw, planes ) {
	const P = g.attributes.position, N = g.attributes.normal, U = g.attributes.uv, idx = g.index ? g.index.array : null;
	const m = new THREE.Matrix4().fromArray( mw.elements ), nm = new THREE.Matrix3().getNormalMatrix( m ), v = new THREE.Vector3(), n = new THREE.Vector3();
	const pl = planes.map( p => [ p.normal.x, p.normal.y, p.normal.z, p.constant ] );
	const groups = g.groups && g.groups.length ? g.groups : [ { start: 0, count: idx ? idx.length : P.count, materialIndex: 0 } ];
	const op = [], on = [], ou = [], og = [];
	const vert = i => { v.fromBufferAttribute( P, i ).applyMatrix4( m ); const o = { p: [ v.x, v.y, v.z ] }; if ( N ) { n.fromBufferAttribute( N, i ).applyMatrix3( nm ).normalize(); o.n = [ n.x, n.y, n.z ]; } if ( U ) o.u = [ U.getX( i ), U.getY( i ) ]; return o; };
	const mix = ( a, b, t ) => { const o = { p: a.p.map( ( x, k ) => x + ( b.p[ k ] - x ) * t ) }; if ( a.n ) o.n = a.n.map( ( x, k ) => x + ( b.n[ k ] - x ) * t ); if ( a.u ) o.u = a.u.map( ( x, k ) => x + ( b.u[ k ] - x ) * t ); return o; };
	for ( const gr of groups ) {
		const s0 = op.length / 3, end = Math.min( gr.start + gr.count, idx ? idx.length : P.count );
		for ( let t = gr.start; t + 2 < end; t += 3 ) {
			let poly = [ 0, 1, 2 ].map( k => vert( idx ? idx[ t + k ] : t + k ) );
			for ( const q of pl ) {
				const d = poly.map( x => q[ 0 ] * x.p[ 0 ] + q[ 1 ] * x.p[ 1 ] + q[ 2 ] * x.p[ 2 ] + q[ 3 ] );
				if ( d.every( x => x >= 0 ) ) continue;
				if ( d.every( x => x < 0 ) ) { poly = []; break; }
				const out = [];
				for ( let i = 0; i < poly.length; i ++ ) { const j = ( i + 1 ) % poly.length; if ( d[ i ] >= 0 ) out.push( poly[ i ] ); if ( ( d[ i ] >= 0 ) !== ( d[ j ] >= 0 ) ) out.push( mix( poly[ i ], poly[ j ], d[ i ] / ( d[ i ] - d[ j ] ) ) ); }
				poly = out;
				if ( poly.length < 3 ) { poly = []; break; }
			}
			for ( let i = 1; i + 1 < poly.length; i ++ ) for ( const x of [ poly[ 0 ], poly[ i ], poly[ i + 1 ] ] ) { op.push( ...x.p ); if ( N ) on.push( ...x.n ); if ( U ) ou.push( ...x.u ); }
		}
		og.push( { start: s0, count: op.length / 3 - s0, materialIndex: gr.materialIndex } );
	}
	const o = new THREE.BufferGeometry();
	o.setAttribute( 'position', new THREE.Float32BufferAttribute( op, 3 ) );
	if ( N ) o.setAttribute( 'normal', new THREE.Float32BufferAttribute( on, 3 ) );
	if ( U ) o.setAttribute( 'uv', new THREE.Float32BufferAttribute( ou, 2 ) );
	if ( g.groups && g.groups.length ) for ( const x of og ) o.addGroup( x.start, x.count, x.materialIndex );
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
		const conv = mats.map( m => m.isMeshBasicMaterial ? new THREE.MeshBasicMaterial( { color: new THREE.Color( m.color.r, m.color.g, m.color.b ) } ) : convMat( m, o.userData ) );
		const cp = mats.find( m => m.clippingPlanes && m.clippingPlanes.length ), geo = cp ? clipGeo( o.geometry, o.matrixWorld, cp.clippingPlanes ) : convGeo( o.geometry );
		if ( ! geo.attributes.position.count ) return;
		const mesh = new THREE.Mesh( geo, Array.isArray( o.material ) ? conv : conv[ 0 ] );
		mesh.matrixAutoUpdate = false;
		if ( ! cp ) mesh.matrix.fromArray( o.matrixWorld.elements );
		mesh.matrixWorld.copy( mesh.matrix );
		out.add( mesh );
	} );
	return out;
}

// sous l'horizon, le ciel fourni montre une mer qui reflète le soleil : cette lumière venue d'en bas éclairait les plafonds
// à travers les fenêtres. On la remplace par un sol uni, éclairé par le ciel (données en demi-flottants, lignes de haut en bas).
function groundHalf( data, w, h ) {
	const H = THREE.DataUtils, half = h >> 1, fade = Math.max( 2, h >> 6 );
	let r = 0, g = 0, b = 0, n = 0;
	for ( let y = 0; y < half; y += 2 ) { const wgt = Math.sin( ( y + 0.5 ) / h * Math.PI ); for ( let x = 0; x < w; x += 2 ) { const i = ( y * w + x ) * 4; r += H.fromHalfFloat( data[ i ] ) * wgt; g += H.fromHalfFloat( data[ i + 1 ] ) * wgt; b += H.fromHalfFloat( data[ i + 2 ] ) * wgt; n += wgt; } }
	const k = 0.22 / n, gr = [ r * k * 0.95, g * k, b * k * 0.8 ].map( v => H.toHalfFloat( v ) ); // sol clair (albédo ~0,22), légèrement chaud
	for ( let y = half; y < h; y ++ ) {
		const t = Math.min( 1, ( y - half + 1 ) / fade );
		for ( let x = 0; x < w; x ++ ) { const i = ( y * w + x ) * 4; for ( let c = 0; c < 3; c ++ ) data[ i + c ] = t >= 1 ? gr[ c ] : H.toHalfFloat( H.fromHalfFloat( data[ i + c ] ) * ( 1 - t ) + H.fromHalfFloat( gr[ c ] ) * t ); }
	}
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
	groundHalf( d.data, d.width, d.height );
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
	groundHalf( out, w, h );
	const t = new THREE.DataTexture( out, w, h, THREE.RGBAFormat, THREE.HalfFloatType );
	t.colorSpace = THREE.LinearSRGBColorSpace; t.minFilter = THREE.LinearFilter; t.magFilter = THREE.LinearFilter; t.generateMipmaps = false; t.flipY = true; t.needsUpdate = true;
	return t;
}

let job = null, eng = null;
// développement « photo » de l'image calculée : halo autour des zones très claires (fenêtres, lampes), balance des blancs,
// courbe de tons, léger vignetage et grain fin, comme un appareil photo
const POST = {
	uniforms: { map: { value: null }, px: { value: new THREE.Vector2() }, bloom: { value: 0.3 }, thr: { value: 1 }, vig: { value: 0.22 }, grain: { value: 0.016 }, wb: { value: new THREE.Vector3( 1, 1, 1 ) } },
	vertexShader: 'varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4( position.xy, 0.0, 1.0 ); }',
	fragmentShader: `
		uniform sampler2D map; uniform vec2 px; uniform float bloom, thr, vig, grain; uniform vec3 wb; varying vec2 vUv;
		vec3 hi( vec2 uv ) { vec3 c = texture2D( map, clamp( uv, 0.0, 1.0 ) ).rgb; float l = max( max( c.r, c.g ), c.b ); return c * max( l - thr, 0.0 ) / max( l, 1e-4 ); }
		float hash( vec2 p ) { return fract( sin( dot( p, vec2( 12.9898, 78.233 ) ) ) * 43758.5453 ); }
		void main() {
			vec3 c = texture2D( map, vUv ).rgb, b = vec3( 0.0 );
			for ( int i = 0; i < 12; i ++ ) {
				float a = float( i ) * 0.5236 + 0.26; vec2 d = vec2( cos( a ), sin( a ) );
				b += hi( vUv + d * px * 5.0 ) * 0.5 + hi( vUv + d * px * 16.0 ) * 0.3 + hi( vUv + d * px * 42.0 ) * 0.2;
			}
			c = ( c + b / 12.0 * bloom ) * wb;
			gl_FragColor = vec4( c, 1.0 );
			#include <tonemapping_fragment>
			#include <colorspace_fragment>
			vec2 q = vUv - 0.5;
			gl_FragColor.rgb *= 1.0 - vig * smoothstep( 0.1, 0.75, dot( q, q ) * 2.0 );
			gl_FragColor.rgb += ( hash( floor( vUv / px ) ) - 0.5 ) * grain;
		}`,
};
const TM = { aces: THREE.ACESFilmicToneMapping, agx: THREE.AgXToneMapping, neutral: THREE.NeutralToneMapping };
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
	const rt = new THREE.WebGLRenderTarget( 1, 1, { type: THREE.HalfFloatType, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, depthBuffer: false } );
	const pq = new FullScreenQuad( new THREE.ShaderMaterial( { ...POST, uniforms: THREE.UniformsUtils.clone( POST.uniforms ), depthTest: false, depthWrite: false } ) );
	eng = { canvas, renderer, pt, dq, rt, pq, dn: [ 1.2, 0.035 ], look: {}, draw: false, env: null, envUrl: '', scene: null, compiled: false };
	pt.renderToCanvasCallback = ( target, r, quad ) => {
		if ( ! eng.draw ) return;
		eng.draw = false;
		const m = dq.material, s = pt.samples;
		m.map = quad.material.map; m.sigma = Math.max( eng.dn[ 0 ], 5.5 - s / 40 ); m.threshold = Math.min( 0.2, Math.max( eng.dn[ 1 ], 0.3 / Math.sqrt( s ) ) ); m.kSigma = 1;
		const ac = r.autoClear, prev = r.getRenderTarget(), L = eng.look, u = pq.material.uniforms;
		if ( L.off ) { r.autoClear = false; dq.render( r ); r.autoClear = ac; return; }
		r.setRenderTarget( rt ); dq.render( r ); r.setRenderTarget( prev );
		u.map.value = rt.texture; u.px.value.set( 1 / rt.width, 1 / rt.height );
		u.bloom.value = L.bloom ?? 0.3; u.thr.value = ( L.thr ?? 0.9 ) / r.toneMappingExposure; u.vig.value = L.vig ?? 0.22; u.grain.value = L.grain ?? 0.016;
		u.wb.value.fromArray( L.wb || [ 1, 1, 1 ] );
		r.autoClear = false; pq.render( r ); r.autoClear = ac;
	};
	return eng;
}
function setTone( E ) { const t = TM[ E.look.tm ] || THREE.ACESFilmicToneMapping; if ( E.renderer.toneMapping !== t ) { E.renderer.toneMapping = t; E.pq.material.needsUpdate = true; E.dq.material.needsUpdate = true; } }
// « toucher » la toile à chaque image (effacement d'une zone vide) : le navigateur doit alors l'afficher et attend que la carte
// graphique ait fini le travail en cours avant l'image suivante. Sans cela, les calculs hors écran s'empilent sans freiner la boucle.
function present( r ) { const p = r.getRenderTarget(); r.setRenderTarget( null ); r.setScissorTest( true ); r.setScissor( 0, 0, 0, 0 ); r.clear( true, false, false ); r.setScissorTest( false ); r.setRenderTarget( p ); }
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
	E.look = o.look || {}; // développement : bloom, thr, vig, grain, wb [r, v, b], tm ('aces', 'agx', 'neutral'), off
	setTone( E );
	E.rt.setSize( w, h );	// aperçu immédiat : la vue 3D habituelle, floue et assombrie (pour ne pas la prendre pour le résultat), remplacée par l'image calculée dès qu'elle est prête
	if ( o.preview ) {
		try {
			const tx = new THREE.CanvasTexture( o.preview ); tx.colorSpace = THREE.SRGBColorSpace;
			const q = new FullScreenQuad( new THREE.MeshBasicMaterial( { map: tx, toneMapped: false, color: new THREE.Color( 0.4, 0.4, 0.4 ) } ) );
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
			present( renderer );
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
export function redraw( dn, look, exposure ) { if ( ! eng ) return null; if ( dn ) eng.dn = dn; if ( look ) { eng.look = look; setTone( eng ); } if ( exposure ) eng.renderer.toneMappingExposure = exposure; eng.draw = true; eng.pt.pausePathTracing = true; eng.pt.renderSample(); eng.pt.pausePathTracing = false; eng.draw = false; return eng.canvas.toDataURL( 'image/jpeg', 0.92 ); }

// chargement par simple balise <script> (sans module) : utilisable partout
if ( typeof window !== "undefined" ) window.CasoPhoto = { casoPhoto, stop, redraw };
