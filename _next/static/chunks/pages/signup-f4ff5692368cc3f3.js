(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[7616],{47805:function(e,r,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/signup",function(){return n(17451)}])},15479:function(e,r,n){"use strict";n.d(r,{JT:function(){return i},ah:function(){return a},nq:function(){return s},tE:function(){return o},yL:function(){return t}});n(83454).env.AUTH_SECRET||new Array(33).join("a");var t=6,s=16,i=!0,o=!0,a=!0},87492:function(e,r,n){"use strict";n.d(r,{R:function(){return f},_:function(){return h}});var t=n(47568),s=n(26042),i=n(69396),o=n(20414),a=n(59134),u=n.n(a),l=n(83454),c=l.env.PORT?parseInt(l.env.PORT):3e3,d=u()()?"http://localhost:"+c:"",h=function(){var e=(0,t.Z)((function(e,r){var n,t,i,a;return(0,o.__generator)(this,(function(o){switch(o.label){case 0:return[4,fetch(d+e,(0,s.Z)({method:r?"POST":"GET",headers:{accept:"application/json","Content-Type":"application/json"}},r&&{body:r}))];case 1:return n=o.sent(),t=n.headers.get("Content-Type"),n.ok?[3,4]:(i=new Error("An error occured while fetching data."),(a=null===t||void 0===t?void 0:t.includes("application/json"))?[4,n.json()]:[3,3]);case 2:a=o.sent(),o.label=3;case 3:throw i.info=a,i.status=n.status,i;case 4:return[2,n.json()]}}))}));return function(r,n){return e.apply(this,arguments)}}(),f=function(){var e=(0,t.Z)((function(e,r){var n,t,a,u;return(0,o.__generator)(this,(function(o){switch(o.label){case 0:return[4,fetch(d+e,(0,i.Z)((0,s.Z)({},r),{method:r&&r.method||"GET",headers:(0,i.Z)((0,s.Z)({},r&&r.headers),{"Content-Type":"application/json"})}))];case 1:return n=o.sent(),t=n.headers.get("Content-Type"),n.ok?[3,4]:(a=new Error("An error occured while fetching data."),(u=null===t||void 0===t?void 0:t.includes("application/json"))?[4,n.json()]:[3,3]);case 2:u=o.sent(),o.label=3;case 3:throw a.info=u,a.status=n.status,a;case 4:return[2,n]}}))}));return function(r,n){return e.apply(this,arguments)}}()},81891:function(e,r,n){"use strict";n.d(r,{H:function(){return a}});var t=n(51438),s=n(28668),i=n(25892),o=n(91224),a=function(e){(0,s.Z)(n,e);var r=(0,o.Z)(n);function n(e){var s;return(0,t.Z)(this,n),(s=r.call(this,e.title)).title=e.title,s.name="APIError",s.render=e.render,s.err=e.err,s.type=e.type||"error",s}return n}((0,i.Z)(Error))},36574:function(e,r,n){"use strict";n.d(r,{Z:function(){return d}});var t=n(26042),s=n(8100),i=n(67294),o=n(87492),a=n(47568),u=n(20414),l=function(){var e=(0,a.Z)((function(e){return(0,u.__generator)(this,(function(r){switch(r.label){case 0:return[4,(0,o.R)("/api/system",{method:"PUT",body:JSON.stringify(e)})];case 1:return r.sent(),[2]}}))}));return function(r){return e.apply(this,arguments)}}(),c={useSystem:function(){var e=(0,s.ZP)("/api/system",o._),r=e.data,n=e.error,a=e.mutate,u=!r,l=(null===r||void 0===r?void 0:r.system)||{},c=(0,i.useCallback)((function(e){a({system:(0,t.Z)({},l,e)})}),[l,a]);return[l,{mutateSystem:c,errorSystem:n,loadingSystem:u}]},update:l},d=c},67169:function(e,r,n){"use strict";n.d(r,{Z:function(){return y}});var t=n(26042),s=n(8100),i=n(67294),o=n(87492),a=n(69396),u=n(29815),l=n(47568),c=n(20414),d=function(){var e=(0,l.Z)((function(e){return(0,c.__generator)(this,(function(r){switch(r.label){case 0:return[4,(0,o.R)("/api/user",{method:"POST",headers:{Accept:"application/json"},body:JSON.stringify(e)})];case 1:return[2,r.sent().json()]}}))}));return function(r){return e.apply(this,arguments)}}(),h=function(){var e=(0,l.Z)((function(e){return(0,c.__generator)(this,(function(r){switch(r.label){case 0:return[4,(0,o.R)("/api/user",{method:"PUT",body:JSON.stringify(e)})];case 1:return r.sent(),[2]}}))}));return function(r){return e.apply(this,arguments)}}(),f=function(){var e=(0,l.Z)((function(e,r){return(0,c.__generator)(this,(function(n){switch(n.label){case 0:return[4,(0,o.R)("/api/user/"+e,{method:"PUT",body:JSON.stringify(r)})];case 1:return n.sent(),[2]}}))}));return function(r,n){return e.apply(this,arguments)}}(),p=function(){var e=(0,l.Z)((function(){return(0,c.__generator)(this,(function(e){switch(e.label){case 0:return[4,(0,o.R)("/api/user",{method:"DELETE"})];case 1:return e.sent(),[2]}}))}));return function(){return e.apply(this,arguments)}}(),v=function(){var e=(0,l.Z)((function(e){return(0,c.__generator)(this,(function(r){switch(r.label){case 0:return[4,(0,o.R)("/api/user/"+e,{method:"DELETE"})];case 1:return r.sent(),[2]}}))}));return function(r){return e.apply(this,arguments)}}(),m=function(){var e=(0,l.Z)((function(e){return(0,c.__generator)(this,(function(r){switch(r.label){case 0:return[4,(0,o.R)("/api/user/check",{method:"POST",headers:{Accept:"application/json"},body:JSON.stringify(e)})];case 1:return[2,r.sent().json()]}}))}));return function(r){return e.apply(this,arguments)}}(),g={useUser:function(){var e=(0,s.ZP)("/api/user",o._),r=e.data,n=e.error,a=e.mutate,u=!r,l=null===r||void 0===r?void 0:r.user,c=(0,i.useCallback)((function(e){a({user:(0,t.Z)({},l,e)})}),[l,a]),d=(0,i.useCallback)((function(){a({user:void 0})}),[a]);return[l,{mutateUser:c,clearUser:d,errorUser:401===(null===n||void 0===n?void 0:n.status)?void 0:n,loadingUser:401!==(null===n||void 0===n?void 0:n.status)&&u}]},useUsers:function(){var e=(0,s.ZP)("/api/users",o._),r=e.data,n=e.error,l=e.mutate,c=!r,d=(null===r||void 0===r?void 0:r.users)||[],h=(0,i.useCallback)((function(e){var r=(0,u.Z)(d).concat([(0,a.Z)((0,t.Z)({},e),{authorizedplugins:[]})]);l({users:r})}),[d,l]),f=(0,i.useCallback)((function(e){var r=d.filter((function(r){return r.id!==e.id}));l({users:r})}),[d,l]),p=(0,i.useCallback)((function(e){var r=d.map((function(r){return r.id===e.id&&(r=(0,t.Z)({},r,e)),r}));l({users:r})}),[d,l]);return[d,{addOneUser:h,delOneUser:f,mutateOneUser:p,errorUsers:n,loadingUsers:c}]},add:d,update:h,updateById:f,del:p,delById:v,check:m},y=g},51986:function(e,r,n){"use strict";n.d(r,{o:function(){return g}});var t=n(828),s=n(85893),i=n(81579),o=n(69677),a=n(15479),u=n(36574),l="Please enter a password",c=function(e){return"Your password is too small (minimum "+e+" characters)"},d=function(e){return"Your password is too long (maximum "+e+" characters)"},h="Your password must contain a letter",f="Your password must contain a number",p="Your password must contain a symbol",v=function(e,r){return-1!==e.search(r)},m=function(e,r,n){(function(e,r){var n,t;return!(null!==(t=null===e||void 0===e||null===(n=e.password)||void 0===n?void 0:n.requireLetter)&&void 0!==t?t:a.JT)||v(r,/[a-zA-Z]/)})(e,r)||n.push(h),function(e,r){var n,t;return!(null!==(t=null===e||void 0===e||null===(n=e.password)||void 0===n?void 0:n.requireNumber)&&void 0!==t?t:a.tE)||v(r,/\d/)}(e,r)||n.push(f),function(e,r){var n,t;return!(null!==(t=null===e||void 0===e||null===(n=e.password)||void 0===n?void 0:n.requireSymbol)&&void 0!==t?t:a.ah)||v(r,/[!@#$%^&*(){}[\]<>?/|.:;_-]/)}(e,r)||n.push(p)},g=function(e){var r,n,h,f,p=e.labelCol,v=e.wrapperCol,g=e.name,y=e.label,Z=e.inputPlaceholder,j=e.inputAutoComplete,x=e.edit,w=e.style,b=e.required,T=e.className,_=(0,t.Z)(u.Z.useSystem(),1)[0],E=null!==(h=null===_||void 0===_||null===(r=_.password)||void 0===r?void 0:r.min)&&void 0!==h?h:a.yL,S=null!==(f=null===_||void 0===_||null===(n=_.password)||void 0===n?void 0:n.max)&&void 0!==f?f:a.nq;return(0,s.jsx)(i.Z.Item,{className:T,labelCol:p,wrapperCol:v,name:g||"password",label:y||"Password",rules:[function(){return{validator:function(e,r){var n=[];return x&&"******"===r?Promise.resolve():r?(function(e,r,n,t){(function(e,r){return!(r.length<e)})(e,n)||t.push(c(e)),function(e,r){return!(r.length>e)}(r,n)||t.push(d(r))}(E,S,r,n),m(_,r,n),n.length?Promise.reject(n):Promise.resolve()):Promise.reject(l)}}},{required:!!b,message:""}],style:w,children:(0,s.jsx)(o.Z.Password,{placeholder:Z,autoComplete:j})})}},96844:function(e,r,n){"use strict";n.d(r,{lt:function(){return g},Xq:function(){return j},Ur:function(){return s}});var t=n(13448),s=function(e,r){t.Z.success({message:e,description:r,duration:10})},i=n(85893),o=n(6880),a=n(54907),u=n(26713),l=n(71577),c=n(79074),d=n(60274);c.S1({dsn:"https://3bb27cb32e55433696022ba93cb32430@o394613.ingest.sentry.io/5428383"});var h,f,p=d,v=[],m=function(){h&&(t.Z.close(h),h=void 0),v.forEach((function(e){return t.Z.close(e)})),v.length=0,t.Z.close(f),f=void 0},g=function(e,r){var n=!(arguments.length>2&&void 0!==arguments[2])||arguments[2];if("Failed to fetch"!==(null===r||void 0===r?void 0:r.message)){if(n){var s,c,d="error_"+v.length;v.push(d),t.Z.error({key:d,message:e,description:r&&(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(o.Z.Text,{code:!0,children:r.message}),(r.status||r.info)&&(0,i.jsx)(a.Z,{children:(0,i.jsx)(a.Z.Panel,{header:"More information",children:(0,i.jsxs)(u.Z,{direction:"vertical",children:[r.status&&(0,i.jsxs)(o.Z.Text,{children:["Status: ",r.status]}),(null===(s=r.info)||void 0===s?void 0:s.message)&&(0,i.jsxs)(o.Z.Text,{children:["Description: ",null===(c=r.info)||void 0===c?void 0:c.message]})]})},"information")})]}),duration:0})}if(r&&console.error(r),r&&p.captureException(r),v.length>1&&!f){var g="close_all";t.Z.info({key:g,message:(0,i.jsx)(l.Z,{type:"primary",onClick:m,children:"Close all"}),description:"Close all error notifications",duration:0,placement:"top"}),f=g}}else if(!h){var y="server_error";v.push(y),t.Z.error({key:y,message:"Server error",description:"Server is disconnected, please check your internet connection.",duration:0,onClose:function(){h=void 0}}),h=y}},y=n(81579),Z=n(14670),j=function(e){var r,n,t=e.error;return t?(0,i.jsx)(y.Z.Item,{children:(0,i.jsx)(Z.Z,{message:t.render||t.title,type:t.type,showIcon:!0,description:t.err&&(0,i.jsxs)(i.Fragment,{children:[t.err.message&&(0,i.jsxs)(o.Z.Text,{type:"danger",children:["Message: ",(0,i.jsx)("code",{children:t.err.message})]}),t.err.status&&(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)("br",{}),(0,i.jsxs)(o.Z.Text,{type:"danger",children:["Status: ",(0,i.jsx)("code",{children:t.err.status})]})]}),(null===(r=t.err.info)||void 0===r?void 0:r.message)&&(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)("br",{}),(0,i.jsxs)(o.Z.Text,{type:"danger",children:["Information: ",(0,i.jsx)("code",{children:null===(n=t.err.info)||void 0===n?void 0:n.message})]})]})]})})}):null}},75107:function(e,r,n){"use strict";var t=n(85893),s=n(67294),i=n(26713),o=n(81474),a=n(11382),u=n(97183),l=n(6880),c=n(91756),d=n(28058),h=function(e){var r=e.text,n=e.status,h=e.errors,f=(0,s.useRef)(null),p=(null===h||void 0===h?void 0:h.length)?"error":"process";(0,s.useEffect)((function(){var e=f.current;e&&((null===h||void 0===h?void 0:h.length)?e.scrollTo({top:0,behavior:"smooth"}):e.scrollTo({top:e.scrollHeight,behavior:"smooth"}))}),[n,h]);var v=!!(null===n||void 0===n?void 0:n.length)||!!(null===h||void 0===h?void 0:h.length);return(0,t.jsxs)(u.Z,{className:"tanatloc-gradient",children:[(0,t.jsx)("div",{className:"logo",children:(0,t.jsx)("img",{src:"/images/logo.svg",alt:"Tanatloc"})}),(0,t.jsx)(o.Z,{className:"Loading",bodyStyle:{padding:0},title:(0,t.jsx)(i.Z,{children:(null===h||void 0===h?void 0:h.length)?(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(d.Z,{style:{fontSize:"32px",color:"red"}}),(0,t.jsx)(l.Z.Title,{level:3,className:"no-margin",children:"An error occurs"})]}):(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(a.Z,{size:"large"}),null!==r&&void 0!==r?r:"Loading, please wait..."]})}),children:v?(0,t.jsxs)("div",{ref:f,className:"Loading-content",children:[(null===h||void 0===h?void 0:h.length)?(0,t.jsxs)("div",{className:"Loading-errors",children:[h.map((function(e,r){var n=null;return e.includes("docker: command not found")||e.includes("Is the docker daemon running")?n=(0,t.jsxs)(o.Z,{children:["There is an error with your Docker installation.",(0,t.jsx)("br",{}),"Please verify that Docker is correctly installed and running."]}):(e.includes("EHOSTUNREACH")||e.includes("ENETUNREACH")||e.includes("ETIMEOUT"))&&(n=(0,t.jsxs)(o.Z,{children:["There is an error with your PostgreSQL installation.",(0,t.jsx)("br",{}),'Please verify that postgres Docker container "tanatloc-postgres" is correctly installed and running.']})),(0,t.jsxs)("div",{children:[e,n]},r)})),(0,t.jsx)(l.Z.Title,{level:5,style:{color:"red"},children:"Please restart the application"})]}):null,(null===n||void 0===n?void 0:n.length)?(0,t.jsx)("div",{className:"Loading-status",children:(0,t.jsx)(c.Z,{direction:"vertical",children:n.map((function(e,r){return(0,t.jsx)(c.Z.Step,{status:r===n.length-1?p:"finish",title:e},r)}))})}):null]}):null})]})};h.Simple=function(){return(0,t.jsx)(i.Z,{style:{height:"100%",width:"100%",justifyContent:"center",alignItems:"center"},children:(0,t.jsx)(o.Z,{children:(0,t.jsxs)(i.Z,{children:[(0,t.jsx)(a.Z,{}),"Loading, please wait..."]})})})},r.Z=h},17451:function(e,r,n){"use strict";n.r(r),n.d(r,{default:function(){return k}});var t=n(85893),s=n(47568),i=n(828),o=n(20414),a=n(11163),u=n(67294),l=n(97183),c=n(81474),d=n(26713),h=n(6880),f=n(81579),p=n(69677),v=n(71577),m=n(51986),g=n(96844),y=n(75107),Z=n(81891),j=n(67169),x=n(36574),w="Error while loading user",b="Error while loading system",T="Server issue : please try again shortly",_="This email is already registered",E="Passwords mismatch",S=function(){var e=(0,s.Z)((function(e,r){var n,s;return(0,o.__generator)(this,(function(i){switch(i.label){case 0:return i.trys.push([0,2,,3]),[4,j.Z.add(r)];case 1:return n=i.sent(),[3,3];case 2:throw s=i.sent(),new Z.H({title:T,err:s});case 3:if(n.alreadyExists)throw new Z.H({title:_,render:(0,t.jsxs)(t.Fragment,{children:["We know you! ",(0,t.jsx)("a",{onClick:function(){return P(e)},children:"Log in ?"})]}),type:"warning"});return e.push("/signup/send"),[2]}}))}));return function(r,n){return e.apply(this,arguments)}}(),P=function(e){e.push("/login")},C=function(){var e=(0,u.useState)(!1),r=e[0],n=e[1],Z=(0,u.useState)(),T=Z[0],_=Z[1],P=(0,a.useRouter)(),C=(0,i.Z)(j.Z.useUser(),2),k=C[0],N=C[1],U=N.errorUser,O=N.loadingUser,R=(0,i.Z)(x.Z.useSystem(),2),q=R[0],I=R[1],A=I.errorSystem,L=I.loadingSystem;return(0,u.useEffect)((function(){U&&(0,g.lt)(w,U),A&&(0,g.lt)(b,A)}),[U,A]),(0,u.useEffect)((function(){k&&P.push("/dashboard")}),[k,P]),(0,u.useEffect)((function(){P.prefetch("/dashboard"),P.prefetch("/login")}),[P]),O||L||k?(0,t.jsx)(y.Z,{}):(null===q||void 0===q?void 0:q.allowsignup)?(0,t.jsx)(l.Z,{children:(0,t.jsx)(c.Z,{bordered:!1,className:"Signup",children:(0,t.jsxs)(d.Z,{direction:"vertical",size:"large",className:"full-width",children:[(0,t.jsx)("div",{children:(0,t.jsx)(h.Z.Title,{level:1,style:{padding:0,marginBottom:16,fontWeight:500},children:"Sign Up"})}),(0,t.jsxs)(f.Z,{requiredMark:"optional",onFinish:function(){var e=(0,s.Z)((function(e){var r;return(0,o.__generator)(this,(function(t){switch(t.label){case 0:n(!0),t.label=1;case 1:return t.trys.push([1,3,4,5]),[4,S(P,e)];case 2:return t.sent(),[3,5];case 3:return r=t.sent(),_(r),[3,5];case 4:return n(!1),[7];case 5:return[2]}}))}));return function(r){return e.apply(this,arguments)}}(),layout:"vertical",children:[(0,t.jsx)(f.Z.Item,{name:"email",label:"Enter your email address",rules:[{required:!0,message:"Email is required"}],children:(0,t.jsx)(p.Z,{placeholder:"Email address",autoComplete:"email"})}),(0,t.jsx)(m.o,{name:"password",label:"Choose your password",inputPlaceholder:"Password",inputAutoComplete:"current-password",style:{marginBottom:"14px"}}),(0,t.jsx)(f.Z.Item,{name:"passwordConfirmation",label:"Confirm your password",rules:[{required:!0,message:"Password confirmation is required"},function(e){var r=e.getFieldValue;return{validator:function(e,n){return n&&r("password")!==n?Promise.reject(E):Promise.resolve()}}}],style:{marginBottom:"14px"},children:(0,t.jsx)(p.Z.Password,{placeholder:"Password",autoComplete:"current-password"})}),(0,t.jsx)(g.Xq,{error:T}),(0,t.jsx)(f.Z.Item,{className:"Signup-submit",children:(0,t.jsx)(v.Z,{type:"primary",loading:r,htmlType:"submit",children:"Finish"})})]})]})})}):(0,t.jsx)(l.Z,{children:(0,t.jsx)(c.Z,{className:"Signup",children:"The server does not allow signup for now"})})},k=function(){return(0,t.jsx)(C,{})}}},function(e){e.O(0,[7841,6362,1474,1266,1220,7666,6690,7909,1756,2809,9774,2888,179],(function(){return r=47805,e(e.s=r);var r}));var r=e.O();_N_E=r}]);