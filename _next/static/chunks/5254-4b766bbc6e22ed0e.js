(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[5254],{79742:function(t,e){"use strict";e.byteLength=function(t){var e=l(t),n=e[0],r=e[1];return(n+r)*3/4-r},e.toByteArray=function(t){var e,n,i=l(t),a=i[0],s=i[1],u=new o((a+s)*3/4-s),c=0,f=s>0?a-4:a;for(n=0;n<f;n+=4)e=r[t.charCodeAt(n)]<<18|r[t.charCodeAt(n+1)]<<12|r[t.charCodeAt(n+2)]<<6|r[t.charCodeAt(n+3)],u[c++]=e>>16&255,u[c++]=e>>8&255,u[c++]=255&e;return 2===s&&(e=r[t.charCodeAt(n)]<<2|r[t.charCodeAt(n+1)]>>4,u[c++]=255&e),1===s&&(e=r[t.charCodeAt(n)]<<10|r[t.charCodeAt(n+1)]<<4|r[t.charCodeAt(n+2)]>>2,u[c++]=e>>8&255,u[c++]=255&e),u},e.fromByteArray=function(t){for(var e,r=t.length,o=r%3,i=[],a=0,s=r-o;a<s;a+=16383)i.push(function(t,e,r){for(var o,i=[],a=e;a<r;a+=3)i.push(n[(o=(t[a]<<16&16711680)+(t[a+1]<<8&65280)+(255&t[a+2]))>>18&63]+n[o>>12&63]+n[o>>6&63]+n[63&o]);return i.join("")}(t,a,a+16383>s?s:a+16383));return 1===o?i.push(n[(e=t[r-1])>>2]+n[e<<4&63]+"=="):2===o&&i.push(n[(e=(t[r-2]<<8)+t[r-1])>>10]+n[e>>4&63]+n[e<<2&63]+"="),i.join("")};for(var n=[],r=[],o="undefined"!=typeof Uint8Array?Uint8Array:Array,i="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",a=0,s=i.length;a<s;++a)n[a]=i[a],r[i.charCodeAt(a)]=a;function l(t){var e=t.length;if(e%4>0)throw Error("Invalid string. Length must be a multiple of 4");var n=t.indexOf("=");-1===n&&(n=e);var r=n===e?0:4-n%4;return[n,r]}r["-".charCodeAt(0)]=62,r["_".charCodeAt(0)]=63},48764:function(t,e,n){"use strict";let r=n(79742),o=n(80645),i="function"==typeof Symbol&&"function"==typeof Symbol.for?Symbol.for("nodejs.util.inspect.custom"):null;function a(t){if(t>2147483647)throw RangeError('The value "'+t+'" is invalid for option "size"');let e=new Uint8Array(t);return Object.setPrototypeOf(e,s.prototype),e}function s(t,e,n){if("number"==typeof t){if("string"==typeof e)throw TypeError('The "string" argument must be of type string. Received type number');return c(t)}return l(t,e,n)}function l(t,e,n){if("string"==typeof t)return function(t,e){if(("string"!=typeof e||""===e)&&(e="utf8"),!s.isEncoding(e))throw TypeError("Unknown encoding: "+e);let n=0|d(t,e),r=a(n),o=r.write(t,e);return o!==n&&(r=r.slice(0,o)),r}(t,e);if(ArrayBuffer.isView(t))return function(t){if(j(t,Uint8Array)){let e=new Uint8Array(t);return h(e.buffer,e.byteOffset,e.byteLength)}return f(t)}(t);if(null==t)throw TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof t);if(j(t,ArrayBuffer)||t&&j(t.buffer,ArrayBuffer)||"undefined"!=typeof SharedArrayBuffer&&(j(t,SharedArrayBuffer)||t&&j(t.buffer,SharedArrayBuffer)))return h(t,e,n);if("number"==typeof t)throw TypeError('The "value" argument must not be of type number. Received type number');let r=t.valueOf&&t.valueOf();if(null!=r&&r!==t)return s.from(r,e,n);let o=function(t){var e;if(s.isBuffer(t)){let e=0|p(t.length),n=a(e);return 0===n.length||t.copy(n,0,0,e),n}return void 0!==t.length?"number"!=typeof t.length||(e=t.length)!=e?a(0):f(t):"Buffer"===t.type&&Array.isArray(t.data)?f(t.data):void 0}(t);if(o)return o;if("undefined"!=typeof Symbol&&null!=Symbol.toPrimitive&&"function"==typeof t[Symbol.toPrimitive])return s.from(t[Symbol.toPrimitive]("string"),e,n);throw TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof t)}function u(t){if("number"!=typeof t)throw TypeError('"size" argument must be of type number');if(t<0)throw RangeError('The value "'+t+'" is invalid for option "size"')}function c(t){return u(t),a(t<0?0:0|p(t))}function f(t){let e=t.length<0?0:0|p(t.length),n=a(e);for(let r=0;r<e;r+=1)n[r]=255&t[r];return n}function h(t,e,n){let r;if(e<0||t.byteLength<e)throw RangeError('"offset" is outside of buffer bounds');if(t.byteLength<e+(n||0))throw RangeError('"length" is outside of buffer bounds');return Object.setPrototypeOf(r=void 0===e&&void 0===n?new Uint8Array(t):void 0===n?new Uint8Array(t,e):new Uint8Array(t,e,n),s.prototype),r}function p(t){if(t>=2147483647)throw RangeError("Attempt to allocate Buffer larger than maximum size: 0x7fffffff bytes");return 0|t}function d(t,e){if(s.isBuffer(t))return t.length;if(ArrayBuffer.isView(t)||j(t,ArrayBuffer))return t.byteLength;if("string"!=typeof t)throw TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type '+typeof t);let n=t.length,r=arguments.length>2&&!0===arguments[2];if(!r&&0===n)return 0;let o=!1;for(;;)switch(e){case"ascii":case"latin1":case"binary":return n;case"utf8":case"utf-8":return N(t).length;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return 2*n;case"hex":return n>>>1;case"base64":return P(t).length;default:if(o)return r?-1:N(t).length;e=(""+e).toLowerCase(),o=!0}}function g(t,e,n){let o=!1;if((void 0===e||e<0)&&(e=0),e>this.length||((void 0===n||n>this.length)&&(n=this.length),n<=0||(n>>>=0)<=(e>>>=0)))return"";for(t||(t="utf8");;)switch(t){case"hex":return function(t,e,n){let r=t.length;(!e||e<0)&&(e=0),(!n||n<0||n>r)&&(n=r);let o="";for(let r=e;r<n;++r)o+=M[t[r]];return o}(this,e,n);case"utf8":case"utf-8":return w(this,e,n);case"ascii":return function(t,e,n){let r="";n=Math.min(t.length,n);for(let o=e;o<n;++o)r+=String.fromCharCode(127&t[o]);return r}(this,e,n);case"latin1":case"binary":return function(t,e,n){let r="";n=Math.min(t.length,n);for(let o=e;o<n;++o)r+=String.fromCharCode(t[o]);return r}(this,e,n);case"base64":var i,a;return i=e,a=n,0===i&&a===this.length?r.fromByteArray(this):r.fromByteArray(this.slice(i,a));case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return function(t,e,n){let r=t.slice(e,n),o="";for(let t=0;t<r.length-1;t+=2)o+=String.fromCharCode(r[t]+256*r[t+1]);return o}(this,e,n);default:if(o)throw TypeError("Unknown encoding: "+t);t=(t+"").toLowerCase(),o=!0}}function y(t,e,n){let r=t[e];t[e]=t[n],t[n]=r}function m(t,e,n,r,o){var i;if(0===t.length)return -1;if("string"==typeof n?(r=n,n=0):n>2147483647?n=2147483647:n<-2147483648&&(n=-2147483648),(i=n=+n)!=i&&(n=o?0:t.length-1),n<0&&(n=t.length+n),n>=t.length){if(o)return -1;n=t.length-1}else if(n<0){if(!o)return -1;n=0}if("string"==typeof e&&(e=s.from(e,r)),s.isBuffer(e))return 0===e.length?-1:b(t,e,n,r,o);if("number"==typeof e)return(e&=255,"function"==typeof Uint8Array.prototype.indexOf)?o?Uint8Array.prototype.indexOf.call(t,e,n):Uint8Array.prototype.lastIndexOf.call(t,e,n):b(t,[e],n,r,o);throw TypeError("val must be string, number or Buffer")}function b(t,e,n,r,o){let i,a=1,s=t.length,l=e.length;if(void 0!==r&&("ucs2"===(r=String(r).toLowerCase())||"ucs-2"===r||"utf16le"===r||"utf-16le"===r)){if(t.length<2||e.length<2)return -1;a=2,s/=2,l/=2,n/=2}function u(t,e){return 1===a?t[e]:t.readUInt16BE(e*a)}if(o){let r=-1;for(i=n;i<s;i++)if(u(t,i)===u(e,-1===r?0:i-r)){if(-1===r&&(r=i),i-r+1===l)return r*a}else -1!==r&&(i-=i-r),r=-1}else for(n+l>s&&(n=s-l),i=n;i>=0;i--){let n=!0;for(let r=0;r<l;r++)if(u(t,i+r)!==u(e,r)){n=!1;break}if(n)return i}return -1}function w(t,e,n){n=Math.min(t.length,n);let r=[],o=e;for(;o<n;){let e=t[o],i=null,a=e>239?4:e>223?3:e>191?2:1;if(o+a<=n){let n,r,s,l;switch(a){case 1:e<128&&(i=e);break;case 2:(192&(n=t[o+1]))==128&&(l=(31&e)<<6|63&n)>127&&(i=l);break;case 3:n=t[o+1],r=t[o+2],(192&n)==128&&(192&r)==128&&(l=(15&e)<<12|(63&n)<<6|63&r)>2047&&(l<55296||l>57343)&&(i=l);break;case 4:n=t[o+1],r=t[o+2],s=t[o+3],(192&n)==128&&(192&r)==128&&(192&s)==128&&(l=(15&e)<<18|(63&n)<<12|(63&r)<<6|63&s)>65535&&l<1114112&&(i=l)}}null===i?(i=65533,a=1):i>65535&&(i-=65536,r.push(i>>>10&1023|55296),i=56320|1023&i),r.push(i),o+=a}return function(t){let e=t.length;if(e<=4096)return String.fromCharCode.apply(String,t);let n="",r=0;for(;r<e;)n+=String.fromCharCode.apply(String,t.slice(r,r+=4096));return n}(r)}function v(t,e,n){if(t%1!=0||t<0)throw RangeError("offset is not uint");if(t+e>n)throw RangeError("Trying to access beyond buffer length")}function E(t,e,n,r,o,i){if(!s.isBuffer(t))throw TypeError('"buffer" argument must be a Buffer instance');if(e>o||e<i)throw RangeError('"value" argument is out of bounds');if(n+r>t.length)throw RangeError("Index out of range")}function B(t,e,n,r,o){x(e,r,o,t,n,7);let i=Number(e&BigInt(4294967295));t[n++]=i,i>>=8,t[n++]=i,i>>=8,t[n++]=i,i>>=8,t[n++]=i;let a=Number(e>>BigInt(32)&BigInt(4294967295));return t[n++]=a,a>>=8,t[n++]=a,a>>=8,t[n++]=a,a>>=8,t[n++]=a,n}function I(t,e,n,r,o){x(e,r,o,t,n,7);let i=Number(e&BigInt(4294967295));t[n+7]=i,i>>=8,t[n+6]=i,i>>=8,t[n+5]=i,i>>=8,t[n+4]=i;let a=Number(e>>BigInt(32)&BigInt(4294967295));return t[n+3]=a,a>>=8,t[n+2]=a,a>>=8,t[n+1]=a,a>>=8,t[n]=a,n+8}function A(t,e,n,r,o,i){if(n+r>t.length||n<0)throw RangeError("Index out of range")}function O(t,e,n,r,i){return e=+e,n>>>=0,i||A(t,e,n,4,34028234663852886e22,-34028234663852886e22),o.write(t,e,n,r,23,4),n+4}function U(t,e,n,r,i){return e=+e,n>>>=0,i||A(t,e,n,8,17976931348623157e292,-17976931348623157e292),o.write(t,e,n,r,52,8),n+8}e.lW=s,e.h2=50,s.TYPED_ARRAY_SUPPORT=function(){try{let t=new Uint8Array(1),e={foo:function(){return 42}};return Object.setPrototypeOf(e,Uint8Array.prototype),Object.setPrototypeOf(t,e),42===t.foo()}catch(t){return!1}}(),s.TYPED_ARRAY_SUPPORT||"undefined"==typeof console||"function"!=typeof console.error||console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."),Object.defineProperty(s.prototype,"parent",{enumerable:!0,get:function(){if(s.isBuffer(this))return this.buffer}}),Object.defineProperty(s.prototype,"offset",{enumerable:!0,get:function(){if(s.isBuffer(this))return this.byteOffset}}),s.poolSize=8192,s.from=function(t,e,n){return l(t,e,n)},Object.setPrototypeOf(s.prototype,Uint8Array.prototype),Object.setPrototypeOf(s,Uint8Array),s.alloc=function(t,e,n){return(u(t),t<=0)?a(t):void 0!==e?"string"==typeof n?a(t).fill(e,n):a(t).fill(e):a(t)},s.allocUnsafe=function(t){return c(t)},s.allocUnsafeSlow=function(t){return c(t)},s.isBuffer=function(t){return null!=t&&!0===t._isBuffer&&t!==s.prototype},s.compare=function(t,e){if(j(t,Uint8Array)&&(t=s.from(t,t.offset,t.byteLength)),j(e,Uint8Array)&&(e=s.from(e,e.offset,e.byteLength)),!s.isBuffer(t)||!s.isBuffer(e))throw TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');if(t===e)return 0;let n=t.length,r=e.length;for(let o=0,i=Math.min(n,r);o<i;++o)if(t[o]!==e[o]){n=t[o],r=e[o];break}return n<r?-1:r<n?1:0},s.isEncoding=function(t){switch(String(t).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"latin1":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return!0;default:return!1}},s.concat=function(t,e){let n;if(!Array.isArray(t))throw TypeError('"list" argument must be an Array of Buffers');if(0===t.length)return s.alloc(0);if(void 0===e)for(n=0,e=0;n<t.length;++n)e+=t[n].length;let r=s.allocUnsafe(e),o=0;for(n=0;n<t.length;++n){let e=t[n];if(j(e,Uint8Array))o+e.length>r.length?(s.isBuffer(e)||(e=s.from(e)),e.copy(r,o)):Uint8Array.prototype.set.call(r,e,o);else if(s.isBuffer(e))e.copy(r,o);else throw TypeError('"list" argument must be an Array of Buffers');o+=e.length}return r},s.byteLength=d,s.prototype._isBuffer=!0,s.prototype.swap16=function(){let t=this.length;if(t%2!=0)throw RangeError("Buffer size must be a multiple of 16-bits");for(let e=0;e<t;e+=2)y(this,e,e+1);return this},s.prototype.swap32=function(){let t=this.length;if(t%4!=0)throw RangeError("Buffer size must be a multiple of 32-bits");for(let e=0;e<t;e+=4)y(this,e,e+3),y(this,e+1,e+2);return this},s.prototype.swap64=function(){let t=this.length;if(t%8!=0)throw RangeError("Buffer size must be a multiple of 64-bits");for(let e=0;e<t;e+=8)y(this,e,e+7),y(this,e+1,e+6),y(this,e+2,e+5),y(this,e+3,e+4);return this},s.prototype.toString=function(){let t=this.length;return 0===t?"":0==arguments.length?w(this,0,t):g.apply(this,arguments)},s.prototype.toLocaleString=s.prototype.toString,s.prototype.equals=function(t){if(!s.isBuffer(t))throw TypeError("Argument must be a Buffer");return this===t||0===s.compare(this,t)},s.prototype.inspect=function(){let t="",n=e.h2;return t=this.toString("hex",0,n).replace(/(.{2})/g,"$1 ").trim(),this.length>n&&(t+=" ... "),"<Buffer "+t+">"},i&&(s.prototype[i]=s.prototype.inspect),s.prototype.compare=function(t,e,n,r,o){if(j(t,Uint8Array)&&(t=s.from(t,t.offset,t.byteLength)),!s.isBuffer(t))throw TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type '+typeof t);if(void 0===e&&(e=0),void 0===n&&(n=t?t.length:0),void 0===r&&(r=0),void 0===o&&(o=this.length),e<0||n>t.length||r<0||o>this.length)throw RangeError("out of range index");if(r>=o&&e>=n)return 0;if(r>=o)return -1;if(e>=n)return 1;if(e>>>=0,n>>>=0,r>>>=0,o>>>=0,this===t)return 0;let i=o-r,a=n-e,l=Math.min(i,a),u=this.slice(r,o),c=t.slice(e,n);for(let t=0;t<l;++t)if(u[t]!==c[t]){i=u[t],a=c[t];break}return i<a?-1:a<i?1:0},s.prototype.includes=function(t,e,n){return -1!==this.indexOf(t,e,n)},s.prototype.indexOf=function(t,e,n){return m(this,t,e,n,!0)},s.prototype.lastIndexOf=function(t,e,n){return m(this,t,e,n,!1)},s.prototype.write=function(t,e,n,r){var o,i,a,s,l,u,c,f;if(void 0===e)r="utf8",n=this.length,e=0;else if(void 0===n&&"string"==typeof e)r=e,n=this.length,e=0;else if(isFinite(e))e>>>=0,isFinite(n)?(n>>>=0,void 0===r&&(r="utf8")):(r=n,n=void 0);else throw Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");let h=this.length-e;if((void 0===n||n>h)&&(n=h),t.length>0&&(n<0||e<0)||e>this.length)throw RangeError("Attempt to write outside buffer bounds");r||(r="utf8");let p=!1;for(;;)switch(r){case"hex":return function(t,e,n,r){let o;n=Number(n)||0;let i=t.length-n;r?(r=Number(r))>i&&(r=i):r=i;let a=e.length;for(r>a/2&&(r=a/2),o=0;o<r;++o){let r=parseInt(e.substr(2*o,2),16);if(r!=r)break;t[n+o]=r}return o}(this,t,e,n);case"utf8":case"utf-8":return o=e,i=n,k(N(t,this.length-o),this,o,i);case"ascii":case"latin1":case"binary":return a=e,s=n,k(function(t){let e=[];for(let n=0;n<t.length;++n)e.push(255&t.charCodeAt(n));return e}(t),this,a,s);case"base64":return l=e,u=n,k(P(t),this,l,u);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return c=e,f=n,k(function(t,e){let n,r;let o=[];for(let i=0;i<t.length&&!((e-=2)<0);++i)r=(n=t.charCodeAt(i))>>8,o.push(n%256),o.push(r);return o}(t,this.length-c),this,c,f);default:if(p)throw TypeError("Unknown encoding: "+r);r=(""+r).toLowerCase(),p=!0}},s.prototype.toJSON=function(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}},s.prototype.slice=function(t,e){let n=this.length;t=~~t,e=void 0===e?n:~~e,t<0?(t+=n)<0&&(t=0):t>n&&(t=n),e<0?(e+=n)<0&&(e=0):e>n&&(e=n),e<t&&(e=t);let r=this.subarray(t,e);return Object.setPrototypeOf(r,s.prototype),r},s.prototype.readUintLE=s.prototype.readUIntLE=function(t,e,n){t>>>=0,e>>>=0,n||v(t,e,this.length);let r=this[t],o=1,i=0;for(;++i<e&&(o*=256);)r+=this[t+i]*o;return r},s.prototype.readUintBE=s.prototype.readUIntBE=function(t,e,n){t>>>=0,e>>>=0,n||v(t,e,this.length);let r=this[t+--e],o=1;for(;e>0&&(o*=256);)r+=this[t+--e]*o;return r},s.prototype.readUint8=s.prototype.readUInt8=function(t,e){return t>>>=0,e||v(t,1,this.length),this[t]},s.prototype.readUint16LE=s.prototype.readUInt16LE=function(t,e){return t>>>=0,e||v(t,2,this.length),this[t]|this[t+1]<<8},s.prototype.readUint16BE=s.prototype.readUInt16BE=function(t,e){return t>>>=0,e||v(t,2,this.length),this[t]<<8|this[t+1]},s.prototype.readUint32LE=s.prototype.readUInt32LE=function(t,e){return t>>>=0,e||v(t,4,this.length),(this[t]|this[t+1]<<8|this[t+2]<<16)+16777216*this[t+3]},s.prototype.readUint32BE=s.prototype.readUInt32BE=function(t,e){return t>>>=0,e||v(t,4,this.length),16777216*this[t]+(this[t+1]<<16|this[t+2]<<8|this[t+3])},s.prototype.readBigUInt64LE=$(function(t){T(t>>>=0,"offset");let e=this[t],n=this[t+7];(void 0===e||void 0===n)&&L(t,this.length-8);let r=e+256*this[++t]+65536*this[++t]+16777216*this[++t],o=this[++t]+256*this[++t]+65536*this[++t]+16777216*n;return BigInt(r)+(BigInt(o)<<BigInt(32))}),s.prototype.readBigUInt64BE=$(function(t){T(t>>>=0,"offset");let e=this[t],n=this[t+7];(void 0===e||void 0===n)&&L(t,this.length-8);let r=16777216*e+65536*this[++t]+256*this[++t]+this[++t],o=16777216*this[++t]+65536*this[++t]+256*this[++t]+n;return(BigInt(r)<<BigInt(32))+BigInt(o)}),s.prototype.readIntLE=function(t,e,n){t>>>=0,e>>>=0,n||v(t,e,this.length);let r=this[t],o=1,i=0;for(;++i<e&&(o*=256);)r+=this[t+i]*o;return r>=(o*=128)&&(r-=Math.pow(2,8*e)),r},s.prototype.readIntBE=function(t,e,n){t>>>=0,e>>>=0,n||v(t,e,this.length);let r=e,o=1,i=this[t+--r];for(;r>0&&(o*=256);)i+=this[t+--r]*o;return i>=(o*=128)&&(i-=Math.pow(2,8*e)),i},s.prototype.readInt8=function(t,e){return(t>>>=0,e||v(t,1,this.length),128&this[t])?-((255-this[t]+1)*1):this[t]},s.prototype.readInt16LE=function(t,e){t>>>=0,e||v(t,2,this.length);let n=this[t]|this[t+1]<<8;return 32768&n?4294901760|n:n},s.prototype.readInt16BE=function(t,e){t>>>=0,e||v(t,2,this.length);let n=this[t+1]|this[t]<<8;return 32768&n?4294901760|n:n},s.prototype.readInt32LE=function(t,e){return t>>>=0,e||v(t,4,this.length),this[t]|this[t+1]<<8|this[t+2]<<16|this[t+3]<<24},s.prototype.readInt32BE=function(t,e){return t>>>=0,e||v(t,4,this.length),this[t]<<24|this[t+1]<<16|this[t+2]<<8|this[t+3]},s.prototype.readBigInt64LE=$(function(t){T(t>>>=0,"offset");let e=this[t],n=this[t+7];return(void 0===e||void 0===n)&&L(t,this.length-8),(BigInt(this[t+4]+256*this[t+5]+65536*this[t+6]+(n<<24))<<BigInt(32))+BigInt(e+256*this[++t]+65536*this[++t]+16777216*this[++t])}),s.prototype.readBigInt64BE=$(function(t){T(t>>>=0,"offset");let e=this[t],n=this[t+7];return(void 0===e||void 0===n)&&L(t,this.length-8),(BigInt((e<<24)+65536*this[++t]+256*this[++t]+this[++t])<<BigInt(32))+BigInt(16777216*this[++t]+65536*this[++t]+256*this[++t]+n)}),s.prototype.readFloatLE=function(t,e){return t>>>=0,e||v(t,4,this.length),o.read(this,t,!0,23,4)},s.prototype.readFloatBE=function(t,e){return t>>>=0,e||v(t,4,this.length),o.read(this,t,!1,23,4)},s.prototype.readDoubleLE=function(t,e){return t>>>=0,e||v(t,8,this.length),o.read(this,t,!0,52,8)},s.prototype.readDoubleBE=function(t,e){return t>>>=0,e||v(t,8,this.length),o.read(this,t,!1,52,8)},s.prototype.writeUintLE=s.prototype.writeUIntLE=function(t,e,n,r){if(t=+t,e>>>=0,n>>>=0,!r){let r=Math.pow(2,8*n)-1;E(this,t,e,n,r,0)}let o=1,i=0;for(this[e]=255&t;++i<n&&(o*=256);)this[e+i]=t/o&255;return e+n},s.prototype.writeUintBE=s.prototype.writeUIntBE=function(t,e,n,r){if(t=+t,e>>>=0,n>>>=0,!r){let r=Math.pow(2,8*n)-1;E(this,t,e,n,r,0)}let o=n-1,i=1;for(this[e+o]=255&t;--o>=0&&(i*=256);)this[e+o]=t/i&255;return e+n},s.prototype.writeUint8=s.prototype.writeUInt8=function(t,e,n){return t=+t,e>>>=0,n||E(this,t,e,1,255,0),this[e]=255&t,e+1},s.prototype.writeUint16LE=s.prototype.writeUInt16LE=function(t,e,n){return t=+t,e>>>=0,n||E(this,t,e,2,65535,0),this[e]=255&t,this[e+1]=t>>>8,e+2},s.prototype.writeUint16BE=s.prototype.writeUInt16BE=function(t,e,n){return t=+t,e>>>=0,n||E(this,t,e,2,65535,0),this[e]=t>>>8,this[e+1]=255&t,e+2},s.prototype.writeUint32LE=s.prototype.writeUInt32LE=function(t,e,n){return t=+t,e>>>=0,n||E(this,t,e,4,4294967295,0),this[e+3]=t>>>24,this[e+2]=t>>>16,this[e+1]=t>>>8,this[e]=255&t,e+4},s.prototype.writeUint32BE=s.prototype.writeUInt32BE=function(t,e,n){return t=+t,e>>>=0,n||E(this,t,e,4,4294967295,0),this[e]=t>>>24,this[e+1]=t>>>16,this[e+2]=t>>>8,this[e+3]=255&t,e+4},s.prototype.writeBigUInt64LE=$(function(t,e=0){return B(this,t,e,BigInt(0),BigInt("0xffffffffffffffff"))}),s.prototype.writeBigUInt64BE=$(function(t,e=0){return I(this,t,e,BigInt(0),BigInt("0xffffffffffffffff"))}),s.prototype.writeIntLE=function(t,e,n,r){if(t=+t,e>>>=0,!r){let r=Math.pow(2,8*n-1);E(this,t,e,n,r-1,-r)}let o=0,i=1,a=0;for(this[e]=255&t;++o<n&&(i*=256);)t<0&&0===a&&0!==this[e+o-1]&&(a=1),this[e+o]=(t/i>>0)-a&255;return e+n},s.prototype.writeIntBE=function(t,e,n,r){if(t=+t,e>>>=0,!r){let r=Math.pow(2,8*n-1);E(this,t,e,n,r-1,-r)}let o=n-1,i=1,a=0;for(this[e+o]=255&t;--o>=0&&(i*=256);)t<0&&0===a&&0!==this[e+o+1]&&(a=1),this[e+o]=(t/i>>0)-a&255;return e+n},s.prototype.writeInt8=function(t,e,n){return t=+t,e>>>=0,n||E(this,t,e,1,127,-128),t<0&&(t=255+t+1),this[e]=255&t,e+1},s.prototype.writeInt16LE=function(t,e,n){return t=+t,e>>>=0,n||E(this,t,e,2,32767,-32768),this[e]=255&t,this[e+1]=t>>>8,e+2},s.prototype.writeInt16BE=function(t,e,n){return t=+t,e>>>=0,n||E(this,t,e,2,32767,-32768),this[e]=t>>>8,this[e+1]=255&t,e+2},s.prototype.writeInt32LE=function(t,e,n){return t=+t,e>>>=0,n||E(this,t,e,4,2147483647,-2147483648),this[e]=255&t,this[e+1]=t>>>8,this[e+2]=t>>>16,this[e+3]=t>>>24,e+4},s.prototype.writeInt32BE=function(t,e,n){return t=+t,e>>>=0,n||E(this,t,e,4,2147483647,-2147483648),t<0&&(t=4294967295+t+1),this[e]=t>>>24,this[e+1]=t>>>16,this[e+2]=t>>>8,this[e+3]=255&t,e+4},s.prototype.writeBigInt64LE=$(function(t,e=0){return B(this,t,e,-BigInt("0x8000000000000000"),BigInt("0x7fffffffffffffff"))}),s.prototype.writeBigInt64BE=$(function(t,e=0){return I(this,t,e,-BigInt("0x8000000000000000"),BigInt("0x7fffffffffffffff"))}),s.prototype.writeFloatLE=function(t,e,n){return O(this,t,e,!0,n)},s.prototype.writeFloatBE=function(t,e,n){return O(this,t,e,!1,n)},s.prototype.writeDoubleLE=function(t,e,n){return U(this,t,e,!0,n)},s.prototype.writeDoubleBE=function(t,e,n){return U(this,t,e,!1,n)},s.prototype.copy=function(t,e,n,r){if(!s.isBuffer(t))throw TypeError("argument should be a Buffer");if(n||(n=0),r||0===r||(r=this.length),e>=t.length&&(e=t.length),e||(e=0),r>0&&r<n&&(r=n),r===n||0===t.length||0===this.length)return 0;if(e<0)throw RangeError("targetStart out of bounds");if(n<0||n>=this.length)throw RangeError("Index out of range");if(r<0)throw RangeError("sourceEnd out of bounds");r>this.length&&(r=this.length),t.length-e<r-n&&(r=t.length-e+n);let o=r-n;return this===t&&"function"==typeof Uint8Array.prototype.copyWithin?this.copyWithin(e,n,r):Uint8Array.prototype.set.call(t,this.subarray(n,r),e),o},s.prototype.fill=function(t,e,n,r){let o;if("string"==typeof t){if("string"==typeof e?(r=e,e=0,n=this.length):"string"==typeof n&&(r=n,n=this.length),void 0!==r&&"string"!=typeof r)throw TypeError("encoding must be a string");if("string"==typeof r&&!s.isEncoding(r))throw TypeError("Unknown encoding: "+r);if(1===t.length){let e=t.charCodeAt(0);("utf8"===r&&e<128||"latin1"===r)&&(t=e)}}else"number"==typeof t?t&=255:"boolean"==typeof t&&(t=Number(t));if(e<0||this.length<e||this.length<n)throw RangeError("Out of range index");if(n<=e)return this;if(e>>>=0,n=void 0===n?this.length:n>>>0,t||(t=0),"number"==typeof t)for(o=e;o<n;++o)this[o]=t;else{let i=s.isBuffer(t)?t:s.from(t,r),a=i.length;if(0===a)throw TypeError('The value "'+t+'" is invalid for argument "value"');for(o=0;o<n-e;++o)this[o+e]=i[o%a]}return this};let R={};function C(t,e,n){R[t]=class extends n{constructor(){super(),Object.defineProperty(this,"message",{value:e.apply(this,arguments),writable:!0,configurable:!0}),this.name=`${this.name} [${t}]`,this.stack,delete this.name}get code(){return t}set code(t){Object.defineProperty(this,"code",{configurable:!0,enumerable:!0,value:t,writable:!0})}toString(){return`${this.name} [${t}]: ${this.message}`}}}function S(t){let e="",n=t.length,r="-"===t[0]?1:0;for(;n>=r+4;n-=3)e=`_${t.slice(n-3,n)}${e}`;return`${t.slice(0,n)}${e}`}function x(t,e,n,r,o,i){if(t>n||t<e){let r;let o="bigint"==typeof e?"n":"";throw r=i>3?0===e||e===BigInt(0)?`>= 0${o} and < 2${o} ** ${(i+1)*8}${o}`:`>= -(2${o} ** ${(i+1)*8-1}${o}) and < 2 ** ${(i+1)*8-1}${o}`:`>= ${e}${o} and <= ${n}${o}`,new R.ERR_OUT_OF_RANGE("value",r,t)}T(o,"offset"),(void 0===r[o]||void 0===r[o+i])&&L(o,r.length-(i+1))}function T(t,e){if("number"!=typeof t)throw new R.ERR_INVALID_ARG_TYPE(e,"number",t)}function L(t,e,n){if(Math.floor(t)!==t)throw T(t,n),new R.ERR_OUT_OF_RANGE(n||"offset","an integer",t);if(e<0)throw new R.ERR_BUFFER_OUT_OF_BOUNDS;throw new R.ERR_OUT_OF_RANGE(n||"offset",`>= ${n?1:0} and <= ${e}`,t)}C("ERR_BUFFER_OUT_OF_BOUNDS",function(t){return t?`${t} is outside of buffer bounds`:"Attempt to access memory outside buffer bounds"},RangeError),C("ERR_INVALID_ARG_TYPE",function(t,e){return`The "${t}" argument must be of type number. Received type ${typeof e}`},TypeError),C("ERR_OUT_OF_RANGE",function(t,e,n){let r=`The value of "${t}" is out of range.`,o=n;return Number.isInteger(n)&&Math.abs(n)>4294967296?o=S(String(n)):"bigint"==typeof n&&(o=String(n),(n>BigInt(2)**BigInt(32)||n<-(BigInt(2)**BigInt(32)))&&(o=S(o)),o+="n"),r+=` It must be ${e}. Received ${o}`},RangeError);let _=/[^+/0-9A-Za-z-_]/g;function N(t,e){let n;e=e||1/0;let r=t.length,o=null,i=[];for(let a=0;a<r;++a){if((n=t.charCodeAt(a))>55295&&n<57344){if(!o){if(n>56319||a+1===r){(e-=3)>-1&&i.push(239,191,189);continue}o=n;continue}if(n<56320){(e-=3)>-1&&i.push(239,191,189),o=n;continue}n=(o-55296<<10|n-56320)+65536}else o&&(e-=3)>-1&&i.push(239,191,189);if(o=null,n<128){if((e-=1)<0)break;i.push(n)}else if(n<2048){if((e-=2)<0)break;i.push(n>>6|192,63&n|128)}else if(n<65536){if((e-=3)<0)break;i.push(n>>12|224,n>>6&63|128,63&n|128)}else if(n<1114112){if((e-=4)<0)break;i.push(n>>18|240,n>>12&63|128,n>>6&63|128,63&n|128)}else throw Error("Invalid code point")}return i}function P(t){return r.toByteArray(function(t){if((t=(t=t.split("=")[0]).trim().replace(_,"")).length<2)return"";for(;t.length%4!=0;)t+="=";return t}(t))}function k(t,e,n,r){let o;for(o=0;o<r&&!(o+n>=e.length)&&!(o>=t.length);++o)e[o+n]=t[o];return o}function j(t,e){return t instanceof e||null!=t&&null!=t.constructor&&null!=t.constructor.name&&t.constructor.name===e.name}let M=function(){let t="0123456789abcdef",e=Array(256);for(let n=0;n<16;++n){let r=16*n;for(let o=0;o<16;++o)e[r+o]=t[n]+t[o]}return e}();function $(t){return"undefined"==typeof BigInt?z:t}function z(){throw Error("BigInt not supported")}},80645:function(t,e){e.read=function(t,e,n,r,o){var i,a,s=8*o-r-1,l=(1<<s)-1,u=l>>1,c=-7,f=n?o-1:0,h=n?-1:1,p=t[e+f];for(f+=h,i=p&(1<<-c)-1,p>>=-c,c+=s;c>0;i=256*i+t[e+f],f+=h,c-=8);for(a=i&(1<<-c)-1,i>>=-c,c+=r;c>0;a=256*a+t[e+f],f+=h,c-=8);if(0===i)i=1-u;else{if(i===l)return a?NaN:1/0*(p?-1:1);a+=Math.pow(2,r),i-=u}return(p?-1:1)*a*Math.pow(2,i-r)},e.write=function(t,e,n,r,o,i){var a,s,l,u=8*i-o-1,c=(1<<u)-1,f=c>>1,h=23===o?5960464477539062e-23:0,p=r?0:i-1,d=r?1:-1,g=e<0||0===e&&1/e<0?1:0;for(isNaN(e=Math.abs(e))||e===1/0?(s=isNaN(e)?1:0,a=c):(a=Math.floor(Math.log(e)/Math.LN2),e*(l=Math.pow(2,-a))<1&&(a--,l*=2),a+f>=1?e+=h/l:e+=h*Math.pow(2,1-f),e*l>=2&&(a++,l/=2),a+f>=c?(s=0,a=c):a+f>=1?(s=(e*l-1)*Math.pow(2,o),a+=f):(s=e*Math.pow(2,f-1)*Math.pow(2,o),a=0));o>=8;t[n+p]=255&s,p+=d,s/=256,o-=8);for(a=a<<o|s,u+=o;u>0;t[n+p]=255&a,p+=d,a/=256,u-=8);t[n+p-d]|=128*g}},50876:function(t,e,n){"use strict";n.d(e,{Z:function(){return F}});var r=n(67294),o=n(67371),i=n(93967),a=n.n(i),s=n(76234),l=n(41745),u=n(22720),c=n(97485),f=n(4969),h=n(96996),p=n(64204),d=n(84476),g=n(38284),y=n(18808),m=n(17399),b=n(85980),w=n(28025),v=n(33604),E=n(71845),B=n(46368),I=n(30641),A=n(59507),O=n(81885),U=n(70201),R=n(26069),C=n(47211),S=n(52317),x=n(88494),T=t=>{let{componentCls:e,menuCls:n,colorError:r,colorTextLightSolid:o}=t,i="".concat(n,"-item");return{["".concat(e,", ").concat(e,"-menu-submenu")]:{["".concat(n," ").concat(i)]:{["&".concat(i,"-danger:not(").concat(i,"-disabled)")]:{color:r,"&:hover":{color:o,backgroundColor:r}}}}}};let L=t=>{let{componentCls:e,menuCls:n,zIndexPopup:r,dropdownArrowDistance:o,sizePopupArrow:i,antCls:a,iconCls:s,motionDurationMid:l,paddingBlock:u,fontSize:c,dropdownEdgeChildPadding:f,colorTextDisabled:h,fontSizeIcon:p,controlPaddingHorizontal:d,colorBgElevated:g}=t;return[{[e]:{position:"absolute",top:-9999,left:{_skip_check_:!0,value:-9999},zIndex:r,display:"block","&::before":{position:"absolute",insetBlock:t.calc(i).div(2).sub(o).equal(),zIndex:-9999,opacity:1e-4,content:'""'},"&-menu-vertical":{maxHeight:"100vh",overflowY:"auto"},["&-trigger".concat(a,"-btn")]:{["& > ".concat(s,"-down, & > ").concat(a,"-btn-icon > ").concat(s,"-down")]:{fontSize:p}},["".concat(e,"-wrap")]:{position:"relative",["".concat(a,"-btn > ").concat(s,"-down")]:{fontSize:p},["".concat(s,"-down::before")]:{transition:"transform ".concat(l)}},["".concat(e,"-wrap-open")]:{["".concat(s,"-down::before")]:{transform:"rotate(180deg)"}},"\n        &-hidden,\n        &-menu-hidden,\n        &-menu-submenu-hidden\n      ":{display:"none"},["&".concat(a,"-slide-down-enter").concat(a,"-slide-down-enter-active").concat(e,"-placement-bottomLeft,\n          &").concat(a,"-slide-down-appear").concat(a,"-slide-down-appear-active").concat(e,"-placement-bottomLeft,\n          &").concat(a,"-slide-down-enter").concat(a,"-slide-down-enter-active").concat(e,"-placement-bottom,\n          &").concat(a,"-slide-down-appear").concat(a,"-slide-down-appear-active").concat(e,"-placement-bottom,\n          &").concat(a,"-slide-down-enter").concat(a,"-slide-down-enter-active").concat(e,"-placement-bottomRight,\n          &").concat(a,"-slide-down-appear").concat(a,"-slide-down-appear-active").concat(e,"-placement-bottomRight")]:{animationName:A.fJ},["&".concat(a,"-slide-up-enter").concat(a,"-slide-up-enter-active").concat(e,"-placement-topLeft,\n          &").concat(a,"-slide-up-appear").concat(a,"-slide-up-appear-active").concat(e,"-placement-topLeft,\n          &").concat(a,"-slide-up-enter").concat(a,"-slide-up-enter-active").concat(e,"-placement-top,\n          &").concat(a,"-slide-up-appear").concat(a,"-slide-up-appear-active").concat(e,"-placement-top,\n          &").concat(a,"-slide-up-enter").concat(a,"-slide-up-enter-active").concat(e,"-placement-topRight,\n          &").concat(a,"-slide-up-appear").concat(a,"-slide-up-appear-active").concat(e,"-placement-topRight")]:{animationName:A.Qt},["&".concat(a,"-slide-down-leave").concat(a,"-slide-down-leave-active").concat(e,"-placement-bottomLeft,\n          &").concat(a,"-slide-down-leave").concat(a,"-slide-down-leave-active").concat(e,"-placement-bottom,\n          &").concat(a,"-slide-down-leave").concat(a,"-slide-down-leave-active").concat(e,"-placement-bottomRight")]:{animationName:A.Uw},["&".concat(a,"-slide-up-leave").concat(a,"-slide-up-leave-active").concat(e,"-placement-topLeft,\n          &").concat(a,"-slide-up-leave").concat(a,"-slide-up-leave-active").concat(e,"-placement-top,\n          &").concat(a,"-slide-up-leave").concat(a,"-slide-up-leave-active").concat(e,"-placement-topRight")]:{animationName:A.ly}}},(0,R.ZP)(t,g,{arrowPlacement:{top:!0,bottom:!0}}),{["".concat(e," ").concat(n)]:{position:"relative",margin:0},["".concat(n,"-submenu-popup")]:{position:"absolute",zIndex:r,background:"transparent",boxShadow:"none",transformOrigin:"0 0","ul, li":{listStyle:"none",margin:0}},["".concat(e,", ").concat(e,"-menu-submenu")]:Object.assign(Object.assign({},(0,I.Wf)(t)),{[n]:Object.assign(Object.assign({padding:f,listStyleType:"none",backgroundColor:g,backgroundClip:"padding-box",borderRadius:t.borderRadiusLG,outline:"none",boxShadow:t.boxShadowSecondary},(0,I.Qy)(t)),{"&:empty":{padding:0,boxShadow:"none"},["".concat(n,"-item-group-title")]:{padding:"".concat((0,B.bf)(u)," ").concat((0,B.bf)(d)),color:t.colorTextDescription,transition:"all ".concat(l)},["".concat(n,"-item")]:{position:"relative",display:"flex",alignItems:"center"},["".concat(n,"-item-icon")]:{minWidth:c,marginInlineEnd:t.marginXS,fontSize:t.fontSizeSM},["".concat(n,"-title-content")]:{display:"flex",alignItems:"center",flex:"auto","> a":{color:"inherit",transition:"all ".concat(l),"&:hover":{color:"inherit"},"&::after":{position:"absolute",inset:0,content:'""'}},["".concat(n,"-item-extra")]:{paddingInlineStart:t.padding,marginInlineStart:"auto",fontSize:t.fontSizeSM,color:t.colorTextDescription}},["".concat(n,"-item, ").concat(n,"-submenu-title")]:Object.assign(Object.assign({display:"flex",margin:0,padding:"".concat((0,B.bf)(u)," ").concat((0,B.bf)(d)),color:t.colorText,fontWeight:"normal",fontSize:c,lineHeight:t.lineHeight,cursor:"pointer",transition:"all ".concat(l),borderRadius:t.borderRadiusSM,"&:hover, &-active":{backgroundColor:t.controlItemBgHover}},(0,I.Qy)(t)),{"&-selected":{color:t.colorPrimary,backgroundColor:t.controlItemBgActive,"&:hover, &-active":{backgroundColor:t.controlItemBgActiveHover}},"&-disabled":{color:h,cursor:"not-allowed","&:hover":{color:h,backgroundColor:g,cursor:"not-allowed"},a:{pointerEvents:"none"}},"&-divider":{height:1,margin:"".concat((0,B.bf)(t.marginXXS)," 0"),overflow:"hidden",lineHeight:0,backgroundColor:t.colorSplit},["".concat(e,"-menu-submenu-expand-icon")]:{position:"absolute",insetInlineEnd:t.paddingXS,["".concat(e,"-menu-submenu-arrow-icon")]:{marginInlineEnd:"0 !important",color:t.colorTextDescription,fontSize:p,fontStyle:"normal"}}}),["".concat(n,"-item-group-list")]:{margin:"0 ".concat((0,B.bf)(t.marginXS)),padding:0,listStyle:"none"},["".concat(n,"-submenu-title")]:{paddingInlineEnd:t.calc(d).add(t.fontSizeSM).equal()},["".concat(n,"-submenu-vertical")]:{position:"relative"},["".concat(n,"-submenu").concat(n,"-submenu-disabled ").concat(e,"-menu-submenu-title")]:{["&, ".concat(e,"-menu-submenu-arrow-icon")]:{color:h,backgroundColor:g,cursor:"not-allowed"}},["".concat(n,"-submenu-selected ").concat(e,"-menu-submenu-title")]:{color:t.colorPrimary}})})},[(0,A.oN)(t,"slide-up"),(0,A.oN)(t,"slide-down"),(0,O.Fm)(t,"move-up"),(0,O.Fm)(t,"move-down"),(0,U._y)(t,"zoom-big")]]};var _=(0,S.I$)("Dropdown",t=>{let{marginXXS:e,sizePopupArrow:n,paddingXXS:r,componentCls:o}=t,i=(0,x.IX)(t,{menuCls:"".concat(o,"-menu"),dropdownArrowDistance:t.calc(n).div(2).add(e).equal(),dropdownEdgeChildPadding:r});return[L(i),T(i)]},t=>Object.assign(Object.assign({zIndexPopup:t.zIndexPopupBase+50,paddingBlock:(t.controlHeight-t.fontSize*t.lineHeight)/2},(0,R.wZ)({contentRadius:t.borderRadiusLG,limitVerticalRadius:!0})),(0,C.w)(t)),{resetStyle:!1});let N=t=>{var e;let{menu:n,arrow:i,prefixCls:p,children:B,trigger:I,disabled:A,dropdownRender:O,getPopupContainer:U,overlayClassName:R,rootClassName:C,overlayStyle:S,open:x,onOpenChange:T,visible:L,onVisibleChange:N,mouseEnterDelay:P=.15,mouseLeaveDelay:k=.1,autoAdjustOverflow:j=!0,placement:M="",overlay:$,transitionName:z}=t,{getPopupContainer:D,getPrefixCls:F,direction:Z,dropdown:H}=r.useContext(m.E_);(0,g.ln)("Dropdown");let X=r.useMemo(()=>{let t=F();return void 0!==z?z:M.includes("top")?"".concat(t,"-slide-down"):"".concat(t,"-slide-up")},[F,M,z]),Y=r.useMemo(()=>M?M.includes("Center")?M.slice(0,M.indexOf("Center")):M:"rtl"===Z?"bottomRight":"bottomLeft",[M,Z]),G=F("dropdown",p),W=(0,b.Z)(G),[q,V,J]=_(G,W),[,Q]=(0,E.ZP)(),K=r.Children.only(B),tt=(0,d.Tm)(K,{className:a()("".concat(G,"-trigger"),{["".concat(G,"-rtl")]:"rtl"===Z},K.props.className),disabled:null!==(e=K.props.disabled)&&void 0!==e?e:A}),te=A?[]:I,tn=!!(null==te?void 0:te.includes("contextMenu")),[tr,to]=(0,u.Z)(!1,{value:null!=x?x:L}),ti=(0,l.Z)(t=>{null==T||T(t,{source:"trigger"}),null==N||N(t),to(t)}),ta=a()(R,C,V,J,W,null==H?void 0:H.className,{["".concat(G,"-rtl")]:"rtl"===Z}),ts=(0,h.Z)({arrowPointAtCenter:"object"==typeof i&&i.pointAtCenter,autoAdjustOverflow:j,offset:Q.marginXXS,arrowWidth:i?Q.sizePopupArrow:0,borderRadius:Q.borderRadius}),tl=r.useCallback(()=>{null!=n&&n.selectable&&null!=n&&n.multiple||(null==T||T(!1,{source:"menu"}),to(!1))},[null==n?void 0:n.selectable,null==n?void 0:n.multiple]),[tu,tc]=(0,f.Cn)("Dropdown",null==S?void 0:S.zIndex),tf=r.createElement(s.Z,Object.assign({alignPoint:tn},(0,c.Z)(t,["rootClassName"]),{mouseEnterDelay:P,mouseLeaveDelay:k,visible:tr,builtinPlacements:ts,arrow:!!i,overlayClassName:ta,prefixCls:G,getPopupContainer:U||D,transitionName:X,trigger:te,overlay:()=>{let t;return t=(null==n?void 0:n.items)?r.createElement(w.Z,Object.assign({},n)):"function"==typeof $?$():$,O&&(t=O(t)),t=r.Children.only("string"==typeof t?r.createElement("span",null,t):t),r.createElement(v.J,{prefixCls:"".concat(G,"-menu"),rootClassName:a()(J,W),expandIcon:r.createElement("span",{className:"".concat(G,"-menu-submenu-arrow")},r.createElement(o.Z,{className:"".concat(G,"-menu-submenu-arrow-icon")})),mode:"vertical",selectable:!1,onClick:tl,validator:t=>{let{mode:e}=t}},t)},placement:Y,onVisibleChange:ti,overlayStyle:Object.assign(Object.assign(Object.assign({},null==H?void 0:H.style),S),{zIndex:tu})}),tt);return tu&&(tf=r.createElement(y.Z.Provider,{value:tc},tf)),q(tf)},P=(0,p.Z)(N,"dropdown",t=>t,function(t){return Object.assign(Object.assign({},t),{align:{overflow:{adjustX:!1,adjustY:!1}}})});N._InternalPanelDoNotUseOrYouWillBeFired=t=>r.createElement(P,Object.assign({},t),r.createElement("span",null));var k=n(50005),j=n(46437),M=n(35054),$=n(17877),z=function(t,e){var n={};for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&0>e.indexOf(r)&&(n[r]=t[r]);if(null!=t&&"function"==typeof Object.getOwnPropertySymbols)for(var o=0,r=Object.getOwnPropertySymbols(t);o<r.length;o++)0>e.indexOf(r[o])&&Object.prototype.propertyIsEnumerable.call(t,r[o])&&(n[r[o]]=t[r[o]]);return n};let D=t=>{let{getPopupContainer:e,getPrefixCls:n,direction:o}=r.useContext(m.E_),{prefixCls:i,type:s="default",danger:l,disabled:u,loading:c,onClick:f,htmlType:h,children:p,className:d,menu:g,arrow:y,autoFocus:b,overlay:w,trigger:v,align:E,open:B,onOpenChange:I,placement:A,getPopupContainer:O,href:U,icon:R=r.createElement(k.Z,null),title:C,buttonsRender:S=t=>t,mouseEnterDelay:x,mouseLeaveDelay:T,overlayClassName:L,overlayStyle:_,destroyPopupOnHide:P,dropdownRender:D}=t,F=z(t,["prefixCls","type","danger","disabled","loading","onClick","htmlType","children","className","menu","arrow","autoFocus","overlay","trigger","align","open","onOpenChange","placement","getPopupContainer","href","icon","title","buttonsRender","mouseEnterDelay","mouseLeaveDelay","overlayClassName","overlayStyle","destroyPopupOnHide","dropdownRender"]),Z=n("dropdown",i),H={menu:g,arrow:y,autoFocus:b,align:E,disabled:u,trigger:u?[]:v,onOpenChange:I,getPopupContainer:O||e,mouseEnterDelay:x,mouseLeaveDelay:T,overlayClassName:L,overlayStyle:_,destroyPopupOnHide:P,dropdownRender:D},{compactSize:X,compactItemClassnames:Y}=(0,$.ri)(Z,o),G=a()("".concat(Z,"-button"),Y,d);"overlay"in t&&(H.overlay=w),"open"in t&&(H.open=B),"placement"in t?H.placement=A:H.placement="rtl"===o?"bottomLeft":"bottomRight";let[W,q]=S([r.createElement(j.ZP,{type:s,danger:l,disabled:u,loading:c,onClick:f,htmlType:h,href:U,title:C},p),r.createElement(j.ZP,{type:s,danger:l,icon:R})]);return r.createElement(M.Z.Compact,Object.assign({className:G,size:X,block:!0},F),W,r.createElement(N,Object.assign({},H),q))};D.__ANT_BUTTON=!0,N.Button=D;var F=N}}]);