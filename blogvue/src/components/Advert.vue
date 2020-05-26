<template>
  <div class="advert-container" v-if="advertList.length > 0">
    <template v-for="(item, index) in advertList">
      <router-link
        class="advert-item"
        :to="item.imgurl"
        :key="index">
        <img :src="item.img" />
      </router-link>
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
    img {
      width: 100%;
    }
  }
}
</style>
