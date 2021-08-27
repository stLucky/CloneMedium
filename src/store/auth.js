import { makeRequest } from "@/api/server";
import { Errors, BASE_URL } from "@/const";

export default {
  actions: {
    async login({ commit, dispatch }, { email, password }) {
      try {
        const userWrap = await makeRequest(`${BASE_URL}/users?login=${email}`);

        if (userWrap.length) {
          const INDEX_USER = 0;
          const user = userWrap[INDEX_USER];
          const { login, password: basePassword, role, id } = user;

          if (basePassword === +password) {
            commit("clearError");
            dispatch("setUser", { login, role, id });
          } else {
            commit("setError", Errors.INVALID_PASSWORD);
          }
        } else {
          commit("setError", Errors.NON_EXISTING_USER);
        }
      } catch (error) {
        console.log(error);
        commit("setError", Errors.OTHER);
      }
    },

    logout({ dispatch }) {
      dispatch("clearUser");
    },
  },
};
