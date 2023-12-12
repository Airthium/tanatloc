"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[4278],{91326:function(e,a,t){t.d(a,{Z:function(){return p}});var i=t(59734),n=t(67294),r=t(948);let s=async e=>{let a=await (0,r.R)("/api/organization",{method:"POST",headers:{Accept:"application/json"},body:JSON.stringify(e)});return a.json()},o=async(e,a)=>{await (0,r.R)("/api/organization",{method:"PUT",body:JSON.stringify({organization:e,data:a})})},l=async e=>{await (0,r.R)("/api/organization",{method:"DELETE",body:JSON.stringify(e)})},d=async e=>{await (0,r.R)("/api/organization/"+e.id,{method:"PUT"})},u=async e=>{await (0,r.R)("/api/organization/"+e.id,{method:"POST"})},c=async e=>{await (0,r.R)("/api/organization/"+e.id,{method:"DELETE"})};var p={useOrganizations:()=>{var e;let{data:a,error:t,mutate:s}=(0,i.ZP)("/api/organizations",r._),o=null!==(e=null==a?void 0:a.organizations)&&void 0!==e?e:[],l=(0,n.useCallback)(async e=>{let a=[...o,{...e,pendingowners:[],users:[],pendingusers:[],groups:[]}];await s({organizations:a})},[o,s]),d=(0,n.useCallback)(async e=>{let a=o.filter(a=>a.id!==e.id);await s({organizations:a})},[o,s]),u=(0,n.useCallback)(async e=>{let a=o.map(a=>(a.id===e.id&&(a={...a,...e}),a));await s({organizations:a})},[o,s]);return[o,{addOneOrganization:l,delOneOrganization:d,mutateOneOrganization:u,errorOrganizations:t,loadingOrganizations:!a}]},add:s,update:o,del:l,accept:d,decline:u,quit:c}},2524:function(e,a,t){t.d(a,{Z:function(){return o}});var i=t(948);let n=async e=>{let a=await (0,i.R)("/api/userModel",{method:"POST",body:JSON.stringify({userModel:e})});return a.json()},r=async(e,a)=>{await (0,i.R)("/api/userModel",{method:"PUT",body:JSON.stringify({userModel:e,data:a})})},s=async e=>{await (0,i.R)("/api/userModel",{method:"DELETE",body:JSON.stringify({userModel:e})})};var o={add:n,update:r,del:s}},55043:function(e,a,t){t.d(a,{Z:function(){return d}});var i=t(59734),n=t(67294),r=t(948);let s=async e=>{let a=await (0,r.R)("/api/workspace",{method:"POST",headers:{Accept:"application/json"},body:JSON.stringify(e)});return a.json()},o=async(e,a)=>{await (0,r.R)("/api/workspace",{method:"PUT",body:JSON.stringify({workspace:e,data:a})})},l=async e=>{await (0,r.R)("/api/workspace",{method:"DELETE",body:JSON.stringify(e)})};var d={useWorkspaces:()=>{var e;let{data:a,error:t,mutate:s}=(0,i.ZP)("/api/workspace",r._),o=null!==(e=null==a?void 0:a.workspaces)&&void 0!==e?e:[],l=(0,n.useCallback)(async e=>{let a=[...o,e];await s({workspaces:a})},[o,s]),d=(0,n.useCallback)(async e=>{let a=o.filter(a=>a.id!==e.id);await s({workspaces:a})},[o,s]),u=(0,n.useCallback)(async e=>{let a=o.map(a=>(a.id===e.id&&(a={...a,...e}),a));await s({workspaces:a})},[o,s]);return[o,{addOneWorkspace:l,delOneWorkspace:d,mutateOneWorkspace:u,errorWorkspaces:t,loadingWorkspaces:!a}]},add:s,update:o,del:l}},17072:function(e,a,t){var i=t(85893),n=t(67294),r=t(11163),s=t(65400),o=t.n(s),l=t(97538),d=t(94055),u=t(42378),c=t(53740),p=t(69650),h=t(59134),g=t.n(h),y=t(8061),m=t(54509),k=t(64352),w=t(88053),f=t(51274),v=t(97221),b=t(8798),j=t(55043),O=t(2524),S=t(35304),x=t.n(S);let C={share:"Unable to share"},z=async(e,a,t,i,n,r)=>{if(e){await j.Z.update({id:e.id},[{key:"groups",value:i},{key:"users",value:n}]);let a=v.Z.deepCopy(e);a.groups=i.map(e=>({id:e})),a.users=n.map(e=>({id:e})),await r.mutateOneWorkspace(a)}else if(a){await b.Z.update({id:a.id},[{key:"groups",value:i},{key:"users",value:n}]);let e=v.Z.deepCopy(a);e.groups=i.map(e=>({id:e})),e.users=n.map(e=>({id:e})),await r.mutateOneProject(e)}else{await O.Z.update({id:t.id},[{key:"groups",value:i},{key:"users",value:n}]);let e=v.Z.deepCopy(t);e.groups=i.map(e=>({id:e})),e.users=n.map(e=>({id:e})),await r.mutateUser(e)}},E=e=>{let a=e.email;if(e.lastname||e.firstname){var t;a=(e.lastname?e.lastname+" ":"")+(null!==(t=e.firstname)&&void 0!==t?t:"")}return a};a.ZP=e=>{let{disabled:a,workspace:t,project:s,userModel:h,organizations:v,swr:b,style:j}=e,[O,S]=(0,n.useState)(!1),[Z,P]=(0,n.useState)(!1),[T,N]=(0,n.useState)([]),[R,W]=(0,n.useState)([]),[D,L]=(0,n.useState)([]),[J,M]=(0,n.useState)([]),{dispatch:_}=(0,n.useContext)(y.uj),U=(0,r.useRouter)();(0,n.useEffect)(()=>{var e;let a=null!==(e=null!=t?t:s)&&void 0!==e?e:h,i=null==a?void 0:a.groups.map(e=>e.id),n=null==a?void 0:a.users.map(e=>e.id);L(null!=i?i:[]),M(null!=n?n:[])},[t,s,h]),(0,n.useEffect)(()=>{let e=v.map(e=>{let a=e.groups.map(e=>({key:e.id,title:e.name,value:e.id,type:"group"}));return{key:e.id,title:e.name,value:e.id,disabled:!0,checkable:!1,children:a}}),a=[];v.forEach(e=>{e.owners.forEach(e=>{a.push({key:e.id,title:E(e),value:e.id,type:"user"})}),e.users.forEach(e=>{a.push({key:e.id,title:E(e),value:e.id,type:"user"})}),e.groups.forEach(e=>{e.users.forEach(e=>{a.push({key:e.id,title:E(e),value:e.id,type:"user"})})})});let t=a.filter((e,a,t)=>t.findIndex(a=>a.key===e.key)===a);N(e),W(t)},[v]);let A=(0,n.useCallback)(()=>{(0,k.u)(async()=>{await U.push({pathname:"/dashboard",query:{page:"organizations"}})})},[U]),F=(0,n.useMemo)(()=>{let e="Share this ";return t?e+="workspace":s?e+="project":e+="user model",e+=" with organizations groups"},[t,s]),B=(0,n.useMemo)(()=>{let e="Share this ";return t?e+="workspace":s?e+="project":e+="user model",e+=" with organizations users"},[t,s]),H=(0,n.useMemo)(()=>T.length?(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(l.Z.Item,{label:(0,i.jsx)(i.Fragment,{children:F}),children:(0,i.jsx)(u.ZP,{multiple:!0,treeCheckable:!0,treeDefaultExpandAll:!0,showCheckedStrategy:u.ZP.SHOW_ALL,placeholder:"Select groups",dropdownStyle:{maxHeight:400,overflow:"auto"},className:x().fullWidth,treeData:T,value:D,onChange:L})}),(0,i.jsx)(l.Z.Item,{label:(0,i.jsx)(i.Fragment,{children:B}),children:(0,i.jsx)(u.ZP,{multiple:!0,treeCheckable:!0,treeDefaultExpandAll:!0,showCheckedStrategy:u.ZP.SHOW_ALL,placeholder:"Select users",dropdownStyle:{maxHeight:400,overflow:"auto"},className:x().fullWidth,treeData:R,value:J,onChange:M})})]}):(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)("br",{}),(0,i.jsx)(c.Z.Text,{strong:!0,children:"There is no organization for now"}),(0,i.jsx)("br",{}),(0,i.jsxs)(c.Z.Text,{children:["You can create organizations and groups in the"," ",(0,i.jsx)(w.Qj,{onClick:A,children:"Organization menu"}),"."]})]}),[F,B,T,R,D,J,A]),I=(0,n.useCallback)(()=>S(!0),[]),q=(0,n.useCallback)(()=>S(!1),[]),Q=(0,n.useCallback)(async()=>{P(!0);try{await z(t,s,h,D,J,b),P(!1),S(!1)}catch(e){throw _((0,m.iT)({title:C.share,err:e})),P(!1),e}},[t,s,h,D,J,b,_]),Y=(0,n.useMemo)(()=>{let e="Share ";return t?e+="workspace":s?e+="project":e+="user model",e},[t,s]),G=(0,n.useMemo)(()=>{let e="";return t?e+="Workspace":s?e+="Project":e+="User model",e+=": ",t?e+=t.name:s?e+=s.title:e+=null==h?void 0:h.model.name,e},[t,s,h]);return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(d.default,{title:"Share",children:(0,i.jsx)(o(),{className:"".concat(x().noBackground," ").concat((null==j?void 0:j.buttonLight)?x().textLight:""," ").concat((null==j?void 0:j.buttonDark)?x().textDark:""," ").concat((null==j?void 0:j.buttonBordered)?"":x().noBorder," ").concat(g()()?x().displayNone:""),id:"share",disabled:a,type:!a||(null==j?void 0:j.buttonBordered)?void 0:"link",icon:(0,i.jsx)(p.Z,{}),onClick:I},"share")}),(0,i.jsxs)(f.ZP,{title:Y,visible:O,onCancel:q,onOk:Q,loading:Z,children:[(0,i.jsx)(c.Z.Title,{level:5,children:G}),H]})]})}}}]);