(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[219],{89739:function(e,n,t){"use strict";t.d(n,{Z:function(){return c}});var i=t(1413),r=t(67294),a={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 01-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z"}}]},name:"check-circle",theme:"filled"},l=t(42135),o=function(e,n){return r.createElement(l.Z,(0,i.Z)((0,i.Z)({},e),{},{ref:n,icon:a}))};o.displayName="CheckCircleFilled";var c=r.forwardRef(o)},28058:function(e,n,t){"use strict";t.d(n,{Z:function(){return c}});var i=t(1413),r=t(67294),a={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M464 720a48 48 0 1096 0 48 48 0 10-96 0zm16-304v184c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V416c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8zm475.7 440l-416-720c-6.2-10.7-16.9-16-27.7-16s-21.6 5.3-27.7 16l-416 720C56 877.4 71.4 904 96 904h832c24.6 0 40-26.6 27.7-48zm-783.5-27.9L512 239.9l339.8 588.2H172.2z"}}]},name:"warning",theme:"outlined"},l=t(42135),o=function(e,n){return r.createElement(l.Z,(0,i.Z)((0,i.Z)({},e),{},{ref:n,icon:a}))};o.displayName="WarningOutlined";var c=r.forwardRef(o)},98082:function(e,n,t){"use strict";var i=t(97685),r=t(67294),a=t(31808);n.Z=function(){var e=r.useState(!1),n=(0,i.Z)(e,2),t=n[0],l=n[1];return r.useEffect((function(){l((0,a.fk)())}),[]),t}},24308:function(e,n,t){"use strict";t.d(n,{c4:function(){return a}});var i=t(4942),r=t(87462),a=["xxl","xl","lg","md","sm","xs"],l={xs:"(max-width: 575px)",sm:"(min-width: 576px)",md:"(min-width: 768px)",lg:"(min-width: 992px)",xl:"(min-width: 1200px)",xxl:"(min-width: 1600px)"},o=new Map,c=-1,s={},u={matchHandlers:{},dispatch:function(e){return s=e,o.forEach((function(e){return e(s)})),o.size>=1},subscribe:function(e){return o.size||this.register(),c+=1,o.set(c,e),e(s),c},unsubscribe:function(e){o.delete(e),o.size||this.unregister()},unregister:function(){var e=this;Object.keys(l).forEach((function(n){var t=l[n],i=e.matchHandlers[t];null===i||void 0===i||i.mql.removeListener(null===i||void 0===i?void 0:i.listener)})),o.clear()},register:function(){var e=this;Object.keys(l).forEach((function(n){var t=l[n],a=function(t){var a=t.matches;e.dispatch((0,r.Z)((0,r.Z)({},s),(0,i.Z)({},n,a)))},o=window.matchMedia(t);o.addListener(a),e.matchHandlers[t]={mql:o,listener:a},a(o)}))}};n.ZP=u},31808:function(e,n,t){"use strict";t.d(n,{fk:function(){return l},jD:function(){return a}});var i,r=t(98924),a=function(){return(0,r.Z)()&&window.document.documentElement},l=function(){if(!a())return!1;if(void 0!==i)return i;var e=document.createElement("div");return e.style.display="flex",e.style.flexDirection="column",e.style.rowGap="1px",e.appendChild(document.createElement("div")),e.appendChild(document.createElement("div")),document.body.appendChild(e),i=1===e.scrollHeight,document.body.removeChild(e),i}},26713:function(e,n,t){"use strict";t.d(n,{u:function(){return m},Z:function(){return h}});var i=t(87462),r=t(4942),a=t(97685),l=t(94184),o=t.n(l),c=t(50344),s=t(67294),u=t(53124),d=t(98082);function p(e){var n=e.className,t=e.direction,a=e.index,l=e.marginDirection,o=e.children,c=e.split,u=e.wrap,d=s.useContext(m),p=d.horizontalSize,f=d.verticalSize,v=d.latestIndex,h={};return d.supportFlexGap||("vertical"===t?a<v&&(h={marginBottom:p/(c?2:1)}):h=(0,i.Z)((0,i.Z)({},a<v&&(0,r.Z)({},l,p/(c?2:1))),u&&{paddingBottom:f})),null===o||void 0===o?null:s.createElement(s.Fragment,null,s.createElement("div",{className:n,style:h},o),a<v&&c&&s.createElement("span",{className:"".concat(n,"-split"),style:h},c))}var f=function(e,n){var t={};for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&n.indexOf(i)<0&&(t[i]=e[i]);if(null!=e&&"function"===typeof Object.getOwnPropertySymbols){var r=0;for(i=Object.getOwnPropertySymbols(e);r<i.length;r++)n.indexOf(i[r])<0&&Object.prototype.propertyIsEnumerable.call(e,i[r])&&(t[i[r]]=e[i[r]])}return t},m=s.createContext({latestIndex:0,horizontalSize:0,verticalSize:0,supportFlexGap:!1}),v={small:8,middle:16,large:24};var h=function(e){var n,t=s.useContext(u.E_),l=t.getPrefixCls,h=t.space,g=t.direction,x=e.size,y=void 0===x?(null===h||void 0===h?void 0:h.size)||"small":x,Z=e.align,N=e.className,E=e.children,w=e.direction,b=void 0===w?"horizontal":w,j=e.prefixCls,S=e.split,C=e.style,z=e.wrap,O=void 0!==z&&z,k=f(e,["size","align","className","children","direction","prefixCls","split","style","wrap"]),P=(0,d.Z)(),T=s.useMemo((function(){return(Array.isArray(y)?y:[y,y]).map((function(e){return function(e){return"string"===typeof e?v[e]:e||0}(e)}))}),[y]),_=(0,a.Z)(T,2),D=_[0],L=_[1],I=(0,c.Z)(E,{keepEmpty:!0}),M=void 0===Z&&"horizontal"===b?"center":Z,U=l("space",j),H=o()(U,"".concat(U,"-").concat(b),(n={},(0,r.Z)(n,"".concat(U,"-rtl"),"rtl"===g),(0,r.Z)(n,"".concat(U,"-align-").concat(M),M),n),N),F="".concat(U,"-item"),A="rtl"===g?"marginLeft":"marginRight",G=0,R=I.map((function(e,n){null!==e&&void 0!==e&&(G=n);var t=e&&e.key||"".concat(F,"-").concat(n);return s.createElement(p,{className:F,key:t,direction:b,index:n,marginDirection:A,split:S,wrap:O},e)})),B=s.useMemo((function(){return{horizontalSize:D,verticalSize:L,latestIndex:G,supportFlexGap:P}}),[D,L,G,P]);if(0===I.length)return null;var W={};return O&&(W.flexWrap="wrap",P||(W.marginBottom=-L)),P&&(W.columnGap=D,W.rowGap=L),s.createElement("div",(0,i.Z)({className:H,style:(0,i.Z)((0,i.Z)({},W),C)},k),s.createElement(m.Provider,{value:B},R))}},11382:function(e,n,t){"use strict";var i=t(87462),r=t(4942),a=t(15671),l=t(43144),o=t(32531),c=t(73568),s=t(94184),u=t.n(s),d=t(23279),p=t.n(d),f=t(98423),m=t(67294),v=t(53124),h=t(96159),g=t(93355),x=function(e,n){var t={};for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&n.indexOf(i)<0&&(t[i]=e[i]);if(null!=e&&"function"===typeof Object.getOwnPropertySymbols){var r=0;for(i=Object.getOwnPropertySymbols(e);r<i.length;r++)n.indexOf(i[r])<0&&Object.prototype.propertyIsEnumerable.call(e,i[r])&&(t[i[r]]=e[i[r]])}return t},y=((0,g.b)("small","default","large"),null);var Z=function(e){(0,o.Z)(t,e);var n=(0,c.Z)(t);function t(e){var l;(0,a.Z)(this,t),(l=n.call(this,e)).debouncifyUpdateSpinning=function(e){var n=(e||l.props).delay;n&&(l.cancelExistingSpin(),l.updateSpinning=p()(l.originalUpdateSpinning,n))},l.updateSpinning=function(){var e=l.props.spinning;l.state.spinning!==e&&l.setState({spinning:e})},l.renderSpin=function(e){var n,t=e.direction,a=l.props,o=a.spinPrefixCls,c=a.className,s=a.size,d=a.tip,p=a.wrapperClassName,v=a.style,g=x(a,["spinPrefixCls","className","size","tip","wrapperClassName","style"]),Z=l.state.spinning,N=u()(o,(n={},(0,r.Z)(n,"".concat(o,"-sm"),"small"===s),(0,r.Z)(n,"".concat(o,"-lg"),"large"===s),(0,r.Z)(n,"".concat(o,"-spinning"),Z),(0,r.Z)(n,"".concat(o,"-show-text"),!!d),(0,r.Z)(n,"".concat(o,"-rtl"),"rtl"===t),n),c),E=(0,f.Z)(g,["spinning","delay","indicator","prefixCls"]),w=m.createElement("div",(0,i.Z)({},E,{style:v,className:N,"aria-live":"polite","aria-busy":Z}),function(e,n){var t=n.indicator,i="".concat(e,"-dot");return null===t?null:(0,h.l$)(t)?(0,h.Tm)(t,{className:u()(t.props.className,i)}):(0,h.l$)(y)?(0,h.Tm)(y,{className:u()(y.props.className,i)}):m.createElement("span",{className:u()(i,"".concat(e,"-dot-spin"))},m.createElement("i",{className:"".concat(e,"-dot-item")}),m.createElement("i",{className:"".concat(e,"-dot-item")}),m.createElement("i",{className:"".concat(e,"-dot-item")}),m.createElement("i",{className:"".concat(e,"-dot-item")}))}(o,l.props),d?m.createElement("div",{className:"".concat(o,"-text")},d):null);if(l.isNestedPattern()){var b=u()("".concat(o,"-container"),(0,r.Z)({},"".concat(o,"-blur"),Z));return m.createElement("div",(0,i.Z)({},E,{className:u()("".concat(o,"-nested-loading"),p)}),Z&&m.createElement("div",{key:"loading"},w),m.createElement("div",{className:b,key:"container"},l.props.children))}return w};var o=e.spinning,c=function(e,n){return!!e&&!!n&&!isNaN(Number(n))}(o,e.delay);return l.state={spinning:o&&!c},l.originalUpdateSpinning=l.updateSpinning,l.debouncifyUpdateSpinning(e),l}return(0,l.Z)(t,[{key:"componentDidMount",value:function(){this.updateSpinning()}},{key:"componentDidUpdate",value:function(){this.debouncifyUpdateSpinning(),this.updateSpinning()}},{key:"componentWillUnmount",value:function(){this.cancelExistingSpin()}},{key:"cancelExistingSpin",value:function(){var e=this.updateSpinning;e&&e.cancel&&e.cancel()}},{key:"isNestedPattern",value:function(){return!(!this.props||"undefined"===typeof this.props.children)}},{key:"render",value:function(){return m.createElement(v.C,null,this.renderSpin)}}]),t}(m.Component);Z.defaultProps={spinning:!0,size:"default",wrapperClassName:""};var N=function(e){var n=e.prefixCls,t=(0,m.useContext(v.E_).getPrefixCls)("spin",n),r=(0,i.Z)((0,i.Z)({},e),{spinPrefixCls:t});return m.createElement(Z,(0,i.Z)({},r))};N.setDefaultIndicator=function(e){y=e},n.Z=N},27561:function(e,n,t){var i=t(67990),r=/^\s+/;e.exports=function(e){return e?e.slice(0,i(e)+1).replace(r,""):e}},67990:function(e){var n=/\s/;e.exports=function(e){for(var t=e.length;t--&&n.test(e.charAt(t)););return t}},23279:function(e,n,t){var i=t(13218),r=t(7771),a=t(14841),l=Math.max,o=Math.min;e.exports=function(e,n,t){var c,s,u,d,p,f,m=0,v=!1,h=!1,g=!0;if("function"!=typeof e)throw new TypeError("Expected a function");function x(n){var t=c,i=s;return c=s=void 0,m=n,d=e.apply(i,t)}function y(e){return m=e,p=setTimeout(N,n),v?x(e):d}function Z(e){var t=e-f;return void 0===f||t>=n||t<0||h&&e-m>=u}function N(){var e=r();if(Z(e))return E(e);p=setTimeout(N,function(e){var t=n-(e-f);return h?o(t,u-(e-m)):t}(e))}function E(e){return p=void 0,g&&c?x(e):(c=s=void 0,d)}function w(){var e=r(),t=Z(e);if(c=arguments,s=this,f=e,t){if(void 0===p)return y(f);if(h)return clearTimeout(p),p=setTimeout(N,n),x(f)}return void 0===p&&(p=setTimeout(N,n)),d}return n=a(n)||0,i(t)&&(v=!!t.leading,u=(h="maxWait"in t)?l(a(t.maxWait)||0,n):u,g="trailing"in t?!!t.trailing:g),w.cancel=function(){void 0!==p&&clearTimeout(p),m=0,c=f=s=p=void 0},w.flush=function(){return void 0===p?d:E(r())},w}},33448:function(e,n,t){var i=t(44239),r=t(37005);e.exports=function(e){return"symbol"==typeof e||r(e)&&"[object Symbol]"==i(e)}},7771:function(e,n,t){var i=t(55639);e.exports=function(){return i.Date.now()}},14841:function(e,n,t){var i=t(27561),r=t(13218),a=t(33448),l=/^[-+]0x[0-9a-f]+$/i,o=/^0b[01]+$/i,c=/^0o[0-7]+$/i,s=parseInt;e.exports=function(e){if("number"==typeof e)return e;if(a(e))return NaN;if(r(e)){var n="function"==typeof e.valueOf?e.valueOf():e;e=r(n)?n+"":n}if("string"!=typeof e)return 0===e?e:+e;e=i(e);var t=o.test(e);return t||c.test(e)?s(e.slice(2),t?2:8):l.test(e)?NaN:+e}},97414:function(e,n,t){(window.__NEXT_P=window.__NEXT_P||[]).push(["/start",function(){return t(1920)}])},75107:function(e,n,t){"use strict";var i=t(85893),r=t(28058),a=t(26713),l=t(81474),o=t(11382),c=t(97183),s=t(6880),u=t(91756),d=function(e){var n=e.text,t=e.status,d=e.errors,p=(null===d||void 0===d?void 0:d.length)?"error":"process";return(0,i.jsxs)(c.Z,{className:"tanatloc-gradient",children:[(0,i.jsx)("div",{className:"logo",children:(0,i.jsx)("img",{src:"/images/logo.svg",alt:"Tanatloc"})}),(0,i.jsxs)(l.Z,{className:"Loading",bodyStyle:(null===t||void 0===t?void 0:t.length)||(null===d||void 0===d?void 0:d.length)?void 0:{padding:0},title:(0,i.jsx)(a.Z,{children:(null===d||void 0===d?void 0:d.length)?(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(r.Z,{style:{fontSize:"32px",color:"red"}}),(0,i.jsx)(s.Z.Title,{level:3,className:"no-margin",children:"An error occurs"})]}):(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(o.Z,{size:"large"}),null!==n&&void 0!==n?n:"Loading, please wait..."]})}),children:[(null===d||void 0===d?void 0:d.length)?(0,i.jsxs)("div",{className:"Loading-errors",children:[d.map((function(e,n){var t=null;return e.includes("docker: command not found")||e.includes("Is the docker daemon running")?t=(0,i.jsxs)(l.Z,{children:["There is an error with your Docker installation.",(0,i.jsx)("br",{}),"Please verify that Docker is correctly installed and running."]}):(e.includes("EHOSTUNREACH")||e.includes("ENETUNREACH")||e.includes("ETIMEOUT"))&&(t=(0,i.jsxs)(l.Z,{children:["There is an error with your PostgreSQL installation.",(0,i.jsx)("br",{}),'Please verify that postgres Docker container "tanatloc-postgres" is correctly installed and running.']})),(0,i.jsxs)("div",{children:[e,t]},n)})),(0,i.jsx)(s.Z.Title,{level:5,style:{color:"red"},children:"Please restart the application"})]}):null,(null===t||void 0===t?void 0:t.length)?(0,i.jsx)("div",{className:"Loading-status",children:(0,i.jsx)(u.Z,{direction:"vertical",children:t.map((function(e,n){return(0,i.jsx)(u.Z.Step,{status:n===t.length-1?p:"finish",title:e},n)}))})}):null]})]})};d.Simple=function(){return(0,i.jsx)(a.Z,{style:{height:"100%",width:"100%",justifyContent:"center",alignItems:"center"},children:(0,i.jsx)(l.Z,{children:(0,i.jsxs)(a.Z,{children:[(0,i.jsx)(o.Z,{}),"Loading, please wait..."]})})})},n.Z=d},1920:function(e,n,t){"use strict";t.r(n),t.d(n,{default:function(){return c}});var i=t(85893),r=t(6880),a=t(11163),l=t(75107),o=function(){var e=(0,a.useRouter)().query,n=e.status,t=e.err;return(0,i.jsx)(i.Fragment,{children:(0,i.jsx)(l.Z,{text:(0,i.jsx)(r.Z.Title,{level:3,className:"no-margin",children:"Tanatloc is starting, please wait..."}),status:(null===n||void 0===n?void 0:n.length)?null===n||void 0===n?void 0:n.split(";"):[],errors:(null===t||void 0===t?void 0:t.length)?null===t||void 0===t?void 0:t.split(";"):[]})})},c=function(){return(0,i.jsx)(o,{})}}},function(e){e.O(0,[841,362,474,756,774,888,179],(function(){return n=97414,e(e.s=n);var n}));var n=e.O();_N_E=n}]);