(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[1524],{20280:function(e,t,n){"use strict";n.d(t,{Z:function(){return s}});var l=n(87462),o=n(67294),r={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M193 796c0 17.7 14.3 32 32 32h574c17.7 0 32-14.3 32-32V563c0-176.2-142.8-319-319-319S193 386.8 193 563v233zm72-233c0-136.4 110.6-247 247-247s247 110.6 247 247v193H404V585c0-5.5-4.5-10-10-10h-44c-5.5 0-10 4.5-10 10v171h-75V563zm-48.1-252.5l39.6-39.6c3.1-3.1 3.1-8.2 0-11.3l-67.9-67.9a8.03 8.03 0 00-11.3 0l-39.6 39.6a8.03 8.03 0 000 11.3l67.9 67.9c3.1 3.1 8.1 3.1 11.3 0zm669.6-79.2l-39.6-39.6a8.03 8.03 0 00-11.3 0l-67.9 67.9a8.03 8.03 0 000 11.3l39.6 39.6c3.1 3.1 8.2 3.1 11.3 0l67.9-67.9c3.1-3.2 3.1-8.2 0-11.3zM832 892H192c-17.7 0-32 14.3-32 32v24c0 4.4 3.6 8 8 8h688c4.4 0 8-3.6 8-8v-24c0-17.7-14.3-32-32-32zM484 180h56c4.4 0 8-3.6 8-8V76c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v96c0 4.4 3.6 8 8 8z"}}]},name:"alert",theme:"outlined"},i=n(84089),s=o.forwardRef(function(e,t){return o.createElement(i.Z,(0,l.Z)({},e,{ref:t,icon:r}))})},42075:function(e,t,n){"use strict";n.d(t,{Z:function(){return g}});var l=n(94184),o=n.n(l),r=n(50344),i=n(67294),s=n(98082),a=n(53124),c=n(4173);let d=i.createContext({latestIndex:0,horizontalSize:0,verticalSize:0,supportFlexGap:!1}),h=d.Provider;function u(e){let{className:t,direction:n,index:l,marginDirection:o,children:r,split:s,wrap:a,style:c}=e,{horizontalSize:h,verticalSize:u,latestIndex:x,supportFlexGap:m}=i.useContext(d),p={};return(!m&&("vertical"===n?l<x&&(p={marginBottom:h/(s?2:1)}):p=Object.assign(Object.assign({},l<x&&{[o]:h/(s?2:1)}),a&&{paddingBottom:u})),null==r)?null:i.createElement(i.Fragment,null,i.createElement("div",{className:t,style:Object.assign(Object.assign({},p),c)},r),l<x&&s&&i.createElement("span",{className:`${t}-split`,style:p},s))}var x=n(51916),m=function(e,t){var n={};for(var l in e)Object.prototype.hasOwnProperty.call(e,l)&&0>t.indexOf(l)&&(n[l]=e[l]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols)for(var o=0,l=Object.getOwnPropertySymbols(e);o<l.length;o++)0>t.indexOf(l[o])&&Object.prototype.propertyIsEnumerable.call(e,l[o])&&(n[l[o]]=e[l[o]]);return n};let p={small:8,middle:16,large:24},f=i.forwardRef((e,t)=>{var n,l;let{getPrefixCls:c,space:d,direction:f}=i.useContext(a.E_),{size:g=(null==d?void 0:d.size)||"small",align:j,className:b,rootClassName:v,children:y,direction:Z="horizontal",prefixCls:_,split:k,style:w,wrap:C=!1,classNames:S,styles:T}=e,O=m(e,["size","align","className","rootClassName","children","direction","prefixCls","split","style","wrap","classNames","styles"]),L=(0,s.Z)(),[E,M]=i.useMemo(()=>(Array.isArray(g)?g:[g,g]).map(e=>"string"==typeof e?p[e]:e||0),[g]),P=(0,r.Z)(y,{keepEmpty:!0}),N=void 0===j&&"horizontal"===Z?"center":j,G=c("space",_),[W,D]=(0,x.Z)(G),z=o()(G,D,`${G}-${Z}`,{[`${G}-rtl`]:"rtl"===f,[`${G}-align-${N}`]:N},null!=b?b:null==d?void 0:d.className,v),B=o()(`${G}-item`,null!==(n=null==S?void 0:S.item)&&void 0!==n?n:null===(l=null==d?void 0:d.classNames)||void 0===l?void 0:l.item),F="rtl"===f?"marginLeft":"marginRight",A=0,V=P.map((e,t)=>{var n,l;null!=e&&(A=t);let o=e&&e.key||`${B}-${t}`;return i.createElement(u,{className:B,key:o,direction:Z,index:t,marginDirection:F,split:k,wrap:C,style:null!==(n=null==T?void 0:T.item)&&void 0!==n?n:null===(l=null==d?void 0:d.styles)||void 0===l?void 0:l.item},e)}),I=i.useMemo(()=>({horizontalSize:E,verticalSize:M,latestIndex:A,supportFlexGap:L}),[E,M,A,L]);if(0===P.length)return null;let R={};return C&&(R.flexWrap="wrap",L||(R.marginBottom=-M)),L&&(R.columnGap=E,R.rowGap=M),W(i.createElement("div",Object.assign({ref:t,className:z,style:Object.assign(Object.assign(Object.assign({},R),null==d?void 0:d.style),w)},O),i.createElement(h,{value:I},V)))});f.Compact=c.ZP;var g=f},94991:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/webgl",function(){return n(73025)}])},73025:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return _}});var l=n(85893),o=n(67294),r=n(11163),i=n(89099),s=n(97183),a=n(42075),c=n(85813),d=n(22850),h=n(71577),u=n(20280),x=()=>(0,l.jsx)(s.Z,{children:(0,l.jsxs)(s.Z.Content,{children:[(0,l.jsx)(d.Z.Title,{level:5,mark:!0,children:"No manipulation needed"}),(0,l.jsx)(d.Z.Text,{children:"This browser has full support for WebGL on all platforms."}),(0,l.jsx)("br",{}),(0,l.jsx)(d.Z.Text,{children:"If you are having issues with WebGL, you may need to update to the latest version of your browser."})]})}),m=()=>(0,l.jsx)(s.Z,{children:(0,l.jsxs)(s.Z.Content,{children:[(0,l.jsx)(d.Z.Title,{level:5,mark:!0,children:"1- Enter config"}),(0,l.jsxs)(d.Z,{children:["Open mozilla and enter"," ",(0,l.jsx)(d.Z.Text,{code:!0,children:"about:config"})," in your search bar"]}),(0,l.jsx)(d.Z.Title,{level:5,mark:!0,children:"2- Check if enabled"}),(0,l.jsxs)(d.Z,{children:["Search for ",(0,l.jsx)(d.Z.Text,{code:!0,children:"webgl.force-enabled"})," ","and switch value to ",(0,l.jsx)(d.Z.Text,{code:!0,children:"true"})," ","(double click on the value)"]}),(0,l.jsx)(d.Z.Title,{level:5,mark:!0,children:"3- Check if force disabled"}),(0,l.jsxs)(d.Z,{children:["Search for ",(0,l.jsx)(d.Z.Text,{code:!0,children:"webgl.disabled"})," and switch value to ",(0,l.jsx)(d.Z.Text,{code:!0,children:"false"})," (double click on the value)"]}),(0,l.jsx)(d.Z.Title,{level:5,mark:!0,children:"4- Still not working"}),(0,l.jsx)(d.Z,{children:"Update to the latest version and retry all steps, if the problem persists, switch to another web browser."})]})}),p=()=>(0,l.jsx)(s.Z,{children:(0,l.jsxs)(s.Z.Content,{children:[(0,l.jsx)(d.Z.Title,{level:4,children:"No manipulation needed (MacOS)"}),(0,l.jsx)(d.Z,{children:"Firefox on MacOS supports and enables WebGL for all versions from Snow Leopard 10.6. If WebGL still does not work, try to update to the last version of MacOS."}),(0,l.jsx)(d.Z.Title,{level:4,children:"Enable webGL (Linux)"}),(0,l.jsx)(d.Z.Title,{level:5,mark:!0,children:"1- Enter config"}),(0,l.jsxs)(d.Z,{children:["Open mozilla and enter"," ",(0,l.jsx)(d.Z.Text,{code:!0,children:"about:config"})," in your search bar"]}),(0,l.jsx)(d.Z.Title,{level:5,mark:!0,children:"2- Check if enabled"}),(0,l.jsxs)(d.Z,{children:["Search for ",(0,l.jsx)(d.Z.Text,{code:!0,children:"webgl.force-enabled"})," ","and switch value to ",(0,l.jsx)(d.Z.Text,{code:!0,children:"true"})," ","(double click on the value)"]}),(0,l.jsx)(d.Z.Title,{level:5,mark:!0,children:"3- Check if force disabled"}),(0,l.jsxs)(d.Z,{children:["Search for ",(0,l.jsx)(d.Z.Text,{code:!0,children:"webgl.disabled"})," and switch value to ",(0,l.jsx)(d.Z.Text,{code:!0,children:"false"})," (double click on the value)"]}),(0,l.jsx)(d.Z.Title,{level:5,mark:!0,children:"4- Still not working"}),(0,l.jsx)(d.Z,{children:"Update to the latest version and retry all steps."})]})}),f=n(14856),g=n.n(f),j=()=>(0,l.jsx)(s.Z,{children:(0,l.jsxs)(s.Z.Content,{children:[(0,l.jsx)(d.Z.Title,{level:5,mark:!0,children:"1- Check MacOS version"}),(0,l.jsx)(d.Z,{children:"If you have MacOS version 10.10 Yosemite or a previous one, WebGL needs to be activated manually."}),(0,l.jsx)(d.Z.Title,{level:5,mark:!0,children:"2- Developpers Settings"}),(0,l.jsxs)(d.Z,{children:["Open your browser, then go to Safari -",">"," Preferences, click",(0,l.jsx)("span",{className:g().textLight,children:"Advanced"})," tab."]}),(0,l.jsx)(d.Z.Title,{level:5,mark:!0,children:"3- Show new menu"}),(0,l.jsxs)(d.Z,{children:["At the bottom of the window, check the"," ",(0,l.jsx)("span",{className:g().textLight,children:"Show Develop"})," menu in menu bar checkbox."]}),(0,l.jsx)(d.Z.Title,{level:5,mark:!0,children:"4- Enable WebGL"}),(0,l.jsxs)(d.Z,{children:["Open Develop Tab, check enable WebGL (whether in"," ",(0,l.jsx)("span",{className:g().textLight,children:"Experimental feature"})," or in the main menu)"]})]})}),b=n(49271),v=n.n(b);let y={webGL:"WebGL is not enabled on your device. Please enable it."};var Z=()=>{let e=(0,r.useRouter)(),t=(0,o.useCallback)(()=>e.back(),[e]),n=(0,o.useCallback)(()=>{i.Z.info({title:"Google Chrome (Windows)",content:(0,l.jsx)(x,{})})},[]),f=(0,o.useCallback)(()=>{i.Z.info({title:"Google Chrome (MacOS / Linux)",content:(0,l.jsx)(x,{})})},[]),b=(0,o.useCallback)(()=>{i.Z.info({title:"Firefox (Windows)",content:(0,l.jsx)(m,{})})},[]),Z=(0,o.useCallback)(()=>{i.Z.info({title:"Firefox (MacOS / Linux)",content:(0,l.jsx)(p,{})})},[]),_=(0,o.useCallback)(()=>{i.Z.info({title:"Microsoft Edge (Windows)",content:(0,l.jsx)(x,{})})},[]),k=(0,o.useCallback)(()=>{i.Z.info({title:"Safari (MacOS)",content:(0,l.jsx)(j,{})})},[]);return(0,l.jsxs)(s.Z,{children:[(0,l.jsx)(s.Z.Header,{className:v().header,children:(0,l.jsx)("div",{className:g().logo,children:(0,l.jsx)("img",{src:"/images/logo.svg",alt:"Tanatloc"})})}),(0,l.jsx)(s.Z.Content,{style:{padding:"0 20px"},children:(0,l.jsxs)(a.Z,{direction:"vertical",size:20,className:g().fullWidth,children:[(0,l.jsx)(c.Z,{title:"WebGL Error",children:(0,l.jsxs)(a.Z,{direction:"vertical",children:[(0,l.jsxs)(d.Z.Text,{children:[(0,l.jsx)(u.Z,{style:{color:"red"}})," ",y.webGL]}),(0,l.jsx)(d.Z.Text,{children:(0,l.jsx)(h.ZP,{type:"link",onClick:t,children:"Return to the previous page"})})]})}),(0,l.jsx)(c.Z,{title:"How to enable WebGL",children:(0,l.jsxs)(a.Z,{className:v().content,children:[(0,l.jsx)(c.Z,{title:"Windows",children:(0,l.jsxs)("ul",{children:[(0,l.jsx)("li",{children:(0,l.jsx)(h.ZP,{type:"text",onClick:n,children:"Google Chrome"})}),(0,l.jsx)("li",{children:(0,l.jsx)(h.ZP,{type:"text",onClick:b,children:"Mozilla Firefox"})}),(0,l.jsx)("li",{children:(0,l.jsx)(h.ZP,{type:"text",onClick:_,children:"Microsoft Edge"})})]})}),(0,l.jsx)(c.Z,{title:"MacOS / Linux",children:(0,l.jsxs)("ul",{children:[(0,l.jsx)("li",{children:(0,l.jsx)(h.ZP,{type:"text",onClick:f,children:"Google Chrome"})}),(0,l.jsx)("li",{children:(0,l.jsx)(h.ZP,{type:"text",onClick:Z,children:"Mozilla Firefox"})}),(0,l.jsx)("li",{children:(0,l.jsx)(h.ZP,{type:"text",onClick:k,children:"Safari"})})]})})]})}),(0,l.jsx)(c.Z,{title:"WebGL Check",children:(0,l.jsx)(a.Z,{direction:"vertical",children:(0,l.jsxs)(d.Z.Text,{children:["Visit"," ",(0,l.jsxs)("a",{href:"https://get.webgl.org",target:"_blank",rel:"noreferrer",children:[" ","this website"]})," ","to check if WebGL is enabled on your device"]})})})]})})]})},_=()=>(0,l.jsx)(Z,{})},49271:function(e){e.exports={header:"webgl_header__BgZw1",content:"webgl_content__wO_1q"}},14856:function(e){e.exports={variables:'"./variables.css"',colorPrimary:"#fad114",textColorDark:"rgba(0, 0, 0, 0.65)",textColorLight:"rgba(0, 0, 0, 0.45)",logo:"styles_logo__9fFr_",displayNone:"styles_displayNone__RJhEW",displayFlex:"styles_displayFlex__KZAtX",fullWidth:"styles_fullWidth__RSmL9",fullHeight:"styles_fullHeight__OH8_r",noScroll:"styles_noScroll__SbIOd",scroll:"styles_scroll__fB2wo",noBackground:"styles_noBackground__yOr7G",noBorder:"styles_noBorder__jtLOx",noBorderBottom:"styles_noBorderBottom__RAWEg",textWhite:"styles_textWhite__LKtl2",textLight:"styles_textLight__T2MUY",textDark:"styles_textDark__Ae4VK",textOrange:"styles_textOrange__94tCV",textGreen:"styles_textGreen__rD4Yj",textAlignLeft:"styles_textAlignLeft__jTX8x",textAlignCenter:"styles_textAlignCenter__4U96c",primaryColor:"styles_primaryColor__OdDJf",backgroundPrimary:"styles_backgroundPrimary__3E7Ss"}},11163:function(e,t,n){e.exports=n(96885)},64217:function(e,t,n){"use strict";n.d(t,{Z:function(){return i}});var l=n(1413),o="".concat("accept acceptCharset accessKey action allowFullScreen allowTransparency\n    alt async autoComplete autoFocus autoPlay capture cellPadding cellSpacing challenge\n    charSet checked classID className colSpan cols content contentEditable contextMenu\n    controls coords crossOrigin data dateTime default defer dir disabled download draggable\n    encType form formAction formEncType formMethod formNoValidate formTarget frameBorder\n    headers height hidden high href hrefLang htmlFor httpEquiv icon id inputMode integrity\n    is keyParams keyType kind label lang list loop low manifest marginHeight marginWidth max maxLength media\n    mediaGroup method min minLength multiple muted name noValidate nonce open\n    optimum pattern placeholder poster preload radioGroup readOnly rel required\n    reversed role rowSpan rows sandbox scope scoped scrolling seamless selected\n    shape size sizes span spellCheck src srcDoc srcLang srcSet start step style\n    summary tabIndex target title type useMap value width wmode wrap"," ").concat("onCopy onCut onPaste onCompositionEnd onCompositionStart onCompositionUpdate onKeyDown\n    onKeyPress onKeyUp onFocus onBlur onChange onInput onSubmit onClick onContextMenu onDoubleClick\n    onDrag onDragEnd onDragEnter onDragExit onDragLeave onDragOver onDragStart onDrop onMouseDown\n    onMouseEnter onMouseLeave onMouseMove onMouseOut onMouseOver onMouseUp onSelect onTouchCancel\n    onTouchEnd onTouchMove onTouchStart onScroll onWheel onAbort onCanPlay onCanPlayThrough\n    onDurationChange onEmptied onEncrypted onEnded onError onLoadedData onLoadedMetadata\n    onLoadStart onPause onPlay onPlaying onProgress onRateChange onSeeked onSeeking onStalled onSuspend onTimeUpdate onVolumeChange onWaiting onLoad onError").split(/[\s\n]+/);function r(e,t){return 0===e.indexOf(t)}function i(e){var t,n=arguments.length>1&&void 0!==arguments[1]&&arguments[1];t=!1===n?{aria:!0,data:!0,attr:!0}:!0===n?{aria:!0}:(0,l.Z)({},n);var i={};return Object.keys(e).forEach(function(n){(t.aria&&("role"===n||r(n,"aria-"))||t.data&&r(n,"data-")||t.attr&&o.includes(n))&&(i[n]=e[n])}),i}}},function(e){e.O(0,[9391,5813,9099,9774,2888,179],function(){return e(e.s=94991)}),_N_E=e.O()}]);