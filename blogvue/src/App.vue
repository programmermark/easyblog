<template>
  <div class="main-body">
    <!-- 顶部导航 -->
    <c-header :userInfo="userInfo" />
    <!-- 主要内容区域 -->
    <a-row type="flex" justify="center" class='content'>
      <!-- 左侧个人信息和广告 -->
      <a-col class="content-left" :xs="0" :sm="0" :md="8" :lg="6" :xl="4">
        <c-author :userInfo="userInfo" />
        <c-advert :advertList="advertList" />
      </a-col>
      <!-- 右侧主体内容 -->
      <a-col class="content-right" :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
        <router-view v-if="isShow" />
      </a-col>
    </a-row>
    <!-- 底部网站信息 -->
    <c-footer :userInfo="userInfo" />
  </div>
</template>

<script>
import Header from './components/Header'
import Footer from './components/Footer'
import Author from './components/Author'
import Advert from './components/Advert'
import { servicePath } from './config/apiBaseUrl'
import { bloger } from './config/blog'
import { mapMutations } from 'vuex'

const userId = bloger.id

export default {
  components: {
    'c-header': Header,
    'c-footer': Footer,
    'c-author': Author,
    'c-advert': Advert
  },
  data() {
    return {
      userInfo: {},
      advertList: [],
      isShow: true
    }
  },
  created() {
    this.getUserInfo()
    this.getAdvertList()
  },
  provide () {
    return {
      reload: this.reload
    }
  },
  methods: {
    getUserInfo() {
      this.$api({
        method: 'get',
        url: servicePath.getUserInfoById + userId
      })
        .then(res=>{
          this.userInfo = res
          this.setUserIfo(res)
        })
    },
    getAdvertList() {
      this.$api({
        method: 'get',
        url: servicePath.getAdverList
      })
        .then(res=>{
          this.advertList = res
        })
    },
    reload () {
      // 先隐藏
      this.isShow = false
      // $nextTick() 将回调延迟到下次 DOM 更新循环之后执行
      this.$nextTick(() => {
        this.isShow = true
      })
    },
    ...mapMutations(['setUserIfo'])
  },
}
</script>

<style lang="scss">
body {
  overflow-y: scroll;
}
.main-body {
  background-color: #f6f6f6;
  .content {
    margin: 1rem 0;
    .content-left {
      margin-right: .5rem;
    }
    .content-right {
      padding: 0 .5rem;
    }
  }
}
</style>
