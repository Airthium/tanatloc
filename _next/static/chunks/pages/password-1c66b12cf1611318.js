(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[8322],{47839:function(e,t,r){(window.__NEXT_P=window.__NEXT_P||[]).push(["/password",function(){return r(18476)}])},59141:function(e,t,r){"use strict";var s;r.d(t,{JT:function(){return a},ah:function(){return l},nq:function(){return n},tE:function(){return i},yL:function(){return o}}),null!==(s=r(83454).env.AUTH_SECRET)&&void 0!==s||Array(33).join("a");let o=6,n=16,a=!0,i=!0,l=!0},21390:function(e,t,r){"use strict";r.d(t,{EQ:function(){return l},kD:function(){return a},o3:function(){return n},x_:function(){return i}});var s,o=r(83454);let n=null!==(s=o.env.EMAIL_TOKEN)&&void 0!==s?s:"",a="subscribe",i="passwordRecovery",l="revalidate"},948:function(e,t,r){"use strict";r.d(t,{R:function(){return u},_:function(){return l}});var s=r(59134),o=r.n(s),n=r(83454);let a=n.env.PORT?parseInt(n.env.PORT):3e3,i=o()()?"http://localhost:"+a:"",l=async(e,t)=>{let r=await fetch(i+e,{method:t?"POST":"GET",headers:{accept:"application/json","Content-Type":"application/json"},...t&&{body:t}}),s=r.headers.get("Content-Type");if(!r.ok){let e=Error("An error occured while fetching data.");throw e.info=(null==s?void 0:s.includes("application/json"))&&await r.json(),e.status=r.status,e}return r.json()},u=async(e,t)=>{var r;let s=await fetch(i+e,{...t,method:null!==(r=null==t?void 0:t.method)&&void 0!==r?r:"GET",headers:{...null==t?void 0:t.headers,"Content-Type":"application/json"}}),o=s.headers.get("Content-Type");if(!s.ok){let e=Error("An error occured while fetching data.");throw e.info=(null==o?void 0:o.includes("application/json"))&&await s.json(),e.status=s.status,e}return s}},77547:function(e,t,r){"use strict";r.d(t,{H:function(){return s}});class s extends Error{constructor(e){var t;super(e.title),this.title=e.title,this.name="APIError",this.render=e.render,this.err=e.err,this.type=null!==(t=e.type)&&void 0!==t?t:"error"}}},84526:function(e,t,r){"use strict";r.d(t,{Z:function(){return a}});var s=r(948);let o=async(e,t)=>{let r=await (0,s.R)("/api/link",{method:"POST",headers:{Accept:"application/json"},body:JSON.stringify({id:e,data:t})});return r.json()},n=async(e,t)=>{await (0,s.R)("/api/link",{method:"PUT",body:JSON.stringify({id:e,data:t})})};var a={get:o,process:n}},751:function(e,t,r){"use strict";r.d(t,{Z:function(){return i}});var s=r(59734),o=r(67294),n=r(948);let a=async e=>{await (0,n.R)("/api/system",{method:"PUT",body:JSON.stringify(e)})};var i={useSystem:()=>{var e;let{data:t,error:r,mutate:a}=(0,s.ZP)("/api/system",n._),i=null!==(e=null==t?void 0:t.system)&&void 0!==e?e:{},l=(0,o.useCallback)(async e=>{await a({system:{...i,...e}})},[i,a]);return[i,{mutateSystem:l,errorSystem:r,loadingSystem:!t}]},update:a}},55798:function(e,t,r){"use strict";r.d(t,{o:function(){return w}});var s=r(85893),o=r(97538),n=r(51024),a=r(59141),i=r(751);let l={password:"Please enter a password",passwordTooSmall:e=>"Your password is too small (minimum "+e+" characters)",passwordTooLong:e=>"Your password is too long (maximum "+e+" characters)",passwordRequireLetter:"Your password must contain a letter",passwordRequireNumber:"Your password must contain a number",passwordRequireSymbol:"Your password must contain a symbol"},u=(e,t)=>!(t.length<e),d=(e,t)=>!(t.length>e),c=(e,t)=>-1!==e.search(t),p=(e,t)=>{var r,s;return(null!==(s=null==e?void 0:null===(r=e.password)||void 0===r?void 0:r.requireLetter)&&void 0!==s?!s:!a.JT)||c(t,/[a-zA-Z]/)},m=(e,t)=>{var r,s;return(null!==(s=null==e?void 0:null===(r=e.password)||void 0===r?void 0:r.requireNumber)&&void 0!==s?!s:!a.tE)||c(t,/\d/)},h=(e,t)=>{var r,s;return(null!==(s=null==e?void 0:null===(r=e.password)||void 0===r?void 0:r.requireSymbol)&&void 0!==s?!s:!a.ah)||c(t,/[!@#$%^&*(){}[\]<>?/|.:;_-]/)},y=(e,t,r,s)=>{u(e,r)||s.push(l.passwordTooSmall(e)),d(t,r)||s.push(l.passwordTooLong(t))},_=(e,t,r)=>{p(e,t)||r.push(l.passwordRequireLetter),m(e,t)||r.push(l.passwordRequireNumber),h(e,t)||r.push(l.passwordRequireSymbol)};var w=e=>{var t,r,u,d;let{labelCol:c,wrapperCol:p,name:m,label:h,inputPlaceholder:w,inputAutoComplete:v,edit:f,style:g,required:x}=e,[j]=i.Z.useSystem(),b=null!==(u=null==j?void 0:null===(t=j.password)||void 0===t?void 0:t.min)&&void 0!==u?u:a.yL,P=null!==(d=null==j?void 0:null===(r=j.password)||void 0===r?void 0:r.max)&&void 0!==d?d:a.nq;return(0,s.jsx)(o.Z.Item,{labelCol:c,wrapperCol:p,name:null!=m?m:"password",label:null!=h?h:"Password",rules:[()=>({validator(e,t){let r=[];return f&&"******"===t?Promise.resolve():t?(y(b,P,t,r),_(j,t,r),r.length)?Promise.reject(r):Promise.resolve():Promise.reject(l.password)}}),{required:!!x,message:""}],style:g,children:(0,s.jsx)(n.default.Password,{placeholder:w,autoComplete:v})})}},64352:function(e,t,r){"use strict";r.d(t,{u:function(){return s}});let s=e=>{e().catch(console.error)}},18476:function(e,t,r){"use strict";r.r(t),r.d(t,{default:function(){return q}});var s=r(85893),o=r(67294),n=r(11163),a=r(65400),i=r.n(a),l=r(70302),u=r(97538),d=r(51024),c=r(16373),p=r(74048),m=r(89552),h=r(53740),y=r(21390),_=r(8061),w=r(54509),v=r(64352),f=r(55798),g=r(22361),x=r(77547),j=r(84526),b=r(35304),P=r.n(b),T=r(72441),C=r.n(T);let S={wrongLink:"Wrong link",incorrect:"Incorrect data",internal:"Internal error, please try again shortly",passwordMismatch:"Passwords mismatch"},k=async(e,t,r,s)=>{if(s.email!==t)throw new x.H({title:S.incorrect});try{await j.Z.process(r,{email:s.email,password:s.password}),await e.push("/login").catch()}catch(e){throw new x.H({title:S.internal,err:e})}};var E=()=>{let[e,t]=(0,o.useState)(!0),[r,a]=(0,o.useState)(),[x,b]=(0,o.useState)(!1),[T,E]=(0,o.useState)(),{dispatch:q}=(0,o.useContext)(_.uj),N=(0,n.useRouter)(),{id:Z}=N.query;(0,o.useEffect)(()=>{(0,v.u)(async()=>{if(Z)try{let e=await j.Z.get(Z,["type","email"]);e.type===y.x_?(a(e.email),t(!1)):q((0,w.iT)({title:S.wrongLink}))}catch(e){q((0,w.iT)({title:S.internal,err:e}))}})},[Z,q]);let L=(0,o.useCallback)(e=>{(0,v.u)(async()=>{b(!0);try{await k(N,r,Z,e)}catch(e){E(e),b(!1)}})},[N,r,Z]);return e?(0,s.jsx)(c.Z,{children:(0,s.jsxs)(l.Z,{bordered:!1,className:C().password,children:[(0,s.jsx)(m.default,{})," Loading..."]})}):(0,s.jsx)(c.Z,{children:(0,s.jsx)(l.Z,{bordered:!1,className:C().password,children:(0,s.jsxs)(p.default,{direction:"vertical",size:"large",className:P().fullWidth,children:[(0,s.jsx)("div",{children:(0,s.jsx)(h.Z.Title,{level:1,style:{padding:0,marginBottom:16,fontWeight:500},children:"Password recovery"})}),(0,s.jsxs)(u.Z,{requiredMark:"optional",onFinish:L,layout:"vertical",children:[(0,s.jsx)(u.Z.Item,{name:"email",label:"Enter your email address",rules:[{required:!0,message:"Email is required"}],children:(0,s.jsx)(d.default,{placeholder:"Email address",autoComplete:"email"})}),(0,s.jsx)(f.o,{name:"password",label:"Choose your password",inputPlaceholder:"Password",style:{marginBottom:"14px"}}),(0,s.jsx)(u.Z.Item,{name:"passwordConfirmation",label:"Confirm your password",rules:[{required:!0,message:"Password confirmation is required"},e=>{let{getFieldValue:t}=e;return{validator:(e,r)=>r&&t("password")!==r?Promise.reject(S.passwordMismatch):Promise.resolve()}}],style:{marginBottom:"14px"},children:(0,s.jsx)(d.default.Password,{placeholder:"Password"})}),(0,s.jsx)(g.Xq,{error:T}),(0,s.jsx)(u.Z.Item,{className:C().submit,children:(0,s.jsx)(i(),{type:"primary",loading:x,htmlType:"submit",children:"Finish"})})]})]})})})},q=()=>(0,s.jsx)(E,{})},72441:function(e){e.exports={password:"password_password__ju1vM",submit:"password_submit__bQX9G"}},35304:function(e){e.exports={variables:'"./variables.css"',colorPrimary:"#fad114",textColorDark:"rgba(0, 0, 0, 0.65)",textColorLight:"rgba(0, 0, 0, 0.45)",logo:"styles_logo__a_88m",displayNone:"styles_displayNone__X5JML",displayFlex:"styles_displayFlex__pvl0H",fullWidth:"styles_fullWidth__ig6Zi",fullHeight:"styles_fullHeight__aD1qp",noScroll:"styles_noScroll__jJYvq",scroll:"styles_scroll___zuDw",noBackground:"styles_noBackground__QOpQc",noBorder:"styles_noBorder__T5mw6",noBorderBottom:"styles_noBorderBottom__5ori7",textWhite:"styles_textWhite__yojx2",textLight:"styles_textLight__QglC7",textDark:"styles_textDark__xPmmk",textOrange:"styles_textOrange__TYZ4a",textGreen:"styles_textGreen__M8GsP",textAlignLeft:"styles_textAlignLeft__Da1jw",textAlignCenter:"styles_textAlignCenter__DSN8m",primaryColor:"styles_primaryColor__lHC0K",backgroundPrimary:"styles_backgroundPrimary__5S8pd"}}},function(e){e.O(0,[6373,9003,1350,302,1024,9734,9774,2888,179],function(){return e(e.s=47839)}),_N_E=e.O()}]);