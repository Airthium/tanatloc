(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[3459],{83236:function(e,r,t){(window.__NEXT_P=window.__NEXT_P||[]).push(["/login",function(){return t(69405)}])},10851:function(e,r,t){"use strict";t.d(r,{EQ:function(){return i},kD:function(){return n},x_:function(){return s}});t(83454).env.EMAIL_TOKEN;var n="subscribe",s="passwordRecovery",i="revalidate"},81891:function(e,r,t){"use strict";t.d(r,{H:function(){return u}});var n=t(51438),s=t(28668),i=t(25892),a=t(91224),u=function(e){(0,s.Z)(t,e);var r=(0,a.Z)(t);function t(e){var s;return(0,n.Z)(this,t),(s=r.call(this,e.title)).title=e.title,s.name="APIError",s.render=e.render,s.err=e.err,s.type=e.type||"error",s}return t}((0,i.Z)(Error))},1344:function(e,r,t){"use strict";t.d(r,{x:function(){return o}});var n=t(47568),s=t(26042),i=t(20414),a=t(59134),u=t.n(a)()()?"http://localhost:3000":"",o=function(){var e=(0,n.Z)((function(e){var r,t;return(0,i.__generator)(this,(function(n){switch(n.label){case 0:return[4,fetch(u+"/api/login",{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify({email:e.email,password:e.password})})];case 1:return 200!==(r=n.sent()).status?[3,3]:(t=[{ok:!0}],[4,r.json()]);case 2:return[2,s.Z.apply(void 0,t.concat(n.sent()))];case 3:return[2,{ok:!1}]}}))}));return function(r){return e.apply(this,arguments)}}()},69405:function(e,r,t){"use strict";t.r(r),t.d(r,{default:function(){return L}});var n=t(85893),s=t(47568),i=t(828),a=t(20414),u=t(11163),o=t(67294),c=t(97183),l=t(81474),d=t(26713),h=t(6880),f=t(71577),p=t(81579),m=t(69677),v=t(59134),w=t.n(v),y=t(75107),g=t(96844),x=t(81891),Z=t(1344),b=t(67169),j=t(32834),_=t(87492),E=t(10851),k=function(){var e=(0,s.Z)((function(e){return(0,a.__generator)(this,(function(r){switch(r.label){case 0:return[4,(0,_.R)("/api/email",{method:"PUT",body:JSON.stringify({type:E.x_,email:e})})];case 1:return r.sent(),[2]}}))}));return function(r){return e.apply(this,arguments)}}(),N={recover:k},T="Unable to recover password",C=function(){var e=(0,s.Z)((function(e){var r;return(0,a.__generator)(this,(function(t){switch(t.label){case 0:return t.trys.push([0,2,,3]),[4,N.recover(e.email)];case 1:return t.sent(),(0,g.Ur)("An email has been send to recover your password","If you entered a valid email"),[3,3];case 2:throw r=t.sent(),(0,g.lt)(T,r),r;case 3:return[2]}}))}));return function(r){return e.apply(this,arguments)}}(),I=function(){var e=(0,o.useState)(!1),r=e[0],t=e[1],i=(0,o.useState)(!1),u=i[0],c=i[1];return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(j.ZP,{title:"Forgot your password ?",visible:r,onCancel:function(){return t(!1)},onOk:function(){var e=(0,s.Z)((function(e){var r;return(0,a.__generator)(this,(function(n){switch(n.label){case 0:c(!0),n.label=1;case 1:return n.trys.push([1,3,,4]),[4,C(e)];case 2:return n.sent(),c(!1),t(!1),[3,4];case 3:throw r=n.sent(),c(!1),r;case 4:return[2]}}))}));return function(r){return e.apply(this,arguments)}}(),loading:u,children:(0,n.jsx)(p.Z.Item,{name:"email",label:"Your email address",rules:[{required:!0,message:"Email is required"}],children:(0,n.jsx)(m.Z,{placeholder:"Email address",autoComplete:"email"})})}),(0,n.jsx)(h.Z.Text,{children:(0,n.jsx)(f.Z,{type:"link",onClick:function(){return t(!0)},children:"Forgot your password ?"})})]})},P="Error while loading user",S="Server issue : please try again shortly",q="Incorrect credentials",O=function(){var e=(0,s.Z)((function(e,r,t){var n,s;return(0,a.__generator)(this,(function(i){switch(i.label){case 0:return i.trys.push([0,2,,3]),[4,(0,Z.x)(r)];case 1:return n=i.sent(),[3,3];case 2:throw s=i.sent(),new x.H({title:S,err:s});case 3:if(!n.ok)throw new x.H({title:q,type:"warning"});return t({id:n.id}),e.push("/dashboard"),[2]}}))}));return function(r,t,n){return e.apply(this,arguments)}}(),U=function(){var e=(0,o.useState)(!1),r=e[0],t=e[1],v=(0,o.useState)(),x=v[0],j=v[1],_=(0,i.Z)(b.Z.useUser(),2),E=_[0],k=_[1],N=k.mutateUser,T=k.errorUser,C=k.loadingUser,S=(0,u.useRouter)();return(0,o.useEffect)((function(){w()()&&(0,Z.x)({email:"admin",password:"password"}).then((function(){S.push("/dashboard")})).catch()}),[S]),(0,o.useEffect)((function(){T&&(0,g.lt)(P,T)}),[T]),(0,o.useEffect)((function(){E&&S.push("/dashboard")}),[E,S]),(0,o.useEffect)((function(){S.prefetch("/signup"),S.prefetch("/dashboard")}),[S]),C||E?(0,n.jsx)(y.Z,{}):(0,n.jsx)(c.Z,{children:(0,n.jsx)(l.Z,{bordered:!1,className:"Login",children:(0,n.jsxs)(d.Z,{direction:"vertical",size:"large",className:"full-width",children:[(0,n.jsxs)("div",{children:[(0,n.jsx)(h.Z.Title,{level:1,style:{padding:0,marginBottom:16,fontWeight:500},children:"Log In"}),(0,n.jsxs)(h.Z.Text,{children:["Your first time ?"," ",(0,n.jsx)(f.Z,{type:"link",onClick:function(){return function(e){e.push("/signup")}(S)},children:"Sign up"})]})]}),(0,n.jsxs)(p.Z,{requiredMark:"optional",onFinish:function(){var e=(0,s.Z)((function(e){var r;return(0,a.__generator)(this,(function(n){switch(n.label){case 0:t(!0),n.label=1;case 1:return n.trys.push([1,3,,4]),[4,O(S,e,N)];case 2:return n.sent(),[3,4];case 3:return r=n.sent(),j(r),t(!1),[3,4];case 4:return[2]}}))}));return function(r){return e.apply(this,arguments)}}(),layout:"vertical",children:[(0,n.jsx)(p.Z.Item,{name:"email",label:"Your email address",rules:[{required:!0,message:"Email is required"}],children:(0,n.jsx)(m.Z,{placeholder:"Email address",autoComplete:"email"})}),(0,n.jsx)(p.Z.Item,{name:"password",label:"Your password",rules:[{required:!0,message:"Password is required"}],style:{marginBottom:"14px"},children:(0,n.jsx)(m.Z.Password,{placeholder:"Password",autoComplete:"current-password"})}),(0,n.jsx)(I,{}),(0,n.jsx)(g.Xq,{error:x}),(0,n.jsx)(p.Z.Item,{className:"Login-submit",children:(0,n.jsx)(f.Z,{type:"primary",loading:r,htmlType:"submit",children:"Log in"})})]})]})})})},L=function(){return(0,n.jsx)(U,{})}}},function(e){e.O(0,[7841,6362,1474,1266,1220,7666,6690,7909,1756,7040,5338,6381,9774,2888,179],(function(){return r=83236,e(e.s=r);var r}));var r=e.O();_N_E=r}]);