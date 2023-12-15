"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[9120,1688],{53250:function(t,n,e){/**
 * @license React
 * use-sync-external-store-shim.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var u=e(67294),o="function"==typeof Object.is?Object.is:function(t,n){return t===n&&(0!==t||1/t==1/n)||t!=t&&n!=n},r=u.useState,c=u.useEffect,i=u.useLayoutEffect,s=u.useDebugValue;function a(t){var n=t.getSnapshot;t=t.value;try{var e=n();return!o(t,e)}catch(t){return!0}}var f="undefined"==typeof window||void 0===window.document||void 0===window.document.createElement?function(t,n){return n()}:function(t,n){var e=n(),u=r({inst:{value:e,getSnapshot:n}}),o=u[0].inst,f=u[1];return i(function(){o.value=e,o.getSnapshot=n,a(o)&&f({inst:o})},[t,e,n]),c(function(){return a(o)&&f({inst:o}),t(function(){a(o)&&f({inst:o})})},[t]),s(e),e};n.useSyncExternalStore=void 0!==u.useSyncExternalStore?u.useSyncExternalStore:f},61688:function(t,n,e){t.exports=e(53250)}}]);