'use strict';

module.exports = app => {
  const { router, controller } = app;
  router.post('/blog/comment/visitorLogin', controller.blog.comment.visitorLogin);
  router.post('/blog/comment/updatePortrait', controller.blog.comment.updatePortrait);
  router.post('/blog/upload', controller.blog.upload.index);
  router.post('/blog/comment/getComments', controller.blog.comment.getComments);
  router.post('/blog/comment/addComment', controller.blog.comment.addComment);
  router.post('/blog/comment/addLikeCount', controller.blog.comment.addLikeCount);
  router.post('/blog/index/getTalkList', controller.blog.index.getTalkList);
  router.post('/blog/index/addLikeCount', controller.blog.index.addLikeCount);
  router.get('/blog/index/getUserInfoById/:id', controller.blog.index.getUserInfoById);
  router.post('/blog/index/getArticleList', controller.blog.index.getArticleList);
  router.get('/blog/index/getAdverList', controller.blog.index.getAdverList);
  router.get('/blog/articledetail/getArticleDetailById/:id', controller.blog.articledetail.getArticleDetailById);
  router.post('/blog/articlelist/getArticleList', controller.blog.articlelist.getArticleList);
  router.get('/blog/articlelist/getArticleTypes', controller.blog.articlelist.getArticleTypes);
  router.get('/blog/about/getAbout', controller.blog.about.getAbout);
  router.post('/blog/index/getNovelList', controller.blog.index.getNovelList);
  router.get('/blog/novel/getChapterById/:id', controller.blog.novel.getChapterById);
  router.get('/blog/novel/getNovelById/:id', controller.blog.novel.getNovelById);
  router.post('/blog/index/getIndexListApp', controller.blog.index.getIndexListApp);
};
