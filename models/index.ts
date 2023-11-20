/** @module Models */

import Poisson from './poisson'
import LinearElasticity from './linearElasticity'
import LinearElasticityTime from './linearElasticityTime'
import LinearElasticityModal from './linearElasticityModal'
import Stokes from './stokes'
import StokesTime from './stokesTime'
import NavierStokesTime from './navierStokesTime'
import ThermicDiffusion from './thermicDiffusion'
import Magnetostatic from './magnetostatic'
import Magnetostatic2Bodies from './magnetostatic2Bodies'

/**
 * Models
 */
const models = [
  Poisson,
  LinearElasticity,
  LinearElasticityTime,
  LinearElasticityModal,
  Stokes,
  StokesTime,
  NavierStokesTime,
  ThermicDiffusion,
  Magnetostatic,
  Magnetostatic2Bodies
]

export default models
