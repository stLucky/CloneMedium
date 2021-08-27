import { makeRequest } from "@/api/server";
import {
  STORAGE_CLAPS_KEY,
  COUNT_DELETED__ELEMENTS,
  Errors,
  PostsErrors,
} from "@/const";

export default {
  state: {
    posts: [],
    hasPosts: true,
    isLoading: true,
    editPost: null,
    postsError: null,
  },

  getters: {
    posts: (state) => state.posts,
    postsError: (state) => state.postsError,
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

    setPostsError(state, message) {
      state.postsError = message;
    },

    clearPostsError(state) {
      state.postsError = null;
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

    async deletePost({ commit, state }, post) {
      const index = state.posts.findIndex((item) => item.id === post.id);

      try {
        await makeRequest(`http://localhost:3000/posts/${post.id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
        });

        if (state.postsError) {
          commit("clearPostsError");
        }

        commit("deletePost", index);
      } catch (error) {
        console.log(error);
        commit("setPostsError", PostsErrors.NON_DELETED_POST);
      }
    },

    setEditPost({ commit }, post) {
      commit("setEditPost", post);
    },

    changePost({ commit }, post) {
      commit("changePost", post);
    },

    async addPost(
      { commit, state, rootGetters },
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

      try {
        await makeRequest(`http://localhost:3000/posts`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
          body: JSON.stringify(formattedPost),
        });

        if (state.postsError) {
          commit("clearPostsError");
        }

        commit("addPost", formattedPost);
      } catch (error) {
        console.log(error);
        commit("setPostsError", PostsErrors.NON_CREATED_POST);
      }
    },

    clearEditPost({ commit }) {
      commit("clearEditPost");
    },
  },
};
