<template>
  <main-layout>
    <b-loading v-model="isLoading" :is-full-page="false" />
    <template v-if="!isLoading">
      <div v-if="hasPosts" class="container px-5">
        <ul class="columns is-multiline">
          <li
            class="
              column
              is-half-tablet is-one-third-desktop is-one-quarter-fullhd
            "
            v-for="post in renderedPosts"
            :key="post.id"
          >
            <div class="card">
              <div class="card-content">
                <div class="content">
                  <h2>{{ post.title }}</h2>
                  {{ post.description }}
                </div>
                <div
                  class="
                    card-footer
                    py-2
                    is-justify-content-space-between is-flex-wrap-wrap
                  "
                >
                  <ul class="has-text-grey-light is-size-7 mb-2">
                    <li>
                      Создан:
                      <time :datetime="post.createdAt">{{
                        days(post.createdAt)
                      }}</time>
                    </li>
                    <li>
                      Последнее обновление:
                      <time :datetime="post.createdAt">{{
                        days(post.updateAt)
                      }}</time>
                    </li>
                  </ul>
                  <b-button
                    v-if="isReader"
                    class="has-text-info"
                    icon-left="sign-language"
                    @click="onClapsClick(post)"
                  >
                    <span class="has-text-black"> {{ post.claps }} </span>
                  </b-button>
                  <div v-if="isWriter">
                    <b-button
                      class="has-text-info mr-2 mb-2"
                      icon-left="edit"
                      @click="onEditClick(post)"
                    >
                      <span class="has-text-black"> Изменить </span>
                    </b-button>
                    <b-button
                      class="has-text-info"
                      icon-left="trash-alt"
                      @click="onDeleteClick(post)"
                    >
                      <span class="has-text-black"> Удалить </span>
                    </b-button>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
        <b-pagination
          v-if="posts.length > this.$options.POST_ON_PAGE"
          :total="posts.length"
          :per-page="this.$options.POST_ON_PAGE"
          v-model="currentPage"
        />
      </div>
      <error-content v-else :message="error" />
    </template>
  </main-layout>
</template>
<script>
import MainLayout from "@/layouts/MainLayout";
import ErrorContent from "@/components/ErrorContent";

import { VISIBLE_POSTS_ON_PAGE } from "@/const";
import { getRenderedDate } from "@/utils";

import { mapGetters, mapActions } from "vuex";

export default {
  name: "Home",

  components: { MainLayout, ErrorContent },

  data: () => ({
    currentPage: 1,
  }),

  computed: {
    ...mapGetters([
      "error",
      "postsError",
      "posts",
      "hasPosts",
      "isLoading",
      "isWriter",
      "isReader",
    ]),

    startIndex() {
      return (this.currentPage - 1) * this.$options.POST_ON_PAGE;
    },

    endIndex() {
      return this.currentPage * this.$options.POST_ON_PAGE;
    },

    renderedPosts() {
      return this.posts.slice(this.startIndex, this.endIndex);
    },

    days() {
      return (date) => getRenderedDate(date);
    },
  },

  watch: {
    postsError() {
      if (this.postsError) {
        this.createNotification();
      }
    },
  },

  async created() {
    await this.getPosts();
  },

  POST_ON_PAGE: VISIBLE_POSTS_ON_PAGE,

  methods: {
    ...mapActions(["getPosts", "setClaps", "deletePost", "setEditPost"]),
    onClapsClick(post) {
      this.setClaps(post);
    },

    createNotification() {
      this.$buefy.notification.open({
        duration: 3000,
        message: this.postsError,
        position: "is-top-right",
        type: "is-danger",
        hasIcon: true,
      });
    },

    async onDeleteClick(post) {
      await this.deletePost(post);

      if (this.postsError) {
        this.createNotification();
      }
    },

    async onEditClick(post) {
      await this.setEditPost(post);
      this.$router.push({ name: "edit" });
    },
  },
};
</script>
