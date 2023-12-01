(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[9305],{29305:function(e,t,a){"use strict";a.r(t),a.d(t,{_exportCSV:function(){return Z},errors:function(){return N}});var l=a(85893),n=a(67294),o=a(31059),i=a(1825),s=a(77834),r=a(74048),d=a(2307),c=a(34700),u=a(56880),f=a(29009),m=a(75244),x=a(14195),h=a(3023),b=a(75358),k=a(26050),p=a(33558),y=a(68929),v=a.n(y),C=a(8061),j=a(54509),_=a(54523),S=a(78804),g=a(97221),w=a(81229),E=a(85274),M=a.n(E);let N={download:"Unable to download CSV"},Z=function(e,t,a,l){let n=arguments.length>4&&void 0!==arguments[4]?arguments[4]:";",o="";o="x"+n+a.join(n)+"\n",t.forEach(e=>{o+=e.x,null==l||l.forEach(t=>{void 0!==e[t]&&(o+=n+e[t])}),o+="\n"});let i=e.name+".csv",s=new File([o],i,{type:"text/csv"}),r=window.URL.createObjectURL(s),d=document.createElement("a");d.href=r,d.setAttribute("download",i),d.click(),d.remove()},D=e=>{let{name:t,index:a,columnSelection:i,setColumnSelection:s}=e,d=(0,n.useCallback)(e=>{let t=e.target.checked,l=[...i];l[a]=t,s(l)},[a,i,s]);return(0,l.jsxs)(r.default,{className:M().tableHead,children:[t,(0,l.jsx)(o.default,{"data-testid":"table-checkbox",checked:i[a],onChange:d,children:(0,l.jsx)(c.Z,{style:{fontSize:20}})})]})};t.default=e=>{let{simulation:t}=e,[a,o]=(0,n.useState)(),[r,c]=(0,n.useState)(),[y,E]=(0,n.useState)(),[I,T]=(0,n.useState)(),[q,z]=(0,n.useState)(),[B,H]=(0,n.useState)([!0]),[K,L]=(0,n.useState)(),[U,V]=(0,n.useState)(!1),{data:F,dispatch:O}=(0,n.useContext)(_.ZB),{dispatch:P}=(0,n.useContext)(C.uj),[R]=w.Z.useSimulation(null==t?void 0:t.id);(0,n.useEffect)(()=>{let e=null==R?void 0:R.tasks;if(!e){o(void 0),E(void 0),T(void 0);return}let t=e.map(e=>e.datas).filter(e=>e).flatMap(e=>e);if(!(null==t?void 0:t.length)||!t[0].names){E(void 0),T(void 0);return}t.sort((e,t)=>e.x-t.x);let a=t[0].title,l=t.map(e=>e.names).flatMap(e=>e).filter((e,t,a)=>a.findIndex(t=>t===e)===t),n=l.map(e=>v()(e)),i=[];t.forEach((e,t)=>{e.names.forEach((a,l)=>{let n=i.find(t=>t.x===e.x);n?n[v()(a)]=e.ys[l]:i.push({key:t,x:e.x,[v()(a)]:e.ys[l]})})}),c(a),o(i),E(l),T(n)},[R]),(0,n.useEffect)(()=>{if(!a||!y||!I){z(void 0);return}let e=y.map((e,t)=>({align:"center",className:"column"+(B[t]?" selected":""),title:(0,l.jsx)(D,{name:e,index:t,columnSelection:B,setColumnSelection:H}),dataIndex:I[t],key:I[t]}));e.unshift({align:"center",title:null!=r?r:"Iteration",dataIndex:"x",key:"x",fixed:"left"}),z(e)},[r,a,y,I,B]),(0,n.useEffect)(()=>{if(!a||!y||!I){L(void 0);return}let e=[],t=g.Z.colorGenerator(B.length),n=B.map((a,n)=>{if(!a)return;let o=I[n],i=y[n],s=t[n];return e.push(o),(0,l.jsx)(u.x,{name:i,type:"monotone",dataKey:o,stroke:s,strokeWidth:2},o)}).filter(e=>e),o=a.map(t=>{let a={x:t.x};return e.forEach(e=>{t[e]&&(a[e]=t[e])}),a}).filter(e=>e),i=Math.min(...e.flatMap(e=>o.map(t=>t[e]))),s=Math.max(...e.flatMap(e=>o.map(t=>t[e]))),r=s-i;L({data:o,min:i,max:s,domainMin:i-.1*r,domainMax:s+.1*r,lines:n})},[a,y,I,B]);let W=(0,n.useCallback)(()=>O((0,S.a_)(!1)),[O]),A=(0,n.useCallback)(()=>{V(!0);try{Z(t,a,y,I,"	")}catch(e){P((0,j.iT)({title:N.download,err:e}))}finally{V(!1)}},[t,a,y,I,P]),G=(0,n.useCallback)(()=>{V(!0);try{Z(t,a,y,I,",")}catch(e){P((0,j.iT)({title:N.download,err:e}))}finally{V(!1)}},[t,a,y,I,P]),Y=(0,n.useCallback)(()=>{V(!0);try{Z(t,a,y,I)}catch(e){P((0,j.iT)({title:N.download,err:e}))}finally{V(!1)}},[t,a,y,I,P]),J=(0,n.useCallback)(e=>Number(e).toExponential(3),[]);return t&&a&&y&&I?(0,l.jsx)(i.Z,{title:"Data visualization",placement:"bottom",closable:!0,onClose:W,open:F,mask:!1,maskClosable:!1,height:"50vh",styles:{body:{height:"100%",overflow:"hidden"}},extra:(0,l.jsx)(s.default.Button,{loading:U,disabled:!a,menu:{items:[{label:"Default separator: semicolon",key:"semicolon",disabled:!0},{label:"Separator: tab",key:"tab",onClick:A},{label:"Separator: comma",key:",",onClick:G}]},onClick:Y,children:"Export CSV"}),children:(0,l.jsxs)("div",{className:M().container,children:[(0,l.jsx)("div",{className:M().tableContainer,children:(0,l.jsx)(d.Z,{size:"small",sticky:!0,pagination:!1,dataSource:a,columns:q,scroll:{x:(((null==q?void 0:q.length)?+q.length:1)-1)*200}})}),(0,l.jsx)(f.h,{width:"49%",height:"100%",children:(0,l.jsxs)(m.w,{data:null==K?void 0:K.data,margin:{top:0,right:40,left:40,bottom:0},children:[(0,l.jsx)(x.q,{strokeDasharray:"3 3"}),(0,l.jsx)(h.K,{dataKey:"x"}),(0,l.jsx)(b.B,{domain:K?[K.domainMin,K.domainMax]:[-1,1],tickFormatter:J}),(0,l.jsx)(k.u,{}),(0,l.jsx)(p.D,{}),null==K?void 0:K.lines]})})]})}):null}},85274:function(e){e.exports={variables:'"@/styles/variables.css"',colorPrimary:"#fad114",colorPrimary55:"#fad11455",data:"data_data__6TY8E",button:"data_button__WZosy",container:"data_container__qk8DL",tableContainer:"data_tableContainer__jfr5q",tableHead:"data_tableHead__OyI2w"}}}]);