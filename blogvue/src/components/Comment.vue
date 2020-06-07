<template>
  <div class="comment-container" @click="()=> showSubmitBtn = false ">
    <div class="comment-box-wrapper" @click="(e)=> e.stopPropagation()">
      <div class="comment-box">
        <div class="comment-avatar">
          <div v-if="!hasLogin">
            <c-icon type="icon-antd-user" />
          </div>
          <a-upload
            v-else
            name='file'
            :action="servicePath.upload"
            :headers="{ authorization: 'authorization-text' }"
            :showUploadList="false"
            @change="uploadChange">
            <a-avatar :size="32" :src="portrait" title="点击上传头像" />
          </a-upload>
        </div>
        <a-input
          class="comment-input"
          placeholder="输入评论..."
          :value="comment"
          @focus="() => showSubmitBtn = true"
          @change="(e) => comment = e.target.value"
          @click="clickInput"
          @pressEnter="submitComment"
          />
      </div>
      <div class="submit-wrapper" v-show="showSubmitBtn">
        <div class="emoji-wrapper"></div>
        <div class="btn-wrapper">
          <span class="marked-word">Ctrl or ⌘ + Enter</span>
          <a-button
            class="submit-btn"
            type="primary"
            @click="submitComment">评论</a-button>
        </div>
      </div>
    </div>
    <div class="comment-list">
      <div v-show="commentList.length > 0">
        <template v-for="(item, index) in commentList">
          <div
            class="comment-item"
            :key="index + item.publishTime"
            @click="()=> selectedCommentId = ''">
            <div class="avatar-container">
              <a :href="'http://' + item.site" target="_blank">
                <img :src="item.portrait" />
              </a>
            </div>
            <div class="comment-info">
              <span class="nickname">{{item.nickname}}</span>
              <div
                class="comment-content"
                v-html="item.comment"></div>
              <div class="sub-info">
                <div class="publish-time">{{formatDate(item.publishTime, true)}}</div>
                <div class="other-info-wrapper">
                  <div class="other-info-box">
                    <div
                      class="box-item"
                      title="点赞"
                      @click="addLikeCount(item.id)">
                      <c-icon v-if="Cookies.get('comment_zan_' + item.id)" color="#37c700" type="icon-zan" />
                      <c-icon v-else type="icon-zan" />
                      <span class="text" v-show="item.likeNum > 0">{item.likeNum}</span>
                    </div>
                    <div
                      class="box-item"
                      title="回复"
                      @click="addSecondComment(item.id)">
                      <c-icon type="icon-comment" />
                      <span class="text">回复</span>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="second-comment-box"
                v-show="selectedCommentId === item.id"
                @click="(e)=> e.stopPropagation()">
                <Input
                  class="comment-input"
                  :placeholder="'回复'+ item.nickname + '...'"
                  :value="secondComment"
                  @change="(e) => secondComment = e.target.value"
                  @click="clickInput"
                  @pressEnter="submitSecondComment(item.id)"
                />
                <div class="submit-wrapper">
                  <div class="emoji-wrapper"></div>
                  <div class="btn-wrapper">
                    <span class="marked-word">Ctrl or ⌘ + Enter</span>
                    <a-button
                      class="submit-btn"
                      type="primary"
                      @click="submitSecondComment(item.id)">评论</a-button>
                  </div>
                </div>
              </div>
              <template v-for="(subItem, subKey) in item.children">
                <div class="second-comment-item" :key="subKey">
                  <div class="avatar-container">
                    <a :href="'http://' + subItem.site" target="_blank">
                      <img :src="subItem.portrait" />
                    </a>
                  </div>
                  <div class="comment-info">
                    <span class="nickname">{{subItem.nickname}}</span>
                    <div class="comment-content" >
                      <div>回复
                        <a :href="'http://' + item.site" target="_blank">
                          {{item.nickname}}
                        </a>：
                      </div>
                      <div v-html="subItem.comment"></div>
                    </div>
                    <!-- <div
                      class="comment-content"
                      v-html="subItem.comment"></div> -->
                    <div class="sub-info">
                      <div class="publish-time">{{formatDate(subItem.publishTime, true)}}</div>
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </template>
      </div>
    </div>
    <div v-show="commentList.length === 0" class="no-comments">暂无评论</div>
    <a-modal
      :width="300"
      title="发表评论"
      :visible.sync="showLoginDialog"
      :footer="null"
      @cancel="()=> showLoginDialog = false"
    >
      <a-form-model
        ref="commentForm"
        size="medium"
        :model="commentForm"
        :rules="commentRules">
        <a-form-model-item
          has-feedback
          prop="nickname">
          <a-input v-model="commentForm.nickname" placeholder="昵称(必填)" >
            <c-icon slot="prefix" type='icon-user' />
          </a-input>
        </a-form-model-item>
        <a-form-model-item
          has-feedback
          prop="email">
          <a-input v-model="commentForm.email" placeholder="邮箱(必填)" >
            <c-icon slot="prefix" type='icon-antd-mail' />
            </a-input>
        </a-form-model-item>
        <a-form-model-item
          has-feedback
          prop="site">
          <a-input v-model="commentForm.site" placeholder="个人网址(选填)" >
            <c-icon slot="prefix" type='icon-antd-global' />
          </a-input>
        </a-form-model-item>
        <a-form-model-item>
          <a-button
            style="width: '100%'"
            type="primary"
            htmlType="submit"
            @click="submitCommentForm('commentForm')">提交</a-button>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import { servicePath, serverUrl } from '../config/apiBaseUrl'
import { formatDate } from '../assets/js/tools'
import commentAvatar from '../assets/images/comment-avatar.png'
import Icon from '../components/Icon'

const currentPage = 1 // 当前页
const pageSize = 15 // 每页条数
const uploadProps = { // 上传头像
    name: 'file',
    action: servicePath.upload,
    headers: {
      authorization: 'authorization-text',
    },
    showUploadList: false,
    onChange(info) {
      if (info.file.status !== 'uploading') {
        const result = info.file.response
        if (result.success) {
          let url = result.data.url
          let fileUrl = ''
          url.split('\\').forEach(item => {
            fileUrl += item + '/'
          })
          fileUrl = fileUrl.substr(0, fileUrl.length - 1)
          const filePath = serverUrl + fileUrl
          setPortrait(filePath)
          Cookies.set('visitorPortrait', filePath, { expires: 365 })
          axios({
            method: 'post',
            url: servicePath.updatePortrait,
            data: {
              id: Cookies.get('visitorId'),
              portrait: filePath
            }
          })
            .then(res=>{
            })
        }
      }
      if (info.file.status === 'done') {
        this.$message.success('上传头像成功');
      } else if (info.file.status === 'error') {
        this.$message.error('头像上传失败');
      }
    },
  }

export default {
  components: {
    "c-icon": Icon
  },
  props: {
    type: {
      type: String,
      required: true
    },
    id: {
      type: [String, Number]
    }
  },
  data() {
    return {
      Cookies,
      servicePath,
      showSubmitBtn: false,
      hasLogin: Cookies.get('visitorId'),
      showLoginDialog: false,
      portrait: Cookies.get('visitorPortrait') && Cookies.get('visitorPortrait') !== 'null'?
        Cookies.get('visitorPortrait'): commentAvatar,
      commentForm: {
        nickname: '',
        email: '',
        site: ''
      },
      commentRules: {
        nickname: [ { required: true, message: '昵称不能为空', trigger: 'blur' }],
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
        ],
        site: []
      },
      commentList: [],
      comment: '',
      selectedCommentId: '',
      secondComment: ''
    }
  },
  mounted() {
    this.getComments()
  },
  methods: {
    formatDate,
    getComments() {
      let typeName = ''
      switch (this.type) {
        case 'talk':
          typeName = 'talkId'
          break;
        case 'article':
          typeName = 'articleId'
          break;
        case 'novel':
          typeName = 'novelId'
          break;
        case 'about':
          typeName = 'aboutId'
          break;
        default:
          typeName = 'talkId'
          break;
      }
      const dataProps = {
        typeName,
        parentId: this.id,
        limit: pageSize,
        offset: (currentPage - 1) * pageSize
      }
      this.$api({
        method: 'post',
        url: servicePath.getComments,
        data: dataProps
      })
        .then(res => {
          const comments = []
          const secondComment = []
          res.forEach((item, index) =>{
            if (item.beCommentId) {
              secondComment.push(item)
            } else {
              comments.push(item)
            }
          })
          comments.forEach(item => {
            item.children = []
            secondComment.forEach(subItem => {
              if(item.id == subItem.beCommentId) {
                item.children.push(subItem)
              }
            })
          })
          this.commentList = comments
        })
    },
    uploadChange(info) {
      if (info.file.status !== 'uploading') {
        const result = info.file.response
        if (result.success) {
          let url = result.data.url
          let fileUrl = ''
          url.split('\\').forEach(item => {
            fileUrl += item + '/'
          })
          fileUrl = fileUrl.substr(0, fileUrl.length - 1)
          const filePath = serverUrl + fileUrl
          this.portrait = filePath
          Cookies.set('visitorPortrait', filePath, { expires: 365 })
          this.$api({
            method: 'post',
            url: servicePath.updatePortrait,
            data: {
              id: Cookies.get('visitorId'),
              portrait: filePath
            }
          })
            .then(res=>{
            })
        }
      }
      if (info.file.status === 'done') {
        this.$message.success('上传头像成功');
      } else if (info.file.status === 'error') {
        this.$message.error('头像上传失败');
      }
    },
    clickInput(e) {
      console.log(this.hasLogin)
      if (!this.hasLogin) {
        this.showLoginDialog = true
        // e.preventDefault()
      }
    },
    addSecondComment(id, e) {
      this.selectedCommentId = id
      e.stopPropagation()
    },
    submitComment() {
      if (this.comment.length > 0) {
        let typeName = ''
        switch (this.type) {
          case 'talk':
            typeName = 'talkId'
            break;
          case 'article':
            typeName = 'articleId'
            break;
          case 'novel':
            typeName = 'novelId'
            break;
          case 'about':
            typeName = 'aboutId'
            break;
          default:
            typeName = 'talkId'
            break;
        }
        const dataProps = {
          typeName,
          parentId: this.id,
          visitorId: Cookies.get('visitorId'),
          comment: this.comment,
          publishTime: Math.floor(Date.now() / 1000),
          limit: pageSize,
          offset: (currentPage - 1) * pageSize
        }
        this.$api({
          method: 'post',
          url: servicePath.addComment,
          data: dataProps
        })
          .then(res => {
            const comments = []
            const secondComment = []
            res.forEach((item, index) =>{
              if (item.beCommentId) {
                secondComment.push(item)
              } else {
                comments.push(item)
              }
            })
            comments.forEach(item => {
              item.children = []
              secondComment.forEach(subItem => {
                if(item.id == subItem.beCommentId) {
                  item.children.push(subItem)
                }
              })
            })
            this.comment = ''
            this.commentList = comments
          })
      }
    },
    addLikeCount(id) {
      // 缓存已点赞的评论的id
      if(!Cookies.get('comment_zan_'+id)) {
        Cookies.set('comment_zan_'+id, id, { expires: 730 })
        this.$api({
          method: 'post',
          url: servicePath.addCommentLikeCount,
          data: {
            id
          }
        })
          .then(res=>{
            const comments = JSON.parse(JSON.stringify(commentList));
            for (const item of comments) {
              if (item.id === id) {
                item.likeNum++
              }
            }
            this.commentList = comments
          })
      } else {
        this.$message.warning('您已经点过赞了', 2)
      }
    },
    submitSecondComment(id) {
      this.beCommentId = id
      this.selectedCommentId = ''
      if (this.secondComment.length > 0) {
        let typeName = ''
        switch (props.type) {
          case 'talk':
            typeName = 'talkId'
            break;
          case 'article':
            typeName = 'articleId'
            break;
          case 'novel':
            typeName = 'novelId'
            break;
          case 'about':
            typeName = 'aboutId'
            break;
          default:
            typeName = 'talkId'
            break;
        }
        const dataProps = {
          typeName,
          parentId: this.id,
          visitorId: Cookies.get('visitorId'),
          comment: this.secondComment,
          publishTime: Math.floor(Date.now() / 1000),
          limit: pageSize,
          offset: (currentPage - 1) * pageSize,
          beCommentId: id
        }
        this.$api({
          method: 'post',
          url: servicePath.addComment,
          data: dataProps
        })
          .then(res => {
            const comments = []
            const secondComment = []
            result.data.forEach((item, index) =>{
              if (item.beCommentId) {
                secondComment.push(item)
              } else {
                comments.push(item)
              }
            })
            comments.forEach(item => {
              item.children = []
              secondComment.forEach(subItem => {
                if(item.id == subItem.beCommentId) {
                  item.children.push(subItem)
                }
              })
            })
            this.commentList = comments
          })
      }
    },
    submitCommentForm(formName) {
      this.$refs[formName].validate(valid=> {
        if (valid) {
          this.$api({
            method: 'post',
            url: servicePath.visitorLogin,
            data: {
              nickname: this.commentForm.nickname,
              email: this.commentForm.email,
              site: this.commentForm.site
            }
          })
            .then(res=>{
              Cookies.set('visitorId', res.id, { expires: 365 })
              Cookies.set('visitorNickname', res.nickname, { expires: 365 })
              Cookies.set('visitorPortrait', res.portrait, { expires: 365 })
              // this.hasLogin = Cookies.get('visitorId')
              this.hasLogin = true
              this.showLoginDialog = false
            })
        } else {
          return false
        }
      })
    }
  },
}
</script>

<style lang="scss" scoped>
.comment-container {
  padding: 1rem .5rem;
  text-align: initial;
  .comment-box-wrapper {
    border-radius: .3rem;
    padding: 1rem 1rem;
    background-color: #f7f7f7;
    .comment-box {
      display: flex;
      align-items: center;
      .comment-avatar {
        margin-right: 1rem;
        .avatar {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
        }
      }
      .comment-input {
        height: 36px;
        border-radius: .25rem;
      }
    }
    .submit-wrapper {
      display: flex;
      align-items: center;
      margin-top: .8rem;
      .emoji-wrapper {
        flex: 1;
      }
      .btn-wrapper{
        .marked-word {
          color: #999999;
          margin-right: 1rem;
        }
        .submit-btn {
          opacity: .5;
        }
      }
    }
  }
  .comment-list {
    margin-left: 4rem;
    margin-top: 1rem;
    .comment-item {
      margin-bottom: .75rem;
      display: flex;
      .avatar-container {
        padding-right: .8rem;
        img {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          margin: .25rem 0;
          object-fit: cover;
        }
      }
    }
    .comment-info {
      flex: 1;
      padding-bottom: .25rem;
      border-bottom: 1px solid #efefef;
      .nickname {
        color: #333333;
        margin-bottom: .25rem;
        font-size: .8rem;
      }
      .comment-content {
        color: #333333;
        margin-bottom: .5rem;
        font-size: .8rem;
      }
      .sub-info {
        display: flex;
        align-items: center;
        justify-content: left;
        font-size: .7rem;
        color: #aaaaaa;
        padding: 0;
      }
      .other-info-wrapper {
        flex: 1;
        display: flex;
        flex-direction: row-reverse;
        .other-info-box {
          display: flex;
          align-items: center;
          & > .box-item {
            color: #aaaaaa;
            font-size: .8rem;
            margin-right: 1rem;
            cursor: pointer;
            &:hover {
              color: #40a9ff;
            }
            & > .text {
              font-size: 1rem;
              margin-left: .25rem;
              font-size: .7rem;
            }
          }
        }
      }
      .second-comment-box {
        margin: 1rem 2rem;
        padding: 1rem 2rem;
        background-color: #f7f7f7;
        border-radius: .25rem;
        .comment-input {
          border-radius: .25rem;
        }
        .submit-wrapper {
          display: flex;
          align-items: center;
          margin-top: .8rem;
          .emoji-wrapper {
            flex: 1;
          }
          .btn-wrapper {
            .marked-word {
              color: #999999;
              margin-right: 1rem;
            }
            .submit-btn {
              opacity: .5;
            }
          }
        }
      }
      .second-comment-item {
        display: flex;
        padding: 1rem;
        background-color: #fafbfc;
        .comment-info {
          flex: 1;
          border-bottom: none;
          .comment-content {
            display: flex;
            align-items: center;
            .user {
              padding: 0 .25rem;
            }
          }
        }
      }
    }
  }
  .no-comments {
    padding: 1.5rem 0;
    text-align: center;
  }
}
</style>
