import Vue from "vue"
import Vuex from "vuex"
Vue.use(Vuex);

export default new Vuex.Store({
    state: {
      usermode:"",
      userid : "",
      username : "",
    },
    getters: {
    },
    mutations: {
      usermode(state,data){
        state.usermode = data;
      },
      userid(state,data){
        state.userid = data;
      },
      username(state,data){
        state.username = data;
      },
    },
    actions:{
      UPDusermode({ commit },data){
        commit('usermode',data)
      },
      UPDuserid({ commit },data){
        commit('userid',data)
      },
      UPDusername({ commit },data){
        commit('username',data)
      },
    }
  })