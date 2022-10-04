/** @module Models */

import Poisson from './poisson'
import LinearElasticity from './linearElasticity'
import LinearElasticityTime from './linearElasticityTime'
import Stokes from './stokes'
import NavierStokesTime from './navierStokesTime'
import ThermicDiffusion from './thermicDiffusion'

/**
 * Models
 */
const models = [
  Poisson,
  LinearElasticity,
  LinearElasticityTime,
  Stokes,
  NavierStokesTime,
  ThermicDiffusion
]

export default models