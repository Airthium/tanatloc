(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[8322],{47839:function(e,r,t){(window.__NEXT_P=window.__NEXT_P||[]).push(["/password",function(){return t(18476)}])},59141:function(e,r,t){"use strict";var s;t.d(r,{JT:function(){return n},ah:function(){return l},nq:function(){return a},tE:function(){return i},yL:function(){return o}}),null!==(s=t(83454).env.AUTH_SECRET)&&void 0!==s||Array(33).join("a");let o=6,a=16,n=!0,i=!0,l=!0},21390:function(e,r,t){"use strict";t.d(r,{EQ:function(){return l},kD:function(){return n},o3:function(){return a},x_:function(){return i}});var s,o=t(83454);let a=null!==(s=o.env.EMAIL_TOKEN)&&void 0!==s?s:"",n="subscribe",i="passwordRecovery",l="revalidate"},948:function(e,r,t){"use strict";t.d(r,{R:function(){return call},_:function(){return fetcher}});var s=t(59134),o=t.n(s),a=t(83454);let n=a.env.PORT?parseInt(a.env.PORT):3e3,i=o()()?"http://localhost:"+n:"",fetcher=async(e,r)=>{let t=await fetch(i+e,{method:r?"POST":"GET",headers:{accept:"application/json","Content-Type":"application/json"},...r&&{body:r}}),s=t.headers.get("Content-Type");if(!t.ok){let e=Error("An error occured while fetching data.");throw e.info=(null==s?void 0:s.includes("application/json"))&&await t.json(),e.status=t.status,e}return t.json()},call=async(e,r)=>{var t;let s=await fetch(i+e,{...r,method:null!==(t=null==r?void 0:r.method)&&void 0!==t?t:"GET",headers:{...null==r?void 0:r.headers,"Content-Type":"application/json"}}),o=s.headers.get("Content-Type");if(!s.ok){let e=Error("An error occured while fetching data.");throw e.info=(null==o?void 0:o.includes("application/json"))&&await s.json(),e.status=s.status,e}return s}},77547:function(e,r,t){"use strict";t.d(r,{H:function(){return APIError}});let APIError=class APIError extends Error{constructor(e){var r;super(e.title),this.title=e.title,this.name="APIError",this.render=e.render,this.err=e.err,this.type=null!==(r=e.type)&&void 0!==r?r:"error"}}},84526:function(e,r,t){"use strict";t.d(r,{Z:function(){return o}});var s=t(948);let get=async(e,r)=>{let t=await (0,s.R)("/api/link",{method:"POST",headers:{Accept:"application/json"},body:JSON.stringify({id:e,data:r})});return t.json()},process=async(e,r)=>{await (0,s.R)("/api/link",{method:"PUT",body:JSON.stringify({id:e,data:r})})};var o={get:get,process:process}},751:function(e,r,t){"use strict";t.d(r,{Z:function(){return n}});var s=t(59734),o=t(67294),a=t(948);let update=async e=>{await (0,a.R)("/api/system",{method:"PUT",body:JSON.stringify(e)})};var n={useSystem:()=>{var e;let{data:r,error:t,mutate:n}=(0,s.ZP)("/api/system",a._),i=null!==(e=null==r?void 0:r.system)&&void 0!==e?e:{},l=(0,o.useCallback)(async e=>{await n({system:{...i,...e}})},[i,n]);return[i,{mutateSystem:l,errorSystem:t,loadingSystem:!r}]},update:update}},55798:function(e,r,t){"use strict";t.d(r,{o:function(){return input_password}});var s=t(85893),o=t(97538),a=t(51024),n=t(59141),i=t(751);let l={password:"Please enter a password",passwordTooSmall:e=>"Your password is too small (minimum "+e+" characters)",passwordTooLong:e=>"Your password is too long (maximum "+e+" characters)",passwordRequireLetter:"Your password must contain a letter",passwordRequireNumber:"Your password must contain a number",passwordRequireSymbol:"Your password must contain a symbol"},_checkMin=(e,r)=>!(r.length<e),_checkMax=(e,r)=>!(r.length>e),_checkRegex=(e,r)=>-1!==e.search(r),_requireLetter=(e,r)=>{var t,s;return(null!==(s=null==e?void 0:null===(t=e.password)||void 0===t?void 0:t.requireLetter)&&void 0!==s?!s:!n.JT)||_checkRegex(r,/[a-zA-Z]/)},_requireNumber=(e,r)=>{var t,s;return(null!==(s=null==e?void 0:null===(t=e.password)||void 0===t?void 0:t.requireNumber)&&void 0!==s?!s:!n.tE)||_checkRegex(r,/\d/)},_requireSymbol=(e,r)=>{var t,s;return(null!==(s=null==e?void 0:null===(t=e.password)||void 0===t?void 0:t.requireSymbol)&&void 0!==s?!s:!n.ah)||_checkRegex(r,/[!@#$%^&*(){}[\]<>?/|.:;_-]/)},_checkSize=(e,r,t,s)=>{_checkMin(e,t)||s.push(l.passwordTooSmall(e)),_checkMax(r,t)||s.push(l.passwordTooLong(r))},_checkFormat=(e,r,t)=>{_requireLetter(e,r)||t.push(l.passwordRequireLetter),_requireNumber(e,r)||t.push(l.passwordRequireNumber),_requireSymbol(e,r)||t.push(l.passwordRequireSymbol)};var input_password=e=>{var r,t,u,d;let{labelCol:c,wrapperCol:p,name:m,label:_,inputPlaceholder:h,inputAutoComplete:y,edit:w,style:v,required:f}=e,[g]=i.Z.useSystem(),x=null!==(u=null==g?void 0:null===(r=g.password)||void 0===r?void 0:r.min)&&void 0!==u?u:n.yL,b=null!==(d=null==g?void 0:null===(t=g.password)||void 0===t?void 0:t.max)&&void 0!==d?d:n.nq;return(0,s.jsx)(o.Z.Item,{labelCol:c,wrapperCol:p,name:null!=m?m:"password",label:null!=_?_:"Password",rules:[()=>({validator(e,r){let t=[];return w&&"******"===r?Promise.resolve():r?(_checkSize(x,b,r,t),_checkFormat(g,r,t),t.length)?Promise.reject(t):Promise.resolve():Promise.reject(l.password)}}),{required:!!f,message:""}],style:v,children:(0,s.jsx)(a.default.Password,{placeholder:h,autoComplete:y})})}},18476:function(e,r,t){"use strict";t.r(r),t.d(r,{default:function(){return password_page}});var s=t(85893),o=t(67294),a=t(11163),n=t(65400),i=t.n(n),l=t(70302),u=t(97538),d=t(51024),c=t(16373),p=t(74048),m=t(89552),_=t(53740),h=t(21390),y=t(8061),w=t(54509),v=t(55798),f=t(27756),g=t(77547),x=t(84526),b=t(35304),j=t.n(b),k=t(72441),P=t.n(k);let T={wrongLink:"Wrong link",incorrect:"Incorrect data",internal:"Internal error, please try again shortly",passwordMismatch:"Passwords mismatch"},_onFinish=async(e,r,t,s)=>{if(s.email!==r)throw new g.H({title:T.incorrect});try{await x.Z.process(t,{email:s.email,password:s.password}),await e.push("/login").catch()}catch(e){throw new g.H({title:T.internal,err:e})}};var components_password=()=>{let[e,r]=(0,o.useState)(!0),[t,n]=(0,o.useState)(),[g,b]=(0,o.useState)(!1),[k,S]=(0,o.useState)(),{dispatch:q}=(0,o.useContext)(y.uj),C=(0,a.useRouter)(),{id:E}=C.query;(0,o.useEffect)(()=>{(async()=>{if(E)try{let e=await x.Z.get(E,["type","email"]);e.type===h.x_?(n(e.email),r(!1)):q((0,w.iT)({title:T.wrongLink}))}catch(e){q((0,w.iT)({title:T.internal,err:e}))}})()},[E,q]);let N=(0,o.useCallback)(e=>{(async()=>{b(!0);try{await _onFinish(C,t,E,e)}catch(e){S(e),b(!1)}})()},[C,t,E]);return e?(0,s.jsx)(c.Z,{children:(0,s.jsxs)(l.Z,{bordered:!1,className:P().password,children:[(0,s.jsx)(m.default,{})," Loading..."]})}):(0,s.jsx)(c.Z,{children:(0,s.jsx)(l.Z,{bordered:!1,className:P().password,children:(0,s.jsxs)(p.default,{direction:"vertical",size:"large",className:j().fullWidth,children:[(0,s.jsx)("div",{children:(0,s.jsx)(_.Z.Title,{level:1,style:{padding:0,marginBottom:16,fontWeight:500},children:"Password recovery"})}),(0,s.jsxs)(u.Z,{requiredMark:"optional",onFinish:N,layout:"vertical",children:[(0,s.jsx)(u.Z.Item,{name:"email",label:"Enter your email address",rules:[{required:!0,message:"Email is required"}],children:(0,s.jsx)(d.default,{placeholder:"Email address",autoComplete:"email"})}),(0,s.jsx)(v.o,{name:"password",label:"Choose your password",inputPlaceholder:"Password",style:{marginBottom:"14px"}}),(0,s.jsx)(u.Z.Item,{name:"passwordConfirmation",label:"Confirm your password",rules:[{required:!0,message:"Password confirmation is required"},e=>{let{getFieldValue:r}=e;return{validator:(e,t)=>t&&r("password")!==t?Promise.reject(T.passwordMismatch):Promise.resolve()}}],style:{marginBottom:"14px"},children:(0,s.jsx)(d.default.Password,{placeholder:"Password"})}),(0,s.jsx)(f.Xq,{error:k}),(0,s.jsx)(u.Z.Item,{className:P().submit,children:(0,s.jsx)(i(),{type:"primary",loading:g,htmlType:"submit",children:"Finish"})})]})]})})})},password_page=()=>(0,s.jsx)(components_password,{})},72441:function(e){e.exports={password:"password_password__ju1vM",submit:"password_submit__bQX9G"}},35304:function(e){e.exports={variables:'"./variables.css"',colorPrimary:"#fad114",textColorDark:"rgba(0, 0, 0, 0.65)",textColorLight:"rgba(0, 0, 0, 0.45)",logo:"styles_logo__a_88m",displayNone:"styles_displayNone__X5JML",displayFlex:"styles_displayFlex__pvl0H",fullWidth:"styles_fullWidth__ig6Zi",fullHeight:"styles_fullHeight__aD1qp",noScroll:"styles_noScroll__jJYvq",scroll:"styles_scroll___zuDw",noBackground:"styles_noBackground__QOpQc",noBorder:"styles_noBorder__T5mw6",noBorderBottom:"styles_noBorderBottom__5ori7",textWhite:"styles_textWhite__yojx2",textLight:"styles_textLight__QglC7",textDark:"styles_textDark__xPmmk",textOrange:"styles_textOrange__TYZ4a",textGreen:"styles_textGreen__M8GsP",textAlignLeft:"styles_textAlignLeft__Da1jw",textAlignCenter:"styles_textAlignCenter__DSN8m",primaryColor:"styles_primaryColor__lHC0K",backgroundPrimary:"styles_backgroundPrimary__5S8pd"}}},function(e){e.O(0,[6373,1350,302,7651,9734,9774,2888,179],function(){return e(e.s=47839)}),_N_E=e.O()}]);