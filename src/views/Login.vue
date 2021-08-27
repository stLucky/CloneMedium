<template>
  <!-- <div class="columns is-centered">
    <div class="column is-half is-two-thirds-mobile m-auto">
      <h2 class="block title">Авторизация</h2>
      <form @submit.prevent="logIn">
        <b-field label="Имя пользователя">
          <b-input icon="user" v-model="username"></b-input>
        </b-field>

        <b-field label="Пароль">
          <b-input icon="key" type="password" v-model="password"></b-input>
        </b-field>
        <b-button type="is-info" tag="button" native-type="submit"
          >Войти</b-button
        >
      </form>
    </div>
  </div> -->

  <b-modal class="p-5" active has-modal-card :can-cancel="false">
    <form action="" @submit.prevent="onFormSubmit">
      <div class="modal-card">
        <div class="modal-card-head">
          <p class="modal-card-title">Авторизация</p>
        </div>
        <div class="modal-card-body">
          <b-field label="Email">
            <b-input
              type="email"
              v-model="email"
              placeholder="Ваш email"
              required
            >
            </b-input>
          </b-field>

          <b-field label="Пароль">
            <b-input
              type="password"
              v-model="password"
              password-reveal
              placeholder="Ваш пароль"
              required
            >
            </b-input>
          </b-field>
        </div>
        <div class="modal-card-foot">
          <b-button tag="router-link" :to="{ name: 'home' }" label="Назад" />
          <b-button label="Войти" type="is-primary" native-type="submit" />
        </div>
      </div>
    </form>
  </b-modal>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  name: "Login",

  data: () => ({
    email: "",
    password: "",
  }),

  computed: {
    ...mapGetters(["error"]),
  },

  // watch: {
  //   error() {
  //     this.$buefy.notification.open({
  //       message: this.error,
  //       position: "is-top-right",
  //       type: "is-danger",
  //       hasIcon: true,
  //     });
  //   },
  // },

  methods: {
    async onFormSubmit() {
      const formData = {
        email: this.email,
        password: this.password,
      };

      await this.$store.dispatch("login", formData);

      if (this.error) {
        this.$buefy.notification.open({
          duration: 5000,
          message: this.error,
          position: "is-top-right",
          type: "is-danger",
          hasIcon: true,
        });
      } else {
        this.$router.push({ name: "home" });
      }
    },
  },
};
</script>
