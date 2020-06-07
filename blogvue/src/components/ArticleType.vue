<template>
  <div class="type-wrapper">
    <span class="title">文章类别：</span>
    <template v-for="(item, index) in types">
      <div
        class="type-item"
        :class="{'active': selectedType === item}"
        :key="index"
        @click="changeArticleType(item)">
        {{item}}
      </div>
    </template>

</div>
</template>

<script>
export default {
  props: {
    types: {
      type: Array,
      reuqired: true
    },
    changeType: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      selectedType: this.types[0]
    }
  },
  methods: {
    changeArticleType(type) {
      if (this.selectedType !== type) {
        this.selectedType = type
        this.changeType(type)
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.type-wrapper {
  margin: 1rem 0 1rem 0;
  padding: .8rem .4rem;
  background-color: #ffffff;
  border-radius: .4rem;
  .title {
    margin-left: .5rem;
    margin-right: .5rem;
    color: #666666;
  }
  .type-item {
    display: inline-block;
    cursor: pointer;
    color: #333333;
    height: 2rem;
    line-height: 2rem;
    margin: .5rem;
    padding: 0rem 1rem;
    background-color: #ffffff;
    border: 1px solid #55b2ff;
    border-radius: 1rem;
    &:hover {
      color: #fff;
      background-color: #55b2ff;
      border: 1px solid #55b2ff;
    }
  }
  .active {
    color: #fff;
    background-color: #55b2ff;
    border: 1px solid #55b2ff;
  }
}
</style>
