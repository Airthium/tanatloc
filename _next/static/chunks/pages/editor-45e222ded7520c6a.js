(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[4154],{31832:function(e,t,l){(window.__NEXT_P=window.__NEXT_P||[]).push(["/editor",function(){return l(37031)}])},55061:function(e,t,l){"use strict";l.d(t,{ET:function(){return s},KJ:function(){return r},j1:function(){return a},pj:function(){return o},zX:function(){return i}});var n=l(11409);let i=e=>({type:n.Hp.SETTEMPLATE,value:e}),a=e=>({type:n.Hp.SETMODEL,value:e}),r=e=>({type:n.Hp.SETCURSOR,value:e}),o=e=>({type:n.Hp.SETTEMPLATEVALID,value:e}),s=e=>({type:n.Hp.SETMODELVALID,value:e})},11409:function(e,t,l){"use strict";l.d(t,{Hp:function(){return r},rU:function(){return o}});var n=l(14288),i=l(67294);let a={template:"",model:"",dispatch:()=>void 0,templateValid:!1,modelValid:!1},r={SETTEMPLATE:"SETTEMPLATE",SETMODEL:"SETMODEL",SETCURSOR:"SETCURSOR",SETTEMPLATEVALID:"SETTEMPLATEVALID",SETMODELVALID:"SETMODELVALID"},o=(0,i.createContext)(a),s=(e,t)=>{switch(t.type){case r.SETTEMPLATE:return{...e,template:t.value};case r.SETMODEL:return{...e,model:t.value};case r.SETCURSOR:return{...e,cursor:t.value};case r.SETTEMPLATEVALID:return{...e,templateValid:t.value};case r.SETMODELVALID:return{...e,modelValid:t.value};default:return e}},c=e=>{let{children:t}=e,[l,r]=(0,i.useReducer)(s,a);return(0,n.tZ)(o.Provider,{value:{...l,dispatch:r},children:t})};t.ZP=c},37031:function(e,t,l){"use strict";l.r(t),l.d(t,{default:function(){return eG}});var n=l(14288),i=l(11163),a=l(67294),r=l(33009),o=l(97183),s=l(68508),c=l(20137),d=l(25625),u=l(26713),m=l(83062),h=l(71577),Z=l(20046),v=l(11409),p=l(18436),f=l(67641),b=l(55734),g=l(3363),y=l(11142),E=l.n(y),k=l(55061),w=l(12935);let C=e=>{if(!e.category)throw Error("missing category");if(!e.name)throw Error("missing name");if(!e.algorithm)throw Error("missing algorithm");if(!e.code)throw Error("missing code");if(!e.version)throw Error("missing version");if(!e.description)throw Error("missing description");if(!e.configuration)throw Error("missing configuration");x(e.configuration.geometry),P(e.configuration.materials),T(e.configuration.parameters),O(e.configuration.initialization),X(e.configuration.boundaryConditions),M(e.configuration.run)},S=(e,t)=>{if(e){if(!e.index)throw Error("missing configuration."+t+".index");if(!e.title)throw Error("missing configuration."+t+".title")}},x=e=>{if(!e)throw Error("missing configuration.geometry");if(S(e,"geometry"),void 0===e.meshable)throw Error("missing configuration.geometry.meshable")},P=e=>{if(e){if(S(e,"materials"),!e.children)throw Error("missing configuration.materials.children");e.children.forEach((e,t)=>{if(!e.label)throw Error("missing configuration.materials.children["+t+"].label");if(!e.name)throw Error("missing configuration.materials.children["+t+"].name");if(!e.htmlEntity)throw Error("missing configuration.materials.children["+t+"].htmlEntity");if(void 0===e.default)throw Error("missing configuration.materials.children["+t+"].default");if(!e.unit)throw Error("missing configuration.materials.children["+t+"].unit")})}},T=e=>{if(!e)throw Error("missing configuration.parameters");S(e,"parameters"),Object.keys(e).forEach(t=>{if("index"===t||"title"===t||"done"===t)return;let l=e[t];if(!l.label)throw Error("missing configuration.parameters."+t+".label");if(!l.children)throw Error("missing configuration.parameters."+t+".children");j(l,t)})},j=(e,t)=>{e.children.forEach((e,l)=>{if(!e.label)throw Error("missing configuration.parameters."+t+".children["+l+"].label");if(!e.htmlEntity)throw Error("missing configuration.parameters."+t+".children["+l+"].htmlEntity");if(void 0===e.default)throw Error("missing configuration.parameters."+t+".children["+l+"].default")})},O=e=>{e&&S(e,"initialization")},X=e=>{if(!e)throw Error("missing configuration.boundaryConditions");S(e,"boundaryConditions"),Object.keys(e).forEach(t=>{if("title"===t||"index"===t||"done"===t)return;let l=e[t];if(!l.label)throw Error("missing configuration.boundaryConditions."+t+".label")})},M=e=>{if(!e)throw Error("missing configuration.run")};var D=l(70917),I=l(86159);let B={editor:(0,D.iv)({width:"100%",height:"100%",overflow:"hidden","& .ant-menu-item-divider":{border:"1px solid "+I.Rl.colorPrimary+" !important",margin:"0 30px !important"}}),header:(0,D.iv)({background:"white !important","& > div":{display:"flex",justifyContent:"space-between",alignItems:"center"}}),steps:(0,D.iv)({width:"206px",margin:"25px","& .ant-steps-item-title":{lineHeight:"20px !important"}}),code:(0,D.iv)({display:"flex",width:"100%",height:"100%"})},R=e=>{var t,l,i,r,o,s,c,d,u,m,Z;let{setName:p}=e,[f,b]=(0,a.useState)({}),{template:y,model:S,dispatch:x}=(0,a.useContext)(v.rU);return(0,w.Z)(()=>{if(!y){b(e=>({...e,template:{status:"wait",err:""},test:{status:"wait"}})),x((0,k.pj)(!1));return}b(e=>{var t;return{...e,template:{status:"finish"},test:{status:(null===(t=e.model)||void 0===t?void 0:t.status)==="finish"?"process":"wait"}}}),x((0,k.pj)(!0))},[y],[x]),(0,w.Z)(()=>{if(!S){b(e=>({...e,model:{status:"wait"},test:{status:"wait"}})),x((0,k.ET)(!1));return}try{let e;try{e=JSON.parse(S)}catch(t){e=E().parse(S),x((0,k.j1)(JSON.stringify(e,null,"	")))}e.name&&p(e.name),C(e),b(e=>{var t;return{...e,model:{status:"finish"},test:{status:(null===(t=e.template)||void 0===t?void 0:t.status)==="finish"?"process":"wait"}}}),x((0,k.ET)(!0))}catch(l){b(e=>({...e,model:{status:"error",err:l.message},test:{status:"wait"}})),x((0,k.ET)(!1))}},[S],[p,x]),(0,n.tZ)(g.Z,{css:B.steps,direction:"vertical",items:[{title:"Check template format",description:null!==(c=null===(t=f.template)||void 0===t?void 0:t.err)&&void 0!==c?c:"EJS + FreeFEM",status:null!==(d=null===(l=f.template)||void 0===l?void 0:l.status)&&void 0!==d?d:"wait"},{title:"Check description format",description:null!==(u=null===(i=f.model)||void 0===i?void 0:null===(r=i.err)||void 0===r?void 0:r.replace(/\./g," > "))&&void 0!==u?u:"JSON",status:null!==(m=null===(o=f.model)||void 0===o?void 0:o.status)&&void 0!==m?m:"wait"},{title:"Test template + description",description:(0,n.BX)(n.HY,{children:[(0,n.tZ)(h.Z,{disabled:!0,onClick:console.log,children:"Run"})," ","template on Tanatloc server"]}),status:null!==(Z=null===(s=f.test)||void 0===s?void 0:s.status)&&void 0!==Z?Z:"wait"}]})};var U=l(15045),L=l(96108),K=l(69677),J=l(28345);let N=(e,t,l,n,i)=>{var a;let r;t.includes("include('/blobs/mesh.edp.ejs'")||(ef(t,"<%# Mesh -%>\n<%\nconst mesh = geometry.mesh\nmesh.name = '".concat(e.name,"'\n-%>\n<%- include('/blobs/mesh.edp.ejs', {\n  dimension,\n  mesh\n}) -%>\n"),n,i),i((0,k.KJ)({row:((null==n?void 0:n.row)||0)+9,column:0})));try{r=JSON.parse(l)}catch(o){r={}}let s=Object.keys(r.configuration||{}).length;r.configuration={...r.configuration||{},geometry:{index:s+1,title:"Geometry",mesh:{name:e.name},...(null===(a=r.configuration)||void 0===a?void 0:a.geometry)||{},meshable:!0}},i((0,k.j1)(JSON.stringify(r,null,"	")))},F=()=>{let e=(0,a.useRef)(null),[t,l]=(0,a.useState)(!1),[i,r]=(0,a.useState)(!1),{template:o,model:s,cursor:c,dispatch:d}=(0,a.useContext)(v.rU);(0,a.useEffect)(()=>{e.current&&e.current.focus()});let u=(0,a.useCallback)(()=>l(!0),[]),m=(0,a.useCallback)(()=>l(!1),[]),Z=(0,a.useCallback)(async e=>{r(!0),N(e,o,s,c,d),r(!1),l(!1)},[o,s,c,d]);return(0,n.BX)(n.HY,{children:[(0,n.tZ)(J.ZP,{title:"Mesh",visible:t,loading:i,onOk:Z,onCancel:m,children:(0,n.tZ)(L.Z.Item,{name:"name",label:"Name",rules:[{required:!0}],children:(0,n.tZ)(K.Z,{ref:e})})}),(0,n.tZ)(h.Z,{css:I.KP.fullWidth,onClick:u,children:"Mesh"})]})};var H=l(34041),V=l(23226),A=l(24969);let q=e=>{let{children:t,label:l,errors:i,add:r}=e,o=(0,a.useCallback)(()=>r(),[r]);return(0,n.BX)(n.HY,{children:[t,(0,n.BX)(L.Z.Item,{children:[(0,n.BX)(h.Z,{type:"dashed",onClick:o,style:{width:"60%"},icon:(0,n.tZ)(A.Z,{}),children:["Add ",l]}),(0,n.tZ)(L.Z.ErrorList,{errors:i})]})]})};var W=l(3089);let Y=e=>{let{children:t,field:l,label:i,index:r,remove:o}=e,s=(0,a.useCallback)(()=>o(l.name),[l,o]);return(0,n.tZ)(L.Z.Item,{label:(0,n.BX)("div",{children:[(0,n.tZ)(W.Z,{style:{fontSize:"16px",color:"red",marginRight:"10px"},onClick:s}),i," ",r+1]}),children:t},l.key)},_=(e,t,l,n,i)=>{var a,r,o;let s;if(!e.materials||!e.materials.length)return;let c=e.materials.map(e=>{let t=V.j[e.symbol],l=t.label,n=t.symbol,i=t.unit;return{label:l,name:n,default:e.default,unit:i}});t.includes("include('/blobs/materials.edp.ejs'")||(ef(t,"<%# Material -%>\n<%- include('/blobs/materials.edp.ejs', {\n  materials\n}) -%>\n",n,i),i((0,k.KJ)({row:((null==n?void 0:n.row)||4)+0,column:0})));try{s=JSON.parse(l)}catch(d){s={}}let u=Object.keys(s.configuration||{}).length;s.configuration={...s.configuration||{},materials:{index:u+1,title:"Materials",...(null===(a=s.configuration)||void 0===a?void 0:a.materials)||{},children:[...(null===(r=s.configuration)||void 0===r?void 0:null===(o=r.materials)||void 0===o?void 0:o.children)||[],...c.map(e=>({label:e.label,name:e.name,htmlEntity:"formula",default:+e.default,unit:e.unit}))]}},i((0,k.j1)(JSON.stringify(s,null,"	")))},z=()=>{let[e,t]=(0,a.useState)(!1),[l,i]=(0,a.useState)(!1),{template:r,model:o,cursor:s,dispatch:c}=(0,a.useContext)(v.rU),d=(0,a.useCallback)(()=>t(!0),[]),u=(0,a.useCallback)(()=>t(!1),[]),m=(0,a.useCallback)(async e=>{i(!0),_(e,r,o,s,c),i(!1),t(!1)},[r,o,s,c]);return(0,n.BX)(n.HY,{children:[(0,n.tZ)(J.ZP,{title:"Materials",visible:e,loading:l,onOk:m,onCancel:u,children:(0,n.tZ)(L.Z.List,{name:"materials",children(e,t,l){let{add:i,remove:a}=t,{errors:r}=l;return(0,n.tZ)(q,{label:"material",add:i,errors:r,children:e.map((e,t)=>(0,n.BX)(Y,{label:"Material",field:e,index:t,remove:a,children:[(0,n.tZ)(L.Z.Item,{name:[e.name,"symbol"],label:"Physical parameter",rules:[{required:!0}],children:(0,n.tZ)(H.Z,{options:V.j.map((e,t)=>({label:e.symbol+": "+e.label,value:t}))})}),(0,n.tZ)(L.Z.Item,{name:[e.name,"default"],label:"Default",rules:[{required:!0}],children:(0,n.tZ)(K.Z,{})})]},e.key))})}})}),(0,n.tZ)(h.Z,{css:I.KP.fullWidth,onClick:d,children:"Materials"})]})},G=(e,t,l,n,i)=>{var a,r,o,s,c,d;let u;if(!e.options||!e.options.length)return;ef(t,"<%# Finite element space -%>\n<%\nconst finiteElementSpace = parameters.finiteElementSpace.children[0]\nfiniteElementSpace.name = '".concat(e.name,"'\n-%>\n<%- include('/blobs/fespace.edp.ejs', {\n  mesh,\n  finiteElementSpace\n}) -%>\n"),n,i),i((0,k.KJ)({row:((null==n?void 0:n.row)||9)+0,column:0}));try{u=JSON.parse(l)}catch(m){u={}}let h=Object.keys(u.configuration||{}).length;u.configuration={...u.configuration||{},parameters:{index:h+1,title:"Parameters",...(null===(a=u.configuration)||void 0===a?void 0:a.parameters)||{},finiteElementSpace:{advanced:!0,label:"Finite element space",...(null===(r=u.configuration)||void 0===r?void 0:null===(o=r.parameters)||void 0===o?void 0:o.finiteElementSpace)||{},children:[...(null===(s=null===(c=u.configuration)||void 0===c?void 0:null===(d=c.parameters)||void 0===d?void 0:d.finiteElementSpace)||void 0===s?void 0:s.children)||[],{label:"Finite element space label",label2D:"Finite element space label (2D)",htmlEntity:"select",options:e.options,default:e.options[0].value,default2D:e.options[0].value2D}]}}},i((0,k.j1)(JSON.stringify(u,null,"	")))},Q=()=>{let e=(0,a.useRef)(null),[t,l]=(0,a.useState)(!1),[i,r]=(0,a.useState)(!1),{template:o,model:s,cursor:c,dispatch:d}=(0,a.useContext)(v.rU);(0,a.useEffect)(()=>{e.current&&e.current.focus()});let u=(0,a.useCallback)(()=>l(!0),[]),m=(0,a.useCallback)(()=>l(!1),[]),Z=(0,a.useCallback)(async e=>{r(!0),G(e,o,s,c,d),r(!1),l(!1)},[o,s,c,d]);return(0,n.BX)(n.HY,{children:[(0,n.BX)(J.ZP,{title:"Finite element space",visible:t,loading:i,onOk:Z,onCancel:m,children:[(0,n.tZ)(L.Z.Item,{name:"name",label:"Name",rules:[{required:!0}],children:(0,n.tZ)(K.Z,{ref:e})}),(0,n.tZ)(L.Z.List,{name:"datas",children(e,t,l){let{add:i,remove:a}=t,{errors:r}=l;return(0,n.tZ)(q,{label:"finite element space",add:i,errors:r,children:e.map((e,t)=>(0,n.BX)(Y,{label:"Option",field:e,index:t,remove:a,children:[(0,n.tZ)(L.Z.Item,{name:[e.name,"label"],label:"Display name",rules:[{required:!0}],children:(0,n.tZ)(K.Z,{placeholder:"P1"})}),(0,n.tZ)(L.Z.Item,{name:[e.name,"value"],label:"Value",rules:[{required:!0}],children:(0,n.tZ)(K.Z,{placeholder:"[P1, P1, P1]"})}),(0,n.tZ)(L.Z.Item,{name:[e.name,"value2D"],label:"Value 2D",rules:[{required:!0}],children:(0,n.tZ)(K.Z,{placeholder:"[P1, P1]"})})]},e.key))})}})]}),(0,n.tZ)(h.Z,{css:I.KP.fullWidth,onClick:u,children:"Finite element space"})]})},$=(e,t,l)=>{ef(e,"<%# Headers -%>\n<%- include('/blobs/headers.edp.ejs') -%>\n",t,l),l((0,k.KJ)({row:((null==t?void 0:t.row)||0)+2,column:0}))},ee=()=>{let{template:e,cursor:t,dispatch:l}=(0,a.useContext)(v.rU),i=(0,a.useCallback)(()=>$(e,t,l),[e,t,l]);return(0,n.tZ)(h.Z,{css:I.KP.fullWidth,onClick:i,children:"Header"})},et=(e,t,l)=>{ef(e,"<%# Dimension -%>\n<%- include('/blobs/dimensioning.edp.ejs', {\n    dimension\n}) -%>\n",t,l),l((0,k.KJ)({row:((null==t?void 0:t.row)||0)+4,column:0}))},el=()=>{let{template:e,cursor:t,dispatch:l}=(0,a.useContext)(v.rU),i=(0,a.useCallback)(()=>et(e,t,l),[e,t,l]);return(0,n.tZ)(h.Z,{css:I.KP.fullWidth,onClick:i,children:"Dimension"})},en=(e,t,l,n)=>{ef(t,"<%# Finite element function -%>\n<%\nconst testFunction = dimension === 2 ? '[".concat(e.test1,", ").concat(e.test2,"]' : '[").concat(e.test1,", ").concat(e.test2,", ").concat(e.test3,"]'\nconst unknownFunction = dimension === 2 ? '[").concat(e.unknown1,", ").concat(e.unknown2,"]' : '[").concat(e.unknown1,", ").concat(e.unknown2,", ").concat(e.unknown3,"]'\n-%>\n<%- include('/blobs/fespaceFunction.edp.ejs', {\n    finiteElementSpace,\n    finiteElementFunction: testFunction\n  }) -%>\n  <%- include('/blobs/fespaceFunction.edp.ejs', {\n    finiteElementSpace,\n    finiteElementFunction: unknownFunction\n}) -%>\n"),l,n),n((0,k.KJ)({row:((null==l?void 0:l.row)||9)+0,column:0}))},ei=()=>{let e=(0,a.useRef)(null),[t,l]=(0,a.useState)(!1),[i,r]=(0,a.useState)(!1),{template:o,cursor:s,dispatch:c}=(0,a.useContext)(v.rU);(0,a.useEffect)(()=>{e.current&&e.current.focus()});let u=(0,a.useCallback)(()=>l(!0),[]),m=(0,a.useCallback)(()=>l(!1),[]),Z=(0,a.useCallback)(async e=>{r(!0),en(e,o,s,c),r(!1),l(!1)},[o,s,c]);return(0,n.BX)(n.HY,{children:[(0,n.BX)(J.ZP,{title:"Finite element function",visible:t,loading:i,onOk:Z,onCancel:m,children:[(0,n.BX)(L.Z.Item,{label:(0,n.tZ)(d.Z.Text,{strong:!0,children:"Test function"}),children:[(0,n.tZ)(L.Z.Item,{label:"First coordinate",name:"test1",children:(0,n.tZ)(K.Z,{ref:e,placeholder:"Ux"})}),(0,n.tZ)(L.Z.Item,{label:"Second coordinate",name:"test2",children:(0,n.tZ)(K.Z,{placeholder:"Uy"})}),(0,n.tZ)(L.Z.Item,{label:"Third coordinate",name:"test3",children:(0,n.tZ)(K.Z,{placeholder:"Uz"})})]}),(0,n.BX)(L.Z.Item,{label:(0,n.tZ)(d.Z.Text,{strong:!0,children:"Unknows function"}),children:[(0,n.tZ)(L.Z.Item,{label:"First coordinate",name:"unknown1",children:(0,n.tZ)(K.Z,{placeholder:"Uhx"})}),(0,n.tZ)(L.Z.Item,{label:"Second coordinate",name:"unknown2",children:(0,n.tZ)(K.Z,{placeholder:"Uhy"})}),(0,n.tZ)(L.Z.Item,{label:"Third coordinate",name:"unknown3",children:(0,n.tZ)(K.Z,{placeholder:"Uhz"})})]})]}),(0,n.tZ)(h.Z,{css:I.KP.fullWidth,onClick:u,children:"Finite element function"})]})};var ea=l(32808);let er=(e,t,l,n)=>{let i=e.macros.map(e=>"'"+e+"'").join(", ");ef(t,"<%# Macro -%>\n<%- include('/blobs/macro.edp.ejs', {\n    dimension,\n    type: [".concat(i,"]\n}) -%>\n"),l,n),n((0,k.KJ)({row:((null==l?void 0:l.row)||5)+0,column:0}))},eo=()=>{let[e,t]=(0,a.useState)(!1),[l,i]=(0,a.useState)(!1),{template:r,cursor:o,dispatch:s}=(0,a.useContext)(v.rU),c=(0,a.useCallback)(()=>t(!0),[]),d=(0,a.useCallback)(()=>t(!1),[]),u=(0,a.useCallback)(async e=>{i(!0),er(e,r,o,s),i(!1),t(!1)},[r,o,s]);return(0,n.BX)(n.HY,{children:[(0,n.tZ)(J.ZP,{title:"Macros",visible:e,loading:l,onOk:u,onCancel:d,children:(0,n.tZ)(L.Z.Item,{label:"Type",name:"macros",children:(0,n.tZ)(ea.Z.Group,{options:[{label:"Scalar gradient",value:"scalarGradient"},{label:"Vectorial divergence",value:"vectorialDivergence"},{label:"Vectorial divergence axisymmetric",value:"vectorialDivergenceRZ"},{label:"Vectorial epsilon",value:"vectorialEpsilon"},{label:"Vectorial gradient",value:"vectorialGradient"},{label:"Vectorial R divergence axisymmetric",value:"vectorialRdivergenceRZ"}],style:{display:"flex",flexDirection:"column"}})})}),(0,n.tZ)(h.Z,{css:I.KP.fullWidth,onClick:c,children:"Macros"})]})},es=(e,t,l,n,i)=>{var a,r,o,s,c,d;let u;ef(t,"<%# Solver -%>\n<% const solver = parameters.solver.children[0].value ?? parameters.solver.children[0].default -%>\n<%- include('/blobs/solver.edp.ejs', {\n    solver\n}) -%>",n,i),i((0,k.KJ)({row:((null==n?void 0:n.row)||9)+0,column:0}));try{u=JSON.parse(l)}catch(m){u={}}let h=Object.keys(u.configuration||{}).length;u.configuration={...u.configuration||{},parameters:{index:h+1,title:"Parameters",...(null===(a=u.configuration)||void 0===a?void 0:a.parameters)||{},solver:{advanced:!0,label:"Solver",...(null===(r=u.configuration)||void 0===r?void 0:null===(o=r.parameters)||void 0===o?void 0:o.solver)||{},children:[...(null===(s=null===(c=u.configuration)||void 0===c?void 0:null===(d=c.parameters)||void 0===d?void 0:d.solver)||void 0===s?void 0:s.children)||[],{label:"System resolution",htmlEntity:"select",options:e.solvers.map(e=>({label:e,value:e})),default:"MUMPS"}]}}},i((0,k.j1)(JSON.stringify(u,null,"	")))},ec=()=>{let[e,t]=(0,a.useState)(!1),[l,i]=(0,a.useState)(!1),{template:r,model:o,cursor:s,dispatch:c}=(0,a.useContext)(v.rU),d=(0,a.useCallback)(()=>t(!0),[]),u=(0,a.useCallback)(()=>t(!1),[]),m=(0,a.useCallback)(async e=>{i(!0),es(e,r,o,s,c),i(!1),t(!1)},[r,o,s,c]);return(0,n.BX)(n.HY,{children:[(0,n.tZ)(J.ZP,{title:"Solver",visible:e,loading:l,onOk:m,onCancel:u,children:(0,n.tZ)(L.Z.Item,{name:"solvers",label:"Availables",children:(0,n.tZ)(ea.Z.Group,{options:["UMFPCK","CG","Cholesky","Crout","GMRES","LU","sparsesolver","MUMPS"],style:{display:"flex",flexDirection:"column"}})})}),(0,n.tZ)(h.Z,{css:I.KP.fullWidth,onClick:d,children:"Solver"})]})},ed=e=>{var t,l,n,i,a,r,o,s;let c=null===(t=null===(l=e.scalarResults)||void 0===l?void 0:l.map(e=>"'".concat(e.variable,"'")))||void 0===t?void 0:t.join(", "),d=null===(n=null===(i=e.vectorialResults)||void 0===i?void 0:i.map(e=>"dimension === 2 ? ['".concat(e.variable1,"', '").concat(e.variable2,"', '0'] : ['").concat(e.variable1,"', '").concat(e.variable2,"', '").concat(e.variable3,"']")))||void 0===n?void 0:n.join(", "),u=null===(a=null===(r=e.scalarResults)||void 0===r?void 0:r.map(e=>1))||void 0===a?void 0:a.join(", "),m=null===(o=null===(s=e.vectorialResults)||void 0===s?void 0:s.map(e=>1))||void 0===o?void 0:o.join(", ");return{results:(c?c+", ":"")+(null!=d?d:""),order:(u?u+", ":"")+(null!=m?m:"")}},eu=(e,t,l,n,i)=>{var a,r,o,s,c,d,u,m;let h;if(!e.scalarResults&&!e.vectorialResults||!(null===(a=e.scalarResults)||void 0===a?void 0:a.length)&&!(null===(r=e.vectorialResults)||void 0===r?void 0:r.length))return;let Z=ed(e);ef(t,"<%# Save -%>\n<%- include('/blobs/save.edp.ejs', {\n    solution: {\n        path: run.resultPath,\n        name: '\"Result\"',\n        mesh: mesh.name,\n        sol: [".concat(Z.results,"],\n        dataName: run.results.map(r => r.name),\n        order: [").concat(Z.order,"]\n    }\n}) -%>\n"),n,i),i((0,k.KJ)({row:((null==n?void 0:n.row)||4)+0,column:0}));try{h=JSON.parse(l)}catch(v){h={}}let p=Object.keys(h.configuration||{}).length;h.configuration={...h.configuration||{},run:{index:p+1,title:"Run",...null!==(m=null===(o=h.configuration)||void 0===o?void 0:o.run)&&void 0!==m?m:{},results:[...(null===(s=h.configuration)||void 0===s?void 0:null===(c=s.run)||void 0===c?void 0:c.results)||[],...(null===(d=e.scalarResults)||void 0===d?void 0:d.map(e=>({name:e.name})))||[],...(null===(u=e.vectorialResults)||void 0===u?void 0:u.map(e=>({name:e.name})))||[]]}},i((0,k.j1)(JSON.stringify(h,null,"	")))},em=()=>{let[e,t]=(0,a.useState)(!1),[l,i]=(0,a.useState)(!1),{template:r,model:o,cursor:s,dispatch:c}=(0,a.useContext)(v.rU),d=(0,a.useCallback)(()=>t(!0),[]),u=(0,a.useCallback)(()=>t(!1),[]),m=(0,a.useCallback)(async e=>{i(!0),eu(e,r,o,s,c),i(!1),t(!1)},[r,o,s,c]);return(0,n.BX)(n.HY,{children:[(0,n.BX)(J.ZP,{title:"Save",visible:e,loading:l,onOk:m,onCancel:u,children:[(0,n.tZ)(L.Z.List,{name:"scalarResults",children(e,t,l){let{add:i,remove:a}=t,{errors:r}=l;return(0,n.tZ)(q,{label:"scalar result",add:i,errors:r,children:e.map((e,t)=>(0,n.BX)(Y,{label:"Scalar result",field:e,index:t,remove:a,children:[(0,n.tZ)(L.Z.Item,{name:[e.name,"name"],label:"Display name",rules:[{required:!0}],children:(0,n.tZ)(K.Z,{})}),(0,n.tZ)(L.Z.Item,{name:[e.name,"variable"],label:"Variable name",rules:[{required:!0}],children:(0,n.tZ)(K.Z,{})})]},e.key))})}}),(0,n.tZ)(L.Z.List,{name:"vectorialResults",children(e,t,l){let{add:i,remove:a}=t,{errors:r}=l;return(0,n.tZ)(q,{label:"vectorial result",add:i,errors:r,children:e.map((e,t)=>(0,n.BX)(Y,{label:"Vectorial result",field:e,index:t,remove:a,children:[(0,n.tZ)(L.Z.Item,{name:[e.name,"name"],label:"Display name",rules:[{required:!0}],children:(0,n.tZ)(K.Z,{})}),(0,n.tZ)(L.Z.Item,{name:[e.name,"variable1"],label:"First component variable name",rules:[{required:!0}],children:(0,n.tZ)(K.Z,{})}),(0,n.tZ)(L.Z.Item,{name:[e.name,"variable2"],label:"Second component variable name",rules:[{required:!0}],children:(0,n.tZ)(K.Z,{})}),(0,n.tZ)(L.Z.Item,{name:[e.name,"variable3"],label:"Third component variable name",rules:[{required:!0}],children:(0,n.tZ)(K.Z,{})})]},e.key))})}})]}),(0,n.tZ)(h.Z,{css:I.KP.fullWidth,onClick:d,children:"Save"})]})},eh=(e,t,l,n)=>{e.datas&&e.datas.length&&(ef(t,"<%- include('/blobs/data.edp.ejs', {\n    title: '".concat(e.title,"',\n    path: run.dataPath,\n    fileName: '\"iter_\"+timeIter',\n    dataNames: [").concat(e.datas.map(e=>"'".concat(e.name,"'")).join(", "),"],\n    x: '").concat(e.x,"',\n    ys: [").concat(e.datas.map(e=>"'".concat(e.y,"'")).join(", "),"]\n}) -%>"),l,n),n((0,k.KJ)({row:((null==l?void 0:l.row)||4)+0,column:0})))},eZ=()=>{let e=(0,a.useRef)(null),[t,l]=(0,a.useState)(!1),[i,r]=(0,a.useState)(!1),{template:o,cursor:s,dispatch:c}=(0,a.useContext)(v.rU);(0,a.useEffect)(()=>{e.current&&e.current.focus()});let d=(0,a.useCallback)(()=>l(!1),[]),u=(0,a.useCallback)(()=>l(!0),[]),m=(0,a.useCallback)(async e=>{r(!0),eh(e,o,s,c),r(!1),l(!1)},[o,s,c]);return(0,n.BX)(n.HY,{children:[(0,n.BX)(J.ZP,{title:"Data",visible:t,loading:i,onOk:m,onCancel:d,children:[(0,n.tZ)(L.Z.Item,{label:"Title",name:"title",rules:[{required:!0}],children:(0,n.tZ)(K.Z,{ref:e})}),(0,n.tZ)(L.Z.Item,{label:"X axis variable",name:"x",rules:[{required:!0}],children:(0,n.tZ)(K.Z,{})}),(0,n.tZ)(L.Z.List,{name:"datas",children(e,t,l){let{add:i,remove:a}=t,{errors:r}=l;return(0,n.tZ)(q,{label:"data",add:i,errors:r,children:e.map((e,t)=>(0,n.BX)(Y,{label:"Data",field:e,index:t,remove:a,children:[(0,n.tZ)(L.Z.Item,{name:[e.name,"name"],label:"Display name",rules:[{required:!0}],children:(0,n.tZ)(K.Z,{})}),(0,n.tZ)(L.Z.Item,{name:[e.name,"y"],label:"Y axis variable",rules:[{required:!0}],children:(0,n.tZ)(K.Z,{})})]},e.key))})}})]}),(0,n.tZ)(h.Z,{css:I.KP.fullWidth,onClick:u,children:"Data"})]})},ev=(e,t,l,n)=>{ef(t,"<%# Sensors -%>\n<%- helpers.indent(include('/blobs/sensors.edp.ejs', {\n    path: run.dataPath,\n    x: '".concat(e.x,"',\n    sensors: run.sensors\n}), 2) -%>"),l,n),n((0,k.KJ)({row:((null==l?void 0:l.row)||4)+0,column:0}))},ep=()=>{let e=(0,a.useRef)(null),[t,l]=(0,a.useState)(!1),[i,r]=(0,a.useState)(!1),{template:o,cursor:s,dispatch:c}=(0,a.useContext)(v.rU);(0,a.useEffect)(()=>{e.current&&e.current.focus()});let d=(0,a.useCallback)(()=>l(!0),[]),u=(0,a.useCallback)(()=>l(!1),[]),m=(0,a.useCallback)(async e=>{r(!0),ev(e,o,s,c),r(!1),l(!1)},[o,s,c]);return(0,n.BX)(n.HY,{children:[(0,n.tZ)(J.ZP,{title:"Sensors",visible:t,loading:i,onOk:m,onCancel:u,children:(0,n.tZ)(L.Z.Item,{label:"X axis variable",name:"x",rules:[{required:!0}],children:(0,n.tZ)(K.Z,{ref:e})})}),(0,n.tZ)(h.Z,{css:I.KP.fullWidth,onClick:d,children:"Sensors"})]})},ef=(e,t,l,n)=>{if(l){let i=l.row,a=(e||"").split("\n"),r=[...a.slice(0,i+1),...t.split("\n"),...a.slice(i+1)];n((0,k.zX)(r.join("\n")))}else n((0,k.zX)((e||"")+t))},eb=()=>(0,n.tZ)(n.HY,{children:(0,n.BX)(U.Z,{style:{overflow:"auto",maxHeight:"calc(100% - 443px)"},children:[(0,n.tZ)(U.Z.Panel,{header:"Head",children:(0,n.BX)(u.Z,{direction:"vertical",css:I.KP.fullWidth,children:[(0,n.tZ)(ee,{}),(0,n.tZ)(el,{})]})},"head"),(0,n.tZ)(U.Z.Panel,{header:"Components",children:(0,n.BX)(u.Z,{direction:"vertical",css:I.KP.fullWidth,children:[(0,n.tZ)(F,{}),(0,n.tZ)(z,{}),(0,n.tZ)(Q,{}),(0,n.tZ)(ei,{}),(0,n.tZ)(eo,{}),(0,n.tZ)(ec,{})]})},"components"),(0,n.tZ)(U.Z.Panel,{header:"Results",children:(0,n.BX)(u.Z,{direction:"vertical",css:I.KP.fullWidth,children:[(0,n.tZ)(em,{}),(0,n.tZ)(eZ,{}),(0,n.tZ)(ep,{})]})},"results")]})});var eg=l(43008);let ey=e=>{e((0,k.zX)("try{\n<%# Headers -%>\n<%- include('/blobs/headers.edp.ejs') -%>\n\n<%# Dimension -%>\n<%- include('/blobs/dimensioning.edp.ejs', {\n	dimension\n}) -%>\n\n// WRITE YOUR TEMPLATE HERE\n\n} catch(...) {\n	appendError(\"An internal error occurs\");\n	exit(-1);\n}\n")),e((0,k.j1)(JSON.stringify({category:"Category",name:"My new model",algorithm:"Algorithm",code:"FreeFEM",version:"1.0.0",description:"",configuration:{}},null,"	")+"\n"))},eE=()=>{let{dispatch:e}=(0,a.useContext)(v.rU),t=(0,a.useCallback)(()=>ey(e),[e]);return(0,n.tZ)(m.Z,{title:"New model",children:(0,n.tZ)(h.Z,{icon:(0,n.tZ)(eg.Z,{}),onClick:t})})};var ek=l(67875),ew=l(15360),eC=l(31545),eS=l(39553),ex={gmsh2D:"gmsh2D.geo.ejs",gmsh3D:"gmsh3D.geo.ejs",poisson:"poisson.edp.ejs",linearElasticity:"linearElasticity.edp.ejs",linearElasticityTime:"linearElasticityTime.edp.ejs",linearElasticityModal:"linearElasticityModal.edp.ejs",stokes:"stokes.edp.ejs",navierStokesTime:"navierStokesTime.edp.ejs",thermicDiffusion:"thermicDiffusion.edp.ejs"},eP=l(12271),eT=l(64376);let ej={delete:"Unable to delete model"},eO=async(e,t,l)=>{try{let n=e.models[t],i=e.templates[t];await b.Z.update([{key:"models",type:"array",method:"remove",value:n},{key:"templates",type:"array",method:"remove",value:i}]);let a=eT.Z.deepCopy(e);a.models=[...a.models.slice(0,t),...a.models.slice(t+1)],a.templates=[...a.templates.slice(0,t),...a.templates.slice(t+1)],l.mutateUser(a)}catch(r){throw(0,eP.lt)(ej.delete,r),r}},eX=e=>{let{user:t,index:l,swr:i}=e,r=(0,a.useCallback)(async()=>eO(t,l,i),[t,l,i]);return(0,n.tZ)(p.m1,{onDelete:r})},eM={load:"Unable to load current model"},eD=async(e,t)=>{try{t((0,k.j1)(JSON.stringify(e,null,"	")));let l=e.algorithm,n=ex[l],i=await fetch("/templates/"+n),a=await i.text();t((0,k.zX)(a))}catch(r){(0,eP.lt)(eM.load,r)}},eI=async(e,t,l)=>{try{e.user&&delete e.user,l((0,k.j1)(JSON.stringify(e,null,"	"))),l((0,k.zX)(t))}catch(n){(0,eP.lt)(eM.load,n)}},eB=e=>{let{model:t,setLoading:l,setVisible:i,dispatch:r}=e,o=(0,a.useCallback)(async()=>{l(!0);try{await eD(t,r)}finally{l(!1),i(!1)}},[t,l,i,r]);return(0,n.BX)("div",{css:I.KP.displayFlex,style:{justifyContent:"space-between",alignItems:"center"},children:[t.name,(0,n.tZ)(m.Z,{title:"Open",children:(0,n.tZ)(h.Z,{onClick:o,icon:(0,n.tZ)(ew.Z,{})})})]})},eR=e=>{let{user:t,index:l,swr:i,setLoading:r,setVisible:o,dispatch:s}=e,c=(0,a.useMemo)(()=>t.models[l],[t,l]),d=(0,a.useMemo)(()=>t.templates[l],[t,l]),u=(0,a.useCallback)(async()=>{r(!0);try{await eI(c,d,s)}finally{r(!1),o(!1)}},[c,d,r,o,s]);return(0,n.BX)("div",{css:I.KP.displayFlex,style:{justifyContent:"space-between",alignItems:"center"},children:[c.name,(0,n.BX)("div",{children:[(0,n.tZ)(m.Z,{title:"Open",children:(0,n.tZ)(h.Z,{onClick:u,icon:(0,n.tZ)(ew.Z,{})})}),(0,n.tZ)(eX,{user:t,index:l,swr:i})]})]})},eU=e=>{let{user:t,swr:l}=e,[i,r]=(0,a.useState)(!1),[o,s]=(0,a.useState)(!1),{dispatch:c}=(0,a.useContext)(v.rU),d=(0,a.useCallback)(()=>r(!0),[]),Z=(0,a.useCallback)(()=>r(!1),[]),p=(0,a.useMemo)(()=>eS.Z.map(e=>(0,n.tZ)(eB,{model:e,setLoading:s,setVisible:r,dispatch:c},e.algorithm)),[c]),f=(0,a.useMemo)(()=>t.models.map((e,i)=>(0,n.tZ)(eR,{user:t,index:i,swr:l,setLoading:s,setVisible:r,dispatch:c},e.algorithm)),[t,l,c]);return(0,n.BX)(n.HY,{children:[(0,n.tZ)(J.ZP,{title:"Models browser",visible:i,loading:o,onCancel:Z,children:(0,n.tZ)(ek.Z,{items:[{key:"models",label:"Tanatloc models",children:(0,n.tZ)(u.Z,{direction:"vertical",css:I.KP.fullWidth,children:p})},{key:"personalModels",label:"My models",children:(0,n.tZ)(u.Z,{direction:"vertical",css:I.KP.fullWidth,children:f})}]})}),(0,n.tZ)(m.Z,{title:"Browse existing model",children:(0,n.tZ)(h.Z,{icon:(0,n.tZ)(eC.Z,{}),onClick:d})})]})};var eL=l(60974),eK=l(60219);let eJ={json:"Model definition is not valid",check:"Unable to check",save:"Unable to save"},eN=async(e,t,l,n)=>{let i;try{i=JSON.parse(l)}catch(a){(0,eP.lt)(eJ.json,a);return}try{let r=e.models.find(e=>e.algorithm===i.algorithm);r?eL.Z.confirm({title:"A model with the same algorithm entry already exists. Do you want to override it?",async onOk(){let l=e.models.findIndex(e=>e.algorithm===i.algorithm);await eF(e,t,i,n,l)}}):await eF(e,t,i,n)}catch(o){(0,eP.lt)(eJ.check,o)}},eF=async(e,t,l,n,i)=>{if(void 0===i)try{await b.Z.update([{key:"models",type:"array",method:"append",value:{...l,user:e.id}},{key:"templates",type:"array",method:"append",value:n}]);let a=eT.Z.deepCopy(e);a.models.push(l),t.mutateUser(a)}catch(r){(0,eP.lt)(eJ.save,r)}else try{await b.Z.update([{key:"models",type:"array",method:"set",index:i,value:{...l,user:e.id}},{key:"templates",type:"array",method:"set",index:i,value:n}]);let o=eT.Z.deepCopy(e);o.models[i]=l,t.mutateUser(o)}catch(s){(0,eP.lt)(eJ.save,s)}},eH=e=>{let{user:t,swr:l}=e,[i,r]=(0,a.useState)(!1),[o,s]=(0,a.useState)(!1),{model:c,template:d,templateValid:u,modelValid:Z}=(0,a.useContext)(v.rU);(0,a.useEffect)(()=>{u&&Z?r(!1):r(!0)},[u,Z]);let p=(0,a.useCallback)(async()=>{s(!0),await eN(t,l,c,d),s(!1)},[t,c,d,l]);return(0,n.tZ)(m.Z,{title:"Save",children:(0,n.tZ)(h.Z,{disabled:i,loading:o,icon:(0,n.tZ)(eK.Z,{}),onClick:p})})};var eV=l(5152),eA=l.n(eV);let eq=eA()(()=>Promise.all([l.e(6052),l.e(3700),l.e(4716)]).then(l.bind(l,34716)).catch(e=>{let t=()=>(0,n.BX)("div",{children:[(0,n.tZ)("p",{children:"Unable to load FreeFEM-EJS editor"}),(0,n.tZ)("p",{children:e.message})]});return t}),{loadableGenerated:{webpack:()=>[34716]},ssr:!1}),eW=eA()(()=>Promise.all([l.e(6052),l.e(3700),l.e(1119)]).then(l.bind(l,71119)).catch(e=>{let t=()=>(0,n.BX)("div",{children:[(0,n.tZ)("p",{children:"Unable to load JSON editor"}),(0,n.tZ)("p",{children:e.message})]});return t}),{loadableGenerated:{webpack:()=>[71119]},ssr:!1}),eY=()=>(0,n.BX)("div",{css:B.code,children:[(0,n.tZ)(eq,{}),(0,n.tZ)(eW,{})]}),e_=()=>{let[e,t]=(0,a.useState)(),l=(0,i.useRouter)(),[g,{loadingUser:y,mutateUser:E}]=b.Z.useUser();(0,a.useEffect)(()=>{y||g||l.replace("/")},[g,y,l]),(0,a.useEffect)(()=>{r.Z.warning({message:"This is a beta version",description:(0,n.BX)(n.HY,{children:[(0,n.tZ)("br",{}),"- You may encounter unexpected bugs",(0,n.tZ)("br",{}),"- Some features are not totally functionnal"]}),placement:"top",duration:0})},[]);let k=(0,a.useCallback)(()=>{l.push({pathname:"/dashboard"})},[l]);return y||!g?(0,n.tZ)(f.Z,{}):(0,n.tZ)(v.ZP,{children:(0,n.BX)(o.Z,{css:B.editor,children:[(0,n.BX)(o.Z.Sider,{theme:"light",width:"256",children:[(0,n.tZ)("div",{css:I.KP.logo,children:(0,n.tZ)("img",{src:"/images/logo.svg",alt:"Tanatloc"})}),(0,n.tZ)(s.Z,{mode:"inline",items:[{key:"menu-go-back",disabled:!0,style:{cursor:"unset",margin:"10px 0",paddingLeft:10},label:(0,n.tZ)(p.ks,{onClick:k,children:"Return to dashboard"})},{type:"divider"}]}),(0,n.tZ)(R,{setName:t}),(0,n.tZ)(c.Z,{}),(0,n.tZ)(eb,{})]}),(0,n.BX)(o.Z.Content,{css:I.KP.noScroll,children:[(0,n.tZ)(o.Z.Header,{css:B.header,children:(0,n.BX)("div",{children:[(0,n.tZ)(d.Z.Text,{strong:!0,children:e}),(0,n.BX)(u.Z,{children:[(0,n.tZ)(eE,{}),(0,n.tZ)(eU,{user:{id:g.id,models:g.models,templates:g.templates},swr:{mutateUser:E}}),(0,n.tZ)(eH,{user:{id:g.id,models:g.models},swr:{mutateUser:E}}),(0,n.tZ)(m.Z,{title:"Coming soon",children:(0,n.tZ)(h.Z,{disabled:!0,icon:(0,n.tZ)(Z.Z,{})})})]})]})}),(0,n.tZ)(eY,{})]})]})})},ez=()=>(0,n.tZ)(e_,{});var eG=ez}},function(e){e.O(0,[2649,4654,5813,1577,3239,2969,3624,3363,1417,974,4119,6859,1527,7450,9861,9774,2888,179],function(){return e(e.s=31832)}),_N_E=e.O()}]);