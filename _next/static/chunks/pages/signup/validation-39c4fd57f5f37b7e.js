(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[3556],{61988:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/signup/validation",function(){return n(52957)}])},40287:function(e,t,n){"use strict";n.d(t,{EQ:function(){return a},kD:function(){return o},o3:function(){return i},x_:function(){return s}});var r=n(83454);let i=r.env.EMAIL_TOKEN||"",o="subscribe",s="passwordRecovery",a="revalidate"},11425:function(e,t,n){"use strict";n.d(t,{R:function(){return l},_:function(){return c}});var r=n(59134),i=n.n(r),o=n(83454);let s=o.env.PORT?parseInt(o.env.PORT):3e3,a=i()()?"http://localhost:"+s:"",c=async(e,t)=>{let n=await fetch(a+e,{method:t?"POST":"GET",headers:{accept:"application/json","Content-Type":"application/json"},...t&&{body:t}}),r=n.headers.get("Content-Type");if(!n.ok){let e=Error("An error occured while fetching data.");throw e.info=(null==r?void 0:r.includes("application/json"))&&await n.json(),e.status=n.status,e}return n.json()},l=async(e,t)=>{let n=await fetch(a+e,{...t,method:t&&t.method||"GET",headers:{...t&&t.headers,"Content-Type":"application/json"}}),r=n.headers.get("Content-Type");if(!n.ok){let e=Error("An error occured while fetching data.");throw e.info=(null==r?void 0:r.includes("application/json"))&&await n.json(),e.status=n.status,e}return n}},26554:function(e,t,n){"use strict";n.d(t,{Z:function(){return s}});var r=n(11425);let i=async(e,t)=>{let n=await (0,r.R)("/api/link",{method:"POST",headers:{Accept:"application/json"},body:JSON.stringify({id:e,data:t})});return n.json()},o=async(e,t)=>{await (0,r.R)("/api/link",{method:"PUT",body:JSON.stringify({id:e,data:t})})};var s={get:i,process:o}},12271:function(e,t,n){"use strict";let r,i;n.d(t,{lt:function(){return v},Xq:function(){return T},Ur:function(){return a}});var o=n(33009);let s=(e,t)=>{o.Z.success({message:e,description:t,duration:10})};var a=s,c=n(14288),l=n(22850),d=n(15045),u=n(26713),h=n(71577),p=n(79074),f=n(60274);p.S1({dsn:"https://3bb27cb32e55433696022ba93cb32430@o394613.ingest.sentry.io/5428383"});let Z=[],g=()=>{r&&(o.Z.destroy(r),r=void 0),Z.forEach(e=>o.Z.destroy(e)),Z.length=0,o.Z.destroy(i),i=void 0};var v=function(e,t){let n=!(arguments.length>2)||void 0===arguments[2]||arguments[2];if((null==t?void 0:t.message)==="Failed to fetch"){if(!r){let e="server_error";Z.push(e),o.Z.error({key:e,message:"Server error",description:"Server is disconnected, please check your internet connection.",duration:0,onClose:()=>{r=void 0}}),r=e}return}if(n){var s,a;let n="error_"+Z.length;Z.push(n),o.Z.error({key:n,message:e,description:t&&(0,c.BX)(c.HY,{children:[(0,c.tZ)(l.Z.Text,{code:!0,children:t.message}),(t.status||t.info)&&(0,c.tZ)(d.Z,{children:(0,c.tZ)(d.Z.Panel,{header:"More information",children:(0,c.BX)(u.Z,{direction:"vertical",children:[t.status&&(0,c.BX)(l.Z.Text,{children:["Status: ",t.status]}),(null===(s=t.info)||void 0===s?void 0:s.message)&&(0,c.BX)(l.Z.Text,{children:["Description: ",null===(a=t.info)||void 0===a?void 0:a.message]})]})},"information")})]}),duration:0})}if(t&&console.error(t),t&&f.captureException(t),Z.length>1&&!i){let e="close_all";o.Z.info({key:e,message:(0,c.tZ)(h.ZP,{type:"primary",onClick:g,children:"Close all"}),description:"Close all error notifications",duration:0,placement:"top"}),i=e}},y=n(96108),m=n(99138);let w=e=>{var t,n;let{error:r}=e;return r?(0,c.tZ)(y.Z.Item,{children:(0,c.tZ)(m.Z,{message:r.render||r.title,type:r.type,showIcon:!0,description:r.err&&(0,c.BX)(c.HY,{children:[r.err.message&&(0,c.BX)(l.Z.Text,{type:"danger",children:["Message: ",(0,c.tZ)("code",{children:r.err.message})]}),r.err.status&&(0,c.BX)(c.HY,{children:[(0,c.tZ)("br",{}),(0,c.BX)(l.Z.Text,{type:"danger",children:["Status: ",(0,c.tZ)("code",{children:r.err.status})]})]}),(null===(t=r.err.info)||void 0===t?void 0:t.message)&&(0,c.BX)(c.HY,{children:[(0,c.tZ)("br",{}),(0,c.BX)(l.Z.Text,{type:"danger",children:["Information: ",(0,c.tZ)("code",{children:null===(n=r.err.info)||void 0===n?void 0:n.message})]})]})]})})}):null};var T=w},19069:function(e,t,n){"use strict";var r=n(70917);let i={signup:(0,r.iv)({margin:"auto !important",width:"350px"}),submit:(0,r.iv)({marginTop:"32px",button:{width:"50%"}})};t.Z=i},52957:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return m}});var r=n(14288),i=n(67294),o=n(11163),s=n(97183),a=n(85813),c=n(26713),l=n(22850),d=n(57953),u=n(40287),h=n(12271),p=n(26554),f=n(86159),Z=n(19069);let g={wrongLink:"Wrong link",internal:"Internal error, please try again shortly"},v=()=>{let e=(0,o.useRouter)(),{id:t}=e.query;return(0,i.useEffect)(()=>{t&&p.Z.get(t,["type"]).then(n=>{n.type===u.kD||n.type===u.EQ?p.Z.process(t).then(()=>{e.push("/login")}).catch(e=>(0,h.lt)(g.internal,e)):(0,h.lt)(g.wrongLink)}).catch(e=>(0,h.lt)(g.internal,e))},[t,e]),(0,r.tZ)(s.Z,{children:(0,r.tZ)(a.Z,{bordered:!1,css:Z.Z.signup,children:(0,r.BX)(c.Z,{direction:"vertical",css:f.KP.fullWidth,children:[(0,r.BX)(l.Z.Text,{children:[(0,r.tZ)(d.Z,{})," Validating..."]}),!t&&(0,r.tZ)(l.Z.Text,{type:"warning",children:"No link identifier detected"})]})})})},y=()=>(0,r.tZ)(v,{});var m=y}},function(e){e.O(0,[5336,4875,992,5813,1577,4234,2969,3624,9774,2888,179],function(){return e(e.s=61988)}),_N_E=e.O()}]);