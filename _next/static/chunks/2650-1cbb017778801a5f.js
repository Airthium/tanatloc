"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[2650],{68795:function(e,n,t){t.d(n,{Z:function(){return c}});var r=t(1413),i=t(67294),u={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M909.6 854.5L649.9 594.8C690.2 542.7 712 479 712 412c0-80.2-31.3-155.4-87.9-212.1-56.6-56.7-132-87.9-212.1-87.9s-155.5 31.3-212.1 87.9C143.2 256.5 112 331.8 112 412c0 80.1 31.3 155.5 87.9 212.1C256.5 680.8 331.8 712 412 712c67 0 130.6-21.8 182.7-62l259.7 259.6a8.2 8.2 0 0011.6 0l43.6-43.5a8.2 8.2 0 000-11.6zM570.4 570.4C528 612.7 471.8 636 412 636s-116-23.3-158.4-65.6C211.3 528 188 471.8 188 412s23.3-116.1 65.6-158.4C296 211.3 352.2 188 412 188s116.1 23.2 158.4 65.6S636 352.2 636 412s-23.3 116.1-65.6 158.4z"}}]},name:"search",theme:"outlined"},o=t(42135),a=function(e,n){return i.createElement(o.Z,(0,r.Z)((0,r.Z)({},e),{},{ref:n,icon:u}))};a.displayName="SearchOutlined";var c=i.forwardRef(a)},8100:function(e,n,t){t.d(n,{ZP:function(){return Q}});var r=t(67294);/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */ function i(e,n,t,r){return new(t||(t=Promise))(function(i,u){function o(e){try{c(r.next(e))}catch(n){u(n)}}function a(e){try{c(r.throw(e))}catch(n){u(n)}}function c(e){var n;e.done?i(e.value):((n=e.value)instanceof t?n:new t(function(e){e(n)})).then(o,a)}c((r=r.apply(e,n||[])).next())})}function u(e,n){var t,r,i,u,o={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return u={next:a(0),throw:a(1),return:a(2)},"function"==typeof Symbol&&(u[Symbol.iterator]=function(){return this}),u;function a(u){return function(a){return function(u){if(t)throw TypeError("Generator is already executing.");for(;o;)try{if(t=1,r&&(i=2&u[0]?r.return:u[0]?r.throw||((i=r.return)&&i.call(r),0):r.next)&&!(i=i.call(r,u[1])).done)return i;switch(r=0,i&&(u=[2&u[0],i.value]),u[0]){case 0:case 1:i=u;break;case 4:return o.label++,{value:u[1],done:!1};case 5:o.label++,r=u[1],u=[0];continue;case 7:u=o.ops.pop(),o.trys.pop();continue;default:if(!(i=(i=o.trys).length>0&&i[i.length-1])&&(6===u[0]||2===u[0])){o=0;continue}if(3===u[0]&&(!i||u[1]>i[0]&&u[1]<i[3])){o.label=u[1];break}if(6===u[0]&&o.label<i[1]){o.label=i[1],i=u;break}if(i&&o.label<i[2]){o.label=i[2],o.ops.push(u);break}i[2]&&o.ops.pop(),o.trys.pop();continue}u=n.call(e,o)}catch(a){u=[6,a],r=0}finally{t=i=0}if(5&u[0])throw u[1];return{value:u[0]?u[1]:void 0,done:!0}}([u,a])}}}var o=function(){},a=o(),c=Object,f=function(e){return e===a},s=function(e){return"function"==typeof e},l=function(e,n){return c.assign({},e,n)},d="undefined",v=function(){return typeof window!=d},h=new WeakMap,g=0,p=function(e){var n,t,r=typeof e,i=e&&e.constructor,u=i==Date;if(c(e)!==e||u||i==RegExp)n=u?e.toJSON():"symbol"==r?e.toString():"string"==r?JSON.stringify(e):""+e;else{if(n=h.get(e))return n;if(n=++g+"~",h.set(e,n),i==Array){for(t=0,n="@";t<e.length;t++)n+=p(e[t])+",";h.set(e,n)}if(i==c){n="#";for(var o=c.keys(e).sort();!f(t=o.pop());)f(e[t])||(n+=t+":"+p(e[t])+",");h.set(e,n)}}return n},b=!0,y=function(){return b},w=v(),m=typeof document!=d,E=w&&window.addEventListener?window.addEventListener.bind(window):o,R=m?document.addEventListener.bind(document):o,k=w&&window.removeEventListener?window.removeEventListener.bind(window):o,C=m?document.removeEventListener.bind(document):o,O=function(){var e=m&&document.visibilityState;return f(e)||"hidden"!==e},S={initFocus:function(e){return R("visibilitychange",e),E("focus",e),function(){C("visibilitychange",e),k("focus",e)}},initReconnect:function(e){var n=function(){b=!0,e()},t=function(){b=!1};return E("online",n),E("offline",t),function(){k("online",n),k("offline",t)}}},T=!v()||"Deno"in window,V=T?r.useEffect:r.useLayoutEffect,x="undefined"!=typeof navigator&&navigator.connection,D=!T&&x&&(["slow-2g","2g"].includes(x.effectiveType)||x.saveData),I=function(e){if(s(e))try{e=e()}catch(n){e=""}var t=[].concat(e),r=(e="string"==typeof e?e:(Array.isArray(e)?e.length:e)?p(e):"")?"$swr$"+e:"";return[e,t,r]},L=new WeakMap,P=function(e,n,t,r,i,u,o){void 0===o&&(o=!0);var a=L.get(e),c=a[0],f=a[1],s=a[3],l=c[n],d=f[n];if(o&&d)for(var v=0;v<d.length;++v)d[v](t,r,i);return u&&(delete s[n],l&&l[0])?l[0](2).then(function(){return e.get(n)}):e.get(n)},M=0,F=function(){return++M},A=function(){for(var e=[],n=0;n<arguments.length;n++)e[n]=arguments[n];return i(void 0,void 0,void 0,function(){var n,t,r,i,o,c,d,v,h,g,p,b,y,w,m,E,R,k,C,O;return u(this,function(u){switch(u.label){case 0:if(n=e[0],t=e[1],r=e[2],c=!!f((o="boolean"==typeof(i=e[3])?{revalidate:i}:i||{}).populateCache)||o.populateCache,d=!1!==o.revalidate,v=!1!==o.rollbackOnError,h=o.optimisticData,p=(g=I(t))[0],b=g[2],!p)return[2];if(y=L.get(n)[2],e.length<3)return[2,P(n,p,n.get(p),a,a,d,!0)];if(w=r,E=F(),y[p]=[E,0],R=!f(h),k=n.get(p),R&&(C=s(h)?h(k):h,n.set(p,C),P(n,p,C)),s(w))try{w=w(n.get(p))}catch(S){m=S}if(!(w&&s(w.then)))return[3,2];return[4,w.catch(function(e){m=e})];case 1:if(w=u.sent(),E!==y[p][0]){if(m)throw m;return[2,w]}m&&R&&v&&(c=!0,w=k,n.set(p,k)),u.label=2;case 2:return c&&(m||(s(c)&&(w=c(w,k)),n.set(p,w)),n.set(b,l(n.get(b),{error:m}))),y[p][1]=F(),[4,P(n,p,w,m,a,d,!!c)];case 3:if(O=u.sent(),m)throw m;return[2,c?O:w]}})})},N=function(e,n){for(var t in e)e[t][0]&&e[t][0](n)},Z=function(e,n){if(!L.has(e)){var t=l(S,n),r={},i=A.bind(a,e),u=o;if(L.set(e,[r,{},{},{},i]),!T){var c=t.initFocus(setTimeout.bind(a,N.bind(a,r,0))),f=t.initReconnect(setTimeout.bind(a,N.bind(a,r,1)));u=function(){c&&c(),f&&f(),L.delete(e)}}return[e,i,u]}return[e,L.get(e)[4]]},W=function(e,n,t,r,i){var u=t.errorRetryCount,o=i.retryCount,a=~~((Math.random()+.5)*(1<<(o<8?o:8)))*t.errorRetryInterval;(f(u)||!(o>u))&&setTimeout(r,a,i)},_=Z(new Map),q=_[0],z=l({onLoadingSlow:o,onSuccess:o,onError:o,onErrorRetry:W,onDiscarded:o,revalidateOnFocus:!0,revalidateOnReconnect:!0,revalidateIfStale:!0,shouldRetryOnError:!0,errorRetryInterval:D?1e4:5e3,focusThrottleInterval:5e3,dedupingInterval:2e3,loadingTimeout:D?5e3:3e3,compare:function(e,n){return p(e)==p(n)},isPaused:function(){return!1},cache:q,mutate:_[1],fallback:{}},{isOnline:y,isVisible:O}),J=function(e,n){var t=l(e,n);if(n){var r=e.use,i=e.fallback,u=n.use,o=n.fallback;r&&u&&(t.use=r.concat(u)),i&&o&&(t.fallback=l(i,o))}return t},$=(0,r.createContext)({}),j=function(e){var n=e.value,t=J((0,r.useContext)($),n),i=n&&n.provider,u=(0,r.useState)(function(){return i?Z(i(t.cache||q),n):a})[0];return u&&(t.cache=u[0],t.mutate=u[1]),V(function(){return u?u[2]:a},[]),(0,r.createElement)($.Provider,l(e,{value:t}))},B=function(e,n){var t=(0,r.useState)({})[1],i=(0,r.useRef)(e),u=(0,r.useRef)({data:!1,error:!1,isValidating:!1}),o=(0,r.useCallback)(function(e){var r=!1,o=i.current;for(var a in e){var c=a;o[c]!==e[c]&&(o[c]=e[c],u.current[c]&&(r=!0))}r&&!n.current&&t({})},[]);return V(function(){i.current=e}),[i,u.current,o]},G=function(e,n,t){var r=n[e]||(n[e]=[]);return r.push(t),function(){var e=r.indexOf(t);e>=0&&(r[e]=r[r.length-1],r.pop())}},H={dedupe:!0},K=function(e,n,t){var o=t.cache,c=t.compare,h=t.fallbackData,g=t.suspense,p=t.revalidateOnMount,b=t.refreshInterval,y=t.refreshWhenHidden,w=t.refreshWhenOffline,m=L.get(o),E=m[0],R=m[1],k=m[2],C=m[3],O=I(e),S=O[0],x=O[1],D=O[2],M=(0,r.useRef)(!1),N=(0,r.useRef)(!1),Z=(0,r.useRef)(S),W=(0,r.useRef)(n),_=(0,r.useRef)(t),q=function(){return _.current},z=function(){return q().isVisible()&&q().isOnline()},J=function(e){return o.set(D,l(o.get(D),e))},$=o.get(S),j=f(h)?t.fallback[S]:h,K=f($)?j:$,Q=o.get(D)||{},U=Q.error,X=!M.current,Y=function(){return X&&!f(p)?p:!q().isPaused()&&(g?!f(K)&&t.revalidateIfStale:f(K)||t.revalidateIfStale)},ee=!!S&&!!n&&(!!Q.isValidating||X&&Y()),en=B({data:K,error:U,isValidating:ee},N),et=en[0],er=en[1],ei=en[2],eu=(0,r.useCallback)(function(e){return i(void 0,void 0,void 0,function(){var n,r,i,l,d,v,h,g,p,b,y,w,m;return u(this,function(u){switch(u.label){case 0:if(n=W.current,!S||!n||N.current||q().isPaused())return[2,!1];l=!0,d=e||{},v=!C[S]||!d.dedupe,h=function(){return!N.current&&S===Z.current&&M.current},g=function(){var e=C[S];e&&e[1]===i&&delete C[S]},p={isValidating:!1},b=function(){J({isValidating:!1}),h()&&ei(p)},J({isValidating:!0}),ei({isValidating:!0}),u.label=1;case 1:return u.trys.push([1,3,,4]),v&&(P(o,S,et.current.data,et.current.error,!0),t.loadingTimeout&&!o.get(S)&&setTimeout(function(){l&&h()&&q().onLoadingSlow(S,t)},t.loadingTimeout),C[S]=[n.apply(void 0,x),F()]),r=(m=C[S])[0],i=m[1],[4,r];case 2:if(r=u.sent(),v&&setTimeout(g,t.dedupingInterval),!C[S]||C[S][1]!==i)return v&&h()&&q().onDiscarded(S),[2,!1];if(J({error:a}),p.error=a,!f(y=k[S])&&(i<=y[0]||i<=y[1]||0===y[1]))return b(),v&&h()&&q().onDiscarded(S),[2,!1];return c(et.current.data,r)?p.data=et.current.data:p.data=r,c(o.get(S),r)||o.set(S,r),v&&h()&&q().onSuccess(r,S,t),[3,4];case 3:return w=u.sent(),g(),!q().isPaused()&&(J({error:w}),p.error=w,v&&h()&&(q().onError(w,S,t),("boolean"==typeof t.shouldRetryOnError&&t.shouldRetryOnError||s(t.shouldRetryOnError)&&t.shouldRetryOnError(w))&&z()&&q().onErrorRetry(w,S,t,eu,{retryCount:(d.retryCount||0)+1,dedupe:!0}))),[3,4];case 4:return l=!1,b(),h()&&v&&P(o,S,p.data,p.error,!1),[2,!0]}})})},[S]),eo=(0,r.useCallback)(A.bind(a,o,function(){return Z.current}),[]);if(V(function(){W.current=n,_.current=t}),V(function(){if(S){var e=S!==Z.current,n=eu.bind(a,H),t=0,r=function(e){if(0==e){var r=Date.now();q().revalidateOnFocus&&r>t&&z()&&(t=r+q().focusThrottleInterval,n())}else if(1==e)q().revalidateOnReconnect&&z()&&n();else if(2==e)return eu()},i=G(S,R,function(e,n,t){ei(l({error:n,isValidating:t},c(et.current.data,e)?a:{data:e}))}),u=G(S,E,r);return N.current=!1,Z.current=S,M.current=!0,e&&ei({data:K,error:U,isValidating:ee}),Y()&&(f(K)||T?n():v()&&typeof window.requestAnimationFrame!=d?window.requestAnimationFrame(n):setTimeout(n,1)),function(){N.current=!0,i(),u()}}},[S,eu]),V(function(){var e;function n(){var n=s(b)?b(K):b;n&&-1!==e&&(e=setTimeout(t,n))}function t(){!et.current.error&&(y||q().isVisible())&&(w||q().isOnline())?eu(H).then(n):n()}return n(),function(){e&&(clearTimeout(e),e=-1)}},[b,y,w,eu]),(0,r.useDebugValue)(K),g&&f(K)&&S)throw W.current=n,_.current=t,N.current=!1,f(U)?eu(H):U;return{mutate:eo,get data(){return er.data=!0,K},get error(){return er.error=!0,U},get isValidating(){return er.isValidating=!0,ee}}};c.defineProperty(j,"default",{value:z});var Q=function(){for(var e=[],n=0;n<arguments.length;n++)e[n]=arguments[n];var t=l(z,(0,r.useContext)($)),i=s(e[1])?[e[0],e[1],e[2]||{}]:[e[0],null,(null===e[1]?e[2]:e[1])||{}],u=i[0],o=i[1],a=J(t,i[2]),c=K,f=a.use;if(f)for(var d=f.length;d-- >0;)c=f[d](c);return c(u,o||a.fetcher,a)}}}]);