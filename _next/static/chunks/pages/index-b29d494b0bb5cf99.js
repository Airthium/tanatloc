(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[5405],{48312:function(e,s,t){(window.__NEXT_P=window.__NEXT_P||[]).push(["/",function(){return t(79931)}])},11425:function(e,s,t){"use strict";t.d(s,{R:function(){return c},_:function(){return o}});var r=t(59134),i=t.n(r),n=t(83454);let a=n.env.PORT?parseInt(n.env.PORT):3e3,l=i()()?"http://localhost:"+a:"",o=async(e,s)=>{let t=await fetch(l+e,{method:s?"POST":"GET",headers:{accept:"application/json","Content-Type":"application/json"},...s&&{body:s}}),r=t.headers.get("Content-Type");if(!t.ok){let i=Error("An error occured while fetching data.");throw i.info=(null==r?void 0:r.includes("application/json"))&&await t.json(),i.status=t.status,i}return t.json()},c=async(e,s)=>{let t=await fetch(l+e,{...s,method:s&&s.method||"GET",headers:{...s&&s.headers,"Content-Type":"application/json"}}),r=t.headers.get("Content-Type");if(!t.ok){let i=Error("An error occured while fetching data.");throw i.info=(null==r?void 0:r.includes("application/json"))&&await t.json(),i.status=t.status,i}return t}},63406:function(e,s,t){"use strict";t.d(s,{x:function(){return a}});var r=t(59134),i=t.n(r);let n=i()()?"http://localhost:3000":"",a=async e=>{let s=await fetch(n+"/api/login",{method:"POST",headers:{"Content-Type":"application/json",Accept:"application/json"},body:JSON.stringify({email:e.email,password:e.password})});return 200===s.status?{ok:!0,...await s.json()}:{ok:!1}}},55734:function(e,s,t){"use strict";t.d(s,{Z:function(){return p}});var r=t(8100),i=t(67294),n=t(11425);let a=()=>{let{data:e,error:s,mutate:t}=(0,r.ZP)("/api/user",n._),a=null==e?void 0:e.user,l=(0,i.useCallback)(e=>{t({user:{...a,...e}})},[a,t]),o=(0,i.useCallback)(()=>{t({user:void 0})},[t]);return[a,{mutateUser:l,clearUser:o,errorUser:(null==s?void 0:s.status)===401?void 0:s,loadingUser:(null==s?void 0:s.status)!==401&&!e}]},l=()=>{let{data:e,error:s,mutate:t}=(0,r.ZP)("/api/users",n._),a=(null==e?void 0:e.users)||[],l=(0,i.useCallback)(e=>{let s=[...a,{...e,authorizedplugins:[]}];t({users:s})},[a,t]),o=(0,i.useCallback)(e=>{let s=a.filter(s=>s.id!==e.id);t({users:s})},[a,t]),c=(0,i.useCallback)(e=>{let s=a.map(s=>(s.id===e.id&&(s={...s,...e}),s));t({users:s})},[a,t]);return[a,{addOneUser:l,delOneUser:o,mutateOneUser:c,errorUsers:s,loadingUsers:!e}]},o=async e=>{let s=await (0,n.R)("/api/user",{method:"POST",headers:{Accept:"application/json"},body:JSON.stringify(e)});return s.json()},c=async e=>{await (0,n.R)("/api/user",{method:"PUT",body:JSON.stringify(e)})},d=async(e,s)=>{await (0,n.R)("/api/user/"+e,{method:"PUT",body:JSON.stringify(s)})},h=async()=>{await (0,n.R)("/api/user",{method:"DELETE"})},u=async e=>{await (0,n.R)("/api/user/"+e,{method:"DELETE"})},x=async e=>{let s=await (0,n.R)("/api/user/check",{method:"POST",headers:{Accept:"application/json"},body:JSON.stringify(e)});return s.json()};var p={useUser:a,useUsers:l,add:o,update:c,updateById:d,del:h,delById:u,check:x}},79931:function(e,s,t){"use strict";t.r(s),t.d(s,{default:function(){return A}});var r=t(85893),i=t(11163),n=t(67294),a=t(71577),l=t(97183),o=t(63463),c=t(6880),d=t(95507),h=t(54907),u=t(66516),x=t(10808),p=t(26713),m=t(32808),j=t(24093),g=t(91756),f=t(13728),k=t(42952),y=t(37993),Z=t(59134),v=t.n(Z),b=t(4147),T=t(63406),w=t(55734);let N=e=>{let{left:s,right:t,top:i,className:n,leftClassName:a,rightClassName:l,topClassName:o,id:c}=e;return(0,r.jsxs)("div",{className:"default-side "+(null!=n?n:""),id:c,children:[(0,r.jsx)("div",{className:"default-side-left "+(null!=a?a:""),children:s}),(0,r.jsx)("div",{className:"default-side-right "+(null!=l?l:""),children:t}),i&&(0,r.jsx)("div",{className:"default-side-top "+(null!=o?o:""),children:i})]})};var C=t(81474),S=t(27049);let I=e=>{let{scroll:s}=e,t=[(0,r.jsx)(a.Z,{type:"text",onClick:()=>s("features"),children:"Features"},"features"),(0,r.jsx)(a.Z,{type:"text",onClick:()=>s("developers"),children:"Developers"},"developers"),(0,r.jsx)(a.Z,{type:"text",onClick:()=>s("caseStudy"),children:"Case Studies"},"case_studies"),(0,r.jsx)(a.Z,{type:"text",onClick:()=>s("getStarted"),children:"Get started"},"get_started"),(0,r.jsx)(a.Z,{type:"text",onClick:()=>s("aboutUs"),children:"About us"},"about_us")],i=e=>(0,r.jsx)(d.ZP.Item,{children:e});return(0,r.jsxs)(l.Z.Footer,{className:"Footer",children:[(0,r.jsxs)("div",{className:"Footer-head",children:[(0,r.jsxs)(C.Z,{title:"Thanks",className:"Footer-Card",bordered:!1,children:["We would like to thanks:",(0,r.jsx)(d.ZP,{bordered:!1,dataSource:["- Professor Fr\xe9deric Hecht, Dr. Pierre Jolivet, and the FreeFEM’s contributors","- Professor Christophe Geuzaine, Professor Jean-Fran\xe7ois Remacle and the Gmsh contributors","- The Open Cascade development team"],renderItem:i}),"Without you this software would not have been possible."]}),(0,r.jsx)(C.Z,{title:"Navigate",className:"Footer-Card",bordered:!1,children:(0,r.jsx)(d.ZP,{dataSource:t,renderItem:i})}),(0,r.jsx)(C.Z,{title:"Contact",className:"Footer-Card",bordered:!1,children:(0,r.jsxs)(p.Z,{direction:"vertical",children:[(0,r.jsxs)("div",{children:[(0,r.jsx)("a",{href:"mailto:contact@airthium.com",children:(0,r.jsx)(a.Z,{type:"text",children:(0,r.jsx)("strong",{children:"contact@airthium.com"})})}),(0,r.jsx)("br",{}),(0,r.jsx)(c.Z.Text,{children:"for commercial inquiries"})]}),(0,r.jsxs)("div",{children:[(0,r.jsx)("a",{href:"https://github.com/Airthium/tanatloc/issues",target:"_blank",rel:"noreferrer",children:(0,r.jsx)(a.Z,{type:"text",children:(0,r.jsx)("strong",{children:"Github Issues"})})}),(0,r.jsx)("br",{}),(0,r.jsx)(c.Z.Text,{children:"for support questions"})]})]})})]}),(0,r.jsx)(S.Z,{className:"Footer-Divider"}),(0,r.jsxs)("div",{className:"Footer-footer",children:[(0,r.jsx)("img",{src:"/images/logo.svg",alt:"Tanatloc"}),(0,r.jsxs)(c.Z,{children:["Copyright\xa9 ",new Date().getFullYear()," - version ",b.i8," ","- Design by"," ",(0,r.jsx)("a",{href:"http://enora-dvvr.fr/",target:"_blank",rel:"noreferrer",className:"text-dark",children:"Enora Duvivier"})]})]})]})},D=e=>{let s=document.getElementById("header"),t=document.getElementById(e),r=document.getElementById("index");if(t&&s){var i;let n=(null==t?void 0:t.offsetTop)-(null==s?void 0:s.offsetHeight)-10;null==r||null===(i=r.scrollTo)||void 0===i||i.call(r,{top:n,behavior:"smooth"})}},P=()=>{let[e,s]=(0,n.useState)(!1),[t,Z]=(0,n.useState)(!1),C=(0,i.useRouter)(),[S,{loadingUser:P}]=w.Z.useUser();(0,n.useEffect)(()=>{v()()&&(0,T.x)({email:"admin",password:"password"}).then(()=>{C.push("/dashboard")}).catch()},[C]);let E=(0,n.useCallback)(()=>{D("getStarted")},[C]),A=(0,n.useCallback)(e=>{switch(e){case"Windows":C.push("https://github.com/Airthium/tanatloc-electron/releases/download/v"+b.i8+"/Tanatloc.Setup."+b.i8+".exe");break;case"MacOS":C.push("https://github.com/Airthium/tanatloc-electron/releases/download/v"+b.i8+"/Tanatloc-"+b.i8+".dmg");break;case"Linux":C.push("https://github.com/Airthium/tanatloc-electron/releases/download/v"+b.i8+"/Tanatloc-"+b.i8+".AppImage")}},[C]),O=null;S||(O=(0,r.jsx)(a.Z,{className:"Index-getstarted",type:"primary",onClick:E,children:"Get Started"}));let F=[{key:"features",label:(0,r.jsx)(a.Z,{type:"text",onClick:()=>D("features"),children:"Features"})},{key:"caseStudy",label:(0,r.jsx)(a.Z,{type:"text",onClick:()=>D("caseStudy"),children:"Case Studies"})},{key:"aboutUs",label:(0,r.jsx)(a.Z,{type:"text",onClick:()=>D("aboutUs"),children:"About us"})},{key:"developers",label:(0,r.jsx)(a.Z,{type:"text",onClick:()=>window.open("https://github.com/Airthium","_blank"),children:"Developers"})},!S&&{key:"getStarted",label:O},!1].filter(e=>e);return(0,r.jsxs)(l.Z,{id:"index",className:"Index",children:[(0,r.jsxs)(o.Z,{open:e,title:"Docker Desktop installation instruction",width:500,bodyStyle:{marginTop:16},onClose:()=>s(!1),children:[(0,r.jsx)(c.Z,{children:"Once Docker Desktop is installed and you have reboooted your computer, open Docker Desktop."}),(0,r.jsx)("br",{}),(0,r.jsxs)(d.ZP,{bordered:!0,children:[(0,r.jsx)(d.ZP.Item,{children:(0,r.jsx)(h.Z,{children:(0,r.jsxs)(h.Z.Panel,{header:'If you have "Docker Desktop - Access denied"',children:[(0,r.jsxs)(c.Z,{children:["You must add the"," ",(0,r.jsx)(c.Z.Text,{code:!0,children:"docker-users"})," group to the current user."]}),(0,r.jsxs)(c.Z,{children:["Run ",(0,r.jsx)("strong",{children:"Computer Management"})," as an administrator and navigate to ",(0,r.jsx)("strong",{children:"Local Users and Groups"})," >"," ",(0,r.jsx)("strong",{children:"Groups"})," > ",(0,r.jsx)("strong",{children:"docker-users"}),". Then, right-click to add user to the group."]}),(0,r.jsx)(c.Z,{children:"Log out and log back in."}),(0,r.jsx)(c.Z,{children:"You can now start Docker Desktop"}),(0,r.jsx)("a",{href:"https://docs.docker.com/desktop/faqs/windowsfaqs/#why-do-i-see-the-docker-desktop-access-denied-error-message-when-i-try-to-start-docker-desktop",target:"_blank",rel:"noreferrer",children:"Source"})]},"access")})}),(0,r.jsx)(d.ZP.Item,{children:"Accept the terms and conditions"}),(0,r.jsx)(d.ZP.Item,{children:"Install missing dependencies if needed (WSL2 backend)"}),(0,r.jsx)(d.ZP.Item,{children:'Docker Desktop should display "Docker Desktop running"'})]}),(0,r.jsx)("br",{}),(0,r.jsxs)(c.Z,{children:["In case of trouble, you can have a look on the"," ",(0,r.jsx)("a",{href:"https://docs.docker.com/desktop/faqs/general/",target:"_blank",rel:"noreferrer",children:"Docker Desktop FAQ"})," ","or on the Tanatloc electron"," ",(0,r.jsx)("a",{href:"https://github.com/Airthium/tanatloc-electron/issues",target:"_blank",rel:"noreferrer",children:"Github Issues"}),"."]})]}),(0,r.jsx)(o.Z,{open:t,title:"Troubleshooting",width:500,bodyStyle:{marginTop:16},onClose:()=>Z(!1),children:(0,r.jsxs)(h.Z,{children:[(0,r.jsxs)(h.Z.Panel,{header:"Linux AppImage",children:[(0,r.jsx)(c.Z,{children:"Allow execution of the AppImage using:"}),(0,r.jsxs)(c.Z.Text,{code:!0,children:["chmod +x ./Tanatloc-",b.i8,".AppImage"]}),(0,r.jsxs)(c.Z,{children:["Or right-click"," ",(0,r.jsxs)("strong",{children:["Tanatloc-",b.i8,".AppImage"]})," >",(0,r.jsx)("strong",{children:"Properties"})," > ",(0,r.jsx)("strong",{children:"Permissions"})," and check Allow executing file as program"]})]},"appiamge"),(0,r.jsxs)(h.Z.Panel,{header:'"There is an error with your Docker installation." error',children:[(0,r.jsx)(c.Z,{children:"Open Docker Desktop and check all is working fine."}),(0,r.jsxs)(c.Z,{children:["Have a look at the"," ",(0,r.jsx)(a.Z,{size:"small",onClick(){Z(!1),s(!0)},children:"Docker Desktop instructions"}),"."]})]},"docker"),(0,r.jsxs)(h.Z.Panel,{header:'"There is an error with your PostgreSQL installation." error',children:[(0,r.jsx)(c.Z,{children:"Open Docker Desktop > Containers"}),(0,r.jsx)(c.Z,{children:'You should see a container named "tanatloc-postgres", if not try to restart the Tanatloc app.'})]},"postgres")]})}),(0,r.jsxs)(l.Z.Header,{id:"header",className:"Index-Header",children:[(0,r.jsx)("img",{src:"/images/logo.svg",alt:"Tanatloc"}),(0,r.jsx)(u.Z,{mode:"horizontal",className:"Index-Menu",items:F}),(0,r.jsx)("div",{className:"Index-Menu-mobile",children:(0,r.jsx)(x.Z,{content:(0,r.jsx)(u.Z,{mode:"inline",items:F}),placement:"leftBottom",children:(0,r.jsx)(f.Z,{style:{fontSize:32}})})}),O,null]}),(0,r.jsx)(l.Z.Content,{className:"Index-Content",children:(0,r.jsxs)(p.Z,{direction:"vertical",size:90,className:"full-width",children:[(0,r.jsx)(N,{left:(0,r.jsxs)(p.Z,{direction:"vertical",size:20,children:[(0,r.jsx)(c.Z.Title,{style:{marginBottom:0},children:"Solve your toughest numerical simulation problems"}),(0,r.jsx)(c.Z.Text,{className:"Index-text",children:"Tanatloc is a multi-physics FEA software for engineers and researchers."}),(0,r.jsx)(c.Z.Text,{className:"Index-text",children:"Use the provided models for the most common problems, make your own, or partner with our experts to build one tailored to your needs."}),(0,r.jsx)(a.Z,{type:"primary",onClick:E,children:"Get Started"})]}),right:(0,r.jsx)("img",{src:"images/indexpage/capture1.png",alt:"tanatloc",className:"img-shadow"}),leftClassName:"Index-padding-left-right-50",className:"margin-bottom-50"}),(0,r.jsx)(N,{left:(0,r.jsx)(c.Z.Title,{level:2,children:"The most common multi-physics models at your fingertips"}),right:(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(m.Z,{checked:!0,style:{pointerEvents:"none",fontSize:"20px"},children:"Linear elasticity"}),(0,r.jsx)(m.Z,{checked:!0,style:{pointerEvents:"none",fontSize:"20px"},children:"Linear elasticity over time"}),(0,r.jsx)(m.Z,{checked:!0,style:{pointerEvents:"none",fontSize:"20px"},children:"Poisson"}),(0,r.jsx)(m.Z,{checked:!0,style:{pointerEvents:"none",fontSize:"20px"},children:"Stokes"}),(0,r.jsx)(m.Z,{checked:!0,style:{pointerEvents:"none",fontSize:"20px"},children:"Navier-Stokes over time"}),(0,r.jsx)(m.Z,{checked:!0,style:{pointerEvents:"none",fontSize:"20px"},children:"Thermal diffusion"})]}),className:"background-primary ",rightClassName:"Index-models Index-padding-50",leftClassName:"Index-padding-50",id:"features"}),(0,r.jsx)("div",{id:"developers",children:(0,r.jsxs)("div",{className:"Index-padding-50",children:[(0,r.jsx)(c.Z.Title,{level:2,children:"Solve your numerical problems locally or in the cloud, using dedicated plugins"}),(0,r.jsxs)("div",{className:"Index-plugins",children:[(0,r.jsxs)("div",{children:[(0,r.jsx)(j.C,{size:64,shape:"square",src:"images/indexpage/logo-rescale.svg"}),(0,r.jsx)(c.Z.Title,{level:4,children:"Rescale"}),(0,r.jsx)(c.Z.Text,{className:"text-light",children:"Paid feature"}),(0,r.jsx)("a",{href:"mailto:contact@airthium.com",children:(0,r.jsx)(a.Z,{type:"link",children:"Contact us"})})]}),(0,r.jsxs)("div",{children:[(0,r.jsx)(j.C,{size:64,shape:"square",src:"images/indexpage/logo-ancl.jpg"}),(0,r.jsx)(c.Z.Title,{level:4,children:"ANCL Sharetask"}),(0,r.jsx)(c.Z.Text,{className:"text-light",children:"Paid feature"}),(0,r.jsx)("a",{href:"mailto:contact@airthium.com",children:(0,r.jsx)(a.Z,{type:"link",children:"Contact us"})})]}),(0,r.jsxs)("div",{children:[(0,r.jsx)(j.C,{size:64,shape:"square",src:"images/indexpage/logo-slurm.svg"}),(0,r.jsx)(c.Z.Title,{level:4,children:"Slurm"}),(0,r.jsx)(c.Z.Text,{className:"text-light",children:"Upcoming"})]}),(0,r.jsxs)("div",{children:[(0,r.jsx)(j.C,{size:64,shape:"square",src:"images/indexpage/logo-qarnot.svg"}),(0,r.jsx)(c.Z.Title,{level:4,children:"Qarnot HPC"}),(0,r.jsx)(c.Z.Text,{className:"text-light",children:"Upcoming"})]}),(0,r.jsxs)("div",{children:[(0,r.jsx)(j.C,{size:64,shape:"square",icon:(0,r.jsx)(k.Z,{})}),(0,r.jsx)(c.Z.Title,{level:4,children:"Your own plugin"}),(0,r.jsx)(c.Z.Text,{className:"text-light",children:"Paid feature"})]})]})]})}),(0,r.jsxs)("div",{id:"electron",children:[(0,r.jsx)(c.Z.Title,{level:2,children:"Tanatloc is an FEA software based on FreeFEM, an extremely powerful and versatile open-source PDE solver. It runs locally using an electron build."}),(0,r.jsx)("img",{src:"images/indexpage/capture2.png",alt:"tanatloc",className:"img-shadow text-center"})]}),(0,r.jsx)(N,{left:(0,r.jsxs)(p.Z,{direction:"vertical",size:20,children:[(0,r.jsxs)("div",{children:[(0,r.jsx)(c.Z.Title,{level:2,children:"Case Study"}),(0,r.jsx)(c.Z.Title,{level:3,className:"text-light",style:{marginBottom:0},children:"DENSO"})]}),(0,r.jsx)(c.Z.Text,{className:"Index-text",children:"DENSO is a leading Japanese automotive and Fortune 500 company."}),(0,r.jsx)(c.Z.Text,{className:"Index-text",children:"Hiroshi Ogawa, at DENSO’s Heat Exchanger R&D Division, implemented a custom FreeFEM model on TANATLOC with the help of Professor Atsushi Suzuki from Osaka University."}),(0,r.jsx)(c.Z.Text,{className:"Index-text",children:"DENSO’s Solder Filling model was added to TANATLOC, and the calculations are deployed seamlessly on the cloud or on on-premise server via the ANCL Sharetask plug-in."})]}),right:(0,r.jsx)("img",{src:"images/indexpage/denso.jpg",alt:"tanatloc",className:"Index-case-study Index-padding-50"}),className:"Index-casestudy margin-top-bottom-50",leftClassName:"Index-casestudy-left Index-padding-50 full-width",rightClassName:"Index-casestudy-right",id:"caseStudy"}),(0,r.jsxs)("div",{id:"getStarted",className:"margin-bottom-50",children:[(0,r.jsx)(c.Z.Title,{level:2,children:"Get started"}),(0,r.jsx)("br",{}),(0,r.jsxs)(g.Z,{direction:"vertical",className:"Index-steps",children:[(0,r.jsx)(g.Z.Step,{title:"Install Docker Desktop",description:(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)(c.Z,{children:["Follow the Docker installation instruction at"," ",(0,r.jsx)("a",{href:"https://docs.docker.com/get-docker/",target:"_blank",rel:"noreferrer",children:"docs.docker.com/get-docker"})," ","and reboot your computer."]}),(0,r.jsxs)(c.Z,{children:["Start Docker Desktop and make sure"," ",(0,r.jsx)(a.Z,{size:"small",onClick:()=>s(!0),children:"everything is working"}),"."]})]}),status:"process"}),(0,r.jsx)(g.Z.Step,{title:"Disk space",description:(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(c.Z,{children:"Make sure you have at least 10GB of free disk space."}),(0,r.jsx)(c.Z,{children:"This space is used for the installation only, make sure you have enough space to store the upcoming simulations results"})]}),status:"process"}),(0,r.jsx)(g.Z.Step,{title:"Download the latest app",description:(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(c.Z,{children:"Download the latest app for Linux, MacOS or Windows."}),(0,r.jsxs)(a.Z,{type:"primary",className:"download",onClick:()=>A("Windows"),children:[(0,r.jsx)("img",{src:"/images/indexpage/windows.svg",alt:""}),"Windows"]}),(0,r.jsxs)(a.Z,{type:"primary",className:"download",onClick:()=>A("MacOS"),children:[(0,r.jsx)("img",{src:"/images/indexpage/MacOS.svg",alt:""}),"MacOS"]}),(0,r.jsxs)(a.Z,{type:"primary",className:"download",onClick:()=>A("Linux"),children:[(0,r.jsx)("img",{src:"/images/indexpage/Linux.svg",alt:""}),"Linux"]}),(0,r.jsx)("br",{}),(0,r.jsx)(a.Z,{size:"small",icon:(0,r.jsx)(y.Z,{}),onClick:()=>Z(!0),children:"Troubleshooting"})]}),status:"process"})]})]}),(0,r.jsx)(N,{left:(0,r.jsx)("img",{src:"images/indexpage/TanatlocByAirthium.png",alt:"airthium"}),right:(0,r.jsxs)(p.Z,{direction:"vertical",size:20,children:[(0,r.jsx)(c.Z.Text,{className:"Index-text",children:"TANATLOC is maintained by Airthium, a US/France based deeptech startup. We build a very robust and highly efficient electric heat engine to decarbonise the planet."}),(0,r.jsx)("a",{href:"https://airthium.com/",target:"_blank",rel:"noreferrer",children:(0,r.jsx)(a.Z,{type:"primary",children:"Discover the project"})})]}),top:(0,r.jsx)(N,{left:(0,r.jsx)(r.Fragment,{}),right:(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(c.Z.Title,{level:2,children:"Support our fight against climate change"}),(0,r.jsx)("a",{href:"https://wefunder.com/airthium",target:"_blank",rel:"noreferrer",children:(0,r.jsx)(a.Z,{size:"large",children:(0,r.jsx)("strong",{children:"Invest in our crowdfounding"})})})]}),className:"background-primary",leftClassName:"Index-about-turbine",rightClassName:"Index-padding-50 Index-crowdfunding"}),className:"Index-about",leftClassName:"Index-padding-50",rightClassName:"Index-padding-50",id:"aboutUs"})]})}),(0,r.jsx)(I,{scroll:D})]})},E=()=>(0,r.jsx)(P,{});var A=E},4147:function(e){"use strict";e.exports={i8:"1.1.3"}}},function(e){e.O(0,[6040,6362,1474,1266,4362,2650,1756,6326,5507,3463,3335,9774,2888,179],function(){return e(e.s=48312)}),_N_E=e.O()}]);