<template>
  <main-layout>
    <div class="container px-5">
      <div class="card">
        <div class="card-content">
          <form class="content" @submit.prevent="onEditSubmit">
            <b-field label="Название поста">
              <b-input v-model.trim="post.title"></b-input>
            </b-field>
            <b-field label="Содержимое поста">
              <b-input
                type="textarea"
                v-model.trim="post.description"
              ></b-input>
            </b-field>
            <b-button
              label="Отмена"
              icon-left="ban"
              class="mr-3"
              type="is-info"
              @click="onBackClick"
            />
            <b-button
              icon-left="check-circle"
              type="is-success"
              native-type="submit"
              ><template v-if="editPost">Сохранить изменения</template>
              <template v-else>Добавить пост</template>
            </b-button>
          </form>
        </div>
      </div>
    </div>
  </main-layout>
</template>
<script>
import MainLayout from "@/layouts/MainLayout";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "EditPosts",

  components: { MainLayout },

  data: () => ({
    post: {
      title: "",
      description: "",
      dateUpdate: "",
      dateCreate: "",
      id: "",
    },
  }),

  computed: {
    ...mapGetters(["editPost", "posts", "postsError"]),
  },

  created() {
    if (this.editPost) {
      this.post.title = this.editPost.title;
      this.post.description = this.editPost.description;
      this.post.id = this.editPost.id;
    }
  },

  methods: {
    ...mapActions(["changePost", "clearEditPost", "addPost"]),

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

    async onEditSubmit() {
      const date = new Date().toISOString();
      this.post.dateUpdate = date;

      if (this.editPost) {
        await this.changePost(this.post);
        this.onCheckingError();
      } else {
        this.post.id = this.posts.length + 1;
        this.post.dateCreate = date;
        await this.addPost(this.post);
        this.onCheckingError();
      }

      if (!this.postsError) {
        this.clearEditPost();
        this.$router.push({ name: "home" });
      }
    },

    clearPost() {
      for (let key in this.post) {
        this.post[key] = "";
      }
    },
    onBackClick() {
      this.clearPost();
      this.clearEditPost();
      this.$router.push({ name: "home" });
    },
  },
};
</script>
