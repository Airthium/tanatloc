(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[4830],{4830:function(e,t,a){"use strict";a.r(t),a.d(t,{_exportCSV:function(){return M},errors:function(){return Z}});var l=a(85893),n=a(67294),o=a(26713),i=a(32808),s=a(97183),r=a(83062),c=a(71577),d=a(85265),u=a(83159),m=a(17521),x=a(56299),h=a(56880),f=a(9253),b=a(65310),k=a(14195),p=a(3023),y=a(75358),C=a(14888),v=a(19264),j=a(96486),S=a(9242),_=a(87782),g=a(72616),w=a(93515),E=a.n(w);let Z={download:"Unable to download CSV"},M=function(e,t,a,l){let n=arguments.length>4&&void 0!==arguments[4]?arguments[4]:";",o="";o="x"+n+a.join(n)+"\n",t.forEach(e=>{o+=e.x,null==l||l.forEach(t=>{void 0!==e[t]&&(o+=n+e[t])}),o+="\n"});let i=e.name+".csv",s=new File([o],i,{type:"text/csv"}),r=window.URL.createObjectURL(s),c=document.createElement("a");c.href=r,c.setAttribute("download",i),c.click(),c.remove()},N=e=>{let{name:t,index:a,columnSelection:s,setColumnSelection:r}=e,c=(0,n.useCallback)(e=>{let t=e.target.checked,l=[...s];l[a]=t,r(l)},[a,s,r]);return(0,l.jsxs)(o.Z,{className:E().tableHead,children:[t,(0,l.jsx)(i.Z,{"data-testid":"table-checkbox",checked:s[a],onChange:c,children:(0,l.jsx)(x.Z,{style:{fontSize:20}})})]})};t.default=e=>{let{simulation:t}=e,[a,o]=(0,n.useState)(!1),[i,w]=(0,n.useState)(),[D,z]=(0,n.useState)(),[H,I]=(0,n.useState)(),[K,V]=(0,n.useState)(),[B,F]=(0,n.useState)(),[P,U]=(0,n.useState)([!0]),[G,L]=(0,n.useState)(),[Q,R]=(0,n.useState)(!1),[q]=g.Z.useSimulation(null==t?void 0:t.id);(0,n.useEffect)(()=>{let e=null==q?void 0:q.tasks;if(!e){w(void 0),I(void 0),V(void 0);return}let t=e.map(e=>e.datas).filter(e=>e).flatMap(e=>e);if(!t.length||!t[0].names){I(void 0),V(void 0);return}t.sort((e,t)=>e.x-t.x);let a=t[0].title,l=t.map(e=>e.names).flatMap(e=>e).filter((e,t,a)=>a.findIndex(t=>t===e)===t),n=l.map(e=>(0,j.camelCase)(e)),o=[];t.forEach((e,t)=>{e.names.forEach((a,l)=>{let n=o.find(t=>t.x===e.x);n?n[(0,j.camelCase)(a)]=e.ys[l]:o.push({key:t,x:e.x,[(0,j.camelCase)(a)]:e.ys[l]})})}),z(a),w(o),I(l),V(n)},[q]),(0,n.useEffect)(()=>{if(!i||!H||!K){F(void 0);return}let e=H.map((e,t)=>({align:"center",className:"column"+(P[t]?" selected":""),title:(0,l.jsx)(N,{name:e,index:t,columnSelection:P,setColumnSelection:U}),dataIndex:K[t],key:K[t]}));e.unshift({align:"center",title:null!=D?D:"Iteration",dataIndex:"x",key:"x",fixed:"left"}),F(e)},[D,i,H,K,P]),(0,n.useEffect)(()=>{if(!i||!H||!K){L(void 0);return}let e=[],t=_.Z.colorGenerator(P.length),a=P.map((a,n)=>{if(!a)return;let o=K[n],i=H[n],s=t[n];return e.push(o),(0,l.jsx)(h.x,{name:i,type:"monotone",dataKey:o,stroke:s,strokeWidth:2},o)}).filter(e=>e),n=i.map(t=>{let a={x:t.x};return e.forEach(e=>{t[e]&&(a[e]=t[e])}),a}).filter(e=>e),o=Math.min(...e.flatMap(e=>n.map(t=>t[e]))),s=Math.max(...e.flatMap(e=>n.map(t=>t[e]))),r=s-o,c=o-.1*r,d=s+.1*r;L({data:n,min:o,max:s,domainMin:c,domainMax:d,lines:a})},[i,H,K,P]);let A=(0,n.useCallback)(()=>o(!0),[]),J=(0,n.useCallback)(()=>o(!1),[]),O=(0,n.useCallback)(()=>{R(!0);try{M(t,i,H,K,"	")}catch(e){(0,S.lt)(Z.download,e)}finally{R(!1)}},[t,i,H,K]),W=(0,n.useCallback)(()=>{R(!0);try{M(t,i,H,K,",")}catch(e){(0,S.lt)(Z.download,e)}finally{R(!1)}},[t,i,H,K]),T=(0,n.useCallback)(()=>{R(!0);try{M(t,i,H,K)}catch(e){(0,S.lt)(Z.download,e)}finally{R(!1)}},[t,i,H,K]),X=(0,n.useCallback)(e=>Number(e).toExponential(3),[]);return t&&i&&H&&K?(0,l.jsx)(s.Z,{className:E().data,children:(0,l.jsxs)(s.Z.Content,{children:[(0,l.jsx)(r.Z,{title:"Data visualization",children:(0,l.jsx)(c.ZP,{type:"primary",icon:(0,l.jsx)(x.Z,{}),onClick:A,className:E().button})}),(0,l.jsx)(d.Z,{title:"Data visualization",placement:"bottom",closable:!0,onClose:J,open:a,mask:!1,maskClosable:!1,height:"50vh",bodyStyle:{height:"100%",overflow:"hidden"},extra:(0,l.jsx)(u.Z.Button,{loading:Q,disabled:!i,menu:{items:[{label:"Default separator: semicolon",key:"semicolon",disabled:!0},{label:"Separator: tab",key:"tab",onClick:O},{label:"Separator: comma",key:",",onClick:W}]},onClick:T,children:"Export CSV"}),children:(0,l.jsxs)("div",{className:E().container,children:[(0,l.jsx)("div",{className:E().tableContainer,children:(0,l.jsx)(m.Z,{size:"small",sticky:!0,pagination:!1,dataSource:i,columns:B,scroll:{x:(((null==B?void 0:B.length)?+B.length:1)-1)*200}})}),(0,l.jsx)(f.h,{width:"49%",height:"100%",children:(0,l.jsxs)(b.w,{data:null==G?void 0:G.data,margin:{top:0,right:40,left:40,bottom:0},children:[(0,l.jsx)(k.q,{strokeDasharray:"3 3"}),(0,l.jsx)(p.K,{dataKey:"x"}),(0,l.jsx)(y.B,{domain:G?[G.domainMin,G.domainMax]:[-1,1],tickFormatter:X}),(0,l.jsx)(C.u,{}),(0,l.jsx)(v.D,{}),null==G?void 0:G.lines]})})]})})]})}):null}},93515:function(e){e.exports={variables:'"@/styles/variables.css"',colorPrimary:"#fad114",colorPrimary55:"#fad11455",data:"data_data__DrbCE",button:"data_button__tQKGw",container:"data_container__VQ2cM",tableContainer:"data_tableContainer__dpes9",tableHead:"data_tableHead__9HFBJ"}}}]);