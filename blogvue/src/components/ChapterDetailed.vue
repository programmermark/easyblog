<template>
  <div class="article-detailed">
    <div class="title">{{chapter.title}}</div>
    <div class="sub-info">
      <div class="item">
        <c-icon type="icon-book" />
        <span class="text">{{chapter.novelName}}</span>
      </div>
      <div class="item">
        <c-icon type="icon-antd-user" />
        <span class="text">{{chapter.authorName}}</span>
      </div>
      <div class="item">
        <c-icon type="icon-clock" />
        <span class="text">{{formatTime(chapter.updateTime * 1000, 'yyyy-MM-dd')}}</span>
      </div>
      <div class="item" v-if="chapter.viewCount > 0">
        <c-icon type="icon-antd-fire" />
        <span class="text">{{chapter.viewCount}}</span>
      </div>
    </div>
    <div
      class="article-content"
      v-html="marked(chapter.content)"></div>
    <div class='pager'>
      <div class='item' v-if="chapter.preId">
        <router-link class='item-text' :to="`/chapterdetail?id=${chapter.preId}`">
          上一章
        </router-link>
      </div>
      <div class='item'>
        <router-link class='item-text' :to="`/noveldetail?id=${chapter.novelId}`">
          目录
        </router-link>
      </div>
      <div class='item' v-if="chapter.nextId">
        <router-link class='item-text' :to="`/chapterdetail?id=${chapter.nextId}`">
          下一章
        </router-link>
      </div>
    </div>
    <div class="comment-wrapper">
      <div class="divider">评论</div>
      <c-comment type="novel" :id="chapter.id" />
    </div>
  </div>
</template>

<script>
import Comment from '@/components/Comment'
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
    chapter: {
      type: Object,
      required: true
    }
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
    & /deep/ img {
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
      .item-text {
        padding: .5rem 1rem;
        font-size: 1.2rem;
        color: #333333 !important;
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
