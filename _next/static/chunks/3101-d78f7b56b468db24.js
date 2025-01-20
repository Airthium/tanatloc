(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[3101],{67070:(e,l,t)=>{"use strict";t.d(l,{M3:()=>d,Zb:()=>A,et:()=>p,fd:()=>k,lg:()=>u,ee:()=>f,z9:()=>m});var r=t(74848),n=t(6385),a=t(43508),o=t(13500),i=t(66188),s=t.n(i);let d=e=>{let{disabled:l,primary:t=!0,light:i,dark:d,fullWidth:c,needMargin:u,loading:y,children:g,onAdd:x}=e;return(0,r.jsx)(n.A,{title:null!=g?g:"Add",children:(0,r.jsx)(a.Ay,{className:"".concat(c?s().fullWidth:""," ").concat(i?s().textLight:""," ").concat(d?s().textDark:""),style:u?{marginLeft:"5px"}:{},disabled:l,loading:y,type:t?"primary":"default",icon:(0,r.jsx)(o.A,{}),onClick:x,children:g})})};var c=t(45349);let u=e=>{let l,{disabled:t,primary:o=!1,bordered:i,light:d,dark:u,needMargin:y,loading:g,children:x,onEdit:p}=e;return l=t?"link":o?"primary":"default",(0,r.jsx)(n.A,{title:null!=x?x:"Edit",children:(0,r.jsx)(a.Ay,{className:"".concat("primary"==l?"":s().noBackground," ").concat(d?s().textLight:""," ").concat(u?s().textDark:""," ").concat(i?"":s().noBorder),style:y?{marginLeft:"5px"}:{},disabled:t,loading:g,type:l,icon:(0,r.jsx)(c.A,{}),onClick:p,children:x})})};var y=t(96540),g=t(68899),x=t(5776);let p=e=>{let{disabled:l,loading:t,bordered:o,text:i,title:d,children:c,onDelete:u}=e,[p,h]=(0,y.useState)(!1),k=(0,y.useCallback)(()=>h(!0),[]),_=(0,y.useCallback)(()=>h(!1),[]),f=(0,y.useCallback)(async()=>{await u(),h(!1)},[u]);return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(x.CJ,{visible:p,loading:t,title:null!=d?d:"Delete",onCancel:_,onOk:f,children:null!=i?i:"Are you sure?"}),(0,r.jsx)(n.A,{title:null!=c?c:"Delete",children:(0,r.jsx)(a.Ay,{className:"".concat(s().noBackground," ").concat(o?"":s().noBorder),danger:!0,disabled:l,type:l?"link":void 0,loading:t,icon:(0,r.jsx)(g.A,{}),onClick:k,children:c})})]})};var h=t(40416);let k=e=>{let{disabled:l,loading:t,bordered:o,children:i,onDownload:d}=e;return(0,r.jsx)(n.A,{title:null!=i?i:"Download",children:(0,r.jsx)(a.Ay,{className:"".concat(s().noBackground," ").concat(o?"":s().noBorder),disabled:l,loading:t,icon:(0,r.jsx)(h.A,{}),onClick:d,children:i})})};var _=t(63945);let f=e=>{let{children:l,className:t,onClick:n}=e;return(0,r.jsx)(a.Ay,{className:"".concat(s().noBorder,"  ").concat(t),icon:(0,r.jsx)(_.A,{className:s().primaryColor}),onClick:n,children:null!=l?l:"Go back"})},A=e=>{let{disabled:l,loading:t,children:o,onCancel:i}=e;return(0,r.jsx)(n.A,{title:null!=o?o:"Cancel",children:(0,r.jsx)(a.Ay,{disabled:l,loading:t,type:"default",onClick:i,children:null!=o?o:"Cancel"})})},m=e=>{let{children:l,onClick:t}=e;return(0,r.jsx)(a.Ay,{type:"link",onClick:t,style:{padding:0},children:l})}},5776:(e,l,t)=>{"use strict";t.d(l,{CJ:()=>x,Ay:()=>h});var r=t(74848),n=t(96540),a=t(61580),o=t(79618),i=t(75654),s=t(78252),d=t(40889),c=t(70551),u=t(17004),y=t(6660);let g={onOk:"Error while submitting deletion"},x=e=>{let{visible:l,loading:t,title:a,children:x,onCancel:p,onOk:h}=e,{dispatch:k}=(0,n.useContext)(s.V2),_=(0,n.useCallback)(()=>{(0,c.g)(async()=>{try{await h()}catch(e){k((0,d.CN)({title:g.onOk,err:e,display:!1}))}})},[h,k]);return(0,r.jsx)(o.A,{title:(0,r.jsxs)(i.A.Text,{ellipsis:{tooltip:!0},children:[a," ",(0,r.jsx)(y.A,{twoToneColor:"#ff4d4f",style:{marginLeft:"8px"}})]}),okText:"Delete",closable:!1,maskClosable:!1,open:l,cancelButtonProps:{disabled:t},onCancel:p,onOk:_,okButtonProps:{danger:!0,loading:t},children:(0,r.jsx)(u.A,{align:"start",children:(0,r.jsx)("span",{style:{wordBreak:"break-word"},children:x})})})},p={onOk:"Error while submitting data"},h=e=>{let{visible:l,loading:t,title:u,initialValues:y,cancelButtonText:g,cancelButtonProps:x,okButtonProps:h,okButtonText:k,children:_,onCancel:f,onOk:A}=e,[m,C]=(0,n.useState)(!1),{dispatch:b}=(0,n.useContext)(s.V2),[v]=a.A.useForm();(0,n.useEffect)(()=>{l&&y&&v.setFieldsValue(y)},[l,y,v]);let j=(0,n.useCallback)(()=>{(0,c.g)(async()=>{if(A)try{let e=await v.validateFields();await A(e),v.resetFields()}catch(e){b((0,d.CN)({title:p.onOk,err:e,display:!1}))}})},[v,A,b]),S=(0,n.useCallback)(e=>{"Shift"===e.key&&C(!0),"Enter"!==e.key||m||(e.stopPropagation(),j())},[m,j]),B=(0,n.useCallback)(e=>{"Shift"===e.key&&C(!1)},[]),N=(0,n.useCallback)(()=>{v.resetFields(),null==f||f()},[v,f]);return(0,r.jsx)(o.A,{title:(0,r.jsx)(i.A.Text,{ellipsis:{tooltip:!0},children:u}),open:l,closable:!1,maskClosable:!1,onCancel:N,cancelButtonProps:{...x,disabled:t,style:{display:f?"inline-block":"none"}},cancelText:g,onOk:j,okText:k,okButtonProps:{...h,loading:t,style:{display:A?"inline-block":"none"}},children:(0,r.jsx)(a.A,{form:v,layout:"vertical",initialValues:y,onKeyDown:S,onKeyUp:B,children:_})})}},72620:(e,l,t)=>{"use strict";t.d(l,{A:()=>y});var r=t(74848),n=t(6385),a=t(26432),o=t(698),i=t(8350),s=t(41875),d=t(48287).hp;let c=e=>e?"hsl("+Array.from(e).reduce((e,l)=>l.charCodeAt(0)+((e<<5)-e),0)%360+", 100%, 25%)":"#FFFFFF",u=e=>{let l=e.toString(16);return 1===l.length?"0"+l:l},y={deepCopy:e=>JSON.parse(JSON.stringify(e)),stringToColor:c,colorGenerator:e=>{if(!e)return"#"+Math.floor(0xffffff*Math.random()).toString(16);let l=[],t=255/e;for(let r=0;r<e;r++){let e=Math.floor(r*t%255).toString(16).padStart(2,"0"),n=Math.floor((r+1)*t%255).toString(16).padStart(2,"0"),a=Math.floor((r+2)*t%255).toString(16).padStart(2,"0");l.push("#"+e+n+a)}return l},rgbToHex:e=>"#"+u(Math.floor(255*e.r))+u(Math.floor(255*e.g))+u(Math.floor(255*e.b)),rgbToRgba:function(e){let l=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1;return e?"rgba("+255*e.r+", "+255*e.g+", "+255*e.b+", "+l+")":"rgba(255, 255, 255, 0)"},userToAvatar:e=>{var l,t,s;let u,y;let g=e.avatar&&d.from(e.avatar).toString();return e.firstname||e.lastname?(u=(e.firstname?e.firstname+" ":"")+(null!==(l=e.lastname)&&void 0!==l?l:""),y=(e.firstname?e.firstname[0]:"")+(e.lastname?e.lastname[0]:"")):e.email&&(u=e.email,y=e.email[0]),(0,r.jsx)(n.A,{title:u+(e.pending?" (Invite pending)":""),children:(0,r.jsx)(a.A,{count:e.pending&&"Pending...",offset:[30,5],style:{backgroundColor:"#ff4d4f",zIndex:10},children:(0,r.jsx)(o.A,{src:g,style:{backgroundColor:c(u)},children:null!==(t=null==y?void 0:y.toUpperCase())&&void 0!==t?t:(0,r.jsx)(i.A,{})})})},null!==(s=e.id)&&void 0!==s?s:JSON.stringify(e))},workspaceToAvatar:e=>{var l,t;let a,s=e.name;return s&&(a=s[0]),(0,r.jsx)(n.A,{title:s,children:(0,r.jsx)(o.A,{style:{backgroundColor:c(s)},children:null!==(l=null==a?void 0:a.toUpperCase())&&void 0!==l?l:(0,r.jsx)(i.A,{})})},null!==(t=e.id)&&void 0!==t?t:JSON.stringify(e))},projectToAvatar:e=>{var l,t;let a,s=e.title;return s&&(a=s[0]),(0,r.jsx)(n.A,{title:s,children:(0,r.jsx)(o.A,{style:{backgroundColor:c(s)},children:null!==(l=null==a?void 0:a.toUpperCase())&&void 0!==l?l:(0,r.jsx)(i.A,{})})},null!==(t=e.id)&&void 0!==t?t:JSON.stringify(e))},usermodelToAvatar:e=>{var l,t,a;let s;let d=null===(l=e.model)||void 0===l?void 0:l.name;return d&&(s=d[0]),(0,r.jsx)(n.A,{title:d,children:(0,r.jsx)(o.A,{style:{backgroundColor:c(d)},children:null!==(t=null==s?void 0:s.toUpperCase())&&void 0!==t?t:(0,r.jsx)(i.A,{})})},null!==(a=e.id)&&void 0!==a?a:JSON.stringify(e))},groupToAvatar:e=>{var l,t;let a,s=e.name;return s&&(a=s[0]),(0,r.jsx)(n.A,{title:s,children:(0,r.jsx)(o.A,{style:{backgroundColor:c(s)},children:null!==(l=null==a?void 0:a.toUpperCase())&&void 0!==l?l:(0,r.jsx)(i.A,{})})},null!==(t=e.id)&&void 0!==t?t:JSON.stringify(e))},validateEmail:e=>!!(0,s.parseOneAddress)(e),getGitVersion:()=>"git-front-3d39e43"}},66188:e=>{e.exports={variables:'"./variables.css"',colorPrimary:"#fad114",textColorDark:"rgba(0, 0, 0, 0.65)",textColorLight:"rgba(0, 0, 0, 0.45)",logo:"styles_logo__a_88m",displayNone:"styles_displayNone__X5JML",displayFlex:"styles_displayFlex__pvl0H",fullWidth:"styles_fullWidth__ig6Zi",fullHeight:"styles_fullHeight__aD1qp",noScroll:"styles_noScroll__jJYvq",scroll:"styles_scroll___zuDw",noBackground:"styles_noBackground__QOpQc",noBorder:"styles_noBorder__T5mw6",noBorderBottom:"styles_noBorderBottom__5ori7",textWhite:"styles_textWhite__yojx2",textLight:"styles_textLight__QglC7",textDark:"styles_textDark__xPmmk",textOrange:"styles_textOrange__TYZ4a",textGreen:"styles_textGreen__M8GsP",textAlignLeft:"styles_textAlignLeft__Da1jw",textAlignCenter:"styles_textAlignCenter__DSN8m",primaryColor:"styles_primaryColor__lHC0K",backgroundPrimary:"styles_backgroundPrimary__5S8pd"}}}]);