<template>
  <div class="article-detailed">
    <div class="title">{{article.title}}</div>
    <div class="sub-info">
      <div class="reprint" v-if="Boolean(article.reprinted)">转载</div>
      <div class="reprint orginal" v-else>原创</div>
      <div class="item">
        <a-icon type="user" theme="outlined" />
        <span class="text">{{article.authorName}}</span>
      </div>
      <div class="item">
        <c-icon type="icon-clock" />
        <span class="text">{{article.publishTime && formatTime(article.publishTime * 1000, 'yyyy-MM-dd')}}</span>
      </div>
      <div class="item">
        <c-icon type="icon-folder" />
        <span class="text">{{article.type}}</span>
      </div>
      <div class="item" v-show="article.viewCount > 0">
        <a-icon type="fire" theme="filled" />
        <span class="text">{{article.viewCount}}</span>
      </div>
    </div>
    <div
      class="article-content"
      v-if="article.content"
      v-html="marked(article.content)"></div>
    <div class="comment-wrapper">
      <div class="divider">评论</div>
      <c-comment type="article" :id="article.id" />
    </div>
  </div>
</template>

<script>
import marked from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/monokai-sublime.css'
import Comment from './Comment'
import Icon from './Icon'
import { formatTime } from '../assets/js/tools'

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
  components: {
    'c-comment': Comment,
    'c-icon': Icon
  },
  props: {
    article: {
      type: Object,
      required: true
    },
  },
  methods: {
    formatTime,
    marked
  },
}
</script>

<style lang="scss" scoped>
.article-detailed {
  background-color: #fff;
  margin-top: 1rem;
  padding: 1rem;
  text-align: center;
  .title {
    font-size: 1.4rem;
    color: #333333;
    padding: .5rem 0;
  }
  .sub-info {
    display: flex;
    justify-content: center;
    padding: 1rem 0;
    .reprint {
      color: #74cf59;
      margin-right: 2rem;
      padding: .25rem .5rem;
      background-color: #eaf9e3;
    }
    .orginal {
      color: #ca0c16;
      background-color: #f9ecec;
    }
    .item {
      font-size: 1rem;
      color: #999999;
      padding-right: 2rem;
      .text {
        font-size: .9rem;
        margin-left: .5rem;
      }
    }
  }
  .article-content {
    text-align: left;
    padding: 1rem;
    font-size: 1rem;
    img {
      width: 100%;
      padding: 1rem 0;
    }
  }
  .pager {
    display: flex;
    align-items: center;
    margin: 1rem 0 2rem;
    padding: .5rem 0;
    .item {
      flex: 1;
      margin: 0 .5rem;
      padding: .5rem 0;
      background-color: #eaeaea;
      border-radius: .25rem;
      color: #333333;
      .item-text {
        padding: .5rem 1rem;
        font-size: 1.2rem;
      }
    }
  }
  .comment-wrapper {
    .divider {
      font-size: 1rem;
      color: #999999;
      margin: 1rem .5rem;
      padding: .5rem 0;
      border-bottom: 1px solid #dddddd;
      letter-spacing: .5rem;
    }
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
