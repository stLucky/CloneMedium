<template>
  <div class="page-grid">
    <the-header />
    <main class="py-5 is-relative">
      <slot></slot>
    </main>
    <the-footer />
  </div>
</template>
<script>
import TheHeader from "@/components/TheHeader";
import TheFooter from "@/components/TheFooter";

export default {
  name: "MainLayout",
  components: {
    TheHeader,
    TheFooter,
  },
};
</script>
