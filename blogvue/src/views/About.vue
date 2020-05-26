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
          <span>关于我</span>
        </a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <!-- 文章详情 -->
    <div :style="{width: '100%', textAlign: 'center'}">
      <div v-show="aboutDetail.id">
        <div
          class="about-content"
          v-if="aboutDetail.content"
          v-html="marked(aboutDetail.content)"></div>
        <div class="comment-wrapper">
          <div class="divider">评论</div>
          <c-comment type="about" :id="aboutDetail.id" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import marked from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/monokai-sublime.css'
import { servicePath } from '../config/apiBaseUrl'
import Comment from '../components/Comment'

const renderer = new marked.Renderer()
marked.setOptions({
  renderer: renderer,
  gfm: true,
  pedantic: false,
  sanitize: false,
  tables: true,
  breaks: true,
  smartLists: true,
  smartypants: false,
  highlight: function(code){
    return hljs.highlightAuto(code).value;
  }
})

export default {
  metaInfo: {
    title: '关于我',
    htmlAttrs: {
      lang: 'zh',
      amp: true
    }
  },
  components: {
    "c-comment" :Comment,
  },
  data() {
    return {
      aboutDetail: {}
    }
  },
  created () {
    this.getAbout()
  },
  methods: {
    marked,
    getAbout() {
      this.$api({
        method: 'get',
        url: servicePath.getAbout
      })
        .then(res=>{
          this.aboutDetail = res
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
  .about-content {
    text-align: initial;
    background-color: #fff;
    margin-top: 1rem;
    padding: 2rem 2rem;
    border-radius: .25rem;
  }
  .comment-wrapper {
    background-color: #fff;
    margin-top: 1rem;
    padding: 1rem 2rem;
  }
  /* 美化markdown */
  & /deep/ pre{
    display: block;
    background-color: #283646;
    padding: .5rem !important;
    overflow-y: auto;
    font-weight: 300;
    font-family: Menlo, monospace;
    border-radius: .3rem;
  }
  & /deep/ pre > code{
    border:0px !important;
    background-color: #283646 !important;
    color:#FFF;
  }
  & /deep/ code {
    color: #c7254e;
    background-color: #f9f2f4;
    border-radius: 4px;
    font-size: 12px;
    padding-left: 5px;
    padding-right: 5px;
    margin: 0px 3px;
    width: calc(100% - 10px);
    box-sizing: border-box;
  }
}
</style>
