'use strict';

const controller = require('egg').Controller;

class IndexController extends controller {
  async getIndexList() {
    // const request = this.ctx.request.body;
    // return  '';
  }

  async getUserInfoById() {
    const id = this.ctx.params.id;
    console.log('id', id);
    const selectSql = `SELECT username as username, portrait as portrait, bg_img as bgImg,
                        qq_account as qqAccount, wechat_account as weChatAccount, github_url as githubUrl,
                        logo_name as logoName, logo_sub as logoSub
                        FROM admin_user WHERE id = ?`;
    const userInfoPromise = this.app.mysql.query(selectSql, [ id ]);
    const articleCountPromise = this.app.mysql.query('SELECT count(id) as count from article');
    const talkCountPromise = this.app.mysql.query('SELECT count(id) as count from talk');
    const novelCountPromise = this.app.mysql.query('SELECT (max(id)-min(id)+1) as count from novel where is_deleted = 0');
    const [userInfoResult, articleCountResult, talkCountResult, novelCountResult] = await Promise.all([userInfoPromise, articleCountPromise, talkCountPromise, novelCountPromise])
    if (userInfoResult.length > 0) {
      const dataObj = userInfoResult[0];
      dataObj.articleCount = articleCountResult[0].count;
      dataObj.talkCount = talkCountResult[0].count;
      dataObj.novelCount = novelCountResult[0].count;
      console.log('dataObj', dataObj);
      this.ctx.body = { success: true, data: dataObj };
      console.log(this.ctx.body);
    } else {
      this.ctx.body = { success: false, message: '获取个人信息失败' };
    }

  }

  async getAdverList() {
    const selectSql = 'SELECT * FROM advertise WHERE isshow = 1 ORDER BY updatetime DESC LIMIT 3';
    const result = await this.app.mysql.query(selectSql);
    if (result.length > 0) {
      this.ctx.body = { success: true, data: result };
    } else {
      this.ctx.body = { success: false };
    }
  }

  async getArticleList() {
    const request = this.ctx.request.body;
    const sql = `SELECT article.id as id,
            article.title as title,
            article.introduce as introduce,
            article.introduce_img as introduceImg,
            article.author as authorName,
            article.reprinted as reprinted,
            FROM_UNIXTIME(article.publish_time, '%Y-%m-%d %H:%i:%s') as publishTime,
            article.view_count as viewCount,
            article.is_publish as isPublish,
            article_type.name as type
            FROM article LEFT JOIN  article_type
            ON article.type_id = article_type.id WHERE article.is_publish = 1 ORDER BY article.publish_time DESC LIMIT ?,?`;
    const articleListPromise = this.app.mysql.query(sql, [ request.offset, request.limit ]);
    const countPromise = this.app.mysql.query('SELECT (max(id)-min(id)+1) as count from novel where is_deleted = 0');
    const [articleListResult, countResult] = await Promise.all([articleListPromise, countPromise])
    if (articleListResult.length > 0) {
      for (const item of articleListResult) {
        item.listType = 'article';
      }
      this.ctx.body = {
        success: true,
        data: {
          total: countResult[0].total,
          list: articleListResult,
        },
      };
      console.log(this.ctx.body);
    } else {
      this.ctx.body = {
        success: false,
        message: '获取文章列表失败',
      };
    }
  }

  async getTalkList() {
    const request = this.ctx.request.body;
    const sql = `SELECT talk.id AS id, talk.content AS content, talk.publish_time AS publishTime,
                talk.like_count AS likeCount, user.username as name, user.portrait as portrait
                FROM talk 
                LEFT JOIN admin_user AS user ON talk.user_id = user.id
                ORDER BY talk.publish_time DESC LIMIT ?,?`;
    const result = await this.app.mysql.query(sql, [ request.offset, request.limit ]);
    const countResult = await this.app.mysql.query('SELECT count(id) as total FROM talk');
    if (result.length > 0) {
      const commentsql = 'SELECT count(*) as count FROM visitor_comment as comment WHERE comment.talk_id = ?';
      for (const item of result) {
        item.listType = 'talk';
        const commentCountResult = await this.app.mysql.query(commentsql, [ item.id ]);
        if (commentCountResult.length > 0) {
          item.commentCount = commentCountResult[0].count;
        } else {
          item.commentCount = 0;
        }
      }
      this.ctx.body = {
        success: true,
        data: {
          total: countResult.length > 0 ? countResult[0].total : 0,
          list: result,
        },
      };
    } else {
      this.ctx.body = {
        success: false,
        message: '获取说说失败',
      };
    }
  }

  async getNovelList() {
    const request = this.ctx.request.body;
    const sql = `SELECT chapter.id as id, chapter.name as name, chapter.author as author,
                chapter.summary as summary, chapter.updatetime as publishTime, 
                chapter.view_count as viewCount, novel.name as novelName, novel.id as novelId
                FROM novel_chapter as chapter 
                LEFT JOIN novel ON chapter.novel_id = novel.id 
                ORDER BY chapter.updatetime DESC LIMIT ?,?`;
    const sqlResult = await this.app.mysql.query(sql, [ request.offset, request.limit ]);
    const countResult = await this.app.mysql.query('SELECT (max(id)-min(id)+1) as count from novel_chapter where is_deleted = 0');
    if (sqlResult.length > 0) {
      for (const item of sqlResult) {
        item.listType = 'novel';
      }
      this.ctx.body = {
        success: true,
        data: {
          total: countResult.length > 0 ? countResult[0].total : 0,
          list: sqlResult,
        },
      };
    } else {
      this.ctx.body = {
        success: false,
        message: '没有相关数据',
      };
    }
  }

  async addLikeCount() {
    const request = this.ctx.request.body;
    const sql = 'UPDATE talk SET like_count = like_count + 1 WHERE id = ?';
    const updateResult = await this.app.mysql.query(sql, [ request.id ]);
    if (updateResult.affectedRows === 1) {
      this.ctx.body = {
        success: true,
      };
    } else {
      this.ctx.body = {
        success: false,
        data: '程序故障，点赞未生效',
      };
    }
  }

  async getIndexListApp() {
    const request = this.ctx.request.body;
    const chapterCountResult = await this.app.mysql.query('SELECT (max(id)-min(id)+1) AS total FROM novel_chapter where is_deleted = 0');
    const articleCountResult = await this.app.mysql.query('SELECT (max(id)-min(id)+1) AS total FROM article where is_deleted = 0');
    const chapterSql = 'SELECT id AS chapterId, updatetime AS updateTime FROM novel_chapter';
    const articleSql = 'SELECT id AS articleId, publish_time AS updateTime FROM article';
    const chapterList = await this.app.mysql.query(chapterSql);
    const articleList = await this.app.mysql.query(articleSql);
    const total = chapterCountResult[0].total + articleCountResult[0].total;
    if (total > request.offset) {
      const unionList = chapterList.concat(articleList);
      unionList.sort((a, b) => {
        return a.updateTime - b.updateTime;
      });
      unionList.slice(request.offset, request.offset + request.limit);
      let articleIdStr = '';
      let chapterIdStr = '';
      unionList.forEach(item => {
        if (item.articleId) {
          articleIdStr += item.articleId + ',';
        }
        if (item.chapterId) {
          chapterIdStr += item.chapterId + ',';
        }
      });
      let articleListResult = [];
      let chapterListResult = [];
      if (articleIdStr.length > 0) {
        articleIdStr = articleIdStr.substr(0, articleIdStr.length - 1);
        const articleListSql = `SELECT id, title, author AS authorName, reprinted,
                              FROM_UNIXTIME(publish_time, '%Y-%m-%d %H:%i:%s') AS publishTime, is_publish AS isPublish,
                              introduce_img AS introduceImg, view_count AS viewCount
                              FROM article WHERE id in(${articleIdStr}) AND is_publish = 1 ORDER BY publish_time DESC`;
        articleListResult = await this.app.mysql.query(articleListSql);
      }
      if (chapterIdStr.length > 0) {
        chapterIdStr = chapterIdStr.substr(0, chapterIdStr.length - 1);
        const chapterListSql = `SELECT chapter.id as id, novel.id as novelId,
                              novel.name AS novelName, chapter.name as name, 
                              chapter.author AS author,chapter.summary as summary, 
                              chapter.view_count AS viewCount, chapter.updatetime AS publishTime 
                              FROM novel_chapter AS chapter
                              LEFT JOIN novel ON chapter.novel_id = novel.id
                              WHERE chapter.id in(${chapterIdStr})  ORDER BY chapter.createtime DESC`;
        chapterListResult = await this.app.mysql.query(chapterListSql);
      }
      this.ctx.body = {
        success: true,
        data: {
          total,
          articleList: articleListResult,
          chapterList: chapterListResult,
        },
      };
    } else {
      this.ctx.body = {
        success: false,
        message: '没有更多文章',
      };
    }
  }

  async getSearchList() {
    const request = this.ctx.request.body;
    if (request.type === 'article') {
      const sql = `SELECT id, title, author AS authorName, reprinted,
                  publish_time AS publishTime, is_publish AS isPublish,
                  introduce_img AS introduceImg, view_count AS viewCount
                  FROM article where title like '%${request.searchValue}%' AND is_publish = 1 ORDER BY publish_time DESC  LIMIT ?,?`;
      const sqlResult = await this.app.mysql.query(sql, [ request.offset, request.limit ]);
      const countResult = await this.app.mysql.query('SELECT (max(id)-min(id)+1) as total FROM article where is_deleted = 0');
      if (sqlResult.length > 0) {
        for (const item of sqlResult) {
          item.listType = 'article';
        }
        this.ctx.body = {
          success: true,
          data: {
            total: countResult.length > 0 ? countResult[0].total : 0,
            list: sqlResult,
          },
        };
      } else {
        this.ctx.body = {
          success: false,
          message: '暂无数据',
        };
      }
    } else if (request.type === 'novel') {
      const sql = `SELECT chapter.id as id, novel.id as novelId,
                    novel.name AS novelName, chapter.name as name, 
                    chapter.author AS author,chapter.summary as summary, 
                    chapter.view_count AS viewCount, chapter.updatetime AS publishTime 
                    FROM novel_chapter AS chapter
                    LEFT JOIN novel ON chapter.novel_id = novel.id
                    WHERE chapter.name like '%${request.searchValue}%' ORDER BY updatetime DESC LIMIT ?,?`;
      const sqlResult = await this.app.mysql.query(sql, [ request.offset, request.limit ]);
      const countResult = await this.app.mysql.query('SELECT (max(id)-min(id)+1) as total FROM novel_chapter where is_deleted = 0');
      if (sqlResult.length > 0) {
        for (const item of sqlResult) {
          item.listType = 'novel';
        }
        this.ctx.body = {
          success: true,
          data: {
            total: countResult.length > 0 ? countResult[0].total : 0,
            list: sqlResult,
          },
        };
      } else {
        this.ctx.body = {
          success: false,
          message: '暂无数据',
        };
      }
    } else if (request.type === 'all') {
      const chapterCountResult = await this.app.mysql.query(`SELECT count(*) AS total FROM novel_chapter WHERE name like '%${request.searchValue}%'`);
      const articleCountResult = await this.app.mysql.query(`SELECT count(*) AS total FROM article WHERE title like '%${request.searchValue}%'`);
      const chapterSql = `SELECT id AS chapterId, updatetime AS updateTime FROM novel_chapter WHERE name like '%${request.searchValue}%'`;
      const articleSql = `SELECT id AS articleId, publish_time AS updateTime FROM article WHERE title like '%${request.searchValue}%'`;
      const chapterList = await this.app.mysql.query(chapterSql);
      const articleList = await this.app.mysql.query(articleSql);
      const total = chapterCountResult[0].total + articleCountResult[0].total;
      const unionList = chapterList.concat(articleList);
      unionList.sort((a, b) => {
        return a.updateTime - b.updateTime;
      });
      unionList.slice(request.offset, request.offset + request.limit);
      let articleIdStr = '';
      let chapterIdStr = '';
      unionList.forEach(item => {
        if (item.articleId) {
          articleIdStr += item.articleId + ',';
        }
        if (item.chapterId) {
          chapterIdStr += item.chapterId + ',';
        }
      });
      articleIdStr = articleIdStr.length > 0 && articleIdStr.substr(0, articleIdStr.length - 1);
      chapterIdStr = chapterIdStr.length > 0 && chapterIdStr.substr(0, chapterIdStr.length - 1);
      let articleListResult = [];
      let chapterListResult = [];
      if (articleIdStr.length > 0) {
        const articleListSql = `SELECT id, title, author AS authorName, reprinted,
                            FROM_UNIXTIME(publish_time, '%Y-%m-%d %H:%i:%s') AS publishTime, is_publish AS isPublish,
                            introduce_img AS introduceImg, view_count AS viewCount
                            FROM article WHERE id in(${articleIdStr})  AND is_publish = 1 ORDER BY publish_time DESC `;
        articleListResult = await this.app.mysql.query(articleListSql);
        for (const item of articleListResult) {
          item.listType = 'article';
        }
      }
      if (chapterIdStr.length > 0) {
        const chapterListSql = `SELECT chapter.id as id, novel.id as novelId,
                            novel.name AS novelName, chapter.name as name, 
                            chapter.author AS author,chapter.summary as summary, 
                            chapter.view_count AS viewCount, chapter.updatetime AS publishTime 
                            FROM novel_chapter AS chapter
                            LEFT JOIN novel ON chapter.novel_id = novel.id
                            WHERE chapter.id in(${chapterIdStr}) ORDER BY updatetime DESC`;
        chapterListResult = await this.app.mysql.query(chapterListSql);
        for (const item of chapterListResult) {
          item.listType = 'novel';
        }
      }
      this.ctx.body = {
        success: true,
        data: {
          total,
          articleList: articleListResult,
          chapterList: chapterListResult,
        },
      };
    }
  }

}

module.exports = IndexController;
