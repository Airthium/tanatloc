"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[4416],{47403:function(e,a,l){l.d(a,{E:function(){return n},j:function(){return t}});var t=[{label:"Density",symbol:"Rho",unit:"\\(kg.m^{-3}\\)"},{label:"Young's modulus",symbol:"E",unit:"\\(Pa\\)"},{label:"Poisson's ratio",symbol:"Nu",unit:"\\(1\\)"},{label:"Thermal conductivity",symbol:"Lambda",unit:"\\(W.m^{-1}.K^{-1}\\)"},{label:"Heat capacity",symbol:"Cp",unit:"\\(J.K^{-1}.kg^{-1}\\)"},{label:"Dynamic viscosity",symbol:"Mu",unit:"\\(Pa.s^{-1}\\)"}],n={metal:{label:"Metal",children:[{key:"steel",label:"Generic Steel",children:[{label:"Density",symbol:"Rho",value:7850},{label:"Young's modulus",symbol:"E",value:21e8},{label:"Poisson's ratio",symbol:"Nu",value:.3},{label:"Thermal conductivity",symbol:"Lambda",value:15},{label:"Heat capacity",symbol:"Cp",value:502}]},{key:"S235JR+AR",label:"Steel (S235JR+AR)",children:[{label:"Density",symbol:"Rho",value:7850},{label:"Young's modulus",symbol:"E",value:21e8},{label:"Poisson's ratio",symbol:"Nu",value:.27},{label:"Thermal conductivity",symbol:"Lambda",value:15},{label:"Heat capacity",symbol:"Cp",value:502}]},{key:"304",label:"Stainless Steel 304",children:[{label:"Density",symbol:"Rho",value:8e3},{label:"Young's modulus",symbol:"E",value:193e9},{label:"Poisson's ratio",symbol:"Nu",value:.29},{label:"Thermal conductivity",symbol:"Lambda",value:16.2},{label:"Heat capacity",symbol:"Cp",value:500},{label:"Yield strength",symbol:"SigmaY",value:215e6}]},{key:"316L",label:"Stainless Steel 316L",children:[{label:"Density",symbol:"Rho",value:7990},{label:"Young's modulus",symbol:"E",value:193e9},{label:"Poisson's ratio",symbol:"Nu",value:.25},{label:"Thermal conductivity",symbol:"Lambda",value:16.2},{label:"Heat capacity",symbol:"Cp",value:500},{label:"Yield strength",symbol:"SigmaY",value:29e7}]},{key:"6082-O",label:"Aluminium 6082-O",children:[{label:"Density",symbol:"Rho",value:2700},{label:"Young's modulus",symbol:"E",value:69e9},{label:"Poisson's ratio",symbol:"Nu",value:.33},{label:"Thermal conductivity",symbol:"Lambda",value:170},{label:"Heat capacity",symbol:"Cp",value:960},{label:"Yield strength",symbol:"SigmaY",value:6e7}]},{key:"7075-O",label:"Aluminium 7075-O",children:[{label:"Density",symbol:"Rho",value:2810},{label:"Young's modulus",symbol:"E",value:717e8},{label:"Poisson's ratio",symbol:"Nu",value:.33},{label:"Thermal conductivity",symbol:"Lambda",value:173},{label:"Heat capacity",symbol:"Cp",value:960},{label:"Yield strength",symbol:"SigmaY",value:11e7}]},{key:"2017A",label:"Aluminium 2017A",children:[{label:"Density",symbol:"Rho",value:2790},{label:"Young's modulus",symbol:"E",value:725e8},{label:"Poisson's ratio",symbol:"Nu",value:.33},{label:"Thermal conductivity",symbol:"Lambda",value:134},{label:"Heat capacity",symbol:"Cp",value:873},{label:"Yield strength",symbol:"SigmaY",value:275e6}]}]},polymer:{label:"Polymer",children:[{key:"PMMA",label:"PMMA",children:[{label:"Density",symbol:"Rho",value:1180},{label:"Young's modulus",symbol:"E",value:29e8},{label:"Poisson's ratio",symbol:"Nu",value:.36},{label:"Thermal conductivity",symbol:"Lambda",value:.193},{label:"Heat capacity",symbol:"Cp",value:1480},{label:"Yield strength",symbol:"SigmaY",value:69e6}]}]},fluid:{label:"Fluid",children:[{key:"water",label:"Water",children:[{label:"Density",symbol:"Rho",value:1e3},{label:"Dynamic viscosity",symbol:"Mu",value:.001},{label:"Thermal conductivity",symbol:"Lambda",value:.6},{label:"Heat capacity",symbol:"Cp",value:4185}]}]}}},20518:function(e,a,l){l.d(a,{Z:function(){return t}});var t=[{category:"Academic",name:"Poisson's equation",algorithm:"poisson",code:"FreeFEM",version:"1.0.0",description:'\n  <h3>\n    Poisson\'s equation\n  </h3>\n  <p>\n  Let \\(\\Omega\\) be a domain of \\(\\mathbb{R}^{d}\\), with \\(d\\in\\{2,3\\}\\).<br/>\n\n  The domain \\(\\Omega\\) is bounded by \\(\\Gamma = \\Gamma_D \\cup \\Gamma_N\\).<br/>\n\n  The Poisson\'s equation reads as follow:\n  \\begin{align}\n    \\Delta u &= f &\\text{on }\\Omega\\\\\n    u &= u_D &\\text{on }\\Gamma_D\\\\\n    \\nabla u &= g_N &\\text{on }\\Gamma_N\n  \\end{align}\n  </p>\n  <figure>\n    <img src="/images/Poisson.png" alt="Poisson" />\n    <figcaption>Poisson\'s equation example on a cube.</figcaption>\n  </figure>\n  <p>\n      See <a target="_blank" href="https://en.wikipedia.org/wiki/Poisson%27s_equation">Wikipedia</a>.\n  </p>\n  ',configuration:{geometry:{index:1,title:"Geometry",meshable:!0},parameters:{index:2,title:"Parameters",rightHandSide:{label:"Right hand side",children:[{label:"External force",htmlEntity:"formula",default:0}]},finiteElementSpace:{advanced:!0,label:"Finite element space",children:[{label:"u",htmlEntity:"select",options:[{label:"P1",value:"P1"},{label:"P2",value:"P2"}],default:"P1"}]},solver:{advanced:!0,label:"Solver",children:[{label:"System resolution",htmlEntity:"select",options:[{label:"GMRES",value:"GMRES"},{label:"MUMPS",value:"MUMPS"},{label:"UMFPACK",value:"UMFPACK"}],default:"MUMPS"}]}},boundaryConditions:{index:3,title:"Boundary conditions",dirichlet:{label:"Dirichlet",children:[{label:"u",htmlEntity:"formula",default:0}]},neumann:{label:"Neumann",children:[{label:"du/dn",htmlEntity:"formula",default:0}]}},run:{index:4,title:"Run",results:[{name:"u"}]}}},{category:"Mechanics",name:"Linear elasticity",algorithm:"linearElasticity",code:"FreeFEM",version:"1.0.0",description:'\n  <h3>\n    Linear elasticity\n  </h3>\n  <p>\n  Let \\(\\Omega\\) be a domain of \\(\\mathbb{R}^{d}\\), with \\(d\\in\\{2,3\\}\\).<br/>\n\n  The domain \\(\\Omega\\) is bounded by \\(\\Gamma = \\Gamma_D \\cup \\Gamma_N\\).<br/>\n\n    \\(u\\) is the displacement.<br/>\n\n  The linear elasticity equation reads as follow:\n\n  $$\n  \\begin{align}\n    -\\text{div}(\\sigma) &= f &\\text{on }\\Omega\\\\\n    u &= u_D&\\text{on }\\Gamma_D\\\\\n    \\sigma\\cdot n &= u_N&\\text{on }\\Gamma_N\n  \\end{align}\n  $$\n\n  With \\(\\sigma_{ij}(u) = \\lambda\\delta_{ij}\\nabla\\cdot u + 2\\mu\\epsilon_{ij}(u)\\).<br/>\n\n  \\(\\lambda\\) and \\(\\mu\\) are the Lam\xe9 coefficients.\n  </p>\n  <figure>\n    <img src="/images/LinearElasticity.png" alt="Linear Elasticity" />\n    <figcaption>Linear elasticity equation example on a beam.</figcaption>\n  </figure>\n  <p>\n    See <a target="_blank" href="https://en.wikipedia.org/wiki/Linear_elasticity">Wikipedia</a>.\n  </p>\n  ',variables:[{name:"Displacement (x)",value:"Ux"},{name:"Displacement (y)",value:"Uy"},{name:"Displacement (z)",value:"Uz"}],configuration:{geometry:{index:1,title:"Geometry",meshable:!0},materials:{index:2,title:"Materials",children:[{label:"Density",name:"Rho",htmlEntity:"formula",default:8050,unit:"\\(kg.m^{-3}\\)"},{label:"Young's modulus",name:"E",htmlEntity:"formula",default:1e9,unit:"\\(Pa\\)"},{label:"Poisson's ratio",name:"Nu",htmlEntity:"formula",default:.4,unit:"\\(1\\)"}]},parameters:{index:3,title:"Parameters",rightHandSide:{label:"Right hand side",children:[{label:"External force (x)",htmlEntity:"formula",default:0,unit:"\\(N.m^{-3}\\)"},{label:"External force (y)",htmlEntity:"formula",default:0,unit:"\\(N.m^{-3}\\)"},{only3D:!0,label:"External force (z)",htmlEntity:"formula",default:0,unit:"\\(N.m^{-3}\\)"}]},gravity:{advanced:!0,label:"Gravity",children:[{label:"Standard gravity",htmlEntity:"formula",default:9.81,unit:"\\(m.s^{-2}\\)"}]},finiteElementSpace:{advanced:!0,label:"Finite element space",children:[{label:"[Ux, Uy, Uz]",label2D:"[Ux, Uy]",htmlEntity:"select",options:[{label:"P1",value:"P1, P1, P1",value2D:"P1, P1"},{label:"P2",value:"P2, P2, P2",value2D:"P2, P2"}],default:"P1, P1, P1",default2D:"P1, P1"}]},solver:{advanced:!0,label:"Solver",children:[{label:"System resolution",htmlEntity:"select",options:[{label:"GMRES",value:"GMRES"},{label:"MUMPS",value:"MUMPS"},{label:"UMFPACK",value:"UMFPACK"}],default:"MUMPS"}]},meshAdaptation:{advanced:!0,label:"Mesh adaptation",children:[{label:"Enabled",htmlEntity:"checkbox",default:!1},{label:"Number of mesh adaptation loops",htmlEntity:"formula",default:1}]}},boundaryConditions:{index:4,title:"Boundary conditions",fixed:{label:"Fixed",refineFactor:2},displacement:{label:"Displacement",children:[{label:"Ux",htmlEntity:"formula",default:0,unit:"\\(m\\)"},{label:"Uy",htmlEntity:"formula",default:0,unit:"\\(m\\)"},{only3D:!0,label:"Uz",htmlEntity:"formula",default:0,unit:"\\(m\\)"}],refineFactor:2},presure:{label:"Surface force",children:[{label:"d(U)/d(N)",htmlEntity:"formula",default:0,unit:"\\(N.m^{-2}\\)"}],refineFactor:2}},run:{index:5,title:"Run",results:[{name:"Displacement"},{name:"vonMises"},{name:"gamma11"},{name:"gamma12"},{name:"gamma13"},{name:"gamma22"},{name:"gamma23"},{name:"gamma33"}],postprocessing:[{key:"warpByVector",parameters:[{key:"Vectors",value:"Displacement"}]},{key:"contour",parameters:[{key:"ContourBy",options:["Displacement","vonMises","gamma11","gamma12","gamma13","gamma22","gamma23","gamma33"]}]}]}}},{category:"Mechanics",name:"Linear elasticity (time depedent)",algorithm:"linearElasticityTime",code:"FreeFEM",version:"1.0.0",description:'\n  <h3>\n    Linear elasticity (time dependent)\n  </h3>\n  <p>\n  Let \\(\\Omega\\) be a domain of \\(\\mathbb{R}^{d}\\), with \\(d\\in\\{2,3\\}\\).<br/>\n\n  The domain \\(\\Omega\\) is bounded by \\(\\Gamma = \\Gamma_D \\cup \\Gamma_N\\).<br/>\n\n    \\(u\\) is the displacement.<br/>\n\n  The linear elasticity equation reads as follow:\n\n  $$\n  \\begin{align}\n    \\frac{\\partial^2u}{\\partial t^2}-\\text{div}(\\sigma) &= f &\\text{on }\\Omega\\\\\n    u &= u_D&\\text{on }\\Gamma_D\\\\\n    \\sigma\\cdot n &= u_N&\\text{on }\\Gamma_N\n  \\end{align}\n  $$\n\n  With \\(\\sigma_{ij}(u) = \\lambda\\delta_{ij}\\nabla\\cdot u + 2\\mu\\epsilon_{ij}(u)\\).<br>\n\n  \\(\\lambda\\) and \\(\\mu\\) are the Lam\xe9 coefficients.\n  </p>\n  <figure>\n    <img src="/images/LinearElasticity.png" alt="Linear Elasticity" />\n    <figcaption>Linear elasticity equation example on a beam.</figcaption>\n  </figure>\n  <p>\n    See <a target="_blank" href="https://en.wikipedia.org/wiki/Linear_elasticity">Wikipedia</a>.\n  </p>\n  ',configuration:{geometry:{index:1,title:"Geometry",meshable:!0},materials:{index:2,title:"Materials",children:[{label:"Density",name:"Rho",htmlEntity:"formula",default:8050,unit:"\\(kg.m^{-3}\\)"},{label:"Young's modulus",name:"E",htmlEntity:"formula",default:1e9,unit:"\\(Pa\\)"},{label:"Poisson's ratio",name:"Nu",htmlEntity:"formula",default:.4,unit:"\\(1\\)"}]},parameters:{index:3,title:"Parameters",rightHandSide:{label:"Right hand side",children:[{label:"External force (x)",htmlEntity:"formula",default:0,unit:"\\(N.m^{-3}\\)"},{label:"External force (y)",htmlEntity:"formula",default:0,unit:"\\(N.m^{-3}\\)"},{only3D:!0,label:"External force (z)",htmlEntity:"formula",default:0,unit:"\\(N.m^{-3}\\)"}]},gravity:{advanced:!0,label:"Gravity",children:[{label:"Standard gravity",htmlEntity:"formula",default:9.81,unit:"\\(m.s^{-2}\\)"}]},time:{label:"Time",children:[{label:"Total time",htmlEntity:"formula",default:1,unit:"\\(s\\)"},{label:"Time step",htmlEntity:"formula",default:.1,unit:"\\(s\\)"}]},finiteElementSpace:{advanced:!0,label:"Finite element space",children:[{label:"[Ux, Uy, Uz]",label2D:"[Ux, Uy]",htmlEntity:"select",options:[{label:"P1",value:"P1, P1, P1",value2D:"P1, P1"},{label:"P2",value:"P2, P2, P2",value2D:"P2, P2"}],default:"P1, P1, P1",default2D:"P1, P1"}]},solver:{advanced:!0,label:"Solver",children:[{label:"System resolution",htmlEntity:"select",options:[{label:"GMRES",value:"GMRES"},{label:"MUMPS",value:"MUMPS"},{label:"UMFPACK",value:"UMFPACK"}],default:"MUMPS"}]},meshAdaptation:{advanced:!0,label:"Mesh adaptation",children:[{label:"Enabled",htmlEntity:"checkbox",default:!1}]}},boundaryConditions:{index:4,title:"Boundary conditions",fixed:{label:"Fixed",refineFactor:2},displacement:{label:"Displacement",children:[{label:"Ux",htmlEntity:"formula",default:0,unit:"\\(m\\)"},{label:"Uy",htmlEntity:"formula",default:0,unit:"\\(m\\)"},{only3D:!0,label:"Uz",htmlEntity:"formula",default:0,unit:"\\(m\\)"}],refineFactor:2},presure:{label:"Surface force",children:[{label:"d(U)/d(N)",htmlEntity:"formula",default:0,unit:"\\(N.m^{-2}\\)"}],refineFactor:2}},run:{index:5,title:"Run",results:[{name:"Displacement"},{name:"vonMises"},{name:"gamma11"},{name:"gamma12"},{name:"gamma13"},{name:"gamma22"},{name:"gamma23"},{name:"gamma33"}],resultsFilter:{name:"Time",prefixPattern:"Result_",suffixPattern:".vtu",pattern:"Result_\\d+.vtu",multiplicator:["parameters","time","children","1"]},postprocessing:[{key:"warpByVector",parameters:[{key:"Vectors",value:"Displacement"}]},{key:"contour",parameters:[{key:"ContourBy",options:["Displacement","vonMises","gamma11","gamma12","gamma13","gamma22","gamma23","gamma33"]}]}]}}},{category:"Fluid",name:"Stokes",algorithm:"stokes",code:"FreeFEM",version:"1.0.0",description:'\n  <h3>\n    Stokes\n  </h3>\n  <p>\n    Let \\(\\Omega\\) be a domain of \\(\\mathbb{R}^{d}\\), with \\(d\\in\\{2,3\\}\\).<br/>\n\n    The domain \\(\\Omega\\) is bounded by \\(\\Gamma = \\Gamma_D \\cup \\Gamma_N\\).<br/>\n\n    \\(u\\) is the velocity and \\(p\\) the pressure.<br/>\n\n    The Stokes equations reads as follow:\n\n    $$\n    \\begin{align}\n      \\mu\\Delta u - \\nabla p &= f&\\text{on }\\Omega\\\\\n      u &= u_D&\\text{on }\\Gamma_D\\\\\n      \\mu\\frac{\\partial u}{\\partial n} - pn &= g_N&\\text{on }\\Gamma_N\n    \\end{align}\n    $$\n\n    With \\(\\mu\\) the viscosity.\n  </p>\n  <figure>\n    <img src="/images/Stokes.png" alt="Stokes" />\n    <figcaption>Stokes equation example on a pipe.</figcaption>\n  </figure>\n  <p>\n    See <a target="_blank" href="https://en.wikipedia.org/wiki/Navier%E2%80%93Stokes_equations">Wikipedia</a>.\n  </p>\n  ',configuration:{geometry:{index:1,title:"Geometry",meshable:!0},materials:{index:2,title:"Materials",children:[{label:"Dynamic viscosity",name:"Mu",htmlEntity:"formula",default:.001,unit:"\\(Pa.s^{-1}\\)"}]},parameters:{index:3,title:"Parameters",rightHandSide:{label:"Right hand side",children:[{label:"External force (x)",htmlEntity:"formula",default:0,unit:"\\(N.m^{-3}\\)"},{label:"External force (y)",htmlEntity:"formula",default:0,unit:"\\(N.m^{-3}\\)"},{only3D:!0,label:"External force (z)",htmlEntity:"formula",default:0,unit:"\\(N.m^{-3}\\)"}]},finiteElementSpace:{advanced:!0,label:"Finite element space",children:[{label:"[Ux, Uy, Uz, p]",label2D:"[Ux, Uy, p]",htmlEntity:"select",options:[{label:"P2/P1",value:"P2, P2, P2, P1",value2D:"P2, P2, P1"},{label:"P1b/P1",value:"P1b, P1b, P1b, P1",value2D:"P1b, P1b, P1"}],default:"P2, P2, P2, P1",default2D:"P2, P2, P1"}]},solver:{advanced:!0,label:"Solver",children:[{label:"System resolution",htmlEntity:"select",options:[{label:"GMRES",value:"GMRES"},{label:"MUMPS",value:"MUMPS"},{label:"UMFPACK",value:"UMFPACK"}],default:"MUMPS"}]}},boundaryConditions:{index:5,title:"Boundary conditions",wall:{label:"Wall"},freeOutlet:{label:"Free outlet"},dirichlet:{label:"Velocity",children:[{label:"Ux",htmlEntity:"formula",default:0,unit:"\\(m.s^{-1}\\)"},{label:"Uy",htmlEntity:"formula",default:0,unit:"\\(m.s^{-1}\\)"},{only3D:!0,label:"Uz",htmlEntity:"formula",default:0,unit:"\\(m.s^{-1}\\)"}],refineFactor:2},neumann:{label:"Pressure",children:[{label:"d(U)/d(N)",htmlEntity:"formula",default:0,unit:"\\(N.m^{-2}\\)"}],refineFactor:2}},run:{index:6,title:"Run",results:[{name:"Velocity"},{name:"Presure"}],postprocessing:[{key:"streamTracer",parameters:[{key:"Vectors",value:"Velocity"}]}]}}},{category:"Fluid",name:"Navier-Stokes time-dependant",algorithm:"navierStokesTime",code:"FreeFEM",version:"1.0.0",description:'\n  <h3>\n    Navier-Stokes time-dependant\n  </h3>\n  <p>\n    Let \\(\\Omega\\) be a domain of \\(\\mathbb{R}^{d}\\), with \\(d\\in\\{2,3\\}\\).<br/>\n\n    The domain \\(\\Omega\\) is bounded by \\(\\Gamma = \\Gamma_D \\cup \\Gamma_N\\).<br/>\n\n    \\(u\\) is the velocity and \\(p\\) the pressure.<br/>\n\n    The Navier-Stokes equations reads as follow:\n\n    $$\n    \\begin{align}\n      \\rho\\frac{\\partial u}{\\partial t} + \\rho(u\\cdot\\nabla)u + \\nabla p - \\mu\\Delta u &= f&\\text{on }\\Omega\\\\\n      u &= u_D&\\text{on }\\Gamma_D\\\\\n      \\mu\\frac{\\partial u}{\\partial n} - pn &= g_N&\\text{on }\\Gamma_N\n    \\end{align}\n    $$\n\n    With \\(\\mu\\) the viscosity and \\(\\rho\\) the density.\n  </p>\n  <figure>\n    <img src="/images/Stokes.png" alt="Stokes" />\n    <figcaption>Navier-Stokes equation example on a pipe.</figcaption>\n  </figure>\n  </p>\n  <p>\n    See <a target="_blank" href="https://en.wikipedia.org/wiki/Navier%E2%80%93Stokes_equations">Wikipedia</a>.\n  </p>\n  ',configuration:{geometry:{index:1,title:"Geometry",meshable:!0},materials:{index:2,title:"Materials",children:[{label:"Density",name:"Rho",htmlEntity:"formula",default:1e3,unit:"\\(kg.m^{-3}\\)"},{label:"Dynamic viscosity",name:"Mu",htmlEntity:"formula",default:.001,unit:"\\(Pa.s^{-1}\\)"}]},parameters:{index:3,title:"Parameters",rightHandSide:{label:"Right hand side",children:[{label:"External force (x)",htmlEntity:"formula",default:0,unit:"\\(N.m^{-3}\\)"},{label:"External force (y)",htmlEntity:"formula",default:0,unit:"\\(N.m^{-3}\\)"},{only3D:!0,label:"External force (z)",htmlEntity:"formula",default:0,unit:"\\(N.m^{-3}\\)"}]},time:{label:"Time",children:[{label:"Total time",htmlEntity:"formula",default:1,unit:"\\(s\\)"},{label:"Time step",htmlEntity:"formula",default:.1,unit:"\\(s\\)"}]},finiteElementSpace:{advanced:!0,label:"Finite element space",children:[{label:"[Ux, Uy, Uz, p]",label2D:"[Ux, Uy, p]",htmlEntity:"select",options:[{label:"P2/P1",value:"P2, P2, P2, P1",value2D:"P2, P2, P1"},{label:"P1b/P1",value:"P1b, P1b, P1b, P1",value2D:"P1b, P1b, P1"}],default:"P2, P2, P2, P1",default2D:"P2, P2, P1"}]},solver:{advanced:!0,label:"Solver",children:[{label:"System resolution",htmlEntity:"select",options:[{label:"GMRES",value:"GMRES"},{label:"MUMPS",value:"MUMPS"},{label:"UMFPACK",value:"UMFPACK"}],default:"MUMPS"}]}},initialization:{index:4,title:"Initialization",done:!0,direct:{label:"Velocity",children:[{label:"Ux",htmlEntity:"formula",default:0,unit:"\\(m.s^{-1}\\)"},{label:"Uy",htmlEntity:"formula",default:0,unit:"\\(m.s^{-1}\\)"},{only3D:!0,label:"Uz",htmlEntity:"formula",default:0,unit:"\\(m.s^{-1}\\)"}]},coupling:{label:"Coupling",compatibility:[{algorithm:"navierStokesTime",filter:{name:"Time step",prefixPattern:"Result_",suffixPattern:".vtu",pattern:"Result_\\d+.vtu",multiplicator:["parameters","time","children","1"]}}]}},boundaryConditions:{index:5,title:"Boundary conditions",wall:{label:"Wall"},freeOutlet:{label:"Free outlet"},dirichlet:{label:"Velocity",children:[{label:"Ux",htmlEntity:"formula",default:0,unit:"\\(m.s^{-1}\\)"},{label:"Uy",htmlEntity:"formula",default:0,unit:"\\(m.s^{-1}\\)"},{only3D:!0,label:"Uz",htmlEntity:"formula",default:0,unit:"\\(m.s^{-1}\\)"}],refineFactor:2},neumann:{label:"Pressure",children:[{label:"d(U)/d(N)",htmlEntity:"formula",default:0,unit:"\\(N.m^{-2}\\)"}],refineFactor:2}},run:{index:6,title:"Run",results:[{name:"Velocity"},{name:"Presure"}],resultsFilter:{name:"Time",prefixPattern:"Result_",suffixPattern:".vtu",pattern:"Result_\\d+.vtu",multiplicator:["parameters","time","children","1"]}}}},{category:"Thermic",name:"Thermal diffusion",algorithm:"thermicDiffusion",code:"FreeFEM",version:"1.0.0",description:'\n  <h3>\n    Thermal diffusion\n  </h3>\n  <p>\n    Let \\(\\Omega\\) be a domain of \\(\\mathbb{R}^{d}\\), with \\(d\\in\\{2,3\\}\\).<br/>\n\n    The domain \\(\\Omega\\) is bounded by \\(\\Gamma = \\Gamma_D \\cup \\Gamma_N\\).<br/>\n\n      \\(T\\) is the temperature.<br/>\n\n    The heat equation reads as follow:\n\n    $$\n    \\begin{align}\n      \\rho C_p \\frac{\\partial T}{\\partial t} - \\lambda\\Delta T &= f&\\text{on }\\Omega\\\\\n      T &= T_D&\\text{on }\\Gamma_D\\\\\n      \\lambda\\frac{\\partial T}{\\partial n} &= g_N&\\text{on }\\Gamma_N\n    \\end{align}\n    $$\n\n    With \\(\\rho\\) the density, \\(C_p\\) the heat capacity and \\(\\lambda\\) the thermal conductivity.\n  </p>\n\n  <figure>\n    <img src="/images/Heat.png" alt="Heat" />\n    <figcaption>Heat equation example on a beam.</figcaption>\n  </figure>\n  </p>\n\n  <p>\n    See <a target="_blank" href="https://en.wikipedia.org/wiki/Navier%E2%80%93Stokes_equations">Wikipedia</a>.\n  </p>\n  ',configuration:{geometry:{index:1,title:"Geometry",meshable:!0},materials:{index:2,title:"Materials",children:[{label:"Density",name:"Rho",htmlEntity:"formula",default:7960,unit:"\\(kg.m^{-3}\\)"},{label:"Thermal conductivity",name:"Lambda",htmlEntity:"formula",default:15,unit:"\\(W.m^{-1}.K^{-1}\\)"},{label:"Heat capacity",name:"Cp",htmlEntity:"formula",default:502,unit:"\\(J.K^{-1}.kg^{-1}\\)"}]},parameters:{index:3,title:"Parameters",time:{label:"Time",children:[{label:"Total time",htmlEntity:"formula",default:1,unit:"\\(s\\)"},{label:"Time step",htmlEntity:"formula",default:.1,unit:"\\(s\\)"}]},finiteElementSpace:{advanced:!0,label:"Finite element space",children:[{label:"T",htmlEntity:"select",options:[{label:"P1",value:"P1"},{label:"P2",value:"P2"}],default:"P1"}]},solver:{advanced:!0,label:"Solver",children:[{label:"System resolution",htmlEntity:"select",options:[{label:"GMRES",value:"GMRES"},{label:"MUMPS",value:"MUMPS"},{label:"UMFPACK",value:"UMFPACK"}],default:"MUMPS"}]}},boundaryConditions:{index:4,title:"Boundary conditions",temperature:{label:"Temperature",children:[{label:"T",htmlEntity:"formula",default:0,unit:"K"}],refineFactor:2}},run:{index:5,title:"Run",results:[{name:"T"}],resultsFilter:{name:"Time",prefixPattern:"Result_",suffixPattern:".vtu",pattern:"Result_\\d+.vtu",multiplicator:["parameters","time","children","1"]}}}}]},41641:function(e,a,l){l.d(a,{HS:function(){return o},Lw:function(){return P},m1:function(){return y},o6:function(){return p},w6:function(){return u},ks:function(){return v},Qj:function(){return x}});var t=l(85893),n=l(84908),i=l(71577),r=l(64789),o=function(e){var a=e.disabled,l=e.primary,o=void 0===l||l,m=e.light,u=e.dark,s=e.fullWidth,d=e.needMargin,c=e.loading,b=e.children,h=e.onAdd;return(0,t.jsx)(n.Z,{title:b||"Add",children:(0,t.jsx)(i.Z,{className:(s?"full-width":"")+(d?" marginLeft-5":"")+(m?" text-light":"")+(u?" text-dark":""),disabled:a,loading:c,type:o?"primary":"default",icon:(0,t.jsx)(r.Z,{}),onClick:function(){return h()},children:b})})},m=l(86548),u=function(e){var a,l=e.disabled,r=e.primary,o=void 0!==r&&r,u=e.bordered,s=e.light,d=e.dark,c=e.needMargin,b=e.loading,h=e.children,y=e.onEdit;return a=l?"link":o?"primary":"default",(0,t.jsx)(n.Z,{title:h||"Edit",children:(0,t.jsx)(i.Z,{className:"no-background "+(c?"marginLeft-5 ":"")+(s?"text-light ":"")+(d?"text-dark ":"")+(u?"":"no-border "),disabled:l,loading:b,type:a,icon:(0,t.jsx)(m.Z,{}),onClick:y,children:h})})},s=l(47568),d=l(20414),c=l(67294),b=l(48689),h=l(32834),y=function(e){var a=e.disabled,l=e.loading,r=e.bordered,o=e.text,m=e.title,u=e.children,y=e.onDelete,f=(0,c.useState)(!1),p=f[0],g=f[1];return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(h.AN,{visible:p,loading:l,title:m||"Delete",onCancel:function(){return g(!1)},onOk:(0,s.Z)((function(){return(0,d.__generator)(this,(function(e){switch(e.label){case 0:return[4,y()];case 1:return e.sent(),g(!1),[2]}}))})),children:o||"Are you sure?"}),(0,t.jsx)(n.Z,{title:u||"Delete",children:(0,t.jsx)(i.Z,{className:"no-background "+(r?"":"no-border"),danger:!0,disabled:a,type:a?"link":void 0,loading:l,icon:(0,t.jsx)(b.Z,{}),onClick:function(){return g(!0)},children:u})})]})},f=l(23430),p=function(e){var a=e.disabled,l=e.loading,r=e.bordered,o=e.children,m=e.onDownload;return(0,t.jsx)(n.Z,{title:o||"Download",children:(0,t.jsx)(i.Z,{className:"no-background "+(r?"":"no-border"),disabled:a,loading:l,icon:(0,t.jsx)(f.Z,{}),onClick:function(){return m()},children:o})})},g=l(82826),v=function(e){var a=e.children,l=e.onClick;return(0,t.jsx)(i.Z,{className:"no-border",icon:(0,t.jsx)(g.Z,{className:"color-primary"}),onClick:l,children:a||"Go back"})},P=function(e){var a=e.disabled,l=e.loading,r=e.children,o=e.onCancel;return(0,t.jsx)(n.Z,{title:r||"Cancel",children:(0,t.jsx)(i.Z,{disabled:a,loading:l,type:"default",onClick:o,children:r||"Cancel"})})},x=function(e){var a=e.children,l=e.onClick;return(0,t.jsx)(i.Z,{type:"link",onClick:l,style:{padding:0},children:a})}},60877:function(e,a,l){var t=l(85893),n=l(84908),i=l(63922),r=l(24093),o=l(11382),m=l(13023),u=l(48764).lW,s=function(e){return e?"hsl("+Array.from(e).reduce((function(e,a){return a.charCodeAt(0)+((e<<5)-e)}),0)%360+", 100%, 25%)":"#FFFFFF"},d=function(e){var a=e.toString(16);return 1===a.length?"0"+a:a},c={deepCopy:function(e){return JSON.parse(JSON.stringify(e))},stringToColor:s,rgbToHex:function(e){return"#"+d(Math.floor(255*e.r))+d(Math.floor(255*e.g))+d(Math.floor(255*e.b))},rgbToRgba:function(e){var a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:1;return e?"rgba("+255*e.r+", "+255*e.g+", "+255*e.b+", "+a+")":"rgba(255, 255, 255, 0)"},userToAvatar:function(e){var a=e.avatar&&u.from(e.avatar).toString(),l="",m="";return e.firstname||e.lastname?(l=e.firstname?e.firstname+" ":"",l+=e.lastname||"",m=e.firstname?e.firstname[0]:"",m+=e.lastname?e.lastname[0]:""):e.email&&(l=e.email,m=e.email[0]),(0,t.jsx)(n.Z,{title:l+(e.pending?" (Invite pending)":""),children:(0,t.jsx)(i.Z,{count:e.pending&&"Pending...",offset:[30,5],style:{backgroundColor:"#ff4d4f",zIndex:10},children:(0,t.jsx)(r.C,{src:a,style:{backgroundColor:s(l)},children:m.toUpperCase()||(0,t.jsx)(o.Z,{})})})},e.id||JSON.stringify(e))},groupToAvatar:function(e){var a=e.name,l="";return a&&(l=a[0]),(0,t.jsx)(n.Z,{title:a,children:(0,t.jsx)(r.C,{style:{backgroundColor:s(a)},children:l.toUpperCase()||(0,t.jsx)(o.Z,{})})},e.id||JSON.stringify(e))},validateEmail:function(e){return!!(0,m.parseOneAddress)(e)},getGitVersion:function(){return"git-front-3d9b281"}};a.Z=c}}]);