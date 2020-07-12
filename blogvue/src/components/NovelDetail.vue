<template>
  <div class='novel-detailed'>
    <div class='novel-info'>
      <div class='info-left'>
        <img class='img' :src="novel.novelCoverImg" :title="novel.novelName" />
      </div>
      <div class='info-right'>
        <div class='sub-info info-first'>
          <div class='novel-name'>{{novel.novelName}}</div>
          <div class='author'>
            <router-link class='name' to='/about'>
              {{novel.author}}
            </router-link>
            著</div>
          <div class='create-time'>小说始连载于{{novel.novelCreateTime}}</div>
        </div>
        <div
          class='sub-info info-second'
          v-html="marked(novel.novelSummary)"></div>
      </div>
    </div>
    <div class='chapter-list'>
      <div class='head'>
        <h3>全部章节（共{{chapterList.length}}章）</h3>
      </div>
      <div class='list-content'>
        <template v-for="item in chapterObj.list">
          <router-link class='chapter-item' :to="`/chapterdetail?id=${item.chapterId}`" :key="item.chapterId">
            {{item.chapterName}}
          </router-link>
        </template>
        <template v-for="item in chapterObj.subList">
          <router-link class='chapter-item  last-chapter-item' :to="`/chapterdetail?id=${item.chapterId}`" :key="item.chapterId">
            {{item.chapterName}}
          </router-link>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
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
  props: {
    novel: {
      type: Object,
      required: true
    },
    chapterList: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      chapterObj: {}
    }
  },
  mounted() {
    this.$nextTick(()=>{
      const chapterList = this.chapterList
      const chapterLength = Math.floor(chapterList.length / 3) * 3
      const chapterObj = {
        list: chapterList.slice(0, chapterLength),
        subList: chapterList.slice(chapterLength, chapterList.length)
      }
      this.chapterObj = chapterObj
    })
  },
  methods: {
    marked
  }
}
</script>

<style lang="scss" scoped>
.novel-detailed {
  margin-top: 1rem;
  .novel-info {
    background-color: #fff;
    margin-bottom: 1rem;
    padding: 1rem 0;
    border-radius: .25rem;
    display: flex;
    .info-left {
      padding: 1rem;
      .img{
        height: 10rem;
        border-radius: .25rem;
      }
    }
    .info-right {
      margin-left: 1rem;
      padding: 1rem;
      .sub-info {
        display: flex;
        align-items: flex-end;
        .novel-name {
          font-size: 1.5rem;
          color: #333333;
          margin-right: 2rem;
        }
        .author {
          font-size: .875rem;
          color: #666666;
          margin-right: 2rem;
          .name {
            font-size: 1rem;
            color: #666666;
            margin-right: .5rem;
            &:hover {
              color: #1890ff;
            }
          }
        }
        .create-time {
          color: #999999;
          font-size: 13px;
        }
      }
      .info-second {
        margin-top: 1rem;
        padding: .5rem;
        border-radius: .25rem;
        background-color: #f9f9f9;
        display: block;
        text-align: left;
        text-indent: 2rem;
      }
    }
  }
  .chapter-list {
    background-color: #fff;
    padding: 2rem 1rem;
    .head {
      background-color: #fff;
      border-bottom: 1px solid #aaaaaa;
      text-align: left;
      font-weight: bold;
      h3 {
        color: #333333;
        font-weight: bold;
      }
    }
    .list-content {
      text-align: initial;
      .chapter-item {
        width: 33.3%;
        height: 40px;
        line-height: 40px;
        display: inline-block;
        border-bottom: 1px solid #ebebeb;
        color: #333333;
        &:hover {
          color: #1890ff;
        }
      }
      .last-chapter-item {
        border-bottom: none;
      }
    }
  }
}
</style>
