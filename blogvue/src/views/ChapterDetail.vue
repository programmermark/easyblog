<template>
  <div class="chapter-detail">
    <div class="nav">
      <span class="title">当前位置：</span>
      <a-breadcrumb class="nav-content" separator=">">
        <a-breadcrumb-item>
          <router-link to="/">
            <a>小说列表</a>
          </router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
          <router-link :to="`/noveldetail?id=${chapterDetail.novelId}`">
            <a>{{chapterDetail.novelName}}</a>
          </router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
          <span>{{chapterDetail.title}}</span>
        </a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div style="width: '100%', textAlign: 'center'">
      <chapter-detailed v-if="chapterDetail.id" :chapter="chapterDetail" />
    </div>
  </div>
</template>

<script>
import ChapterDetailed from '@/components/ChapterDetailed'
import { servicePath } from '@/config/apiBaseUrl'

export default {
  components: {
    'chapter-detailed': ChapterDetailed
  },
  data() {
    return {
      chapterDetail: {}
    }
  },
  created() {
    const chapterId = this.$router.history.current.query.id
    this.$api({
      method: 'get',
      url: servicePath.getChapterById + chapterId
    })
      .then(res => {
        console.log(res)
        this.chapterDetail = res
      })
  }
}
</script>

<style lang="scss" scoped>
@mixin breadcrumb-text {
  color: #555555;
  font-size: .94rem;
}

.chapter-detail {
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
