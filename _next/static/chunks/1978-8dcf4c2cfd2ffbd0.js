(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[1978],{91978:function(e,t,n){"use strict";n.d(t,{Z:function(){return eZ}});var i=n(87462),r=n(1413),o=n(15671),l=n(43144),a=n(97326),s=n(32531),c=n(73568),d=n(4942),u=n(67294),p=n(71002),f=n(91),h={animating:!1,autoplaying:null,currentDirection:0,currentLeft:null,currentSlide:0,direction:1,dragging:!1,edgeDragged:!1,initialized:!1,lazyLoadedList:[],listHeight:null,listWidth:null,scrolling:!1,slideCount:null,slideHeight:null,slideWidth:null,swipeLeft:null,swiped:!1,swiping:!1,touchObject:{startX:0,startY:0,curX:0,curY:0},trackStyle:{},trackWidth:0,targetSlide:0},v=n(27856),g=n(94184),S=n.n(g);function y(e,t,n){return Math.max(t,Math.min(e,n))}var k=function(e){["onTouchStart","onTouchMove","onWheel"].includes(e._reactName)||e.preventDefault()},Z=function(e){for(var t=[],n=m(e),i=w(e),r=n;r<i;r++)0>e.lazyLoadedList.indexOf(r)&&t.push(r);return t},m=function(e){return e.currentSlide-b(e)},w=function(e){return e.currentSlide+T(e)},b=function(e){return e.centerMode?Math.floor(e.slidesToShow/2)+(parseInt(e.centerPadding)>0?1:0):0},T=function(e){return e.centerMode?Math.floor((e.slidesToShow-1)/2)+1+(parseInt(e.centerPadding)>0?1:0):e.slidesToShow},L=function(e){return e&&e.offsetWidth||0},C=function(e){return e&&e.offsetHeight||0},x=function(e){var t,n,i=arguments.length>1&&void 0!==arguments[1]&&arguments[1];return(t=e.startX-e.curX,(n=Math.round(180*Math.atan2(e.startY-e.curY,t)/Math.PI))<0&&(n=360-Math.abs(n)),n<=45&&n>=0||n<=360&&n>=315)?"left":n>=135&&n<=225?"right":!0===i?n>=35&&n<=135?"up":"down":"vertical"},E=function(e){var t=!0;return!e.infinite&&(e.centerMode&&e.currentSlide>=e.slideCount-1?t=!1:(e.slideCount<=e.slidesToShow||e.currentSlide>=e.slideCount-e.slidesToShow)&&(t=!1)),t},M=function(e,t){var n={};return t.forEach(function(t){return n[t]=e[t]}),n},z=function(e){var t,n=u.Children.count(e.children),i=e.listRef,o=Math.ceil(L(i)),l=Math.ceil(L(e.trackRef&&e.trackRef.node));if(e.vertical)t=o;else{var a=e.centerMode&&2*parseInt(e.centerPadding);"string"==typeof e.centerPadding&&"%"===e.centerPadding.slice(-1)&&(a*=o/100),t=Math.ceil((o-a)/e.slidesToShow)}var s=i&&C(i.querySelector('[data-index="0"]')),c=s*e.slidesToShow,d=void 0===e.currentSlide?e.initialSlide:e.currentSlide;e.rtl&&void 0===e.currentSlide&&(d=n-1-e.initialSlide);var p=e.lazyLoadedList||[],f=Z((0,r.Z)((0,r.Z)({},e),{},{currentSlide:d,lazyLoadedList:p}));p=p.concat(f);var h={slideCount:n,slideWidth:t,listWidth:o,trackWidth:l,currentSlide:d,slideHeight:s,listHeight:c,lazyLoadedList:p};return null===e.autoplaying&&e.autoplay&&(h.autoplaying="playing"),h},H=function(e){var t=e.waitForAnimate,n=e.animating,i=e.fade,o=e.infinite,l=e.index,a=e.slideCount,s=e.lazyLoad,c=e.currentSlide,d=e.centerMode,u=e.slidesToScroll,p=e.slidesToShow,f=e.useCSS,h=e.lazyLoadedList;if(t&&n)return{};var v,g,S,k=l,m={},w={},b=o?l:y(l,0,a-1);if(i){if(!o&&(l<0||l>=a))return{};l<0?k=l+a:l>=a&&(k=l-a),s&&0>h.indexOf(k)&&(h=h.concat(k)),m={animating:!0,currentSlide:k,lazyLoadedList:h,targetSlide:k},w={animating:!1,targetSlide:k}}else v=k,k<0?(v=k+a,o?a%u!=0&&(v=a-a%u):v=0):!E(e)&&k>c?k=v=c:d&&k>=a?(k=o?a:a-1,v=o?0:a-1):k>=a&&(v=k-a,o?a%u!=0&&(v=0):v=a-p),!o&&k+p>=a&&(v=a-p),g=X((0,r.Z)((0,r.Z)({},e),{},{slideIndex:k})),S=X((0,r.Z)((0,r.Z)({},e),{},{slideIndex:v})),o||(g===S&&(k=v),g=S),s&&(h=h.concat(Z((0,r.Z)((0,r.Z)({},e),{},{currentSlide:k})))),f?(m={animating:!0,currentSlide:v,trackStyle:j((0,r.Z)((0,r.Z)({},e),{},{left:g})),lazyLoadedList:h,targetSlide:b},w={animating:!1,currentSlide:v,trackStyle:D((0,r.Z)((0,r.Z)({},e),{},{left:S})),swipeLeft:null,targetSlide:b}):m={currentSlide:v,trackStyle:D((0,r.Z)((0,r.Z)({},e),{},{left:S})),lazyLoadedList:h,targetSlide:b};return{state:m,nextState:w}},W=function(e,t){var n,i,o,l,a=e.slidesToScroll,s=e.slidesToShow,c=e.slideCount,d=e.currentSlide,u=e.targetSlide,p=e.lazyLoad,f=e.infinite;if(n=c%a!=0?0:(c-d)%a,"previous"===t.message)l=d-(o=0===n?a:s-n),p&&!f&&(l=-1==(i=d-o)?c-1:i),f||(l=u-a);else if("next"===t.message)l=d+(o=0===n?a:n),p&&!f&&(l=(d+a)%c+n),f||(l=u+a);else if("dots"===t.message)l=t.index*t.slidesToScroll;else if("children"===t.message){if(l=t.index,f){var h=q((0,r.Z)((0,r.Z)({},e),{},{targetSlide:l}));l>t.currentSlide&&"left"===h?l-=c:l<t.currentSlide&&"right"===h&&(l+=c)}}else"index"===t.message&&(l=Number(t.index));return l},O=function(e,t){var n=t.scrolling,i=t.animating,o=t.vertical,l=t.swipeToSlide,a=t.verticalSwiping,s=t.rtl,c=t.currentSlide,d=t.edgeFriction,u=t.edgeDragged,p=t.onEdge,f=t.swiped,h=t.swiping,v=t.slideCount,g=t.slidesToScroll,S=t.infinite,y=t.touchObject,Z=t.swipeEvent,m=t.listHeight,w=t.listWidth;if(!n){if(i)return k(e);o&&l&&a&&k(e);var b,T={},L=X(t);y.curX=e.touches?e.touches[0].pageX:e.clientX,y.curY=e.touches?e.touches[0].pageY:e.clientY,y.swipeLength=Math.round(Math.sqrt(Math.pow(y.curX-y.startX,2)));var C=Math.round(Math.sqrt(Math.pow(y.curY-y.startY,2)));if(!a&&!h&&C>10)return{scrolling:!0};a&&(y.swipeLength=C);var M=(s?-1:1)*(y.curX>y.startX?1:-1);a&&(M=y.curY>y.startY?1:-1);var z=x(t.touchObject,a),H=y.swipeLength;return!S&&(0===c&&("right"===z||"down"===z)||c+1>=Math.ceil(v/g)&&("left"===z||"up"===z)||!E(t)&&("left"===z||"up"===z))&&(H=y.swipeLength*d,!1===u&&p&&(p(z),T.edgeDragged=!0)),!f&&Z&&(Z(z),T.swiped=!0),b=o?L+H*(m/w)*M:s?L-H*M:L+H*M,a&&(b=L+H*M),T=(0,r.Z)((0,r.Z)({},T),{},{touchObject:y,swipeLeft:b,trackStyle:D((0,r.Z)((0,r.Z)({},t),{},{left:b}))}),Math.abs(y.curX-y.startX)<.8*Math.abs(y.curY-y.startY)||y.swipeLength>10&&(T.swiping=!0,k(e)),T}},I=function(e,t){var n=t.dragging,i=t.swipe,o=t.touchObject,l=t.listWidth,a=t.touchThreshold,s=t.verticalSwiping,c=t.listHeight,d=t.swipeToSlide,u=t.scrolling,p=t.onSwipe,f=t.targetSlide,h=t.currentSlide,v=t.infinite;if(!n)return i&&k(e),{};var g=s?c/a:l/a,S=x(o,s),y={dragging:!1,edgeDragged:!1,scrolling:!1,swiping:!1,swiped:!1,swipeLeft:null,touchObject:{}};if(u||!o.swipeLength)return y;if(o.swipeLength>g){k(e),p&&p(S);var Z,m,w=v?h:f;switch(S){case"left":case"up":m=w+N(t),Z=d?R(t,m):m,y.currentDirection=0;break;case"right":case"down":m=w-N(t),Z=d?R(t,m):m,y.currentDirection=1;break;default:Z=w}y.triggerSlideHandler=Z}else{var b=X(t);y.trackStyle=j((0,r.Z)((0,r.Z)({},t),{},{left:b}))}return y},P=function(e){for(var t=e.infinite?2*e.slideCount:e.slideCount,n=e.infinite?-1*e.slidesToShow:0,i=e.infinite?-1*e.slidesToShow:0,r=[];n<t;)r.push(n),n=i+e.slidesToScroll,i+=Math.min(e.slidesToScroll,e.slidesToShow);return r},R=function(e,t){var n=P(e),i=0;if(t>n[n.length-1])t=n[n.length-1];else for(var r in n){if(t<n[r]){t=i;break}i=n[r]}return t},N=function(e){var t=e.centerMode?e.slideWidth*Math.floor(e.slidesToShow/2):0;if(!e.swipeToSlide)return e.slidesToScroll;var n,i=e.listRef;if(Array.from(i.querySelectorAll&&i.querySelectorAll(".slick-slide")||[]).every(function(i){if(e.vertical){if(i.offsetTop+C(i)/2>-1*e.swipeLeft)return n=i,!1}else if(i.offsetLeft-t+L(i)/2>-1*e.swipeLeft)return n=i,!1;return!0}),!n)return 0;var r=!0===e.rtl?e.slideCount-e.currentSlide:e.currentSlide;return Math.abs(n.dataset.index-r)||1},A=function(e,t){return t.reduce(function(t,n){return t&&e.hasOwnProperty(n)},!0)?null:console.error("Keys Missing:",e)},D=function(e){A(e,["left","variableWidth","slideCount","slidesToShow","slideWidth"]);var t,n,i=e.slideCount+2*e.slidesToShow;e.vertical?n=i*e.slideHeight:t=F(e)*e.slideWidth;var o={opacity:1,transition:"",WebkitTransition:""};if(e.useTransform){var l=e.vertical?"translate3d(0px, "+e.left+"px, 0px)":"translate3d("+e.left+"px, 0px, 0px)",a=e.vertical?"translate3d(0px, "+e.left+"px, 0px)":"translate3d("+e.left+"px, 0px, 0px)",s=e.vertical?"translateY("+e.left+"px)":"translateX("+e.left+"px)";o=(0,r.Z)((0,r.Z)({},o),{},{WebkitTransform:l,transform:a,msTransform:s})}else e.vertical?o.top=e.left:o.left=e.left;return e.fade&&(o={opacity:1}),t&&(o.width=t),n&&(o.height=n),window&&!window.addEventListener&&window.attachEvent&&(e.vertical?o.marginTop=e.left+"px":o.marginLeft=e.left+"px"),o},j=function(e){A(e,["left","variableWidth","slideCount","slidesToShow","slideWidth","speed","cssEase"]);var t=D(e);return e.useTransform?(t.WebkitTransition="-webkit-transform "+e.speed+"ms "+e.cssEase,t.transition="transform "+e.speed+"ms "+e.cssEase):e.vertical?t.transition="top "+e.speed+"ms "+e.cssEase:t.transition="left "+e.speed+"ms "+e.cssEase,t},X=function(e){if(e.unslick)return 0;A(e,["slideIndex","trackRef","infinite","centerMode","slideCount","slidesToShow","slidesToScroll","slideWidth","listWidth","variableWidth","slideHeight"]);var t=e.slideIndex,n=e.trackRef,i=e.infinite,r=e.centerMode,o=e.slideCount,l=e.slidesToShow,a=e.slidesToScroll,s=e.slideWidth,c=e.listWidth,d=e.variableWidth,u=e.slideHeight,p=e.fade,f=e.vertical,h=0,v=0;if(p||1===e.slideCount)return 0;var g=0;if(i?(g=-Y(e),o%a!=0&&t+a>o&&(g=-(t>o?l-(t-o):o%a)),r&&(g+=parseInt(l/2))):(o%a!=0&&t+a>o&&(g=l-o%a),r&&(g=parseInt(l/2))),h=g*s,v=g*u,S=f?-(t*u*1)+v:-(t*s*1)+h,!0===d){var S,y,k,Z=n&&n.node;if(k=t+Y(e),S=(y=Z&&Z.childNodes[k])?-1*y.offsetLeft:0,!0===r){k=i?t+Y(e):t,y=Z&&Z.children[k],S=0;for(var m=0;m<k;m++)S-=Z&&Z.children[m]&&Z.children[m].offsetWidth;S-=parseInt(e.centerPadding),S+=y&&(c-y.offsetWidth)/2}}return S},Y=function(e){return e.unslick||!e.infinite?0:e.variableWidth?e.slideCount:e.slidesToShow+(e.centerMode?1:0)},$=function(e){return e.unslick||!e.infinite?0:e.slideCount},F=function(e){return 1===e.slideCount?1:Y(e)+e.slideCount+$(e)},q=function(e){return e.targetSlide>e.currentSlide?e.targetSlide>e.currentSlide+_(e)?"left":"right":e.targetSlide<e.currentSlide-B(e)?"right":"left"},_=function(e){var t=e.slidesToShow,n=e.centerMode,i=e.rtl,r=e.centerPadding;if(n){var o=(t-1)/2+1;return parseInt(r)>0&&(o+=1),i&&t%2==0&&(o+=1),o}return i?0:t-1},B=function(e){var t=e.slidesToShow,n=e.centerMode,i=e.rtl,r=e.centerPadding;if(n){var o=(t-1)/2+1;return parseInt(r)>0&&(o+=1),i||t%2!=0||(o+=1),o}return i?t-1:0},G=function(){return!!("undefined"!=typeof window&&window.document&&window.document.createElement)},U=function(e){var t,n,i,r,o;return i=(o=e.rtl?e.slideCount-1-e.index:e.index)<0||o>=e.slideCount,e.centerMode?(r=Math.floor(e.slidesToShow/2),n=(o-e.currentSlide)%e.slideCount==0,o>e.currentSlide-r-1&&o<=e.currentSlide+r&&(t=!0)):t=e.currentSlide<=o&&o<e.currentSlide+e.slidesToShow,{"slick-slide":!0,"slick-active":t,"slick-center":n,"slick-cloned":i,"slick-current":o===(e.targetSlide<0?e.targetSlide+e.slideCount:e.targetSlide>=e.slideCount?e.targetSlide-e.slideCount:e.targetSlide)}},K=function(e){var t={};return(void 0===e.variableWidth||!1===e.variableWidth)&&(t.width=e.slideWidth),e.fade&&(t.position="relative",e.vertical&&e.slideHeight?t.top=-e.index*parseInt(e.slideHeight):t.left=-e.index*parseInt(e.slideWidth),t.opacity=e.currentSlide===e.index?1:0,e.useCSS&&(t.transition="opacity "+e.speed+"ms "+e.cssEase+", visibility "+e.speed+"ms "+e.cssEase)),t},V=function(e,t){return e.key+"-"+t},J=function(e){var t,n=[],i=[],o=[],l=u.Children.count(e.children),a=m(e),s=w(e);return(u.Children.forEach(e.children,function(c,d){var p,f={message:"children",index:d,slidesToScroll:e.slidesToScroll,currentSlide:e.currentSlide};p=!e.lazyLoad||e.lazyLoad&&e.lazyLoadedList.indexOf(d)>=0?c:u.createElement("div",null);var h=K((0,r.Z)((0,r.Z)({},e),{},{index:d})),v=p.props.className||"",g=U((0,r.Z)((0,r.Z)({},e),{},{index:d}));if(n.push(u.cloneElement(p,{key:"original"+V(p,d),"data-index":d,className:S()(g,v),tabIndex:"-1","aria-hidden":!g["slick-active"],style:(0,r.Z)((0,r.Z)({outline:"none"},p.props.style||{}),h),onClick:function(t){p.props&&p.props.onClick&&p.props.onClick(t),e.focusOnSelect&&e.focusOnSelect(f)}})),e.infinite&&!1===e.fade){var y=l-d;y<=Y(e)&&l!==e.slidesToShow&&((t=-y)>=a&&(p=c),g=U((0,r.Z)((0,r.Z)({},e),{},{index:t})),i.push(u.cloneElement(p,{key:"precloned"+V(p,t),"data-index":t,tabIndex:"-1",className:S()(g,v),"aria-hidden":!g["slick-active"],style:(0,r.Z)((0,r.Z)({},p.props.style||{}),h),onClick:function(t){p.props&&p.props.onClick&&p.props.onClick(t),e.focusOnSelect&&e.focusOnSelect(f)}}))),l!==e.slidesToShow&&((t=l+d)<s&&(p=c),g=U((0,r.Z)((0,r.Z)({},e),{},{index:t})),o.push(u.cloneElement(p,{key:"postcloned"+V(p,t),"data-index":t,tabIndex:"-1",className:S()(g,v),"aria-hidden":!g["slick-active"],style:(0,r.Z)((0,r.Z)({},p.props.style||{}),h),onClick:function(t){p.props&&p.props.onClick&&p.props.onClick(t),e.focusOnSelect&&e.focusOnSelect(f)}})))}}),e.rtl)?i.concat(n,o).reverse():i.concat(n,o)},Q=function(e){(0,s.Z)(n,e);var t=(0,c.Z)(n);function n(){var e;(0,o.Z)(this,n);for(var i=arguments.length,r=Array(i),l=0;l<i;l++)r[l]=arguments[l];return e=t.call.apply(t,[this].concat(r)),(0,d.Z)((0,a.Z)(e),"node",null),(0,d.Z)((0,a.Z)(e),"handleRef",function(t){e.node=t}),e}return(0,l.Z)(n,[{key:"render",value:function(){var e=J(this.props),t=this.props,n=t.onMouseEnter,r=t.onMouseOver,o=t.onMouseLeave;return u.createElement("div",(0,i.Z)({ref:this.handleRef,className:"slick-track",style:this.props.trackStyle},{onMouseEnter:n,onMouseOver:r,onMouseLeave:o}),e)}}]),n}(u.PureComponent),ee=function(e){(0,s.Z)(n,e);var t=(0,c.Z)(n);function n(){return(0,o.Z)(this,n),t.apply(this,arguments)}return(0,l.Z)(n,[{key:"clickHandler",value:function(e,t){t.preventDefault(),this.props.clickHandler(e)}},{key:"render",value:function(){for(var e,t=this.props,n=t.onMouseEnter,i=t.onMouseOver,o=t.onMouseLeave,l=t.infinite,a=t.slidesToScroll,s=t.slidesToShow,c=t.slideCount,d=t.currentSlide,p=(e={slideCount:c,slidesToScroll:a,slidesToShow:s,infinite:l}).infinite?Math.ceil(e.slideCount/e.slidesToScroll):Math.ceil((e.slideCount-e.slidesToShow)/e.slidesToScroll)+1,f=[],h=0;h<p;h++){var v=(h+1)*a-1,g=l?v:y(v,0,c-1),k=g-(a-1),Z=l?k:y(k,0,c-1),m=S()({"slick-active":l?d>=Z&&d<=g:d===Z}),w={message:"dots",index:h,slidesToScroll:a,currentSlide:d},b=this.clickHandler.bind(this,w);f=f.concat(u.createElement("li",{key:h,className:m},u.cloneElement(this.props.customPaging(h),{onClick:b})))}return u.cloneElement(this.props.appendDots(f),(0,r.Z)({className:this.props.dotsClass},{onMouseEnter:n,onMouseOver:i,onMouseLeave:o}))}}]),n}(u.PureComponent),et=function(e){(0,s.Z)(n,e);var t=(0,c.Z)(n);function n(){return(0,o.Z)(this,n),t.apply(this,arguments)}return(0,l.Z)(n,[{key:"clickHandler",value:function(e,t){t&&t.preventDefault(),this.props.clickHandler(e,t)}},{key:"render",value:function(){var e={"slick-arrow":!0,"slick-prev":!0},t=this.clickHandler.bind(this,{message:"previous"});!this.props.infinite&&(0===this.props.currentSlide||this.props.slideCount<=this.props.slidesToShow)&&(e["slick-disabled"]=!0,t=null);var n={key:"0","data-role":"none",className:S()(e),style:{display:"block"},onClick:t},o={currentSlide:this.props.currentSlide,slideCount:this.props.slideCount};return this.props.prevArrow?u.cloneElement(this.props.prevArrow,(0,r.Z)((0,r.Z)({},n),o)):u.createElement("button",(0,i.Z)({key:"0",type:"button"},n)," ","Previous")}}]),n}(u.PureComponent),en=function(e){(0,s.Z)(n,e);var t=(0,c.Z)(n);function n(){return(0,o.Z)(this,n),t.apply(this,arguments)}return(0,l.Z)(n,[{key:"clickHandler",value:function(e,t){t&&t.preventDefault(),this.props.clickHandler(e,t)}},{key:"render",value:function(){var e={"slick-arrow":!0,"slick-next":!0},t=this.clickHandler.bind(this,{message:"next"});E(this.props)||(e["slick-disabled"]=!0,t=null);var n={key:"1","data-role":"none",className:S()(e),style:{display:"block"},onClick:t},o={currentSlide:this.props.currentSlide,slideCount:this.props.slideCount};return this.props.nextArrow?u.cloneElement(this.props.nextArrow,(0,r.Z)((0,r.Z)({},n),o)):u.createElement("button",(0,i.Z)({key:"1",type:"button"},n)," ","Next")}}]),n}(u.PureComponent),ei=n(91033),er=["animating"],eo=function(e){(0,s.Z)(n,e);var t=(0,c.Z)(n);function n(e){(0,o.Z)(this,n),l=t.call(this,e),(0,d.Z)((0,a.Z)(l),"listRefHandler",function(e){return l.list=e}),(0,d.Z)((0,a.Z)(l),"trackRefHandler",function(e){return l.track=e}),(0,d.Z)((0,a.Z)(l),"adaptHeight",function(){if(l.props.adaptiveHeight&&l.list){var e=l.list.querySelector('[data-index="'.concat(l.state.currentSlide,'"]'));l.list.style.height=C(e)+"px"}}),(0,d.Z)((0,a.Z)(l),"componentDidMount",function(){if(l.props.onInit&&l.props.onInit(),l.props.lazyLoad){var e=Z((0,r.Z)((0,r.Z)({},l.props),l.state));e.length>0&&(l.setState(function(t){return{lazyLoadedList:t.lazyLoadedList.concat(e)}}),l.props.onLazyLoad&&l.props.onLazyLoad(e))}var t=(0,r.Z)({listRef:l.list,trackRef:l.track},l.props);l.updateState(t,!0,function(){l.adaptHeight(),l.props.autoplay&&l.autoPlay("playing")}),"progressive"===l.props.lazyLoad&&(l.lazyLoadTimer=setInterval(l.progressiveLazyLoad,1e3)),l.ro=new ei.Z(function(){l.state.animating?(l.onWindowResized(!1),l.callbackTimers.push(setTimeout(function(){return l.onWindowResized()},l.props.speed))):l.onWindowResized()}),l.ro.observe(l.list),document.querySelectorAll&&Array.prototype.forEach.call(document.querySelectorAll(".slick-slide"),function(e){e.onfocus=l.props.pauseOnFocus?l.onSlideFocus:null,e.onblur=l.props.pauseOnFocus?l.onSlideBlur:null}),window.addEventListener?window.addEventListener("resize",l.onWindowResized):window.attachEvent("onresize",l.onWindowResized)}),(0,d.Z)((0,a.Z)(l),"componentWillUnmount",function(){l.animationEndCallback&&clearTimeout(l.animationEndCallback),l.lazyLoadTimer&&clearInterval(l.lazyLoadTimer),l.callbackTimers.length&&(l.callbackTimers.forEach(function(e){return clearTimeout(e)}),l.callbackTimers=[]),window.addEventListener?window.removeEventListener("resize",l.onWindowResized):window.detachEvent("onresize",l.onWindowResized),l.autoplayTimer&&clearInterval(l.autoplayTimer),l.ro.disconnect()}),(0,d.Z)((0,a.Z)(l),"componentDidUpdate",function(e){if(l.checkImagesLoad(),l.props.onReInit&&l.props.onReInit(),l.props.lazyLoad){var t=Z((0,r.Z)((0,r.Z)({},l.props),l.state));t.length>0&&(l.setState(function(e){return{lazyLoadedList:e.lazyLoadedList.concat(t)}}),l.props.onLazyLoad&&l.props.onLazyLoad(t))}l.adaptHeight();var n=(0,r.Z)((0,r.Z)({listRef:l.list,trackRef:l.track},l.props),l.state),i=l.didPropsChange(e);i&&l.updateState(n,i,function(){l.state.currentSlide>=u.Children.count(l.props.children)&&l.changeSlide({message:"index",index:u.Children.count(l.props.children)-l.props.slidesToShow,currentSlide:l.state.currentSlide}),(e.autoplay!==l.props.autoplay||e.autoplaySpeed!==l.props.autoplaySpeed)&&(!e.autoplay&&l.props.autoplay?l.autoPlay("playing"):l.props.autoplay?l.autoPlay("update"):l.pause("paused"))})}),(0,d.Z)((0,a.Z)(l),"onWindowResized",function(e){l.debouncedResize&&l.debouncedResize.cancel(),l.debouncedResize=(0,v.D)(50,function(){return l.resizeWindow(e)}),l.debouncedResize()}),(0,d.Z)((0,a.Z)(l),"resizeWindow",function(){var e=!(arguments.length>0)||void 0===arguments[0]||arguments[0];if(l.track&&l.track.node){var t=(0,r.Z)((0,r.Z)({listRef:l.list,trackRef:l.track},l.props),l.state);l.updateState(t,e,function(){l.props.autoplay?l.autoPlay("update"):l.pause("paused")}),l.setState({animating:!1}),clearTimeout(l.animationEndCallback),delete l.animationEndCallback}}),(0,d.Z)((0,a.Z)(l),"updateState",function(e,t,n){var i=z(e),o=X(e=(0,r.Z)((0,r.Z)((0,r.Z)({},e),i),{},{slideIndex:i.currentSlide})),a=D(e=(0,r.Z)((0,r.Z)({},e),{},{left:o}));(t||u.Children.count(l.props.children)!==u.Children.count(e.children))&&(i.trackStyle=a),l.setState(i,n)}),(0,d.Z)((0,a.Z)(l),"ssrInit",function(){if(l.props.variableWidth){var e=0,t=0,n=[],i=Y((0,r.Z)((0,r.Z)((0,r.Z)({},l.props),l.state),{},{slideCount:l.props.children.length})),o=$((0,r.Z)((0,r.Z)((0,r.Z)({},l.props),l.state),{},{slideCount:l.props.children.length}));l.props.children.forEach(function(t){n.push(t.props.style.width),e+=t.props.style.width});for(var a=0;a<i;a++)t+=n[n.length-1-a],e+=n[n.length-1-a];for(var s=0;s<o;s++)e+=n[s];for(var c=0;c<l.state.currentSlide;c++)t+=n[c];var d={width:e+"px",left:-t+"px"};if(l.props.centerMode){var p="".concat(n[l.state.currentSlide],"px");d.left="calc(".concat(d.left," + (100% - ").concat(p,") / 2 ) ")}return{trackStyle:d}}var f=u.Children.count(l.props.children),h=(0,r.Z)((0,r.Z)((0,r.Z)({},l.props),l.state),{},{slideCount:f}),v=Y(h)+$(h)+f,g=100/l.props.slidesToShow*v,S=100/v,y=-S*(Y(h)+l.state.currentSlide)*g/100;return l.props.centerMode&&(y+=(100-S*g/100)/2),{slideWidth:S+"%",trackStyle:{width:g+"%",left:y+"%"}}}),(0,d.Z)((0,a.Z)(l),"checkImagesLoad",function(){var e=l.list&&l.list.querySelectorAll&&l.list.querySelectorAll(".slick-slide img")||[],t=e.length,n=0;Array.prototype.forEach.call(e,function(e){var i=function(){return++n&&n>=t&&l.onWindowResized()};if(e.onclick){var r=e.onclick;e.onclick=function(t){r(t),e.parentNode.focus()}}else e.onclick=function(){return e.parentNode.focus()};e.onload||(l.props.lazyLoad?e.onload=function(){l.adaptHeight(),l.callbackTimers.push(setTimeout(l.onWindowResized,l.props.speed))}:(e.onload=i,e.onerror=function(){i(),l.props.onLazyLoadError&&l.props.onLazyLoadError()}))})}),(0,d.Z)((0,a.Z)(l),"progressiveLazyLoad",function(){for(var e=[],t=(0,r.Z)((0,r.Z)({},l.props),l.state),n=l.state.currentSlide;n<l.state.slideCount+$(t);n++)if(0>l.state.lazyLoadedList.indexOf(n)){e.push(n);break}for(var i=l.state.currentSlide-1;i>=-Y(t);i--)if(0>l.state.lazyLoadedList.indexOf(i)){e.push(i);break}e.length>0?(l.setState(function(t){return{lazyLoadedList:t.lazyLoadedList.concat(e)}}),l.props.onLazyLoad&&l.props.onLazyLoad(e)):l.lazyLoadTimer&&(clearInterval(l.lazyLoadTimer),delete l.lazyLoadTimer)}),(0,d.Z)((0,a.Z)(l),"slideHandler",function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=l.props,i=n.asNavFor,o=n.beforeChange,a=n.onLazyLoad,s=n.speed,c=n.afterChange,d=l.state.currentSlide,u=H((0,r.Z)((0,r.Z)((0,r.Z)({index:e},l.props),l.state),{},{trackRef:l.track,useCSS:l.props.useCSS&&!t})),p=u.state,h=u.nextState;if(p){o&&o(d,p.currentSlide);var v=p.lazyLoadedList.filter(function(e){return 0>l.state.lazyLoadedList.indexOf(e)});a&&v.length>0&&a(v),!l.props.waitForAnimate&&l.animationEndCallback&&(clearTimeout(l.animationEndCallback),c&&c(d),delete l.animationEndCallback),l.setState(p,function(){i&&l.asNavForIndex!==e&&(l.asNavForIndex=e,i.innerSlider.slideHandler(e)),h&&(l.animationEndCallback=setTimeout(function(){var e=h.animating,t=(0,f.Z)(h,er);l.setState(t,function(){l.callbackTimers.push(setTimeout(function(){return l.setState({animating:e})},10)),c&&c(p.currentSlide),delete l.animationEndCallback})},s))})}}),(0,d.Z)((0,a.Z)(l),"changeSlide",function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=W((0,r.Z)((0,r.Z)({},l.props),l.state),e);if((0===n||n)&&(!0===t?l.slideHandler(n,t):l.slideHandler(n),l.props.autoplay&&l.autoPlay("update"),l.props.focusOnSelect)){var i=l.list.querySelectorAll(".slick-current");i[0]&&i[0].focus()}}),(0,d.Z)((0,a.Z)(l),"clickHandler",function(e){!1===l.clickable&&(e.stopPropagation(),e.preventDefault()),l.clickable=!0}),(0,d.Z)((0,a.Z)(l),"keyHandler",function(e){var t,n,i=(t=l.props.accessibility,n=l.props.rtl,e.target.tagName.match("TEXTAREA|INPUT|SELECT")||!t?"":37===e.keyCode?n?"next":"previous":39===e.keyCode?n?"previous":"next":"");""!==i&&l.changeSlide({message:i})}),(0,d.Z)((0,a.Z)(l),"selectHandler",function(e){l.changeSlide(e)}),(0,d.Z)((0,a.Z)(l),"disableBodyScroll",function(){window.ontouchmove=function(e){(e=e||window.event).preventDefault&&e.preventDefault(),e.returnValue=!1}}),(0,d.Z)((0,a.Z)(l),"enableBodyScroll",function(){window.ontouchmove=null}),(0,d.Z)((0,a.Z)(l),"swipeStart",function(e){l.props.verticalSwiping&&l.disableBodyScroll();var t,n,i=(t=l.props.swipe,n=l.props.draggable,("IMG"===e.target.tagName&&k(e),t&&(n||-1===e.type.indexOf("mouse")))?{dragging:!0,touchObject:{startX:e.touches?e.touches[0].pageX:e.clientX,startY:e.touches?e.touches[0].pageY:e.clientY,curX:e.touches?e.touches[0].pageX:e.clientX,curY:e.touches?e.touches[0].pageY:e.clientY}}:"");""!==i&&l.setState(i)}),(0,d.Z)((0,a.Z)(l),"swipeMove",function(e){var t=O(e,(0,r.Z)((0,r.Z)((0,r.Z)({},l.props),l.state),{},{trackRef:l.track,listRef:l.list,slideIndex:l.state.currentSlide}));t&&(t.swiping&&(l.clickable=!1),l.setState(t))}),(0,d.Z)((0,a.Z)(l),"swipeEnd",function(e){var t=I(e,(0,r.Z)((0,r.Z)((0,r.Z)({},l.props),l.state),{},{trackRef:l.track,listRef:l.list,slideIndex:l.state.currentSlide}));if(t){var n=t.triggerSlideHandler;delete t.triggerSlideHandler,l.setState(t),void 0!==n&&(l.slideHandler(n),l.props.verticalSwiping&&l.enableBodyScroll())}}),(0,d.Z)((0,a.Z)(l),"touchEnd",function(e){l.swipeEnd(e),l.clickable=!0}),(0,d.Z)((0,a.Z)(l),"slickPrev",function(){l.callbackTimers.push(setTimeout(function(){return l.changeSlide({message:"previous"})},0))}),(0,d.Z)((0,a.Z)(l),"slickNext",function(){l.callbackTimers.push(setTimeout(function(){return l.changeSlide({message:"next"})},0))}),(0,d.Z)((0,a.Z)(l),"slickGoTo",function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1];if(isNaN(e=Number(e)))return"";l.callbackTimers.push(setTimeout(function(){return l.changeSlide({message:"index",index:e,currentSlide:l.state.currentSlide},t)},0))}),(0,d.Z)((0,a.Z)(l),"play",function(){var e;if(l.props.rtl)e=l.state.currentSlide-l.props.slidesToScroll;else{if(!E((0,r.Z)((0,r.Z)({},l.props),l.state)))return!1;e=l.state.currentSlide+l.props.slidesToScroll}l.slideHandler(e)}),(0,d.Z)((0,a.Z)(l),"autoPlay",function(e){l.autoplayTimer&&clearInterval(l.autoplayTimer);var t=l.state.autoplaying;if("update"===e){if("hovered"===t||"focused"===t||"paused"===t)return}else if("leave"===e){if("paused"===t||"focused"===t)return}else if("blur"===e&&("paused"===t||"hovered"===t))return;l.autoplayTimer=setInterval(l.play,l.props.autoplaySpeed+50),l.setState({autoplaying:"playing"})}),(0,d.Z)((0,a.Z)(l),"pause",function(e){l.autoplayTimer&&(clearInterval(l.autoplayTimer),l.autoplayTimer=null);var t=l.state.autoplaying;"paused"===e?l.setState({autoplaying:"paused"}):"focused"===e?("hovered"===t||"playing"===t)&&l.setState({autoplaying:"focused"}):"playing"===t&&l.setState({autoplaying:"hovered"})}),(0,d.Z)((0,a.Z)(l),"onDotsOver",function(){return l.props.autoplay&&l.pause("hovered")}),(0,d.Z)((0,a.Z)(l),"onDotsLeave",function(){return l.props.autoplay&&"hovered"===l.state.autoplaying&&l.autoPlay("leave")}),(0,d.Z)((0,a.Z)(l),"onTrackOver",function(){return l.props.autoplay&&l.pause("hovered")}),(0,d.Z)((0,a.Z)(l),"onTrackLeave",function(){return l.props.autoplay&&"hovered"===l.state.autoplaying&&l.autoPlay("leave")}),(0,d.Z)((0,a.Z)(l),"onSlideFocus",function(){return l.props.autoplay&&l.pause("focused")}),(0,d.Z)((0,a.Z)(l),"onSlideBlur",function(){return l.props.autoplay&&"focused"===l.state.autoplaying&&l.autoPlay("blur")}),(0,d.Z)((0,a.Z)(l),"render",function(){var e,t,n,o=S()("slick-slider",l.props.className,{"slick-vertical":l.props.vertical,"slick-initialized":!0}),a=(0,r.Z)((0,r.Z)({},l.props),l.state),s=M(a,["fade","cssEase","speed","infinite","centerMode","focusOnSelect","currentSlide","lazyLoad","lazyLoadedList","rtl","slideWidth","slideHeight","listHeight","vertical","slidesToShow","slidesToScroll","slideCount","trackStyle","variableWidth","unslick","centerPadding","targetSlide","useCSS"]),c=l.props.pauseOnHover;if(s=(0,r.Z)((0,r.Z)({},s),{},{onMouseEnter:c?l.onTrackOver:null,onMouseLeave:c?l.onTrackLeave:null,onMouseOver:c?l.onTrackOver:null,focusOnSelect:l.props.focusOnSelect&&l.clickable?l.selectHandler:null}),!0===l.props.dots&&l.state.slideCount>=l.props.slidesToShow){var d=M(a,["dotsClass","slideCount","slidesToShow","currentSlide","slidesToScroll","clickHandler","children","customPaging","infinite","appendDots"]),p=l.props.pauseOnDotsHover;d=(0,r.Z)((0,r.Z)({},d),{},{clickHandler:l.changeSlide,onMouseEnter:p?l.onDotsLeave:null,onMouseOver:p?l.onDotsOver:null,onMouseLeave:p?l.onDotsLeave:null}),e=u.createElement(ee,d)}var f=M(a,["infinite","centerMode","currentSlide","slideCount","slidesToShow","prevArrow","nextArrow"]);f.clickHandler=l.changeSlide,l.props.arrows&&(t=u.createElement(et,f),n=u.createElement(en,f));var h=null;l.props.vertical&&(h={height:l.state.listHeight});var v=null;!1===l.props.vertical?!0===l.props.centerMode&&(v={padding:"0px "+l.props.centerPadding}):!0===l.props.centerMode&&(v={padding:l.props.centerPadding+" 0px"});var g=(0,r.Z)((0,r.Z)({},h),v),y=l.props.touchMove,k={className:"slick-list",style:g,onClick:l.clickHandler,onMouseDown:y?l.swipeStart:null,onMouseMove:l.state.dragging&&y?l.swipeMove:null,onMouseUp:y?l.swipeEnd:null,onMouseLeave:l.state.dragging&&y?l.swipeEnd:null,onTouchStart:y?l.swipeStart:null,onTouchMove:l.state.dragging&&y?l.swipeMove:null,onTouchEnd:y?l.touchEnd:null,onTouchCancel:l.state.dragging&&y?l.swipeEnd:null,onKeyDown:l.props.accessibility?l.keyHandler:null},Z={className:o,dir:"ltr",style:l.props.style};return l.props.unslick&&(k={className:"slick-list"},Z={className:o}),u.createElement("div",Z,l.props.unslick?"":t,u.createElement("div",(0,i.Z)({ref:l.listRefHandler},k),u.createElement(Q,(0,i.Z)({ref:l.trackRefHandler},s),l.props.children)),l.props.unslick?"":n,l.props.unslick?"":e)}),l.list=null,l.track=null,l.state=(0,r.Z)((0,r.Z)({},h),{},{currentSlide:l.props.initialSlide,slideCount:u.Children.count(l.props.children)}),l.callbackTimers=[],l.clickable=!0,l.debouncedResize=null;var l,s=l.ssrInit();return l.state=(0,r.Z)((0,r.Z)({},l.state),s),l}return(0,l.Z)(n,[{key:"didPropsChange",value:function(e){for(var t=!1,n=0,i=Object.keys(this.props);n<i.length;n++){var r=i[n];if(!e.hasOwnProperty(r)||"object"!==(0,p.Z)(e[r])&&"function"!=typeof e[r]&&e[r]!==this.props[r]){t=!0;break}}return t||u.Children.count(this.props.children)!==u.Children.count(e.children)}}]),n}(u.Component),el=n(80973),ea=n.n(el),es={accessibility:!0,adaptiveHeight:!1,afterChange:null,appendDots:function(e){return u.createElement("ul",{style:{display:"block"}},e)},arrows:!0,autoplay:!1,autoplaySpeed:3e3,beforeChange:null,centerMode:!1,centerPadding:"50px",className:"",cssEase:"ease",customPaging:function(e){return u.createElement("button",null,e+1)},dots:!1,dotsClass:"slick-dots",draggable:!0,easing:"linear",edgeFriction:.35,fade:!1,focusOnSelect:!1,infinite:!0,initialSlide:0,lazyLoad:null,nextArrow:null,onEdge:null,onInit:null,onLazyLoadError:null,onReInit:null,pauseOnDotsHover:!1,pauseOnFocus:!1,pauseOnHover:!0,prevArrow:null,responsive:null,rows:1,rtl:!1,slide:"div",slidesPerRow:1,slidesToScroll:1,slidesToShow:1,speed:500,swipe:!0,swipeEvent:null,swipeToSlide:!1,touchMove:!0,touchThreshold:5,useCSS:!0,useTransform:!0,variableWidth:!1,vertical:!1,waitForAnimate:!0},ec=function(e){(0,s.Z)(n,e);var t=(0,c.Z)(n);function n(e){var i;return(0,o.Z)(this,n),i=t.call(this,e),(0,d.Z)((0,a.Z)(i),"innerSliderRefHandler",function(e){return i.innerSlider=e}),(0,d.Z)((0,a.Z)(i),"slickPrev",function(){return i.innerSlider.slickPrev()}),(0,d.Z)((0,a.Z)(i),"slickNext",function(){return i.innerSlider.slickNext()}),(0,d.Z)((0,a.Z)(i),"slickGoTo",function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1];return i.innerSlider.slickGoTo(e,t)}),(0,d.Z)((0,a.Z)(i),"slickPause",function(){return i.innerSlider.pause("paused")}),(0,d.Z)((0,a.Z)(i),"slickPlay",function(){return i.innerSlider.autoPlay("play")}),i.state={breakpoint:null},i._responsiveMediaHandlers=[],i}return(0,l.Z)(n,[{key:"media",value:function(e,t){var n=window.matchMedia(e),i=function(e){e.matches&&t()};n.addListener(i),i(n),this._responsiveMediaHandlers.push({mql:n,query:e,listener:i})}},{key:"componentDidMount",value:function(){var e=this;if(this.props.responsive){var t=this.props.responsive.map(function(e){return e.breakpoint});t.sort(function(e,t){return e-t}),t.forEach(function(n,i){var r;r=0===i?ea()({minWidth:0,maxWidth:n}):ea()({minWidth:t[i-1]+1,maxWidth:n}),G()&&e.media(r,function(){e.setState({breakpoint:n})})});var n=ea()({minWidth:t.slice(-1)[0]});G()&&this.media(n,function(){e.setState({breakpoint:null})})}}},{key:"componentWillUnmount",value:function(){this._responsiveMediaHandlers.forEach(function(e){e.mql.removeListener(e.listener)})}},{key:"render",value:function(){var e,t,n=this;(e=this.state.breakpoint?"unslick"===(t=this.props.responsive.filter(function(e){return e.breakpoint===n.state.breakpoint}))[0].settings?"unslick":(0,r.Z)((0,r.Z)((0,r.Z)({},es),this.props),t[0].settings):(0,r.Z)((0,r.Z)({},es),this.props)).centerMode&&(e.slidesToScroll,e.slidesToScroll=1),e.fade&&(e.slidesToShow,e.slidesToScroll,e.slidesToShow=1,e.slidesToScroll=1);var o=u.Children.toArray(this.props.children);o=o.filter(function(e){return"string"==typeof e?!!e.trim():!!e}),e.variableWidth&&(e.rows>1||e.slidesPerRow>1)&&(console.warn("variableWidth is not supported in case of rows > 1 or slidesPerRow > 1"),e.variableWidth=!1);for(var l=[],a=null,s=0;s<o.length;s+=e.rows*e.slidesPerRow){for(var c=[],d=s;d<s+e.rows*e.slidesPerRow;d+=e.slidesPerRow){for(var p=[],f=d;f<d+e.slidesPerRow&&(e.variableWidth&&o[f].props.style&&(a=o[f].props.style.width),!(f>=o.length));f+=1)p.push(u.cloneElement(o[f],{key:100*s+10*d+f,tabIndex:-1,style:{width:"".concat(100/e.slidesPerRow,"%"),display:"inline-block"}}));c.push(u.createElement("div",{key:10*s+d},p))}e.variableWidth?l.push(u.createElement("div",{key:s,style:{width:a}},c)):l.push(u.createElement("div",{key:s},c))}if("unslick"===e){var h="regular slider "+(this.props.className||"");return u.createElement("div",{className:h},o)}return l.length<=e.slidesToShow&&(e.unslick=!0),u.createElement(eo,(0,i.Z)({style:this.props.style,ref:this.innerSliderRefHandler},e),l)}}]),n}(u.Component),ed=n(53124),eu=n(67968),ep=n(45503),ef=n(14747);let eh=e=>{let{componentCls:t,antCls:n,carouselArrowSize:i,carouselDotOffset:r,marginXXS:o}=e,l=-(1.25*i);return{[t]:Object.assign(Object.assign({},(0,ef.Wf)(e)),{".slick-slider":{position:"relative",display:"block",boxSizing:"border-box",touchAction:"pan-y",WebkitTouchCallout:"none",WebkitTapHighlightColor:"transparent",".slick-track, .slick-list":{transform:"translate3d(0, 0, 0)",touchAction:"pan-y"}},".slick-list":{position:"relative",display:"block",margin:0,padding:0,overflow:"hidden","&:focus":{outline:"none"},"&.dragging":{cursor:"pointer"},".slick-slide":{pointerEvents:"none",[`input${n}-radio-input, input${n}-checkbox-input`]:{visibility:"hidden"},"&.slick-active":{pointerEvents:"auto",[`input${n}-radio-input, input${n}-checkbox-input`]:{visibility:"visible"}},"> div > div":{verticalAlign:"bottom"}}},".slick-track":{position:"relative",top:0,insetInlineStart:0,display:"block","&::before, &::after":{display:"table",content:'""'},"&::after":{clear:"both"}},".slick-slide":{display:"none",float:"left",height:"100%",minHeight:1,img:{display:"block"},"&.dragging img":{pointerEvents:"none"}},".slick-initialized .slick-slide":{display:"block"},".slick-vertical .slick-slide":{display:"block",height:"auto"},".slick-arrow.slick-hidden":{display:"none"},".slick-prev, .slick-next":{position:"absolute",top:"50%",display:"block",width:i,height:i,marginTop:-i/2,padding:0,color:"transparent",fontSize:0,lineHeight:0,background:"transparent",border:0,outline:"none",cursor:"pointer","&:hover, &:focus":{color:"transparent",background:"transparent",outline:"none","&::before":{opacity:1}},"&.slick-disabled::before":{opacity:.25}},".slick-prev":{insetInlineStart:l,"&::before":{content:'"←"'}},".slick-next":{insetInlineEnd:l,"&::before":{content:'"→"'}},".slick-dots":{position:"absolute",insetInlineEnd:0,bottom:0,insetInlineStart:0,zIndex:15,display:"flex !important",justifyContent:"center",paddingInlineStart:0,listStyle:"none","&-bottom":{bottom:r},"&-top":{top:r,bottom:"auto"},li:{position:"relative",display:"inline-block",flex:"0 1 auto",boxSizing:"content-box",width:e.dotWidth,height:e.dotHeight,marginInline:o,padding:0,textAlign:"center",textIndent:-999,verticalAlign:"top",transition:`all ${e.motionDurationSlow}`,button:{position:"relative",display:"block",width:"100%",height:e.dotHeight,padding:0,color:"transparent",fontSize:0,background:e.colorBgContainer,border:0,borderRadius:1,outline:"none",cursor:"pointer",opacity:.3,transition:`all ${e.motionDurationSlow}`,"&: hover, &:focus":{opacity:.75},"&::after":{position:"absolute",inset:-o,content:'""'}},"&.slick-active":{width:e.dotWidthActive,"& button":{background:e.colorBgContainer,opacity:1},"&: hover, &:focus":{opacity:1}}}}})}},ev=e=>{let{componentCls:t,carouselDotOffset:n,marginXXS:i}=e,r={width:e.dotHeight,height:e.dotWidth};return{[`${t}-vertical`]:{".slick-dots":{top:"50%",bottom:"auto",flexDirection:"column",width:e.dotHeight,height:"auto",margin:0,transform:"translateY(-50%)","&-left":{insetInlineEnd:"auto",insetInlineStart:n},"&-right":{insetInlineEnd:n,insetInlineStart:"auto"},li:Object.assign(Object.assign({},r),{margin:`${i}px 0`,verticalAlign:"baseline",button:r,"&.slick-active":Object.assign(Object.assign({},r),{button:r})})}}}},eg=e=>{let{componentCls:t}=e;return[{[`${t}-rtl`]:{direction:"rtl",".slick-dots":{[`${t}-rtl&`]:{flexDirection:"row-reverse"}}}},{[`${t}-vertical`]:{".slick-dots":{[`${t}-rtl&`]:{flexDirection:"column"}}}}]};var eS=(0,eu.Z)("Carousel",e=>{let{controlHeightLG:t,controlHeightSM:n}=e,i=(0,ep.TS)(e,{carouselArrowSize:t/2,carouselDotOffset:n/2});return[eh(i),ev(i),eg(i)]},{dotWidth:16,dotHeight:3,dotWidthActive:24}),ey=function(e,t){var n={};for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&0>t.indexOf(i)&&(n[i]=e[i]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols)for(var r=0,i=Object.getOwnPropertySymbols(e);r<i.length;r++)0>t.indexOf(i[r])&&Object.prototype.propertyIsEnumerable.call(e,i[r])&&(n[i[r]]=e[i[r]]);return n};let ek=u.forwardRef((e,t)=>{var{dots:n=!0,arrows:i=!1,draggable:r=!1,waitForAnimate:o=!1,dotPosition:l="bottom",vertical:a="left"===l||"right"===l,rootClassName:s}=e,c=ey(e,["dots","arrows","draggable","waitForAnimate","dotPosition","vertical","rootClassName"]);let{getPrefixCls:d,direction:p}=u.useContext(ed.E_),f=u.useRef(),h=function(e){let t=arguments.length>1&&void 0!==arguments[1]&&arguments[1];f.current.slickGoTo(e,t)};u.useImperativeHandle(t,()=>({goTo:h,autoPlay:f.current.innerSlider.autoPlay,innerSlider:f.current.innerSlider,prev:f.current.slickPrev,next:f.current.slickNext}),[f.current]);let v=u.useRef(u.Children.count(c.children));u.useEffect(()=>{v.current!==u.Children.count(c.children)&&(h(c.initialSlide||0,!1),v.current=u.Children.count(c.children))},[c.children]);let g=Object.assign({vertical:a},c);"fade"===g.effect&&(g.fade=!0);let y=d("carousel",g.prefixCls),k="slick-dots",Z=!!n,m=S()(k,`${k}-${l}`,"boolean"!=typeof n&&(null==n?void 0:n.className)),[w,b]=eS(y),T=S()(y,{[`${y}-rtl`]:"rtl"===p,[`${y}-vertical`]:g.vertical},b,s);return w(u.createElement("div",{className:T},u.createElement(ec,Object.assign({ref:f},g,{dots:Z,dotsClass:m,arrows:i,draggable:r,waitForAnimate:o}))))});var eZ=ek},80973:function(e,t,n){var i=n(71169),r=function(e){var t="",n=Object.keys(e);return n.forEach(function(r,o){var l,a=e[r];l=r=i(r),/[height|width]$/.test(l)&&"number"==typeof a&&(a+="px"),!0===a?t+=r:!1===a?t+="not "+r:t+="("+r+": "+a+")",o<n.length-1&&(t+=" and ")}),t};e.exports=function(e){var t="";return"string"==typeof e?e:e instanceof Array?(e.forEach(function(n,i){t+=r(n),i<e.length-1&&(t+=", ")}),t):r(e)}},71169:function(e){e.exports=function(e){return e.replace(/[A-Z]/g,function(e){return"-"+e.toLowerCase()}).toLowerCase()}}}]);