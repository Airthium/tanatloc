(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[5405],{48312:function(e,t,s){(window.__NEXT_P=window.__NEXT_P||[]).push(["/",function(){return s(32149)}])},87492:function(e,t,s){"use strict";s.d(t,{R:function(){return x},_:function(){return h}});var n=s(47568),r=s(26042),i=s(69396),a=s(20414),o=s(59134),l=s.n(o),c=s(83454),d=c.env.PORT?parseInt(c.env.PORT):3e3,u=l()()?"http://localhost:"+d:"",h=function(){var e=(0,n.Z)((function(e,t){var s,n,i,o;return(0,a.__generator)(this,(function(a){switch(a.label){case 0:return[4,fetch(u+e,(0,r.Z)({method:t?"POST":"GET",headers:{accept:"application/json","Content-Type":"application/json"}},t&&{body:t}))];case 1:return s=a.sent(),n=s.headers.get("Content-Type"),s.ok?[3,4]:(i=new Error("An error occured while fetching data."),(o=null===n||void 0===n?void 0:n.includes("application/json"))?[4,s.json()]:[3,3]);case 2:o=a.sent(),a.label=3;case 3:throw i.info=o,i.status=s.status,i;case 4:return[2,s.json()]}}))}));return function(t,s){return e.apply(this,arguments)}}(),x=function(){var e=(0,n.Z)((function(e,t){var s,n,o,l;return(0,a.__generator)(this,(function(a){switch(a.label){case 0:return[4,fetch(u+e,(0,i.Z)((0,r.Z)({},t),{method:t&&t.method||"GET",headers:(0,i.Z)((0,r.Z)({},t&&t.headers),{"Content-Type":"application/json"})}))];case 1:return s=a.sent(),n=s.headers.get("Content-Type"),s.ok?[3,4]:(o=new Error("An error occured while fetching data."),(l=null===n||void 0===n?void 0:n.includes("application/json"))?[4,s.json()]:[3,3]);case 2:l=a.sent(),a.label=3;case 3:throw o.info=l,o.status=s.status,o;case 4:return[2,s]}}))}));return function(t,s){return e.apply(this,arguments)}}()},1344:function(e,t,s){"use strict";s.d(t,{x:function(){return l}});var n=s(47568),r=s(26042),i=s(20414),a=s(59134),o=s.n(a)()()?"http://localhost:3000":"",l=function(){var e=(0,n.Z)((function(e){var t,s;return(0,i.__generator)(this,(function(n){switch(n.label){case 0:return[4,fetch(o+"/api/login",{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify({email:e.email,password:e.password})})];case 1:return 200!==(t=n.sent()).status?[3,3]:(s=[{ok:!0}],[4,t.json()]);case 2:return[2,r.Z.apply(void 0,s.concat(n.sent()))];case 3:return[2,{ok:!1}]}}))}));return function(t){return e.apply(this,arguments)}}()},67169:function(e,t,s){"use strict";s.d(t,{Z:function(){return j}});var n=s(26042),r=s(8100),i=s(67294),a=s(87492),o=s(69396),l=s(29815),c=s(47568),d=s(20414),u=function(){var e=(0,c.Z)((function(e){return(0,d.__generator)(this,(function(t){switch(t.label){case 0:return[4,(0,a.R)("/api/user",{method:"POST",headers:{Accept:"application/json"},body:JSON.stringify(e)})];case 1:return[2,t.sent().json()]}}))}));return function(t){return e.apply(this,arguments)}}(),h=function(){var e=(0,c.Z)((function(e){return(0,d.__generator)(this,(function(t){switch(t.label){case 0:return[4,(0,a.R)("/api/user",{method:"PUT",body:JSON.stringify(e)})];case 1:return t.sent(),[2]}}))}));return function(t){return e.apply(this,arguments)}}(),x=function(){var e=(0,c.Z)((function(e,t){return(0,d.__generator)(this,(function(s){switch(s.label){case 0:return[4,(0,a.R)("/api/user/"+e,{method:"PUT",body:JSON.stringify(t)})];case 1:return s.sent(),[2]}}))}));return function(t,s){return e.apply(this,arguments)}}(),p=function(){var e=(0,c.Z)((function(){return(0,d.__generator)(this,(function(e){switch(e.label){case 0:return[4,(0,a.R)("/api/user",{method:"DELETE"})];case 1:return e.sent(),[2]}}))}));return function(){return e.apply(this,arguments)}}(),m=function(){var e=(0,c.Z)((function(e){return(0,d.__generator)(this,(function(t){switch(t.label){case 0:return[4,(0,a.R)("/api/user/"+e,{method:"DELETE"})];case 1:return t.sent(),[2]}}))}));return function(t){return e.apply(this,arguments)}}(),g=function(){var e=(0,c.Z)((function(e){return(0,d.__generator)(this,(function(t){switch(t.label){case 0:return[4,(0,a.R)("/api/user/check",{method:"POST",headers:{Accept:"application/json"},body:JSON.stringify(e)})];case 1:return[2,t.sent().json()]}}))}));return function(t){return e.apply(this,arguments)}}(),f={useUser:function(){var e=(0,r.ZP)("/api/user",a._),t=e.data,s=e.error,o=e.mutate,l=!t,c=null===t||void 0===t?void 0:t.user,d=(0,i.useCallback)((function(e){o({user:(0,n.Z)({},c,e)})}),[c,o]),u=(0,i.useCallback)((function(){o({user:void 0})}),[o]);return[c,{mutateUser:d,clearUser:u,errorUser:401===(null===s||void 0===s?void 0:s.status)?void 0:s,loadingUser:401!==(null===s||void 0===s?void 0:s.status)&&l}]},useUsers:function(){var e=(0,r.ZP)("/api/users",a._),t=e.data,s=e.error,c=e.mutate,d=!t,u=(null===t||void 0===t?void 0:t.users)||[],h=(0,i.useCallback)((function(e){var t=(0,l.Z)(u).concat([(0,o.Z)((0,n.Z)({},e),{authorizedplugins:[]})]);c({users:t})}),[u,c]),x=(0,i.useCallback)((function(e){var t=u.filter((function(t){return t.id!==e.id}));c({users:t})}),[u,c]),p=(0,i.useCallback)((function(e){var t=u.map((function(t){return t.id===e.id&&(t=(0,n.Z)({},t,e)),t}));c({users:t})}),[u,c]);return[u,{addOneUser:h,delOneUser:x,mutateOneUser:p,errorUsers:s,loadingUsers:d}]},add:u,update:h,updateById:x,del:p,delById:m,check:g},j=f},32149:function(e,t,s){"use strict";s.r(t),s.d(t,{default:function(){return E}});var n=s(85893),r=s(828),i=s(11163),a=s(67294),o=s(71577),l=s(97183),c=s(63463),d=s(6880),u=s(95507),h=s(54907),x=s(66516),p=s(10808),m=s(26713),g=s(32808),f=s(24093),j=s(91756),v=s(13728),Z=s(42952),k=s(37993),y=s(59134),b=s.n(y),T=s(4147),N=s(1344),w=s(67169),C=function(e){var t=e.left,s=e.right,r=e.top,i=e.className,a=e.leftClassName,o=e.rightClassName,l=e.topClassName,c=e.id;return(0,n.jsxs)("div",{className:"default-side "+(null!==i&&void 0!==i?i:""),id:c,children:[(0,n.jsx)("div",{className:"default-side-left "+(null!==a&&void 0!==a?a:""),children:t}),(0,n.jsx)("div",{className:"default-side-right "+(null!==o&&void 0!==o?o:""),children:s}),r&&(0,n.jsx)("div",{className:"default-side-top "+(null!==l&&void 0!==l?l:""),children:r})]})},S=s(81474),I=s(27049),D=function(e){var t=e.scroll,s=[(0,n.jsx)(o.Z,{type:"text",onClick:function(){return t("features")},children:"Features"},"features"),(0,n.jsx)(o.Z,{type:"text",onClick:function(){return t("developers")},children:"Developers"},"developers"),(0,n.jsx)(o.Z,{type:"text",onClick:function(){return t("caseStudy")},children:"Case Studies"},"case_studies"),(0,n.jsx)(o.Z,{type:"text",onClick:function(){return t("getStarted")},children:"Get started"},"get_started"),(0,n.jsx)(o.Z,{type:"text",onClick:function(){return t("aboutUs")},children:"About us"},"about_us")],r=function(e){return(0,n.jsx)(u.ZP.Item,{children:e})};return(0,n.jsxs)(l.Z.Footer,{className:"Footer",children:[(0,n.jsxs)("div",{className:"Footer-head",children:[(0,n.jsxs)(S.Z,{title:"Thanks",className:"Footer-Card",bordered:!1,children:["We would like to thanks:",(0,n.jsx)(u.ZP,{bordered:!1,dataSource:["- Professor Fr\xe9deric Hecht, Dr. Pierre Jolivet, and the FreeFEM\u2019s contributors","- Professor Christophe Geuzaine, Professor Jean-Fran\xe7ois Remacle and the Gmsh contributors","- The Open Cascade development team"],renderItem:r}),"Without you this software would not have been possible."]}),(0,n.jsx)(S.Z,{title:"Navigate",className:"Footer-Card",bordered:!1,children:(0,n.jsx)(u.ZP,{dataSource:s,renderItem:r})}),(0,n.jsx)(S.Z,{title:"Contact",className:"Footer-Card",bordered:!1,children:(0,n.jsxs)(m.Z,{direction:"vertical",children:[(0,n.jsxs)("div",{children:[(0,n.jsx)("a",{href:"mailto:contact@airthium.com",children:(0,n.jsx)(o.Z,{type:"text",children:(0,n.jsx)("strong",{children:"contact@airthium.com"})})}),(0,n.jsx)("br",{}),(0,n.jsx)(d.Z.Text,{children:"for commercial inquiries"})]}),(0,n.jsxs)("div",{children:[(0,n.jsx)("a",{href:"https://github.com/Airthium/tanatloc/issues",target:"_blank",rel:"noreferrer",children:(0,n.jsx)(o.Z,{type:"text",children:(0,n.jsx)("strong",{children:"Github Issues"})})}),(0,n.jsx)("br",{}),(0,n.jsx)(d.Z.Text,{children:"for support questions"})]})]})})]}),(0,n.jsx)(I.Z,{className:"Footer-Divider"}),(0,n.jsxs)("div",{className:"Footer-footer",children:[(0,n.jsx)("img",{src:"/images/logo.svg",alt:"Tanatloc"}),(0,n.jsxs)(d.Z,{children:["Copyright\xa9 ",(new Date).getFullYear()," - version ",T.i8," ","- Design by"," ",(0,n.jsx)("a",{href:"http://enora-dvvr.fr/",target:"_blank",rel:"noreferrer",className:"text-dark",children:"Enora Duvivier"})]})]})]})},_=function(e){var t=document.getElementById("header"),s=document.getElementById(e),n=document.getElementById("index");if(s&&t){var r,i=(null===s||void 0===s?void 0:s.offsetTop)-(null===t||void 0===t?void 0:t.offsetHeight)-10;null===n||void 0===n||null===(r=n.scrollTo)||void 0===r||r.call(n,{top:i,behavior:"smooth"})}},P=function(){var e=(0,a.useState)(!1),t=e[0],s=e[1],y=(0,a.useState)(!1),S=y[0],I=y[1],P=(0,i.useRouter)(),E=(0,r.Z)(w.Z.useUser(),2),A=E[0];E[1].loadingUser;(0,a.useEffect)((function(){b()()&&(0,N.x)({email:"admin",password:"password"}).then((function(){P.push("/dashboard")})).catch()}),[P]);var O=(0,a.useCallback)((function(){_("getStarted")}),[P]),F=(0,a.useCallback)((function(e){switch(e){case"Windows":P.push("https://github.com/Airthium/tanatloc-electron/releases/download/v"+T.i8+"/Tanatloc.Setup."+T.i8+".exe");break;case"MacOS":P.push("https://github.com/Airthium/tanatloc-electron/releases/download/v"+T.i8+"/Tanatloc-"+T.i8+".dmg");break;case"Linux":P.push("https://github.com/Airthium/tanatloc-electron/releases/download/v"+T.i8+"/Tanatloc-"+T.i8+".AppImage")}}),[P]),U=null;A||(U=(0,n.jsx)(o.Z,{className:"Index-getstarted",type:"primary",onClick:O,children:"Get Started"}));var z=[{key:"features",label:(0,n.jsx)(o.Z,{type:"text",onClick:function(){return _("features")},children:"Features"})},{key:"developers",label:(0,n.jsx)(o.Z,{type:"text",onClick:function(){return window.open("https://github.com/Airthium","_blank")},children:"Developers"})},{key:"caseStudy",label:(0,n.jsx)(o.Z,{type:"text",onClick:function(){return _("caseStudy")},children:"Case Studies"})},{key:"aboutUs",label:(0,n.jsx)(o.Z,{type:"text",onClick:function(){return _("aboutUs")},children:"About us"})},!A&&{key:"getStarted",label:U},!1].filter((function(e){return e}));return(0,n.jsxs)(l.Z,{id:"index",className:"Index",children:[(0,n.jsxs)(c.Z,{open:t,title:"Docker Desktop installation instruction",width:500,bodyStyle:{marginTop:16},onClose:function(){return s(!1)},children:[(0,n.jsx)(d.Z,{children:"Once Docker Desktop is installed and you have reboooted your computer, open Docker Desktop."}),(0,n.jsx)("br",{}),(0,n.jsxs)(u.ZP,{bordered:!0,children:[(0,n.jsx)(u.ZP.Item,{children:(0,n.jsx)(h.Z,{children:(0,n.jsxs)(h.Z.Panel,{header:'If you have "Docker Desktop - Access denied"',children:[(0,n.jsxs)(d.Z,{children:["You must add the"," ",(0,n.jsx)(d.Z.Text,{code:!0,children:"docker-users"})," group to the current user."]}),(0,n.jsxs)(d.Z,{children:["Run ",(0,n.jsx)("strong",{children:"Computer Management"})," as an administrator and navigate to ",(0,n.jsx)("strong",{children:"Local Users and Groups"})," >"," ",(0,n.jsx)("strong",{children:"Groups"})," > ",(0,n.jsx)("strong",{children:"docker-users"}),". Then, right-click to add user to the group."]}),(0,n.jsx)(d.Z,{children:"Log out and log back in."}),(0,n.jsx)(d.Z,{children:"You can now start Docker Desktop"}),(0,n.jsx)("a",{href:"https://docs.docker.com/desktop/faqs/windowsfaqs/#why-do-i-see-the-docker-desktop-access-denied-error-message-when-i-try-to-start-docker-desktop",target:"_blank",rel:"noreferrer",children:"Source"})]},"access")})}),(0,n.jsx)(u.ZP.Item,{children:"Accept the terms and conditions"}),(0,n.jsx)(u.ZP.Item,{children:"Install missing dependencies if needed (WSL2 backend)"}),(0,n.jsx)(u.ZP.Item,{children:'Docker Desktop should display "Docker Desktop running"'})]}),(0,n.jsx)("br",{}),(0,n.jsxs)(d.Z,{children:["In case of trouble, you can have a look on the"," ",(0,n.jsx)("a",{href:"https://docs.docker.com/desktop/faqs/general/",target:"_blank",rel:"noreferrer",children:"Docker Desktop FAQ"})," ","or on the Tanatloc electron"," ",(0,n.jsx)("a",{href:"https://github.com/Airthium/tanatloc-electron/issues",target:"_blank",rel:"noreferrer",children:"Github Issues"})]})]}),(0,n.jsx)(c.Z,{open:S,title:"Troubleshooting",width:500,bodyStyle:{marginTop:16},onClose:function(){return I(!1)},children:(0,n.jsxs)(h.Z,{children:[(0,n.jsxs)(h.Z.Panel,{header:"Linux AppImage",children:[(0,n.jsx)(d.Z,{children:"Allow execution of the AppImage using:"}),(0,n.jsxs)(d.Z.Text,{code:!0,children:["chmod +x ./Tanatloc-",T.i8,".AppImage"]}),(0,n.jsxs)(d.Z,{children:["Or right-click"," ",(0,n.jsxs)("strong",{children:["Tanatloc-",T.i8,".AppImage"]})," >",(0,n.jsx)("strong",{children:"Properties"})," > ",(0,n.jsx)("strong",{children:"Permissions"})," and check Allow executing file as program"]})]},"appiamge"),(0,n.jsxs)(h.Z.Panel,{header:'"There is an error with your Docker installation." error',children:[(0,n.jsx)(d.Z,{children:"Open Docker Desktop and check all is working fine."}),(0,n.jsxs)(d.Z,{children:["You can have a look on specific"," ",(0,n.jsx)(o.Z,{size:"small",onClick:function(){I(!1),s(!0)},children:"Docker Desktop instructions"}),"."]})]},"docker"),(0,n.jsxs)(h.Z.Panel,{header:'"There is an error with your PostgreSQL installation." error',children:[(0,n.jsx)(d.Z,{children:"Open Docker Desktop > Containers"}),(0,n.jsx)(d.Z,{children:'You should see a container named "tanatloc-postgres", if not try to restart Tanatloc app.'})]},"postgres")]})}),(0,n.jsxs)(l.Z.Header,{id:"header",className:"Index-Header",children:[(0,n.jsx)("img",{src:"/images/logo.svg",alt:"Tanatloc"}),(0,n.jsx)(x.Z,{mode:"horizontal",className:"Index-Menu",items:z}),(0,n.jsx)("div",{className:"Index-Menu-mobile",children:(0,n.jsx)(p.Z,{content:(0,n.jsx)(x.Z,{mode:"inline",items:z}),placement:"leftBottom",children:(0,n.jsx)(v.Z,{style:{fontSize:32}})})}),U,null]}),(0,n.jsx)(l.Z.Content,{className:"Index-Content",children:(0,n.jsxs)(m.Z,{direction:"vertical",size:90,className:"full-width",children:[(0,n.jsx)(C,{left:(0,n.jsxs)(m.Z,{direction:"vertical",size:20,children:[(0,n.jsx)(d.Z.Title,{style:{marginBottom:0},children:"Solve your toughest numerical simulation problems"}),(0,n.jsx)(d.Z.Text,{className:"Index-text",children:"Tanatloc is a multi-physics FEA software for engineers and researchers."}),(0,n.jsx)(d.Z.Text,{className:"Index-text",children:"Use the provided models for the most common problems, make your own, or partner with our experts to build one tailored to your needs."}),(0,n.jsx)(o.Z,{type:"primary",onClick:O,children:"Get Started"})]}),right:(0,n.jsx)("img",{src:"images/indexpage/capture1.png",alt:"tanatloc",className:"img-shadow"}),leftClassName:"Index-padding-50"}),(0,n.jsx)(C,{left:(0,n.jsx)(d.Z.Title,{level:2,children:"The most common multi-physics models at your fingertips"}),right:(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(g.Z,{checked:!0,style:{pointerEvents:"none",fontSize:"20px"},children:"Linear elasticity"}),(0,n.jsx)(g.Z,{checked:!0,style:{pointerEvents:"none",fontSize:"20px"},children:"Linear elasticity over time"}),(0,n.jsx)(g.Z,{checked:!0,style:{pointerEvents:"none",fontSize:"20px"},children:"Poisson"}),(0,n.jsx)(g.Z,{checked:!0,style:{pointerEvents:"none",fontSize:"20px"},children:"Stokes"}),(0,n.jsx)(g.Z,{checked:!0,style:{pointerEvents:"none",fontSize:"20px"},children:"Navier-Stokes over time"}),(0,n.jsx)(g.Z,{checked:!0,style:{pointerEvents:"none",fontSize:"20px"},children:"Thermal diffusion"})]}),className:"background-primary ",rightClassName:"Index-models Index-padding-50",leftClassName:"Index-padding-50",id:"features"}),(0,n.jsxs)("div",{id:"developers",children:[(0,n.jsxs)("div",{className:" padding-50",children:[(0,n.jsx)(d.Z.Title,{level:2,children:"Solve your numerical problems locally or in the cloud, using dedicated plugins"}),(0,n.jsxs)("div",{className:"Index-plugins",children:[(0,n.jsxs)("div",{children:[(0,n.jsx)(f.C,{size:64,shape:"square",src:"images/indexpage/logo-rescale.svg"}),(0,n.jsx)(d.Z.Title,{level:4,children:"Rescale"}),(0,n.jsx)(d.Z.Text,{className:"text-light",children:"Paid feature"}),(0,n.jsx)("a",{href:"mailto:contact@airthium.com",children:(0,n.jsx)(o.Z,{type:"link",children:"Contact us"})})]}),(0,n.jsxs)("div",{children:[(0,n.jsx)(f.C,{size:64,shape:"square",src:"images/indexpage/logo-ancl.jpg"}),(0,n.jsx)(d.Z.Title,{level:4,children:"ANCL Sharetask"}),(0,n.jsx)(d.Z.Text,{className:"text-light",children:"Paid feature"}),(0,n.jsx)("a",{href:"mailto:contact@airthium.com",children:(0,n.jsx)(o.Z,{type:"link",children:"Contact us"})})]}),(0,n.jsxs)("div",{children:[(0,n.jsx)(f.C,{size:64,shape:"square",src:"images/indexpage/logo-slurm.svg"}),(0,n.jsx)(d.Z.Title,{level:4,children:"Slurm"}),(0,n.jsx)(d.Z.Text,{className:"text-light",children:"Upcoming"})]}),(0,n.jsxs)("div",{children:[(0,n.jsx)(f.C,{size:64,shape:"square",src:"images/indexpage/logo-qarnot.svg"}),(0,n.jsx)(d.Z.Title,{level:4,children:"Qarnot HPC"}),(0,n.jsx)(d.Z.Text,{className:"text-light",children:"Upcoming"})]}),(0,n.jsxs)("div",{children:[(0,n.jsx)(f.C,{size:64,shape:"square",icon:(0,n.jsx)(Z.Z,{})}),(0,n.jsx)(d.Z.Title,{level:4,children:"Your own plugin"}),(0,n.jsx)(d.Z.Text,{className:"text-light",children:"Paid feature"})]})]})]}),(0,n.jsx)("img",{src:"images/indexpage/capture2.png",alt:"tanatloc",className:"img-shadow"})]}),(0,n.jsx)(C,{left:(0,n.jsxs)(m.Z,{direction:"vertical",size:20,children:[(0,n.jsxs)("div",{children:[(0,n.jsx)(d.Z.Title,{level:2,children:"Case Study"}),(0,n.jsx)(d.Z.Title,{level:3,className:"text-light",style:{marginBottom:0},children:"DENSO"})]}),(0,n.jsx)(d.Z.Text,{className:"Index-text",children:"DENSO is a leading Japanese automotive and Fortune 500 company."}),(0,n.jsx)(d.Z.Text,{className:"Index-text",children:"Hiroshi Ogawa, at DENSO\u2019s Heat Exchanger R&D Division, implemented a custom FreeFEM model on TANATLOC with the help of Professor Atsushi Suzuki from Osaka University."}),(0,n.jsx)(d.Z.Text,{className:"Index-text",children:"DENSO\u2019s Solder Filling model was added to TANATLOC, and the calculations are deployed seamlessly on the cloud or on on-premise server via the ANCL Sharetask plug-in."})]}),right:(0,n.jsx)("img",{src:"images/indexpage/denso.jpg",alt:"tanatloc",className:"Index-case-study Index-padding-50"}),className:"Index-casestudy",leftClassName:"Index-casestudy-left Index-padding-50 full-width",rightClassName:"Index-casestudy-right",id:"caseStudy"}),(0,n.jsxs)("div",{id:"getStarted",children:[(0,n.jsx)(d.Z.Title,{level:2,children:"Tanatloc is an FEA software based on FreeFEM, an extremely powerful and versatile open-source PDE solver. It runs locally using an electron build."}),(0,n.jsx)(d.Z.Title,{level:4,className:"text-light",children:"Follow these steps to get started:"}),(0,n.jsx)("br",{}),(0,n.jsxs)(j.Z,{direction:"vertical",className:"Index-steps",children:[(0,n.jsx)(j.Z.Step,{title:"Install Docker Desktop",description:(0,n.jsxs)(n.Fragment,{children:[(0,n.jsxs)(d.Z,{children:["Follow the Docker installation instruction at"," ",(0,n.jsx)("a",{href:"https://docs.docker.com/get-docker/",target:"_blank",rel:"noreferrer",children:"docs.docker.com/get-docker"}),". Then, reboot your computer."]}),(0,n.jsxs)(d.Z,{children:["Start Docker Desktop and make sure"," ",(0,n.jsx)(o.Z,{size:"small",onClick:function(){return s(!0)},children:"all is working"}),"."]})]}),status:"process"}),(0,n.jsx)(j.Z.Step,{title:"Disk space",description:(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(d.Z,{children:"Make sure you have at least 10GB of free disk space"}),(0,n.jsx)(d.Z,{children:"This space is used for the installation only, make sure you have enougth space to store the upcoming simulations results"})]}),status:"process"}),(0,n.jsx)(j.Z.Step,{title:"Download the latest app",description:(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(d.Z,{children:"Download the latest app for Linux, MacOS or Windows."}),(0,n.jsxs)(o.Z,{type:"primary",className:"download",onClick:function(){return F("Windows")},children:[(0,n.jsx)("img",{src:"/images/indexpage/windows.svg",alt:""}),"Windows"]}),(0,n.jsxs)(o.Z,{type:"primary",className:"download",onClick:function(){return F("MacOS")},children:[(0,n.jsx)("img",{src:"/images/indexpage/MacOS.svg",alt:""}),"MacOS"]}),(0,n.jsxs)(o.Z,{type:"primary",className:"download",onClick:function(){return F("Linux")},children:[(0,n.jsx)("img",{src:"/images/indexpage/Linux.svg",alt:""}),"Linux"]}),(0,n.jsx)("br",{}),(0,n.jsx)(o.Z,{size:"small",icon:(0,n.jsx)(k.Z,{}),onClick:function(){return I(!0)},children:"Troubleshooting"})]}),status:"process"})]})]}),(0,n.jsx)(C,{left:(0,n.jsx)("img",{src:"images/indexpage/TanatlocByAirthium.png",alt:"airthium"}),right:(0,n.jsxs)(m.Z,{direction:"vertical",size:20,children:[(0,n.jsx)(d.Z.Text,{className:"Index-text",children:"TANATLOC is maintained by Airthium, a US/France based deeptech startup. We build a very robust and highly efficient electric heat engine to decarbonise the planet."}),(0,n.jsx)("a",{href:"https://airthium.com/",target:"_blank",rel:"noreferrer",children:(0,n.jsx)(o.Z,{type:"primary",children:"Discover the project"})})]}),top:(0,n.jsx)(C,{left:(0,n.jsx)(n.Fragment,{}),right:(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(d.Z.Title,{level:2,children:"Support our fight against climate change"}),(0,n.jsx)("a",{href:"https://wefunder.com/airthium",target:"_blank",rel:"noreferrer",children:(0,n.jsx)(o.Z,{size:"large",children:(0,n.jsx)("strong",{children:"Invest in our crowdfounding"})})})]}),className:"background-primary",leftClassName:"Index-about-turbine",rightClassName:"Index-padding-50 Index-crowdfunding"}),className:"Index-about",leftClassName:"Index-padding-50",rightClassName:"Index-padding-50",id:"aboutUs"})]})}),(0,n.jsx)(D,{scroll:_})]})},E=function(){return(0,n.jsx)(P,{})}},4147:function(e){"use strict";e.exports={i8:"1.0.3"}}},function(e){e.O(0,[7841,6362,1474,1266,7666,7909,1756,3175,5507,3463,3335,9774,2888,179],(function(){return t=48312,e(e.s=t);var t}));var t=e.O();_N_E=t}]);