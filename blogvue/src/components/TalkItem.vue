<template>
  <div class="talk-item">
    <div class="user">
      <router-link class="portrait" to="/about">
        <img :src="talkItem.portrait" />
      </router-link>
      <div class="content-right">
        <router-link class="name" to="/about">
          {{talkItem.name}}
        </router-link>
        <div class="publish-time">{{formatDate(talkItem.publishTime, true)}}</div>
      </div>
    </div>
    <div class='talk-content'>
      <div v-html="talkItem.content"></div>
    </div>
    <div class="sub-info">
      <div
        class="item"
        @click="addLikeCount(talkItem.id)"
        title="点赞">
        <c-icon v-if="Cookies.get('talk_zan_' + talkItem.id)" color="#37c700" type="icon-zan" />
        <c-icon v-else type="icon-zan" />
        <span class="count" v-if="talkItem.likeCount > 0">{{talkItem.likeCount}}</span>
      </div>
      <div class="item" title="查看评论" @click="() => showComment = !showComment">
        <c-icon type="icon-comment" />
        <span class="count">{{talkItem.commentCount}}</span>
      </div>
    </div>
    <c-comment v-show="showComment" type="talk" :id="talkItem.id" />
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import { formatDate } from '../assets/js/tools'
import { servicePath } from '../config/apiBaseUrl'
import Icon from './Icon'
import Comment from './Comment'

export default {
  components: {
    'c-icon': Icon,
    'c-comment': Comment
  },
  props: {
    talkItem: {
      type: Object,
      required: true
    },
    addLikeNum: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      Cookies,
      showComment: false
    }
  },
  methods: {
    formatDate,
    addLikeCount(id) {
      // 缓存已点赞的评论的id
      if(!Cookies.get('talk_zan_'+id)) {
        Cookies.set('talk_zan_'+id, id, { expires: 730 })
        this.$api({
          method: 'post',
          url: servicePath.addTalkLikeCount,
          data: {
            id
          }
        })
          .then(res=>{
            this.addLikeNum(id)
          })
      } else {
        this.$message.warning('您已经点过赞了', 2)
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.talk-item {
  background-color: #fff;
  margin-bottom: 1rem;
  padding: 1rem 1rem;
  border-radius: .25rem;
  .user {
    display: inline-flex;
    .portrait img {
      width: 3.5rem;
      height: 3.5rem;
      border-radius: 50%;
      border: 2px solid #ffffff;
      box-shadow: 1px 1px 1px rgba(0,0,0,.1), 1px 1px 1px rgba(0,0,0,0.1), 1px 1px 1px rgba(0,0,0,0.1);
    }
    .content-right {
      padding: 0 1rem;
      display: inline-flex;
      flex-direction: column;
      .name {
        padding-top: .5rem;
        color: #333333;
        font-size: 1rem;
        &:hover {
          color: #1890ff;
        }
      }
      .publish-time {
        font-size: .8rem;
        color: #999999;
        flex: 1;
        display: flex;
        flex-direction: column-reverse;
        padding-bottom: .25rem;
      }
    }
  }
  .talk-content {
    color: #333333;
    font-size: 1rem;
    padding: 1rem 0;
  }
  .sub-info {
    display: inline-flex;
    padding-bottom: .25rem;
    .item {
      font-size: 1rem;
      color: #999999;
      padding-right: 2rem;
      cursor: pointer;
      .count {
        margin-left: .3rem;
        font-size: .9rem;
      }
    }
  }
}
</style>
