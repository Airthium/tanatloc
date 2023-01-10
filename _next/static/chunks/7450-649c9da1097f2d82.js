"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[7450],{11425:function(e,t,r){r.d(t,{R:function(){return d},_:function(){return a}});var n=r(59134),i=r.n(n),l=r(83454);let o=l.env.PORT?parseInt(l.env.PORT):3e3,s=i()()?"http://localhost:"+o:"",a=async(e,t)=>{let r=await fetch(s+e,{method:t?"POST":"GET",headers:{accept:"application/json","Content-Type":"application/json"},...t&&{body:t}}),n=r.headers.get("Content-Type");if(!r.ok){let i=Error("An error occured while fetching data.");throw i.info=(null==n?void 0:n.includes("application/json"))&&await r.json(),i.status=r.status,i}return r.json()},d=async(e,t)=>{let r=await fetch(s+e,{...t,method:t&&t.method||"GET",headers:{...t&&t.headers,"Content-Type":"application/json"}}),n=r.headers.get("Content-Type");if(!r.ok){let i=Error("An error occured while fetching data.");throw i.info=(null==n?void 0:n.includes("application/json"))&&await r.json(),i.status=r.status,i}return r}},55734:function(e,t,r){r.d(t,{Z:function(){return Z}});var n=r(59734),i=r(67294),l=r(11425);let o=()=>{let{data:e,error:t,mutate:r}=(0,n.ZP)("/api/user",l._),o=null==e?void 0:e.user,s=(0,i.useCallback)(e=>{r({user:{...o,...e}})},[o,r]),a=(0,i.useCallback)(()=>{r({user:void 0})},[r]);return[o,{mutateUser:s,clearUser:a,errorUser:(null==t?void 0:t.status)===401?void 0:t,loadingUser:(null==t?void 0:t.status)!==401&&!e}]},s=()=>{let{data:e,error:t,mutate:r}=(0,n.ZP)("/api/users",l._),o=(null==e?void 0:e.users)||[],s=(0,i.useCallback)(e=>{let t=[...o,{...e,authorizedplugins:[]}];r({users:t})},[o,r]),a=(0,i.useCallback)(e=>{let t=o.filter(t=>t.id!==e.id);r({users:t})},[o,r]),d=(0,i.useCallback)(e=>{let t=o.map(t=>(t.id===e.id&&(t={...t,...e}),t));r({users:t})},[o,r]);return[o,{addOneUser:s,delOneUser:a,mutateOneUser:d,errorUsers:t,loadingUsers:!e}]},a=async e=>{let t=await (0,l.R)("/api/user",{method:"POST",headers:{Accept:"application/json"},body:JSON.stringify(e)});return t.json()},d=async e=>{await (0,l.R)("/api/user",{method:"PUT",body:JSON.stringify(e)})},c=async(e,t)=>{await (0,l.R)("/api/user/"+e,{method:"PUT",body:JSON.stringify(t)})},u=async()=>{await (0,l.R)("/api/user",{method:"DELETE"})},h=async e=>{await (0,l.R)("/api/user/"+e,{method:"DELETE"})},p=async e=>{let t=await (0,l.R)("/api/user/check",{method:"POST",headers:{Accept:"application/json"},body:JSON.stringify(e)});return t.json()};var Z={useUser:o,useUsers:s,add:a,update:d,updateById:c,del:u,delById:h,check:p}},28345:function(e,t,r){r.d(t,{AN:function(){return p},ZP:function(){return f}});var n=r(14288),i=r(67294),l=r(96108),o=r(60974),s=r(25625),a=r(12271),d=r(26713),c=r(40262);let u={onOk:"Error while submitting deletion"},h=e=>{let{visible:t,loading:r,title:l,children:h,onCancel:p,onOk:Z}=e,g=(0,i.useCallback)(async()=>{try{await Z()}catch(e){(0,a.lt)(u.onOk,e,!1)}},[Z]);return(0,n.tZ)(o.Z,{title:(0,n.tZ)(s.Z.Text,{ellipsis:{tooltip:!0},children:l}),okText:"Delete",closable:!1,maskClosable:!1,open:t,cancelButtonProps:{disabled:r},onCancel:p,onOk:g,okButtonProps:{danger:!0,loading:r},children:(0,n.BX)(d.Z,{align:"start",children:[(0,n.tZ)(c.Z,{twoToneColor:"#ff4d4f"}),(0,n.tZ)("span",{style:{wordBreak:"break-word"},children:h})]})})};var p=h;let Z={onOk:"Error while submitting data"},g=e=>{let{visible:t,loading:r,title:d,initialValues:c,cancelButtonText:u,cancelButtonProps:h,okButtonProps:p,okButtonText:g,children:f,onCancel:v,onOk:y}=e,[m]=l.Z.useForm();(0,i.useEffect)(()=>{t&&c&&m.setFieldsValue(c)},[t,c,m]);let k=(0,i.useCallback)(async()=>{if(y)try{let e=await m.validateFields();await y(e),m.resetFields()}catch(t){(0,a.lt)(Z.onOk,t,!1)}},[m,y]),b=(0,i.useCallback)(e=>{13===e.keyCode&&k()},[k]),T=(0,i.useCallback)(()=>{m.resetFields(),null==v||v()},[m,v]);return(0,n.tZ)(o.Z,{title:(0,n.tZ)(s.Z.Text,{ellipsis:{tooltip:!0},children:d}),open:t,closable:!1,maskClosable:!1,onCancel:T,cancelButtonProps:{...h,disabled:r,style:{display:v?"inline-block":"none"}},cancelText:u,onOk:k,okText:g,okButtonProps:{...p,loading:r,style:{display:y?"inline-block":"none"}},children:(0,n.tZ)(l.Z,{form:m,layout:"vertical",initialValues:c,onKeyUp:b,children:f})})};var f=g},12271:function(e,t,r){let n,i;r.d(t,{lt:function(){return v},Xq:function(){return b},Ur:function(){return s}});var l=r(33009);let o=(e,t)=>{l.Z.success({message:e,description:t,duration:10})};var s=o,a=r(14288),d=r(25625),c=r(15045),u=r(26713),h=r(71577),p=r(79074),Z=r(71260);p.S1({dsn:"https://3bb27cb32e55433696022ba93cb32430@o394613.ingest.sentry.io/5428383"});let g=[],f=()=>{n&&(l.Z.destroy(n),n=void 0),g.forEach(e=>l.Z.destroy(e)),g.length=0,l.Z.destroy(i),i=void 0};var v=function(e,t){let r=!(arguments.length>2)||void 0===arguments[2]||arguments[2];if((null==t?void 0:t.message)==="Failed to fetch"){if(!n){let o="server_error";g.push(o),l.Z.error({key:o,message:"Server error",description:"Server is disconnected, please check your internet connection.",duration:0,onClose:()=>{n=void 0}}),n=o}return}if(r){var s,p;let v="error_"+g.length;g.push(v),l.Z.error({key:v,message:e,description:t&&(0,a.BX)(a.HY,{children:[(0,a.tZ)(d.Z.Text,{code:!0,children:t.message}),(t.status||t.info)&&(0,a.tZ)(c.Z,{children:(0,a.tZ)(c.Z.Panel,{header:"More information",children:(0,a.BX)(u.Z,{direction:"vertical",children:[t.status&&(0,a.BX)(d.Z.Text,{children:["Status: ",t.status]}),(null===(s=t.info)||void 0===s?void 0:s.message)&&(0,a.BX)(d.Z.Text,{children:["Description: ",null===(p=t.info)||void 0===p?void 0:p.message]})]})},"information")})]}),duration:0})}if(t&&console.error(t),t&&Z.captureException(t),g.length>1&&!i){let y="close_all";l.Z.info({key:y,message:(0,a.tZ)(h.Z,{type:"primary",onClick:f,children:"Close all"}),description:"Close all error notifications",duration:0,placement:"top"}),i=y}},y=r(96108),m=r(99138);let k=e=>{var t,r;let{error:n}=e;return n?(0,a.tZ)(y.Z.Item,{children:(0,a.tZ)(m.Z,{message:n.render||n.title,type:n.type,showIcon:!0,description:n.err&&(0,a.BX)(a.HY,{children:[n.err.message&&(0,a.BX)(d.Z.Text,{type:"danger",children:["Message: ",(0,a.tZ)("code",{children:n.err.message})]}),n.err.status&&(0,a.BX)(a.HY,{children:[(0,a.tZ)("br",{}),(0,a.BX)(d.Z.Text,{type:"danger",children:["Status: ",(0,a.tZ)("code",{children:n.err.status})]})]}),(null===(t=n.err.info)||void 0===t?void 0:t.message)&&(0,a.BX)(a.HY,{children:[(0,a.tZ)("br",{}),(0,a.BX)(d.Z.Text,{type:"danger",children:["Information: ",(0,a.tZ)("code",{children:null===(r=n.err.info)||void 0===r?void 0:r.message})]})]})]})})}):null};var b=k},67641:function(e,t,r){r.d(t,{Z:function(){return y}});var n=r(14288),i=r(67294),l=r(26713),o=r(85813),s=r(57953),a=r(3363),d=r(25625),c=r(97183),u=r(50888),h=r(28058),p=r(86159),Z=r(70917);let g={loading:(0,Z.iv)({margin:"auto !important",maxWidth:"80%"}),content:(0,Z.iv)({maxHeight:"50vh",padding:"20px",overflow:"auto"}),status:(0,Z.iv)({marginTop:"10px"}),errors:(0,Z.iv)({marginTop:"10px",color:"red","& .ant-card":{margin:"10px 0",borderColor:"red",color:"red"}})},f=()=>(0,n.tZ)(l.Z,{style:{height:"100%",width:"100%",justifyContent:"center",alignItems:"center"},children:(0,n.tZ)(o.Z,{children:(0,n.BX)(l.Z,{children:[(0,n.tZ)(s.Z,{}),"Loading, please wait..."]})})}),v=e=>{let{text:t,status:r,errors:Z}=e,f=(0,i.useRef)(null),[v,y]=(0,i.useState)(),[m,k]=(0,i.useState)();(0,i.useEffect)(()=>{if(!(null==r?void 0:r.length)){y(void 0);return}y((0,n.tZ)("div",{css:g.status,children:(0,n.tZ)(a.Z,{direction:"vertical",items:r.map((e,t)=>({key:t,status:"finish",icon:t===r.length-1?(0,n.tZ)(u.Z,{}):void 0,title:e})).reverse()})}))},[r,Z]),(0,i.useEffect)(()=>{if(!(null==Z?void 0:Z.length)){k(void 0);return}k((0,n.BX)("div",{css:g.errors,children:[Z.map(e=>{let t=null;return e.includes("docker: command not found")||e.includes("Is the docker daemon running")?t=(0,n.BX)(o.Z,{children:["There is an error with your Docker installation.",(0,n.tZ)("br",{}),"Please verify that Docker is correctly installed and running."]}):(e.includes("EHOSTUNREACH")||e.includes("ENETUNREACH")||e.includes("ETIMEOUT"))&&(t=(0,n.BX)(o.Z,{children:["There is an error with your PostgreSQL installation.",(0,n.tZ)("br",{}),'Please verify that postgres Docker container "tanatloc-postgres" is correctly installed and running.']})),(0,n.BX)("div",{children:[e,t]},e)}),(0,n.tZ)(d.Z.Title,{level:5,style:{color:"red"},children:"Please restart the application"})]}))},[Z]);let b=!!(null==r?void 0:r.length)||!!(null==Z?void 0:Z.length);return(0,n.BX)(c.Z,{children:[(0,n.tZ)("div",{css:p.KP.logo,children:(0,n.tZ)("img",{src:"/images/logo.svg",alt:"Tanatloc"})}),(0,n.tZ)(o.Z,{css:g.loading,bodyStyle:{padding:0},title:(0,n.tZ)(l.Z,{children:(null==Z?void 0:Z.length)?(0,n.BX)(n.HY,{children:[(0,n.tZ)(h.Z,{style:{fontSize:"32px",color:"red"}}),(0,n.tZ)(d.Z.Title,{level:3,css:p.Ml.margin(0),children:"An error occurs"}),(0,n.tZ)("a",{href:"https://github.com/Airthium/tanatloc/issues/new/choose",target:"_blank",rel:"noreferrer",children:"Open an issue"})]}):(0,n.BX)(n.HY,{children:[(0,n.tZ)(s.Z,{size:"large",indicator:(0,n.tZ)(u.Z,{})}),null!=t?t:"Loading, please wait..."]})}),children:b?(0,n.BX)("div",{ref:f,css:g.content,children:[m,v]}):null})]})};v.Simple=f;var y=v}}]);