(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[4018],{78771:(t,e,s)=>{(window.__NEXT_P=window.__NEXT_P||[]).push(["/signup/validation",function(){return s(34980)}])},30498:(t,e,s)=>{"use strict";var n;s.d(e,{CV:()=>l,Rn:()=>r,k0:()=>i,kK:()=>a});let l=null!==(n=s(65606).env.EMAIL_TOKEN)&&void 0!==n?n:"",r="subscribe",i="passwordRecovery",a="revalidate"},50641:(t,e,s)=>{"use strict";s.d(e,{G:()=>o,T:()=>_});var n=s(4866),l=s.n(n),r=s(65606);let i=r.env.PORT?parseInt(r.env.PORT):3e3,a=l()()?"http://localhost:"+i:"",o=async(t,e)=>{let s=await fetch(a+t,{method:e?"POST":"GET",headers:{accept:"application/json","Content-Type":"application/json"},...e&&{body:e}}),n=s.headers.get("Content-Type");if(!s.ok){let t=Error("An error occured while fetching data.");throw t.info=(null==n?void 0:n.includes("application/json"))&&await s.json(),t.status=s.status,t}return s.json()},_=async(t,e)=>{var s;let n=await fetch(a+t,{...e,method:null!==(s=null==e?void 0:e.method)&&void 0!==s?s:"GET",headers:{...null==e?void 0:e.headers,"Content-Type":"application/json"}}),l=n.headers.get("Content-Type");if(!n.ok){let t=Error("An error occured while fetching data.");throw t.info=(null==l?void 0:l.includes("application/json"))&&await n.json(),t.status=n.status,t}return n}},41349:(t,e,s)=>{"use strict";s.d(e,{A:()=>l});var n=s(50641);let l={get:async(t,e)=>(await (0,n.T)("/api/link",{method:"POST",headers:{Accept:"application/json"},body:JSON.stringify({id:t,data:e})})).json(),process:async(t,e)=>{await (0,n.T)("/api/link",{method:"PUT",body:JSON.stringify({id:t,data:e})})}}},34980:(t,e,s)=>{"use strict";s.r(e),s.d(e,{default:()=>m});var n=s(74848),l=s(96540),r=s(86715),i=s(21807),a=s(8331),o=s(17004),_=s(75654),c=s(8350),d=s(30498),p=s(78252),u=s(40889),y=s(70551),h=s(41349),g=s(66188),x=s.n(g),f=s(48051),w=s.n(f);let k={wrongLink:"Wrong link",internal:"Internal error, please try again shortly"},v=()=>{let{dispatch:t}=(0,l.useContext)(p.V2),e=(0,r.useRouter)(),{id:s}=e.query;return(0,l.useEffect)(()=>{(0,y.g)(async()=>{if(s)try{let n=await h.A.get(s,["type"]);if(n.type===d.Rn||n.type===d.kK)try{await h.A.process(s),await e.push("/login").catch()}catch(e){t((0,u.CN)({title:k.internal,err:e}))}else t((0,u.CN)({title:k.wrongLink}))}catch(e){t((0,u.CN)({title:k.internal,err:e}))}})},[s,e,t]),(0,n.jsx)(i.A,{children:(0,n.jsx)(a.A,{bordered:!1,className:w().signup,children:(0,n.jsxs)(o.A,{direction:"vertical",className:x().fullWidth,children:[(0,n.jsxs)(_.A.Text,{children:[(0,n.jsx)(c.A,{})," Validating..."]}),!s&&(0,n.jsx)(_.A.Text,{type:"warning",children:"No link identifier detected"})]})})})},m=()=>(0,n.jsx)(v,{})},48051:t=>{t.exports={signup:"signup_signup__5hkI7",submit:"signup_submit__lKl_k"}},66188:t=>{t.exports={variables:'"./variables.css"',colorPrimary:"#fad114",textColorDark:"rgba(0, 0, 0, 0.65)",textColorLight:"rgba(0, 0, 0, 0.45)",logo:"styles_logo__a_88m",displayNone:"styles_displayNone__X5JML",displayFlex:"styles_displayFlex__pvl0H",fullWidth:"styles_fullWidth__ig6Zi",fullHeight:"styles_fullHeight__aD1qp",noScroll:"styles_noScroll__jJYvq",scroll:"styles_scroll___zuDw",noBackground:"styles_noBackground__QOpQc",noBorder:"styles_noBorder__T5mw6",noBorderBottom:"styles_noBorderBottom__5ori7",textWhite:"styles_textWhite__yojx2",textLight:"styles_textLight__QglC7",textDark:"styles_textDark__xPmmk",textOrange:"styles_textOrange__TYZ4a",textGreen:"styles_textGreen__M8GsP",textAlignLeft:"styles_textAlignLeft__Da1jw",textAlignCenter:"styles_textAlignCenter__DSN8m",primaryColor:"styles_primaryColor__lHC0K",backgroundPrimary:"styles_backgroundPrimary__5S8pd"}}},t=>{var e=e=>t(t.s=e);t.O(0,[1807,5391,8331,636,6593,8792],()=>e(78771)),_N_E=t.O()}]);