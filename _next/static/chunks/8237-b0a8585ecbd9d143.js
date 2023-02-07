"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[8237],{18436:function(e,t,r){r.d(t,{HS:function(){return c},Lw:function(){return x},m1:function(){return v},o6:function(){return y},w6:function(){return h},ks:function(){return B},Qj:function(){return K}});var n=r(14288),l=r(83062),i=r(71577),o=r(64789),a=r(70917),s=r(86159);let d=e=>{let{disabled:t,primary:r=!0,light:d,dark:c,fullWidth:u,needMargin:Z,loading:h,children:f,onAdd:g}=e;return(0,n.tZ)(l.Z,{title:f||"Add",children:(0,n.tZ)(i.ZP,{css:(0,a.iv)([u?s.KP.fullWidth:{},Z?s.Ml.marginLeft(5):{},d?s.KP.textLight:{},c?s.KP.textDark:{}]),disabled:t,loading:h,type:r?"primary":"default",icon:(0,n.tZ)(o.Z,{}),onClick:g,children:f})})};var c=d,u=r(86548);let Z=e=>{let t,{disabled:r,primary:o=!1,bordered:d,light:c,dark:Z,needMargin:h,loading:f,children:g,onEdit:p}=e;return t=r?"link":o?"primary":"default",(0,n.tZ)(l.Z,{title:g||"Edit",children:(0,n.tZ)(i.ZP,{css:(0,a.iv)(["primary"==t?"":s.KP.noBackground,h?s.Ml.marginLeft(5):{},c?s.KP.textLight:{},Z?s.KP.textDark:{},d?{}:s.KP.noBorder]),disabled:r,loading:f,type:t,icon:(0,n.tZ)(u.Z,{}),onClick:p,children:g})})};var h=Z,f=r(67294),g=r(48689),p=r(28345);let k=e=>{let{disabled:t,loading:r,bordered:o,text:d,title:c,children:u,onDelete:Z}=e,[h,k]=(0,f.useState)(!1),v=(0,f.useCallback)(()=>k(!0),[]),m=(0,f.useCallback)(()=>k(!1),[]),b=(0,f.useCallback)(async()=>{await Z(),k(!1)},[Z]);return(0,n.BX)(n.HY,{children:[(0,n.tZ)(p.AN,{visible:h,loading:r,title:c||"Delete",onCancel:m,onOk:b,children:d||"Are you sure?"}),(0,n.tZ)(l.Z,{title:u||"Delete",children:(0,n.tZ)(i.ZP,{css:(0,a.iv)([s.KP.noBackground,o?{}:s.KP.noBorder]),danger:!0,disabled:t,type:t?"link":void 0,loading:r,icon:(0,n.tZ)(g.Z,{}),onClick:v,children:u})})]})};var v=k,m=r(23430);let b=e=>{let{disabled:t,loading:r,bordered:o,children:d,onDownload:c}=e;return(0,n.tZ)(l.Z,{title:d||"Download",children:(0,n.tZ)(i.ZP,{css:(0,a.iv)([s.KP.noBackground,o?{}:s.KP.noBorder]),disabled:t,loading:r,icon:(0,n.tZ)(m.Z,{}),onClick:c,children:d})})};var y=b,C=r(82826);let P=e=>{let{children:t,buttonCss:r,onClick:l}=e;return(0,n.tZ)(i.ZP,{css:(0,a.iv)([s.KP.noBorder,r]),icon:(0,n.tZ)(C.Z,{css:(0,a.iv)({color:s.Rl.colorPrimary})}),onClick:l,children:t||"Go back"})};var B=P;let S=e=>{let{disabled:t,loading:r,children:o,onCancel:a}=e;return(0,n.tZ)(l.Z,{title:o||"Cancel",children:(0,n.tZ)(i.ZP,{disabled:t,loading:r,type:"default",onClick:a,children:o||"Cancel"})})};var x=S;let w=e=>{let{children:t,onClick:r}=e;return(0,n.tZ)(i.ZP,{type:"link",onClick:r,style:{padding:0},children:t})};var K=w},28345:function(e,t,r){r.d(t,{AN:function(){return h},ZP:function(){return p}});var n=r(14288),l=r(67294),i=r(96108),o=r(60974),a=r(22850),s=r(12271),d=r(26713),c=r(40262);let u={onOk:"Error while submitting deletion"},Z=e=>{let{visible:t,loading:r,title:i,children:Z,onCancel:h,onOk:f}=e,g=(0,l.useCallback)(async()=>{try{await f()}catch(e){(0,s.lt)(u.onOk,e,!1)}},[f]);return(0,n.tZ)(o.Z,{title:(0,n.tZ)(a.Z.Text,{ellipsis:{tooltip:!0},children:i}),okText:"Delete",closable:!1,maskClosable:!1,open:t,cancelButtonProps:{disabled:r},onCancel:h,onOk:g,okButtonProps:{danger:!0,loading:r},children:(0,n.BX)(d.Z,{align:"start",children:[(0,n.tZ)(c.Z,{twoToneColor:"#ff4d4f"}),(0,n.tZ)("span",{style:{wordBreak:"break-word"},children:Z})]})})};var h=Z;let f={onOk:"Error while submitting data"},g=e=>{let{visible:t,loading:r,title:d,initialValues:c,cancelButtonText:u,cancelButtonProps:Z,okButtonProps:h,okButtonText:g,children:p,onCancel:k,onOk:v}=e,[m]=i.Z.useForm();(0,l.useEffect)(()=>{t&&c&&m.setFieldsValue(c)},[t,c,m]);let b=(0,l.useCallback)(async()=>{if(v)try{let e=await m.validateFields();await v(e),m.resetFields()}catch(e){(0,s.lt)(f.onOk,e,!1)}},[m,v]),y=(0,l.useCallback)(e=>{13===e.keyCode&&b()},[b]),C=(0,l.useCallback)(()=>{m.resetFields(),null==k||k()},[m,k]);return(0,n.tZ)(o.Z,{title:(0,n.tZ)(a.Z.Text,{ellipsis:{tooltip:!0},children:d}),open:t,closable:!1,maskClosable:!1,onCancel:C,cancelButtonProps:{...Z,disabled:r,style:{display:k?"inline-block":"none"}},cancelText:u,onOk:b,okText:g,okButtonProps:{...h,loading:r,style:{display:v?"inline-block":"none"}},children:(0,n.tZ)(i.Z,{form:m,layout:"vertical",initialValues:c,onKeyUp:y,children:p})})};var p=g},12271:function(e,t,r){let n,l;r.d(t,{lt:function(){return k},Xq:function(){return y},Ur:function(){return a}});var i=r(33009);let o=(e,t)=>{i.Z.success({message:e,description:t,duration:10})};var a=o,s=r(14288),d=r(22850),c=r(15045),u=r(26713),Z=r(71577),h=r(79074),f=r(60274);h.S1({dsn:"https://3bb27cb32e55433696022ba93cb32430@o394613.ingest.sentry.io/5428383"});let g=[],p=()=>{n&&(i.Z.destroy(n),n=void 0),g.forEach(e=>i.Z.destroy(e)),g.length=0,i.Z.destroy(l),l=void 0};var k=function(e,t){let r=!(arguments.length>2)||void 0===arguments[2]||arguments[2];if((null==t?void 0:t.message)==="Failed to fetch"){if(!n){let e="server_error";g.push(e),i.Z.error({key:e,message:"Server error",description:"Server is disconnected, please check your internet connection.",duration:0,onClose:()=>{n=void 0}}),n=e}return}if(r){var o,a;let r="error_"+g.length;g.push(r),i.Z.error({key:r,message:e,description:t&&(0,s.BX)(s.HY,{children:[(0,s.tZ)(d.Z.Text,{code:!0,children:t.message}),(t.status||t.info)&&(0,s.tZ)(c.Z,{children:(0,s.tZ)(c.Z.Panel,{header:"More information",children:(0,s.BX)(u.Z,{direction:"vertical",children:[t.status&&(0,s.BX)(d.Z.Text,{children:["Status: ",t.status]}),(null===(o=t.info)||void 0===o?void 0:o.message)&&(0,s.BX)(d.Z.Text,{children:["Description: ",null===(a=t.info)||void 0===a?void 0:a.message]})]})},"information")})]}),duration:0})}if(t&&console.error(t),t&&f.captureException(t),g.length>1&&!l){let e="close_all";i.Z.info({key:e,message:(0,s.tZ)(Z.ZP,{type:"primary",onClick:p,children:"Close all"}),description:"Close all error notifications",duration:0,placement:"top"}),l=e}},v=r(96108),m=r(99138);let b=e=>{var t,r;let{error:n}=e;return n?(0,s.tZ)(v.Z.Item,{children:(0,s.tZ)(m.Z,{message:n.render||n.title,type:n.type,showIcon:!0,description:n.err&&(0,s.BX)(s.HY,{children:[n.err.message&&(0,s.BX)(d.Z.Text,{type:"danger",children:["Message: ",(0,s.tZ)("code",{children:n.err.message})]}),n.err.status&&(0,s.BX)(s.HY,{children:[(0,s.tZ)("br",{}),(0,s.BX)(d.Z.Text,{type:"danger",children:["Status: ",(0,s.tZ)("code",{children:n.err.status})]})]}),(null===(t=n.err.info)||void 0===t?void 0:t.message)&&(0,s.BX)(s.HY,{children:[(0,s.tZ)("br",{}),(0,s.BX)(d.Z.Text,{type:"danger",children:["Information: ",(0,s.tZ)("code",{children:null===(r=n.err.info)||void 0===r?void 0:r.message})]})]})]})})}):null};var y=b},64376:function(e,t,r){var n=r(14288),l=r(83062),i=r(53575),o=r(98293),a=r(57953),s=r(13023),d=r(48764).lW;let c=e=>JSON.parse(JSON.stringify(e)),u=e=>{if(!e)return"#FFFFFF";let t=Array.from(e).reduce((e,t)=>t.charCodeAt(0)+((e<<5)-e),0);return"hsl("+t%360+", 100%, 25%)"},Z=e=>{if(!e)return"#"+Math.floor(16777215*Math.random()).toString(16);let t=[],r=255/e;for(let n=0;n<e;n++){let e=Math.floor(n*r%255).toString(16).padStart(2,"0"),l=Math.floor((n+1)*r%255).toString(16).padStart(2,"0"),i=Math.floor((n+2)*r%255).toString(16).padStart(2,"0");t.push("#"+e+l+i)}return t},h=e=>{let t=e.toString(16);return 1===t.length?"0"+t:t},f=e=>"#"+h(Math.floor(255*e.r))+h(Math.floor(255*e.g))+h(Math.floor(255*e.b)),g=e=>{let t=e.avatar&&d.from(e.avatar).toString(),r="",s="";return e.firstname||e.lastname?(r=(e.firstname?e.firstname+" ":"")+(e.lastname||""),s=(e.firstname?e.firstname[0]:"")+(e.lastname?e.lastname[0]:"")):e.email&&(r=e.email,s=e.email[0]),(0,n.tZ)(l.Z,{title:r+(e.pending?" (Invite pending)":""),children:(0,n.tZ)(i.Z,{count:e.pending&&"Pending...",offset:[30,5],style:{backgroundColor:"#ff4d4f",zIndex:10},children:(0,n.tZ)(o.C,{src:t,style:{backgroundColor:u(r)},children:s.toUpperCase()||(0,n.tZ)(a.Z,{})})})},e.id||JSON.stringify(e))},p=e=>{let t=e.name,r="";return t&&(r=t[0]),(0,n.tZ)(l.Z,{title:t,children:(0,n.tZ)(o.C,{style:{backgroundColor:u(t)},children:r.toUpperCase()||(0,n.tZ)(a.Z,{})})},e.id||JSON.stringify(e))},k=e=>!!(0,s.parseOneAddress)(e);t.Z={deepCopy:c,stringToColor:u,colorGenerator:Z,rgbToHex:f,rgbToRgba:function(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1;return e?"rgba("+255*e.r+", "+255*e.g+", "+255*e.b+", "+t+")":"rgba(255, 255, 255, 0)"},userToAvatar:g,groupToAvatar:p,validateEmail:k,getGitVersion:()=>"git-front-a5c3d1f"}}}]);