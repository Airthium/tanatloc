(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[954],{68795:function(e,t,n){"use strict";n.d(t,{Z:function(){return l}});var r=n(1413),i=n(67294),o={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0011.6 0l43.6-43.5a8.2 8.2 0 000-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z"}}]},name:"search",theme:"outlined"},a=n(42135),u=function(e,t){return i.createElement(a.Z,(0,r.Z)((0,r.Z)({},e),{},{ref:t,icon:o}))};u.displayName="SearchOutlined";var l=i.forwardRef(u)},59134:function(e,t,n){var r=n(83454);e.exports=function(){return!!("undefined"!=typeof window&&"object"==typeof window.process&&"renderer"===window.process.type||void 0!==r&&"object"==typeof r.versions&&r.versions.electron||"object"==typeof navigator&&"string"==typeof navigator.userAgent&&navigator.userAgent.indexOf("Electron")>=0)}},53250:function(e,t,n){"use strict";/**
 * @license React
 * use-sync-external-store-shim.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var r=n(67294),i="function"==typeof Object.is?Object.is:function(e,t){return e===t&&(0!==e||1/e==1/t)||e!=e&&t!=t},o=r.useState,a=r.useEffect,u=r.useLayoutEffect,l=r.useDebugValue;function s(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!i(e,n)}catch(e){return!0}}var c="undefined"==typeof window||void 0===window.document||void 0===window.document.createElement?function(e,t){return t()}:function(e,t){var n=t(),r=o({inst:{value:n,getSnapshot:t}}),i=r[0].inst,c=r[1];return u(function(){i.value=n,i.getSnapshot=t,s(i)&&c({inst:i})},[e,n,t]),a(function(){return s(i)&&c({inst:i}),e(function(){s(i)&&c({inst:i})})},[e]),l(n),n};t.useSyncExternalStore=void 0!==r.useSyncExternalStore?r.useSyncExternalStore:c},61688:function(e,t,n){"use strict";e.exports=n(53250)},59734:function(e,t,n){"use strict";n.d(t,{ZP:function(){return eo}});var r=n(67294),i=n(61688);let o=new WeakMap,a={},u={},l=()=>{},s=l(),c=Object,d=e=>e===s,f=e=>"function"==typeof e,g=(e,t)=>({...e,...t}),E="undefined",p=typeof window!=E,v=typeof document!=E,w=()=>p&&typeof window.requestAnimationFrame!=E,y=(e,t)=>{let n=o.get(e);return[()=>!d(t)&&e.get(t)||a,r=>{if(!d(t)){let i=e.get(t);t in u||(u[t]=i),n[5](t,g(i,r),i||a)}},n[6],()=>!d(t)&&t in u?u[t]:!d(t)&&e.get(t)||a]},h=new WeakMap,_=0,m=e=>{let t,n;let r=typeof e,i=e&&e.constructor,o=i==Date;if(c(e)!==e||o||i==RegExp)t=o?e.toJSON():"symbol"==r?e.toString():"string"==r?JSON.stringify(e):""+e;else{if(t=h.get(e))return t;if(t=++_+"~",h.set(e,t),i==Array){for(n=0,t="@";n<e.length;n++)t+=m(e[n])+",";h.set(e,t)}if(i==c){t="#";let r=c.keys(e).sort();for(;!d(n=r.pop());)d(e[n])||(t+=n+":"+m(e[n])+",");h.set(e,t)}}return t},b=!0,[R,T]=p&&window.addEventListener?[window.addEventListener.bind(window),window.removeEventListener.bind(window)]:[l,l],S=()=>{let e=v&&document.visibilityState;return d(e)||"hidden"!==e},O=e=>(v&&document.addEventListener("visibilitychange",e),R("focus",e),()=>{v&&document.removeEventListener("visibilitychange",e),T("focus",e)}),C=e=>{let t=()=>{b=!0,e()},n=()=>{b=!1};return R("online",t),R("offline",n),()=>{T("online",t),T("offline",n)}},V={initFocus:O,initReconnect:C},L=!r.useId,k=!p||"Deno"in window,N=e=>w()?window.requestAnimationFrame(e):setTimeout(e,1),x=k?r.useEffect:r.useLayoutEffect,A="undefined"!=typeof navigator&&navigator.connection,D=!k&&A&&(["slow-2g","2g"].includes(A.effectiveType)||A.saveData),I=e=>{if(f(e))try{e=e()}catch(t){e=""}let t=e;return[e="string"==typeof e?e:(Array.isArray(e)?e.length:e)?m(e):"",t]},M=0,P=()=>++M;var F={__proto__:null,FOCUS_EVENT:0,RECONNECT_EVENT:1,MUTATE_EVENT:2,ERROR_REVALIDATE_EVENT:3};async function j(...e){let[t,n,r,i]=e,a=g({populateCache:!0,throwOnError:!0},"boolean"==typeof i?{revalidate:i}:i||{}),u=a.populateCache,l=a.rollbackOnError,c=a.optimisticData,E=!1!==a.revalidate,p=e=>"function"==typeof l?l(e):!1!==l,v=a.throwOnError;if(f(n)){let e=[],r=t.keys();for(let i=r.next();!i.done;i=r.next()){let r=i.value;!/^\$(inf|sub)\$/.test(r)&&n(t.get(r)._k)&&e.push(r)}return Promise.all(e.map(w))}return w(n);async function w(n){let i;let[a]=I(n);if(!a)return;let[l,g]=y(t,a),[w,h,_]=o.get(t),m=w[a],b=()=>E&&(delete _[a],m&&m[0])?m[0](2).then(()=>l().data):l().data;if(e.length<3)return b();let R=r,T=P();h[a]=[T,0];let S=!d(c),O=l(),C=O.data,V=O._c,L=d(V)?C:V;if(S&&g({data:c=f(c)?c(L):c,_c:L}),f(R))try{R=R(L)}catch(e){i=e}if(R&&f(R.then)){if(R=await R.catch(e=>{i=e}),T!==h[a][0]){if(i)throw i;return R}i&&S&&p(i)&&(u=!0,g({data:R=L,_c:s}))}u&&!i&&(f(u)&&(R=u(R,L)),g({data:R,_c:s})),h[a][1]=P();let k=await b();if(g({_c:s}),i){if(v)throw i;return}return u?k:R}}let U=(e,t)=>{for(let n in e)e[n][0]&&e[n][0](t)},W=(e,t)=>{if(!o.has(e)){let n=g(V,t),r={},i=j.bind(s,e),a=l,u={},c=(e,t)=>{let n=u[e]||[];return u[e]=n,n.push(t),()=>n.splice(n.indexOf(t),1)},d=(t,n,r)=>{e.set(t,n);let i=u[t];if(i)for(let e of i)e(n,r)},f=()=>{if(!o.has(e)&&(o.set(e,[r,{},{},{},i,d,c]),!k)){let t=n.initFocus(setTimeout.bind(s,U.bind(s,r,0))),i=n.initReconnect(setTimeout.bind(s,U.bind(s,r,1)));a=()=>{t&&t(),i&&i(),o.delete(e)}}};return f(),[e,i,f,a]}return[e,o.get(e)[4]]},Z=(e,t,n,r,i)=>{let o=n.errorRetryCount,a=i.retryCount,u=~~((Math.random()+.5)*(1<<(a<8?a:8)))*n.errorRetryInterval;(d(o)||!(a>o))&&setTimeout(r,u,i)},q=(e,t)=>m(e)==m(t),[z,J]=W(new Map),$=g({onLoadingSlow:l,onSuccess:l,onError:l,onErrorRetry:Z,onDiscarded:l,revalidateOnFocus:!0,revalidateOnReconnect:!0,revalidateIfStale:!0,shouldRetryOnError:!0,errorRetryInterval:D?1e4:5e3,focusThrottleInterval:5e3,dedupingInterval:2e3,loadingTimeout:D?5e3:3e3,compare:q,isPaused:()=>!1,cache:z,mutate:J,fallback:{}},{isOnline:()=>b,isVisible:S}),B=(e,t)=>{let n=g(e,t);if(t){let{use:r,fallback:i}=e,{use:o,fallback:a}=t;r&&o&&(n.use=r.concat(o)),i&&a&&(n.fallback=g(i,a))}return n},G=(0,r.createContext)({}),H=e=>{let{value:t}=e,n=(0,r.useContext)(G),i=f(t),o=(0,r.useMemo)(()=>i?t(n):t,[i,n,t]),a=(0,r.useMemo)(()=>i?o:B(n,o),[i,n,o]),u=o&&o.provider,l=(0,r.useRef)(s);u&&!l.current&&(l.current=W(u(a.cache||z),o));let c=l.current;return c&&(a.cache=c[0],a.mutate=c[1]),x(()=>{if(c)return c[2]&&c[2](),c[3]},[]),(0,r.createElement)(G.Provider,g(e,{value:a}))},K=p&&window.__SWR_DEVTOOLS_USE__,Q=K?window.__SWR_DEVTOOLS_USE__:[],X=e=>f(e[1])?[e[0],e[1],e[2]||{}]:[e[0],null,(null===e[1]?e[2]:e[1])||{}],Y=()=>g($,(0,r.useContext)(G)),ee=e=>(t,n,r)=>{let i=n&&((...e)=>{let r=I(t)[0],[,,,i]=o.get(z),a=i[r];return a?(delete i[r],a):n(...e)});return e(t,i,r)},et=Q.concat(ee),en=(e,t,n)=>{let r=t[e]||(t[e]=[]);return r.push(n),()=>{let e=r.indexOf(n);e>=0&&(r[e]=r[r.length-1],r.pop())}};K&&(window.__SWR_DEVTOOLS_REACT__=r);let er={dedupe:!0},ei=(e,t,n)=>{let{cache:a,compare:u,suspense:l,fallbackData:c,revalidateOnMount:E,revalidateIfStale:p,refreshInterval:v,refreshWhenHidden:w,refreshWhenOffline:h,keepPreviousData:_}=n,[m,b,R]=o.get(a),[T,S]=I(e),O=(0,r.useRef)(!1),C=(0,r.useRef)(!1),V=(0,r.useRef)(T),A=(0,r.useRef)(t),D=(0,r.useRef)(n),M=()=>D.current,U=()=>M().isVisible()&&M().isOnline(),[W,Z,q,z]=y(a,T),J=(0,r.useRef)({}).current,$=d(c)?n.fallback[T]:c,B=(e,t)=>{let n=!0;for(let r in J){let i=r;"data"===i?u(t[i],e[i])||d(e[i])&&u(t[i],ei)||(n=!1):t[i]!==e[i]&&(n=!1)}return n},G=(0,r.useMemo)(()=>{let e=!!T&&!!t&&(d(E)?!M().isPaused()&&!l&&(!!d(p)||p):E),n=t=>{let n=g(t);return(delete n._k,e)?{isValidating:!0,isLoading:!0,...n}:n},r=W(),i=z(),o=n(r),a=r===i?o:n(i),u=o;return[()=>{let e=n(W());return B(e,u)?u:u=e},()=>a]},[a,T]),H=(0,i.useSyncExternalStore)((0,r.useCallback)(e=>q(T,(t,n)=>{B(n,t)||e()}),[a,T]),G[0],G[1]),K=!O.current,Q=m[T]&&m[T].length>0,X=H.data,Y=d(X)?$:X,ee=H.error,et=(0,r.useRef)(Y),ei=_?d(X)?et.current:X:Y,eo=(!Q||!!d(ee))&&(K&&!d(E)?E:!M().isPaused()&&(l?!d(Y)&&p:d(Y)||p)),ea=!!(T&&t&&K&&eo),eu=d(H.isValidating)?ea:H.isValidating,el=d(H.isLoading)?ea:H.isLoading,es=(0,r.useCallback)(async e=>{let t,r;let i=A.current;if(!T||!i||C.current||M().isPaused())return!1;let o=!0,a=e||{},l=!R[T]||!a.dedupe,c=()=>L?!C.current&&T===V.current&&O.current:T===V.current,g={isValidating:!1,isLoading:!1},E=()=>{Z(g)},p=()=>{let e=R[T];e&&e[1]===r&&delete R[T]},v={isValidating:!0};d(W().data)&&(v.isLoading=!0);try{if(l&&(Z(v),n.loadingTimeout&&d(W().data)&&setTimeout(()=>{o&&c()&&M().onLoadingSlow(T,n)},n.loadingTimeout),R[T]=[i(S),P()]),[t,r]=R[T],t=await t,l&&setTimeout(p,n.dedupingInterval),!R[T]||R[T][1]!==r)return l&&c()&&M().onDiscarded(T),!1;g.error=s;let e=b[T];if(!d(e)&&(r<=e[0]||r<=e[1]||0===e[1]))return E(),l&&c()&&M().onDiscarded(T),!1;let a=W().data;g.data=u(a,t)?a:t,l&&c()&&M().onSuccess(t,T,n)}catch(n){p();let e=M(),{shouldRetryOnError:t}=e;!e.isPaused()&&(g.error=n,l&&c()&&(e.onError(n,T,e),(!0===t||f(t)&&t(n))&&U()&&e.onErrorRetry(n,T,e,e=>{let t=m[T];t&&t[0]&&t[0](F.ERROR_REVALIDATE_EVENT,e)},{retryCount:(a.retryCount||0)+1,dedupe:!0})))}return o=!1,E(),!0},[T,a]),ec=(0,r.useCallback)((...e)=>j(a,V.current,...e),[]);if(x(()=>{A.current=t,D.current=n,d(X)||(et.current=X)}),x(()=>{if(!T)return;let e=es.bind(s,er),t=0,n=(n,r={})=>{if(n==F.FOCUS_EVENT){let n=Date.now();M().revalidateOnFocus&&n>t&&U()&&(t=n+M().focusThrottleInterval,e())}else if(n==F.RECONNECT_EVENT)M().revalidateOnReconnect&&U()&&e();else if(n==F.MUTATE_EVENT)return es();else if(n==F.ERROR_REVALIDATE_EVENT)return es(r)},r=en(T,m,n);return C.current=!1,V.current=T,O.current=!0,Z({_k:S}),eo&&(d(Y)||k?e():N(e)),()=>{C.current=!0,r()}},[T]),x(()=>{let e;function t(){let t=f(v)?v(W().data):v;t&&-1!==e&&(e=setTimeout(n,t))}function n(){!W().error&&(w||M().isVisible())&&(h||M().isOnline())?es(er).then(t):t()}return t(),()=>{e&&(clearTimeout(e),e=-1)}},[v,w,h,T]),(0,r.useDebugValue)(ei),l&&d(Y)&&T){if(!L&&k)throw Error("Fallback data is required when using suspense in SSR.");throw A.current=t,D.current=n,C.current=!1,d(ee)?es(er):ee}return{mutate:ec,get data(){return J.data=!0,ei},get error(){return J.error=!0,ee},get isValidating(){return J.isValidating=!0,eu},get isLoading(){return J.isLoading=!0,el}}};c.defineProperty(H,"defaultValue",{value:$});var eo=function(...e){let t=Y(),[n,r,i]=X(e),o=B(t,i),a=ei,{use:u}=o,l=(u||[]).concat(et);for(let e=l.length;e--;)a=l[e](a);return a(n,r||o.fetcher||null,o)}}}]);