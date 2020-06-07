<template>
  <div class="advert-container" v-if="advertList.length > 0">
    <template v-for="(item, index) in advertList">
      <a
        class="advert-item"
        :href="item.imgurl"
        target="_blank"
        :key="index">
        <img v-lazy="item.img" />
      </a>
    </template>
  </div>
</template>

<script>
  export default {
    props: {
      advertList: {
        type: Array,
        required: true
      },
    },
  }
</script>

<style lang="scss" scoped>
.advert-container {
  background-color: #fff;
  margin: 1rem 0;
  padding: .5rem 0;
  .advert-item {
    border-radius: .5rem;
    padding: .25rem .5rem;
    display: block;
    img[lazy="loading"] {
      width: 100%;
    }
    img[lazy="loaded"] {
      width: 100%;
    }
    img {
      width: 100%;
      padding: .125rem;
      border: 1px solid #dedede;
      border-radius: .25rem;
      margin-top: .25rem;
    }
  }
}
</style>
