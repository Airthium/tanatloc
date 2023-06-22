/** @module Models */

import Poisson from './poisson'
import LinearElasticity from './linearElasticity'
import LinearElasticityTime from './linearElasticityTime'
import LinearElasticityModal from './linearElasticityModal'
import Stokes from './stokes'
import NavierStokesTime from './navierStokesTime'
import ThermicDiffusion from './thermicDiffusion'
import Magnetostatic from './magnetostatic'

/**
 * Models
 */
const models = [
  Poisson,
  LinearElasticity,
  LinearElasticityTime,
  LinearElasticityModal,
  Stokes,
  NavierStokesTime,
  ThermicDiffusion,
  Magnetostatic
]

export default models
