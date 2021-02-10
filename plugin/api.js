import LocalAPI from './local/src/lib'
import RescaleAPI from './rescale/src/lib'

export default { [LocalAPI.key]: LocalAPI, [RescaleAPI.key]: RescaleAPI }
