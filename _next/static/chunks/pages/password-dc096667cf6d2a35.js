(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[8322],{90420:function(e,t,r){"use strict";r.d(t,{Z:function(){return l}});var n=r(1413),o=r(67294),s={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M942.2 486.2Q889.47 375.11 816.7 305l-50.88 50.88C807.31 395.53 843.45 447.4 874.7 512 791.5 684.2 673.4 766 512 766q-72.67 0-133.87-22.38L323 798.75Q408 838 512 838q288.3 0 430.2-300.3a60.29 60.29 0 000-51.5zm-63.57-320.64L836 122.88a8 8 0 00-11.32 0L715.31 232.2Q624.86 186 512 186q-288.3 0-430.2 300.3a60.3 60.3 0 000 51.5q56.69 119.4 136.5 191.41L112.48 835a8 8 0 000 11.31L155.17 889a8 8 0 0011.31 0l712.15-712.12a8 8 0 000-11.32zM149.3 512C232.6 339.8 350.7 258 512 258c54.54 0 104.13 9.36 149.12 28.39l-70.3 70.3a176 176 0 00-238.13 238.13l-83.42 83.42C223.1 637.49 183.3 582.28 149.3 512zm246.7 0a112.11 112.11 0 01146.2-106.69L401.31 546.2A112 112 0 01396 512z"}},{tag:"path",attrs:{d:"M508 624c-3.46 0-6.87-.16-10.25-.47l-52.82 52.82a176.09 176.09 0 00227.42-227.42l-52.82 52.82c.31 3.38.47 6.79.47 10.25a111.94 111.94 0 01-112 112z"}}]},name:"eye-invisible",theme:"outlined"},i=r(42135),a=function(e,t){return o.createElement(i.Z,(0,n.Z)((0,n.Z)({},e),{},{ref:t,icon:s}))};a.displayName="EyeInvisibleOutlined";var l=o.forwardRef(a)},99611:function(e,t,r){"use strict";r.d(t,{Z:function(){return l}});var n=r(1413),o=r(67294),s={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 000 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766zm-4-430c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z"}}]},name:"eye",theme:"outlined"},i=r(42135),a=function(e,t){return o.createElement(i.Z,(0,n.Z)((0,n.Z)({},e),{},{ref:t,icon:s}))};a.displayName="EyeOutlined";var l=o.forwardRef(a)},69677:function(e,t,r){"use strict";r.d(t,{Z:function(){return j}});var n=r(94184),o=r.n(n),s=r(67294),i=r(53124),a=r(65223),l=r(47673);let u=e=>{let{getPrefixCls:t,direction:r}=(0,s.useContext)(i.E_),{prefixCls:n,className:u=""}=e,c=t("input-group",n),d=t("input"),[p,m]=(0,l.ZP)(d),f=o()(c,{[`${c}-lg`]:"large"===e.size,[`${c}-sm`]:"small"===e.size,[`${c}-compact`]:e.compact,[`${c}-rtl`]:"rtl"===r},m,u),h=(0,s.useContext)(a.aM),v=(0,s.useMemo)(()=>Object.assign(Object.assign({},h),{isFormItemInput:!1}),[h]);return p(s.createElement("span",{className:f,style:e.style,onMouseEnter:e.onMouseEnter,onMouseLeave:e.onMouseLeave,onFocus:e.onFocus,onBlur:e.onBlur},s.createElement(a.aM.Provider,{value:v},e.children)))};var c=r(82586),d=r(90420),p=r(99611),m=r(98423),f=r(42550),h=r(72922),v=function(e,t){var r={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&0>t.indexOf(n)&&(r[n]=e[n]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols)for(var o=0,n=Object.getOwnPropertySymbols(e);o<n.length;o++)0>t.indexOf(n[o])&&Object.prototype.propertyIsEnumerable.call(e,n[o])&&(r[n[o]]=e[n[o]]);return r};let y=e=>e?s.createElement(p.Z,null):s.createElement(d.Z,null),w={click:"onClick",hover:"onMouseOver"},Z=s.forwardRef((e,t)=>{let{visibilityToggle:r=!0}=e,n="object"==typeof r&&void 0!==r.visible,[a,l]=(0,s.useState)(()=>!!n&&r.visible),u=(0,s.useRef)(null);s.useEffect(()=>{n&&l(r.visible)},[n,r]);let d=(0,h.Z)(u),p=()=>{let{disabled:t}=e;t||(a&&d(),l(e=>{var t;let n=!e;return"object"==typeof r&&(null===(t=r.onVisibleChange)||void 0===t||t.call(r,n)),n}))},{className:Z,prefixCls:g,inputPrefixCls:b,size:C}=e,E=v(e,["className","prefixCls","inputPrefixCls","size"]),{getPrefixCls:P}=s.useContext(i.E_),x=P("input",b),O=P("input-password",g),T=r&&(t=>{let{action:r="click",iconRender:n=y}=e,o=w[r]||"",i=n(a),l={[o]:p,className:`${t}-icon`,key:"passwordIcon",onMouseDown:e=>{e.preventDefault()},onMouseUp:e=>{e.preventDefault()}};return s.cloneElement(s.isValidElement(i)?i:s.createElement("span",null,i),l)})(O),S=o()(O,Z,{[`${O}-${C}`]:!!C}),j=Object.assign(Object.assign({},(0,m.Z)(E,["suffix","iconRender","visibilityToggle"])),{type:a?"text":"password",className:S,prefixCls:x,suffix:T});return C&&(j.size=C),s.createElement(c.Z,Object.assign({ref:(0,f.sQ)(t,u)},j))});var g=r(68795),b=r(71577),C=r(97647),E=r(4173),P=r(96159),x=function(e,t){var r={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&0>t.indexOf(n)&&(r[n]=e[n]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols)for(var o=0,n=Object.getOwnPropertySymbols(e);o<n.length;o++)0>t.indexOf(n[o])&&Object.prototype.propertyIsEnumerable.call(e,n[o])&&(r[n[o]]=e[n[o]]);return r};let O=s.forwardRef((e,t)=>{let r;let{prefixCls:n,inputPrefixCls:a,className:l,size:u,suffix:d,enterButton:p=!1,addonAfter:m,loading:h,disabled:v,onSearch:y,onChange:w,onCompositionStart:Z,onCompositionEnd:O}=e,T=x(e,["prefixCls","inputPrefixCls","className","size","suffix","enterButton","addonAfter","loading","disabled","onSearch","onChange","onCompositionStart","onCompositionEnd"]),{getPrefixCls:S,direction:j}=s.useContext(i.E_),k=s.useContext(C.Z),_=s.useRef(!1),q=S("input-search",n),B=S("input",a),{compactSize:N}=(0,E.ri)(q,j),R=N||u||k,M=s.useRef(null),z=e=>{e&&e.target&&"click"===e.type&&y&&y(e.target.value,e),w&&w(e)},L=e=>{var t;document.activeElement===(null===(t=M.current)||void 0===t?void 0:t.input)&&e.preventDefault()},I=e=>{var t,r;y&&y(null===(r=null===(t=M.current)||void 0===t?void 0:t.input)||void 0===r?void 0:r.value,e)},X=e=>{_.current||h||I(e)},A="boolean"==typeof p?s.createElement(g.Z,null):null,$=`${q}-button`,Y=p||{},H=Y.type&&!0===Y.type.__ANT_BUTTON;r=H||"button"===Y.type?(0,P.Tm)(Y,Object.assign({onMouseDown:L,onClick:e=>{var t,r;null===(r=null===(t=null==Y?void 0:Y.props)||void 0===t?void 0:t.onClick)||void 0===r||r.call(t,e),I(e)},key:"enterButton"},H?{className:$,size:R}:{})):s.createElement(b.ZP,{className:$,type:p?"primary":void 0,size:R,disabled:v,key:"enterButton",onMouseDown:L,onClick:I,loading:h,icon:A},p),m&&(r=[r,(0,P.Tm)(m,{key:"addonAfter"})]);let D=o()(q,{[`${q}-rtl`]:"rtl"===j,[`${q}-${R}`]:!!R,[`${q}-with-button`]:!!p},l),F=e=>{_.current=!0,null==Z||Z(e)},Q=e=>{_.current=!1,null==O||O(e)};return s.createElement(c.Z,Object.assign({ref:(0,f.sQ)(M,t),onPressEnter:X},T,{size:R,onCompositionStart:F,onCompositionEnd:Q,prefixCls:B,addonAfter:r,suffix:d,onChange:z,className:D,disabled:v}))});var T=r(22913);let S=c.Z;S.Group=u,S.Search=O,S.TextArea=T.Z,S.Password=Z;var j=S},33124:function(e,t,r){(window.__NEXT_P=window.__NEXT_P||[]).push(["/password",function(){return r(64117)}])},37404:function(e,t,r){"use strict";r.d(t,{JT:function(){return s},ah:function(){return a},nq:function(){return o},tE:function(){return i},yL:function(){return n}}),r(83454).env.AUTH_SECRET||Array(33).join("a");let n=6,o=16,s=!0,i=!0,a=!0},40287:function(e,t,r){"use strict";r.d(t,{EQ:function(){return a},kD:function(){return s},o3:function(){return o},x_:function(){return i}});var n=r(83454);let o=n.env.EMAIL_TOKEN||"",s="subscribe",i="passwordRecovery",a="revalidate"},11425:function(e,t,r){"use strict";r.d(t,{R:function(){return u},_:function(){return l}});var n=r(59134),o=r.n(n),s=r(83454);let i=s.env.PORT?parseInt(s.env.PORT):3e3,a=o()()?"http://localhost:"+i:"",l=async(e,t)=>{let r=await fetch(a+e,{method:t?"POST":"GET",headers:{accept:"application/json","Content-Type":"application/json"},...t&&{body:t}}),n=r.headers.get("Content-Type");if(!r.ok){let e=Error("An error occured while fetching data.");throw e.info=(null==n?void 0:n.includes("application/json"))&&await r.json(),e.status=r.status,e}return r.json()},u=async(e,t)=>{let r=await fetch(a+e,{...t,method:t&&t.method||"GET",headers:{...t&&t.headers,"Content-Type":"application/json"}}),n=r.headers.get("Content-Type");if(!r.ok){let e=Error("An error occured while fetching data.");throw e.info=(null==n?void 0:n.includes("application/json"))&&await r.json(),e.status=r.status,e}return r}},4415:function(e,t,r){"use strict";r.d(t,{H:function(){return n}});class n extends Error{constructor(e){super(e.title),this.title=e.title,this.name="APIError",this.render=e.render,this.err=e.err,this.type=e.type||"error"}}},26554:function(e,t,r){"use strict";r.d(t,{Z:function(){return i}});var n=r(11425);let o=async(e,t)=>{let r=await (0,n.R)("/api/link",{method:"POST",headers:{Accept:"application/json"},body:JSON.stringify({id:e,data:t})});return r.json()},s=async(e,t)=>{await (0,n.R)("/api/link",{method:"PUT",body:JSON.stringify({id:e,data:t})})};var i={get:o,process:s}},92288:function(e,t,r){"use strict";r.d(t,{Z:function(){return l}});var n=r(59734),o=r(67294),s=r(11425);let i=()=>{let{data:e,error:t,mutate:r}=(0,n.ZP)("/api/system",s._),i=(null==e?void 0:e.system)||{},a=(0,o.useCallback)(e=>{r({system:{...i,...e}})},[i,r]);return[i,{mutateSystem:a,errorSystem:t,loadingSystem:!e}]},a=async e=>{await (0,s.R)("/api/system",{method:"PUT",body:JSON.stringify(e)})};var l={useSystem:i,update:a}},47455:function(e,t,r){"use strict";r.d(t,{o:function(){return w}});var n=r(14288),o=r(96108),s=r(69677),i=r(37404),a=r(92288);let l={password:"Please enter a password",passwordTooSmall:e=>"Your password is too small (minimum "+e+" characters)",passwordTooLong:e=>"Your password is too long (maximum "+e+" characters)",passwordRequireLetter:"Your password must contain a letter",passwordRequireNumber:"Your password must contain a number",passwordRequireSymbol:"Your password must contain a symbol"},u=(e,t)=>!(t.length<e),c=(e,t)=>!(t.length>e),d=(e,t)=>-1!==e.search(t),p=(e,t)=>{var r,n;return(null!==(n=null==e?void 0:null===(r=e.password)||void 0===r?void 0:r.requireLetter)&&void 0!==n?!n:!i.JT)||d(t,/[a-zA-Z]/)},m=(e,t)=>{var r,n;return(null!==(n=null==e?void 0:null===(r=e.password)||void 0===r?void 0:r.requireNumber)&&void 0!==n?!n:!i.tE)||d(t,/\d/)},f=(e,t)=>{var r,n;return(null!==(n=null==e?void 0:null===(r=e.password)||void 0===r?void 0:r.requireSymbol)&&void 0!==n?!n:!i.ah)||d(t,/[!@#$%^&*(){}[\]<>?/|.:;_-]/)},h=(e,t,r,n)=>{u(e,r)||n.push(l.passwordTooSmall(e)),c(t,r)||n.push(l.passwordTooLong(t))},v=(e,t,r)=>{p(e,t)||r.push(l.passwordRequireLetter),m(e,t)||r.push(l.passwordRequireNumber),f(e,t)||r.push(l.passwordRequireSymbol)},y=e=>{var t,r,u,c;let{labelCol:d,wrapperCol:p,name:m,label:f,inputPlaceholder:y,inputAutoComplete:w,edit:Z,style:g,required:b}=e,[C]=a.Z.useSystem(),E=null!==(u=null==C?void 0:null===(t=C.password)||void 0===t?void 0:t.min)&&void 0!==u?u:i.yL,P=null!==(c=null==C?void 0:null===(r=C.password)||void 0===r?void 0:r.max)&&void 0!==c?c:i.nq;return(0,n.tZ)(o.Z.Item,{labelCol:d,wrapperCol:p,name:m||"password",label:f||"Password",rules:[()=>({validator(e,t){let r=[];return Z&&"******"===t?Promise.resolve():t?(h(E,P,t,r),v(C,t,r),r.length)?Promise.reject(r):Promise.resolve():Promise.reject(l.password)}}),{required:!!b,message:""}],style:g,children:(0,n.tZ)(s.Z.Password,{placeholder:y,autoComplete:w})})};var w=y},12271:function(e,t,r){"use strict";let n,o;r.d(t,{lt:function(){return y},Xq:function(){return b},Ur:function(){return a}});var s=r(33009);let i=(e,t)=>{s.Z.success({message:e,description:t,duration:10})};var a=i,l=r(14288),u=r(22850),c=r(15045),d=r(26713),p=r(71577),m=r(79074),f=r(51908);m.S1({dsn:"https://3bb27cb32e55433696022ba93cb32430@o394613.ingest.sentry.io/5428383"});let h=[],v=()=>{n&&(s.Z.destroy(n),n=void 0),h.forEach(e=>s.Z.destroy(e)),h.length=0,s.Z.destroy(o),o=void 0};var y=function(e,t){let r=!(arguments.length>2)||void 0===arguments[2]||arguments[2];if((null==t?void 0:t.message)==="Failed to fetch"){if(!n){let e="server_error";h.push(e),s.Z.error({key:e,message:"Server error",description:"Server is disconnected, please check your internet connection.",duration:0,onClose:()=>{n=void 0}}),n=e}return}if(r){var i,a;let r="error_"+h.length;h.push(r),s.Z.error({key:r,message:e,description:t&&(0,l.BX)(l.HY,{children:[(0,l.tZ)(u.Z.Text,{code:!0,children:t.message}),(t.status||t.info)&&(0,l.tZ)(c.Z,{children:(0,l.tZ)(c.Z.Panel,{header:"More information",children:(0,l.BX)(d.Z,{direction:"vertical",children:[t.status&&(0,l.BX)(u.Z.Text,{children:["Status: ",t.status]}),(null===(i=t.info)||void 0===i?void 0:i.message)&&(0,l.BX)(u.Z.Text,{children:["Description: ",null===(a=t.info)||void 0===a?void 0:a.message]})]})},"information")})]}),duration:0})}if(t&&console.error(t),t&&f.captureException(t),h.length>1&&!o){let e="close_all";s.Z.info({key:e,message:(0,l.tZ)(p.ZP,{type:"primary",onClick:v,children:"Close all"}),description:"Close all error notifications",duration:0,placement:"top"}),o=e}},w=r(96108),Z=r(99138);let g=e=>{var t,r;let{error:n}=e;return n?(0,l.tZ)(w.Z.Item,{children:(0,l.tZ)(Z.Z,{message:n.render||n.title,type:n.type,showIcon:!0,description:n.err&&(0,l.BX)(l.HY,{children:[n.err.message&&(0,l.BX)(u.Z.Text,{type:"danger",children:["Message: ",(0,l.tZ)("code",{children:n.err.message})]}),n.err.status&&(0,l.BX)(l.HY,{children:[(0,l.tZ)("br",{}),(0,l.BX)(u.Z.Text,{type:"danger",children:["Status: ",(0,l.tZ)("code",{children:n.err.status})]})]}),(null===(t=n.err.info)||void 0===t?void 0:t.message)&&(0,l.BX)(l.HY,{children:[(0,l.tZ)("br",{}),(0,l.BX)(u.Z.Text,{type:"danger",children:["Information: ",(0,l.tZ)("code",{children:null===(r=n.err.info)||void 0===r?void 0:r.message})]})]})]})})}):null};var b=g},64117:function(e,t,r){"use strict";r.r(t),r.d(t,{default:function(){return O}});var n=r(14288),o=r(67294),s=r(11163),i=r(97183),a=r(85813),l=r(57953),u=r(26713),c=r(22850),d=r(96108),p=r(69677),m=r(71577),f=r(40287),h=r(47455),v=r(12271),y=r(4415),w=r(26554),Z=r(86159),g=r(70917);let b={password:(0,g.iv)({margin:"auto !important",width:"350px"}),submit:(0,g.iv)({marginTop:"32px",button:{width:"100%"}})},C={wrongLink:"Wrong link",incorrect:"Incorrect data",internal:"Internal error, please try again shortly",passwordMismatch:"Passwords mismatch"},E=async(e,t,r,n)=>{if(n.email!==t)throw new y.H({title:C.incorrect});try{await w.Z.process(r,{email:n.email,password:n.password}),e.push("/login")}catch(e){throw new y.H({title:C.internal,err:e})}},P=()=>{let[e,t]=(0,o.useState)(!0),[r,y]=(0,o.useState)(),[g,P]=(0,o.useState)(!1),[x,O]=(0,o.useState)(),T=(0,s.useRouter)(),{id:S}=T.query;(0,o.useEffect)(()=>{S&&w.Z.get(S,["type","email"]).then(e=>{e.type===f.x_?(y(e.email),t(!1)):(0,v.lt)(C.wrongLink)}).catch(e=>(0,v.lt)(C.internal,e))},[S]);let j=(0,o.useCallback)(async e=>{P(!0);try{await E(T,r,S,e)}catch(e){O(e),P(!1)}},[T,r,S]);return e?(0,n.tZ)(i.Z,{children:(0,n.BX)(a.Z,{bordered:!1,css:b.password,children:[(0,n.tZ)(l.Z,{})," Loading..."]})}):(0,n.tZ)(i.Z,{children:(0,n.tZ)(a.Z,{bordered:!1,css:b.password,children:(0,n.BX)(u.Z,{direction:"vertical",size:"large",css:Z.KP.fullWidth,children:[(0,n.tZ)("div",{children:(0,n.tZ)(c.Z.Title,{level:1,style:{padding:0,marginBottom:16,fontWeight:500},children:"Password recovery"})}),(0,n.BX)(d.Z,{requiredMark:"optional",onFinish:j,layout:"vertical",children:[(0,n.tZ)(d.Z.Item,{name:"email",label:"Enter your email address",rules:[{required:!0,message:"Email is required"}],children:(0,n.tZ)(p.Z,{placeholder:"Email address",autoComplete:"email"})}),(0,n.tZ)(h.o,{name:"password",label:"Choose your password",inputPlaceholder:"Password",style:{marginBottom:"14px"}}),(0,n.tZ)(d.Z.Item,{name:"passwordConfirmation",label:"Confirm your password",rules:[{required:!0,message:"Password confirmation is required"},e=>{let{getFieldValue:t}=e;return{validator:(e,r)=>r&&t("password")!==r?Promise.reject(C.passwordMismatch):Promise.resolve()}}],style:{marginBottom:"14px"},children:(0,n.tZ)(p.Z.Password,{placeholder:"Password"})}),(0,n.tZ)(v.Xq,{error:x}),(0,n.tZ)(d.Z.Item,{css:b.submit,children:(0,n.tZ)(m.ZP,{type:"primary",loading:g,htmlType:"submit",children:"Finish"})})]})]})})})},x=()=>(0,n.tZ)(P,{});var O=x}},function(e){e.O(0,[5336,4875,992,4442,5813,1577,4234,4702,7466,954,9774,2888,179],function(){return e(e.s=33124)}),_N_E=e.O()}]);