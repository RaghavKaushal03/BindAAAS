import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    token: null,
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_USER: (state, user) => {
      state.user = user;
    },
  },
  actions: {
    SET_RESPONSE: ({ commit }, payload) => {
      commit("SET_USER", payload.user);
      commit("SET_TOKEN", payload.token);
    },
  },
  modules: {},
  getters: {
    GET_USER: (state) => state.user,
    GET_TOKEN: (state) => state.token,
  },
});
