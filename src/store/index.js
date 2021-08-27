import Vue from "vue";
import Vuex from "vuex";

import { STORAGE_USER_KEY, Users } from "@/const";
import auth from "./auth";
import posts from "./posts";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {},
    storageUser: JSON.parse(localStorage.getItem(STORAGE_USER_KEY)) || {},
    error: null,
  },

  getters: {
    checkingStorageUser: (state) => Object.keys(state.storageUser).length !== 0,

    checkingUser: () => (item) => Object.keys(item).length !== 0,

    user: ({ user, storageUser }, { checkingUser }) =>
      [user, storageUser].find(checkingUser),

    error: (state) => state.error,

    isAuthUser: ({ user, storageUser }, { checkingUser }) =>
      [user, storageUser].some(checkingUser),

    role: (state) => state.user.role || state.storageUser.role,

    isWriter: (state, { role }) => role === Users.WRITER,

    isReader: (state, { role }) => role === Users.READER,
  },

  mutations: {
    setUser(state, { login, role, id }) {
      state.user = { login, role, id };
    },

    clearUser(state) {
      state.user = {};
      state.storageUser = {};
    },

    setError(state, message) {
      state.error = message;
    },

    clearError(state) {
      state.error = null;
    },
  },

  actions: {
    setUser({ commit, getters }, user) {
      if (!getters.checkingStorageUser) {
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
        commit("setUser", user);
      }
    },

    clearUser({ commit }) {
      commit("clearUser");
      localStorage.clear(STORAGE_USER_KEY);
    },
  },

  modules: {
    auth,
    posts,
  },

  strict: process.env.NODE_ENV !== "production",
});
