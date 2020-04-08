const serverUrl = 'http://localhost:7001'
const baseUrl = 'http://127.0.0.1:7001/admin'

const servicePath = {
  checkRegister: baseUrl + '/checkRegister', // 用户注册接口
  checkLogin: baseUrl + '/checkLogin', // 登录接口：校验用户名密码
  getTypeInfo: baseUrl + '/getTypeInfo', // 新增文章接口：获取文章类别
  addArticleType: baseUrl + '/addArticleType', // 新增文章接口：新增文章类别
  addArticle: baseUrl + '/addArticle', // 新增文章接口：添加文章
  updateArticle: baseUrl + '/updateArticle', // 新增文章接口：更新文章
  getArticleList: baseUrl + '/getArticleList', // 文章列表接口：获取文章列表
  changePublishStatus: baseUrl + '/changePublishStatus', // 文章列表接口：更新文章发布状态
  delArticleById: baseUrl + '/delArticleById/', // 文章列表接口：删除文章
  getArticleById: baseUrl + '/getArticleById/', // 修改列表接口：根据id获取文章详情,
  upload: baseUrl + '/upload', // 上传接口：获取文章列表
  updateUserInfo: baseUrl + '/userSetting/updateUserInfo', // 个人信息接口：更新博主信息
  getUserInfoById: baseUrl + '/userSetting/getUserInfoById/', // 个人信息接口：获取博主信息
  addAdvertise: baseUrl + '/advertiseManage/addAdvertise', // 广告接口：新增广告
  getAdvertiseList: baseUrl + '/advertiseManage/getAdvertiseList', // 广告接口：查询广告列表
  updateAdvertise: baseUrl + '/advertiseManage/updateAdvertise', // 广告接口：更新广告
  updateAdvertiseIsShow: baseUrl + '/advertiseManage/updateAdvertiseIsShow', // 广告接口：更新广告发布状态
  deleteAdvertiseById: baseUrl + '/advertiseManage/deleteAdvertiseById/', // 广告接口：删除广告记录
  getAbout: baseUrl + '/about/getAbout/', // 关于我接口：获取关于我信息  
  updateAbout: baseUrl + '/about/updateAbout', // 更新关于我页面数据
}

export {
  serverUrl,
  servicePath
}