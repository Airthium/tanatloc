(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[405],{48312:function(e,t,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/",function(){return n(32149)}])},87492:function(e,t,n){"use strict";n.d(t,{R:function(){return x},_:function(){return h}});var r=n(47568),s=n(26042),i=n(69396),a=n(20414),o=n(59134),l=n.n(o),c=n(83454),d=c.env.PORT?parseInt(c.env.PORT):3e3,u=l()()?"http://localhost:"+d:"",h=function(){var e=(0,r.Z)((function(e,t){var n,r,i,o,l,c;return(0,a.__generator)(this,(function(a){switch(a.label){case 0:return r={},i={},[4,fetch(u+e,(0,s.Z)((r.method=t?"POST":"GET",r.headers={accept:"application/json","Content-Type":"application/json"},r),t&&(i.body=t,i)))];case 1:return n=a.sent(),o=n.headers.get("Content-Type"),n.ok?[3,4]:(l=new Error("An error occured while fetching data."),(c=null===o||void 0===o?void 0:o.includes("application/json"))?[4,n.json()]:[3,3]);case 2:c=a.sent(),a.label=3;case 3:throw l.info=c,l.status=n.status,l;case 4:return[2,n.json()]}}))}));return function(t,n){return e.apply(this,arguments)}}(),x=function(){var e=(0,r.Z)((function(e,t){var n,r,o,l,c,d;return(0,a.__generator)(this,(function(a){switch(a.label){case 0:return r={},o={},[4,fetch(u+e,(0,i.Z)((0,s.Z)(r,t),(o.method=t&&t.method||"GET",o.headers=(0,i.Z)((0,s.Z)({},t&&t.headers),{"Content-Type":"application/json"}),o)))];case 1:return n=a.sent(),l=n.headers.get("Content-Type"),n.ok?[3,4]:(c=new Error("An error occured while fetching data."),(d=null===l||void 0===l?void 0:l.includes("application/json"))?[4,n.json()]:[3,3]);case 2:d=a.sent(),a.label=3;case 3:throw c.info=d,c.status=n.status,c;case 4:return[2,n]}}))}));return function(t,n){return e.apply(this,arguments)}}()},1344:function(e,t,n){"use strict";n.d(t,{x:function(){return l}});var r=n(47568),s=n(26042),i=n(20414),a=n(59134),o=n.n(a)()()?"http://localhost:3000":"",l=function(){var e=(0,r.Z)((function(e){var t,n,r,a,l;return(0,i.__generator)(this,(function(i){switch(i.label){case 0:return n={},[4,fetch(o+"/api/login",(n.method="POST",n.headers={"Content-Type":"application/json",Accept:"application/json"},n.body=JSON.stringify({email:e.email,password:e.password}),n))];case 1:return 200!==(t=i.sent()).status?[3,3]:(r=[((a={}).ok=!0,a)],[4,t.json()]);case 2:return[2,s.Z.apply(void 0,r.concat(i.sent()))];case 3:return[2,((l={}).ok=!1,l)]}}))}));return function(t){return e.apply(this,arguments)}}()},67169:function(e,t,n){"use strict";n.d(t,{Z:function(){return j}});var r=n(26042),s=n(8100),i=n(67294),a=n(87492),o=n(69396),l=n(29815),c=n(47568),d=n(20414),u=function(){var e=(0,c.Z)((function(e){var t;return(0,d.__generator)(this,(function(n){switch(n.label){case 0:return t={},[4,(0,a.R)("/api/user",(t.method="POST",t.headers={Accept:"application/json"},t.body=JSON.stringify(e),t))];case 1:return[2,n.sent().json()]}}))}));return function(t){return e.apply(this,arguments)}}(),h=function(){var e=(0,c.Z)((function(e){var t;return(0,d.__generator)(this,(function(n){switch(n.label){case 0:return t={},[4,(0,a.R)("/api/user",(t.method="PUT",t.body=JSON.stringify(e),t))];case 1:return n.sent(),[2]}}))}));return function(t){return e.apply(this,arguments)}}(),x=function(){var e=(0,c.Z)((function(e,t){var n;return(0,d.__generator)(this,(function(r){switch(r.label){case 0:return n={},[4,(0,a.R)("/api/user/"+e,(n.method="PUT",n.body=JSON.stringify(t),n))];case 1:return r.sent(),[2]}}))}));return function(t,n){return e.apply(this,arguments)}}(),p=function(){var e=(0,c.Z)((function(){var e;return(0,d.__generator)(this,(function(t){switch(t.label){case 0:return e={},[4,(0,a.R)("/api/user",(e.method="DELETE",e))];case 1:return t.sent(),[2]}}))}));return function(){return e.apply(this,arguments)}}(),m=function(){var e=(0,c.Z)((function(e){var t;return(0,d.__generator)(this,(function(n){switch(n.label){case 0:return t={},[4,(0,a.R)("/api/user/"+e,(t.method="DELETE",t))];case 1:return n.sent(),[2]}}))}));return function(t){return e.apply(this,arguments)}}(),f=function(){var e=(0,c.Z)((function(e){var t;return(0,d.__generator)(this,(function(n){switch(n.label){case 0:return t={},[4,(0,a.R)("/api/user/check",(t.method="POST",t.headers={Accept:"application/json"},t.body=JSON.stringify(e),t))];case 1:return[2,n.sent().json()]}}))}));return function(t){return e.apply(this,arguments)}}(),g={useUser:function(){var e=(0,s.ZP)("/api/user",a._),t=e.data,n=e.error,o=e.mutate,l=!t,c=null===t||void 0===t?void 0:t.user,d=(0,i.useCallback)((function(e){o({user:(0,r.Z)({},c,e)})}),[c,o]),u=(0,i.useCallback)((function(){o({user:void 0})}),[o]);return[c,{mutateUser:d,clearUser:u,errorUser:401===(null===n||void 0===n?void 0:n.status)?void 0:n,loadingUser:401!==(null===n||void 0===n?void 0:n.status)&&l}]},useUsers:function(){var e=(0,s.ZP)("/api/users",a._),t=e.data,n=e.error,c=e.mutate,d=!t,u=(null===t||void 0===t?void 0:t.users)||[],h=(0,i.useCallback)((function(e){var t=(0,l.Z)(u).concat([(0,o.Z)((0,r.Z)({},e),{authorizedplugins:[]})]);c({users:t})}),[u,c]),x=(0,i.useCallback)((function(e){var t=u.filter((function(t){return t.id!==e.id}));c({users:t})}),[u,c]),p=(0,i.useCallback)((function(e){var t=u.map((function(t){return t.id===e.id&&(t=(0,r.Z)({},t,e)),t}));c({users:t})}),[u,c]);return[u,{addOneUser:h,delOneUser:x,mutateOneUser:p,errorUsers:n,loadingUsers:d}]},add:u,update:h,updateById:x,del:p,delById:m,check:f},j=g},60877:function(e,t,n){"use strict";var r=n(85893),s=n(84908),i=n(63922),a=n(24093),o=n(11382),l=n(13023),c=n(48764).lW,d=function(e){return e?"hsl("+Array.from(e).reduce((function(e,t){return t.charCodeAt(0)+((e<<5)-e)}),0)%360+", 100%, 25%)":"#FFFFFF"},u=function(e){var t=e.toString(16);return 1===t.length?"0"+t:t},h={deepCopy:function(e){return JSON.parse(JSON.stringify(e))},stringToColor:d,rgbToHex:function(e){return"#"+u(Math.floor(255*e.r))+u(Math.floor(255*e.g))+u(Math.floor(255*e.b))},rgbToRgba:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1;return e?"rgba("+255*e.r+", "+255*e.g+", "+255*e.b+", "+t+")":"rgba(255, 255, 255, 0)"},userToAvatar:function(e){var t=e.avatar&&c.from(e.avatar).toString(),n="",l="";return e.firstname||e.lastname?(n=e.firstname?e.firstname+" ":"",n+=e.lastname||"",l=e.firstname?e.firstname[0]:"",l+=e.lastname?e.lastname[0]:""):e.email&&(n=e.email,l=e.email[0]),(0,r.jsx)(s.Z,{title:n+(e.pending?" (Invite pending)":""),children:(0,r.jsx)(i.Z,{count:e.pending&&"Pending...",offset:[30,5],style:{backgroundColor:"#ff4d4f",zIndex:10},children:(0,r.jsx)(a.C,{src:t,style:{backgroundColor:d(n)},children:l.toUpperCase()||(0,r.jsx)(o.Z,{})})})},e.id||JSON.stringify(e))},groupToAvatar:function(e){var t=e.name,n="";return t&&(n=t[0]),(0,r.jsx)(s.Z,{title:t,children:(0,r.jsx)(a.C,{style:{backgroundColor:d(t)},children:n.toUpperCase()||(0,r.jsx)(o.Z,{})})},e.id||JSON.stringify(e))},validateEmail:function(e){return!!(0,l.parseOneAddress)(e)},getGitVersion:function(){return"git-front-30197e3"}};t.Z=h},32149:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return F}});var r=n(85893),s=n(828),i=n(11163),a=n(67294),o=n(71577),l=n(97183),c=n(66516),d=n(10808),u=n(26713),h=n(6880),x=n(32808),p=n(24093),m=n(91756),f=n(13728),g=n(42952),j=n(59134),v=n.n(j),Z=n(1344),y=n(67169),b=function(e){var t=e.left,n=e.right,s=e.top,i=e.className,a=e.leftClassName,o=e.rightClassName,l=e.topClassName,c=e.id;return(0,r.jsxs)("div",{className:"default-side "+(null!==i&&void 0!==i?i:""),id:c,children:[(0,r.jsx)("div",{className:"default-side-left "+(null!==a&&void 0!==a?a:""),children:t}),(0,r.jsx)("div",{className:"default-side-right "+(null!==o&&void 0!==o?o:""),children:n}),s&&(0,r.jsx)("div",{className:"default-side-top "+(null!==l&&void 0!==l?l:""),children:s})]})},N=n(95507),k=n(81474),C=n(27049),T=n(4147),w=n(60877),S=function(e){var t=e.scroll,n=[(0,r.jsx)(o.Z,{type:"text",onClick:function(){return t("features")},children:"Features"},"features"),(0,r.jsx)(o.Z,{type:"text",onClick:function(){return t("developers")},children:"Developers"},"developers"),(0,r.jsx)(o.Z,{type:"text",onClick:function(){return t("caseStudy")},children:"Case Studies"},"case_studies"),(0,r.jsx)(o.Z,{type:"text",onClick:function(){return t("getStarted")},children:"Get started"},"get_started"),(0,r.jsx)(o.Z,{type:"text",onClick:function(){return t("aboutUs")},children:"About us"},"about_us")],s=w.Z.getGitVersion(),i=function(e){return(0,r.jsx)(N.ZP.Item,{children:e})};return(0,r.jsxs)(l.Z.Footer,{className:"Footer",children:[(0,r.jsxs)("div",{className:"Footer-head",children:[(0,r.jsxs)(k.Z,{title:"Thanks",className:"Footer-Card",bordered:!1,children:["We would like to thanks:",(0,r.jsx)(N.ZP,{bordered:!1,dataSource:["- Professor Fr\xe9deric Hecht, Dr. Pierre Jolivet, and the FreeFEM\u2019s contributors","- Professor Christophe Geuzaine, Professor Jean-Fran\xe7ois Remacle and the Gmsh contributors","- The Open Cascade development team"],renderItem:i}),"Without you this software would not have been possible."]}),(0,r.jsx)(k.Z,{title:"Navigate",className:"Footer-Card",bordered:!1,children:(0,r.jsx)(N.ZP,{dataSource:n,renderItem:i})}),(0,r.jsx)(k.Z,{title:"Contact",className:"Footer-Card",bordered:!1,children:(0,r.jsxs)(u.Z,{direction:"vertical",children:[(0,r.jsxs)("div",{children:[(0,r.jsx)("a",{href:"mailto:contact@airthium.com",children:(0,r.jsx)(o.Z,{type:"text",children:(0,r.jsx)("strong",{children:"contact@airthium.com"})})}),(0,r.jsx)("br",{}),(0,r.jsx)(h.Z.Text,{children:"for commercial inquiries"})]}),(0,r.jsxs)("div",{children:[(0,r.jsx)("a",{href:"https://github.com/Airthium/tanatloc/issues",target:"_blank",rel:"noreferrer",children:(0,r.jsx)(o.Z,{type:"text",children:(0,r.jsx)("strong",{children:"Github Issues"})})}),(0,r.jsx)("br",{}),(0,r.jsx)(h.Z.Text,{children:"for support questions"})]})]})})]}),(0,r.jsx)(C.Z,{className:"Footer-Divider"}),(0,r.jsxs)("div",{className:"Footer-footer",children:[(0,r.jsx)("img",{src:"/images/logo.svg",alt:"Tanatloc"}),(0,r.jsxs)(h.Z,{children:["Copyright\xa9 ",(new Date).getFullYear()," - version ",T.i8," ",s&&(0,r.jsxs)(r.Fragment,{children:["(",s,")"]})]})]})]})},I=function(e){var t=document.getElementById("header"),n=document.getElementById(e),r=document.getElementById("index");if(n&&t){var s,i=(null===n||void 0===n?void 0:n.offsetTop)-(null===t||void 0===t?void 0:t.offsetHeight)-10;null===r||void 0===r||null===(s=r.scrollTo)||void 0===s||s.call(r,{top:i,behavior:"smooth"})}},_=function(){var e=(0,i.useRouter)(),t=(0,s.Z)(y.Z.useUser(),2),n=t[0];t[1].loadingUser;(0,a.useEffect)((function(){v()()&&(0,Z.x)({email:"admin",password:"password"}).then((function(){e.push("/dashboard")})).catch()}),[e]);var j=(0,a.useCallback)((function(){I("getStarted")}),[e]),N=null;n||(N=(0,r.jsx)(o.Z,{className:"Index-getstarted",type:"primary",onClick:j,children:"Get Started"}));var k=[{key:"features",label:(0,r.jsx)(o.Z,{type:"text",onClick:function(){return I("features")},children:"Features"})},{key:"developers",label:(0,r.jsx)(o.Z,{type:"text",onClick:function(){return window.open("https://github.com/Airthium","_blank")},children:"Developers"})},{key:"caseStudy",label:(0,r.jsx)(o.Z,{type:"text",onClick:function(){return I("caseStudy")},children:"Case Studies"})},{key:"aboutUs",label:(0,r.jsx)(o.Z,{type:"text",onClick:function(){return I("aboutUs")},children:"About us"})},!n&&{key:"getStarted",label:N},!1].filter((function(e){return e}));return(0,r.jsxs)(l.Z,{id:"index",className:"Index",children:[(0,r.jsxs)(l.Z.Header,{id:"header",className:"Index-Header",children:[(0,r.jsx)("img",{src:"/images/logo.svg",alt:"Tanatloc"}),(0,r.jsx)(c.Z,{mode:"horizontal",className:"Index-Menu",items:k}),(0,r.jsx)("div",{className:"Index-Menu-mobile",children:(0,r.jsx)(d.Z,{content:(0,r.jsx)(c.Z,{mode:"inline",items:k}),placement:"leftBottom",children:(0,r.jsx)(f.Z,{style:{fontSize:32}})})}),N,null]}),(0,r.jsx)(l.Z.Content,{className:"Index-Content",children:(0,r.jsxs)(u.Z,{direction:"vertical",size:90,className:"full-width",children:[(0,r.jsx)(b,{left:(0,r.jsxs)(u.Z,{direction:"vertical",size:20,children:[(0,r.jsx)(h.Z.Title,{style:{marginBottom:0},children:"Solve your toughest numerical simulation problems"}),(0,r.jsx)(h.Z.Text,{className:"Index-text",children:"Tanatloc is a multi-physics FEA software for engineers and researchers."}),(0,r.jsx)(h.Z.Text,{className:"Index-text",children:"Use the provided models for the most common problems, make your own, or partner with our experts to build one tailored to your needs."}),(0,r.jsx)(o.Z,{type:"primary",onClick:j,children:"Get Started"})]}),right:(0,r.jsx)("img",{src:"images/indexpage/capture1.png",alt:"tanatloc",className:"img-shadow"}),leftClassName:"Index-padding-50"}),(0,r.jsx)(b,{left:(0,r.jsx)(h.Z.Title,{level:2,children:"The most common multi-physics models at your fingertips"}),right:(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(x.Z,{checked:!0,style:{pointerEvents:"none",fontSize:"20px"},children:"Linear elasticity"}),(0,r.jsx)(x.Z,{checked:!0,style:{pointerEvents:"none",fontSize:"20px"},children:"Linear elasticity over time"}),(0,r.jsx)(x.Z,{checked:!0,style:{pointerEvents:"none",fontSize:"20px"},children:"Poisson"}),(0,r.jsx)(x.Z,{checked:!0,style:{pointerEvents:"none",fontSize:"20px"},children:"Stokes"}),(0,r.jsx)(x.Z,{checked:!0,style:{pointerEvents:"none",fontSize:"20px"},children:"Navier-Stokes over time"}),(0,r.jsx)(x.Z,{checked:!0,style:{pointerEvents:"none",fontSize:"20px"},children:"Thermal diffusion"})]}),className:"background-primary ",rightClassName:"Index-models Index-padding-50",leftClassName:"Index-padding-50",id:"features"}),(0,r.jsxs)("div",{id:"developers",children:[(0,r.jsxs)("div",{className:" padding-50",children:[(0,r.jsx)(h.Z.Title,{level:2,children:"Solve your numerical problems locally or in the cloud, using dedicated plugins"}),(0,r.jsxs)("div",{className:"Index-plugins",children:[(0,r.jsxs)("div",{children:[(0,r.jsx)(p.C,{size:64,shape:"square",src:"images/indexpage/logo-rescale.svg"}),(0,r.jsx)(h.Z.Title,{level:4,children:"Rescale"}),(0,r.jsx)(h.Z.Text,{className:"text-light",children:"Paid feature"}),(0,r.jsx)("a",{href:"mailto:contact@airthium.com",children:(0,r.jsx)(o.Z,{type:"link",children:"Contact us"})})]}),(0,r.jsxs)("div",{children:[(0,r.jsx)(p.C,{size:64,shape:"square",src:"images/indexpage/logo-ancl.jpg"}),(0,r.jsx)(h.Z.Title,{level:4,children:"ANCL Sharetask"}),(0,r.jsx)(h.Z.Text,{className:"text-light",children:"Paid feature"}),(0,r.jsx)("a",{href:"mailto:contact@airthium.com",children:(0,r.jsx)(o.Z,{type:"link",children:"Contact us"})})]}),(0,r.jsxs)("div",{children:[(0,r.jsx)(p.C,{size:64,shape:"square",src:"images/indexpage/logo-slurm.svg"}),(0,r.jsx)(h.Z.Title,{level:4,children:"Slurm"}),(0,r.jsx)(h.Z.Text,{className:"text-light",children:"Upcoming"})]}),(0,r.jsxs)("div",{children:[(0,r.jsx)(p.C,{size:64,shape:"square",src:"images/indexpage/logo-qarnot.svg"}),(0,r.jsx)(h.Z.Title,{level:4,children:"Qarnot HPC"}),(0,r.jsx)(h.Z.Text,{className:"text-light",children:"Upcoming"})]}),(0,r.jsxs)("div",{children:[(0,r.jsx)(p.C,{size:64,shape:"square",icon:(0,r.jsx)(g.Z,{})}),(0,r.jsx)(h.Z.Title,{level:4,children:"Your own plugin"}),(0,r.jsx)(h.Z.Text,{className:"text-light",children:"Paid feature"})]})]})]}),(0,r.jsx)("img",{src:"images/indexpage/capture2.png",alt:"tanatloc",className:"img-shadow"})]}),(0,r.jsx)(b,{left:(0,r.jsxs)(u.Z,{direction:"vertical",size:20,children:[(0,r.jsxs)("div",{children:[(0,r.jsx)(h.Z.Title,{level:2,children:"Case Study"}),(0,r.jsx)(h.Z.Title,{level:3,className:"text-light",style:{marginBottom:0},children:"DENSO"})]}),(0,r.jsx)(h.Z.Text,{className:"Index-text",children:"DENSO is a leading Japanese automotive and Fortune 500 company."}),(0,r.jsx)(h.Z.Text,{className:"Index-text",children:"Hiroshi Ogawa, at DENSO\u2019s Heat Exchanger R&D Division, implemented a custom FreeFEM model on TANATLOC with the help of Professor Atsushi Suzuki from Osaka University."}),(0,r.jsx)(h.Z.Text,{className:"Index-text",children:"DENSO\u2019s Solder Filling model was added to TANATLOC, and the calculations are deployed seamlessly on the cloud or on on-premise server via the ANCL Sharetask plug-in."})]}),right:(0,r.jsx)("img",{src:"images/indexpage/denso.jpg",alt:"tanatloc",className:"Index-case-study Index-padding-50"}),className:"Index-casestudy",leftClassName:"Index-casestudy-left Index-padding-50 full-width",rightClassName:"Index-casestudy-right",id:"caseStudy"}),(0,r.jsxs)("div",{id:"getStarted",children:[(0,r.jsx)(h.Z.Title,{level:2,children:"Tanatloc is an FEA software based on FreeFEM, an extremely powerful and versatile open-source PDE solver. It runs locally using an electron build."}),(0,r.jsx)(h.Z.Title,{level:4,className:"text-light",children:"Follow these steps to get started:"}),(0,r.jsx)("br",{}),(0,r.jsxs)(m.Z,{direction:"vertical",className:"Index-steps",children:[(0,r.jsx)(m.Z.Step,{title:"Install Docker",description:(0,r.jsxs)(r.Fragment,{children:["Follow the Docker installation instruction at",(0,r.jsx)("br",{}),(0,r.jsx)("a",{href:"https://docs.docker.com/get-docker/",target:"_blank",rel:"noreferrer",children:"docs.docker.com/get-docker"})]}),status:"process"}),(0,r.jsx)(m.Z.Step,{title:"Tanatloc worker docker",description:(0,r.jsxs)(h.Z,{children:["Pull the latest tanatloc/worker docker with the command line:",(0,r.jsx)("br",{}),(0,r.jsx)(h.Z.Text,{code:!0,copyable:!0,children:"docker pull tanatloc/worker"})]}),status:"process"}),(0,r.jsx)(m.Z.Step,{title:"PostgreSQL docker",description:(0,r.jsxs)(h.Z,{children:["Pull the latest postgres docker with the command line:",(0,r.jsx)("br",{}),(0,r.jsx)(h.Z.Text,{code:!0,copyable:!0,children:"docker pull postgres"})]}),status:"process"}),(0,r.jsx)(m.Z.Step,{title:"Download the latest app",description:(0,r.jsxs)(r.Fragment,{children:["Download the latest app for Linux, MacOS or Windows.",(0,r.jsx)("br",{}),(0,r.jsxs)(o.Z,{type:"primary",onClick:function(){return e.push("https://github.com/Airthium/tanatloc-electron/releases/download/v1.0.0/Tanatloc.Setup.1.0.0.exe")},children:[(0,r.jsx)("img",{src:"/images/indexpage/windows.svg",alt:""}),"Windows"]}),(0,r.jsxs)(o.Z,{type:"primary",onClick:function(){return e.push("https://github.com/Airthium/tanatloc-electron/releases/download/v1.0.0/Tanatloc-1.0.0.dmg")},children:[(0,r.jsx)("img",{src:"/images/indexpage/MacOS.svg",alt:""}),"MacOS"]}),(0,r.jsxs)(o.Z,{type:"primary",onClick:function(){return e.push("https://github.com/Airthium/tanatloc-electron/releases/download/v1.0.0/Tanatloc-1.0.0.AppImage")},children:[(0,r.jsx)("img",{src:"/images/indexpage/Linux.svg",alt:""}),"Linux"]})]}),status:"process"})]})]}),(0,r.jsx)(b,{left:(0,r.jsx)("img",{src:"images/indexpage/TanatlocByAirthium.png",alt:"airthium"}),right:(0,r.jsxs)(u.Z,{direction:"vertical",size:20,children:[(0,r.jsx)(h.Z.Text,{className:"Index-text",children:"TANATLOC is maintained by Airthium, a US/France based deeptech startup. We build a very robust and highly efficient electric heat engine to decarbonise the planet."}),(0,r.jsx)("a",{href:"https://airthium.com/",target:"_blank",rel:"noreferrer",children:(0,r.jsx)(o.Z,{type:"primary",children:"Discover the project"})})]}),top:(0,r.jsx)(b,{left:(0,r.jsx)(r.Fragment,{}),right:(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(h.Z.Title,{level:2,children:"Support our fight against climate change"}),(0,r.jsx)("a",{href:"https://wefunder.com/airthium",target:"_blank",rel:"noreferrer",children:(0,r.jsx)(o.Z,{size:"large",children:(0,r.jsx)("strong",{children:"Invest in our crowdfounding"})})})]}),className:"background-primary",leftClassName:"Index-about-turbine",rightClassName:"Index-padding-50 Index-crowdfunding"}),className:"Index-about",leftClassName:"Index-padding-50",rightClassName:"Index-padding-50",id:"aboutUs"})]})}),(0,r.jsx)(S,{scroll:I})]})},F=function(){return(0,r.jsx)(_,{})}},4147:function(e){"use strict";e.exports={i8:"1.0.0"}}},function(e){e.O(0,[841,880,474,551,595,909,959,235,774,888,179],(function(){return t=48312,e(e.s=t);var t}));var t=e.O();_N_E=t}]);