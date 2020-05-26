<template>
  <div class="header">
    <!-- logo和subLogo -->
    <a-row type="flex" justify="center">
      <a-col :xs="24" :sm="24" :md="8" :lg="6" :xl="4">
        <div class="header-left">
          <div>
            <span class="header-logo">{{userInfo.logoName}}</span>
            <span class="header-text">{{userInfo.logoSub}}</span>
          </div>
        </div>
      </a-col>
      <a-col :xs="0" :sm="0" :md="12" :lg="12" :xl="12">
        <div class='menu-right'>
          <c-menu v-if="navs" :navs="navs"></c-menu>
          <div class="change-version" @click="toReactVersion">
            <div class='version-wrapper'>
              React Version
              <img :src="LogoReact" />
            </div>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
  import Menu from './Menu'
  import LogoReact from '@/assets/images/logo_react.svg'

   const navs = [
    {name: '首页', icon: 'home', theme: 'filled', link: '/', type: 'home'},
    {name: '文章列表', icon: 'unordered-list', theme: 'outlined', link: '/articlelist', type: 'articlelist'},
    {name: '关于我', icon: 'user', theme: 'outlined', link: '/about', type: 'about'},
  ]

  export default {
    components: {
      "c-menu": Menu
    },
    props: {
      userInfo: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        navs,
        LogoReact
      }
    },
    methods: {
      toReactVersion() {
        let fullPath = this.$router.history.current.fullPath
        fullPath = fullPath.split('/vue')[1]
        this.$router.push(fullPath)
      }
    },
  }
</script>

<style lang="scss" scoped>
.header {
  background-color: #fff;
  padding: .5rem;
  overflow: hidden;
  height: 3.75rem;
  border-bottom: 1px solid #ccc;
  .header-left {
    height: 100%;
    display: flex;
    align-items: center;
    .header-logo {
      color: #1e90ff;
      font-size: 1.25rem;
      text-align: left;
    }
    .header-text {
      font-size: .75rem;
      color: #999;
      display: inline-block;
      padding-left: .5rem;
    }
  }
  .menu-right {
    display: flex;
    align-items: center;
    .change-version {
      width: 100%;
      flex: 1;
      display: flex;
      flex-direction: row-reverse;
      cursor: pointer;
      .version-wrapper {
        flex: 1;
        display: flex;
        align-items: center;
        flex-direction: row-reverse;
        height: 2rem;
        & > img {
          margin-right: .5rem;
          height: 2rem;
        }
      }
    }
  }
  & /deep/ .ant-menu {
    line-height: 3.125rem;
  }
  & /deep/ .ant-menu-item {
    font-size: 1rem !important;
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>
