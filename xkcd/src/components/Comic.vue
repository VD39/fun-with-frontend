<template>
  <article>
    <h2>{{ comic.safe_title }}</h2>
    <a
      :href="comic.img"
      :title="`Open ${comic.safe_title} in a new window`"
      rel="noopener noreferrer"
      target="_blank"
    >
      <img :src="comic.img" :alt="comic.alt" />
    </a>
  </article>
</template>

<script>
export default {
  name: 'Comic',
  props: {
    /**
     * Comic details to display in the component.
     */
    comic: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style module></style>
