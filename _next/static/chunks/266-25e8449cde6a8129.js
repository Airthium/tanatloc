(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[266],{27588:function(e,a,l){"use strict";l.d(a,{E:function(){return n},j:function(){return t}});let t=[{label:"Density",symbol:"Rho",unit:"\\(kg.m^{-3}\\)"},{label:"Young's modulus",symbol:"E",unit:"\\(Pa\\)"},{label:"Poisson's ratio",symbol:"Nu",unit:"\\(1\\)"},{label:"Thermal conductivity",symbol:"Lambda",unit:"\\(W.m^{-1}.K^{-1}\\)"},{label:"Heat capacity",symbol:"Cp",unit:"\\(J.K^{-1}.kg^{-1}\\)"},{label:"Dynamic viscosity",symbol:"Mu",unit:"\\(Pa.s\\)"}],n={metal:{label:"Metal",children:[{key:"steel",label:"Generic Steel",children:[{label:"Density",symbol:"Rho",value:"7850"},{label:"Young's modulus",symbol:"E",value:"2.1e11"},{label:"Poisson's ratio",symbol:"Nu",value:"0.3"},{label:"Thermal conductivity",symbol:"Lambda",value:"15"},{label:"Heat capacity",symbol:"Cp",value:"502"}]},{key:"S235JR+AR",label:"Steel (S235JR+AR)",children:[{label:"Density",symbol:"Rho",value:"7850"},{label:"Young's modulus",symbol:"E",value:"2.1e11"},{label:"Poisson's ratio",symbol:"Nu",value:"0.27"},{label:"Thermal conductivity",symbol:"Lambda",value:"15"},{label:"Heat capacity",symbol:"Cp",value:"502"}]},{key:"304",label:"Stainless Steel 304",children:[{label:"Density",symbol:"Rho",value:"8000"},{label:"Young's modulus",symbol:"E",value:"193e9"},{label:"Poisson's ratio",symbol:"Nu",value:"0.29"},{label:"Thermal conductivity",symbol:"Lambda",value:"16.2"},{label:"Heat capacity",symbol:"Cp",value:"500"},{label:"Yield strength",symbol:"SigmaY",value:"215e6"}]},{key:"316L",label:"Stainless Steel 316L",children:[{label:"Density",symbol:"Rho",value:"7990"},{label:"Young's modulus",symbol:"E",value:"193e9"},{label:"Poisson's ratio",symbol:"Nu",value:"0.25"},{label:"Thermal conductivity",symbol:"Lambda",value:"16.2"},{label:"Heat capacity",symbol:"Cp",value:"500"},{label:"Yield strength",symbol:"SigmaY",value:"290e6"}]},{key:"6082-O",label:"Aluminium 6082-O",children:[{label:"Density",symbol:"Rho",value:"2700"},{label:"Young's modulus",symbol:"E",value:"69e9"},{label:"Poisson's ratio",symbol:"Nu",value:"0.33"},{label:"Thermal conductivity",symbol:"Lambda",value:"170"},{label:"Heat capacity",symbol:"Cp",value:"960"},{label:"Yield strength",symbol:"SigmaY",value:"60e6"}]},{key:"7075-O",label:"Aluminium 7075-O",children:[{label:"Density",symbol:"Rho",value:"2810"},{label:"Young's modulus",symbol:"E",value:"71.7e9"},{label:"Poisson's ratio",symbol:"Nu",value:"0.33"},{label:"Thermal conductivity",symbol:"Lambda",value:"173"},{label:"Heat capacity",symbol:"Cp",value:"960"},{label:"Yield strength",symbol:"SigmaY",value:"110e6"}]},{key:"2017A",label:"Aluminium 2017A",children:[{label:"Density",symbol:"Rho",value:"2790"},{label:"Young's modulus",symbol:"E",value:"72.5e9"},{label:"Poisson's ratio",symbol:"Nu",value:"0.33"},{label:"Thermal conductivity",symbol:"Lambda",value:"134"},{label:"Heat capacity",symbol:"Cp",value:"873"},{label:"Yield strength",symbol:"SigmaY",value:"275e6"}]}]},polymer:{label:"Polymer",children:[{key:"PMMA",label:"PMMA",children:[{label:"Density",symbol:"Rho",value:"1180"},{label:"Young's modulus",symbol:"E",value:"2.9e9"},{label:"Poisson's ratio",symbol:"Nu",value:"0.36"},{label:"Thermal conductivity",symbol:"Lambda",value:"0.193"},{label:"Heat capacity",symbol:"Cp",value:"1480"},{label:"Yield strength",symbol:"SigmaY",value:"69e6"}]}]},fluid:{label:"Fluid",children:[{key:"water",label:"Water",children:[{label:"Density",symbol:"Rho",value:"1e3"},{label:"Dynamic viscosity",symbol:"Mu",value:"1e-3"},{label:"Thermal conductivity",symbol:"Lambda",value:"0.6"},{label:"Heat capacity",symbol:"Cp",value:"4185"}]}]},contact:{label:"Contact",children:[{key:"fundation",label:"Fundation",children:[]}]}}},46210:function(e,a,l){"use strict";l.d(a,{Z:function(){return t}});var t=[{category:"Academic",name:"Poisson's equation",algorithm:"poisson",code:"FreeFEM",version:"1.0.0",description:'\n  <h3>\n    Poisson\'s equation\n  </h3>\n  <p>\n  Let \\(\\Omega\\) be a domain of \\(\\mathbb{R}^{d}\\), with \\(d\\in\\{2,3\\}\\).<br/>\n\n  The domain \\(\\Omega\\) is bounded by \\(\\Gamma = \\Gamma_D \\cup \\Gamma_N\\).<br/>\n\n  The Poisson\'s equation reads as follow:\n  \\begin{align}\n    \\Delta u &= f &\\text{on }\\Omega\\\\\n    u &= u_D &\\text{on }\\Gamma_D\\\\\n    \\nabla u &= g_N &\\text{on }\\Gamma_N\n  \\end{align}\n  </p>\n  <figure>\n    <img src="/images/Poisson.png" alt="Poisson" />\n    <figcaption>Poisson\'s equation example on a cube.</figcaption>\n  </figure>\n  <p>\n      See <a target="_blank" href="https://en.wikipedia.org/wiki/Poisson%27s_equation">Wikipedia</a>.\n  </p>\n  ',configuration:{geometry:{index:1,title:"Geometry",meshable:!0},parameters:{index:2,title:"Parameters",rightHandSide:{label:"Right hand side",children:[{label:"External force",htmlEntity:"formula",default:"0"}]},finiteElementSpace:{advanced:!0,label:"Finite element space",children:[{label:"u",htmlEntity:"select",options:[{label:"P1",value:"P1"},{label:"P2",value:"P2"}],default:"P1"}]},solver:{advanced:!0,label:"Solver",children:[{label:"System resolution",htmlEntity:"select",options:[{label:"GMRES",value:"GMRES"},{label:"MUMPS",value:"MUMPS"},{label:"UMFPACK",value:"UMFPACK"}],default:"MUMPS"}]}},boundaryConditions:{index:3,title:"Boundary conditions",dirichlet:{label:"Dirichlet",children:[{label:"u",htmlEntity:"formula",default:"0"}]},neumann:{label:"Neumann",children:[{label:"du/dn",htmlEntity:"formula",default:"0"}]}},run:{index:4,title:"Run",results:[{name:"u"}]}}},{category:"Mechanics",name:"Linear elasticity",algorithm:"linearElasticity",code:"FreeFEM",version:"1.0.0",description:'\n  <h3>\n    Linear elasticity\n  </h3>\n  <p>\n  Let \\(\\Omega\\) be a domain of \\(\\mathbb{R}^{d}\\), with \\(d\\in\\{2,3\\}\\).<br/>\n\n  The domain \\(\\Omega\\) is bounded by \\(\\Gamma = \\Gamma_D \\cup \\Gamma_N\\).<br/>\n\n    \\(u\\) is the displacement.<br/>\n\n  The linear elasticity equation reads as follow:\n\n  $$\n  \\begin{align}\n    -\\text{div}(\\sigma) &= f &\\text{on }\\Omega\\\\\n    u &= u_D&\\text{on }\\Gamma_D\\\\\n    \\sigma\\cdot n &= u_N&\\text{on }\\Gamma_N\n  \\end{align}\n  $$\n\n  With \\(\\sigma_{ij}(u) = \\lambda\\delta_{ij}\\nabla\\cdot u + 2\\mu\\epsilon_{ij}(u)\\).<br/>\n\n  \\(\\lambda\\) and \\(\\mu\\) are the Lam\xe9 coefficients.\n  </p>\n  <figure>\n    <img src="/images/LinearElasticity.png" alt="Linear Elasticity" />\n    <figcaption>Linear elasticity equation example on a beam.</figcaption>\n  </figure>\n  <p>\n    See <a target="_blank" href="https://en.wikipedia.org/wiki/Linear_elasticity">Wikipedia</a>.\n  </p>\n  ',variables:[{name:"Displacement (x)",value:"Ux"},{name:"Displacement (y)",value:"Uy"},{name:"Displacement (z)",value:"Uz"}],configuration:{geometry:{index:1,title:"Geometry",meshable:!0},materials:{index:2,title:"Materials",children:[{label:"Density",name:"Rho",htmlEntity:"formula",default:"8050",unit:"\\(kg.m^{-3}\\)"},{label:"Young's modulus",name:"E",htmlEntity:"formula",default:"1e9",unit:"\\(Pa\\)"},{label:"Poisson's ratio",name:"Nu",htmlEntity:"formula",default:"0.4",unit:"\\(1\\)"}]},parameters:{index:3,title:"Parameters",rightHandSide:{label:"Right hand side",children:[{label:"External force (x)",htmlEntity:"formula",default:"0",unit:"\\(N.m^{-3}\\)"},{label:"External force (y)",htmlEntity:"formula",default:"0",unit:"\\(N.m^{-3}\\)"},{only3D:!0,label:"External force (z)",htmlEntity:"formula",default:"0",unit:"\\(N.m^{-3}\\)"}]},gravity:{advanced:!0,label:"Gravity",children:[{label:"Standard gravity",htmlEntity:"formula",default:"9.81",unit:"\\(m.s^{-2}\\)"}]},finiteElementSpace:{advanced:!0,label:"Finite element space",children:[{label:"[Ux, Uy, Uz]",label2D:"[Ux, Uy]",htmlEntity:"select",options:[{label:"P1",value:"P1, P1, P1",value2D:"P1, P1"},{label:"P2",value:"P2, P2, P2",value2D:"P2, P2"}],default:"P1, P1, P1",default2D:"P1, P1"}]},solver:{advanced:!0,label:"Solver",children:[{label:"System resolution",htmlEntity:"select",options:[{label:"GMRES",value:"GMRES"},{label:"MUMPS",value:"MUMPS"},{label:"UMFPACK",value:"UMFPACK"}],default:"MUMPS"}]},meshAdaptation:{advanced:!0,label:"Mesh adaptation",children:[{label:"Enabled",htmlEntity:"checkbox",default:!1},{label:"Number of mesh adaptation loops",htmlEntity:"formula",default:1}]}},boundaryConditions:{index:4,title:"Boundary conditions",fixed:{label:"Fixed",refineFactor:2},displacement:{label:"Displacement",children:[{label:"Ux",htmlEntity:"formula",default:"0",unit:"\\(m\\)"},{label:"Uy",htmlEntity:"formula",default:"0",unit:"\\(m\\)"},{only3D:!0,label:"Uz",htmlEntity:"formula",default:"0",unit:"\\(m\\)"}],refineFactor:2},presure:{label:"Surface force (normal)",children:[{label:"d(U)/d(N)",htmlEntity:"formula",default:"0",unit:"\\(N.m^{-2}\\)"}],refineFactor:2},componentsPresure:{label:"Surface force (components)",children:[{label:"x",htmlEntity:"formula",default:"0",unit:"\\(N.m^{-2}\\)"},{label:"y",htmlEntity:"formula",default:"0",unit:"\\(N.m^{-2}\\)"},{label:"z",htmlEntity:"formula",default:"0",unit:"\\(N.m^{-2}\\)"}]}},run:{index:5,title:"Run",results:[{name:"Displacement"},{name:"vonMises"},{name:"gamma11"},{name:"gamma12"},{name:"gamma13"},{name:"gamma22"},{name:"gamma23"},{name:"gamma33"}],postprocessing:[{key:"warpByVector",parameters:[{key:"Vectors",value:"Displacement"}]},{key:"contour",parameters:[{key:"ContourBy",options:["Displacement","vonMises","gamma11","gamma12","gamma13","gamma22","gamma23","gamma33"]}]}]}}},{category:"Mechanics",name:"Linear elasticity (time dependent)",algorithm:"linearElasticityTime",code:"FreeFEM",version:"1.0.0",description:'\n  <h3>\n    Linear elasticity (time dependent)\n  </h3>\n  <p>\n  Let \\(\\Omega\\) be a domain of \\(\\mathbb{R}^{d}\\), with \\(d\\in\\{2,3\\}\\).<br/>\n\n  The domain \\(\\Omega\\) is bounded by \\(\\Gamma = \\Gamma_D \\cup \\Gamma_N\\).<br/>\n\n    \\(u\\) is the displacement.<br/>\n\n  The linear elasticity equation reads as follow:\n\n  $$\n  \\begin{align}\n    \\frac{\\partial^2u}{\\partial t^2}-\\text{div}(\\sigma) &= f &\\text{on }\\Omega\\\\\n    u &= u_D&\\text{on }\\Gamma_D\\\\\n    \\sigma\\cdot n &= u_N&\\text{on }\\Gamma_N\n  \\end{align}\n  $$\n\n  With \\(\\sigma_{ij}(u) = \\lambda\\delta_{ij}\\nabla\\cdot u + 2\\mu\\epsilon_{ij}(u)\\).<br>\n\n  \\(\\lambda\\) and \\(\\mu\\) are the Lam\xe9 coefficients.\n  </p>\n  <figure>\n    <img src="/images/LinearElasticity.png" alt="Linear Elasticity" />\n    <figcaption>Linear elasticity equation example on a beam.</figcaption>\n  </figure>\n  <p>\n    See <a target="_blank" href="https://en.wikipedia.org/wiki/Linear_elasticity">Wikipedia</a>.\n  </p>\n  ',configuration:{geometry:{index:1,title:"Geometry",meshable:!0},materials:{index:2,title:"Materials",children:[{label:"Density",name:"Rho",htmlEntity:"formula",default:"8050",unit:"\\(kg.m^{-3}\\)"},{label:"Young's modulus",name:"E",htmlEntity:"formula",default:"1e9",unit:"\\(Pa\\)"},{label:"Poisson's ratio",name:"Nu",htmlEntity:"formula",default:"0.4",unit:"\\(1\\)"}]},parameters:{index:3,title:"Parameters",rightHandSide:{label:"Right hand side",children:[{label:"External force (x)",htmlEntity:"formula",default:"0",unit:"\\(N.m^{-3}\\)"},{label:"External force (y)",htmlEntity:"formula",default:"0",unit:"\\(N.m^{-3}\\)"},{only3D:!0,label:"External force (z)",htmlEntity:"formula",default:"0",unit:"\\(N.m^{-3}\\)"}]},gravity:{advanced:!0,label:"Gravity",children:[{label:"Standard gravity",htmlEntity:"formula",default:"9.81",unit:"\\(m.s^{-2}\\)"}]},time:{label:"Time",children:[{label:"Total time",htmlEntity:"formula",default:"1",unit:"\\(s\\)"},{label:"Time step",htmlEntity:"formula",default:"0.1",unit:"\\(s\\)"}]},finiteElementSpace:{advanced:!0,label:"Finite element space",children:[{label:"[Ux, Uy, Uz]",label2D:"[Ux, Uy]",htmlEntity:"select",options:[{label:"P1",value:"P1, P1, P1",value2D:"P1, P1"},{label:"P2",value:"P2, P2, P2",value2D:"P2, P2"}],default:"P1, P1, P1",default2D:"P1, P1"}]},solver:{advanced:!0,label:"Solver",children:[{label:"System resolution",htmlEntity:"select",options:[{label:"GMRES",value:"GMRES"},{label:"MUMPS",value:"MUMPS"},{label:"UMFPACK",value:"UMFPACK"}],default:"MUMPS"}]},meshAdaptation:{advanced:!0,label:"Mesh adaptation",children:[{label:"Enabled",htmlEntity:"checkbox",default:!1}]}},boundaryConditions:{index:4,title:"Boundary conditions",fixed:{label:"Fixed",refineFactor:2},displacement:{label:"Displacement",children:[{label:"Ux",htmlEntity:"formula",default:"0",unit:"\\(m\\)"},{label:"Uy",htmlEntity:"formula",default:"0",unit:"\\(m\\)"},{only3D:!0,label:"Uz",htmlEntity:"formula",default:"0",unit:"\\(m\\)"}],refineFactor:2},presure:{label:"Surface force (normal)",children:[{label:"d(U)/d(N)",htmlEntity:"formula",default:"0",unit:"\\(N.m^{-2}\\)"}],refineFactor:2},componentsPresure:{label:"Surface force (components)",children:[{label:"x",htmlEntity:"formula",default:"0",unit:"\\(N.m^{-2}\\)"},{label:"y",htmlEntity:"formula",default:"0",unit:"\\(N.m^{-2}\\)"},{label:"z",htmlEntity:"formula",default:"0",unit:"\\(N.m^{-2}\\)"}]}},run:{index:5,title:"Run",results:[{name:"Displacement"},{name:"vonMises"},{name:"gamma11"},{name:"gamma12"},{name:"gamma13"},{name:"gamma22"},{name:"gamma23"},{name:"gamma33"}],resultsFilter:{name:"Time",prefixPattern:"Result_",suffixPattern:".vtu",pattern:"Result_\\d+.vtu",multiplicator:["parameters","time","children","1"]},postprocessing:[{key:"warpByVector",parameters:[{key:"Vectors",value:"Displacement"}]},{key:"contour",parameters:[{key:"ContourBy",options:["Displacement","vonMises","gamma11","gamma12","gamma13","gamma22","gamma23","gamma33"]}]}]}}},{category:"Mechanics",name:"Linear elasticity - Modal analysis",algorithm:"linearElasticityModal",code:"FreeFEM",sequential:!0,version:"1.0.0",description:'<h3>\n  Modal analysis\n  </h3>\n  <p>\n  The modal analysis consists in finding the eigenfrequencies and eigenvectors of a structure.<br/>\n  Let \\(K\\) be the rigidity matrix of the structure and \\(M\\) its mass matrix.<br/>\n  The eigenvalue problem reads as follows\n  $$ (K -\\lambda M) x =0 $$\n  where \\(\\lambda\\) is the eigenvalue related to the natural frequency \\(f\\) by the following <br/>\n  $$\\lambda=(2\\pi f)^{2} $$\n  and \\(x\\) the eigenvector for the mode of the frequency \\(f\\).<br/>\n  Moreover the eigenvalue problem can be transformed as follows\n  $$ (A -\\sigma M)^{-1}Mx  = \\nu x$$\n  where\n  $$ \\nu  = \\frac{1}{\\lambda-\\sigma} $$\n  and \\(\\sigma\\) the shift of the method which helps to find eigenvalues near \\(\\sigma\\). By default \\(\\sigma\\) \\(=\\) \\(0\\). <br/>\n  </p>\n  <p>\n  You can see <a target="_blank" href="https://freefem.org">FreeFEM</a>.\n</p> ',variables:[{name:"Displacement (x)",value:"Ux"},{name:"Displacement (y)",value:"Uy"},{name:"Displacement (z)",value:"Uz"}],configuration:{geometry:{index:1,title:"Geometry",meshable:!0},materials:{index:2,title:"Materials",children:[{label:"Density",name:"Rho",htmlEntity:"formula",default:"8050",unit:"\\(kg.m^{-3}\\)"},{label:"Young's modulus",name:"E",htmlEntity:"formula",default:"1e4",unit:"\\(Pa\\)"},{label:"Poisson's ratio",name:"Nu",htmlEntity:"formula",default:"0.3",unit:"\\(1\\)"}]},parameters:{index:3,title:"Parameters",modalparameters:{label:"Modal parameters",children:[{label:"sigma",htmlEntity:"formula",default:"0"},{label:"Eigenvectors number ",htmlEntity:"formula",default:"4"}]},finiteElementSpace:{advanced:!0,label:"Finite element space",children:[{label:"[Ux, Uy, Uz]",label2D:"[Ux, Uy]",htmlEntity:"select",options:[{label:"P1",value:"P1, P1, P1",value2D:"P1, P1"},{label:"P2",value:"P2, P2, P2",value2D:"P2, P2"}],default:"P1, P1, P1",default2D:"P1, P1"}]},solver:{advanced:!0,label:"Solver",children:[{label:"System resolution",htmlEntity:"select",options:[{label:"GMRES",value:"GMRES"},{label:"MUMPS",value:"MUMPS"},{label:"UMFPACK",value:"UMFPACK"}],default:"MUMPS"}]}},boundaryConditions:{index:4,title:"Boundary conditions",fixed:{label:"Fixed",refineFactor:2},free:{label:"Free"},displacement:{label:"Displacement",children:[{label:"Ux",htmlEntity:"formula",default:"0",unit:"\\(m\\)"},{label:"Uy",htmlEntity:"formula",default:"0",unit:"\\(m\\)"},{label:"Uz",htmlEntity:"formula",default:"0",unit:"\\(m\\)"}],refineFactor:2}},run:{index:5,title:"Run",results:[{name:"Displacement"}],resultsFilter:{name:"Mode number",prefixPattern:"Result_",suffixPattern:".vtu",pattern:"Result_\\d+.vtu"},postprocessing:[{key:"warpByVector",parameters:[{key:"Vectors",value:"Displacement"}]},{key:"contour",parameters:[{key:"ContourBy",options:["Displacement"]}]}]}}},{category:"Fluid",name:"Stokes",algorithm:"stokes",code:"FreeFEM",version:"1.0.0",description:'\n  <h3>\n    Stokes\n  </h3>\n  <p>\n    Let \\(\\Omega\\) be a domain of \\(\\mathbb{R}^{d}\\), with \\(d\\in\\{2,3\\}\\).<br/>\n\n    The domain \\(\\Omega\\) is bounded by \\(\\Gamma = \\Gamma_D \\cup \\Gamma_N\\).<br/>\n\n    \\(u\\) is the velocity and \\(p\\) the pressure.<br/>\n\n    The Stokes equations reads as follow:\n\n    $$\n    \\begin{align}\n      \\mu\\Delta u - \\nabla p &= f&\\text{on }\\Omega\\\\\n      u &= u_D&\\text{on }\\Gamma_D\\\\\n      \\mu\\frac{\\partial u}{\\partial n} - pn &= g_N&\\text{on }\\Gamma_N\n    \\end{align}\n    $$\n\n    With \\(\\mu\\) the viscosity.\n  </p>\n  <figure>\n    <img src="/images/Stokes.png" alt="Stokes" />\n    <figcaption>Stokes equation example on a pipe.</figcaption>\n  </figure>\n  <p>\n    See <a target="_blank" href="https://en.wikipedia.org/wiki/Navier%E2%80%93Stokes_equations">Wikipedia</a>.\n  </p>\n  ',configuration:{geometry:{index:1,title:"Geometry",meshable:!0},materials:{index:2,title:"Materials",children:[{label:"Dynamic viscosity",name:"Mu",htmlEntity:"formula",default:"1e-3",unit:"\\(Pa.s\\)"}]},parameters:{index:3,title:"Parameters",rightHandSide:{label:"Right hand side",children:[{label:"External force (x)",htmlEntity:"formula",default:"0",unit:"\\(N.m^{-3}\\)"},{label:"External force (y)",htmlEntity:"formula",default:"0",unit:"\\(N.m^{-3}\\)"},{only3D:!0,label:"External force (z)",htmlEntity:"formula",default:"0",unit:"\\(N.m^{-3}\\)"}]},finiteElementSpace:{advanced:!0,label:"Finite element space",children:[{label:"[Ux, Uy, Uz, p]",label2D:"[Ux, Uy, p]",htmlEntity:"select",options:[{label:"P2/P1",value:"P2, P2, P2, P1",value2D:"P2, P2, P1"},{label:"P1b/P1",value:"P1b, P1b, P1b, P1",value2D:"P1b, P1b, P1"}],default:"P2, P2, P2, P1",default2D:"P2, P2, P1"}]},solver:{advanced:!0,label:"Solver",children:[{label:"System resolution",htmlEntity:"select",options:[{label:"GMRES",value:"GMRES"},{label:"MUMPS",value:"MUMPS"},{label:"UMFPACK",value:"UMFPACK"}],default:"MUMPS"}]},symmetric:{advanced:!0,label:"Symmetric formulation",children:[{label:"Enabled",htmlEntity:"checkbox",default:!1}]}},boundaryConditions:{index:5,title:"Boundary conditions",wall:{label:"Wall"},freeOutlet:{label:"Free outlet"},dirichlet:{label:"Velocity",children:[{label:"Ux",htmlEntity:"formula",default:"0",unit:"\\(m.s^{-1}\\)"},{label:"Uy",htmlEntity:"formula",default:"0",unit:"\\(m.s^{-1}\\)"},{only3D:!0,label:"Uz",htmlEntity:"formula",default:"0",unit:"\\(m.s^{-1}\\)"}],refineFactor:2},neumann:{label:"Pressure",children:[{label:"d(U)/d(N)",htmlEntity:"formula",default:"0",unit:"\\(N.m^{-2}\\)"}],refineFactor:2}},run:{index:6,title:"Run",results:[{name:"Velocity"},{name:"Presure"}],postprocessing:[{key:"streamTracer",parameters:[{key:"Vectors",value:"Velocity"}]}]}}},{category:"Fluid",name:"Navier-Stokes time-dependant",algorithm:"navierStokesTime",code:"FreeFEM",version:"1.0.0",description:'\n  <h3>\n    Navier-Stokes time-dependant\n  </h3>\n  <p>\n    Let \\(\\Omega\\) be a domain of \\(\\mathbb{R}^{d}\\), with \\(d\\in\\{2,3\\}\\).<br/>\n\n    The domain \\(\\Omega\\) is bounded by \\(\\Gamma = \\Gamma_D \\cup \\Gamma_N\\).<br/>\n\n    \\(u\\) is the velocity and \\(p\\) the pressure.<br/>\n\n    The Navier-Stokes equations reads as follow:\n\n    $$\n    \\begin{align}\n      \\rho\\frac{\\partial u}{\\partial t} + \\rho(u\\cdot\\nabla)u + \\nabla p - \\mu\\Delta u &= f&\\text{on }\\Omega\\\\\n      u &= u_D&\\text{on }\\Gamma_D\\\\\n      \\mu\\frac{\\partial u}{\\partial n} - pn &= g_N&\\text{on }\\Gamma_N\n    \\end{align}\n    $$\n\n    With \\(\\mu\\) the viscosity and \\(\\rho\\) the density.\n  </p>\n  <figure>\n    <img src="/images/Stokes.png" alt="Stokes" />\n    <figcaption>Navier-Stokes equation example on a pipe.</figcaption>\n  </figure>\n  </p>\n  <p>\n    See <a target="_blank" href="https://en.wikipedia.org/wiki/Navier%E2%80%93Stokes_equations">Wikipedia</a>.\n  </p>\n  ',configuration:{geometry:{index:1,title:"Geometry",meshable:!0},materials:{index:2,title:"Materials",children:[{label:"Density",name:"Rho",htmlEntity:"formula",default:"1e3",unit:"\\(kg.m^{-3}\\)"},{label:"Dynamic viscosity",name:"Mu",htmlEntity:"formula",default:"1e-3",unit:"\\(Pa.s\\)"}]},parameters:{index:3,title:"Parameters",rightHandSide:{label:"Right hand side",children:[{label:"External force (x)",htmlEntity:"formula",default:"0",unit:"\\(N.m^{-3}\\)"},{label:"External force (y)",htmlEntity:"formula",default:"0",unit:"\\(N.m^{-3}\\)"},{only3D:!0,label:"External force (z)",htmlEntity:"formula",default:"0",unit:"\\(N.m^{-3}\\)"}]},time:{label:"Time",children:[{label:"Total time",htmlEntity:"formula",default:"1",unit:"\\(s\\)"},{label:"Time step",htmlEntity:"formula",default:"0.1",unit:"\\(s\\)"}]},finiteElementSpace:{advanced:!0,label:"Finite element space",children:[{label:"[Ux, Uy, Uz, p]",label2D:"[Ux, Uy, p]",htmlEntity:"select",options:[{label:"P2/P1",value:"P2, P2, P2, P1",value2D:"P2, P2, P1"},{label:"P1b/P1",value:"P1b, P1b, P1b, P1",value2D:"P1b, P1b, P1"}],default:"P2, P2, P2, P1",default2D:"P2, P2, P1"}]},solver:{advanced:!0,label:"Solver",children:[{label:"System resolution",htmlEntity:"select",options:[{label:"GMRES",value:"GMRES"},{label:"MUMPS",value:"MUMPS"},{label:"UMFPACK",value:"UMFPACK"}],default:"MUMPS"}]},symmetric:{advanced:!0,label:"Symmetric formulation",children:[{label:"Enabled",htmlEntity:"checkbox",default:!1}]}},initialization:{index:4,title:"Initialization",done:!0,direct:{label:"Velocity",children:[{label:"Ux",htmlEntity:"formula",default:"0",unit:"\\(m.s^{-1}\\)"},{label:"Uy",htmlEntity:"formula",default:"0",unit:"\\(m.s^{-1}\\)"},{only3D:!0,label:"Uz",htmlEntity:"formula",default:"0",unit:"\\(m.s^{-1}\\)"}]},coupling:{label:"Coupling",compatibility:[{algorithm:"navierStokesTime",filter:{name:"Time step",prefixPattern:"Result_",suffixPattern:".vtu",pattern:"Result_\\d+.vtu",multiplicator:["parameters","time","children","1"]}}]}},boundaryConditions:{index:5,title:"Boundary conditions",wall:{label:"Wall"},freeOutlet:{label:"Free outlet"},dirichlet:{label:"Velocity",children:[{label:"Ux",htmlEntity:"formula",default:"0",unit:"\\(m.s^{-1}\\)"},{label:"Uy",htmlEntity:"formula",default:"0",unit:"\\(m.s^{-1}\\)"},{only3D:!0,label:"Uz",htmlEntity:"formula",default:"0",unit:"\\(m.s^{-1}\\)"}],refineFactor:2},neumann:{label:"Pressure",children:[{label:"d(U)/d(N)",htmlEntity:"formula",default:"0",unit:"\\(N.m^{-2}\\)"}],refineFactor:2}},run:{index:6,title:"Run",results:[{name:"Velocity"},{name:"Presure"}],resultsFilter:{name:"Time",prefixPattern:"Result_",suffixPattern:".vtu",pattern:"Result_\\d+.vtu",multiplicator:["parameters","time","children","1"]},postprocessing:[{key:"streamTracer",parameters:[{key:"Vectors",value:"Velocity"}]}]}}},{category:"Thermic",name:"Thermal diffusion",algorithm:"thermicDiffusion",code:"FreeFEM",version:"1.0.0",description:'\n  <h3>\n    Thermal diffusion\n  </h3>\n  <p>\n    Let \\(\\Omega\\) be a domain of \\(\\mathbb{R}^{d}\\), with \\(d\\in\\{2,3\\}\\).<br/>\n\n    The domain \\(\\Omega\\) is bounded by \\(\\Gamma = \\Gamma_D \\cup \\Gamma_N\\).<br/>\n\n      \\(T\\) is the temperature.<br/>\n\n    The heat equation reads as follow:\n\n    $$\n    \\begin{align}\n      \\rho C_p \\frac{\\partial T}{\\partial t} - \\lambda\\Delta T &= f&\\text{on }\\Omega\\\\\n      T &= T_D&\\text{on }\\Gamma_D\\\\\n      \\lambda\\frac{\\partial T}{\\partial n} &= g_N&\\text{on }\\Gamma_N\n    \\end{align}\n    $$\n\n    With \\(\\rho\\) the density, \\(C_p\\) the heat capacity and \\(\\lambda\\) the thermal conductivity.\n  </p>\n\n  <figure>\n    <img src="/images/Heat.png" alt="Heat" />\n    <figcaption>Heat equation example on a beam.</figcaption>\n  </figure>\n  </p>\n\n  <p>\n    See <a target="_blank" href="https://en.wikipedia.org/wiki/Navier%E2%80%93Stokes_equations">Wikipedia</a>.\n  </p>\n  ',configuration:{geometry:{index:1,title:"Geometry",meshable:!0},materials:{index:2,title:"Materials",children:[{label:"Density",name:"Rho",htmlEntity:"formula",default:"7960",unit:"\\(kg.m^{-3}\\)"},{label:"Thermal conductivity",name:"Lambda",htmlEntity:"formula",default:"15",unit:"\\(W.m^{-1}.K^{-1}\\)"},{label:"Heat capacity",name:"Cp",htmlEntity:"formula",default:"502",unit:"\\(J.K^{-1}.kg^{-1}\\)"}]},parameters:{index:3,title:"Parameters",time:{label:"Time",children:[{label:"Total time",htmlEntity:"formula",default:"1",unit:"\\(s\\)"},{label:"Time step",htmlEntity:"formula",default:"0.1",unit:"\\(s\\)"}]},finiteElementSpace:{advanced:!0,label:"Finite element space",children:[{label:"T",htmlEntity:"select",options:[{label:"P1",value:"P1"},{label:"P2",value:"P2"}],default:"P1"}]},solver:{advanced:!0,label:"Solver",children:[{label:"System resolution",htmlEntity:"select",options:[{label:"GMRES",value:"GMRES"},{label:"MUMPS",value:"MUMPS"},{label:"UMFPACK",value:"UMFPACK"}],default:"MUMPS"}]}},boundaryConditions:{index:4,title:"Boundary conditions",temperature:{label:"Temperature",children:[{label:"T",htmlEntity:"formula",default:"0",unit:"K"}],refineFactor:2}},run:{index:5,title:"Run",results:[{name:"T"}],resultsFilter:{name:"Time",prefixPattern:"Result_",suffixPattern:".vtu",pattern:"Result_\\d+.vtu",multiplicator:["parameters","time","children","1"]}}}}]},83755:function(e,a,l){"use strict";l.d(a,{R:function(){return m},_:function(){return s}});var t=l(59134),n=l.n(t),i=l(83454);let r=i.env.PORT?parseInt(i.env.PORT):3e3,o=n()()?"http://localhost:"+r:"",s=async(e,a)=>{let l=await fetch(o+e,{method:a?"POST":"GET",headers:{accept:"application/json","Content-Type":"application/json"},...a&&{body:a}}),t=l.headers.get("Content-Type");if(!l.ok){let e=Error("An error occured while fetching data.");throw e.info=(null==t?void 0:t.includes("application/json"))&&await l.json(),e.status=l.status,e}return l.json()},m=async(e,a)=>{let l=await fetch(o+e,{...a,method:a&&a.method||"GET",headers:{...a&&a.headers,"Content-Type":"application/json"}}),t=l.headers.get("Content-Type");if(!l.ok){let e=Error("An error occured while fetching data.");throw e.info=(null==t?void 0:t.includes("application/json"))&&await l.json(),e.status=l.status,e}return l}},42661:function(e,a,l){"use strict";l.d(a,{Z:function(){return h}});var t=l(59734),n=l(67294),i=l(83755);let r=()=>{let{data:e,error:a,mutate:l}=(0,t.ZP)("/api/user",i._),r=null==e?void 0:e.user,o=(0,n.useCallback)(e=>{l({user:{...r,...e}})},[r,l]),s=(0,n.useCallback)(()=>{l({user:void 0})},[l]);return[r,{mutateUser:o,clearUser:s,errorUser:(null==a?void 0:a.status)===401?void 0:a,loadingUser:(null==a?void 0:a.status)!==401&&!e}]},o=()=>{let{data:e,error:a,mutate:l}=(0,t.ZP)("/api/users",i._),r=(null==e?void 0:e.users)||[],o=(0,n.useCallback)(e=>{let a=[...r,{...e,authorizedplugins:[]}];l({users:a})},[r,l]),s=(0,n.useCallback)(e=>{let a=r.filter(a=>a.id!==e.id);l({users:a})},[r,l]),m=(0,n.useCallback)(e=>{let a=r.map(a=>(a.id===e.id&&(a={...a,...e}),a));l({users:a})},[r,l]);return[r,{addOneUser:o,delOneUser:s,mutateOneUser:m,errorUsers:a,loadingUsers:!e}]},s=async e=>{let a=await (0,i.R)("/api/user",{method:"POST",headers:{Accept:"application/json"},body:JSON.stringify(e)});return a.json()},m=async e=>{await (0,i.R)("/api/user",{method:"PUT",body:JSON.stringify(e)})},u=async(e,a)=>{await (0,i.R)("/api/user/"+e,{method:"PUT",body:JSON.stringify(a)})},d=async()=>{await (0,i.R)("/api/user",{method:"DELETE"})},c=async e=>{await (0,i.R)("/api/user/"+e,{method:"DELETE"})},b=async e=>{let a=await (0,i.R)("/api/user/check",{method:"POST",headers:{Accept:"application/json"},body:JSON.stringify(e)});return a.json()};var h={useUser:r,useUsers:o,add:s,update:m,updateById:u,del:d,delById:c,check:b}},94725:function(e,a,l){"use strict";var t=l(85893),n=l(67294),i=l(26713),r=l(85813),o=l(57953),s=l(3363),m=l(22850),u=l(97183),d=l(50888),c=l(28058),b=l(14856),h=l.n(b),y=l(80108),f=l.n(y);let p=()=>(0,t.jsx)(i.Z,{style:{height:"100%",width:"100%",justifyContent:"center",alignItems:"center"},children:(0,t.jsx)(r.Z,{children:(0,t.jsxs)(i.Z,{children:[(0,t.jsx)(o.Z,{}),"Loading, please wait..."]})})}),g=e=>{let{text:a,status:l,errors:b}=e,y=(0,n.useRef)(null),[p,g]=(0,n.useState)(),[v,P]=(0,n.useState)();(0,n.useEffect)(()=>{if(!(null==l?void 0:l.length)){g(void 0);return}g((0,t.jsx)("div",{className:f().status,children:(0,t.jsx)(s.Z,{direction:"vertical",items:l.map((e,a)=>({key:a,status:"finish",icon:a===l.length-1?(0,t.jsx)(d.Z,{}):void 0,title:e})).reverse()})}))},[l,b]),(0,n.useEffect)(()=>{if(!(null==b?void 0:b.length)){P(void 0);return}P((0,t.jsxs)("div",{className:f().errors,children:[b.map(e=>{let a=null;return e.includes("docker: command not found")||e.includes("Is the docker daemon running")?a=(0,t.jsxs)(r.Z,{children:["There is an error with your Docker installation.",(0,t.jsx)("br",{}),"Please verify that Docker is correctly installed and running."]}):(e.includes("EHOSTUNREACH")||e.includes("ENETUNREACH")||e.includes("ETIMEOUT"))&&(a=(0,t.jsxs)(r.Z,{children:["There is an error with your PostgreSQL installation.",(0,t.jsx)("br",{}),'Please verify that postgres Docker container "tanatloc-postgres" is correctly installed and running.']})),(0,t.jsxs)("div",{children:[e,a]},e)}),(0,t.jsx)(m.Z.Title,{level:5,style:{color:"red"},children:"Please restart the application"})]}))},[b]);let E=!!(null==l?void 0:l.length)||!!(null==b?void 0:b.length);return(0,t.jsxs)(u.Z,{children:[(0,t.jsx)("div",{className:h().logo,children:(0,t.jsx)("img",{src:"/images/logo.svg",alt:"Tanatloc"})}),(0,t.jsx)(r.Z,{className:f().loading,bodyStyle:{padding:0},title:(0,t.jsx)(i.Z,{children:(null==b?void 0:b.length)?(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(c.Z,{style:{fontSize:"32px",color:"red"}}),(0,t.jsx)(m.Z.Title,{level:3,style:{margin:"0"},children:"An error occurs"}),(0,t.jsx)("a",{href:"https://github.com/Airthium/tanatloc/issues/new/choose",target:"_blank",rel:"noreferrer",children:"Open an issue"})]}):(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(o.Z,{size:"large",indicator:(0,t.jsx)(d.Z,{})}),null!=a?a:"Loading, please wait..."]})}),children:E?(0,t.jsxs)("div",{ref:y,className:f().content,children:[v,p]}):null})]})};g.Simple=p,a.Z=g},26231:function(e,a,l){"use strict";l.d(a,{Z:function(){return o}});var t=l(67294);let n=(e,a)=>{if(!e||!a)return!1;let l=e.length,t=a.length;return l===t&&e.every((e,l)=>{let t=a[l];return null===e&&null===t||void 0===e&&void 0===t||(Array.isArray(e)?n(e,t):"object"==typeof e?i(e,t):e===t)})},i=(e,a)=>!!e&&!!a&&JSON.stringify(e)===JSON.stringify(a),r=(e,a,l)=>{let i=(0,t.useRef)();(0,t.useEffect)(()=>{if(!i.current||!i.current.length||!n(i.current,a))return i.current=[...null!=a?a:[!0]],e()},[...a||[],...l||[],e])};var o=r},80108:function(e){e.exports={loading:"loading_loading__JrCmd",content:"loading_content__NuP8g",status:"loading_status__UhnSG",errors:"loading_errors__j2ZIA",error:"loading_error__p5Dww"}}}]);