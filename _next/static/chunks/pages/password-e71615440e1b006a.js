(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[8322],{90420:function(e,t,r){"use strict";r.d(t,{Z:function(){return l}});var s=r(1413),n=r(67294),o={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M942.2 486.2Q889.47 375.11 816.7 305l-50.88 50.88C807.31 395.53 843.45 447.4 874.7 512 791.5 684.2 673.4 766 512 766q-72.67 0-133.87-22.38L323 798.75Q408 838 512 838q288.3 0 430.2-300.3a60.29 60.29 0 000-51.5zm-63.57-320.64L836 122.88a8 8 0 00-11.32 0L715.31 232.2Q624.86 186 512 186q-288.3 0-430.2 300.3a60.3 60.3 0 000 51.5q56.69 119.4 136.5 191.41L112.48 835a8 8 0 000 11.31L155.17 889a8 8 0 0011.31 0l712.15-712.12a8 8 0 000-11.32zM149.3 512C232.6 339.8 350.7 258 512 258c54.54 0 104.13 9.36 149.12 28.39l-70.3 70.3a176 176 0 00-238.13 238.13l-83.42 83.42C223.1 637.49 183.3 582.28 149.3 512zm246.7 0a112.11 112.11 0 01146.2-106.69L401.31 546.2A112 112 0 01396 512z"}},{tag:"path",attrs:{d:"M508 624c-3.46 0-6.87-.16-10.25-.47l-52.82 52.82a176.09 176.09 0 00227.42-227.42l-52.82 52.82c.31 3.38.47 6.79.47 10.25a111.94 111.94 0 01-112 112z"}}]},name:"eye-invisible",theme:"outlined"},i=r(42135),a=function(e,t){return n.createElement(i.Z,(0,s.Z)((0,s.Z)({},e),{},{ref:t,icon:o}))};a.displayName="EyeInvisibleOutlined";var l=n.forwardRef(a)},99611:function(e,t,r){"use strict";r.d(t,{Z:function(){return l}});var s=r(1413),n=r(67294),o={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 000 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766zm-4-430c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z"}}]},name:"eye",theme:"outlined"},i=r(42135),a=function(e,t){return n.createElement(i.Z,(0,s.Z)((0,s.Z)({},e),{},{ref:t,icon:o}))};a.displayName="EyeOutlined";var l=n.forwardRef(a)},69677:function(e,t,r){"use strict";r.d(t,{Z:function(){return S}});var s=r(94184),n=r.n(s),o=r(67294),i=r(53124),a=r(65223),l=r(47673);let u=e=>{let{getPrefixCls:t,direction:r}=(0,o.useContext)(i.E_),{prefixCls:s,className:u=""}=e,c=t("input-group",s),d=t("input"),[p,m]=(0,l.ZP)(d),f=n()(c,{[`${c}-lg`]:"large"===e.size,[`${c}-sm`]:"small"===e.size,[`${c}-compact`]:e.compact,[`${c}-rtl`]:"rtl"===r},m,u),h=(0,o.useContext)(a.aM),y=(0,o.useMemo)(()=>Object.assign(Object.assign({},h),{isFormItemInput:!1}),[h]);return p(o.createElement("span",{className:f,style:e.style,onMouseEnter:e.onMouseEnter,onMouseLeave:e.onMouseLeave,onFocus:e.onFocus,onBlur:e.onBlur},o.createElement(a.aM.Provider,{value:y},e.children)))};var c=r(82586),d=r(90420),p=r(99611),m=r(98423),f=r(42550),h=r(72922),y=function(e,t){var r={};for(var s in e)Object.prototype.hasOwnProperty.call(e,s)&&0>t.indexOf(s)&&(r[s]=e[s]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols)for(var n=0,s=Object.getOwnPropertySymbols(e);n<s.length;n++)0>t.indexOf(s[n])&&Object.prototype.propertyIsEnumerable.call(e,s[n])&&(r[s[n]]=e[s[n]]);return r};let v=e=>e?o.createElement(p.Z,null):o.createElement(d.Z,null),g={click:"onClick",hover:"onMouseOver"},x=o.forwardRef((e,t)=>{let{visibilityToggle:r=!0}=e,s="object"==typeof r&&void 0!==r.visible,[a,l]=(0,o.useState)(()=>!!s&&r.visible),u=(0,o.useRef)(null);o.useEffect(()=>{s&&l(r.visible)},[s,r]);let d=(0,h.Z)(u),p=()=>{let{disabled:t}=e;t||(a&&d(),l(e=>{var t;let s=!e;return"object"==typeof r&&(null===(t=r.onVisibleChange)||void 0===t||t.call(r,s)),s}))},{className:x,prefixCls:w,inputPrefixCls:_,size:b}=e,j=y(e,["className","prefixCls","inputPrefixCls","size"]),{getPrefixCls:Z}=o.useContext(i.E_),C=Z("input",_),E=Z("input-password",w),P=r&&(t=>{let{action:r="click",iconRender:s=v}=e,n=g[r]||"",i=s(a),l={[n]:p,className:`${t}-icon`,key:"passwordIcon",onMouseDown:e=>{e.preventDefault()},onMouseUp:e=>{e.preventDefault()}};return o.cloneElement(o.isValidElement(i)?i:o.createElement("span",null,i),l)})(E),O=n()(E,x,{[`${E}-${b}`]:!!b}),S=Object.assign(Object.assign({},(0,m.Z)(j,["suffix","iconRender","visibilityToggle"])),{type:a?"text":"password",className:O,prefixCls:C,suffix:P});return b&&(S.size=b),o.createElement(c.Z,Object.assign({ref:(0,f.sQ)(t,u)},S))});var w=r(68795),_=r(71577),b=r(97647),j=r(4173),Z=r(96159),C=function(e,t){var r={};for(var s in e)Object.prototype.hasOwnProperty.call(e,s)&&0>t.indexOf(s)&&(r[s]=e[s]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols)for(var n=0,s=Object.getOwnPropertySymbols(e);n<s.length;n++)0>t.indexOf(s[n])&&Object.prototype.propertyIsEnumerable.call(e,s[n])&&(r[s[n]]=e[s[n]]);return r};let E=o.forwardRef((e,t)=>{let r;let{prefixCls:s,inputPrefixCls:a,className:l,size:u,suffix:d,enterButton:p=!1,addonAfter:m,loading:h,disabled:y,onSearch:v,onChange:g,onCompositionStart:x,onCompositionEnd:E}=e,P=C(e,["prefixCls","inputPrefixCls","className","size","suffix","enterButton","addonAfter","loading","disabled","onSearch","onChange","onCompositionStart","onCompositionEnd"]),{getPrefixCls:O,direction:S}=o.useContext(i.E_),T=o.useContext(b.Z),k=o.useRef(!1),N=O("input-search",s),L=O("input",a),{compactSize:R}=(0,j.ri)(N,S),q=R||u||T,M=o.useRef(null),A=e=>{e&&e.target&&"click"===e.type&&v&&v(e.target.value,e),g&&g(e)},B=e=>{var t;document.activeElement===(null===(t=M.current)||void 0===t?void 0:t.input)&&e.preventDefault()},z=e=>{var t,r;v&&v(null===(r=null===(t=M.current)||void 0===t?void 0:t.input)||void 0===r?void 0:r.value,e)},I=e=>{k.current||h||z(e)},D="boolean"==typeof p?o.createElement(w.Z,null):null,F=`${N}-button`,$=p||{},W=$.type&&!0===$.type.__ANT_BUTTON;r=W||"button"===$.type?(0,Z.Tm)($,Object.assign({onMouseDown:B,onClick:e=>{var t,r;null===(r=null===(t=null==$?void 0:$.props)||void 0===t?void 0:t.onClick)||void 0===r||r.call(t,e),z(e)},key:"enterButton"},W?{className:F,size:q}:{})):o.createElement(_.ZP,{className:F,type:p?"primary":void 0,size:q,disabled:y,key:"enterButton",onMouseDown:B,onClick:z,loading:h,icon:D},p),m&&(r=[r,(0,Z.Tm)(m,{key:"addonAfter"})]);let U=n()(N,{[`${N}-rtl`]:"rtl"===S,[`${N}-${q}`]:!!q,[`${N}-with-button`]:!!p},l),H=e=>{k.current=!0,null==x||x(e)},J=e=>{k.current=!1,null==E||E(e)};return o.createElement(c.Z,Object.assign({ref:(0,f.sQ)(M,t),onPressEnter:I},P,{size:q,onCompositionStart:H,onCompositionEnd:J,prefixCls:L,addonAfter:r,suffix:d,onChange:A,className:U,disabled:y}))});var P=r(22913);let O=c.Z;O.Group=u,O.Search=E,O.TextArea=P.Z,O.Password=x;var S=O},47839:function(e,t,r){(window.__NEXT_P=window.__NEXT_P||[]).push(["/password",function(){return r(7926)}])},59420:function(e,t,r){"use strict";r.d(t,{JT:function(){return o},ah:function(){return a},nq:function(){return n},tE:function(){return i},yL:function(){return s}}),r(83454).env.AUTH_SECRET||Array(33).join("a");let s=6,n=16,o=!0,i=!0,a=!0},96542:function(e,t,r){"use strict";r.d(t,{EQ:function(){return a},kD:function(){return o},o3:function(){return n},x_:function(){return i}});var s=r(83454);let n=s.env.EMAIL_TOKEN||"",o="subscribe",i="passwordRecovery",a="revalidate"},83755:function(e,t,r){"use strict";r.d(t,{R:function(){return u},_:function(){return l}});var s=r(59134),n=r.n(s),o=r(83454);let i=o.env.PORT?parseInt(o.env.PORT):3e3,a=n()()?"http://localhost:"+i:"",l=async(e,t)=>{let r=await fetch(a+e,{method:t?"POST":"GET",headers:{accept:"application/json","Content-Type":"application/json"},...t&&{body:t}}),s=r.headers.get("Content-Type");if(!r.ok){let e=Error("An error occured while fetching data.");throw e.info=(null==s?void 0:s.includes("application/json"))&&await r.json(),e.status=r.status,e}return r.json()},u=async(e,t)=>{let r=await fetch(a+e,{...t,method:t&&t.method||"GET",headers:{...t&&t.headers,"Content-Type":"application/json"}}),s=r.headers.get("Content-Type");if(!r.ok){let e=Error("An error occured while fetching data.");throw e.info=(null==s?void 0:s.includes("application/json"))&&await r.json(),e.status=r.status,e}return r}},93659:function(e,t,r){"use strict";r.d(t,{H:function(){return s}});class s extends Error{constructor(e){super(e.title),this.title=e.title,this.name="APIError",this.render=e.render,this.err=e.err,this.type=e.type||"error"}}},20825:function(e,t,r){"use strict";r.d(t,{Z:function(){return i}});var s=r(83755);let n=async(e,t)=>{let r=await (0,s.R)("/api/link",{method:"POST",headers:{Accept:"application/json"},body:JSON.stringify({id:e,data:t})});return r.json()},o=async(e,t)=>{await (0,s.R)("/api/link",{method:"PUT",body:JSON.stringify({id:e,data:t})})};var i={get:n,process:o}},69081:function(e,t,r){"use strict";r.d(t,{Z:function(){return l}});var s=r(59734),n=r(67294),o=r(83755);let i=()=>{let{data:e,error:t,mutate:r}=(0,s.ZP)("/api/system",o._),i=(null==e?void 0:e.system)||{},a=(0,n.useCallback)(e=>{r({system:{...i,...e}})},[i,r]);return[i,{mutateSystem:a,errorSystem:t,loadingSystem:!e}]},a=async e=>{await (0,o.R)("/api/system",{method:"PUT",body:JSON.stringify(e)})};var l={useSystem:i,update:a}},74219:function(e,t,r){"use strict";r.d(t,{o:function(){return g}});var s=r(85893),n=r(96108),o=r(69677),i=r(59420),a=r(69081);let l={password:"Please enter a password",passwordTooSmall:e=>"Your password is too small (minimum "+e+" characters)",passwordTooLong:e=>"Your password is too long (maximum "+e+" characters)",passwordRequireLetter:"Your password must contain a letter",passwordRequireNumber:"Your password must contain a number",passwordRequireSymbol:"Your password must contain a symbol"},u=(e,t)=>!(t.length<e),c=(e,t)=>!(t.length>e),d=(e,t)=>-1!==e.search(t),p=(e,t)=>{var r,s;return(null!==(s=null==e?void 0:null===(r=e.password)||void 0===r?void 0:r.requireLetter)&&void 0!==s?!s:!i.JT)||d(t,/[a-zA-Z]/)},m=(e,t)=>{var r,s;return(null!==(s=null==e?void 0:null===(r=e.password)||void 0===r?void 0:r.requireNumber)&&void 0!==s?!s:!i.tE)||d(t,/\d/)},f=(e,t)=>{var r,s;return(null!==(s=null==e?void 0:null===(r=e.password)||void 0===r?void 0:r.requireSymbol)&&void 0!==s?!s:!i.ah)||d(t,/[!@#$%^&*(){}[\]<>?/|.:;_-]/)},h=(e,t,r,s)=>{u(e,r)||s.push(l.passwordTooSmall(e)),c(t,r)||s.push(l.passwordTooLong(t))},y=(e,t,r)=>{p(e,t)||r.push(l.passwordRequireLetter),m(e,t)||r.push(l.passwordRequireNumber),f(e,t)||r.push(l.passwordRequireSymbol)},v=e=>{var t,r,u,c;let{labelCol:d,wrapperCol:p,name:m,label:f,inputPlaceholder:v,inputAutoComplete:g,edit:x,style:w,required:_}=e,[b]=a.Z.useSystem(),j=null!==(u=null==b?void 0:null===(t=b.password)||void 0===t?void 0:t.min)&&void 0!==u?u:i.yL,Z=null!==(c=null==b?void 0:null===(r=b.password)||void 0===r?void 0:r.max)&&void 0!==c?c:i.nq;return(0,s.jsx)(n.Z.Item,{labelCol:d,wrapperCol:p,name:m||"password",label:f||"Password",rules:[()=>({validator(e,t){let r=[];return x&&"******"===t?Promise.resolve():t?(h(j,Z,t,r),y(b,t,r),r.length)?Promise.reject(r):Promise.resolve():Promise.reject(l.password)}}),{required:!!_,message:""}],style:w,children:(0,s.jsx)(o.Z.Password,{placeholder:v,autoComplete:g})})};var g=v},9242:function(e,t,r){"use strict";let s,n;r.d(t,{lt:function(){return v},Xq:function(){return _},Ur:function(){return a}});var o=r(33009);let i=(e,t)=>{o.Z.success({message:e,description:t,duration:10})};var a=i,l=r(85893),u=r(22850),c=r(15045),d=r(26713),p=r(71577),m=r(79074),f=r(18654);m.S1({dsn:"https://3bb27cb32e55433696022ba93cb32430@o394613.ingest.sentry.io/5428383"});let h=[],y=()=>{s&&(o.Z.destroy(s),s=void 0),h.forEach(e=>o.Z.destroy(e)),h.length=0,o.Z.destroy(n),n=void 0};var v=function(e,t){let r=!(arguments.length>2)||void 0===arguments[2]||arguments[2];if((null==t?void 0:t.message)==="Failed to fetch"){if(!s){let e="server_error";h.push(e),o.Z.error({key:e,message:"Server error",description:"Server is disconnected, please check your internet connection.",duration:0,onClose:()=>{s=void 0}}),s=e}return}if(r){var i,a;let r="error_"+h.length;h.push(r),o.Z.error({key:r,message:e,description:t&&(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(u.Z.Text,{code:!0,children:t.message}),(t.status||t.info)&&(0,l.jsx)(c.Z,{children:(0,l.jsx)(c.Z.Panel,{header:"More information",children:(0,l.jsxs)(d.Z,{direction:"vertical",children:[t.status&&(0,l.jsxs)(u.Z.Text,{children:["Status: ",t.status]}),(null===(i=t.info)||void 0===i?void 0:i.message)&&(0,l.jsxs)(u.Z.Text,{children:["Description: ",null===(a=t.info)||void 0===a?void 0:a.message]})]})},"information")})]}),duration:0})}if(t&&console.error(t),t&&f.captureException(t),h.length>1&&!n){let e="close_all";o.Z.info({key:e,message:(0,l.jsx)(p.ZP,{type:"primary",onClick:y,children:"Close all"}),description:"Close all error notifications",duration:0,placement:"top"}),n=e}},g=r(96108),x=r(99138);let w=e=>{var t,r;let{error:s}=e;return s?(0,l.jsx)(g.Z.Item,{children:(0,l.jsx)(x.Z,{message:s.render||s.title,type:s.type,showIcon:!0,description:s.err&&(0,l.jsxs)(l.Fragment,{children:[s.err.message&&(0,l.jsxs)(u.Z.Text,{type:"danger",children:["Message: ",(0,l.jsx)("code",{children:s.err.message})]}),s.err.status&&(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)("br",{}),(0,l.jsxs)(u.Z.Text,{type:"danger",children:["Status: ",(0,l.jsx)("code",{children:s.err.status})]})]}),(null===(t=s.err.info)||void 0===t?void 0:t.message)&&(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)("br",{}),(0,l.jsxs)(u.Z.Text,{type:"danger",children:["Information: ",(0,l.jsx)("code",{children:null===(r=s.err.info)||void 0===r?void 0:r.message})]})]})]})})}):null};var _=w},7926:function(e,t,r){"use strict";r.r(t),r.d(t,{default:function(){return P}});var s=r(85893),n=r(67294),o=r(11163),i=r(97183),a=r(85813),l=r(57953),u=r(26713),c=r(22850),d=r(96108),p=r(69677),m=r(71577),f=r(96542),h=r(74219),y=r(9242),v=r(93659),g=r(20825),x=r(14856),w=r.n(x),_=r(45629),b=r.n(_);let j={wrongLink:"Wrong link",incorrect:"Incorrect data",internal:"Internal error, please try again shortly",passwordMismatch:"Passwords mismatch"},Z=async(e,t,r,s)=>{if(s.email!==t)throw new v.H({title:j.incorrect});try{await g.Z.process(r,{email:s.email,password:s.password}),e.push("/login")}catch(e){throw new v.H({title:j.internal,err:e})}},C=()=>{let[e,t]=(0,n.useState)(!0),[r,v]=(0,n.useState)(),[x,_]=(0,n.useState)(!1),[C,E]=(0,n.useState)(),P=(0,o.useRouter)(),{id:O}=P.query;(0,n.useEffect)(()=>{O&&g.Z.get(O,["type","email"]).then(e=>{e.type===f.x_?(v(e.email),t(!1)):(0,y.lt)(j.wrongLink)}).catch(e=>(0,y.lt)(j.internal,e))},[O]);let S=(0,n.useCallback)(async e=>{_(!0);try{await Z(P,r,O,e)}catch(e){E(e),_(!1)}},[P,r,O]);return e?(0,s.jsx)(i.Z,{children:(0,s.jsxs)(a.Z,{bordered:!1,className:b().password,children:[(0,s.jsx)(l.Z,{})," Loading..."]})}):(0,s.jsx)(i.Z,{children:(0,s.jsx)(a.Z,{bordered:!1,className:b().password,children:(0,s.jsxs)(u.Z,{direction:"vertical",size:"large",className:w().fullWidth,children:[(0,s.jsx)("div",{children:(0,s.jsx)(c.Z.Title,{level:1,style:{padding:0,marginBottom:16,fontWeight:500},children:"Password recovery"})}),(0,s.jsxs)(d.Z,{requiredMark:"optional",onFinish:S,layout:"vertical",children:[(0,s.jsx)(d.Z.Item,{name:"email",label:"Enter your email address",rules:[{required:!0,message:"Email is required"}],children:(0,s.jsx)(p.Z,{placeholder:"Email address",autoComplete:"email"})}),(0,s.jsx)(h.o,{name:"password",label:"Choose your password",inputPlaceholder:"Password",style:{marginBottom:"14px"}}),(0,s.jsx)(d.Z.Item,{name:"passwordConfirmation",label:"Confirm your password",rules:[{required:!0,message:"Password confirmation is required"},e=>{let{getFieldValue:t}=e;return{validator:(e,r)=>r&&t("password")!==r?Promise.reject(j.passwordMismatch):Promise.resolve()}}],style:{marginBottom:"14px"},children:(0,s.jsx)(p.Z.Password,{placeholder:"Password"})}),(0,s.jsx)(y.Xq,{error:C}),(0,s.jsx)(d.Z.Item,{className:b().submit,children:(0,s.jsx)(m.ZP,{type:"primary",loading:x,htmlType:"submit",children:"Finish"})})]})]})})})},E=()=>(0,s.jsx)(C,{});var P=E},45629:function(e){e.exports={password:"password_password__5flvB",submit:"password_submit___PX_D"}},14856:function(e){e.exports={variables:'"./variables.css"',colorPrimary:"#fad114",textColorDark:"rgba(0, 0, 0, 0.65)",textColorLight:"rgba(0, 0, 0, 0.45)",logo:"styles_logo__9fFr_",displayNone:"styles_displayNone__RJhEW",displayFlex:"styles_displayFlex__KZAtX",fullWidth:"styles_fullWidth__RSmL9",fullHeight:"styles_fullHeight__OH8_r",noScroll:"styles_noScroll__SbIOd",scroll:"styles_scroll__fB2wo",noBackground:"styles_noBackground__yOr7G",noBorder:"styles_noBorder__jtLOx",noBorderBottom:"styles_noBorderBottom__RAWEg",textWhite:"styles_textWhite__LKtl2",textLight:"styles_textLight__T2MUY",textDark:"styles_textDark__Ae4VK",textOrange:"styles_textOrange__94tCV",textGreen:"styles_textGreen__rD4Yj",textAlignLeft:"styles_textAlignLeft__jTX8x",textAlignCenter:"styles_textAlignCenter__4U96c",primaryColor:"styles_primaryColor__OdDJf",backgroundPrimary:"styles_backgroundPrimary__3E7Ss"}}},function(e){e.O(0,[5336,7138,992,4442,5813,1577,3947,8727,954,9774,2888,179],function(){return e(e.s=47839)}),_N_E=e.O()}]);