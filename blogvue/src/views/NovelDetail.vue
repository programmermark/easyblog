<template>
  <div class='novel-detail'>
    <div class="nav">
      <span class="title">当前位置：</span>
      <a-breadcrumb class="nav-content" separator=">">
        <a-breadcrumb-item>
          <router-link to="/">
            小说列表
          </router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
          <span>{{novel.novelName}}</span>
        </a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div style="width: '100%', textAlign: 'center'">
      <novel-detail
        v-if="novel.novelId"
        :novel="novel"
        :chapterList="chapterList" />
    </div>
  </div>
</template>

<script>
import NovelDetail from '@/components/NovelDetail'
import { servicePath } from '@/config/apiBaseUrl'
import { formatTime } from '../assets/js/tools.js'

export default {
  components: {
    'novel-detail' : NovelDetail
  },
  data() {
    return {
      novel: {},
      chapterList: []
    }
  },
  created() {
    const novelId = this.$router.history.current.query.id
    this.$api({
      method: 'get',
      url: servicePath.getNovelById + novelId
    })
      .then(res=>{
        const firstChapter = res[0]
        this.novel = {
          novelId: firstChapter.novelId,
          novelName: firstChapter.novelName,
          author: firstChapter.author,
          novelCoverImg: firstChapter.novelCoverImg,
          novelSummary: firstChapter.novelSummary,
          novelCreateTime: formatTime(firstChapter.novelCreateTime * 1000, 'yyyy年MM月dd日'),
        }
        const chapterList = []
        res.forEach(item=>{
          let obj = {
            chapterId: item.chapterId,
            chapterName: item.chapterName
          }
          chapterList.push(obj)
        })
        this.chapterList = chapterList
      })
  },
}
</script>

<style lang="scss" scoped>
@mixin breadcrumb-text {
  color: #555555;
  font-size: .94rem;
}

.novel-detail {
  .nav {
    display: flex;
    align-items: center;
    padding: 1rem;
    background: #ffffff;
    border-radius: .25rem;
    .title {
      @include breadcrumb-text;
    }
    .nav-content {
      @include breadcrumb-text;
    }
  }
}
</style>
