'use strict';

module.exports = app => {
  const { router, controller } = app;
  const adminauth = app.middleware.adminauth();
  router.post('/admin/checkRegister', controller.admin.login.checkRegister);
  router.post('/admin/checkLogin', controller.admin.login.checkLogin);
  router.post('/admin/upload', controller.blog.upload.index);
  router.get('/admin/getTypeInfo', adminauth, controller.admin.addArticle.getTypeInfo);
  router.post('/admin/addArticleType', adminauth, controller.admin.addArticle.addArticleType);
  router.post('/admin/addArticle', adminauth, controller.admin.addArticle.addArticle);
  router.post('/admin/updateArticle', adminauth, controller.admin.addArticle.updateArticle);
  router.post('/admin/getArticleList', adminauth, controller.admin.articleList.getArticleList);
  router.post('/admin/changePublishStatus', adminauth, controller.admin.articleList.changePublishStatus);
  router.get('/admin/delArticleById/:id', adminauth, controller.admin.articleList.delArticleById);
  router.get('/admin/getArticleById/:id', adminauth, controller.admin.articleList.getArticleById);
  router.post('/admin/userSetting/updateUserInfo', adminauth, controller.admin.userSetting.updateUserInfo);
  router.get('/admin/userSetting/getUserInfoById/:id', adminauth, controller.admin.userSetting.getUserInfoById);
  router.post('/admin/advertiseManage/addAdvertise', adminauth, controller.admin.advertiseManage.addAdvertise);
  router.post('/admin/advertiseManage/getAdvertiseList', adminauth, controller.admin.advertiseManage.getAdvertiseList);
  router.post('/admin/advertiseManage/updateAdvertise', adminauth, controller.admin.advertiseManage.updateAdvertise);
  router.post('/admin/advertiseManage/updateAdvertiseIsShow', adminauth, controller.admin.advertiseManage.updateAdvertiseIsShow);
  router.get('/admin/advertiseManage/deleteAdvertiseById/:id', adminauth, controller.admin.advertiseManage.deleteAdvertiseById);
  router.get('/admin/about/getAbout', controller.admin.about.getAbout);
  router.post('/admin/about/updateAbout', controller.admin.about.updateAbout);
};
