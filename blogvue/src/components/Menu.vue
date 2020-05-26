<template>
  <a-menu
    mode="horizontal"
    :defaultSelectedKeys="[currentNav]"
    :selectedKeys="[currentNav]"
    @click="selectMenuItem">
    <template v-for="item in navs">
      <a-menu-item
        class="menu-item"
        :key="item.type">
        <router-link :to="item.link">
          <a-icon :type="item.icon" :theme="item.theme" />
          {{item.name}}
        </router-link>
      </a-menu-item>
    </template>
  </a-menu>
</template>

<script>
  export default {
    props:{
      navs: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        currentNav: ''
      }
    },
    // 接收注入的数据
    inject: [
      'reload'
    ],
    mounted() {
      this.$nextTick(()=>{
        const router = this.$router.history
        const path = router.current.path
        for (const item of this.navs) {
          if (item.link === path){
            this.currentNav = item.type
            break
          }
        }
      })
    },
    methods: {
      selectMenuItem({key}){
        this.currentNav = key
      }
    },
  }
</script>

<style lang="scss" scoped>
.menu-item {
  color: #555555;
  font-size: 1.1rem;
  height: 50px;
  line-height: 50px;
  padding: 0 1rem 0 1.5rem;
  &:hover {
    background-color: #e6f7ff;
  }
  .name {
    padding-left: .5rem;
  }
}
</style>
