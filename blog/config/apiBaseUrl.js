const serverUrl = 'http://immortalboy.cn:8001'
const baseUrl = 'http://immortalboy.cn:8001/blog'

const servicePath = {
  visitorLogin: baseUrl + '/comment/visitorLogin', // 评论接口：获取文章列表
  updatePortrait: baseUrl + '/comment/updatePortrait', // 评论接口：获取文章列表
  upload: baseUrl + '/upload', // 上传接口
  getComments: baseUrl + '/comment/getComments', // 评论接口：获取评论列表
  addComment: baseUrl + '/comment/addComment', // 评论接口：新增评论
  addCommentLikeCount: baseUrl + '/comment/addLikeCount', // 评论接口：新增点赞数
  getTalkList: baseUrl + '/index/getTalkList', // 首页接口：获取说说列表
  getNovelList: baseUrl + '/index/getNovelList', // 首页接口：获取小说列表
  addTalkLikeCount: baseUrl + '/index/addLikeCount', // 首页接口：新增说说点赞数
  getArticleList: baseUrl + '/index/getArticleList', // 首页接口：获取文章列表
  getUserInfoById: baseUrl + '/index/getUserInfoById/', // 首页接口：获取博主信息
  getAdverList: baseUrl + '/index/getAdverList', // 首页接口：获取广告信息
  getArticleDetailById: baseUrl + '/articledetail/getArticleDetailById/', // 文章详情接口：获取文章详情
  getArticleListWithType: baseUrl + '/articlelist/getArticleList', // 文章列表接口：获取文章列表
  getArticleTypes: baseUrl + '/articlelist/getArticleTypes', // 文章列表接口：获取文章分类
  getAbout: baseUrl + '/about/getAbout', // 获取关于我页面数据
  getChapterById: baseUrl + '/novel/getChapterById', // 根据id获取章节详情
}

export {
  serverUrl,
  servicePath
}