"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[9343],{18878:function(e,a,t){t.d(a,{Z:function(){return r}});var i=t(81758),s=t(67294),n=t(16647),r={useOrganizations:()=>{var e;let{data:a,error:t,mutate:r}=(0,i.ZP)("/api/organizations",n._),o=null!==(e=null==a?void 0:a.organizations)&&void 0!==e?e:[],l=(0,s.useCallback)(async e=>{let a=[...o,{...e,pendingowners:[],users:[],pendingusers:[],groups:[]}];await r({organizations:a})},[o,r]),d=(0,s.useCallback)(async e=>{let a=o.filter(a=>a.id!==e.id);await r({organizations:a})},[o,r]),u=(0,s.useCallback)(async e=>{let a=o.map(a=>(a.id===e.id&&(a={...a,...e}),a));await r({organizations:a})},[o,r]);return[o,{addOneOrganization:l,delOneOrganization:d,mutateOneOrganization:u,errorOrganizations:t,loadingOrganizations:!a}]},add:async e=>(await (0,n.R)("/api/organization",{method:"POST",headers:{Accept:"application/json"},body:JSON.stringify(e)})).json(),update:async(e,a)=>{await (0,n.R)("/api/organization",{method:"PUT",body:JSON.stringify({organization:e,data:a})})},del:async e=>{await (0,n.R)("/api/organization",{method:"DELETE",body:JSON.stringify(e)})},accept:async e=>{await (0,n.R)("/api/organization/"+e.id,{method:"PUT"})},decline:async e=>{await (0,n.R)("/api/organization/"+e.id,{method:"POST"})},quit:async e=>{await (0,n.R)("/api/organization/"+e.id,{method:"DELETE"})}}},64566:function(e,a,t){t.d(a,{Z:function(){return s}});var i=t(16647),s={add:async e=>(await (0,i.R)("/api/userModel",{method:"POST",body:JSON.stringify({userModel:e})})).json(),update:async(e,a)=>{await (0,i.R)("/api/userModel",{method:"PUT",body:JSON.stringify({userModel:e,data:a})})},del:async e=>{await (0,i.R)("/api/userModel",{method:"DELETE",body:JSON.stringify({userModel:e})})}}},32238:function(e,a,t){t.d(a,{Z:function(){return r}});var i=t(81758),s=t(67294),n=t(16647),r={useWorkspaces:()=>{var e;let{data:a,error:t,mutate:r}=(0,i.ZP)("/api/workspace",n._),o=null!==(e=null==a?void 0:a.workspaces)&&void 0!==e?e:[],l=(0,s.useCallback)(async e=>{let a=[...o,e];await r({workspaces:a})},[o,r]),d=(0,s.useCallback)(async e=>{let a=o.filter(a=>a.id!==e.id);await r({workspaces:a})},[o,r]),u=(0,s.useCallback)(async e=>{let a=o.map(a=>(a.id===e.id&&(a={...a,...e}),a));await r({workspaces:a})},[o,r]);return[o,{addOneWorkspace:l,delOneWorkspace:d,mutateOneWorkspace:u,errorWorkspaces:t,loadingWorkspaces:!a}]},add:async e=>(await (0,n.R)("/api/workspace",{method:"POST",headers:{Accept:"application/json"},body:JSON.stringify(e)})).json(),update:async(e,a)=>{await (0,n.R)("/api/workspace",{method:"PUT",body:JSON.stringify({workspace:e,data:a})})},del:async e=>{await (0,n.R)("/api/workspace",{method:"DELETE",body:JSON.stringify(e)})}}},91277:function(e,a,t){var i=t(85893),s=t(67294),n=t(11163),r=t(79505),o=t(56557),l=t(90941),d=t(40750),u=t(53533),c=t(88350),p=t(37643),h=t.n(p),g=t(97992),y=t(49),m=t(25946),k=t(91125),w=t(34883),f=t(20659),v=t(56853),b=t(32238),j=t(64566),O=t(58650),S=t.n(O);let x={share:"Unable to share"},C=async(e,a,t,i,s,n)=>{if(e){await b.Z.update({id:e.id},[{key:"groups",value:i},{key:"users",value:s}]);let a=f.Z.deepCopy(e);a.groups=i.map(e=>({id:e})),a.users=s.map(e=>({id:e})),await n.mutateOneWorkspace(a)}else if(a){await v.Z.update({id:a.id},[{key:"groups",value:i},{key:"users",value:s}]);let e=f.Z.deepCopy(a);e.groups=i.map(e=>({id:e})),e.users=s.map(e=>({id:e})),await n.mutateOneProject(e)}else{await j.Z.update({id:t.id},[{key:"groups",value:i},{key:"users",value:s}]);let e=f.Z.deepCopy(t);e.groups=i.map(e=>({id:e})),e.users=s.map(e=>({id:e})),await n.mutateUser(e)}},Z=e=>{let a=e.email;if(e.lastname||e.firstname){var t;a=(e.lastname?e.lastname+" ":"")+(null!==(t=e.firstname)&&void 0!==t?t:"")}return a};a.ZP=e=>{let{disabled:a,workspace:t,project:p,userModel:f,organizations:v,swr:b,style:j}=e,[O,z]=(0,s.useState)(!1),[E,T]=(0,s.useState)(!1),[N,P]=(0,s.useState)([]),[R,W]=(0,s.useState)([]),[D,L]=(0,s.useState)([]),[J,M]=(0,s.useState)([]),{dispatch:_}=(0,s.useContext)(g.uj),U=(0,n.useRouter)();(0,s.useEffect)(()=>{var e;let a=null!==(e=null!=t?t:p)&&void 0!==e?e:f,i=null==a?void 0:a.groups.map(e=>e.id),s=null==a?void 0:a.users.map(e=>e.id);L(null!=i?i:[]),M(null!=s?s:[])},[t,p,f]),(0,s.useEffect)(()=>{let e=v.map(e=>{let a=e.groups.map(e=>({key:e.id,title:e.name,value:e.id,type:"group"}));return{key:e.id,title:e.name,value:e.id,disabled:!0,checkable:!1,children:a}}),a=[];v.forEach(e=>{e.owners.forEach(e=>{a.push({key:e.id,title:Z(e),value:e.id,type:"user"})}),e.users.forEach(e=>{a.push({key:e.id,title:Z(e),value:e.id,type:"user"})}),e.groups.forEach(e=>{e.users.forEach(e=>{a.push({key:e.id,title:Z(e),value:e.id,type:"user"})})})});let t=a.filter((e,a,t)=>t.findIndex(a=>a.key===e.key)===a);P(e),W(t)},[v]);let A=(0,s.useCallback)(()=>{(0,m.u)(async()=>{await U.push({pathname:"/dashboard",query:{page:"organizations"}})})},[U]),F=(0,s.useMemo)(()=>{let e="Share this ";return t?e+="workspace":p?e+="project":e+="user model",e+=" with organizations groups"},[t,p]),B=(0,s.useMemo)(()=>{let e="Share this ";return t?e+="workspace":p?e+="project":e+="user model",e+=" with organizations users"},[t,p]),H=(0,s.useMemo)(()=>N.length?(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(r.Z.Item,{label:(0,i.jsx)(i.Fragment,{children:F}),children:(0,i.jsx)(o.Z,{multiple:!0,treeCheckable:!0,treeDefaultExpandAll:!0,showCheckedStrategy:o.Z.SHOW_ALL,placeholder:"Select groups",dropdownStyle:{maxHeight:400,overflow:"auto"},className:S().fullWidth,treeData:N,value:D,onChange:L})}),(0,i.jsx)(r.Z.Item,{label:(0,i.jsx)(i.Fragment,{children:B}),children:(0,i.jsx)(o.Z,{multiple:!0,treeCheckable:!0,treeDefaultExpandAll:!0,showCheckedStrategy:o.Z.SHOW_ALL,placeholder:"Select users",dropdownStyle:{maxHeight:400,overflow:"auto"},className:S().fullWidth,treeData:R,value:J,onChange:M})})]}):(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)("br",{}),(0,i.jsx)(l.Z.Text,{strong:!0,children:"There is no organization for now"}),(0,i.jsx)("br",{}),(0,i.jsxs)(l.Z.Text,{children:["You can create organizations and groups in the"," ",(0,i.jsx)(k.Qj,{onClick:A,children:"Organization menu"}),"."]})]}),[F,B,N,R,D,J,A]),I=(0,s.useCallback)(()=>z(!0),[]),q=(0,s.useCallback)(()=>z(!1),[]),Q=(0,s.useCallback)(async()=>{T(!0);try{await C(t,p,f,D,J,b),T(!1),z(!1)}catch(e){throw _((0,y.iT)({title:x.share,err:e})),T(!1),e}},[t,p,f,D,J,b,_]),Y=(0,s.useMemo)(()=>{let e="Share ";return t?e+="workspace":p?e+="project":e+="user model",e},[t,p]),G=(0,s.useMemo)(()=>{let e="";return t?e+="Workspace":p?e+="Project":e+="User model",e+=": ",t?e+=t.name:p?e+=p.title:e+=null==f?void 0:f.model.name,e},[t,p,f]);return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(d.Z,{title:"Share",children:(0,i.jsx)(u.ZP,{className:"".concat(S().noBackground," ").concat((null==j?void 0:j.buttonLight)?S().textLight:""," ").concat((null==j?void 0:j.buttonDark)?S().textDark:""," ").concat((null==j?void 0:j.buttonBordered)?"":S().noBorder," ").concat(h()()?S().displayNone:""),id:"share",disabled:a,type:!a||(null==j?void 0:j.buttonBordered)?void 0:"link",icon:(0,i.jsx)(c.Z,{}),onClick:I},"share")}),(0,i.jsxs)(w.ZP,{title:Y,visible:O,onCancel:q,onOk:Q,loading:E,children:[(0,i.jsx)(l.Z.Title,{level:5,children:G}),H]})]})}}}]);