"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[6381],{87492:function(e,n,r){r.d(n,{R:function(){return f},_:function(){return h}});var t=r(47568),s=r(26042),i=r(69396),o=r(20414),a=r(59134),l=r.n(a),c=r(83454),u=c.env.PORT?parseInt(c.env.PORT):3e3,d=l()()?"http://localhost:"+u:"",h=function(){var e=(0,t.Z)((function(e,n){var r,t,i,a;return(0,o.__generator)(this,(function(o){switch(o.label){case 0:return[4,fetch(d+e,(0,s.Z)({method:n?"POST":"GET",headers:{accept:"application/json","Content-Type":"application/json"}},n&&{body:n}))];case 1:return r=o.sent(),t=r.headers.get("Content-Type"),r.ok?[3,4]:(i=new Error("An error occured while fetching data."),(a=null===t||void 0===t?void 0:t.includes("application/json"))?[4,r.json()]:[3,3]);case 2:a=o.sent(),o.label=3;case 3:throw i.info=a,i.status=r.status,i;case 4:return[2,r.json()]}}))}));return function(n,r){return e.apply(this,arguments)}}(),f=function(){var e=(0,t.Z)((function(e,n){var r,t,a,l;return(0,o.__generator)(this,(function(o){switch(o.label){case 0:return[4,fetch(d+e,(0,i.Z)((0,s.Z)({},n),{method:n&&n.method||"GET",headers:(0,i.Z)((0,s.Z)({},n&&n.headers),{"Content-Type":"application/json"})}))];case 1:return r=o.sent(),t=r.headers.get("Content-Type"),r.ok?[3,4]:(a=new Error("An error occured while fetching data."),(l=null===t||void 0===t?void 0:t.includes("application/json"))?[4,r.json()]:[3,3]);case 2:l=o.sent(),o.label=3;case 3:throw a.info=l,a.status=r.status,a;case 4:return[2,r]}}))}));return function(n,r){return e.apply(this,arguments)}}()},67169:function(e,n,r){r.d(n,{Z:function(){return x}});var t=r(26042),s=r(8100),i=r(67294),o=r(87492),a=r(69396),l=r(29815),c=r(47568),u=r(20414),d=function(){var e=(0,c.Z)((function(e){return(0,u.__generator)(this,(function(n){switch(n.label){case 0:return[4,(0,o.R)("/api/user",{method:"POST",headers:{Accept:"application/json"},body:JSON.stringify(e)})];case 1:return[2,n.sent().json()]}}))}));return function(n){return e.apply(this,arguments)}}(),h=function(){var e=(0,c.Z)((function(e){return(0,u.__generator)(this,(function(n){switch(n.label){case 0:return[4,(0,o.R)("/api/user",{method:"PUT",body:JSON.stringify(e)})];case 1:return n.sent(),[2]}}))}));return function(n){return e.apply(this,arguments)}}(),f=function(){var e=(0,c.Z)((function(e,n){return(0,u.__generator)(this,(function(r){switch(r.label){case 0:return[4,(0,o.R)("/api/user/"+e,{method:"PUT",body:JSON.stringify(n)})];case 1:return r.sent(),[2]}}))}));return function(n,r){return e.apply(this,arguments)}}(),p=function(){var e=(0,c.Z)((function(){return(0,u.__generator)(this,(function(e){switch(e.label){case 0:return[4,(0,o.R)("/api/user",{method:"DELETE"})];case 1:return e.sent(),[2]}}))}));return function(){return e.apply(this,arguments)}}(),v=function(){var e=(0,c.Z)((function(e){return(0,u.__generator)(this,(function(n){switch(n.label){case 0:return[4,(0,o.R)("/api/user/"+e,{method:"DELETE"})];case 1:return n.sent(),[2]}}))}));return function(n){return e.apply(this,arguments)}}(),g=function(){var e=(0,c.Z)((function(e){return(0,u.__generator)(this,(function(n){switch(n.label){case 0:return[4,(0,o.R)("/api/user/check",{method:"POST",headers:{Accept:"application/json"},body:JSON.stringify(e)})];case 1:return[2,n.sent().json()]}}))}));return function(n){return e.apply(this,arguments)}}(),Z={useUser:function(){var e=(0,s.ZP)("/api/user",o._),n=e.data,r=e.error,a=e.mutate,l=!n,c=null===n||void 0===n?void 0:n.user,u=(0,i.useCallback)((function(e){a({user:(0,t.Z)({},c,e)})}),[c,a]),d=(0,i.useCallback)((function(){a({user:void 0})}),[a]);return[c,{mutateUser:u,clearUser:d,errorUser:401===(null===r||void 0===r?void 0:r.status)?void 0:r,loadingUser:401!==(null===r||void 0===r?void 0:r.status)&&l}]},useUsers:function(){var e=(0,s.ZP)("/api/users",o._),n=e.data,r=e.error,c=e.mutate,u=!n,d=(null===n||void 0===n?void 0:n.users)||[],h=(0,i.useCallback)((function(e){var n=(0,l.Z)(d).concat([(0,a.Z)((0,t.Z)({},e),{authorizedplugins:[]})]);c({users:n})}),[d,c]),f=(0,i.useCallback)((function(e){var n=d.filter((function(n){return n.id!==e.id}));c({users:n})}),[d,c]),p=(0,i.useCallback)((function(e){var n=d.map((function(n){return n.id===e.id&&(n=(0,t.Z)({},n,e)),n}));c({users:n})}),[d,c]);return[d,{addOneUser:h,delOneUser:f,mutateOneUser:p,errorUsers:r,loadingUsers:u}]},add:d,update:h,updateById:f,del:p,delById:v,check:g},x=Z},32834:function(e,n,r){r.d(n,{AN:function(){return Z},ZP:function(){return j}});var t=r(47568),s=r(26042),i=r(69396),o=r(828),a=r(20414),l=r(85893),c=r(67294),u=r(81579),d=r(67040),h=r(6880),f=r(96844),p=r(26713),v=r(40262),g="Error while submitting deletion",Z=function(e){var n=e.visible,r=e.loading,s=e.title,i=e.children,o=e.onCancel,c=e.onOk;return(0,l.jsx)(d.Z,{className:"Dialog",title:(0,l.jsx)(h.Z.Text,{ellipsis:{tooltip:!0},children:s}),okText:"Delete",closable:!1,maskClosable:!1,open:n,cancelButtonProps:{disabled:r},onCancel:function(){return o()},onOk:(0,t.Z)((function(){var e;return(0,a.__generator)(this,(function(n){switch(n.label){case 0:return n.trys.push([0,2,,3]),[4,c()];case 1:return n.sent(),[3,3];case 2:return e=n.sent(),(0,f.lt)(g,e,!1),[3,3];case 3:return[2]}}))})),okButtonProps:{danger:!0,loading:r},children:(0,l.jsxs)(p.Z,{align:"start",children:[(0,l.jsx)(v.Z,{twoToneColor:"#ff4d4f"}),(0,l.jsx)("span",{style:{wordBreak:"break-word"},children:i})]})})},x="Error while submitting data",j=function(e){var n=e.visible,r=e.loading,p=e.title,v=e.initialValues,g=e.cancelButtonText,Z=e.cancelButtonProps,j=e.okButtonProps,m=e.okButtonText,y=e.children,b=e.onCancel,T=e.onOk,k=(0,o.Z)(u.Z.useForm(),1)[0];return(0,c.useEffect)((function(){n&&v&&k.setFieldsValue(v)}),[n,v,k]),(0,l.jsx)(d.Z,{className:"Dialog",title:(0,l.jsx)(h.Z.Text,{ellipsis:{tooltip:!0},children:p}),open:n,closable:!1,maskClosable:!1,onCancel:b&&function(){k.resetFields(),b()},cancelButtonProps:(0,i.Z)((0,s.Z)({},Z),{disabled:r,style:{display:b?"inline-block":"none"}}),cancelText:g,onOk:T&&(0,t.Z)((function(){var e,n;return(0,a.__generator)(this,(function(r){switch(r.label){case 0:return r.trys.push([0,3,,4]),[4,k.validateFields()];case 1:return e=r.sent(),[4,T(e)];case 2:return r.sent(),k.resetFields(),[3,4];case 3:return n=r.sent(),(0,f.lt)(x,n,!1),[3,4];case 4:return[2]}}))})),okText:m,okButtonProps:(0,i.Z)((0,s.Z)({},j),{loading:r,style:{display:T?"inline-block":"none"}}),children:(0,l.jsx)(u.Z,{form:k,layout:"vertical",initialValues:v,children:y})})}},96844:function(e,n,r){r.d(n,{lt:function(){return Z},Xq:function(){return m},Ur:function(){return s}});var t=r(13448),s=function(e,n){t.Z.success({message:e,description:n,duration:10})},i=r(85893),o=r(6880),a=r(54907),l=r(26713),c=r(71577),u=r(79074),d=r(60274);u.S1({dsn:"https://3bb27cb32e55433696022ba93cb32430@o394613.ingest.sentry.io/5428383"});var h,f,p=d,v=[],g=function(){h&&(t.Z.close(h),h=void 0),v.forEach((function(e){return t.Z.close(e)})),v.length=0,t.Z.close(f),f=void 0},Z=function(e,n){var r=!(arguments.length>2&&void 0!==arguments[2])||arguments[2];if("Failed to fetch"!==(null===n||void 0===n?void 0:n.message)){if(r){var s,u,d="error_"+v.length;v.push(d),t.Z.error({key:d,message:e,description:n&&(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(o.Z.Text,{code:!0,children:n.message}),(n.status||n.info)&&(0,i.jsx)(a.Z,{children:(0,i.jsx)(a.Z.Panel,{header:"More information",children:(0,i.jsxs)(l.Z,{direction:"vertical",children:[n.status&&(0,i.jsxs)(o.Z.Text,{children:["Status: ",n.status]}),(null===(s=n.info)||void 0===s?void 0:s.message)&&(0,i.jsxs)(o.Z.Text,{children:["Description: ",null===(u=n.info)||void 0===u?void 0:u.message]})]})},"information")})]}),duration:0})}if(n&&console.error(n),n&&p.captureException(n),v.length>1&&!f){var Z="close_all";t.Z.info({key:Z,message:(0,i.jsx)(c.Z,{type:"primary",onClick:g,children:"Close all"}),description:"Close all error notifications",duration:0,placement:"top"}),f=Z}}else if(!h){var x="server_error";v.push(x),t.Z.error({key:x,message:"Server error",description:"Server is disconnected, please check your internet connection.",duration:0,onClose:function(){h=void 0}}),h=x}},x=r(81579),j=r(14670),m=function(e){var n,r,t=e.error;return t?(0,i.jsx)(x.Z.Item,{children:(0,i.jsx)(j.Z,{message:t.render||t.title,type:t.type,showIcon:!0,description:t.err&&(0,i.jsxs)(i.Fragment,{children:[t.err.message&&(0,i.jsxs)(o.Z.Text,{type:"danger",children:["Message: ",(0,i.jsx)("code",{children:t.err.message})]}),t.err.status&&(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)("br",{}),(0,i.jsxs)(o.Z.Text,{type:"danger",children:["Status: ",(0,i.jsx)("code",{children:t.err.status})]})]}),(null===(n=t.err.info)||void 0===n?void 0:n.message)&&(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)("br",{}),(0,i.jsxs)(o.Z.Text,{type:"danger",children:["Information: ",(0,i.jsx)("code",{children:null===(r=t.err.info)||void 0===r?void 0:r.message})]})]})]})})}):null}},75107:function(e,n,r){var t=r(85893),s=r(67294),i=r(26713),o=r(81474),a=r(11382),l=r(97183),c=r(6880),u=r(91756),d=r(28058),h=function(e){var n=e.text,r=e.status,h=e.errors,f=(0,s.useRef)(null),p=(null===h||void 0===h?void 0:h.length)?"error":"process";(0,s.useEffect)((function(){var e=f.current;e&&((null===h||void 0===h?void 0:h.length)?e.scrollTo({top:0,behavior:"smooth"}):e.scrollTo({top:e.scrollHeight,behavior:"smooth"}))}),[r,h]);var v=!!(null===r||void 0===r?void 0:r.length)||!!(null===h||void 0===h?void 0:h.length);return(0,t.jsxs)(l.Z,{className:"tanatloc-gradient",children:[(0,t.jsx)("div",{className:"logo",children:(0,t.jsx)("img",{src:"/images/logo.svg",alt:"Tanatloc"})}),(0,t.jsx)(o.Z,{className:"Loading",bodyStyle:{padding:0},title:(0,t.jsx)(i.Z,{children:(null===h||void 0===h?void 0:h.length)?(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(d.Z,{style:{fontSize:"32px",color:"red"}}),(0,t.jsx)(c.Z.Title,{level:3,className:"no-margin",children:"An error occurs"})]}):(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(a.Z,{size:"large"}),null!==n&&void 0!==n?n:"Loading, please wait..."]})}),children:v?(0,t.jsxs)("div",{ref:f,className:"Loading-content",children:[(null===h||void 0===h?void 0:h.length)?(0,t.jsxs)("div",{className:"Loading-errors",children:[h.map((function(e,n){var r=null;return e.includes("docker: command not found")||e.includes("Is the docker daemon running")?r=(0,t.jsxs)(o.Z,{children:["There is an error with your Docker installation.",(0,t.jsx)("br",{}),"Please verify that Docker is correctly installed and running."]}):(e.includes("EHOSTUNREACH")||e.includes("ENETUNREACH")||e.includes("ETIMEOUT"))&&(r=(0,t.jsxs)(o.Z,{children:["There is an error with your PostgreSQL installation.",(0,t.jsx)("br",{}),'Please verify that postgres Docker container "tanatloc-postgres" is correctly installed and running.']})),(0,t.jsxs)("div",{children:[e,r]},n)})),(0,t.jsx)(c.Z.Title,{level:5,style:{color:"red"},children:"Please restart the application"})]}):null,(null===r||void 0===r?void 0:r.length)?(0,t.jsx)("div",{className:"Loading-status",children:(0,t.jsx)(u.Z,{direction:"vertical",children:r.map((function(e,n){return(0,t.jsx)(u.Z.Step,{status:n===r.length-1?p:"finish",title:e},n)}))})}):null]}):null})]})};h.Simple=function(){return(0,t.jsx)(i.Z,{style:{height:"100%",width:"100%",justifyContent:"center",alignItems:"center"},children:(0,t.jsx)(o.Z,{children:(0,t.jsxs)(i.Z,{children:[(0,t.jsx)(a.Z,{}),"Loading, please wait..."]})})})},n.Z=h}}]);