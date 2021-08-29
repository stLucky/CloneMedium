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
            <div class="card" style="height: 100%">
              <div
                class="card-content is-flex is-flex-direction-column"
                style="height: 100%"
              >
                <div class="content is-flex-grow-1">
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

import { VISIBLE_POSTS_ON_PAGE, Storage } from "@/const";
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
      this.onCheckingError();
    },

    currentPage(value) {
      localStorage.setItem(Storage.PAGE, value);
    },
  },

  async created() {
    await this.getPosts();

    if (localStorage.getItem(Storage.PAGE)) {
      const storagePage = JSON.parse(localStorage.getItem(Storage.PAGE));
      this.currentPage = storagePage;
    }
  },

  POST_ON_PAGE: VISIBLE_POSTS_ON_PAGE,

  methods: {
    ...mapActions(["getPosts", "setClaps", "deletePost", "setEditPost"]),

    async onClapsClick(post) {
      await this.setClaps(post);
      this.onCheckingError();
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

    onCheckingError() {
      if (this.postsError) {
        this.createNotification();
      }
    },

    async onDeleteClick(post) {
      await this.deletePost(post);
      this.onCheckingError();
    },

    async onEditClick(post) {
      await this.setEditPost(post);
      this.$router.push("/post/edit");
    },
  },
};
</script>
