<template>
  <main-layout>
    <error-content />
  </main-layout>
</template>

<script>
import MainLayout from "@/layouts/MainLayout";
import ErrorContent from "@/components/ErrorContent";

export default {
  name: "PageError",

  components: { MainLayout, ErrorContent },
};
</script>
