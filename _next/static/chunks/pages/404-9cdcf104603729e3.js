(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[2197],{6141:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/404",function(){return n(33473)}])},33473:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return x}});var i=n(14288),o=n(67294),r=n(11163),s=n(97183),l=n(22850),a=n(71577),d=n(99477);class c extends d.aNw{constructor(e){super(e)}load(e,t,n,i){let o=this,r=new d.hH6(this.manager);r.setPath(this.path),r.setRequestHeader(this.requestHeader),r.setWithCredentials(this.withCredentials),r.load(e,function(e){let n=o.parse(JSON.parse(e));t&&t(n)},n,i)}parse(e){return new u(e)}}class u{constructor(e){this.isFont=!0,this.type="Font",this.data=e}generateShapes(e,t=100){let n=[],i=function(e,t,n){let i=Array.from(e),o=t/n.resolution,r=(n.boundingBox.yMax-n.boundingBox.yMin+n.underlineThickness)*o,s=[],l=0,a=0;for(let e=0;e<i.length;e++){let t=i[e];if("\n"===t)l=0,a-=r;else{let e=function(e,t,n,i,o){let r,s,l,a,c,u,h,p;let f=o.glyphs[e]||o.glyphs["?"];if(!f){console.error('THREE.Font: character "'+e+'" does not exists in font family '+o.familyName+".");return}let g=new d.T_1;if(f.o){let e=f._cachedOutline||(f._cachedOutline=f.o.split(" "));for(let o=0,d=e.length;o<d;){let d=e[o++];switch(d){case"m":r=e[o++]*t+n,s=e[o++]*t+i,g.moveTo(r,s);break;case"l":r=e[o++]*t+n,s=e[o++]*t+i,g.lineTo(r,s);break;case"q":l=e[o++]*t+n,a=e[o++]*t+i,c=e[o++]*t+n,u=e[o++]*t+i,g.quadraticCurveTo(c,u,l,a);break;case"b":l=e[o++]*t+n,a=e[o++]*t+i,c=e[o++]*t+n,u=e[o++]*t+i,h=e[o++]*t+n,p=e[o++]*t+i,g.bezierCurveTo(c,u,h,p,l,a)}}}return{offsetX:f.ha*t,path:g}}(t,o,l,a,n);l+=e.offsetX,s.push(e.path)}}return s}(e,t,this.data);for(let e=0,t=i.length;e<t;e++)n.push(...i[e].toShapes());return n}}class h extends d.O7d{constructor(e,t={}){let n=t.font;if(void 0===n)super();else{let i=n.generateShapes(e,t.size);t.depth=void 0!==t.height?t.height:50,void 0===t.bevelThickness&&(t.bevelThickness=10),void 0===t.bevelSize&&(t.bevelSize=8),void 0===t.bevelEnabled&&(t.bevelEnabled=!1),super(i,t)}this.type="TextGeometry"}}var p=n(77836),f=n(54327),g=n(70917),b=n(86159);let v={index:(0,g.iv)({display:"block",width:"100%",height:"100%",overflow:"hidden",backgroundColor:b.Rl.colorPrimary}),content:(0,g.iv)({width:"100%",height:"100%"}),title:(0,g.iv)({position:"absolute",zIndex:1,color:"#fff",fontSize:"20rem",lineHeight:"15rem",fontWeight:"bold",textShadow:"2px 2px rgba(0, 0, 0, 0.5)"}),three:(0,g.iv)({width:"100%",height:"100%",zIndex:0}),description:(0,g.iv)({zIndex:2,position:"absolute",width:"100%",bottom:80,display:"flex",flexDirection:"column",justifyContent:"center"}),descriptionButton:(0,g.iv)({fontSize:"24px",height:"48px",margin:"auto",marginTop:"24px",fontWeight:"bold"})},w=()=>{let e=(0,r.useRouter)(),t=(0,o.useRef)(null);(0,o.useEffect)(()=>{if(!f.Z.isWebGLAvailable()){e.push("/webgl");return}let n=t.current;if(!n)return;let i=new d.SUY,o=n.clientWidth,r=n.clientHeight,s=new d.CP7({antialias:!0,alpha:!0});s.setClearColor(0,0),s.setSize(o,r),n.appendChild(s.domElement);let l=new d.xsS,a=new d.cPb;a.aspect=o/r,a.far=5e3;let u=new d.Mig(16777215,.5);l.add(u);let g=new d.cek(16777215,.5,0);g.position.set(0,400,1500),l.add(g);let b=new d.cek(16777215,.5,0);b.position.set(1500,400,0),l.add(b);let v=new d.ZAu;l.add(v);let w=new p.E;w.load("/models/cone.glb",e=>{let t=e.scene.children[0],n=t.geometry,i=n.getAttribute("position");n.setAttribute("color",new d.TlE(new Float32Array(3*i.count),3));let o=n.attributes.color;for(let e=0;e<i.count;++e){let t=i.getY(e);t>400&&t<500||t>600&&t<700?o.setXYZ(e,1,1,1):o.setXYZ(e,248/255,116/255,46/255)}let r=new d.vBJ({color:16777215,vertexColors:!0,wireframe:!0}),s=new d.Kj0(n,r);s.userData={type:"Cone"},v.add(s);let l=n.boundingSphere;a.position.set(l.center.x+2*l.radius,l.center.y+1.5*l.radius,l.center.z+2*l.radius),a.lookAt(s.position)},e=>console.error(e));let m=new c;m.load("fonts/saira/Saira_Black_Regular.json",e=>{let t=new h("404",{font:e,size:300,height:10,curveSegments:12,bevelEnabled:!0,bevelThickness:10,bevelSize:8,bevelOffset:0,bevelSegments:5}),n=new d.Wid({color:16777215,metalness:.75,roughness:.5}),i=new d.Kj0(t,n);i.userData={type:"Text"},t.computeBoundingBox();let o=new d.Pa4;o.subVectors(t.boundingBox.max,t.boundingBox.min),i.position.set(-100-o.x/2,400-o.y/2,-100-o.z/2),i.rotation.y=Math.PI/4,v.add(i)},()=>{},e=>{console.error("An error happened"),console.error(e)});let x=()=>{setTimeout(()=>requestAnimationFrame(x),1e3/30);let e=i.getDelta(),t=l.children.filter(e=>"Group"===e.type)[0];t&&t.rotateY(.2*e),s.render(l,a)};x();let y=()=>{o=n.clientWidth,r=n.clientHeight,a.aspect=o/r,a.updateProjectionMatrix(),s.setSize(o,r)};return window.addEventListener("resize",y),y(),()=>{l.children.forEach(e=>{"Group"===e.type&&e.children.forEach(e=>{var t;null===(t=e.geometry)||void 0===t||t.dispose()})}),l.clear(),window.removeEventListener("resize",y)}},[e]);let n=(0,o.useCallback)(()=>e.push("/"),[e]);return(0,i.tZ)(s.Z,{css:v.index,children:(0,i.BX)(s.Z.Content,{css:v.content,children:[(0,i.tZ)("div",{ref:t,css:v.three}),(0,i.BX)("div",{css:v.description,children:[(0,i.tZ)(l.Z.Title,{level:1,style:{textAlign:"center"},children:"Page not found"}),(0,i.tZ)(l.Z.Title,{level:3,style:{textAlign:"center"},children:"The requested URL was not found on the server"}),(0,i.tZ)(a.ZP,{type:"primary",css:v.descriptionButton,onClick:n,children:"Return to Home"})]})]})})},m=()=>(0,i.tZ)(w,{});var x=m}},function(e){e.O(0,[3737,4875,992,1577,5256,9774,2888,179],function(){return e(e.s=6141)}),_N_E=e.O()}]);