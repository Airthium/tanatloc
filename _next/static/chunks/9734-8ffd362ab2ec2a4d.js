"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[9734],{53250:function(e,n,i){/**
 * @license React
 * use-sync-external-store-shim.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var a=i(67294);function h(e,n){return e===n&&(0!==e||1/e==1/n)||e!=e&&n!=n}var s="function"==typeof Object.is?Object.is:h,o=a.useState,u=a.useEffect,l=a.useLayoutEffect,d=a.useDebugValue;function q(e,n){var i=n(),a=o({inst:{value:i,getSnapshot:n}}),s=a[0].inst,c=a[1];return l(function(){s.value=i,s.getSnapshot=n,r(s)&&c({inst:s})},[e,i,n]),u(function(){return r(s)&&c({inst:s}),e(function(){r(s)&&c({inst:s})})},[e]),d(i),i}function r(e){var n=e.getSnapshot;e=e.value;try{var i=n();return!s(e,i)}catch(e){return!0}}function t(e,n){return n()}var c="undefined"==typeof window||void 0===window.document||void 0===window.document.createElement?t:q;n.useSyncExternalStore=void 0!==a.useSyncExternalStore?a.useSyncExternalStore:c},61688:function(e,n,i){e.exports=i(53250)},59734:function(e,n,i){i.d(n,{ZP:function(){return M}});var a,s=i(67294),o=i(61688);let noop=()=>{},u=noop(),l=Object,isUndefined=e=>e===u,isFunction=e=>"function"==typeof e,mergeObjects=(e,n)=>({...e,...n}),isPromiseLike=e=>isFunction(e.then),d=new WeakMap,c=0,stableHash=e=>{let n,i;let a=typeof e,s=e&&e.constructor,o=s==Date;if(l(e)!==e||o||s==RegExp)n=o?e.toJSON():"symbol"==a?e.toString():"string"==a?JSON.stringify(e):""+e;else{if(n=d.get(e))return n;if(n=++c+"~",d.set(e,n),s==Array){for(i=0,n="@";i<e.length;i++)n+=stableHash(e[i])+",";d.set(e,n)}if(s==l){n="#";let a=l.keys(e).sort();for(;!isUndefined(i=a.pop());)isUndefined(e[i])||(n+=i+":"+stableHash(e[i])+",");d.set(e,n)}}return n},f=new WeakMap,g={},E={},p="undefined",m=typeof window!=p,b=typeof document!=p,hasRequestAnimationFrame=()=>m&&typeof window.requestAnimationFrame!=p,createCacheHelper=(e,n)=>{let i=f.get(e);return[()=>!isUndefined(n)&&e.get(n)||g,a=>{if(!isUndefined(n)){let s=e.get(n);n in E||(E[n]=s),i[5](n,mergeObjects(s,a),s||g)}},i[6],()=>!isUndefined(n)&&n in E?E[n]:!isUndefined(n)&&e.get(n)||g]},v=!0,[y,C]=m&&window.addEventListener?[window.addEventListener.bind(window),window.removeEventListener.bind(window)]:[noop,noop],w={initFocus:e=>(b&&document.addEventListener("visibilitychange",e),y("focus",e),()=>{b&&document.removeEventListener("visibilitychange",e),C("focus",e)}),initReconnect:e=>{let onOnline=()=>{v=!0,e()},onOffline=()=>{v=!1};return y("online",onOnline),y("offline",onOffline),()=>{C("online",onOnline),C("offline",onOffline)}}},S=!s.useId,O=!m||"Deno"in window,rAF=e=>hasRequestAnimationFrame()?window.requestAnimationFrame(e):setTimeout(e,1),R=O?s.useEffect:s.useLayoutEffect,_="undefined"!=typeof navigator&&navigator.connection,U=!O&&_&&(["slow-2g","2g"].includes(_.effectiveType)||_.saveData),dist_serialize=e=>{if(isFunction(e))try{e=e()}catch(n){e=""}let n=e;return[e="string"==typeof e?e:(Array.isArray(e)?e.length:e)?stableHash(e):"",n]},T=0,getTimestamp=()=>++T;var k={ERROR_REVALIDATE_EVENT:3,FOCUS_EVENT:0,MUTATE_EVENT:2,RECONNECT_EVENT:1};async function internalMutate(...e){let[n,i,a,s]=e,o=mergeObjects({populateCache:!0,throwOnError:!0},"boolean"==typeof s?{revalidate:s}:s||{}),l=o.populateCache,d=o.rollbackOnError,c=o.optimisticData,g=!1!==o.revalidate,rollbackOnError=e=>"function"==typeof d?d(e):!1!==d,E=o.throwOnError;if(isFunction(i)){let e=[],a=n.keys();for(let s of a)!/^\$(inf|sub)\$/.test(s)&&i(n.get(s)._k)&&e.push(s);return Promise.all(e.map(mutateByKey))}return mutateByKey(i);async function mutateByKey(i){let s;let[o]=dist_serialize(i);if(!o)return;let[d,p]=createCacheHelper(n,o),[m,b,v,y]=f.get(n),startRevalidate=()=>{let e=m[o];return g&&(delete v[o],delete y[o],e&&e[0])?e[0](2).then(()=>d().data):d().data};if(e.length<3)return startRevalidate();let C=a,w=getTimestamp();b[o]=[w,0];let S=!isUndefined(c),O=d(),R=O.data,_=O._c,U=isUndefined(_)?R:_;if(S&&p({data:c=isFunction(c)?c(U,R):c,_c:U}),isFunction(C))try{C=C(U)}catch(e){s=e}if(C&&isPromiseLike(C)){if(C=await C.catch(e=>{s=e}),w!==b[o][0]){if(s)throw s;return C}s&&S&&rollbackOnError(s)&&(l=!0,p({data:U,_c:u}))}if(l&&!s){if(isFunction(l)){let e=l(C,U);p({data:e,error:u,_c:u})}else p({data:C,error:u,_c:u})}if(b[o][1]=getTimestamp(),Promise.resolve(startRevalidate()).then(()=>{p({_c:u})}),s){if(E)throw s;return}return C}}let revalidateAllKeys=(e,n)=>{for(let i in e)e[i][0]&&e[i][0](n)},initCache=(e,n)=>{if(!f.has(e)){let i=mergeObjects(w,n),a={},s=internalMutate.bind(u,e),o=noop,l={},subscribe=(e,n)=>{let i=l[e]||[];return l[e]=i,i.push(n),()=>i.splice(i.indexOf(n),1)},setter=(n,i,a)=>{e.set(n,i);let s=l[n];if(s)for(let e of s)e(i,a)},initProvider=()=>{if(!f.has(e)&&(f.set(e,[a,{},{},{},s,setter,subscribe]),!O)){let n=i.initFocus(setTimeout.bind(u,revalidateAllKeys.bind(u,a,0))),s=i.initReconnect(setTimeout.bind(u,revalidateAllKeys.bind(u,a,1)));o=()=>{n&&n(),s&&s(),f.delete(e)}}};return initProvider(),[e,s,initProvider,o]}return[e,f.get(e)[4]]},[V,A]=initCache(new Map),L=mergeObjects({onLoadingSlow:noop,onSuccess:noop,onError:noop,onErrorRetry:(e,n,i,a,s)=>{let o=i.errorRetryCount,u=s.retryCount,l=~~((Math.random()+.5)*(1<<(u<8?u:8)))*i.errorRetryInterval;(isUndefined(o)||!(u>o))&&setTimeout(a,l,s)},onDiscarded:noop,revalidateOnFocus:!0,revalidateOnReconnect:!0,revalidateIfStale:!0,shouldRetryOnError:!0,errorRetryInterval:U?1e4:5e3,focusThrottleInterval:5e3,dedupingInterval:2e3,loadingTimeout:U?5e3:3e3,compare:(e,n)=>stableHash(e)==stableHash(n),isPaused:()=>!1,cache:V,mutate:A,fallback:{}},{isOnline:()=>v,isVisible:()=>{let e=b&&document.visibilityState;return isUndefined(e)||"hidden"!==e}}),mergeConfigs=(e,n)=>{let i=mergeObjects(e,n);if(n){let{use:a,fallback:s}=e,{use:o,fallback:u}=n;a&&o&&(i.use=a.concat(o)),s&&u&&(i.fallback=mergeObjects(s,u))}return i},F=(0,s.createContext)({}),x=m&&window.__SWR_DEVTOOLS_USE__,N=x?window.__SWR_DEVTOOLS_USE__:[],normalize=e=>isFunction(e[1])?[e[0],e[1],e[2]||{}]:[e[0],null,(null===e[1]?e[2]:e[1])||{}],useSWRConfig=()=>mergeObjects(L,(0,s.useContext)(F)),D=N.concat(e=>(n,i,a)=>{let s=i&&((...e)=>{let[a]=dist_serialize(n),[,,,s]=f.get(V);if(a.startsWith("$inf$"))return i(...e);let o=s[a];return isUndefined(o)?i(...e):(delete s[a],o)});return e(n,s,a)}),subscribeCallback=(e,n,i)=>{let a=n[e]||(n[e]=[]);return a.push(i),()=>{let e=a.indexOf(i);e>=0&&(a[e]=a[a.length-1],a.pop())}};x&&(window.__SWR_DEVTOOLS_REACT__=s);let j=s.use||(e=>{if("pending"===e.status)throw e;if("fulfilled"===e.status)return e.value;if("rejected"===e.status)throw e.reason;throw e.status="pending",e.then(n=>{e.status="fulfilled",e.value=n},n=>{e.status="rejected",e.reason=n}),e}),P={dedupe:!0};l.defineProperty(e=>{let{value:n}=e,i=(0,s.useContext)(F),a=isFunction(n),o=(0,s.useMemo)(()=>a?n(i):n,[a,i,n]),l=(0,s.useMemo)(()=>a?o:mergeConfigs(i,o),[a,i,o]),d=o&&o.provider,c=(0,s.useRef)(u);d&&!c.current&&(c.current=initCache(d(l.cache||V),o));let f=c.current;return f&&(l.cache=f[0],l.mutate=f[1]),R(()=>{if(f)return f[2]&&f[2](),f[3]},[]),(0,s.createElement)(F.Provider,mergeObjects(e,{value:l}))},"defaultValue",{value:L});let M=(a=(e,n,i)=>{let{cache:a,compare:l,suspense:d,fallbackData:c,revalidateOnMount:g,revalidateIfStale:E,refreshInterval:p,refreshWhenHidden:m,refreshWhenOffline:b,keepPreviousData:v}=i,[y,C,w,_]=f.get(a),[U,T]=dist_serialize(e),V=(0,s.useRef)(!1),A=(0,s.useRef)(!1),L=(0,s.useRef)(U),F=(0,s.useRef)(n),x=(0,s.useRef)(i),getConfig=()=>x.current,isActive=()=>getConfig().isVisible()&&getConfig().isOnline(),[N,D,M,I]=createCacheHelper(a,U),H=(0,s.useRef)({}).current,W=isUndefined(c)?i.fallback[U]:c,isEqual=(e,n)=>{for(let i in H)if("data"===i){if(!l(e[i],n[i])&&(!isUndefined(e[i])||!l(X,n[i])))return!1}else if(n[i]!==e[i])return!1;return!0},z=(0,s.useMemo)(()=>{let e=!!U&&!!n&&(isUndefined(g)?!getConfig().isPaused()&&!d&&(!!isUndefined(E)||E):g),getSelectedCache=n=>{let i=mergeObjects(n);return(delete i._k,e)?{isValidating:!0,isLoading:!0,...i}:i},i=N(),a=I(),s=getSelectedCache(i),o=i===a?s:getSelectedCache(a),u=s;return[()=>{let e=getSelectedCache(N()),n=isEqual(e,u);return n?(u.data=e.data,u.isLoading=e.isLoading,u.isValidating=e.isValidating,u.error=e.error,u):(u=e,e)},()=>o]},[a,U]),K=(0,o.useSyncExternalStore)((0,s.useCallback)(e=>M(U,(n,i)=>{isEqual(i,n)||e()}),[a,U]),z[0],z[1]),$=!V.current,B=y[U]&&y[U].length>0,J=K.data,Z=isUndefined(J)?W:J,G=K.error,Q=(0,s.useRef)(Z),X=v?isUndefined(J)?Q.current:J:Z,Y=(!B||!!isUndefined(G))&&($&&!isUndefined(g)?g:!getConfig().isPaused()&&(d?!isUndefined(Z)&&E:isUndefined(Z)||E)),ee=!!(U&&n&&$&&Y),et=isUndefined(K.isValidating)?ee:K.isValidating,en=isUndefined(K.isLoading)?ee:K.isLoading,ei=(0,s.useCallback)(async e=>{let n,a;let s=F.current;if(!U||!s||A.current||getConfig().isPaused())return!1;let o=!0,d=e||{},c=!w[U]||!d.dedupe,callbackSafeguard=()=>S?!A.current&&U===L.current&&V.current:U===L.current,f={isValidating:!1,isLoading:!1},finishRequestAndUpdateState=()=>{D(f)},cleanupState=()=>{let e=w[U];e&&e[1]===a&&delete w[U]},g={isValidating:!0};isUndefined(N().data)&&(g.isLoading=!0);try{if(c&&(D(g),i.loadingTimeout&&isUndefined(N().data)&&setTimeout(()=>{o&&callbackSafeguard()&&getConfig().onLoadingSlow(U,i)},i.loadingTimeout),w[U]=[s(T),getTimestamp()]),[n,a]=w[U],n=await n,c&&setTimeout(cleanupState,i.dedupingInterval),!w[U]||w[U][1]!==a)return c&&callbackSafeguard()&&getConfig().onDiscarded(U),!1;f.error=u;let e=C[U];if(!isUndefined(e)&&(a<=e[0]||a<=e[1]||0===e[1]))return finishRequestAndUpdateState(),c&&callbackSafeguard()&&getConfig().onDiscarded(U),!1;let d=N().data;f.data=l(d,n)?d:n,c&&callbackSafeguard()&&getConfig().onSuccess(n,U,i)}catch(i){cleanupState();let e=getConfig(),{shouldRetryOnError:n}=e;!e.isPaused()&&(f.error=i,c&&callbackSafeguard()&&(e.onError(i,U,e),(!0===n||isFunction(n)&&n(i))&&isActive()&&e.onErrorRetry(i,U,e,e=>{let n=y[U];n&&n[0]&&n[0](k.ERROR_REVALIDATE_EVENT,e)},{retryCount:(d.retryCount||0)+1,dedupe:!0})))}return o=!1,finishRequestAndUpdateState(),!0},[U,a]),er=(0,s.useCallback)((...e)=>internalMutate(a,L.current,...e),[]);if(R(()=>{F.current=n,x.current=i,isUndefined(J)||(Q.current=J)}),R(()=>{if(!U)return;let e=ei.bind(u,P),n=0,i=subscribeCallback(U,y,(i,a={})=>{if(i==k.FOCUS_EVENT){let i=Date.now();getConfig().revalidateOnFocus&&i>n&&isActive()&&(n=i+getConfig().focusThrottleInterval,e())}else if(i==k.RECONNECT_EVENT)getConfig().revalidateOnReconnect&&isActive()&&e();else if(i==k.MUTATE_EVENT)return ei();else if(i==k.ERROR_REVALIDATE_EVENT)return ei(a)});return A.current=!1,L.current=U,V.current=!0,D({_k:T}),Y&&(isUndefined(Z)||O?e():rAF(e)),()=>{A.current=!0,i()}},[U]),R(()=>{let e;function next(){let n=isFunction(p)?p(N().data):p;n&&-1!==e&&(e=setTimeout(execute,n))}function execute(){!N().error&&(m||getConfig().isVisible())&&(b||getConfig().isOnline())?ei(P).then(next):next()}return next(),()=>{e&&(clearTimeout(e),e=-1)}},[p,m,b,U]),(0,s.useDebugValue)(X),d&&isUndefined(Z)&&U){if(!S&&O)throw Error("Fallback data is required when using suspense in SSR.");F.current=n,x.current=i,A.current=!1;let e=_[U];if(!isUndefined(e)){let n=er(e);j(n)}if(isUndefined(G)){let e=ei(P);isUndefined(X)||(e.status="fulfilled",e.value=!0),j(e)}else throw G}return{mutate:er,get data(){return H.data=!0,X},get error(){return H.error=!0,G},get isValidating(){return H.isValidating=!0,et},get isLoading(){return H.isLoading=!0,en}}},function(...e){let n=useSWRConfig(),[i,s,o]=normalize(e),u=mergeConfigs(n,o),l=a,{use:d}=u,c=(d||[]).concat(D);for(let e=c.length;e--;)l=c[e](l);return l(i,s||u.fetcher||null,u)})}}]);