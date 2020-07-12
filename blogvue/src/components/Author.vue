<template>
  <div class="author-container">
    <div class="bg-img" :style="{'backgroundImage': `url(${userInfo.bgImg})`}"></div>
    <img class="avatar" :src="userInfo.portrait" />
    <router-link class="author-name" to="/about">
      <span>{{userInfo.username}}</span>
    </router-link>
    <div class="card-info">
      <div class="info-item">
        <p class="count">{{userInfo.articleCount}}</p>
        <p class="title">文章</p>
      </div>
      <div class="info-item">
        <p class="count">{{userInfo.novelCount}}</p>
        <p class="title">小说</p>
      </div>
      <div class="info-item">
        <p class="count">{{userInfo.talkCount}}</p>
        <p class="title">说说</p>
      </div>
    </div>
    <div class="account-info">
      <a-divider>社交账号</a-divider>
      <div class="list">
        <div class="item">
          <a-popover class="item" :content="userInfo.githubUrl">
            <div>
              <c-icon type="icon-antd-github" />
            </div>
          </a-popover>
        </div>
        <div class="item">
          <a-popover class="item" :content="userInfo.weChatAccount">
            <div>
              <c-icon type="icon-antd-wechat" />
            </div>
          </a-popover>
        </div>
        <div class="item">
          <a-popover class="item" :content="userInfo.qqAccount">
            <div>
              <c-icon type="icon-antd-qq-circle" />
            </div>
          </a-popover>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Icon from '@/components/Icon'
import lazyLoadingImg from '@/assets/images/lazyloading.gif'
import lazyLoadErrorImg from '@/assets/images/404.png'

export default {
  components: {
    'c-icon': Icon
  },
  props: {
    userInfo: {
      type: Object,
      required: true
    },
  },
  computed: {
    bgImg: {
      get: function () {
        return {
          src: this.userInfo.bgImg,
          error: lazyLoadErrorImg,
          loading: lazyLoadingImg
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.author-container {
  position: relative;
  border-radius: .5rem !important;
  background-color: #fff;
  .bg-img {
    width: 100%;
    height: 5rem;
    background-repeat: no-repeat;
    background-position: center center;
    background-attachment: scroll;
    background-size: cover;
    border-top-left-radius: .5rem;
    border-top-right-radius: .5rem;
  }
  .avatar {
    width: 4rem;
    height: 4rem;
    position: absolute;
    top: 4rem;
    left: 1.5rem;
    border-radius: 50%;
    border: 2px solid #ffffff;
    box-shadow: 1px 1px 1px rgba(0,0,0,.1), 1px 1px 1px rgba(0,0,0,0.1), 1px 1px 1px rgba(0,0,0,0.1);
  }
  .author-name {
    display: inline-block;
    margin-left: 6rem;
    margin-top: .6rem;
    color: #333333;
    font-size: 1.1rem;
  }
  .card-info {
    display: flex;
    margin: 2.5rem 2rem 0;
    .info-item {
      flex: 1;
      p {
        text-align: center;
        font-size: .9rem;
        font-weight: bold;
        margin-bottom: .5rem;
      }
      .count {
        color: #00a1d6;
      }
      .title {
        color: #909090;
      }
    }
  }
  .account-info {
    padding-bottom: 1.5rem;
    border-top-left-radius: .5rem;
    border-top-right-radius: .5rem;
    .list {
      font-size: 1.5rem;
      display: flex;
      .item {
        flex: 1;
        display: flex;
        justify-content: center;
      }
    }
  }
  & /deep/ .ant-popover-inner-content {
    box-sizing: border-box;
    background-color: rgba(0,0,0,.75);
    color: #ffffff;
    border-radius: .25rem;
  }
}


</style>
