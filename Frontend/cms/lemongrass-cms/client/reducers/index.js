import { combineReducers } from 'redux'
import drinkType from './drinkType'
import drinkTemperature from './drinkTemperature'
import loader from './loader'
import language from './language'
import user from './user'
import autoDose from './autoDose'
import localization from './localization'
import historical from './historical'
import userPermission from './userPemission'

export default combineReducers({
  drinkType,
  drinkTemperature,
  loader,
  language,
  user,
  autoDose,
  localization,
  historical,
  userPermission,
})
