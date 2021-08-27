import { makeRequest } from "@/api/server";
import { STORAGE_CLAPS_KEY, COUNT_DELETED__ELEMENTS, Errors } from "@/const";

export default {
  state: {
    posts: [],
    hasPosts: true,
    isLoading: true,
    editPost: null,
  },

  getters: {
    posts: (state) => state.posts,
    editPost: (state) => state.editPost,
    hasPosts: (state) => state.hasPosts,
    isLoading: (state) => state.isLoading,
    postsForStorage: (state) =>
      state.posts.map(({ id, claps }) => ({
        id,
        claps,
      })),
  },

  mutations: {
    setPosts(state, posts) {
      state.posts = posts;
    },

    setEditPost(state, post) {
      state.editPost = post;
    },

    clearEditPost(state) {
      state.editPost = null;
    },

    changePost(state, { description, title, dateUpdate, id }) {
      const targetPost = state.posts.find((item) => {
        return item.id === id;
      });

      targetPost.description = description;
      targetPost.title = title;
      targetPost.updateAt = dateUpdate;
    },

    addPost(state, post) {
      state.posts.push(post);
    },

    setPostsInStorage(state, [post, claps]) {
      post.claps = claps;
    },

    setHasPosts(state) {
      state.hasPosts = false;
    },

    setIsLoading(state) {
      state.isLoading = false;
    },

    increaseClaps(state, post) {
      post.claps++;
    },

    deletePost(state, index) {
      state.posts.splice(index, COUNT_DELETED__ELEMENTS);
    },
  },

  actions: {
    async getPosts({ commit, state }) {
      if (!state.posts.length) {
        try {
          const posts = await makeRequest("http://localhost:3000/posts");
          commit("setPosts", posts);

          if (localStorage.getItem(STORAGE_CLAPS_KEY)) {
            const storagePosts = JSON.parse(
              localStorage.getItem(STORAGE_CLAPS_KEY)
            );

            state.posts.forEach((post) => {
              const currentClaps = storagePosts.find(
                (item) => item.id === post.id
              ).claps;

              commit("setPostsInStorage", [post, currentClaps]);
            });
          }
        } catch (error) {
          commit("setHasPosts");
          commit("setError", Errors.OTHER);
          console.log(error);
        } finally {
          commit("setIsLoading");
        }
      }
    },

    setClaps({ commit, getters }, post) {
      commit("increaseClaps", post);

      localStorage.setItem(
        STORAGE_CLAPS_KEY,
        JSON.stringify(getters.postsForStorage)
      );
    },

    deletePost({ commit, state }, post) {
      const index = state.posts.findIndex((item) => item.id === post.id);
      commit("deletePost", index);
    },

    setEditPost({ commit }, post) {
      commit("setEditPost", post);
    },

    changePost({ commit }, post) {
      commit("changePost", post);
    },

    addPost(
      { commit, rootGetters },
      { title, description, dateUpdate, dateCreate, id }
    ) {
      const formattedPost = {
        id,
        title,
        description,
        claps: 0,
        createdAt: dateCreate,
        updateAt: dateUpdate,
        userId: rootGetters.user.id,
      };

      commit("addPost", formattedPost);
    },

    clearEditPost({ commit }) {
      commit("clearEditPost");
    },
  },
};
