"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[7909],{68795:function(e,n,t){t.d(n,{Z:function(){return c}});var r=t(1413),i=t(67294),o={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0011.6 0l43.6-43.5a8.2 8.2 0 000-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z"}}]},name:"search",theme:"outlined"},u=t(42135),a=function(e,n){return i.createElement(u.Z,(0,r.Z)((0,r.Z)({},e),{},{ref:n,icon:o}))};a.displayName="SearchOutlined";var c=i.forwardRef(a)},20943:function(e,n,t){function r(e,n){(null==n||n>e.length)&&(n=e.length);for(var t=0,r=new Array(n);t<n;t++)r[t]=e[t];return r}t.d(n,{Z:function(){return r}})},13375:function(e,n,t){function r(e){if("undefined"!==typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}t.d(n,{Z:function(){return r}})},828:function(e,n,t){t.d(n,{Z:function(){return o}});var r=t(13375);var i=t(91566);function o(e,n){return function(e){if(Array.isArray(e))return e}(e)||(0,r.Z)(e,n)||(0,i.Z)(e,n)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}},91566:function(e,n,t){t.d(n,{Z:function(){return i}});var r=t(20943);function i(e,n){if(e){if("string"===typeof e)return(0,r.Z)(e,n);var t=Object.prototype.toString.call(e).slice(8,-1);return"Object"===t&&e.constructor&&(t=e.constructor.name),"Map"===t||"Set"===t?Array.from(t):"Arguments"===t||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)?(0,r.Z)(e,n):void 0}}},8100:function(e,n,t){t.d(n,{ZP:function(){return K}});var r=t(67294);function i(e,n,t,r){return new(t||(t=Promise))((function(i,o){function u(e){try{c(r.next(e))}catch(n){o(n)}}function a(e){try{c(r.throw(e))}catch(n){o(n)}}function c(e){var n;e.done?i(e.value):(n=e.value,n instanceof t?n:new t((function(e){e(n)}))).then(u,a)}c((r=r.apply(e,n||[])).next())}))}function o(e,n){var t,r,i,o,u={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return o={next:a(0),throw:a(1),return:a(2)},"function"===typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function a(o){return function(a){return function(o){if(t)throw new TypeError("Generator is already executing.");for(;u;)try{if(t=1,r&&(i=2&o[0]?r.return:o[0]?r.throw||((i=r.return)&&i.call(r),0):r.next)&&!(i=i.call(r,o[1])).done)return i;switch(r=0,i&&(o=[2&o[0],i.value]),o[0]){case 0:case 1:i=o;break;case 4:return u.label++,{value:o[1],done:!1};case 5:u.label++,r=o[1],o=[0];continue;case 7:o=u.ops.pop(),u.trys.pop();continue;default:if(!(i=(i=u.trys).length>0&&i[i.length-1])&&(6===o[0]||2===o[0])){u=0;continue}if(3===o[0]&&(!i||o[1]>i[0]&&o[1]<i[3])){u.label=o[1];break}if(6===o[0]&&u.label<i[1]){u.label=i[1],i=o;break}if(i&&u.label<i[2]){u.label=i[2],u.ops.push(o);break}i[2]&&u.ops.pop(),u.trys.pop();continue}o=n.call(e,u)}catch(a){o=[6,a],r=0}finally{t=i=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,a])}}}var u,a=function(){},c=a(),f=Object,s=function(e){return e===c},l=function(e){return"function"==typeof e},d=function(e,n){return f.assign({},e,n)},v="undefined",h=function(){return typeof window!=v},g=new WeakMap,p=0,y=function(e){var n,t,r=typeof e,i=e&&e.constructor,o=i==Date;if(f(e)!==e||o||i==RegExp)n=o?e.toJSON():"symbol"==r?e.toString():"string"==r?JSON.stringify(e):""+e;else{if(n=g.get(e))return n;if(n=++p+"~",g.set(e,n),i==Array){for(n="@",t=0;t<e.length;t++)n+=y(e[t])+",";g.set(e,n)}if(i==f){n="#";for(var u=f.keys(e).sort();!s(t=u.pop());)s(e[t])||(n+=t+":"+y(e[t])+",");g.set(e,n)}}return n},b=!0,m=h(),w=typeof document!=v,E=m&&window.addEventListener?window.addEventListener.bind(window):a,R=w?document.addEventListener.bind(document):a,O=m&&window.removeEventListener?window.removeEventListener.bind(window):a,S=w?document.removeEventListener.bind(document):a,k={isOnline:function(){return b},isVisible:function(){var e=w&&document.visibilityState;return s(e)||"hidden"!==e}},C={initFocus:function(e){return R("visibilitychange",e),E("focus",e),function(){S("visibilitychange",e),O("focus",e)}},initReconnect:function(e){var n=function(){b=!0,e()},t=function(){b=!1};return E("online",n),E("offline",t),function(){O("online",n),O("offline",t)}}},T=!h()||"Deno"in window,V=function(e){return h()&&typeof window.requestAnimationFrame!=v?window.requestAnimationFrame(e):setTimeout(e,1)},I=T?r.useEffect:r.useLayoutEffect,Z="undefined"!==typeof navigator&&navigator.connection,A=!T&&Z&&(["slow-2g","2g"].includes(Z.effectiveType)||Z.saveData),x=function(e){if(l(e))try{e=e()}catch(t){e=""}var n=[].concat(e);return[e="string"==typeof e?e:(Array.isArray(e)?e.length:e)?y(e):"",n,e?"$swr$"+e:""]},D=new WeakMap,L=function(e,n,t,r,i,o,u){void 0===u&&(u=!0);var a=D.get(e),c=a[0],f=a[1],s=a[3],l=c[n],d=f[n];if(u&&d)for(var v=0;v<d.length;++v)d[v](t,r,i);return o&&(delete s[n],l&&l[0])?l[0](2).then((function(){return e.get(n)})):e.get(n)},M=0,P=function(){return++M},F=function(){for(var e=[],n=0;n<arguments.length;n++)e[n]=arguments[n];return i(void 0,void 0,void 0,(function(){var n,t,r,i,u,a,f,v,h,g,p,y,b,m,w,E,R,O,S,k,C;return o(this,(function(o){switch(o.label){case 0:if(n=e[0],t=e[1],r=e[2],i=e[3],a=!!s((u="boolean"===typeof i?{revalidate:i}:i||{}).populateCache)||u.populateCache,f=!1!==u.revalidate,v=!1!==u.rollbackOnError,h=u.optimisticData,g=x(t),p=g[0],y=g[2],!p)return[2];if(b=D.get(n),m=b[2],e.length<3)return[2,L(n,p,n.get(p),c,c,f,!0)];if(w=r,R=P(),m[p]=[R,0],O=!s(h),S=n.get(p),O&&(k=l(h)?h(S):h,n.set(p,k),L(n,p,k)),l(w))try{w=w(n.get(p))}catch(T){E=T}return w&&l(w.then)?[4,w.catch((function(e){E=e}))]:[3,2];case 1:if(w=o.sent(),R!==m[p][0]){if(E)throw E;return[2,w]}E&&O&&v&&(a=!0,w=S,n.set(p,S)),o.label=2;case 2:return a&&(E||(l(a)&&(w=a(w,S)),n.set(p,w)),n.set(y,d(n.get(y),{error:E}))),m[p][1]=P(),[4,L(n,p,w,E,c,f,!!a)];case 3:if(C=o.sent(),E)throw E;return[2,a?C:w]}}))}))},N=function(e,n){for(var t in e)e[t][0]&&e[t][0](n)},j=function(e,n){if(!D.has(e)){var t=d(C,n),r={},i=F.bind(c,e),o=a;if(D.set(e,[r,{},{},{},i]),!T){var u=t.initFocus(setTimeout.bind(c,N.bind(c,r,0))),f=t.initReconnect(setTimeout.bind(c,N.bind(c,r,1)));o=function(){u&&u(),f&&f(),D.delete(e)}}return[e,i,o]}return[e,D.get(e)[4]]},W=j(new Map),_=W[0],$=W[1],q=d({onLoadingSlow:a,onSuccess:a,onError:a,onErrorRetry:function(e,n,t,r,i){var o=t.errorRetryCount,u=i.retryCount,a=~~((Math.random()+.5)*(1<<(u<8?u:8)))*t.errorRetryInterval;!s(o)&&u>o||setTimeout(r,a,i)},onDiscarded:a,revalidateOnFocus:!0,revalidateOnReconnect:!0,revalidateIfStale:!0,shouldRetryOnError:!0,errorRetryInterval:A?1e4:5e3,focusThrottleInterval:5e3,dedupingInterval:2e3,loadingTimeout:A?5e3:3e3,compare:function(e,n){return y(e)==y(n)},isPaused:function(){return!1},cache:_,mutate:$,fallback:{}},k),z=function(e,n){var t=d(e,n);if(n){var r=e.use,i=e.fallback,o=n.use,u=n.fallback;r&&o&&(t.use=r.concat(o)),i&&u&&(t.fallback=d(i,u))}return t},J=(0,r.createContext)({}),B=function(e){return l(e[1])?[e[0],e[1],e[2]||{}]:[e[0],null,(null===e[1]?e[2]:e[1])||{}]},G=function(){return d(q,(0,r.useContext)(J))},H=function(e,n,t){var r=n[e]||(n[e]=[]);return r.push(t),function(){var e=r.indexOf(t);e>=0&&(r[e]=r[r.length-1],r.pop())}},U={dedupe:!0},K=(f.defineProperty((function(e){var n=e.value,t=z((0,r.useContext)(J),n),i=n&&n.provider,o=(0,r.useState)((function(){return i?j(i(t.cache||_),n):c}))[0];return o&&(t.cache=o[0],t.mutate=o[1]),I((function(){return o?o[2]:c}),[]),(0,r.createElement)(J.Provider,d(e,{value:t}))}),"default",{value:q}),u=function(e,n,t){var u=t.cache,a=t.compare,f=t.fallbackData,v=t.suspense,h=t.revalidateOnMount,g=t.refreshInterval,p=t.refreshWhenHidden,y=t.refreshWhenOffline,b=D.get(u),m=b[0],w=b[1],E=b[2],R=b[3],O=x(e),S=O[0],k=O[1],C=O[2],Z=(0,r.useRef)(!1),A=(0,r.useRef)(!1),M=(0,r.useRef)(S),N=(0,r.useRef)(n),j=(0,r.useRef)(t),W=function(){return j.current},_=function(){return W().isVisible()&&W().isOnline()},$=function(e){return u.set(C,d(u.get(C),e))},q=u.get(S),z=s(f)?t.fallback[S]:f,J=s(q)?z:q,B=u.get(C)||{},G=B.error,K=!Z.current,Q=function(){return K&&!s(h)?h:!W().isPaused()&&(v?!s(J)&&t.revalidateIfStale:s(J)||t.revalidateIfStale)},X=!(!S||!n)&&(!!B.isValidating||K&&Q()),Y=function(e,n){var t=(0,r.useState)({})[1],i=(0,r.useRef)(e),o=(0,r.useRef)({data:!1,error:!1,isValidating:!1}),u=(0,r.useCallback)((function(e){var r=!1,u=i.current;for(var a in e){var c=a;u[c]!==e[c]&&(u[c]=e[c],o.current[c]&&(r=!0))}r&&!n.current&&t({})}),[]);return I((function(){i.current=e})),[i,o.current,u]}({data:J,error:G,isValidating:X},A),ee=Y[0],ne=Y[1],te=Y[2],re=(0,r.useCallback)((function(e){return i(void 0,void 0,void 0,(function(){var n,r,i,f,d,v,h,g,p,y,b,m,w;return o(this,(function(o){switch(o.label){case 0:if(n=N.current,!S||!n||A.current||W().isPaused())return[2,!1];f=!0,d=e||{},v=!R[S]||!d.dedupe,h=function(){return!A.current&&S===M.current&&Z.current},g=function(){var e=R[S];e&&e[1]===i&&delete R[S]},p={isValidating:!1},y=function(){$({isValidating:!1}),h()&&te(p)},$({isValidating:!0}),te({isValidating:!0}),o.label=1;case 1:return o.trys.push([1,3,,4]),v&&(L(u,S,ee.current.data,ee.current.error,!0),t.loadingTimeout&&!u.get(S)&&setTimeout((function(){f&&h()&&W().onLoadingSlow(S,t)}),t.loadingTimeout),R[S]=[n.apply(void 0,k),P()]),w=R[S],r=w[0],i=w[1],[4,r];case 2:return r=o.sent(),v&&setTimeout(g,t.dedupingInterval),R[S]&&R[S][1]===i?($({error:c}),p.error=c,b=E[S],!s(b)&&(i<=b[0]||i<=b[1]||0===b[1])?(y(),v&&h()&&W().onDiscarded(S),[2,!1]):(a(ee.current.data,r)?p.data=ee.current.data:p.data=r,a(u.get(S),r)||u.set(S,r),v&&h()&&W().onSuccess(r,S,t),[3,4])):(v&&h()&&W().onDiscarded(S),[2,!1]);case 3:return m=o.sent(),g(),W().isPaused()||($({error:m}),p.error=m,v&&h()&&(W().onError(m,S,t),("boolean"===typeof t.shouldRetryOnError&&t.shouldRetryOnError||l(t.shouldRetryOnError)&&t.shouldRetryOnError(m))&&_()&&W().onErrorRetry(m,S,t,re,{retryCount:(d.retryCount||0)+1,dedupe:!0}))),[3,4];case 4:return f=!1,y(),h()&&v&&L(u,S,p.data,p.error,!1),[2,!0]}}))}))}),[S]),ie=(0,r.useCallback)(F.bind(c,u,(function(){return M.current})),[]);if(I((function(){N.current=n,j.current=t})),I((function(){if(S){var e=S!==M.current,n=re.bind(c,U),t=0,r=H(S,w,(function(e,n,t){te(d({error:n,isValidating:t},a(ee.current.data,e)?c:{data:e}))})),i=H(S,m,(function(e){if(0==e){var r=Date.now();W().revalidateOnFocus&&r>t&&_()&&(t=r+W().focusThrottleInterval,n())}else if(1==e)W().revalidateOnReconnect&&_()&&n();else if(2==e)return re()}));return A.current=!1,M.current=S,Z.current=!0,e&&te({data:J,error:G,isValidating:X}),Q()&&(s(J)||T?n():V(n)),function(){A.current=!0,r(),i()}}}),[S,re]),I((function(){var e;function n(){var n=l(g)?g(J):g;n&&-1!==e&&(e=setTimeout(t,n))}function t(){ee.current.error||!p&&!W().isVisible()||!y&&!W().isOnline()?n():re(U).then(n)}return n(),function(){e&&(clearTimeout(e),e=-1)}}),[g,p,y,re]),(0,r.useDebugValue)(J),v&&s(J)&&S)throw N.current=n,j.current=t,A.current=!1,s(G)?re(U):G;return{mutate:ie,get data(){return ne.data=!0,J},get error(){return ne.error=!0,G},get isValidating(){return ne.isValidating=!0,X}}},function(){for(var e=[],n=0;n<arguments.length;n++)e[n]=arguments[n];var t=G(),r=B(e),i=r[0],o=r[1],a=r[2],c=z(t,a),f=u,s=c.use;if(s)for(var l=s.length;l-- >0;)f=s[l](f);return f(i,o||c.fetcher,c)})}}]);