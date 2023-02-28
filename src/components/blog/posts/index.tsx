/** @module Components.Blog.Posts */

import * as Poisson from './1-poisson'
import * as Stokes from './2-stokes'
import * as LinearElasticity from './3-linearElasticity'
import * as ModalAnalysis from './4-modalAnalysis'
import * as ThermalDiffusion from './5-thermalDiffusion'
import * as ThermalExpansion from './6-thermalExpansion'

const Posts = [
  Poisson,
  Stokes,
  LinearElasticity,
  ModalAnalysis,
  ThermalDiffusion,
  ThermalExpansion
]

export default Posts
