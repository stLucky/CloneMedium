<template>
  <div
    class="
      is-flex is-justify-content-center is-align-items-center is-size-2
      px-5
    "
    style="height: 100%"
  >
    {{ message }}
  </div>
</template>
<script>
import { Errors } from "@/const";

export default {
  name: "ErrorContent",

  props: {
    message: {
      type: String,
      default: Errors.NON_EXISTING_PAGE,
    },
  },
};
</script>
