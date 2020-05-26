<template>
  <div class="list-container">
    <div class="tab-container">
      <template v-for="(item, index) in tabs">
        <a-badge
          class="badge"
          :key="item.type"
          :count="item.count">
          <div
            class="tab-item"
            :class="{ actived: selectedIndex === index }"
            @click="changeTab(index)">{{item.name}}</div>
        </a-badge>
      </template>
      <div class="type-line" :style="{'transform': `translateX(${selectedIndex * 6}rem)`}"></div>
    </div>
    <div>
      <a-spin :spinning="isLoading" tip="加载中...">
        <template v-for="(item, index) in list">
          <div :key="index + item.publishTime">
            <talk-item
              v-if="item.listType === 'talk'"
              :talkItem="item"
              :addLikeNum="addLikeNum" />
            <article-item
              v-if="item.listType === 'article'"
              :article="item" />
          </div>
        </template>
        <a-pagination
          class="page"
          :current="current"
          :total="total"
          :showTotal="total => `共 ${total} 条记录`"
          :pageSize="pageSize"
          :defaultCurrent="current"
          showQuickJumper
          @change="changePage"
        />
      </a-spin>
    </div>
  </div>
</template>

<script>
import { servicePath } from '../config/apiBaseUrl'
import TalkItem from '../components/TalkItem'
import ArticleItem from '../components/ArticleItem'

const pageSize = 10
const tabs = [
    // { name: '全部', type: 'all', count: 0, isSelected: true },
    { name: '文章', type: 'article', count: 0, isSelected: true },
    { name: '说说', type: 'talk', count: 0, isSelected: false },
    { name: '小说', type: 'novel', count: 0,  isSelected: false }
  ]

export default {
  metaInfo: {
    title: '首页',
    htmlAttrs: {
      lang: 'zh',
      amp: true
    }
  },
  components: {
    'talk-item': TalkItem,
    'article-item': ArticleItem
  },
  data() {
    return {
      tabs,
      pageSize,
      isLoading: false,
      selectedIndex: 0,
      current: 1,
      total: 0,
      list: []
    }
  },
  created() {
    this.getList('article')
  },
  methods: {
    changeTab(index) {
      this.selectedIndex = index
      const tabsClone = JSON.parse(JSON.stringify(this.tabs))
      tabsClone.forEach((tabsItem, tabsIndex)=>{
        if(tabsIndex === index){
          tabsItem.isSelected = true
        } else {
          tabsItem.isSelected = false
        }
      })
      this.tabs = tabsClone
      const listType = this.tabs[index].type
      this.getList(listType)
    },
    getList(type, pagesize = pageSize, currentPage = this.current) {
      if (!type) {
        const tabsClone = JSON.parse(JSON.stringify(this.tabs))
        tabsClone.forEach(item=>{
          if (item.isSelected === true) {
            type = item.type
          }
        })
        this.tabs = tabsClone
      }
      let requestUrl = ''
      switch (type) {
        case 'all':
          requestUrl = servicePath.getTalkList
          break;
        case 'article':
          requestUrl = servicePath.getArticleList
          break;
        case 'talk':
          requestUrl = servicePath.getTalkList
          break;
        case 'novel':
          requestUrl = servicePath.getNovelList
          break;

        default :
          requestUrl = servicePath.getTalkList
          break;
      }
      this.isLoading = true
      this.$api({
        method: 'post',
        url: requestUrl,
        data: {
          limit: pagesize,
          offset: (currentPage - 1) * pagesize
        }
      })
        .then(res=>{
          this.isLoading = false
          this.list = res.list
          this.total = res.total
          const tabsClone = JSON.parse(JSON.stringify(this.tabs))
          tabsClone.forEach(item=>{
            if (item.type === type) {
              item.count = res.total
            }
          })
          this.tabs = tabsClone
        })
    },
    addLikeNum(id) {
      const listClone = JSON.parse(JSON.stringify(this.list))
      for (const item of listClone) {
        if (item.listType === 'talk' && item.id === id) {
          item.likeCount++
        }
      }
      this.list = listClone
    },
    changePage(page, pageSize) {
      let type = ''
      this.tabs.forEach(item=>{
        if (item.color === selectedColor) {
          type = item.type
        }
      })
      this.current = page
      this.getList(type, pageSize, page)
    }
  },
}
</script>

<style lang="scss" scoped>
.list-container {
  .tab-container {
    position: relative;
    border-radius: .25rem;
    background-color: #fff;
    padding: 0 1rem;
    margin-bottom: 1rem;
    .badge {
      margin: 0 1rem;
    }
    .tab-item {
      color: #666666;
      font-size: .9rem;
      display: inline-block;
      padding: 1rem 0;
      width: 4rem;
      text-align: center;
      cursor: pointer;
      &:hover {
        color: #40a9ff;
        background-color: rgba(64, 169, 255, .2);
      }
    }
    .actived {
      color: #40a9ff;
    }
    .type-line {
      position: absolute;
      bottom: 2px;
      left: 2rem;
      width: 4rem;
      height: 2px;
      background-color: #40a9ff;
      transition-duration: .2s;
    }
  }
  .page {
    text-align: center;
    margin: 1rem;
  }
}
</style>
