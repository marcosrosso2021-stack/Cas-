(()=>{var{defineProperty:Lo,getOwnPropertyNames:dm,getOwnPropertyDescriptor:pm}=Object,mm=Object.prototype.hasOwnProperty;function gm(e){return this[e]}var xm=(e)=>{var t=(Yu??=new WeakMap).get(e),n;if(t)return t;if(t=Lo({},"__esModule",{value:!0}),e&&typeof e==="object"||typeof e==="function"){for(var i of dm(e))if(!mm.call(t,i))Lo(t,i,{get:gm.bind(e,i),enumerable:!(n=pm(e,i))||n.enumerable})}return Yu.set(e,t),t},Yu;var _m=(e)=>e;function vm(e,t){this[e]=_m.bind(null,t)}var ym=(e,t)=>{for(var n in t)Lo(e,n,{get:t[n],enumerable:!0,configurable:!0,set:vm.bind(t,n)})};var uS={};ym(uS,{casoPhoto:()=>am,redraw:()=>om,stop:()=>Uu});var tr="187";var vh=0,sl=1,yh=2;var nr=1,Sh=2,bs=3,Tn=0,Ut=1,rn=2,Ot=0,ri=1,ir=2,rl=3,al=4,Mh=5;var Ts=100,bh=101,Th=102,wh=103,Ah=104,Eh=200,Rh=201,Ch=202,Ih=203,Ph=204,Dh=205,Lh=206,Fh=207,Nh=208,Uh=209,Oh=210,Bh=211,zh=212,kh=213,Hh=214,Gh=0,Wh=1,Vh=2,ol=3,Xh=4,qh=5,Yh=6,Zh=7,$h=0,Jh=1,Kh=2,En=0,ll=1,cl=2,ul=3,Oi=4,hl=5,sr=6,rr=7;var ar=301,ws=302,Gn=303,la=304,Kt=1000,Bt=1001,or=1002,qe=1003,Qh=1004;var lr=1005;var Ye=1006,ca=1007;var xi=1008,fl=1008,an=1009,cr=1010,ua=1011,Bi=1012,zi=1013,fn=1014,Ve=1015,et=1016,dl=1017,pl=1018,ki=1020,jh=35902,ef=35899,tf=1021,nf=1022,ke=1023,As=1026,_i=1027,ai=1028,ur=1029,Un=1030,Hi=1031;var Gi=1033,ha=33776,fa=33777,da=33778,pa=33779,ml=35840,gl=35841,xl=35842,_l=35843,vl=36196,yl=37492,Sl=37496,Ml=37488,bl=37489,ma=37490,Tl=37491,wl=37808,Al=37809,El=37810,Rl=37811,Cl=37812,Il=37813,Pl=37814,Dl=37815,Ll=37816,Fl=37817,Nl=37818,Ul=37819,Ol=37820,Bl=37821,zl=36492,kl=36494,Hl=36495,Gl=36283,Wl=36284,ga=36285,Vl=36286;var Xl=0,sf=1,oi="",Es="srgb",vi="srgb-linear",ql="linear",xt="srgb";var rf=512,af=513,of=514,Yl=515,lf=516,cf=517,Zl=518,$l=519;var Jl="300 es",Kl=2000;function Sm(e){for(let t=e.length-1;t>=0;--t)if(e[t]>=65535)return!0;return!1}function Mm(e){return ArrayBuffer.isView(e)&&!(e instanceof DataView)}function er(e){return document.createElementNS("http://www.w3.org/1999/xhtml",e)}function uf(){let e=er("canvas");return e.style.display="block",e}var Zu={},Ms=null;function Ql(...e){let t="THREE."+e.shift();if(Ms)Ms("log",t,...e);else console.log(t,...e)}function hf(e){let t=e[0];if(typeof t==="string"&&t.startsWith("TSL:")){let n=e[1];if(n&&n.isStackTrace)e[0]+=" "+n.getLocation();else e[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return e}function De(...e){e=hf(e);let t="THREE."+e.shift();if(Ms)Ms("warn",t,...e);else{let n=e[0];if(n&&n.isStackTrace)console.warn(n.getError(t));else console.warn(t,...e)}}function Ne(...e){e=hf(e);let t="THREE."+e.shift();if(Ms)Ms("error",t,...e);else{let n=e[0];if(n&&n.isStackTrace)console.error(n.getError(t));else console.error(t,...e)}}function Ni(...e){let t=e.join(" ");if(t in Zu)return;Zu[t]=!0,De(...e)}function ff(e,t,n){return new Promise(function(i,s){function r(){switch(e.clientWaitSync(t,e.SYNC_FLUSH_COMMANDS_BIT,0)){case e.WAIT_FAILED:s();break;case e.TIMEOUT_EXPIRED:setTimeout(r,n);break;default:i()}}setTimeout(r,n)})}var df={[0]:0,[2]:6,[4]:4,[3]:5,[1]:1,[6]:2,[7]:7,[5]:3};class li{addEventListener(e,t){if(this._listeners===void 0)this._listeners={};let n=this._listeners;if(n[e]===void 0)n[e]=[];if(n[e].indexOf(t)===-1)n[e].push(t)}hasEventListener(e,t){let n=this._listeners;if(n===void 0)return!1;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let i=n[e];if(i!==void 0){let s=i.indexOf(t);if(s!==-1)i.splice(s,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let i=n.slice(0);for(let s=0,r=i.length;s<r;s++)i[s].call(this,e);e.target=null}}}var nn=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];var Fo=Math.PI/180,oa=180/Math.PI;function hr(){let e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(nn[e&255]+nn[e>>8&255]+nn[e>>16&255]+nn[e>>24&255]+"-"+nn[t&255]+nn[t>>8&255]+"-"+nn[t>>16&15|64]+nn[t>>24&255]+"-"+nn[n&63|128]+nn[n>>8&255]+"-"+nn[n>>16&255]+nn[n>>24&255]+nn[i&255]+nn[i>>8&255]+nn[i>>16&255]+nn[i>>24&255]).toLowerCase()}function Ue(e,t,n){return Math.max(t,Math.min(n,e))}function bm(e,t){return(e%t+t)%t}function No(e,t,n){return(1-n)*e+n*t}function pf(e){return Math.pow(2,Math.floor(Math.log(e)/Math.LN2))}function jl(e){switch(e.constructor){case Uint32Array:return 4294967295;case Uint16Array:return 65535;case Uint8Array:case Uint8ClampedArray:return 255;case Int32Array:return 2147483647;case Int16Array:return 32767;case Int8Array:return 127;default:return}}function Tm(e,t){if(t.constructor===Float32Array)return e;let n=jl(t);if(n===void 0)throw Error("THREE.MathUtils: Invalid component type.");return Math.max(e/n,-1)}function wm(e,t){if(t.constructor===Float32Array)return e;let n=jl(t);if(n===void 0)throw Error("THREE.MathUtils: Invalid component type.");return Math.round(e*n)}class Te{static{this.prototype.isVector2=!0}constructor(e=0,t=0){this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw Error("THREE.Vector2: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw Error("THREE.Vector2: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Ue(this.x,e.x,t.x),this.y=Ue(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=Ue(this.x,e,t),this.y=Ue(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Ue(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Ue(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),i=Math.sin(t),s=this.x-e.x,r=this.y-e.y;return this.x=s*n-r*i+e.x,this.y=s*i+r*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class On{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,s,r,a){let o=n[i+0],l=n[i+1],u=n[i+2],h=n[i+3],c=s[r+0],f=s[r+1],d=s[r+2],_=s[r+3];if(h!==_||o!==c||l!==f||u!==d){let m=o*c+l*f+u*d+h*_;if(m<0)c=-c,f=-f,d=-d,_=-_,m=-m;let p=1-a;if(m<0.9995){let g=Math.acos(m),v=Math.sin(g);p=Math.sin(p*g)/v,a=Math.sin(a*g)/v,o=o*p+c*a,l=l*p+f*a,u=u*p+d*a,h=h*p+_*a}else{o=o*p+c*a,l=l*p+f*a,u=u*p+d*a,h=h*p+_*a;let g=1/Math.sqrt(o*o+l*l+u*u+h*h);o*=g,l*=g,u*=g,h*=g}}e[t]=o,e[t+1]=l,e[t+2]=u,e[t+3]=h}static multiplyQuaternionsFlat(e,t,n,i,s,r){let a=n[i],o=n[i+1],l=n[i+2],u=n[i+3],h=s[r],c=s[r+1],f=s[r+2],d=s[r+3];return e[t]=a*d+u*h+o*f-l*c,e[t+1]=o*d+u*c+l*h-a*f,e[t+2]=l*d+u*f+a*c-o*h,e[t+3]=u*d-a*h-o*c-l*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let{_x:n,_y:i,_z:s,_order:r}=e,{cos:a,sin:o}=Math,l=a(n/2),u=a(i/2),h=a(s/2),c=o(n/2),f=o(i/2),d=o(s/2);switch(r){case"XYZ":this._x=c*u*h+l*f*d,this._y=l*f*h-c*u*d,this._z=l*u*d+c*f*h,this._w=l*u*h-c*f*d;break;case"YXZ":this._x=c*u*h+l*f*d,this._y=l*f*h-c*u*d,this._z=l*u*d-c*f*h,this._w=l*u*h+c*f*d;break;case"ZXY":this._x=c*u*h-l*f*d,this._y=l*f*h+c*u*d,this._z=l*u*d+c*f*h,this._w=l*u*h-c*f*d;break;case"ZYX":this._x=c*u*h-l*f*d,this._y=l*f*h+c*u*d,this._z=l*u*d-c*f*h,this._w=l*u*h+c*f*d;break;case"YZX":this._x=c*u*h+l*f*d,this._y=l*f*h+c*u*d,this._z=l*u*d-c*f*h,this._w=l*u*h-c*f*d;break;case"XZY":this._x=c*u*h-l*f*d,this._y=l*f*h-c*u*d,this._z=l*u*d+c*f*h,this._w=l*u*h+c*f*d;break;default:De("Quaternion: .setFromEuler() encountered an unknown order: "+r)}if(t===!0)this._onChangeCallback();return this}setFromAxisAngle(e,t){let n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],i=t[4],s=t[8],r=t[1],a=t[5],o=t[9],l=t[2],u=t[6],h=t[10],c=n+a+h;if(c>0){let f=0.5/Math.sqrt(c+1);this._w=0.25/f,this._x=(u-o)*f,this._y=(s-l)*f,this._z=(r-i)*f}else if(n>a&&n>h){let f=2*Math.sqrt(1+n-a-h);this._w=(u-o)/f,this._x=0.25*f,this._y=(i+r)/f,this._z=(s+l)/f}else if(a>h){let f=2*Math.sqrt(1+a-n-h);this._w=(s-l)/f,this._x=(i+r)/f,this._y=0.25*f,this._z=(o+u)/f}else{let f=2*Math.sqrt(1+h-n-a);this._w=(r-i)/f,this._x=(s+l)/f,this._y=(o+u)/f,this._z=0.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;if(n<0.00000001)if(n=0,Math.abs(e.x)>Math.abs(e.z))this._x=-e.y,this._y=e.x,this._z=0,this._w=n;else this._x=0,this._y=-e.z,this._z=e.y,this._w=n;else this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n;return this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Ue(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();if(e===0)this._x=0,this._y=0,this._z=0,this._w=1;else e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e;return this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let{_x:n,_y:i,_z:s,_w:r}=e,{_x:a,_y:o,_z:l,_w:u}=t;return this._x=n*u+r*a+i*l-s*o,this._y=i*u+r*o+s*a-n*l,this._z=s*u+r*l+n*o-i*a,this._w=r*u-n*a-i*o-s*l,this._onChangeCallback(),this}slerp(e,t){let{_x:n,_y:i,_z:s,_w:r}=e,a=this.dot(e);if(a<0)n=-n,i=-i,s=-s,r=-r,a=-a;let o=1-t;if(a<0.9995){let l=Math.acos(a),u=Math.sin(l);o=Math.sin(o*l)/u,t=Math.sin(t*l)/u,this._x=this._x*o+n*t,this._y=this._y*o+i*t,this._z=this._z*o+s*t,this._w=this._w*o+r*t,this._onChangeCallback()}else this._x=this._x*o+n*t,this._y=this._y*o+i*t,this._z=this._z*o+s*t,this._w=this._w*o+r*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(i*Math.sin(e),i*Math.cos(e),s*Math.sin(t),s*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class L{static{this.prototype.isVector3=!0}constructor(e=0,t=0,n=0){this.x=e,this.y=t,this.z=n}set(e,t,n){if(n===void 0)n=this.z;return this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw Error("THREE.Vector3: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw Error("THREE.Vector3: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion($u.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion($u.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,i=this.z,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6]*i,this.y=s[1]*t+s[4]*n+s[7]*i,this.z=s[2]*t+s[5]*n+s[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,i=this.z,s=e.elements,r=1/(s[3]*t+s[7]*n+s[11]*i+s[15]);return this.x=(s[0]*t+s[4]*n+s[8]*i+s[12])*r,this.y=(s[1]*t+s[5]*n+s[9]*i+s[13])*r,this.z=(s[2]*t+s[6]*n+s[10]*i+s[14])*r,this}applyQuaternion(e){let t=this.x,n=this.y,i=this.z,{x:s,y:r,z:a,w:o}=e,l=2*(r*i-a*n),u=2*(a*t-s*i),h=2*(s*n-r*t);return this.x=t+o*l+r*h-a*u,this.y=n+o*u+a*l-s*h,this.z=i+o*h+s*u-r*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,i=this.z,s=e.elements;return this.x=s[0]*t+s[4]*n+s[8]*i,this.y=s[1]*t+s[5]*n+s[9]*i,this.z=s[2]*t+s[6]*n+s[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Ue(this.x,e.x,t.x),this.y=Ue(this.y,e.y,t.y),this.z=Ue(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=Ue(this.x,e,t),this.y=Ue(this.y,e,t),this.z=Ue(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Ue(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let{x:n,y:i,z:s}=e,{x:r,y:a,z:o}=t;return this.x=i*o-s*a,this.y=s*r-n*o,this.z=n*a-i*r,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Uo.copy(this).projectOnVector(e),this.sub(Uo)}reflect(e){return this.sub(Uo.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(Ue(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}var Uo=new L,$u=new On;class Fe{static{this.prototype.isMatrix3=!0}constructor(e,t,n,i,s,r,a,o,l){if(this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0)this.set(e,t,n,i,s,r,a,o,l)}set(e,t,n,i,s,r,a,o,l){let u=this.elements;return u[0]=e,u[1]=i,u[2]=a,u[3]=t,u[4]=s,u[5]=o,u[6]=n,u[7]=r,u[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,i=t.elements,s=this.elements,r=n[0],a=n[3],o=n[6],l=n[1],u=n[4],h=n[7],c=n[2],f=n[5],d=n[8],_=i[0],m=i[3],p=i[6],g=i[1],v=i[4],M=i[7],y=i[2],b=i[5],E=i[8];return s[0]=r*_+a*g+o*y,s[3]=r*m+a*v+o*b,s[6]=r*p+a*M+o*E,s[1]=l*_+u*g+h*y,s[4]=l*m+u*v+h*b,s[7]=l*p+u*M+h*E,s[2]=c*_+f*g+d*y,s[5]=c*m+f*v+d*b,s[8]=c*p+f*M+d*E,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],r=e[4],a=e[5],o=e[6],l=e[7],u=e[8];return t*r*u-t*a*l-n*s*u+n*a*o+i*s*l-i*r*o}invert(){let e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],r=e[4],a=e[5],o=e[6],l=e[7],u=e[8],h=u*r-a*l,c=a*o-u*s,f=l*s-r*o,d=t*h+n*c+i*f;if(d===0)return this.set(0,0,0,0,0,0,0,0,0);let _=1/d;return e[0]=h*_,e[1]=(i*l-u*n)*_,e[2]=(a*n-i*r)*_,e[3]=c*_,e[4]=(u*t-i*o)*_,e[5]=(i*s-a*t)*_,e[6]=f*_,e[7]=(n*o-l*t)*_,e[8]=(r*t-n*s)*_,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,s,r,a){let o=Math.cos(s),l=Math.sin(s);return this.set(n*o,n*l,-n*(o*r+l*a)+r+e,-i*l,i*o,-i*(-l*r+o*a)+a+t,0,0,1),this}scale(e,t){return Ni("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Oo.makeScale(e,t)),this}rotate(e){return Ni("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Oo.makeRotation(-e)),this}translate(e,t){return Ni("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Oo.makeTranslation(e,t)),this}makeTranslation(e,t){if(e.isVector2)this.set(1,0,e.x,0,1,e.y,0,0,1);else this.set(1,0,e,0,1,t,0,0,1);return this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}var Oo=new Fe,Ju=new Fe().set(0.4123908,0.3575843,0.1804808,0.212639,0.7151687,0.0721923,0.0193308,0.1191948,0.9505322),Ku=new Fe().set(3.2409699,-1.5373832,-0.4986108,-0.9692436,1.8759675,0.0415551,0.0556301,-0.203977,1.0569715);function Am(){let e={enabled:!0,workingColorSpace:"srgb-linear",spaces:{},convert:function(s,r,a){if(this.enabled===!1||r===a||!r||!a)return s;if(this.spaces[r].transfer==="srgb")s.r=ii(s.r),s.g=ii(s.g),s.b=ii(s.b);if(this.spaces[r].primaries!==this.spaces[a].primaries)s.applyMatrix3(this.spaces[r].toXYZ),s.applyMatrix3(this.spaces[a].fromXYZ);if(this.spaces[a].transfer==="srgb")s.r=Ss(s.r),s.g=Ss(s.g),s.b=Ss(s.b);return s},workingToColorSpace:function(s,r){return this.convert(s,this.workingColorSpace,r)},colorSpaceToWorking:function(s,r){return this.convert(s,r,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){if(s==="")return"linear";return this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,r=this.workingColorSpace){return s.fromArray(this.spaces[r].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,r,a){return s.copy(this.spaces[a].fromXYZ).multiply(this.spaces[r].toXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace}},t=[0.64,0.33,0.3,0.6,0.15,0.06],n=[0.2126,0.7152,0.0722],i=[0.3127,0.329];return e.define({["srgb-linear"]:{primaries:t,whitePoint:i,transfer:"linear",toXYZ:Ju,fromXYZ:Ku,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:"srgb"},outputColorSpaceConfig:{drawingBufferColorSpace:"srgb"}},["srgb"]:{primaries:t,whitePoint:i,transfer:"srgb",toXYZ:Ju,fromXYZ:Ku,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:"srgb"}}}),e}var Xe=Am();function ii(e){return e<0.04045?e*0.0773993808:Math.pow(e*0.9478672986+0.0521327014,2.4)}function Ss(e){return e<0.0031308?e*12.92:1.055*Math.pow(e,0.41666)-0.055}var rs;class ec{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src))return e.src;if(typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{if(rs===void 0)rs=er("canvas");rs.width=e.width,rs.height=e.height;let i=rs.getContext("2d");if(e instanceof ImageData)i.putImageData(e,0,0);else i.drawImage(e,0,0,e.width,e.height);n=rs}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=er("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let i=n.getImageData(0,0,e.width,e.height),s=i.data;for(let r=0;r<s.length;r++)s[r]=ii(s[r]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)if(t instanceof Uint8Array||t instanceof Uint8ClampedArray)t[n]=Math.floor(ii(t[n]/255)*255);else t[n]=ii(t[n]);return{data:t,width:e.width,height:e.height}}else return De("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}var Em=0;class Wi{constructor(e=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Em++}),this.uuid=hr(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;if(typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement)e.set(t.videoWidth,t.videoHeight,0);else if(typeof VideoFrame<"u"&&t instanceof VideoFrame)e.set(t.displayWidth,t.displayHeight,0);else if(t!==null)e.set(t.width||0,t.height||0,t.depth||0);else e.set(0,0,0);return e}set needsUpdate(e){if(e===!0)this.version++}toJSON(e){let t=e===void 0||typeof e==="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let s;if(Array.isArray(i)){s=[];for(let r=0,a=i.length;r<a;r++)if(i[r].isDataTexture)s.push(Bo(i[r].image));else s.push(Bo(i[r]))}else s=Bo(i);n.url=s}if(!t)e.images[this.uuid]=n;return n}}function Bo(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap)return ec.getDataURL(e);else if(e.data)return{data:Array.from(e.data),width:e.width,height:e.height,type:e.data.constructor.name};else return De("Texture: Unable to serialize Texture."),{}}var Rm=0,zo=new L;class zt extends li{constructor(e=zt.DEFAULT_IMAGE,t=zt.DEFAULT_MAPPING,n=1001,i=1001,s=1006,r=1008,a=1023,o=1009,l=zt.DEFAULT_ANISOTROPY,u=""){super();this.isTexture=!0,Object.defineProperty(this,"id",{value:Rm++}),this.uuid=hr(),this.name="",this.source=new Wi(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=s,this.minFilter=r,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=o,this.offset=new Te(0,0),this.repeat=new Te(1,1),this.center=new Te(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Fe,this.generateMipmaps=!0,this.mipmapsAutoUpdate=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=e&&e.depth&&e.depth>1?!0:!1,this.pmremVersion=0,this.isPMREMTexture=!1,this.normalized=!1}get width(){return this.source.getSize(zo).x}get height(){return this.source.getSize(zo).y}get depth(){return this.source.getSize(zo).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.mipmapsAutoUpdate=e.mipmapsAutoUpdate,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isPMREMTexture=e.isPMREMTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(let t in e){let n=e[t];if(n===void 0){De(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}let i=this[t];if(i===void 0){De(`Texture.setValues(): property '${t}' does not exist.`);continue}if(i&&n&&(i.isVector2&&n.isVector2))i.copy(n);else if(i&&n&&(i.isVector3&&n.isVector3))i.copy(n);else if(i&&n&&(i.isMatrix3&&n.isMatrix3))i.copy(n);else this[t]=n}}toJSON(e){let t=e===void 0||typeof e==="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,mipmapsAutoUpdate:this.mipmapsAutoUpdate,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};if(Object.keys(this.userData).length>0)n.userData=this.userData;if(!t)e.textures[this.uuid]=n;return n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==300)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case 1000:e.x=e.x-Math.floor(e.x);break;case 1001:e.x=e.x<0?0:1;break;case 1002:if(Math.abs(Math.floor(e.x)%2)===1)e.x=Math.ceil(e.x)-e.x;else e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case 1000:e.y=e.y-Math.floor(e.y);break;case 1001:e.y=e.y<0?0:1;break;case 1002:if(Math.abs(Math.floor(e.y)%2)===1)e.y=Math.ceil(e.y)-e.y;else e.y=e.y-Math.floor(e.y);break}if(this.flipY)e.y=1-e.y;return e}set needsUpdate(e){if(e===!0)this.version++,this.source.needsUpdate=!0}set needsPMREMUpdate(e){if(e===!0)this.pmremVersion++}}zt.DEFAULT_IMAGE=null;zt.DEFAULT_MAPPING=300;zt.DEFAULT_ANISOTROPY=1;class rt{static{this.prototype.isVector4=!0}constructor(e=0,t=0,n=0,i=1){this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw Error("THREE.Vector4: index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw Error("THREE.Vector4: index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,i=this.z,s=this.w,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*i+r[12]*s,this.y=r[1]*t+r[5]*n+r[9]*i+r[13]*s,this.z=r[2]*t+r[6]*n+r[10]*i+r[14]*s,this.w=r[3]*t+r[7]*n+r[11]*i+r[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);if(t<0.0001)this.x=1,this.y=0,this.z=0;else this.x=e.x/t,this.y=e.y/t,this.z=e.z/t;return this}setAxisAngleFromRotationMatrix(e){let t,n,i,s,r=0.01,a=0.1,o=e.elements,l=o[0],u=o[4],h=o[8],c=o[1],f=o[5],d=o[9],_=o[2],m=o[6],p=o[10];if(Math.abs(u-c)<0.01&&Math.abs(h-_)<0.01&&Math.abs(d-m)<0.01){if(Math.abs(u+c)<0.1&&Math.abs(h+_)<0.1&&Math.abs(d+m)<0.1&&Math.abs(l+f+p-3)<0.1)return this.set(1,0,0,0),this;t=Math.PI;let v=(l+1)/2,M=(f+1)/2,y=(p+1)/2,b=(u+c)/4,E=(h+_)/4,x=(d+m)/4;if(v>M&&v>y)if(v<0.01)n=0,i=0.707106781,s=0.707106781;else n=Math.sqrt(v),i=b/n,s=E/n;else if(M>y)if(M<0.01)n=0.707106781,i=0,s=0.707106781;else i=Math.sqrt(M),n=b/i,s=x/i;else if(y<0.01)n=0.707106781,i=0.707106781,s=0;else s=Math.sqrt(y),n=E/s,i=x/s;return this.set(n,i,s,t),this}let g=Math.sqrt((m-d)*(m-d)+(h-_)*(h-_)+(c-u)*(c-u));if(Math.abs(g)<0.001)g=1;return this.x=(m-d)/g,this.y=(h-_)/g,this.z=(c-u)/g,this.w=Math.acos((l+f+p-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Ue(this.x,e.x,t.x),this.y=Ue(this.y,e.y,t.y),this.z=Ue(this.z,e.z,t.z),this.w=Ue(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=Ue(this.x,e,t),this.y=Ue(this.y,e,t),this.z=Ue(this.z,e,t),this.w=Ue(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Ue(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class tc extends li{constructor(e=1,t=1,n={}){super();n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:1006,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new rt(0,0,e,t),this.scissorTest=!1,this.viewport=new rt(0,0,e,t),this.textures=[];let i=n.count;for(let s=0;s<i;s++)this.textures[s]=new zt({width:e,height:t,depth:n.depth}),this.textures[s].isRenderTargetTexture=!0,this.textures[s].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(e={}){let t={minFilter:1006,generateMipmaps:!1,flipY:!1,internalFormat:null};if(e.mapping!==void 0)t.mapping=e.mapping;if(e.wrapS!==void 0)t.wrapS=e.wrapS;if(e.wrapT!==void 0)t.wrapT=e.wrapT;if(e.wrapR!==void 0)t.wrapR=e.wrapR;if(e.magFilter!==void 0)t.magFilter=e.magFilter;if(e.minFilter!==void 0)t.minFilter=e.minFilter;if(e.format!==void 0)t.format=e.format;if(e.type!==void 0)t.type=e.type;if(e.anisotropy!==void 0)t.anisotropy=e.anisotropy;if(e.colorSpace!==void 0)t.colorSpace=e.colorSpace;if(e.flipY!==void 0)t.flipY=e.flipY;if(e.generateMipmaps!==void 0)t.generateMipmaps=e.generateMipmaps;if(e.mipmapsAutoUpdate!==void 0)t.mipmapsAutoUpdate=e.mipmapsAutoUpdate;if(e.internalFormat!==void 0)t.internalFormat=e.internalFormat;for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){if(this._depthTexture!==null&&this._depthTexture.renderTarget===this)this._depthTexture.renderTarget=null;if(e!==null&&e.renderTarget===null)e.renderTarget=this;this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let i=0,s=this.textures.length;i<s;i++)if(this.textures[i].image.width=e,this.textures[i].image.height=t,this.textures[i].image.depth=n,this.textures[i].isData3DTexture!==!0)this.textures[i].isArrayTexture=this.textures[i].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let i=Object.assign({},e.textures[t].image);this.textures[t].source=new Wi(i)}if(this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveColorBuffer=e.resolveColorBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this.storeMultisampledColorBuffer=e.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=e.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=e.storeMultisampledStencilBuffer,e.depthTexture!==null)if(e.depthTexture.renderTarget===e){let t=e.depthTexture.clone();t.renderTarget=null,this.depthTexture=t}else this.depthTexture=e.depthTexture;else this.depthTexture=null;return this.samples=e.samples,this.multiview=e.multiview,this.useArrayDepthTexture=e.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class At extends tc{constructor(e=1,t=1,n={}){super(e,t,n);this.isWebGLRenderTarget=!0}}class Vi extends zt{constructor(e=null,t=1,n=1,i=1){super(null);this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=1003,this.minFilter=1003,this.wrapR=1001,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class xa extends At{constructor(e=1,t=1,n=1,i={}){super(e,t,i);this.isWebGLArrayRenderTarget=!0,this.depth=n,this.texture=new Vi(null,e,t,n),this._setTextureOptions(i),this.texture.isRenderTargetTexture=!0}}class nc extends zt{constructor(e=null,t=1,n=1,i=1){super(null);this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=1003,this.minFilter=1003,this.wrapR=1001,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(e){return super.copy(e),this.wrapR=e.wrapR,this}}class Pe{static{this.prototype.isMatrix4=!0}constructor(e,t,n,i,s,r,a,o,l,u,h,c,f,d,_,m){if(this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0)this.set(e,t,n,i,s,r,a,o,l,u,h,c,f,d,_,m)}set(e,t,n,i,s,r,a,o,l,u,h,c,f,d,_,m){let p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=i,p[1]=s,p[5]=r,p[9]=a,p[13]=o,p[2]=l,p[6]=u,p[10]=h,p[14]=c,p[3]=f,p[7]=d,p[11]=_,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Pe().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){if(this.determinantAffine()===0)return e.set(1,0,0),t.set(0,1,0),n.set(0,0,1),this;return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){if(e.determinantAffine()===0)return this.identity();let t=this.elements,n=e.elements,i=1/as.setFromMatrixColumn(e,0).length(),s=1/as.setFromMatrixColumn(e,1).length(),r=1/as.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*s,t[5]=n[5]*s,t[6]=n[6]*s,t[7]=0,t[8]=n[8]*r,t[9]=n[9]*r,t[10]=n[10]*r,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,{x:n,y:i,z:s}=e,r=Math.cos(n),a=Math.sin(n),o=Math.cos(i),l=Math.sin(i),u=Math.cos(s),h=Math.sin(s);if(e.order==="XYZ"){let c=r*u,f=r*h,d=a*u,_=a*h;t[0]=o*u,t[4]=-o*h,t[8]=l,t[1]=f+d*l,t[5]=c-_*l,t[9]=-a*o,t[2]=_-c*l,t[6]=d+f*l,t[10]=r*o}else if(e.order==="YXZ"){let c=o*u,f=o*h,d=l*u,_=l*h;t[0]=c+_*a,t[4]=d*a-f,t[8]=r*l,t[1]=r*h,t[5]=r*u,t[9]=-a,t[2]=f*a-d,t[6]=_+c*a,t[10]=r*o}else if(e.order==="ZXY"){let c=o*u,f=o*h,d=l*u,_=l*h;t[0]=c-_*a,t[4]=-r*h,t[8]=d+f*a,t[1]=f+d*a,t[5]=r*u,t[9]=_-c*a,t[2]=-r*l,t[6]=a,t[10]=r*o}else if(e.order==="ZYX"){let c=r*u,f=r*h,d=a*u,_=a*h;t[0]=o*u,t[4]=d*l-f,t[8]=c*l+_,t[1]=o*h,t[5]=_*l+c,t[9]=f*l-d,t[2]=-l,t[6]=a*o,t[10]=r*o}else if(e.order==="YZX"){let c=r*o,f=r*l,d=a*o,_=a*l;t[0]=o*u,t[4]=_-c*h,t[8]=d*h+f,t[1]=h,t[5]=r*u,t[9]=-a*u,t[2]=-l*u,t[6]=f*h+d,t[10]=c-_*h}else if(e.order==="XZY"){let c=r*o,f=r*l,d=a*o,_=a*l;t[0]=o*u,t[4]=-h,t[8]=l*u,t[1]=c*h+_,t[5]=r*u,t[9]=f*h-d,t[2]=d*h-f,t[6]=a*u,t[10]=_*h+c}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Cm,e,Im)}lookAt(e,t,n){let i=this.elements;if(Mn.subVectors(e,t),Mn.lengthSq()===0)Mn.z=1;if(Mn.normalize(),fi.crossVectors(n,Mn),fi.lengthSq()===0){if(Math.abs(n.z)===1)Mn.x+=0.0001;else Mn.z+=0.0001;Mn.normalize(),fi.crossVectors(n,Mn)}return fi.normalize(),kr.crossVectors(Mn,fi),i[0]=fi.x,i[4]=kr.x,i[8]=Mn.x,i[1]=fi.y,i[5]=kr.y,i[9]=Mn.y,i[2]=fi.z,i[6]=kr.z,i[10]=Mn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,i=t.elements,s=this.elements,r=n[0],a=n[4],o=n[8],l=n[12],u=n[1],h=n[5],c=n[9],f=n[13],d=n[2],_=n[6],m=n[10],p=n[14],g=n[3],v=n[7],M=n[11],y=n[15],b=i[0],E=i[4],x=i[8],S=i[12],A=i[1],P=i[5],R=i[9],I=i[13],F=i[2],C=i[6],O=i[10],W=i[14],z=i[3],te=i[7],V=i[11],Q=i[15];return s[0]=r*b+a*A+o*F+l*z,s[4]=r*E+a*P+o*C+l*te,s[8]=r*x+a*R+o*O+l*V,s[12]=r*S+a*I+o*W+l*Q,s[1]=u*b+h*A+c*F+f*z,s[5]=u*E+h*P+c*C+f*te,s[9]=u*x+h*R+c*O+f*V,s[13]=u*S+h*I+c*W+f*Q,s[2]=d*b+_*A+m*F+p*z,s[6]=d*E+_*P+m*C+p*te,s[10]=d*x+_*R+m*O+p*V,s[14]=d*S+_*I+m*W+p*Q,s[3]=g*b+v*A+M*F+y*z,s[7]=g*E+v*P+M*C+y*te,s[11]=g*x+v*R+M*O+y*V,s[15]=g*S+v*I+M*W+y*Q,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],i=e[8],s=e[12],r=e[1],a=e[5],o=e[9],l=e[13],u=e[2],h=e[6],c=e[10],f=e[14],d=e[3],_=e[7],m=e[11],p=e[15],g=o*f-l*c,v=a*f-l*h,M=a*c-o*h,y=r*f-l*u,b=r*c-o*u,E=r*h-a*u;return t*(_*g-m*v+p*M)-n*(d*g-m*y+p*b)+i*(d*v-_*y+p*E)-s*(d*M-_*b+m*E)}determinantAffine(){let e=this.elements,t=e[0],n=e[4],i=e[8],s=e[1],r=e[5],a=e[9],o=e[2],l=e[6],u=e[10];return t*(r*u-a*l)-n*(s*u-a*o)+i*(s*l-r*o)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let i=this.elements;if(e.isVector3)i[12]=e.x,i[13]=e.y,i[14]=e.z;else i[12]=e,i[13]=t,i[14]=n;return this}invert(){let e=this.elements,t=e[0],n=e[1],i=e[2],s=e[3],r=e[4],a=e[5],o=e[6],l=e[7],u=e[8],h=e[9],c=e[10],f=e[11],d=e[12],_=e[13],m=e[14],p=e[15],g=t*a-n*r,v=t*o-i*r,M=t*l-s*r,y=n*o-i*a,b=n*l-s*a,E=i*l-s*o,x=u*_-h*d,S=u*m-c*d,A=u*p-f*d,P=h*m-c*_,R=h*p-f*_,I=c*p-f*m,F=g*I-v*R+M*P+y*A-b*S+E*x;if(F===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let C=1/F;return e[0]=(a*I-o*R+l*P)*C,e[1]=(i*R-n*I-s*P)*C,e[2]=(_*E-m*b+p*y)*C,e[3]=(c*b-h*E-f*y)*C,e[4]=(o*A-r*I-l*S)*C,e[5]=(t*I-i*A+s*S)*C,e[6]=(m*M-d*E-p*v)*C,e[7]=(u*E-c*M+f*v)*C,e[8]=(r*R-a*A+l*x)*C,e[9]=(n*A-t*R-s*x)*C,e[10]=(d*b-_*M+p*g)*C,e[11]=(h*M-u*b-f*g)*C,e[12]=(a*S-r*P-o*x)*C,e[13]=(t*P-n*S+i*x)*C,e[14]=(_*v-d*y-m*g)*C,e[15]=(u*y-h*v+c*g)*C,this}scale(e){let t=this.elements,{x:n,y:i,z:s}=e;return t[0]*=n,t[4]*=i,t[8]*=s,t[1]*=n,t[5]*=i,t[9]*=s,t[2]*=n,t[6]*=i,t[10]*=s,t[3]*=n,t[7]*=i,t[11]*=s,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){if(e.isVector3)this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1);else this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1);return this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),i=Math.sin(t),s=1-n,{x:r,y:a,z:o}=e,l=s*r,u=s*a;return this.set(l*r+n,l*a-i*o,l*o+i*a,0,l*a+i*o,u*a+n,u*o-i*r,0,l*o-i*a,u*o+i*r,s*o*o+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,s,r){return this.set(1,n,s,0,e,1,r,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){let i=this.elements,{_x:s,_y:r,_z:a,_w:o}=t,l=s+s,u=r+r,h=a+a,c=s*l,f=s*u,d=s*h,_=r*u,m=r*h,p=a*h,g=o*l,v=o*u,M=o*h,{x:y,y:b,z:E}=n;return i[0]=(1-(_+p))*y,i[1]=(f+M)*y,i[2]=(d-v)*y,i[3]=0,i[4]=(f-M)*b,i[5]=(1-(c+p))*b,i[6]=(m+g)*b,i[7]=0,i[8]=(d+v)*E,i[9]=(m-g)*E,i[10]=(1-(c+_))*E,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){let i=this.elements;e.x=i[12],e.y=i[13],e.z=i[14];let s=this.determinantAffine();if(s===0)return n.set(1,1,1),t.identity(),this;let r=as.set(i[0],i[1],i[2]).length(),a=as.set(i[4],i[5],i[6]).length(),o=as.set(i[8],i[9],i[10]).length();if(s<0)r=-r;Ln.copy(this);let l=1/r,u=1/a,h=1/o;return Ln.elements[0]*=l,Ln.elements[1]*=l,Ln.elements[2]*=l,Ln.elements[4]*=u,Ln.elements[5]*=u,Ln.elements[6]*=u,Ln.elements[8]*=h,Ln.elements[9]*=h,Ln.elements[10]*=h,t.setFromRotationMatrix(Ln),n.x=r,n.y=a,n.z=o,this}makePerspective(e,t,n,i,s,r,a=2000,o=!1){let l=this.elements,u=2*s/(t-e),h=2*s/(n-i),c=(t+e)/(t-e),f=(n+i)/(n-i),d,_;if(o)d=s/(r-s),_=r*s/(r-s);else if(a===2000)d=-(r+s)/(r-s),_=-2*r*s/(r-s);else if(a===2001)d=-r/(r-s),_=-r*s/(r-s);else throw Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=u,l[4]=0,l[8]=c,l[12]=0,l[1]=0,l[5]=h,l[9]=f,l[13]=0,l[2]=0,l[6]=0,l[10]=d,l[14]=_,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,i,s,r,a=2000,o=!1){let l=this.elements,u=2/(t-e),h=2/(n-i),c=-(t+e)/(t-e),f=-(n+i)/(n-i),d,_;if(o)d=1/(r-s),_=r/(r-s);else if(a===2000)d=-2/(r-s),_=-(r+s)/(r-s);else if(a===2001)d=-1/(r-s),_=-s/(r-s);else throw Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=u,l[4]=0,l[8]=0,l[12]=c,l[1]=0,l[5]=h,l[9]=0,l[13]=f,l[2]=0,l[6]=0,l[10]=d,l[14]=_,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}var as=new L,Ln=new Pe,Cm=new L(0,0,0),Im=new L(1,1,1),fi=new L,kr=new L,Mn=new L,Qu=new Pe,ju=new On;class si{constructor(e=0,t=0,n=0,i=si.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=i}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,i=this._order){return this._x=e,this._y=t,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){let i=e.elements,s=i[0],r=i[4],a=i[8],o=i[1],l=i[5],u=i[9],h=i[2],c=i[6],f=i[10];switch(t){case"XYZ":if(this._y=Math.asin(Ue(a,-1,1)),Math.abs(a)<0.9999999)this._x=Math.atan2(-u,f),this._z=Math.atan2(-r,s);else this._x=Math.atan2(c,l),this._z=0;break;case"YXZ":if(this._x=Math.asin(-Ue(u,-1,1)),Math.abs(u)<0.9999999)this._y=Math.atan2(a,f),this._z=Math.atan2(o,l);else this._y=Math.atan2(-h,s),this._z=0;break;case"ZXY":if(this._x=Math.asin(Ue(c,-1,1)),Math.abs(c)<0.9999999)this._y=Math.atan2(-h,f),this._z=Math.atan2(-r,l);else this._y=0,this._z=Math.atan2(o,s);break;case"ZYX":if(this._y=Math.asin(-Ue(h,-1,1)),Math.abs(h)<0.9999999)this._x=Math.atan2(c,f),this._z=Math.atan2(o,s);else this._x=0,this._z=Math.atan2(-r,l);break;case"YZX":if(this._z=Math.asin(Ue(o,-1,1)),Math.abs(o)<0.9999999)this._x=Math.atan2(-u,l),this._y=Math.atan2(-h,s);else this._x=0,this._y=Math.atan2(a,f);break;case"XZY":if(this._z=Math.asin(-Ue(r,-1,1)),Math.abs(r)<0.9999999)this._x=Math.atan2(c,l),this._y=Math.atan2(a,s);else this._x=Math.atan2(-u,f),this._y=0;break;default:De("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}if(this._order=t,n===!0)this._onChangeCallback();return this}setFromQuaternion(e,t,n){return Qu.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Qu,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return ju.setFromEuler(this),this.setFromQuaternion(ju,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){if(this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0)this._order=e[3];return this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}si.DEFAULT_ORDER="XYZ";class _a{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}var Pm=0,eh=new L,os=new On,Jn=new Pe,Hr=new L,Js=new L,Dm=new L,Lm=new On,th=new L(1,0,0),nh=new L(0,1,0),ih=new L(0,0,1),sh={type:"added"},Fm={type:"removed"},ls={type:"childadded",child:null},ko={type:"childremoved",child:null};class Jt extends li{constructor(){super();this.isObject3D=!0,Object.defineProperty(this,"id",{value:Pm++}),this.uuid=hr(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Jt.DEFAULT_UP.clone();let e=new L,t=new si,n=new On,i=new L(1,1,1);function s(){n.setFromEuler(t,!1)}function r(){t.setFromQuaternion(n,void 0,!1)}t._onChange(s),n._onChange(r),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Pe},normalMatrix:{value:new Fe}}),this.matrix=new Pe,this.matrixWorld=new Pe,this.matrixAutoUpdate=Jt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Jt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new _a,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){if(this.matrixAutoUpdate)this.updateMatrix();if(this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale),this.pivot!==null)this.position.copy(this.pivot).applyMatrix4(this.matrix).sub(this.pivot)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return os.setFromAxisAngle(e,t),this.quaternion.multiply(os),this}rotateOnWorldAxis(e,t){return os.setFromAxisAngle(e,t),this.quaternion.premultiply(os),this}rotateX(e){return this.rotateOnAxis(th,e)}rotateY(e){return this.rotateOnAxis(nh,e)}rotateZ(e){return this.rotateOnAxis(ih,e)}translateOnAxis(e,t){return eh.copy(e).applyQuaternion(this.quaternion),this.position.add(eh.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(th,e)}translateY(e){return this.translateOnAxis(nh,e)}translateZ(e){return this.translateOnAxis(ih,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Jn.copy(this.matrixWorld).invert())}lookAt(e,t,n){if(e.isVector3)Hr.copy(e);else Hr.set(e,t,n);let i=this.parent;if(this.updateWorldMatrix(!0,!1),Js.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight)Jn.lookAt(Js,Hr,this.up);else Jn.lookAt(Hr,Js,this.up);if(this.quaternion.setFromRotationMatrix(Jn),i)Jn.extractRotation(i.matrixWorld),os.setFromRotationMatrix(Jn),this.quaternion.premultiply(os.invert())}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}if(e===this)return Ne("Object3D.add: object can't be added as a child of itself.",e),this;if(e&&e.isObject3D)e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(sh),ls.child=e,this.dispatchEvent(ls),ls.child=null;else Ne("Object3D.add: object not an instance of THREE.Object3D.",e);return this}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let t=this.children.indexOf(e);if(t!==-1)e.parent=null,this.children.splice(t,1),e.dispatchEvent(Fm),ko.child=e,this.dispatchEvent(ko),ko.child=null;return this}removeFromParent(){let e=this.parent;if(e!==null)e.remove(this);return this}clear(){return this.remove(...this.children)}attach(e){if(this.updateWorldMatrix(!0,!1),Jn.copy(this.matrixWorld).invert(),e.parent!==null)e.parent.updateWorldMatrix(!0,!1),Jn.multiply(e.parent.matrixWorld);return e.applyMatrix4(Jn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(sh),ls.child=e,this.dispatchEvent(ls),ls.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,i=this.children.length;n<i;n++){let r=this.children[n].getObjectByProperty(e,t);if(r!==void 0)return r}return}getObjectsByProperty(e,t,n=[]){if(this[e]===t)n.push(this);let i=this.children;for(let s=0,r=i.length;s<r;s++)i[s].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Js,e,Dm),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Js,Lm,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);let t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}intersectsFrustum(){return!0}traverse(e){e(this);let t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);let t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].traverseVisible(e)}traverseAncestors(e){let t=this.parent;if(t!==null)e(t),t.traverseAncestors(e)}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let e=this.pivot;if(e!==null){let{x:t,y:n,z:i}=e,s=this.matrix.elements;s[12]+=t-s[0]*t-s[4]*n-s[8]*i,s[13]+=n-s[1]*t-s[5]*n-s[9]*i,s[14]+=i-s[2]*t-s[6]*n-s[10]*i}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){if(this.matrixAutoUpdate)this.updateMatrix();if(this.matrixWorldNeedsUpdate||e){if(this.matrixWorldAutoUpdate===!0)if(this.parent===null)this.matrixWorld.copy(this.matrix);else this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix);this.matrixWorldNeedsUpdate=!1,e=!0}let t=this.children;for(let n=0,i=t.length;n<i;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t,n=!1){let i=this.parent;if(e===!0&&i!==null)i.updateWorldMatrix(!0,!1);if(this.matrixAutoUpdate)this.updateMatrix();if(this.matrixWorldNeedsUpdate||n){if(this.matrixWorldAutoUpdate===!0)if(this.parent===null)this.matrixWorld.copy(this.matrix);else this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix);this.matrixWorldNeedsUpdate=!1,n=!0}if(t===!0){let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].updateWorldMatrix(!1,!0,n)}}toJSON(e){let t=e===void 0||typeof e==="string",n={};if(t)e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"};let i={};if(i.uuid=this.uuid,i.type=this.type,i.name=this.name,i.castShadow=this.castShadow,i.receiveShadow=this.receiveShadow,i.visible=this.visible,i.frustumCulled=this.frustumCulled,i.renderOrder=this.renderOrder,i.static=this.static,i.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0)i.userData=this.userData;if(i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.pivot!==null)i.pivot=this.pivot.toArray();if(this.morphTargetDictionary!==void 0)i.morphTargetDictionary=Object.assign({},this.morphTargetDictionary);if(this.morphTargetInfluences!==void 0)i.morphTargetInfluences=this.morphTargetInfluences.slice();if(this.isInstancedMesh){if(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null)i.instanceColor=this.instanceColor.toJSON()}if(this.isBatchedMesh){if(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.geometryInfo=this._geometryInfo.map((a)=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),i.instanceInfo=this._instanceInfo.map((a)=>({...a})),i.availableInstanceIds=this._availableInstanceIds.slice(),i.availableGeometryIds=this._availableGeometryIds.slice(),i.nextIndexStart=this._nextIndexStart,i.nextVertexStart=this._nextVertexStart,i.geometryCount=this._geometryCount,i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.matricesTexture=this._matricesTexture.toJSON(e),i.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null)i.colorsTexture=this._colorsTexture.toJSON(e);if(this.boundingSphere!==null)i.boundingSphere=this.boundingSphere.toJSON();if(this.boundingBox!==null)i.boundingBox=this.boundingBox.toJSON()}function s(a,o){if(a[o.uuid]===void 0)a[o.uuid]=o.toJSON(e);return o.uuid}if(this.isScene){if(this.background){if(this.background.isColor)i.background=this.background.toJSON();else if(this.background.isTexture)i.background=this.background.toJSON(e).uuid}if(this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0)i.environment=this.environment.toJSON(e).uuid}else if(this.isMesh||this.isLine||this.isPoints){i.geometry=s(e.geometries,this.geometry);let a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){let o=a.shapes;if(Array.isArray(o))for(let l=0,u=o.length;l<u;l++){let h=o[l];s(e.shapes,h)}else s(e.shapes,o)}}if(this.isSkinnedMesh){if(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0)s(e.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid}if(this.material!==void 0)if(Array.isArray(this.material)){let a=[];for(let o=0,l=this.material.length;o<l;o++)a.push(s(e.materials,this.material[o]));i.material=a}else i.material=s(e.materials,this.material);if(this.children.length>0){i.children=[];for(let a=0;a<this.children.length;a++)i.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){i.animations=[];for(let a=0;a<this.animations.length;a++){let o=this.animations[a];i.animations.push(s(e.animations,o))}}if(t){let a=r(e.geometries),o=r(e.materials),l=r(e.textures),u=r(e.images),h=r(e.shapes),c=r(e.skeletons),f=r(e.animations),d=r(e.nodes);if(a.length>0)n.geometries=a;if(o.length>0)n.materials=o;if(l.length>0)n.textures=l;if(u.length>0)n.images=u;if(h.length>0)n.shapes=h;if(c.length>0)n.skeletons=c;if(f.length>0)n.animations=f;if(d.length>0)n.nodes=d}return n.object=i,n;function r(a){let o=[];for(let l in a){let u=a[l];delete u.metadata,o.push(u)}return o}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){let i=e.children[n];this.add(i.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}}Jt.DEFAULT_UP=new L(0,1,0);Jt.DEFAULT_MATRIX_AUTO_UPDATE=!0;Jt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class ys extends Jt{constructor(){super();this.isGroup=!0,this.type="Group"}}var Nm={type:"move"};class fr{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){if(this._hand===null)this._hand=new ys,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1};return this._hand}getTargetRaySpace(){if(this._targetRay===null)this._targetRay=new ys,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new L,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new L;return this._targetRay}getGripSpace(){if(this._grip===null)this._grip=new ys,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new L,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new L,this._grip.eventsEnabled=!1;return this._grip}dispatchEvent(e){if(this._targetRay!==null)this._targetRay.dispatchEvent(e);if(this._grip!==null)this._grip.dispatchEvent(e);if(this._hand!==null)this._hand.dispatchEvent(e);return this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){if(this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null)this._targetRay.visible=!1;if(this._grip!==null)this._grip.visible=!1;if(this._hand!==null)this._hand.visible=!1;return this}update(e,t,n){let i=null,s=null,r=null,a=this._targetRay,o=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){r=!0;for(let _ of e.hand.values()){let m=t.getJointPose(_,n),p=this._getHandJoint(l,_);if(m!==null)p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.quaternion,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius;p.visible=m!==null}let u=l.joints["index-finger-tip"],h=l.joints["thumb-tip"],c=u.position.distanceTo(h.position),f=0.02,d=0.005;if(l.inputState.pinching&&c>f+d)l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this});else if(!l.inputState.pinching&&c<=f-d)l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this})}else if(o!==null&&e.gripSpace){if(s=t.getPose(e.gripSpace,n),s!==null){if(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity)o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity);else o.hasLinearVelocity=!1;if(s.angularVelocity)o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity);else o.hasAngularVelocity=!1;if(o.eventsEnabled)o.dispatchEvent({type:"gripUpdated",data:e,target:this})}}if(a!==null){if(i=t.getPose(e.targetRaySpace,n),i===null&&s!==null)i=s;if(i!==null){if(a.matrix.fromArray(i.transform.matrix),a.matrix.decompose(a.position,a.quaternion,a.scale),a.matrixWorldNeedsUpdate=!0,i.linearVelocity)a.hasLinearVelocity=!0,a.linearVelocity.copy(i.linearVelocity);else a.hasLinearVelocity=!1;if(i.angularVelocity)a.hasAngularVelocity=!0,a.angularVelocity.copy(i.angularVelocity);else a.hasAngularVelocity=!1;this.dispatchEvent(Nm)}}}if(a!==null)a.visible=i!==null;if(o!==null)o.visible=s!==null;if(l!==null)l.visible=r!==null;return this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new ys;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}var mf={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},di={h:0,s:0,l:0},Gr={h:0,s:0,l:0};function Ho(e,t,n){if(n<0)n+=1;if(n>1)n-=1;if(n<0.16666666666666666)return e+(t-e)*6*n;if(n<0.5)return t;if(n<0.6666666666666666)return e+(t-e)*6*(0.6666666666666666-n);return e}class Ae{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let i=e;if(i&&i.isColor)this.copy(i);else if(typeof i==="number")this.setHex(i);else if(typeof i==="string")this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t="srgb"){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Xe.colorSpaceToWorking(this,t),this}setRGB(e,t,n,i=Xe.workingColorSpace){return this.r=e,this.g=t,this.b=n,Xe.colorSpaceToWorking(this,i),this}setHSL(e,t,n,i=Xe.workingColorSpace){if(e=bm(e,1),t=Ue(t,0,1),n=Ue(n,0,1),t===0)this.r=this.g=this.b=n;else{let s=n<=0.5?n*(1+t):n+t-n*t,r=2*n-s;this.r=Ho(r,s,e+0.3333333333333333),this.g=Ho(r,s,e),this.b=Ho(r,s,e-0.3333333333333333)}return Xe.colorSpaceToWorking(this,i),this}setStyle(e,t="srgb"){function n(s){if(s===void 0)return;if(parseFloat(s)<1)De("Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let s,r=i[1],a=i[2];switch(r){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(a))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,t);if(s=/^\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(a))return n(s[4]),this.setRGB(Math.min(100,parseFloat(s[1]))/100,Math.min(100,parseFloat(s[2]))/100,Math.min(100,parseFloat(s[3]))/100,t);break;case"hsl":case"hsla":if(s=/^\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(a))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,t);break;default:De("Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){let s=i[1],r=s.length;if(r===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,t);else if(r===6)return this.setHex(parseInt(s,16),t);else De("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t="srgb"){let n=mf[e.toLowerCase()];if(n!==void 0)this.setHex(n,t);else De("Color: Unknown color "+e);return this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=ii(e.r),this.g=ii(e.g),this.b=ii(e.b),this}copyLinearToSRGB(e){return this.r=Ss(e.r),this.g=Ss(e.g),this.b=Ss(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e="srgb"){return Xe.workingToColorSpace(sn.copy(this),e),Math.round(Ue(sn.r*255,0,255))*65536+Math.round(Ue(sn.g*255,0,255))*256+Math.round(Ue(sn.b*255,0,255))}getHexString(e="srgb"){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Xe.workingColorSpace){Xe.workingToColorSpace(sn.copy(this),t);let{r:n,g:i,b:s}=sn,r=Math.max(n,i,s),a=Math.min(n,i,s),o,l,u=(a+r)/2;if(a===r)o=0,l=0;else{let h=r-a;switch(l=u<=0.5?h/(r+a):h/(2-r-a),r){case n:o=(i-s)/h+(i<s?6:0);break;case i:o=(s-n)/h+2;break;case s:o=(n-i)/h+4;break}o/=6}return e.h=o,e.s=l,e.l=u,e}getRGB(e,t=Xe.workingColorSpace){return Xe.workingToColorSpace(sn.copy(this),t),e.r=sn.r,e.g=sn.g,e.b=sn.b,e}getStyle(e="srgb"){Xe.workingToColorSpace(sn.copy(this),e);let{r:t,g:n,b:i}=sn;if(e!=="srgb")return`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`;return`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(e,t,n){return this.getHSL(di),this.setHSL(di.h+e,di.s+t,di.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(di),e.getHSL(Gr);let n=No(di.h,Gr.h,t),i=No(di.s,Gr.s,t),s=No(di.l,Gr.l,t);return this.setHSL(n,i,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,i=this.b,s=e.elements;return this.r=s[0]*t+s[3]*n+s[6]*i,this.g=s[1]*t+s[4]*n+s[7]*i,this.b=s[2]*t+s[5]*n+s[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}var sn=new Ae;Ae.NAMES=mf;class Rs extends Jt{constructor(){super();if(this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new si,this.environmentIntensity=1,this.environmentRotation=new si,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u")__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),this.background=e.background!==null?e.background.clone():null,this.environment=e.environment!==null?e.environment.clone():null,this.fog=e.fog!==null?e.fog.clone():null,this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),this.overrideMaterial=e.overrideMaterial!==null?e.overrideMaterial.clone():null,this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);if(this.fog!==null)t.object.fog=this.fog.toJSON();return t.object.backgroundBlurriness=this.backgroundBlurriness,t.object.backgroundIntensity=this.backgroundIntensity,t.object.backgroundRotation=this.backgroundRotation.toArray(),t.object.environmentIntensity=this.environmentIntensity,t.object.environmentRotation=this.environmentRotation.toArray(),t}}var Fn=new L,Kn=new L,Go=new L,Qn=new L,cs=new L,us=new L,rh=new L,Wo=new L,Vo=new L,Xo=new L,qo=new rt,Yo=new rt,Zo=new rt;class Nt{constructor(e=new L,t=new L,n=new L){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),Fn.subVectors(e,t),i.cross(Fn);let s=i.lengthSq();if(s>0)return i.multiplyScalar(1/Math.sqrt(s));return i.set(0,0,0)}static getBarycoord(e,t,n,i,s){Fn.subVectors(i,t),Kn.subVectors(n,t),Go.subVectors(e,t);let r=Fn.dot(Fn),a=Fn.dot(Kn),o=Fn.dot(Go),l=Kn.dot(Kn),u=Kn.dot(Go),h=r*l-a*a;if(h===0)return s.set(0,0,0),null;let c=1/h,f=(l*o-a*u)*c,d=(r*u-a*o)*c;return s.set(1-f-d,d,f)}static containsPoint(e,t,n,i){if(this.getBarycoord(e,t,n,i,Qn)===null)return!1;return Qn.x>=0&&Qn.y>=0&&Qn.x+Qn.y<=1}static getInterpolation(e,t,n,i,s,r,a,o){if(this.getBarycoord(e,t,n,i,Qn)===null){if(o.x=0,o.y=0,"z"in o)o.z=0;if("w"in o)o.w=0;return null}return o.setScalar(0),o.addScaledVector(s,Qn.x),o.addScaledVector(r,Qn.y),o.addScaledVector(a,Qn.z),o}static getInterpolatedAttribute(e,t,n,i,s,r){return qo.setScalar(0),Yo.setScalar(0),Zo.setScalar(0),qo.fromBufferAttribute(e,t),Yo.fromBufferAttribute(e,n),Zo.fromBufferAttribute(e,i),r.setScalar(0),r.addScaledVector(qo,s.x),r.addScaledVector(Yo,s.y),r.addScaledVector(Zo,s.z),r}static isFrontFacing(e,t,n,i){return Fn.subVectors(n,t),Kn.subVectors(e,t),Fn.cross(Kn).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Fn.subVectors(this.c,this.b),Kn.subVectors(this.a,this.b),Fn.cross(Kn).length()*0.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(0.3333333333333333)}getNormal(e){return Nt.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Nt.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,i,s){return Nt.getInterpolation(e,this.a,this.b,this.c,t,n,i,s)}containsPoint(e){return Nt.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Nt.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,i=this.b,s=this.c,r,a;cs.subVectors(i,n),us.subVectors(s,n),Wo.subVectors(e,n);let o=cs.dot(Wo),l=us.dot(Wo);if(o<=0&&l<=0)return t.copy(n);Vo.subVectors(e,i);let u=cs.dot(Vo),h=us.dot(Vo);if(u>=0&&h<=u)return t.copy(i);let c=o*h-u*l;if(c<=0&&o>=0&&u<=0&&o-u>0)return r=o/(o-u),t.copy(n).addScaledVector(cs,r);Xo.subVectors(e,s);let f=cs.dot(Xo),d=us.dot(Xo);if(d>=0&&f<=d)return t.copy(s);let _=f*l-o*d;if(_<=0&&l>=0&&d<=0)return a=l/(l-d),t.copy(n).addScaledVector(us,a);let m=u*d-f*h;if(m<=0&&h-u>=0&&f-d>=0)return rh.subVectors(s,i),a=(h-u)/(h-u+(f-d)),t.copy(i).addScaledVector(rh,a);let p=1/(m+_+c);return r=_*p,a=c*p,t.copy(n).addScaledVector(cs,r).addScaledVector(us,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class Et{constructor(e=new L(1/0,1/0,1/0),t=new L(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Nn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Nn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=Nn.copy(t).multiplyScalar(0.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(0.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let s=n.getAttribute("position");if(t===!0&&s!==void 0&&e.isInstancedMesh!==!0&&e.isBatchedMesh!==!0)for(let r=0,a=s.count;r<a;r++){if(e.isMesh===!0)e.getVertexPosition(r,Nn);else Nn.fromBufferAttribute(s,r);Nn.applyMatrix4(e.matrixWorld),this.expandByPoint(Nn)}else{if(e.boundingBox!==void 0){if(e.boundingBox===null)e.computeBoundingBox();Wr.copy(e.boundingBox)}else{if(n.boundingBox===null)n.computeBoundingBox();Wr.copy(n.boundingBox)}Wr.applyMatrix4(e.matrixWorld),this.union(Wr)}}let i=e.children;for(let s=0,r=i.length;s<r;s++)this.expandByObject(i[s],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Nn),Nn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;if(e.normal.x>0)t=e.normal.x*this.min.x,n=e.normal.x*this.max.x;else t=e.normal.x*this.max.x,n=e.normal.x*this.min.x;if(e.normal.y>0)t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y;else t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y;if(e.normal.z>0)t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z;else t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z;return t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Ks),Vr.subVectors(this.max,Ks),hs.subVectors(e.a,Ks),fs.subVectors(e.b,Ks),ds.subVectors(e.c,Ks),pi.subVectors(fs,hs),mi.subVectors(ds,fs),Pi.subVectors(hs,ds);let t=[0,-pi.z,pi.y,0,-mi.z,mi.y,0,-Pi.z,Pi.y,pi.z,0,-pi.x,mi.z,0,-mi.x,Pi.z,0,-Pi.x,-pi.y,pi.x,0,-mi.y,mi.x,0,-Pi.y,Pi.x,0];if(!$o(t,hs,fs,ds,Vr))return!1;if(t=[1,0,0,0,1,0,0,0,1],!$o(t,hs,fs,ds,Vr))return!1;return Xr.crossVectors(pi,mi),t=[Xr.x,Xr.y,Xr.z],$o(t,hs,fs,ds,Vr)}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Nn).distanceTo(e)}getBoundingSphere(e){if(this.isEmpty())e.makeEmpty();else this.getCenter(e.center),e.radius=this.getSize(Nn).length()*0.5;return e}intersect(e){if(this.min.max(e.min),this.max.min(e.max),this.isEmpty())this.makeEmpty();return this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){if(this.isEmpty())return this;return jn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),jn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),jn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),jn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),jn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),jn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),jn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),jn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(jn),this}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}var jn=[new L,new L,new L,new L,new L,new L,new L,new L],Nn=new L,Wr=new Et,hs=new L,fs=new L,ds=new L,pi=new L,mi=new L,Pi=new L,Ks=new L,Vr=new L,Xr=new L,Di=new L;function $o(e,t,n,i,s){for(let r=0,a=e.length-3;r<=a;r+=3){Di.fromArray(e,r);let o=s.x*Math.abs(Di.x)+s.y*Math.abs(Di.y)+s.z*Math.abs(Di.z),l=t.dot(Di),u=n.dot(Di),h=i.dot(Di);if(Math.max(-Math.max(l,u,h),Math.min(l,u,h))>o)return!1}return!0}var ni=Um();function Um(){let e=new ArrayBuffer(4),t=new Float32Array(e),n=new Uint32Array(e),i=new Uint32Array(512),s=new Uint32Array(512);for(let l=0;l<256;++l){let u=l-127;if(u<-27)i[l]=0,i[l|256]=32768,s[l]=24,s[l|256]=24;else if(u<-14)i[l]=1024>>-u-14,i[l|256]=1024>>-u-14|32768,s[l]=-u-1,s[l|256]=-u-1;else if(u<=15)i[l]=u+15<<10,i[l|256]=u+15<<10|32768,s[l]=13,s[l|256]=13;else if(u<128)i[l]=31744,i[l|256]=64512,s[l]=24,s[l|256]=24;else i[l]=31744,i[l|256]=64512,s[l]=13,s[l|256]=13}let r=new Uint32Array(2048),a=new Uint32Array(64),o=new Uint32Array(64);for(let l=1;l<1024;++l){let u=l<<13,h=0;while((u&8388608)===0)u<<=1,h-=8388608;u&=-8388609,h+=947912704,r[l]=u|h}for(let l=1024;l<2048;++l)r[l]=939524096+(l-1024<<13);for(let l=1;l<31;++l)a[l]=l<<23;a[31]=1199570944,a[32]=2147483648;for(let l=33;l<63;++l)a[l]=2147483648+(l-32<<23);a[63]=3347054592;for(let l=1;l<64;++l)if(l!==32)o[l]=1024;return{floatView:t,uint32View:n,baseTable:i,shiftTable:s,mantissaTable:r,exponentTable:a,offsetTable:o}}function Om(e){if(Math.abs(e)>65504)De("DataUtils.toHalfFloat(): Value out of range.");e=Ue(e,-65504,65504),ni.floatView[0]=e;let t=ni.uint32View[0],n=t>>23&511;return ni.baseTable[n]+((t&8388607)>>ni.shiftTable[n])}function Bm(e){let t=e>>10;return ni.uint32View[0]=ni.mantissaTable[ni.offsetTable[t]+(e&1023)]+ni.exponentTable[t],ni.floatView[0]}class pt{static toHalfFloat(e){return Om(e)}static fromHalfFloat(e){return Bm(e)}}var Ft=new L,qr=new Te,zm=0;class st extends li{constructor(e,t,n=!1){super();if(Array.isArray(e))throw TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:zm++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=35044,this.updateRanges=[],this.gpuType=1015,this.version=0,this._normalizationScale=e!==void 0?jl(e):void 0}onUploadCallback(){}set needsUpdate(e){if(e===!0)this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this._normalizationScale=e._normalizationScale,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,s=this.itemSize;i<s;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)qr.fromBufferAttribute(this,t),qr.applyMatrix3(e),this.setXY(t,qr.x,qr.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Ft.fromBufferAttribute(this,t),Ft.applyMatrix3(e),this.setXYZ(t,Ft.x,Ft.y,Ft.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Ft.fromBufferAttribute(this,t),Ft.applyMatrix4(e),this.setXYZ(t,Ft.x,Ft.y,Ft.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Ft.fromBufferAttribute(this,t),Ft.applyNormalMatrix(e),this.setXYZ(t,Ft.x,Ft.y,Ft.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Ft.fromBufferAttribute(this,t),Ft.transformDirection(e),this.setXYZ(t,Ft.x,Ft.y,Ft.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];if(this.normalized)n=this._denormalize(n);return n}setComponent(e,t,n){if(this.normalized)n=this._normalize(n);return this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];if(this.normalized)t=this._denormalize(t);return t}setX(e,t){if(this.normalized)t=this._normalize(t);return this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];if(this.normalized)t=this._denormalize(t);return t}setY(e,t){if(this.normalized)t=this._normalize(t);return this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];if(this.normalized)t=this._denormalize(t);return t}setZ(e,t){if(this.normalized)t=this._normalize(t);return this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];if(this.normalized)t=this._denormalize(t);return t}setW(e,t){if(this.normalized)t=this._normalize(t);return this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){if(e*=this.itemSize,this.normalized)t=this._normalize(t),n=this._normalize(n);return this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){if(e*=this.itemSize,this.normalized)t=this._normalize(t),n=this._normalize(n),i=this._normalize(i);return this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,s){if(e*=this.itemSize,this.normalized)t=this._normalize(t),n=this._normalize(n),i=this._normalize(i),s=this._normalize(s);return this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return e.name=this.name,e.usage=this.usage,e.gpuType=this.gpuType,e}dispose(){this.dispatchEvent({type:"dispose"})}_denormalize(e){let t=this._normalizationScale;return t!==void 0?Math.max(e/t,-1):Tm(e,this.array)}_normalize(e){let t=this._normalizationScale;return t!==void 0?Math.round(e*t):wm(e,this.array)}}class va extends st{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class ya extends st{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class Zt extends st{constructor(e,t,n){super(new Float32Array(e),t,n)}}var km=new Et,Qs=new L,Jo=new L;class dr{constructor(e=new L,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;if(t!==void 0)n.copy(t);else km.setFromPoints(e).getCenter(n);let i=0;for(let s=0,r=e.length;s<r;s++)i=Math.max(i,n.distanceToSquared(e[s]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);if(t.copy(e),n>this.radius*this.radius)t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center);return t}getBoundingBox(e){if(this.isEmpty())return e.makeEmpty(),e;return e.set(this.center,this.center),e.expandByScalar(this.radius),e}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Qs.subVectors(e,this.center);let t=Qs.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),i=(n-this.radius)*0.5;this.center.addScaledVector(Qs,i/n),this.radius+=i}return this}union(e){if(e.isEmpty())return this;if(this.isEmpty())return this.copy(e),this;if(this.center.equals(e.center)===!0)this.radius=Math.max(this.radius,e.radius);else Jo.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Qs.copy(e.center).add(Jo)),this.expandByPoint(Qs.copy(e.center).sub(Jo));return this}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}var Hm=0,An=new Pe,Ko=new Jt,ps=new L,bn=new Et,js=new Et,qt=new L;class Tt extends li{constructor(){super();this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Hm++}),this.uuid=hr(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(e){if(Array.isArray(e))this.index=new((Sm(e))?ya:va)(e,1);else this.index=e;return this}setIndirect(e,t=0){return this.indirect=e,this.indirectOffset=t,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;if(t!==void 0)t.applyMatrix4(e),t.needsUpdate=!0;let n=this.attributes.normal;if(n!==void 0){let s=new Fe().getNormalMatrix(e);n.applyNormalMatrix(s),n.needsUpdate=!0}let i=this.attributes.tangent;if(i!==void 0)i.transformDirection(e),i.needsUpdate=!0;if(this.boundingBox!==null)this.computeBoundingBox();if(this.boundingSphere!==null)this.computeBoundingSphere();return this._transformed=!0,this}applyQuaternion(e){return An.makeRotationFromQuaternion(e),this.applyMatrix4(An),this}rotateX(e){return An.makeRotationX(e),this.applyMatrix4(An),this}rotateY(e){return An.makeRotationY(e),this.applyMatrix4(An),this}rotateZ(e){return An.makeRotationZ(e),this.applyMatrix4(An),this}translate(e,t,n){return An.makeTranslation(e,t,n),this.applyMatrix4(An),this}scale(e,t,n){return An.makeScale(e,t,n),this.applyMatrix4(An),this}lookAt(e){return Ko.lookAt(e),Ko.updateMatrix(),this.applyMatrix4(Ko.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ps).negate(),this.translate(ps.x,ps.y,ps.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let i=0,s=e.length;i<s;i++){let r=e[i];n.push(r.x,r.y,r.z||0)}this.setAttribute("position",new Zt(n,3))}else{let n=Math.min(e.length,t.count);for(let i=0;i<n;i++){let s=e[i];t.setXYZ(i,s.x,s.y,s.z||0)}if(e.length>t.count)De("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry.");t.needsUpdate=!0}return this}computeBoundingBox(){if(this.boundingBox===null)this.boundingBox=new Et;let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ne("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new L(-1/0,-1/0,-1/0),new L(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){let s=t[n];if(bn.setFromBufferAttribute(s),this.morphTargetsRelative)qt.addVectors(this.boundingBox.min,bn.min),this.boundingBox.expandByPoint(qt),qt.addVectors(this.boundingBox.max,bn.max),this.boundingBox.expandByPoint(qt);else this.boundingBox.expandByPoint(bn.min),this.boundingBox.expandByPoint(bn.max)}}else this.boundingBox.makeEmpty();if(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))Ne('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){if(this.boundingSphere===null)this.boundingSphere=new dr;let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){Ne("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new L,1/0);return}if(e){let n=this.boundingSphere.center;if(bn.setFromBufferAttribute(e),t)for(let s=0,r=t.length;s<r;s++){let a=t[s];if(js.setFromBufferAttribute(a),this.morphTargetsRelative)qt.addVectors(bn.min,js.min),bn.expandByPoint(qt),qt.addVectors(bn.max,js.max),bn.expandByPoint(qt);else bn.expandByPoint(js.min),bn.expandByPoint(js.max)}bn.getCenter(n);let i=0;for(let s=0,r=e.count;s<r;s++)qt.fromBufferAttribute(e,s),i=Math.max(i,n.distanceToSquared(qt));if(t)for(let s=0,r=t.length;s<r;s++){let a=t[s],o=this.morphTargetsRelative;for(let l=0,u=a.count;l<u;l++){if(qt.fromBufferAttribute(a,l),o)ps.fromBufferAttribute(e,l),qt.add(ps);i=Math.max(i,n.distanceToSquared(qt))}}if(this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius))Ne('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){Ne("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let{position:n,normal:i,uv:s}=t,r=this.getAttribute("tangent");if(r===void 0||r.count!==n.count)r=new st(new Float32Array(4*n.count),4),this.setAttribute("tangent",r);let a=[],o=[],l=new Uint8Array(n.count);for(let S=0;S<n.count;S++)a[S]=new L,o[S]=new L;let u=new L,h=new L,c=new L,f=new Te,d=new Te,_=new Te,m=new L,p=new L;function g(S,A,P){l[S]=l[A]=l[P]=1,u.fromBufferAttribute(n,S),h.fromBufferAttribute(n,A),c.fromBufferAttribute(n,P),f.fromBufferAttribute(s,S),d.fromBufferAttribute(s,A),_.fromBufferAttribute(s,P),h.sub(u),c.sub(u),d.sub(f),_.sub(f);let R=1/(d.x*_.y-_.x*d.y);if(!isFinite(R))return;m.copy(h).multiplyScalar(_.y).addScaledVector(c,-d.y).multiplyScalar(R),p.copy(c).multiplyScalar(d.x).addScaledVector(h,-_.x).multiplyScalar(R),a[S].add(m),a[A].add(m),a[P].add(m),o[S].add(p),o[A].add(p),o[P].add(p)}let v=this.groups;if(v.length===0)v=[{start:0,count:e.count}];for(let S=0,A=v.length;S<A;++S){let P=v[S],{start:R,count:I}=P;for(let F=R,C=R+I;F<C;F+=3)g(e.getX(F+0),e.getX(F+1),e.getX(F+2))}let M=new L,y=new L,b=new L,E=new L;function x(S){b.fromBufferAttribute(i,S),E.copy(b);let A=a[S];M.copy(A),M.sub(b.multiplyScalar(b.dot(A))).normalize(),y.crossVectors(E,A);let R=y.dot(o[S])<0?-1:1;r.setXYZW(S,M.x,M.y,M.z,R)}for(let S=0,A=n.count;S<A;++S)if(l[S])x(S);this._transformed=!0}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==t.count)n=new st(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let c=0,f=n.count;c<f;c++)n.setXYZ(c,0,0,0);let i=new L,s=new L,r=new L,a=new L,o=new L,l=new L,u=new L,h=new L;if(e)for(let c=0,f=e.count;c<f;c+=3){let d=e.getX(c+0),_=e.getX(c+1),m=e.getX(c+2);i.fromBufferAttribute(t,d),s.fromBufferAttribute(t,_),r.fromBufferAttribute(t,m),u.subVectors(r,s),h.subVectors(i,s),u.cross(h),a.fromBufferAttribute(n,d),o.fromBufferAttribute(n,_),l.fromBufferAttribute(n,m),a.add(u),o.add(u),l.add(u),n.setXYZ(d,a.x,a.y,a.z),n.setXYZ(_,o.x,o.y,o.z),n.setXYZ(m,l.x,l.y,l.z)}else for(let c=0,f=t.count;c<f;c+=3)i.fromBufferAttribute(t,c+0),s.fromBufferAttribute(t,c+1),r.fromBufferAttribute(t,c+2),u.subVectors(r,s),h.subVectors(i,s),u.cross(h),n.setXYZ(c+0,u.x,u.y,u.z),n.setXYZ(c+1,u.x,u.y,u.z),n.setXYZ(c+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)qt.fromBufferAttribute(e,t),qt.normalize(),e.setXYZ(t,qt.x,qt.y,qt.z)}toNonIndexed(){function e(a,o){let{array:l,itemSize:u,normalized:h}=a,c=new l.constructor(o.length*u),f=0,d=0;for(let _=0,m=o.length;_<m;_++){if(a.isInterleavedBufferAttribute)f=o[_]*a.data.stride+a.offset;else f=o[_]*u;for(let p=0;p<u;p++)c[d++]=l[f++]}return new st(c,u,h)}if(this.index===null)return De("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new Tt,n=this.index.array,i=this.attributes;for(let a in i){let o=i[a],l=e(o,n);t.setAttribute(a,l)}let s=this.morphAttributes;for(let a in s){let o=[],l=s[a];for(let u=0,h=l.length;u<h;u++){let c=l[u],f=e(c,n);o.push(f)}t.morphAttributes[a]=o}t.morphTargetsRelative=this.morphTargetsRelative;let r=this.groups;for(let a=0,o=r.length;a<o;a++){let l=r[a];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,e.name=this.name,Object.keys(this.userData).length>0)e.userData=this.userData;if(this.parameters!==void 0&&this._transformed!==!0){let o=this.parameters;for(let l in o)if(o[l]!==void 0)e[l]=o[l];return e}e.data={attributes:{}};let t=this.index;if(t!==null)e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)};let n=this.attributes;for(let o in n){let l=n[o];e.data.attributes[o]=l.toJSON(e.data)}let i={},s=!1;for(let o in this.morphAttributes){let l=this.morphAttributes[o],u=[];for(let h=0,c=l.length;h<c;h++){let f=l[h];u.push(f.toJSON(e.data))}if(u.length>0)i[o]=u,s=!0}if(s)e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative;let r=this.groups;if(r.length>0)e.data.groups=JSON.parse(JSON.stringify(r));let a=this.boundingSphere;if(a!==null)e.data.boundingSphere=a.toJSON();return e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;if(n!==null)this.setIndex(n.clone());let i=e.attributes;for(let l in i){let u=i[l];this.setAttribute(l,u.clone(t))}let s=e.morphAttributes;for(let l in s){let u=[],h=s[l];for(let c=0,f=h.length;c<f;c++)u.push(h[c].clone(t));this.morphAttributes[l]=u}this.morphTargetsRelative=e.morphTargetsRelative;let r=e.groups;for(let l=0,u=r.length;l<u;l++){let h=r[l];this.addGroup(h.start,h.count,h.materialIndex)}let a=e.boundingBox;if(a!==null)this.boundingBox=a.clone();let o=e.boundingSphere;if(o!==null)this.boundingSphere=o.clone();return this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this._transformed=e._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}var Qo=new L,Gm=new L,Wm=new Fe;class _n{constructor(e=new L(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let i=Qo.subVectors(n,t).cross(Gm.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t,n=!0){let i=e.delta(Qo),s=this.normal.dot(i);if(s===0){if(this.distanceToPoint(e.start)===0)return t.copy(e.start);return null}let r=-(e.start.dot(this.normal)+this.constant)/s;if(n===!0&&(r<0||r>1))return null;return t.copy(e.start).addScaledVector(i,r)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||Wm.getNormalMatrix(e),i=this.coplanarPoint(Qo).applyMatrix4(e),s=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(e){return this.normal.fromArray(e.normal),this.constant=e.constant,this}}var Vm=0;class Xi extends li{constructor(){super();this.isMaterial=!0,Object.defineProperty(this,"id",{value:Vm++}),this.uuid=hr(),this.name="",this.type="Material",this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=204,this.blendDst=205,this.blendEquation=100,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Ae(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=7680,this.stencilZFail=7680,this.stencilZPass=7680,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){if(this._alphaTest>0!==e>0)this.version++;this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e===void 0)return;for(let t in e){let n=e[t];if(n===void 0){De(`Material: parameter '${t}' has value of undefined.`);continue}let i=this[t];if(i===void 0){De(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}if(i&&i.isColor)i.set(n);else if(i&&i.isVector2&&(n&&n.isVector2)||i&&i.isEuler&&(n&&n.isEuler)||i&&i.isVector3&&(n&&n.isVector3))i.copy(n);else this[t]=n}}toJSON(e){let t=e===void 0||typeof e==="string";if(t)e={textures:{},images:{}};let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};if(n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor)n.color=this.color.getHex();if(this.roughness!==void 0)n.roughness=this.roughness;if(this.metalness!==void 0)n.metalness=this.metalness;if(this.sheen!==void 0)n.sheen=this.sheen;if(this.sheenColor&&this.sheenColor.isColor)n.sheenColor=this.sheenColor.getHex();if(this.sheenRoughness!==void 0)n.sheenRoughness=this.sheenRoughness;if(this.emissive&&this.emissive.isColor)n.emissive=this.emissive.getHex();if(this.emissiveIntensity!==void 0)n.emissiveIntensity=this.emissiveIntensity;if(this.specular&&this.specular.isColor)n.specular=this.specular.getHex();if(this.specularIntensity!==void 0)n.specularIntensity=this.specularIntensity;if(this.specularColor&&this.specularColor.isColor)n.specularColor=this.specularColor.getHex();if(this.shininess!==void 0)n.shininess=this.shininess;if(this.clearcoat!==void 0)n.clearcoat=this.clearcoat;if(this.clearcoatRoughness!==void 0)n.clearcoatRoughness=this.clearcoatRoughness;if(this.diffuseRoughness!==void 0)n.diffuseRoughness=this.diffuseRoughness;if(this.diffuseRoughnessMap&&this.diffuseRoughnessMap.isTexture)n.diffuseRoughnessMap=this.diffuseRoughnessMap.toJSON(e).uuid;if(this.clearcoatMap&&this.clearcoatMap.isTexture)n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid;if(this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture)n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid;if(this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture)n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray();if(this.sheenColorMap&&this.sheenColorMap.isTexture)n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid;if(this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture)n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid;if(this.dispersion!==void 0)n.dispersion=this.dispersion;if(this.retroreflectivity!==void 0)n.retroreflectivity=this.retroreflectivity;if(this.iridescence!==void 0)n.iridescence=this.iridescence;if(this.iridescenceIOR!==void 0)n.iridescenceIOR=this.iridescenceIOR;if(this.iridescenceThicknessMinimum!==void 0)n.iridescenceThicknessMinimum=this.iridescenceThicknessMinimum;if(this.iridescenceThicknessMaximum!==void 0)n.iridescenceThicknessMaximum=this.iridescenceThicknessMaximum;if(this.iridescenceMap&&this.iridescenceMap.isTexture)n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid;if(this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture)n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid;if(this.anisotropy!==void 0)n.anisotropy=this.anisotropy;if(this.anisotropyRotation!==void 0)n.anisotropyRotation=this.anisotropyRotation;if(this.anisotropyMap&&this.anisotropyMap.isTexture)n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid;if(this.map&&this.map.isTexture)n.map=this.map.toJSON(e).uuid;if(this.matcap&&this.matcap.isTexture)n.matcap=this.matcap.toJSON(e).uuid;if(this.alphaMap&&this.alphaMap.isTexture)n.alphaMap=this.alphaMap.toJSON(e).uuid;if(this.lightMap&&this.lightMap.isTexture)n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity;if(this.aoMap&&this.aoMap.isTexture)n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity;if(this.bumpMap&&this.bumpMap.isTexture)n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale;if(this.normalMap&&this.normalMap.isTexture)n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray();if(this.displacementMap&&this.displacementMap.isTexture)n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias;if(this.roughnessMap&&this.roughnessMap.isTexture)n.roughnessMap=this.roughnessMap.toJSON(e).uuid;if(this.metalnessMap&&this.metalnessMap.isTexture)n.metalnessMap=this.metalnessMap.toJSON(e).uuid;if(this.emissiveMap&&this.emissiveMap.isTexture)n.emissiveMap=this.emissiveMap.toJSON(e).uuid;if(this.specularMap&&this.specularMap.isTexture)n.specularMap=this.specularMap.toJSON(e).uuid;if(this.specularIntensityMap&&this.specularIntensityMap.isTexture)n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid;if(this.specularColorMap&&this.specularColorMap.isTexture)n.specularColorMap=this.specularColorMap.toJSON(e).uuid;if(this.envMap&&this.envMap.isTexture){if(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0)n.combine=this.combine}if(this.envMapRotation!==void 0)n.envMapRotation=this.envMapRotation.toArray();if(this.envMapIntensity!==void 0)n.envMapIntensity=this.envMapIntensity;if(this.reflectivity!==void 0)n.reflectivity=this.reflectivity;if(this.refractionRatio!==void 0)n.refractionRatio=this.refractionRatio;if(this.gradientMap&&this.gradientMap.isTexture)n.gradientMap=this.gradientMap.toJSON(e).uuid;if(this.transmission!==void 0)n.transmission=this.transmission;if(this.transmissionMap&&this.transmissionMap.isTexture)n.transmissionMap=this.transmissionMap.toJSON(e).uuid;if(this.thickness!==void 0)n.thickness=this.thickness;if(this.thicknessMap&&this.thicknessMap.isTexture)n.thicknessMap=this.thicknessMap.toJSON(e).uuid;if(this.attenuationDistance!==void 0)n.attenuationDistance=this.attenuationDistance;if(this.attenuationColor!==void 0)n.attenuationColor=this.attenuationColor.getHex();if(this.size!==void 0)n.size=this.size;if(this.sizeAttenuation!==void 0)n.sizeAttenuation=this.sizeAttenuation;if(Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0)n.clippingPlanes=this.clippingPlanes.map((s)=>s.toJSON());if(this.rotation!==void 0)n.rotation=this.rotation;if(this.depthPacking!==void 0)n.depthPacking=this.depthPacking;if(this.linewidth!==void 0)n.linewidth=this.linewidth;if(this.linecap!==void 0)n.linecap=this.linecap;if(this.linejoin!==void 0)n.linejoin=this.linejoin;if(this.dashSize!==void 0)n.dashSize=this.dashSize;if(this.gapSize!==void 0)n.gapSize=this.gapSize;if(this.scale!==void 0)n.scale=this.scale;if(this.wireframe!==void 0)n.wireframe=this.wireframe;if(this.wireframeLinewidth!==void 0)n.wireframeLinewidth=this.wireframeLinewidth;if(this.wireframeLinecap!==void 0)n.wireframeLinecap=this.wireframeLinecap;if(this.wireframeLinejoin!==void 0)n.wireframeLinejoin=this.wireframeLinejoin;if(this.flatShading!==void 0)n.flatShading=this.flatShading;if(this.fog!==void 0)n.fog=this.fog;if(Object.keys(this.userData).length>0)n.userData=this.userData;function i(s){let r=[];for(let a in s){let o=s[a];delete o.metadata,r.push(o)}return r}if(t){let s=i(e.textures),r=i(e.images);if(s.length>0)n.textures=s;if(r.length>0)n.images=r}return n}fromJSON(e,t){if(e.uuid!==void 0)this.uuid=e.uuid;if(e.name!==void 0)this.name=e.name;if(e.color!==void 0&&this.color!==void 0)this.color.setHex(e.color);if(e.roughness!==void 0)this.roughness=e.roughness;if(e.metalness!==void 0)this.metalness=e.metalness;if(e.sheen!==void 0)this.sheen=e.sheen;if(e.sheenColor!==void 0)this.sheenColor=new Ae().setHex(e.sheenColor);if(e.sheenRoughness!==void 0)this.sheenRoughness=e.sheenRoughness;if(e.emissive!==void 0&&this.emissive!==void 0)this.emissive.setHex(e.emissive);if(e.specular!==void 0&&this.specular!==void 0)this.specular.setHex(e.specular);if(e.specularIntensity!==void 0)this.specularIntensity=e.specularIntensity;if(e.specularColor!==void 0&&this.specularColor!==void 0)this.specularColor.setHex(e.specularColor);if(e.shininess!==void 0)this.shininess=e.shininess;if(e.clearcoat!==void 0)this.clearcoat=e.clearcoat;if(e.clearcoatRoughness!==void 0)this.clearcoatRoughness=e.clearcoatRoughness;if(e.diffuseRoughness!==void 0)this.diffuseRoughness=e.diffuseRoughness;if(e.dispersion!==void 0)this.dispersion=e.dispersion;if(e.retroreflectivity!==void 0)this.retroreflectivity=e.retroreflectivity;if(e.iridescence!==void 0)this.iridescence=e.iridescence;if(e.iridescenceIOR!==void 0)this.iridescenceIOR=e.iridescenceIOR;if(e.iridescenceThicknessMinimum!==void 0)this.iridescenceThicknessMinimum=e.iridescenceThicknessMinimum;if(e.iridescenceThicknessMaximum!==void 0)this.iridescenceThicknessMaximum=e.iridescenceThicknessMaximum;if(e.iridescenceThicknessRange!==void 0)this.iridescenceThicknessMinimum=e.iridescenceThicknessRange[0],this.iridescenceThicknessMaximum=e.iridescenceThicknessRange[1];if(e.transmission!==void 0)this.transmission=e.transmission;if(e.thickness!==void 0)this.thickness=e.thickness;if(e.attenuationDistance!==void 0)this.attenuationDistance=e.attenuationDistance;if(e.attenuationColor!==void 0&&this.attenuationColor!==void 0)this.attenuationColor.setHex(e.attenuationColor);if(e.anisotropy!==void 0)this.anisotropy=e.anisotropy;if(e.anisotropyRotation!==void 0)this.anisotropyRotation=e.anisotropyRotation;if(e.fog!==void 0)this.fog=e.fog;if(e.flatShading!==void 0)this.flatShading=e.flatShading;if(e.blending!==void 0)this.blending=e.blending;if(e.combine!==void 0)this.combine=e.combine;if(e.side!==void 0)this.side=e.side;if(e.shadowSide!==void 0)this.shadowSide=e.shadowSide;if(e.opacity!==void 0)this.opacity=e.opacity;if(e.transparent!==void 0)this.transparent=e.transparent;if(e.alphaTest!==void 0)this.alphaTest=e.alphaTest;if(e.alphaHash!==void 0)this.alphaHash=e.alphaHash;if(e.depthFunc!==void 0)this.depthFunc=e.depthFunc;if(e.depthTest!==void 0)this.depthTest=e.depthTest;if(e.depthWrite!==void 0)this.depthWrite=e.depthWrite;if(e.colorWrite!==void 0)this.colorWrite=e.colorWrite;if(e.clippingPlanes!==void 0)this.clippingPlanes=e.clippingPlanes.map((n)=>new _n().fromJSON(n));if(e.clipIntersection!==void 0)this.clipIntersection=e.clipIntersection;if(e.clipShadows!==void 0)this.clipShadows=e.clipShadows;if(e.depthPacking!==void 0)this.depthPacking=e.depthPacking;if(e.blendSrc!==void 0)this.blendSrc=e.blendSrc;if(e.blendDst!==void 0)this.blendDst=e.blendDst;if(e.blendEquation!==void 0)this.blendEquation=e.blendEquation;if(e.blendSrcAlpha!==void 0)this.blendSrcAlpha=e.blendSrcAlpha;if(e.blendDstAlpha!==void 0)this.blendDstAlpha=e.blendDstAlpha;if(e.blendEquationAlpha!==void 0)this.blendEquationAlpha=e.blendEquationAlpha;if(e.blendColor!==void 0&&this.blendColor!==void 0)this.blendColor.setHex(e.blendColor);if(e.blendAlpha!==void 0)this.blendAlpha=e.blendAlpha;if(e.stencilWriteMask!==void 0)this.stencilWriteMask=e.stencilWriteMask;if(e.stencilFunc!==void 0)this.stencilFunc=e.stencilFunc;if(e.stencilRef!==void 0)this.stencilRef=e.stencilRef;if(e.stencilFuncMask!==void 0)this.stencilFuncMask=e.stencilFuncMask;if(e.stencilFail!==void 0)this.stencilFail=e.stencilFail;if(e.stencilZFail!==void 0)this.stencilZFail=e.stencilZFail;if(e.stencilZPass!==void 0)this.stencilZPass=e.stencilZPass;if(e.stencilWrite!==void 0)this.stencilWrite=e.stencilWrite;if(e.wireframe!==void 0)this.wireframe=e.wireframe;if(e.wireframeLinewidth!==void 0)this.wireframeLinewidth=e.wireframeLinewidth;if(e.wireframeLinecap!==void 0)this.wireframeLinecap=e.wireframeLinecap;if(e.wireframeLinejoin!==void 0)this.wireframeLinejoin=e.wireframeLinejoin;if(e.rotation!==void 0)this.rotation=e.rotation;if(e.linewidth!==void 0)this.linewidth=e.linewidth;if(e.linecap!==void 0)this.linecap=e.linecap;if(e.linejoin!==void 0)this.linejoin=e.linejoin;if(e.dashSize!==void 0)this.dashSize=e.dashSize;if(e.gapSize!==void 0)this.gapSize=e.gapSize;if(e.scale!==void 0)this.scale=e.scale;if(e.polygonOffset!==void 0)this.polygonOffset=e.polygonOffset;if(e.polygonOffsetFactor!==void 0)this.polygonOffsetFactor=e.polygonOffsetFactor;if(e.polygonOffsetUnits!==void 0)this.polygonOffsetUnits=e.polygonOffsetUnits;if(e.dithering!==void 0)this.dithering=e.dithering;if(e.alphaToCoverage!==void 0)this.alphaToCoverage=e.alphaToCoverage;if(e.premultipliedAlpha!==void 0)this.premultipliedAlpha=e.premultipliedAlpha;if(e.forceSinglePass!==void 0)this.forceSinglePass=e.forceSinglePass;if(e.allowOverride!==void 0)this.allowOverride=e.allowOverride;if(e.visible!==void 0)this.visible=e.visible;if(e.toneMapped!==void 0)this.toneMapped=e.toneMapped;if(e.userData!==void 0)this.userData=e.userData;if(e.vertexColors!==void 0)if(typeof e.vertexColors==="number")this.vertexColors=e.vertexColors>0;else this.vertexColors=e.vertexColors;if(e.size!==void 0)this.size=e.size;if(e.sizeAttenuation!==void 0)this.sizeAttenuation=e.sizeAttenuation;if(e.map!==void 0)this.map=t[e.map]||null;if(e.matcap!==void 0)this.matcap=t[e.matcap]||null;if(e.alphaMap!==void 0)this.alphaMap=t[e.alphaMap]||null;if(e.bumpMap!==void 0)this.bumpMap=t[e.bumpMap]||null;if(e.bumpScale!==void 0)this.bumpScale=e.bumpScale;if(e.normalMap!==void 0)this.normalMap=t[e.normalMap]||null;if(e.normalMapType!==void 0)this.normalMapType=e.normalMapType;if(e.normalScale!==void 0){let n=e.normalScale;if(Array.isArray(n)===!1)n=[n,n];this.normalScale=new Te().fromArray(n)}if(e.displacementMap!==void 0)this.displacementMap=t[e.displacementMap]||null;if(e.displacementScale!==void 0)this.displacementScale=e.displacementScale;if(e.displacementBias!==void 0)this.displacementBias=e.displacementBias;if(e.roughnessMap!==void 0)this.roughnessMap=t[e.roughnessMap]||null;if(e.metalnessMap!==void 0)this.metalnessMap=t[e.metalnessMap]||null;if(e.emissiveMap!==void 0)this.emissiveMap=t[e.emissiveMap]||null;if(e.emissiveIntensity!==void 0)this.emissiveIntensity=e.emissiveIntensity;if(e.specularMap!==void 0)this.specularMap=t[e.specularMap]||null;if(e.specularIntensityMap!==void 0)this.specularIntensityMap=t[e.specularIntensityMap]||null;if(e.specularColorMap!==void 0)this.specularColorMap=t[e.specularColorMap]||null;if(e.envMap!==void 0)this.envMap=t[e.envMap]||null;if(e.envMapRotation!==void 0)this.envMapRotation.fromArray(e.envMapRotation);if(e.envMapIntensity!==void 0)this.envMapIntensity=e.envMapIntensity;if(e.reflectivity!==void 0)this.reflectivity=e.reflectivity;if(e.refractionRatio!==void 0)this.refractionRatio=e.refractionRatio;if(e.lightMap!==void 0)this.lightMap=t[e.lightMap]||null;if(e.lightMapIntensity!==void 0)this.lightMapIntensity=e.lightMapIntensity;if(e.aoMap!==void 0)this.aoMap=t[e.aoMap]||null;if(e.aoMapIntensity!==void 0)this.aoMapIntensity=e.aoMapIntensity;if(e.gradientMap!==void 0)this.gradientMap=t[e.gradientMap]||null;if(e.clearcoatMap!==void 0)this.clearcoatMap=t[e.clearcoatMap]||null;if(e.clearcoatRoughnessMap!==void 0)this.clearcoatRoughnessMap=t[e.clearcoatRoughnessMap]||null;if(e.clearcoatNormalMap!==void 0)this.clearcoatNormalMap=t[e.clearcoatNormalMap]||null;if(e.clearcoatNormalScale!==void 0)this.clearcoatNormalScale=new Te().fromArray(e.clearcoatNormalScale);if(e.diffuseRoughnessMap!==void 0)this.diffuseRoughnessMap=t[e.diffuseRoughnessMap]||null;if(e.iridescenceMap!==void 0)this.iridescenceMap=t[e.iridescenceMap]||null;if(e.iridescenceThicknessMap!==void 0)this.iridescenceThicknessMap=t[e.iridescenceThicknessMap]||null;if(e.transmissionMap!==void 0)this.transmissionMap=t[e.transmissionMap]||null;if(e.thicknessMap!==void 0)this.thicknessMap=t[e.thicknessMap]||null;if(e.anisotropyMap!==void 0)this.anisotropyMap=t[e.anisotropyMap]||null;if(e.sheenColorMap!==void 0)this.sheenColorMap=t[e.sheenColorMap]||null;if(e.sheenRoughnessMap!==void 0)this.sheenRoughnessMap=t[e.sheenRoughnessMap]||null;return this}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let i=t.length;n=Array(i);for(let s=0;s!==i;++s)n[s]=t[s].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){if(e===!0)this.version++}}var ei=new L,jo=new L,Yr=new L,Zr=new L;class pr{constructor(e=new L,t=new L(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,ei)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);if(n<0)return t.copy(this.origin);return t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=ei.subVectors(e,this.origin).dot(this.direction);if(t<0)return this.origin.distanceToSquared(e);return ei.copy(this.origin).addScaledVector(this.direction,t),ei.distanceToSquared(e)}distanceSqToSegment(e,t,n,i){jo.copy(e).add(t).multiplyScalar(0.5),Yr.copy(t).sub(e).normalize(),Zr.copy(this.origin).sub(jo);let s=e.distanceTo(t)*0.5,r=-this.direction.dot(Yr),a=Zr.dot(this.direction),o=-Zr.dot(Yr),l=Zr.lengthSq(),u=Math.abs(1-r*r),h,c,f,d;if(u>0)if(h=r*o-a,c=r*a-o,d=s*u,h>=0)if(c>=-d)if(c<=d){let _=1/u;h*=_,c*=_,f=h*(h+r*c+2*a)+c*(r*h+c+2*o)+l}else c=s,h=Math.max(0,-(r*c+a)),f=-h*h+c*(c+2*o)+l;else c=-s,h=Math.max(0,-(r*c+a)),f=-h*h+c*(c+2*o)+l;else if(c<=-d)h=Math.max(0,-(-r*s+a)),c=h>0?-s:Math.min(Math.max(-s,-o),s),f=-h*h+c*(c+2*o)+l;else if(c<=d)h=0,c=Math.min(Math.max(-s,-o),s),f=c*(c+2*o)+l;else h=Math.max(0,-(r*s+a)),c=h>0?s:Math.min(Math.max(-s,-o),s),f=-h*h+c*(c+2*o)+l;else c=r>0?-s:s,h=Math.max(0,-(r*c+a)),f=-h*h+c*(c+2*o)+l;if(n)n.copy(this.origin).addScaledVector(this.direction,h);if(i)i.copy(jo).addScaledVector(Yr,c);return f}intersectSphere(e,t){if(e.radius<0)return null;ei.subVectors(e.center,this.origin);let n=ei.dot(this.direction),i=ei.dot(ei)-n*n,s=e.radius*e.radius;if(i>s)return null;let r=Math.sqrt(s-i),a=n-r,o=n+r;if(o<0)return null;if(a<0)return this.at(o,t);return this.at(a,t)}intersectsSphere(e){if(e.radius<0)return!1;return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0){if(e.distanceToPoint(this.origin)===0)return 0;return null}let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);if(n===null)return null;return this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);if(t===0)return!0;if(e.normal.dot(this.direction)*t<0)return!0;return!1}intersectBox(e,t){let n,i,s,r,a,o,l=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,c=this.origin;if(l>=0)n=(e.min.x-c.x)*l,i=(e.max.x-c.x)*l;else n=(e.max.x-c.x)*l,i=(e.min.x-c.x)*l;if(u>=0)s=(e.min.y-c.y)*u,r=(e.max.y-c.y)*u;else s=(e.max.y-c.y)*u,r=(e.min.y-c.y)*u;if(n>r||s>i)return null;if(s>n||isNaN(n))n=s;if(r<i||isNaN(i))i=r;if(h>=0)a=(e.min.z-c.z)*h,o=(e.max.z-c.z)*h;else a=(e.max.z-c.z)*h,o=(e.min.z-c.z)*h;if(n>o||a>i)return null;if(a>n||n!==n)n=a;if(o<i||i!==i)i=o;if(i<0)return null;return this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,ei)!==null}intersectTriangle(e,t,n,i,s){let r=this.origin,a=this.direction,{x:o,y:l,z:u}=a,h=e.x-r.x,c=e.y-r.y,f=e.z-r.z,d=t.x-r.x,_=t.y-r.y,m=t.z-r.z,p=n.x-r.x,g=n.y-r.y,v=n.z-r.z,M=Math.abs(o),y=Math.abs(l),b=Math.abs(u),E,x,S,A,P,R,I,F,C,O,W,z;if(M>=y&&M>=b)if(S=o,R=h,C=d,z=p,o>=0)E=l,x=u,A=c,P=f,I=_,F=m,O=g,W=v;else E=u,x=l,A=f,P=c,I=m,F=_,O=v,W=g;else if(y>=b)if(S=l,R=c,C=_,z=g,l>=0)E=u,x=o,A=f,P=h,I=m,F=d,O=v,W=p;else E=o,x=u,A=h,P=f,I=d,F=m,O=p,W=v;else if(S=u,R=f,C=m,z=v,u>=0)E=o,x=l,A=h,P=c,I=d,F=_,O=p,W=g;else E=l,x=o,A=c,P=h,I=_,F=d,O=g,W=p;if(S===0)return null;let te=E/S,V=x/S,Q=1/S,ee=A-te*R,pe=P-V*R,Z=I-te*C,ie=F-V*C,_e=O-te*z,Re=W-V*z,Ie=_e*ie-Re*Z,ve=ee*Re-pe*_e,nt=Z*pe-ie*ee;if(i){if(Ie<0||ve<0||nt<0)return null}else if((Ie<0||ve<0||nt<0)&&(Ie>0||ve>0||nt>0))return null;let Ge=Ie+ve+nt;if(Ge===0)return null;let ze=Q*(Ie*R+ve*C+nt*z);if(Ge>0?ze<0:ze>0)return null;return this.at(ze/Ge,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class yi extends Xi{constructor(e){super();this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Ae(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new si,this.combine=0,this.reflectivity=1,this.refractionRatio=0.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}var ah=new Pe,Li=new pr,$r=new dr,oh=new L,Jr=new L,Kr=new L,Qr=new L,el=new L,jr=new L,lh=new L,ea=new L;class dn extends Jt{constructor(e=new Tt,t=new yi){super();this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){if(super.copy(e,t),e.morphTargetInfluences!==void 0)this.morphTargetInfluences=e.morphTargetInfluences.slice();else this.morphTargetInfluences=void 0;if(e.morphTargetDictionary!==void 0)this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary);else this.morphTargetDictionary=void 0;return this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,r=i.length;s<r;s++){let a=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(e,t){let n=this.geometry,i=n.attributes.position,s=n.morphAttributes.position,r=n.morphTargetsRelative;t.fromBufferAttribute(i,e);let a=this.morphTargetInfluences;if(s&&a){jr.set(0,0,0);for(let o=0,l=s.length;o<l;o++){let u=a[o],h=s[o];if(u===0)continue;if(el.fromBufferAttribute(h,e),r)jr.addScaledVector(el,u);else jr.addScaledVector(el.sub(t),u)}t.add(jr)}return t}intersectsFrustum(e){return e.intersectsObject(this)}raycast(e,t){let n=this.geometry,i=this.material,s=this.matrixWorld;if(i===void 0)return;if(n.boundingSphere===null)n.computeBoundingSphere();if($r.copy(n.boundingSphere),$r.applyMatrix4(s),Li.copy(e.ray).recast(e.near),$r.containsPoint(Li.origin)===!1){if(Li.intersectSphere($r,oh)===null)return;if(Li.origin.distanceToSquared(oh)>(e.far-e.near)**2)return}if(ah.copy(s).invert(),Li.copy(e.ray).applyMatrix4(ah),n.boundingBox!==null){if(Li.intersectsBox(n.boundingBox)===!1)return}this._computeIntersections(e,t,Li)}_computeIntersections(e,t,n){let i,s=this.geometry,r=this.material,a=s.index,o=s.attributes.position,l=s.attributes.uv,u=s.attributes.uv1,h=s.attributes.normal,{groups:c,drawRange:f}=s;if(a!==null)if(Array.isArray(r))for(let d=0,_=c.length;d<_;d++){let m=c[d],p=r[m.materialIndex],g=Math.max(m.start,f.start),v=Math.min(a.count,Math.min(m.start+m.count,f.start+f.count));for(let M=g,y=v;M<y;M+=3){let b=a.getX(M),E=a.getX(M+1),x=a.getX(M+2);if(i=ta(this,p,e,n,l,u,h,b,E,x),i)i.faceIndex=Math.floor(M/3),i.face.materialIndex=m.materialIndex,t.push(i)}}else{let d=Math.max(0,f.start),_=Math.min(a.count,f.start+f.count);for(let m=d,p=_;m<p;m+=3){let g=a.getX(m),v=a.getX(m+1),M=a.getX(m+2);if(i=ta(this,r,e,n,l,u,h,g,v,M),i)i.faceIndex=Math.floor(m/3),t.push(i)}}else if(o!==void 0)if(Array.isArray(r))for(let d=0,_=c.length;d<_;d++){let m=c[d],p=r[m.materialIndex],g=Math.max(m.start,f.start),v=Math.min(o.count,Math.min(m.start+m.count,f.start+f.count));for(let M=g,y=v;M<y;M+=3){let b=M,E=M+1,x=M+2;if(i=ta(this,p,e,n,l,u,h,b,E,x),i)i.faceIndex=Math.floor(M/3),i.face.materialIndex=m.materialIndex,t.push(i)}}else{let d=Math.max(0,f.start),_=Math.min(o.count,f.start+f.count);for(let m=d,p=_;m<p;m+=3){let g=m,v=m+1,M=m+2;if(i=ta(this,r,e,n,l,u,h,g,v,M),i)i.faceIndex=Math.floor(m/3),t.push(i)}}}}function Xm(e,t,n,i,s,r,a,o){let l;if(t.side===1)l=i.intersectTriangle(a,r,s,!0,o);else l=i.intersectTriangle(s,r,a,t.side===0,o);if(l===null)return null;ea.copy(o),ea.applyMatrix4(e.matrixWorld);let u=n.ray.origin.distanceTo(ea);if(u<n.near||u>n.far)return null;return{distance:u,point:ea.clone(),object:e}}function ta(e,t,n,i,s,r,a,o,l,u){e.getVertexPosition(o,Jr),e.getVertexPosition(l,Kr),e.getVertexPosition(u,Qr);let h=Xm(e,t,n,i,Jr,Kr,Qr,lh);if(h){let c=new L;if(Nt.getBarycoord(lh,Jr,Kr,Qr,c),s)h.uv=Nt.getInterpolatedAttribute(s,o,l,u,c,new Te);if(r)h.uv1=Nt.getInterpolatedAttribute(r,o,l,u,c,new Te);if(a){if(h.normal=Nt.getInterpolatedAttribute(a,o,l,u,c,new L),h.normal.dot(i.direction)>0)h.normal.multiplyScalar(-1)}let f={a:o,b:l,c:u,normal:new L,materialIndex:0};Nt.getNormal(Jr,Kr,Qr,f.normal),h.face=f,h.barycoord=c}return h}class ht extends zt{constructor(e=null,t=1,n=1,i,s,r,a,o,l=1003,u=1003,h,c){super(null,r,a,o,l,u,i,s,h,c);this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}var Fi=new dr,qm=new Te(0.5,0.5),na=new L;class Ui{constructor(e=new _n,t=new _n,n=new _n,i=new _n,s=new _n,r=new _n){this.planes=[e,t,n,i,s,r]}set(e,t,n,i,s,r){let a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(i),a[4].copy(s),a[5].copy(r),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=2000,n=!1){let i=this.planes,s=e.elements,r=s[0],a=s[1],o=s[2],l=s[3],u=s[4],h=s[5],c=s[6],f=s[7],d=s[8],_=s[9],m=s[10],p=s[11],g=s[12],v=s[13],M=s[14],y=s[15];if(i[0].setComponents(l-r,f-u,p-d,y-g).normalize(),i[1].setComponents(l+r,f+u,p+d,y+g).normalize(),i[2].setComponents(l+a,f+h,p+_,y+v).normalize(),i[3].setComponents(l-a,f-h,p-_,y-v).normalize(),n)i[4].setComponents(o,c,m,M).normalize(),i[5].setComponents(l-o,f-c,p-m,y-M).normalize();else if(i[4].setComponents(l-o,f-c,p-m,y-M).normalize(),t===2000)i[5].setComponents(l+o,f+c,p+m,y+M).normalize();else if(t===2001)i[5].setComponents(o,c,m,M).normalize();else throw Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0){if(e.boundingSphere===null)e.computeBoundingSphere();Fi.copy(e.boundingSphere).applyMatrix4(e.matrixWorld)}else{let t=e.geometry;if(t.boundingSphere===null)t.computeBoundingSphere();Fi.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Fi)}intersectsSprite(e){Fi.center.set(0,0,0);let t=qm.distanceTo(e.center);return Fi.radius=0.7071067811865476+t,Fi.applyMatrix4(e.matrixWorld),this.intersectsSphere(Fi)}intersectsSphere(e){let t=this.planes,n=e.center,i=-e.radius;for(let s=0;s<6;s++)if(t[s].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let i=t[n];if(na.x=i.normal.x>0?e.max.x:e.min.x,na.y=i.normal.y>0?e.max.y:e.min.y,na.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(na)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}var ch=new Pe;class Sa{constructor(){this.coordinateSystem=2000,this._frustums=[],this._count=0}setFromArrayCamera(e){let t=e.cameras,n=this._frustums;for(let i=0;i<t.length;i++){let s=t[i];if(ch.multiplyMatrices(s.projectionMatrix,s.matrixWorldInverse),n[i]===void 0)n[i]=new Ui;n[i].setFromProjectionMatrix(ch,s.coordinateSystem,s.reversedDepth)}return this._count=t.length,this}getFrustum(e){return this._frustums[e]}intersectsObject(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsObject(e))return!0;return!1}intersectsSprite(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsSprite(e))return!0;return!1}intersectsSphere(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsSphere(e))return!0;return!1}intersectsBox(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].intersectsBox(e))return!0;return!1}containsPoint(e){let t=this._frustums;for(let n=0;n<this._count;n++)if(t[n].containsPoint(e))return!0;return!1}copy(e){this.coordinateSystem=e.coordinateSystem;let t=this._frustums,n=e._frustums;for(let i=0;i<e._count;i++){if(t[i]===void 0)t[i]=new Ui;t[i].copy(n[i])}return this._count=e._count,this}clone(){return new Sa().copy(this)}}class Ma extends zt{constructor(e=[],t=301,n,i,s,r,a,o,l,u){super(e,t,n,i,s,r,a,o,l,u);this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class ba extends zt{constructor(e,t,n,i,s,r,a,o,l){super(e,t,n,i,s,r,a,o,l);this.isCanvasTexture=!0,this.needsUpdate=!0}}class Si extends zt{constructor(e,t,n=1014,i,s,r,a=1003,o=1003,l,u=1026,h=1){if(u!==1026&&u!==1027)throw Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let c={width:e,height:t,depth:h};super(c,i,s,r,a,o,u,n,l);this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Wi(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return t.compareFunction=this.compareFunction,t}}class Ta extends Si{constructor(e,t=1014,n=301,i,s,r=1003,a=1003,o,l=1026){let u={width:e,height:e,depth:1},h=[u,u,u,u,u,u];super(e,e,t,n,i,s,r,a,o,l);this.image=h,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class wa extends zt{constructor(e=null){super();this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class Cs extends Tt{constructor(e=1,t=1,n=1,i=1,s=1,r=1){super();this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:s,depthSegments:r};let a=this;i=Math.floor(i),s=Math.floor(s),r=Math.floor(r);let o=[],l=[],u=[],h=[],c=0,f=0;d("z","y","x",-1,-1,n,t,e,r,s,0),d("z","y","x",1,-1,n,t,-e,r,s,1),d("x","z","y",1,1,e,n,t,i,r,2),d("x","z","y",1,-1,e,n,-t,i,r,3),d("x","y","z",1,-1,e,t,n,i,s,4),d("x","y","z",-1,-1,e,t,-n,i,s,5),this.setIndex(o),this.setAttribute("position",new Zt(l,3)),this.setAttribute("normal",new Zt(u,3)),this.setAttribute("uv",new Zt(h,2));function d(_,m,p,g,v,M,y,b,E,x,S){let A=M/E,P=y/x,R=M/2,I=y/2,F=b/2,C=E+1,O=x+1,W=0,z=0,te=new L;for(let V=0;V<O;V++){let Q=V*P-I;for(let ee=0;ee<C;ee++){let pe=ee*A-R;te[_]=pe*g,te[m]=Q*v,te[p]=F,l.push(te.x,te.y,te.z),te[_]=0,te[m]=0,te[p]=b>0?1:-1,u.push(te.x,te.y,te.z),h.push(ee/E),h.push(1-V/x),W+=1}}for(let V=0;V<x;V++)for(let Q=0;Q<E;Q++){let ee=c+Q+C*V,pe=c+Q+C*(V+1),Z=c+(Q+1)+C*(V+1),ie=c+(Q+1)+C*V;o.push(ee,pe,ie),o.push(pe,Z,ie),z+=6}a.addGroup(f,z,S),f+=z,c+=W}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Cs(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class mr extends Tt{constructor(e=1,t=1,n=1,i=1){super();this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};let s=e/2,r=t/2,a=Math.floor(n),o=Math.floor(i),l=a+1,u=o+1,h=e/a,c=t/o,f=[],d=[],_=[],m=[];for(let p=0;p<u;p++){let g=p*c-r;for(let v=0;v<l;v++){let M=v*h-s;d.push(M,-g,0),_.push(0,0,1),m.push(v/a),m.push(1-p/o)}}for(let p=0;p<o;p++)for(let g=0;g<a;g++){let v=g+l*p,M=g+l*(p+1),y=g+1+l*(p+1),b=g+1+l*p;f.push(v,M,b),f.push(M,y,b)}this.setIndex(f),this.setAttribute("position",new Zt(d,3)),this.setAttribute("normal",new Zt(_,3)),this.setAttribute("uv",new Zt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new mr(e.width,e.height,e.widthSegments,e.heightSegments)}}function qi(e){let t={};for(let n in e){t[n]={};for(let i in e[n]){let s=e[n][i];if(uh(s))if(s.isRenderTargetTexture)De("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[n][i]=null;else t[n][i]=s.clone();else if(Array.isArray(s))if(uh(s[0])){let r=[];for(let a=0,o=s.length;a<o;a++)r[a]=s[a].clone();t[n][i]=r}else t[n][i]=s.slice();else t[n][i]=s}}return t}function on(e){let t={};for(let n=0;n<e.length;n++){let i=qi(e[n]);for(let s in i)t[s]=i[s]}return t}function uh(e){return e&&(e.isColor||e.isMatrix3||e.isMatrix4||e.isVector2||e.isVector3||e.isVector4||e.isTexture||e.isQuaternion)}function Ym(e){let t=[];for(let n=0;n<e.length;n++)t.push(e[n].clone());return t}function ic(e){let t=e.getRenderTarget();if(t===null)return e.outputColorSpace;if(t.isXRRenderTarget===!0)return t.texture.colorSpace;return Xe.workingColorSpace}var Aa={clone:qi,merge:on},Zm=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,$m=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class kt extends Xi{constructor(e){super();if(this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Zm,this.fragmentShader=$m,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0)this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=qi(e.uniforms),this.uniformsGroups=Ym(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let i in this.uniforms){let r=this.uniforms[i].value;if(r&&r.isTexture)t.uniforms[i]={type:"t",value:r.toJSON(e).uuid};else if(r&&r.isColor)t.uniforms[i]={type:"c",value:r.getHex()};else if(r&&r.isVector2)t.uniforms[i]={type:"v2",value:r.toArray()};else if(r&&r.isVector3)t.uniforms[i]={type:"v3",value:r.toArray()};else if(r&&r.isVector4)t.uniforms[i]={type:"v4",value:r.toArray()};else if(r&&r.isMatrix3)t.uniforms[i]={type:"m3",value:r.toArray()};else if(r&&r.isMatrix4)t.uniforms[i]={type:"m4",value:r.toArray()};else t.uniforms[i]={value:r}}if(Object.keys(this.defines).length>0)t.defines=this.defines;t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let i in this.extensions)if(this.extensions[i]===!0)n[i]=!0;if(Object.keys(n).length>0)t.extensions=n;return t}fromJSON(e,t){if(super.fromJSON(e,t),e.uniforms!==void 0)for(let n in e.uniforms){let i=e.uniforms[n];switch(this.uniforms[n]={},i.type){case"t":this.uniforms[n].value=t[i.value]||null;break;case"c":this.uniforms[n].value=new Ae().setHex(i.value);break;case"v2":this.uniforms[n].value=new Te().fromArray(i.value);break;case"v3":this.uniforms[n].value=new L().fromArray(i.value);break;case"v4":this.uniforms[n].value=new rt().fromArray(i.value);break;case"m3":this.uniforms[n].value=new Fe().fromArray(i.value);break;case"m4":this.uniforms[n].value=new Pe().fromArray(i.value);break;default:this.uniforms[n].value=i.value}}if(e.defines!==void 0)this.defines=e.defines;if(e.vertexShader!==void 0)this.vertexShader=e.vertexShader;if(e.fragmentShader!==void 0)this.fragmentShader=e.fragmentShader;if(e.glslVersion!==void 0)this.glslVersion=e.glslVersion;if(e.extensions!==void 0)for(let n in e.extensions)this.extensions[n]=e.extensions[n];if(e.lights!==void 0)this.lights=e.lights;if(e.clipping!==void 0)this.clipping=e.clipping;return this}}class sc extends kt{constructor(e){super(e);this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class rc extends Xi{constructor(e){super();this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Ae(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Ae(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new Te(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new si,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Ea extends rc{constructor(e){super();this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new Te(1,1),this.clearcoatNormalMap=null,this.diffuseRoughnessMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return Ue(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+0.4*t)/(1-0.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessMinimum=100,this.iridescenceThicknessMaximum=400,this.iridescenceThicknessMap=null,this.sheenColor=new Ae(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Ae(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Ae(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._diffuseRoughness=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){if(this._anisotropy>0!==e>0)this.version++;this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){if(this._clearcoat>0!==e>0)this.version++;this._clearcoat=e}get diffuseRoughness(){return this._diffuseRoughness}set diffuseRoughness(e){if(this._diffuseRoughness>0!==e>0)this.version++;this._diffuseRoughness=e}get iridescence(){return this._iridescence}set iridescence(e){if(this._iridescence>0!==e>0)this.version++;this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){if(this._dispersion>0!==e>0)this.version++;this._dispersion=e}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(e){if(this._retroreflectivity>0!==e>0)this.version++;this._retroreflectivity=e}get sheen(){return this._sheen}set sheen(e){if(this._sheen>0!==e>0)this.version++;this._sheen=e}get transmission(){return this._transmission}set transmission(e){if(this._transmission>0!==e>0)this.version++;this._transmission=e}get iridescenceThicknessRange(){return Ni('MeshPhysicalMaterial: The "iridescenceThicknessRange" property has been replaced by "iridescenceThicknessMinimum" and "iridescenceThicknessMaximum".'),[this.iridescenceThicknessMinimum,this.iridescenceThicknessMaximum]}set iridescenceThicknessRange(e){Ni('MeshPhysicalMaterial: The "iridescenceThicknessRange" property has been replaced by "iridescenceThicknessMinimum" and "iridescenceThicknessMaximum".'),this.iridescenceThicknessMinimum=e[0],this.iridescenceThicknessMaximum=e[1]}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.diffuseRoughness=e.diffuseRoughness,this.diffuseRoughnessMap=e.diffuseRoughnessMap,this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessMinimum=e.iridescenceThicknessMinimum,this.iridescenceThicknessMaximum=e.iridescenceThicknessMaximum,this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.retroreflectivity=e.retroreflectivity,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}}class ac extends Xi{constructor(e){super();this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=3200,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class oc extends Xi{constructor(e){super();this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}function ms(e,t){if(!e||e.constructor===t)return e;if(typeof t.BYTES_PER_ELEMENT==="number")return new t(e);return Array.prototype.slice.call(e)}function ia(e){return e!==void 0&&e.inTangents!==void 0&&e.outTangents!==void 0}class Yi{constructor(e,t,n,i){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,i=t[n],s=t[n-1];n:{e:{let r;t:{i:if(!(e<i)){for(let a=n+2;;){if(i===void 0){if(e<s)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===a)break;if(s=i,i=t[++n],e<i)break e}r=t.length;break t}if(!(e>=s)){let a=t[1];if(e<a)n=2,s=a;for(let o=n-2;;){if(s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===o)break;if(i=s,s=t[--n-1],e>=s)break e}r=n,n=0;break t}break n}while(n<r){let a=n+r>>>1;if(e<t[a])r=a;else n=a+1}if(i=t[n],s=t[n-1],s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,s,i)}return this.interpolate_(n,s,e,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,s=e*i;for(let r=0;r!==i;++r)t[r]=n[s+r];return t}interpolate_(){throw Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}}class lc extends Yi{constructor(e,t,n,i){super(e,t,n,i);this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:2400,endingEnd:2400}}intervalChanged_(e,t,n){let i=this.parameterPositions,s=e-2,r=e+1,a=i[s],o=i[r];if(a===void 0)switch(this.getSettings_().endingStart){case 2401:s=e,a=2*t-n;break;case 2402:s=i.length-2,a=t+i[s]-i[s+1];break;default:s=e,a=n}if(o===void 0)switch(this.getSettings_().endingEnd){case 2401:r=e,o=2*n-t;break;case 2402:r=1,o=n+i[1]-i[0];break;default:r=e-1,o=t}let l=(n-t)*0.5,u=this.valueSize;this._weightPrev=l/(t-a),this._weightNext=l/(o-n),this._offsetPrev=s*u,this._offsetNext=r*u}interpolate_(e,t,n,i){let s=this.resultBuffer,r=this.sampleValues,a=this.valueSize,o=e*a,l=o-a,u=this._offsetPrev,h=this._offsetNext,c=this._weightPrev,f=this._weightNext,d=(n-t)/(i-t),_=d*d,m=_*d,p=-c*m+2*c*_-c*d,g=(1+c)*m+(-1.5-2*c)*_+(-0.5+c)*d+1,v=(-1-f)*m+(1.5+f)*_+0.5*d,M=f*m-f*_;for(let y=0;y!==a;++y)s[y]=p*r[u+y]+g*r[l+y]+v*r[o+y]+M*r[h+y];return s}}class cc extends Yi{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){let s=this.resultBuffer,r=this.sampleValues,a=this.valueSize,o=e*a,l=o-a,u=(n-t)/(i-t),h=1-u;for(let c=0;c!==a;++c)s[c]=r[l+c]*h+r[o+c]*u;return s}}class uc extends Yi{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e){return this.copySampleValue_(e-1)}}class hc extends Yi{interpolate_(e,t,n,i){let s=this.resultBuffer,r=this.sampleValues,a=this.valueSize,o=e*a,l=o-a,u=this.inTangents,h=this.outTangents;if(!u||!h){let d=(n-t)/(i-t),_=1-d;for(let m=0;m!==a;++m)s[m]=r[l+m]*_+r[o+m]*d;return s}let c=a*2,f=e-1;for(let d=0;d!==a;++d){let _=r[l+d],m=r[o+d],p=f*c+d*2,g=h[p],v=h[p+1],M=e*c+d*2,y=u[M],b=u[M+1],E=Km(n,t,g,y,i);s[d]=gf(E,_,v,b,m)}return s}}function gf(e,t,n,i,s){let r=1-e;return r*r*r*t+3*r*r*e*n+3*r*e*e*i+e*e*e*s}function Jm(e,t,n,i,s){let r=1-e;return 3*r*r*(n-t)+6*r*e*(i-n)+3*e*e*(s-i)}function Km(e,t,n,i,s){let r=(e-t)/(s-t);for(let a=0;a<8;a++){let o=gf(r,t,n,i,s)-e;if(Math.abs(o)<0.0000000001)break;let l=Jm(r,t,n,i,s);if(Math.abs(l)<0.0000000001)break;r=Math.max(0,Math.min(1,r-o/l))}return r}class Rn{constructor(e,t,n,i){if(e===void 0)throw Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=ms(t,this.TimeBufferType),this.values=ms(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:ms(e.times,Array),values:ms(e.values,Array)};let i=e.getInterpolation();if(i!==e.DefaultInterpolation)n.interpolation=i;if(ia(e.settings))n.settings={inTangents:ms(e.settings.inTangents,Array),outTangents:ms(e.settings.outTangents,Array)}}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new uc(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new cc(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new lc(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodBezier(e){let t=new hc(this.times,this.values,this.getValueSize(),e);if(this.settings)t.inTangents=this.settings.inTangents,t.outTangents=this.settings.outTangents;return t}setInterpolation(e){let t;switch(e){case 2300:t=this.InterpolantFactoryMethodDiscrete;break;case 2301:t=this.InterpolantFactoryMethodLinear;break;case 2302:t=this.InterpolantFactoryMethodSmooth;break;case 2303:t=this.InterpolantFactoryMethodBezier;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw Error(n);return De("KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return 2300;case this.InterpolantFactoryMethodLinear:return 2301;case this.InterpolantFactoryMethodSmooth:return 2302;case this.InterpolantFactoryMethodBezier:return 2303}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]+=e;if(ia(this.settings))hh(this.settings.inTangents,e),hh(this.settings.outTangents,e)}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]*=e;if(ia(this.settings))fh(this.settings.inTangents,e),fh(this.settings.outTangents,e)}return this}trim(e,t){let n=this.times,i=n.length,s=0,r=i-1;while(s!==i&&n[s]<e)++s;while(r!==-1&&n[r]>t)--r;if(++r,s!==0||r!==i){if(s>=r)r=Math.max(r,1),s=r-1;let a=this.getValueSize();this.times=n.slice(s,r),this.values=this.values.slice(s*a,r*a)}return this}validate(){let e=!0,t=this.getValueSize();if(t-Math.floor(t)!==0)Ne("KeyframeTrack: Invalid value size in track.",this),e=!1;let n=this.times,i=this.values,s=n.length;if(s===0)Ne("KeyframeTrack: Track is empty.",this),e=!1;let r=null;for(let a=0;a!==s;a++){let o=n[a];if(typeof o==="number"&&isNaN(o)){Ne("KeyframeTrack: Time is not a valid number.",this,a,o),e=!1;break}if(r!==null&&r>o){Ne("KeyframeTrack: Out of order keys.",this,a,o,r),e=!1;break}r=o}if(i!==void 0){if(Mm(i))for(let a=0,o=i.length;a!==o;++a){let l=i[a];if(isNaN(l)){Ne("KeyframeTrack: Value is not a valid number.",this,a,l),e=!1;break}}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===2302,s=e.length-1,r=1;for(let a=1;a<s;++a){let o=!1,l=e[a],u=e[a+1];if(l!==u&&(a!==1||l!==e[0]))if(!i){let h=a*n,c=h-n,f=h+n;for(let d=0;d!==n;++d){let _=t[h+d];if(_!==t[c+d]||_!==t[f+d]){o=!0;break}}}else o=!0;if(o){if(a!==r){e[r]=e[a];let h=a*n,c=r*n;for(let f=0;f!==n;++f)t[c+f]=t[h+f]}++r}}if(s>0){e[r]=e[s];for(let a=s*n,o=r*n,l=0;l!==n;++l)t[o+l]=t[a+l];++r}if(r!==e.length)this.times=e.slice(0,r),this.values=t.slice(0,r*n);else this.times=e,this.values=t;return this}clone(){let e=this.times.slice(),t=this.values.slice(),i=new this.constructor(this.name,e,t);if(i.createInterpolant=this.createInterpolant,ia(this.settings))i.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()};return i}}function hh(e,t){for(let n=0,i=e.length;n!==i;n+=2)e[n]+=t}function fh(e,t){for(let n=0,i=e.length;n!==i;n+=2)e[n]*=t}Rn.prototype.ValueTypeName="";Rn.prototype.TimeBufferType=Float32Array;Rn.prototype.ValueBufferType=Float32Array;Rn.prototype.DefaultInterpolation=2301;class Zi extends Rn{constructor(e,t,n){super(e,t,n)}}Zi.prototype.ValueTypeName="bool";Zi.prototype.ValueBufferType=Array;Zi.prototype.DefaultInterpolation=2300;Zi.prototype.InterpolantFactoryMethodLinear=void 0;Zi.prototype.InterpolantFactoryMethodSmooth=void 0;class fc extends Rn{constructor(e,t,n,i){super(e,t,n,i)}}fc.prototype.ValueTypeName="color";class dc extends Rn{constructor(e,t,n,i){super(e,t,n,i)}}dc.prototype.ValueTypeName="number";class pc extends Yi{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){let s=this.resultBuffer,r=this.sampleValues,a=this.valueSize,o=(n-t)/(i-t),l=e*a;for(let u=l+a;l!==u;l+=4)On.slerpFlat(s,0,r,l-a,r,l,o);return s}}class Ra extends Rn{constructor(e,t,n,i){super(e,t,n,i)}InterpolantFactoryMethodLinear(e){return new pc(this.times,this.values,this.getValueSize(),e)}}Ra.prototype.ValueTypeName="quaternion";Ra.prototype.InterpolantFactoryMethodSmooth=void 0;class $i extends Rn{constructor(e,t,n){super(e,t,n)}}$i.prototype.ValueTypeName="string";$i.prototype.ValueBufferType=Array;$i.prototype.DefaultInterpolation=2300;$i.prototype.InterpolantFactoryMethodLinear=void 0;$i.prototype.InterpolantFactoryMethodSmooth=void 0;class mc extends Rn{constructor(e,t,n,i){super(e,t,n,i)}}mc.prototype.ValueTypeName="vector";var il={enabled:!1,files:{},add:function(e,t){if(this.enabled===!1)return;if(dh(e))return;this.files[e]=t},get:function(e){if(this.enabled===!1)return;if(dh(e))return;return this.files[e]},remove:function(e){delete this.files[e]},clear:function(){this.files={}}};function dh(e){try{let t=e.slice(e.indexOf(":")+1);return new URL(t).protocol==="blob:"}catch(t){return!1}}class gc{constructor(e,t,n){let i=this,s=!1,r=0,a=0,o=void 0,l=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this._abortController=null,this.itemStart=function(u){if(a++,s===!1){if(i.onStart!==void 0)i.onStart(u,r,a)}s=!0},this.itemEnd=function(u){if(r++,i.onProgress!==void 0)i.onProgress(u,r,a);if(r===a){if(s=!1,i.onLoad!==void 0)i.onLoad()}},this.itemError=function(u){if(i.onError!==void 0)i.onError(u)},this.resolveURL=function(u){if(u=u.normalize("NFC"),o)return o(u);return u},this.setURLModifier=function(u){return o=u,this},this.addHandler=function(u,h){return l.push(u,h),this},this.removeHandler=function(u){let h=l.indexOf(u);if(h!==-1)l.splice(h,2);return this},this.getHandler=function(u){for(let h=0,c=l.length;h<c;h+=2){let f=l[h],d=l[h+1];if(f.global)f.lastIndex=0;if(f.test(u))return d}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){if(!this._abortController)this._abortController=new AbortController;return this._abortController}}var xf=new gc;class gr{constructor(e){if(this.manager=e!==void 0?e:xf,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},this.priority="auto",this.cache="default",typeof __THREE_DEVTOOLS__<"u")__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(e,t){let n=this;return new Promise(function(i,s){n.load(e,i,t,s)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}setPriority(e){return this.priority=e,this}setCache(e){return this.cache=e,this}abort(){return this}}gr.DEFAULT_MATERIAL_NAME="__DEFAULT";var ti={};class _f extends Error{constructor(e,t){super(e);this.response=t}}class xc extends gr{constructor(e){super(e);this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,n,i){if(e===void 0)e="";if(this.path!==void 0)e=this.path+e;e=this.manager.resolveURL(e);let s=il.get(`file:${e}`);if(s!==void 0){this.manager.itemStart(e),setTimeout(()=>{if(t)t(s);this.manager.itemEnd(e)},0);return}if(ti[e]!==void 0){ti[e].push({onLoad:t,onProgress:n,onError:i});return}ti[e]=[],ti[e].push({onLoad:t,onProgress:n,onError:i});let r=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",priority:this.priority,cache:this.cache,signal:typeof AbortSignal.any==="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),a=this.mimeType,o=this.responseType;fetch(r).then((l)=>{if(l.status===200||l.status===0){if(l.status===0)De("FileLoader: HTTP Status 0 received.");if(typeof ReadableStream>"u"||l.body===void 0||l.body.getReader===void 0)return l;let u=ti[e],h=l.body.getReader(),c=l.headers.get("X-File-Size")||l.headers.get("Content-Length"),f=c?parseInt(c):0,d=f!==0,_=0,m=new ReadableStream({start(p){g();function g(){h.read().then(({done:v,value:M})=>{if(v)p.close();else{_+=M.byteLength;let y=new ProgressEvent("progress",{lengthComputable:d,loaded:_,total:f});for(let b=0,E=u.length;b<E;b++){let x=u[b];if(x.onProgress)x.onProgress(y)}p.enqueue(M),g()}},(v)=>{p.error(v)})}}});return new Response(m)}else throw new _f(`fetch for "${l.url}" responded with ${l.status}: ${l.statusText}`,l)}).then((l)=>{switch(o){case"arraybuffer":return l.arrayBuffer();case"blob":return l.blob();case"document":return l.text().then((u)=>new DOMParser().parseFromString(u,a));case"json":return l.json();default:if(a==="")return l.text();else{let h=/charset="?([^;"\s]*)"?/i.exec(a),c=h&&h[1]?h[1].toLowerCase():void 0,f=new TextDecoder(c);return l.arrayBuffer().then((d)=>f.decode(d))}}}).then((l)=>{il.add(`file:${e}`,l);let u=ti[e];delete ti[e];for(let h=0,c=u.length;h<c;h++){let f=u[h];if(f.onLoad)f.onLoad(l)}}).catch((l)=>{let u=ti[e];if(u===void 0)throw this.manager.itemError(e),l;delete ti[e];for(let h=0,c=u.length;h<c;h++){let f=u[h];if(f.onError)f.onError(l)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}}class Ca extends gr{constructor(e){super(e)}load(e,t,n,i){let s=this,r=new ht,a=new xc(this.manager);return a.setPriority(this.priority),a.setCache(this.cache),a.setResponseType("arraybuffer"),a.setRequestHeader(this.requestHeader),a.setPath(this.path),a.setWithCredentials(s.withCredentials),a.load(e,function(o){let l;try{l=s.parse(o)}catch(u){if(i!==void 0)i(u);else Ne(u);return}if(s._applyTexData(r,l),t)t(r,l)},n,i),r}createDataTexture(e){let t=new ht;return this._applyTexData(t,this.parse(e)),t}_applyTexData(e,t){if(t.image!==void 0)e.image=t.image;else if(t.data!==void 0)e.image.width=t.width,e.image.height=t.height,e.image.data=t.data;if(e.wrapS=t.wrapS!==void 0?t.wrapS:1001,e.wrapT=t.wrapT!==void 0?t.wrapT:1001,e.magFilter=t.magFilter!==void 0?t.magFilter:1006,e.minFilter=t.minFilter!==void 0?t.minFilter:1006,e.anisotropy=t.anisotropy!==void 0?t.anisotropy:1,t.colorSpace!==void 0)e.colorSpace=t.colorSpace;if(t.flipY!==void 0)e.flipY=t.flipY;if(t.format!==void 0)e.format=t.format;if(t.type!==void 0)e.type=t.type;if(t.mipmaps!==void 0)e.mipmaps=t.mipmaps,e.minFilter=1008;if(t.mipmapCount===1)e.minFilter=1006;if(t.generateMipmaps!==void 0)e.generateMipmaps=t.generateMipmaps;e.needsUpdate=!0}}class Ia extends Jt{static registerNode(e){this.prototype._lightNode=e}constructor(e,t=1){super();this.isLight=!0,this.type="Light",this.color=new Ae(e),this.intensity=t}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,t}}var tl=new Pe,ph=new L,mh=new L;class _c{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Te(512,512),this.mapType=1009,this.map=null,this.mapPass=null,this.matrix=new Pe,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ui,this._frameExtents=new Te(1,1),this._viewportCount=1,this._viewports=[new rt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera;ph.setFromMatrixPosition(e.matrixWorld),t.position.copy(ph),mh.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(mh),t.updateMatrixWorld(),this._updateMatrix(t,this.matrix,this._frustum)}_updateMatrix(e,t,n,i){tl.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),n.setFromProjectionMatrix(tl,e.coordinateSystem,e.reversedDepth);let s=this._frameExtents,r=i?i.z/s.x:1,a=i?i.w/s.y:1,o=i?i.x/s.x:0,l=i?i.y/s.y:0;if(e.coordinateSystem===2001||e.reversedDepth)t.set(0.5*r,0,0,0.5*r+o,0,0.5*a,0,0.5*a+l,0,0,1,0,0,0,0,1);else t.set(0.5*r,0,0,0.5*r+o,0,0.5*a,0,0.5*a+l,0,0,0.5,0.5,0,0,0,1);t.multiply(tl)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){if(this.map)this.map.dispose();if(this.mapPass)this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.mapType=e.mapType,this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return e.intensity=this.intensity,e.bias=this.bias,e.normalBias=this.normalBias,e.radius=this.radius,e.blurSamples=this.blurSamples,e.mapSize=this.mapSize.toArray(),e.mapType=this.mapType,e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}var sa=new L,ra=new On,Hn=new L;class Pa extends Jt{constructor(){super();this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Pe,this.projectionMatrix=new Pe,this.projectionMatrixInverse=new Pe,this.coordinateSystem=2000,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){if(super.updateMatrixWorld(e),this.matrixWorld.decompose(sa,ra,Hn),Hn.x===1&&Hn.y===1&&Hn.z===1)this.matrixWorldInverse.copy(this.matrixWorld).invert();else this.matrixWorldInverse.compose(sa,ra,Hn.set(1,1,1)).invert()}updateWorldMatrix(e,t,n=!1){if(super.updateWorldMatrix(e,t,n),this.matrixWorld.decompose(sa,ra,Hn),Hn.x===1&&Hn.y===1&&Hn.z===1)this.matrixWorldInverse.copy(this.matrixWorld).invert();else this.matrixWorldInverse.compose(sa,ra,Hn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}var gi=new L,gh=new Te,xh=new Te;class Yt extends Pa{constructor(e=50,t=1,n=0.1,i=2000){super();this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=0.5*this.getFilmHeight()/e;this.fov=oa*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(Fo*0.5*this.fov);return 0.5*this.getFilmHeight()/e}getEffectiveFOV(){return oa*2*Math.atan(Math.tan(Fo*0.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){gi.set(-1,-1,0.5).applyMatrix4(this.projectionMatrixInverse),t.set(gi.x,gi.y).multiplyScalar(-e/gi.z),gi.set(1,1,0.5).applyMatrix4(this.projectionMatrixInverse),n.set(gi.x,gi.y).multiplyScalar(-e/gi.z)}getViewSize(e,t){return this.getViewBounds(e,gh,xh),t.subVectors(xh,gh)}setViewOffset(e,t,n,i,s,r){if(this.aspect=e/t,this.view===null)this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1};this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){if(this.view!==null)this.view.enabled=!1;this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(Fo*0.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,s=-0.5*i,r=this.view;if(this.view!==null&&this.view.enabled){let{fullWidth:o,fullHeight:l}=r;s+=r.offsetX*i/o,t-=r.offsetY*n/l,i*=r.width/o,n*=r.height/l}let a=this.filmOffset;if(a!==0)s+=e*a/this.getFilmWidth();this.projectionMatrix.makePerspective(s,s+i,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);if(t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null)t.object.view=Object.assign({},this.view);return t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}class Is extends Pa{constructor(e=-1,t=1,n=1,i=-1,s=0.1,r=2000){super();this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=s,this.far=r,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,s,r){if(this.view===null)this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1};this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){if(this.view!==null)this.view.enabled=!1;this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2,s=n-e,r=n+e,a=i+t,o=i-t;if(this.view!==null&&this.view.enabled){let l=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=l*this.view.offsetX,r=s+l*this.view.width,a-=u*this.view.offsetY,o=a-u*this.view.height}this.projectionMatrix.makeOrthographic(s,r,a,o,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);if(t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null)t.object.view=Object.assign({},this.view);return t}}class vf extends _c{constructor(){super(new Is(-5,5,5,-5,0.5,500));this.isDirectionalLightShadow=!0}}class Da extends Ia{constructor(e,t){super(e,t);this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Jt.DEFAULT_UP),this.updateMatrix(),this.target=new Jt,this.shadow=new vf}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){let t=super.toJSON(e);return t.object.shadow=this.shadow.toJSON(),t.object.target=this.target.uuid,t}}class La extends Ia{constructor(e,t,n=10,i=10){super(e,t);this.isRectAreaLight=!0,this.type="RectAreaLight",this.width=n,this.height=i}get power(){return this.intensity*this.width*this.height*Math.PI}set power(e){this.intensity=e/(this.width*this.height*Math.PI)}copy(e){return super.copy(e),this.width=e.width,this.height=e.height,this}toJSON(e){let t=super.toJSON(e);return t.object.width=this.width,t.object.height=this.height,t}}var gs=-90,xs=1;class xr extends Jt{constructor(e,t,n){super();this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let i=new Yt(gs,xs,e,t);i.layers=this.layers,this.add(i);let s=new Yt(gs,xs,e,t);s.layers=this.layers,this.add(s);let r=new Yt(gs,xs,e,t);r.layers=this.layers,this.add(r);let a=new Yt(gs,xs,e,t);a.layers=this.layers,this.add(a);let o=new Yt(gs,xs,e,t);o.layers=this.layers,this.add(o);let l=new Yt(gs,xs,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,i,s,r,a,o]=t;for(let l of t)this.remove(l);if(e===2000)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),r.up.set(0,0,1),r.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),o.up.set(0,1,0),o.lookAt(0,0,-1);else if(e===2001)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),r.up.set(0,0,-1),r.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),o.up.set(0,-1,0),o.lookAt(0,0,-1);else throw Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let l of t)this.add(l),l.updateMatrixWorld()}update(e,t){if(this.parent===null)this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:i}=this;if(this.coordinateSystem!==e.coordinateSystem)this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem();let[s,r,a,o,l,u]=this.children,h=e.getRenderTarget(),c=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),d=e.xr.enabled;e.xr.enabled=!1;let _=n.texture.mipmapsAutoUpdate;n.texture.mipmapsAutoUpdate=!1;let m=!1;if(e.isWebGLRenderer===!0)m=e.state.buffers.depth.getReversed();else m=e.reversedDepthBuffer;if(e.setRenderTarget(n,0,i),m&&e.autoClear===!1)e.clearDepth();if(e.render(t,s),e.setRenderTarget(n,1,i),m&&e.autoClear===!1)e.clearDepth();if(e.render(t,r),e.setRenderTarget(n,2,i),m&&e.autoClear===!1)e.clearDepth();if(e.render(t,a),e.setRenderTarget(n,3,i),m&&e.autoClear===!1)e.clearDepth();if(e.render(t,o),e.setRenderTarget(n,4,i),m&&e.autoClear===!1)e.clearDepth();if(e.render(t,l),n.texture.mipmapsAutoUpdate=_,e.setRenderTarget(n,5,i),m&&e.autoClear===!1)e.clearDepth();e.render(t,u),e.setRenderTarget(h,c,f),e.xr.enabled=d,n.texture.needsPMREMUpdate=!0}}class vc extends Yt{constructor(e=[]){super();this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e,this.perCameraFrustumCulled=!1}}var yc="\\[\\]\\.:\\/",Qm=new RegExp("["+yc+"]","g"),Sc="[^"+yc+"]",jm="[^"+yc.replace("\\.","")+"]",eg=/((?:WC+[\/:])*)/.source.replace("WC",Sc),tg=/(WCOD+)?/.source.replace("WCOD",jm),ng=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Sc),ig=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Sc),sg=new RegExp("^"+eg+tg+ng+ig+"$"),rg=["material","materials","bones","map"];class yf{constructor(e,t,n){let i=n||ut.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,i)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,i=this._bindings[n];if(i!==void 0)i.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,s=n.length;i!==s;++i)n[i].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}}class ut{constructor(e,t,n){this.path=t,this.parsedPath=n||ut.parseTrackName(t),this.node=ut.findNode(e,this.parsedPath.nodeName),this.rootNode=e,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(e,t,n){if(!(e&&e.isAnimationObjectGroup))return new ut(e,t,n);else return new ut.Composite(e,t,n)}static sanitizeNodeName(e){return e.replace(/\s/g,"_").replace(Qm,"")}static parseTrackName(e){let t=sg.exec(e);if(t===null)throw Error("THREE.PropertyBinding: Cannot parse trackName: "+e);let n={nodeName:t[2],objectName:t[3],objectIndex:t[4],propertyName:t[5],propertyIndex:t[6]},i=n.nodeName&&n.nodeName.lastIndexOf(".");if(i!==void 0&&i!==-1){let s=n.nodeName.substring(i+1);if(rg.indexOf(s)!==-1)n.nodeName=n.nodeName.substring(0,i),n.objectName=s}if(n.propertyName===null||n.propertyName.length===0)throw Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+e);return n}static findNode(e,t){if(t===void 0||t===""||t==="."||t===-1||t===e.name||t===e.uuid)return e;if(e.skeleton){let n=e.skeleton.getBoneByName(t);if(n!==void 0)return n}if(e.children){let n=function(s){for(let r=0;r<s.length;r++){let a=s[r];if(a.name===t||a.uuid===t)return a;let o=n(a.children);if(o)return o}return null},i=n(e.children);if(i)return i}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(e,t){e[t]=this.targetObject[this.propertyName]}_getValue_array(e,t){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)e[t++]=n[i]}_getValue_arrayElement(e,t){e[t]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(e,t){this.resolvedProperty.toArray(e,t)}_setValue_direct(e,t){this.targetObject[this.propertyName]=e[t]}_setValue_direct_setNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(e,t){this.targetObject[this.propertyName]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(e,t){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++]}_setValue_array_setNeedsUpdate(e,t){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(e,t){let n=this.resolvedProperty;for(let i=0,s=n.length;i!==s;++i)n[i]=e[t++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(e,t){this.resolvedProperty[this.propertyIndex]=e[t]}_setValue_arrayElement_setNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty[this.propertyIndex]=e[t],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(e,t){this.resolvedProperty.fromArray(e,t)}_setValue_fromArray_setNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(e,t){this.resolvedProperty.fromArray(e,t),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(e,t){this.bind(),this.getValue(e,t)}_setValue_unbound(e,t){this.bind(),this.setValue(e,t)}bind(){let e=this.node,t=this.parsedPath,{objectName:n,propertyName:i,propertyIndex:s}=t;if(!e)e=ut.findNode(this.rootNode,t.nodeName),this.node=e;if(this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!e){De("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let l=t.objectIndex;switch(n){case"materials":if(!e.material){Ne("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.materials){Ne("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}e=e.material.materials;break;case"bones":if(!e.skeleton){Ne("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}e=e.skeleton.bones;for(let u=0;u<e.length;u++)if(e[u].name===l){l=u;break}break;case"map":if("map"in e){e=e.map;break}if(!e.material){Ne("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!e.material.map){Ne("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}e=e.material.map;break;default:if(e[n]===void 0){Ne("PropertyBinding: Can not bind to objectName of node undefined.",this);return}e=e[n]}if(l!==void 0){if(e[l]===void 0){Ne("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,e);return}e=e[l]}}let r=e[i];if(r===void 0){let l=t.nodeName;Ne("PropertyBinding: Trying to update property for track: "+l+"."+i+" but it wasn't found.",e);return}let a=this.Versioning.None;if(this.targetObject=e,e.isMaterial===!0)a=this.Versioning.NeedsUpdate;else if(e.isObject3D===!0)a=this.Versioning.MatrixWorldNeedsUpdate;let o=this.BindingType.Direct;if(s!==void 0){if(i==="morphTargetInfluences"){if(!e.geometry){Ne("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!e.geometry.morphAttributes){Ne("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}if(e.morphTargetDictionary[s]!==void 0)s=e.morphTargetDictionary[s]}o=this.BindingType.ArrayElement,this.resolvedProperty=r,this.propertyIndex=s}else if(r.fromArray!==void 0&&r.toArray!==void 0)o=this.BindingType.HasFromToArray,this.resolvedProperty=r;else if(Array.isArray(r))o=this.BindingType.EntireArray,this.resolvedProperty=r;else this.propertyName=i;this.getValue=this.GetterByBindingType[o],this.setValue=this.SetterByBindingTypeAndVersioning[o][a]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}ut.Composite=yf;ut.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};ut.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};ut.prototype.GetterByBindingType=[ut.prototype._getValue_direct,ut.prototype._getValue_array,ut.prototype._getValue_arrayElement,ut.prototype._getValue_toArray];ut.prototype.SetterByBindingTypeAndVersioning=[[ut.prototype._setValue_direct,ut.prototype._setValue_direct_setNeedsUpdate,ut.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[ut.prototype._setValue_array,ut.prototype._setValue_array_setNeedsUpdate,ut.prototype._setValue_array_setMatrixWorldNeedsUpdate],[ut.prototype._setValue_arrayElement,ut.prototype._setValue_arrayElement_setNeedsUpdate,ut.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[ut.prototype._setValue_fromArray,ut.prototype._setValue_fromArray_setNeedsUpdate,ut.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var fS=new Float32Array(1);class Fa{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1,De("Clock: This module has been deprecated. Please use THREE.Timer instead.")}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){let t=performance.now();e=(t-this.oldTime)/1000,this.oldTime=t,this.elapsedTime+=e}return e}}class Na{constructor(e=1,t=0,n=0){this.radius=e,this.phi=t,this.theta=n}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Ue(this.phi,0.000001,Math.PI-0.000001),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){if(this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0)this.theta=0,this.phi=0;else this.theta=Math.atan2(e,n),this.phi=Math.acos(Ue(t/this.radius,-1,1));return this}clone(){return new this.constructor().copy(this)}}class Sf{static{this.prototype.isMatrix2=!0}constructor(e,t,n,i){if(this.elements=[1,0,0,1],e!==void 0)this.set(e,t,n,i)}identity(){return this.set(1,0,0,1),this}fromArray(e,t=0){for(let n=0;n<4;n++)this.elements[n]=e[n+t];return this}set(e,t,n,i){let s=this.elements;return s[0]=e,s[2]=t,s[1]=n,s[3]=i,this}}var _h=new L,aa=new L,_s=new L,vs=new L,nl=new L,ag=new L,og=new L;class vn{constructor(e=new L,t=new L){this.start=e,this.end=t}set(e,t){return this.start.copy(e),this.end.copy(t),this}copy(e){return this.start.copy(e.start),this.end.copy(e.end),this}getCenter(e){return e.addVectors(this.start,this.end).multiplyScalar(0.5)}delta(e){return e.subVectors(this.end,this.start)}distanceSq(){return this.start.distanceToSquared(this.end)}distance(){return this.start.distanceTo(this.end)}at(e,t){return this.delta(t).multiplyScalar(e).add(this.start)}closestPointToPointParameter(e,t){_h.subVectors(e,this.start),aa.subVectors(this.end,this.start);let n=aa.dot(aa);if(n===0)return 0;let s=aa.dot(_h)/n;if(t)s=Ue(s,0,1);return s}closestPointToPoint(e,t,n){let i=this.closestPointToPointParameter(e,t);return this.delta(n).multiplyScalar(i).add(this.start)}distanceSqToLine3(e,t=ag,n=og){let s,r,a=this.start,o=e.start,l=this.end,u=e.end;_s.subVectors(l,a),vs.subVectors(u,o),nl.subVectors(a,o);let h=_s.dot(_s),c=vs.dot(vs),f=vs.dot(nl);if(h<=0.00000000000000010000000000000001&&c<=0.00000000000000010000000000000001)return t.copy(a),n.copy(o),t.distanceToSquared(n);if(h<=0.00000000000000010000000000000001)s=0,r=f/c,r=Ue(r,0,1);else{let d=_s.dot(nl);if(c<=0.00000000000000010000000000000001)r=0,s=Ue(-d/h,0,1);else{let _=_s.dot(vs),m=h*c-_*_;if(m!==0)s=Ue((_*f-d*c)/m,0,1);else s=0;if(r=(_*s+f)/c,r<0)r=0,s=Ue(-d/h,0,1);else if(r>1)r=1,s=Ue((_-d)/h,0,1)}}return t.copy(a).addScaledVector(_s,s),n.copy(o).addScaledVector(vs,r),t.distanceToSquared(n)}applyMatrix4(e){return this.start.applyMatrix4(e),this.end.applyMatrix4(e),this}equals(e){return e.start.equals(this.start)&&e.end.equals(this.end)}clone(){return new this.constructor().copy(this)}}function Mc(e,t,n,i){let s=lg(i);switch(n){case 1021:return e*t;case 1028:return e*t/s.components*s.byteLength;case 1029:return e*t/s.components*s.byteLength;case 1030:return e*t*2/s.components*s.byteLength;case 1031:return e*t*2/s.components*s.byteLength;case 1022:return e*t*3/s.components*s.byteLength;case 1023:return e*t*4/s.components*s.byteLength;case 1033:return e*t*4/s.components*s.byteLength;case 33776:case 33777:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case 33778:case 33779:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case 35841:case 35843:return Math.max(e,16)*Math.max(t,8)/4;case 35840:case 35842:return Math.max(e,8)*Math.max(t,8)/2;case 36196:case 37492:case 37488:case 37489:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*8;case 37496:case 37490:case 37491:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case 37808:return Math.floor((e+3)/4)*Math.floor((t+3)/4)*16;case 37809:return Math.floor((e+4)/5)*Math.floor((t+3)/4)*16;case 37810:return Math.floor((e+4)/5)*Math.floor((t+4)/5)*16;case 37811:return Math.floor((e+5)/6)*Math.floor((t+4)/5)*16;case 37812:return Math.floor((e+5)/6)*Math.floor((t+5)/6)*16;case 37813:return Math.floor((e+7)/8)*Math.floor((t+4)/5)*16;case 37814:return Math.floor((e+7)/8)*Math.floor((t+5)/6)*16;case 37815:return Math.floor((e+7)/8)*Math.floor((t+7)/8)*16;case 37816:return Math.floor((e+9)/10)*Math.floor((t+4)/5)*16;case 37817:return Math.floor((e+9)/10)*Math.floor((t+5)/6)*16;case 37818:return Math.floor((e+9)/10)*Math.floor((t+7)/8)*16;case 37819:return Math.floor((e+9)/10)*Math.floor((t+9)/10)*16;case 37820:return Math.floor((e+11)/12)*Math.floor((t+9)/10)*16;case 37821:return Math.floor((e+11)/12)*Math.floor((t+11)/12)*16;case 36492:case 36494:case 36495:return Math.ceil(e/4)*Math.ceil(t/4)*16;case 36283:case 36284:return Math.ceil(e/4)*Math.ceil(t/4)*8;case 36285:case 36286:return Math.ceil(e/4)*Math.ceil(t/4)*16}throw Error(`Unable to determine texture byte length for ${n} format.`)}function lg(e){switch(e){case 1009:case 1010:return{byteLength:1,components:1};case 1012:case 1011:case 1016:return{byteLength:2,components:1};case 1017:case 1018:return{byteLength:2,components:4};case 1014:case 1013:case 1015:return{byteLength:4,components:1};case 35902:case 35899:return{byteLength:4,components:3}}throw Error(`THREE.TextureUtils: Unknown texture type ${e}.`)}if(typeof __THREE_DEVTOOLS__<"u")__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"187"}}));if(typeof window<"u")if(window.__THREE__)De("WARNING: Multiple instances of Three.js being imported.");else window.__THREE__="187";function Wf(){let e=null,t=!1,n=null,i=null;function s(r,a){i=e.requestAnimationFrame(s),n(r,a)}return{start:function(){if(t===!0)return;if(n===null)return;if(e===null)return;i=e.requestAnimationFrame(s),t=!0},stop:function(){if(e!==null)e.cancelAnimationFrame(i);t=!1},setAnimationLoop:function(r){n=r},setContext:function(r){e=r}}}function cg(e){let t=new WeakMap;function n(o,l){let{array:u,usage:h}=o,c=u.byteLength,f=e.createBuffer();e.bindBuffer(l,f),e.bufferData(l,u,h),o.onUploadCallback();let d;if(u instanceof Float32Array)d=e.FLOAT;else if(typeof Float16Array<"u"&&u instanceof Float16Array)d=e.HALF_FLOAT;else if(u instanceof Uint16Array)if(o.isFloat16BufferAttribute)d=e.HALF_FLOAT;else d=e.UNSIGNED_SHORT;else if(u instanceof Int16Array)d=e.SHORT;else if(u instanceof Uint32Array)d=e.UNSIGNED_INT;else if(u instanceof Int32Array)d=e.INT;else if(u instanceof Int8Array)d=e.BYTE;else if(u instanceof Uint8Array)d=e.UNSIGNED_BYTE;else if(u instanceof Uint8ClampedArray)d=e.UNSIGNED_BYTE;else throw Error("THREE.WebGLAttributes: Unsupported buffer data format: "+u);return{buffer:f,type:d,bytesPerElement:u.BYTES_PER_ELEMENT,version:o.version,size:c}}function i(o,l,u){let{array:h,updateRanges:c}=l;if(e.bindBuffer(u,o),c.length===0)e.bufferSubData(u,0,h);else{c.sort((d,_)=>d.start-_.start);let f=0;for(let d=1;d<c.length;d++){let _=c[f],m=c[d];if(m.start<=_.start+_.count+1)_.count=Math.max(_.count,m.start+m.count-_.start);else++f,c[f]=m}c.length=f+1;for(let d=0,_=c.length;d<_;d++){let m=c[d];e.bufferSubData(u,m.start*h.BYTES_PER_ELEMENT,h,m.start,m.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){if(o.isInterleavedBufferAttribute)o=o.data;return t.get(o)}function r(o){if(o.isInterleavedBufferAttribute)o=o.data;let l=t.get(o);if(l)e.deleteBuffer(l.buffer),t.delete(o)}function a(o,l){if(o.isInterleavedBufferAttribute)o=o.data;if(o.isGLBufferAttribute){let h=t.get(o);if(!h||h.version<o.version)t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let u=t.get(o);if(u===void 0)t.set(o,n(o,l));else if(u.version<o.version){if(u.size!==o.array.byteLength)throw Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(u.buffer,o,l),u.version=o.version}}return{get:s,remove:r,update:a}}var ug=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,hg=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,fg=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,dg=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,pg=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,mg=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,gg=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,xg=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,_g=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,vg=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,yg=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Sg=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Mg=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,bg=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Tg=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,wg=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Ag=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Eg=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Rg=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Cg=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Ig=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Pg=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Dg=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,Lg=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Fg=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,Ng=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Ug=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Og=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Bg=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,zg="gl_FragColor = linearToOutputTexel( gl_FragColor );",kg=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Hg=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,Gg=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	uniform samplerCube envMap;
	#ifdef ENVMAP_TYPE_PMREM
		float roughnessToMip( const in float roughness ) {
			float r = clamp( roughness, 0.0, 1.0 );
			return ENVMAP_MAX_LOD * r * ( 2.0 - r );
		}
	#endif
#endif`,Wg=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Vg=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Xg=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,qg=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Yg=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Zg=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,$g=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Jg=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Kg=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Qg=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,jg=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,e0=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,t0=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * worldNormal, ENVMAP_MAX_LOD );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * reflectVec, roughnessToMip( roughness ) );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureLod( envMap, envMapRotation * retroVec, roughnessToMip( roughness ) );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_PMREM
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,n0=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,i0=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,s0=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,r0=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,a0=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.045 );
material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef USE_DIFFUSE_ROUGHNESS
	float diffuseRoughnessFactor = diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		diffuseRoughnessFactor *= texture2D( diffuseRoughnessMap, vDiffuseRoughnessMapUv ).r;
	#endif
	material.diffuseRoughness = saturate( diffuseRoughnessFactor );
#endif
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.045 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,o0=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float diffuseRoughness;
	#endif
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
#ifdef USE_DIFFUSE_ROUGHNESS
	const float EON_EPSILON = 1e-7;
	float FON_DirectionalAlbedo( const in float mu, const in float roughness, const in float A ) {
		float muComp = 1.0 - mu;
		float gOverPi = muComp * ( 0.0571085289 + muComp * ( 0.491881867 + muComp * ( - 0.332181442 + muComp * 0.0714429953 ) ) );
		return A * ( 1.0 + roughness * gOverPi );
	}
	vec3 BRDF_EON( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 diffuseColor, const in float roughness ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return BRDF_Lambert( rho );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float s = dot( lightDir, viewDir ) - dotNL * dotNV;
		float sOverT = ( s > 0.0 ) ? s / max( max( dotNL, dotNV ), EON_EPSILON ) : s;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		vec3 singleScatter = rho * RECIPROCAL_PI * A * ( 1.0 + roughness * sOverT );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		float albedoV = FON_DirectionalAlbedo( dotNV, roughness, A );
		float albedoL = FON_DirectionalAlbedo( dotNL, roughness, A );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		vec3 multiScatter = rhoMultiScatter * RECIPROCAL_PI
			* max( EON_EPSILON, 1.0 - albedoV )
			* max( EON_EPSILON, 1.0 - albedoL )
			/ max( EON_EPSILON, 1.0 - averageAlbedo );
		return singleScatter + multiScatter;
	}
	vec3 EON_DirectionalAlbedo( const in vec3 diffuseColor, const in float roughness, const in float dotNV ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return rho;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		float directionalAlbedo = FON_DirectionalAlbedo( dotNV, roughness, A );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		return rho * directionalAlbedo + rhoMultiScatter * ( 1.0 - directionalAlbedo );
	}
#endif
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = max( material.clearcoatRoughness, 0.045 );
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = max( material.roughness, 0.045 );
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float alphaT = max( material.alphaT, alpha );
		float V = V_GGX_SmithCorrelated_Anisotropic( alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		vec3 diffuseBRDF = BRDF_EON( directLight.direction, geometryViewDir, geometryNormal, material.diffuseColor, material.diffuseRoughness ) * ( 1.0 - material.metalness );
	#else
		vec3 diffuseBRDF = BRDF_Lambert( material.diffuseContribution );
	#endif
	reflectedLight.directDiffuse += irradiance * diffuseBRDF * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuseAlbedo = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness );
		vec3 diffuse = irradiance * RECIPROCAL_PI * diffuseAlbedo * ( 1.0 - singleScattering - multiScattering );
	#else
		vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#endif
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuse = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness ) * ( 1.0 - totalScatteringDielectric );
	#else
		vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	#endif
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,l0=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_LIGHT_PROBE_GRIDS > 0
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		int probeGrid = - 1;
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( isInsideLightProbeGrid( probeWorldPos, probeWorldNormal, probesMin[ i ], probesMax[ i ], probesResolution[ i ] ) ) probeGrid = UNROLLED_LOOP_INDEX;
		}
		#pragma unroll_loop_end
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( probeGrid == UNROLLED_LOOP_INDEX ) irradiance += getLightProbeGridIrradiance( probesSH[ i ], probesMin[ i ], probesMax[ i ], probesResolution[ i ], probeWorldPos, probeWorldNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,c0=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_PMREM )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,u0=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,h0=`#if NUM_LIGHT_PROBE_GRIDS > 0
uniform highp sampler3D probesSH[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMin[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMax[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesResolution[ NUM_LIGHT_PROBE_GRIDS ];
bool isInsideLightProbeGrid( vec3 worldPos, vec3 worldNormal, vec3 probesMin, vec3 probesMax, vec3 probesResolution ) {
	vec3 spacing = ( probesMax - probesMin ) / probesResolution;
	vec3 samplePos = worldPos + worldNormal * spacing * 0.5;
	vec3 margin = spacing * 0.01;
	return all( greaterThanEqual( samplePos, probesMin - margin ) ) && all( lessThanEqual( samplePos, probesMax + margin ) );
}
vec3 getLightProbeGridIrradiance( highp sampler3D probesSH, vec3 probesMin, vec3 probesMax, vec3 probesResolution, vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 probeSpacing = gridRange / res;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.5 / res, 1.0 - 0.5 / res );
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,f0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,d0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,p0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,m0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,g0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,x0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,_0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,v0=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,y0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,S0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,M0=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,b0=`#if defined( USE_MORPHCOLORS )
	#if defined( USE_COLOR_ALPHA )
		vColor *= morphTargetBaseInfluence;
	#elif defined( USE_COLOR )
		vColor.rgb *= morphTargetBaseInfluence;
	#endif
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor.rgb += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,T0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,w0=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,A0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,E0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,R0=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,C0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,I0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,P0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,D0=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,L0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,F0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,N0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,U0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,O0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,B0=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,z0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,k0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,H0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,G0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,W0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,V0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,X0=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				vec2 radius = shadowRadius * texelSize;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float lightDistance = length( lightToPosition );
			float depthRange = shadowCameraFar - shadowCameraNear;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float depthA = - shadowCameraNear / depthRange - shadowBias;
				float depthB = shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#else
				float depthA = shadowCameraFar / depthRange + shadowBias;
				float depthB = - shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			shadow = 0.0;
			for ( int i = 0; i < 5; i ++ ) {
				vec2 offset = vogelDiskSample( i, 5, phi );
				vec3 direction = bd3D + ( tangent * offset.x + bitangent * offset.y ) * texelSize;
				vec3 absDirection = abs( direction );
				float dp = depthA + depthB / max( max( absDirection.x, absDirection.y ), absDirection.z );
				shadow += texture( shadowMap, vec4( direction, dp ) );
			}
			shadow *= 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,q0=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Y0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Z0=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,$0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,J0=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,K0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Q0=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,j0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,ex=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tx=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,nx=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,ix=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,sx=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,rx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,ax=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	uniform mat3 diffuseRoughnessMapTransform;
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,ox=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	vDiffuseRoughnessMapUv = ( diffuseRoughnessMapTransform * vec3( DIFFUSE_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`;var lx=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,cx=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,ux=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,hx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,fx=`uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <envmap_common_pars_fragment>
void main() {
	#ifdef ENVMAP_TYPE_PMREM
		vec4 texColor = textureLod( envMap, backgroundRotation * vWorldDirection, roughnessToMip( backgroundBlurriness ) );
	#else
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,dx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,px=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,mx=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,gx=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,xx=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,_x=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,vx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,yx=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Sx=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Mx=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,bx=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Tx=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,wx=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Ax=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Ex=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Rx=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Cx=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Ix=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Px=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Dx=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Lx=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Fx=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DIFFUSE_ROUGHNESS
	uniform float diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		uniform sampler2D diffuseRoughnessMap;
	#endif
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Nx=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Ux=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Ox=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Bx=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,zx=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,kx=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Hx=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Gx=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,We={alphahash_fragment:ug,alphahash_pars_fragment:hg,alphamap_fragment:fg,alphamap_pars_fragment:dg,alphatest_fragment:pg,alphatest_pars_fragment:mg,aomap_fragment:gg,aomap_pars_fragment:xg,batching_pars_vertex:_g,batching_vertex:vg,begin_vertex:yg,beginnormal_vertex:Sg,bsdfs:Mg,iridescence_fragment:bg,bumpmap_pars_fragment:Tg,clipping_planes_fragment:wg,clipping_planes_pars_fragment:Ag,clipping_planes_pars_vertex:Eg,clipping_planes_vertex:Rg,color_fragment:Cg,color_pars_fragment:Ig,color_pars_vertex:Pg,color_vertex:Dg,common:Lg,defaultnormal_vertex:Fg,displacementmap_pars_vertex:Ng,displacementmap_vertex:Ug,emissivemap_fragment:Og,emissivemap_pars_fragment:Bg,colorspace_fragment:zg,colorspace_pars_fragment:kg,envmap_fragment:Hg,envmap_common_pars_fragment:Gg,envmap_pars_fragment:Wg,envmap_pars_vertex:Vg,envmap_physical_pars_fragment:t0,envmap_vertex:Xg,fog_vertex:qg,fog_pars_vertex:Yg,fog_fragment:Zg,fog_pars_fragment:$g,gradientmap_pars_fragment:Jg,lightmap_pars_fragment:Kg,lights_lambert_fragment:Qg,lights_lambert_pars_fragment:jg,lights_pars_begin:e0,lights_toon_fragment:n0,lights_toon_pars_fragment:i0,lights_phong_fragment:s0,lights_phong_pars_fragment:r0,lights_physical_fragment:a0,lights_physical_pars_fragment:o0,lights_fragment_begin:l0,lights_fragment_maps:c0,lights_fragment_end:u0,lightprobes_pars_fragment:h0,logdepthbuf_fragment:f0,logdepthbuf_pars_fragment:d0,logdepthbuf_pars_vertex:p0,logdepthbuf_vertex:m0,map_fragment:g0,map_pars_fragment:x0,map_particle_fragment:_0,map_particle_pars_fragment:v0,metalnessmap_fragment:y0,metalnessmap_pars_fragment:S0,morphinstance_vertex:M0,morphcolor_vertex:b0,morphnormal_vertex:T0,morphtarget_pars_vertex:w0,morphtarget_vertex:A0,normal_fragment_begin:E0,normal_fragment_maps:R0,normal_pars_fragment:C0,normal_pars_vertex:I0,normal_vertex:P0,normalmap_pars_fragment:D0,clearcoat_normal_fragment_begin:L0,clearcoat_normal_fragment_maps:F0,clearcoat_pars_fragment:N0,iridescence_pars_fragment:U0,opaque_fragment:O0,packing:B0,premultiplied_alpha_fragment:z0,project_vertex:k0,dithering_fragment:H0,dithering_pars_fragment:G0,roughnessmap_fragment:W0,roughnessmap_pars_fragment:V0,shadowmap_pars_fragment:X0,shadowmap_pars_vertex:q0,shadowmap_vertex:Y0,shadowmask_pars_fragment:Z0,skinbase_vertex:$0,skinning_pars_vertex:J0,skinning_vertex:K0,skinnormal_vertex:Q0,specularmap_fragment:j0,specularmap_pars_fragment:ex,tonemapping_fragment:tx,tonemapping_pars_fragment:nx,transmission_fragment:ix,transmission_pars_fragment:sx,uv_pars_fragment:rx,uv_pars_vertex:ax,uv_vertex:ox,worldpos_vertex:lx,background_vert:cx,background_frag:ux,backgroundCube_vert:hx,backgroundCube_frag:fx,cube_vert:dx,cube_frag:px,depth_vert:mx,depth_frag:gx,distance_vert:xx,distance_frag:_x,equirect_vert:vx,equirect_frag:yx,linedashed_vert:Sx,linedashed_frag:Mx,meshbasic_vert:bx,meshbasic_frag:Tx,meshlambert_vert:wx,meshlambert_frag:Ax,meshmatcap_vert:Ex,meshmatcap_frag:Rx,meshnormal_vert:Cx,meshnormal_frag:Ix,meshphong_vert:Px,meshphong_frag:Dx,meshphysical_vert:Lx,meshphysical_frag:Fx,meshtoon_vert:Nx,meshtoon_frag:Ux,points_vert:Ox,points_frag:Bx,shadow_vert:zx,shadow_frag:kx,sprite_vert:Hx,sprite_frag:Gx},de={common:{diffuse:{value:new Ae(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Fe},alphaMap:{value:null},alphaMapTransform:{value:new Fe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Fe}},envmap:{envMap:{value:null},envMapRotation:{value:new Fe},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:0.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Fe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Fe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Fe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Fe},normalScale:{value:new Te(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Fe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Fe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Fe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Fe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:0.00025},fogNear:{value:1},fogFar:{value:2000},fogColor:{value:new Ae(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:[]},probesMin:{value:[]},probesMax:{value:[]},probesResolution:{value:[]}},points:{diffuse:{value:new Ae(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Fe},alphaTest:{value:0},uvTransform:{value:new Fe}},sprite:{diffuse:{value:new Ae(16777215)},opacity:{value:1},center:{value:new Te(0.5,0.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Fe},alphaMap:{value:null},alphaMapTransform:{value:new Fe},alphaTest:{value:0}}},Vn={basic:{uniforms:on([de.common,de.specularmap,de.envmap,de.aomap,de.lightmap,de.fog]),vertexShader:We.meshbasic_vert,fragmentShader:We.meshbasic_frag},lambert:{uniforms:on([de.common,de.specularmap,de.envmap,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.fog,de.lights,{emissive:{value:new Ae(0)},envMapIntensity:{value:1}}]),vertexShader:We.meshlambert_vert,fragmentShader:We.meshlambert_frag},phong:{uniforms:on([de.common,de.specularmap,de.envmap,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.fog,de.lights,{emissive:{value:new Ae(0)},specular:{value:new Ae(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:We.meshphong_vert,fragmentShader:We.meshphong_frag},standard:{uniforms:on([de.common,de.envmap,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.roughnessmap,de.metalnessmap,de.fog,de.lights,{emissive:{value:new Ae(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:We.meshphysical_vert,fragmentShader:We.meshphysical_frag},toon:{uniforms:on([de.common,de.aomap,de.lightmap,de.emissivemap,de.bumpmap,de.normalmap,de.displacementmap,de.gradientmap,de.fog,de.lights,{emissive:{value:new Ae(0)}}]),vertexShader:We.meshtoon_vert,fragmentShader:We.meshtoon_frag},matcap:{uniforms:on([de.common,de.bumpmap,de.normalmap,de.displacementmap,de.fog,{matcap:{value:null}}]),vertexShader:We.meshmatcap_vert,fragmentShader:We.meshmatcap_frag},points:{uniforms:on([de.points,de.fog]),vertexShader:We.points_vert,fragmentShader:We.points_frag},dashed:{uniforms:on([de.common,de.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:We.linedashed_vert,fragmentShader:We.linedashed_frag},depth:{uniforms:on([de.common,de.displacementmap]),vertexShader:We.depth_vert,fragmentShader:We.depth_frag},normal:{uniforms:on([de.common,de.bumpmap,de.normalmap,de.displacementmap,{opacity:{value:1}}]),vertexShader:We.meshnormal_vert,fragmentShader:We.meshnormal_frag},sprite:{uniforms:on([de.sprite,de.fog]),vertexShader:We.sprite_vert,fragmentShader:We.sprite_frag},background:{uniforms:{uvTransform:{value:new Fe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:We.background_vert,fragmentShader:We.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Fe}},vertexShader:We.backgroundCube_vert,fragmentShader:We.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:We.cube_vert,fragmentShader:We.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:We.equirect_vert,fragmentShader:We.equirect_frag},distance:{uniforms:on([de.common,de.displacementmap,{referencePosition:{value:new L},nearDistance:{value:1},farDistance:{value:1000}}]),vertexShader:We.distance_vert,fragmentShader:We.distance_frag},shadow:{uniforms:on([de.lights,de.fog,{color:{value:new Ae(0)},opacity:{value:1}}]),vertexShader:We.shadow_vert,fragmentShader:We.shadow_frag}};Vn.physical={uniforms:on([Vn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Fe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Fe},clearcoatNormalScale:{value:new Te(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Fe},diffuseRoughness:{value:0},diffuseRoughnessMap:{value:null},diffuseRoughnessMapTransform:{value:new Fe},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Fe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Fe},sheen:{value:0},sheenColor:{value:new Ae(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Fe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Fe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Fe},transmissionSamplerSize:{value:new Te},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Fe},attenuationDistance:{value:0},attenuationColor:{value:new Ae(0)},specularColor:{value:new Ae(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Fe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Fe},anisotropyVector:{value:new Te},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Fe}}]),vertexShader:We.meshphysical_vert,fragmentShader:We.meshphysical_frag};var Ua={r:0,b:0,g:0},Wx=new Pe,Vf=new Fe;Vf.set(-1,0,0,0,1,0,0,0,1);function Vx(e,t,n,i,s,r){let a=new Ae(0),o=s===!0?0:1,l,u,h=null,c=0,f=null;function d(v){let M=v.isScene===!0?v.background:null;if(M&&M.isTexture){let y=v.backgroundBlurriness>0;M=t.get(M,y)}return M}function _(v){let M=!1,y=d(v);if(y===null)p(a,o);else if(y&&y.isColor)p(y,1),M=!0;let b=e.xr.getEnvironmentBlendMode();if(b==="additive")n.buffers.color.setClear(0,0,0,1,r);else if(b==="alpha-blend")n.buffers.color.setClear(0,0,0,0,r);if(e.autoClear||M)n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil)}function m(v,M){let y=d(M);if(y&&y.isCubeTexture){if(u===void 0)u=new dn(new Cs(1,1,1),new kt({name:"BackgroundCubeMaterial",uniforms:qi(Vn.backgroundCube.uniforms),vertexShader:Vn.backgroundCube.vertexShader,fragmentShader:Vn.backgroundCube.fragmentShader,side:Ut,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(b,E,x){this.matrixWorld.copyPosition(x.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(u);if(u.material.uniforms.envMap.value=y,u.material.uniforms.backgroundBlurriness.value=M.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(Wx.makeRotationFromEuler(M.backgroundRotation)).transpose(),y.isRenderTargetTexture===!1)u.material.uniforms.backgroundRotation.value.premultiply(Vf);if(u.material.toneMapped=Xe.getTransfer(y.colorSpace)!==xt,h!==y||c!==y.version||f!==e.toneMapping)u.material.needsUpdate=!0,h=y,c=y.version,f=e.toneMapping;u.layers.enableAll(),v.unshift(u,u.geometry,u.material,0,0,null)}else if(y&&y.isTexture){if(l===void 0)l=new dn(new mr(2,2),new kt({name:"BackgroundMaterial",uniforms:qi(Vn.background.uniforms),vertexShader:Vn.background.vertexShader,fragmentShader:Vn.background.fragmentShader,side:Tn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l);if(l.material.uniforms.t2D.value=y,l.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,l.material.toneMapped=Xe.getTransfer(y.colorSpace)!==xt,y.matrixAutoUpdate===!0)y.updateMatrix();if(l.material.uniforms.uvTransform.value.copy(y.matrix),h!==y||c!==y.version||f!==e.toneMapping)l.material.needsUpdate=!0,h=y,c=y.version,f=e.toneMapping;l.layers.enableAll(),v.unshift(l,l.geometry,l.material,0,0,null)}}function p(v,M){v.getRGB(Ua,ic(e)),n.buffers.color.setClear(Ua.r,Ua.g,Ua.b,M,r)}function g(){if(u!==void 0)u.geometry.dispose(),u.material.dispose(),u=void 0;if(l!==void 0)l.geometry.dispose(),l.material.dispose(),l=void 0}return{getClearColor:function(){return a},setClearColor:function(v,M=1){a.set(v),o=M,p(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(v){o=v,p(a,o)},render:_,addToRenderList:m,dispose:g}}function Xx(e,t){let n=e.getParameter(e.MAX_VERTEX_ATTRIBS),i={},s=f(null),r=s,a=!1;function o(R,I,F,C,O){let W=!1,z=c(R,C,F,I);if(r!==z)r=z,u(r.object);if(W=d(R,C,F,O),W)_(R,C,F,O);if(O!==null)t.update(O,e.ELEMENT_ARRAY_BUFFER);if(W||a){if(a=!1,y(R,I,F,C),O!==null)e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,t.get(O).buffer)}}function l(){return e.createVertexArray()}function u(R){return e.bindVertexArray(R)}function h(R){return e.deleteVertexArray(R)}function c(R,I,F,C){let O=C.wireframe===!0,W=i[I.id];if(W===void 0)W={},i[I.id]=W;let z=R.isInstancedMesh===!0?R.id:0,te=W[z];if(te===void 0)te={},W[z]=te;let V=te[F.id];if(V===void 0)V={},te[F.id]=V;let Q=V[O];if(Q===void 0)Q=f(l()),V[O]=Q;return Q}function f(R){let I=[],F=[],C=[];for(let O=0;O<n;O++)I[O]=0,F[O]=0,C[O]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:I,enabledAttributes:F,attributeDivisors:C,object:R,attributes:{},index:null}}function d(R,I,F,C){let O=r.attributes,W=I.attributes,z=0,te=F.getAttributes();for(let V in te)if(te[V].location>=0){let ee=O[V],pe=W[V];if(pe===void 0){if(V==="instanceMatrix"&&R.instanceMatrix)pe=R.instanceMatrix;if(V==="instanceColor"&&R.instanceColor)pe=R.instanceColor}if(ee===void 0)return!0;if(ee.attribute!==pe)return!0;if(pe&&ee.data!==pe.data)return!0;z++}if(r.attributesNum!==z)return!0;if(r.index!==C)return!0;return!1}function _(R,I,F,C){let O={},W=I.attributes,z=0,te=F.getAttributes();for(let V in te)if(te[V].location>=0){let ee=W[V];if(ee===void 0){if(V==="instanceMatrix"&&R.instanceMatrix)ee=R.instanceMatrix;if(V==="instanceColor"&&R.instanceColor)ee=R.instanceColor}let pe={};if(pe.attribute=ee,ee&&ee.data)pe.data=ee.data;O[V]=pe,z++}r.attributes=O,r.attributesNum=z,r.index=C}function m(){let R=r.newAttributes;for(let I=0,F=R.length;I<F;I++)R[I]=0}function p(R){g(R,0)}function g(R,I){let F=r.newAttributes,C=r.enabledAttributes,O=r.attributeDivisors;if(F[R]=1,C[R]===0)e.enableVertexAttribArray(R),C[R]=1;if(O[R]!==I)e.vertexAttribDivisor(R,I),O[R]=I}function v(){let R=r.newAttributes,I=r.enabledAttributes;for(let F=0,C=I.length;F<C;F++)if(I[F]!==R[F])e.disableVertexAttribArray(F),I[F]=0}function M(R,I,F,C,O,W,z){if(z===!0)e.vertexAttribIPointer(R,I,F,O,W);else e.vertexAttribPointer(R,I,F,C,O,W)}function y(R,I,F,C){m();let O=C.attributes,W=F.getAttributes(),z=I.defaultAttributeValues;for(let te in W){let V=W[te];if(V.location>=0){let Q=O[te];if(Q===void 0){if(te==="instanceMatrix"&&R.instanceMatrix)Q=R.instanceMatrix;if(te==="instanceColor"&&R.instanceColor)Q=R.instanceColor}if(Q!==void 0){let ee=Q.normalized,pe=Q.itemSize,Z=t.get(Q);if(Z===void 0)continue;let{buffer:ie,type:_e,bytesPerElement:Re}=Z,Ie=_e===e.INT||_e===e.UNSIGNED_INT||Q.gpuType===zi;if(Q.isInterleavedBufferAttribute){let ve=Q.data,nt=ve.isInterleavedBuffer===!0?ve.stride:ve.itemSize,Ge=Q.offset;if(ve.isInstancedInterleavedBuffer||ve.isInstancedBufferAttribute){for(let ze=0;ze<V.locationSize;ze++)g(V.location+ze,ve.meshPerAttribute);if(R.isInstancedMesh!==!0&&C._maxInstanceCount===void 0)C._maxInstanceCount=ve.meshPerAttribute*ve.count}else for(let ze=0;ze<V.locationSize;ze++)p(V.location+ze);e.bindBuffer(e.ARRAY_BUFFER,ie);for(let ze=0;ze<V.locationSize;ze++)M(V.location+ze,pe/V.locationSize,_e,ee,nt*Re,(Ge+pe/V.locationSize*ze)*Re,Ie)}else{if(Q.isInstancedBufferAttribute){for(let ve=0;ve<V.locationSize;ve++)g(V.location+ve,Q.meshPerAttribute);if(R.isInstancedMesh!==!0&&C._maxInstanceCount===void 0)C._maxInstanceCount=Q.meshPerAttribute*Q.count}else for(let ve=0;ve<V.locationSize;ve++)p(V.location+ve);e.bindBuffer(e.ARRAY_BUFFER,ie);for(let ve=0;ve<V.locationSize;ve++)M(V.location+ve,pe/V.locationSize,_e,ee,pe*Re,pe/V.locationSize*ve*Re,Ie)}}else if(z!==void 0){let ee=z[te];if(ee!==void 0)switch(ee.length){case 2:e.vertexAttrib2fv(V.location,ee);break;case 3:e.vertexAttrib3fv(V.location,ee);break;case 4:e.vertexAttrib4fv(V.location,ee);break;default:e.vertexAttrib1fv(V.location,ee)}}}}v()}function b(){A();for(let R in i){let I=i[R];for(let F in I){let C=I[F];for(let O in C){let W=C[O];for(let z in W)h(W[z].object),delete W[z];delete C[O]}}delete i[R]}}function E(R){if(i[R.id]===void 0)return;let I=i[R.id];for(let F in I){let C=I[F];for(let O in C){let W=C[O];for(let z in W)h(W[z].object),delete W[z];delete C[O]}}delete i[R.id]}function x(R){for(let I in i){let F=i[I];for(let C in F){let O=F[C];if(O[R.id]===void 0)continue;let W=O[R.id];for(let z in W)h(W[z].object),delete W[z];delete O[R.id]}}}function S(R){for(let I in i){let F=i[I],C=R.isInstancedMesh===!0?R.id:0,O=F[C];if(O===void 0)continue;for(let W in O){let z=O[W];for(let te in z)h(z[te].object),delete z[te];delete O[W]}if(delete F[C],Object.keys(F).length===0)delete i[I]}}function A(){if(P(),a=!0,r===s)return;r=s,u(r.object)}function P(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:A,resetDefaultState:P,dispose:b,releaseStatesOfGeometry:E,releaseStatesOfObject:S,releaseStatesOfProgram:x,initAttributes:m,enableAttribute:p,disableUnusedAttributes:v}}function qx(e,t,n){let i;function s(l){i=l}function r(l,u){e.drawArrays(i,l,u),n.update(u,i,1)}function a(l,u,h){if(h===0)return;e.drawArraysInstanced(i,l,u,h),n.update(u,i,h)}function o(l,u,h){if(h===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,u,0,h);let f=0;for(let d=0;d<h;d++)f+=u[d];n.update(f,i,1)}this.setMode=s,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function Yx(e,t,n,i){let s;function r(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){let x=t.get("EXT_texture_filter_anisotropic");s=e.getParameter(x.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function a(x){if(x!==ke&&i.convert(x)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT))return!1;return!0}function o(x){let S=x===et&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));if(x!==an&&x!==Ve&&!S&&i.convert(x)!==e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE))return!1;return!0}function l(x){if(x==="highp"){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.HIGH_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.HIGH_FLOAT).precision>0)return"highp";x="mediump"}if(x==="mediump"){if(e.getShaderPrecisionFormat(e.VERTEX_SHADER,e.MEDIUM_FLOAT).precision>0&&e.getShaderPrecisionFormat(e.FRAGMENT_SHADER,e.MEDIUM_FLOAT).precision>0)return"mediump"}return"lowp"}let u=n.precision!==void 0?n.precision:"highp",h=l(u);if(h!==u)De("WebGLRenderer:",u,"not supported, using",h,"instead."),u=h;let c=n.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),f=n.logarithmicDepthBuffer===!0&&c===!1;if(n.reversedDepthBuffer===!0&&c===!1)De("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");if(n.logarithmicDepthBuffer===!0&&c===!0)De("WebGLRenderer: Logarithmic depth buffer is ignored when reversed depth buffer is enabled.");let d=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),_=e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS),m=e.getParameter(e.MAX_TEXTURE_SIZE),p=e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE),g=e.getParameter(e.MAX_VERTEX_ATTRIBS),v=e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS),M=e.getParameter(e.MAX_VARYING_VECTORS),y=e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS),b=e.getParameter(e.MAX_SAMPLES),E=e.getParameter(e.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:u,logarithmicDepthBuffer:f,reversedDepthBuffer:c,maxTextures:d,maxVertexTextures:_,maxTextureSize:m,maxCubemapSize:p,maxAttributes:g,maxVertexUniforms:v,maxVaryings:M,maxFragmentUniforms:y,maxSamples:b,samples:E}}function Zx(e){let t=this,n=null,i=0,s=!1,r=!1,a=new _n,o=new Fe,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(c,f){let d=c.length!==0||f||i!==0||s;return s=f,i=c.length,d},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(c,f){n=h(c,f,0)},this.setState=function(c,f,d){let{clippingPlanes:_,clipIntersection:m,clipShadows:p}=c,g=e.get(c);if(!s||_===null||_.length===0||r&&!p)if(r)h(null);else u();else{let v=r?0:i,M=v*4,y=g.clippingState||null;l.value=y,y=h(_,f,M,d);for(let b=0;b!==M;++b)y[b]=n[b];g.clippingState=y,this.numIntersection=m?this.numPlanes:0,this.numPlanes+=v}};function u(){if(l.value!==n)l.value=n,l.needsUpdate=i>0;t.numPlanes=i,t.numIntersection=0}function h(c,f,d,_){let m=c!==null?c.length:0,p=null;if(m!==0){if(p=l.value,_!==!0||p===null){let g=d+m*4,v=f.matrixWorldInverse;if(o.getNormalMatrix(v),p===null||p.length<g)p=new Float32Array(g);for(let M=0,y=d;M!==m;++M,y+=4)a.copy(c[M]).applyMatrix4(v,o),a.normal.toArray(p,y),p[y+3]=a.constant}l.value=p,l.needsUpdate=!0}return t.numPlanes=m,t.numIntersection=0,p}}class za extends At{constructor(e=1,t={}){super(e,e,t);this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},i=[n,n,n,n,n,n];this.texture=new Ma(i),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new Cs(5,5,5),s=new kt({name:"CubemapFromEquirect",uniforms:qi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ut,blending:Ot});s.uniforms.tEquirect.value=t;let r=new dn(i,s),a=t.minFilter;if(t.minFilter===xi)t.minFilter=Ye;return new xr(1,10,this).update(e,r),t.minFilter=a,r.geometry.dispose(),r.material.dispose(),this}clear(e,t=!0,n=!0,i=!0){let s=e.getRenderTarget();for(let r=0;r<6;r++)e.setRenderTarget(this,r),e.clear(t,n,i);e.setRenderTarget(s)}}var Mf=256,$x=3,Jx=20,Xf=256,qf=16,Kx=3,Qx=new L,jx=new Ae;class Ba{constructor(e){this._renderer=e,this._cubeSize=0,this._sourceTarget=null,this._cubeCamera=new xr(1,10,null),this._boxMesh=new dn(new Cs(5,5,5),null),this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null,this._integrationMaterial=null}fromScene(e,t=0,n=0.1,i=100,s={}){let{size:r=256,position:a=Qx}=s,o=this._renderer;this._setSize(r);let l=this._allocateTarget(),u=this._getSourceTarget(!0);if(t>0)u.texture.mipmapsAutoUpdate=!1;let{autoClear:h,autoClearColor:c,autoClearDepth:f,autoClearStencil:d}=o,_=e.background;if(o.autoClear=!0,o.autoClearColor=!0,o.autoClearDepth=!0,o.autoClearStencil=!0,_===null)e.background=o.getClearColor(jx);let m=new xr(n,i,u);if(m.position.copy(a),m.update(o,e),o.autoClear=h,o.autoClearColor=c,o.autoClearDepth=f,o.autoClearStencil=d,e.background=_,t>0)u.texture.mipmapsAutoUpdate=!0,this._blur(l,t);return this._applyPMREM(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){if(this._cubemapMaterial===null)this._cubemapMaterial=wf(),this._compileMaterial(this._cubemapMaterial)}compileEquirectangularShader(){if(this._equirectMaterial===null)this._equirectMaterial=Tf(),this._compileMaterial(this._equirectMaterial)}dispose(){if(this._sourceTarget!==null)this._sourceTarget.dispose();if(this._cubemapMaterial!==null)this._cubemapMaterial.dispose();if(this._equirectMaterial!==null)this._equirectMaterial.dispose();if(this._blurMaterial!==null)this._blurMaterial.dispose();if(this._ggxMaterial!==null)this._ggxMaterial.dispose();if(this._integrationMaterial!==null)this._integrationMaterial.dispose();this._boxMesh.geometry.dispose()}static lodToRoughness(e,t){return t>0?1-Math.sqrt(1-e/t):0}_setSize(e){this._cubeSize=Math.max(Mf,pf(e))}_fromTexture(e,t){if(e.mapping===ar||e.mapping===ws)this._setSize(e.image.length===0?Mf:e.image[0].width||e.image[0].image.width);else this._setSize(e.image.width/4);let n=t||this._allocateTarget();return this._textureToCubemap(e),this._applyPMREM(n),n}_allocateTarget(){let e=this._cubeSize,t=bf(e,!1,!1),n=Math.log2(e)-$x;for(let i=0;i<=n;i++)t.texture.mipmaps.push({width:e>>i,height:e>>i});return t.texture.name="PMREM",t.texture.isPMREMTexture=!0,t}_getSourceTarget(e=!1){let t=this._cubeSize,n=this._sourceTarget;if(n===null||n.width!==t||e&&n.depthBuffer===!1){if(n!==null)n.dispose();this._sourceTarget=bf(t,!0,e)}return this._sourceTarget}_compileMaterial(e){this._boxMesh.material=e,this._renderer.compile(this._boxMesh,this._cubeCamera.children[0])}_renderCube(e,t,n){let i=this._boxMesh,s=this._cubeCamera;i.material=n,s.renderTarget=e,s.activeMipmapLevel=t;let r=e.width>>t;e.viewport.set(0,0,r,r),s.update(this._renderer,i),e.viewport.set(0,0,e.width,e.height)}_textureToCubemap(e){let t;if(e.mapping===ar||e.mapping===ws){if(this._cubemapMaterial===null)this._cubemapMaterial=wf();t=this._cubemapMaterial,t.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1}else{if(this._equirectMaterial===null)this._equirectMaterial=Tf();t=this._equirectMaterial}t.uniforms.envMap.value=e,this._renderCube(this._getSourceTarget(),0,t)}_applyPMREM(e){if(this._ggxMaterial===null)this._ggxMaterial=e_(),this._integrationMaterial=t_();let t=this._cubeSize,n=e.texture.mipmaps.length-1,i=this._ggxMaterial.uniforms;i.envMap.value=this._sourceTarget.texture;let s=this._integrationMaterial.uniforms;s.envMap.value=this._sourceTarget.texture,s.sourceLod.value=Math.log2(t/qf);for(let r=0;r<=n;r++){let a=Ba.lodToRoughness(r,n);if(r>n-Kx)s.roughness.value=a,this._renderCube(e,r,this._integrationMaterial);else{let o=a>0?Math.log2(t)+0.5*Math.log2(6/(Xf*Math.pow(a,4)))+0.5:0;i.roughness.value=a,i.lodBias.value=o,this._renderCube(e,r,this._ggxMaterial)}}}_blur(e,t){if(this._blurMaterial===null)this._blurMaterial=n_();let n=this._blurMaterial,i=n.uniforms,s=this._sourceTarget;i.sigma.value=Math.min(t,Math.PI)/Math.SQRT2,i.envMap.value=s.texture,this._renderCube(e,0,n),i.envMap.value=e.texture,this._renderCube(s,0,n)}}function bf(e,t,n){return new za(e,{minFilter:xi,generateMipmaps:t,type:et,colorSpace:vi,depthBuffer:n})}function Sr(e,t,n){return new kt({name:e,uniforms:t,vertexShader:We.cube_vert,fragmentShader:n,side:Ut,blending:Ot,depthTest:!1,depthWrite:!1})}function e_(){return Sr("PMREMGGXConvolution",{envMap:{value:null},roughness:{value:0},lodBias:{value:0}},`

		#define GGX_SAMPLES ${Xf}u

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float lodBias;

		#include <common>

		// Van der Corput radical inverse
		float radicalInverse_VdC( uint bits ) {

			bits = ( bits << 16u ) | ( bits >> 16u );
			bits = ( ( bits & 0x55555555u ) << 1u ) | ( ( bits & 0xAAAAAAAAu ) >> 1u );
			bits = ( ( bits & 0x33333333u ) << 2u ) | ( ( bits & 0xCCCCCCCCu ) >> 2u );
			bits = ( ( bits & 0x0F0F0F0Fu ) << 4u ) | ( ( bits & 0xF0F0F0F0u ) >> 4u );
			bits = ( ( bits & 0x00FF00FFu ) << 8u ) | ( ( bits & 0xFF00FF00u ) >> 8u );
			return float( bits ) * 2.3283064365386963e-10; // / 0x100000000

		}

		// Hammersley sequence
		vec2 hammersley( uint i, uint N ) {

			return vec2( float( i ) / float( N ), radicalInverse_VdC( i ) );

		}

		void main() {

			vec3 N = normalize( vWorldDirection );

			// For very low roughness, just sample the environment directly
			if ( roughness < 0.001 ) {

				gl_FragColor = vec4( textureLod( envMap, N, 0.0 ).rgb, 1.0 );
				return;

			}

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			// Tangent space basis for VNDF sampling
			vec3 up = abs( N.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, N ) );
			vec3 bitangent = cross( N, tangent );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			for ( uint i = 0u; i < GGX_SAMPLES; i ++ ) {

				vec2 Xi = hammersley( i, GGX_SAMPLES );

				// With V = N, sample the reflected direction directly.
				float invQ = 1.0 / ( 1.0 - Xi.x + alpha2 * Xi.x );
				float NdotL = ( 1.0 - Xi.x - alpha2 * Xi.x ) * invQ;

				if ( NdotL > 0.0 ) {

					float phi = 2.0 * PI * Xi.y;
					float sinTheta = 2.0 * alpha * sqrt( Xi.x * ( 1.0 - Xi.x ) ) * invQ;
					vec3 L = N * NdotL + ( tangent * cos( phi ) + bitangent * sin( phi ) ) * sinTheta;

					// Match the source mip to the sample's solid angle. The terms
					// independent of the sample are precomputed in lodBias.
					float d = alpha2 * invQ;
					float lod = max( log2( d ) + lodBias, 0.0 );

					// Weight by NdotL for the split-sum approximation
					prefilteredColor += textureLod( envMap, L, lod ).rgb * NdotL;
					totalWeight += NdotL;

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function t_(){return Sr("PMREMGGXIntegration",{envMap:{value:null},roughness:{value:0},sourceLod:{value:0},sourceSize:{value:qf}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float sourceLod;
		uniform int sourceSize;

		void main() {

			vec3 N = normalize( vWorldDirection );

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			float texelSize = 2.0 / float( sourceSize );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			// Pair opposite texels: only the one in N's hemisphere contributes.
			for ( int face = 0; face < 3; face ++ ) {

				for ( int y = 0; y < sourceSize; y ++ ) {

					for ( int x = 0; x < sourceSize; x ++ ) {

						vec2 uv = ( vec2( x, y ) + 0.5 ) * texelSize - 1.0;
						vec3 texelDirection = face == 0 ? vec3( 1.0, uv ) : ( face == 1 ? vec3( uv.x, 1.0, uv.y ) : vec3( uv, 1.0 ) );

						float invDistance = inversesqrt( 1.0 + dot( uv, uv ) );
						float NdotL = dot( N, texelDirection );
						texelDirection *= NdotL < 0.0 ? - 1.0 : 1.0;
						NdotL = abs( NdotL ) * invDistance;

						// With V = N, NdotH squared is ( 1 + NdotL ) / 2. Common factors
						// in the GGX distribution and texel solid angle cancel when normalized.
						float d = 1.0 + alpha2 + ( alpha2 - 1.0 ) * NdotL;
						float weight = NdotL * invDistance * invDistance * invDistance / ( d * d );

						prefilteredColor += textureLod( envMap, texelDirection, sourceLod ).rgb * weight;
						totalWeight += weight;

					}

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function n_(){return Sr("PMREMSphericalGaussianBlur",{envMap:{value:null},sigma:{value:0}},`

		#define SAMPLES ${Jx}
		#define GOLDEN_ANGLE 2.39996322973

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float sigma;

		#include <common>

		void main() {

			vec3 outputDirection = normalize( vWorldDirection );

			vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, outputDirection ) );
			vec3 bitangent = cross( outputDirection, tangent );

			// Truncate the kernel at three standard deviations or at the antipode.
			float thetaMax = min( 3.0 * sigma, PI );
			float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

			vec3 accumColor = vec3( 0.0 );
			float accumWeight = 0.0;

			for ( int i = 0; i < SAMPLES; i ++ ) {

				// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
				float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
				float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
				float phi = float( i ) * GOLDEN_ANGLE;

				vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
				vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

				// Correct the planar sample density to solid angle.
				float weight = sin( theta ) / theta;

				accumColor += weight * textureLod( envMap, sampleDirection, 0.0 ).rgb;
				accumWeight += weight;

			}

			gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

		}
	`)}function Tf(){return Sr("PMREMEquirectangularToCubemap",{envMap:{value:null}},`

		varying vec3 vWorldDirection;

		uniform sampler2D envMap;

		#include <common>

		void main() {

			// Average four subpixel samples to preserve small, bright features.
			vec3 direction = normalize( vWorldDirection );
			vec3 dx = dFdx( direction ) * 0.25;
			vec3 dy = dFdy( direction ) * 0.25;

			vec3 color = textureLod( envMap, equirectUv( normalize( direction - dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction - dx + dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx + dy ) ), 0.0 ).rgb;
			gl_FragColor = vec4( color * 0.25, 1.0 );

		}
	`)}function wf(){return Sr("PMREMCubemapToCubemap",{envMap:{value:null},flipEnvMap:{value:-1}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float flipEnvMap;

		void main() {

			gl_FragColor = vec4( textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) ).rgb, 1.0 );

		}
	`)}function i_(e){let t=new WeakMap,n=new WeakMap,i=null;function s(f,d=!1){if(f===null||f===void 0)return null;if(d)return a(f);return r(f)}function r(f){if(f&&f.isTexture){let d=f.mapping;if(d===Gn||d===la)if(t.has(f)){let _=t.get(f).texture;return o(_,f.mapping)}else{let _=f.image;if(_&&_.height>0){let m=new za(_.height);return m.fromEquirectangularTexture(e,f),t.set(f,m),f.addEventListener("dispose",u),o(m.texture,f.mapping)}else return null}}return f}function a(f){if(f&&f.isTexture&&f.isPMREMTexture!==!0){let d=f.mapping,_=d===Gn||d===la,m=d===ar||d===ws;if(_||m){let p=n.get(f),g=p!==void 0?p.texture.pmremVersion:0;if(f.isRenderTargetTexture&&f.pmremVersion!==g){if(i===null)i=new Ba(e);return p=_?i.fromEquirectangular(f,p):i.fromCubemap(f,p),p.texture.pmremVersion=f.pmremVersion,n.set(f,p),p.texture}else if(p!==void 0)return p.texture;else{let v=f.image;if(_&&v&&v.height>0||m&&v&&l(v)){if(i===null)i=new Ba(e);return p=_?i.fromEquirectangular(f):i.fromCubemap(f),p.texture.pmremVersion=f.pmremVersion,n.set(f,p),f.addEventListener("dispose",h),p.texture}else return null}}}return f}function o(f,d){if(d===Gn)f.mapping=ar;else if(d===la)f.mapping=ws;return f}function l(f){let d=0,_=6;for(let m=0;m<_;m++)if(f[m]!==void 0)d++;return d===_}function u(f){let d=f.target;d.removeEventListener("dispose",u);let _=t.get(d);if(_!==void 0)t.delete(d),_.dispose()}function h(f){let d=f.target;d.removeEventListener("dispose",h);let _=n.get(d);if(_!==void 0)n.delete(d),_.dispose()}function c(){if(t=new WeakMap,n=new WeakMap,i!==null)i.dispose(),i=null}return{get:s,dispose:c}}function s_(e){let t={};function n(i){if(t[i]!==void 0)return t[i];let s=e.getExtension(i);return t[i]=s,s}return{has:function(i){return n(i)!==null},init:function(){n("EXT_color_buffer_float"),n("WEBGL_clip_cull_distance"),n("OES_texture_float_linear"),n("EXT_color_buffer_half_float"),n("WEBGL_multisampled_render_to_texture"),n("WEBGL_render_shared_exponent")},get:function(i){let s=n(i);if(s===null)Ni("WebGLRenderer: "+i+" extension not supported.");return s}}}function r_(e,t,n,i){let s={},r=new WeakMap,a=new FinalizationRegistry((_)=>delete s[_]);function o(_){l(_.target)}function l(_){if(_.index!==null)t.remove(_.index);for(let p in _.attributes)t.remove(_.attributes[p]);_.removeEventListener("dispose",o),delete s[_.id],a.unregister(_);let m=r.get(_);if(m)t.remove(m),r.delete(_);if(i.releaseStatesOfGeometry(_),_.isInstancedBufferGeometry===!0)delete _._maxInstanceCount;n.memory.geometries--}function u(_,m){if(s[m.id]!==void 0)return m;return m.addEventListener("dispose",o),s[m.id]=new WeakRef(m),a.register(m,m.id,m),n.memory.geometries++,m}function h(_){let m=_.attributes;for(let p in m)t.update(m[p],e.ARRAY_BUFFER)}function c(_){let m=_.index,p=_.attributes.position,g=0;if(p===void 0)return;let v=m!==null?m.array.length:p.array.length/3-1,y=new(p.count>=65535?ya:va)(Math.ceil(v/3)*6,1),b=y.array;if(m!==null){let x=m.array;g=m.version;for(let S=0,A=0;S<v;S+=3){let P=x[S+0],R=x[S+1],I=x[S+2];b[A++]=P,b[A++]=R,b[A++]=R,b[A++]=I,b[A++]=I,b[A++]=P}}else{g=p.version;for(let x=0,S=0;x<v;x+=3){let A=x+0,P=x+1,R=x+2;b[S++]=A,b[S++]=P,b[S++]=P,b[S++]=R,b[S++]=R,b[S++]=A}}y.version=g;let E=r.get(_);if(E)t.remove(E);r.set(_,y)}function f(_){let m=r.get(_);if(m){let p=_.index;if(p!==null){if(m.version<p.version)c(_)}}else c(_);return r.get(_)}function d(){for(let _ in s){let m=s[_].deref();if(m!==void 0)l(m)}}return{get:u,update:h,getWireframeAttribute:f,dispose:d}}function a_(e,t,n){let i;function s(c){i=c}let r,a;function o(c){r=c.type,a=c.bytesPerElement}function l(c,f){e.drawElements(i,f,r,c*a),n.update(f,i,1)}function u(c,f,d){if(d===0)return;e.drawElementsInstanced(i,f,r,c*a,d),n.update(f,i,d)}function h(c,f,d){if(d===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,f,0,r,c,0,d);let m=0;for(let p=0;p<d;p++)m+=f[p];n.update(m,i,1)}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=u,this.renderMultiDraw=h}function o_(e){let t={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function i(r,a,o){switch(n.calls++,a){case e.TRIANGLES:n.triangles+=o*(r/3);break;case e.LINES:n.lines+=o*(r/2);break;case e.LINE_STRIP:n.lines+=o*(r-1);break;case e.LINE_LOOP:n.lines+=o*r;break;case e.POINTS:n.points+=o*r;break;default:Ne("WebGLInfo: Unknown draw mode:",a);break}}function s(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:t,render:n,programs:null,autoReset:!0,reset:s,update:i}}function l_(e,t,n){let i=new WeakMap,s=new rt;function r(a,o,l){let u=a.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,c=h!==void 0?h.length:0,f=i.get(o);if(f===void 0||f.count!==c){let A=function(){x.dispose(),i.delete(o),o.removeEventListener("dispose",A)};if(f!==void 0)f.texture.dispose();let d=o.morphAttributes.position!==void 0,_=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,p=o.morphAttributes.position||[],g=o.morphAttributes.normal||[],v=o.morphAttributes.color||[],M=0;if(d===!0)M=1;if(_===!0)M=2;if(m===!0)M=3;let y=o.attributes.position.count*M,b=1;if(y>t.maxTextureSize)b=Math.ceil(y/t.maxTextureSize),y=t.maxTextureSize;let E=new Float32Array(y*b*4*c),x=new Vi(E,y,b,c);x.type=Ve,x.needsUpdate=!0;let S=M*4;for(let P=0;P<c;P++){let R=p[P],I=g[P],F=v[P],C=y*b*4*P;for(let O=0;O<R.count;O++){let W=O*S;if(d===!0)s.fromBufferAttribute(R,O),E[C+W+0]=s.x,E[C+W+1]=s.y,E[C+W+2]=s.z,E[C+W+3]=0;if(_===!0)s.fromBufferAttribute(I,O),E[C+W+4]=s.x,E[C+W+5]=s.y,E[C+W+6]=s.z,E[C+W+7]=0;if(m===!0)s.fromBufferAttribute(F,O),E[C+W+8]=s.x,E[C+W+9]=s.y,E[C+W+10]=s.z,E[C+W+11]=F.itemSize===4?s.w:1}}f={count:c,texture:x,size:new Te(y,b)},i.set(o,f),o.addEventListener("dispose",A)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(e,"morphTexture",a.morphTexture,n);else{let d=0;for(let m=0;m<u.length;m++)d+=u[m];let _=o.morphTargetsRelative?1:1-d;l.getUniforms().setValue(e,"morphTargetBaseInfluence",_),l.getUniforms().setValue(e,"morphTargetInfluences",u)}l.getUniforms().setValue(e,"morphTargetsTexture",f.texture,n),l.getUniforms().setValue(e,"morphTargetsTextureSize",f.size)}return{update:r}}function c_(e,t,n,i,s){let r=new WeakMap;function a(u){let h=s.render.frame,c=u.geometry,f=t.get(u,c);if(r.get(f)!==h)t.update(f),r.set(f,h);if(u.isInstancedMesh){if(u.hasEventListener("dispose",l)===!1)u.addEventListener("dispose",l);if(r.get(u)!==h){if(n.update(u.instanceMatrix,e.ARRAY_BUFFER),u.instanceColor!==null)n.update(u.instanceColor,e.ARRAY_BUFFER);r.set(u,h)}}if(u.isSkinnedMesh){let d=u.skeleton;if(r.get(d)!==h)d.update(),r.set(d,h)}return f}function o(){r=new WeakMap}function l(u){let h=u.target;if(h.removeEventListener("dispose",l),i.releaseStatesOfObject(h),n.remove(h.instanceMatrix),h.instanceColor!==null)n.remove(h.instanceColor)}return{update:a,dispose:o}}var u_={[ll]:"LINEAR_TONE_MAPPING",[cl]:"REINHARD_TONE_MAPPING",[ul]:"CINEON_TONE_MAPPING",[Oi]:"ACES_FILMIC_TONE_MAPPING",[sr]:"AGX_TONE_MAPPING",[rr]:"NEUTRAL_TONE_MAPPING",[hl]:"CUSTOM_TONE_MAPPING"};function h_(e,t,n,i,s,r){let a=new At(t,n,{type:e,depthBuffer:s,stencilBuffer:r,samples:i?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),o=null,l=null,u=null,h=new Tt;h.setAttribute("position",new Zt([-1,3,0,-1,-1,0,3,-1,0],3)),h.setAttribute("uv",new Zt([0,2,0,0,2,0],2));let c=new sc({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),f=new dn(h,c),d=new Is(-1,1,1,-1,0,1),_=null,m=null,p=!1,g,v=null,M=[],y=!1;this.setSize=function(b,E){if(a.setSize(b,E),o!==null)o.setSize(b,E);if(l!==null)l.setSize(b,E);for(let x=0;x<M.length;x++){let S=M[x];if(S.setSize)S.setSize(b,E)}},this.setEffects=function(b){M=b,y=M.length>0&&M[0].isRenderPass===!0;let{width:E,height:x}=a;if(M.length>0&&o===null)o=new At(E,x,{type:et,depthBuffer:!1,stencilBuffer:!1}),l=new At(E,x,{type:et,depthBuffer:!1,stencilBuffer:!1});let S=s===!0&&M.some((A)=>A.needsDepthTexture===!0);if(S!==(a.depthTexture!==null)){if(S===!0&&u===null){if(u=new Si(E,x),r===!0)u.format=_i,u.type=ki}a.dispose(),a.depthTexture=S?u:null,a.resolveDepthBuffer=S,a.storeMultisampledDepthBuffer=S}for(let A=0;A<M.length;A++){let P=M[A];if(P.setSize)P.setSize(E,x);if(S&&P.needsDepthTexture===!0&&P.setDepthTexture)P.setDepthTexture(u)}},this.begin=function(b,E){if(p)return!1;if(b.toneMapping===En&&M.length===0)return!1;if(v=E,E!==null){let{width:x,height:S}=E;if(a.width!==x||a.height!==S)this.setSize(x,S)}if(y===!1)b.setRenderTarget(a);return g=b.toneMapping,b.toneMapping=En,!0},this.hasRenderPass=function(){return y},this.end=function(b,E){b.toneMapping=g,p=!0;let x=a,S=o;for(let A=0;A<M.length;A++){let P=M[A];if(P.enabled===!1)continue;if(P.render(b,S,x,E),P.needsSwap!==!1)x=S,S=S===o?l:o}if(_!==b.outputColorSpace||m!==b.toneMapping){if(_=b.outputColorSpace,m=b.toneMapping,c.defines={},Xe.getTransfer(_)===xt)c.defines.SRGB_TRANSFER="";let A=u_[m];if(A)c.defines[A]="";c.needsUpdate=!0}c.uniforms.tDiffuse.value=x.texture,b.setRenderTarget(v),b.render(f,d),v=null,p=!1},this.isCompositing=function(){return p},this.dispose=function(){if(a.dispose(),o!==null)o.dispose();if(l!==null)l.dispose();h.dispose(),c.dispose()}}var Yf=new zt,Zf=new Si(1,1),$f=new Ta(1),Jf=new Vi,Kf=new nc,Qf=new Ma,Af=[],Ef=[],Rf=new Float32Array(16),Cf=new Float32Array(9),If=new Float32Array(4);function Ps(e,t,n){let i=e[0];if(i<=0||i>0)return e;let s=t*n,r=Af[s];if(r===void 0)r=new Float32Array(s),Af[s]=r;if(t!==0){i.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=n,e[a].toArray(r,o)}return r}function Ht(e,t){if(e.length!==t.length)return!1;for(let n=0,i=e.length;n<i;n++)if(e[n]!==t[n])return!1;return!0}function Gt(e,t){for(let n=0,i=t.length;n<i;n++)e[n]=t[n]}function ka(e,t){let n=Ef[t];if(n===void 0)n=new Int32Array(t),Ef[t]=n;for(let i=0;i!==t;++i)n[i]=e.allocateTextureUnit();return n}function f_(e,t){let n=this.cache;if(n[0]===t)return;e.uniform1f(this.addr,t),n[0]=t}function d_(e,t){let n=this.cache;if(t.x!==void 0){if(n[0]!==t.x||n[1]!==t.y)e.uniform2f(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y}else{if(Ht(n,t))return;e.uniform2fv(this.addr,t),Gt(n,t)}}function p_(e,t){let n=this.cache;if(t.x!==void 0){if(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)e.uniform3f(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z}else if(t.r!==void 0){if(n[0]!==t.r||n[1]!==t.g||n[2]!==t.b)e.uniform3f(this.addr,t.r,t.g,t.b),n[0]=t.r,n[1]=t.g,n[2]=t.b}else{if(Ht(n,t))return;e.uniform3fv(this.addr,t),Gt(n,t)}}function m_(e,t){let n=this.cache;if(t.x!==void 0){if(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)e.uniform4f(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w}else{if(Ht(n,t))return;e.uniform4fv(this.addr,t),Gt(n,t)}}function g_(e,t){let n=this.cache,i=t.elements;if(i===void 0){if(Ht(n,t))return;e.uniformMatrix2fv(this.addr,!1,t),Gt(n,t)}else{if(Ht(n,i))return;If.set(i),e.uniformMatrix2fv(this.addr,!1,If),Gt(n,i)}}function x_(e,t){let n=this.cache,i=t.elements;if(i===void 0){if(Ht(n,t))return;e.uniformMatrix3fv(this.addr,!1,t),Gt(n,t)}else{if(Ht(n,i))return;Cf.set(i),e.uniformMatrix3fv(this.addr,!1,Cf),Gt(n,i)}}function __(e,t){let n=this.cache,i=t.elements;if(i===void 0){if(Ht(n,t))return;e.uniformMatrix4fv(this.addr,!1,t),Gt(n,t)}else{if(Ht(n,i))return;Rf.set(i),e.uniformMatrix4fv(this.addr,!1,Rf),Gt(n,i)}}function v_(e,t){let n=this.cache;if(n[0]===t)return;e.uniform1i(this.addr,t),n[0]=t}function y_(e,t){let n=this.cache;if(t.x!==void 0){if(n[0]!==t.x||n[1]!==t.y)e.uniform2i(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y}else{if(Ht(n,t))return;e.uniform2iv(this.addr,t),Gt(n,t)}}function S_(e,t){let n=this.cache;if(t.x!==void 0){if(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)e.uniform3i(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z}else{if(Ht(n,t))return;e.uniform3iv(this.addr,t),Gt(n,t)}}function M_(e,t){let n=this.cache;if(t.x!==void 0){if(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)e.uniform4i(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w}else{if(Ht(n,t))return;e.uniform4iv(this.addr,t),Gt(n,t)}}function b_(e,t){let n=this.cache;if(n[0]===t)return;e.uniform1ui(this.addr,t),n[0]=t}function T_(e,t){let n=this.cache;if(t.x!==void 0){if(n[0]!==t.x||n[1]!==t.y)e.uniform2ui(this.addr,t.x,t.y),n[0]=t.x,n[1]=t.y}else{if(Ht(n,t))return;e.uniform2uiv(this.addr,t),Gt(n,t)}}function w_(e,t){let n=this.cache;if(t.x!==void 0){if(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z)e.uniform3ui(this.addr,t.x,t.y,t.z),n[0]=t.x,n[1]=t.y,n[2]=t.z}else{if(Ht(n,t))return;e.uniform3uiv(this.addr,t),Gt(n,t)}}function A_(e,t){let n=this.cache;if(t.x!==void 0){if(n[0]!==t.x||n[1]!==t.y||n[2]!==t.z||n[3]!==t.w)e.uniform4ui(this.addr,t.x,t.y,t.z,t.w),n[0]=t.x,n[1]=t.y,n[2]=t.z,n[3]=t.w}else{if(Ht(n,t))return;e.uniform4uiv(this.addr,t),Gt(n,t)}}function Ha(e){if(e.version===0)e.compareFunction=$l,e.needsUpdate=!0;return e}function E_(e,t,n){let i=this.cache,s=n.allocateTextureUnit();if(i[0]!==s)e.uniform1i(this.addr,s),i[0]=s;let r;if(this.type===e.SAMPLER_2D_SHADOW)r=Ha(Zf);else r=Yf;n.setTexture2D(t||r,s)}function R_(e,t,n){let i=this.cache,s=n.allocateTextureUnit();if(i[0]!==s)e.uniform1i(this.addr,s),i[0]=s;n.setTexture3D(t||Kf,s)}function C_(e,t,n){let i=this.cache,s=n.allocateTextureUnit();if(i[0]!==s)e.uniform1i(this.addr,s),i[0]=s;let r;if(this.type===e.SAMPLER_CUBE_SHADOW)r=Ha($f);else r=Qf;n.setTextureCube(t||r,s)}function I_(e,t,n){let i=this.cache,s=n.allocateTextureUnit();if(i[0]!==s)e.uniform1i(this.addr,s),i[0]=s;n.setTexture2DArray(t||Jf,s)}function P_(e){switch(e){case 5126:return f_;case 35664:return d_;case 35665:return p_;case 35666:return m_;case 35674:return g_;case 35675:return x_;case 35676:return __;case 5124:case 35670:return v_;case 35667:case 35671:return y_;case 35668:case 35672:return S_;case 35669:case 35673:return M_;case 5125:return b_;case 36294:return T_;case 36295:return w_;case 36296:return A_;case 35678:case 36198:case 36298:case 36306:case 35682:return E_;case 35679:case 36299:case 36307:return R_;case 35680:case 36300:case 36308:case 36293:return C_;case 36289:case 36303:case 36311:case 36292:return I_}}function D_(e,t){e.uniform1fv(this.addr,t)}function L_(e,t){let n=Ps(t,this.size,2);e.uniform2fv(this.addr,n)}function F_(e,t){let n=Ps(t,this.size,3);e.uniform3fv(this.addr,n)}function N_(e,t){let n=Ps(t,this.size,4);e.uniform4fv(this.addr,n)}function U_(e,t){let n=Ps(t,this.size,4);e.uniformMatrix2fv(this.addr,!1,n)}function O_(e,t){let n=Ps(t,this.size,9);e.uniformMatrix3fv(this.addr,!1,n)}function B_(e,t){let n=Ps(t,this.size,16);e.uniformMatrix4fv(this.addr,!1,n)}function z_(e,t){e.uniform1iv(this.addr,t)}function k_(e,t){e.uniform2iv(this.addr,t)}function H_(e,t){e.uniform3iv(this.addr,t)}function G_(e,t){e.uniform4iv(this.addr,t)}function W_(e,t){e.uniform1uiv(this.addr,t)}function V_(e,t){e.uniform2uiv(this.addr,t)}function X_(e,t){e.uniform3uiv(this.addr,t)}function q_(e,t){e.uniform4uiv(this.addr,t)}function Y_(e,t,n){let i=this.cache,s=t.length,r=ka(n,s);if(!Ht(i,r))e.uniform1iv(this.addr,r),Gt(i,r);let a;if(this.type===e.SAMPLER_2D_SHADOW)a=Ha(Zf);else a=Yf;for(let o=0;o!==s;++o)n.setTexture2D(t[o]||a,r[o])}function Z_(e,t,n){let i=this.cache,s=t.length,r=ka(n,s);if(!Ht(i,r))e.uniform1iv(this.addr,r),Gt(i,r);for(let a=0;a!==s;++a)n.setTexture3D(t[a]||Kf,r[a])}function $_(e,t,n){let i=this.cache,s=t.length,r=ka(n,s);if(!Ht(i,r))e.uniform1iv(this.addr,r),Gt(i,r);let a;if(this.type===e.SAMPLER_CUBE_SHADOW)a=Ha($f);else a=Qf;for(let o=0;o!==s;++o)n.setTextureCube(t[o]||a,r[o])}function J_(e,t,n){let i=this.cache,s=t.length,r=ka(n,s);if(!Ht(i,r))e.uniform1iv(this.addr,r),Gt(i,r);for(let a=0;a!==s;++a)n.setTexture2DArray(t[a]||Jf,r[a])}function K_(e){switch(e){case 5126:return D_;case 35664:return L_;case 35665:return F_;case 35666:return N_;case 35674:return U_;case 35675:return O_;case 35676:return B_;case 5124:case 35670:return z_;case 35667:case 35671:return k_;case 35668:case 35672:return H_;case 35669:case 35673:return G_;case 5125:return W_;case 36294:return V_;case 36295:return X_;case 36296:return q_;case 35678:case 36198:case 36298:case 36306:case 35682:return Y_;case 35679:case 36299:case 36307:return Z_;case 35680:case 36300:case 36308:case 36293:return $_;case 36289:case 36303:case 36311:case 36292:return J_}}class jf{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=P_(t.type)}}class ed{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=K_(t.type)}}class td{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let i=this.seq;for(let s=0,r=i.length;s!==r;++s){let a=i[s];a.setValue(e,t[a.id],n)}}}var bc=/(\w+)(\])?(\[|\.)?/g;function Pf(e,t){e.seq.push(t),e.map[t.id]=t}function Q_(e,t,n){let i=e.name,s=i.length;bc.lastIndex=0;while(!0){let r=bc.exec(i),a=bc.lastIndex,o=r[1],l=r[2]==="]",u=r[3];if(l)o=o|0;if(u===void 0||u==="["&&a+2===s){Pf(n,u===void 0?new jf(o,e,t):new ed(o,e,t));break}else{let c=n.map[o];if(c===void 0)c=new td(o),Pf(n,c);n=c}}}class yr{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){let a=e.getActiveUniform(t,r),o=e.getUniformLocation(t,a.name);Q_(a,o,this)}let i=[],s=[];for(let r of this.seq)if(r.type===e.SAMPLER_2D_SHADOW||r.type===e.SAMPLER_CUBE_SHADOW||r.type===e.SAMPLER_2D_ARRAY_SHADOW)i.push(r);else s.push(r);if(i.length>0)this.seq=i.concat(s)}setValue(e,t,n,i){let s=this.map[t];if(s!==void 0)s.setValue(e,n,i)}setOptional(e,t,n){let i=t[n];if(i!==void 0)this.setValue(e,n,i)}static upload(e,t,n,i){for(let s=0,r=t.length;s!==r;++s){let a=t[s],o=n[a.id];if(o.needsUpdate!==!1)a.setValue(e,o.value,i)}}static seqWithValue(e,t){let n=[];for(let i=0,s=e.length;i!==s;++i){let r=e[i];if(r.id in t)n.push(r)}return n}}function Df(e,t,n){let i=e.createShader(t);return e.shaderSource(i,n),e.compileShader(i),i}var j_=37297,ev=0;function tv(e,t){let n=e.split(`
`),i=[],s=Math.max(t-6,0),r=Math.min(t+6,n.length);for(let a=s;a<r;a++){let o=a+1;i.push(`${o===t?">":" "} ${o}: ${n[a]}`)}return i.join(`
`)}var Lf=new Fe;function nv(e){Xe._getMatrix(Lf,Xe.workingColorSpace,e);let t=`mat3( ${Lf.elements.map((n)=>n.toFixed(4))} )`;switch(Xe.getTransfer(e)){case ql:return[t,"LinearTransferOETF"];case xt:return[t,"sRGBTransferOETF"];default:return De("WebGLProgram: Unsupported color space: ",e),[t,"LinearTransferOETF"]}}function Ff(e,t,n){let i=e.getShaderParameter(t,e.COMPILE_STATUS),r=(e.getShaderInfoLog(t)||"").trim();if(i&&r==="")return"";let a=/ERROR: 0:(\d+)/.exec(r);if(a){let o=parseInt(a[1]);return n.toUpperCase()+`

`+r+`

`+tv(e.getShaderSource(t),o)}else return r}function iv(e,t){let n=nv(t);return[`vec4 ${e}( vec4 value ) {`,`	return ${n[1]}( vec4( ${n[0]} * value.rgb, value.a ) );`,"}"].join(`
`)}var sv={[ll]:"Linear",[cl]:"Reinhard",[ul]:"Cineon",[Oi]:"ACESFilmic",[sr]:"AgX",[rr]:"Neutral",[hl]:"Custom"};function rv(e,t){let n=sv[t];if(n===void 0)return De("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+e+"( vec3 color ) { return LinearToneMapping( color ); }";return"vec3 "+e+"( vec3 color ) { return "+n+"ToneMapping( color ); }"}var Oa=new L;function av(){Xe.getLuminanceCoefficients(Oa);let e=Oa.x.toFixed(4),t=Oa.y.toFixed(4),n=Oa.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${e}, ${t}, ${n} );`,"\treturn dot( weights, rgb );","}"].join(`
`)}function ov(e){return[e.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",e.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(vr).join(`
`)}function lv(e){let t=[];for(let n in e){let i=e[n];if(i===!1)continue;t.push("#define "+n+" "+i)}return t.join(`
`)}function cv(e,t){let n={},i=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let s=0;s<i;s++){let r=e.getActiveAttrib(t,s),a=r.name,o=1;if(r.type===e.FLOAT_MAT2)o=2;if(r.type===e.FLOAT_MAT3)o=3;if(r.type===e.FLOAT_MAT4)o=4;n[a]={type:r.type,location:e.getAttribLocation(t,a),locationSize:o}}return n}function vr(e){return e!==""}function Nf(e,t){let n=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return e.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows).replace(/NUM_LIGHT_PROBE_GRIDS/g,t.numLightProbeGrids)}function Uf(e,t){return e.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var uv=/^[ \t]*#include +<([\w\d./]+)>/gm;function wc(e){return e.replace(uv,hv)}function hv(e,t){let n=We[t];if(n===void 0)throw Error("THREE.WebGLProgram: Can not resolve #include <"+t+">");return wc(n)}var fv=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Of(e){return e.replace(fv,dv)}function dv(e,t,n,i){let s="";for(let r=parseInt(t);r<parseInt(n);r++)s+=i.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Bf(e){let t=`precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;if(e.precision==="highp")t+=`
#define HIGH_PRECISION`;else if(e.precision==="mediump")t+=`
#define MEDIUM_PRECISION`;else if(e.precision==="lowp")t+=`
#define LOW_PRECISION`;return t}var pv={[nr]:"SHADOWMAP_TYPE_PCF",[bs]:"SHADOWMAP_TYPE_VSM"};function mv(e){return pv[e.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var gv={[ws]:"ENVMAP_MODE_REFRACTION"};function xv(e){if(e.envMap===!1)return"ENVMAP_MODE_REFLECTION";return gv[e.envMapMode]||"ENVMAP_MODE_REFLECTION"}var _v={[$h]:"ENVMAP_BLENDING_MULTIPLY",[Jh]:"ENVMAP_BLENDING_MIX",[Kh]:"ENVMAP_BLENDING_ADD"};function vv(e){if(e.envMap===!1)return"ENVMAP_BLENDING_NONE";return _v[e.combine]||"ENVMAP_BLENDING_NONE"}function yv(e,t,n,i){let s=e.getContext(),{defines:r,vertexShader:a,fragmentShader:o}=n,l=mv(n),u=n.envMapPMREM===!0?"ENVMAP_TYPE_PMREM":"ENVMAP_TYPE_CUBE",h=xv(n),c=vv(n),f=ov(n),d=lv(r),_=s.createProgram(),m,p,g=n.glslVersion?"#version "+n.glslVersion+`
`:"";if(n.isRawShaderMaterial){if(m=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,d].filter(vr).join(`
`),m.length>0)m+=`
`;if(p=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,d].filter(vr).join(`
`),p.length>0)p+=`
`}else m=[Bf(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,d,n.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",n.batching?"#define USE_BATCHING":"",n.batchingColor?"#define USE_BATCHING_COLOR":"",n.instancing?"#define USE_INSTANCING":"",n.instancingColor?"#define USE_INSTANCING_COLOR":"",n.instancingMorph?"#define USE_INSTANCING_MORPH":"",n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.map?"#define USE_MAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+h:"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.displacementMap?"#define USE_DISPLACEMENTMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.mapUv?"#define MAP_UV "+n.mapUv:"",n.alphaMapUv?"#define ALPHAMAP_UV "+n.alphaMapUv:"",n.lightMapUv?"#define LIGHTMAP_UV "+n.lightMapUv:"",n.aoMapUv?"#define AOMAP_UV "+n.aoMapUv:"",n.emissiveMapUv?"#define EMISSIVEMAP_UV "+n.emissiveMapUv:"",n.bumpMapUv?"#define BUMPMAP_UV "+n.bumpMapUv:"",n.normalMapUv?"#define NORMALMAP_UV "+n.normalMapUv:"",n.displacementMapUv?"#define DISPLACEMENTMAP_UV "+n.displacementMapUv:"",n.metalnessMapUv?"#define METALNESSMAP_UV "+n.metalnessMapUv:"",n.roughnessMapUv?"#define ROUGHNESSMAP_UV "+n.roughnessMapUv:"",n.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+n.anisotropyMapUv:"",n.clearcoatMapUv?"#define CLEARCOATMAP_UV "+n.clearcoatMapUv:"",n.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+n.clearcoatNormalMapUv:"",n.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+n.clearcoatRoughnessMapUv:"",n.diffuseRoughnessMapUv?"#define DIFFUSE_ROUGHNESSMAP_UV "+n.diffuseRoughnessMapUv:"",n.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+n.iridescenceMapUv:"",n.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+n.iridescenceThicknessMapUv:"",n.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+n.sheenColorMapUv:"",n.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+n.sheenRoughnessMapUv:"",n.specularMapUv?"#define SPECULARMAP_UV "+n.specularMapUv:"",n.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+n.specularColorMapUv:"",n.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+n.specularIntensityMapUv:"",n.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+n.transmissionMapUv:"",n.thicknessMapUv?"#define THICKNESSMAP_UV "+n.thicknessMapUv:"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexNormals?"#define HAS_NORMAL":"",n.vertexColors?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.flatShading?"#define FLAT_SHADED":"",n.skinning?"#define USE_SKINNING":"",n.morphTargets?"#define USE_MORPHTARGETS":"",n.morphNormals&&n.flatShading===!1?"#define USE_MORPHNORMALS":"",n.morphColors?"#define USE_MORPHCOLORS":"",n.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+n.morphTextureStride:"",n.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+n.morphTargetsCount:"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.sizeAttenuation?"#define USE_SIZEATTENUATION":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",n.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","\tattribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","\tattribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","\tuniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","\tattribute vec2 uv1;","#endif","#ifdef USE_UV2","\tattribute vec2 uv2;","#endif","#ifdef USE_UV3","\tattribute vec2 uv3;","#endif","#ifdef USE_TANGENT","\tattribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","\tattribute vec4 color;","#elif defined( USE_COLOR )","\tattribute vec3 color;","#endif","#ifdef USE_SKINNING","\tattribute vec4 skinIndex;","\tattribute vec4 skinWeight;","#endif",`
`].filter(vr).join(`
`),p=[Bf(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,d,n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",n.map?"#define USE_MAP":"",n.matcap?"#define USE_MATCAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+u:"",n.envMap?"#define "+h:"",n.envMap?"#define "+c:"",n.envMapPMREM?"#define ENVMAP_MAX_LOD "+n.envMapMaxLod+".0":"",n.envMapPMREM?"#define ENVMAP_SIZE "+n.envMapSize+".0":"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoat?"#define USE_CLEARCOAT":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.diffuseRoughness?"#define USE_DIFFUSE_ROUGHNESS":"",n.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",n.dispersion?"#define USE_DISPERSION":"",n.retroreflection?"#define USE_RETROREFLECTION":"",n.iridescence?"#define USE_IRIDESCENCE":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaTest?"#define USE_ALPHATEST":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.sheen?"#define USE_SHEEN":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors||n.instancingColor?"#define USE_COLOR":"",n.vertexAlphas||n.batchingColor?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.gradientMap?"#define USE_GRADIENTMAP":"",n.flatShading?"#define FLAT_SHADED":"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",n.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",n.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",n.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",n.toneMapping!==En?"#define TONE_MAPPING":"",n.toneMapping!==En?We.tonemapping_pars_fragment:"",n.toneMapping!==En?rv("toneMapping",n.toneMapping):"",n.dithering?"#define DITHERING":"",n.opaque?"#define OPAQUE":"",We.colorspace_pars_fragment,iv("linearToOutputTexel",n.outputColorSpace),av(),n.useDepthPacking?"#define DEPTH_PACKING "+n.depthPacking:"",`
`].filter(vr).join(`
`);if(a=wc(a),a=Nf(a,n),a=Uf(a,n),o=wc(o),o=Nf(o,n),o=Uf(o,n),a=Of(a),o=Of(o),n.isRawShaderMaterial!==!0)g=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",n.glslVersion===Jl?"":"layout(location = 0) out highp vec4 pc_fragColor;",n.glslVersion===Jl?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p;let v=g+m+a,M=g+p+o,y=Df(s,s.VERTEX_SHADER,v),b=Df(s,s.FRAGMENT_SHADER,M);if(s.attachShader(_,y),s.attachShader(_,b),n.index0AttributeName!==void 0)s.bindAttribLocation(_,0,n.index0AttributeName);else if(n.hasPositionAttribute===!0)s.bindAttribLocation(_,0,"position");s.linkProgram(_);function E(P){if(e.debug.checkShaderErrors){let R=s.getProgramInfoLog(_)||"",I=s.getShaderInfoLog(y)||"",F=s.getShaderInfoLog(b)||"",C=R.trim(),O=I.trim(),W=F.trim(),z=!0,te=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(z=!1,typeof e.debug.onShaderError==="function")e.debug.onShaderError(s,_,y,b);else{let V=Ff(s,y,"vertex"),Q=Ff(s,b,"fragment");Ne("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+C+`
`+V+`
`+Q)}else if(C!=="")De("WebGLProgram: Program Info Log:",C);else if(O===""||W==="")te=!1;if(te)P.diagnostics={runnable:z,programLog:C,vertexShader:{log:O,prefix:m},fragmentShader:{log:W,prefix:p}}}s.deleteShader(y),s.deleteShader(b),x=new yr(s,_),S=cv(s,_)}let x;this.getUniforms=function(){if(x===void 0)E(this);return x};let S;this.getAttributes=function(){if(S===void 0)E(this);return S};let A=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){if(A===!1)A=s.getProgramParameter(_,j_);return A},this.destroy=function(){i.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=ev++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=y,this.fragmentShader=b,this}var Sv=0;class nd{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e,t,n){let i=this._getShaderCacheForMaterial(e);if(i.has(t)===!1)i.add(t),t.usedTimes++;if(i.has(n)===!1)i.add(n),n.usedTimes++;return this}remove(e){let t=this.materialCache.get(e);for(let n of t)if(n.usedTimes--,n.usedTimes===0)this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderStage(e){return this._getShaderStage(e.vertexShader)}getFragmentShaderStage(e){return this._getShaderStage(e.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);if(n===void 0)n=new Set,t.set(e,n);return n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);if(n===void 0)n=new id(e),t.set(e,n);return n}}class id{constructor(e){this.id=Sv++,this.code=e,this.usedTimes=0}}function Mv(e){return e===Un||e===ma||e===ga}function bv(e,t,n,i,s,r){let a=new _a,o=new nd,l=new Set,u=[],h=new Map,c=i.logarithmicDepthBuffer,f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function d(x){if(l.add(x),x===0)return"uv";return`uv${x}`}function _(x,S,A,P,R,I){let F=P.fog,C=R.geometry,O=x.isMeshStandardMaterial||x.isMeshLambertMaterial||x.isMeshPhongMaterial?P.environment:null,W=x.isMeshStandardMaterial||x.isMeshLambertMaterial&&!x.envMap||x.isMeshPhongMaterial&&!x.envMap,z=t.get(x.envMap||O,W),te=f[x.type],V=i.precision;if(x.precision!==null){if(V=i.getMaxPrecision(x.precision),V!==x.precision)De("WebGLProgram.getParameters:",x.precision,"not supported, using",V,"instead.")}let Q=C.morphAttributes.position||C.morphAttributes.normal||C.morphAttributes.color,ee=Q!==void 0?Q.length:0,pe=0;if(C.morphAttributes.position!==void 0)pe=1;if(C.morphAttributes.normal!==void 0)pe=2;if(C.morphAttributes.color!==void 0)pe=3;let Z,ie,_e,Re;if(te){let ge=Vn[te];Z=ge.vertexShader,ie=ge.fragmentShader}else{Z=x.vertexShader,ie=x.fragmentShader;let ge=o.getVertexShaderStage(x),dt=o.getFragmentShaderStage(x);o.update(x,ge,dt),_e=ge.id,Re=dt.id}let Ie=e.getRenderTarget(),ve=e.state.buffers.depth.getReversed(),nt=R.isInstancedMesh===!0,Ge=R.isBatchedMesh===!0,ze=!!x.map,ct=!!x.matcap,Qe=!!z,Rt=Qe&&z.isPMREMTexture===!0,Pt=!!x.aoMap,mn=!!x.lightMap,Sn=!!x.bumpMap&&x.wireframe===!1,Dt=!!x.normalMap,Qt=!!x.displacementMap,gn=!!x.emissiveMap,xn=!!x.metalnessMap,In=!!x.roughnessMap,B=x.anisotropy>0,Pn=x.clearcoat>0,ft=x.diffuseRoughness>0,Wt=x.dispersion>0,fe=x.retroreflectivity>0,Mt=x.iridescence>0,Le=x.sheen>0,Oe=x.transmission>0,jt=B&&!!x.anisotropyMap,D=Pn&&!!x.clearcoatMap,T=Pn&&!!x.clearcoatNormalMap,k=Pn&&!!x.clearcoatRoughnessMap,ne=ft&&!!x.diffuseRoughnessMap,j=Mt&&!!x.iridescenceMap,ae=Mt&&!!x.iridescenceThicknessMap,ce=Le&&!!x.sheenColorMap,q=Le&&!!x.sheenRoughnessMap,K=!!x.specularMap,oe=!!x.specularColorMap,N=!!x.specularIntensityMap,J=Oe&&!!x.transmissionMap,Y=Oe&&!!x.thicknessMap,se=!!x.gradientMap,re=!!x.alphaMap,he=x.alphaTest>0,Ee=!!x.alphaHash,we=!!x.extensions,me=En;if(x.toneMapped){if(Ie===null||Ie.isXRRenderTarget===!0)me=e.toneMapping}let Ce=Rt?z.isCompressedCubeTexture?z.image[0].mipmaps:z.mipmaps:null,He={shaderID:te,shaderType:x.type,shaderName:x.name,vertexShader:Z,fragmentShader:ie,defines:x.defines,customVertexShaderID:_e,customFragmentShaderID:Re,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:V,batching:Ge,batchingColor:Ge&&R._colorsTexture!==null,instancing:nt,instancingColor:nt&&R.instanceColor!==null,instancingMorph:nt&&R.morphTexture!==null,outputColorSpace:Ie===null?e.outputColorSpace:Ie.isXRRenderTarget===!0?Ie.texture.colorSpace:Xe.workingColorSpace,alphaToCoverage:!!x.alphaToCoverage,map:ze,matcap:ct,envMap:Qe,envMapMode:Qe&&z.mapping,envMapPMREM:Rt,envMapMaxLod:Rt?Ce.length-1:null,envMapSize:Rt?Ce[0].width:null,aoMap:Pt,lightMap:mn,bumpMap:Sn,normalMap:Dt,displacementMap:Qt,emissiveMap:gn,normalMapObjectSpace:Dt&&x.normalMapType===sf,normalMapTangentSpace:Dt&&x.normalMapType===Xl,packedNormalMap:Dt&&x.normalMapType===Xl&&Mv(x.normalMap.format),metalnessMap:xn,roughnessMap:In,anisotropy:B,anisotropyMap:jt,clearcoat:Pn,clearcoatMap:D,clearcoatNormalMap:T,clearcoatRoughnessMap:k,diffuseRoughness:ft,diffuseRoughnessMap:ne,dispersion:Wt,retroreflection:fe,iridescence:Mt,iridescenceMap:j,iridescenceThicknessMap:ae,sheen:Le,sheenColorMap:ce,sheenRoughnessMap:q,specularMap:K,specularColorMap:oe,specularIntensityMap:N,transmission:Oe,transmissionMap:J,thicknessMap:Y,gradientMap:se,opaque:x.transparent===!1&&x.blending===ri&&x.alphaToCoverage===!1,alphaMap:re,alphaTest:he,alphaHash:Ee,combine:x.combine,mapUv:ze&&d(x.map.channel),aoMapUv:Pt&&d(x.aoMap.channel),lightMapUv:mn&&d(x.lightMap.channel),bumpMapUv:Sn&&d(x.bumpMap.channel),normalMapUv:Dt&&d(x.normalMap.channel),displacementMapUv:Qt&&d(x.displacementMap.channel),emissiveMapUv:gn&&d(x.emissiveMap.channel),metalnessMapUv:xn&&d(x.metalnessMap.channel),roughnessMapUv:In&&d(x.roughnessMap.channel),anisotropyMapUv:jt&&d(x.anisotropyMap.channel),clearcoatMapUv:D&&d(x.clearcoatMap.channel),clearcoatNormalMapUv:T&&d(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:k&&d(x.clearcoatRoughnessMap.channel),diffuseRoughnessMapUv:ne&&d(x.diffuseRoughnessMap.channel),iridescenceMapUv:j&&d(x.iridescenceMap.channel),iridescenceThicknessMapUv:ae&&d(x.iridescenceThicknessMap.channel),sheenColorMapUv:ce&&d(x.sheenColorMap.channel),sheenRoughnessMapUv:q&&d(x.sheenRoughnessMap.channel),specularMapUv:K&&d(x.specularMap.channel),specularColorMapUv:oe&&d(x.specularColorMap.channel),specularIntensityMapUv:N&&d(x.specularIntensityMap.channel),transmissionMapUv:J&&d(x.transmissionMap.channel),thicknessMapUv:Y&&d(x.thicknessMap.channel),alphaMapUv:re&&d(x.alphaMap.channel),vertexTangents:!!C.attributes.tangent&&(Dt||B),vertexNormals:!!C.attributes.normal,vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!C.attributes.color&&C.attributes.color.itemSize===4,pointsUvs:R.isPoints===!0&&!!C.attributes.uv&&(ze||re),fog:!!F,useFog:x.fog===!0,fogExp2:!!F&&F.isFogExp2,flatShading:x.wireframe===!1&&(x.flatShading===!0||C.attributes.normal===void 0&&Dt===!1&&(x.isMeshLambertMaterial||x.isMeshPhongMaterial||x.isMeshStandardMaterial||x.isMeshPhysicalMaterial)),sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:c,reversedDepthBuffer:ve,skinning:R.isSkinnedMesh===!0,hasPositionAttribute:C.attributes.position!==void 0,morphTargets:C.morphAttributes.position!==void 0,morphNormals:C.morphAttributes.normal!==void 0,morphColors:C.morphAttributes.color!==void 0,morphTargetsCount:ee,morphTextureStride:pe,numSunLights:S.sun.length,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numSunLightShadows:S.sunShadowMap.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numLightProbeGrids:I.filter((ge)=>ge.texture!==null).length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:x.dithering,shadowMapEnabled:e.shadowMap.enabled&&A.length>0,shadowMapType:e.shadowMap.type,toneMapping:me,decodeVideoTexture:ze&&x.map.isVideoTexture===!0&&Xe.getTransfer(x.map.colorSpace)===xt,decodeVideoTextureEmissive:gn&&x.emissiveMap.isVideoTexture===!0&&Xe.getTransfer(x.emissiveMap.colorSpace)===xt,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===rn,flipSided:x.side===Ut,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:we&&x.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(we&&x.extensions.multiDraw===!0||Ge)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return He.vertexUv1s=l.has(1),He.vertexUv2s=l.has(2),He.vertexUv3s=l.has(3),l.clear(),He}function m(x){let S=[];if(x.shaderID)S.push(x.shaderID);else S.push(x.customVertexShaderID),S.push(x.customFragmentShaderID);if(x.defines!==void 0)for(let A in x.defines)S.push(A),S.push(x.defines[A]);if(x.isRawShaderMaterial===!1)p(S,x),g(S,x),S.push(e.outputColorSpace);return S.push(x.customProgramCacheKey),S.join()}function p(x,S){x.push(S.precision),x.push(S.outputColorSpace),x.push(S.envMapMode),x.push(S.envMapPMREM),x.push(S.envMapMaxLod),x.push(S.envMapSize),x.push(S.mapUv),x.push(S.alphaMapUv),x.push(S.lightMapUv),x.push(S.aoMapUv),x.push(S.bumpMapUv),x.push(S.normalMapUv),x.push(S.displacementMapUv),x.push(S.emissiveMapUv),x.push(S.metalnessMapUv),x.push(S.roughnessMapUv),x.push(S.anisotropyMapUv),x.push(S.clearcoatMapUv),x.push(S.clearcoatNormalMapUv),x.push(S.clearcoatRoughnessMapUv),x.push(S.diffuseRoughnessMapUv),x.push(S.iridescenceMapUv),x.push(S.iridescenceThicknessMapUv),x.push(S.sheenColorMapUv),x.push(S.sheenRoughnessMapUv),x.push(S.specularMapUv),x.push(S.specularColorMapUv),x.push(S.specularIntensityMapUv),x.push(S.transmissionMapUv),x.push(S.thicknessMapUv),x.push(S.combine),x.push(S.fogExp2),x.push(S.sizeAttenuation),x.push(S.morphTargetsCount),x.push(S.numSunLights),x.push(S.numDirLights),x.push(S.numPointLights),x.push(S.numSpotLights),x.push(S.numSpotLightMaps),x.push(S.numHemiLights),x.push(S.numRectAreaLights),x.push(S.numSunLightShadows),x.push(S.numDirLightShadows),x.push(S.numPointLightShadows),x.push(S.numSpotLightShadows),x.push(S.numSpotLightShadowsWithMaps),x.push(S.numLightProbes),x.push(S.numLightProbeGrids),x.push(S.shadowMapType),x.push(S.toneMapping),x.push(S.numClippingPlanes),x.push(S.numClipIntersection),x.push(S.depthPacking)}function g(x,S){if(a.disableAll(),S.instancing)a.enable(0);if(S.instancingColor)a.enable(1);if(S.instancingMorph)a.enable(2);if(S.matcap)a.enable(3);if(S.envMap)a.enable(4);if(S.normalMapObjectSpace)a.enable(5);if(S.normalMapTangentSpace)a.enable(6);if(S.clearcoat)a.enable(7);if(S.iridescence)a.enable(8);if(S.alphaTest)a.enable(9);if(S.vertexColors)a.enable(10);if(S.vertexAlphas)a.enable(11);if(S.vertexUv1s)a.enable(12);if(S.vertexUv2s)a.enable(13);if(S.vertexUv3s)a.enable(14);if(S.vertexTangents)a.enable(15);if(S.anisotropy)a.enable(16);if(S.alphaHash)a.enable(17);if(S.batching)a.enable(18);if(S.dispersion)a.enable(19);if(S.retroreflection)a.enable(24);if(S.diffuseRoughness)a.enable(25);if(S.batchingColor)a.enable(20);if(S.gradientMap)a.enable(21);if(S.packedNormalMap)a.enable(22);if(S.vertexNormals)a.enable(23);if(x.push(a.mask),a.disableAll(),S.fog)a.enable(0);if(S.useFog)a.enable(1);if(S.flatShading)a.enable(2);if(S.logarithmicDepthBuffer)a.enable(3);if(S.reversedDepthBuffer)a.enable(4);if(S.skinning)a.enable(5);if(S.morphTargets)a.enable(6);if(S.morphNormals)a.enable(7);if(S.morphColors)a.enable(8);if(S.premultipliedAlpha)a.enable(9);if(S.shadowMapEnabled)a.enable(10);if(S.doubleSided)a.enable(11);if(S.flipSided)a.enable(12);if(S.useDepthPacking)a.enable(13);if(S.dithering)a.enable(14);if(S.transmission)a.enable(15);if(S.sheen)a.enable(16);if(S.opaque)a.enable(17);if(S.pointsUvs)a.enable(18);if(S.decodeVideoTexture)a.enable(19);if(S.decodeVideoTextureEmissive)a.enable(20);if(S.alphaToCoverage)a.enable(21);if(S.numLightProbeGrids>0)a.enable(22);if(S.hasPositionAttribute)a.enable(23);x.push(a.mask)}function v(x){let S=f[x.type],A;if(S){let P=Vn[S];A=Aa.clone(P.uniforms)}else A=x.uniforms;return A}function M(x,S){let A=h.get(S);if(A!==void 0)++A.usedTimes;else A=new yv(e,S,x,s),u.push(A),h.set(S,A);return A}function y(x){if(--x.usedTimes===0){let S=u.indexOf(x);u[S]=u[u.length-1],u.pop(),h.delete(x.cacheKey),x.destroy()}}function b(x){o.remove(x)}function E(){o.dispose()}return{getParameters:_,getProgramCacheKey:m,getUniforms:v,acquireProgram:M,releaseProgram:y,releaseShaderCache:b,programs:u,dispose:E}}function Tv(){let e=new WeakMap;function t(a){return e.has(a)}function n(a){let o=e.get(a);if(o===void 0)o={},e.set(a,o);return o}function i(a){e.delete(a)}function s(a,o,l){e.get(a)[o]=l}function r(){e=new WeakMap}return{has:t,get:n,remove:i,update:s,dispose:r}}function wv(e,t){if(e.groupOrder!==t.groupOrder)return e.groupOrder-t.groupOrder;else if(e.renderOrder!==t.renderOrder)return e.renderOrder-t.renderOrder;else if(e.material.id!==t.material.id)return e.material.id-t.material.id;else if(e.materialVariant!==t.materialVariant)return e.materialVariant-t.materialVariant;else if(e.z!==t.z)return e.z-t.z;else return e.id-t.id}function zf(e,t){if(e.groupOrder!==t.groupOrder)return e.groupOrder-t.groupOrder;else if(e.renderOrder!==t.renderOrder)return e.renderOrder-t.renderOrder;else if(e.z!==t.z)return t.z-e.z;else return e.id-t.id}function kf(){let e=[],t=0,n=[],i=[],s=[];function r(){t=0,n.length=0,i.length=0,s.length=0}function a(f){let d=0;if(f.isInstancedMesh)d+=2;if(f.isSkinnedMesh)d+=1;return d}function o(f,d,_,m,p,g){let v=e[t];if(v===void 0)v={id:f.id,object:f,geometry:d,material:_,materialVariant:a(f),groupOrder:m,renderOrder:f.renderOrder,z:p,group:g},e[t]=v;else v.id=f.id,v.object=f,v.geometry=d,v.material=_,v.materialVariant=a(f),v.groupOrder=m,v.renderOrder=f.renderOrder,v.z=p,v.group=g;return t++,v}function l(f,d,_,m,p,g,v){if(v.reversedDepth===!0)p=-p;let M=o(f,d,_,m,p,g);if(_.transmission>0)i.push(M);else if(_.transparent===!0)s.push(M);else n.push(M)}function u(f,d,_,m,p,g){let v=o(f,d,_,m,p,g);if(_.transmission>0)i.unshift(v);else if(_.transparent===!0)s.unshift(v);else n.unshift(v)}function h(f,d){if(n.length>1)n.sort(f||wv);if(i.length>1)i.sort(d||zf);if(s.length>1)s.sort(d||zf)}function c(){for(let f=t,d=e.length;f<d;f++){let _=e[f];if(_.id===null)break;_.id=null,_.object=null,_.geometry=null,_.material=null,_.group=null}}return{opaque:n,transmissive:i,transparent:s,init:r,push:l,unshift:u,finish:c,sort:h}}function Av(){let e=new WeakMap;function t(i,s){let r=e.get(i),a;if(r===void 0)a=new kf,e.set(i,[a]);else if(s>=r.length)a=new kf,r.push(a);else a=r[s];return a}function n(){e=new WeakMap}return{get:t,dispose:n}}function Ev(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case"SunLight":case"DirectionalLight":n={direction:new L,color:new Ae};break;case"SpotLight":n={position:new L,direction:new L,color:new Ae,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":n={position:new L,color:new Ae,distance:0,decay:0};break;case"HemisphereLight":n={direction:new L,skyColor:new Ae,groundColor:new Ae};break;case"RectAreaLight":n={color:new Ae,position:new L,halfWidth:new L,halfHeight:new L};break}return e[t.id]=n,n}}}function Rv(){let e={};return{get:function(t){if(e[t.id]!==void 0)return e[t.id];let n;switch(t.type){case"SunLight":case"DirectionalLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Te};break;case"SpotLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Te};break;case"PointLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Te,shadowCameraNear:1,shadowCameraFar:1000};break}return e[t.id]=n,n}}}var Cv=0;function Iv(e,t){return(t.castShadow?2:0)-(e.castShadow?2:0)+(t.map?1:0)-(e.map?1:0)}function Pv(e){let t=new Ev,n=Rv(),i={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let u=0;u<9;u++)i.probe.push(new L);let s=new L,r=new Pe,a=new Pe;function o(u){let h=0,c=0,f=0;for(let I=0;I<9;I++)i.probe[I].set(0,0,0);let d=0,_=0,m=0,p=0,g=0,v=0,M=0,y=0,b=0,E=0,x=0,S=0,A=0,P=0;u.sort(Iv);for(let I=0,F=u.length;I<F;I++){let C=u[I],{color:O,intensity:W,distance:z}=C,te=null;if(C.shadow&&C.shadow.map)if(C.shadow.map.texture.format===Un)te=C.shadow.map.texture;else te=C.shadow.map.depthTexture||C.shadow.map.texture;if(C.isAmbientLight)h+=O.r*W,c+=O.g*W,f+=O.b*W;else if(C.isLightProbe){for(let V=0;V<9;V++)i.probe[V].addScaledVector(C.sh.coefficients[V],W);P++}else if(C.isSunLight){let V=t.get(C);if(V.color.copy(C.color).multiplyScalar(C.intensity),C.castShadow){let Q=C.shadow,ee=n.get(C);ee.shadowIntensity=Q.intensity,ee.shadowBias=Q.bias,ee.shadowNormalBias=Q.normalBias,ee.shadowRadius=Q.radius,ee.shadowMapSize.copy(Q.mapSize).multiply(Q.getFrameExtents()),i.sunShadow[_]=ee,i.sunShadowMap[_]=te;let pe=Q.getViewportCount();for(let Z=0;Z<pe;Z++)i.sunShadowMatrix[m+Z]=Q.getMatrix(Z),i.sunShadowCascade[m+Z]=Q._cascadeData[Z];m+=pe,_++}i.sun[d]=V,d++}else if(C.isDirectionalLight){let V=t.get(C);if(V.color.copy(C.color).multiplyScalar(C.intensity),C.castShadow){let Q=C.shadow,ee=n.get(C);ee.shadowIntensity=Q.intensity,ee.shadowBias=Q.bias,ee.shadowNormalBias=Q.normalBias,ee.shadowRadius=Q.radius,ee.shadowMapSize=Q.mapSize,i.directionalShadow[p]=ee,i.directionalShadowMap[p]=te,i.directionalShadowMatrix[p]=C.shadow.matrix,b++}i.directional[p]=V,p++}else if(C.isSpotLight){let V=t.get(C);V.position.setFromMatrixPosition(C.matrixWorld),V.color.copy(O).multiplyScalar(W),V.distance=z,V.coneCos=Math.cos(C.angle),V.penumbraCos=Math.cos(C.angle*(1-C.penumbra)),V.decay=C.decay,i.spot[v]=V;let Q=C.shadow;if(C.map){if(i.spotLightMap[S]=C.map,S++,Q.updateMatrices(C),C.castShadow)A++}if(i.spotLightMatrix[v]=Q.matrix,C.castShadow){let ee=n.get(C);ee.shadowIntensity=Q.intensity,ee.shadowBias=Q.bias,ee.shadowNormalBias=Q.normalBias,ee.shadowRadius=Q.radius,ee.shadowMapSize=Q.mapSize,i.spotShadow[v]=ee,i.spotShadowMap[v]=te,x++}v++}else if(C.isRectAreaLight){let V=t.get(C);V.color.copy(O).multiplyScalar(W),V.halfWidth.set(C.width*0.5,0,0),V.halfHeight.set(0,C.height*0.5,0),i.rectArea[M]=V,M++}else if(C.isPointLight){let V=t.get(C);if(V.color.copy(C.color).multiplyScalar(C.intensity),V.distance=C.distance,V.decay=C.decay,C.castShadow){let Q=C.shadow,ee=n.get(C);ee.shadowIntensity=Q.intensity,ee.shadowBias=Q.bias,ee.shadowNormalBias=Q.normalBias,ee.shadowRadius=Q.radius,ee.shadowMapSize=Q.mapSize,ee.shadowCameraNear=Q.camera.near,ee.shadowCameraFar=Q.camera.far,i.pointShadow[g]=ee,i.pointShadowMap[g]=te,i.pointShadowMatrix[g]=C.shadow.matrix,E++}i.point[g]=V,g++}else if(C.isHemisphereLight){let V=t.get(C);V.skyColor.copy(C.color).multiplyScalar(W),V.groundColor.copy(C.groundColor).multiplyScalar(W),i.hemi[y]=V,y++}}if(M>0)if(e.has("OES_texture_float_linear")===!0)i.rectAreaLTC1=de.LTC_FLOAT_1,i.rectAreaLTC2=de.LTC_FLOAT_2;else i.rectAreaLTC1=de.LTC_HALF_1,i.rectAreaLTC2=de.LTC_HALF_2;i.ambient[0]=h,i.ambient[1]=c,i.ambient[2]=f;let R=i.hash;if(R.sunLength!==d||R.directionalLength!==p||R.pointLength!==g||R.spotLength!==v||R.rectAreaLength!==M||R.hemiLength!==y||R.numSunShadows!==_||R.numDirectionalShadows!==b||R.numPointShadows!==E||R.numSpotShadows!==x||R.numSpotMaps!==S||R.numLightProbes!==P)i.sun.length=d,i.directional.length=p,i.spot.length=v,i.rectArea.length=M,i.point.length=g,i.hemi.length=y,i.sunShadow.length=_,i.sunShadowMap.length=_,i.sunShadowMatrix.length=m,i.sunShadowCascade.length=m,i.directionalShadow.length=b,i.directionalShadowMap.length=b,i.directionalShadowMatrix.length=b,i.pointShadow.length=E,i.pointShadowMap.length=E,i.pointShadowMatrix.length=E,i.spotShadow.length=x,i.spotShadowMap.length=x,i.spotLightMatrix.length=x+S-A,i.spotLightMap.length=S,i.numSpotLightShadowsWithMaps=A,i.numLightProbes=P,R.sunLength=d,R.directionalLength=p,R.pointLength=g,R.spotLength=v,R.rectAreaLength=M,R.hemiLength=y,R.numSunShadows=_,R.numDirectionalShadows=b,R.numPointShadows=E,R.numSpotShadows=x,R.numSpotMaps=S,R.numLightProbes=P,i.version=Cv++}function l(u,h){let c=0,f=0,d=0,_=0,m=0,p=0,g=h.matrixWorldInverse;for(let v=0,M=u.length;v<M;v++){let y=u[v];if(y.isSunLight){let b=i.sun[c];b.direction.setFromMatrixPosition(y.matrixWorld),b.direction.transformDirection(g),c++}else if(y.isDirectionalLight){let b=i.directional[f];b.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(g),f++}else if(y.isSpotLight){let b=i.spot[_];b.position.setFromMatrixPosition(y.matrixWorld),b.position.applyMatrix4(g),b.direction.setFromMatrixPosition(y.matrixWorld),s.setFromMatrixPosition(y.target.matrixWorld),b.direction.sub(s),b.direction.transformDirection(g),_++}else if(y.isRectAreaLight){let b=i.rectArea[m];b.position.setFromMatrixPosition(y.matrixWorld),b.position.applyMatrix4(g),a.identity(),r.copy(y.matrixWorld),r.premultiply(g),a.extractRotation(r),b.halfWidth.set(y.width*0.5,0,0),b.halfHeight.set(0,y.height*0.5,0),b.halfWidth.applyMatrix4(a),b.halfHeight.applyMatrix4(a),m++}else if(y.isPointLight){let b=i.point[d];b.position.setFromMatrixPosition(y.matrixWorld),b.position.applyMatrix4(g),d++}else if(y.isHemisphereLight){let b=i.hemi[p];b.direction.setFromMatrixPosition(y.matrixWorld),b.direction.transformDirection(g),p++}}}return{setup:o,setupView:l,state:i}}function Hf(e){let t=new Pv(e),n=[],i=[],s=[];function r(c){h.camera=c,n.length=0,i.length=0,s.length=0}function a(c){if(c.isLightProbeGrid)s.push(c);else n.push(c)}function o(c){i.push(c)}function l(){t.setup(n),s.sort((c,f)=>c.priority-f.priority||c.id-f.id)}function u(c){t.setupView(n,c)}let h={lightsArray:n,shadowsArray:i,lightProbeGridArray:s,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:h,setupLights:l,setupLightsView:u,pushLight:a,pushShadow:o}}function Dv(e){let t=new WeakMap;function n(s,r=0){let a=t.get(s),o;if(a===void 0)o=new Hf(e),t.set(s,[o]);else if(r>=a.length)o=new Hf(e),a.push(o);else o=a[r];return o}function i(){t=new WeakMap}return{get:n,dispose:i}}var Lv=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Fv=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,Nv=[new L(1,0,0),new L(-1,0,0),new L(0,1,0),new L(0,-1,0),new L(0,0,1),new L(0,0,-1)],Uv=[new L(0,-1,0),new L(0,-1,0),new L(0,0,1),new L(0,0,-1),new L(0,-1,0),new L(0,-1,0)],Gf=new Pe,_r=new L,Tc=new L;function Ov(e,t,n){let i=new Ui,s=new Te,r=new Te,a=new rt,o=new ac,l=new oc,u={},h=n.maxTextureSize,c={[Tn]:Ut,[Ut]:Tn,[rn]:rn},f=new kt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Te},radius:{value:4}},vertexShader:Lv,fragmentShader:Fv}),d=f.clone();d.defines.HORIZONTAL_PASS=1;let _=new Tt;_.setAttribute("position",new st(new Float32Array([-1,-1,0.5,3,-1,0.5,-1,3,0.5]),3));let m=new dn(_,f),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=nr;let g=this.type;this.render=function(E,x,S){if(p.enabled===!1)return;if(p.autoUpdate===!1&&p.needsUpdate===!1)return;if(E.length===0)return;if(this.type===Sh)De("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=nr;let A=e.getRenderTarget(),P=e.getActiveCubeFace(),R=e.getActiveMipmapLevel(),I=e.state;if(I.setBlending(Ot),I.buffers.depth.getReversed()===!0)I.buffers.color.setClear(0,0,0,0);else I.buffers.color.setClear(1,1,1,1);I.buffers.depth.setTest(!0),I.setScissorTest(!1);let F=g!==this.type;if(F)x.traverse(function(C){if(C.material)if(Array.isArray(C.material))C.material.forEach((O)=>O.needsUpdate=!0);else C.material.needsUpdate=!0});for(let C=0,O=E.length;C<O;C++){let W=E[C],z=W.shadow;if(z===void 0){De("WebGLShadowMap:",W,"has no shadow.");continue}if(z.autoUpdate===!1&&z.needsUpdate===!1)continue;s.copy(z.mapSize);let te=z.getFrameExtents();if(s.multiply(te),r.copy(z.mapSize),s.x>h||s.y>h){if(s.x>h)r.x=Math.floor(h/te.x),s.x=r.x*te.x,z.mapSize.x=r.x;if(s.y>h)r.y=Math.floor(h/te.y),s.y=r.y*te.y,z.mapSize.y=r.y}let V=e.state.buffers.depth.getReversed();if(z.camera._reversedDepth=V,z.map===null||F===!0){if(z.map!==null){if(z.map.depthTexture!==null)z.map.depthTexture.dispose(),z.map.depthTexture=null;z.map.dispose()}if(this.type===bs){if(W.isPointLight){De("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}z.map=new At(s.x,s.y,{format:Un,type:et,minFilter:Ye,magFilter:Ye,generateMipmaps:!1}),z.map.texture.name=W.name+".shadowMap",z.map.depthTexture=new Si(s.x,s.y,Ve),z.map.depthTexture.name=W.name+".shadowMapDepth",z.map.depthTexture.format=As,z.map.depthTexture.compareFunction=null,z.map.depthTexture.minFilter=qe,z.map.depthTexture.magFilter=qe}else{if(W.isPointLight)z.map=new za(s.x),z.map.depthTexture=new Ta(s.x,fn);else z.map=new At(s.x,s.y),z.map.depthTexture=new Si(s.x,s.y,fn);if(z.map.depthTexture.name=W.name+".shadowMap",z.map.depthTexture.format=As,this.type===nr)z.map.depthTexture.compareFunction=V?Zl:Yl,z.map.depthTexture.minFilter=Ye,z.map.depthTexture.magFilter=Ye;else z.map.depthTexture.compareFunction=null,z.map.depthTexture.minFilter=qe,z.map.depthTexture.magFilter=qe}z.camera.updateProjectionMatrix()}if(z.map.isWebGLCubeRenderTarget!==!0&&(z.map.width!==s.x||z.map.height!==s.y))z.map.setSize(s.x,s.y);let Q=z.map.isWebGLCubeRenderTarget?6:z.getViewportCount();if(W.isPointLight!==!0)z.updateMatrices(W,S);let ee=(z.camera.layers.mask&4294967294)!==0?z.camera.layers:S.layers;for(let pe=0;pe<Q;pe++){let Z=z.getCamera(pe);if(W.isPointLight){let{camera:ie,matrix:_e}=z,Re=W.distance||ie.far;if(Re!==ie.far)ie.far=Re,ie.updateProjectionMatrix();_r.setFromMatrixPosition(W.matrixWorld),ie.position.copy(_r),Tc.copy(ie.position),Tc.add(Nv[pe]),ie.up.copy(Uv[pe]),ie.lookAt(Tc),ie.updateMatrixWorld(),_e.makeTranslation(-_r.x,-_r.y,-_r.z),Gf.multiplyMatrices(ie.projectionMatrix,ie.matrixWorldInverse),z._frustum.setFromProjectionMatrix(Gf,ie.coordinateSystem,ie.reversedDepth)}if(z.map.isWebGLCubeRenderTarget)e.setRenderTarget(z.map,pe),e.clear();else{if(pe===0)e.setRenderTarget(z.map),e.clear();let ie=z.getViewport(pe);a.set(r.x*ie.x,r.y*ie.y,r.x*ie.z,r.y*ie.w),I.viewport(a)}i=z.getFrustum(pe),y(x,S,Z,W,ee,this.type)}if(z.isPointLightShadow!==!0&&this.type===bs)v(z,S);z.needsUpdate=!1}g=this.type,p.needsUpdate=!1,e.setRenderTarget(A,P,R)};function v(E,x){let S=t.update(m);if(f.defines.VSM_SAMPLES!==E.blurSamples)f.defines.VSM_SAMPLES=E.blurSamples,d.defines.VSM_SAMPLES=E.blurSamples,f.needsUpdate=!0,d.needsUpdate=!0;if(E.mapPass===null)E.mapPass=new At(s.x,s.y,{format:Un,type:et});else if(E.mapPass.width!==E.map.width||E.mapPass.height!==E.map.height)E.mapPass.setSize(E.map.width,E.map.height);f.uniforms.shadow_pass.value=E.map.depthTexture,f.uniforms.resolution.value.set(E.map.width,E.map.height),f.uniforms.radius.value=E.radius,e.setRenderTarget(E.mapPass),e.clear(),e.renderBufferDirect(x,null,S,f,m,null),d.uniforms.shadow_pass.value=E.mapPass.texture,d.uniforms.resolution.value.set(E.map.width,E.map.height),d.uniforms.radius.value=E.radius,e.setRenderTarget(E.map),e.clear(),e.renderBufferDirect(x,null,S,d,m,null)}function M(E,x,S,A){let P=null,R=S.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(R!==void 0)P=R;else if(P=S.isPointLight===!0?l:o,e.localClippingEnabled&&x.clipShadows===!0&&Array.isArray(x.clippingPlanes)&&x.clippingPlanes.length!==0||x.displacementMap&&x.displacementScale!==0||x.alphaMap&&x.alphaTest>0||x.map&&x.alphaTest>0||x.alphaToCoverage===!0){let I=P.uuid,F=x.uuid,C=u[I];if(C===void 0)C={},u[I]=C;let O=C[F];if(O===void 0)O=P.clone(),C[F]=O,x.addEventListener("dispose",b);P=O}if(P.visible=x.visible,P.wireframe=x.wireframe,A===bs)P.side=x.shadowSide!==null?x.shadowSide:x.side;else P.side=x.shadowSide!==null?x.shadowSide:c[x.side];if(P.alphaMap=x.alphaMap,P.alphaTest=x.alphaToCoverage===!0?0.5:x.alphaTest,P.map=x.map,P.clipShadows=x.clipShadows,P.clippingPlanes=x.clippingPlanes,P.clipIntersection=x.clipIntersection,P.displacementMap=x.displacementMap,P.displacementScale=x.displacementScale,P.displacementBias=x.displacementBias,P.wireframeLinewidth=x.wireframeLinewidth,P.linewidth=x.linewidth,S.isPointLight===!0&&P.isMeshDistanceMaterial===!0){let I=e.properties.get(P);I.light=S}return P}function y(E,x,S,A,P,R){if(E.visible===!1)return;if(E.layers.test(P)&&(E.isMesh||E.isLine||E.isPoints)){if((E.castShadow||E.receiveShadow&&R===bs)&&(!E.frustumCulled||E.intersectsFrustum(i))){E.modelViewMatrix.multiplyMatrices(S.matrixWorldInverse,E.matrixWorld);let C=t.update(E),O=E.material;if(Array.isArray(O)){let W=C.groups;for(let z=0,te=W.length;z<te;z++){let V=W[z],Q=O[V.materialIndex];if(Q&&Q.visible){let ee=M(E,Q,A,R);E.onBeforeShadow(e,E,x,S,C,ee,V),e.renderBufferDirect(S,null,C,ee,E,V),E.onAfterShadow(e,E,x,S,C,ee,V)}}}else if(O.visible){let W=M(E,O,A,R);E.onBeforeShadow(e,E,x,S,C,W,null),e.renderBufferDirect(S,null,C,W,E,null),E.onAfterShadow(e,E,x,S,C,W,null)}}}let F=E.children;for(let C=0,O=F.length;C<O;C++)y(F[C],x,S,A,P,R)}function b(E){E.target.removeEventListener("dispose",b);for(let S in u){let A=u[S],P=E.target.uuid;if(P in A)A[P].dispose(),delete A[P]}}}function Bv(e,t){function n(){let N=!1,J=new rt,Y=null,se=new rt(0,0,0,0);return{setMask:function(re){if(Y!==re&&!N)e.colorMask(re,re,re,re),Y=re},setLocked:function(re){N=re},setClear:function(re,he,Ee,we,me){if(me===!0)re*=we,he*=we,Ee*=we;if(J.set(re,he,Ee,we),se.equals(J)===!1)e.clearColor(re,he,Ee,we),se.copy(J)},reset:function(){N=!1,Y=null,se.set(-1,0,0,0)}}}function i(){let N=!1,J=!1,Y=null,se=null,re=null;return{setReversed:function(he){if(J!==he){let Ee=t.get("EXT_clip_control");if(he)Ee.clipControlEXT(Ee.LOWER_LEFT_EXT,Ee.ZERO_TO_ONE_EXT);else Ee.clipControlEXT(Ee.LOWER_LEFT_EXT,Ee.NEGATIVE_ONE_TO_ONE_EXT);J=he;let we=re;re=null,this.setClear(we)}},getReversed:function(){return J},setTest:function(he){if(he)ve(e.DEPTH_TEST);else nt(e.DEPTH_TEST)},setMask:function(he){if(Y!==he&&!N)e.depthMask(he),Y=he},setFunc:function(he){if(J)he=df[he];if(se!==he){switch(he){case Gh:e.depthFunc(e.NEVER);break;case Wh:e.depthFunc(e.ALWAYS);break;case Vh:e.depthFunc(e.LESS);break;case ol:e.depthFunc(e.LEQUAL);break;case Xh:e.depthFunc(e.EQUAL);break;case qh:e.depthFunc(e.GEQUAL);break;case Yh:e.depthFunc(e.GREATER);break;case Zh:e.depthFunc(e.NOTEQUAL);break;default:e.depthFunc(e.LEQUAL)}se=he}},setLocked:function(he){N=he},setClear:function(he){if(re!==he){if(re=he,J)he=1-he;e.clearDepth(he)}},reset:function(){N=!1,Y=null,se=null,re=null,J=!1}}}function s(){let N=!1,J=null,Y=null,se=null,re=null,he=null,Ee=null,we=null,me=null;return{setTest:function(Ce){if(!N)if(Ce)ve(e.STENCIL_TEST);else nt(e.STENCIL_TEST)},setMask:function(Ce){if(J!==Ce&&!N)e.stencilMask(Ce),J=Ce},setFunc:function(Ce,He,ge){if(Y!==Ce||se!==He||re!==ge)e.stencilFunc(Ce,He,ge),Y=Ce,se=He,re=ge},setOp:function(Ce,He,ge){if(he!==Ce||Ee!==He||we!==ge)e.stencilOp(Ce,He,ge),he=Ce,Ee=He,we=ge},setLocked:function(Ce){N=Ce},setClear:function(Ce){if(me!==Ce)e.clearStencil(Ce),me=Ce},reset:function(){N=!1,J=null,Y=null,se=null,re=null,he=null,Ee=null,we=null,me=null}}}let r=new n,a=new i,o=new s,l={},u=new WeakMap,h={},c={},f={},d=new WeakMap,_=[],m=null,p=!1,g=null,v=null,M=null,y=null,b=null,E=null,x=null,S=new Ae(0,0,0),A=0,P=!1,R=null,I=null,F=null,C=null,O=null,W=e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS),z=!1,te=0,V=e.getParameter(e.VERSION);if(V.indexOf("WebGL")!==-1)te=parseFloat(/^WebGL (\d)/.exec(V)[1]),z=te>=1;else if(V.indexOf("OpenGL ES")!==-1)te=parseFloat(/^OpenGL ES (\d)/.exec(V)[1]),z=te>=2;let Q=null,ee={},pe=e.getParameter(e.SCISSOR_BOX),Z=e.getParameter(e.VIEWPORT),ie=new rt().fromArray(pe),_e=new rt().fromArray(Z);function Re(N,J,Y,se){let re=new Uint8Array(4),he=e.createTexture();e.bindTexture(N,he),e.texParameteri(N,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(N,e.TEXTURE_MAG_FILTER,e.NEAREST);for(let Ee=0;Ee<Y;Ee++)if(N===e.TEXTURE_3D||N===e.TEXTURE_2D_ARRAY)e.texImage3D(J,0,e.RGBA,1,1,se,0,e.RGBA,e.UNSIGNED_BYTE,re);else e.texImage2D(J+Ee,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,re);return he}let Ie={};Ie[e.TEXTURE_2D]=Re(e.TEXTURE_2D,e.TEXTURE_2D,1),Ie[e.TEXTURE_CUBE_MAP]=Re(e.TEXTURE_CUBE_MAP,e.TEXTURE_CUBE_MAP_POSITIVE_X,6),Ie[e.TEXTURE_2D_ARRAY]=Re(e.TEXTURE_2D_ARRAY,e.TEXTURE_2D_ARRAY,1,1),Ie[e.TEXTURE_3D]=Re(e.TEXTURE_3D,e.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),ve(e.DEPTH_TEST),a.setFunc(ol),Sn(!1),Dt(sl),ve(e.CULL_FACE),Pt(Ot);function ve(N){if(h[N]!==!0)e.enable(N),h[N]=!0}function nt(N){if(h[N]!==!1)e.disable(N),h[N]=!1}function Ge(N,J){if(f[N]!==J){if(e.bindFramebuffer(N,J),f[N]=J,N===e.DRAW_FRAMEBUFFER)f[e.FRAMEBUFFER]=J;if(N===e.FRAMEBUFFER)f[e.DRAW_FRAMEBUFFER]=J;return!0}return!1}function ze(N,J){let Y=_,se=!1;if(N){if(Y=d.get(J),Y===void 0)Y=[],d.set(J,Y);let re=N.textures;if(Y.length!==re.length||Y[0]!==e.COLOR_ATTACHMENT0){for(let he=0,Ee=re.length;he<Ee;he++)Y[he]=e.COLOR_ATTACHMENT0+he;Y.length=re.length,se=!0}}else if(Y[0]!==e.BACK)Y[0]=e.BACK,se=!0;if(se)e.drawBuffers(Y)}function ct(N){if(m!==N)return e.useProgram(N),m=N,!0;return!1}let Qe={[Ts]:e.FUNC_ADD,[bh]:e.FUNC_SUBTRACT,[Th]:e.FUNC_REVERSE_SUBTRACT};Qe[wh]=e.MIN,Qe[Ah]=e.MAX;let Rt={[Eh]:e.ZERO,[Rh]:e.ONE,[Ch]:e.SRC_COLOR,[Ph]:e.SRC_ALPHA,[Oh]:e.SRC_ALPHA_SATURATE,[Nh]:e.DST_COLOR,[Lh]:e.DST_ALPHA,[Ih]:e.ONE_MINUS_SRC_COLOR,[Dh]:e.ONE_MINUS_SRC_ALPHA,[Uh]:e.ONE_MINUS_DST_COLOR,[Fh]:e.ONE_MINUS_DST_ALPHA,[Bh]:e.CONSTANT_COLOR,[zh]:e.ONE_MINUS_CONSTANT_COLOR,[kh]:e.CONSTANT_ALPHA,[Hh]:e.ONE_MINUS_CONSTANT_ALPHA};function Pt(N,J,Y,se,re,he,Ee,we,me,Ce){if(N===Ot){if(p===!0)nt(e.BLEND),p=!1;return}if(p===!1)ve(e.BLEND),p=!0;if(N!==Mh){if(N!==g||Ce!==P){if(v!==Ts||b!==Ts)e.blendEquation(e.FUNC_ADD),v=Ts,b=Ts;if(Ce)switch(N){case ri:e.blendFuncSeparate(e.ONE,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case ir:e.blendFunc(e.ONE,e.ONE);break;case rl:e.blendFuncSeparate(e.ZERO,e.ONE_MINUS_SRC_COLOR,e.ZERO,e.ONE);break;case al:e.blendFuncSeparate(e.DST_COLOR,e.ONE_MINUS_SRC_ALPHA,e.ZERO,e.ONE);break;default:Ne("WebGLState: Invalid blending: ",N);break}else switch(N){case ri:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA,e.ONE,e.ONE_MINUS_SRC_ALPHA);break;case ir:e.blendFuncSeparate(e.SRC_ALPHA,e.ONE,e.ONE,e.ONE);break;case rl:Ne("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case al:Ne("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Ne("WebGLState: Invalid blending: ",N);break}M=null,y=null,E=null,x=null,S.set(0,0,0),A=0,g=N,P=Ce}return}if(re=re||J,he=he||Y,Ee=Ee||se,J!==v||re!==b)e.blendEquationSeparate(Qe[J],Qe[re]),v=J,b=re;if(Y!==M||se!==y||he!==E||Ee!==x)e.blendFuncSeparate(Rt[Y],Rt[se],Rt[he],Rt[Ee]),M=Y,y=se,E=he,x=Ee;if(we.equals(S)===!1||me!==A)e.blendColor(we.r,we.g,we.b,me),S.copy(we),A=me;g=N,P=!1}function mn(N,J){N.side===rn?nt(e.CULL_FACE):ve(e.CULL_FACE);let Y=N.side===Ut;if(J)Y=!Y;Sn(Y),N.blending===ri&&N.transparent===!1?Pt(Ot):Pt(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),a.setFunc(N.depthFunc),a.setTest(N.depthTest),a.setMask(N.depthWrite),r.setMask(N.colorWrite);let se=N.stencilWrite;if(o.setTest(se),se)o.setMask(N.stencilWriteMask),o.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),o.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass);gn(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?ve(e.SAMPLE_ALPHA_TO_COVERAGE):nt(e.SAMPLE_ALPHA_TO_COVERAGE)}function Sn(N){if(R!==N){if(N)e.frontFace(e.CW);else e.frontFace(e.CCW);R=N}}function Dt(N){if(N!==vh){if(ve(e.CULL_FACE),N!==I)if(N===sl)e.cullFace(e.BACK);else if(N===yh)e.cullFace(e.FRONT);else e.cullFace(e.FRONT_AND_BACK)}else nt(e.CULL_FACE);I=N}function Qt(N){if(N!==F){if(z)e.lineWidth(N);F=N}}function gn(N,J,Y){if(N){if(ve(e.POLYGON_OFFSET_FILL),C!==J||O!==Y){if(C=J,O=Y,a.getReversed())J=-J,Y=-Y;e.polygonOffset(J,Y)}}else nt(e.POLYGON_OFFSET_FILL)}function xn(N){if(N)ve(e.SCISSOR_TEST);else nt(e.SCISSOR_TEST)}function In(N){if(N===void 0)N=e.TEXTURE0+W-1;if(Q!==N)e.activeTexture(N),Q=N}function B(N,J,Y){if(Y===void 0)if(Q===null)Y=e.TEXTURE0+W-1;else Y=Q;let se=ee[Y];if(se===void 0)se={type:void 0,texture:void 0},ee[Y]=se;if(se.type!==N||se.texture!==J){if(Q!==Y)e.activeTexture(Y),Q=Y;e.bindTexture(N,J||Ie[N]),se.type=N,se.texture=J}}function Pn(){let N=ee[Q];if(N!==void 0&&N.type!==void 0)e.bindTexture(N.type,null),N.type=void 0,N.texture=void 0}function ft(){try{e.compressedTexImage2D(...arguments)}catch(N){Ne("WebGLState:",N)}}function Wt(){try{e.compressedTexImage3D(...arguments)}catch(N){Ne("WebGLState:",N)}}function fe(){try{e.texSubImage2D(...arguments)}catch(N){Ne("WebGLState:",N)}}function Mt(){try{e.texSubImage3D(...arguments)}catch(N){Ne("WebGLState:",N)}}function Le(){try{e.compressedTexSubImage2D(...arguments)}catch(N){Ne("WebGLState:",N)}}function Oe(){try{e.compressedTexSubImage3D(...arguments)}catch(N){Ne("WebGLState:",N)}}function jt(){try{e.texStorage2D(...arguments)}catch(N){Ne("WebGLState:",N)}}function D(){try{e.texStorage3D(...arguments)}catch(N){Ne("WebGLState:",N)}}function T(){try{e.texImage2D(...arguments)}catch(N){Ne("WebGLState:",N)}}function k(){try{e.texImage3D(...arguments)}catch(N){Ne("WebGLState:",N)}}function ne(N){if(c[N]!==void 0)return c[N];else return e.getParameter(N)}function j(N,J){if(c[N]!==J)e.pixelStorei(N,J),c[N]=J}function ae(N){if(ie.equals(N)===!1)e.scissor(N.x,N.y,N.z,N.w),ie.copy(N)}function ce(N){if(_e.equals(N)===!1)e.viewport(N.x,N.y,N.z,N.w),_e.copy(N)}function q(N,J){let Y=u.get(J);if(Y===void 0)Y=new WeakMap,u.set(J,Y);let se=Y.get(N);if(se===void 0)se=e.getUniformBlockIndex(J,N.name),e.uniformBlockBinding(J,se,se),Y.set(N,se)}function K(N,J,Y){let re=u.get(J).get(N);if(l[re]!==Y)e.bindBufferBase(e.UNIFORM_BUFFER,re,Y),l[re]=Y}function oe(){e.disable(e.BLEND),e.disable(e.CULL_FACE),e.disable(e.DEPTH_TEST),e.disable(e.POLYGON_OFFSET_FILL),e.disable(e.SCISSOR_TEST),e.disable(e.STENCIL_TEST),e.disable(e.SAMPLE_ALPHA_TO_COVERAGE),e.blendEquation(e.FUNC_ADD),e.blendFunc(e.ONE,e.ZERO),e.blendFuncSeparate(e.ONE,e.ZERO,e.ONE,e.ZERO),e.blendColor(0,0,0,0),e.colorMask(!0,!0,!0,!0),e.clearColor(0,0,0,0),e.depthMask(!0),e.depthFunc(e.LESS),a.setReversed(!1),e.clearDepth(1),e.stencilMask(4294967295),e.stencilFunc(e.ALWAYS,0,4294967295),e.stencilOp(e.KEEP,e.KEEP,e.KEEP),e.clearStencil(0),e.cullFace(e.BACK),e.frontFace(e.CCW),e.polygonOffset(0,0),e.activeTexture(e.TEXTURE0),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),e.bindFramebuffer(e.READ_FRAMEBUFFER,null),e.useProgram(null),e.lineWidth(1),e.scissor(0,0,e.canvas.width,e.canvas.height),e.viewport(0,0,e.canvas.width,e.canvas.height),e.pixelStorei(e.PACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.BROWSER_DEFAULT_WEBGL),e.pixelStorei(e.PACK_ROW_LENGTH,0),e.pixelStorei(e.PACK_SKIP_PIXELS,0),e.pixelStorei(e.PACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_ROW_LENGTH,0),e.pixelStorei(e.UNPACK_IMAGE_HEIGHT,0),e.pixelStorei(e.UNPACK_SKIP_PIXELS,0),e.pixelStorei(e.UNPACK_SKIP_ROWS,0),e.pixelStorei(e.UNPACK_SKIP_IMAGES,0),h={},c={},Q=null,ee={},f={},l={},d=new WeakMap,_=[],m=null,p=!1,g=null,v=null,M=null,y=null,b=null,E=null,x=null,S=new Ae(0,0,0),A=0,P=!1,R=null,I=null,F=null,C=null,O=null,ie.set(0,0,e.canvas.width,e.canvas.height),_e.set(0,0,e.canvas.width,e.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:ve,disable:nt,bindFramebuffer:Ge,drawBuffers:ze,useProgram:ct,setBlending:Pt,setMaterial:mn,setFlipSided:Sn,setCullFace:Dt,setLineWidth:Qt,setPolygonOffset:gn,setScissorTest:xn,activeTexture:In,bindTexture:B,unbindTexture:Pn,compressedTexImage2D:ft,compressedTexImage3D:Wt,texImage2D:T,texImage3D:k,pixelStorei:j,getParameter:ne,updateUBOMapping:q,uniformBlockBinding:K,texStorage2D:jt,texStorage3D:D,texSubImage2D:fe,texSubImage3D:Mt,compressedTexSubImage2D:Le,compressedTexSubImage3D:Oe,scissor:ae,viewport:ce,reset:oe}}function zv(e,t,n,i,s,r,a){let o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),u=new Te,h=new WeakMap,c=new Set,f,d=new WeakMap,_=new Set,m=new FinalizationRegistry((D)=>_.delete(D)),p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch(D){}function g(D,T){return p?new OffscreenCanvas(D,T):er("canvas")}function v(D,T,k){let ne=1,j=jt(D);if(j.width>k||j.height>k)ne=k/Math.max(j.width,j.height);if(ne<1)if(typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&D instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&D instanceof ImageBitmap||typeof VideoFrame<"u"&&D instanceof VideoFrame){let ae=Math.floor(ne*j.width),ce=Math.floor(ne*j.height);if(f===void 0)f=g(ae,ce);let q=T?g(ae,ce):f;return q.width=ae,q.height=ce,q.getContext("2d").drawImage(D,0,0,ae,ce),De("WebGLRenderer: Texture has been resized from ("+j.width+"x"+j.height+") to ("+ae+"x"+ce+")."),q}else{if("data"in D)De("WebGLRenderer: Image in DataTexture is too big ("+j.width+"x"+j.height+").");return D}return D}function M(D){return D.generateMipmaps}function y(D){e.generateMipmap(D)}function b(D){if(D.isWebGLCubeRenderTarget)return e.TEXTURE_CUBE_MAP;if(D.isWebGL3DRenderTarget)return e.TEXTURE_3D;if(D.isWebGLArrayRenderTarget||D.isCompressedArrayTexture)return e.TEXTURE_2D_ARRAY;return e.TEXTURE_2D}function E(D,T,k,ne,j,ae=!1){if(D!==null){if(e[D]!==void 0)return e[D];De("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+D+"'")}let ce;if(ne){if(ce=t.get("EXT_texture_norm16"),!ce)De("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension")}let q=T;if(T===e.RED){if(k===e.FLOAT)q=e.R32F;if(k===e.HALF_FLOAT)q=e.R16F;if(k===e.UNSIGNED_BYTE)q=e.R8;if(k===e.UNSIGNED_SHORT&&ce)q=ce.R16_EXT;if(k===e.SHORT&&ce)q=ce.R16_SNORM_EXT}if(T===e.RED_INTEGER){if(k===e.UNSIGNED_BYTE)q=e.R8UI;if(k===e.UNSIGNED_SHORT)q=e.R16UI;if(k===e.UNSIGNED_INT)q=e.R32UI;if(k===e.BYTE)q=e.R8I;if(k===e.SHORT)q=e.R16I;if(k===e.INT)q=e.R32I}if(T===e.RG){if(k===e.FLOAT)q=e.RG32F;if(k===e.HALF_FLOAT)q=e.RG16F;if(k===e.UNSIGNED_BYTE)q=e.RG8;if(k===e.UNSIGNED_SHORT&&ce)q=ce.RG16_EXT;if(k===e.SHORT&&ce)q=ce.RG16_SNORM_EXT}if(T===e.RG_INTEGER){if(k===e.UNSIGNED_BYTE)q=e.RG8UI;if(k===e.UNSIGNED_SHORT)q=e.RG16UI;if(k===e.UNSIGNED_INT)q=e.RG32UI;if(k===e.BYTE)q=e.RG8I;if(k===e.SHORT)q=e.RG16I;if(k===e.INT)q=e.RG32I}if(T===e.RGB_INTEGER){if(k===e.UNSIGNED_BYTE)q=e.RGB8UI;if(k===e.UNSIGNED_SHORT)q=e.RGB16UI;if(k===e.UNSIGNED_INT)q=e.RGB32UI;if(k===e.BYTE)q=e.RGB8I;if(k===e.SHORT)q=e.RGB16I;if(k===e.INT)q=e.RGB32I}if(T===e.RGBA_INTEGER){if(k===e.UNSIGNED_BYTE)q=e.RGBA8UI;if(k===e.UNSIGNED_SHORT)q=e.RGBA16UI;if(k===e.UNSIGNED_INT)q=e.RGBA32UI;if(k===e.BYTE)q=e.RGBA8I;if(k===e.SHORT)q=e.RGBA16I;if(k===e.INT)q=e.RGBA32I}if(T===e.RGB){if(k===e.UNSIGNED_SHORT&&ce)q=ce.RGB16_EXT;if(k===e.SHORT&&ce)q=ce.RGB16_SNORM_EXT;if(k===e.UNSIGNED_INT_5_9_9_9_REV)q=e.RGB9_E5;if(k===e.UNSIGNED_INT_10F_11F_11F_REV)q=e.R11F_G11F_B10F}if(T===e.RGBA){let K=ae?ql:Xe.getTransfer(j);if(k===e.FLOAT)q=e.RGBA32F;if(k===e.HALF_FLOAT)q=e.RGBA16F;if(k===e.UNSIGNED_BYTE)q=K===xt?e.SRGB8_ALPHA8:e.RGBA8;if(k===e.UNSIGNED_SHORT&&ce)q=ce.RGBA16_EXT;if(k===e.SHORT&&ce)q=ce.RGBA16_SNORM_EXT;if(k===e.UNSIGNED_SHORT_4_4_4_4)q=e.RGBA4;if(k===e.UNSIGNED_SHORT_5_5_5_1)q=e.RGB5_A1}if(q===e.R16F||q===e.R32F||q===e.RG16F||q===e.RG32F||q===e.RGBA16F||q===e.RGBA32F)t.get("EXT_color_buffer_float");return q}function x(D,T){let k;if(D){if(T===null||T===fn||T===ki)k=e.DEPTH24_STENCIL8;else if(T===Ve)k=e.DEPTH32F_STENCIL8;else if(T===Bi)k=e.DEPTH24_STENCIL8,De("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")}else if(T===null||T===fn||T===ki)k=e.DEPTH_COMPONENT24;else if(T===Ve)k=e.DEPTH_COMPONENT32F;else if(T===Bi)k=e.DEPTH_COMPONENT16;return k}function S(D,T){if(M(D)===!0||D.isFramebufferTexture&&D.minFilter!==qe&&D.minFilter!==Ye)return Math.log2(Math.max(T.width,T.height))+1;else if(D.mipmaps.length>0)return D.mipmaps.length;else if(D.isCompressedTexture&&Array.isArray(D.image))return T.mipmaps.length;else return 1}function A(D){let T=new WeakRef(D);i.get(D).__ref=T,_.add(T),m.register(D,T,T)}function P(D){let T=i.get(D).__ref;if(T===void 0)return;_.delete(T),m.unregister(T)}function R(D){F(D.target)}function I(D){C(D.target)}function F(D){if(D.removeEventListener("dispose",R),P(D),W(D),D.isVideoTexture)h.delete(D);if(D.isHTMLTexture)c.delete(D)}function C(D){D.removeEventListener("dispose",I),P(D),te(D)}function O(){for(let D of _){let T=D.deref();if(T===void 0)continue;if(T.isRenderTarget===!0)C(T);else F(T)}_.clear(),c.clear()}function W(D){let T=i.get(D);if(T.__webglInit===void 0)return;let k=D.source,ne=d.get(k);if(ne){let j=ne[T.__cacheKey];if(j.usedTimes--,j.usedTimes===0)z(D);if(Object.keys(ne).length===0)d.delete(k)}i.remove(D)}function z(D){let T=i.get(D);e.deleteTexture(T.__webglTexture);let k=D.source,ne=d.get(k);delete ne[T.__cacheKey],a.memory.textures--}function te(D){let T=i.get(D);if(T.__depthDisposeCallback)T.__depthDisposeCallback();let k=D.depthTexture;if(k&&k.renderTarget===D)F(k);if(D.isWebGLCubeRenderTarget)for(let j=0;j<6;j++){if(Array.isArray(T.__webglFramebuffer[j]))for(let ae=0;ae<T.__webglFramebuffer[j].length;ae++)e.deleteFramebuffer(T.__webglFramebuffer[j][ae]);else e.deleteFramebuffer(T.__webglFramebuffer[j]);if(T.__webglDepthbuffer)e.deleteRenderbuffer(T.__webglDepthbuffer[j])}else{if(Array.isArray(T.__webglFramebuffer))for(let j=0;j<T.__webglFramebuffer.length;j++)e.deleteFramebuffer(T.__webglFramebuffer[j]);else e.deleteFramebuffer(T.__webglFramebuffer);if(T.__webglDepthbuffer)e.deleteRenderbuffer(T.__webglDepthbuffer);if(T.__webglMultisampledFramebuffer)e.deleteFramebuffer(T.__webglMultisampledFramebuffer);if(T.__webglColorRenderbuffer){for(let j=0;j<T.__webglColorRenderbuffer.length;j++)if(T.__webglColorRenderbuffer[j])e.deleteRenderbuffer(T.__webglColorRenderbuffer[j])}if(T.__webglDepthRenderbuffer)e.deleteRenderbuffer(T.__webglDepthRenderbuffer)}let ne=D.textures;for(let j=0,ae=ne.length;j<ae;j++){let ce=i.get(ne[j]);if(ce.__webglTexture)e.deleteTexture(ce.__webglTexture),a.memory.textures--;i.remove(ne[j])}i.remove(D)}let V=0;function Q(){V=0}function ee(){return V}function pe(D){V=D}function Z(){let D=V;if(D>=s.maxTextures)De("WebGLTextures: Trying to use "+(D+1)+" texture units while this GPU supports only "+s.maxTextures);return V+=1,D}function ie(D){let T=[];return T.push(D.wrapS),T.push(D.wrapT),T.push(D.wrapR||0),T.push(D.magFilter),T.push(D.minFilter),T.push(D.anisotropy),T.push(D.internalFormat),T.push(D.format),T.push(D.type),T.push(D.generateMipmaps),T.push(D.mipmapsAutoUpdate),T.push(D.premultiplyAlpha),T.push(D.flipY),T.push(D.unpackAlignment),T.push(D.colorSpace),T.join()}function _e(D,T){let k=i.get(D);if(D.isVideoTexture)Le(D);if(D.isRenderTargetTexture===!1&&D.isExternalTexture!==!0&&D.version>0&&k.__version!==D.version){let ne=D.image;if(ne===null)De("WebGLRenderer: Texture marked for update but no image data found.");else if(ne.complete===!1)De("WebGLRenderer: Texture marked for update but image is incomplete");else{mn(k,D,T);return}}else if(D.isExternalTexture)k.__webglTexture=D.sourceTexture?D.sourceTexture:null;n.bindTexture(e.TEXTURE_2D,k.__webglTexture,e.TEXTURE0+T)}function Re(D,T){let k=i.get(D);if(D.isRenderTargetTexture===!1&&D.version>0&&k.__version!==D.version){mn(k,D,T);return}else if(D.isExternalTexture)k.__webglTexture=D.sourceTexture?D.sourceTexture:null;n.bindTexture(e.TEXTURE_2D_ARRAY,k.__webglTexture,e.TEXTURE0+T)}function Ie(D,T){let k=i.get(D);if(D.isRenderTargetTexture===!1&&D.version>0&&k.__version!==D.version){mn(k,D,T);return}n.bindTexture(e.TEXTURE_3D,k.__webglTexture,e.TEXTURE0+T)}function ve(D,T){let k=i.get(D);if(D.version>0&&k.__version!==D.version){Sn(k,D,T);return}n.bindTexture(e.TEXTURE_CUBE_MAP,k.__webglTexture,e.TEXTURE0+T)}let nt={[Kt]:e.REPEAT,[Bt]:e.CLAMP_TO_EDGE,[or]:e.MIRRORED_REPEAT},Ge={[qe]:e.NEAREST,[Qh]:e.NEAREST_MIPMAP_NEAREST,[lr]:e.NEAREST_MIPMAP_LINEAR,[Ye]:e.LINEAR,[ca]:e.LINEAR_MIPMAP_NEAREST,[xi]:e.LINEAR_MIPMAP_LINEAR},ze={[rf]:e.NEVER,[$l]:e.ALWAYS,[af]:e.LESS,[Yl]:e.LEQUAL,[of]:e.EQUAL,[Zl]:e.GEQUAL,[lf]:e.GREATER,[cf]:e.NOTEQUAL};function ct(D,T){if(T.type===Ve&&t.has("OES_texture_float_linear")===!1&&(T.magFilter===Ye||T.magFilter===ca||T.magFilter===lr||T.magFilter===xi||T.minFilter===Ye||T.minFilter===ca||T.minFilter===lr||T.minFilter===xi))De("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device.");if(e.texParameteri(D,e.TEXTURE_WRAP_S,nt[T.wrapS]),e.texParameteri(D,e.TEXTURE_WRAP_T,nt[T.wrapT]),D===e.TEXTURE_3D||D===e.TEXTURE_2D_ARRAY)e.texParameteri(D,e.TEXTURE_WRAP_R,nt[T.wrapR]);if(e.texParameteri(D,e.TEXTURE_MAG_FILTER,Ge[T.magFilter]),e.texParameteri(D,e.TEXTURE_MIN_FILTER,Ge[T.minFilter]),T.compareFunction)e.texParameteri(D,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(D,e.TEXTURE_COMPARE_FUNC,ze[T.compareFunction]);if(t.has("EXT_texture_filter_anisotropic")===!0){if(T.magFilter===qe)return;if(T.minFilter!==lr&&T.minFilter!==xi)return;if(T.type===Ve&&t.has("OES_texture_float_linear")===!1)return;if(T.anisotropy>1||i.get(T).__currentAnisotropy){let k=t.get("EXT_texture_filter_anisotropic");e.texParameterf(D,k.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(T.anisotropy,s.getMaxAnisotropy())),i.get(T).__currentAnisotropy=T.anisotropy}}}function Qe(D,T){let k=!1;if(D.__webglInit===void 0)D.__webglInit=!0,T.addEventListener("dispose",R),A(T);let ne=T.source,j=d.get(ne);if(j===void 0)j={},d.set(ne,j);let ae=ie(T);if(ae!==D.__cacheKey){if(j[ae]===void 0)j[ae]={texture:e.createTexture(),usedTimes:0},a.memory.textures++,k=!0;j[ae].usedTimes++;let ce=j[D.__cacheKey];if(ce!==void 0){if(j[D.__cacheKey].usedTimes--,ce.usedTimes===0)z(T)}D.__cacheKey=ae,D.__webglTexture=j[ae].texture}return k}function Rt(D,T,k){return Math.floor(Math.floor(D/k)/T)}function Pt(D,T,k,ne){let ae=D.updateRanges;if(ae.length===0)n.texSubImage2D(e.TEXTURE_2D,0,0,0,T.width,T.height,k,ne,T.data);else{ae.sort((N,J)=>N.start-J.start);let ce=0;for(let N=1;N<ae.length;N++){let J=ae[ce],Y=ae[N],se=J.start+J.count,re=Rt(Y.start,T.width,4),he=Rt(J.start,T.width,4);if(Y.start<=se+1&&re===he&&Rt(Y.start+Y.count-1,T.width,4)===re)J.count=Math.max(J.count,Y.start+Y.count-J.start);else++ce,ae[ce]=Y}ae.length=ce+1;let q=n.getParameter(e.UNPACK_ROW_LENGTH),K=n.getParameter(e.UNPACK_SKIP_PIXELS),oe=n.getParameter(e.UNPACK_SKIP_ROWS);n.pixelStorei(e.UNPACK_ROW_LENGTH,T.width);for(let N=0,J=ae.length;N<J;N++){let Y=ae[N],se=Math.floor(Y.start/4),re=Math.ceil(Y.count/4),he=se%T.width,Ee=Math.floor(se/T.width),we=re,me=1;n.pixelStorei(e.UNPACK_SKIP_PIXELS,he),n.pixelStorei(e.UNPACK_SKIP_ROWS,Ee),n.texSubImage2D(e.TEXTURE_2D,0,he,Ee,we,1,k,ne,T.data)}D.clearUpdateRanges(),n.pixelStorei(e.UNPACK_ROW_LENGTH,q),n.pixelStorei(e.UNPACK_SKIP_PIXELS,K),n.pixelStorei(e.UNPACK_SKIP_ROWS,oe)}}function mn(D,T,k){let ne=e.TEXTURE_2D;if(T.isDataArrayTexture||T.isCompressedArrayTexture)ne=e.TEXTURE_2D_ARRAY;if(T.isData3DTexture)ne=e.TEXTURE_3D;let j=Qe(D,T),ae=T.source;n.bindTexture(ne,D.__webglTexture,e.TEXTURE0+k);let ce=i.get(ae);if(ae.version!==ce.__version||j===!0){if(n.activeTexture(e.TEXTURE0+k),(typeof ImageBitmap<"u"&&T.image instanceof ImageBitmap)===!1){let me=Xe.getPrimaries(Xe.workingColorSpace),Ce=T.colorSpace===oi?null:Xe.getPrimaries(T.colorSpace),He=T.colorSpace===oi||me===Ce?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,T.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,He)}n.pixelStorei(e.UNPACK_ALIGNMENT,T.unpackAlignment);let K=v(T.image,!1,s.maxTextureSize);K=Oe(T,K);let oe=r.convert(T.format,T.colorSpace),N=r.convert(T.type),J=E(T.internalFormat,oe,N,T.normalized,T.colorSpace,T.isVideoTexture);ct(ne,T);let Y,se=T.mipmaps,re=T.isVideoTexture!==!0,he=ce.__version===void 0||j===!0,Ee=ae.dataReady,we=S(T,K);if(T.isDepthTexture){if(J=x(T.format===_i,T.type),he)if(re)n.texStorage2D(e.TEXTURE_2D,1,J,K.width,K.height);else n.texImage2D(e.TEXTURE_2D,0,J,K.width,K.height,0,oe,N,null)}else if(T.isDataTexture)if(se.length>0){if(re&&he)n.texStorage2D(e.TEXTURE_2D,we,J,se[0].width,se[0].height);for(let me=0,Ce=se.length;me<Ce;me++)if(Y=se[me],re){if(Ee)n.texSubImage2D(e.TEXTURE_2D,me,0,0,Y.width,Y.height,oe,N,Y.data)}else n.texImage2D(e.TEXTURE_2D,me,J,Y.width,Y.height,0,oe,N,Y.data);T.generateMipmaps=!1}else if(re){if(he)n.texStorage2D(e.TEXTURE_2D,we,J,K.width,K.height);if(Ee)Pt(T,K,oe,N)}else n.texImage2D(e.TEXTURE_2D,0,J,K.width,K.height,0,oe,N,K.data);else if(T.isCompressedTexture)if(T.isCompressedArrayTexture){if(re&&he)n.texStorage3D(e.TEXTURE_2D_ARRAY,we,J,se[0].width,se[0].height,K.depth);for(let me=0,Ce=se.length;me<Ce;me++)if(Y=se[me],T.format!==ke)if(oe!==null)if(re){if(Ee)if(T.layerUpdates.size>0){let He=Mc(Y.width,Y.height,T.format,T.type);for(let ge of T.layerUpdates){let dt=Y.data.subarray(ge*He/Y.data.BYTES_PER_ELEMENT,(ge+1)*He/Y.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,me,0,0,ge,Y.width,Y.height,1,oe,dt)}}else n.compressedTexSubImage3D(e.TEXTURE_2D_ARRAY,me,0,0,0,Y.width,Y.height,K.depth,oe,Y.data)}else n.compressedTexImage3D(e.TEXTURE_2D_ARRAY,me,J,Y.width,Y.height,K.depth,0,Y.data,0,0);else De("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else if(re){if(Ee)n.texSubImage3D(e.TEXTURE_2D_ARRAY,me,0,0,0,Y.width,Y.height,K.depth,oe,N,Y.data)}else n.texImage3D(e.TEXTURE_2D_ARRAY,me,J,Y.width,Y.height,K.depth,0,oe,N,Y.data);if(T.layerUpdates.size>0)T.clearLayerUpdates()}else{if(re&&he)n.texStorage2D(e.TEXTURE_2D,we,J,se[0].width,se[0].height);for(let me=0,Ce=se.length;me<Ce;me++)if(Y=se[me],T.format!==ke)if(oe!==null)if(re){if(Ee)n.compressedTexSubImage2D(e.TEXTURE_2D,me,0,0,Y.width,Y.height,oe,Y.data)}else n.compressedTexImage2D(e.TEXTURE_2D,me,J,Y.width,Y.height,0,Y.data);else De("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else if(re){if(Ee)n.texSubImage2D(e.TEXTURE_2D,me,0,0,Y.width,Y.height,oe,N,Y.data)}else n.texImage2D(e.TEXTURE_2D,me,J,Y.width,Y.height,0,oe,N,Y.data)}else if(T.isDataArrayTexture)if(re){if(he)n.texStorage3D(e.TEXTURE_2D_ARRAY,we,J,K.width,K.height,K.depth);if(Ee)if(T.layerUpdates.size>0){let me=Mc(K.width,K.height,T.format,T.type);for(let Ce of T.layerUpdates){let He=K.data.subarray(Ce*me/K.data.BYTES_PER_ELEMENT,(Ce+1)*me/K.data.BYTES_PER_ELEMENT);n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,Ce,K.width,K.height,1,oe,N,He)}T.clearLayerUpdates()}else n.texSubImage3D(e.TEXTURE_2D_ARRAY,0,0,0,0,K.width,K.height,K.depth,oe,N,K.data)}else n.texImage3D(e.TEXTURE_2D_ARRAY,0,J,K.width,K.height,K.depth,0,oe,N,K.data);else if(T.isData3DTexture)if(re){if(he)n.texStorage3D(e.TEXTURE_3D,we,J,K.width,K.height,K.depth);if(Ee)n.texSubImage3D(e.TEXTURE_3D,0,0,0,0,K.width,K.height,K.depth,oe,N,K.data)}else n.texImage3D(e.TEXTURE_3D,0,J,K.width,K.height,K.depth,0,oe,N,K.data);else if(T.isFramebufferTexture){if(he)if(re)n.texStorage2D(e.TEXTURE_2D,we,J,K.width,K.height);else{let me=K.width,Ce=K.height;for(let He=0;He<we;He++)n.texImage2D(e.TEXTURE_2D,He,J,me,Ce,0,oe,N,null),me>>=1,Ce>>=1}}else if(T.isHTMLTexture){if("texElementImage2D"in e){let me=e.canvas;if(!me.hasAttribute("layoutsubtree"))me.setAttribute("layoutsubtree","true");if(K.parentNode!==me){me.appendChild(K),c.add(T),me.onpaint=(Ce)=>{let He=Ce.changedElements;for(let ge of c)if(He.includes(ge.image))ge.needsUpdate=!0},me.requestPaint();return}if(e.texElementImage2D.length===3)e.texElementImage2D(e.TEXTURE_2D,e.RGBA8,K);else{let{RGBA:He,RGBA:ge,UNSIGNED_BYTE:dt}=e;e.texElementImage2D(e.TEXTURE_2D,0,He,ge,dt,K)}e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE)}}else if(se.length>0){if(re&&he){let me=jt(se[0]);n.texStorage2D(e.TEXTURE_2D,we,J,me.width,me.height)}for(let me=0,Ce=se.length;me<Ce;me++)if(Y=se[me],re){if(Ee)n.texSubImage2D(e.TEXTURE_2D,me,0,0,oe,N,Y)}else n.texImage2D(e.TEXTURE_2D,me,J,oe,N,Y);T.generateMipmaps=!1}else if(re){if(he){let me=jt(K);n.texStorage2D(e.TEXTURE_2D,we,J,me.width,me.height)}if(Ee)n.texSubImage2D(e.TEXTURE_2D,0,0,0,oe,N,K)}else n.texImage2D(e.TEXTURE_2D,0,J,oe,N,K);if(M(T)&&T.mipmapsAutoUpdate===!0)y(ne);if(ce.__version=ae.version,T.onUpdate)T.onUpdate(T)}D.__version=T.version}function Sn(D,T,k){if(T.image.length!==6)return;let ne=Qe(D,T),j=T.source;n.bindTexture(e.TEXTURE_CUBE_MAP,D.__webglTexture,e.TEXTURE0+k);let ae=i.get(j);if(j.version!==ae.__version||ne===!0){n.activeTexture(e.TEXTURE0+k);let ce=Xe.getPrimaries(Xe.workingColorSpace),q=T.colorSpace===oi?null:Xe.getPrimaries(T.colorSpace),K=T.colorSpace===oi||ce===q?e.NONE:e.BROWSER_DEFAULT_WEBGL;n.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,T.flipY),n.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),n.pixelStorei(e.UNPACK_ALIGNMENT,T.unpackAlignment),n.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,K);let oe=T.isCompressedTexture||T.image[0].isCompressedTexture,N=T.image[0]&&T.image[0].isDataTexture,J=[];for(let ge=0;ge<6;ge++){if(!oe&&!N)J[ge]=v(T.image[ge],!0,s.maxCubemapSize);else J[ge]=N?T.image[ge].image:T.image[ge];J[ge]=Oe(T,J[ge])}let Y=J[0],se=r.convert(T.format,T.colorSpace),re=r.convert(T.type),he=E(T.internalFormat,se,re,T.normalized,T.colorSpace),Ee=T.isVideoTexture!==!0,we=ae.__version===void 0||ne===!0,me=j.dataReady,Ce=S(T,Y);ct(e.TEXTURE_CUBE_MAP,T);let He;if(T.isDepthTexture){if(he=x(T.format===_i,T.type),we)if(Ee)n.texStorage2D(e.TEXTURE_CUBE_MAP,1,he,Y.width,Y.height);else for(let ge=0;ge<6;ge++)n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+ge,0,he,Y.width,Y.height,0,se,re,null)}else if(oe){if(Ee&&we)n.texStorage2D(e.TEXTURE_CUBE_MAP,Ce,he,Y.width,Y.height);for(let ge=0;ge<6;ge++){He=J[ge].mipmaps;for(let dt=0;dt<He.length;dt++){let Vt=He[dt];if(T.format!==ke)if(se!==null)if(Ee){if(me)n.compressedTexSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+ge,dt,0,0,Vt.width,Vt.height,se,Vt.data)}else n.compressedTexImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+ge,dt,he,Vt.width,Vt.height,0,Vt.data);else De("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()");else if(Ee){if(me)n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+ge,dt,0,0,Vt.width,Vt.height,se,re,Vt.data)}else n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+ge,dt,he,Vt.width,Vt.height,0,se,re,Vt.data)}}}else{if(He=T.mipmaps,Ee&&we){if(He.length>0)Ce++;let ge=jt(J[0]);n.texStorage2D(e.TEXTURE_CUBE_MAP,Ce,he,ge.width,ge.height)}for(let ge=0;ge<6;ge++)if(N){if(Ee){if(me)n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+ge,0,0,0,J[ge].width,J[ge].height,se,re,J[ge].data)}else n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+ge,0,he,J[ge].width,J[ge].height,0,se,re,J[ge].data);for(let dt=0;dt<He.length;dt++){let Zn=He[dt].image[ge].image;if(Ee){if(me)n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+ge,dt+1,0,0,Zn.width,Zn.height,se,re,Zn.data)}else n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+ge,dt+1,he,Zn.width,Zn.height,0,se,re,Zn.data)}}else{if(Ee){if(me)n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+ge,0,0,0,se,re,J[ge])}else n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+ge,0,he,se,re,J[ge]);for(let dt=0;dt<He.length;dt++){let Vt=He[dt];if(Ee){if(me)n.texSubImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+ge,dt+1,0,0,se,re,Vt.image[ge])}else n.texImage2D(e.TEXTURE_CUBE_MAP_POSITIVE_X+ge,dt+1,he,se,re,Vt.image[ge])}}}if(M(T)&&T.mipmapsAutoUpdate===!0)y(e.TEXTURE_CUBE_MAP);if(ae.__version=j.version,T.onUpdate)T.onUpdate(T)}D.__version=T.version}function Dt(D,T,k,ne,j,ae){let ce=r.convert(k.format,k.colorSpace),q=r.convert(k.type),K=E(k.internalFormat,ce,q,k.normalized,k.colorSpace),oe=i.get(T),N=i.get(k);if(N.__renderTarget=T,!oe.__hasExternalTextures){let J=Math.max(1,T.width>>ae),Y=Math.max(1,T.height>>ae);if(j===e.TEXTURE_3D||j===e.TEXTURE_2D_ARRAY)n.texImage3D(j,ae,K,J,Y,T.depth,0,ce,q,null);else n.texImage2D(j,ae,K,J,Y,0,ce,q,null)}if(n.bindFramebuffer(e.FRAMEBUFFER,D),Mt(T))o.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,ne,j,N.__webglTexture,0,fe(T));else if(j===e.TEXTURE_2D||j>=e.TEXTURE_CUBE_MAP_POSITIVE_X&&j<=e.TEXTURE_CUBE_MAP_NEGATIVE_Z)e.framebufferTexture2D(e.FRAMEBUFFER,ne,j,N.__webglTexture,ae);n.bindFramebuffer(e.FRAMEBUFFER,null)}function Qt(D,T,k){if(e.bindRenderbuffer(e.RENDERBUFFER,D),T.depthBuffer){let ne=T.depthTexture,j=ne&&ne.isDepthTexture?ne.type:null,ae=x(T.stencilBuffer,j),ce=T.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;if(Mt(T))o.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,fe(T),ae,T.width,T.height);else if(k)e.renderbufferStorageMultisample(e.RENDERBUFFER,fe(T),ae,T.width,T.height);else e.renderbufferStorage(e.RENDERBUFFER,ae,T.width,T.height);e.framebufferRenderbuffer(e.FRAMEBUFFER,ce,e.RENDERBUFFER,D)}else{let ne=T.textures;for(let j=0;j<ne.length;j++){let ae=ne[j],ce=r.convert(ae.format,ae.colorSpace),q=r.convert(ae.type),K=E(ae.internalFormat,ce,q,ae.normalized,ae.colorSpace);if(Mt(T))o.renderbufferStorageMultisampleEXT(e.RENDERBUFFER,fe(T),K,T.width,T.height);else if(k)e.renderbufferStorageMultisample(e.RENDERBUFFER,fe(T),K,T.width,T.height);else e.renderbufferStorage(e.RENDERBUFFER,K,T.width,T.height)}}e.bindRenderbuffer(e.RENDERBUFFER,null)}function gn(D,T,k){let ne=T.isWebGLCubeRenderTarget===!0;if(n.bindFramebuffer(e.FRAMEBUFFER,D),!(T.depthTexture&&T.depthTexture.isDepthTexture))throw Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let j=i.get(T.depthTexture);j.__renderTarget=T;let ae=ne?T.depthTexture.image[0]:T.depthTexture.image;if(!j.__webglTexture||ae.width!==T.width||ae.height!==T.height)ae.width=T.width,ae.height=T.height,T.depthTexture.needsUpdate=!0;if(ne)ve(T.depthTexture,0);else _e(T.depthTexture,0);let ce=j.__webglTexture,q=fe(T),K=ne?e.TEXTURE_CUBE_MAP_POSITIVE_X+k:e.TEXTURE_2D,oe=T.depthTexture.format===_i?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;if(T.depthTexture.format===As)if(Mt(T))o.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,oe,K,ce,0,q);else e.framebufferTexture2D(e.FRAMEBUFFER,oe,K,ce,0);else if(T.depthTexture.format===_i)if(Mt(T))o.framebufferTexture2DMultisampleEXT(e.FRAMEBUFFER,oe,K,ce,0,q);else e.framebufferTexture2D(e.FRAMEBUFFER,oe,K,ce,0);else throw Error("THREE.WebGLTextures: Unknown depthTexture format.")}function xn(D){let T=i.get(D),k=D.isWebGLCubeRenderTarget===!0;if(T.__boundDepthTexture!==D.depthTexture){let ne=D.depthTexture;if(T.__depthDisposeCallback)T.__depthDisposeCallback();if(ne){let j=()=>{delete T.__boundDepthTexture,delete T.__depthDisposeCallback,ne.removeEventListener("dispose",j)};ne.addEventListener("dispose",j),T.__depthDisposeCallback=j}T.__boundDepthTexture=ne}if(D.depthTexture&&!T.__autoAllocateDepthBuffer)if(k)for(let ne=0;ne<6;ne++)gn(T.__webglFramebuffer[ne],D,ne);else if(D.texture.mipmaps.length>0)gn(T.__webglFramebuffer[0],D,0);else gn(T.__webglFramebuffer,D,0);else if(k){T.__webglDepthbuffer=[];for(let ne=0;ne<6;ne++)if(n.bindFramebuffer(e.FRAMEBUFFER,T.__webglFramebuffer[ne]),T.__webglDepthbuffer[ne]===void 0)T.__webglDepthbuffer[ne]=e.createRenderbuffer(),Qt(T.__webglDepthbuffer[ne],D,!1);else{let j=D.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,ae=T.__webglDepthbuffer[ne];e.bindRenderbuffer(e.RENDERBUFFER,ae),e.framebufferRenderbuffer(e.FRAMEBUFFER,j,e.RENDERBUFFER,ae)}}else{if(D.texture.mipmaps.length>0)n.bindFramebuffer(e.FRAMEBUFFER,T.__webglFramebuffer[0]);else n.bindFramebuffer(e.FRAMEBUFFER,T.__webglFramebuffer);if(T.__webglDepthbuffer===void 0)T.__webglDepthbuffer=e.createRenderbuffer(),Qt(T.__webglDepthbuffer,D,!1);else{let j=D.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,ae=T.__webglDepthbuffer;e.bindRenderbuffer(e.RENDERBUFFER,ae),e.framebufferRenderbuffer(e.FRAMEBUFFER,j,e.RENDERBUFFER,ae)}}n.bindFramebuffer(e.FRAMEBUFFER,null)}function In(D,T,k){let ne=i.get(D);if(T!==void 0)Dt(ne.__webglFramebuffer,D,D.texture,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,0);if(k!==void 0)xn(D)}function B(D){let T=D.texture,k=i.get(D),ne=i.get(T);D.addEventListener("dispose",I),A(D);let j=D.textures,ae=D.isWebGLCubeRenderTarget===!0,ce=j.length>1;if(!ce){if(ne.__webglTexture===void 0)ne.__webglTexture=e.createTexture();ne.__version=T.version,a.memory.textures++}if(ae){k.__webglFramebuffer=[];for(let q=0;q<6;q++)if(T.mipmaps.length>0){k.__webglFramebuffer[q]=[];for(let K=0;K<T.mipmaps.length;K++)k.__webglFramebuffer[q][K]=e.createFramebuffer()}else k.__webglFramebuffer[q]=e.createFramebuffer()}else{if(T.mipmaps.length>0){k.__webglFramebuffer=[];for(let q=0;q<T.mipmaps.length;q++)k.__webglFramebuffer[q]=e.createFramebuffer()}else k.__webglFramebuffer=e.createFramebuffer();if(ce)for(let q=0,K=j.length;q<K;q++){let oe=i.get(j[q]);if(oe.__webglTexture===void 0)oe.__webglTexture=e.createTexture(),a.memory.textures++}if(D.samples>0&&Mt(D)===!1){k.__webglMultisampledFramebuffer=e.createFramebuffer(),k.__webglColorRenderbuffer=[],n.bindFramebuffer(e.FRAMEBUFFER,k.__webglMultisampledFramebuffer);for(let q=0;q<j.length;q++){let K=j[q];k.__webglColorRenderbuffer[q]=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,k.__webglColorRenderbuffer[q]);let oe=r.convert(K.format,K.colorSpace),N=r.convert(K.type),J=E(K.internalFormat,oe,N,K.normalized,K.colorSpace,D.isXRRenderTarget===!0),Y=fe(D);e.renderbufferStorageMultisample(e.RENDERBUFFER,Y,J,D.width,D.height),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+q,e.RENDERBUFFER,k.__webglColorRenderbuffer[q])}if(e.bindRenderbuffer(e.RENDERBUFFER,null),D.depthBuffer)k.__webglDepthRenderbuffer=e.createRenderbuffer(),Qt(k.__webglDepthRenderbuffer,D,!0);n.bindFramebuffer(e.FRAMEBUFFER,null)}}if(ae){n.bindTexture(e.TEXTURE_CUBE_MAP,ne.__webglTexture),ct(e.TEXTURE_CUBE_MAP,T);for(let q=0;q<6;q++)if(T.mipmaps.length>0)for(let K=0;K<T.mipmaps.length;K++)Dt(k.__webglFramebuffer[q][K],D,T,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+q,K);else Dt(k.__webglFramebuffer[q],D,T,e.COLOR_ATTACHMENT0,e.TEXTURE_CUBE_MAP_POSITIVE_X+q,0);if(M(T))y(e.TEXTURE_CUBE_MAP);else if(T.mipmaps.length>0)e.texParameteri(e.TEXTURE_CUBE_MAP,e.TEXTURE_MAX_LEVEL,T.mipmaps.length-1);n.unbindTexture()}else if(ce){for(let q=0,K=j.length;q<K;q++){let oe=j[q],N=i.get(oe),J=e.TEXTURE_2D;if(D.isWebGL3DRenderTarget||D.isWebGLArrayRenderTarget)J=D.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY;if(n.bindTexture(J,N.__webglTexture),ct(J,oe),Dt(k.__webglFramebuffer,D,oe,e.COLOR_ATTACHMENT0+q,J,0),M(oe))y(J)}n.unbindTexture()}else{let q=e.TEXTURE_2D;if(D.isWebGL3DRenderTarget||D.isWebGLArrayRenderTarget)q=D.isWebGL3DRenderTarget?e.TEXTURE_3D:e.TEXTURE_2D_ARRAY;if(n.bindTexture(q,ne.__webglTexture),ct(q,T),T.mipmaps.length>0)for(let K=0;K<T.mipmaps.length;K++)Dt(k.__webglFramebuffer[K],D,T,e.COLOR_ATTACHMENT0,q,K);else Dt(k.__webglFramebuffer,D,T,e.COLOR_ATTACHMENT0,q,0);if(M(T))y(q);else if(T.mipmaps.length>0)e.texParameteri(q,e.TEXTURE_MAX_LEVEL,T.mipmaps.length-1);n.unbindTexture()}if(D.depthBuffer)xn(D)}function Pn(D){let T=D.textures;for(let k=0,ne=T.length;k<ne;k++){let j=T[k];if(M(j)&&j.mipmapsAutoUpdate===!0){let ae=b(D),ce=i.get(j).__webglTexture;n.bindTexture(ae,ce),y(ae),n.unbindTexture()}}}let ft=[];function Wt(D){if(D.samples>0){if(Mt(D)===!1){let{textures:T,width:k,height:ne}=D,j=e.COLOR_BUFFER_BIT,ae=D.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT,ce=i.get(D),q=T.length>1;if(q)for(let oe=0;oe<T.length;oe++)n.bindFramebuffer(e.FRAMEBUFFER,ce.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+oe,e.RENDERBUFFER,null),n.bindFramebuffer(e.FRAMEBUFFER,ce.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+oe,e.TEXTURE_2D,null,0);if(n.bindFramebuffer(e.READ_FRAMEBUFFER,ce.__webglMultisampledFramebuffer),D.texture.mipmaps.length>0)n.bindFramebuffer(e.DRAW_FRAMEBUFFER,ce.__webglFramebuffer[0]);else n.bindFramebuffer(e.DRAW_FRAMEBUFFER,ce.__webglFramebuffer);for(let oe=0;oe<T.length;oe++){if(D.resolveDepthBuffer){if(D.depthBuffer)j|=e.DEPTH_BUFFER_BIT;if(D.stencilBuffer&&D.resolveStencilBuffer)j|=e.STENCIL_BUFFER_BIT}if(q){e.framebufferRenderbuffer(e.READ_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,ce.__webglColorRenderbuffer[oe]);let N=i.get(T[oe]).__webglTexture;e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,N,0)}if(e.blitFramebuffer(0,0,k,ne,0,0,k,ne,j,e.NEAREST),l===!0){if(ft.length=0,ft.push(e.COLOR_ATTACHMENT0+oe),D.depthBuffer&&D.storeMultisampledDepthBuffer===!1)ft.push(ae);e.invalidateFramebuffer(e.READ_FRAMEBUFFER,ft)}}if(n.bindFramebuffer(e.READ_FRAMEBUFFER,null),n.bindFramebuffer(e.DRAW_FRAMEBUFFER,null),q)for(let oe=0;oe<T.length;oe++){n.bindFramebuffer(e.FRAMEBUFFER,ce.__webglMultisampledFramebuffer),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+oe,e.RENDERBUFFER,ce.__webglColorRenderbuffer[oe]);let N=i.get(T[oe]).__webglTexture;n.bindFramebuffer(e.FRAMEBUFFER,ce.__webglFramebuffer),e.framebufferTexture2D(e.DRAW_FRAMEBUFFER,e.COLOR_ATTACHMENT0+oe,e.TEXTURE_2D,N,0)}n.bindFramebuffer(e.DRAW_FRAMEBUFFER,ce.__webglMultisampledFramebuffer)}else if(D.depthBuffer&&D.storeMultisampledDepthBuffer===!1&&l){let T=D.stencilBuffer?e.DEPTH_STENCIL_ATTACHMENT:e.DEPTH_ATTACHMENT;e.invalidateFramebuffer(e.DRAW_FRAMEBUFFER,[T])}}}function fe(D){return Math.min(s.maxSamples,D.samples)}function Mt(D){let T=i.get(D);return D.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&T.__useRenderToTexture!==!1}function Le(D){let T=a.render.frame;if(h.get(D)!==T)h.set(D,T),D.update()}function Oe(D,T){let{colorSpace:k,format:ne,type:j}=D;if(D.isCompressedTexture===!0||D.isVideoTexture===!0)return T;if(k!==vi&&k!==oi)if(Xe.getTransfer(k)===xt){if(ne!==ke||j!==an)De("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.")}else Ne("WebGLTextures: Unsupported texture color space:",k);return T}function jt(D){if(typeof HTMLImageElement<"u"&&D instanceof HTMLImageElement)u.width=D.naturalWidth||D.width,u.height=D.naturalHeight||D.height;else if(typeof VideoFrame<"u"&&D instanceof VideoFrame)u.width=D.displayWidth,u.height=D.displayHeight;else u.width=D.width,u.height=D.height;return u}this.allocateTextureUnit=Z,this.resetTextureUnits=Q,this.getTextureUnits=ee,this.setTextureUnits=pe,this.setTexture2D=_e,this.setTexture2DArray=Re,this.setTexture3D=Ie,this.setTextureCube=ve,this.rebindTextures=In,this.setupRenderTarget=B,this.updateRenderTargetMipmap=Pn,this.updateMultisampleRenderTarget=Wt,this.setupDepthRenderbuffer=xn,this.setupFrameBufferTexture=Dt,this.useMultisampledRTT=Mt,this.dispose=O}function kv(e,t){function n(i,s=oi){let r,a=Xe.getTransfer(s);if(i===an)return e.UNSIGNED_BYTE;if(i===dl)return e.UNSIGNED_SHORT_4_4_4_4;if(i===pl)return e.UNSIGNED_SHORT_5_5_5_1;if(i===jh)return e.UNSIGNED_INT_5_9_9_9_REV;if(i===ef)return e.UNSIGNED_INT_10F_11F_11F_REV;if(i===cr)return e.BYTE;if(i===ua)return e.SHORT;if(i===Bi)return e.UNSIGNED_SHORT;if(i===zi)return e.INT;if(i===fn)return e.UNSIGNED_INT;if(i===Ve)return e.FLOAT;if(i===et)return e.HALF_FLOAT;if(i===tf)return e.ALPHA;if(i===nf)return e.RGB;if(i===ke)return e.RGBA;if(i===As)return e.DEPTH_COMPONENT;if(i===_i)return e.DEPTH_STENCIL;if(i===ai)return e.RED;if(i===ur)return e.RED_INTEGER;if(i===Un)return e.RG;if(i===Hi)return e.RG_INTEGER;if(i===Gi)return e.RGBA_INTEGER;if(i===ha||i===fa||i===da||i===pa)if(a===xt)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(i===ha)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===fa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===da)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===pa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(i===ha)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===fa)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===da)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===pa)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===ml||i===gl||i===xl||i===_l)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(i===ml)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===gl)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===xl)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===_l)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===vl||i===yl||i===Sl||i===Ml||i===bl||i===ma||i===Tl)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(i===vl||i===yl)return a===xt?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(i===Sl)return a===xt?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(i===Ml)return r.COMPRESSED_R11_EAC;if(i===bl)return r.COMPRESSED_SIGNED_R11_EAC;if(i===ma)return r.COMPRESSED_RG11_EAC;if(i===Tl)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===wl||i===Al||i===El||i===Rl||i===Cl||i===Il||i===Pl||i===Dl||i===Ll||i===Fl||i===Nl||i===Ul||i===Ol||i===Bl)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(i===wl)return a===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Al)return a===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===El)return a===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Rl)return a===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Cl)return a===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Il)return a===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Pl)return a===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Dl)return a===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Ll)return a===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Fl)return a===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Nl)return a===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Ul)return a===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Ol)return a===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Bl)return a===xt?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===zl||i===kl||i===Hl)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(i===zl)return a===xt?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===kl)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Hl)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Gl||i===Wl||i===ga||i===Vl)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(i===Gl)return r.COMPRESSED_RED_RGTC1_EXT;if(i===Wl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===ga)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Vl)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;if(i===ki)return e.UNSIGNED_INT_24_8;return e[i]!==void 0?e[i]:null}return{convert:n}}var Hv=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Gv=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class sd{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new wa(e.texture);if(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)this.depthNear=e.depthNear,this.depthFar=e.depthFar;this.texture=n}}getMesh(e){if(this.texture!==null){if(this.mesh===null){let t=e.cameras[0].viewport,n=new kt({vertexShader:Hv,fragmentShader:Gv,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new dn(new mr(20,20),n)}}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class rd extends li{constructor(e,t){super();let n=this,i=null,s=1,r=null,a="local-floor",o=1,l=null,u=null,h=null,c=null,f=null,d=null,_=typeof XRWebGLBinding<"u",m=new sd,p={},g=t.getContextAttributes(),v=null,M=null,y=[],b=[],E=new Te,x=null,S=null,A=new Yt;A.viewport=new rt;let P=new Yt;P.viewport=new rt;let R=[A,P],I=new vc,F=null,C=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Z){let ie=y[Z];if(ie===void 0)ie=new fr,y[Z]=ie;return ie.getTargetRaySpace()},this.getControllerGrip=function(Z){let ie=y[Z];if(ie===void 0)ie=new fr,y[Z]=ie;return ie.getGripSpace()},this.getHand=function(Z){let ie=y[Z];if(ie===void 0)ie=new fr,y[Z]=ie;return ie.getHandSpace()};function O(Z){let ie=b.indexOf(Z.inputSource);if(ie===-1)return;let _e=y[ie];if(_e!==void 0)_e.update(Z.inputSource,Z.frame,l||r),_e.dispatchEvent({type:Z.type,data:Z.inputSource})}function W(){i.removeEventListener("select",O),i.removeEventListener("selectstart",O),i.removeEventListener("selectend",O),i.removeEventListener("squeeze",O),i.removeEventListener("squeezestart",O),i.removeEventListener("squeezeend",O),i.removeEventListener("end",W),i.removeEventListener("inputsourceschange",z);for(let Z=0;Z<y.length;Z++){let ie=b[Z];if(ie===null)continue;b[Z]=null,y[Z].disconnect(ie)}F=null,C=null,m.reset();for(let Z in p)delete p[Z];if(e.setRenderTarget(v),f=null,c=null,h=null,i=null,M=null,pe.stop(),n.isPresenting=!1,e.setPixelRatio(x),e.setSize(E.width,E.height,!1),S!==null){let Z=S.camera;Z.fov=S.fov,Z.zoom=S.zoom,Z.updateProjectionMatrix(),S=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Z){if(s=Z,n.isPresenting===!0)De("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Z){if(a=Z,n.isPresenting===!0)De("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||r},this.setReferenceSpace=function(Z){l=Z},this.getBaseLayer=function(){return c!==null?c:f},this.getBinding=function(){if(h===null&&_)h=new XRWebGLBinding(i,t);return h},this.getFrame=function(){return d},this.getSession=function(){return i},this.setSession=async function(Z){if(i=Z,i!==null){if(v=e.getRenderTarget(),i.addEventListener("select",O),i.addEventListener("selectstart",O),i.addEventListener("selectend",O),i.addEventListener("squeeze",O),i.addEventListener("squeezestart",O),i.addEventListener("squeezeend",O),i.addEventListener("end",W),i.addEventListener("inputsourceschange",z),g.xrCompatible!==!0)await t.makeXRCompatible();if(x=e.getPixelRatio(),e.getSize(E),!(_&&("createProjectionLayer"in XRWebGLBinding.prototype))){let _e={antialias:g.antialias,alpha:!0,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:s};f=new XRWebGLLayer(i,t,_e),i.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),M=new At(f.framebufferWidth,f.framebufferHeight,{format:ke,type:an,colorSpace:e.outputColorSpace,stencilBuffer:g.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}else{let _e=null,Re=null,Ie=null;if(g.depth)Ie=g.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,_e=g.stencil?_i:As,Re=g.stencil?ki:fn;let ve={colorFormat:t.RGBA8,depthFormat:Ie,scaleFactor:s};h=this.getBinding(),c=h.createProjectionLayer(ve),i.updateRenderState({layers:[c]}),e.setPixelRatio(1),e.setSize(c.textureWidth,c.textureHeight,!1),M=new At(c.textureWidth,c.textureHeight,{format:ke,type:an,depthTexture:new Si(c.textureWidth,c.textureHeight,Re,void 0,void 0,void 0,void 0,void 0,void 0,_e),stencilBuffer:g.stencil,colorSpace:e.outputColorSpace,samples:g.antialias?4:0,resolveDepthBuffer:c.ignoreDepthValues===!1,resolveStencilBuffer:c.ignoreDepthValues===!1,storeMultisampledDepthBuffer:c.ignoreDepthValues===!1,storeMultisampledStencilBuffer:c.ignoreDepthValues===!1})}M.isXRRenderTarget=!0,this.setFoveation(o),l=null,r=await i.requestReferenceSpace(a),pe.setContext(i),pe.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function z(Z){for(let ie=0;ie<Z.removed.length;ie++){let _e=Z.removed[ie],Re=b.indexOf(_e);if(Re>=0)b[Re]=null,y[Re].disconnect(_e)}for(let ie=0;ie<Z.added.length;ie++){let _e=Z.added[ie],Re=b.indexOf(_e);if(Re===-1){for(let ve=0;ve<y.length;ve++)if(ve>=b.length){b.push(_e),Re=ve;break}else if(b[ve]===null){b[ve]=_e,Re=ve;break}if(Re===-1)break}let Ie=y[Re];if(Ie)Ie.connect(_e)}}function te(Z,ie){if(ie===null)Z.matrixWorld.copy(Z.matrix);else Z.matrixWorld.multiplyMatrices(ie.matrixWorld,Z.matrix);Z.matrixWorldInverse.copy(Z.matrixWorld).invert()}this.updateCamera=function(Z){if(i===null)return;let{near:ie,far:_e}=Z;if(m.texture!==null){if(m.depthNear>0)ie=m.depthNear;if(m.depthFar>0)_e=m.depthFar}if(I.near=P.near=A.near=ie,I.far=P.far=A.far=_e,F!==I.near||C!==I.far)i.updateRenderState({depthNear:I.near,depthFar:I.far}),F=I.near,C=I.far;I.layers.mask=Z.layers.mask|6,A.layers.mask=I.layers.mask&-5,P.layers.mask=I.layers.mask&-3;let Re=Z.parent,Ie=I.cameras;te(I,Re);for(let ve=0;ve<Ie.length;ve++)te(Ie[ve],Re);if(I.projectionMatrix.copy(A.projectionMatrix),I.projectionMatrixInverse.copy(A.projectionMatrixInverse),S===null&&Z.isPerspectiveCamera)S={camera:Z,fov:Z.fov,zoom:Z.zoom};V(Z,I,Re)};function V(Z,ie,_e){if(_e===null)Z.matrix.copy(ie.matrixWorld);else Z.matrix.copy(_e.matrixWorld),Z.matrix.invert(),Z.matrix.multiply(ie.matrixWorld);if(Z.matrix.decompose(Z.position,Z.quaternion,Z.scale),Z.updateMatrixWorld(!0),Z.projectionMatrix.copy(ie.projectionMatrix),Z.projectionMatrixInverse.copy(ie.projectionMatrixInverse),Z.isPerspectiveCamera)Z.fov=oa*2*Math.atan(1/Z.projectionMatrix.elements[5]),Z.zoom=1}this.getCamera=function(){return I},this.getFoveation=function(){if(c===null&&f===null)return;return o},this.setFoveation=function(Z){if(o=Z,c!==null)c.fixedFoveation=Z;if(f!==null&&f.fixedFoveation!==void 0)f.fixedFoveation=Z},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(I)},this.getCameraTexture=function(Z){return p[Z]};let Q=null;function ee(Z,ie){if(u=ie.getViewerPose(l||r),d=ie,u!==null){let _e=u.views;if(f!==null)e.setRenderTargetFramebuffer(M,f.framebuffer),e.setRenderTarget(M);let Re=!1;if(_e.length!==I.cameras.length)I.cameras.length=0,Re=!0;for(let Ge=0;Ge<_e.length;Ge++){let ze=_e[Ge],ct=null;if(f!==null)ct=f.getViewport(ze);else{let Rt=h.getViewSubImage(c,ze);if(ct=Rt.viewport,Ge===0)e.setRenderTargetTextures(M,Rt.colorTexture,Rt.depthStencilTexture),e.setRenderTarget(M)}let Qe=R[Ge];if(Qe===void 0)Qe=new Yt,Qe.layers.enable(Ge),Qe.viewport=new rt,R[Ge]=Qe;if(Qe.matrix.fromArray(ze.transform.matrix),Qe.matrix.decompose(Qe.position,Qe.quaternion,Qe.scale),Qe.projectionMatrix.fromArray(ze.projectionMatrix),Qe.projectionMatrixInverse.copy(Qe.projectionMatrix).invert(),Qe.viewport.set(ct.x,ct.y,ct.width,ct.height),Ge===0)I.matrix.copy(Qe.matrix),I.matrix.decompose(I.position,I.quaternion,I.scale);if(Re===!0)I.cameras.push(Qe)}let Ie=i.enabledFeatures;if(Ie&&Ie.includes("depth-sensing")&&i.depthUsage=="gpu-optimized"&&_){h=n.getBinding();let Ge=h.getDepthInformation(_e[0]);if(Ge&&Ge.isValid&&Ge.texture)m.init(Ge,i.renderState)}if(Ie&&Ie.includes("camera-access")&&_){e.state.unbindTexture(),h=n.getBinding();for(let Ge=0;Ge<_e.length;Ge++){let ze=_e[Ge].camera;if(ze){let ct=p[ze];if(!ct)ct=new wa,p[ze]=ct;let Qe=h.getCameraImage(ze);ct.sourceTexture=Qe}}}}for(let _e=0;_e<y.length;_e++){let Re=b[_e],Ie=y[_e];if(Re!==null&&Ie!==void 0)Ie.update(Re,ie,l||r)}if(Q)Q(Z,ie);if(ie.detectedPlanes)n.dispatchEvent({type:"planesdetected",data:ie});d=null}let pe=new Wf;pe.setAnimationLoop(ee),this.setAnimationLoop=function(Z){Q=Z},this.dispose=function(){}}}var Wv=new Pe,ad=new Fe;ad.set(-1,0,0,0,1,0,0,0,1);function Vv(e,t){function n(p,g){if(p.matrixAutoUpdate===!0)p.updateMatrix();g.value.copy(p.matrix)}function i(p,g){if(g.color.getRGB(p.fogColor.value,ic(e)),g.isFog)p.fogNear.value=g.near,p.fogFar.value=g.far;else if(g.isFogExp2)p.fogDensity.value=g.density}function s(p,g,v,M,y){if(g.isNodeMaterial)g.uniformsNeedUpdate=!1;else if(g.isMeshBasicMaterial)r(p,g);else if(g.isMeshLambertMaterial){if(r(p,g),g.envMap)p.envMapIntensity.value=g.envMapIntensity}else if(g.isMeshToonMaterial)r(p,g),c(p,g);else if(g.isMeshPhongMaterial){if(r(p,g),h(p,g),g.envMap)p.envMapIntensity.value=g.envMapIntensity}else if(g.isMeshStandardMaterial){if(r(p,g),f(p,g),g.isMeshPhysicalMaterial)d(p,g,y)}else if(g.isMeshMatcapMaterial)r(p,g),_(p,g);else if(g.isMeshDepthMaterial)r(p,g);else if(g.isMeshDistanceMaterial)r(p,g),m(p,g);else if(g.isMeshNormalMaterial)r(p,g);else if(g.isLineBasicMaterial){if(a(p,g),g.isLineDashedMaterial)o(p,g)}else if(g.isPointsMaterial)l(p,g,v,M);else if(g.isSpriteMaterial)u(p,g);else if(g.isShadowMaterial)p.color.value.copy(g.color),p.opacity.value=g.opacity;else if(g.isShaderMaterial)g.uniformsNeedUpdate=!1}function r(p,g){if(p.opacity.value=g.opacity,g.color)p.diffuse.value.copy(g.color);if(g.emissive)p.emissive.value.copy(g.emissive).multiplyScalar(g.emissiveIntensity);if(g.map)p.map.value=g.map,n(g.map,p.mapTransform);if(g.alphaMap)p.alphaMap.value=g.alphaMap,n(g.alphaMap,p.alphaMapTransform);if(g.bumpMap){if(p.bumpMap.value=g.bumpMap,n(g.bumpMap,p.bumpMapTransform),p.bumpScale.value=g.bumpScale,g.side===Ut)p.bumpScale.value*=-1}if(g.normalMap){if(p.normalMap.value=g.normalMap,n(g.normalMap,p.normalMapTransform),p.normalScale.value.copy(g.normalScale),g.side===Ut)p.normalScale.value.negate()}if(g.displacementMap)p.displacementMap.value=g.displacementMap,n(g.displacementMap,p.displacementMapTransform),p.displacementScale.value=g.displacementScale,p.displacementBias.value=g.displacementBias;if(g.emissiveMap)p.emissiveMap.value=g.emissiveMap,n(g.emissiveMap,p.emissiveMapTransform);if(g.specularMap)p.specularMap.value=g.specularMap,n(g.specularMap,p.specularMapTransform);if(g.alphaTest>0)p.alphaTest.value=g.alphaTest;let v=t.get(g),{envMap:M,envMapRotation:y}=v;if(M){if(p.envMap.value=M,p.envMapRotation.value.setFromMatrix4(Wv.makeRotationFromEuler(y)).transpose(),M.isCubeTexture&&M.isRenderTargetTexture===!1)p.envMapRotation.value.premultiply(ad);p.reflectivity.value=g.reflectivity,p.ior.value=g.ior,p.refractionRatio.value=g.refractionRatio}if(g.lightMap)p.lightMap.value=g.lightMap,p.lightMapIntensity.value=g.lightMapIntensity,n(g.lightMap,p.lightMapTransform);if(g.aoMap)p.aoMap.value=g.aoMap,p.aoMapIntensity.value=g.aoMapIntensity,n(g.aoMap,p.aoMapTransform)}function a(p,g){if(p.diffuse.value.copy(g.color),p.opacity.value=g.opacity,g.map)p.map.value=g.map,n(g.map,p.mapTransform)}function o(p,g){p.dashSize.value=g.dashSize,p.totalSize.value=g.dashSize+g.gapSize,p.scale.value=g.scale}function l(p,g,v,M){if(p.diffuse.value.copy(g.color),p.opacity.value=g.opacity,p.size.value=g.size*v,p.scale.value=M*0.5,g.map)p.map.value=g.map,n(g.map,p.uvTransform);if(g.alphaMap)p.alphaMap.value=g.alphaMap,n(g.alphaMap,p.alphaMapTransform);if(g.alphaTest>0)p.alphaTest.value=g.alphaTest}function u(p,g){if(p.diffuse.value.copy(g.color),p.opacity.value=g.opacity,p.rotation.value=g.rotation,g.map)p.map.value=g.map,n(g.map,p.mapTransform);if(g.alphaMap)p.alphaMap.value=g.alphaMap,n(g.alphaMap,p.alphaMapTransform);if(g.alphaTest>0)p.alphaTest.value=g.alphaTest}function h(p,g){p.specular.value.copy(g.specular),p.shininess.value=Math.max(g.shininess,0.0001)}function c(p,g){if(g.gradientMap)p.gradientMap.value=g.gradientMap}function f(p,g){if(p.metalness.value=g.metalness,g.metalnessMap)p.metalnessMap.value=g.metalnessMap,n(g.metalnessMap,p.metalnessMapTransform);if(p.roughness.value=g.roughness,g.roughnessMap)p.roughnessMap.value=g.roughnessMap,n(g.roughnessMap,p.roughnessMapTransform);if(g.envMap)p.envMapIntensity.value=g.envMapIntensity}function d(p,g,v){if(p.ior.value=g.ior,g.diffuseRoughness>0){if(p.diffuseRoughness.value=g.diffuseRoughness,g.diffuseRoughnessMap)p.diffuseRoughnessMap.value=g.diffuseRoughnessMap,n(g.diffuseRoughnessMap,p.diffuseRoughnessMapTransform)}if(g.sheen>0){if(p.sheenColor.value.copy(g.sheenColor).multiplyScalar(g.sheen),p.sheenRoughness.value=g.sheenRoughness,g.sheenColorMap)p.sheenColorMap.value=g.sheenColorMap,n(g.sheenColorMap,p.sheenColorMapTransform);if(g.sheenRoughnessMap)p.sheenRoughnessMap.value=g.sheenRoughnessMap,n(g.sheenRoughnessMap,p.sheenRoughnessMapTransform)}if(g.clearcoat>0){if(p.clearcoat.value=g.clearcoat,p.clearcoatRoughness.value=g.clearcoatRoughness,g.clearcoatMap)p.clearcoatMap.value=g.clearcoatMap,n(g.clearcoatMap,p.clearcoatMapTransform);if(g.clearcoatRoughnessMap)p.clearcoatRoughnessMap.value=g.clearcoatRoughnessMap,n(g.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform);if(g.clearcoatNormalMap){if(p.clearcoatNormalMap.value=g.clearcoatNormalMap,n(g.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(g.clearcoatNormalScale),g.side===Ut)p.clearcoatNormalScale.value.negate()}}if(g.dispersion>0)p.dispersion.value=g.dispersion;if(g.retroreflectivity>0)p.retroreflectivity.value=g.retroreflectivity;if(g.iridescence>0){if(p.iridescence.value=g.iridescence,p.iridescenceIOR.value=g.iridescenceIOR,p.iridescenceThicknessMinimum.value=g.iridescenceThicknessMinimum,p.iridescenceThicknessMaximum.value=g.iridescenceThicknessMaximum,g.iridescenceMap)p.iridescenceMap.value=g.iridescenceMap,n(g.iridescenceMap,p.iridescenceMapTransform);if(g.iridescenceThicknessMap)p.iridescenceThicknessMap.value=g.iridescenceThicknessMap,n(g.iridescenceThicknessMap,p.iridescenceThicknessMapTransform)}if(g.transmission>0){if(p.transmission.value=g.transmission,p.transmissionSamplerMap.value=v.texture,p.transmissionSamplerSize.value.set(v.width,v.height),g.transmissionMap)p.transmissionMap.value=g.transmissionMap,n(g.transmissionMap,p.transmissionMapTransform);if(p.thickness.value=g.thickness,g.thicknessMap)p.thicknessMap.value=g.thicknessMap,n(g.thicknessMap,p.thicknessMapTransform);p.attenuationDistance.value=g.attenuationDistance,p.attenuationColor.value.copy(g.attenuationColor)}if(g.anisotropy>0){if(p.anisotropyVector.value.set(g.anisotropy*Math.cos(g.anisotropyRotation),g.anisotropy*Math.sin(g.anisotropyRotation)),g.anisotropyMap)p.anisotropyMap.value=g.anisotropyMap,n(g.anisotropyMap,p.anisotropyMapTransform)}if(p.specularIntensity.value=g.specularIntensity,p.specularColor.value.copy(g.specularColor),g.specularColorMap)p.specularColorMap.value=g.specularColorMap,n(g.specularColorMap,p.specularColorMapTransform);if(g.specularIntensityMap)p.specularIntensityMap.value=g.specularIntensityMap,n(g.specularIntensityMap,p.specularIntensityMapTransform)}function _(p,g){if(g.matcap)p.matcap.value=g.matcap}function m(p,g){let v=t.get(g).light;p.referencePosition.value.setFromMatrixPosition(v.matrixWorld),p.nearDistance.value=v.shadow.camera.near,p.farDistance.value=v.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:s}}function Xv(e,t,n,i){let s={},r={};function a(v,M){let y=M.program;i.uniformBlockBinding(v,y,s[v.id])}function o(v,M){let y=s[v.id];if(y===void 0)_(v),y=l(v),s[v.id]=y,v.addEventListener("dispose",p);let b=M.program;i.updateUBOMapping(v,b);let E=t.render.frame;if(r[v.id]!==E)u(v),r[v.id]=E}function l(v){let M=e.createBuffer(),{__size:y,usage:b}=v;return e.bindBuffer(e.UNIFORM_BUFFER,M),e.bufferData(e.UNIFORM_BUFFER,y,b),e.bindBuffer(e.UNIFORM_BUFFER,null),M}function u(v){let M=s[v.id],{uniforms:y,__cache:b}=v;e.bindBuffer(e.UNIFORM_BUFFER,M);for(let E=0,x=y.length;E<x;E++){let S=y[E];if(Array.isArray(S))for(let A=0,P=S.length;A<P;A++)h(S[A],E,A,b);else h(S,E,0,b)}e.bindBuffer(e.UNIFORM_BUFFER,null)}function h(v,M,y,b){if(f(v,M,y,b)===!0){let{__offset:E,value:x}=v;if(Array.isArray(x)){let S=0;for(let A=0;A<x.length;A++){let P=x[A],R=m(P,!0);c(P,v.__data,S),S+=R.storage/Float32Array.BYTES_PER_ELEMENT}}else c(x,v.__data,0);e.bufferSubData(e.UNIFORM_BUFFER,E,v.__data)}}function c(v,M,y){if(typeof v==="number"||typeof v==="boolean")M[y]=v;else if(v.isMatrix3)M[y]=v.elements[0],M[y+1]=v.elements[1],M[y+2]=v.elements[2],M[y+3]=0,M[y+4]=v.elements[3],M[y+5]=v.elements[4],M[y+6]=v.elements[5],M[y+7]=0,M[y+8]=v.elements[6],M[y+9]=v.elements[7],M[y+10]=v.elements[8],M[y+11]=0;else if(ArrayBuffer.isView(v))M.set(v.subarray(0,M.length-y),y);else v.toArray(M,y)}function f(v,M,y,b){let E=v.value,x=M+"_"+y;if(Array.isArray(E)){if(b[x]===void 0)b[x]=[];let S=b[x],A=!1;for(let P=0;P<E.length;P++)if(d(E[P],S,P)===!0)A=!0;return A}return d(E,b,x)}function d(v,M,y){if(M[y]===void 0){if(typeof v==="number"||typeof v==="boolean")M[y]=v;else if(ArrayBuffer.isView(v))M[y]=v.slice();else M[y]=v.clone();return!0}else{let b=M[y];if(typeof v==="number"||typeof v==="boolean"){if(b!==v)return M[y]=v,!0}else if(ArrayBuffer.isView(v))return!0;else if(b.equals(v)===!1)return b.copy(v),!0}return!1}function _(v){let M=v.uniforms,y=0,b=16;for(let x=0,S=M.length;x<S;x++){let A=Array.isArray(M[x])?M[x]:[M[x]];for(let P=0,R=A.length;P<R;P++){let I=A[P],F=Array.isArray(I.value)?I.value:[I.value],C=Array.isArray(M[x])||Array.isArray(I.value),O=y;for(let z=0,te=F.length;z<te;z++){let V=F[z],Q=m(V,C),ee=y%b,pe=ee%Q.boundary,Z=ee+pe;if(y+=pe,Z!==0&&b-Z<Q.storage)y+=b-Z;if(z===0)O=y;y+=Q.storage}let W=I.type==="int"?Int32Array:I.type==="uint"?Uint32Array:Float32Array;I.__data=new W((y-O)/Float32Array.BYTES_PER_ELEMENT),I.__offset=O}}let E=y%b;if(E>0)y+=b-E;return v.__size=y,v.__cache={},this}function m(v,M){let y={boundary:0,storage:0};if(typeof v==="number"||typeof v==="boolean")y.boundary=4,y.storage=4;else if(v.isVector2)y.boundary=8,y.storage=8;else if(v.isVector3||v.isColor)y.boundary=16,y.storage=12;else if(v.isVector4)y.boundary=16,y.storage=16;else if(v.isMatrix3)y.boundary=16,y.storage=48;else if(v.isMatrix4)y.boundary=16,y.storage=64;else if(v.isTexture)De("WebGLRenderer: Texture samplers can not be part of an uniforms group.");else if(ArrayBuffer.isView(v))y.boundary=16,y.storage=v.byteLength;else De("WebGLRenderer: Unsupported uniform value type.",v);if(M===!0)y.boundary=16,y.storage=Math.ceil(y.storage/16)*16;return y}function p(v){let M=v.target;M.removeEventListener("dispose",p),e.deleteBuffer(s[M.id]),delete s[M.id],delete r[M.id]}function g(){for(let v in s)e.deleteBuffer(s[v]);s={},r={}}return{bind:a,update:o,dispose:g}}var qv=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),Wn=null;function Yv(){if(Wn===null)Wn=new ht(qv,16,16,Un,et),Wn.name="DFG_LUT",Wn.minFilter=Ye,Wn.magFilter=Ye,Wn.wrapS=Bt,Wn.wrapT=Bt,Wn.generateMipmaps=!1,Wn.needsUpdate=!0;return Wn}class Ac{constructor(e={}){let{canvas:t=uf(),context:n=null,depth:i=!0,stencil:s=!1,alpha:r=!1,antialias:a=!1,premultipliedAlpha:o=!0,preserveDrawingBuffer:l=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1,reversedDepthBuffer:c=!1,outputBufferType:f=an}=e;this.isWebGLRenderer=!0;let d;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");d=n.getContextAttributes().alpha}else d=r;let _=f,m=new Set([Gi,Hi,ur]),p=new Set([an,fn,Bi,ki,dl,pl]),g=new Uint32Array(4),v=new Int32Array(4),M={textures:[],min:[],max:[],resolution:[]},y=null,b=null,E=[],x=[],S=null;this.domElement=t,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=En,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let A=this,P=!1,R=null,I=null,F=null,C=null;this._outputColorSpace=Es;let O=0,W=0,z=null,te=-1,V=null,Q=new rt,ee=new rt,pe=null,Z=new Ae(0),ie=0,{width:_e,height:Re}=t,Ie=1,ve=null,nt=null,Ge=new rt(0,0,_e,Re),ze=new rt(0,0,_e,Re),ct=!1,Qe=new Ui,Rt=new Sa,Pt=!1,mn=!1,Sn=new Pe,Dt=new L,Qt=new rt,gn={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},xn=!1;function In(){return z===null?Ie:1}let B=n;function Pn(w,U){return t.getContext(w,U)}let ft,Wt,fe,Mt,Le,Oe,jt,D,T,k,ne,j,ae,ce,q,K,oe,N,J,Y,se,re,he;try{let w={alpha:!0,depth:i,stencil:s,antialias:a,premultipliedAlpha:o,preserveDrawingBuffer:l,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in t)t.setAttribute("data-engine",`three.js r${tr}`);if(t.addEventListener("webglcontextlost",me,!1),t.addEventListener("webglcontextrestored",Ce,!1),t.addEventListener("webglcontextcreationerror",He,!1),B===null){if(B=Pn("webgl2",w),B===null)if(Pn("webgl2"))throw Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes.");else throw Error("THREE.WebGLRenderer: Error creating WebGL context.")}Ee()}catch(w){throw t.removeEventListener("webglcontextlost",me,!1),t.removeEventListener("webglcontextrestored",Ce,!1),t.removeEventListener("webglcontextcreationerror",He,!1),Ne("WebGLRenderer: "+w.message),w}function Ee(){if(ft=new s_(B),ft.init(),se=new kv(B,ft),Wt=new Yx(B,ft,e,se),fe=new Bv(B,ft),Wt.reversedDepthBuffer&&c)fe.buffers.depth.setReversed(!0);I=B.createFramebuffer(),F=B.createFramebuffer(),C=B.createFramebuffer(),Mt=new o_(B),Le=new Tv,Oe=new zv(B,ft,fe,Le,Wt,se,Mt),jt=new i_(A),D=new cg(B),re=new Xx(B,D),T=new r_(B,D,Mt,re),k=new c_(B,T,D,re,Mt),N=new l_(B,Wt,Oe),q=new Zx(Le),ne=new bv(A,jt,ft,Wt,re,q),j=new Vv(A,Le),ae=new Av,ce=new Dv(ft),oe=new Vx(A,jt,fe,k,d,o),K=new Ov(A,k,Wt),he=new Xv(B,Mt,Wt,fe),J=new qx(B,ft,Mt),Y=new a_(B,ft,Mt),Mt.programs=ne.programs,A.capabilities=Wt,A.extensions=ft,A.properties=Le,A.renderLists=ae,A.shadowMap=K,A.state=fe,A.info=Mt}if(_!==an)S=new h_(_,t.width,t.height,a,i,s);let we=new rd(A,B);this.xr=we,this.getContext=function(){return B},this.getContextAttributes=function(){return B.getContextAttributes()},this.forceContextLoss=function(){let w=ft.get("WEBGL_lose_context");if(w)w.loseContext()},this.forceContextRestore=function(){let w=ft.get("WEBGL_lose_context");if(w)w.restoreContext()},this.getPixelRatio=function(){return Ie},this.setPixelRatio=function(w){if(w===void 0)return;Ie=w,this.setSize(_e,Re,!1)},this.getSize=function(w){return w.set(_e,Re)},this.setSize=function(w,U,X=!0){if(we.isPresenting){De("WebGLRenderer: Can't change size while VR device is presenting.");return}if(_e=w,Re=U,t.width=Math.floor(w*Ie),t.height=Math.floor(U*Ie),X===!0)t.style.width=w+"px",t.style.height=U+"px";if(S!==null)S.setSize(t.width,t.height);this.setViewport(0,0,w,U)},this.getDrawingBufferSize=function(w){return w.set(_e*Ie,Re*Ie).floor()},this.setDrawingBufferSize=function(w,U,X){_e=w,Re=U,Ie=X,t.width=Math.floor(w*X),t.height=Math.floor(U*X),this.setViewport(0,0,w,U)},this.setEffects=function(w){if(_===an){Ne("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(w){for(let U=0;U<w.length;U++)if(w[U].isOutputPass===!0){De("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}S.setEffects(w||[])},this.getCurrentViewport=function(w){return w.copy(Q)},this.getViewport=function(w){return w.copy(Ge)},this.setViewport=function(w,U,X,H){if(w.isVector4)Ge.set(w.x,w.y,w.z,w.w);else Ge.set(w,U,X,H);fe.viewport(Q.copy(Ge).multiplyScalar(In()).round())},this.getScissor=function(w){return w.copy(ze)},this.setScissor=function(w,U,X,H){if(w.isVector4)ze.set(w.x,w.y,w.z,w.w);else ze.set(w,U,X,H);fe.scissor(ee.copy(ze).multiplyScalar(In()).round())},this.getScissorTest=function(){return ct},this.setScissorTest=function(w){fe.setScissorTest(ct=w)},this.setOpaqueSort=function(w){ve=w},this.setTransparentSort=function(w){nt=w},this.getClearColor=function(w){return w.copy(oe.getClearColor())},this.setClearColor=function(){oe.setClearColor(...arguments)},this.getClearAlpha=function(){return oe.getClearAlpha()},this.setClearAlpha=function(){oe.setClearAlpha(...arguments)},this.clear=function(w=!0,U=!0,X=!0){let H=0;if(w){let G=!1;if(z!==null){let ue=z.texture.format;G=m.has(ue)}if(G){let ue=z.texture.type,ye=p.has(ue),le=oe.getClearColor(),xe=oe.getClearAlpha(),{r:be,g:Be,b:$e}=le;if(ye)g[0]=be,g[1]=Be,g[2]=$e,g[3]=xe,B.clearBufferuiv(B.COLOR,0,g);else v[0]=be,v[1]=Be,v[2]=$e,v[3]=xe,B.clearBufferiv(B.COLOR,0,v)}else H|=B.COLOR_BUFFER_BIT}if(U)H|=B.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0);if(X)H|=B.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295);if(H!==0)B.clear(H)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(w){w.setRenderer(this),R=w},this.dispose=function(){t.removeEventListener("webglcontextlost",me,!1),t.removeEventListener("webglcontextrestored",Ce,!1),t.removeEventListener("webglcontextcreationerror",He,!1),oe.dispose(),ae.dispose(),ce.dispose(),Oe.dispose(),Le.dispose(),jt.dispose(),k.dispose(),T.dispose(),re.dispose(),he.dispose(),ne.dispose(),we.dispose(),we.removeEventListener("sessionstart",Ou),we.removeEventListener("sessionend",Bu),Ri.stop()};function me(w){w.preventDefault(),Ql("WebGLRenderer: Context Lost."),P=!0}function Ce(){Ql("WebGLRenderer: Context Restored."),P=!1;let w=Mt.autoReset,U=K.enabled,X=K.autoUpdate,H=K.needsUpdate,G=K.type;Ee(),Mt.autoReset=w,K.enabled=U,K.autoUpdate=X,K.needsUpdate=H,K.type=G}function He(w){Ne("WebGLRenderer: A WebGL context could not be created. Reason: ",w.statusMessage)}function ge(w){let U=w.target;U.removeEventListener("dispose",ge),dt(U)}function dt(w){Vt(w),Le.remove(w)}function Vt(w){let U=Le.get(w).programs;if(U!==void 0){if(U.forEach(function(X){ne.releaseProgram(X)}),w.isShaderMaterial)ne.releaseShaderCache(w)}}this.renderBufferDirect=function(w,U,X,H,G,ue){if(U===null)U=gn;let ye=G.isMesh&&G.matrixWorld.determinantAffine()<0,le=um(w,U,X,H,G);fe.setMaterial(H,ye);let xe=X.index,be=1;if(H.wireframe===!0){if(xe=T.getWireframeAttribute(X),xe===void 0)return;be=2}let Be=X.drawRange,$e=X.attributes.position,Se=Be.start*be,Je=(Be.start+Be.count)*be;if(ue!==null)Se=Math.max(Se,ue.start*be),Je=Math.min(Je,(ue.start+ue.count)*be);if(xe!==null)Se=Math.max(Se,0),Je=Math.min(Je,xe.count);else if($e!==void 0&&$e!==null)Se=Math.max(Se,0),Je=Math.min(Je,$e.count);let Lt=Je-Se;if(Lt<0||Lt===1/0)return;re.setup(G,H,le,X,xe);let bt,gt=J;if(xe!==null)bt=D.get(xe),gt=Y,gt.setIndex(bt);if(G.isMesh)if(H.wireframe===!0)fe.setLineWidth(H.wireframeLinewidth*In()),gt.setMode(B.LINES);else gt.setMode(B.TRIANGLES);else if(G.isLine){let en=H.linewidth;if(en===void 0)en=1;if(fe.setLineWidth(en*In()),G.isLineSegments)gt.setMode(B.LINES);else if(G.isLineLoop)gt.setMode(B.LINE_LOOP);else gt.setMode(B.LINE_STRIP)}else if(G.isPoints)gt.setMode(B.POINTS);else if(G.isSprite)gt.setMode(B.TRIANGLES);if(G.isBatchedMesh)if(!ft.get("WEBGL_multi_draw")){let{_multiDrawStarts:en,_multiDrawCounts:Me,_multiDrawCount:hn}=G,it=xe?D.get(xe).bytesPerElement:1,Ci=Le.get(H).currentProgram.getUniforms();for(let tn=0;tn<hn;tn++)Ci.setValue(B,"_gl_DrawID",tn),gt.render(en[tn]/it,Me[tn])}else gt.renderMultiDraw(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount);else if(G.isInstancedMesh)gt.renderInstances(Se,Lt,G.count);else if(X.isInstancedBufferGeometry){let en=X._maxInstanceCount!==void 0?X._maxInstanceCount:1/0,Me=Math.min(X.instanceCount,en);gt.renderInstances(Se,Lt,Me)}else gt.render(Se,Lt)};function Zn(w,U,X,H){if(R!==null&&w.isNodeMaterial)R.setObject(H,w);if(Pt===!0)q.setState(w,X,!1);if(w.transparent===!0&&w.side===rn&&w.forceSinglePass===!1)w.side=Ut,w.needsUpdate=!0,$s(w,U,H),w.side=Tn,w.needsUpdate=!0,$s(w,U,H),w.side=rn;else $s(w,U,H)}this.compile=function(w,U,X=null){if(X===null)X=w;if(R!==null)R.renderStart(w,U,X);if(b=ce.get(X),b.init(U),x.push(b),X.traverseVisible(function(G){if(G.isLight&&G.layers.test(U.layers)){if(b.pushLight(G),G.castShadow)b.pushShadow(G)}}),w!==X)w.traverseVisible(function(G){if(G.isLight&&G.layers.test(U.layers)){if(b.pushLight(G),G.castShadow)b.pushShadow(G)}});if(b.setupLights(),R!==null)R.updateLights(b.state.lightsArray);if(mn=this.localClippingEnabled,Pt=q.init(this.clippingPlanes,mn),Pt===!0)q.setGlobalState(this.clippingPlanes,U);if(R!==null)K.render(b.state.shadowsArray,X,U);let H=new Set;if(w.traverse(function(G){if(!(G.isMesh||G.isPoints||G.isLine||G.isSprite))return;let ue=G.material;if(ue)if(Array.isArray(ue))for(let ye=0;ye<ue.length;ye++){let le=ue[ye];Zn(le,X,U,G),H.add(le)}else Zn(ue,X,U,G),H.add(ue)}),b=x.pop(),R!==null)R.renderEnd();return H},this.compileAsync=function(w,U,X=null){let H=this.compile(w,U,X);return new Promise((G)=>{function ue(){if(H.forEach(function(ye){let xe=Le.get(ye).currentProgram;if(xe===void 0||xe.isReady())H.delete(ye)}),H.size===0){G(w);return}setTimeout(ue,10)}if(ft.get("KHR_parallel_shader_compile")!==null)ue();else setTimeout(ue,10)})};let Po=null;function lm(w){if(Po)Po(w)}function Ou(){Ri.stop()}function Bu(){Ri.start()}let Ri=new Wf;if(Ri.setAnimationLoop(lm),typeof self<"u")Ri.setContext(self);this.setAnimationLoop=function(w){Po=w,we.setAnimationLoop(w),w===null?Ri.stop():Ri.start()},we.addEventListener("sessionstart",Ou),we.addEventListener("sessionend",Bu),this.render=function(w,U){if(U!==void 0&&U.isCamera!==!0){Ne("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(P===!0)return;if(R!==null)R.renderStart(w,U);let X=we.enabled===!0&&we.isPresenting===!0,H=S!==null&&(z===null||X)&&S.begin(A,z);if(w.matrixWorldAutoUpdate===!0)w.updateMatrixWorld();if(U.parent===null&&U.matrixWorldAutoUpdate===!0)U.updateMatrixWorld();if(we.enabled===!0&&we.isPresenting===!0&&(S===null||S.isCompositing()===!1)){if(we.cameraAutoUpdate===!0)we.updateCamera(U);U=we.getCamera()}if(w.isScene===!0)w.onBeforeRender(A,w,U,z);if(b=ce.get(w,x.length),b.init(U),b.state.textureUnits=Oe.getTextureUnits(),x.push(b),Sn.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),U.isArrayCamera)Rt.setFromArrayCamera(U);else Qe.setFromProjectionMatrix(Sn,Kl,U.reversedDepth);if(mn=this.localClippingEnabled,Pt=q.init(this.clippingPlanes,mn),y=ae.get(w,E.length),y.init(),E.push(y),this.info.render.frame++,we.enabled===!0&&we.isPresenting===!0){let ye=A.xr.getDepthSensingMesh();if(ye!==null)Do(ye,U,-1/0,A.sortObjects)}if(Do(w,U,0,A.sortObjects),y.finish(),R!==null)R.updateLights(b.state.lightsArray);if(A.sortObjects===!0)y.sort(ve,nt);if(xn=we.enabled===!1||we.isPresenting===!1||we.hasDepthSensing()===!1,xn)oe.addToRenderList(y,w);if(this.info.autoReset===!0)this.info.reset();if(Pt===!0)q.beginShadows();let G=b.state.shadowsArray;if(K.render(G,w,U),Pt===!0)q.endShadows();if((H&&S.hasRenderPass())===!1){let ye=y.opaque,le=y.transmissive;if(b.setupLights(),U.isArrayCamera){let xe=U.cameras;if(le.length>0)for(let be=0,Be=xe.length;be<Be;be++){let $e=xe[be];ku(ye,le,w,$e)}if(xn)oe.render(w);for(let be=0,Be=xe.length;be<Be;be++){let $e=xe[be];zu(y,w,$e,$e.viewport)}}else{if(le.length>0)ku(ye,le,w,U);if(xn)oe.render(w);zu(y,w,U)}}if(z!==null&&W===0)Oe.updateMultisampleRenderTarget(z),Oe.updateRenderTargetMipmap(z);if(H)S.end(A);if(w.isScene===!0)w.onAfterRender(A,w,U);if(re.resetDefaultState(),te=-1,V=null,x.pop(),x.length>0){if(b=x[x.length-1],Oe.setTextureUnits(b.state.textureUnits),Pt===!0)q.setGlobalState(A.clippingPlanes,b.state.camera)}else b=null;if(E.pop(),E.length>0)y=E[E.length-1];else y=null;if(R!==null)R.renderEnd()};function Do(w,U,X,H){if(w.visible===!1)return;if(w.layers.test(U.layers)){if(w.isGroup)X=w.renderOrder;else if(w.isLOD){if(w.autoUpdate===!0)w.update(U)}else if(w.isLight){if(b.pushLight(w),w.castShadow)b.pushShadow(w)}else if(w.isSprite){let ye=U.isArrayCamera?Rt:Qe;if(!w.frustumCulled||w.intersectsFrustum(ye)){if(H)Qt.setFromMatrixPosition(w.matrixWorld).applyMatrix4(Sn);let le=k.update(w),xe=w.material;if(xe.visible)y.push(w,le,xe,X,Qt.z,null,U)}}else if(w.isMesh||w.isLine||w.isPoints){let ye=U.isArrayCamera?Rt:Qe;if(!w.frustumCulled||w.intersectsFrustum(ye)){let le=k.update(w),xe=w.material;if(H){if(w.boundingSphere!==void 0){if(w.boundingSphere===null)w.computeBoundingSphere();Qt.copy(w.boundingSphere.center)}else{if(le.boundingSphere===null)le.computeBoundingSphere();Qt.copy(le.boundingSphere.center)}Qt.applyMatrix4(w.matrixWorld).applyMatrix4(Sn)}if(Array.isArray(xe)){let be=le.groups;for(let Be=0,$e=be.length;Be<$e;Be++){let Se=be[Be],Je=xe[Se.materialIndex];if(Je&&Je.visible)y.push(w,le,Je,X,Qt.z,Se,U)}}else if(xe.visible)y.push(w,le,xe,X,Qt.z,null,U)}}}let ue=w.children;for(let ye=0,le=ue.length;ye<le;ye++)Do(ue[ye],U,X,H)}function zu(w,U,X,H){let{opaque:G,transmissive:ue,transparent:ye}=w;if(b.setupLightsView(X),Pt===!0)q.setGlobalState(A.clippingPlanes,X);if(H)fe.viewport(Q.copy(H));if(G.length>0)Br(G,U,X);if(ue.length>0)Br(ue,U,X);if(ye.length>0)Br(ye,U,X);fe.buffers.depth.setTest(!0),fe.buffers.depth.setMask(!0),fe.buffers.color.setMask(!0),fe.setPolygonOffset(!1)}function ku(w,U,X,H){if((X.isScene===!0?X.overrideMaterial:null)!==null)return;if(b.state.transmissionRenderTarget[H.id]===void 0){let Se=ft.has("EXT_color_buffer_half_float")||ft.has("EXT_color_buffer_float");b.state.transmissionRenderTarget[H.id]=new At(1,1,{generateMipmaps:!0,type:Se?et:an,minFilter:xi,samples:Math.max(4,Wt.samples),stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:Xe.workingColorSpace})}let ue=b.state.transmissionRenderTarget[H.id],ye=H.viewport||Q;ue.setSize(ye.z*A.transmissionResolutionScale,ye.w*A.transmissionResolutionScale);let le=A.getRenderTarget(),xe=A.getActiveCubeFace(),be=A.getActiveMipmapLevel();if(A.setRenderTarget(ue),A.getClearColor(Z),ie=A.getClearAlpha(),ie<1)A.setClearColor(16777215,0.5);if(A.clear(),xn)oe.render(X);let Be=A.toneMapping;A.toneMapping=En;let $e=H.viewport;if(H.viewport!==void 0)H.viewport=void 0;if(b.setupLightsView(H),Pt===!0)q.setGlobalState(A.clippingPlanes,H);if(Br(w,X,H),Oe.updateMultisampleRenderTarget(ue),Oe.updateRenderTargetMipmap(ue),ft.has("WEBGL_multisampled_render_to_texture")===!1){let Se=!1;for(let Je=0,Lt=U.length;Je<Lt;Je++){let bt=U[Je],{object:gt,geometry:en,material:Me,group:hn}=bt;if(Me.side===rn&&gt.layers.test(H.layers)){let it=Me.side;Me.side=Ut,Me.needsUpdate=!0,Hu(gt,X,H,en,Me,hn),Me.side=it,Me.needsUpdate=!0,Se=!0}}if(Se===!0)Oe.updateMultisampleRenderTarget(ue),Oe.updateRenderTargetMipmap(ue)}if(A.setRenderTarget(le,xe,be),A.setClearColor(Z,ie),$e!==void 0)H.viewport=$e;A.toneMapping=Be}function Br(w,U,X){let H=U.isScene===!0?U.overrideMaterial:null;for(let G=0,ue=w.length;G<ue;G++){let ye=w[G],{object:le,geometry:xe,group:be}=ye,Be=ye.material;if(Be.allowOverride===!0&&H!==null)Be=H;if(le.layers.test(X.layers))Hu(le,U,X,xe,Be,be)}}function Hu(w,U,X,H,G,ue){if(R!==null&&G.isNodeMaterial)R.setObject(w,G);if(w.onBeforeRender(A,U,X,H,G,ue),w.modelViewMatrix.multiplyMatrices(X.matrixWorldInverse,w.matrixWorld),w.normalMatrix.getNormalMatrix(w.modelViewMatrix),G.onBeforeRender(A,U,X,H,w,ue),G.transparent===!0&&G.side===rn&&G.forceSinglePass===!1)G.side=Ut,G.needsUpdate=!0,A.renderBufferDirect(X,U,H,G,w,ue),G.side=Tn,G.needsUpdate=!0,A.renderBufferDirect(X,U,H,G,w,ue),G.side=rn;else A.renderBufferDirect(X,U,H,G,w,ue);w.onAfterRender(A,U,X,H,G,ue)}function Gu(w){let U=0;for(let X of w)if(X.texture!==null)U++;return U}function $s(w,U,X){if(U.isScene!==!0)U=gn;let H=Le.get(w),G=b.state.lights,ue=b.state.shadowsArray,ye=G.state.version,le=ne.getParameters(w,G.state,ue,U,X,b.state.lightProbeGridArray),xe=ne.getProgramCacheKey(le),be=H.programs;H.environment=w.isMeshStandardMaterial||w.isMeshLambertMaterial||w.isMeshPhongMaterial?U.environment:null,H.fog=U.fog;let Be=w.isMeshStandardMaterial||w.isMeshLambertMaterial&&!w.envMap||w.isMeshPhongMaterial&&!w.envMap;if(H.envMap=jt.get(w.envMap||H.environment,Be),H.envMapRotation=H.environment!==null&&w.envMap===null?U.environmentRotation:w.envMapRotation,be===void 0)w.addEventListener("dispose",ge),be=new Map,H.programs=be,H.programVariants=new Map;let $e=be.get(xe);if($e!==void 0){if(H.currentProgram===$e&&H.lightsStateVersion===ye)return Vu(w,le),$e}else{if(le.uniforms=ne.getUniforms(w),R!==null&&w.isNodeMaterial)R.build(w,X,le);w.onBeforeCompile(le,A),$e=ne.acquireProgram(le,xe),be.set(xe,$e),H.uniforms=le.uniforms}let Se=H.uniforms;if(!w.isShaderMaterial&&!w.isRawShaderMaterial||w.clipping===!0)Se.clippingPlanes=q.uniform;if(Vu(w,le),H.needsLights=fm(w),H.lightsStateVersion=ye,H.needsLights)Se.ambientLightColor.value=G.state.ambient,Se.lightProbe.value=G.state.probe,Se.sunLights.value=G.state.sun,Se.sunLightShadows.value=G.state.sunShadow,Se.directionalLights.value=G.state.directional,Se.directionalLightShadows.value=G.state.directionalShadow,Se.spotLights.value=G.state.spot,Se.spotLightShadows.value=G.state.spotShadow,Se.rectAreaLights.value=G.state.rectArea,Se.ltc_1.value=G.state.rectAreaLTC1,Se.ltc_2.value=G.state.rectAreaLTC2,Se.pointLights.value=G.state.point,Se.pointLightShadows.value=G.state.pointShadow,Se.hemisphereLights.value=G.state.hemi,Se.sunShadowMatrix.value=G.state.sunShadowMatrix,Se.sunShadowCascade.value=G.state.sunShadowCascade,Se.directionalShadowMatrix.value=G.state.directionalShadowMatrix,Se.spotLightMatrix.value=G.state.spotLightMatrix,Se.spotLightMap.value=G.state.spotLightMap,Se.pointShadowMatrix.value=G.state.pointShadowMatrix;return H.numLightProbeGrids=Gu(b.state.lightProbeGridArray),H.currentProgram=$e,H.uniformsList=null,$e}function cm(w,U,X,H,G){let ue=Le.get(w),ye=ue.currentProgram.id+","+H+","+G,le=ue.programVariants.get(ye);if(le===void 0)le=$s(w,U,X),ue.programVariants.set(ye,le);else ue.currentProgram=le,ue.uniformsList=null,ue.outputColorSpace=H,ue.toneMapping=G;return le}function Wu(w){if(w.uniformsList===null){let U=w.currentProgram.getUniforms();w.uniformsList=yr.seqWithValue(U.seq,w.uniforms)}return w.uniformsList}function Vu(w,U){let X=Le.get(w);X.outputColorSpace=U.outputColorSpace,X.batching=U.batching,X.batchingColor=U.batchingColor,X.instancing=U.instancing,X.instancingColor=U.instancingColor,X.instancingMorph=U.instancingMorph,X.skinning=U.skinning,X.morphTargets=U.morphTargets,X.morphNormals=U.morphNormals,X.morphColors=U.morphColors,X.morphTargetsCount=U.morphTargetsCount,X.numClippingPlanes=U.numClippingPlanes,X.numIntersection=U.numClipIntersection,X.vertexAlphas=U.vertexAlphas,X.vertexTangents=U.vertexTangents,X.toneMapping=U.toneMapping}function um(w,U,X,H,G){if(U.isScene!==!0)U=gn;Oe.resetTextureUnits();let ue=U.fog,ye=H.isMeshStandardMaterial||H.isMeshLambertMaterial||H.isMeshPhongMaterial?U.environment:null,le=z===null?A.outputColorSpace:z.isXRRenderTarget===!0?z.texture.colorSpace:Xe.workingColorSpace,xe=H.isMeshStandardMaterial||H.isMeshLambertMaterial&&!H.envMap||H.isMeshPhongMaterial&&!H.envMap,be=jt.get(H.envMap||ye,xe),Be=H.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,$e=!!X.attributes.tangent&&(!!H.normalMap||H.anisotropy>0),Se=!!X.morphAttributes.position,Je=!!X.morphAttributes.normal,Lt=!!X.morphAttributes.color,bt=En;if(H.toneMapped){if(z===null||z.isXRRenderTarget===!0)bt=A.toneMapping}let gt=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,en=gt!==void 0?gt.length:0,Me=Le.get(H),hn=b.state.lights;if(Pt===!0){if(mn===!0||w!==V){let wt=w===V&&H.id===te;q.setState(H,w,wt)}}let it=!1,Ci=!1;if(H.version===Me.__version){if(Me.needsLights&&Me.lightsStateVersion!==hn.state.version)it=!0;else if(G.isBatchedMesh&&Me.batching===!1)it=!0;else if(!G.isBatchedMesh&&Me.batching===!0)it=!0;else if(G.isBatchedMesh&&Me.batchingColor===!0&&G._colorsTexture===null)it=!0;else if(G.isBatchedMesh&&Me.batchingColor===!1&&G._colorsTexture!==null)it=!0;else if(G.isInstancedMesh&&Me.instancing===!1)it=!0;else if(!G.isInstancedMesh&&Me.instancing===!0)it=!0;else if(G.isSkinnedMesh&&Me.skinning===!1)it=!0;else if(!G.isSkinnedMesh&&Me.skinning===!0)it=!0;else if(G.isInstancedMesh&&Me.instancingColor===!0&&G.instanceColor===null)it=!0;else if(G.isInstancedMesh&&Me.instancingColor===!1&&G.instanceColor!==null)it=!0;else if(G.isInstancedMesh&&Me.instancingMorph===!0&&G.morphTexture===null)it=!0;else if(G.isInstancedMesh&&Me.instancingMorph===!1&&G.morphTexture!==null)it=!0;else if(Me.envMap!==be)it=!0;else if(H.fog===!0&&Me.fog!==ue)it=!0;else if(Me.numClippingPlanes!==void 0&&(Me.numClippingPlanes!==q.numPlanes||Me.numIntersection!==q.numIntersection))it=!0;else if(Me.vertexAlphas!==Be)it=!0;else if(Me.vertexTangents!==$e)it=!0;else if(Me.morphTargets!==Se)it=!0;else if(Me.morphNormals!==Je)it=!0;else if(Me.morphColors!==Lt)it=!0;else if(Me.morphTargetsCount!==en)it=!0;else if(Me.numLightProbeGrids!==Gu(b.state.lightProbeGridArray))it=!0;else if(Me.outputColorSpace!==le||Me.toneMapping!==bt)Ci=!0}else it=!0,Me.__version=H.version;let tn=Me.currentProgram;if(it===!0||Ci===!0){if(tn=Ci===!0?cm(H,U,G,le,bt):$s(H,U,G),R&&H.isNodeMaterial)R.onUpdateProgram(H,tn,Me)}let zr=!1,hi=!1,Ii=!1,je=tn.getUniforms(),$t=Me.uniforms;if(fe.useProgram(tn.program))zr=!0,hi=!0,Ii=!0;if(H.id!==te)te=H.id,hi=!0;if(zr||V!==w){if(fe.buffers.depth.getReversed()&&w.reversedDepth!==!0)w._reversedDepth=!0,w.updateProjectionMatrix();je.setValue(B,"projectionMatrix",w.projectionMatrix),je.setValue(B,"viewMatrix",w.matrixWorldInverse);let Xt=je.map.cameraPosition;if(Xt!==void 0)Xt.setValue(B,Dt.setFromMatrixPosition(w.matrixWorld));if(Wt.logarithmicDepthBuffer)je.setValue(B,"logDepthBufFC",2/(Math.log(w.far+1)/Math.LN2));if(H.isMeshPhongMaterial||H.isMeshToonMaterial||H.isMeshLambertMaterial||H.isMeshBasicMaterial||H.isMeshStandardMaterial||H.isShaderMaterial)je.setValue(B,"isOrthographic",w.isOrthographicCamera===!0);if(V!==w)V=w,hi=!0,Ii=!0}if(Me.needsLights){if(hn.state.sunShadowMap.length>0)je.setValue(B,"sunShadowMap",hn.state.sunShadowMap,Oe);if(hn.state.directionalShadowMap.length>0)je.setValue(B,"directionalShadowMap",hn.state.directionalShadowMap,Oe);if(hn.state.spotShadowMap.length>0)je.setValue(B,"spotShadowMap",hn.state.spotShadowMap,Oe);if(hn.state.pointShadowMap.length>0)je.setValue(B,"pointShadowMap",hn.state.pointShadowMap,Oe)}if(G.isSkinnedMesh){je.setOptional(B,G,"bindMatrix"),je.setOptional(B,G,"bindMatrixInverse");let wt=G.skeleton;if(wt){if(wt.boneTexture===null)wt.computeBoneTexture();je.setValue(B,"boneTexture",wt.boneTexture,Oe)}}if(G.isBatchedMesh){if(je.setOptional(B,G,"batchingTexture"),je.setValue(B,"batchingTexture",G._matricesTexture,Oe),je.setOptional(B,G,"batchingIdTexture"),je.setValue(B,"batchingIdTexture",G._indirectTexture,Oe),je.setOptional(B,G,"batchingColorTexture"),G._colorsTexture!==null)je.setValue(B,"batchingColorTexture",G._colorsTexture,Oe)}let Dn=X.morphAttributes;if(Dn.position!==void 0||Dn.normal!==void 0||Dn.color!==void 0)N.update(G,X,tn);if(hi||Me.receiveShadow!==G.receiveShadow)Me.receiveShadow=G.receiveShadow,je.setValue(B,"receiveShadow",G.receiveShadow);if((H.isMeshStandardMaterial||H.isMeshLambertMaterial||H.isMeshPhongMaterial)&&H.envMap===null&&U.environment!==null)$t.envMapIntensity.value=U.environmentIntensity;if($t.dfgLUT!==void 0)$t.dfgLUT.value=Yv();if(hi){if(je.setValue(B,"toneMappingExposure",A.toneMappingExposure),Me.needsLights)hm($t,Ii);if(ue&&H.fog===!0)j.refreshFogUniforms($t,ue);if(j.refreshMaterialUniforms($t,H,Ie,Re,b.state.transmissionRenderTarget[w.id]),Me.needsLights&&Me.numLightProbeGrids>0){let wt=M,Xt=0;for(let $n of b.state.lightProbeGridArray){if($n.texture===null)continue;wt.textures[Xt]=$n.texture,wt.min[Xt]=$n.boundingBox.min,wt.max[Xt]=$n.boundingBox.max,wt.resolution[Xt]=$n.resolution,Xt++}for(let $n in wt)wt[$n].length=Xt;$t.probesSH.value=wt.textures,$t.probesMin.value=wt.min,$t.probesMax.value=wt.max,$t.probesResolution.value=wt.resolution}yr.upload(B,Wu(Me),$t,Oe)}if(H.isShaderMaterial&&H.uniformsNeedUpdate===!0)yr.upload(B,Wu(Me),$t,Oe),H.uniformsNeedUpdate=!1;if(H.isSpriteMaterial)je.setValue(B,"center",G.center);if(je.setValue(B,"modelViewMatrix",G.modelViewMatrix),je.setValue(B,"normalMatrix",G.normalMatrix),je.setValue(B,"modelMatrix",G.matrixWorld),H.uniformsGroups!==void 0){let wt=H.uniformsGroups;for(let Xt=0,$n=wt.length;Xt<$n;Xt++){let qu=wt[Xt];he.update(qu,tn),he.bind(qu,tn)}}return tn}function hm(w,U){w.ambientLightColor.needsUpdate=U,w.lightProbe.needsUpdate=U,w.sunLights.needsUpdate=U,w.sunLightShadows.needsUpdate=U,w.directionalLights.needsUpdate=U,w.directionalLightShadows.needsUpdate=U,w.pointLights.needsUpdate=U,w.pointLightShadows.needsUpdate=U,w.spotLights.needsUpdate=U,w.spotLightShadows.needsUpdate=U,w.rectAreaLights.needsUpdate=U,w.hemisphereLights.needsUpdate=U}function fm(w){return w.isMeshLambertMaterial||w.isMeshToonMaterial||w.isMeshPhongMaterial||w.isMeshStandardMaterial||w.isShadowMaterial||w.isShaderMaterial&&w.lights===!0}this.getActiveCubeFace=function(){return O},this.getActiveMipmapLevel=function(){return W},this.getRenderTarget=function(){return z},this.setRenderTargetTextures=function(w,U,X){let H=Le.get(w);if(H.__autoAllocateDepthBuffer=w.resolveDepthBuffer===!1,H.__autoAllocateDepthBuffer===!1)H.__useRenderToTexture=!1;Le.get(w.texture).__webglTexture=U,Le.get(w.depthTexture).__webglTexture=H.__autoAllocateDepthBuffer?void 0:X,H.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(w,U){let X=Le.get(w);X.__webglFramebuffer=U,X.__useDefaultFramebuffer=U===void 0},this.setRenderTarget=function(w,U=0,X=0){z=w,O=U,W=X;let H=null,G=!1,ue=!1;if(w){let le=Le.get(w);if(le.__useDefaultFramebuffer!==void 0){fe.bindFramebuffer(B.FRAMEBUFFER,le.__webglFramebuffer),Q.copy(w.viewport),ee.copy(w.scissor),pe=w.scissorTest,fe.viewport(Q),fe.scissor(ee),fe.setScissorTest(pe),te=-1;return}else if(le.__webglFramebuffer===void 0)Oe.setupRenderTarget(w);else if(le.__hasExternalTextures)Oe.rebindTextures(w,Le.get(w.texture).__webglTexture,Le.get(w.depthTexture).__webglTexture);else if(w.depthBuffer){let Be=w.depthTexture;if(le.__boundDepthTexture!==Be){if(Be!==null&&Le.has(Be)&&(w.width!==Be.image.width||w.height!==Be.image.height))throw Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");Oe.setupDepthRenderbuffer(w)}}let xe=w.texture;if(xe.isData3DTexture||xe.isDataArrayTexture||xe.isCompressedArrayTexture)ue=!0;let be=Le.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget){if(Array.isArray(be[U]))H=be[U][X];else H=be[U];G=!0}else if(w.samples>0&&Oe.useMultisampledRTT(w)===!1)H=Le.get(w).__webglMultisampledFramebuffer;else if(Array.isArray(be))H=be[X];else H=be;Q.copy(w.viewport),ee.copy(w.scissor),pe=w.scissorTest}else Q.copy(Ge).multiplyScalar(Ie).floor(),ee.copy(ze).multiplyScalar(Ie).floor(),pe=ct;if(X!==0)H=I;if(fe.bindFramebuffer(B.FRAMEBUFFER,H))fe.drawBuffers(w,H);if(fe.viewport(Q),fe.scissor(ee),fe.setScissorTest(pe),G){let le=Le.get(w.texture);B.framebufferTexture2D(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_CUBE_MAP_POSITIVE_X+U,le.__webglTexture,X)}else if(ue){let le=U;for(let xe=0;xe<w.textures.length;xe++){let be=Le.get(w.textures[xe]);B.framebufferTextureLayer(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0+xe,be.__webglTexture,X,le)}}else if(w!==null&&X!==0){let le=Le.get(w.texture);B.framebufferTexture2D(B.FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,le.__webglTexture,X)}te=-1};function Xu(w){let U=Le.get(w);if(U.__readFormat!==w.format||U.__readType!==w.type)U.__readFormat=w.format,U.__readType=w.type,U.__formatReadable=Wt.textureFormatReadable(w.format),U.__typeReadable=Wt.textureTypeReadable(w.type);return U}if(this.readRenderTargetPixels=function(w,U,X,H,G,ue,ye,le=0){if(!(w&&w.isWebGLRenderTarget)){Ne("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let xe=Le.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&ye!==void 0){if(xe=xe[ye],Array.isArray(xe))xe=xe[0]}if(xe){fe.bindFramebuffer(B.FRAMEBUFFER,xe);try{let be=w.textures[le],{format:Be,type:$e}=be;if(w.textures.length>1)B.readBuffer(B.COLOR_ATTACHMENT0+le);let Se=Xu(be);if(Se.__formatReadable===!1){Ne("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(Se.__typeReadable===!1){Ne("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}if(U>=0&&U<=w.width-H&&(X>=0&&X<=w.height-G))B.readPixels(U,X,H,G,se.convert(Be),se.convert($e),ue)}finally{let be=z!==null?Le.get(z).__webglFramebuffer:null;fe.bindFramebuffer(B.FRAMEBUFFER,be)}}},this.readRenderTargetPixelsAsync=async function(w,U,X,H,G,ue,ye,le=0){if(!(w&&w.isWebGLRenderTarget))throw Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let xe=Le.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&ye!==void 0){if(xe=xe[ye],Array.isArray(xe))xe=xe[0]}if(xe)if(U>=0&&U<=w.width-H&&(X>=0&&X<=w.height-G)){fe.bindFramebuffer(B.FRAMEBUFFER,xe);let be=w.textures[le],{format:Be,type:$e}=be;if(w.textures.length>1)B.readBuffer(B.COLOR_ATTACHMENT0+le);let Se=Xu(be);if(Se.__formatReadable===!1)throw Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(Se.__typeReadable===!1)throw Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let Je=B.createBuffer();B.bindBuffer(B.PIXEL_PACK_BUFFER,Je),B.bufferData(B.PIXEL_PACK_BUFFER,ue.byteLength,B.STREAM_READ),B.readPixels(U,X,H,G,se.convert(Be),se.convert($e),0),B.bindBuffer(B.PIXEL_PACK_BUFFER,null);let Lt=z!==null?Le.get(z).__webglFramebuffer:null;fe.bindFramebuffer(B.FRAMEBUFFER,Lt);let bt=B.fenceSync(B.SYNC_GPU_COMMANDS_COMPLETE,0);return B.flush(),await ff(B,bt,4),B.bindBuffer(B.PIXEL_PACK_BUFFER,Je),B.getBufferSubData(B.PIXEL_PACK_BUFFER,0,ue),B.bindBuffer(B.PIXEL_PACK_BUFFER,null),B.deleteBuffer(Je),B.deleteSync(bt),ue}else throw Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(w,U=null,X=0){let H=Math.pow(2,-X),G=Math.floor(w.image.width*H),ue=Math.floor(w.image.height*H),ye=U!==null?U.x:0,le=U!==null?U.y:0;Oe.setTexture2D(w,0),B.copyTexSubImage2D(B.TEXTURE_2D,X,0,0,ye,le,G,ue),fe.unbindTexture()},this.copyTextureToTexture=function(w,U,X=null,H=null,G=0,ue=0){let ye,le,xe,be,Be,$e,Se,Je,Lt,bt=w.isCompressedTexture?w.mipmaps[ue]:w.image;if(X!==null)ye=X.max.x-X.min.x,le=X.max.y-X.min.y,xe=X.isBox3?X.max.z-X.min.z:1,be=X.min.x,Be=X.min.y,$e=X.isBox3?X.min.z:0;else{let je=Math.pow(2,-G);if(ye=Math.floor(bt.width*je),le=Math.floor(bt.height*je),w.isDataArrayTexture)xe=bt.depth;else if(w.isData3DTexture)xe=Math.floor(bt.depth*je);else xe=1;be=0,Be=0,$e=0}if(H!==null)Se=H.x,Je=H.y,Lt=H.z;else Se=0,Je=0,Lt=0;let gt=se.convert(U.format),en=se.convert(U.type),Me;if(U.isData3DTexture)Oe.setTexture3D(U,0),Me=B.TEXTURE_3D;else if(U.isDataArrayTexture||U.isCompressedArrayTexture)Oe.setTexture2DArray(U,0),Me=B.TEXTURE_2D_ARRAY;else Oe.setTexture2D(U,0),Me=B.TEXTURE_2D;fe.activeTexture(B.TEXTURE0),fe.pixelStorei(B.UNPACK_FLIP_Y_WEBGL,U.flipY),fe.pixelStorei(B.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),fe.pixelStorei(B.UNPACK_ALIGNMENT,U.unpackAlignment);let hn=fe.getParameter(B.UNPACK_ROW_LENGTH),it=fe.getParameter(B.UNPACK_IMAGE_HEIGHT),Ci=fe.getParameter(B.UNPACK_SKIP_PIXELS),tn=fe.getParameter(B.UNPACK_SKIP_ROWS),zr=fe.getParameter(B.UNPACK_SKIP_IMAGES);fe.pixelStorei(B.UNPACK_ROW_LENGTH,bt.width),fe.pixelStorei(B.UNPACK_IMAGE_HEIGHT,bt.height),fe.pixelStorei(B.UNPACK_SKIP_PIXELS,be),fe.pixelStorei(B.UNPACK_SKIP_ROWS,Be),fe.pixelStorei(B.UNPACK_SKIP_IMAGES,$e);let hi=w.isDataArrayTexture||w.isData3DTexture,Ii=U.isDataArrayTexture||U.isData3DTexture;if(w.isDepthTexture){let je=Le.get(w),$t=Le.get(U),Dn=Le.get(je.__renderTarget),wt=Le.get($t.__renderTarget);fe.bindFramebuffer(B.READ_FRAMEBUFFER,Dn.__webglFramebuffer),fe.bindFramebuffer(B.DRAW_FRAMEBUFFER,wt.__webglFramebuffer);for(let Xt=0;Xt<xe;Xt++){if(hi)B.framebufferTextureLayer(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,Le.get(w).__webglTexture,G,$e+Xt),B.framebufferTextureLayer(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,Le.get(U).__webglTexture,ue,Lt+Xt);B.blitFramebuffer(be,Be,be+ye,Be+le,Se,Je,Se+ye,Je+le,B.DEPTH_BUFFER_BIT,B.NEAREST)}fe.bindFramebuffer(B.READ_FRAMEBUFFER,null),fe.bindFramebuffer(B.DRAW_FRAMEBUFFER,null)}else if(G!==0||w.isRenderTargetTexture||Le.has(w)){let je=Le.get(w),$t=Le.get(U);fe.bindFramebuffer(B.READ_FRAMEBUFFER,F),fe.bindFramebuffer(B.DRAW_FRAMEBUFFER,C);for(let Dn=0;Dn<xe;Dn++){if(hi)B.framebufferTextureLayer(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,je.__webglTexture,G,$e+Dn);else B.framebufferTexture2D(B.READ_FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,je.__webglTexture,G);if(Ii)B.framebufferTextureLayer(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,$t.__webglTexture,ue,Lt+Dn);else B.framebufferTexture2D(B.DRAW_FRAMEBUFFER,B.COLOR_ATTACHMENT0,B.TEXTURE_2D,$t.__webglTexture,ue);if(G!==0)B.blitFramebuffer(be,Be,be+ye,Be+le,Se,Je,Se+ye,Je+le,B.COLOR_BUFFER_BIT,B.NEAREST);else if(Ii)B.copyTexSubImage3D(Me,ue,Se,Je,Lt+Dn,be,Be,ye,le);else B.copyTexSubImage2D(Me,ue,Se,Je,be,Be,ye,le)}fe.bindFramebuffer(B.READ_FRAMEBUFFER,null),fe.bindFramebuffer(B.DRAW_FRAMEBUFFER,null)}else if(Ii)if(w.isDataTexture||w.isData3DTexture)B.texSubImage3D(Me,ue,Se,Je,Lt,ye,le,xe,gt,en,bt.data);else if(U.isCompressedArrayTexture)B.compressedTexSubImage3D(Me,ue,Se,Je,Lt,ye,le,xe,gt,bt.data);else B.texSubImage3D(Me,ue,Se,Je,Lt,ye,le,xe,gt,en,bt);else if(w.isDataTexture)B.texSubImage2D(B.TEXTURE_2D,ue,Se,Je,ye,le,gt,en,bt.data);else if(w.isCompressedTexture)B.compressedTexSubImage2D(B.TEXTURE_2D,ue,Se,Je,bt.width,bt.height,gt,bt.data);else B.texSubImage2D(B.TEXTURE_2D,ue,Se,Je,ye,le,gt,en,bt);if(fe.pixelStorei(B.UNPACK_ROW_LENGTH,hn),fe.pixelStorei(B.UNPACK_IMAGE_HEIGHT,it),fe.pixelStorei(B.UNPACK_SKIP_PIXELS,Ci),fe.pixelStorei(B.UNPACK_SKIP_ROWS,tn),fe.pixelStorei(B.UNPACK_SKIP_IMAGES,zr),ue===0&&U.generateMipmaps===!0&&U.mipmapsAutoUpdate===!0)B.generateMipmap(Me);fe.unbindTexture()},this.initRenderTarget=function(w){if(Le.get(w).__webglFramebuffer===void 0)Oe.setupRenderTarget(w)},this.initTexture=function(w){if(w.isCubeTexture)Oe.setTextureCube(w,0);else if(w.isData3DTexture)Oe.setTexture3D(w,0);else if(w.isDataArrayTexture||w.isCompressedArrayTexture)Oe.setTexture2DArray(w,0);else Oe.setTexture2D(w,0);fe.unbindTexture()},this.resetState=function(){O=0,W=0,z=null,fe.reset(),re.reset()},typeof __THREE_DEVTOOLS__<"u")__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Kl}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=Xe._getDrawingBufferColorSpace(e),t.unpackColorSpace=Xe._getUnpackColorSpace()}}var Ec=0,Rc=1,Mr=2;var Ga=2;var Wa=1.25,Cc=1,Ct=32,mt=8,Va=65535,od=-65536,Ds=Math.pow(2,-24),Ls=Symbol("SKIP_GENERATION"),Xa={strategy:0,maxDepth:40,targetLeafSize:10,useSharedArrayBuffer:!1,setBoundingBox:!0,onProgress:null,indirect:!1,verbose:!0,range:null,[Ls]:!1};function _t(e,t,n){return n.min.x=t[e],n.min.y=t[e+1],n.min.z=t[e+2],n.max.x=t[e+3],n.max.y=t[e+4],n.max.z=t[e+5],n}function br(e){let t=-1,n=-1/0;for(let i=0;i<3;i++){let s=e[i+3]-e[i];if(s>n)n=s,t=i}return t}function Ic(e,t,n){for(let i=0;i<3;i++){let s=t[e+2*i],r=t[e+2*i+1],a=s-r,o=s+r;if(a<n[i])n[i]=a;if(o>n[i+3])n[i+3]=o}}function qa(e){let t=e[3]-e[0],n=e[4]-e[1],i=e[5]-e[2];return 2*(t*n+n*i+i*t)}function Ke(e,t){return t[e+15]===Va}function tt(e,t){return t[e+6]}function lt(e,t){return t[e+14]}function at(e){return e+mt}function ot(e,t){let n=t[e+6];return e+n*mt}function Mi(e,t){return t[e+7]}function vt(e){return e}function Ya(e,t,n,i,s){let r=1/0,a=1/0,o=1/0,l=-1/0,u=-1/0,h=-1/0,c=1/0,f=1/0,d=1/0,_=-1/0,m=-1/0,p=-1/0,g=e.offset||0;for(let v=(t-g)*6,M=(t+n-g)*6;v<M;v+=6){let y=e[v+0],b=e[v+1],E=y-b,x=y+b;if(E<r)r=E;if(x>l)l=x;if(y<c)c=y;if(y>_)_=y;let S=e[v+2],A=e[v+3],P=S-A,R=S+A;if(P<a)a=P;if(R>u)u=R;if(S<f)f=S;if(S>m)m=S;let I=e[v+4],F=e[v+5],C=I-F,O=I+F;if(C<o)o=C;if(O>h)h=O;if(I<d)d=I;if(I>p)p=I}i[0]=r,i[1]=a,i[2]=o,i[3]=l,i[4]=u,i[5]=h,s[0]=c,s[1]=f,s[2]=d,s[3]=_,s[4]=m,s[5]=p}var qn=8,Dc=8,Pc=new Int32Array(qn),Xn=new Float32Array(qn*6),Fs=new Float32Array(qn*6),Bn=new Float32Array(6),Za=new Float32Array(6),bi=new Int32Array(Dc),ld=new Float32Array(Dc*6);function $v(e,t,n,i){for(let s=0;s<3;s++){let r=t[e+2*s],a=t[e+2*s+1],o=r-a,l=r+a;if(o<n[i+s])n[i+s]=o;if(l>n[i+s+3])n[i+s+3]=l}}function cd(e,t){let n=e[t+3]-e[t],i=e[t+4]-e[t+1],s=e[t+5]-e[t+2];return 2*(n*i+i*s+s*n)}function ud(e,t,n,i,s,r){let a=-1,o=0;if(r===Ec){if(a=br(t),a!==-1)o=(t[a]+t[a+3])/2}else if(r===Rc){if(a=br(e),a!==-1)o=Jv(n,i,s,a)}else if(r===Mr){let l=qa(e),u=Wa*s,h=n.offset||0,c=(i-h)*6,f=(i+s-h)*6;for(let d=0;d<3;d++){let _=t[d],g=(t[d+3]-_)/qn;if(s<Dc){for(let v=0;v<s;v++){let M=c+v*6,y=n[M+2*d],b=v;while(b>0&&n[bi[b-1]+2*d]>y)bi[b]=bi[b-1],b--;bi[b]=M}for(let v=0;v<3;v++)Bn[v]=1/0,Bn[v+3]=-1/0,Za[v]=1/0,Za[v+3]=-1/0;for(let v=s-1;v>=0;v--)Ic(bi[v],n,Za),ld.set(Za,v*6);for(let v=0;v<s-1;v++){Ic(bi[v],n,Bn);let M=n[bi[v+1]+2*d];if(n[bi[v]+2*d]===M)continue;let y=v+1,b=s-y,E=qa(Bn)/l,x=cd(ld,y*6)/l,S=Cc+Wa*(E*y+x*b);if(S<u)a=d,u=S,o=M}}else{for(let y=0;y<qn;y++){Pc[y]=0;for(let b=0;b<3;b++)Xn[y*6+b]=1/0,Xn[y*6+b+3]=-1/0}for(let y=c;y<f;y+=6){let x=~~((n[y+2*d]-_)/g);if(x>=qn)x=qn-1;Pc[x]++,$v(y,n,Xn,x*6)}let v=(qn-1)*6;for(let y=0;y<6;y++)Fs[v+y]=Xn[v+y];for(let y=qn-2;y>=0;y--){let b=y*6,E=b+6;for(let x=0;x<3;x++)Fs[b+x]=Math.min(Xn[b+x],Fs[E+x]),Fs[b+x+3]=Math.max(Xn[b+x+3],Fs[E+x+3])}let M=0;for(let y=0;y<qn-1;y++){let b=y*6,E=Pc[y];if(E!==0)for(let R=0;R<3;R++)if(M===0)Bn[R]=Xn[b+R],Bn[R+3]=Xn[b+R+3];else Bn[R]=Math.min(Bn[R],Xn[b+R]),Bn[R+3]=Math.max(Bn[R+3],Xn[b+R+3]);M+=E;let x=0,S=0;if(M!==0)x=qa(Bn)/l;let A=s-M;if(A!==0)S=cd(Fs,b+6)/l;let P=Cc+Wa*(x*M+S*A);if(P<u)a=d,u=P,o=_+g+y*g}}}}else console.warn(`BVH: Invalid build strategy value ${r} used.`);return{axis:a,pos:o}}function Jv(e,t,n,i){let s=0,r=e.offset;for(let a=t,o=t+n;a<o;a++)s+=e[(a-r)*6+i*2];return s/n}function hd(e,t,n,i,s,r){let a=i,o=i+s-1,l=r.pos,u=r.axis*2,h=n.offset||0;while(!0){while(a<=o&&n[(a-h)*6+u]<l)a++;while(a<=o&&n[(o-h)*6+u]>=l)o--;if(a<o){for(let c=0;c<t;c++){let f=e[a*t+c];e[a*t+c]=e[o*t+c],e[o*t+c]=f}for(let c=0;c<6;c++){let f=a-h,d=o-h,_=n[f*6+c];n[f*6+c]=n[d*6+c],n[d*6+c]=_}a++,o--}else return a}}var Kv=Math.pow(2,32),Ns=new Float32Array(6),$a=new Float32Array(6);function Qv(e,t,n,i,s,r){let{maxDepth:a,verbose:o,targetLeafSize:l,_strictLeafSize:u=1/0,strategy:h,onProgress:c,useSharedArrayBuffer:f=!1}=s,{primitiveBuffer:d,primitiveBufferStride:_}=e,p=new(f?SharedArrayBuffer:ArrayBuffer)(Ct*Math.max(1,2*Math.ceil(i)-1)),g=new Float32Array(p),v=new Uint32Array(p),M=new Uint16Array(p),y=0,b=!1;return Ya(t,n,i,Ns,$a),S(n,i,0),p.slice(0,y*Ct);function E(A){if(c)c((A-r.offset)/r.count)}function x(A,P,R){let I=A*2;v[A+6]=P,M[I+14]=R,M[I+15]=Va,E(P+R)}function S(A,P,R){let I=y++,F=I*mt;if(g.set(Ns,F),!b&&R>=a){if(b=!0,o)console.warn(`BVH: Max depth of ${a} reached when generating BVH. Consider increasing maxDepth.`)}let C=P>u;if(P<=l&&!C||R>=a){x(F,A,P);return}let O=ud(Ns,$a,t,A,P,h),W=O.axis===-1?-1:hd(d,_,t,A,P,O);if(O.axis===-1||W===A||W===A+P){if(!C){x(F,A,P);return}O.axis=Math.max(0,br(Ns)),W=A+Math.max(1,Math.floor(P/2))}v[F+7]=O.axis;let z=W-A;Ya(t,A,z,Ns,$a),S(A,z,R+1);let te=y-I;if(te>Kv)throw Error("MeshBVH: Cannot store relative child node offset greater than 32 bits.");v[F+6]=te;let V=P-z;Ya(t,W,V,Ns,$a),S(W,V,R+1)}}function fd(e,t){let n=e.getRootRanges(t.range),i=n[0],s=n[n.length-1],r={offset:i.offset,count:s.offset+s.count-i.offset},a=new Float32Array(6*r.count);a.offset=r.offset,e.computePrimitiveBounds(r.offset,r.count,a),e._roots=n.map((o)=>Qv(e,a,o.offset,o.count,t,r))}class Ji{constructor(e){this._getNewPrimitive=e,this._primitives=[]}getPrimitive(){let e=this._primitives;if(e.length===0)return this._getNewPrimitive();else return e.pop()}releasePrimitive(e){this._primitives.push(e)}}class dd{constructor(){this.float32Array=null,this.uint16Array=null,this.uint32Array=null;let e=[],t=null;this.setBuffer=(n)=>{if(t)e.push(t);t=n,this.float32Array=new Float32Array(n),this.uint16Array=new Uint16Array(n),this.uint32Array=new Uint32Array(n)},this.clearBuffer=()=>{if(t=null,this.float32Array=null,this.uint16Array=null,this.uint32Array=null,e.length!==0)this.setBuffer(e.pop())}}}var Ze=new dd;var Ti,Os,Us=[],Ja=new Ji(()=>new Et);function pd(e,t,n,i,s,r){Ti=Ja.getPrimitive(),Os=Ja.getPrimitive(),Us.push(Ti,Os),Ze.setBuffer(e._roots[t]);let a=Lc(0,e.geometry,n,i,s,r);Ze.clearBuffer(),Ja.releasePrimitive(Ti),Ja.releasePrimitive(Os),Us.pop(),Us.pop();let o=Us.length;if(o>0)Os=Us[o-1],Ti=Us[o-2];return a}function Lc(e,t,n,i,s=null,r=0,a=0){let{float32Array:o,uint16Array:l,uint32Array:u}=Ze,h=e*2;if(Ke(h,l)){let f=tt(e,u),d=lt(h,l);return _t(vt(e),o,Ti),i(f,d,!1,a,r+e/mt,Ti)}else{let P=function(I){let{uint16Array:F,uint32Array:C}=Ze,O=I*2;while(!Ke(O,F))I=at(I),O=I*2;return tt(I,C)},R=function(I){let{uint16Array:F,uint32Array:C}=Ze,O=I*2;while(!Ke(O,F))I=ot(I,C),O=I*2;return tt(I,C)+lt(O,F)},f=at(e),d=ot(e,u),_=f,m=d,p,g,v,M;if(s){if(v=Ti,M=Os,_t(vt(_),o,v),_t(vt(m),o,M),p=s(v),g=s(M),g<p){_=d,m=f;let I=p;p=g,g=I,v=M}}if(!v)v=Ti,_t(vt(_),o,v);let y=Ke(_*2,l),b=n(v,y,p,a+1,r+_/mt),E;if(b===Ga){let I=P(_),C=R(_)-I;E=i(I,C,!0,a+1,r+_/mt,v)}else E=b&&Lc(_,t,n,i,s,r,a+1);if(E)return!0;M=Os,_t(vt(m),o,M);let x=Ke(m*2,l),S=n(M,x,g,a+1,r+m/mt),A;if(S===Ga){let I=P(m),C=R(m)-I;A=i(I,C,!0,a+1,r+m/mt,M)}else A=S&&Lc(m,t,n,i,s,r,a+1);if(A)return!0;return!1}}var Tr=new Ze.constructor,Ka=new Ze.constructor,wi=new Ji(()=>new Et),Bs=new Et,zs=new Et,Fc=new Et,Nc=new Et,Uc=!1;function md(e,t,n,i){if(Uc)throw Error("MeshBVH: Recursive calls to bvhcast not supported.");Uc=!0;let s=e._roots,r=t._roots,a,o=0,l=0,u=new Pe().copy(n).invert();for(let h=0,c=s.length;h<c;h++){Tr.setBuffer(s[h]),l=0;let f=wi.getPrimitive();_t(vt(0),Tr.float32Array,f),f.applyMatrix4(u);for(let d=0,_=r.length;d<_;d++)if(Ka.setBuffer(r[d]),a=zn(0,0,n,u,i,o,l,0,0,f),Ka.clearBuffer(),l+=r[d].byteLength/Ct,a)break;if(wi.releasePrimitive(f),Tr.clearBuffer(),o+=s[h].byteLength/Ct,a)break}return Uc=!1,a}function zn(e,t,n,i,s,r=0,a=0,o=0,l=0,u=null,h=!1){let c,f;if(h)c=Ka,f=Tr;else c=Tr,f=Ka;let d=c.float32Array,_=c.uint32Array,m=c.uint16Array,p=f.float32Array,g=f.uint32Array,v=f.uint16Array,M=e*2,y=t*2,b=Ke(M,m),E=Ke(y,v),x=!1;if(E&&b)if(h)x=s(tt(t,g),lt(t*2,v),tt(e,_),lt(e*2,m),l,a+t/mt,o,r+e/mt);else x=s(tt(e,_),lt(e*2,m),tt(t,g),lt(t*2,v),o,r+e/mt,l,a+t/mt);else if(E){let S=wi.getPrimitive();_t(vt(t),p,S),S.applyMatrix4(n);let A=at(e),P=ot(e,_);_t(vt(A),d,Bs),_t(vt(P),d,zs);let R=S.intersectsBox(Bs),I=S.intersectsBox(zs);x=R&&zn(t,A,i,n,s,a,r,l,o+1,S,!h)||I&&zn(t,P,i,n,s,a,r,l,o+1,S,!h),wi.releasePrimitive(S)}else{let S=at(t),A=ot(t,g);_t(vt(S),p,Fc),_t(vt(A),p,Nc);let P=u.intersectsBox(Fc),R=u.intersectsBox(Nc);if(P&&R)x=zn(e,S,n,i,s,r,a,o,l+1,u,h)||zn(e,A,n,i,s,r,a,o,l+1,u,h);else if(P)if(b)x=zn(e,S,n,i,s,r,a,o,l+1,u,h);else{let I=wi.getPrimitive();I.copy(Fc).applyMatrix4(n);let F=at(e),C=ot(e,_);_t(vt(F),d,Bs),_t(vt(C),d,zs);let O=I.intersectsBox(Bs),W=I.intersectsBox(zs);x=O&&zn(S,F,i,n,s,a,r,l,o+1,I,!h)||W&&zn(S,C,i,n,s,a,r,l,o+1,I,!h),wi.releasePrimitive(I)}else if(R)if(b)x=zn(e,A,n,i,s,r,a,o,l+1,u,h);else{let I=wi.getPrimitive();I.copy(Nc).applyMatrix4(n);let F=at(e),C=ot(e,_);_t(vt(F),d,Bs),_t(vt(C),d,zs);let O=I.intersectsBox(Bs),W=I.intersectsBox(zs);x=O&&zn(A,F,i,n,s,a,r,l,o+1,I,!h)||W&&zn(A,C,i,n,s,a,r,l,o+1,I,!h),wi.releasePrimitive(I)}}return x}var Qa=new class{constructor(){let e=null,t=null,n=null,i=!1;this.root=null,this.buffer=null,this.uint32Array=null,this.uint16Array=null,this.setBVH=(r,a)=>{if(i)throw Error("BVHTraversalHelper: cannot call setBVH during an active traversal.");this.root=a,this.buffer=e=r._roots[a],this.uint16Array=n=new Uint16Array(e),this.uint32Array=t=new Uint32Array(e)},this.reset=()=>{this.root=null,this.buffer=e=null,this.uint16Array=n=null,this.uint32Array=t=null},this.getRangeStart=(r)=>{let a=r*2;while(!Ke(a,n))r=at(r),a=r*2;return tt(r,t)},this.getRangeEnd=(r)=>{let a=r*2;while(!Ke(a,n))r=ot(r,t),a=r*2;return tt(r,t)+lt(a,n)};let s=(r,a,o)=>{let l=a*2,u=Ke(l,n);if(!r(o,u,a)&&!u){let c=at(a),f=ot(a,t);s(r,c,o+1),s(r,f,o+1)}};this.traverseBuffer=(r)=>{if(i)throw Error("BVHTraversalHelper: cannot start a traversal during an active traversal.");i=!0;try{s(r,0,0)}finally{i=!1}},this.traverse=(r)=>{this.traverseBuffer((a,o,l)=>{if(o){let u=l*2,h=t[l+6],c=n[u+14];return r(a,o,new Float32Array(e,l*4,6),h,c)}else{let u=Mi(l,t);return r(a,o,new Float32Array(e,l*4,6),u)}})}}};var gd=new Et,ks=new Float32Array(6);class Oc{constructor(){this._roots=null,this.primitiveBuffer=null,this.primitiveBufferStride=null}init(e){if(e={...Xa,...e},"maxLeafSize"in e)console.warn('BVH: "maxLeafSize" option has been deprecated. Use "targetLeafSize", instead.'),e={...e,targetLeafSize:e.maxLeafSize};fd(this,e)}getRootRanges(){throw Error("BVH: getRootRanges() not implemented")}writePrimitiveBounds(){throw Error("BVH: writePrimitiveBounds() not implemented")}writePrimitiveRangeBounds(e,t,n,i){let s=1/0,r=1/0,a=1/0,o=-1/0,l=-1/0,u=-1/0;for(let h=e,c=e+t;h<c;h++){this.writePrimitiveBounds(h,ks,0);let[f,d,_,m,p,g]=ks;if(f<s)s=f;if(m>o)o=m;if(d<r)r=d;if(p>l)l=p;if(_<a)a=_;if(g>u)u=g}return n[i+0]=s,n[i+1]=r,n[i+2]=a,n[i+3]=o,n[i+4]=l,n[i+5]=u,n}computePrimitiveBounds(e,t,n){let i=n.offset||0;for(let s=e,r=e+t;s<r;s++){this.writePrimitiveBounds(s,ks,0);let[a,o,l,u,h,c]=ks,f=(a+u)/2,d=(o+h)/2,_=(l+c)/2,m=(u-a)/2,p=(h-o)/2,g=(c-l)/2,v=(s-i)*6;n[v+0]=f,n[v+1]=m+(Math.abs(f)+m)*Ds,n[v+2]=d,n[v+3]=p+(Math.abs(d)+p)*Ds,n[v+4]=_,n[v+5]=g+(Math.abs(_)+g)*Ds}return n}shiftPrimitiveOffsets(e){let t=this._indirectBuffer;if(t)for(let n=0,i=t.length;n<i;n++)t[n]+=e;else{let n=this._roots;for(let i=0;i<n.length;i++){let s=n[i],r=new Uint32Array(s),a=new Uint16Array(s),o=s.byteLength/Ct;for(let l=0;l<o;l++){let u=mt*l,h=2*u;if(Ke(h,a))r[u+6]+=e}}}}traverse(e,t=0){Qa.setBVH(this,t),Qa.traverse(e),Qa.reset()}refit(){let e=this._roots;for(let t=0,n=e.length;t<n;t++){let i=e[t],s=new Uint32Array(i),r=new Uint16Array(i),a=new Float32Array(i),o=i.byteLength/Ct;for(let l=o-1;l>=0;l--){let u=l*mt,h=u*2;if(Ke(h,r)){let f=tt(u,s),d=lt(h,r);this.writePrimitiveRangeBounds(f,d,ks,0),a.set(ks,u)}else{let f=at(u),d=ot(u,s);for(let _=0;_<3;_++){let m=a[f+_],p=a[f+_+3],g=a[d+_],v=a[d+_+3];a[u+_]=m<g?m:g,a[u+_+3]=p>v?p:v}}}}}getBoundingBox(e){return e.makeEmpty(),this._roots.forEach((n)=>{_t(0,new Float32Array(n),gd),e.union(gd)}),e}shapecast(e){let{boundsTraverseOrder:t,intersectsBounds:n,intersectsRange:i,intersectsPrimitive:s,scratchPrimitive:r,iterate:a}=e;if(i&&s){let h=i;i=(c,f,d,_,m)=>{if(!h(c,f,d,_,m))return a(c,f,this,s,d,_,r);return!0}}else if(!i)if(s)i=(h,c,f,d)=>a(h,c,this,s,f,d,r);else i=(h,c,f)=>f;let o=!1,l=0,u=this._roots;for(let h=0,c=u.length;h<c;h++){let f=u[h];if(o=pd(this,h,n,i,t,l),o)break;l+=f.byteLength/Ct}return o}bvhcast(e,t,n){let{intersectsRanges:i}=n;return md(this,e,t,i)}}function xd(){return typeof SharedArrayBuffer<"u"}function wr(e){return e.index?e.index.count:e.attributes.position.count}function Ai(e){return wr(e)/3}function Bc(e,t=ArrayBuffer){if(e>65535)return new Uint32Array(new t(4*e));else return new Uint16Array(new t(2*e))}function _d(e,t){if(!e.index){let n=e.attributes.position.count,i=t.useSharedArrayBuffer?SharedArrayBuffer:ArrayBuffer,s=Bc(n,i);e.setIndex(new st(s,1));for(let r=0;r<n;r++)s[r]=r}}function jv(e,t,n){let i=wr(e)/n,s=t?t:e.drawRange,r=s.start/n,a=(s.start+s.count)/n,o=Math.max(0,r),l=Math.min(i,a)-o;return{offset:Math.floor(o),count:Math.floor(l)}}function ey(e,t){return e.groups.map((n)=>({offset:n.start/t,count:n.count/t}))}function zc(e,t,n){let i=jv(e,t,n),s=ey(e,n);if(!s.length)return[i];let r=[],a=i.offset,o=i.offset+i.count,l=wr(e)/n,u=[];for(let f of s){let{offset:d,count:_}=f,m=d,p=isFinite(_)?_:l-d,g=d+p;if(m<o&&g>a)u.push({pos:Math.max(a,m),isStart:!0}),u.push({pos:Math.min(o,g),isStart:!1})}u.sort((f,d)=>{if(f.pos!==d.pos)return f.pos-d.pos;else return f.type==="end"?-1:1});let h=0,c=null;for(let f of u){let d=f.pos;if(h!==0&&d!==c)r.push({offset:c,count:d-c});h+=f.isStart?1:-1,c=d}return r}function ty(e,t){let n=e[e.length-1],i=n.offset+n.count>65536,s=e.reduce((u,h)=>u+h.count,0),r=i?4:2,a=t?new SharedArrayBuffer(s*r):new ArrayBuffer(s*r),o=i?new Uint32Array(a):new Uint16Array(a),l=0;for(let u=0;u<e.length;u++){let{offset:h,count:c}=e[u];for(let f=0;f<c;f++)o[l+f]=h+f;l+=c}return o}class kc extends Oc{get indirect(){return!!this._indirectBuffer}get primitiveStride(){return null}get primitiveBufferStride(){return this.indirect?1:this.primitiveStride}set primitiveBufferStride(e){}get primitiveBuffer(){return this.indirect?this._indirectBuffer:this.geometry.index.array}set primitiveBuffer(e){}constructor(e,t={}){if(!e.isBufferGeometry)throw Error("BVH: Only BufferGeometries are supported.");else if(e.index&&e.index.isInterleavedBufferAttribute)throw Error("BVH: InterleavedBufferAttribute is not supported for the index attribute.");if(t.useSharedArrayBuffer&&!xd())throw Error("BVH: SharedArrayBuffer is not available.");super();if(this.geometry=e,this.resolvePrimitiveIndex=t.indirect?(n)=>this._indirectBuffer[n]:(n)=>n,this.primitiveBuffer=null,this.primitiveBufferStride=null,this._indirectBuffer=null,t={...Xa,...t},!t[Ls])this.init(t)}init(e){let{geometry:t,primitiveStride:n}=this;if(e.indirect){let i=zc(t,e.range,n),s=ty(i,e.useSharedArrayBuffer);this._indirectBuffer=s}else _d(t,e);if(super.init(e),!t.boundingBox&&e.setBoundingBox)t.boundingBox=this.getBoundingBox(new Et)}getRootRanges(e){if(this.indirect)return[{offset:0,count:this._indirectBuffer.length}];else return zc(this.geometry,e,this.primitiveStride)}raycastObject3D(){throw Error("BVH: raycastObject3D() not implemented")}}class wn{constructor(){this.min=1/0,this.max=-1/0}setFromPointsField(e,t){let n=1/0,i=-1/0;for(let s=0,r=e.length;s<r;s++){let o=e[s][t];n=o<n?o:n,i=o>i?o:i}this.min=n,this.max=i}setFromPoints(e,t){let n=1/0,i=-1/0;for(let s=0,r=t.length;s<r;s++){let a=t[s],o=e.dot(a);n=o<n?o:n,i=o>i?o:i}this.min=n,this.max=i}isSeparated(e){return this.min>e.max||e.min>this.max}}wn.prototype.setFromBox=function(){let e=new L;return function(n,i){let{min:s,max:r}=i,a=1/0,o=-1/0;for(let l=0;l<=1;l++)for(let u=0;u<=1;u++)for(let h=0;h<=1;h++){e.x=s.x*l+r.x*(1-l),e.y=s.y*u+r.y*(1-u),e.z=s.z*h+r.z*(1-h);let c=n.dot(e);a=Math.min(c,a),o=Math.max(c,o)}this.min=a,this.max=o}}();var Qw=function(){let e=new wn;return function(n,i){let{points:s,satAxes:r,satBounds:a}=n,{points:o,satAxes:l,satBounds:u}=i;for(let h=0;h<3;h++){let c=a[h],f=r[h];if(e.setFromPoints(f,o),c.isSeparated(e))return!1}for(let h=0;h<3;h++){let c=u[h],f=l[h];if(e.setFromPoints(f,s),c.isSeparated(e))return!1}}}();var ny=function(){let e=new L,t=new L,n=new L;return function(s,r,a){let o=s.start,l=e,u=r.start,h=t;n.subVectors(o,u),e.subVectors(s.end,s.start),t.subVectors(r.end,r.start);let c=n.dot(h),f=h.dot(l),d=h.dot(h),_=n.dot(l),p=l.dot(l)*d-f*f,g,v;if(p!==0)g=(c*f-_*d)/p;else g=0;v=(c+g*f)/d,a.x=g,a.y=v}}(),Ar=function(){let e=new Te,t=new L,n=new L;return function(s,r,a,o){ny(s,r,e);let{x:l,y:u}=e;if(l>=0&&l<=1&&u>=0&&u<=1){s.at(l,a),r.at(u,o);return}else if(l>=0&&l<=1){if(u<0)r.at(0,o);else r.at(1,o);s.closestPointToPoint(o,!0,a);return}else if(u>=0&&u<=1){if(l<0)s.at(0,a);else s.at(1,a);r.closestPointToPoint(a,!0,o);return}else{let h;if(l<0)h=s.start;else h=s.end;let c;if(u<0)c=r.start;else c=r.end;let f=t,d=n;if(s.closestPointToPoint(c,!0,t),r.closestPointToPoint(h,!0,n),f.distanceToSquared(c)<=d.distanceToSquared(h)){a.copy(f),o.copy(c);return}else{a.copy(h),o.copy(d);return}}}}(),vd=function(){let e=new L,t=new L,n=new _n,i=new vn;return function(r,a){let{radius:o,center:l}=r,{a:u,b:h,c}=a;if(i.start=u,i.end=h,i.closestPointToPoint(l,!0,e).distanceTo(l)<=o)return!0;if(i.start=u,i.end=c,i.closestPointToPoint(l,!0,e).distanceTo(l)<=o)return!0;if(i.start=h,i.end=c,i.closestPointToPoint(l,!0,e).distanceTo(l)<=o)return!0;let m=a.getPlane(n);if(Math.abs(m.distanceToPoint(l))<=o){let g=m.projectPoint(l,t);if(a.containsPoint(g))return!0}return!1}}();var iy=["x","y","z"],ci=0.000000000000001,yd=ci*ci;function Cn(e){return Math.abs(e)<ci}class ln extends Nt{constructor(...e){super(...e);this.isExtendedTriangle=!0,this.satAxes=[,,,,].fill().map(()=>new L),this.satBounds=[,,,,].fill().map(()=>new wn),this.points=[this.a,this.b,this.c],this.plane=new _n,this.isDegenerateIntoSegment=!1,this.isDegenerateIntoPoint=!1,this.degenerateSegment=new vn,this.needsUpdate=!0}intersectsSphere(e){return vd(e,this)}update(){let e=this.a,t=this.b,n=this.c,i=this.points,s=this.satAxes,r=this.satBounds,a=s[0],o=r[0];this.getNormal(a),o.setFromPoints(a,i);let l=s[1],u=r[1];l.subVectors(e,t),u.setFromPoints(l,i);let h=s[2],c=r[2];h.subVectors(t,n),c.setFromPoints(h,i);let f=s[3],d=r[3];f.subVectors(n,e),d.setFromPoints(f,i);let _=l.length(),m=h.length(),p=f.length();if(this.isDegenerateIntoPoint=!1,this.isDegenerateIntoSegment=!1,_<ci)if(m<ci||p<ci)this.isDegenerateIntoPoint=!0;else this.isDegenerateIntoSegment=!0,this.degenerateSegment.start.copy(e),this.degenerateSegment.end.copy(n);else if(m<ci)if(p<ci)this.isDegenerateIntoPoint=!0;else this.isDegenerateIntoSegment=!0,this.degenerateSegment.start.copy(t),this.degenerateSegment.end.copy(e);else if(p<ci)this.isDegenerateIntoSegment=!0,this.degenerateSegment.start.copy(n),this.degenerateSegment.end.copy(t);this.plane.setFromNormalAndCoplanarPoint(a,e),this.needsUpdate=!1}}ln.prototype.closestPointToSegment=function(){let e=new L,t=new L,n=new vn;return function(s,r=null,a=null){if(this.needsUpdate)this.update();let{start:o,end:l}=s,u=this.points,h,c=1/0,f=this.plane.distanceToPoint(o),d=this.plane.distanceToPoint(l);if(f*d<0&&this.plane.intersectLine(s,e)!==null&&this.containsPoint(e)){if(r)r.copy(e);if(a)a.copy(e);return 0}for(let _=0;_<3;_++){let m=(_+1)%3;if(n.start.copy(u[_]),n.end.copy(u[m]),Ar(n,s,e,t),h=e.distanceToSquared(t),h<c){if(c=h,r)r.copy(e);if(a)a.copy(t)}}if(this.closestPointToPoint(o,e),h=o.distanceToSquared(e),h<c){if(c=h,r)r.copy(e);if(a)a.copy(o)}if(this.closestPointToPoint(l,e),h=l.distanceToSquared(e),h<c){if(c=h,r)r.copy(e);if(a)a.copy(l)}return Math.sqrt(c)}}();ln.prototype.intersectsTriangle=function(){let e=new ln,t=new wn,n=new wn,i=new L,s=new L,r=new L,a=new L,o=new vn,l=new vn,u=new L,h=new Te,c=new Te;function f(M,y,b,E){let x=i;if(!M.isDegenerateIntoPoint&&!M.isDegenerateIntoSegment)x.copy(M.plane.normal);else x.copy(y.plane.normal);let{satBounds:S,satAxes:A}=M;for(let I=1;I<4;I++){let F=S[I],C=A[I];if(t.setFromPoints(C,y.points),F.isSeparated(t))return!1;if(a.copy(x).cross(C),t.setFromPoints(a,M.points),n.setFromPoints(a,y.points),t.isSeparated(n))return!1}let{satBounds:P,satAxes:R}=y;for(let I=1;I<4;I++){let F=P[I],C=R[I];if(t.setFromPoints(C,M.points),F.isSeparated(t))return!1;if(a.crossVectors(x,C),t.setFromPoints(a,M.points),n.setFromPoints(a,y.points),t.isSeparated(n))return!1}if(b){if(!E)console.warn("ExtendedTriangle.intersectsTriangle: Triangles are coplanar which does not support an output edge. Setting edge to 0, 0, 0.");b.start.set(0,0,0),b.end.set(0,0,0)}return!0}function d(M,y,b,E,x,S,A,P,R,I,F){let C=A/(A-P);I.x=E+(x-E)*C,F.start.subVectors(y,M).multiplyScalar(C).add(M),C=A/(A-R),I.y=E+(S-E)*C,F.end.subVectors(b,M).multiplyScalar(C).add(M)}function _(M,y,b,E,x,S,A,P,R,I,F){if(x>0)d(M.c,M.a,M.b,E,y,b,R,A,P,I,F);else if(S>0)d(M.b,M.a,M.c,b,y,E,P,A,R,I,F);else if(P*R>0||A!=0)d(M.a,M.b,M.c,y,b,E,A,P,R,I,F);else if(P!=0)d(M.b,M.a,M.c,b,y,E,P,A,R,I,F);else if(R!=0)d(M.c,M.a,M.b,E,y,b,R,A,P,I,F);else return!0;return!1}function m(M,y,b,E){let x=y.degenerateSegment,S=M.plane.distanceToPoint(x.start),A=M.plane.distanceToPoint(x.end);if(Cn(S))if(Cn(A))return f(M,y,b,E);else{if(b)b.start.copy(x.start),b.end.copy(x.start);return M.containsPoint(x.start)}else if(Cn(A)){if(b)b.start.copy(x.end),b.end.copy(x.end);return M.containsPoint(x.end)}else if(M.plane.intersectLine(x,i)!=null){if(b)b.start.copy(i),b.end.copy(i);return M.containsPoint(i)}else return!1}function p(M,y,b){let E=y.a;if(Cn(M.plane.distanceToPoint(E))&&M.containsPoint(E)){if(b)b.start.copy(E),b.end.copy(E);return!0}else return!1}function g(M,y,b){let E=M.degenerateSegment,x=y.a;if(E.closestPointToPoint(x,!0,i),x.distanceToSquared(i)<yd){if(b)b.start.copy(x),b.end.copy(x);return!0}else return!1}function v(M,y,b,E){if(M.isDegenerateIntoSegment)if(y.isDegenerateIntoSegment){let x=M.degenerateSegment,S=y.degenerateSegment,A=s,P=r;x.delta(A),S.delta(P);let R=i.subVectors(S.start,x.start),I=A.x*P.y-A.y*P.x;if(Cn(I))return!1;let F=(R.x*P.y-R.y*P.x)/I,C=-(A.x*R.y-A.y*R.x)/I;if(F<0||F>1||C<0||C>1)return!1;let O=x.start.z+A.z*F,W=S.start.z+P.z*C;if(Cn(O-W)){if(b)b.start.copy(x.start).addScaledVector(A,F),b.end.copy(x.start).addScaledVector(A,F);return!0}else return!1}else if(y.isDegenerateIntoPoint)return g(M,y,b);else return m(y,M,b,E);else if(M.isDegenerateIntoPoint)if(y.isDegenerateIntoPoint)if(y.a.distanceToSquared(M.a)<yd){if(b)b.start.copy(M.a),b.end.copy(M.a);return!0}else return!1;else if(y.isDegenerateIntoSegment)return g(y,M,b);else return p(y,M,b);else if(y.isDegenerateIntoPoint)return p(M,y,b);else if(y.isDegenerateIntoSegment)return m(M,y,b,E)}return function(y,b=null,E=!1){if(this.needsUpdate)this.update();if(!y.isExtendedTriangle)e.copy(y),e.update(),y=e;else if(y.needsUpdate)y.update();let x=v(this,y,b,E);if(x!==void 0)return x;let S=this.plane,A=y.plane,P=A.distanceToPoint(this.a),R=A.distanceToPoint(this.b),I=A.distanceToPoint(this.c);if(Cn(P))P=0;if(Cn(R))R=0;if(Cn(I))I=0;let F=P*R,C=P*I;if(F>0&&C>0)return!1;let O=S.distanceToPoint(y.a),W=S.distanceToPoint(y.b),z=S.distanceToPoint(y.c);if(Cn(O))O=0;if(Cn(W))W=0;if(Cn(z))z=0;let te=O*W,V=O*z;if(te>0&&V>0)return!1;s.copy(S.normal),r.copy(A.normal);let Q=s.cross(r),ee=0,pe=Math.abs(Q.x),Z=Math.abs(Q.y);if(Z>pe)pe=Z,ee=1;if(Math.abs(Q.z)>pe)ee=2;let _e=iy[ee],Re=this.a[_e],Ie=this.b[_e],ve=this.c[_e],nt=y.a[_e],Ge=y.b[_e],ze=y.c[_e];if(_(this,Re,Ie,ve,F,C,P,R,I,h,o))return f(this,y,b,E);if(_(y,nt,Ge,ze,te,V,O,W,z,c,l))return f(this,y,b,E);if(h.y<h.x){let ct=h.y;h.y=h.x,h.x=ct,u.copy(o.start),o.start.copy(o.end),o.end.copy(u)}if(c.y<c.x){let ct=c.y;c.y=c.x,c.x=ct,u.copy(l.start),l.start.copy(l.end),l.end.copy(u)}if(h.y<c.x||c.y<h.x)return!1;if(b){if(c.x>h.x)b.start.copy(l.start);else b.start.copy(o.start);if(c.y<h.y)b.end.copy(l.end);else b.end.copy(o.end)}return!0}}();ln.prototype.distanceToPoint=function(){let e=new L;return function(n){return this.closestPointToPoint(n,e),n.distanceTo(e)}}();ln.prototype.distanceToTriangle=function(){let e=new L,t=new L,n=["a","b","c"],i=new vn,s=new vn;return function(a,o=null,l=null){let u=o||l?i:null;if(this.intersectsTriangle(a,u,!0)){if(o||l){if(o)u.getCenter(o);if(l)u.getCenter(l)}return 0}let h=1/0;for(let c=0;c<3;c++){let f,d=n[c],_=a[d];if(this.closestPointToPoint(_,e),f=_.distanceToSquared(e),f<h){if(h=f,o)o.copy(e);if(l)l.copy(_)}let m=this[d];if(a.closestPointToPoint(m,e),f=m.distanceToSquared(e),f<h){if(h=f,o)o.copy(m);if(l)l.copy(e)}}for(let c=0;c<3;c++){let f=n[c],d=n[(c+1)%3];i.set(this[f],this[d]);for(let _=0;_<3;_++){let m=n[_],p=n[(_+1)%3];s.set(a[m],a[p]),Ar(i,s,e,t);let g=e.distanceToSquared(t);if(g<h){if(h=g,o)o.copy(e);if(l)l.copy(t)}}}return Math.sqrt(h)}}();class It{constructor(e,t,n){if(this.isOrientedBox=!0,this.min=new L,this.max=new L,this.matrix=new Pe,this.invMatrix=new Pe,this.points=[,,,,,,,,].fill().map(()=>new L),this.satAxes=[,,,].fill().map(()=>new L),this.satBounds=[,,,].fill().map(()=>new wn),this.alignedSatBounds=[,,,].fill().map(()=>new wn),this.needsUpdate=!1,e)this.min.copy(e);if(t)this.max.copy(t);if(n)this.matrix.copy(n)}set(e,t,n){this.min.copy(e),this.max.copy(t),this.matrix.copy(n),this.needsUpdate=!0}copy(e){this.min.copy(e.min),this.max.copy(e.max),this.matrix.copy(e.matrix),this.needsUpdate=!0}}It.prototype.update=function(){return function(){let t=this.matrix,n=this.min,i=this.max,s=this.points;for(let u=0;u<=1;u++)for(let h=0;h<=1;h++)for(let c=0;c<=1;c++){let f=1*u|2*h|4*c,d=s[f];d.x=u?i.x:n.x,d.y=h?i.y:n.y,d.z=c?i.z:n.z,d.applyMatrix4(t)}let r=this.satBounds,a=this.satAxes,o=s[0];for(let u=0;u<3;u++){let h=a[u],c=r[u],f=1<<u,d=s[f];h.subVectors(o,d),c.setFromPoints(h,s)}let l=this.alignedSatBounds;l[0].setFromPointsField(s,"x"),l[1].setFromPointsField(s,"y"),l[2].setFromPointsField(s,"z"),this.invMatrix.copy(this.matrix).invert(),this.needsUpdate=!1}}();It.prototype.intersectsBox=function(){let e=new wn;return function(n){if(this.needsUpdate)this.update();let{min:i,max:s}=n,r=this.satBounds,a=this.satAxes,o=this.alignedSatBounds;if(e.min=i.x,e.max=s.x,o[0].isSeparated(e))return!1;if(e.min=i.y,e.max=s.y,o[1].isSeparated(e))return!1;if(e.min=i.z,e.max=s.z,o[2].isSeparated(e))return!1;for(let l=0;l<3;l++){let u=a[l],h=r[l];if(e.setFromBox(u,n),h.isSeparated(e))return!1}return!0}}();It.prototype.intersectsTriangle=function(){let e=new ln,t=[,,,],n=new wn,i=new wn,s=new L;return function(a){if(this.needsUpdate)this.update();if(!a.isExtendedTriangle)e.copy(a),e.update(),a=e;else if(a.needsUpdate)a.update();let o=this.satBounds,l=this.satAxes;t[0]=a.a,t[1]=a.b,t[2]=a.c;for(let f=0;f<3;f++){let d=o[f],_=l[f];if(n.setFromPoints(_,t),d.isSeparated(n))return!1}let u=a.satBounds,h=a.satAxes,c=this.points;for(let f=0;f<3;f++){let d=u[f],_=h[f];if(n.setFromPoints(_,c),d.isSeparated(n))return!1}for(let f=0;f<3;f++){let d=l[f];for(let _=0;_<4;_++){let m=h[_];if(s.crossVectors(d,m),n.setFromPoints(s,t),i.setFromPoints(s,c),n.isSeparated(i))return!1}}return!0}}();It.prototype.closestPointToPoint=function(){return function(t,n){if(this.needsUpdate)this.update();return n.copy(t).applyMatrix4(this.invMatrix).clamp(this.min,this.max).applyMatrix4(this.matrix),n}}();It.prototype.distanceToPoint=function(){let e=new L;return function(n){return this.closestPointToPoint(n,e),n.distanceTo(e)}}();It.prototype.distanceToBox=function(){let e=["x","y","z"],t=Array(12).fill().map(()=>new vn),n=Array(12).fill().map(()=>new vn),i=new L,s=new L;return function(a,o=0,l=null,u=null){if(this.needsUpdate)this.update();if(this.intersectsBox(a)){if(l||u){if(a.getCenter(s),this.closestPointToPoint(s,i),a.closestPointToPoint(i,s),l)l.copy(i);if(u)u.copy(s)}return 0}let h=o*o,{min:c,max:f}=a,d=this.points,_=1/0;for(let p=0;p<8;p++){let g=d[p];s.copy(g).clamp(c,f);let v=g.distanceToSquared(s);if(v<_){if(_=v,l)l.copy(g);if(u)u.copy(s);if(v<h)return Math.sqrt(v)}}let m=0;for(let p=0;p<3;p++)for(let g=0;g<=1;g++)for(let v=0;v<=1;v++){let M=(p+1)%3,y=(p+2)%3,b=g<<M|v<<y,E=1<<p|g<<M|v<<y,x=d[b],S=d[E];t[m].set(x,S);let P=e[p],R=e[M],I=e[y],F=n[m],{start:C,end:O}=F;C[P]=c[P],C[R]=g?c[R]:f[R],C[I]=v?c[I]:f[I],O[P]=f[P],O[R]=g?c[R]:f[R],O[I]=v?c[I]:f[I],m++}for(let p=0;p<=1;p++)for(let g=0;g<=1;g++)for(let v=0;v<=1;v++){s.x=p?f.x:c.x,s.y=g?f.y:c.y,s.z=v?f.z:c.z,this.closestPointToPoint(s,i);let M=s.distanceToSquared(i);if(M<_){if(_=M,l)l.copy(i);if(u)u.copy(s);if(M<h)return Math.sqrt(M)}}for(let p=0;p<12;p++){let g=t[p];for(let v=0;v<12;v++){let M=n[v];Ar(g,M,i,s);let y=i.distanceToSquared(s);if(y<_){if(_=y,l)l.copy(i);if(u)u.copy(s);if(y<h)return Math.sqrt(y)}}}return Math.sqrt(_)}}();class Sd extends Ji{constructor(){super(()=>new ln)}}var pn=new Sd;var Er=new L,Hc=new L;function Md(e,t,n={},i=0,s=1/0){let r=i*i,a=s*s,o=1/0,l=null;if(e.shapecast({boundsTraverseOrder:(h)=>(Er.copy(t).clamp(h.min,h.max),Er.distanceToSquared(t)),intersectsBounds:(h,c,f)=>f<o&&f<a,intersectsTriangle:(h,c)=>{h.closestPointToPoint(t,Er);let f=t.distanceToSquared(Er);if(f<o)Hc.copy(Er),o=f,l=c;if(f<r)return!0;else return!1}}),o===1/0)return null;let u=Math.sqrt(o);if(!n.point)n.point=Hc.clone();else n.point.copy(Hc);return n.distance=u,n.faceIndex=l,n}var ja=parseInt(tr)>=169,sy=parseInt(tr)<=161,Ki=new L,Qi=new L,ji=new L,eo=new Te,to=new Te,no=new Te,bd=new L,Td=new L,wd=new L,Rr=new L;function ry(e,t,n,i,s,r,a,o){let l;if(r===Ut)l=e.intersectTriangle(i,n,t,!0,s);else l=e.intersectTriangle(t,n,i,r!==rn,s);if(l===null)return null;let u=e.origin.distanceTo(s);if(u<a||u>o)return null;return{distance:u,point:s.clone()}}function Ad(e,t,n,i,s,r,a,o,l,u,h){Ki.fromBufferAttribute(t,r),Qi.fromBufferAttribute(t,a),ji.fromBufferAttribute(t,o);let c=ry(e,Ki,Qi,ji,Rr,l,u,h);if(c){if(i){eo.fromBufferAttribute(i,r),to.fromBufferAttribute(i,a),no.fromBufferAttribute(i,o),c.uv=new Te;let d=Nt.getInterpolation(Rr,Ki,Qi,ji,eo,to,no,c.uv);if(!ja)c.uv=d}if(s){eo.fromBufferAttribute(s,r),to.fromBufferAttribute(s,a),no.fromBufferAttribute(s,o),c.uv1=new Te;let d=Nt.getInterpolation(Rr,Ki,Qi,ji,eo,to,no,c.uv1);if(!ja)c.uv1=d;if(sy)c.uv2=c.uv1}if(n){bd.fromBufferAttribute(n,r),Td.fromBufferAttribute(n,a),wd.fromBufferAttribute(n,o),c.normal=new L;let d=Nt.getInterpolation(Rr,Ki,Qi,ji,bd,Td,wd,c.normal);if(c.normal.dot(e.direction)>0)c.normal.multiplyScalar(-1);if(!ja)c.normal=d}let f={a:r,b:a,c:o,normal:new L,materialIndex:0};if(Nt.getNormal(Ki,Qi,ji,f.normal),c.face=f,c.faceIndex=r,ja){let d=new L;Nt.getBarycoord(Rr,Ki,Qi,ji,d),c.barycoord=d}}return c}function Ed(e){return e&&e.isMaterial?e.side:e}function Hs(e,t,n,i,s,r,a){let o=i*3,l=o+0,u=o+1,h=o+2,{index:c,groups:f}=e;if(e.index)l=c.getX(l),u=c.getX(u),h=c.getX(h);let{position:d,normal:_,uv:m,uv1:p}=e.attributes;if(Array.isArray(t)){let g=i*3;for(let v=0,M=f.length;v<M;v++){let{start:y,count:b,materialIndex:E}=f[v];if(g>=y&&g<y+b){let x=Ed(t[E]),S=Ad(n,d,_,m,p,l,u,h,x,r,a);if(S)if(S.faceIndex=i,S.face.materialIndex=E,s)s.push(S);else return S}}}else{let g=Ed(t),v=Ad(n,d,_,m,p,l,u,h,g,r,a);if(v)if(v.faceIndex=i,v.face.materialIndex=0,s)s.push(v);else return v}return null}function yt(e,t,n,i){let{a:s,b:r,c:a}=e,o=t,l=t+1,u=t+2;if(n)o=n.getX(o),l=n.getX(l),u=n.getX(u);s.x=i.getX(o),s.y=i.getY(o),s.z=i.getZ(o),r.x=i.getX(l),r.y=i.getY(l),r.z=i.getZ(l),a.x=i.getX(u),a.y=i.getY(u),a.z=i.getZ(u)}function Rd(e,t,n,i,s,r,a,o){let{geometry:l,_indirectBuffer:u}=e;for(let h=i,c=i+s;h<c;h++)Hs(l,t,n,h,r,a,o)}function Cd(e,t,n,i,s,r,a){let{geometry:o,_indirectBuffer:l}=e,u=1/0,h=null;for(let c=i,f=i+s;c<f;c++){let d;if(d=Hs(o,t,n,c,null,r,a),d&&d.distance<u)h=d,u=d.distance}return h}function Id(e,t,n,i,s,r,a){let{geometry:o}=n,{index:l}=o,u=o.attributes.position;for(let h=e,c=t+e;h<c;h++){let f;if(f=h,yt(a,f*3,l,u),a.needsUpdate=!0,i(a,f,s,r))return!0}return!1}function Pd(e,t=null){if(t&&Array.isArray(t))t=new Set(t);let n=e.geometry,i=n.index?n.index.array:null,s=n.attributes.position,r,a,o,l,u=0,h=e._roots;for(let f=0,d=h.length;f<d;f++)r=h[f],a=new Uint32Array(r),o=new Uint16Array(r),l=new Float32Array(r),c(0,u),u+=r.byteLength;function c(f,d,_=!1){let m=f*2;if(Ke(m,o)){let p=tt(f,a),g=lt(m,o),v=1/0,M=1/0,y=1/0,b=-1/0,E=-1/0,x=-1/0;for(let S=3*p,A=3*(p+g);S<A;S++){let P=i[S],R=s.getX(P),I=s.getY(P),F=s.getZ(P);if(R<v)v=R;if(R>b)b=R;if(I<M)M=I;if(I>E)E=I;if(F<y)y=F;if(F>x)x=F}if(l[f+0]!==v||l[f+1]!==M||l[f+2]!==y||l[f+3]!==b||l[f+4]!==E||l[f+5]!==x)return l[f+0]=v,l[f+1]=M,l[f+2]=y,l[f+3]=b,l[f+4]=E,l[f+5]=x,!0;else return!1}else{let p=at(f),g=ot(f,a),v=_,M=!1,y=!1;if(t){if(!v){let P=p/mt+d/Ct,R=g/mt+d/Ct;M=t.has(P),y=t.has(R),v=!M&&!y}}else M=!0,y=!0;let b=v||M,E=v||y,x=!1;if(b)x=c(p,d,v);let S=!1;if(E)S=c(g,d,v);let A=x||S;if(A)for(let P=0;P<3;P++){let R=p+P,I=g+P,F=l[R],C=l[R+3],O=l[I],W=l[I+3];l[f+P]=F<O?F:O,l[f+P+3]=C>W?C:W}return A}}}function cn(e,t,n,i,s){let r,a,o,l,u,h,c=1/n.direction.x,f=1/n.direction.y,d=1/n.direction.z,_=n.origin.x,m=n.origin.y,p=n.origin.z,g=t[e],v=t[e+3],M=t[e+1],y=t[e+3+1],b=t[e+2],E=t[e+3+2];if(c>=0)r=(g-_)*c,a=(v-_)*c;else r=(v-_)*c,a=(g-_)*c;if(f>=0)o=(M-m)*f,l=(y-m)*f;else o=(y-m)*f,l=(M-m)*f;if(r>l||o>a)return!1;if(o>r||isNaN(r))r=o;if(l<a||isNaN(a))a=l;if(d>=0)u=(b-p)*d,h=(E-p)*d;else u=(E-p)*d,h=(b-p)*d;if(r>h||u>a)return!1;if(u>r||r!==r)r=u;if(h<a||a!==a)a=h;return r<=s&&a>=i}function Dd(e,t,n,i,s,r,a,o){let{geometry:l,_indirectBuffer:u}=e;for(let h=i,c=i+s;h<c;h++){let f=u?u[h]:h;Hs(l,t,n,f,r,a,o)}}function Ld(e,t,n,i,s,r,a){let{geometry:o,_indirectBuffer:l}=e,u=1/0,h=null;for(let c=i,f=i+s;c<f;c++){let d;if(d=Hs(o,t,n,l?l[c]:c,null,r,a),d&&d.distance<u)h=d,u=d.distance}return h}function Fd(e,t,n,i,s,r,a){let{geometry:o}=n,{index:l}=o,u=o.attributes.position;for(let h=e,c=t+e;h<c;h++){let f;if(f=n.resolveTriangleIndex(h),yt(a,f*3,l,u),a.needsUpdate=!0,i(a,f,s,r))return!0}return!1}function Nd(e,t,n,i,s,r,a){if(Ze.setBuffer(e._roots[t]),cn(0,Ze.float32Array,i,r,a))Gc(0,e,n,i,s,r,a);Ze.clearBuffer()}function Gc(e,t,n,i,s,r,a){let{float32Array:o,uint16Array:l,uint32Array:u}=Ze,h=e*2;if(Ke(h,l)){let f=tt(e,u),d=lt(h,l);Rd(t,n,i,f,d,s,r,a)}else{let f=at(e);if(cn(f,o,i,r,a))Gc(f,t,n,i,s,r,a);let d=ot(e,u);if(cn(d,o,i,r,a))Gc(d,t,n,i,s,r,a)}}var ay=["x","y","z"];function Ud(e,t,n,i,s,r){Ze.setBuffer(e._roots[t]);let a=null;if(cn(0,Ze.float32Array,i,s,r))a=Wc(0,e,n,i,s,r);return Ze.clearBuffer(),a}function Wc(e,t,n,i,s,r){let{float32Array:a,uint16Array:o,uint32Array:l}=Ze,u=e*2;if(Ke(u,o)){let c=tt(e,l),f=lt(u,o);return Cd(t,n,i,c,f,s,r)}else{let c=Mi(e,l),f=ay[c],_=i.direction[f]>=0,m,p;if(_)m=at(e),p=ot(e,l);else m=ot(e,l),p=at(e);let v=cn(m,a,i,s,r)?Wc(m,t,n,i,s,r):null;if(v){let b=v.point[f];if(_?b<=a[p+c]:b>=a[p+c+3])return v}let y=cn(p,a,i,s,r)?Wc(p,t,n,i,s,r):null;if(v&&y)return v.distance<=y.distance?v:y;else return v||y||null}}var io=new Et,Gs=new ln,Ws=new ln,Cr=new Pe,Od=new It,so=new It;function Bd(e,t,n,i){Ze.setBuffer(e._roots[t]);let s=Vc(0,e,n,i);return Ze.clearBuffer(),s}function Vc(e,t,n,i,s=null){let{float32Array:r,uint16Array:a,uint32Array:o}=Ze,l=e*2;if(s===null){if(!n.boundingBox)n.computeBoundingBox();Od.set(n.boundingBox.min,n.boundingBox.max,i),s=Od}if(Ke(l,a)){let h=t.geometry,c=h.index,f=h.attributes.position,d=n.index,_=n.attributes.position,m=tt(e,o),p=lt(l,a);if(Cr.copy(i).invert(),n.boundsTree)return _t(vt(e),r,so),so.matrix.copy(Cr),so.needsUpdate=!0,n.boundsTree.shapecast({intersectsBounds:(v)=>so.intersectsBox(v),intersectsTriangle:(v)=>{v.a.applyMatrix4(i),v.b.applyMatrix4(i),v.c.applyMatrix4(i),v.needsUpdate=!0;for(let M=m*3,y=(p+m)*3;M<y;M+=3)if(yt(Ws,M,c,f),Ws.needsUpdate=!0,v.intersectsTriangle(Ws))return!0;return!1}});else{let g=Ai(n);for(let v=m*3,M=(p+m)*3;v<M;v+=3){yt(Gs,v,c,f),Gs.a.applyMatrix4(Cr),Gs.b.applyMatrix4(Cr),Gs.c.applyMatrix4(Cr),Gs.needsUpdate=!0;for(let y=0,b=g*3;y<b;y+=3)if(yt(Ws,y,d,_),Ws.needsUpdate=!0,Gs.intersectsTriangle(Ws))return!0}}}else{let h=at(e),c=ot(e,o);if(_t(vt(h),r,io),s.intersectsBox(io)&&Vc(h,t,n,i,s))return!0;if(_t(vt(c),r,io),s.intersectsBox(io)&&Vc(c,t,n,i,s))return!0;return!1}}var ro=new Pe,Xc=new It,Ir=new It,oy=new L,ly=new L,cy=new L,uy=new L;function zd(e,t,n,i={},s={},r=0,a=1/0){if(!t.boundingBox)t.computeBoundingBox();Xc.set(t.boundingBox.min,t.boundingBox.max,n),Xc.needsUpdate=!0;let o=e.geometry,l=o.attributes.position,u=o.index,h=t.attributes.position,c=t.index,f=pn.getPrimitive(),d=pn.getPrimitive(),_=oy,m=ly,p=null,g=null;if(s)p=cy,g=uy;let v=1/0,M=null,y=null;if(ro.copy(n).invert(),Ir.matrix.copy(ro),e.shapecast({boundsTraverseOrder:(b)=>Xc.distanceToBox(b),intersectsBounds:(b,E,x)=>{if(x<v&&x<a){if(E)Ir.min.copy(b.min),Ir.max.copy(b.max),Ir.needsUpdate=!0;return!0}return!1},intersectsRange:(b,E)=>{if(t.boundsTree)return t.boundsTree.shapecast({boundsTraverseOrder:(S)=>Ir.distanceToBox(S),intersectsBounds:(S,A,P)=>P<v&&P<a,intersectsRange:(S,A)=>{for(let P=S,R=S+A;P<R;P++){yt(d,3*P,c,h),d.a.applyMatrix4(n),d.b.applyMatrix4(n),d.c.applyMatrix4(n),d.needsUpdate=!0;for(let I=b,F=b+E;I<F;I++){yt(f,3*I,u,l),f.needsUpdate=!0;let C=f.distanceToTriangle(d,_,p);if(C<v){if(m.copy(_),g)g.copy(p);v=C,M=I,y=P}if(C<r)return!0}}}});else{let x=Ai(t);for(let S=0,A=x;S<A;S++){yt(d,3*S,c,h),d.a.applyMatrix4(n),d.b.applyMatrix4(n),d.c.applyMatrix4(n),d.needsUpdate=!0;for(let P=b,R=b+E;P<R;P++){yt(f,3*P,u,l),f.needsUpdate=!0;let I=f.distanceToTriangle(d,_,p);if(I<v){if(m.copy(_),g)g.copy(p);v=I,M=P,y=S}if(I<r)return!0}}}}}),pn.releasePrimitive(f),pn.releasePrimitive(d),v===1/0)return null;if(!i.point)i.point=m.clone();else i.point.copy(m);if(i.distance=v,i.faceIndex=M,s){if(!s.point)s.point=g.clone();else s.point.copy(g);s.point.applyMatrix4(ro),m.applyMatrix4(ro),s.distance=m.sub(s.point).length(),s.faceIndex=y}return i}function kd(e,t=null){if(t&&Array.isArray(t))t=new Set(t);let n=e.geometry,i=n.index?n.index.array:null,s=n.attributes.position,r,a,o,l,u=0,h=e._roots;for(let f=0,d=h.length;f<d;f++)r=h[f],a=new Uint32Array(r),o=new Uint16Array(r),l=new Float32Array(r),c(0,u),u+=r.byteLength;function c(f,d,_=!1){let m=f*2;if(Ke(m,o)){let p=tt(f,a),g=lt(m,o),v=1/0,M=1/0,y=1/0,b=-1/0,E=-1/0,x=-1/0;for(let S=p,A=p+g;S<A;S++){let P=3*e.resolveTriangleIndex(S);for(let R=0;R<3;R++){let I=P+R;I=i?i[I]:I;let F=s.getX(I),C=s.getY(I),O=s.getZ(I);if(F<v)v=F;if(F>b)b=F;if(C<M)M=C;if(C>E)E=C;if(O<y)y=O;if(O>x)x=O}}if(l[f+0]!==v||l[f+1]!==M||l[f+2]!==y||l[f+3]!==b||l[f+4]!==E||l[f+5]!==x)return l[f+0]=v,l[f+1]=M,l[f+2]=y,l[f+3]=b,l[f+4]=E,l[f+5]=x,!0;else return!1}else{let p=at(f),g=ot(f,a),v=_,M=!1,y=!1;if(t){if(!v){let P=p/mt+d/Ct,R=g/mt+d/Ct;M=t.has(P),y=t.has(R),v=!M&&!y}}else M=!0,y=!0;let b=v||M,E=v||y,x=!1;if(b)x=c(p,d,v);let S=!1;if(E)S=c(g,d,v);let A=x||S;if(A)for(let P=0;P<3;P++){let R=p+P,I=g+P,F=l[R],C=l[R+3],O=l[I],W=l[I+3];l[f+P]=F<O?F:O,l[f+P+3]=C>W?C:W}return A}}}function Hd(e,t,n,i,s,r,a){if(Ze.setBuffer(e._roots[t]),cn(0,Ze.float32Array,i,r,a))qc(0,e,n,i,s,r,a);Ze.clearBuffer()}function qc(e,t,n,i,s,r,a){let{float32Array:o,uint16Array:l,uint32Array:u}=Ze,h=e*2;if(Ke(h,l)){let f=tt(e,u),d=lt(h,l);Dd(t,n,i,f,d,s,r,a)}else{let f=at(e);if(cn(f,o,i,r,a))qc(f,t,n,i,s,r,a);let d=ot(e,u);if(cn(d,o,i,r,a))qc(d,t,n,i,s,r,a)}}var hy=["x","y","z"];function Gd(e,t,n,i,s,r){Ze.setBuffer(e._roots[t]);let a=null;if(cn(0,Ze.float32Array,i,s,r))a=Yc(0,e,n,i,s,r);return Ze.clearBuffer(),a}function Yc(e,t,n,i,s,r){let{float32Array:a,uint16Array:o,uint32Array:l}=Ze,u=e*2;if(Ke(u,o)){let c=tt(e,l),f=lt(u,o);return Ld(t,n,i,c,f,s,r)}else{let c=Mi(e,l),f=hy[c],_=i.direction[f]>=0,m,p;if(_)m=at(e),p=ot(e,l);else m=ot(e,l),p=at(e);let v=cn(m,a,i,s,r)?Yc(m,t,n,i,s,r):null;if(v){let b=v.point[f];if(_?b<=a[p+c]:b>=a[p+c+3])return v}let y=cn(p,a,i,s,r)?Yc(p,t,n,i,s,r):null;if(v&&y)return v.distance<=y.distance?v:y;else return v||y||null}}var ao=new Et,Vs=new ln,Xs=new ln,Pr=new Pe,Wd=new It,oo=new It;function Vd(e,t,n,i){Ze.setBuffer(e._roots[t]);let s=Zc(0,e,n,i);return Ze.clearBuffer(),s}function Zc(e,t,n,i,s=null){let{float32Array:r,uint16Array:a,uint32Array:o}=Ze,l=e*2;if(s===null){if(!n.boundingBox)n.computeBoundingBox();Wd.set(n.boundingBox.min,n.boundingBox.max,i),s=Wd}if(Ke(l,a)){let h=t.geometry,c=h.index,f=h.attributes.position,d=n.index,_=n.attributes.position,m=tt(e,o),p=lt(l,a);if(Pr.copy(i).invert(),n.boundsTree)return _t(vt(e),r,oo),oo.matrix.copy(Pr),oo.needsUpdate=!0,n.boundsTree.shapecast({intersectsBounds:(v)=>oo.intersectsBox(v),intersectsTriangle:(v)=>{v.a.applyMatrix4(i),v.b.applyMatrix4(i),v.c.applyMatrix4(i),v.needsUpdate=!0;for(let M=m,y=p+m;M<y;M++)if(yt(Xs,3*t.resolveTriangleIndex(M),c,f),Xs.needsUpdate=!0,v.intersectsTriangle(Xs))return!0;return!1}});else{let g=Ai(n);for(let v=m,M=p+m;v<M;v++){let y=t.resolveTriangleIndex(v);yt(Vs,3*y,c,f),Vs.a.applyMatrix4(Pr),Vs.b.applyMatrix4(Pr),Vs.c.applyMatrix4(Pr),Vs.needsUpdate=!0;for(let b=0,E=g*3;b<E;b+=3)if(yt(Xs,b,d,_),Xs.needsUpdate=!0,Vs.intersectsTriangle(Xs))return!0}}}else{let h=at(e),c=ot(e,o);if(_t(vt(h),r,ao),s.intersectsBox(ao)&&Zc(h,t,n,i,s))return!0;if(_t(vt(c),r,ao),s.intersectsBox(ao)&&Zc(c,t,n,i,s))return!0;return!1}}var lo=new Pe,$c=new It,Dr=new It,fy=new L,dy=new L,py=new L,my=new L;function Xd(e,t,n,i={},s={},r=0,a=1/0){if(!t.boundingBox)t.computeBoundingBox();$c.set(t.boundingBox.min,t.boundingBox.max,n),$c.needsUpdate=!0;let o=e.geometry,l=o.attributes.position,u=o.index,h=t.attributes.position,c=t.index,f=pn.getPrimitive(),d=pn.getPrimitive(),_=fy,m=dy,p=null,g=null;if(s)p=py,g=my;let v=1/0,M=null,y=null;if(lo.copy(n).invert(),Dr.matrix.copy(lo),e.shapecast({boundsTraverseOrder:(b)=>$c.distanceToBox(b),intersectsBounds:(b,E,x)=>{if(x<v&&x<a){if(E)Dr.min.copy(b.min),Dr.max.copy(b.max),Dr.needsUpdate=!0;return!0}return!1},intersectsRange:(b,E)=>{if(t.boundsTree){let x=t.boundsTree;return x.shapecast({boundsTraverseOrder:(S)=>Dr.distanceToBox(S),intersectsBounds:(S,A,P)=>P<v&&P<a,intersectsRange:(S,A)=>{for(let P=S,R=S+A;P<R;P++){let I=x.resolveTriangleIndex(P);yt(d,3*I,c,h),d.a.applyMatrix4(n),d.b.applyMatrix4(n),d.c.applyMatrix4(n),d.needsUpdate=!0;for(let F=b,C=b+E;F<C;F++){let O=e.resolveTriangleIndex(F);yt(f,3*O,u,l),f.needsUpdate=!0;let W=f.distanceToTriangle(d,_,p);if(W<v){if(m.copy(_),g)g.copy(p);v=W,M=F,y=P}if(W<r)return!0}}}})}else{let x=Ai(t);for(let S=0,A=x;S<A;S++){yt(d,3*S,c,h),d.a.applyMatrix4(n),d.b.applyMatrix4(n),d.c.applyMatrix4(n),d.needsUpdate=!0;for(let P=b,R=b+E;P<R;P++){let I=e.resolveTriangleIndex(P);yt(f,3*I,u,l),f.needsUpdate=!0;let F=f.distanceToTriangle(d,_,p);if(F<v){if(m.copy(_),g)g.copy(p);v=F,M=P,y=S}if(F<r)return!0}}}}}),pn.releasePrimitive(f),pn.releasePrimitive(d),v===1/0)return null;if(!i.point)i.point=m.clone();else i.point.copy(m);if(i.distance=v,i.faceIndex=M,s){if(!s.point)s.point=g.clone();else s.point.copy(g);s.point.applyMatrix4(lo),m.applyMatrix4(lo),s.distance=m.sub(s.point).length(),s.faceIndex=y}return i}function Jc(e,t,n){if(e===null)return null;return e.point.applyMatrix4(t.matrixWorld),e.distance=e.point.distanceTo(n.ray.origin),e.object=t,e}var co=new It,uo=new pr,qd=new L,Yd=new Pe,Zd=new L,Kc=["getX","getY","getZ"];class Lr extends kc{static serialize(e,t={}){t={cloneBuffers:!0,...t};let{geometry:n,_roots:i,_indirectBuffer:s}=e,r=n.getIndex(),a={version:1,roots:null,index:null,indirectBuffer:null};if(t.cloneBuffers)a.roots=i.map((o)=>o.slice()),a.index=r?r.array.slice():null,a.indirectBuffer=s?s.slice():null;else a.roots=i,a.index=r?r.array:null,a.indirectBuffer=s;return a}static deserialize(e,t,n={}){n={setIndex:!0,indirect:Boolean(e.indirectBuffer),...n};let{index:i,roots:s,indirectBuffer:r}=e;if(!e.version)console.warn("MeshBVH.deserialize: Serialization format has been changed and will be fixed up. It is recommended to regenerate any stored serialized data."),o(s);let a=new Lr(t,{...n,[Ls]:!0});if(a._roots=s,a._indirectBuffer=r||null,n.setIndex){let l=t.getIndex();if(l===null){let u=new st(e.index,1,!1);t.setIndex(u)}else if(l.array!==i)l.array.set(i),l.needsUpdate=!0}return a;function o(l){for(let u=0;u<l.length;u++){let h=l[u],c=new Uint32Array(h),f=new Uint16Array(h);for(let d=0,_=h.byteLength/Ct;d<_;d++){let m=mt*d,p=2*m;if(!Ke(p,f))c[m+6]=c[m+6]/mt-d}}}}get primitiveStride(){return 3}get resolveTriangleIndex(){return this.resolvePrimitiveIndex}constructor(e,t={}){if(t.maxLeafTris)console.warn('MeshBVH: "maxLeafTris" option has been deprecated. Use "targetLeafSize", instead.'),t={...t,targetLeafSize:t.maxLeafTris};super(e,t)}shiftTriangleOffsets(e){return super.shiftPrimitiveOffsets(e)}writePrimitiveBounds(e,t,n){let i=this.geometry,s=this._indirectBuffer,r=i.attributes.position,a=i.index?i.index.array:null,l=(s?s[e]:e)*3,u=l+0,h=l+1,c=l+2;if(a)u=a[u],h=a[h],c=a[c];for(let f=0;f<3;f++){let d=r[Kc[f]](u),_=r[Kc[f]](h),m=r[Kc[f]](c),p=d;if(_<p)p=_;if(m<p)p=m;let g=d;if(_>g)g=_;if(m>g)g=m;t[n+f]=p,t[n+f+3]=g}return t}computePrimitiveBounds(e,t,n){let i=this.geometry,s=this._indirectBuffer,r=i.attributes.position,a=i.index?i.index.array:null,o=r.normalized;if(e<0||t+e-n.offset>n.length/6)throw Error("MeshBVH: compute triangle bounds range is invalid.");let l=r.array,u=r.offset||0,h=3;if(r.isInterleavedBufferAttribute)h=r.data.stride;let c=["getX","getY","getZ"],f=n.offset;for(let d=e,_=e+t;d<_;d++){let p=(s?s[d]:d)*3,g=(d-f)*6,v=p+0,M=p+1,y=p+2;if(a)v=a[v],M=a[M],y=a[y];if(!o)v=v*h+u,M=M*h+u,y=y*h+u;for(let b=0;b<3;b++){let E,x,S;if(o)E=r[c[b]](v),x=r[c[b]](M),S=r[c[b]](y);else E=l[v+b],x=l[M+b],S=l[y+b];let A=E;if(x<A)A=x;if(S<A)A=S;let P=E;if(x>P)P=x;if(S>P)P=S;let R=(P-A)/2,I=b*2;n[g+I+0]=A+R,n[g+I+1]=R+(Math.abs(A)+R)*Ds}}return n}raycastObject3D(e,t,n=[]){let{material:i}=e;if(i===void 0)return;Yd.copy(e.matrixWorld).invert(),uo.copy(t.ray).applyMatrix4(Yd),Zd.setFromMatrixScale(e.matrixWorld),qd.copy(uo.direction).multiply(Zd);let s=qd.length(),r=t.near/s,a=t.far/s;if(t.firstHitOnly===!0){let o=this.raycastFirst(uo,i,r,a);if(o=Jc(o,e,t),o)n.push(o)}else{let o=this.raycast(uo,i,r,a);for(let l=0,u=o.length;l<u;l++){let h=Jc(o[l],e,t);if(h)n.push(h)}}return n}refit(e=null){return(this.indirect?kd:Pd)(this,e)}raycast(e,t=Tn,n=0,i=1/0){let s=this._roots,r=[],a=this.indirect?Hd:Nd;for(let o=0,l=s.length;o<l;o++)a(this,o,t,e,r,n,i);return r}raycastFirst(e,t=Tn,n=0,i=1/0){let s=this._roots,r=null,a=this.indirect?Gd:Ud;for(let o=0,l=s.length;o<l;o++){let u=a(this,o,t,e,n,i);if(u!=null&&(r==null||u.distance<r.distance))r=u}return r}intersectsGeometry(e,t){let n=!1,i=this._roots,s=this.indirect?Vd:Bd;for(let r=0,a=i.length;r<a;r++)if(n=s(this,r,e,t),n)break;return n}shapecast(e){let t=pn.getPrimitive(),n=super.shapecast({...e,intersectsPrimitive:e.intersectsTriangle,scratchPrimitive:t,iterate:this.indirect?Fd:Id});return pn.releasePrimitive(t),n}bvhcast(e,t,n){let{intersectsRanges:i,intersectsTriangles:s}=n,r=pn.getPrimitive(),a=this.geometry.index,o=this.geometry.attributes.position,l=this.indirect?(d)=>{let _=this.resolveTriangleIndex(d);yt(r,_*3,a,o)}:(d)=>{yt(r,d*3,a,o)},u=pn.getPrimitive(),h=e.geometry.index,c=e.geometry.attributes.position,f=e.indirect?(d)=>{let _=e.resolveTriangleIndex(d);yt(u,_*3,h,c)}:(d)=>{yt(u,d*3,h,c)};if(s){if(!(e instanceof Lr))throw Error('MeshBVH: "intersectsTriangles" callback can only be used with another MeshBVH.');let d=(_,m,p,g,v,M,y,b)=>{for(let E=p,x=p+g;E<x;E++){f(E),u.a.applyMatrix4(t),u.b.applyMatrix4(t),u.c.applyMatrix4(t),u.needsUpdate=!0;for(let S=_,A=_+m;S<A;S++)if(l(S),r.needsUpdate=!0,s(r,u,S,E,v,M,y,b))return!0}return!1};if(i){let _=i;i=function(m,p,g,v,M,y,b,E){if(!_(m,p,g,v,M,y,b,E))return d(m,p,g,v,M,y,b,E);return!0}}else i=d}return super.bvhcast(e,t,{intersectsRanges:i})}intersectsBox(e,t){return co.set(e.min,e.max,t),co.needsUpdate=!0,this.shapecast({intersectsBounds:(n)=>co.intersectsBox(n),intersectsTriangle:(n)=>co.intersectsTriangle(n)})}intersectsSphere(e){return this.shapecast({intersectsBounds:(t)=>e.intersectsBox(t),intersectsTriangle:(t)=>t.intersectsSphere(e)})}closestPointToGeometry(e,t,n={},i={},s=0,r=1/0){return(this.indirect?Xd:zd)(this,e,t,n,i,s,r)}closestPointToPoint(e,t={},n=0,i=1/0){return Md(this,e,t,n,i)}}function gy(e){switch(e){case 1:return"R";case 2:return"RG";case 3:return"RGBA";case 4:return"RGBA"}throw Error()}function xy(e){switch(e){case 1:return ai;case 2:return Un;case 3:return ke;case 4:return ke}}function $d(e){switch(e){case 1:return ur;case 2:return Hi;case 3:return Gi;case 4:return Gi}}class Qc extends ht{constructor(){super();this.minFilter=qe,this.magFilter=qe,this.generateMipmaps=!1,this.overrideItemSize=null,this._forcedType=null}updateFrom(e){let t=this.overrideItemSize,{itemSize:n,count:i}=e;if(t!==null){if(n*i%t!==0)throw Error("VertexAttributeTexture: overrideItemSize must divide evenly into buffer length.");e.itemSize=t,e.count=i*n/t}let{itemSize:s,count:r,normalized:a}=e,o=e.array.constructor,l=o.BYTES_PER_ELEMENT,u=this._forcedType,h=s;if(u===null)switch(o){case Float32Array:u=Ve;break;case Uint8Array:case Uint16Array:case Uint32Array:u=fn;break;case Int8Array:case Int16Array:case Int32Array:u=zi;break}let c,f,d,_,m=gy(s);switch(u){case Ve:if(d=1,f=xy(s),a&&l===1)if(_=o,m+="8",o===Uint8Array)c=an;else c=cr,m+="_SNORM";else _=Float32Array,m+="32F",c=Ve;break;case zi:if(m+=l*8+"I",d=a?Math.pow(2,o.BYTES_PER_ELEMENT*8-1):1,f=$d(s),l===1)_=Int8Array,c=cr;else if(l===2)_=Int16Array,c=ua;else _=Int32Array,c=zi;break;case fn:if(m+=l*8+"UI",d=a?Math.pow(2,o.BYTES_PER_ELEMENT*8-1):1,f=$d(s),l===1)_=Uint8Array,c=an;else if(l===2)_=Uint16Array,c=Bi;else _=Uint32Array,c=fn;break}if(h===3&&(f===ke||f===Gi))h=4;let p=Math.ceil(Math.sqrt(r))||1,g=h*p*p,v=new _(g),M=e.normalized;e.normalized=!1;for(let y=0;y<r;y++){let b=h*y;if(v[b]=e.getX(y)/d,s>=2)v[b+1]=e.getY(y)/d;if(s>=3){if(v[b+2]=e.getZ(y)/d,h===4)v[b+3]=1}if(s>=4)v[b+3]=e.getW(y)/d}e.normalized=M,this.internalFormat=m,this.format=f,this.type=c,this.image.width=p,this.image.height=p,this.image.data=v,this.needsUpdate=!0,this.dispose(),e.itemSize=n,e.count=i}}class Fr extends Qc{constructor(){super();this._forcedType=fn}}class Nr extends Qc{constructor(){super();this._forcedType=Ve}}class jc{constructor(){this.index=new Fr,this.position=new Nr,this.bvhBounds=new ht,this.bvhContents=new ht,this._cachedIndexAttr=null,this.index.overrideItemSize=3}updateFrom(e){let{geometry:t}=e;if(vy(e,this.bvhBounds,this.bvhContents),this.position.updateFrom(t.attributes.position),e.indirect){let n=e._indirectBuffer;if(this._cachedIndexAttr===null||this._cachedIndexAttr.count!==n.length)if(t.index)this._cachedIndexAttr=t.index.clone();else{let i=Bc(wr(t));this._cachedIndexAttr=new st(i,1,!1)}_y(t,n,this._cachedIndexAttr),this.index.updateFrom(this._cachedIndexAttr)}else this.index.updateFrom(t.index)}dispose(){let{index:e,position:t,bvhBounds:n,bvhContents:i}=this;if(e)e.dispose();if(t)t.dispose();if(n)n.dispose();if(i)i.dispose()}}function _y(e,t,n){let i=n.array,s=e.index?e.index.array:null;for(let r=0,a=t.length;r<a;r++){let o=3*r,l=3*t[r];for(let u=0;u<3;u++)i[o+u]=s?s[l+u]:l+u}}function vy(e,t,n){let i=e._roots;if(i.length!==1)throw Error("MeshBVHUniformStruct: Multi-root BVHs not supported.");let s=i[0],r=new Uint16Array(s),a=new Uint32Array(s),o=new Float32Array(s),l=s.byteLength/Ct,u=2*Math.ceil(Math.sqrt(l/2)),h=new Float32Array(4*u*u),c=Math.ceil(Math.sqrt(l)),f=new Uint32Array(2*c*c);for(let d=0;d<l;d++){let _=d*Ct/4,m=_*2,p=vt(_);for(let g=0;g<3;g++)h[8*d+0+g]=o[p+0+g],h[8*d+4+g]=o[p+3+g];if(Ke(m,r)){let g=lt(m,r),v=tt(_,a),M=od|g;f[d*2+0]=M,f[d*2+1]=v}else{let g=a[_+6],v=Mi(_,a);f[d*2+0]=v,f[d*2+1]=g}}t.image.data=h,t.image.width=u,t.image.height=u,t.format=ke,t.type=Ve,t.internalFormat="RGBA32F",t.minFilter=qe,t.magFilter=qe,t.generateMipmaps=!1,t.needsUpdate=!0,t.dispose(),n.image.data=f,n.image.width=c,n.image.height=c,n.format=Hi,n.type=fn,n.internalFormat="RG32UI",n.minFilter=qe,n.magFilter=qe,n.generateMipmaps=!1,n.needsUpdate=!0,n.dispose()}var eu=`

// A stack of uint32 indices can can store the indices for
// a perfectly balanced tree with a depth up to 31. Lower stack
// depth gets higher performance.
//
// However not all trees are balanced. Best value to set this to
// is the trees max depth.
#ifndef BVH_STACK_DEPTH
#define BVH_STACK_DEPTH 60
#endif

#ifndef INFINITY
#define INFINITY 1e20
#endif

// Utilities
uvec4 uTexelFetch1D( usampler2D tex, uint index ) {

	uint width = uint( textureSize( tex, 0 ).x );
	uvec2 uv;
	uv.x = index % width;
	uv.y = index / width;

	return texelFetch( tex, ivec2( uv ), 0 );

}

ivec4 iTexelFetch1D( isampler2D tex, uint index ) {

	uint width = uint( textureSize( tex, 0 ).x );
	uvec2 uv;
	uv.x = index % width;
	uv.y = index / width;

	return texelFetch( tex, ivec2( uv ), 0 );

}

vec4 texelFetch1D( sampler2D tex, uint index ) {

	uint width = uint( textureSize( tex, 0 ).x );
	uvec2 uv;
	uv.x = index % width;
	uv.y = index / width;

	return texelFetch( tex, ivec2( uv ), 0 );

}

vec4 textureSampleBarycoord( sampler2D tex, vec3 barycoord, uvec3 faceIndices ) {

	return
		barycoord.x * texelFetch1D( tex, faceIndices.x ) +
		barycoord.y * texelFetch1D( tex, faceIndices.y ) +
		barycoord.z * texelFetch1D( tex, faceIndices.z );

}

void ndcToCameraRay(
	vec2 coord, mat4 cameraWorld, mat4 invProjectionMatrix,
	out vec3 rayOrigin, out vec3 rayDirection
) {

	// get camera look direction and near plane for camera clipping
	vec4 lookDirection = cameraWorld * vec4( 0.0, 0.0, - 1.0, 0.0 );
	vec4 nearVector = invProjectionMatrix * vec4( 0.0, 0.0, - 1.0, 1.0 );
	float near = abs( nearVector.z / nearVector.w );

	// get the camera direction and position from camera matrices
	vec4 origin = cameraWorld * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec4 direction = invProjectionMatrix * vec4( coord, 0.5, 1.0 );
	direction /= direction.w;
	direction = cameraWorld * direction - origin;

	// slide the origin along the ray until it sits at the near clip plane position
	origin.xyz += direction.xyz * near / dot( direction, lookDirection );

	rayOrigin = origin.xyz;
	rayDirection = direction.xyz;

}
`;var tu=`

#ifndef TRI_INTERSECT_EPSILON
#define TRI_INTERSECT_EPSILON 1e-5
#endif

// Raycasting
bool intersectsBounds( vec3 rayOrigin, vec3 rayDirection, vec3 boundsMin, vec3 boundsMax, out float dist ) {

	// https://www.reddit.com/r/opengl/comments/8ntzz5/fast_glsl_ray_box_intersection/
	// https://tavianator.com/2011/ray_box.html
	vec3 invDir = 1.0 / rayDirection;

	// find intersection distances for each plane
	vec3 tMinPlane = invDir * ( boundsMin - rayOrigin );
	vec3 tMaxPlane = invDir * ( boundsMax - rayOrigin );

	// get the min and max distances from each intersection
	vec3 tMinHit = min( tMaxPlane, tMinPlane );
	vec3 tMaxHit = max( tMaxPlane, tMinPlane );

	// get the furthest hit distance
	vec2 t = max( tMinHit.xx, tMinHit.yz );
	float t0 = max( t.x, t.y );

	// get the minimum hit distance
	t = min( tMaxHit.xx, tMaxHit.yz );
	float t1 = min( t.x, t.y );

	// set distance to 0.0 if the ray starts inside the box
	dist = max( t0, 0.0 );

	return t1 >= dist;

}

bool intersectsTriangle(
	vec3 rayOrigin, vec3 rayDirection, vec3 a, vec3 b, vec3 c,
	out vec3 barycoord, out vec3 norm, out float dist, out float side
) {

	// https://stackoverflow.com/questions/42740765/intersection-between-line-and-triangle-in-3d
	vec3 edge1 = b - a;
	vec3 edge2 = c - a;
	norm = cross( edge1, edge2 );

	float det = - dot( rayDirection, norm );
	float invdet = 1.0 / det;

	vec3 AO = rayOrigin - a;
	vec3 DAO = cross( AO, rayDirection );

	vec4 uvt;
	uvt.x = dot( edge2, DAO ) * invdet;
	uvt.y = - dot( edge1, DAO ) * invdet;
	uvt.z = dot( AO, norm ) * invdet;
	uvt.w = 1.0 - uvt.x - uvt.y;

	// set the hit information
	barycoord = uvt.wxy; // arranged in A, B, C order
	dist = uvt.z;
	side = sign( det );
	norm = side * normalize( norm );

	// add an epsilon to avoid misses between triangles
	uvt += vec4( TRI_INTERSECT_EPSILON );

	return all( greaterThanEqual( uvt, vec4( 0.0 ) ) );

}

bool intersectTriangles(
	// geometry info and triangle range
	sampler2D positionAttr, usampler2D indexAttr, uint offset, uint count,

	// ray
	vec3 rayOrigin, vec3 rayDirection,

	// outputs
	inout float minDistance, inout uvec4 faceIndices, inout vec3 faceNormal, inout vec3 barycoord,
	inout float side, inout float dist
) {

	bool found = false;
	vec3 localBarycoord, localNormal;
	float localDist, localSide;
	for ( uint i = offset, l = offset + count; i < l; i ++ ) {

		uvec3 indices = uTexelFetch1D( indexAttr, i ).xyz;
		vec3 a = texelFetch1D( positionAttr, indices.x ).rgb;
		vec3 b = texelFetch1D( positionAttr, indices.y ).rgb;
		vec3 c = texelFetch1D( positionAttr, indices.z ).rgb;

		if (
			intersectsTriangle( rayOrigin, rayDirection, a, b, c, localBarycoord, localNormal, localDist, localSide )
			&& localDist < minDistance
		) {

			found = true;
			minDistance = localDist;

			faceIndices = uvec4( indices.xyz, i );
			faceNormal = localNormal;

			side = localSide;
			barycoord = localBarycoord;
			dist = localDist;

		}

	}

	return found;

}

bool intersectsBVHNodeBounds( vec3 rayOrigin, vec3 rayDirection, sampler2D bvhBounds, uint currNodeIndex, out float dist ) {

	uint cni2 = currNodeIndex * 2u;
	vec3 boundsMin = texelFetch1D( bvhBounds, cni2 ).xyz;
	vec3 boundsMax = texelFetch1D( bvhBounds, cni2 + 1u ).xyz;
	return intersectsBounds( rayOrigin, rayDirection, boundsMin, boundsMax, dist );

}

// use a macro to hide the fact that we need to expand the struct into separate fields
#define	bvhIntersectFirstHit(		bvh,		rayOrigin, rayDirection, faceIndices, faceNormal, barycoord, side, dist	)	_bvhIntersectFirstHit(		bvh.position, bvh.index, bvh.bvhBounds, bvh.bvhContents,		rayOrigin, rayDirection, faceIndices, faceNormal, barycoord, side, dist	)

bool _bvhIntersectFirstHit(
	// bvh info
	sampler2D bvh_position, usampler2D bvh_index, sampler2D bvh_bvhBounds, usampler2D bvh_bvhContents,

	// ray
	vec3 rayOrigin, vec3 rayDirection,

	// output variables split into separate variables due to output precision
	inout uvec4 faceIndices, inout vec3 faceNormal, inout vec3 barycoord,
	inout float side, inout float dist
) {

	// stack needs to be twice as long as the deepest tree we expect because
	// we push both the left and right child onto the stack every traversal
	int pointer = 0;
	uint stack[ BVH_STACK_DEPTH ];
	stack[ 0 ] = 0u;

	float triangleDistance = INFINITY;
	bool found = false;
	while ( pointer > - 1 && pointer < BVH_STACK_DEPTH ) {

		uint currNodeIndex = stack[ pointer ];
		pointer --;

		// check if we intersect the current bounds
		float boundsHitDistance;
		if (
			! intersectsBVHNodeBounds( rayOrigin, rayDirection, bvh_bvhBounds, currNodeIndex, boundsHitDistance )
			|| boundsHitDistance > triangleDistance
		) {

			continue;

		}

		uvec2 boundsInfo = uTexelFetch1D( bvh_bvhContents, currNodeIndex ).xy;
		bool isLeaf = bool( boundsInfo.x & 0xffff0000u );

		if ( isLeaf ) {

			uint count = boundsInfo.x & 0x0000ffffu;
			uint offset = boundsInfo.y;

			found = intersectTriangles(
				bvh_position, bvh_index, offset, count,
				rayOrigin, rayDirection, triangleDistance,
				faceIndices, faceNormal, barycoord, side, dist
			) || found;

		} else {

			uint leftIndex = currNodeIndex + 1u;
			uint splitAxis = boundsInfo.x & 0x0000ffffu;
			uint rightIndex = currNodeIndex + boundsInfo.y;

			bool leftToRight = rayDirection[ splitAxis ] >= 0.0;
			uint c1 = leftToRight ? leftIndex : rightIndex;
			uint c2 = leftToRight ? rightIndex : leftIndex;

			// set c2 in the stack so we traverse it later. We need to keep track of a pointer in
			// the stack while we traverse. The second pointer added is the one that will be
			// traversed first
			pointer ++;
			stack[ pointer ] = c2;

			pointer ++;
			stack[ pointer ] = c1;

		}

	}

	return found;

}
`;var Jd=`
struct BVH {

	usampler2D index;
	sampler2D position;

	sampler2D bvhBounds;
	usampler2D bvhContents;

};
`;var f1=`
	${eu}
	${tu}
`;function ho(e,t,n=0){if(e.isInterleavedBufferAttribute){let i=e.itemSize;for(let s=0,r=e.count;s<r;s++){let a=s+n;if(t.setX(a,e.getX(s)),i>=2)t.setY(a,e.getY(s));if(i>=3)t.setZ(a,e.getZ(s));if(i>=4)t.setW(a,e.getW(s))}}else{let i=t.array,s=i.constructor,r=i.BYTES_PER_ELEMENT*e.itemSize*n;new s(i.buffer,r,e.array.length).set(e.array)}}function es(e,t=null){let n=e.array.constructor,{normalized:i,itemSize:s}=e,r=t===null?e.count:t;return new st(new n(s*r),s,i)}function Ei(e,t){if(!e&&!t)return!0;if(Boolean(e)!==Boolean(t))return!1;let n=e.count===t.count,i=e.normalized===t.normalized,s=e.array.constructor===t.array.constructor,r=e.itemSize===t.itemSize;if(!n||!i||!s||!r)return!1;return!0}function yy(e){let t=e[0].index!==null,n=new Set(Object.keys(e[0].attributes));if(!e[0].getAttribute("position"))throw Error("StaticGeometryGenerator: position attribute is required.");for(let i=0;i<e.length;++i){let s=e[i],r=0;if(t!==(s.index!==null))throw Error("StaticGeometryGenerator: All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them.");for(let a in s.attributes){if(!n.has(a))throw Error('StaticGeometryGenerator: All geometries must have compatible attributes; make sure "'+a+'" attribute exists among all geometries, or in none of them.');r++}if(r!==n.size)throw Error("StaticGeometryGenerator: All geometries must have the same number of attributes.")}}function Sy(e){let t=0;for(let n=0,i=e.length;n<i;n++)t+=e[n].getIndex().count;return t}function My(e){let t=0;for(let n=0,i=e.length;n<i;n++)t+=e[n].getAttribute("position").count;return t}function by(e,t,n){if(e.index&&e.index.count!==t)e.setIndex(null);let i=e.attributes;for(let s in i)if(i[s].count!==n)e.deleteAttribute(s)}function Qd(e,t={},n=new Tt){let{useGroups:i=!1,forceUpdate:s=!1,skipAssigningAttributes:r=[],overwriteIndex:a=!0}=t;yy(e);let o=e[0].index!==null,l=o?Sy(e):-1,u=My(e);if(by(n,l,u),i){let c=0;for(let f=0,d=e.length;f<d;f++){let _=e[f],m;if(o)m=_.getIndex().count;else m=_.getAttribute("position").count;n.addGroup(c,m,f),c+=m}}if(o){let c=!1;if(!n.index)n.setIndex(new st(new Uint32Array(l),1,!1)),c=!0;if(c||a){let f=0,d=0,_=n.getIndex();for(let m=0,p=e.length;m<p;m++){let g=e[m],v=g.getIndex();if(!(!s&&!c&&r[m]))for(let y=0;y<v.count;++y)_.setX(f+y,v.getX(y)+d);f+=v.count,d+=g.getAttribute("position").count}}}let h=Object.keys(e[0].attributes);for(let c=0,f=h.length;c<f;c++){let d=!1,_=h[c];if(!n.getAttribute(_)){let g=e[0].getAttribute(_);n.setAttribute(_,es(g,u)),d=!0}let m=0,p=n.getAttribute(_);for(let g=0,v=e.length;g<v;g++){let M=e[g],y=!s&&!d&&r[g],b=M.getAttribute(_);if(!y)if(_==="color"&&p.itemSize!==b.itemSize)for(let E=m,x=b.count;E<x;E++)b.setXYZW(E,p.getX(E),p.getY(E),p.getZ(E),1);else ho(b,p,m);m+=b.count}}}function jd(e,t,n){let i=e.index,r=e.attributes.position.count,a=i?i.count:r,o=e.groups;if(o.length===0)o=[{count:a,start:0,materialIndex:0}];let l=e.getAttribute("materialIndex");if(!l||l.count!==r){let h;if(n.length<=255)h=new Uint8Array(r);else h=new Uint16Array(r);l=new st(h,1,!1),e.deleteAttribute("materialIndex"),e.setAttribute("materialIndex",l)}let u=l.array;for(let h=0;h<o.length;h++){let c=o[h],{start:f,count:d}=c,_=Math.min(d,a-f),m=Array.isArray(t)?t[c.materialIndex]:t,p=n.indexOf(m);for(let g=0;g<_;g++){let v=f+g;if(i)v=i.getX(v);u[v]=p}}}function ep(e,t){if(!e.index){let n=e.attributes.position.count,i=Array(n);for(let s=0;s<n;s++)i[s]=s;e.setIndex(i)}if(!e.attributes.normal&&(t&&t.includes("normal")))e.computeVertexNormals();if(!e.attributes.uv&&(t&&t.includes("uv"))){let n=e.attributes.position.count;e.setAttribute("uv",new st(new Float32Array(n*2),2,!1))}if(!e.attributes.uv2&&(t&&t.includes("uv2"))){let n=e.attributes.position.count;e.setAttribute("uv2",new st(new Float32Array(n*2),2,!1))}if(!e.attributes.tangent&&(t&&t.includes("tangent")))if(e.attributes.uv&&e.attributes.normal)e.computeTangents();else{let n=e.attributes.position.count;e.setAttribute("tangent",new st(new Float32Array(n*4),4,!1))}if(!e.attributes.color&&(t&&t.includes("color"))){let n=e.attributes.position.count,i=new Float32Array(n*4);i.fill(1),e.setAttribute("color",new st(i,4))}}function qs(e){let t=0;if(e.byteLength!==0){let n=new Uint8Array(e);for(let i=0;i<e.byteLength;i++){let s=n[i];t=(t<<5)-t+s,t|=0}}return t}function tp(e){let t=e.uuid,n=Object.values(e.attributes);if(e.index)n.push(e.index),t+=`index|${e.index.version}`;let i=Object.keys(n).sort();for(let s of i){let r=n[s];t+=`${s}_${r.version}|`}return t}function np(e){let t=e.skeleton;if(t){if(!t.boneTexture)t.computeBoneTexture();return`${qs(t.boneTexture.image.data.buffer)}_${t.boneTexture.uuid}`}else return null}class nu{constructor(e=null){if(this.matrixWorld=new Pe,this.geometryHash=null,this.skeletonHash=null,this.primitiveCount=-1,e!==null)this.updateFrom(e)}updateFrom(e){let t=e.geometry,n=(t.index?t.index.count:t.attributes.position.count)/3;this.matrixWorld.copy(e.matrixWorld),this.geometryHash=tp(t),this.primitiveCount=n,this.skeletonHash=np(e)}didChange(e){let t=e.geometry,n=(t.index?t.index.count:t.attributes.position.count)/3;return!(this.matrixWorld.equals(e.matrixWorld)&&this.geometryHash===tp(t)&&this.skeletonHash===np(e)&&this.primitiveCount===n)}}var ts=new L,ns=new L,is=new L,ip=new rt,fo=new L,iu=new L,sp=new rt,rp=new rt,po=new Pe,ap=new Pe;function op(e,t,n){let{skeleton:i,geometry:s}=e,{bones:r,boneInverses:a}=i;sp.fromBufferAttribute(s.attributes.skinIndex,t),rp.fromBufferAttribute(s.attributes.skinWeight,t),po.elements.fill(0);for(let o=0;o<4;o++){let l=rp.getComponent(o);if(l!==0){let u=sp.getComponent(o);ap.multiplyMatrices(r[u].matrixWorld,a[u]),Ty(po,ap,l)}}return po.multiply(e.bindMatrix).premultiply(e.bindMatrixInverse),n.transformDirection(po),n}function su(e,t,n,i,s){fo.set(0,0,0);for(let r=0,a=e.length;r<a;r++){let o=t[r],l=e[r];if(o===0)continue;if(iu.fromBufferAttribute(l,i),n)fo.addScaledVector(iu,o);else fo.addScaledVector(iu.sub(s),o)}s.add(fo)}function Ty(e,t,n){let i=e.elements,s=t.elements;for(let r=0,a=s.length;r<a;r++)i[r]+=s[r]*n}function wy(e){let{index:t,attributes:n}=e;if(t)for(let i=0,s=t.count;i<s;i+=3){let r=t.getX(i),a=t.getX(i+2);t.setX(i,a),t.setX(i+2,r)}else for(let i in n){let s=n[i],r=s.itemSize;for(let a=0,o=s.count;a<o;a+=3)for(let l=0;l<r;l++){let u=s.getComponent(a,l),h=s.getComponent(a+2,l);s.setComponent(a,l,h),s.setComponent(a+2,l,u)}}return e}function lp(e,t={},n=new Tt){t={applyWorldTransforms:!0,attributes:[],...t};let i=e.geometry,s=t.applyWorldTransforms,r=t.attributes.includes("normal"),a=t.attributes.includes("tangent"),o=i.attributes,l=n.attributes;for(let v in n.attributes)if(!t.attributes.includes(v)||!(v in i.attributes))n.deleteAttribute(v);if(!n.index&&i.index)n.index=i.index.clone();if(!l.position)n.setAttribute("position",es(o.position));if(r&&!l.normal&&o.normal)n.setAttribute("normal",es(o.normal));if(a&&!l.tangent&&o.tangent)n.setAttribute("tangent",es(o.tangent));if(Ei(i.index,n.index),Ei(o.position,l.position),r)Ei(o.normal,l.normal);if(a)Ei(o.tangent,l.tangent);let u=o.position,h=r?o.normal:null,c=a?o.tangent:null,f=i.morphAttributes.position,d=i.morphAttributes.normal,_=i.morphAttributes.tangent,m=i.morphTargetsRelative,p=e.morphTargetInfluences,g=new Fe;if(g.getNormalMatrix(e.matrixWorld),i.index)n.index.array.set(i.index.array);for(let v=0,M=o.position.count;v<M;v++){if(ts.fromBufferAttribute(u,v),h)ns.fromBufferAttribute(h,v);if(c)ip.fromBufferAttribute(c,v),is.fromBufferAttribute(c,v);if(p){if(f)su(f,p,m,v,ts);if(d)su(d,p,m,v,ns);if(_)su(_,p,m,v,is)}if(e.isSkinnedMesh){if(e.applyBoneTransform(v,ts),h)op(e,v,ns);if(c)op(e,v,is)}if(s)ts.applyMatrix4(e.matrixWorld);if(l.position.setXYZ(v,ts.x,ts.y,ts.z),h){if(s)ns.applyNormalMatrix(g);l.normal.setXYZ(v,ns.x,ns.y,ns.z)}if(c){if(s)is.transformDirection(e.matrixWorld);l.tangent.setXYZW(v,is.x,is.y,is.z,ip.w)}}for(let v in t.attributes){let M=t.attributes[v];if(M==="position"||M==="tangent"||M==="normal"||!(M in o))continue;if(!l[M])n.setAttribute(M,es(o[M]));Ei(o[M],l[M]),ho(o[M],l[M])}if(e.matrixWorld.determinant()<0)wy(n);return n}class ru extends Tt{constructor(){super();this.version=0,this.hash=null,this._diff=new nu}isCompatible(e,t){let n=e.geometry;for(let i=0;i<t.length;i++){let s=t[i],r=n.attributes[s],a=this.attributes[s];if(r&&!Ei(r,a))return!1}return!0}updateFrom(e,t){let n=this._diff;if(n.didChange(e))return lp(e,t,this),n.updateFrom(e),this.version++,this.hash=`${this.uuid}_${this.version}`,!0;else return!1}}var mo=0,au=1,ou=2;function Ay(e,t){for(let n=0,i=e.length;n<i;n++)e[n].traverseVisible((r)=>{if(r.isMesh)t(r)})}function Ey(e){let t=[];for(let n=0,i=e.length;n<i;n++){let s=e[n];if(Array.isArray(s.material))t.push(...s.material);else t.push(s.material)}return t}function Ry(e,t,n){if(e.length===0){t.setIndex(null);let i=t.attributes;for(let s in i)t.deleteAttribute(s);for(let s in n.attributes)t.setAttribute(n.attributes[s],new st(new Float32Array(0),4,!1))}else Qd(e,n,t);for(let i in t.attributes)t.attributes[i].needsUpdate=!0}class lu{constructor(e){this.objects=null,this.useGroups=!0,this.applyWorldTransforms=!0,this.generateMissingAttributes=!0,this.overwriteIndex=!0,this.attributes=["position","normal","color","tangent","uv","uv2"],this._intermediateGeometry=new Map,this._geometryMergeSets=new WeakMap,this._mergeOrder=[],this._dummyMesh=null,this.setObjects(e||[])}_getDummyMesh(){if(!this._dummyMesh){let e=new yi,t=new Tt;t.setAttribute("position",new st(new Float32Array(9),3)),this._dummyMesh=new dn(t,e)}return this._dummyMesh}_getMeshes(){let e=[];if(Ay(this.objects,(t)=>{e.push(t)}),e.sort((t,n)=>{if(t.uuid>n.uuid)return 1;if(t.uuid<n.uuid)return-1;return 0}),e.length===0)e.push(this._getDummyMesh());return e}_updateIntermediateGeometries(){let{_intermediateGeometry:e}=this,t=this._getMeshes(),n=new Set(e.keys()),i={attributes:this.attributes,applyWorldTransforms:this.applyWorldTransforms};for(let s=0,r=t.length;s<r;s++){let a=t[s],o=a.uuid;n.delete(o);let l=e.get(o);if(!l||!l.isCompatible(a,this.attributes)){if(l)l.dispose();l=new ru,e.set(o,l)}if(l.updateFrom(a,i)){if(this.generateMissingAttributes)ep(l,this.attributes)}}n.forEach((s)=>{e.delete(s)})}setObjects(e){if(Array.isArray(e))this.objects=[...e];else this.objects=[e]}generate(e=new Tt){let{useGroups:t,overwriteIndex:n,_intermediateGeometry:i,_geometryMergeSets:s}=this,r=this._getMeshes(),a=[],o=[],l=s.get(e)||[];this._updateIntermediateGeometries();let u=!1;if(r.length!==l.length)u=!0;for(let c=0,f=r.length;c<f;c++){let d=r[c],_=i.get(d.uuid);o.push(_);let m=l[c];if(!m||m.uuid!==_.uuid)a.push(!1),u=!0;else if(m.version!==_.version)a.push(!1);else a.push(!0)}if(Ry(o,e,{useGroups:t,forceUpdate:u,skipAssigningAttributes:a,overwriteIndex:n}),u)e.dispose();s.set(e,o.map((c)=>({version:c.version,uuid:c.uuid})));let h=mo;if(u)h=ou;else if(a.includes(!1))h=au;return{changeType:h,materials:Ey(r),geometry:e}}}function Cy(e){let t=new Set;for(let n=0,i=e.length;n<i;n++){let s=e[n];for(let r in s){let a=s[r];if(a&&a.isTexture)t.add(a)}}return Array.from(t)}function Iy(e){let t=[],n=new Set;for(let s=0,r=e.length;s<r;s++)e[s].traverse((a)=>{if(a.visible){if(a.isRectAreaLight||a.isSpotLight||a.isPointLight||a.isDirectionalLight){if(t.push(a),a.iesMap)n.add(a.iesMap)}}});let i=Array.from(n).sort((s,r)=>{if(s.uuid<r.uuid)return 1;if(s.uuid>r.uuid)return-1;return 0});return{lights:t,iesTextures:i}}class cu{get initialized(){return Boolean(this.bvh)}constructor(e){this.bvhOptions={},this.attributes=["position","normal","tangent","color","uv","uv2"],this.generateBVH=!0,this.bvh=null,this.geometry=new Tt,this.staticGeometryGenerator=new lu(e),this._bvhWorker=null,this._pendingGenerate=null,this._buildAsync=!1,this._materialUuids=null}setObjects(e){this.staticGeometryGenerator.setObjects(e)}setBVHWorker(e){this._bvhWorker=e}async generateAsync(e=null){if(!this._bvhWorker)throw Error('PathTracingSceneGenerator: "setBVHWorker" must be called before "generateAsync" can be called.');if(this.bvh instanceof Promise){if(!this._pendingGenerate)this._pendingGenerate=new Promise(async()=>(await this.bvh,this._pendingGenerate=null,this.generateAsync(e)));return this._pendingGenerate}else{this._buildAsync=!0;let t=this.generate(e);return this._buildAsync=!1,t.bvh=this.bvh=await t.bvh,t}}generate(e=null){let{staticGeometryGenerator:t,geometry:n,attributes:i}=this,s=t.objects;t.attributes=i,s.forEach((c)=>{c.traverse((f)=>{if(f.isSkinnedMesh&&f.skeleton)f.skeleton.update()})});let r=t.generate(n),a=r.materials,o=r.changeType!==mo||this._materialUuids===null||this._materialUuids.length!==a.length;if(!o){for(let c=0,f=a.length;c<f;c++)if(a[c].uuid!==this._materialUuids[c]){o=!0;break}}let l=Cy(a),{lights:u,iesTextures:h}=Iy(s);if(o)jd(n,a,a),this._materialUuids=a.map((c)=>c.uuid);if(this.generateBVH){if(this.bvh instanceof Promise)throw Error("PathTracingSceneGenerator: BVH is already building asynchronously.");if(r.changeType===ou){let c={strategy:Mr,maxLeafTris:1,indirect:!0,onProgress:e,...this.bvhOptions};if(this._buildAsync)this.bvh=this._bvhWorker.generate(n,c);else this.bvh=new Lr(n,c)}else if(r.changeType===au)this.bvh.refit()}return{bvhChanged:r.changeType!==mo,bvh:this.bvh,needsMaterialIndexUpdate:o,lights:u,iesTextures:h,geometry:n,materials:a,textures:l,objects:s}}}var Py=new Is(-1,1,1,-1,0,1);class cp extends Tt{constructor(){super();this.setAttribute("position",new Zt([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new Zt([0,2,0,0,2,0],2))}}var Dy=new cp;class un{constructor(e){this._mesh=new dn(Dy,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,Py)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class ui extends kt{set needsUpdate(e){super.needsUpdate=!0,this.dispatchEvent({type:"recompilation"})}constructor(e){super(e);for(let t in this.uniforms)Object.defineProperty(this,t,{get(){return this.uniforms[t].value},set(n){this.uniforms[t].value=n}})}setDefine(e,t=void 0){if(t===void 0||t===null){if(e in this.defines)return delete this.defines[e],this.needsUpdate=!0,!0}else if(this.defines[e]!==t)return this.defines[e]=t,this.needsUpdate=!0,!0;return!1}}class uu extends ui{constructor(e){super({blending:Ot,uniforms:{target1:{value:null},target2:{value:null},opacity:{value:1}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				uniform float opacity;

				uniform sampler2D target1;
				uniform sampler2D target2;

				varying vec2 vUv;

				void main() {

					vec4 color1 = texture2D( target1, vUv );
					vec4 color2 = texture2D( target2, vUv );

					float invOpacity = 1.0 - opacity;
					float totalAlpha = color1.a * invOpacity + color2.a * opacity;

					if ( color1.a != 0.0 || color2.a != 0.0 ) {

						gl_FragColor.rgb = color1.rgb * ( invOpacity * color1.a / totalAlpha ) + color2.rgb * ( opacity * color2.a / totalAlpha );
						gl_FragColor.a = totalAlpha;

					} else {

						gl_FragColor = vec4( 0.0 );

					}

				}`});this.setValues(e)}}function go(e=1){let t="uint";if(e>1)t="uvec"+e;return`
		${t} sobolReverseBits( ${t} x ) {

			x = ( ( ( x & 0xaaaaaaaau ) >> 1 ) | ( ( x & 0x55555555u ) << 1 ) );
			x = ( ( ( x & 0xccccccccu ) >> 2 ) | ( ( x & 0x33333333u ) << 2 ) );
			x = ( ( ( x & 0xf0f0f0f0u ) >> 4 ) | ( ( x & 0x0f0f0f0fu ) << 4 ) );
			x = ( ( ( x & 0xff00ff00u ) >> 8 ) | ( ( x & 0x00ff00ffu ) << 8 ) );
			return ( ( x >> 16 ) | ( x << 16 ) );

		}

		${t} sobolHashCombine( uint seed, ${t} v ) {

			return seed ^ ( v + ${t}( ( seed << 6 ) + ( seed >> 2 ) ) );

		}

		${t} sobolLaineKarrasPermutation( ${t} x, ${t} seed ) {

			x += seed;
			x ^= x * 0x6c50b47cu;
			x ^= x * 0xb82f1e52u;
			x ^= x * 0xc7afe638u;
			x ^= x * 0x8d22f6e6u;
			return x;

		}

		${t} nestedUniformScrambleBase2( ${t} x, ${t} seed ) {

			x = sobolLaineKarrasPermutation( x, seed );
			x = sobolReverseBits( x );
			return x;

		}
	`}function xo(e=1){let t="uint",n="float",i="",s=".r",r="1u";if(e>1)if(t="uvec"+e,n="vec"+e,i=e+"",e===2)s=".rg",r="uvec2( 1u, 2u )";else if(e===3)s=".rgb",r="uvec3( 1u, 2u, 3u )";else s="",r="uvec4( 1u, 2u, 3u, 4u )";return`

		${n} sobol${i}( int effect ) {

			uint seed = sobolGetSeed( sobolBounceIndex, uint( effect ) );
			uint index = sobolPathIndex;

			uint shuffle_seed = sobolHashCombine( seed, 0u );
			uint shuffled_index = nestedUniformScrambleBase2( sobolReverseBits( index ), shuffle_seed );
			${n} sobol_pt = sobolGetTexturePoint( shuffled_index )${s};
			${t} result = ${t}( sobol_pt * 16777216.0 );

			${t} seed2 = sobolHashCombine( seed, ${r} );
			result = nestedUniformScrambleBase2( result, seed2 );

			return SOBOL_FACTOR * ${n}( result >> 8 );

		}
	`}var _o=`

	// Utils
	const float SOBOL_FACTOR = 1.0 / 16777216.0;
	const uint SOBOL_MAX_POINTS = 256u * 256u;

	${go(1)}
	${go(2)}
	${go(3)}
	${go(4)}

	uint sobolHash( uint x ) {

		// finalizer from murmurhash3
		x ^= x >> 16;
		x *= 0x85ebca6bu;
		x ^= x >> 13;
		x *= 0xc2b2ae35u;
		x ^= x >> 16;
		return x;

	}

`,up=`

	const uint SOBOL_DIRECTIONS_1[ 32 ] = uint[ 32 ](
		0x80000000u, 0xc0000000u, 0xa0000000u, 0xf0000000u,
		0x88000000u, 0xcc000000u, 0xaa000000u, 0xff000000u,
		0x80800000u, 0xc0c00000u, 0xa0a00000u, 0xf0f00000u,
		0x88880000u, 0xcccc0000u, 0xaaaa0000u, 0xffff0000u,
		0x80008000u, 0xc000c000u, 0xa000a000u, 0xf000f000u,
		0x88008800u, 0xcc00cc00u, 0xaa00aa00u, 0xff00ff00u,
		0x80808080u, 0xc0c0c0c0u, 0xa0a0a0a0u, 0xf0f0f0f0u,
		0x88888888u, 0xccccccccu, 0xaaaaaaaau, 0xffffffffu
	);

	const uint SOBOL_DIRECTIONS_2[ 32 ] = uint[ 32 ](
		0x80000000u, 0xc0000000u, 0x60000000u, 0x90000000u,
		0xe8000000u, 0x5c000000u, 0x8e000000u, 0xc5000000u,
		0x68800000u, 0x9cc00000u, 0xee600000u, 0x55900000u,
		0x80680000u, 0xc09c0000u, 0x60ee0000u, 0x90550000u,
		0xe8808000u, 0x5cc0c000u, 0x8e606000u, 0xc5909000u,
		0x6868e800u, 0x9c9c5c00u, 0xeeee8e00u, 0x5555c500u,
		0x8000e880u, 0xc0005cc0u, 0x60008e60u, 0x9000c590u,
		0xe8006868u, 0x5c009c9cu, 0x8e00eeeeu, 0xc5005555u
	);

	const uint SOBOL_DIRECTIONS_3[ 32 ] = uint[ 32 ](
		0x80000000u, 0xc0000000u, 0x20000000u, 0x50000000u,
		0xf8000000u, 0x74000000u, 0xa2000000u, 0x93000000u,
		0xd8800000u, 0x25400000u, 0x59e00000u, 0xe6d00000u,
		0x78080000u, 0xb40c0000u, 0x82020000u, 0xc3050000u,
		0x208f8000u, 0x51474000u, 0xfbea2000u, 0x75d93000u,
		0xa0858800u, 0x914e5400u, 0xdbe79e00u, 0x25db6d00u,
		0x58800080u, 0xe54000c0u, 0x79e00020u, 0xb6d00050u,
		0x800800f8u, 0xc00c0074u, 0x200200a2u, 0x50050093u
	);

	const uint SOBOL_DIRECTIONS_4[ 32 ] = uint[ 32 ](
		0x80000000u, 0x40000000u, 0x20000000u, 0xb0000000u,
		0xf8000000u, 0xdc000000u, 0x7a000000u, 0x9d000000u,
		0x5a800000u, 0x2fc00000u, 0xa1600000u, 0xf0b00000u,
		0xda880000u, 0x6fc40000u, 0x81620000u, 0x40bb0000u,
		0x22878000u, 0xb3c9c000u, 0xfb65a000u, 0xddb2d000u,
		0x78022800u, 0x9c0b3c00u, 0x5a0fb600u, 0x2d0ddb00u,
		0xa2878080u, 0xf3c9c040u, 0xdb65a020u, 0x6db2d0b0u,
		0x800228f8u, 0x400b3cdcu, 0x200fb67au, 0xb00ddb9du
	);

	uint getMaskedSobol( uint index, uint directions[ 32 ] ) {

		uint X = 0u;
		for ( int bit = 0; bit < 32; bit ++ ) {

			uint mask = ( index >> bit ) & 1u;
			X ^= mask * directions[ bit ];

		}
		return X;

	}

	vec4 generateSobolPoint( uint index ) {

		if ( index >= SOBOL_MAX_POINTS ) {

			return vec4( 0.0 );

		}

		// NOTE: this sobol "direction" is also available but we can't write out 5 components
		// uint x = index & 0x00ffffffu;
		uint x = sobolReverseBits( getMaskedSobol( index, SOBOL_DIRECTIONS_1 ) ) & 0x00ffffffu;
		uint y = sobolReverseBits( getMaskedSobol( index, SOBOL_DIRECTIONS_2 ) ) & 0x00ffffffu;
		uint z = sobolReverseBits( getMaskedSobol( index, SOBOL_DIRECTIONS_3 ) ) & 0x00ffffffu;
		uint w = sobolReverseBits( getMaskedSobol( index, SOBOL_DIRECTIONS_4 ) ) & 0x00ffffffu;

		return vec4( x, y, z, w ) * SOBOL_FACTOR;

	}

`,hp=`

	// Seeds
	uniform sampler2D sobolTexture;
	uint sobolPixelIndex = 0u;
	uint sobolPathIndex = 0u;
	uint sobolBounceIndex = 0u;

	uint sobolGetSeed( uint bounce, uint effect ) {

		return sobolHash(
			sobolHashCombine(
				sobolHashCombine(
					sobolHash( bounce ),
					sobolPixelIndex
				),
				effect
			)
		);

	}

	vec4 sobolGetTexturePoint( uint index ) {

		if ( index >= SOBOL_MAX_POINTS ) {

			index = index % SOBOL_MAX_POINTS;

		}

		uvec2 dim = uvec2( textureSize( sobolTexture, 0 ).xy );
		uint y = index / dim.x;
		uint x = index - y * dim.x;
		vec2 uv = vec2( x, y ) / vec2( dim );
		return texture( sobolTexture, uv );

	}

	${xo(1)}
	${xo(2)}
	${xo(3)}
	${xo(4)}

`;class fp extends ui{constructor(){super({blending:Ot,uniforms:{resolution:{value:new Te}},vertexShader:`

				varying vec2 vUv;
				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}
			`,fragmentShader:`

				${_o}
				${up}

				varying vec2 vUv;
				uniform vec2 resolution;
				void main() {

					uint index = uint( gl_FragCoord.y ) * uint( resolution.x ) + uint( gl_FragCoord.x );
					gl_FragColor = generateSobolPoint( index );

				}
			`})}}class hu{generate(e,t=256){let n=new At(t,t,{type:Ve,format:ke,minFilter:qe,magFilter:qe,generateMipmaps:!1}),i=e.getRenderTarget();e.setRenderTarget(n);let s=new un(new fp);return s.material.resolution.set(t,t),s.render(e),e.setRenderTarget(i),s.dispose(),n}}class fu extends Yt{set bokehSize(e){this.fStop=this.getFocalLength()/e}get bokehSize(){return this.getFocalLength()/this.fStop}constructor(...e){super(...e);this.fStop=1.4,this.apertureBlades=0,this.apertureRotation=0,this.focusDistance=25,this.anamorphicRatio=1}copy(e,t){return super.copy(e,t),this.fStop=e.fStop,this.apertureBlades=e.apertureBlades,this.apertureRotation=e.apertureRotation,this.focusDistance=e.focusDistance,this.anamorphicRatio=e.anamorphicRatio,this}}class du{constructor(){this.bokehSize=0,this.apertureBlades=0,this.apertureRotation=0,this.focusDistance=10,this.anamorphicRatio=1}updateFrom(e){if(e instanceof fu)this.bokehSize=e.bokehSize,this.apertureBlades=e.apertureBlades,this.apertureRotation=e.apertureRotation,this.focusDistance=e.focusDistance,this.anamorphicRatio=e.anamorphicRatio;else this.bokehSize=0,this.apertureRotation=0,this.apertureBlades=0,this.focusDistance=10,this.anamorphicRatio=1}}function vo(e){let t=new Uint16Array(e.length);for(let n=0,i=e.length;n<i;++n)t[n]=pt.toHalfFloat(e[n]);return t}function dp(e,t,n=0,i=e.length){let s=n,r=n+i-1;while(s<r){let a=s+r>>1;if(e[a]<t)s=a+1;else r=a}return s-n}function Ly(e,t,n){return 0.2126*e+0.7152*t+0.0722*n}function Fy(e,t=et){let n=e.clone();n.source=new Wi({...n.image});let{width:i,height:s,data:r}=n.image,a=r;if(n.type!==t){if(t===et)a=new Uint16Array(r.length);else a=new Float32Array(r.length);let o;if(r instanceof Int8Array||r instanceof Int16Array||r instanceof Int32Array)o=2**(8*r.BYTES_PER_ELEMENT-1)-1;else o=2**(8*r.BYTES_PER_ELEMENT)-1;for(let l=0,u=r.length;l<u;l++){let h=r[l];if(n.type===et)h=pt.fromHalfFloat(r[l]);if(n.type!==Ve&&n.type!==et)h/=o;if(t===et)a[l]=pt.toHalfFloat(h)}n.image.data=a,n.type=t}if(n.flipY){let o=a;a=a.slice();for(let l=0;l<s;l++)for(let u=0;u<i;u++){let h=s-l-1,c=4*(l*i+u),f=4*(h*i+u);a[f+0]=o[c+0],a[f+1]=o[c+1],a[f+2]=o[c+2],a[f+3]=o[c+3]}n.flipY=!1,n.image.data=a}return n}class pu{constructor(){let e=new ht(vo(new Float32Array([0,0,0,0])),1,1);e.type=et,e.format=ke,e.minFilter=Ye,e.magFilter=Ye,e.wrapS=Kt,e.wrapT=Kt,e.generateMipmaps=!1,e.needsUpdate=!0;let t=new ht(vo(new Float32Array([0,1])),1,2);t.type=et,t.format=ai,t.minFilter=Ye,t.magFilter=Ye,t.generateMipmaps=!1,t.needsUpdate=!0;let n=new ht(vo(new Float32Array([0,0,1,1])),2,2);n.type=et,n.format=ai,n.minFilter=Ye,n.magFilter=Ye,n.generateMipmaps=!1,n.needsUpdate=!0,this.map=e,this.marginalWeights=t,this.conditionalWeights=n,this.totalSum=0}getPixelWeight(e,t,n){return Ly(e,t,n)}dispose(){this.marginalWeights.dispose(),this.conditionalWeights.dispose(),this.map.dispose()}updateFrom(e){let t=Fy(e);t.wrapS=Kt,t.wrapT=Bt;let{width:n,height:i,data:s}=t.image,r=new Float32Array(n*i),a=new Float32Array(n*i),o=new Float32Array(i),l=new Float32Array(i),u=0,h=0;for(let m=0;m<i;m++){let p=0;for(let g=0;g<n;g++){let v=m*n+g,M=pt.fromHalfFloat(s[4*v+0]),y=pt.fromHalfFloat(s[4*v+1]),b=pt.fromHalfFloat(s[4*v+2]),E=this.getPixelWeight(M,y,b,m,i);p+=E,u+=E,r[v]=E,a[v]=p}if(p!==0)for(let g=m*n,v=m*n+n;g<v;g++)r[g]/=p,a[g]/=p;h+=p,o[m]=p,l[m]=h}if(h!==0)for(let m=0,p=o.length;m<p;m++)o[m]/=h,l[m]/=h;let c=new Uint16Array(i),f=new Uint16Array(n*i);for(let m=0;m<i;m++){let p=(m+1)/i,g=dp(l,p);c[m]=pt.toHalfFloat((g+0.5)/i)}for(let m=0;m<i;m++)for(let p=0;p<n;p++){let g=m*n+p,v=(p+1)/n,M=dp(a,v,m*n,n);f[g]=pt.toHalfFloat((M+0.5)/n)}this.dispose();let{marginalWeights:d,conditionalWeights:_}=this;d.image={width:i,height:1,data:c},d.needsUpdate=!0,_.image={width:n,height:i,data:f},_.needsUpdate=!0,this.totalSum=u,this.map=t,this.cdfMarginal=l,this.cdfConditional=a}}var mu=6,Ny=11,Uy=0,Oy=1,By=2,zy=3,ky=4,kn=new L,yn=new L,pp=new Pe,Ys=new On,mp=new L,Yn=new L,Hy=new L(0,1,0);class gu{constructor(){let e=new ht(new Float32Array(4),1,1);e.format=ke,e.type=Ve,e.wrapS=Bt,e.wrapT=Bt,e.generateMipmaps=!1,e.minFilter=qe,e.magFilter=qe,this.tex=e,this.count=0}updateFrom(e,t=[]){let n=this.tex,i=Math.max(e.length*mu,1),s=Math.ceil(Math.sqrt(i));if(n.image.width!==s)n.dispose(),n.image.data=new Float32Array(s*s*4),n.image.width=s,n.image.height=s;let r=n.image.data;for(let o=0,l=e.length;o<l;o++){let u=e[o],h=o*mu*4,c=0;for(let d=0;d<mu*4;d++)r[h+d]=0;u.getWorldPosition(yn),r[h+c++]=yn.x,r[h+c++]=yn.y,r[h+c++]=yn.z;let f=Uy;if(u.isRectAreaLight&&u.isCircular)f=Oy;else if(u.isSpotLight)f=By;else if(u.isDirectionalLight||u.isSunLight)f=zy;else if(u.isPointLight)f=ky;if(r[h+c++]=f,r[h+c++]=u.color.r,r[h+c++]=u.color.g,r[h+c++]=u.color.b,r[h+c++]=u.intensity,u.getWorldQuaternion(Ys),u.isRectAreaLight)kn.set(u.width,0,0).applyQuaternion(Ys),r[h+c++]=kn.x,r[h+c++]=kn.y,r[h+c++]=kn.z,c++,yn.set(0,u.height,0).applyQuaternion(Ys),r[h+c++]=yn.x,r[h+c++]=yn.y,r[h+c++]=yn.z,r[h+c++]=kn.cross(yn).length()*(u.isCircular?Math.PI/4:1);else if(u.isSpotLight){let d=u.radius||0;mp.setFromMatrixPosition(u.matrixWorld),Yn.setFromMatrixPosition(u.target.matrixWorld),pp.lookAt(mp,Yn,Hy),Ys.setFromRotationMatrix(pp),kn.set(1,0,0).applyQuaternion(Ys),r[h+c++]=kn.x,r[h+c++]=kn.y,r[h+c++]=kn.z,c++,yn.set(0,1,0).applyQuaternion(Ys),r[h+c++]=yn.x,r[h+c++]=yn.y,r[h+c++]=yn.z,r[h+c++]=Math.PI*d*d,r[h+c++]=d,r[h+c++]=u.decay,r[h+c++]=u.distance,r[h+c++]=Math.cos(u.angle),r[h+c++]=Math.cos(u.angle*(1-u.penumbra)),r[h+c++]=u.iesMap?t.indexOf(u.iesMap):-1}else if(u.isPointLight){let d=kn.setFromMatrixPosition(u.matrixWorld);r[h+c++]=d.x,r[h+c++]=d.y,r[h+c++]=d.z,c++,c+=4,c+=1,r[h+c++]=u.decay,r[h+c++]=u.distance}else if(u.isDirectionalLight){let d=kn.setFromMatrixPosition(u.matrixWorld),_=yn.setFromMatrixPosition(u.target.matrixWorld);Yn.subVectors(d,_).normalize(),r[h+c++]=Yn.x,r[h+c++]=Yn.y,r[h+c++]=Yn.z}else if(u.isSunLight)Yn.setFromMatrixPosition(u.matrixWorld).normalize(),r[h+c++]=Yn.x,r[h+c++]=Yn.y,r[h+c++]=Yn.z;r[h+Ny]=u.visibleToCameraRays?1:0}this.count=e.length;let a=qs(r.buffer);if(this.hash!==a)return this.hash=a,n.needsUpdate=!0,!0;return!1}}function gp(e,t,n,i,s){if(t>i)throw Error();let r=e.length/t,a=e.constructor.BYTES_PER_ELEMENT*8,o=1;switch(e.constructor){case Uint8Array:case Uint16Array:case Uint32Array:o=2**a-1;break;case Int8Array:case Int16Array:case Int32Array:o=2**(a-1)-1;break}for(let l=0;l<r;l++){let u=4*l,h=t*l;for(let c=0;c<i;c++)n[s+u+c]=t>=c+1?e[h+c]/o:0}}class xu extends Vi{constructor(){super();this._textures=[],this.type=Ve,this.format=ke,this.internalFormat="RGBA32F"}updateAttribute(e,t){let n=this._textures[e];n.updateFrom(t);let i=n.image,s=this.image;if(i.width!==s.width||i.height!==s.height)throw Error("FloatAttributeTextureArray: Attribute must be the same dimensions when updating single layer.");let{width:r,height:a,data:o}=s,u=r*a*4*e,h=t.itemSize;if(h===3)h=4;gp(n.image.data,h,o,4,u),this.dispose(),this.needsUpdate=!0}setAttributes(e){let t=e[0].count,n=e.length;for(let h=0,c=n;h<c;h++)if(e[h].count!==t)throw Error("FloatAttributeTextureArray: All attributes must have the same item count.");let i=this._textures;while(i.length<n){let h=new Nr;i.push(h)}while(i.length>n)i.pop();for(let h=0,c=n;h<c;h++)i[h].updateFrom(e[h]);let r=i[0].image,a=this.image;if(r.width!==a.width||r.height!==a.height||r.depth!==n)a.width=r.width,a.height=r.height,a.depth=n,a.data=new Float32Array(a.width*a.height*a.depth*4);let{data:o,width:l,height:u}=a;for(let h=0,c=n;h<c;h++){let f=i[h],_=l*u*4*h,m=e[h].itemSize;if(m===3)m=4;gp(f.image.data,m,o,4,_)}this.dispose(),this.needsUpdate=!0}}class _u extends xu{updateNormalAttribute(e){this.updateAttribute(0,e)}updateTangentAttribute(e){this.updateAttribute(1,e)}updateUvAttribute(e){this.updateAttribute(2,e)}updateColorAttribute(e){this.updateAttribute(3,e)}updateFrom(e,t,n,i){this.setAttributes([e,t,n,i])}}function vu(e,t){if(e.uuid<t.uuid)return 1;if(e.uuid>t.uuid)return-1;return 0}function yo(e){return`${e.source.uuid}:${e.colorSpace}`}function Gy(e){let t=new Set,n=[];for(let i=0,s=e.length;i<s;i++){let r=e[i],a=yo(r);if(!t.has(a))t.add(a),n.push(r)}return n}function xp(e){let t=e.map((i)=>i.iesMap||null).filter((i)=>i),n=new Set(t);return Array.from(n).sort(vu)}function _p(e){let t=new Set;for(let i=0,s=e.length;i<s;i++){let r=e[i];for(let a in r){let o=r[a];if(o&&o.isTexture)t.add(o)}}let n=Array.from(t);return Gy(n).sort(vu)}function vp(e){let t=[];return e.traverseVisible((n)=>{if(n.isRectAreaLight||n.isSpotLight||n.isPointLight||n.isDirectionalLight||n.isSunLight)t.push(n)}),t.sort(vu)}var So=47,yp=So*4;class Sp{constructor(){this._features={}}isUsed(e){return e in this._features}setUsed(e,t=!0){if(t===!1)delete this._features[e];else this._features[e]=!0}reset(){this._features={}}}class yu extends ht{constructor(){super(new Float32Array(4),1,1);this.format=ke,this.type=Ve,this.wrapS=Bt,this.wrapT=Bt,this.minFilter=qe,this.magFilter=qe,this.generateMipmaps=!1,this.features=new Sp}updateFrom(e,t){function n(d,_,m=-1){if(_ in d&&d[_]){let p=yo(d[_]);return h[p]}else return m}function i(d,_,m){return _ in d?d[_]:m}function s(d,_,m,p){let g=d[_]&&d[_].isTexture?d[_]:null;if(g){if(g.matrixAutoUpdate)g.updateMatrix();let v=g.matrix.elements,M=0;m[p+M++]=v[0],m[p+M++]=v[3],m[p+M++]=v[6],M++,m[p+M++]=v[1],m[p+M++]=v[4],m[p+M++]=v[7],M++}return 8}let r=0,a=e.length*So,o=Math.ceil(Math.sqrt(a))||1,{image:l,features:u}=this,h={};for(let d=0,_=t.length;d<_;d++)h[yo(t[d])]=d;if(l.width!==o)this.dispose(),l.data=new Float32Array(o*o*4),l.width=o,l.height=o;let c=l.data;u.reset();for(let d=0,_=e.length;d<_;d++){let m=e[d];if(m.isFogVolumeMaterial){u.setUsed("FOG");for(let v=0;v<yp;v++)c[r+v]=0;c[r+0+0]=m.color.r,c[r+0+1]=m.color.g,c[r+0+2]=m.color.b,c[r+8+3]=i(m,"emissiveIntensity",0),c[r+12+0]=m.emissive.r,c[r+12+1]=m.emissive.g,c[r+12+2]=m.emissive.b,c[r+52+1]=m.density,c[r+52+3]=0,c[r+56+2]=4,r+=yp;continue}if(c[r++]=m.color.r,c[r++]=m.color.g,c[r++]=m.color.b,c[r++]=n(m,"map"),c[r++]=i(m,"metalness",0),c[r++]=n(m,"metalnessMap"),c[r++]=i(m,"roughness",0),c[r++]=n(m,"roughnessMap"),c[r++]=i(m,"ior",1.5),c[r++]=i(m,"transmission",0),c[r++]=n(m,"transmissionMap"),c[r++]=i(m,"emissiveIntensity",0),"emissive"in m)c[r++]=m.emissive.r,c[r++]=m.emissive.g,c[r++]=m.emissive.b;else c[r++]=0,c[r++]=0,c[r++]=0;if(c[r++]=n(m,"emissiveMap"),c[r++]=n(m,"normalMap"),"normalScale"in m)c[r++]=m.normalScale.x,c[r++]=m.normalScale.y;else c[r++]=1,c[r++]=1;if(c[r++]=i(m,"clearcoat",0),c[r++]=n(m,"clearcoatMap"),c[r++]=i(m,"clearcoatRoughness",0),c[r++]=n(m,"clearcoatRoughnessMap"),c[r++]=n(m,"clearcoatNormalMap"),"clearcoatNormalScale"in m)c[r++]=m.clearcoatNormalScale.x,c[r++]=m.clearcoatNormalScale.y;else c[r++]=1,c[r++]=1;if(r++,c[r++]=i(m,"sheen",0),"sheenColor"in m)c[r++]=m.sheenColor.r,c[r++]=m.sheenColor.g,c[r++]=m.sheenColor.b;else c[r++]=0,c[r++]=0,c[r++]=0;c[r++]=n(m,"sheenColorMap"),c[r++]=i(m,"sheenRoughness",0),c[r++]=n(m,"sheenRoughnessMap"),c[r++]=n(m,"iridescenceMap"),c[r++]=n(m,"iridescenceThicknessMap"),c[r++]=i(m,"iridescence",0),c[r++]=i(m,"iridescenceIOR",1.3);let p=i(m,"iridescenceThicknessRange",[100,400]);if(c[r++]=p[0],c[r++]=p[1],"specularColor"in m)c[r++]=m.specularColor.r,c[r++]=m.specularColor.g,c[r++]=m.specularColor.b;else c[r++]=1,c[r++]=1,c[r++]=1;c[r++]=n(m,"specularColorMap"),c[r++]=i(m,"specularIntensity",1),c[r++]=n(m,"specularIntensityMap");let g=i(m,"thickness",0)===0&&i(m,"attenuationDistance",1/0)===1/0;if(c[r++]=Number(g),r++,"attenuationColor"in m)c[r++]=m.attenuationColor.r,c[r++]=m.attenuationColor.g,c[r++]=m.attenuationColor.b;else c[r++]=1,c[r++]=1,c[r++]=1;if(c[r++]=i(m,"attenuationDistance",1/0),c[r++]=n(m,"alphaMap"),c[r++]=m.opacity,c[r++]=m.alphaTest,!g&&m.transmission>0)c[r++]=0;else switch(m.side){case Tn:c[r++]=1;break;case Ut:c[r++]=-1;break;case rn:c[r++]=0;break}c[r++]=Number(i(m,"matte",!1)),c[r++]=Number(i(m,"castShadow",!0)),c[r++]=Number(m.vertexColors)|Number(m.flatShading)<<1,c[r++]=Number(m.transparent),r+=s(m,"map",c,r),r+=s(m,"metalnessMap",c,r),r+=s(m,"roughnessMap",c,r),r+=s(m,"transmissionMap",c,r),r+=s(m,"emissiveMap",c,r),r+=s(m,"normalMap",c,r),r+=s(m,"clearcoatMap",c,r),r+=s(m,"clearcoatNormalMap",c,r),r+=s(m,"clearcoatRoughnessMap",c,r),r+=s(m,"sheenColorMap",c,r),r+=s(m,"sheenRoughnessMap",c,r),r+=s(m,"iridescenceMap",c,r),r+=s(m,"iridescenceThicknessMap",c,r),r+=s(m,"specularColorMap",c,r),r+=s(m,"specularIntensityMap",c,r),r+=s(m,"alphaMap",c,r)}let f=qs(c.buffer);if(this.hash!==f)return this.hash=f,this.needsUpdate=!0,!0;return!1}}var Mp=new Ae;function Wy(e){return e?`${e.uuid}:${e.version}`:null}function Vy(e,t){for(let n in t)if(n in e)e[n]=t[n]}class Mo extends xa{constructor(e,t,n){let i={format:ke,type:an,minFilter:Ye,magFilter:Ye,wrapS:Kt,wrapT:Kt,generateMipmaps:!1,...n};super(e,t,1,i);Vy(this.texture,i),this.texture.setTextures=(...r)=>{this.setTextures(...r)},this.hashes=[null];let s=new un(new bp);this.fsQuad=s}setTextures(e,t,n=this.width,i=this.height){let s=e.getRenderTarget(),r=e.toneMapping,a=e.getClearAlpha();e.getClearColor(Mp);let o=t.length||1;if(n!==this.width||i!==this.height||this.depth!==o)this.setSize(n,i,o),this.hashes=Array(o).fill(null);e.setClearColor(0,0),e.toneMapping=En;let l=this.fsQuad,u=this.hashes,h=!1;for(let c=0,f=o;c<f;c++){let d=t[c],_=Wy(d);if(d&&(u[c]!==_||d.isWebGLRenderTarget))d.matrixAutoUpdate=!1,d.matrix.identity(),l.material.map=d,e.setRenderTarget(this,c),l.render(e),d.updateMatrix(),d.matrixAutoUpdate=!0,u[c]=_,h=!0}return l.material.map=null,e.setClearColor(Mp,a),e.setRenderTarget(s),e.toneMapping=r,h}dispose(){super.dispose(),this.fsQuad.dispose()}}class bp extends kt{get map(){return this.uniforms.map.value}set map(e){this.uniforms.map.value=e}constructor(){super({uniforms:{map:{value:null}},vertexShader:`
				varying vec2 vUv;
				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}
			`,fragmentShader:`
				uniform sampler2D map;
				varying vec2 vUv;
				void main() {

					gl_FragColor = texture2D( map, vUv );

				}
			`})}}function Xy(e,t=Math.random()){for(let n=e.length-1;n>0;n--){let i=Math.floor(t()*(n+1)),s=e[n];e[n]=e[i],e[i]=s}return e}class Su{constructor(e,t,n=Math.random){let i=e**t,s=new Uint16Array(i),r=i;for(let a=0;a<i;a++)s[a]=a;this.samples=new Float32Array(t),this.strataCount=e,this.reset=function(){for(let a=0;a<i;a++)s[a]=a;r=0},this.reshuffle=function(){r=0},this.next=function(){let{samples:a}=this;if(r>=s.length)Xy(s,n),this.reshuffle();let o=s[r++];for(let l=0;l<t;l++)a[l]=(o%e+n())/e,o=Math.floor(o/e);return a}}}class Mu{constructor(e,t,n=Math.random){let i=0;for(let o of t)i+=o;let s=new Float32Array(i),r=[],a=0;for(let o of t){let l=new Su(e,o,n);l.samples=new Float32Array(s.buffer,a,l.samples.length),a+=l.samples.length*4,r.push(l)}this.samples=s,this.strataCount=e,this.next=function(){for(let o of r)o.next();return s},this.reshuffle=function(){for(let o of r)o.reshuffle()},this.reset=function(){for(let o of r)o.reset()}}}class Tp{constructor(e=0){this.m=2147483648,this.a=1103515245,this.c=12345,this.seed=e}nextInt(){return this.seed=(this.a*this.seed+this.c)%this.m,this.seed}nextFloat(){return this.nextInt()/(this.m-1)}}class bu extends ht{constructor(e=1,t=1,n=8){super(new Float32Array(1),1,1,ke,Ve);this.minFilter=qe,this.magFilter=qe,this.strata=n,this.sampler=null,this.generator=new Tp,this.stableNoise=!1,this.random=()=>{if(this.stableNoise)return this.generator.nextFloat();else return Math.random()},this.init(e,t,n)}init(e=this.image.height,t=this.image.width,n=this.strata){let{image:i}=this;if(i.width===t&&i.height===e&&this.sampler!==null)return;let s=Array(e*t).fill(4),r=new Mu(n,s,this.random);i.width=t,i.height=e,i.data=r.samples,this.sampler=r,this.dispose(),this.next()}next(){this.sampler.next(),this.needsUpdate=!0}reset(){this.sampler.reset(),this.generator.seed=0}}function wp(e,t=Math.random){for(let n=e.length-1;n>0;n--){let i=~~((t()-0.000001)*n),s=e[n];e[n]=e[i],e[i]=s}}function Ap(e,t){e.fill(0);for(let n=0;n<t;n++)e[n]=1}class bo{constructor(e){this.count=0,this.size=-1,this.sigma=-1,this.radius=-1,this.lookupTable=null,this.score=null,this.binaryPattern=null,this.resize(e),this.setSigma(1.5)}findVoid(){let{score:e,binaryPattern:t}=this,n=1/0,i=-1;for(let s=0,r=t.length;s<r;s++){if(t[s]!==0)continue;let a=e[s];if(a<n)n=a,i=s}return i}findCluster(){let{score:e,binaryPattern:t}=this,n=-1/0,i=-1;for(let s=0,r=t.length;s<r;s++){if(t[s]!==1)continue;let a=e[s];if(a>n)n=a,i=s}return i}setSigma(e){if(e===this.sigma)return;let t=~~(Math.sqrt(20*e**2)+1),n=2*t+1,i=new Float32Array(n*n),s=e*e;for(let r=-t;r<=t;r++)for(let a=-t;a<=t;a++){let o=(t+a)*n+r+t,l=r*r+a*a;i[o]=Math.E**(-l/(2*s))}this.lookupTable=i,this.sigma=e,this.radius=t}resize(e){if(this.size!==e)this.size=e,this.score=new Float32Array(e*e),this.binaryPattern=new Uint8Array(e*e)}invert(){let{binaryPattern:e,score:t,size:n}=this;t.fill(0);for(let i=0,s=e.length;i<s;i++)if(e[i]===0){let r=~~(i/n),a=i-r*n;this.updateScore(a,r,1),e[i]=1}else e[i]=0}updateScore(e,t,n){let{size:i,score:s,lookupTable:r}=this,a=this.radius,o=2*a+1;for(let l=-a;l<=a;l++)for(let u=-a;u<=a;u++){let h=(a+u)*o+l+a,c=r[h],f=e+l;f=f<0?i+f:f%i;let d=t+u;d=d<0?i+d:d%i;let _=d*i+f;s[_]+=n*c}}addPointIndex(e){this.binaryPattern[e]=1;let t=this.size,n=~~(e/t),i=e-n*t;this.updateScore(i,n,1),this.count++}removePointIndex(e){this.binaryPattern[e]=0;let t=this.size,n=~~(e/t),i=e-n*t;this.updateScore(i,n,-1),this.count--}copy(e){this.resize(e.size),this.score.set(e.score),this.binaryPattern.set(e.binaryPattern),this.setSigma(e.sigma),this.count=e.count}}class Tu{constructor(){this.random=Math.random,this.sigma=1.5,this.size=64,this.majorityPointsRatio=0.1,this.samples=new bo(1),this.savedSamples=new bo(1)}generate(){let{samples:e,savedSamples:t,sigma:n,majorityPointsRatio:i,size:s}=this;e.resize(s),e.setSigma(n);let r=Math.floor(s*s*i),a=e.binaryPattern;Ap(a,r),wp(a,this.random);for(let h=0,c=a.length;h<c;h++)if(a[h]===1)e.addPointIndex(h);while(!0){let h=e.findCluster();e.removePointIndex(h);let c=e.findVoid();if(h===c){e.addPointIndex(h);break}e.addPointIndex(c)}let o=new Uint32Array(s*s);t.copy(e);let l;l=e.count-1;while(l>=0){let h=e.findCluster();e.removePointIndex(h),o[h]=l,l--}let u=s*s;l=t.count;while(l<u/2){let h=t.findVoid();t.addPointIndex(h),o[h]=l,l++}t.invert();while(l<u){let h=t.findCluster();t.removePointIndex(h),o[h]=l,l++}return{data:o,maxValue:u}}}function qy(e){if(e>=3)return 4;else return e}function Yy(e){switch(e){case 1:return ai;case 2:return Un;default:return ke}}class wu extends ht{constructor(e=64,t=1){super(new Float32Array(4),1,1,ke,Ve);this.minFilter=qe,this.magFilter=qe,this.size=e,this.channels=t,this.update()}update(){let e=this.channels,t=this.size,n=new Tu;n.channels=e,n.size=t;let i=qy(e),s=Yy(i);if(this.image.width!==t||s!==this.format)this.image.width=t,this.image.height=t,this.image.data=new Float32Array(t**2*i),this.format=s,this.dispose();let r=this.image.data;for(let a=0,o=e;a<o;a++){let l=n.generate(),{data:u,maxValue:h}=l;for(let c=0,f=u.length;c<f;c++){let d=u[c]/h;r[c*i+a]=d}}this.needsUpdate=!0}}var Ep=`

	struct PhysicalCamera {

		float focusDistance;
		float anamorphicRatio;
		float bokehSize;
		int apertureBlades;
		float apertureRotation;

	};

`;var Rp=`

	struct EquirectHdrInfo {

		sampler2D marginalWeights;
		sampler2D conditionalWeights;
		sampler2D map;

		float totalSum;

	};

`;var Cp=`

	#define RECT_AREA_LIGHT_TYPE 0
	#define CIRC_AREA_LIGHT_TYPE 1
	#define SPOT_LIGHT_TYPE 2
	#define DIR_LIGHT_TYPE 3
	#define POINT_LIGHT_TYPE 4

	struct LightsInfo {

		sampler2D tex;
		uint count;

	};

	struct Light {

		vec3 position;
		int type;

		vec3 color;
		float intensity;

		vec3 u;
		vec3 v;
		float area;

		// spot light fields
		float radius;
		float near;
		float decay;
		float distance;
		float coneCos;
		float penumbraCos;
		int iesProfile;

	};

	Light readLightInfo( sampler2D tex, uint index ) {

		uint i = index * 6u;

		vec4 s0 = texelFetch1D( tex, i + 0u );
		vec4 s1 = texelFetch1D( tex, i + 1u );
		vec4 s2 = texelFetch1D( tex, i + 2u );
		vec4 s3 = texelFetch1D( tex, i + 3u );

		Light l;
		l.position = s0.rgb;
		l.type = int( round( s0.a ) );

		l.color = s1.rgb;
		l.intensity = s1.a;

		l.u = s2.rgb;
		l.v = s3.rgb;
		l.area = s3.a;

		if ( l.type == SPOT_LIGHT_TYPE || l.type == POINT_LIGHT_TYPE ) {

			vec4 s4 = texelFetch1D( tex, i + 4u );
			vec4 s5 = texelFetch1D( tex, i + 5u );
			l.radius = s4.r;
			l.decay = s4.g;
			l.distance = s4.b;
			l.coneCos = s4.a;

			l.penumbraCos = s5.r;
			l.iesProfile = int( round( s5.g ) );

		} else {

			l.radius = 0.0;
			l.decay = 0.0;
			l.distance = 0.0;

			l.coneCos = 0.0;
			l.penumbraCos = 0.0;
			l.iesProfile = - 1;

		}

		return l;

	}

`;var Ip=`

	struct Material {

		vec3 color;
		int map;

		float metalness;
		int metalnessMap;

		float roughness;
		int roughnessMap;

		float ior;
		float transmission;
		int transmissionMap;

		float emissiveIntensity;
		vec3 emissive;
		int emissiveMap;

		int normalMap;
		vec2 normalScale;

		float clearcoat;
		int clearcoatMap;
		int clearcoatNormalMap;
		vec2 clearcoatNormalScale;
		float clearcoatRoughness;
		int clearcoatRoughnessMap;

		int iridescenceMap;
		int iridescenceThicknessMap;
		float iridescence;
		float iridescenceIor;
		float iridescenceThicknessMinimum;
		float iridescenceThicknessMaximum;

		vec3 specularColor;
		int specularColorMap;

		float specularIntensity;
		int specularIntensityMap;
		bool thinFilm;

		vec3 attenuationColor;
		float attenuationDistance;

		int alphaMap;

		bool castShadow;
		float opacity;
		float alphaTest;

		float side;
		bool matte;

		float sheen;
		vec3 sheenColor;
		int sheenColorMap;
		float sheenRoughness;
		int sheenRoughnessMap;

		bool vertexColors;
		bool flatShading;
		bool transparent;
		bool fogVolume;

		mat3 mapTransform;
		mat3 metalnessMapTransform;
		mat3 roughnessMapTransform;
		mat3 transmissionMapTransform;
		mat3 emissiveMapTransform;
		mat3 normalMapTransform;
		mat3 clearcoatMapTransform;
		mat3 clearcoatNormalMapTransform;
		mat3 clearcoatRoughnessMapTransform;
		mat3 sheenColorMapTransform;
		mat3 sheenRoughnessMapTransform;
		mat3 iridescenceMapTransform;
		mat3 iridescenceThicknessMapTransform;
		mat3 specularColorMapTransform;
		mat3 specularIntensityMapTransform;
		mat3 alphaMapTransform;

	};

	mat3 readTextureTransform( sampler2D tex, uint index ) {

		mat3 textureTransform;

		vec4 row1 = texelFetch1D( tex, index );
		vec4 row2 = texelFetch1D( tex, index + 1u );

		textureTransform[0] = vec3(row1.r, row2.r, 0.0);
		textureTransform[1] = vec3(row1.g, row2.g, 0.0);
		textureTransform[2] = vec3(row1.b, row2.b, 1.0);

		return textureTransform;

	}

	Material readMaterialInfo( sampler2D tex, uint index ) {

		uint i = index * uint( MATERIAL_PIXELS );

		vec4 s0 = texelFetch1D( tex, i + 0u );
		vec4 s1 = texelFetch1D( tex, i + 1u );
		vec4 s2 = texelFetch1D( tex, i + 2u );
		vec4 s3 = texelFetch1D( tex, i + 3u );
		vec4 s4 = texelFetch1D( tex, i + 4u );
		vec4 s5 = texelFetch1D( tex, i + 5u );
		vec4 s6 = texelFetch1D( tex, i + 6u );
		vec4 s7 = texelFetch1D( tex, i + 7u );
		vec4 s8 = texelFetch1D( tex, i + 8u );
		vec4 s9 = texelFetch1D( tex, i + 9u );
		vec4 s10 = texelFetch1D( tex, i + 10u );
		vec4 s11 = texelFetch1D( tex, i + 11u );
		vec4 s12 = texelFetch1D( tex, i + 12u );
		vec4 s13 = texelFetch1D( tex, i + 13u );
		vec4 s14 = texelFetch1D( tex, i + 14u );

		Material m;
		m.color = s0.rgb;
		m.map = int( round( s0.a ) );

		m.metalness = s1.r;
		m.metalnessMap = int( round( s1.g ) );
		m.roughness = s1.b;
		m.roughnessMap = int( round( s1.a ) );

		m.ior = s2.r;
		m.transmission = s2.g;
		m.transmissionMap = int( round( s2.b ) );
		m.emissiveIntensity = s2.a;

		m.emissive = s3.rgb;
		m.emissiveMap = int( round( s3.a ) );

		m.normalMap = int( round( s4.r ) );
		m.normalScale = s4.gb;

		m.clearcoat = s4.a;
		m.clearcoatMap = int( round( s5.r ) );
		m.clearcoatRoughness = s5.g;
		m.clearcoatRoughnessMap = int( round( s5.b ) );
		m.clearcoatNormalMap = int( round( s5.a ) );
		m.clearcoatNormalScale = s6.rg;

		m.sheen = s6.a;
		m.sheenColor = s7.rgb;
		m.sheenColorMap = int( round( s7.a ) );
		m.sheenRoughness = s8.r;
		m.sheenRoughnessMap = int( round( s8.g ) );

		m.iridescenceMap = int( round( s8.b ) );
		m.iridescenceThicknessMap = int( round( s8.a ) );
		m.iridescence = s9.r;
		m.iridescenceIor = s9.g;
		m.iridescenceThicknessMinimum = s9.b;
		m.iridescenceThicknessMaximum = s9.a;

		m.specularColor = s10.rgb;
		m.specularColorMap = int( round( s10.a ) );

		m.specularIntensity = s11.r;
		m.specularIntensityMap = int( round( s11.g ) );
		m.thinFilm = bool( s11.b );

		m.attenuationColor = s12.rgb;
		m.attenuationDistance = s12.a;

		m.alphaMap = int( round( s13.r ) );

		m.opacity = s13.g;
		m.alphaTest = s13.b;
		m.side = s13.a;

		m.matte = bool( s14.r );
		m.castShadow = bool( s14.g );
		m.vertexColors = bool( int( s14.b ) & 1 );
		m.flatShading = bool( int( s14.b ) & 2 );
		m.fogVolume = bool( int( s14.b ) & 4 );
		m.transparent = bool( s14.a );

		uint firstTextureTransformIdx = i + 15u;

		// mat3( 1.0 ) is an identity matrix
		m.mapTransform = m.map == - 1 ? mat3( 1.0 ) : readTextureTransform( tex, firstTextureTransformIdx );
		m.metalnessMapTransform = m.metalnessMap == - 1 ? mat3( 1.0 ) : readTextureTransform( tex, firstTextureTransformIdx + 2u );
		m.roughnessMapTransform = m.roughnessMap == - 1 ? mat3( 1.0 ) : readTextureTransform( tex, firstTextureTransformIdx + 4u );
		m.transmissionMapTransform = m.transmissionMap == - 1 ? mat3( 1.0 ) : readTextureTransform( tex, firstTextureTransformIdx + 6u );
		m.emissiveMapTransform = m.emissiveMap == - 1 ? mat3( 1.0 ) : readTextureTransform( tex, firstTextureTransformIdx + 8u );
		m.normalMapTransform = m.normalMap == - 1 ? mat3( 1.0 ) : readTextureTransform( tex, firstTextureTransformIdx + 10u );
		m.clearcoatMapTransform = m.clearcoatMap == - 1 ? mat3( 1.0 ) : readTextureTransform( tex, firstTextureTransformIdx + 12u );
		m.clearcoatNormalMapTransform = m.clearcoatNormalMap == - 1 ? mat3( 1.0 ) : readTextureTransform( tex, firstTextureTransformIdx + 14u );
		m.clearcoatRoughnessMapTransform = m.clearcoatRoughnessMap == - 1 ? mat3( 1.0 ) : readTextureTransform( tex, firstTextureTransformIdx + 16u );
		m.sheenColorMapTransform = m.sheenColorMap == - 1 ? mat3( 1.0 ) : readTextureTransform( tex, firstTextureTransformIdx + 18u );
		m.sheenRoughnessMapTransform = m.sheenRoughnessMap == - 1 ? mat3( 1.0 ) : readTextureTransform( tex, firstTextureTransformIdx + 20u );
		m.iridescenceMapTransform = m.iridescenceMap == - 1 ? mat3( 1.0 ) : readTextureTransform( tex, firstTextureTransformIdx + 22u );
		m.iridescenceThicknessMapTransform = m.iridescenceThicknessMap == - 1 ? mat3( 1.0 ) : readTextureTransform( tex, firstTextureTransformIdx + 24u );
		m.specularColorMapTransform = m.specularColorMap == - 1 ? mat3( 1.0 ) : readTextureTransform( tex, firstTextureTransformIdx + 26u );
		m.specularIntensityMapTransform = m.specularIntensityMap == - 1 ? mat3( 1.0 ) : readTextureTransform( tex, firstTextureTransformIdx + 28u );
		m.alphaMapTransform = m.alphaMap == - 1 ? mat3( 1.0 ) : readTextureTransform( tex, firstTextureTransformIdx + 30u );

		return m;

	}

`;var Pp=`

	struct SurfaceRecord {

		// surface type
		bool volumeParticle;

		// geometry
		vec3 faceNormal;
		bool frontFace;
		vec3 normal;
		mat3 normalBasis;
		mat3 normalInvBasis;

		// cached properties
		float eta;
		float f0;

		// material
		float roughness;
		float filteredRoughness;
		float metalness;
		vec3 color;
		vec3 emission;

		// transmission
		float ior;
		float transmission;
		bool thinFilm;
		vec3 attenuationColor;
		float attenuationDistance;

		// clearcoat
		vec3 clearcoatNormal;
		mat3 clearcoatBasis;
		mat3 clearcoatInvBasis;
		float clearcoat;
		float clearcoatRoughness;
		float filteredClearcoatRoughness;

		// sheen
		float sheen;
		vec3 sheenColor;
		float sheenRoughness;

		// iridescence
		float iridescence;
		float iridescenceIor;
		float iridescenceThickness;

		// specular
		vec3 specularColor;
		float specularIntensity;
	};

	struct ScatterRecord {
		float specularPdf;
		float pdf;
		vec3 direction;
		vec3 color;
	};

`;var Dp=`

	// samples the the given environment map in the given direction
	vec3 sampleEquirectColor( sampler2D envMap, vec3 direction ) {

		return texture2D( envMap, equirectDirectionToUv( direction ) ).rgb;

	}

	// gets the pdf of the given direction to sample
	float equirectDirectionPdf( vec3 direction ) {

		vec2 uv = equirectDirectionToUv( direction );
		float theta = uv.y * PI;
		float sinTheta = sin( theta );
		if ( sinTheta == 0.0 ) {

			return 0.0;

		}

		return 1.0 / ( 2.0 * PI * PI * sinTheta );

	}

	// samples the color given env map with CDF and returns the pdf of the direction
	float sampleEquirect( vec3 direction, inout vec3 color ) {

		float totalSum = envMapInfo.totalSum;
		if ( totalSum == 0.0 ) {

			color = vec3( 0.0 );
			return 1.0;

		}

		vec2 uv = equirectDirectionToUv( direction );
		color = texture2D( envMapInfo.map, uv ).rgb;

		float lum = luminance( color );
		ivec2 resolution = textureSize( envMapInfo.map, 0 );
		float pdf = lum / totalSum;

		return float( resolution.x * resolution.y ) * pdf * equirectDirectionPdf( direction );

	}

	// samples a direction of the envmap with color and retrieves pdf
	float sampleEquirectProbability( vec2 r, inout vec3 color, inout vec3 direction ) {

		// sample env map cdf
		float v = texture2D( envMapInfo.marginalWeights, vec2( r.x, 0.0 ) ).x;
		float u = texture2D( envMapInfo.conditionalWeights, vec2( r.y, v ) ).x;
		vec2 uv = vec2( u, v );

		vec3 derivedDirection = equirectUvToDirection( uv );
		direction = derivedDirection;
		color = texture2D( envMapInfo.map, uv ).rgb;

		float totalSum = envMapInfo.totalSum;
		float lum = luminance( color );
		ivec2 resolution = textureSize( envMapInfo.map, 0 );
		float pdf = lum / totalSum;

		return float( resolution.x * resolution.y ) * pdf * equirectDirectionPdf( direction );

	}
`;var Lp=`

	float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {

		return smoothstep( coneCosine, penumbraCosine, angleCosine );

	}

	float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {

		// based upon Frostbite 3 Moving to Physically-based Rendering
		// page 32, equation 26: E[window1]
		// https://seblagarde.files.wordpress.com/2015/07/course_notes_moving_frostbite_to_pbr_v32.pdf
		float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), EPSILON );

		if ( cutoffDistance > 0.0 ) {

			distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );

		}

		return distanceFalloff;

	}

	float getPhotometricAttenuation( sampler2DArray iesProfiles, int iesProfile, vec3 posToLight, vec3 lightDir, vec3 u, vec3 v ) {

		float cosTheta = dot( posToLight, lightDir );
		float angle = acos( cosTheta ) / PI;

		return texture2D( iesProfiles, vec3( angle, 0.0, iesProfile ) ).r;

	}

	struct LightRecord {

		float dist;
		vec3 direction;
		float pdf;
		vec3 emission;
		int type;

	};

	bool intersectLightAtIndex( sampler2D lights, vec3 rayOrigin, vec3 rayDirection, uint l, inout LightRecord lightRec ) {

		bool didHit = false;
		Light light = readLightInfo( lights, l );

		vec3 u = light.u;
		vec3 v = light.v;

		// check for backface
		vec3 normal = normalize( cross( u, v ) );
		if ( dot( normal, rayDirection ) > 0.0 ) {

			u *= 1.0 / dot( u, u );
			v *= 1.0 / dot( v, v );

			float dist;

			// MIS / light intersection is not supported for punctual lights.
			if(
				( light.type == RECT_AREA_LIGHT_TYPE && intersectsRectangle( light.position, normal, u, v, rayOrigin, rayDirection, dist ) ) ||
				( light.type == CIRC_AREA_LIGHT_TYPE && intersectsCircle( light.position, normal, u, v, rayOrigin, rayDirection, dist ) )
			) {

				float cosTheta = dot( rayDirection, normal );
				didHit = true;
				lightRec.dist = dist;
				lightRec.pdf = ( dist * dist ) / ( light.area * cosTheta );
				lightRec.emission = light.color * light.intensity;
				lightRec.direction = rayDirection;
				lightRec.type = light.type;

			}

		}

		return didHit;

	}

	LightRecord randomAreaLightSample( Light light, vec3 rayOrigin, vec2 ruv ) {

		vec3 randomPos;
		if( light.type == RECT_AREA_LIGHT_TYPE ) {

			// rectangular area light
			randomPos = light.position + light.u * ( ruv.x - 0.5 ) + light.v * ( ruv.y - 0.5 );

		} else if( light.type == CIRC_AREA_LIGHT_TYPE ) {

			// circular area light
			float r = 0.5 * sqrt( ruv.x );
			float theta = ruv.y * 2.0 * PI;
			float x = r * cos( theta );
			float y = r * sin( theta );

			randomPos = light.position + light.u * x + light.v * y;

		}

		vec3 toLight = randomPos - rayOrigin;
		float lightDistSq = dot( toLight, toLight );
		float dist = sqrt( lightDistSq );
		vec3 direction = toLight / dist;
		vec3 lightNormal = normalize( cross( light.u, light.v ) );

		LightRecord lightRec;
		lightRec.type = light.type;
		lightRec.emission = light.color * light.intensity;
		lightRec.dist = dist;
		lightRec.direction = direction;

		// TODO: the denominator is potentially zero
		lightRec.pdf = lightDistSq / ( light.area * dot( direction, lightNormal ) );

		return lightRec;

	}

	LightRecord randomSpotLightSample( Light light, sampler2DArray iesProfiles, vec3 rayOrigin, vec2 ruv ) {

		float radius = light.radius * sqrt( ruv.x );
		float theta = ruv.y * 2.0 * PI;
		float x = radius * cos( theta );
		float y = radius * sin( theta );

		vec3 u = light.u;
		vec3 v = light.v;
		vec3 normal = normalize( cross( u, v ) );

		float angle = acos( light.coneCos );
		float angleTan = tan( angle );
		float startDistance = light.radius / max( angleTan, EPSILON );

		vec3 randomPos = light.position - normal * startDistance + u * x + v * y;
		vec3 toLight = randomPos - rayOrigin;
		float lightDistSq = dot( toLight, toLight );
		float dist = sqrt( lightDistSq );

		vec3 direction = toLight / max( dist, EPSILON );
		float cosTheta = dot( direction, normal );

		float spotAttenuation = light.iesProfile != - 1 ?
			getPhotometricAttenuation( iesProfiles, light.iesProfile, direction, normal, u, v ) :
			getSpotAttenuation( light.coneCos, light.penumbraCos, cosTheta );

		float distanceAttenuation = getDistanceAttenuation( dist, light.distance, light.decay );
		LightRecord lightRec;
		lightRec.type = light.type;
		lightRec.dist = dist;
		lightRec.direction = direction;
		lightRec.emission = light.color * light.intensity * distanceAttenuation * spotAttenuation;
		lightRec.pdf = 1.0;

		return lightRec;

	}

	LightRecord randomLightSample( sampler2D lights, sampler2DArray iesProfiles, uint lightCount, vec3 rayOrigin, vec3 ruv ) {

		LightRecord result;

		// pick a random light
		uint l = uint( ruv.x * float( lightCount ) );
		Light light = readLightInfo( lights, l );

		if ( light.type == SPOT_LIGHT_TYPE ) {

			result = randomSpotLightSample( light, iesProfiles, rayOrigin, ruv.yz );

		} else if ( light.type == POINT_LIGHT_TYPE ) {

			vec3 lightRay = light.u - rayOrigin;
			float lightDist = length( lightRay );
			float cutoffDistance = light.distance;
			float distanceFalloff = 1.0 / max( pow( lightDist, light.decay ), 0.01 );
			if ( cutoffDistance > 0.0 ) {

				distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDist / cutoffDistance ) ) );

			}

			LightRecord rec;
			rec.direction = normalize( lightRay );
			rec.dist = length( lightRay );
			rec.pdf = 1.0;
			rec.emission = light.color * light.intensity * distanceFalloff;
			rec.type = light.type;
			result = rec;

		} else if ( light.type == DIR_LIGHT_TYPE ) {

			LightRecord rec;
			rec.dist = 1e10;
			rec.direction = light.u;
			rec.pdf = 1.0;
			rec.emission = light.color * light.intensity;
			rec.type = light.type;

			result = rec;

		} else {

			// sample the light
			result = randomAreaLightSample( light, rayOrigin, ruv.yz );

		}

		return result;

	}

`;var Fp=`

	vec3 sampleHemisphere( vec3 n, vec2 uv ) {

		// https://www.rorydriscoll.com/2009/01/07/better-sampling/
		// https://graphics.pixar.com/library/OrthonormalB/paper.pdf
		float sign = n.z == 0.0 ? 1.0 : sign( n.z );
		float a = - 1.0 / ( sign + n.z );
		float b = n.x * n.y * a;
		vec3 b1 = vec3( 1.0 + sign * n.x * n.x * a, sign * b, - sign * n.x );
		vec3 b2 = vec3( b, sign + n.y * n.y * a, - n.y );

		float r = sqrt( uv.x );
		float theta = 2.0 * PI * uv.y;
		float x = r * cos( theta );
		float y = r * sin( theta );
		return x * b1 + y * b2 + sqrt( 1.0 - uv.x ) * n;

	}

	vec2 sampleTriangle( vec2 a, vec2 b, vec2 c, vec2 r ) {

		// get the edges of the triangle and the diagonal across the
		// center of the parallelogram
		vec2 e1 = a - b;
		vec2 e2 = c - b;
		vec2 diag = normalize( e1 + e2 );

		// pick the point in the parallelogram
		if ( r.x + r.y > 1.0 ) {

			r = vec2( 1.0 ) - r;

		}

		return e1 * r.x + e2 * r.y;

	}

	vec2 sampleCircle( vec2 uv ) {

		float angle = 2.0 * PI * uv.x;
		float radius = sqrt( uv.y );
		return vec2( cos( angle ), sin( angle ) ) * radius;

	}

	vec3 sampleSphere( vec2 uv ) {

		float u = ( uv.x - 0.5 ) * 2.0;
		float t = uv.y * PI * 2.0;
		float f = sqrt( 1.0 - u * u );

		return vec3( f * cos( t ), f * sin( t ), u );

	}

	vec2 sampleRegularPolygon( int sides, vec3 uvw ) {

		sides = max( sides, 3 );

		vec3 r = uvw;
		float anglePerSegment = 2.0 * PI / float( sides );
		float segment = floor( float( sides ) * r.x );

		float angle1 = anglePerSegment * segment;
		float angle2 = angle1 + anglePerSegment;
		vec2 a = vec2( sin( angle1 ), cos( angle1 ) );
		vec2 b = vec2( 0.0, 0.0 );
		vec2 c = vec2( sin( angle2 ), cos( angle2 ) );

		return sampleTriangle( a, b, c, r.yz );

	}

	// samples an aperture shape with the given number of sides. 0 means circle
	vec2 sampleAperture( int blades, vec3 uvw ) {

		return blades == 0 ?
			sampleCircle( uvw.xy ) :
			sampleRegularPolygon( blades, uvw );

	}


`;var Np=`

	bool totalInternalReflection( float cosTheta, float eta ) {

		float sinTheta = sqrt( 1.0 - cosTheta * cosTheta );
		return eta * sinTheta > 1.0;

	}

	// https://google.github.io/filament/Filament.md.html#materialsystem/diffusebrdf
	float schlickFresnel( float cosine, float f0 ) {

		return f0 + ( 1.0 - f0 ) * pow( 1.0 - cosine, 5.0 );

	}

	vec3 schlickFresnel( float cosine, vec3 f0 ) {

		return f0 + ( 1.0 - f0 ) * pow( 1.0 - cosine, 5.0 );

	}

	vec3 schlickFresnel( float cosine, vec3 f0, vec3 f90 ) {

		return f0 + ( f90 - f0 ) * pow( 1.0 - cosine, 5.0 );

	}

	float dielectricFresnel( float cosThetaI, float eta ) {

		// https://schuttejoe.github.io/post/disneybsdf/
		float ni = eta;
		float nt = 1.0;

		// Check for total internal reflection
		float sinThetaISq = 1.0f - cosThetaI * cosThetaI;
		float sinThetaTSq = eta * eta * sinThetaISq;
		if( sinThetaTSq >= 1.0 ) {

			return 1.0;

		}

		float sinThetaT = sqrt( sinThetaTSq );

		float cosThetaT = sqrt( max( 0.0, 1.0f - sinThetaT * sinThetaT ) );
		float rParallel = ( ( nt * cosThetaI ) - ( ni * cosThetaT ) ) / ( ( nt * cosThetaI ) + ( ni * cosThetaT ) );
		float rPerpendicular = ( ( ni * cosThetaI ) - ( nt * cosThetaT ) ) / ( ( ni * cosThetaI ) + ( nt * cosThetaT ) );
		return ( rParallel * rParallel + rPerpendicular * rPerpendicular ) / 2.0;

	}

	// https://raytracing.github.io/books/RayTracingInOneWeekend.html#dielectrics/schlickapproximation
	float iorRatioToF0( float eta ) {

		return pow( ( 1.0 - eta ) / ( 1.0 + eta ), 2.0 );

	}

	vec3 evaluateFresnel( float cosTheta, float eta, vec3 f0, vec3 f90 ) {

		if ( totalInternalReflection( cosTheta, eta ) ) {

			return f90;

		}

		return schlickFresnel( cosTheta, f0, f90 );

	}

	// TODO: disney fresnel was removed and replaced with this fresnel function to better align with
	// the glTF but is causing blown out pixels. Should be revisited
	// float evaluateFresnelWeight( float cosTheta, float eta, float f0 ) {

	// 	if ( totalInternalReflection( cosTheta, eta ) ) {

	// 		return 1.0;

	// 	}

	// 	return schlickFresnel( cosTheta, f0 );

	// }

	// https://schuttejoe.github.io/post/disneybsdf/
	float disneyFresnel( vec3 wo, vec3 wi, vec3 wh, float f0, float eta, float metalness ) {

		float dotHV = dot( wo, wh );
		if ( totalInternalReflection( dotHV, eta ) ) {

			return 1.0;

		}

		float dotHL = dot( wi, wh );
		float dielectricFresnel = dielectricFresnel( abs( dotHV ), eta );
		float metallicFresnel = schlickFresnel( dotHL, f0 );

		return mix( dielectricFresnel, metallicFresnel, metalness );

	}

`;var Up=`

	// Fast arccos approximation used to remove banding artifacts caused by numerical errors in acos.
	// This is a cubic Lagrange interpolating polynomial for x = [-1, -1/2, 0, 1/2, 1].
	// For more information see: https://github.com/gkjohnson/three-gpu-pathtracer/pull/171#issuecomment-1152275248
	float acosApprox( float x ) {

		x = clamp( x, -1.0, 1.0 );
		return ( - 0.69813170079773212 * x * x - 0.87266462599716477 ) * x + 1.5707963267948966;

	}

	// An acos with input values bound to the range [-1, 1].
	float acosSafe( float x ) {

		return acos( clamp( x, -1.0, 1.0 ) );

	}

	float saturateCos( float val ) {

		return clamp( val, 0.001, 1.0 );

	}

	float square( float t ) {

		return t * t;

	}

	vec2 square( vec2 t ) {

		return t * t;

	}

	vec3 square( vec3 t ) {

		return t * t;

	}

	vec4 square( vec4 t ) {

		return t * t;

	}

	vec2 rotateVector( vec2 v, float t ) {

		float ac = cos( t );
		float as = sin( t );
		return vec2(
			v.x * ac - v.y * as,
			v.x * as + v.y * ac
		);

	}

	// forms a basis with the normal vector as Z
	mat3 getBasisFromNormal( vec3 normal ) {

		vec3 other;
		if ( abs( normal.x ) > 0.5 ) {

			other = vec3( 0.0, 1.0, 0.0 );

		} else {

			other = vec3( 1.0, 0.0, 0.0 );

		}

		vec3 ortho = normalize( cross( normal, other ) );
		vec3 ortho2 = normalize( cross( normal, ortho ) );
		return mat3( ortho2, ortho, normal );

	}

`;var Op=`

	// Finds the point where the ray intersects the plane defined by u and v and checks if this point
	// falls in the bounds of the rectangle on that same plane.
	// Plane intersection: https://lousodrome.net/blog/light/2020/07/03/intersection-of-a-ray-and-a-plane/
	bool intersectsRectangle( vec3 center, vec3 normal, vec3 u, vec3 v, vec3 rayOrigin, vec3 rayDirection, inout float dist ) {

		float t = dot( center - rayOrigin, normal ) / dot( rayDirection, normal );

		if ( t > EPSILON ) {

			vec3 p = rayOrigin + rayDirection * t;
			vec3 vi = p - center;

			// check if p falls inside the rectangle
			float a1 = dot( u, vi );
			if ( abs( a1 ) <= 0.5 ) {

				float a2 = dot( v, vi );
				if ( abs( a2 ) <= 0.5 ) {

					dist = t;
					return true;

				}

			}

		}

		return false;

	}

	// Finds the point where the ray intersects the plane defined by u and v and checks if this point
	// falls in the bounds of the circle on that same plane. See above URL for a description of the plane intersection algorithm.
	bool intersectsCircle( vec3 position, vec3 normal, vec3 u, vec3 v, vec3 rayOrigin, vec3 rayDirection, inout float dist ) {

		float t = dot( position - rayOrigin, normal ) / dot( rayDirection, normal );

		if ( t > EPSILON ) {

			vec3 hit = rayOrigin + rayDirection * t;
			vec3 vi = hit - position;

			float a1 = dot( u, vi );
			float a2 = dot( v, vi );

			if( length( vec2( a1, a2 ) ) <= 0.5 ) {

				dist = t;
				return true;

			}

		}

		return false;

	}

`;var Bp=`

	// add texel fetch functions for texture arrays
	vec4 texelFetch1D( sampler2DArray tex, int layer, uint index ) {

		uint width = uint( textureSize( tex, 0 ).x );
		uvec2 uv;
		uv.x = index % width;
		uv.y = index / width;

		return texelFetch( tex, ivec3( uv, layer ), 0 );

	}

	vec4 textureSampleBarycoord( sampler2DArray tex, int layer, vec3 barycoord, uvec3 faceIndices ) {

		return
			barycoord.x * texelFetch1D( tex, layer, faceIndices.x ) +
			barycoord.y * texelFetch1D( tex, layer, faceIndices.y ) +
			barycoord.z * texelFetch1D( tex, layer, faceIndices.z );

	}

`;var To=`

	// TODO: possibly this should be renamed something related to material or path tracing logic

	#ifndef RAY_OFFSET
	#define RAY_OFFSET 1e-4
	#endif

	// adjust the hit point by the surface normal by a factor of some offset and the
	// maximum component-wise value of the current point to accommodate floating point
	// error as values increase.
	vec3 stepRayOrigin( vec3 rayOrigin, vec3 rayDirection, vec3 offset, float dist ) {

		vec3 point = rayOrigin + rayDirection * dist;
		vec3 absPoint = abs( point );
		float maxPoint = max( absPoint.x, max( absPoint.y, absPoint.z ) );
		return point + offset * ( maxPoint + 1.0 ) * RAY_OFFSET;

	}

	// https://github.com/KhronosGroup/glTF/blob/main/extensions/2.0/Khronos/KHR_materials_volume/README.md#attenuation
	vec3 transmissionAttenuation( float dist, vec3 attColor, float attDist ) {

		vec3 ot = - log( attColor ) / attDist;
		return exp( - ot * dist );

	}

	vec3 getHalfVector( vec3 wi, vec3 wo, float eta ) {

		// get the half vector - assuming if the light incident vector is on the other side
		// of the that it's transmissive.
		vec3 h;
		if ( wi.z > 0.0 ) {

			h = normalize( wi + wo );

		} else {

			// Scale by the ior ratio to retrieve the appropriate half vector
			// From Section 2.2 on computing the transmission half vector:
			// https://blog.selfshadow.com/publications/s2015-shading-course/burley/s2015_pbs_disney_bsdf_notes.pdf
			h = normalize( wi + wo * eta );

		}

		h *= sign( h.z );
		return h;

	}

	vec3 getHalfVector( vec3 a, vec3 b ) {

		return normalize( a + b );

	}

	// The discrepancy between interpolated surface normal and geometry normal can cause issues when a ray
	// is cast that is on the top side of the geometry normal plane but below the surface normal plane. If
	// we find a ray like that we ignore it to avoid artifacts.
	// This function returns if the direction is on the same side of both planes.
	bool isDirectionValid( vec3 direction, vec3 surfaceNormal, vec3 geometryNormal ) {

		bool aboveSurfaceNormal = dot( direction, surfaceNormal ) > 0.0;
		bool aboveGeometryNormal = dot( direction, geometryNormal ) > 0.0;
		return aboveSurfaceNormal == aboveGeometryNormal;

	}

	// ray sampling x and z are swapped to align with expected background view
	vec2 equirectDirectionToUv( vec3 direction ) {

		// from Spherical.setFromCartesianCoords
		vec2 uv = vec2( atan( direction.z, direction.x ), acos( direction.y ) );
		uv /= vec2( 2.0 * PI, PI );

		// apply adjustments to get values in range [0, 1] and y right side up
		uv.x += 0.5;
		uv.y = 1.0 - uv.y;
		return uv;

	}

	vec3 equirectUvToDirection( vec2 uv ) {

		// undo above adjustments
		uv.x -= 0.5;
		uv.y = 1.0 - uv.y;

		// from Vector3.setFromSphericalCoords
		float theta = uv.x * 2.0 * PI;
		float phi = uv.y * PI;

		float sinPhi = sin( phi );

		return vec3( sinPhi * cos( theta ), cos( phi ), sinPhi * sin( theta ) );

	}

	// power heuristic for multiple importance sampling
	float misHeuristic( float a, float b ) {

		float aa = a * a;
		float bb = b * b;
		return aa / ( aa + bb );

	}

	// tentFilter from Peter Shirley's 'Realistic Ray Tracing (2nd Edition)' book, pg. 60
	// erichlof/THREE.js-PathTracing-Renderer/
	float tentFilter( float x ) {

		return x < 0.5 ? sqrt( 2.0 * x ) - 1.0 : 1.0 - sqrt( 2.0 - ( 2.0 * x ) );

	}
`;var Au=`

	// https://www.shadertoy.com/view/wltcRS
	uvec4 WHITE_NOISE_SEED;

	void rng_initialize( vec2 p, int frame ) {

		// white noise seed
		WHITE_NOISE_SEED = uvec4( p, uint( frame ), uint( p.x ) + uint( p.y ) );

	}

	// https://www.pcg-random.org/
	void pcg4d( inout uvec4 v ) {

		v = v * 1664525u + 1013904223u;
		v.x += v.y * v.w;
		v.y += v.z * v.x;
		v.z += v.x * v.y;
		v.w += v.y * v.z;
		v = v ^ ( v >> 16u );
		v.x += v.y*v.w;
		v.y += v.z*v.x;
		v.z += v.x*v.y;
		v.w += v.y*v.z;

	}

	// returns [ 0, 1 ]
	float pcgRand() {

		pcg4d( WHITE_NOISE_SEED );
		return float( WHITE_NOISE_SEED.x ) / float( 0xffffffffu );

	}

	vec2 pcgRand2() {

		pcg4d( WHITE_NOISE_SEED );
		return vec2( WHITE_NOISE_SEED.xy ) / float(0xffffffffu);

	}

	vec3 pcgRand3() {

		pcg4d( WHITE_NOISE_SEED );
		return vec3( WHITE_NOISE_SEED.xyz ) / float( 0xffffffffu );

	}

	vec4 pcgRand4() {

		pcg4d( WHITE_NOISE_SEED );
		return vec4( WHITE_NOISE_SEED ) / float( 0xffffffffu );

	}
`;var zp=`

	uniform sampler2D stratifiedTexture;
	uniform sampler2D stratifiedOffsetTexture;

	uint sobolPixelIndex = 0u;
	uint sobolPathIndex = 0u;
	uint sobolBounceIndex = 0u;
	vec4 pixelSeed = vec4( 0 );

	vec4 rand4( int v ) {

		ivec2 uv = ivec2( v, sobolBounceIndex );
		vec4 stratifiedSample = texelFetch( stratifiedTexture, uv, 0 );
		return fract( stratifiedSample + pixelSeed.r ); // blue noise + stratified samples

	}

	vec3 rand3( int v ) {

		return rand4( v ).xyz;

	}

	vec2 rand2( int v ) {

		return rand4( v ).xy;

	}

	float rand( int v ) {

		return rand4( v ).x;

	}

	void rng_initialize( vec2 screenCoord, int frame ) {

		// tile the small noise texture across the entire screen
		ivec2 noiseSize = ivec2( textureSize( stratifiedOffsetTexture, 0 ) );
		ivec2 pixel = ivec2( screenCoord.xy ) % noiseSize;
		vec2 pixelWidth = 1.0 / vec2( noiseSize );
		vec2 uv = vec2( pixel ) * pixelWidth + pixelWidth * 0.5;

		// note that using "texelFetch" here seems to break Android for some reason
		pixelSeed = texture( stratifiedOffsetTexture, uv );

	}

`;var kp=`

	// diffuse
	float diffuseEval( vec3 wo, vec3 wi, vec3 wh, SurfaceRecord surf, inout vec3 color ) {

		// https://schuttejoe.github.io/post/disneybsdf/
		float fl = schlickFresnel( wi.z, 0.0 );
		float fv = schlickFresnel( wo.z, 0.0 );

		float metalFactor = ( 1.0 - surf.metalness );
		float transFactor = ( 1.0 - surf.transmission );
		float rr = 0.5 + 2.0 * surf.roughness * fl * fl;
		float retro = rr * ( fl + fv + fl * fv * ( rr - 1.0f ) );
		float lambert = ( 1.0f - 0.5f * fl ) * ( 1.0f - 0.5f * fv );

		// TODO: subsurface approx?

		// float F = evaluateFresnelWeight( dot( wo, wh ), surf.eta, surf.f0 );
		float F = disneyFresnel( wo, wi, wh, surf.f0, surf.eta, surf.metalness );
		color = ( 1.0 - F ) * transFactor * metalFactor * wi.z * surf.color * ( retro + lambert ) / PI;

		return wi.z / PI;

	}

	vec3 diffuseDirection( vec3 wo, SurfaceRecord surf ) {

		vec3 lightDirection = sampleSphere( rand2( 11 ) );
		lightDirection.z += 1.0;
		lightDirection = normalize( lightDirection );

		return lightDirection;

	}

	// specular
	float specularEval( vec3 wo, vec3 wi, vec3 wh, SurfaceRecord surf, inout vec3 color ) {

		// if roughness is set to 0 then D === NaN which results in black pixels
		float metalness = surf.metalness;
		float roughness = surf.filteredRoughness;

		float eta = surf.eta;
		float f0 = surf.f0;

		vec3 f0Color = mix( f0 * surf.specularColor * surf.specularIntensity, surf.color, surf.metalness );
		vec3 f90Color = vec3( mix( surf.specularIntensity, 1.0, surf.metalness ) );
		vec3 F = evaluateFresnel( dot( wo, wh ), eta, f0Color, f90Color );

		vec3 iridescenceF = evalIridescence( 1.0, surf.iridescenceIor, dot( wi, wh ), surf.iridescenceThickness, f0Color );
		F = mix( F, iridescenceF,  surf.iridescence );

		// PDF
		// See 14.1.1 Microfacet BxDFs in https://www.pbr-book.org/
		float incidentTheta = acos( wo.z );
		float G = ggxShadowMaskG2( wi, wo, roughness );
		float D = ggxDistribution( wh, roughness );
		float G1 = ggxShadowMaskG1( incidentTheta, roughness );
		float ggxPdf = D * G1 * max( 0.0, abs( dot( wo, wh ) ) ) / abs ( wo.z );

		color = wi.z * F * G * D / ( 4.0 * abs( wi.z * wo.z ) );
		return ggxPdf / ( 4.0 * dot( wo, wh ) );

	}

	vec3 specularDirection( vec3 wo, SurfaceRecord surf ) {

		// sample ggx vndf distribution which gives a new normal
		float roughness = surf.filteredRoughness;
		vec3 halfVector = ggxDirection(
			wo,
			vec2( roughness ),
			rand2( 12 )
		);

		// apply to new ray by reflecting off the new normal
		return - reflect( wo, halfVector );

	}


	// transmission
	/*
	float transmissionEval( vec3 wo, vec3 wi, vec3 wh, SurfaceRecord surf, inout vec3 color ) {

		// See section 4.2 in https://www.cs.cornell.edu/~srm/publications/EGSR07-btdf.pdf

		float filteredRoughness = surf.filteredRoughness;
		float eta = surf.eta;
		bool frontFace = surf.frontFace;
		bool thinFilm = surf.thinFilm;

		color = surf.transmission * surf.color;

		float denom = pow( eta * dot( wi, wh ) + dot( wo, wh ), 2.0 );
		return ggxPDF( wo, wh, filteredRoughness ) / denom;

	}

	vec3 transmissionDirection( vec3 wo, SurfaceRecord surf ) {

		float filteredRoughness = surf.filteredRoughness;
		float eta = surf.eta;
		bool frontFace = surf.frontFace;

		// sample ggx vndf distribution which gives a new normal
		vec3 halfVector = ggxDirection(
			wo,
			vec2( filteredRoughness ),
			rand2( 13 )
		);

		vec3 lightDirection = refract( normalize( - wo ), halfVector, eta );
		if ( surf.thinFilm ) {

			lightDirection = - refract( normalize( - lightDirection ), - vec3( 0.0, 0.0, 1.0 ), 1.0 / eta );

		}

		return normalize( lightDirection );

	}
	*/

	// TODO: This is just using a basic cosine-weighted specular distribution with an
	// incorrect PDF value at the moment. Update it to correctly use a GGX distribution
	float transmissionEval( vec3 wo, vec3 wi, vec3 wh, SurfaceRecord surf, inout vec3 color ) {

		color = surf.transmission * surf.color;

		// PDF
		// float F = evaluateFresnelWeight( dot( wo, wh ), surf.eta, surf.f0 );
		// float F = disneyFresnel( wo, wi, wh, surf.f0, surf.eta, surf.metalness );
		// if ( F >= 1.0 ) {

		// 	return 0.0;

		// }

		// return 1.0 / ( 1.0 - F );

		// reverted to previous to transmission. The above was causing black pixels
		float eta = surf.eta;
		float f0 = surf.f0;
		float cosTheta = min( wo.z, 1.0 );
		float sinTheta = sqrt( 1.0 - cosTheta * cosTheta );
		float reflectance = schlickFresnel( cosTheta, f0 );
		bool cannotRefract = eta * sinTheta > 1.0;
		if ( cannotRefract ) {

			return 0.0;

		}

		return 1.0 / ( 1.0 - reflectance );

	}

	vec3 transmissionDirection( vec3 wo, SurfaceRecord surf ) {

		float roughness = surf.filteredRoughness;
		float eta = surf.eta;
		vec3 halfVector = normalize( vec3( 0.0, 0.0, 1.0 ) + sampleSphere( rand2( 13 ) ) * roughness );
		vec3 lightDirection = refract( normalize( - wo ), halfVector, eta );

		if ( surf.thinFilm ) {

			lightDirection = - refract( normalize( - lightDirection ), - vec3( 0.0, 0.0, 1.0 ), 1.0 / eta );

		}
		return normalize( lightDirection );

	}

	// clearcoat
	float clearcoatEval( vec3 wo, vec3 wi, vec3 wh, SurfaceRecord surf, inout vec3 color ) {

		float ior = 1.5;
		float f0 = iorRatioToF0( ior );
		bool frontFace = surf.frontFace;
		float roughness = surf.filteredClearcoatRoughness;

		float eta = frontFace ? 1.0 / ior : ior;
		float G = ggxShadowMaskG2( wi, wo, roughness );
		float D = ggxDistribution( wh, roughness );
		float F = schlickFresnel( dot( wi, wh ), f0 );

		float fClearcoat = F * D * G / ( 4.0 * abs( wi.z * wo.z ) );
		color = color * ( 1.0 - surf.clearcoat * F ) + fClearcoat * surf.clearcoat * wi.z;

		// PDF
		// See equation (27) in http://jcgt.org/published/0003/02/03/
		return ggxPDF( wo, wh, roughness ) / ( 4.0 * dot( wi, wh ) );

	}

	vec3 clearcoatDirection( vec3 wo, SurfaceRecord surf ) {

		// sample ggx vndf distribution which gives a new normal
		float roughness = surf.filteredClearcoatRoughness;
		vec3 halfVector = ggxDirection(
			wo,
			vec2( roughness ),
			rand2( 14 )
		);

		// apply to new ray by reflecting off the new normal
		return - reflect( wo, halfVector );

	}

	// sheen
	vec3 sheenColor( vec3 wo, vec3 wi, vec3 wh, SurfaceRecord surf ) {

		float cosThetaO = saturateCos( wo.z );
		float cosThetaI = saturateCos( wi.z );
		float cosThetaH = wh.z;

		float D = velvetD( cosThetaH, surf.sheenRoughness );
		float G = velvetG( cosThetaO, cosThetaI, surf.sheenRoughness );

		// See equation (1) in http://www.aconty.com/pdf/s2017_pbs_imageworks_sheen.pdf
		vec3 color = surf.sheenColor;
		color *= D * G / ( 4.0 * abs( cosThetaO * cosThetaI ) );

		return color;

	}

	// bsdf
	void getLobeWeights(
		vec3 wo, vec3 wi, vec3 wh, vec3 clearcoatWo, SurfaceRecord surf,
		inout float diffuseWeight, inout float specularWeight, inout float transmissionWeight, inout float clearcoatWeight
	) {

		float metalness = surf.metalness;
		float transmission = surf.transmission;
		// float fEstimate = evaluateFresnelWeight( dot( wo, wh ), surf.eta, surf.f0 );
		float fEstimate = disneyFresnel( wo, wi, wh, surf.f0, surf.eta, surf.metalness );

		float transSpecularProb = mix( max( 0.25, fEstimate ), 1.0, metalness );
		float diffSpecularProb = 0.5 + 0.5 * metalness;

		diffuseWeight = ( 1.0 - transmission ) * ( 1.0 - diffSpecularProb );
		specularWeight = transmission * transSpecularProb + ( 1.0 - transmission ) * diffSpecularProb;
		transmissionWeight = transmission * ( 1.0 - transSpecularProb );
		clearcoatWeight = surf.clearcoat * schlickFresnel( clearcoatWo.z, 0.04 );

		float totalWeight = diffuseWeight + specularWeight + transmissionWeight + clearcoatWeight;
		diffuseWeight /= totalWeight;
		specularWeight /= totalWeight;
		transmissionWeight /= totalWeight;
		clearcoatWeight /= totalWeight;
	}

	float bsdfEval(
		vec3 wo, vec3 clearcoatWo, vec3 wi, vec3 clearcoatWi, SurfaceRecord surf,
		float diffuseWeight, float specularWeight, float transmissionWeight, float clearcoatWeight, inout float specularPdf, inout vec3 color
	) {

		float metalness = surf.metalness;
		float transmission = surf.transmission;

		float spdf = 0.0;
		float dpdf = 0.0;
		float tpdf = 0.0;
		float cpdf = 0.0;
		color = vec3( 0.0 );

		vec3 halfVector = getHalfVector( wi, wo, surf.eta );

		// diffuse
		if ( diffuseWeight > 0.0 && wi.z > 0.0 ) {

			dpdf = diffuseEval( wo, wi, halfVector, surf, color );
			color *= 1.0 - surf.transmission;

		}

		// ggx specular
		if ( specularWeight > 0.0 && wi.z > 0.0 ) {

			vec3 outColor;
			spdf = specularEval( wo, wi, getHalfVector( wi, wo ), surf, outColor );
			color += outColor;

		}

		// transmission
		if ( transmissionWeight > 0.0 && wi.z < 0.0 ) {

			tpdf = transmissionEval( wo, wi, halfVector, surf, color );

		}

		// sheen
		color *= mix( 1.0, sheenAlbedoScaling( wo, wi, surf ), surf.sheen );
		color += sheenColor( wo, wi, halfVector, surf ) * surf.sheen;

		// clearcoat
		if ( clearcoatWi.z >= 0.0 && clearcoatWeight > 0.0 ) {

			vec3 clearcoatHalfVector = getHalfVector( clearcoatWo, clearcoatWi );
			cpdf = clearcoatEval( clearcoatWo, clearcoatWi, clearcoatHalfVector, surf, color );

		}

		float pdf =
			dpdf * diffuseWeight
			+ spdf * specularWeight
			+ tpdf * transmissionWeight
			+ cpdf * clearcoatWeight;

		// retrieve specular rays for the shadows flag
		specularPdf = spdf * specularWeight + cpdf * clearcoatWeight;

		return pdf;

	}

	float bsdfResult( vec3 worldWo, vec3 worldWi, SurfaceRecord surf, inout vec3 color ) {

		if ( surf.volumeParticle ) {

			color = surf.color / ( 4.0 * PI );
			return 1.0 / ( 4.0 * PI );

		}

		vec3 wo = normalize( surf.normalInvBasis * worldWo );
		vec3 wi = normalize( surf.normalInvBasis * worldWi );

		vec3 clearcoatWo = normalize( surf.clearcoatInvBasis * worldWo );
		vec3 clearcoatWi = normalize( surf.clearcoatInvBasis * worldWi );

		vec3 wh = getHalfVector( wo, wi, surf.eta );
		float diffuseWeight;
		float specularWeight;
		float transmissionWeight;
		float clearcoatWeight;
		getLobeWeights( wo, wi, wh, clearcoatWo, surf, diffuseWeight, specularWeight, transmissionWeight, clearcoatWeight );

		float specularPdf;
		return bsdfEval( wo, clearcoatWo, wi, clearcoatWi, surf, diffuseWeight, specularWeight, transmissionWeight, clearcoatWeight, specularPdf, color );

	}

	ScatterRecord bsdfSample( vec3 worldWo, SurfaceRecord surf ) {

		if ( surf.volumeParticle ) {

			ScatterRecord sampleRec;
			sampleRec.specularPdf = 0.0;
			sampleRec.pdf = 1.0 / ( 4.0 * PI );
			sampleRec.direction = sampleSphere( rand2( 16 ) );
			sampleRec.color = surf.color / ( 4.0 * PI );
			return sampleRec;

		}

		vec3 wo = normalize( surf.normalInvBasis * worldWo );
		vec3 clearcoatWo = normalize( surf.clearcoatInvBasis * worldWo );
		mat3 normalBasis = surf.normalBasis;
		mat3 invBasis = surf.normalInvBasis;
		mat3 clearcoatNormalBasis = surf.clearcoatBasis;
		mat3 clearcoatInvBasis = surf.clearcoatInvBasis;

		float diffuseWeight;
		float specularWeight;
		float transmissionWeight;
		float clearcoatWeight;
		// using normal and basically-reflected ray since we don't have proper half vector here
		getLobeWeights( wo, wo, vec3( 0, 0, 1 ), clearcoatWo, surf, diffuseWeight, specularWeight, transmissionWeight, clearcoatWeight );

		float pdf[4];
		pdf[0] = diffuseWeight;
		pdf[1] = specularWeight;
		pdf[2] = transmissionWeight;
		pdf[3] = clearcoatWeight;

		float cdf[4];
		cdf[0] = pdf[0];
		cdf[1] = pdf[1] + cdf[0];
		cdf[2] = pdf[2] + cdf[1];
		cdf[3] = pdf[3] + cdf[2];

		if( cdf[3] != 0.0 ) {

			float invMaxCdf = 1.0 / cdf[3];
			cdf[0] *= invMaxCdf;
			cdf[1] *= invMaxCdf;
			cdf[2] *= invMaxCdf;
			cdf[3] *= invMaxCdf;

		} else {

			cdf[0] = 1.0;
			cdf[1] = 0.0;
			cdf[2] = 0.0;
			cdf[3] = 0.0;

		}

		vec3 wi;
		vec3 clearcoatWi;

		float r = rand( 15 );
		if ( r <= cdf[0] ) { // diffuse

			wi = diffuseDirection( wo, surf );
			clearcoatWi = normalize( clearcoatInvBasis * normalize( normalBasis * wi ) );

		} else if ( r <= cdf[1] ) { // specular

			wi = specularDirection( wo, surf );
			clearcoatWi = normalize( clearcoatInvBasis * normalize( normalBasis * wi ) );

		} else if ( r <= cdf[2] ) { // transmission / refraction

			wi = transmissionDirection( wo, surf );
			clearcoatWi = normalize( clearcoatInvBasis * normalize( normalBasis * wi ) );

		} else if ( r <= cdf[3] ) { // clearcoat

			clearcoatWi = clearcoatDirection( clearcoatWo, surf );
			wi = normalize( invBasis * normalize( clearcoatNormalBasis * clearcoatWi ) );

		}

		ScatterRecord result;
		result.pdf = bsdfEval( wo, clearcoatWo, wi, clearcoatWi, surf, diffuseWeight, specularWeight, transmissionWeight, clearcoatWeight, result.specularPdf, result.color );
		result.direction = normalize( surf.normalBasis * wi );

		return result;

	}

`;var Hp=`

	// returns the hit distance given the material density
	float intersectFogVolume( Material material, float u ) {

		// https://raytracing.github.io/books/RayTracingTheNextWeek.html#volumes/constantdensitymediums
		return material.opacity == 0.0 ? INFINITY : ( - 1.0 / material.opacity ) * log( u );

	}

	ScatterRecord sampleFogVolume( SurfaceRecord surf, vec2 uv ) {

		ScatterRecord sampleRec;
		sampleRec.specularPdf = 0.0;
		sampleRec.pdf = 1.0 / ( 2.0 * PI );
		sampleRec.direction = sampleSphere( uv );
		sampleRec.color = surf.color;
		return sampleRec;

	}

`;var Gp=`

	// The GGX functions provide sampling and distribution information for normals as output so
	// in order to get probability of scatter direction the half vector must be computed and provided.
	// [0] https://www.cs.cornell.edu/~srm/publications/EGSR07-btdf.pdf
	// [1] https://hal.archives-ouvertes.fr/hal-01509746/document
	// [2] http://jcgt.org/published/0007/04/01/
	// [4] http://jcgt.org/published/0003/02/03/

	// trowbridge-reitz === GGX === GTR

	vec3 ggxDirection( vec3 incidentDir, vec2 roughness, vec2 uv ) {

		// TODO: try GGXVNDF implementation from reference [2], here. Needs to update ggxDistribution
		// function below, as well

		// Implementation from reference [1]
		// stretch view
		vec3 V = normalize( vec3( roughness * incidentDir.xy, incidentDir.z ) );

		// orthonormal basis
		vec3 T1 = ( V.z < 0.9999 ) ? normalize( cross( V, vec3( 0.0, 0.0, 1.0 ) ) ) : vec3( 1.0, 0.0, 0.0 );
		vec3 T2 = cross( T1, V );

		// sample point with polar coordinates (r, phi)
		float a = 1.0 / ( 1.0 + V.z );
		float r = sqrt( uv.x );
		float phi = ( uv.y < a ) ? uv.y / a * PI : PI + ( uv.y - a ) / ( 1.0 - a ) * PI;
		float P1 = r * cos( phi );
		float P2 = r * sin( phi ) * ( ( uv.y < a ) ? 1.0 : V.z );

		// compute normal
		vec3 N = P1 * T1 + P2 * T2 + V * sqrt( max( 0.0, 1.0 - P1 * P1 - P2 * P2 ) );

		// unstretch
		N = normalize( vec3( roughness * N.xy, max( 0.0, N.z ) ) );

		return N;

	}

	// Below are PDF and related functions for use in a Monte Carlo path tracer
	// as specified in Appendix B of the following paper
	// See equation (34) from reference [0]
	float ggxLamda( float theta, float roughness ) {

		float tanTheta = tan( theta );
		float tanTheta2 = tanTheta * tanTheta;
		float alpha2 = roughness * roughness;

		float numerator = - 1.0 + sqrt( 1.0 + alpha2 * tanTheta2 );
		return numerator / 2.0;

	}

	// See equation (34) from reference [0]
	float ggxShadowMaskG1( float theta, float roughness ) {

		return 1.0 / ( 1.0 + ggxLamda( theta, roughness ) );

	}

	// See equation (125) from reference [4]
	float ggxShadowMaskG2( vec3 wi, vec3 wo, float roughness ) {

		float incidentTheta = acos( wi.z );
		float scatterTheta = acos( wo.z );
		return 1.0 / ( 1.0 + ggxLamda( incidentTheta, roughness ) + ggxLamda( scatterTheta, roughness ) );

	}

	// See equation (33) from reference [0]
	float ggxDistribution( vec3 halfVector, float roughness ) {

		float a2 = roughness * roughness;
		a2 = max( EPSILON, a2 );
		float cosTheta = halfVector.z;
		float cosTheta4 = pow( cosTheta, 4.0 );

		if ( cosTheta == 0.0 ) return 0.0;

		float theta = acosSafe( halfVector.z );
		float tanTheta = tan( theta );
		float tanTheta2 = pow( tanTheta, 2.0 );

		float denom = PI * cosTheta4 * pow( a2 + tanTheta2, 2.0 );
		return ( a2 / denom );

	}

	// See equation (3) from reference [2]
	float ggxPDF( vec3 wi, vec3 halfVector, float roughness ) {

		float incidentTheta = acos( wi.z );
		float D = ggxDistribution( halfVector, roughness );
		float G1 = ggxShadowMaskG1( incidentTheta, roughness );

		return D * G1 * max( 0.0, dot( wi, halfVector ) ) / wi.z;

	}

`;var Wp=`

	// XYZ to sRGB color space
	const mat3 XYZ_TO_REC709 = mat3(
		3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);

	vec3 fresnel0ToIor( vec3 fresnel0 ) {

		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );

	}

	// Conversion FO/IOR
	vec3 iorToFresnel0( vec3 transmittedIor, float incidentIor ) {

		return square( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );

	}

	// ior is a value between 1.0 and 3.0. 1.0 is air interface
	float iorToFresnel0( float transmittedIor, float incidentIor ) {

		return square( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ) );

	}

	// Fresnel equations for dielectric/dielectric interfaces. See https://belcour.github.io/blog/research/2017/05/01/brdf-thin-film.html
	vec3 evalSensitivity( float OPD, vec3 shift ) {

		float phase = 2.0 * PI * OPD * 1.0e-9;

		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );

		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - square( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * square( phase ) );
		xyz /= 1.0685e-7;

		vec3 srgb = XYZ_TO_REC709 * xyz;
		return srgb;

	}

	// See Section 4. Analytic Spectral Integration, A Practical Extension to Microfacet Theory for the Modeling of Varying Iridescence, https://hal.archives-ouvertes.fr/hal-01518344/document
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {

		vec3 I;

		// Force iridescenceIor -> outsideIOR when thinFilmThickness -> 0.0
		float iridescenceIor = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );

		// Evaluate the cosTheta on the base layer (Snell law)
		float sinTheta2Sq = square( outsideIOR / iridescenceIor ) * ( 1.0 - square( cosTheta1 ) );

		// Handle TIR:
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {

			return vec3( 1.0 );

		}

		float cosTheta2 = sqrt( cosTheta2Sq );

		// First interface
		float R0 = iorToFresnel0( iridescenceIor, outsideIOR );
		float R12 = schlickFresnel( cosTheta1, R0 );
		float R21 = R12;
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIor < outsideIOR ) {

			phi12 = PI;

		}

		float phi21 = PI - phi12;

		// Second interface
		vec3 baseIOR = fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) ); // guard against 1.0
		vec3 R1 = iorToFresnel0( baseIOR, iridescenceIor );
		vec3 R23 = schlickFresnel( cosTheta2, R1 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[0] < iridescenceIor ) {

			phi23[ 0 ] = PI;

		}

		if ( baseIOR[1] < iridescenceIor ) {

			phi23[ 1 ] = PI;

		}

		if ( baseIOR[2] < iridescenceIor ) {

			phi23[ 2 ] = PI;

		}

		// Phase shift
		float OPD = 2.0 * iridescenceIor * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;

		// Compound terms
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = square( T121 ) * R23 / ( vec3( 1.0 ) - R123 );

		// Reflectance term for m = 0 (DC term amplitude)
		vec3 C0 = R12 + Rs;
		I = C0;

		// Reflectance term for m > 0 (pairs of diracs)
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {

			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;

		}

		// Since out of gamut colors might be produced, negative color values are clamped to 0.
		return max( I, vec3( 0.0 ) );

	}

`;var Vp=`

	// See equation (2) in http://www.aconty.com/pdf/s2017_pbs_imageworks_sheen.pdf
	float velvetD( float cosThetaH, float roughness ) {

		float alpha = max( roughness, 0.07 );
		alpha = alpha * alpha;

		float invAlpha = 1.0 / alpha;

		float sqrCosThetaH = cosThetaH * cosThetaH;
		float sinThetaH = max( 1.0 - sqrCosThetaH, 0.001 );

		return ( 2.0 + invAlpha ) * pow( sinThetaH, 0.5 * invAlpha ) / ( 2.0 * PI );

	}

	float velvetParamsInterpolate( int i, float oneMinusAlphaSquared ) {

		const float p0[5] = float[5]( 25.3245, 3.32435, 0.16801, -1.27393, -4.85967 );
		const float p1[5] = float[5]( 21.5473, 3.82987, 0.19823, -1.97760, -4.32054 );

		return mix( p1[i], p0[i], oneMinusAlphaSquared );

	}

	float velvetL( float x, float alpha ) {

		float oneMinusAlpha = 1.0 - alpha;
		float oneMinusAlphaSquared = oneMinusAlpha * oneMinusAlpha;

		float a = velvetParamsInterpolate( 0, oneMinusAlphaSquared );
		float b = velvetParamsInterpolate( 1, oneMinusAlphaSquared );
		float c = velvetParamsInterpolate( 2, oneMinusAlphaSquared );
		float d = velvetParamsInterpolate( 3, oneMinusAlphaSquared );
		float e = velvetParamsInterpolate( 4, oneMinusAlphaSquared );

		return a / ( 1.0 + b * pow( abs( x ), c ) ) + d * x + e;

	}

	// See equation (3) in http://www.aconty.com/pdf/s2017_pbs_imageworks_sheen.pdf
	float velvetLambda( float cosTheta, float alpha ) {

		return abs( cosTheta ) < 0.5 ? exp( velvetL( cosTheta, alpha ) ) : exp( 2.0 * velvetL( 0.5, alpha ) - velvetL( 1.0 - cosTheta, alpha ) );

	}

	// See Section 3, Shadowing Term, in http://www.aconty.com/pdf/s2017_pbs_imageworks_sheen.pdf
	float velvetG( float cosThetaO, float cosThetaI, float roughness ) {

		float alpha = max( roughness, 0.07 );
		alpha = alpha * alpha;

		return 1.0 / ( 1.0 + velvetLambda( cosThetaO, alpha ) + velvetLambda( cosThetaI, alpha ) );

	}

	float directionalAlbedoSheen( float cosTheta, float alpha ) {

		cosTheta = saturate( cosTheta );

		float c = 1.0 - cosTheta;
		float c3 = c * c * c;

		return 0.65584461 * c3 + 1.0 / ( 4.16526551 + exp( -7.97291361 * sqrt( alpha ) + 6.33516894 ) );

	}

	float sheenAlbedoScaling( vec3 wo, vec3 wi, SurfaceRecord surf ) {

		float alpha = max( surf.sheenRoughness, 0.07 );
		alpha = alpha * alpha;

		float maxSheenColor = max( max( surf.sheenColor.r, surf.sheenColor.g ), surf.sheenColor.b );

		float eWo = directionalAlbedoSheen( saturateCos( wo.z ), alpha );
		float eWi = directionalAlbedoSheen( saturateCos( wi.z ), alpha );

		return min( 1.0 - maxSheenColor * eWo, 1.0 - maxSheenColor * eWi );

	}

	// See Section 5, Layering, in http://www.aconty.com/pdf/s2017_pbs_imageworks_sheen.pdf
	float sheenAlbedoScaling( vec3 wo, SurfaceRecord surf ) {

		float alpha = max( surf.sheenRoughness, 0.07 );
		alpha = alpha * alpha;

		float maxSheenColor = max( max( surf.sheenColor.r, surf.sheenColor.g ), surf.sheenColor.b );

		float eWo = directionalAlbedoSheen( saturateCos( wo.z ), alpha );

		return 1.0 - maxSheenColor * eWo;

	}

`;var Xp=`

#ifndef FOG_CHECK_ITERATIONS
#define FOG_CHECK_ITERATIONS 30
#endif

// returns whether the given material is a fog material or not
bool isMaterialFogVolume( sampler2D materials, uint materialIndex ) {

	uint i = materialIndex * uint( MATERIAL_PIXELS );
	vec4 s14 = texelFetch1D( materials, i + 14u );
	return bool( int( s14.b ) & 4 );

}

// returns true if we're within the first fog volume we hit
bool bvhIntersectFogVolumeHit(
	vec3 rayOrigin, vec3 rayDirection,
	usampler2D materialIndexAttribute, sampler2D materials,
	inout Material material
) {

	material.fogVolume = false;

	for ( int i = 0; i < FOG_CHECK_ITERATIONS; i ++ ) {

		// find nearest hit
		uvec4 faceIndices = uvec4( 0u );
		vec3 faceNormal = vec3( 0.0, 0.0, 1.0 );
		vec3 barycoord = vec3( 0.0 );
		float side = 1.0;
		float dist = 0.0;
		bool hit = bvhIntersectFirstHit( bvh, rayOrigin, rayDirection, faceIndices, faceNormal, barycoord, side, dist );
		if ( hit ) {

			// if it's a fog volume return whether we hit the front or back face
			uint materialIndex = uTexelFetch1D( materialIndexAttribute, faceIndices.x ).r;
			if ( isMaterialFogVolume( materials, materialIndex ) ) {

				material = readMaterialInfo( materials, materialIndex );
				return side == - 1.0;

			} else {

				// move the ray forward
				rayOrigin = stepRayOrigin( rayOrigin, rayDirection, - faceNormal, dist );

			}

		} else {

			return false;

		}

	}

	return false;

}

`;var qp=`

	// step through multiple surface hits and accumulate color attenuation based on transmissive surfaces
	// returns true if a solid surface was hit
	bool attenuateHit(
		RenderState state,
		Ray ray, float rayDist,
		out vec3 color
	) {

		// store the original bounce index so we can reset it after
		uint originalBounceIndex = sobolBounceIndex;

		int traversals = state.traversals;
		int transmissiveTraversals = state.transmissiveTraversals;
		bool isShadowRay = state.isShadowRay;
		Material fogMaterial = state.fogMaterial;

		vec3 startPoint = ray.origin;

		// hit results
		SurfaceHit surfaceHit;

		color = vec3( 1.0 );

		bool result = true;
		for ( int i = 0; i < traversals; i ++ ) {

			sobolBounceIndex ++;

			int hitType = traceScene( ray, fogMaterial, surfaceHit );

			if ( hitType == FOG_HIT ) {

				result = true;
				break;

			} else if ( hitType == SURFACE_HIT ) {

				float totalDist = distance( startPoint, ray.origin + ray.direction * surfaceHit.dist );
				if ( totalDist > rayDist ) {

					result = false;
					break;

				}

				// TODO: attenuate the contribution based on the PDF of the resulting ray including refraction values
				// Should be able to work using the material BSDF functions which will take into account specularity, etc.
				// TODO: should we account for emissive surfaces here?

				uint materialIndex = uTexelFetch1D( materialIndexAttribute, surfaceHit.faceIndices.x ).r;
				Material material = readMaterialInfo( materials, materialIndex );

				// adjust the ray to the new surface
				bool isEntering = surfaceHit.side == 1.0;
				ray.origin = stepRayOrigin( ray.origin, ray.direction, - surfaceHit.faceNormal, surfaceHit.dist );

				#if FEATURE_FOG

				if ( material.fogVolume ) {

					fogMaterial = material;
					fogMaterial.fogVolume = surfaceHit.side == 1.0;
					i -= sign( transmissiveTraversals );
					transmissiveTraversals --;
					continue;

				}

				#endif

				if ( ! material.castShadow && isShadowRay ) {

					continue;

				}

				vec2 uv = textureSampleBarycoord( attributesArray, ATTR_UV, surfaceHit.barycoord, surfaceHit.faceIndices.xyz ).xy;
				vec4 vertexColor = textureSampleBarycoord( attributesArray, ATTR_COLOR, surfaceHit.barycoord, surfaceHit.faceIndices.xyz );

				// albedo
				vec4 albedo = vec4( material.color, material.opacity );
				if ( material.map != - 1 ) {

					vec3 uvPrime = material.mapTransform * vec3( uv, 1 );
					albedo *= texture2D( textures, vec3( uvPrime.xy, material.map ) );

				}

				if ( material.vertexColors ) {

					albedo *= vertexColor;

				}

				// alphaMap
				if ( material.alphaMap != - 1 ) {

					vec3 uvPrime = material.alphaMapTransform * vec3( uv, 1 );
					albedo.a *= texture2D( textures, vec3( uvPrime.xy, material.alphaMap ) ).x;

				}

				// transmission
				float transmission = material.transmission;
				if ( material.transmissionMap != - 1 ) {

					vec3 uvPrime = material.transmissionMapTransform * vec3( uv, 1 );
					transmission *= texture2D( textures, vec3( uvPrime.xy, material.transmissionMap ) ).r;

				}

				// metalness
				float metalness = material.metalness;
				if ( material.metalnessMap != - 1 ) {

					vec3 uvPrime = material.metalnessMapTransform * vec3( uv, 1 );
					metalness *= texture2D( textures, vec3( uvPrime.xy, material.metalnessMap ) ).b;

				}

				float alphaTest = material.alphaTest;
				bool useAlphaTest = alphaTest != 0.0;
				float transmissionFactor = ( 1.0 - metalness ) * transmission;
				if (
					transmissionFactor < rand( 9 ) && ! (
						// material sidedness
						material.side != 0.0 && surfaceHit.side == material.side

						// alpha test
						|| useAlphaTest && albedo.a < alphaTest

						// opacity
						|| material.transparent && ! useAlphaTest && albedo.a < rand( 10 )
					)
				) {

					result = true;
					break;

				}

				if ( surfaceHit.side == 1.0 && isEntering ) {

					// only attenuate by surface color on the way in
					color *= mix( vec3( 1.0 ), albedo.rgb, transmissionFactor );

				} else if ( surfaceHit.side == - 1.0 ) {

					// attenuate by medium once we hit the opposite side of the model
					color *= transmissionAttenuation( surfaceHit.dist, material.attenuationColor, material.attenuationDistance );

				}

				bool isTransmissiveRay = dot( ray.direction, surfaceHit.faceNormal * surfaceHit.side ) < 0.0;
				if ( ( isTransmissiveRay || isEntering ) && transmissiveTraversals > 0 ) {

					i -= sign( transmissiveTraversals );
					transmissiveTraversals --;

				}

			} else {

				result = false;
				break;

			}

		}

		// reset the bounce index
		sobolBounceIndex = originalBounceIndex;
		return result;

	}

`;var Yp=`

	vec3 ndcToRayOrigin( vec2 coord ) {

		vec4 rayOrigin4 = cameraWorldMatrix * invProjectionMatrix * vec4( coord, - 1.0, 1.0 );
		return rayOrigin4.xyz / rayOrigin4.w;
	}

	Ray getCameraRay() {

		vec2 ssd = vec2( 1.0 ) / resolution;

		// Jitter the camera ray by finding a uv coordinate at a random sample
		// around this pixel's UV coordinate for AA
		vec2 ruv = rand2( 0 );
		vec2 jitteredUv = vUv + vec2( tentFilter( ruv.x ) * ssd.x, tentFilter( ruv.y ) * ssd.y );
		Ray ray;

		#if CAMERA_TYPE == 2

			// Equirectangular projection
			vec4 rayDirection4 = vec4( equirectUvToDirection( jitteredUv ), 0.0 );
			vec4 rayOrigin4 = vec4( 0.0, 0.0, 0.0, 1.0 );

			rayDirection4 = cameraWorldMatrix * rayDirection4;
			rayOrigin4 = cameraWorldMatrix * rayOrigin4;

			ray.direction = normalize( rayDirection4.xyz );
			ray.origin = rayOrigin4.xyz / rayOrigin4.w;

		#else

			// get [- 1, 1] normalized device coordinates
			vec2 ndc = 2.0 * jitteredUv - vec2( 1.0 );
			ray.origin = ndcToRayOrigin( ndc );

			#if CAMERA_TYPE == 1

				// Orthographic projection
				ray.direction = ( cameraWorldMatrix * vec4( 0.0, 0.0, - 1.0, 0.0 ) ).xyz;
				ray.direction = normalize( ray.direction );

			#else

				// Perspective projection
				ray.direction = normalize( mat3( cameraWorldMatrix ) * ( invProjectionMatrix * vec4( ndc, 0.0, 1.0 ) ).xyz );

			#endif

		#endif

		#if FEATURE_DOF
		{

			// depth of field
			vec3 focalPoint = ray.origin + normalize( ray.direction ) * physicalCamera.focusDistance;

			// get the aperture sample
			// if blades === 0 then we assume a circle
			vec3 shapeUVW= rand3( 1 );
			int blades = physicalCamera.apertureBlades;
			float anamorphicRatio = physicalCamera.anamorphicRatio;
			vec2 apertureSample = sampleAperture( blades, shapeUVW );
			apertureSample *= physicalCamera.bokehSize * 0.5 * 1e-3;

			// rotate the aperture shape
			apertureSample =
				rotateVector( apertureSample, physicalCamera.apertureRotation ) *
				saturate( vec2( anamorphicRatio, 1.0 / anamorphicRatio ) );

			// create the new ray
			ray.origin += ( cameraWorldMatrix * vec4( apertureSample, 0.0, 0.0 ) ).xyz;
			ray.direction = focalPoint - ray.origin;

		}
		#endif

		ray.direction = normalize( ray.direction );

		return ray;

	}

`;var Zp=`

	vec3 directLightContribution( vec3 worldWo, SurfaceRecord surf, RenderState state, vec3 rayOrigin ) {

		vec3 result = vec3( 0.0 );

		// uniformly pick a light or environment map
		if( lightsDenom != 0.0 && rand( 5 ) < float( lights.count ) / lightsDenom ) {

			// sample a light or environment
			LightRecord lightRec = randomLightSample( lights.tex, iesProfiles, lights.count, rayOrigin, rand3( 6 ) );

			bool isSampleBelowSurface = ! surf.volumeParticle && dot( surf.faceNormal, lightRec.direction ) < 0.0;
			if ( isSampleBelowSurface ) {

				lightRec.pdf = 0.0;

			}

			// check if a ray could even reach the light area
			Ray lightRay;
			lightRay.origin = rayOrigin;
			lightRay.direction = lightRec.direction;
			vec3 attenuatedColor;
			if (
				lightRec.pdf > 0.0 &&
				isDirectionValid( lightRec.direction, surf.normal, surf.faceNormal ) &&
				! attenuateHit( state, lightRay, lightRec.dist, attenuatedColor )
			) {

				// get the material pdf
				vec3 sampleColor;
				float lightMaterialPdf = bsdfResult( worldWo, lightRec.direction, surf, sampleColor );
				bool isValidSampleColor = all( greaterThanEqual( sampleColor, vec3( 0.0 ) ) );
				if ( lightMaterialPdf > 0.0 && isValidSampleColor ) {

					// weight the direct light contribution
					float lightPdf = lightRec.pdf / lightsDenom;
					float misWeight = lightRec.type == SPOT_LIGHT_TYPE || lightRec.type == DIR_LIGHT_TYPE || lightRec.type == POINT_LIGHT_TYPE ? 1.0 : misHeuristic( lightPdf, lightMaterialPdf );
					result = attenuatedColor * lightRec.emission * state.throughputColor * sampleColor * misWeight / lightPdf;

				}

			}

		} else if ( envMapInfo.totalSum != 0.0 && environmentIntensity != 0.0 ) {

			// find a sample in the environment map to include in the contribution
			vec3 envColor, envDirection;
			float envPdf = sampleEquirectProbability( rand2( 7 ), envColor, envDirection );
			envDirection = invEnvRotation3x3 * envDirection;

			// this env sampling is not set up for transmissive sampling and yields overly bright
			// results so we ignore the sample in this case.
			// TODO: this should be improved but how? The env samples could traverse a few layers?
			bool isSampleBelowSurface = ! surf.volumeParticle && dot( surf.faceNormal, envDirection ) < 0.0;
			if ( isSampleBelowSurface ) {

				envPdf = 0.0;

			}

			// check if a ray could even reach the surface
			Ray envRay;
			envRay.origin = rayOrigin;
			envRay.direction = envDirection;
			vec3 attenuatedColor;
			if (
				envPdf > 0.0 &&
				isDirectionValid( envDirection, surf.normal, surf.faceNormal ) &&
				! attenuateHit( state, envRay, INFINITY, attenuatedColor )
			) {

				// get the material pdf
				vec3 sampleColor;
				float envMaterialPdf = bsdfResult( worldWo, envDirection, surf, sampleColor );
				bool isValidSampleColor = all( greaterThanEqual( sampleColor, vec3( 0.0 ) ) );
				if ( envMaterialPdf > 0.0 && isValidSampleColor ) {

					// weight the direct light contribution
					envPdf /= lightsDenom;
					float misWeight = misHeuristic( envPdf, envMaterialPdf );
					result = attenuatedColor * environmentIntensity * envColor * state.throughputColor * sampleColor * misWeight / envPdf;

				}

			}

		}

		// Function changed to have a single return statement to potentially help with crashes on Mac OS.
		// See issue #470
		return result;

	}

`;var $p=`

	#define SKIP_SURFACE 0
	#define HIT_SURFACE 1
	int getSurfaceRecord(
		Material material, SurfaceHit surfaceHit, sampler2DArray attributesArray,
		float accumulatedRoughness,
		inout SurfaceRecord surf
	) {

		if ( material.fogVolume ) {

			vec3 normal = vec3( 0, 0, 1 );

			SurfaceRecord fogSurface;
			fogSurface.volumeParticle = true;
			fogSurface.color = material.color;
			fogSurface.emission = material.emissiveIntensity * material.emissive;
			fogSurface.normal = normal;
			fogSurface.faceNormal = normal;
			fogSurface.clearcoatNormal = normal;

			surf = fogSurface;
			return HIT_SURFACE;

		}

		// uv coord for textures
		vec2 uv = textureSampleBarycoord( attributesArray, ATTR_UV, surfaceHit.barycoord, surfaceHit.faceIndices.xyz ).xy;
		vec4 vertexColor = textureSampleBarycoord( attributesArray, ATTR_COLOR, surfaceHit.barycoord, surfaceHit.faceIndices.xyz );

		// albedo
		vec4 albedo = vec4( material.color, material.opacity );
		if ( material.map != - 1 ) {

			vec3 uvPrime = material.mapTransform * vec3( uv, 1 );
			albedo *= texture2D( textures, vec3( uvPrime.xy, material.map ) );

		}

		if ( material.vertexColors ) {

			albedo *= vertexColor;

		}

		// alphaMap
		if ( material.alphaMap != - 1 ) {

			vec3 uvPrime = material.alphaMapTransform * vec3( uv, 1 );
			albedo.a *= texture2D( textures, vec3( uvPrime.xy, material.alphaMap ) ).x;

		}

		// possibly skip this sample if it's transparent, alpha test is enabled, or we hit the wrong material side
		// and it's single sided.
		// - alpha test is disabled when it === 0
		// - the material sidedness test is complicated because we want light to pass through the back side but still
		// be able to see the front side. This boolean checks if the side we hit is the front side on the first ray
		// and we're rendering the other then we skip it. Do the opposite on subsequent bounces to get incoming light.
		float alphaTest = material.alphaTest;
		bool useAlphaTest = alphaTest != 0.0;
		if (
			// material sidedness
			material.side != 0.0 && surfaceHit.side != material.side

			// alpha test
			|| useAlphaTest && albedo.a < alphaTest

			// opacity
			|| material.transparent && ! useAlphaTest && albedo.a < rand( 3 )
		) {

			return SKIP_SURFACE;

		}

		// fetch the interpolated smooth normal
		vec3 normal = normalize( textureSampleBarycoord(
			attributesArray,
			ATTR_NORMAL,
			surfaceHit.barycoord,
			surfaceHit.faceIndices.xyz
		).xyz );

		// roughness
		float roughness = material.roughness;
		if ( material.roughnessMap != - 1 ) {

			vec3 uvPrime = material.roughnessMapTransform * vec3( uv, 1 );
			roughness *= texture2D( textures, vec3( uvPrime.xy, material.roughnessMap ) ).g;

		}

		// metalness
		float metalness = material.metalness;
		if ( material.metalnessMap != - 1 ) {

			vec3 uvPrime = material.metalnessMapTransform * vec3( uv, 1 );
			metalness *= texture2D( textures, vec3( uvPrime.xy, material.metalnessMap ) ).b;

		}

		// emission
		vec3 emission = material.emissiveIntensity * material.emissive;
		if ( material.emissiveMap != - 1 ) {

			vec3 uvPrime = material.emissiveMapTransform * vec3( uv, 1 );
			emission *= texture2D( textures, vec3( uvPrime.xy, material.emissiveMap ) ).xyz;

		}

		// transmission
		float transmission = material.transmission;
		if ( material.transmissionMap != - 1 ) {

			vec3 uvPrime = material.transmissionMapTransform * vec3( uv, 1 );
			transmission *= texture2D( textures, vec3( uvPrime.xy, material.transmissionMap ) ).r;

		}

		// normal
		if ( material.flatShading ) {

			// if we're rendering a flat shaded object then use the face normals - the face normal
			// is provided based on the side the ray hits the mesh so flip it to align with the
			// interpolated vertex normals.
			normal = surfaceHit.faceNormal * surfaceHit.side;

		}

		vec3 baseNormal = normal;
		if ( material.normalMap != - 1 ) {

			vec4 tangentSample = textureSampleBarycoord(
				attributesArray,
				ATTR_TANGENT,
				surfaceHit.barycoord,
				surfaceHit.faceIndices.xyz
			);

			// some provided tangents can be malformed (0, 0, 0) causing the normal to be degenerate
			// resulting in NaNs and slow path tracing.
			if ( length( tangentSample.xyz ) > 0.0 ) {

				vec3 tangent = normalize( tangentSample.xyz );
				vec3 bitangent = normalize( cross( normal, tangent ) * tangentSample.w );
				mat3 vTBN = mat3( tangent, bitangent, normal );

				vec3 uvPrime = material.normalMapTransform * vec3( uv, 1 );
				vec3 texNormal = texture2D( textures, vec3( uvPrime.xy, material.normalMap ) ).xyz * 2.0 - 1.0;
				texNormal.xy *= material.normalScale;
				normal = vTBN * texNormal;

			}

		}

		normal *= surfaceHit.side;

		// clearcoat
		float clearcoat = material.clearcoat;
		if ( material.clearcoatMap != - 1 ) {

			vec3 uvPrime = material.clearcoatMapTransform * vec3( uv, 1 );
			clearcoat *= texture2D( textures, vec3( uvPrime.xy, material.clearcoatMap ) ).r;

		}

		// clearcoatRoughness
		float clearcoatRoughness = material.clearcoatRoughness;
		if ( material.clearcoatRoughnessMap != - 1 ) {

			vec3 uvPrime = material.clearcoatRoughnessMapTransform * vec3( uv, 1 );
			clearcoatRoughness *= texture2D( textures, vec3( uvPrime.xy, material.clearcoatRoughnessMap ) ).g;

		}

		// clearcoatNormal
		vec3 clearcoatNormal = baseNormal;
		if ( material.clearcoatNormalMap != - 1 ) {

			vec4 tangentSample = textureSampleBarycoord(
				attributesArray,
				ATTR_TANGENT,
				surfaceHit.barycoord,
				surfaceHit.faceIndices.xyz
			);

			// some provided tangents can be malformed (0, 0, 0) causing the normal to be degenerate
			// resulting in NaNs and slow path tracing.
			if ( length( tangentSample.xyz ) > 0.0 ) {

				vec3 tangent = normalize( tangentSample.xyz );
				vec3 bitangent = normalize( cross( clearcoatNormal, tangent ) * tangentSample.w );
				mat3 vTBN = mat3( tangent, bitangent, clearcoatNormal );

				vec3 uvPrime = material.clearcoatNormalMapTransform * vec3( uv, 1 );
				vec3 texNormal = texture2D( textures, vec3( uvPrime.xy, material.clearcoatNormalMap ) ).xyz * 2.0 - 1.0;
				texNormal.xy *= material.clearcoatNormalScale;
				clearcoatNormal = vTBN * texNormal;

			}

		}

		clearcoatNormal *= surfaceHit.side;

		// sheenColor
		vec3 sheenColor = material.sheenColor;
		if ( material.sheenColorMap != - 1 ) {

			vec3 uvPrime = material.sheenColorMapTransform * vec3( uv, 1 );
			sheenColor *= texture2D( textures, vec3( uvPrime.xy, material.sheenColorMap ) ).rgb;

		}

		// sheenRoughness
		float sheenRoughness = material.sheenRoughness;
		if ( material.sheenRoughnessMap != - 1 ) {

			vec3 uvPrime = material.sheenRoughnessMapTransform * vec3( uv, 1 );
			sheenRoughness *= texture2D( textures, vec3( uvPrime.xy, material.sheenRoughnessMap ) ).a;

		}

		// iridescence
		float iridescence = material.iridescence;
		if ( material.iridescenceMap != - 1 ) {

			vec3 uvPrime = material.iridescenceMapTransform * vec3( uv, 1 );
			iridescence *= texture2D( textures, vec3( uvPrime.xy, material.iridescenceMap ) ).r;

		}

		// iridescence thickness
		float iridescenceThickness = material.iridescenceThicknessMaximum;
		if ( material.iridescenceThicknessMap != - 1 ) {

			vec3 uvPrime = material.iridescenceThicknessMapTransform * vec3( uv, 1 );
			float iridescenceThicknessSampled = texture2D( textures, vec3( uvPrime.xy, material.iridescenceThicknessMap ) ).g;
			iridescenceThickness = mix( material.iridescenceThicknessMinimum, material.iridescenceThicknessMaximum, iridescenceThicknessSampled );

		}

		iridescence = iridescenceThickness == 0.0 ? 0.0 : iridescence;

		// specular color
		vec3 specularColor = material.specularColor;
		if ( material.specularColorMap != - 1 ) {

			vec3 uvPrime = material.specularColorMapTransform * vec3( uv, 1 );
			specularColor *= texture2D( textures, vec3( uvPrime.xy, material.specularColorMap ) ).rgb;

		}

		// specular intensity
		float specularIntensity = material.specularIntensity;
		if ( material.specularIntensityMap != - 1 ) {

			vec3 uvPrime = material.specularIntensityMapTransform * vec3( uv, 1 );
			specularIntensity *= texture2D( textures, vec3( uvPrime.xy, material.specularIntensityMap ) ).a;

		}

		surf.volumeParticle = false;

		surf.faceNormal = surfaceHit.faceNormal;
		surf.normal = normal;

		surf.metalness = metalness;
		surf.color = albedo.rgb;
		surf.emission = emission;

		surf.ior = material.ior;
		surf.transmission = transmission;
		surf.thinFilm = material.thinFilm;
		surf.attenuationColor = material.attenuationColor;
		surf.attenuationDistance = material.attenuationDistance;

		surf.clearcoatNormal = clearcoatNormal;
		surf.clearcoat = clearcoat;

		surf.sheen = material.sheen;
		surf.sheenColor = sheenColor;

		surf.iridescence = iridescence;
		surf.iridescenceIor = material.iridescenceIor;
		surf.iridescenceThickness = iridescenceThickness;

		surf.specularColor = specularColor;
		surf.specularIntensity = specularIntensity;

		// apply perceptual roughness factor from gltf. sheen perceptual roughness is
		// applied by its brdf function
		// https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html#microfacet-surfaces
		surf.roughness = roughness * roughness;
		surf.clearcoatRoughness = clearcoatRoughness * clearcoatRoughness;
		surf.sheenRoughness = sheenRoughness;

		// frontFace is used to determine transmissive properties and PDF. If no transmission is used
		// then we can just always assume this is a front face.
		surf.frontFace = surfaceHit.side == 1.0 || transmission == 0.0;
		surf.eta = material.thinFilm || surf.frontFace ? 1.0 / material.ior : material.ior;
		surf.f0 = iorRatioToF0( surf.eta );

		// Compute the filtered roughness value to use during specular reflection computations.
		// The accumulated roughness value is scaled by a user setting and a "magic value" of 5.0.
		// If we're exiting something transmissive then scale the factor down significantly so we can retain
		// sharp internal reflections
		surf.filteredRoughness = applyFilteredGlossy( surf.roughness, accumulatedRoughness );
		surf.filteredClearcoatRoughness = applyFilteredGlossy( surf.clearcoatRoughness, accumulatedRoughness );

		// get the normal frames
		surf.normalBasis = getBasisFromNormal( surf.normal );
		surf.normalInvBasis = inverse( surf.normalBasis );

		surf.clearcoatBasis = getBasisFromNormal( surf.clearcoatNormal );
		surf.clearcoatInvBasis = inverse( surf.clearcoatBasis );

		return HIT_SURFACE;

	}
`;var Jp=`

	struct Ray {

		vec3 origin;
		vec3 direction;

	};

	struct SurfaceHit {

		uvec4 faceIndices;
		vec3 barycoord;
		vec3 faceNormal;
		float side;
		float dist;

	};

	struct RenderState {

		bool firstRay;
		bool transmissiveRay;
		bool isShadowRay;
		float accumulatedRoughness;
		int transmissiveTraversals;
		int traversals;
		uint depth;
		vec3 throughputColor;
		Material fogMaterial;

	};

	RenderState initRenderState() {

		RenderState result;
		result.firstRay = true;
		result.transmissiveRay = true;
		result.isShadowRay = false;
		result.accumulatedRoughness = 0.0;
		result.transmissiveTraversals = 0;
		result.traversals = 0;
		result.throughputColor = vec3( 1.0 );
		result.depth = 0u;
		result.fogMaterial.fogVolume = false;
		return result;

	}

`;var Kp=`

	#define NO_HIT 0
	#define SURFACE_HIT 1
	#define LIGHT_HIT 2
	#define FOG_HIT 3

	// Passing the global variable 'lights' into this function caused shader program errors.
	// So global variables like 'lights' and 'bvh' were moved out of the function parameters.
	// For more information, refer to: https://github.com/gkjohnson/three-gpu-pathtracer/pull/457
	int traceScene(
		Ray ray, Material fogMaterial, inout SurfaceHit surfaceHit
	) {

		int result = NO_HIT;
		bool hit = bvhIntersectFirstHit( bvh, ray.origin, ray.direction, surfaceHit.faceIndices, surfaceHit.faceNormal, surfaceHit.barycoord, surfaceHit.side, surfaceHit.dist );

		#if FEATURE_FOG

		if ( fogMaterial.fogVolume ) {

			// offset the distance so we don't run into issues with particles on the same surface
			// as other objects
			float particleDist = intersectFogVolume( fogMaterial, rand( 1 ) );
			if ( particleDist + RAY_OFFSET < surfaceHit.dist ) {

				surfaceHit.side = 1.0;
				surfaceHit.faceNormal = normalize( - ray.direction );
				surfaceHit.dist = particleDist;
				return FOG_HIT;

			}

		}

		#endif

		if ( hit ) {

			result = SURFACE_HIT;

		}

		return result;

	}

`;class Eu extends ui{onBeforeRender(){this.setDefine("FEATURE_DOF",this.physicalCamera.bokehSize===0?0:1),this.setDefine("FEATURE_BACKGROUND_MAP",this.backgroundMap?1:0),this.setDefine("FEATURE_FOG",this.materials.features.isUsed("FOG")?1:0)}constructor(e){super({transparent:!0,depthWrite:!1,defines:{FEATURE_MIS:1,FEATURE_RUSSIAN_ROULETTE:1,FEATURE_DOF:1,FEATURE_BACKGROUND_MAP:0,FEATURE_FOG:1,RANDOM_TYPE:2,CAMERA_TYPE:0,DEBUG_MODE:0,ATTR_NORMAL:0,ATTR_TANGENT:1,ATTR_UV:2,ATTR_COLOR:3,MATERIAL_PIXELS:So},uniforms:{resolution:{value:new Te},opacity:{value:1},bounces:{value:10},transmissiveBounces:{value:10},filterGlossyFactor:{value:0},physicalCamera:{value:new du},cameraWorldMatrix:{value:new Pe},invProjectionMatrix:{value:new Pe},bvh:{value:new jc},attributesArray:{value:new _u},materialIndexAttribute:{value:new Fr},materials:{value:new yu},textures:{value:new Mo().texture},lights:{value:new gu},iesProfiles:{value:new Mo(360,180,{type:et,wrapS:Bt,wrapT:Bt}).texture},environmentIntensity:{value:1},environmentRotation:{value:new Pe},envMapInfo:{value:new pu},backgroundBlur:{value:0},backgroundMap:{value:null},backgroundAlpha:{value:1},backgroundIntensity:{value:1},backgroundRotation:{value:new Pe},seed:{value:0},sobolTexture:{value:null},stratifiedTexture:{value:new bu},stratifiedOffsetTexture:{value:new wu(64,1)}},vertexShader:`

				varying vec2 vUv;
				void main() {

					vec4 mvPosition = vec4( position, 1.0 );
					mvPosition = modelViewMatrix * mvPosition;
					gl_Position = projectionMatrix * mvPosition;

					vUv = uv;

				}

			`,fragmentShader:`
				#define RAY_OFFSET 1e-4
				#define INFINITY 1e20

				precision highp isampler2D;
				precision highp usampler2D;
				precision highp sampler2DArray;
				vec4 envMapTexelToLinear( vec4 a ) { return a; }
				#include <common>

				// bvh intersection
				${eu}
				${Jd}
				${tu}

				// uniform structs
				${Ep}
				${Cp}
				${Rp}
				${Ip}
				${Pp}

				// random
				#if RANDOM_TYPE == 2 	// Stratified List

					${zp}

				#elif RANDOM_TYPE == 1 	// Sobol

					${Au}
					${_o}
					${hp}

					#define rand(v) sobol(v)
					#define rand2(v) sobol2(v)
					#define rand3(v) sobol3(v)
					#define rand4(v) sobol4(v)

				#else 					// PCG

				${Au}

					// Using the sobol functions seems to break the the compiler on MacOS
					// - specifically the "sobolReverseBits" function.
					uint sobolPixelIndex = 0u;
					uint sobolPathIndex = 0u;
					uint sobolBounceIndex = 0u;

					#define rand(v) pcgRand()
					#define rand2(v) pcgRand2()
					#define rand3(v) pcgRand3()
					#define rand4(v) pcgRand4()

				#endif

				// common
				${Bp}
				${Np}
				${To}
				${Up}
				${Op}

				// environment
				uniform EquirectHdrInfo envMapInfo;
				uniform mat4 environmentRotation;
				uniform float environmentIntensity;

				// lighting
				uniform sampler2DArray iesProfiles;
				uniform LightsInfo lights;

				// background
				uniform float backgroundBlur;
				uniform float backgroundAlpha;
				#if FEATURE_BACKGROUND_MAP

				uniform sampler2D backgroundMap;
				uniform mat4 backgroundRotation;
				uniform float backgroundIntensity;

				#endif

				// camera
				uniform mat4 cameraWorldMatrix;
				uniform mat4 invProjectionMatrix;
				#if FEATURE_DOF

				uniform PhysicalCamera physicalCamera;

				#endif

				// geometry
				uniform sampler2DArray attributesArray;
				uniform usampler2D materialIndexAttribute;
				uniform sampler2D materials;
				uniform sampler2DArray textures;
				uniform BVH bvh;

				// path tracer
				uniform int bounces;
				uniform int transmissiveBounces;
				uniform float filterGlossyFactor;
				uniform int seed;

				// image
				uniform vec2 resolution;
				uniform float opacity;

				varying vec2 vUv;

				// globals
				mat3 envRotation3x3;
				mat3 invEnvRotation3x3;
				float lightsDenom;

				// sampling
				${Fp}
				${Dp}
				${Lp}

				${Xp}
				${Gp}
				${Vp}
				${Wp}
				${Hp}
				${kp}

				float applyFilteredGlossy( float roughness, float accumulatedRoughness ) {

					return clamp(
						max(
							roughness,
							accumulatedRoughness * filterGlossyFactor * 5.0 ),
						0.0,
						1.0
					);

				}

				vec3 sampleBackground( vec3 direction, vec2 uv ) {

					vec3 sampleDir = sampleHemisphere( direction, uv ) * 0.5 * backgroundBlur;

					#if FEATURE_BACKGROUND_MAP

					sampleDir = normalize( mat3( backgroundRotation ) * direction + sampleDir );
					return backgroundIntensity * sampleEquirectColor( backgroundMap, sampleDir );

					#else

					sampleDir = normalize( envRotation3x3 * direction + sampleDir );
					return environmentIntensity * sampleEquirectColor( envMapInfo.map, sampleDir );

					#endif

				}

				${Jp}
				${Yp}
				${Kp}
				${qp}
				${Zp}
				${$p}

				void main() {

					// init
					rng_initialize( gl_FragCoord.xy, seed );
					sobolPixelIndex = ( uint( gl_FragCoord.x ) << 16 ) | uint( gl_FragCoord.y );
					sobolPathIndex = uint( seed );

					// get camera ray
					Ray ray = getCameraRay();

					// inverse environment rotation
					envRotation3x3 = mat3( environmentRotation );
					invEnvRotation3x3 = inverse( envRotation3x3 );
					lightsDenom =
						( environmentIntensity == 0.0 || envMapInfo.totalSum == 0.0 ) && lights.count != 0u ?
							float( lights.count ) :
							float( lights.count + 1u );

					// final color
					gl_FragColor = vec4( 0, 0, 0, 1 );

					// surface results
					SurfaceHit surfaceHit;
					ScatterRecord scatterRec;

					// path tracing state
					RenderState state = initRenderState();
					state.transmissiveTraversals = transmissiveBounces;
					#if FEATURE_FOG

					state.fogMaterial.fogVolume = bvhIntersectFogVolumeHit(
						ray.origin, - ray.direction,
						materialIndexAttribute, materials,
						state.fogMaterial
					);

					#endif

					for ( int i = 0; i < bounces; i ++ ) {

						sobolBounceIndex ++;

						state.depth ++;
						state.traversals = bounces - i;
						state.firstRay = i == 0 && state.transmissiveTraversals == transmissiveBounces;

						int hitType = traceScene( ray, state.fogMaterial, surfaceHit );

						// check if we intersect any lights and accumulate the light contribution
						// TODO: we can add support for light surface rendering in the else condition if we
						// add the ability to toggle visibility of the the light
						if ( ! state.firstRay && ! state.transmissiveRay ) {

							LightRecord lightRec;
							float lightDist = hitType == NO_HIT ? INFINITY : surfaceHit.dist;
							for ( uint i = 0u; i < lights.count; i ++ ) {

								if (
									intersectLightAtIndex( lights.tex, ray.origin, ray.direction, i, lightRec ) &&
									lightRec.dist < lightDist
								) {

									#if FEATURE_MIS

									// weight the contribution
									// NOTE: Only area lights are supported for forward sampling and can be hit
									float misWeight = misHeuristic( scatterRec.pdf, lightRec.pdf / lightsDenom );
									gl_FragColor.rgb += lightRec.emission * state.throughputColor * misWeight;

									#else

									gl_FragColor.rgb += lightRec.emission * state.throughputColor;

									#endif

								}

							}

						}

						if ( hitType == NO_HIT ) {

							if ( state.firstRay || state.transmissiveRay ) {

								gl_FragColor.rgb += sampleBackground( ray.direction, rand2( 2 ) ) * state.throughputColor;
								gl_FragColor.a = backgroundAlpha;

							} else {

								#if FEATURE_MIS

								// get the PDF of the hit envmap point
								vec3 envColor;
								float envPdf = sampleEquirect( envRotation3x3 * ray.direction, envColor );
								envPdf /= lightsDenom;

								// and weight the contribution
								float misWeight = misHeuristic( scatterRec.pdf, envPdf );
								gl_FragColor.rgb += environmentIntensity * envColor * state.throughputColor * misWeight;

								#else

								gl_FragColor.rgb +=
									environmentIntensity *
									sampleEquirectColor( envMapInfo.map, envRotation3x3 * ray.direction ) *
									state.throughputColor;

								#endif

							}
							break;

						}

						uint materialIndex = uTexelFetch1D( materialIndexAttribute, surfaceHit.faceIndices.x ).r;
						Material material = readMaterialInfo( materials, materialIndex );

						#if FEATURE_FOG

						if ( hitType == FOG_HIT ) {

							material = state.fogMaterial;
							state.accumulatedRoughness += 0.2;

						} else if ( material.fogVolume ) {

							state.fogMaterial = material;
							state.fogMaterial.fogVolume = surfaceHit.side == 1.0;

							ray.origin = stepRayOrigin( ray.origin, ray.direction, - surfaceHit.faceNormal, surfaceHit.dist );

							i -= sign( state.transmissiveTraversals );
							state.transmissiveTraversals -= sign( state.transmissiveTraversals );
							continue;

						}

						#endif

						// early out if this is a matte material
						if ( material.matte && state.firstRay ) {

							gl_FragColor = vec4( 0.0 );
							break;

						}

						// if we've determined that this is a shadow ray and we've hit an item with no shadow casting
						// then skip it
						if ( ! material.castShadow && state.isShadowRay ) {

							ray.origin = stepRayOrigin( ray.origin, ray.direction, - surfaceHit.faceNormal, surfaceHit.dist );
							continue;

						}

						SurfaceRecord surf;
						if (
							getSurfaceRecord(
								material, surfaceHit, attributesArray, state.accumulatedRoughness,
								surf
							) == SKIP_SURFACE
						) {

							// only allow a limited number of transparency discards otherwise we could
							// crash the context with too long a loop.
							i -= sign( state.transmissiveTraversals );
							state.transmissiveTraversals -= sign( state.transmissiveTraversals );

							ray.origin = stepRayOrigin( ray.origin, ray.direction, - surfaceHit.faceNormal, surfaceHit.dist );
							continue;

						}

						scatterRec = bsdfSample( - ray.direction, surf );
						state.isShadowRay = scatterRec.specularPdf < rand( 4 );

						bool isBelowSurface = ! surf.volumeParticle && dot( scatterRec.direction, surf.faceNormal ) < 0.0;
						vec3 hitPoint = stepRayOrigin( ray.origin, ray.direction, isBelowSurface ? - surf.faceNormal : surf.faceNormal, surfaceHit.dist );

						// next event estimation
						#if FEATURE_MIS

						gl_FragColor.rgb += directLightContribution( - ray.direction, surf, state, hitPoint );

						#endif

						// accumulate a roughness value to offset diffuse, specular, diffuse rays that have high contribution
						// to a single pixel resulting in fireflies
						// TODO: handle transmissive surfaces
						if ( ! surf.volumeParticle && ! isBelowSurface ) {

							// determine if this is a rough normal or not by checking how far off straight up it is
							vec3 halfVector = normalize( - ray.direction + scatterRec.direction );
							state.accumulatedRoughness += max(
								sin( acosApprox( dot( halfVector, surf.normal ) ) ),
								sin( acosApprox( dot( halfVector, surf.clearcoatNormal ) ) )
							);

							state.transmissiveRay = false;

						}

						// accumulate emissive color
						gl_FragColor.rgb += ( surf.emission * state.throughputColor );

						// skip the sample if our PDF or ray is impossible
						if ( scatterRec.pdf <= 0.0 || ! isDirectionValid( scatterRec.direction, surf.normal, surf.faceNormal ) ) {

							break;

						}

						// if we're bouncing around the inside a transmissive material then decrement
						// perform this separate from a bounce
						bool isTransmissiveRay = ! surf.volumeParticle && dot( scatterRec.direction, surf.faceNormal * surfaceHit.side ) < 0.0;
						if ( ( isTransmissiveRay || isBelowSurface ) && state.transmissiveTraversals > 0 ) {

							state.transmissiveTraversals --;
							i --;

						}

						//

						// handle throughput color transformation
						// attenuate the throughput color by the medium color
						if ( ! surf.frontFace ) {

							state.throughputColor *= transmissionAttenuation( surfaceHit.dist, surf.attenuationColor, surf.attenuationDistance );

						}

						#if FEATURE_RUSSIAN_ROULETTE

						// russian roulette path termination
						// https://www.arnoldrenderer.com/research/physically_based_shader_design_in_arnold.pdf
						uint minBounces = 3u;
						float depthProb = float( state.depth < minBounces );

						float rrProb = luminance( state.throughputColor * scatterRec.color / scatterRec.pdf );
						rrProb /= luminance( state.throughputColor );
						rrProb = sqrt( rrProb );
						rrProb = max( rrProb, depthProb );
						rrProb = min( rrProb, 1.0 );
						if ( rand( 8 ) > rrProb ) {

							break;

						}

						// perform sample clamping here to avoid bright pixels
						state.throughputColor *= min( 1.0 / rrProb, 20.0 );

						#endif

						// adjust the throughput and discard and exit if we find discard the sample if there are any NaNs
						state.throughputColor *= scatterRec.color / scatterRec.pdf;
						if ( any( isnan( state.throughputColor ) ) || any( isinf( state.throughputColor ) ) ) {

							break;

						}

						//

						// prepare for next ray
						ray.direction = scatterRec.direction;
						ray.origin = hitPoint;

					}

					gl_FragColor.a *= opacity;

					#if DEBUG_MODE == 1

					// output the number of rays checked in the path and number of
					// transmissive rays encountered.
					gl_FragColor.rgb = vec3(
						float( state.depth ),
						transmissiveBounces - state.transmissiveTraversals,
						0.0
					);
					gl_FragColor.a = 1.0;

					#endif

				}

			`});this.setValues(e)}}function*$y(){let{_renderer:e,_fsQuad:t,_blendQuad:n,_primaryTarget:i,_blendTargets:s,_sobolTarget:r,_subframe:a,alpha:o,material:l}=this,u=new rt,h=new rt,c=n.material,[f,d]=s;while(!0){if(o)c.opacity=this._opacityFactor/(this.samples+1),l.blending=Ot,l.opacity=1;else l.opacity=this._opacityFactor/(this.samples+1),l.blending=ri;let[_,m,p,g]=a,{width:v,height:M}=i;l.resolution.set(v*p,M*g),l.sobolTexture=r.texture,l.stratifiedTexture.init(20,l.bounces+l.transmissiveBounces+5),l.stratifiedTexture.next(),l.seed++;let y=this.tiles.x||1,b=this.tiles.y||1,E=y*b,x=Math.ceil(v*p),S=Math.ceil(M*g),A=Math.floor(_*v),P=Math.floor(m*M),R=Math.ceil(x/y),I=Math.ceil(S/b);for(let F=0;F<b;F++)for(let C=0;C<y;C++){let O=e.getRenderTarget(),W=e.autoClear,z=e.getScissorTest();e.getScissor(u),e.getViewport(h);let te=C,V=F;if(!this.stableTiles){let ee=this._currentTile%(y*b);te=ee%y,V=~~(ee/y),this._currentTile=ee+1}let Q=b-V-1;if(i.scissor.set(A+te*R,P+Q*I,Math.min(R,x-te*R),Math.min(I,S-Q*I)),i.viewport.set(A,P,x,S),e.setRenderTarget(i),e.setScissorTest(!0),e.autoClear=!1,t.render(e),e.setViewport(h),e.setScissor(u),e.setScissorTest(z),e.setRenderTarget(O),e.autoClear=W,o)c.target1=f.texture,c.target2=i.texture,e.setRenderTarget(d),n.render(e),e.setRenderTarget(O);if(this.samples+=1/E,C===y-1&&F===b-1)this.samples=Math.round(this.samples);yield}[f,d]=[d,f]}}var Qp=new Ae;class wo{get material(){return this._fsQuad.material}set material(e){this._fsQuad.material.removeEventListener("recompilation",this._compileFunction),e.addEventListener("recompilation",this._compileFunction),this._fsQuad.material=e}get target(){return this._alpha?this._blendTargets[1]:this._primaryTarget}set alpha(e){if(this._alpha===e)return;if(!e)this._blendTargets[0].dispose(),this._blendTargets[1].dispose();this._alpha=e,this.reset()}get alpha(){return this._alpha}get isCompiling(){return Boolean(this._compilePromise)}constructor(e){this.camera=null,this.tiles=new Te(3,3),this.stableNoise=!1,this.stableTiles=!0,this.samples=0,this._subframe=new rt(0,0,1,1),this._opacityFactor=1,this._renderer=e,this._alpha=!1,this._fsQuad=new un(new Eu),this._blendQuad=new un(new uu),this._task=null,this._currentTile=0,this._compilePromise=null,this._sobolTarget=new hu().generate(e),this._primaryTarget=new At(1,1,{format:ke,type:Ve,magFilter:qe,minFilter:qe}),this._blendTargets=[new At(1,1,{format:ke,type:Ve,magFilter:qe,minFilter:qe}),new At(1,1,{format:ke,type:Ve,magFilter:qe,minFilter:qe})],this._compileFunction=()=>{let t=this.compileMaterial(this._fsQuad._mesh);t.then(()=>{if(this._compilePromise===t)this._compilePromise=null}),this._compilePromise=t},this.material.addEventListener("recompilation",this._compileFunction)}compileMaterial(){return this._renderer.compileAsync(this._fsQuad._mesh)}setCamera(e){let{material:t}=this;t.cameraWorldMatrix.copy(e.matrixWorld),t.invProjectionMatrix.copy(e.projectionMatrixInverse),t.physicalCamera.updateFrom(e);let n=0;if(e.projectionMatrix.elements[15]>0)n=1;if(e.isEquirectCamera)n=2;t.setDefine("CAMERA_TYPE",n),this.camera=e}setSize(e,t){if(e=Math.ceil(e),t=Math.ceil(t),this._primaryTarget.width===e&&this._primaryTarget.height===t)return;this._primaryTarget.setSize(e,t),this._blendTargets[0].setSize(e,t),this._blendTargets[1].setSize(e,t),this.reset()}getSize(e){e.x=this._primaryTarget.width,e.y=this._primaryTarget.height}dispose(){this._primaryTarget.dispose(),this._blendTargets[0].dispose(),this._blendTargets[1].dispose(),this._sobolTarget.dispose(),this._fsQuad.dispose(),this._blendQuad.dispose(),this._task=null}reset(){let{_renderer:e,_primaryTarget:t,_blendTargets:n}=this,i=e.getRenderTarget(),s=e.getClearAlpha();if(e.getClearColor(Qp),e.setRenderTarget(t),e.setClearColor(0,0),e.clearColor(),e.setRenderTarget(n[0]),e.setClearColor(0,0),e.clearColor(),e.setRenderTarget(n[1]),e.setClearColor(0,0),e.clearColor(),e.setClearColor(Qp,s),e.setRenderTarget(i),this.samples=0,this._task=null,this.material.stratifiedTexture.stableNoise=this.stableNoise,this.stableNoise)this.material.seed=0,this.material.stratifiedTexture.reset()}update(){if(this.material.onBeforeRender(),this.isCompiling)return;if(!this._task)this._task=$y.call(this);this._task.next()}}var ss=new Te,jp=new Te,Ao=new Na,Eo=new Ae;class Ru extends ht{constructor(e=512,t=512){super(new Uint16Array(e*t*4),e,t,ke,et,Gn,Kt,Bt,Ye,Ye);this.generationCallback=null}update(){this.dispose(),this.needsUpdate=!0;let{data:e,width:t,height:n}=this.image;for(let i=0;i<t;i++)for(let s=0;s<n;s++){jp.set(t,n),ss.set(i/t,s/n),ss.x-=0.5,ss.y=1-ss.y,Ao.theta=ss.x*2*Math.PI,Ao.phi=ss.y*Math.PI,Ao.radius=1,this.generationCallback(Ao,ss,jp,Eo);let a=4*(s*t+i);e[a+0]=pt.toHalfFloat(Eo.r),e[a+1]=pt.toHalfFloat(Eo.g),e[a+2]=pt.toHalfFloat(Eo.b),e[a+3]=pt.toHalfFloat(1)}}copy(e){return super.copy(e),this.generationCallback=e.generationCallback,this}}var em=new L;class Cu extends Ru{constructor(e=512){super(e,e);this.topColor=new Ae().set(16777215),this.bottomColor=new Ae().set(0),this.exponent=2,this.generationCallback=(t,n,i,s)=>{em.setFromSpherical(t);let r=em.y*0.5+0.5;s.lerpColors(this.bottomColor,this.topColor,r**this.exponent)}}copy(e){return super.copy(e),this.topColor.copy(e.topColor),this.bottomColor.copy(e.bottomColor),this}}class Iu extends kt{get map(){return this.uniforms.map.value}set map(e){this.uniforms.map.value=e}get opacity(){return this.uniforms.opacity.value}set opacity(e){if(this.uniforms)this.uniforms.opacity.value=e}constructor(e){super({uniforms:{map:{value:null},opacity:{value:1}},vertexShader:`
				varying vec2 vUv;
				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}
			`,fragmentShader:`
				uniform sampler2D map;
				uniform float opacity;
				varying vec2 vUv;

				vec4 clampedTexelFatch( sampler2D map, ivec2 px, int lod ) {

					vec4 res = texelFetch( map, ivec2( px.x, px.y ), 0 );

					#if defined( TONE_MAPPING )

					res.xyz = toneMapping( res.xyz );

					#endif

			  		return linearToOutputTexel( res );

				}

				void main() {

					vec2 size = vec2( textureSize( map, 0 ) );
					vec2 pxUv = vUv * size;
					vec2 pxCurr = floor( pxUv );
					vec2 pxFrac = fract( pxUv ) - 0.5;
					vec2 pxOffset;
					pxOffset.x = pxFrac.x > 0.0 ? 1.0 : - 1.0;
					pxOffset.y = pxFrac.y > 0.0 ? 1.0 : - 1.0;

					vec2 pxNext = clamp( pxOffset + pxCurr, vec2( 0.0 ), size - 1.0 );
					vec2 alpha = abs( pxFrac );

					vec4 p1 = mix(
						clampedTexelFatch( map, ivec2( pxCurr.x, pxCurr.y ), 0 ),
						clampedTexelFatch( map, ivec2( pxNext.x, pxCurr.y ), 0 ),
						alpha.x
					);

					vec4 p2 = mix(
						clampedTexelFatch( map, ivec2( pxCurr.x, pxNext.y ), 0 ),
						clampedTexelFatch( map, ivec2( pxNext.x, pxNext.y ), 0 ),
						alpha.x
					);

					gl_FragColor = mix( p1, p2, alpha.y );
					gl_FragColor.a *= opacity;
					#include <premultiplied_alpha_fragment>

				}
			`});this.setValues(e)}}class tm extends kt{constructor(){super({uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:`
				varying vec2 vUv;
				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`
				#define ENVMAP_TYPE_CUBE_UV

				uniform samplerCube envMap;
				uniform float flipEnvMap;
				varying vec2 vUv;

				#include <common>
				#include <cube_uv_reflection_fragment>

				${To}

				void main() {

					vec3 rayDirection = equirectUvToDirection( vUv );
					rayDirection.x *= flipEnvMap;
					gl_FragColor = textureCube( envMap, rayDirection );

				}`});this.depthWrite=!1,this.depthTest=!1}}class Ro{constructor(e){this._renderer=e,this._quad=new un(new tm)}generate(e,t=null,n=null){if(!e.isCubeTexture)throw Error("CubeToEquirectMaterial: Source can only be cube textures.");let i=e.images[0],s=this._renderer,r=this._quad;if(t===null)t=4*i.height;if(n===null)n=2*i.height;let a=new At(t,n,{type:Ve,colorSpace:i.colorSpace}),o=i.height,l=Math.log2(o)-2,u=1/o,h=1/(3*Math.max(Math.pow(2,l),112));r.material.defines.CUBEUV_MAX_MIP=`${l}.0`,r.material.defines.CUBEUV_TEXEL_WIDTH=h,r.material.defines.CUBEUV_TEXEL_HEIGHT=u,r.material.uniforms.envMap.value=e,r.material.uniforms.flipEnvMap.value=e.isRenderTargetTexture?1:-1,r.material.needsUpdate=!0;let c=s.getRenderTarget(),f=s.autoClear;s.autoClear=!0,s.setRenderTarget(a),r.render(s),s.setRenderTarget(c),s.autoClear=f;let d=new Uint16Array(t*n*4),_=new Float32Array(t*n*4);s.readRenderTargetPixels(a,0,0,t,n,_),a.dispose();for(let p=0,g=_.length;p<g;p++)d[p]=pt.toHalfFloat(_[p]);let m=new ht(d,t,n,ke,et);return m.minFilter=fl,m.magFilter=Ye,m.wrapS=Kt,m.wrapT=Kt,m.mapping=Gn,m.needsUpdate=!0,m}dispose(){this._quad.dispose()}}function Jy(e){return e.extensions.get("EXT_float_blend")}var Zs=new Te;class Pu{get multipleImportanceSampling(){return Boolean(this._pathTracer.material.defines.FEATURE_MIS)}set multipleImportanceSampling(e){this._pathTracer.material.setDefine("FEATURE_MIS",e?1:0)}get transmissiveBounces(){return this._pathTracer.material.transmissiveBounces}set transmissiveBounces(e){this._pathTracer.material.transmissiveBounces=e}get bounces(){return this._pathTracer.material.bounces}set bounces(e){this._pathTracer.material.bounces=e}get filterGlossyFactor(){return this._pathTracer.material.filterGlossyFactor}set filterGlossyFactor(e){this._pathTracer.material.filterGlossyFactor=e}get samples(){return this._pathTracer.samples}get target(){return this._pathTracer.target}get tiles(){return this._pathTracer.tiles}get stableNoise(){return this._pathTracer.stableNoise}set stableNoise(e){this._pathTracer.stableNoise=e}get isCompiling(){return Boolean(this._pathTracer.isCompiling)}constructor(e){console.warn('WebGLPathTracer: This class has been deprecated and will be removed in a future release. Use "WebGPUPathTracer" instead.'),this._renderer=e,this._generator=new cu,this._pathTracer=new wo(e),this._queueReset=!1,this._clock=new Fa,this._compilePromise=null,this._lowResPathTracer=new wo(e),this._lowResPathTracer.tiles.set(1,1),this._quad=new un(new Iu({map:null,transparent:!0,blending:Ot,premultipliedAlpha:e.getContextAttributes().premultipliedAlpha})),this._materials=null,this._previousEnvironment=null,this._previousBackground=null,this._internalBackground=null,this.renderDelay=100,this.minSamples=5,this.fadeDuration=500,this.enablePathTracing=!0,this.pausePathTracing=!1,this.dynamicLowRes=!1,this.lowResScale=0.25,this.renderScale=1,this.synchronizeRenderSize=!0,this.rasterizeScene=!0,this.renderToCanvas=!0,this.textureSize=new Te(1024,1024),this.rasterizeSceneCallback=(t,n)=>{this._renderer.render(t,n)},this.renderToCanvasCallback=(t,n,i)=>{let s=n.autoClear;n.autoClear=!1,i.render(n),n.autoClear=s},this.setScene(new Rs,new Yt)}setBVHWorker(e){this._generator.setBVHWorker(e)}setScene(e,t,n={}){e.updateMatrixWorld(!0),t.updateMatrixWorld();let i=this._generator;if(i.setObjects(e),this._buildAsync)return i.generateAsync(n.onProgress).then((s)=>this._updateFromResults(e,t,s));else{let s=i.generate();return this._updateFromResults(e,t,s)}}setSceneAsync(...e){this._buildAsync=!0;let t=this.setScene(...e);return this._buildAsync=!1,t}setCamera(e){this.camera=e,this.updateCamera()}updateCamera(){let e=this.camera;e.updateMatrixWorld(),this._pathTracer.setCamera(e),this._lowResPathTracer.setCamera(e),this.reset()}updateMaterials(){let e=this._pathTracer.material,t=this._renderer,n=this._materials,i=this.textureSize,s=_p(n);e.textures.setTextures(t,s,i.x,i.y),e.materials.updateFrom(n,s),this.reset()}updateLights(){let e=this.scene,t=this._renderer,n=this._pathTracer.material,i=vp(e),s=xp(i);n.lights.updateFrom(i,s),n.iesProfiles.setTextures(t,s),this.reset()}updateEnvironment(){let e=this.scene,t=this._pathTracer.material;if(this._internalBackground)this._internalBackground.dispose(),this._internalBackground=null;if(t.backgroundBlur=e.backgroundBlurriness,t.backgroundIntensity=e.backgroundIntensity??1,t.backgroundRotation.makeRotationFromEuler(e.backgroundRotation).invert(),e.background===null)t.backgroundMap=null,t.backgroundAlpha=0;else if(e.background.isColor){this._colorBackground=this._colorBackground||new Cu(16);let n=this._colorBackground;if(!n.topColor.equals(e.background))n.topColor.set(e.background),n.bottomColor.set(e.background),n.update();t.backgroundMap=n,t.backgroundAlpha=1}else if(e.background.isCubeTexture){if(e.background!==this._previousBackground){let n=new Ro(this._renderer).generate(e.background);this._internalBackground=n,t.backgroundMap=n,t.backgroundAlpha=1}}else t.backgroundMap=e.background,t.backgroundAlpha=1;if(t.environmentIntensity=e.environment!==null?e.environmentIntensity??1:0,t.environmentRotation.makeRotationFromEuler(e.environmentRotation).invert(),this._previousEnvironment!==e.environment){if(e.environment!==null)if(e.environment.isCubeTexture){let n=new Ro(this._renderer).generate(e.environment);t.envMapInfo.updateFrom(n)}else t.envMapInfo.updateFrom(e.environment)}this._previousEnvironment=e.environment,this._previousBackground=e.background,this.reset()}_updateFromResults(e,t,n){let{materials:i,geometry:s,bvh:r,bvhChanged:a,needsMaterialIndexUpdate:o}=n;this._materials=i;let u=this._pathTracer.material;if(a)u.bvh.updateFrom(r),u.attributesArray.updateFrom(s.attributes.normal,s.attributes.tangent,s.attributes.uv,s.attributes.color);if(o)u.materialIndexAttribute.updateFrom(s.attributes.materialIndex);return this._previousScene=e,this.scene=e,this.camera=t,this.updateCamera(),this.updateMaterials(),this.updateEnvironment(),this.updateLights(),n}renderSample(){let e=this._lowResPathTracer,t=this._pathTracer,n=this._renderer,i=this._clock,s=this._quad;if(this._updateScale(),this._queueReset)t.reset(),e.reset(),this._queueReset=!1,s.material.opacity=0,i.start();let r=i.getDelta()*1000,a=i.getElapsedTime()*1000;if(!this.pausePathTracing&&this.enablePathTracing&&this.renderDelay<=a&&!this.isCompiling)t.update();if(t.alpha=t.material.backgroundAlpha!==1||!Jy(n),e.alpha=t.alpha,this.renderToCanvas){let o=this._renderer,l=this.minSamples;if(a>=this.renderDelay&&this.samples>=this.minSamples)if(this.fadeDuration!==0)s.material.opacity=Math.min(s.material.opacity+r/this.fadeDuration,1);else s.material.opacity=1;if(!this.enablePathTracing||this.samples<l||s.material.opacity<1){if(this.dynamicLowRes&&!this.isCompiling){if(e.samples<1)e.material=t.material,e.update();let u=s.material.opacity;s.material.opacity=1-s.material.opacity,s.material.map=e.target.texture,s.render(o),s.material.opacity=u}if(!this.dynamicLowRes&&this.rasterizeScene||this.dynamicLowRes&&this.isCompiling)this.rasterizeSceneCallback(this.scene,this.camera)}if(this.enablePathTracing&&s.material.opacity>0){if(s.material.opacity<1)s.material.blending=this.dynamicLowRes?ir:ri;s.material.map=t.target.texture,this.renderToCanvasCallback(t.target,o,s),s.material.blending=Ot}}}reset(){this._queueReset=!0,this._pathTracer.samples=0}dispose(){this._quad.dispose(),this._quad.material.dispose(),this._pathTracer.dispose()}_updateScale(){if(this.synchronizeRenderSize){this._renderer.getDrawingBufferSize(Zs);let e=Math.floor(this.renderScale*Zs.x),t=Math.floor(this.renderScale*Zs.y);if(this._pathTracer.getSize(Zs),Zs.x!==e||Zs.y!==t){let n=this.lowResScale;this._pathTracer.setSize(e,t),this._lowResPathTracer.setSize(Math.floor(e*n),Math.floor(t*n))}}}getRenderTime(){return this._clock.getElapsedTime()*1000}}class Du extends ui{constructor(e){super({blending:Ot,transparent:!1,depthWrite:!1,depthTest:!1,defines:{USE_SLIDER:0},uniforms:{sigma:{value:5},threshold:{value:0.03},kSigma:{value:1},map:{value:null},opacity:{value:1}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}

			`,fragmentShader:`

				//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
				//  Copyright (c) 2018-2019 Michele Morrone
				//  All rights reserved.
				//
				//  https://michelemorrone.eu - https://BrutPitt.com
				//
				//  me@michelemorrone.eu - brutpitt@gmail.com
				//  twitter: @BrutPitt - github: BrutPitt
				//
				//  https://github.com/BrutPitt/glslSmartDeNoise/
				//
				//  This software is distributed under the terms of the BSD 2-Clause license
				//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

				uniform sampler2D map;

				uniform float sigma;
				uniform float threshold;
				uniform float kSigma;
				uniform float opacity;

				varying vec2 vUv;

				#define INV_SQRT_OF_2PI 0.39894228040143267793994605993439
				#define INV_PI 0.31830988618379067153776752674503

				// Parameters:
				//	 sampler2D tex	 - sampler image / texture
				//	 vec2 uv		   - actual fragment coord
				//	 float sigma  >  0 - sigma Standard Deviation
				//	 float kSigma >= 0 - sigma coefficient
				//		 kSigma * sigma  -->  radius of the circular kernel
				//	 float threshold   - edge sharpening threshold
				vec4 smartDeNoise( sampler2D tex, vec2 uv, float sigma, float kSigma, float threshold ) {

					float radius = round( kSigma * sigma );
					float radQ = radius * radius;

					float invSigmaQx2 = 0.5 / ( sigma * sigma );
					float invSigmaQx2PI = INV_PI * invSigmaQx2;

					float invThresholdSqx2 = 0.5 / ( threshold * threshold );
					float invThresholdSqrt2PI = INV_SQRT_OF_2PI / threshold;

					vec4 centrPx = texture2D( tex, uv );
					centrPx.rgb *= centrPx.a;

					float zBuff = 0.0;
					vec4 aBuff = vec4( 0.0 );
					vec2 size = vec2( textureSize( tex, 0 ) );

					vec2 d;
					for ( d.x = - radius; d.x <= radius; d.x ++ ) {

						float pt = sqrt( radQ - d.x * d.x );

						for ( d.y = - pt; d.y <= pt; d.y ++ ) {

							float blurFactor = exp( - dot( d, d ) * invSigmaQx2 ) * invSigmaQx2PI;

							vec4 walkPx = texture2D( tex, uv + d / size );
							walkPx.rgb *= walkPx.a;

							vec4 dC = walkPx - centrPx;
							float deltaFactor = exp( - dot( dC.rgba, dC.rgba ) * invThresholdSqx2 ) * invThresholdSqrt2PI * blurFactor;

							zBuff += deltaFactor;
							aBuff += deltaFactor * walkPx;

						}

					}

					return aBuff / zBuff;

				}

				void main() {

					gl_FragColor = smartDeNoise( map, vec2( vUv.x, vUv.y ), sigma, kSigma, threshold );
					#include <tonemapping_fragment>
					#include <colorspace_fragment>
					#include <premultiplied_alpha_fragment>

					gl_FragColor.a *= opacity;

				}

			`});this.setValues(e)}}class Lu extends Ca{constructor(e){super(e);this.type=et}parse(e){let r=function(x,S){switch(x){case 1:throw Error("THREE.HDRLoader: Read Error: "+(S||""));case 2:throw Error("THREE.HDRLoader: Write Error: "+(S||""));case 3:throw Error("THREE.HDRLoader: Bad File Format: "+(S||""));default:case 4:throw Error("THREE.HDRLoader: Memory Error: "+(S||""))}},h=function(x,S,A){S=!S?1024:S;let R=x.pos,I=-1,F=0,C="",O=String.fromCharCode.apply(null,new Uint16Array(x.subarray(R,R+128)));while(0>(I=O.indexOf(`
`))&&F<S&&R<x.byteLength)C+=O,F+=O.length,R+=128,O=String.fromCharCode.apply(null,new Uint16Array(x.subarray(R,R+128)));if(-1<I){if(A!==!1)x.pos+=F+I+1;return C+O.slice(0,I)}return!1},c=function(x){let S=/^#\?(\S+)/,A=/^\s*GAMMA\s*=\s*(\d+(\.\d+)?)\s*$/,P=/^\s*EXPOSURE\s*=\s*(\d+(\.\d+)?)\s*$/,R=/^\s*FORMAT=(\S+)\s*$/,I=/^\s*\-Y\s+(\d+)\s+\+X\s+(\d+)\s*$/,F={valid:0,string:"",comments:"",programtype:"RGBE",format:"",gamma:1,exposure:1,width:0,height:0},C,O;if(x.pos>=x.byteLength||!(C=h(x)))r(1,"no header found");if(!(O=C.match(S)))r(3,"bad initial token");F.valid|=1,F.programtype=O[1],F.string+=C+`
`;while(!0){if(C=h(x),C===!1)break;if(F.string+=C+`
`,C.charAt(0)==="#"){F.comments+=C+`
`;continue}if(O=C.match(A))F.gamma=parseFloat(O[1]);if(O=C.match(P))F.exposure=parseFloat(O[1]);if(O=C.match(R))F.valid|=2,F.format=O[1];if(O=C.match(I))F.valid|=4,F.height=parseInt(O[1],10),F.width=parseInt(O[2],10);if(F.valid&2&&F.valid&4)break}if(!(F.valid&2))r(3,"missing format specifier");if(!(F.valid&4))r(3,"missing image size specifier");return F},f=function(x,S,A){let P=S;if(P<8||P>32767||(x[0]!==2||x[1]!==2||x[2]&128))return new Uint8Array(x);if(P!==(x[2]<<8|x[3]))r(3,"wrong scanline width");let R=new Uint8Array(4*S*A);if(!R.length)r(4,"unable to allocate buffer space");let I=0,F=0,C=4*P,O=new Uint8Array(4),W=new Uint8Array(C),z=A;while(z>0&&F<x.byteLength){if(F+4>x.byteLength)r(1);if(O[0]=x[F++],O[1]=x[F++],O[2]=x[F++],O[3]=x[F++],O[0]!=2||O[1]!=2||(O[2]<<8|O[3])!=P)r(3,"bad rgbe scanline format");let te=0,V;while(te<C&&F<x.byteLength){V=x[F++];let ee=V>128;if(ee)V-=128;if(V===0||te+V>C)r(3,"bad scanline data");if(ee){let pe=x[F++];for(let Z=0;Z<V;Z++)W[te++]=pe}else W.set(x.subarray(F,F+V),te),te+=V,F+=V}let Q=P;for(let ee=0;ee<Q;ee++){let pe=0;R[I]=W[ee+pe],pe+=P,R[I+1]=W[ee+pe],pe+=P,R[I+2]=W[ee+pe],pe+=P,R[I+3]=W[ee+pe],I+=4}z--}return R},d=function(x,S,A,P){let R=x[S+3],I=Math.pow(2,R-128)/255;A[P+0]=x[S+0]*I,A[P+1]=x[S+1]*I,A[P+2]=x[S+2]*I,A[P+3]=1},_=function(x,S,A,P){let R=x[S+3],I=Math.pow(2,R-128)/255;A[P+0]=pt.toHalfFloat(Math.min(x[S+0]*I,65504)),A[P+1]=pt.toHalfFloat(Math.min(x[S+1]*I,65504)),A[P+2]=pt.toHalfFloat(Math.min(x[S+2]*I,65504)),A[P+3]=pt.toHalfFloat(1)},m=new Uint8Array(e);m.pos=0;let p=c(m),{width:g,height:v}=p,M=f(m.subarray(m.pos),g,v),y,b,E;switch(this.type){case Ve:E=M.length/4;let x=new Float32Array(E*4);for(let A=0;A<E;A++)d(M,A*4,x,A*4);y=x,b=Ve;break;case et:E=M.length/4;let S=new Uint16Array(E*4);for(let A=0;A<E;A++)_(M,A*4,S,A*4);y=S,b=et;break;default:throw Error("THREE.HDRLoader: Unsupported type: "+this.type)}return{width:g,height:v,data:y,header:p.string,gamma:p.gamma,exposure:p.exposure,type:b,colorSpace:vi,minFilter:Ye,magFilter:Ye,generateMipmaps:!1,flipY:!0}}setDataType(e){return this.type=e,this}}Xe.enabled=!1;var Fu={},Or=new Map;function Ur(e){if(!e||!e.image)return null;let t=Or.get(e.uuid);if(t)return t;return t=new zt(e.image),t.wrapS=e.wrapS===1000?Kt:e.wrapS===1002?or:Bt,t.wrapT=e.wrapT===1000?Kt:e.wrapT===1002?or:Bt,t.repeat.copy(e.repeat),t.offset.copy(e.offset),t.center.copy(e.center),t.rotation=e.rotation,t.flipY=e.flipY,t.colorSpace=e.encoding===3001?Es:oi,t.anisotropy=4,t.needsUpdate=!0,Or.set(e.uuid,t),t}var Co=new Map,Ky=/^(fabric|linen|duvet|uph|towel|accent)$/,Qy=/^(lacq|front|doorInt|doorPan|trim|plinth)$/;function jy(e,t,n){if(Ky.test(t))e.roughness=1;else if(Qy.test(t))e.clearcoat=0.35,e.clearcoatRoughness=0.22;else if(t==="cer"||t==="screen")e.clearcoat=1,e.clearcoatRoughness=0.04;else if(t==="top")e.clearcoat=0.6,e.clearcoatRoughness=0.15;else if(t==="wood"||t==="woodD")e.clearcoat=0.18,e.clearcoatRoughness=0.35;else if(t==="leaf"||t==="leaf2")e.roughness=0.55;else if(n&&n.floor&&e.roughness<=0.62)e.clearcoat=0.4,e.clearcoatRoughness=0.16}function eS(e,t){let n=Co.get(e.uuid);if(n)return n;let i=(s)=>new Ae(s.r,s.g,s.b);if(n=new Ea({color:e.color?i(e.color):new Ae(1,1,1),roughness:e.roughness!==void 0?e.roughness:0.8,metalness:e.metalness!==void 0?e.metalness:0,map:Ur(e.map),normalMap:Fu.noNormals?null:Ur(e.normalMap),roughnessMap:Ur(e.roughnessMap),alphaMap:Ur(e.alphaMap),emissive:e.emissive?i(e.emissive):new Ae(0,0,0),emissiveIntensity:e.emissiveIntensity||1,emissiveMap:Ur(e.emissiveMap),transparent:!!e.transparent,opacity:e.opacity!==void 0?e.opacity:1,side:e.side===2?rn:e.side===1?Ut:Tn}),e.normalScale)n.normalScale.set(e.normalScale.x,e.normalScale.y);if(!Fu.plain)jy(n,e.name||"",t);if(e.transparent&&e.opacity<0.35&&e.roughness<0.2)n.transparent=!1,n.opacity=1,n.transmission=1,n.ior=1.5,n.thickness=0.01,n.roughness=0.02,n.color.setRGB(1,1,1);else if(e.transparent&&e.roughness<=0.06)n.transparent=!1,n.opacity=1,n.transmission=0.9,n.ior=1.33,n.thickness=1.2,n.attenuationColor=new Ae(0.55,0.8,0.85),n.attenuationDistance=2;return Co.set(e.uuid,n),n}var Nu=new Map;function tS(e){let t=Nu.get(e.uuid);if(t)return t;t=new Tt;for(let n of["position","normal","uv"]){let i=e.attributes[n];if(i)t.setAttribute(n,new st(i.array,i.itemSize,i.normalized))}if(e.index)t.setIndex(new st(e.index.array,1));if(e.groups)for(let n of e.groups)t.addGroup(n.start,n.count,n.materialIndex);return Nu.set(e.uuid,t),t}function nS(e,t,n){let i=e.attributes.position,s=e.attributes.normal,r=e.attributes.uv,a=e.index?e.index.array:null,o=new Pe().fromArray(t.elements),l=new Fe().getNormalMatrix(o),u=new L,h=new L,c=n.map((y)=>[y.normal.x,y.normal.y,y.normal.z,y.constant]),f=e.groups&&e.groups.length?e.groups:[{start:0,count:a?a.length:i.count,materialIndex:0}],d=[],_=[],m=[],p=[],g=(y)=>{u.fromBufferAttribute(i,y).applyMatrix4(o);let b={p:[u.x,u.y,u.z]};if(s)h.fromBufferAttribute(s,y).applyMatrix3(l).normalize(),b.n=[h.x,h.y,h.z];if(r)b.u=[r.getX(y),r.getY(y)];return b},v=(y,b,E)=>{let x={p:y.p.map((S,A)=>S+(b.p[A]-S)*E)};if(y.n)x.n=y.n.map((S,A)=>S+(b.n[A]-S)*E);if(y.u)x.u=y.u.map((S,A)=>S+(b.u[A]-S)*E);return x};for(let y of f){let b=d.length/3,E=Math.min(y.start+y.count,a?a.length:i.count);for(let x=y.start;x+2<E;x+=3){let S=[0,1,2].map((A)=>g(a?a[x+A]:x+A));for(let A of c){let P=S.map((I)=>A[0]*I.p[0]+A[1]*I.p[1]+A[2]*I.p[2]+A[3]);if(P.every((I)=>I>=0))continue;if(P.every((I)=>I<0)){S=[];break}let R=[];for(let I=0;I<S.length;I++){let F=(I+1)%S.length;if(P[I]>=0)R.push(S[I]);if(P[I]>=0!==P[F]>=0)R.push(v(S[I],S[F],P[I]/(P[I]-P[F])))}if(S=R,S.length<3){S=[];break}}for(let A=1;A+1<S.length;A++)for(let P of[S[0],S[A],S[A+1]]){if(d.push(...P.p),s)_.push(...P.n);if(r)m.push(...P.u)}}p.push({start:b,count:d.length/3-b,materialIndex:y.materialIndex})}let M=new Tt;if(M.setAttribute("position",new Zt(d,3)),s)M.setAttribute("normal",new Zt(_,3));if(r)M.setAttribute("uv",new Zt(m,2));if(e.groups&&e.groups.length)for(let y of p)M.addGroup(y.start,y.count,y.materialIndex);return M}function iS(e,t){let n=new Rs;e.updateMatrixWorld(!0);let i=(s)=>{for(let r=s;r;r=r.parent)if(!r.visible)return!1;return!0};return e.traverse((s)=>{if(s.isDirectionalLight&&s.intensity>0.5&&i(s)&&t.sun!==!1){let h=new Da(new Ae(s.color.r,s.color.g,s.color.b),s.intensity*Math.PI*(t.sun||1)),c=new L().setFromMatrixPosition(s.matrixWorld),f=new L().setFromMatrixPosition(s.target.matrixWorld);h.position.copy(c),h.target.position.copy(f),n.add(h),n.add(h.target),h.updateMatrixWorld(),h.target.updateMatrixWorld();return}if(!s.isMesh||s.isInstancedMesh||!i(s)||!s.geometry||!s.geometry.attributes||!s.geometry.attributes.position)return;let r=Array.isArray(s.material)?s.material:[s.material];if(r.some((h)=>!h||h.isMeshBasicMaterial&&(h.transparent||h.color&&h.color.r+h.color.g+h.color.b<0.05)))return;if(r.some((h)=>h.isMeshBasicMaterial&&t.skipBasic))return;let a=r.map((h)=>h.isMeshBasicMaterial?new yi({color:new Ae(h.color.r,h.color.g,h.color.b)}):eS(h,s.userData)),o=r.find((h)=>h.clippingPlanes&&h.clippingPlanes.length),l=o?nS(s.geometry,s.matrixWorld,o.clippingPlanes):tS(s.geometry);if(!l.attributes.position.count)return;let u=new dn(l,Array.isArray(s.material)?a:a[0]);if(u.matrixAutoUpdate=!1,!o)u.matrix.fromArray(s.matrixWorld.elements);u.matrixWorld.copy(u.matrix),n.add(u)}),n}function sm(e,t,n){let i=pt,s=n>>1,r=Math.max(2,n>>6),a=0,o=0,l=0,u=0;for(let f=0;f<s;f+=2){let d=Math.sin((f+0.5)/n*Math.PI);for(let _=0;_<t;_+=2){let m=(f*t+_)*4;a+=i.fromHalfFloat(e[m])*d,o+=i.fromHalfFloat(e[m+1])*d,l+=i.fromHalfFloat(e[m+2])*d,u+=d}}let h=0.22/u,c=[a*h*0.95,o*h,l*h*0.8].map((f)=>i.toHalfFloat(f));for(let f=s;f<n;f++){let d=Math.min(1,(f-s+1)/r);for(let _=0;_<t;_++){let m=(f*t+_)*4;for(let p=0;p<3;p++)e[m+p]=d>=1?c[p]:i.toHalfFloat(i.fromHalfFloat(e[m+p])*(1-d)+i.fromHalfFloat(c[p])*d)}}}async function sS(e){let t=await fetch(e);if(!t.ok)throw Error("hdr");let n=await t.arrayBuffer();if(!new TextDecoder().decode(new Uint8Array(n,0,Math.min(10,n.byteLength))).startsWith("#?"))throw Error("hdr");let s=new Lu().setDataType(et).parse(n);if(!s||!s.data||!s.width)throw Error("hdr");sm(s.data,s.width,s.height);let r=new ht(s.data,s.width,s.height,ke,s.type);return r.colorSpace=vi,r.minFilter=Ye,r.magFilter=Ye,r.generateMipmaps=!1,r.flipY=!0,r.needsUpdate=!0,r}async function rS(e){let t=await new Promise((h,c)=>{let f=new Image;f.onload=()=>h(f),f.onerror=c,f.src=e}),n=Math.min(1024,t.naturalWidth),i=Math.round(n*t.naturalHeight/t.naturalWidth),s=document.createElement("canvas");s.width=n,s.height=i;let r=s.getContext("2d");r.drawImage(t,0,0,n,i);let a=r.getImageData(0,0,n,i).data,o=new Uint16Array(n*i*4),l=(h)=>(h/=255,h<=0.04045?h/12.92:Math.pow((h+0.055)/1.055,2.4));for(let h=0;h<i;h++)for(let c=0;c<n;c++){let f=(h*n+c)*4,d=f;for(let _=0;_<3;_++)o[d+_]=pt.toHalfFloat(l(a[f+_])*1.35);o[d+3]=pt.toHalfFloat(1)}sm(o,n,i);let u=new ht(o,n,i,ke,et);return u.colorSpace=vi,u.minFilter=Ye,u.magFilter=Ye,u.generateMipmaps=!1,u.flipY=!0,u.needsUpdate=!0,u}var Io=null,St=null,nm={uniforms:{map:{value:null},px:{value:new Te},bloom:{value:0.3},thr:{value:1},vig:{value:0.22},grain:{value:0.016},wb:{value:new L(1,1,1)}},vertexShader:"varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4( position.xy, 0.0, 1.0 ); }",fragmentShader:`
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
		}`},aS={aces:Oi,agx:sr,neutral:rr};function Uu(){if(Io)Io.stop=!0}function oS(e,t){if(St&&(St.canvas!==e||St.renderer.getContext().isContextLost())){try{St.dq.material.dispose(),St.pt.dispose(),St.renderer.dispose()}catch(l){}St=null}if(St)return St;let n=new Ac({canvas:e,antialias:!1,preserveDrawingBuffer:!0,powerPreference:"high-performance"});n.setPixelRatio(1),n.toneMapping=Oi,n.outputColorSpace=Es;let i=new Pu(n);Object.assign(i._pathTracer.material.defines,{RANDOM_TYPE:0,FEATURE_DOF:0,FEATURE_FOG:0,FEATURE_BACKGROUND_MAP:1}),i.filterGlossyFactor=0.5,i.minSamples=1,i.renderScale=1,i.renderDelay=0,i.fadeDuration=0,i.rasterizeScene=!1;let s=t.mobile?512:1024;i.textureSize.set(s,s);let r=new un(new Du({map:null,blending:Ot,premultipliedAlpha:n.getContextAttributes().premultipliedAlpha})),a=new At(1,1,{type:et,minFilter:Ye,magFilter:Ye,depthBuffer:!1}),o=new un(new kt({...nm,uniforms:Aa.clone(nm.uniforms),depthTest:!1,depthWrite:!1}));return St={canvas:e,renderer:n,pt:i,dq:r,rt:a,pq:o,dn:[1.2,0.035],look:{},draw:!1,env:null,envUrl:"",scene:null,compiled:!1},i.renderToCanvasCallback=(l,u,h)=>{if(!St.draw)return;St.draw=!1;let c=r.material,f=i.samples;c.map=h.material.map,c.sigma=Math.max(St.dn[0],5.5-f/40),c.threshold=Math.min(0.2,Math.max(St.dn[1],0.3/Math.sqrt(f))),c.kSigma=1;let d=u.autoClear,_=u.getRenderTarget(),m=St.look,p=o.material.uniforms;if(m.off){u.autoClear=!1,r.render(u),u.autoClear=d;return}u.setRenderTarget(a),r.render(u),u.setRenderTarget(_),p.map.value=a.texture,p.px.value.set(1/a.width,1/a.height),p.bloom.value=m.bloom??0.3,p.thr.value=(m.thr??0.9)/u.toneMappingExposure,p.vig.value=m.vig??0.22,p.grain.value=m.grain??0.016,p.wb.value.fromArray(m.wb||[1,1,1]),u.autoClear=!1,o.render(u),u.autoClear=d},St}function rm(e){let t=aS[e.look.tm]||Oi;if(e.renderer.toneMapping!==t)e.renderer.toneMapping=t,e.pq.material.needsUpdate=!0,e.dq.material.needsUpdate=!0}function lS(e){let t=e.getRenderTarget();e.setRenderTarget(null),e.setScissorTest(!0),e.setScissor(0,0,0,0),e.clear(!0,!1,!1),e.setScissorTest(!1),e.setRenderTarget(t)}function im(e){if(e)e.traverse((t)=>{if(t.geometry)t.geometry.dispose()})}async function cS(e,t){if(e.env&&e.envUrl===t)return e.env;let n=null;try{n=await sS(t+".hdr")}catch(i){n=null}if(!n)try{n=await rS(t+".jpg")}catch(i){n=null}if(n){if(n.mapping=Gn,e.env)e.env.dispose();e.env=n,e.envUrl=t}return n}async function am(e){Uu();let t={stop:!1};Io=t,Fu=e,Or.clear(),Co.clear(),Nu.clear();let{canvas:n,w:i,h:s}=e,r=e.onStage||(()=>{}),a=performance.now(),o=oS(n,e),{renderer:l,pt:u}=o;if(r("engine",performance.now()-a),l.setSize(i,s,!1),l.toneMappingExposure=e.exposure||1,o.dn=e.denoise||[1.2,0.035],o.look=e.look||{},rm(o),o.rt.setSize(i,s),e.preview)try{let S=new ba(e.preview);S.colorSpace=Es;let A=new un(new yi({map:S,toneMapped:!1,color:new Ae(0.4,0.4,0.4)})),P=l.autoClear;l.setRenderTarget(null),l.autoClear=!1,A.render(l),l.autoClear=P,A.material.dispose(),A.dispose(),S.dispose()}catch(S){}r("preview",performance.now()-a);let h=iS(e.scene,e);r("conv "+Or.size+" tex "+Co.size+" mat",performance.now()-a);let c=new Yt(e.cam.fov,i/s,e.cam.near,e.cam.far);c.position.fromArray(e.cam.p),c.quaternion.fromArray(e.cam.q),c.updateMatrixWorld();let f=await cS(o,e.env);if(t.stop)return im(h),{samples:0,url:null};if(f)h.environment=f,h.background=f,h.environmentIntensity=e.envIntensity||1,h.backgroundIntensity=e.envIntensity||1;if(e.envRotation)h.environmentRotation.y=e.envRotation,h.backgroundRotation.y=e.envRotation;if(e.bg)h.background=new Ae(e.bg[0],e.bg[1],e.bg[2]);for(let S of e.lights||[]){let A=new La(16773340,S.i,S.w,S.d);A.position.set(S.x,S.y,S.z),A.lookAt(S.x,S.y-1,S.z),A.updateMatrixWorld(),h.add(A)}u.bounces=e.bounces||4,u.transmissiveBounces=e.tBounces||4;let d=e.tiles||(e.mobile?2:1);u.tiles.set(d,d);let _=u._pathTracer.material;u.setScene(h,c),im(o.scene),o.scene=h;for(let S of Or.values())S.dispose();if(r("setScene",performance.now()-a),!o.compiled)o.compiled=!0,_.defines.FEATURE_BACKGROUND_MAP=f?1:0,_.needsUpdate=!0;else _.setDefine("FEATURE_BACKGROUND_MAP",f?1:0);let m=e.samples||200,p=e.budget||30000,g=d*d,v=(e.mobile?2:8)*g,M=0,y=1,b=0,E=0;return await new Promise((S)=>{let A=()=>{if(Io===t&&M){o.draw=!0,u.pausePathTracing=!0;try{u.renderSample()}catch(R){}u.pausePathTracing=!1,o.draw=!1}S()},P=(R)=>{if(t.stop)return A();if(M&&E){let C=R-E;if(C>80)y=Math.max(1,y>>1);else if(C>40)y=Math.max(1,y-1);else if(C<20)y=Math.min(v,y+1)}E=R;for(let C=0;C<y;C++){let O=u.samples;if(!M&&Math.floor(O)>=1)M=performance.now(),r("firstSample",M-a);if(C===y-1&&M&&performance.now()-b>250&&Math.floor(O)>=2)o.draw=!0,b=performance.now();u.renderSample(),o.draw=!1}lS(l);let I=Math.floor(u.samples),F=M?performance.now()-M:0;if(e.onProgress)e.onProgress(I,m,F,Math.min(1,Math.max(I/m,F/p)));if(I>=m||M&&F>=p)return r("end "+I+" per "+y,performance.now()-a),A();requestAnimationFrame(P)};requestAnimationFrame(P)}),{samples:u.samples,url:t.stop&&!e.keepOnStop?null:n.toDataURL("image/jpeg",0.92)}}function om(e,t,n){if(!St)return null;if(e)St.dn=e;if(t)St.look=t,rm(St);if(n)St.renderer.toneMappingExposure=n;return St.draw=!0,St.pt.pausePathTracing=!0,St.pt.renderSample(),St.pt.pausePathTracing=!1,St.draw=!1,St.canvas.toDataURL("image/jpeg",0.92)}if(typeof window<"u")window.CasoPhoto={casoPhoto:am,stop:Uu,redraw:om};})();
