"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[331],{41686:function(n,r,t){t.d(r,{Z:function(){return u}});var e=t(47568),i=t(20414),a=t(87492),o=function(){var n=(0,e.Z)((function(n,r){var t;return(0,i.__generator)(this,(function(e){switch(e.label){case 0:return t={},[4,(0,a.R)("/api/avatar",(t.method="POST",t.headers={Accept:"application/json"},t.body=JSON.stringify({file:n,project:r}),t))];case 1:return[2,e.sent().json()]}}))}));return function(r,t){return n.apply(this,arguments)}}(),u={add:o}},24443:function(n,r,t){t.d(r,{Z:function(){return p}});var e=t(47568),i=t(20414),a=t(87492),o=function(){var n=(0,e.Z)((function(n){var r;return(0,i.__generator)(this,(function(t){switch(t.label){case 0:return r={},[4,(0,a.R)("/api/plugin",(r.method="POST",r.body=JSON.stringify(n),r))];case 1:return t.sent(),[2]}}))}));return function(r){return n.apply(this,arguments)}}(),u=function(){var n=(0,e.Z)((function(n){var r;return(0,i.__generator)(this,(function(t){switch(t.label){case 0:return r={},[4,(0,a.R)("/api/plugin",(r.method="PUT",r.body=JSON.stringify(n),r))];case 1:return t.sent(),[2]}}))}));return function(r){return n.apply(this,arguments)}}(),c=function(){var n=(0,e.Z)((function(n){var r;return(0,i.__generator)(this,(function(t){switch(t.label){case 0:return r={},[4,(0,a.R)("/api/plugin",(r.method="DELETE",r.body=JSON.stringify(n),r))];case 1:return t.sent(),[2]}}))}));return function(r){return n.apply(this,arguments)}}(),s=t(26042),l=t(29815),d=t(8100),f=t(67294),p={add:o,update:u,del:c,usePlugins:function(){var n=(0,d.ZP)("/api/plugin",a._),r=n.data,t=n.error,e=n.mutate,i=!r,o=(null===r||void 0===r?void 0:r.plugins)||[],u=(0,f.useCallback)((function(n){var r=(0,l.Z)(o).concat([n]);e({plugins:r})}),[o,e]),c=(0,f.useCallback)((function(n){var r=o.filter((function(r){return r.key!==n.key}));e({plugins:r})}),[o,e]),p=(0,f.useCallback)((function(n){var r=o.map((function(r){return r.key===n.key&&(r=(0,s.Z)({},r,n)),r}));e({plugins:r})}),[o,e]);return[o,{mutatePlugins:e,addOnePlugin:u,delOnePlugin:c,mutateOnePlugin:p,errorPlugins:t,loadingPlugins:i}]}}},4687:function(n,r,t){t.d(r,{Z:function(){return c}});var e=t(47568),i=t(20414),a=t(87492),o=function(){var n=(0,e.Z)((function(){var n;return(0,i.__generator)(this,(function(r){switch(r.label){case 0:return n={},[4,(0,a.R)("/api/plugins",(n.method="GET",n.headers={Accept:"application/json"},n))];case 1:return[2,r.sent().json()]}}))}));return function(){return n.apply(this,arguments)}}(),u=function(){var n=(0,e.Z)((function(){var n;return(0,i.__generator)(this,(function(r){switch(r.label){case 0:return n={},[4,(0,a.R)("/api/plugins",(n.method="POST",n.headers={Accept:"application/json"},n))];case 1:return[2,r.sent().json()]}}))}));return function(){return n.apply(this,arguments)}}(),c={list:o,completeList:u}},94370:function(n,r,t){t.d(r,{Z:function(){return m}});var e=t(26042),i=t(69396),a=t(29815),o=t(8100),u=t(67294),c=t(87492),s=t(47568),l=t(20414),d=function(){var n=(0,s.Z)((function(n,r){var t;return(0,l.__generator)(this,(function(e){switch(e.label){case 0:return t={},[4,(0,c.R)("/api/project",(t.method="POST",t.headers={Accept:"application/json"},t.body=JSON.stringify({workspace:{id:n.id},project:r}),t))];case 1:return[2,e.sent().json()]}}))}));return function(r,t){return n.apply(this,arguments)}}(),f=function(){var n=(0,s.Z)((function(n,r){var t;return(0,l.__generator)(this,(function(e){switch(e.label){case 0:return t={},[4,(0,c.R)("/api/project/"+n.id,(t.method="PUT",t.body=JSON.stringify(r),t))];case 1:return e.sent(),[2]}}))}));return function(r,t){return n.apply(this,arguments)}}(),p=function(){var n=(0,s.Z)((function(n,r){var t;return(0,l.__generator)(this,(function(e){switch(e.label){case 0:return t={},[4,(0,c.R)("/api/project/"+r.id,(t.method="DELETE",t.body=JSON.stringify({id:n.id}),t))];case 1:return e.sent(),[2]}}))}));return function(r,t){return n.apply(this,arguments)}}(),h=function(){var n=(0,s.Z)((function(n){var r;return(0,l.__generator)(this,(function(t){return r={},[2,(0,c.R)("/api/project/"+n.id+"/archive",(r.method="GET",r.headers={Accept:"application/json"},r))]}))}));return function(r){return n.apply(this,arguments)}}(),g=function(){var n=(0,s.Z)((function(n){var r;return(0,l.__generator)(this,(function(t){return r={},[2,(0,c.R)("/api/project/"+n.id+"/archive",(r.method="PUT",r))]}))}));return function(r){return n.apply(this,arguments)}}(),v=function(){var n=(0,s.Z)((function(n){var r;return(0,l.__generator)(this,(function(t){return r={},[2,(0,c.R)("/api/project/"+n.id+"/archive",(r.method="DELETE",r))]}))}));return function(r){return n.apply(this,arguments)}}(),j=function(){var n=(0,s.Z)((function(n,r){var t;return(0,l.__generator)(this,(function(e){return t={},[2,(0,c.R)("/api/project/"+n.id+"/archive",(t.method="POST",t.body=JSON.stringify({archive:r}),t))]}))}));return function(r,t){return n.apply(this,arguments)}}(),b={useProjects:function(n){var r=(0,o.ZP)(["/api/projects",JSON.stringify({ids:n})],c._),t=r.data,s=r.error,l=r.mutate,d=!t,f=(null===t||void 0===t?void 0:t.projects)||[],p=(0,u.useCallback)((function(n){var r=(0,a.Z)(f).concat([(0,i.Z)((0,e.Z)({},n),{users:[],geometries:[],simulations:[],groups:[]})]);l({projects:r})}),[f,l]),h=(0,u.useCallback)((function(n){var r=f.filter((function(r){return r.id!==n.id}));l({projects:r})}),[f,l]),g=(0,u.useCallback)((function(n){var r=f.map((function(r){return r.id===n.id&&(r=(0,e.Z)({},r,n)),r}));l({projects:r})}),[f,l]);return[f,{addOneProject:p,delOneProject:h,mutateOneProject:g,errorProjects:s,loadingProjects:d}]},useProject:function(n){var r=(0,o.ZP)("/api/project"+(n?"/"+n:""),c._),t=r.data,i=r.error,a=r.mutate,s=!t,l=(null===t||void 0===t?void 0:t.project)||{id:"0"},d=(0,u.useCallback)((function(n){var r=(0,e.Z)({},l,n);a({project:r})}),[l,a]);return[l,{mutateProject:d,errorProject:i,loadingProject:s}]},add:d,update:f,del:p,archive:h,unarchiveFromServer:g,deleteArchiveFile:v,unarchiveFromFile:j},m=b},41641:function(n,r,t){t.d(r,{HS:function(){return u},Lw:function(){return y},m1:function(){return g},o6:function(){return j},w6:function(){return s},ks:function(){return m},Qj:function(){return Z}});var e=t(85893),i=t(84908),a=t(71577),o=t(64789),u=function(n){var r=n.disabled,t=n.primary,u=void 0===t||t,c=n.light,s=n.dark,l=n.fullWidth,d=n.needMargin,f=n.loading,p=n.children,h=n.onAdd;return(0,e.jsx)(i.Z,{title:p||"Add",children:(0,e.jsx)(a.Z,{className:(l?"full-width":"")+(d?" marginLeft-5":"")+(c?" text-light":"")+(s?" text-dark":""),disabled:r,loading:f,type:u?"primary":"default",icon:(0,e.jsx)(o.Z,{}),onClick:function(){return h()},children:p})})},c=t(86548),s=function(n){var r,t=n.disabled,o=n.primary,u=void 0!==o&&o,s=n.bordered,l=n.light,d=n.dark,f=n.needMargin,p=n.loading,h=n.children,g=n.onEdit;return r=t?"link":u?"primary":"default",(0,e.jsx)(i.Z,{title:h||"Edit",children:(0,e.jsx)(a.Z,{className:"no-background "+(f?"marginLeft-5 ":"")+(l?"text-light ":"")+(d?"text-dark ":"")+(s?"":"no-border "),disabled:t,loading:p,type:r,icon:(0,e.jsx)(c.Z,{}),onClick:g,children:h})})},l=t(47568),d=t(20414),f=t(67294),p=t(48689),h=t(32834),g=function(n){var r=n.disabled,t=n.loading,o=n.bordered,u=n.text,c=n.title,s=n.children,g=n.onDelete,v=(0,f.useState)(!1),j=v[0],b=v[1];return(0,e.jsxs)(e.Fragment,{children:[(0,e.jsx)(h.AN,{visible:j,loading:t,title:c||"Delete",onCancel:function(){return b(!1)},onOk:(0,l.Z)((function(){return(0,d.__generator)(this,(function(n){switch(n.label){case 0:return[4,g()];case 1:return n.sent(),b(!1),[2]}}))})),children:u||"Are you sure?"}),(0,e.jsx)(i.Z,{title:s||"Delete",children:(0,e.jsx)(a.Z,{className:"no-background "+(o?"":"no-border"),danger:!0,disabled:r,type:r?"link":void 0,loading:t,icon:(0,e.jsx)(p.Z,{}),onClick:function(){return b(!0)},children:s})})]})},v=t(23430),j=function(n){var r=n.disabled,t=n.loading,o=n.bordered,u=n.children,c=n.onDownload;return(0,e.jsx)(i.Z,{title:u||"Download",children:(0,e.jsx)(a.Z,{className:"no-background "+(o?"":"no-border"),disabled:r,loading:t,icon:(0,e.jsx)(v.Z,{}),onClick:function(){return c()},children:u})})},b=t(82826),m=function(n){var r=n.children,t=n.onClick;return(0,e.jsx)(a.Z,{className:"no-border",icon:(0,e.jsx)(b.Z,{className:"color-primary"}),onClick:t,children:r||"Go back"})},y=function(n){var r=n.disabled,t=n.loading,o=n.children,u=n.onCancel;return(0,e.jsx)(i.Z,{title:o||"Cancel",children:(0,e.jsx)(a.Z,{disabled:r,loading:t,type:"default",onClick:u,children:o||"Cancel"})})},Z=function(n){var r=n.children,t=n.onClick;return(0,e.jsx)(a.Z,{type:"link",onClick:t,style:{padding:0},children:r})}},60877:function(n,r,t){var e=t(85893),i=t(84908),a=t(63922),o=t(24093),u=t(11382),c=t(13023),s=t(48764).lW,l=function(n){return n?"hsl("+Array.from(n).reduce((function(n,r){return r.charCodeAt(0)+((n<<5)-n)}),0)%360+", 100%, 25%)":"#FFFFFF"},d=function(n){var r=n.toString(16);return 1===r.length?"0"+r:r},f={deepCopy:function(n){return JSON.parse(JSON.stringify(n))},stringToColor:l,rgbToHex:function(n){return"#"+d(Math.floor(255*n.r))+d(Math.floor(255*n.g))+d(Math.floor(255*n.b))},rgbToRgba:function(n){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1;return n?"rgba("+255*n.r+", "+255*n.g+", "+255*n.b+", "+r+")":"rgba(255, 255, 255, 0)"},userToAvatar:function(n){var r=n.avatar&&s.from(n.avatar).toString(),t="",c="";return n.firstname||n.lastname?(t=n.firstname?n.firstname+" ":"",t+=n.lastname||"",c=n.firstname?n.firstname[0]:"",c+=n.lastname?n.lastname[0]:""):n.email&&(t=n.email,c=n.email[0]),(0,e.jsx)(i.Z,{title:t+(n.pending?" (Invite pending)":""),children:(0,e.jsx)(a.Z,{count:n.pending&&"Pending...",offset:[30,5],style:{backgroundColor:"#ff4d4f",zIndex:10},children:(0,e.jsx)(o.C,{src:r,style:{backgroundColor:l(t)},children:c.toUpperCase()||(0,e.jsx)(u.Z,{})})})},n.id||JSON.stringify(n))},groupToAvatar:function(n){var r=n.name,t="";return r&&(t=r[0]),(0,e.jsx)(i.Z,{title:r,children:(0,e.jsx)(o.C,{style:{backgroundColor:l(r)},children:t.toUpperCase()||(0,e.jsx)(u.Z,{})})},n.id||JSON.stringify(n))},validateEmail:function(n){return!!(0,c.parseOneAddress)(n)},getGitVersion:function(){return"git-front-30197e3"}};r.Z=f}}]);