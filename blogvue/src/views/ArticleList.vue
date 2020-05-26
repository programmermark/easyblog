<template>
  <div class="article-container">
    <div class="nav">
      <span class="title">当前位置：</span>
      <a-breadcrumb class="nav-content" separator=">">
        <a-breadcrumb-item>
          <router-link to="/">首页</router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
          <span>文章列表</span>
        </a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <c-article-type :types="articleTypes" :changeType="changeArticleType" />
    <div class="list">
    <a-spin :spinning="isLoading" tip="加载中...">
      <a-list
        :data-source="articleList">
        <a-list-item slot="renderItem" slot-scope="item, index">
          <c-article-item :key="index" :article="item" :notFormatTime="true"  />
        </a-list-item>
      </a-list>
      <a-pagination
        class="page"
        :current="currentPage"
        :total="total"
        :showTotal="total => `共 ${total} 条记录`"
        :pageSize="pageSize"
        :defaultCurrent="currentPage"
        showQuickJumper
        @change="changePage"
      />
      </a-spin>
    </div>
  </div>
</template>

<script>
import ArticleType from '../components/ArticleType'
import ArticleItem from '../components/ArticleItem'
import { servicePath } from '../config/apiBaseUrl'

const pageSize = 10

export default {
  components: {
    'c-article-type': ArticleType,
    'c-article-item': ArticleItem
  },
  data() {
    return {
      pageSize,
      articleTypes: ['全部', '点击量'],
      articleList: [],
      currentPage: 1,
      total: 0,
      isLoading: false,
      currentType: '全部'
    }
  },
  created () {
    this.getArticleTypes()
    this.getArticleList(pageSize, 1, '全部')
  },
  methods: {
    getArticleTypes() {
      this.$api({
        method: 'get',
        url: servicePath.getArticleTypes
      })
        .then(res=>{
          let list = ['全部']
          res.forEach(item => {
            list.push(item.name)
          })
          list.push('点击量')
          this.articleTypes = list
        })
    },
    changeArticleType(type) {
      this.currentType = type
      this.currentPage = 1
      this.getArticleList(pageSize, 1, type)
    },
    getArticleList(pageSize, current, type) {
      this.isloading = true
      const dataProps = {
        limit: pageSize,
        offset: (current - 1) * pageSize,
        type
      }
      this.$api({
        method: 'post',
        url: servicePath.getArticleListWithType,
        data: dataProps
      })
        .then(res=>{
          this.isloading = false
          this.articleList = res.list
          this.total = res.total
        })
    },
    async changePage(currentPage, pageSize) {
      this.currentPage = currentPage
      this.getArticleList(pageSize, currentPage, this.currentType)
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
  .list {
    margin-top: 1rem;
    .ant-list-item {
      padding: 0 !important;
    }
  }
  .page {
    text-align: center;
    margin: 1rem;
  }
}
</style>
