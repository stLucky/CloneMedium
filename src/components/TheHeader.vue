<template>
  <header class="py-5 has-background-primary">
    <div class="container px-5">
      <div class="is-flex is-justify-content-flex-end">
        <b-button
          v-if="!isAuthUser"
          tag="router-link"
          :to="{ name: 'login' }"
          icon-left="sign-in-alt"
          type="is-light is-rounded"
          exact
          outlined
        >
          Войти
        </b-button>
        <b-dropdown v-else :mobile-modal="false">
          <template #trigger>
            <b-button
              :label="user.login"
              type="is-light"
              icon-left="user"
              outlined
            />
          </template>
          <b-dropdown-item custom>
            Роль: <span class="has-text-weight-bold">{{ user.role }}</span>
          </b-dropdown-item>
          <b-dropdown-item v-if="isWriter" has-link>
            <router-link :to="{ name: 'edit' }">Создать пост </router-link>
          </b-dropdown-item>
          <hr class="dropdown-divider" />
          <b-dropdown-item @click="logout">
            <b-icon icon="sign-out-alt"></b-icon>
            Выйти</b-dropdown-item
          >
        </b-dropdown>
      </div>
    </div>
  </header>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "TheHeader",

  computed: {
    ...mapGetters(["isAuthUser", "user", "isWriter"]),
  },

  methods: {
    ...mapActions(["logout"]),
  },
};
</script>
