(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[2219],{37858:function(e,t,s){(window.__NEXT_P=window.__NEXT_P||[]).push(["/start",function(){return s(88509)}])},84443:function(e,t,s){"use strict";s.d(t,{Z:function(){return a}});var r=s(87462),l=s(67294),n={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M464 720a48 48 0 1096 0 48 48 0 10-96 0zm16-304v184c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V416c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8zm475.7 440l-416-720c-6.2-10.7-16.9-16-27.7-16s-21.6 5.3-27.7 16l-416 720C56 877.4 71.4 904 96 904h832c24.6 0 40-26.6 27.7-48zm-783.5-27.9L512 239.9l339.8 588.2H172.2z"}}]},name:"warning",theme:"outlined"},i=s(44192),a=l.forwardRef(function(e,t){return l.createElement(i.Z,(0,r.Z)({},e,{ref:t,icon:n}))})},89113:function(e,t,s){"use strict";var r=s(85893),l=s(67294),n=s(5152),i=s.n(n),a=s(41664),o=s.n(a),c=s(35054),d=s(23721),_=s(4581),u=s(30506),g=s(25305),h=s(21708),x=s(72034),m=s(84443),f=s(65920),y=s.n(f),j=s(83506),p=s.n(j);let v=i()(()=>Promise.all([s.e(3737),s.e(447),s.e(8993),s.e(7497),s.e(5254),s.e(2220),s.e(7090),s.e(1121),s.e(2912),s.e(1378)]).then(s.bind(s,3246)).then(e=>e.default.extra.Background),{loadableGenerated:{webpack:()=>[3246]},ssr:!1}),w=e=>{let{text:t,status:s,errors:n}=e,[i,a]=(0,l.useState)([]),[c,f]=(0,l.useState)([]);(0,l.useEffect)(()=>{if(!(null==s?void 0:s.length)){a([]);return}a(s.map((e,t)=>({index:t,status:"finish",icon:0===t?(0,r.jsx)(x.Z,{}):void 0,title:e})).filter(e=>e))},[s]),(0,l.useEffect)(()=>{if(!(null==n?void 0:n.length)){f([]);return}f(n.map(e=>{let t=null;return e.includes("docker: command not found")||e.includes("Is the docker daemon running")?t=(0,r.jsxs)(d.Z,{className:p().errorCard,children:["There is an error with your Docker installation.",(0,r.jsx)("br",{}),"Please verify that Docker is correctly installed and running."]}):(e.includes("EHOSTUNREACH")||e.includes("ENETUNREACH")||e.includes("ETIMEOUT"))&&(t=(0,r.jsxs)(d.Z,{className:p().errorCard,children:["There is an error with your PostgreSQL installation.",(0,r.jsx)("br",{}),'Please verify that postgres Docker container "tanatloc-postgres" is correctly installed and running.']})),(0,r.jsxs)("div",{children:[e,t]},e)}))},[n]);let j=!!(null==s?void 0:s.length)||!!(null==n?void 0:n.length);return(0,r.jsxs)(u.Z,{children:[(0,r.jsx)(v,{}),(0,r.jsx)("div",{className:y().logo,children:(0,r.jsx)("img",{src:"/images/logo.svg",alt:"Tanatloc"})}),(0,r.jsx)(d.Z,{className:p().loading,styles:{body:{padding:0}},title:(0,r.jsx)("div",{className:p().title,children:(null==n?void 0:n.length)?(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(m.Z,{className:"warning"}),(0,r.jsx)(g.Z.Title,{level:3,style:{margin:"0"},children:"An error occurs"}),(0,r.jsx)(o(),{href:"https://github.com/Airthium/tanatloc/issues/new/choose",target:"_blank",children:"Open an issue"})]}):(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(_.Z,{size:"large",indicator:(0,r.jsx)(x.Z,{})}),null!=t?t:"Loading, please wait..."]})}),children:j?(0,r.jsxs)("div",{className:p().content,children:[c.length?(0,r.jsxs)("div",{className:p().errors,children:[c.map(e=>e),(0,r.jsx)(g.Z.Title,{level:5,children:"Please restart the application"})]}):null,(0,r.jsx)("div",{className:p().status,children:(0,r.jsx)(h.Z,{direction:"vertical",items:i})})]}):null})]})};w.Simple=()=>(0,r.jsx)(c.Z,{style:{height:"100%",width:"100%",justifyContent:"center",alignItems:"center"},children:(0,r.jsx)(d.Z,{children:(0,r.jsxs)(c.Z,{children:[(0,r.jsx)(_.Z,{}),"Loading, please wait..."]})})}),t.Z=w},88509:function(e,t,s){"use strict";s.r(t),s.d(t,{default:function(){return d}});var r=s(85893),l=s(67294),n=s(25305),i=s(59134),a=s.n(i),o=s(89113),c=()=>{let[e,t]=(0,l.useState)([]),[s,i]=(0,l.useState)([]);return(0,l.useEffect)(()=>{if(a()())try{window.electronAPI.handleStatus((e,s)=>{t(s)}),window.electronAPI.handleErrors((e,t)=>{i(t)})}catch(e){i(t=>[e.message,...t])}},[]),(0,r.jsx)(o.Z,{text:(0,r.jsx)(n.Z.Title,{level:3,style:{margin:0},children:"Tanatloc is starting, please wait..."}),status:e,errors:s})},d=()=>(0,r.jsx)(c,{})},83506:function(e){e.exports={loading:"loading_loading__WR55J",title:"loading_title___LzrV",content:"loading_content__NB5oB",status:"loading_status__3rOKY",errors:"loading_errors__NiPcj",error:"loading_error__3HHUG",errorCard:"loading_errorCard__lZ_jh"}},65920:function(e){e.exports={variables:'"./variables.css"',colorPrimary:"#fad114",textColorDark:"rgba(0, 0, 0, 0.65)",textColorLight:"rgba(0, 0, 0, 0.45)",logo:"styles_logo__a_88m",displayNone:"styles_displayNone__X5JML",displayFlex:"styles_displayFlex__pvl0H",fullWidth:"styles_fullWidth__ig6Zi",fullHeight:"styles_fullHeight__aD1qp",noScroll:"styles_noScroll__jJYvq",scroll:"styles_scroll___zuDw",noBackground:"styles_noBackground__QOpQc",noBorder:"styles_noBorder__T5mw6",noBorderBottom:"styles_noBorderBottom__5ori7",textWhite:"styles_textWhite__yojx2",textLight:"styles_textLight__QglC7",textDark:"styles_textDark__xPmmk",textOrange:"styles_textOrange__TYZ4a",textGreen:"styles_textGreen__M8GsP",textAlignLeft:"styles_textAlignLeft__Da1jw",textAlignCenter:"styles_textAlignCenter__DSN8m",primaryColor:"styles_primaryColor__lHC0K",backgroundPrimary:"styles_backgroundPrimary__5S8pd"}}},function(e){e.O(0,[506,2506,3721,9353,1708,2888,9774,179],function(){return e(e.s=37858)}),_N_E=e.O()}]);