(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[3556],{61988:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/signup/validation",function(){return n(52957)}])},40287:function(e,t,n){"use strict";n.d(t,{EQ:function(){return i},kD:function(){return r},x_:function(){return s}}),n(83454).env.EMAIL_TOKEN;let r="subscribe",s="passwordRecovery",i="revalidate"},11425:function(e,t,n){"use strict";n.d(t,{R:function(){return l},_:function(){return c}});var r=n(59134),s=n.n(r),i=n(83454);let o=i.env.PORT?parseInt(i.env.PORT):3e3,a=s()()?"http://localhost:"+o:"",c=async(e,t)=>{let n=await fetch(a+e,{method:t?"POST":"GET",headers:{accept:"application/json","Content-Type":"application/json"},...t&&{body:t}}),r=n.headers.get("Content-Type");if(!n.ok){let s=Error("An error occured while fetching data.");throw s.info=(null==r?void 0:r.includes("application/json"))&&await n.json(),s.status=n.status,s}return n.json()},l=async(e,t)=>{let n=await fetch(a+e,{...t,method:t&&t.method||"GET",headers:{...t&&t.headers,"Content-Type":"application/json"}}),r=n.headers.get("Content-Type");if(!n.ok){let s=Error("An error occured while fetching data.");throw s.info=(null==r?void 0:r.includes("application/json"))&&await n.json(),s.status=n.status,s}return n}},26554:function(e,t,n){"use strict";n.d(t,{Z:function(){return o}});var r=n(11425);let s=async(e,t)=>{let n=await (0,r.R)("/api/link",{method:"POST",headers:{Accept:"application/json"},body:JSON.stringify({id:e,data:t})});return n.json()},i=async(e,t)=>{await (0,r.R)("/api/link",{method:"PUT",body:JSON.stringify({id:e,data:t})})};var o={get:s,process:i}},67582:function(e,t,n){"use strict";let r,s;n.d(t,{lt:function(){return v},Xq:function(){return w},Ur:function(){return a}});var i=n(13448);let o=(e,t)=>{i.Z.success({message:e,description:t,duration:10})};var a=o,c=n(85893),l=n(6880),d=n(54907),u=n(26713),h=n(71577),p=n(79074),f=n(60274);p.S1({dsn:"https://3bb27cb32e55433696022ba93cb32430@o394613.ingest.sentry.io/5428383"});let g=[],j=()=>{r&&(i.Z.close(r),r=void 0),g.forEach(e=>i.Z.close(e)),g.length=0,i.Z.close(s),s=void 0},x=function(e,t){let n=!(arguments.length>2)||void 0===arguments[2]||arguments[2];if((null==t?void 0:t.message)==="Failed to fetch"){if(!r){let o="server_error";g.push(o),i.Z.error({key:o,message:"Server error",description:"Server is disconnected, please check your internet connection.",duration:0,onClose(){r=void 0}}),r=o}return}if(n){var a,p;let x="error_"+g.length;g.push(x),i.Z.error({key:x,message:e,description:t&&(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(l.Z.Text,{code:!0,children:t.message}),(t.status||t.info)&&(0,c.jsx)(d.Z,{children:(0,c.jsx)(d.Z.Panel,{header:"More information",children:(0,c.jsxs)(u.Z,{direction:"vertical",children:[t.status&&(0,c.jsxs)(l.Z.Text,{children:["Status: ",t.status]}),(null===(a=t.info)||void 0===a?void 0:a.message)&&(0,c.jsxs)(l.Z.Text,{children:["Description: ",null===(p=t.info)||void 0===p?void 0:p.message]})]})},"information")})]}),duration:0})}if(t&&console.error(t),t&&f.captureException(t),g.length>1&&!s){let v="close_all";i.Z.info({key:v,message:(0,c.jsx)(h.Z,{type:"primary",onClick:j,children:"Close all"}),description:"Close all error notifications",duration:0,placement:"top"}),s=v}};var v=x,y=n(81579),m=n(14670);let Z=e=>{var t,n;let{error:r}=e;return r?(0,c.jsx)(y.Z.Item,{children:(0,c.jsx)(m.Z,{message:r.render||r.title,type:r.type,showIcon:!0,description:r.err&&(0,c.jsxs)(c.Fragment,{children:[r.err.message&&(0,c.jsxs)(l.Z.Text,{type:"danger",children:["Message: ",(0,c.jsx)("code",{children:r.err.message})]}),r.err.status&&(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)("br",{}),(0,c.jsxs)(l.Z.Text,{type:"danger",children:["Status: ",(0,c.jsx)("code",{children:r.err.status})]})]}),(null===(t=r.err.info)||void 0===t?void 0:t.message)&&(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)("br",{}),(0,c.jsxs)(l.Z.Text,{type:"danger",children:["Information: ",(0,c.jsx)("code",{children:null===(n=r.err.info)||void 0===n?void 0:n.message})]})]})]})})}):null};var w=Z},52957:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return x}});var r=n(85893),s=n(67294),i=n(11163),o=n(97183),a=n(81474),c=n(26713),l=n(6880),d=n(11382),u=n(40287),h=n(67582),p=n(26554);let f={wrongLink:"Wrong link",internal:"Internal error, please try again shortly"},g=()=>{let e=(0,i.useRouter)(),{id:t}=e.query;return(0,s.useEffect)(()=>{t&&p.Z.get(t,["type"]).then(n=>{n.type===u.kD||n.type===u.EQ?p.Z.process(t).then(()=>{e.push("/login")}).catch(e=>(0,h.lt)(f.internal,e)):(0,h.lt)(f.wrongLink)}).catch(e=>(0,h.lt)(f.internal,e))},[t,e]),(0,r.jsx)(o.Z,{children:(0,r.jsx)(a.Z,{bordered:!1,className:"Signup",children:(0,r.jsxs)(c.Z,{direction:"vertical",className:"full-width",children:[(0,r.jsxs)(l.Z.Text,{children:[(0,r.jsx)(d.Z,{})," Validating..."]}),!t&&(0,r.jsx)(l.Z.Text,{type:"warning",children:"No link identifier detected"})]})})})},j=()=>(0,r.jsx)(g,{});var x=j}},function(e){e.O(0,[6040,6362,1474,1266,6495,4362,6690,9774,2888,179],function(){return e(e.s=61988)}),_N_E=e.O()}]);