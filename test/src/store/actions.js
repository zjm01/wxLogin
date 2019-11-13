import {
  RECEIVE_USER_INFO,

} from './mutation-types'

export default{
  getUserInfo({commit},userInfo) {
          commit(RECEIVE_USER_INFO,userInfo)
        },
        
}