(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[3556],{76178:function(t,e,n){(window.__NEXT_P=window.__NEXT_P||[]).push(["/signup/validation",function(){return n(38318)}])},96542:function(t,e,n){"use strict";n.d(e,{EQ:function(){return a},kD:function(){return o},o3:function(){return s},x_:function(){return l}});var r,i=n(83454);let s=null!==(r=i.env.EMAIL_TOKEN)&&void 0!==r?r:"",o="subscribe",l="passwordRecovery",a="revalidate"},83755:function(t,e,n){"use strict";n.d(e,{R:function(){return u},_:function(){return a}});var r=n(59134),i=n.n(r),s=n(83454);let o=s.env.PORT?parseInt(s.env.PORT):3e3,l=i()()?"http://localhost:"+o:"",a=async(t,e)=>{let n=await fetch(l+t,{method:e?"POST":"GET",headers:{accept:"application/json","Content-Type":"application/json"},...e&&{body:e}}),r=n.headers.get("Content-Type");if(!n.ok){let t=Error("An error occured while fetching data.");throw t.info=(null==r?void 0:r.includes("application/json"))&&await n.json(),t.status=n.status,t}return n.json()},u=async(t,e)=>{var n;let r=await fetch(l+t,{...e,method:null!==(n=null==e?void 0:e.method)&&void 0!==n?n:"GET",headers:{...null==e?void 0:e.headers,"Content-Type":"application/json"}}),i=r.headers.get("Content-Type");if(!r.ok){let t=Error("An error occured while fetching data.");throw t.info=(null==i?void 0:i.includes("application/json"))&&await r.json(),t.status=r.status,t}return r}},20825:function(t,e,n){"use strict";n.d(e,{Z:function(){return o}});var r=n(83755);let i=async(t,e)=>{let n=await (0,r.R)("/api/link",{method:"POST",headers:{Accept:"application/json"},body:JSON.stringify({id:t,data:e})});return n.json()},s=async(t,e)=>{await (0,r.R)("/api/link",{method:"PUT",body:JSON.stringify({id:t,data:e})})};var o={get:i,process:s}},38318:function(t,e,n){"use strict";n.r(e),n.d(e,{default:function(){return v}});var r=n(85893),i=n(67294),s=n(11163),o=n(70302),l=n(16373),a=n(74048),u=n(89552),c=n(53740),_=n(96542),d=n(55359),p=n(830),y=n(20825),f=n(14856),h=n.n(f),g=n(4045),x=n.n(g);let w={wrongLink:"Wrong link",internal:"Internal error, please try again shortly"};var k=()=>{let{dispatch:t}=(0,i.useContext)(d.uj),e=(0,s.useRouter)(),{id:n}=e.query;return(0,i.useEffect)(()=>{(async()=>{if(n)try{let r=await y.Z.get(n,["type"]);if(r.type===_.kD||r.type===_.EQ)try{await y.Z.process(n),await e.push("/login").catch()}catch(e){t((0,p.iT)({title:w.internal,err:e}))}else t((0,p.iT)({title:w.wrongLink}))}catch(e){t((0,p.iT)({title:w.internal,err:e}))}})()},[n,e,t]),(0,r.jsx)(l.Z,{children:(0,r.jsx)(o.Z,{bordered:!1,className:x().signup,children:(0,r.jsxs)(a.default,{direction:"vertical",className:h().fullWidth,children:[(0,r.jsxs)(c.Z.Text,{children:[(0,r.jsx)(u.default,{})," Validating..."]}),!n&&(0,r.jsx)(c.Z.Text,{type:"warning",children:"No link identifier detected"})]})})})},v=()=>(0,r.jsx)(k,{})},4045:function(t){t.exports={signup:"signup_signup__5hkI7",submit:"signup_submit__lKl_k"}},14856:function(t){t.exports={variables:'"./variables.css"',colorPrimary:"#fad114",textColorDark:"rgba(0, 0, 0, 0.65)",textColorLight:"rgba(0, 0, 0, 0.45)",logo:"styles_logo__a_88m",displayNone:"styles_displayNone__X5JML",displayFlex:"styles_displayFlex__pvl0H",fullWidth:"styles_fullWidth__ig6Zi",fullHeight:"styles_fullHeight__aD1qp",noScroll:"styles_noScroll__jJYvq",scroll:"styles_scroll___zuDw",noBackground:"styles_noBackground__QOpQc",noBorder:"styles_noBorder__T5mw6",noBorderBottom:"styles_noBorderBottom__5ori7",textWhite:"styles_textWhite__yojx2",textLight:"styles_textLight__QglC7",textDark:"styles_textDark__xPmmk",textOrange:"styles_textOrange__TYZ4a",textGreen:"styles_textGreen__M8GsP",textAlignLeft:"styles_textAlignLeft__Da1jw",textAlignCenter:"styles_textAlignCenter__DSN8m",primaryColor:"styles_primaryColor__lHC0K",backgroundPrimary:"styles_backgroundPrimary__5S8pd"}},11163:function(t,e,n){t.exports=n(96885)}},function(t){t.O(0,[6373,1350,302,9774,2888,179],function(){return t(t.s=76178)}),_N_E=t.O()}]);