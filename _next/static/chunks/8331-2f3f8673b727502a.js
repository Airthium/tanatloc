"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[8331],{8331:(e,t,a)=>{a.d(t,{A:()=>L});var n=a(96540),o=a(46942),c=a.n(o),i=a(18437),r=a(98223),l=a(71109),d=a(47633),s=a(65391),g=function(e,t){var a={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&0>t.indexOf(n)&&(a[n]=e[n]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols)for(var o=0,n=Object.getOwnPropertySymbols(e);o<n.length;o++)0>t.indexOf(n[o])&&Object.prototype.propertyIsEnumerable.call(e,n[o])&&(a[n[o]]=e[n[o]]);return a};let b=e=>{var{prefixCls:t,className:a,hoverable:o=!0}=e,i=g(e,["prefixCls","className","hoverable"]);let{getPrefixCls:l}=n.useContext(r.QO),d=l("card",t),s=c()("".concat(d,"-grid"),a,{["".concat(d,"-grid-hoverable")]:o});return n.createElement("div",Object.assign({},i,{className:s}))};var p=a(34354),u=a(65017),m=a(70550),h=a(33302);let y=e=>{let{antCls:t,componentCls:a,headerHeight:n,headerPadding:o,tabsMarginBottom:c}=e;return Object.assign(Object.assign({display:"flex",justifyContent:"center",flexDirection:"column",minHeight:n,marginBottom:-1,padding:"0 ".concat((0,p.zA)(o)),color:e.colorTextHeading,fontWeight:e.fontWeightStrong,fontSize:e.headerFontSize,background:e.headerBg,borderBottom:"".concat((0,p.zA)(e.lineWidth)," ").concat(e.lineType," ").concat(e.colorBorderSecondary),borderRadius:"".concat((0,p.zA)(e.borderRadiusLG)," ").concat((0,p.zA)(e.borderRadiusLG)," 0 0")},(0,u.t6)()),{"&-wrapper":{width:"100%",display:"flex",alignItems:"center"},"&-title":Object.assign(Object.assign({display:"inline-block",flex:1},u.L9),{["\n          > ".concat(a,"-typography,\n          > ").concat(a,"-typography-edit-content\n        ")]:{insetInlineStart:0,marginTop:0,marginBottom:0}}),["".concat(t,"-tabs-top")]:{clear:"both",marginBottom:c,color:e.colorText,fontWeight:"normal",fontSize:e.fontSize,"&-bar":{borderBottom:"".concat((0,p.zA)(e.lineWidth)," ").concat(e.lineType," ").concat(e.colorBorderSecondary)}}})},v=e=>{let{cardPaddingBase:t,colorBorderSecondary:a,cardShadow:n,lineWidth:o}=e;return{width:"33.33%",padding:t,border:0,borderRadius:0,boxShadow:"\n      ".concat((0,p.zA)(o)," 0 0 0 ").concat(a,",\n      0 ").concat((0,p.zA)(o)," 0 0 ").concat(a,",\n      ").concat((0,p.zA)(o)," ").concat((0,p.zA)(o)," 0 0 ").concat(a,",\n      ").concat((0,p.zA)(o)," 0 0 0 ").concat(a," inset,\n      0 ").concat((0,p.zA)(o)," 0 0 ").concat(a," inset;\n    "),transition:"all ".concat(e.motionDurationMid),"&-hoverable:hover":{position:"relative",zIndex:1,boxShadow:n}}},f=e=>{let{componentCls:t,iconCls:a,actionsLiMargin:n,cardActionsIconSize:o,colorBorderSecondary:c,actionsBg:i}=e;return Object.assign(Object.assign({margin:0,padding:0,listStyle:"none",background:i,borderTop:"".concat((0,p.zA)(e.lineWidth)," ").concat(e.lineType," ").concat(c),display:"flex",borderRadius:"0 0 ".concat((0,p.zA)(e.borderRadiusLG)," ").concat((0,p.zA)(e.borderRadiusLG))},(0,u.t6)()),{"& > li":{margin:n,color:e.colorTextDescription,textAlign:"center","> span":{position:"relative",display:"block",minWidth:e.calc(e.cardActionsIconSize).mul(2).equal(),fontSize:e.fontSize,lineHeight:e.lineHeight,cursor:"pointer","&:hover":{color:e.colorPrimary,transition:"color ".concat(e.motionDurationMid)},["a:not(".concat(t,"-btn), > ").concat(a)]:{display:"inline-block",width:"100%",color:e.colorTextDescription,lineHeight:(0,p.zA)(e.fontHeight),transition:"color ".concat(e.motionDurationMid),"&:hover":{color:e.colorPrimary}},["> ".concat(a)]:{fontSize:o,lineHeight:(0,p.zA)(e.calc(o).mul(e.lineHeight).equal())}},"&:not(:last-child)":{borderInlineEnd:"".concat((0,p.zA)(e.lineWidth)," ").concat(e.lineType," ").concat(c)}}})},S=e=>Object.assign(Object.assign({margin:"".concat((0,p.zA)(e.calc(e.marginXXS).mul(-1).equal())," 0"),display:"flex"},(0,u.t6)()),{"&-avatar":{paddingInlineEnd:e.padding},"&-detail":{overflow:"hidden",flex:1,"> div:not(:last-child)":{marginBottom:e.marginXS}},"&-title":Object.assign({color:e.colorTextHeading,fontWeight:e.fontWeightStrong,fontSize:e.fontSizeLG},u.L9),"&-description":{color:e.colorTextDescription}}),z=e=>{let{componentCls:t,colorFillAlter:a,headerPadding:n,bodyPadding:o}=e;return{["".concat(t,"-head")]:{padding:"0 ".concat((0,p.zA)(n)),background:a,"&-title":{fontSize:e.fontSize}},["".concat(t,"-body")]:{padding:"".concat((0,p.zA)(e.padding)," ").concat((0,p.zA)(o))}}},O=e=>{let{componentCls:t}=e;return{overflow:"hidden",["".concat(t,"-body")]:{userSelect:"none"}}},x=e=>{let{componentCls:t,cardShadow:a,cardHeadPadding:n,colorBorderSecondary:o,boxShadowTertiary:c,bodyPadding:i,extraColor:r}=e;return{[t]:Object.assign(Object.assign({},(0,u.dF)(e)),{position:"relative",background:e.colorBgContainer,borderRadius:e.borderRadiusLG,["&:not(".concat(t,"-bordered)")]:{boxShadow:c},["".concat(t,"-head")]:y(e),["".concat(t,"-extra")]:{marginInlineStart:"auto",color:r,fontWeight:"normal",fontSize:e.fontSize},["".concat(t,"-body")]:Object.assign({padding:i,borderRadius:"0 0 ".concat((0,p.zA)(e.borderRadiusLG)," ").concat((0,p.zA)(e.borderRadiusLG))},(0,u.t6)()),["".concat(t,"-grid")]:v(e),["".concat(t,"-cover")]:{"> *":{display:"block",width:"100%",borderRadius:"".concat((0,p.zA)(e.borderRadiusLG)," ").concat((0,p.zA)(e.borderRadiusLG)," 0 0")}},["".concat(t,"-actions")]:f(e),["".concat(t,"-meta")]:S(e)}),["".concat(t,"-bordered")]:{border:"".concat((0,p.zA)(e.lineWidth)," ").concat(e.lineType," ").concat(o),["".concat(t,"-cover")]:{marginTop:-1,marginInlineStart:-1,marginInlineEnd:-1}},["".concat(t,"-hoverable")]:{cursor:"pointer",transition:"box-shadow ".concat(e.motionDurationMid,", border-color ").concat(e.motionDurationMid),"&:hover":{borderColor:"transparent",boxShadow:a}},["".concat(t,"-contain-grid")]:{borderRadius:"".concat((0,p.zA)(e.borderRadiusLG)," ").concat((0,p.zA)(e.borderRadiusLG)," 0 0 "),["".concat(t,"-body")]:{display:"flex",flexWrap:"wrap"},["&:not(".concat(t,"-loading) ").concat(t,"-body")]:{marginBlockStart:e.calc(e.lineWidth).mul(-1).equal(),marginInlineStart:e.calc(e.lineWidth).mul(-1).equal(),padding:0}},["".concat(t,"-contain-tabs")]:{["> div".concat(t,"-head")]:{minHeight:0,["".concat(t,"-head-title, ").concat(t,"-extra")]:{paddingTop:n}}},["".concat(t,"-type-inner")]:z(e),["".concat(t,"-loading")]:O(e),["".concat(t,"-rtl")]:{direction:"rtl"}}},j=e=>{let{componentCls:t,bodyPaddingSM:a,headerPaddingSM:n,headerHeightSM:o,headerFontSizeSM:c}=e;return{["".concat(t,"-small")]:{["> ".concat(t,"-head")]:{minHeight:o,padding:"0 ".concat((0,p.zA)(n)),fontSize:c,["> ".concat(t,"-head-wrapper")]:{["> ".concat(t,"-extra")]:{fontSize:e.fontSize}}},["> ".concat(t,"-body")]:{padding:a}},["".concat(t,"-small").concat(t,"-contain-tabs")]:{["> ".concat(t,"-head")]:{["".concat(t,"-head-title, ").concat(t,"-extra")]:{paddingTop:0,display:"flex",alignItems:"center"}}}}},A=(0,m.OF)("Card",e=>{let t=(0,h.oX)(e,{cardShadow:e.boxShadowCard,cardHeadPadding:e.padding,cardPaddingBase:e.paddingLG,cardActionsIconSize:e.fontSize});return[x(t),j(t)]},e=>{var t,a;return{headerBg:"transparent",headerFontSize:e.fontSizeLG,headerFontSizeSM:e.fontSize,headerHeight:e.fontSizeLG*e.lineHeightLG+2*e.padding,headerHeightSM:e.fontSize*e.lineHeight+2*e.paddingXS,actionsBg:e.colorBgContainer,actionsLiMargin:"".concat(e.paddingSM,"px 0"),tabsMarginBottom:-e.padding-e.lineWidth,extraColor:e.colorText,bodyPaddingSM:12,headerPaddingSM:12,bodyPadding:null!==(t=e.bodyPadding)&&void 0!==t?t:e.paddingLG,headerPadding:null!==(a=e.headerPadding)&&void 0!==a?a:e.paddingLG}});var w=function(e,t){var a={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&0>t.indexOf(n)&&(a[n]=e[n]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols)for(var o=0,n=Object.getOwnPropertySymbols(e);o<n.length;o++)0>t.indexOf(n[o])&&Object.prototype.propertyIsEnumerable.call(e,n[o])&&(a[n[o]]=e[n[o]]);return a};let E=e=>{let{actionClasses:t,actions:a=[],actionStyle:o}=e;return n.createElement("ul",{className:t,style:o},a.map((e,t)=>n.createElement("li",{style:{width:"".concat(100/a.length,"%")},key:"action-".concat(t)},n.createElement("span",null,e))))},N=n.forwardRef((e,t)=>{let a;let{prefixCls:o,className:g,rootClassName:p,style:u,extra:m,headStyle:h={},bodyStyle:y={},title:v,loading:f,bordered:S=!0,size:z,type:O,cover:x,actions:j,tabList:N,children:C,activeTabKey:L,defaultActiveTabKey:T,tabBarExtraContent:P,hoverable:G,tabProps:R={},classNames:B,styles:H}=e,W=w(e,["prefixCls","className","rootClassName","style","extra","headStyle","bodyStyle","title","loading","bordered","size","type","cover","actions","tabList","children","activeTabKey","defaultActiveTabKey","tabBarExtraContent","hoverable","tabProps","classNames","styles"]),{getPrefixCls:I,direction:k,card:M}=n.useContext(r.QO),D=e=>{var t;return c()(null===(t=null==M?void 0:M.classNames)||void 0===t?void 0:t[e],null==B?void 0:B[e])},q=e=>{var t;return Object.assign(Object.assign({},null===(t=null==M?void 0:M.styles)||void 0===t?void 0:t[e]),null==H?void 0:H[e])},F=n.useMemo(()=>{let e=!1;return n.Children.forEach(C,t=>{(null==t?void 0:t.type)===b&&(e=!0)}),e},[C]),X=I("card",o),[K,_,Q]=A(X),J=n.createElement(d.A,{loading:!0,active:!0,paragraph:{rows:4},title:!1},C),U=void 0!==L,V=Object.assign(Object.assign({},R),{[U?"activeKey":"defaultActiveKey"]:U?L:T,tabBarExtraContent:P}),Y=(0,l.A)(z),Z=Y&&"default"!==Y?Y:"large",$=N?n.createElement(s.A,Object.assign({size:Z},V,{className:"".concat(X,"-head-tabs"),onChange:t=>{var a;null===(a=e.onTabChange)||void 0===a||a.call(e,t)},items:N.map(e=>{var{tab:t}=e;return Object.assign({label:t},w(e,["tab"]))})})):null;if(v||m||$){let e=c()("".concat(X,"-head"),D("header")),t=c()("".concat(X,"-head-title"),D("title")),o=c()("".concat(X,"-extra"),D("extra")),i=Object.assign(Object.assign({},h),q("header"));a=n.createElement("div",{className:e,style:i},n.createElement("div",{className:"".concat(X,"-head-wrapper")},v&&n.createElement("div",{className:t,style:q("title")},v),m&&n.createElement("div",{className:o,style:q("extra")},m)),$)}let ee=c()("".concat(X,"-cover"),D("cover")),et=x?n.createElement("div",{className:ee,style:q("cover")},x):null,ea=c()("".concat(X,"-body"),D("body")),en=Object.assign(Object.assign({},y),q("body")),eo=n.createElement("div",{className:ea,style:en},f?J:C),ec=c()("".concat(X,"-actions"),D("actions")),ei=(null==j?void 0:j.length)?n.createElement(E,{actionClasses:ec,actionStyle:q("actions"),actions:j}):null,er=(0,i.A)(W,["onTabChange"]),el=c()(X,null==M?void 0:M.className,{["".concat(X,"-loading")]:f,["".concat(X,"-bordered")]:S,["".concat(X,"-hoverable")]:G,["".concat(X,"-contain-grid")]:F,["".concat(X,"-contain-tabs")]:null==N?void 0:N.length,["".concat(X,"-").concat(Y)]:Y,["".concat(X,"-type-").concat(O)]:!!O,["".concat(X,"-rtl")]:"rtl"===k},g,p,_,Q),ed=Object.assign(Object.assign({},null==M?void 0:M.style),u);return K(n.createElement("div",Object.assign({ref:t},er,{className:el,style:ed}),a,et,eo,ei))});var C=function(e,t){var a={};for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&0>t.indexOf(n)&&(a[n]=e[n]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols)for(var o=0,n=Object.getOwnPropertySymbols(e);o<n.length;o++)0>t.indexOf(n[o])&&Object.prototype.propertyIsEnumerable.call(e,n[o])&&(a[n[o]]=e[n[o]]);return a};N.Grid=b,N.Meta=e=>{let{prefixCls:t,className:a,avatar:o,title:i,description:l}=e,d=C(e,["prefixCls","className","avatar","title","description"]),{getPrefixCls:s}=n.useContext(r.QO),g=s("card",t),b=c()("".concat(g,"-meta"),a),p=o?n.createElement("div",{className:"".concat(g,"-meta-avatar")},o):null,u=i?n.createElement("div",{className:"".concat(g,"-meta-title")},i):null,m=l?n.createElement("div",{className:"".concat(g,"-meta-description")},l):null,h=u||m?n.createElement("div",{className:"".concat(g,"-meta-detail")},u,m):null;return n.createElement("div",Object.assign({},d,{className:b}),p,h)};let L=N}}]);