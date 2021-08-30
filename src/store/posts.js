import { makeRequest } from "@/api/server";
import {
  Storage,
  COUNT_DELETED__ELEMENTS,
  BASE_URL,
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
          const posts = await makeRequest(`${BASE_URL}posts`);
          commit("setPosts", posts);

          if (localStorage.getItem(Storage.CLAPS)) {
            const storagePosts = JSON.parse(
              localStorage.getItem(Storage.CLAPS)
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

    async setClaps({ state, getters, commit }, post) {
      try {
        commit("increaseClaps", post);

        const updatePost = {
          claps: post.claps,
        };

        await makeRequest(`${BASE_URL}posts/${post.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
          body: JSON.stringify(updatePost),
        });

        if (state.postsError) {
          commit("clearPostsError");
        }

        localStorage.setItem(
          Storage.CLAPS,
          JSON.stringify(getters.postsForStorage)
        );
      } catch (error) {
        console.log(error);
        commit("setPostsError", PostsErrors.NON_UPDATED_LIKE);
      }
    },

    async deletePost({ commit, state }, post) {
      const index = state.posts.findIndex((item) => item.id === post.id);

      try {
        await makeRequest(`${BASE_URL}posts/${post.id}`, {
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

      localStorage.setItem(Storage.EDIT_POST, JSON.stringify(post));
    },

    async changePost({ commit, state }, post) {
      const updatePost = {
        description: post.description,
        title: post.title,
        updateAt: post.dateUpdate,
      };

      try {
        await makeRequest(`${BASE_URL}posts/${post.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json;charset=utf-8",
          },
          body: JSON.stringify(updatePost),
        });

        if (state.postsError) {
          commit("clearPostsError");
        }

        commit("changePost", post);
      } catch (error) {
        console.log(error);
        commit("setPostsError", PostsErrors.NON_UPDATED_POST);
      }
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
        await makeRequest(`${BASE_URL}posts`, {
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
