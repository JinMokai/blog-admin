<template>
  <div class="card_header">
    <h1>{{ message }}</h1>
  </div>
</template>

<script>
export default {
  props: ["message"],
};
</script>

<style scoped>
.card_header {
  padding: 18px;
  border-bottom: 1px solid rgb(228, 231, 237);
  font-size: 1.2em;
  box-sizing: border-box;
}
</style>
