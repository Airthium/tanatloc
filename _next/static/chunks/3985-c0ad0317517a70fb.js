(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[3985],{99940:function(e,t,l){"use strict";l.d(t,{HS:function(){return c},Lw:function(){return m},m1:function(){return p},o6:function(){return h},w6:function(){return u},ks:function(){return _},Qj:function(){return C}});var n=l(85893),r=l(7987),o=l(84369),a=l(61511),i=l(41017),s=l.n(i),c=e=>{let{disabled:t,primary:l=!0,light:i,dark:c,fullWidth:d,needMargin:u,loading:x,children:g,onAdd:y}=e;return(0,n.jsx)(r.Z,{title:null!=g?g:"Add",children:(0,n.jsx)(o.ZP,{className:"".concat(d?s().fullWidth:""," ").concat(i?s().textLight:""," ").concat(c?s().textDark:""),style:u?{marginLeft:"5px"}:{},disabled:t,loading:x,type:l?"primary":"default",icon:(0,n.jsx)(a.Z,{}),onClick:y,children:g})})},d=l(53618),u=e=>{let t,{disabled:l,primary:a=!1,bordered:i,light:c,dark:u,needMargin:x,loading:g,children:y,onEdit:p}=e;return t=l?"link":a?"primary":"default",(0,n.jsx)(r.Z,{title:null!=y?y:"Edit",children:(0,n.jsx)(o.ZP,{className:"".concat("primary"==t?"":s().noBackground," ").concat(c?s().textLight:""," ").concat(u?s().textDark:""," ").concat(i?"":s().noBorder),style:x?{marginLeft:"5px"}:{},disabled:l,loading:g,type:t,icon:(0,n.jsx)(d.Z,{}),onClick:p,children:y})})},x=l(67294),g=l(78059),y=l(48044),p=e=>{let{disabled:t,loading:l,bordered:a,text:i,title:c,children:d,onDelete:u}=e,[p,f]=(0,x.useState)(!1),h=(0,x.useCallback)(()=>f(!0),[]),k=(0,x.useCallback)(()=>f(!1),[]),_=(0,x.useCallback)(async()=>{await u(),f(!1)},[u]);return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(y.AN,{visible:p,loading:l,title:null!=c?c:"Delete",onCancel:k,onOk:_,children:null!=i?i:"Are you sure?"}),(0,n.jsx)(r.Z,{title:null!=d?d:"Delete",children:(0,n.jsx)(o.ZP,{className:"".concat(s().noBackground," ").concat(a?"":s().noBorder),danger:!0,disabled:t,type:t?"link":void 0,loading:l,icon:(0,n.jsx)(g.Z,{}),onClick:h,children:d})})]})},f=l(18054),h=e=>{let{disabled:t,loading:l,bordered:a,children:i,onDownload:c}=e;return(0,n.jsx)(r.Z,{title:null!=i?i:"Download",children:(0,n.jsx)(o.ZP,{className:"".concat(s().noBackground," ").concat(a?"":s().noBorder),disabled:t,loading:l,icon:(0,n.jsx)(f.Z,{}),onClick:c,children:i})})},k=l(72583),_=e=>{let{children:t,className:l,onClick:r}=e;return(0,n.jsx)(o.ZP,{className:"".concat(s().noBorder,"  ").concat(l),icon:(0,n.jsx)(k.Z,{className:s().primaryColor}),onClick:r,children:null!=t?t:"Go back"})},m=e=>{let{disabled:t,loading:l,children:a,onCancel:i}=e;return(0,n.jsx)(r.Z,{title:null!=a?a:"Cancel",children:(0,n.jsx)(o.ZP,{disabled:t,loading:l,type:"default",onClick:i,children:null!=a?a:"Cancel"})})},C=e=>{let{children:t,onClick:l}=e;return(0,n.jsx)(o.ZP,{type:"link",onClick:l,style:{padding:0},children:t})}},48044:function(e,t,l){"use strict";l.d(t,{AN:function(){return y},ZP:function(){return f}});var n=l(85893),r=l(67294),o=l(60594),a=l(31471),i=l(81812),s=l(56243),c=l(79877),d=l(12732),u=l(56999),x=l(61393);let g={onOk:"Error while submitting deletion"};var y=e=>{let{visible:t,loading:l,title:o,children:y,onCancel:p,onOk:f}=e,{dispatch:h}=(0,r.useContext)(s.uj),k=(0,r.useCallback)(()=>{(0,d.u)(async()=>{try{await f()}catch(e){h((0,c.iT)({title:g.onOk,err:e,display:!1}))}})},[f,h]);return(0,n.jsx)(a.Z,{title:(0,n.jsxs)(i.Z.Text,{ellipsis:{tooltip:!0},children:[o," ",(0,n.jsx)(x.Z,{twoToneColor:"#ff4d4f",style:{marginLeft:"8px"}})]}),okText:"Delete",closable:!1,maskClosable:!1,open:t,cancelButtonProps:{disabled:l},onCancel:p,onOk:k,okButtonProps:{danger:!0,loading:l},children:(0,n.jsx)(u.Z,{align:"start",children:(0,n.jsx)("span",{style:{wordBreak:"break-word"},children:y})})})};let p={onOk:"Error while submitting data"};var f=e=>{let{visible:t,loading:l,title:u,initialValues:x,cancelButtonText:g,cancelButtonProps:y,okButtonProps:f,okButtonText:h,children:k,onCancel:_,onOk:m}=e,[C,j]=(0,r.useState)(!1),{dispatch:b}=(0,r.useContext)(s.uj),[v]=o.Z.useForm();(0,r.useEffect)(()=>{t&&x&&v.setFieldsValue(x)},[t,x,v]);let Z=(0,r.useCallback)(()=>{(0,d.u)(async()=>{if(m)try{let e=await v.validateFields();await m(e),v.resetFields()}catch(e){b((0,c.iT)({title:p.onOk,err:e,display:!1}))}})},[v,m,b]),S=(0,r.useCallback)(e=>{"Shift"===e.key&&j(!0),"Enter"!==e.key||C||(e.stopPropagation(),Z())},[C,Z]),B=(0,r.useCallback)(e=>{"Shift"===e.key&&j(!1)},[]),N=(0,r.useCallback)(()=>{v.resetFields(),null==_||_()},[v,_]);return(0,n.jsx)(a.Z,{title:(0,n.jsx)(i.Z.Text,{ellipsis:{tooltip:!0},children:u}),open:t,closable:!1,maskClosable:!1,onCancel:N,cancelButtonProps:{...y,disabled:l,style:{display:_?"inline-block":"none"}},cancelText:g,onOk:Z,okText:h,okButtonProps:{...f,loading:l,style:{display:m?"inline-block":"none"}},children:(0,n.jsx)(o.Z,{form:v,layout:"vertical",initialValues:x,onKeyDown:S,onKeyUp:B,children:k})})}},66526:function(e,t,l){"use strict";var n=l(85893),r=l(7987),o=l(27492),a=l(4123),i=l(47945),s=l(13023),c=l(48764).lW;let d=e=>e?"hsl("+Array.from(e).reduce((e,t)=>t.charCodeAt(0)+((e<<5)-e),0)%360+", 100%, 25%)":"#FFFFFF",u=e=>{let t=e.toString(16);return 1===t.length?"0"+t:t};t.Z={deepCopy:e=>JSON.parse(JSON.stringify(e)),stringToColor:d,colorGenerator:e=>{if(!e)return"#"+Math.floor(16777215*Math.random()).toString(16);let t=[],l=255/e;for(let n=0;n<e;n++){let e=Math.floor(n*l%255).toString(16).padStart(2,"0"),r=Math.floor((n+1)*l%255).toString(16).padStart(2,"0"),o=Math.floor((n+2)*l%255).toString(16).padStart(2,"0");t.push("#"+e+r+o)}return t},rgbToHex:e=>"#"+u(Math.floor(255*e.r))+u(Math.floor(255*e.g))+u(Math.floor(255*e.b)),rgbToRgba:function(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1;return e?"rgba("+255*e.r+", "+255*e.g+", "+255*e.b+", "+t+")":"rgba(255, 255, 255, 0)"},userToAvatar:e=>{var t,l,s;let u,x;let g=e.avatar&&c.from(e.avatar).toString();return e.firstname||e.lastname?(u=(e.firstname?e.firstname+" ":"")+(null!==(t=e.lastname)&&void 0!==t?t:""),x=(e.firstname?e.firstname[0]:"")+(e.lastname?e.lastname[0]:"")):e.email&&(u=e.email,x=e.email[0]),(0,n.jsx)(r.Z,{title:u+(e.pending?" (Invite pending)":""),children:(0,n.jsx)(o.Z,{count:e.pending&&"Pending...",offset:[30,5],style:{backgroundColor:"#ff4d4f",zIndex:10},children:(0,n.jsx)(a.C,{src:g,style:{backgroundColor:d(u)},children:null!==(l=null==x?void 0:x.toUpperCase())&&void 0!==l?l:(0,n.jsx)(i.Z,{})})})},null!==(s=e.id)&&void 0!==s?s:JSON.stringify(e))},workspaceToAvatar:e=>{var t,l;let o,s=e.name;return s&&(o=s[0]),(0,n.jsx)(r.Z,{title:s,children:(0,n.jsx)(a.C,{style:{backgroundColor:d(s)},children:null!==(t=null==o?void 0:o.toUpperCase())&&void 0!==t?t:(0,n.jsx)(i.Z,{})})},null!==(l=e.id)&&void 0!==l?l:JSON.stringify(e))},projectToAvatar:e=>{var t,l;let o,s=e.title;return s&&(o=s[0]),(0,n.jsx)(r.Z,{title:s,children:(0,n.jsx)(a.C,{style:{backgroundColor:d(s)},children:null!==(t=null==o?void 0:o.toUpperCase())&&void 0!==t?t:(0,n.jsx)(i.Z,{})})},null!==(l=e.id)&&void 0!==l?l:JSON.stringify(e))},usermodelToAvatar:e=>{var t,l,o;let s;let c=null===(t=e.model)||void 0===t?void 0:t.name;return c&&(s=c[0]),(0,n.jsx)(r.Z,{title:c,children:(0,n.jsx)(a.C,{style:{backgroundColor:d(c)},children:null!==(l=null==s?void 0:s.toUpperCase())&&void 0!==l?l:(0,n.jsx)(i.Z,{})})},null!==(o=e.id)&&void 0!==o?o:JSON.stringify(e))},groupToAvatar:e=>{var t,l;let o,s=e.name;return s&&(o=s[0]),(0,n.jsx)(r.Z,{title:s,children:(0,n.jsx)(a.C,{style:{backgroundColor:d(s)},children:null!==(t=null==o?void 0:o.toUpperCase())&&void 0!==t?t:(0,n.jsx)(i.Z,{})})},null!==(l=e.id)&&void 0!==l?l:JSON.stringify(e))},validateEmail:e=>!!(0,s.parseOneAddress)(e),getGitVersion:()=>"git-front-25eea78"}},41017:function(e){e.exports={variables:'"./variables.css"',colorPrimary:"#fad114",textColorDark:"rgba(0, 0, 0, 0.65)",textColorLight:"rgba(0, 0, 0, 0.45)",logo:"styles_logo__a_88m",displayNone:"styles_displayNone__X5JML",displayFlex:"styles_displayFlex__pvl0H",fullWidth:"styles_fullWidth__ig6Zi",fullHeight:"styles_fullHeight__aD1qp",noScroll:"styles_noScroll__jJYvq",scroll:"styles_scroll___zuDw",noBackground:"styles_noBackground__QOpQc",noBorder:"styles_noBorder__T5mw6",noBorderBottom:"styles_noBorderBottom__5ori7",textWhite:"styles_textWhite__yojx2",textLight:"styles_textLight__QglC7",textDark:"styles_textDark__xPmmk",textOrange:"styles_textOrange__TYZ4a",textGreen:"styles_textGreen__M8GsP",textAlignLeft:"styles_textAlignLeft__Da1jw",textAlignCenter:"styles_textAlignCenter__DSN8m",primaryColor:"styles_primaryColor__lHC0K",backgroundPrimary:"styles_backgroundPrimary__5S8pd"}}}]);