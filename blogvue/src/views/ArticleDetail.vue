<template>
  <div class="article-container">
    <!-- 面包屑导航 -->
    <div class="nav">
      <span class="title">当前位置：</span>
      <a-breadcrumb class="nav-content" separator=">">
        <a-breadcrumb-item>
          <router-link to="/">首页</router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
          <router-link to="/articlelist">文章列表</router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
          <span>{{articleDetail.title}}</span>
        </a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <!-- 文章详情 -->
    <div :style="{width: '100%', textAlign: 'center'}">
      <c-article-item-detail v-show="articleDetail.id" :article="articleDetail" />
    </div>
  </div>
</template>

<script>
import { servicePath } from '../config/apiBaseUrl'
import ArticleItemDetail from '../components/ArticleItemDetail'

export default {
  components: {
    "c-article-item-detail" :ArticleItemDetail,
  },
  data() {
    return {
      articleDetail: {}
    }
  },
  created () {
    const id = this.$router.history.current.query.id
    this.getArtcileById(id)
  },
  methods: {
    getArtcileById(id) {
      this.$api({
        method: 'get',
        url: servicePath.getArticleDetailById + id
      })
        .then(res=>{
          this.articleDetail = res
        })
    }
  },
}
</script>

<style lang="scss" scoped>
.article-container {
  .nav {
    display: flex;
    align-items: center;
    padding: 1rem;
    background: #ffffff;
    border-radius: .25rem;
    .title {
      color: #555555;
      font-size: .94rem;
    }
    .nav-content {
      color: #555555;
      font-size: .94rem;
    }
  }
}
</style>
