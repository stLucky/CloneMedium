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

import { Storage } from "@/const";

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
    enteredData() {
      return {
        title: this.post.title,
        description: this.post.description,
      };
    },
  },

  watch: {
    enteredData() {
      const dataInJson = JSON.stringify(this.enteredData);
      localStorage.setItem(Storage.ENTERED_DATA, dataInJson);
    },

    "$route.params.action"() {
      this.post.title = "";
      this.post.description = "";
      this.post.id = "";

      this.clearEditPost();
      this.clearStorage();
    },
  },

  created() {
    if (localStorage.getItem(Storage.EDIT_POST)) {
      const storagePost = JSON.parse(localStorage.getItem(Storage.EDIT_POST));

      this.post.title = storagePost.title;
      this.post.description = storagePost.description;
      this.post.id = storagePost.id;

      this.setEditPost(storagePost);
    }

    if (localStorage.getItem(Storage.ENTERED_DATA)) {
      const storageData = JSON.parse(
        localStorage.getItem(Storage.ENTERED_DATA)
      );

      this.post.title = storageData.title;
      this.post.description = storageData.description;
    }
  },

  beforeDestroy() {
    this.clearStorage();
  },

  methods: {
    ...mapActions(["changePost", "clearEditPost", "addPost", "setEditPost"]),

    clearStorage() {
      localStorage.removeItem(Storage.ENTERED_DATA);
      localStorage.removeItem(Storage.EDIT_POST);
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
