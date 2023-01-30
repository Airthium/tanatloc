"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[1417],{68795:function(e,t,n){n.d(t,{Z:function(){return l}});var r=n(1413),i=n(67294),a={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0011.6 0l43.6-43.5a8.2 8.2 0 000-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z"}}]},name:"search",theme:"outlined"},u=n(42135),o=function(e,t){return i.createElement(u.Z,(0,r.Z)((0,r.Z)({},e),{},{ref:t,icon:a}))};o.displayName="SearchOutlined";var l=i.forwardRef(o)},53250:function(e,t,n){/**
 * @license React
 * use-sync-external-store-shim.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var r=n(67294),i="function"==typeof Object.is?Object.is:function(e,t){return e===t&&(0!==e||1/e==1/t)||e!=e&&t!=t},a=r.useState,u=r.useEffect,o=r.useLayoutEffect,l=r.useDebugValue;function s(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!i(e,n)}catch(e){return!0}}var c="undefined"==typeof window||void 0===window.document||void 0===window.document.createElement?function(e,t){return t()}:function(e,t){var n=t(),r=a({inst:{value:n,getSnapshot:t}}),i=r[0].inst,c=r[1];return o(function(){i.value=n,i.getSnapshot=t,s(i)&&c({inst:i})},[e,n,t]),u(function(){return s(i)&&c({inst:i}),e(function(){s(i)&&c({inst:i})})},[e]),l(n),n};t.useSyncExternalStore=void 0!==r.useSyncExternalStore?r.useSyncExternalStore:c},61688:function(e,t,n){e.exports=n(53250)},59734:function(e,t,n){n.d(t,{ZP:function(){return ea}});var r=n(67294),i=n(61688);let a=new WeakMap,u={},o={},l=()=>{},s=l(),c=Object,d=e=>e===s,f=e=>"function"==typeof e,g=(e,t)=>({...e,...t}),h="undefined",w=typeof window!=h,E=typeof document!=h,v=()=>w&&typeof window.requestAnimationFrame!=h,p=(e,t)=>{let n=a.get(e);return[()=>e.get(t)||u,r=>{if(!d(t)){let i=e.get(t);t in o||(o[t]=i),n[5](t,g(i,r),i||u)}},n[6],()=>!d(t)&&t in o?o[t]:e.get(t)||u]},y=new WeakMap,_=0,m=e=>{let t,n;let r=typeof e,i=e&&e.constructor,a=i==Date;if(c(e)!==e||a||i==RegExp)t=a?e.toJSON():"symbol"==r?e.toString():"string"==r?JSON.stringify(e):""+e;else{if(t=y.get(e))return t;if(t=++_+"~",y.set(e,t),i==Array){for(n=0,t="@";n<e.length;n++)t+=m(e[n])+",";y.set(e,t)}if(i==c){t="#";let r=c.keys(e).sort();for(;!d(n=r.pop());)d(e[n])||(t+=n+":"+m(e[n])+",");y.set(e,t)}}return t},S=!0,[b,T]=w&&window.addEventListener?[window.addEventListener.bind(window),window.removeEventListener.bind(window)]:[l,l],O=()=>{let e=E&&document.visibilityState;return d(e)||"hidden"!==e},C=e=>(E&&document.addEventListener("visibilitychange",e),b("focus",e),()=>{E&&document.removeEventListener("visibilitychange",e),T("focus",e)}),R=e=>{let t=()=>{S=!0,e()},n=()=>{S=!1};return b("online",t),b("offline",n),()=>{T("online",t),T("offline",n)}},k={initFocus:C,initReconnect:R},V=!r.useId,L=!w||"Deno"in window,N=e=>v()?window.requestAnimationFrame(e):setTimeout(e,1),x=L?r.useEffect:r.useLayoutEffect,D="undefined"!=typeof navigator&&navigator.connection,M=!L&&D&&(["slow-2g","2g"].includes(D.effectiveType)||D.saveData),P=e=>{if(f(e))try{e=e()}catch(t){e=""}let t=e;return[e="string"==typeof e?e:(Array.isArray(e)?e.length:e)?m(e):"",t]},A=0,F=()=>++A;var I={__proto__:null,FOCUS_EVENT:0,RECONNECT_EVENT:1,MUTATE_EVENT:2};async function U(...e){let[t,n,r,i]=e,u=g({populateCache:!0,throwOnError:!0},"boolean"==typeof i?{revalidate:i}:i||{}),o=u.populateCache,l=u.rollbackOnError,c=u.optimisticData,h=!1!==u.revalidate,w=e=>"function"==typeof l?l(e):!1!==l,E=u.throwOnError;if(f(n)){let e=[],r=t.keys();for(let i=r.next();!i.done;i=r.next()){let r=i.value;!r.startsWith("$inf$")&&n(t.get(r)._k)&&e.push(r)}return Promise.all(e.map(v))}return v(n);async function v(n){let i;let[u]=P(n);if(!u)return;let[l,g]=p(t,u),[v,y,_]=a.get(t),m=v[u],S=()=>h&&(delete _[u],m&&m[0])?m[0](2).then(()=>l().data):l().data;if(e.length<3)return S();let b=r,T=F();y[u]=[T,0];let O=!d(c),C=l(),R=C.data,k=C._c,V=d(k)?R:k;if(O&&g({data:c=f(c)?c(V):c,_c:V}),f(b))try{b=b(V)}catch(e){i=e}if(b&&f(b.then)){if(b=await b.catch(e=>{i=e}),T!==y[u][0]){if(i)throw i;return b}i&&O&&w(i)&&(o=!0,b=V,g({data:b,_c:s}))}o&&!i&&(f(o)&&(b=o(b,V)),g({data:b,_c:s})),y[u][1]=F();let L=await S();if(g({_c:s}),i){if(E)throw i;return}return o?L:b}}let W=(e,t)=>{for(let n in e)e[n][0]&&e[n][0](t)},Z=(e,t)=>{if(!a.has(e)){let n=g(k,t),r={},i=U.bind(s,e),u=l,o={},c=(e,t)=>{let n=o[e]||[];return o[e]=n,n.push(t),()=>n.splice(n.indexOf(t),1)},d=(t,n,r)=>{e.set(t,n);let i=o[t];if(i)for(let e=i.length;e--;)i[e](n,r)},f=()=>{if(!a.has(e)&&(a.set(e,[r,{},{},{},i,d,c]),!L)){let t=n.initFocus(setTimeout.bind(s,W.bind(s,r,0))),i=n.initReconnect(setTimeout.bind(s,W.bind(s,r,1)));u=()=>{t&&t(),i&&i(),a.delete(e)}}};return f(),[e,i,f,u]}return[e,a.get(e)[4]]},j=(e,t,n,r,i)=>{let a=n.errorRetryCount,u=i.retryCount,o=~~((Math.random()+.5)*(1<<(u<8?u:8)))*n.errorRetryInterval;(d(a)||!(u>a))&&setTimeout(r,o,i)},q=(e,t)=>m(e)==m(t),[z,J]=Z(new Map),$=g({onLoadingSlow:l,onSuccess:l,onError:l,onErrorRetry:j,onDiscarded:l,revalidateOnFocus:!0,revalidateOnReconnect:!0,revalidateIfStale:!0,shouldRetryOnError:!0,errorRetryInterval:M?1e4:5e3,focusThrottleInterval:5e3,dedupingInterval:2e3,loadingTimeout:M?5e3:3e3,compare:q,isPaused:()=>!1,cache:z,mutate:J,fallback:{}},{isOnline:()=>S,isVisible:O}),B=(e,t)=>{let n=g(e,t);if(t){let{use:r,fallback:i}=e,{use:a,fallback:u}=t;r&&a&&(n.use=r.concat(a)),i&&u&&(n.fallback=g(i,u))}return n},G=(0,r.createContext)({}),H=e=>{let{value:t}=e,n=(0,r.useContext)(G),i=f(t),a=(0,r.useMemo)(()=>i?t(n):t,[i,n,t]),u=(0,r.useMemo)(()=>i?a:B(n,a),[i,n,a]),o=a&&a.provider,[l]=(0,r.useState)(()=>o?Z(o(u.cache||z),a):s);return l&&(u.cache=l[0],u.mutate=l[1]),x(()=>{if(l)return l[2]&&l[2](),l[3]},[]),(0,r.createElement)(G.Provider,g(e,{value:u}))},K=w&&window.__SWR_DEVTOOLS_USE__,Q=K?window.__SWR_DEVTOOLS_USE__:[],X=e=>f(e[1])?[e[0],e[1],e[2]||{}]:[e[0],null,(null===e[1]?e[2]:e[1])||{}],Y=()=>g($,(0,r.useContext)(G)),ee=e=>(t,n,r)=>{let i=n&&((...e)=>{let r=P(t)[0],[,,,i]=a.get(z),u=i[r];return u?(delete i[r],u):n(...e)});return e(t,i,r)},et=Q.concat(ee),en=(e,t,n)=>{let r=t[e]||(t[e]=[]);return r.push(n),()=>{let e=r.indexOf(n);e>=0&&(r[e]=r[r.length-1],r.pop())}};K&&(window.__SWR_DEVTOOLS_REACT__=r);let er={dedupe:!0},ei=(e,t,n)=>{let{cache:u,compare:o,suspense:l,fallbackData:c,revalidateOnMount:h,revalidateIfStale:w,refreshInterval:E,refreshWhenHidden:v,refreshWhenOffline:y,keepPreviousData:_}=n,[m,S,b]=a.get(u),[T,O]=P(e),C=(0,r.useRef)(!1),R=(0,r.useRef)(!1),k=(0,r.useRef)(T),D=(0,r.useRef)(t),M=(0,r.useRef)(n),A=()=>M.current,W=()=>A().isVisible()&&A().isOnline(),[Z,j,q,z]=p(u,T),J=(0,r.useRef)({}).current,$=d(c)?n.fallback[T]:c,B=(e,t)=>{let n=!0;for(let r in J){let i=r;"data"===i?o(t[i],e[i])||d(e[i])&&o(t[i],ei)||(n=!1):t[i]!==e[i]&&(n=!1)}return n},G=(0,r.useMemo)(()=>{let e=!!T&&!!t&&(d(h)?!A().isPaused()&&!l&&(!!d(w)||w):h),n=t=>{let n=g(t);return(delete n._k,e)?{isValidating:!0,isLoading:!0,...n}:n},r=n(Z()),i=n(z());return[()=>{let e=n(Z());return B(e,r)?r:r=e},()=>i]},[u,T]),H=(0,i.useSyncExternalStore)((0,r.useCallback)(e=>q(T,(t,n)=>{B(n,t)||e()}),[u,T]),G[0],G[1]),K=!C.current,Q=m[T]&&m[T].length>0,X=H.data,Y=d(X)?$:X,ee=H.error,et=(0,r.useRef)(Y),ei=_?d(X)?et.current:X:Y,ea=(!Q||!!d(ee))&&(K&&!d(h)?h:!A().isPaused()&&(l?!d(Y)&&w:d(Y)||w)),eu=!!(T&&t&&K&&ea),eo=d(H.isValidating)?eu:H.isValidating,el=d(H.isLoading)?eu:H.isLoading,es=(0,r.useCallback)(async e=>{let t,r;let i=D.current;if(!T||!i||R.current||A().isPaused())return!1;let a=!0,u=e||{},l=!b[T]||!u.dedupe,c=()=>V?!R.current&&T===k.current&&C.current:T===k.current,g={isValidating:!1,isLoading:!1},h=()=>{j(g)},w=()=>{let e=b[T];e&&e[1]===r&&delete b[T]},E={isValidating:!0};d(Z().data)&&(E.isLoading=!0);try{if(l&&(j(E),n.loadingTimeout&&d(Z().data)&&setTimeout(()=>{a&&c()&&A().onLoadingSlow(T,n)},n.loadingTimeout),b[T]=[i(O),F()]),[t,r]=b[T],t=await t,l&&setTimeout(w,n.dedupingInterval),!b[T]||b[T][1]!==r)return l&&c()&&A().onDiscarded(T),!1;g.error=s;let e=S[T];if(!d(e)&&(r<=e[0]||r<=e[1]||0===e[1]))return h(),l&&c()&&A().onDiscarded(T),!1;let u=Z().data;g.data=o(u,t)?u:t,l&&c()&&A().onSuccess(t,T,n)}catch(n){w();let e=A(),{shouldRetryOnError:t}=e;!e.isPaused()&&(g.error=n,l&&c()&&(e.onError(n,T,e),(!0===t||f(t)&&t(n))&&W()&&e.onErrorRetry(n,T,e,es,{retryCount:(u.retryCount||0)+1,dedupe:!0})))}return a=!1,h(),!0},[T,u]),ec=(0,r.useCallback)((...e)=>U(u,k.current,...e),[]);if(x(()=>{D.current=t,M.current=n,d(X)||(et.current=X)}),x(()=>{if(!T)return;let e=es.bind(s,er),t=0,n=n=>{if(n==I.FOCUS_EVENT){let n=Date.now();A().revalidateOnFocus&&n>t&&W()&&(t=n+A().focusThrottleInterval,e())}else if(n==I.RECONNECT_EVENT)A().revalidateOnReconnect&&W()&&e();else if(n==I.MUTATE_EVENT)return es()},r=en(T,m,n);return R.current=!1,k.current=T,C.current=!0,j({_k:O}),ea&&(d(Y)||L?e():N(e)),()=>{R.current=!0,r()}},[T]),x(()=>{let e;function t(){let t=f(E)?E(Y):E;t&&-1!==e&&(e=setTimeout(n,t))}function n(){!Z().error&&(v||A().isVisible())&&(y||A().isOnline())?es(er).then(t):t()}return t(),()=>{e&&(clearTimeout(e),e=-1)}},[E,v,y,T]),(0,r.useDebugValue)(ei),l&&d(Y)&&T){if(!V&&L)throw Error("Fallback data is required when using suspense in SSR.");throw D.current=t,M.current=n,R.current=!1,d(ee)?es(er):ee}return{mutate:ec,get data(){return J.data=!0,ei},get error(){return J.error=!0,ee},get isValidating(){return J.isValidating=!0,eo},get isLoading(){return J.isLoading=!0,el}}};c.defineProperty(H,"defaultValue",{value:$});var ea=function(...e){let t=Y(),[n,r,i]=X(e),a=B(t,i),u=ei,{use:o}=a,l=(o||[]).concat(et);for(let e=l.length;e--;)u=l[e](u);return u(n,r||a.fetcher||null,a)}}}]);