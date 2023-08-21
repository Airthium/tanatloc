(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[1524],{92283:function(e,t){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M193 796c0 17.7 14.3 32 32 32h574c17.7 0 32-14.3 32-32V563c0-176.2-142.8-319-319-319S193 386.8 193 563v233zm72-233c0-136.4 110.6-247 247-247s247 110.6 247 247v193H404V585c0-5.5-4.5-10-10-10h-44c-5.5 0-10 4.5-10 10v171h-75V563zm-48.1-252.5l39.6-39.6c3.1-3.1 3.1-8.2 0-11.3l-67.9-67.9a8.03 8.03 0 00-11.3 0l-39.6 39.6a8.03 8.03 0 000 11.3l67.9 67.9c3.1 3.1 8.1 3.1 11.3 0zm669.6-79.2l-39.6-39.6a8.03 8.03 0 00-11.3 0l-67.9 67.9a8.03 8.03 0 000 11.3l39.6 39.6c3.1 3.1 8.2 3.1 11.3 0l67.9-67.9c3.1-3.2 3.1-8.2 0-11.3zM832 892H192c-17.7 0-32 14.3-32 32v24c0 4.4 3.6 8 8 8h688c4.4 0 8-3.6 8-8v-24c0-17.7-14.3-32-32-32zM484 180h56c4.4 0 8-3.6 8-8V76c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v96c0 4.4 3.6 8 8 8z"}}]},name:"alert",theme:"outlined"}},14527:function(e,t,r){"use strict";Object.defineProperty(t,"Z",{enumerable:!0,get:function(){return c}});var l=function(e,t){if(!t&&e&&e.__esModule)return e;if(null===e||"object"!=typeof e&&"function"!=typeof e)return{default:e};var r=s(t);if(r&&r.has(e))return r.get(e);var l={},n=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in e)if("default"!==o&&Object.prototype.hasOwnProperty.call(e,o)){var i=n?Object.getOwnPropertyDescriptor(e,o):null;i&&(i.get||i.set)?Object.defineProperty(l,o,i):l[o]=e[o]}return l.default=e,r&&r.set(e,l),l}(r(67294)),n=i(r(92283)),o=i(r(92074));function i(e){return e&&e.__esModule?e:{default:e}}function s(e){if("function"!=typeof WeakMap)return null;var t=new WeakMap,r=new WeakMap;return(s=function(e){return e?r:t})(e)}var c=l.forwardRef(function(e,t){var r,i;return l.createElement(o.default,(r=function(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{},l=Object.keys(r);"function"==typeof Object.getOwnPropertySymbols&&(l=l.concat(Object.getOwnPropertySymbols(r).filter(function(e){return Object.getOwnPropertyDescriptor(r,e).enumerable}))),l.forEach(function(t){var l;l=r[t],t in e?Object.defineProperty(e,t,{value:l,enumerable:!0,configurable:!0,writable:!0}):e[t]=l})}return e}({},e),i=i={ref:t,icon:n.default},Object.getOwnPropertyDescriptors?Object.defineProperties(r,Object.getOwnPropertyDescriptors(i)):(function(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);r.push.apply(r,l)}return r})(Object(i)).forEach(function(e){Object.defineProperty(r,e,Object.getOwnPropertyDescriptor(i,e))}),r))})},91351:function(e,t,r){"use strict";var l=r(75263).default,n=r(64836).default;Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e,t,r,l){return c(function(n){let{prefixCls:c,style:a}=n,d=i.useRef(null),[u,f]=i.useState(0),[h,x]=i.useState(0),[b,j]=(0,o.default)(!1,{value:n.open}),{getPrefixCls:p}=i.useContext(s.ConfigContext),v=p(t||"select",c);i.useEffect(()=>{if(j(!0),"undefined"!=typeof ResizeObserver){let e=new ResizeObserver(e=>{let t=e[0].target;f(t.offsetHeight+8),x(t.offsetWidth)}),t=setInterval(()=>{var l;let n=r?`.${r(v)}`:`.${v}-dropdown`,o=null===(l=d.current)||void 0===l?void 0:l.querySelector(n);o&&(clearInterval(t),e.observe(o))},10);return()=>{clearInterval(t),e.disconnect()}}},[]);let g=Object.assign(Object.assign({},n),{style:Object.assign(Object.assign({},a),{margin:0}),open:b,visible:b,getPopupContainer:()=>d.current});return l&&(g=l(g)),i.createElement("div",{ref:d,style:{paddingBottom:u,position:"relative",minWidth:h}},i.createElement(e,Object.assign({},g)))})},t.withPureRenderTheme=c;var o=n(r(60869)),i=l(r(67294)),s=l(r(31929));function c(e){return function(t){return i.createElement(s.default,{theme:{token:{motion:!1,zIndexPopupBase:0}}},i.createElement(e,Object.assign({},t)))}}},12065:function(e,t,r){"use strict";var l=r(75263).default,n=r(64836).default;Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var o=n(r(94184)),i=r(13328),s=l(r(67294)),c=r(31929),a=r(80654),d=r(77926),u=n(r(53294)),f=r(91351),h=function(e,t){var r={};for(var l in e)Object.prototype.hasOwnProperty.call(e,l)&&0>t.indexOf(l)&&(r[l]=e[l]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols)for(var n=0,l=Object.getOwnPropertySymbols(e);n<l.length;n++)0>t.indexOf(l[n])&&Object.prototype.propertyIsEnumerable.call(e,l[n])&&(r[l[n]]=e[l[n]]);return r},x=(0,f.withPureRenderTheme)(e=>{let{prefixCls:t,className:r,closeIcon:l,closable:n,type:f,title:x,children:b}=e,j=h(e,["prefixCls","className","closeIcon","closable","type","title","children"]),{getPrefixCls:p}=s.useContext(c.ConfigContext),v=p(),g=t||p("modal"),[,y]=(0,u.default)(g),m=`${g}-confirm`,_={};return _=f?{closable:null!=n&&n,title:"",footer:"",children:s.createElement(a.ConfirmContent,Object.assign({},e,{confirmPrefixCls:m,rootPrefixCls:v,content:b}))}:{closable:null==n||n,title:x,footer:void 0===e.footer?s.createElement(d.Footer,Object.assign({},e)):e.footer,children:b},s.createElement(i.Panel,Object.assign({prefixCls:g,className:(0,o.default)(y,`${g}-pure-panel`,f&&m,f&&`${m}-${f}`,r)},j,{closeIcon:(0,d.renderCloseIcon)(g,l),closable:n},_))});t.default=x},56697:function(e,t,r){"use strict";var l=r(64836).default,n=r(75263).default;t.Z=void 0;var o=n(r(28368)),i=l(r(23781)),s=l(r(83663)),c=l(r(12065)),a=l(r(87891));function d(e){return(0,o.default)((0,o.withWarn)(e))}let u=s.default;u.useModal=a.default,u.info=function(e){return(0,o.default)((0,o.withInfo)(e))},u.success=function(e){return(0,o.default)((0,o.withSuccess)(e))},u.error=function(e){return(0,o.default)((0,o.withError)(e))},u.warning=d,u.warn=d,u.confirm=function(e){return(0,o.default)((0,o.withConfirm)(e))},u.destroyAll=function(){for(;i.default.length;){let e=i.default.pop();e&&e()}},u.config=o.modalGlobalConfig,u._InternalPanelDoNotUseOrYouWillBeFired=c.default,t.Z=u},94991:function(e,t,r){(window.__NEXT_P=window.__NEXT_P||[]).push(["/webgl",function(){return r(73025)}])},73025:function(e,t,r){"use strict";r.r(t),r.d(t,{default:function(){return w}});var l=r(85893),n=r(67294),o=r(11163),i=r(65400),s=r.n(i),c=r(70302),a=r(56697),d=r(16373),u=r(74048),f=r(53740),h=r(14527),x=()=>(0,l.jsx)(d.Z,{children:(0,l.jsxs)(d.Z.Content,{children:[(0,l.jsx)(f.Z.Title,{level:5,mark:!0,children:"No manipulation needed"}),(0,l.jsx)(f.Z.Text,{children:"This browser has full support for WebGL on all platforms."}),(0,l.jsx)("br",{}),(0,l.jsx)(f.Z.Text,{children:"If you are having issues with WebGL, you may need to update to the latest version of your browser."})]})}),b=()=>(0,l.jsx)(d.Z,{children:(0,l.jsxs)(d.Z.Content,{children:[(0,l.jsx)(f.Z.Title,{level:5,mark:!0,children:"1- Enter config"}),(0,l.jsxs)(f.Z,{children:["Open mozilla and enter"," ",(0,l.jsx)(f.Z.Text,{code:!0,children:"about:config"})," in your search bar"]}),(0,l.jsx)(f.Z.Title,{level:5,mark:!0,children:"2- Check if enabled"}),(0,l.jsxs)(f.Z,{children:["Search for ",(0,l.jsx)(f.Z.Text,{code:!0,children:"webgl.force-enabled"})," ","and switch value to ",(0,l.jsx)(f.Z.Text,{code:!0,children:"true"})," ","(double click on the value)"]}),(0,l.jsx)(f.Z.Title,{level:5,mark:!0,children:"3- Check if force disabled"}),(0,l.jsxs)(f.Z,{children:["Search for ",(0,l.jsx)(f.Z.Text,{code:!0,children:"webgl.disabled"})," and switch value to ",(0,l.jsx)(f.Z.Text,{code:!0,children:"false"})," (double click on the value)"]}),(0,l.jsx)(f.Z.Title,{level:5,mark:!0,children:"4- Still not working"}),(0,l.jsx)(f.Z,{children:"Update to the latest version and retry all steps, if the problem persists, switch to another web browser."})]})}),j=()=>(0,l.jsx)(d.Z,{children:(0,l.jsxs)(d.Z.Content,{children:[(0,l.jsx)(f.Z.Title,{level:4,children:"No manipulation needed (MacOS)"}),(0,l.jsx)(f.Z,{children:"Firefox on MacOS supports and enables WebGL for all versions from Snow Leopard 10.6. If WebGL still does not work, try to update to the last version of MacOS."}),(0,l.jsx)(f.Z.Title,{level:4,children:"Enable webGL (Linux)"}),(0,l.jsx)(f.Z.Title,{level:5,mark:!0,children:"1- Enter config"}),(0,l.jsxs)(f.Z,{children:["Open mozilla and enter"," ",(0,l.jsx)(f.Z.Text,{code:!0,children:"about:config"})," in your search bar"]}),(0,l.jsx)(f.Z.Title,{level:5,mark:!0,children:"2- Check if enabled"}),(0,l.jsxs)(f.Z,{children:["Search for ",(0,l.jsx)(f.Z.Text,{code:!0,children:"webgl.force-enabled"})," ","and switch value to ",(0,l.jsx)(f.Z.Text,{code:!0,children:"true"})," ","(double click on the value)"]}),(0,l.jsx)(f.Z.Title,{level:5,mark:!0,children:"3- Check if force disabled"}),(0,l.jsxs)(f.Z,{children:["Search for ",(0,l.jsx)(f.Z.Text,{code:!0,children:"webgl.disabled"})," and switch value to ",(0,l.jsx)(f.Z.Text,{code:!0,children:"false"})," (double click on the value)"]}),(0,l.jsx)(f.Z.Title,{level:5,mark:!0,children:"4- Still not working"}),(0,l.jsx)(f.Z,{children:"Update to the latest version and retry all steps."})]})}),p=r(14856),v=r.n(p),g=()=>(0,l.jsx)(d.Z,{children:(0,l.jsxs)(d.Z.Content,{children:[(0,l.jsx)(f.Z.Title,{level:5,mark:!0,children:"1- Check MacOS version"}),(0,l.jsx)(f.Z,{children:"If you have MacOS version 10.10 Yosemite or a previous one, WebGL needs to be activated manually."}),(0,l.jsx)(f.Z.Title,{level:5,mark:!0,children:"2- Developpers Settings"}),(0,l.jsxs)(f.Z,{children:["Open your browser, then go to Safari -",">"," Preferences, click",(0,l.jsx)("span",{className:v().textLight,children:"Advanced"})," tab."]}),(0,l.jsx)(f.Z.Title,{level:5,mark:!0,children:"3- Show new menu"}),(0,l.jsxs)(f.Z,{children:["At the bottom of the window, check the"," ",(0,l.jsx)("span",{className:v().textLight,children:"Show Develop"})," menu in menu bar checkbox."]}),(0,l.jsx)(f.Z.Title,{level:5,mark:!0,children:"4- Enable WebGL"}),(0,l.jsxs)(f.Z,{children:["Open Develop Tab, check enable WebGL (whether in"," ",(0,l.jsx)("span",{className:v().textLight,children:"Experimental feature"})," or in the main menu)"]})]})}),y=r(49271),m=r.n(y),_=()=>{let e=(0,o.useRouter)(),t=(0,n.useCallback)(()=>e.back(),[e]),r=(0,n.useCallback)(()=>{a.Z.info({title:"Google Chrome (Windows)",content:(0,l.jsx)(x,{})})},[]),i=(0,n.useCallback)(()=>{a.Z.info({title:"Google Chrome (MacOS / Linux)",content:(0,l.jsx)(x,{})})},[]),p=(0,n.useCallback)(()=>{a.Z.info({title:"Firefox (Windows)",content:(0,l.jsx)(b,{})})},[]),y=(0,n.useCallback)(()=>{a.Z.info({title:"Firefox (MacOS / Linux)",content:(0,l.jsx)(j,{})})},[]),_=(0,n.useCallback)(()=>{a.Z.info({title:"Microsoft Edge (Windows)",content:(0,l.jsx)(x,{})})},[]),w=(0,n.useCallback)(()=>{a.Z.info({title:"Safari (MacOS)",content:(0,l.jsx)(g,{})})},[]);return(0,l.jsxs)(d.Z,{children:[(0,l.jsx)(d.Z.Header,{className:m().header,children:(0,l.jsx)("div",{className:v().logo,children:(0,l.jsx)("img",{src:"/images/logo.svg",alt:"Tanatloc"})})}),(0,l.jsx)(d.Z.Content,{style:{padding:"0 20px"},children:(0,l.jsxs)(u.default,{direction:"vertical",size:20,className:v().fullWidth,children:[(0,l.jsx)(c.Z,{title:"WebGL Error",children:(0,l.jsxs)(u.default,{direction:"vertical",children:[(0,l.jsxs)(f.Z.Text,{children:[(0,l.jsx)(h.Z,{style:{color:"red"}})," ","WebGL is not enabled on your device. Please enable it."]}),(0,l.jsx)(f.Z.Text,{children:(0,l.jsx)(s(),{type:"link",onClick:t,children:"Return to the previous page"})})]})}),(0,l.jsx)(c.Z,{title:"How to enable WebGL",children:(0,l.jsxs)(u.default,{className:m().content,children:[(0,l.jsx)(c.Z,{title:"Windows",children:(0,l.jsxs)("ul",{children:[(0,l.jsx)("li",{children:(0,l.jsx)(s(),{type:"text",onClick:r,children:"Google Chrome"})}),(0,l.jsx)("li",{children:(0,l.jsx)(s(),{type:"text",onClick:p,children:"Mozilla Firefox"})}),(0,l.jsx)("li",{children:(0,l.jsx)(s(),{type:"text",onClick:_,children:"Microsoft Edge"})})]})}),(0,l.jsx)(c.Z,{title:"MacOS / Linux",children:(0,l.jsxs)("ul",{children:[(0,l.jsx)("li",{children:(0,l.jsx)(s(),{type:"text",onClick:i,children:"Google Chrome"})}),(0,l.jsx)("li",{children:(0,l.jsx)(s(),{type:"text",onClick:y,children:"Mozilla Firefox"})}),(0,l.jsx)("li",{children:(0,l.jsx)(s(),{type:"text",onClick:w,children:"Safari"})})]})})]})}),(0,l.jsx)(c.Z,{title:"WebGL Check",children:(0,l.jsx)(u.default,{direction:"vertical",children:(0,l.jsxs)(f.Z.Text,{children:["Visit"," ",(0,l.jsxs)("a",{href:"https://get.webgl.org",target:"_blank",rel:"noreferrer",children:[" ","this website"]})," ","to check if WebGL is enabled on your device"]})})})]})})]})},w=()=>(0,l.jsx)(_,{})},49271:function(e){e.exports={header:"webgl_header__1g1nh",content:"webgl_content__u4M6M"}},14856:function(e){e.exports={variables:'"./variables.css"',colorPrimary:"#fad114",textColorDark:"rgba(0, 0, 0, 0.65)",textColorLight:"rgba(0, 0, 0, 0.45)",logo:"styles_logo__a_88m",displayNone:"styles_displayNone__X5JML",displayFlex:"styles_displayFlex__pvl0H",fullWidth:"styles_fullWidth__ig6Zi",fullHeight:"styles_fullHeight__aD1qp",noScroll:"styles_noScroll__jJYvq",scroll:"styles_scroll___zuDw",noBackground:"styles_noBackground__QOpQc",noBorder:"styles_noBorder__T5mw6",noBorderBottom:"styles_noBorderBottom__5ori7",textWhite:"styles_textWhite__yojx2",textLight:"styles_textLight__QglC7",textDark:"styles_textDark__xPmmk",textOrange:"styles_textOrange__TYZ4a",textGreen:"styles_textGreen__M8GsP",textAlignLeft:"styles_textAlignLeft__Da1jw",textAlignCenter:"styles_textAlignCenter__DSN8m",primaryColor:"styles_primaryColor__lHC0K",backgroundPrimary:"styles_backgroundPrimary__5S8pd"}},11163:function(e,t,r){e.exports=r(96885)}},function(e){e.O(0,[6373,1350,302,9774,2888,179],function(){return e(e.s=94991)}),_N_E=e.O()}]);