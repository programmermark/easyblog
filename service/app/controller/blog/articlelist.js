'use strict';

const controller = require('egg').Controller;
class ArticleListController extends controller {

  async getArticleList() {
    const request = this.ctx.request.body;
    let sql = '';
    let countSql = '';
    let result = '';
    let countResult = '';
    if (request.type === '全部') {
      sql = ` SELECT article.id as id, article.title as title, article.author as authorName,
              article.reprinted as reprinted, article.introduce as introduce, article.introduce_img as introduceImg,
              FROM_UNIXTIME(article.publish_time, '%Y-%m-%d %H:%i:%s') as publishTime, 
              article.view_count as viewCount, article_type.name as type
              FROM article LEFT JOIN article_type ON article.type_id = article_type.id
              WHERE article.is_publish = 1 ORDER BY article.publish_time DESC  LIMIT ?,?`;
      result = await this.app.mysql.query(sql, [ request.offset, request.limit ]);
      countSql = 'SELECT count(*) as total FROM article WHERE article.is_publish = 1';
      countResult = await this.app.mysql.query(countSql, request.type);
    } else if (request.type === '点击量') {
      sql = ` SELECT article.id as id, article.title as title, article.author as authorName,
              article.reprinted as reprinted, article.introduce as introduce, article.introduce_img as introduceImg,
              FROM_UNIXTIME(article.publish_time, '%Y-%m-%d %H:%i:%s') as publishTime, 
              article.view_count as viewCount, article_type.name as type
              FROM article LEFT JOIN article_type ON article.type_id = article_type.id
              WHERE article.is_publish = 1 ORDER BY article.view_count DESC LIMIT ?,?`;
      result = await this.app.mysql.query(sql, [ request.offset, request.limit ]);
      countSql = 'SELECT count(*) as total FROM article WHERE article.is_publish = 1';
      countResult = await this.app.mysql.query(countSql, request.type);
    } else {
      sql = ` SELECT article.id as id, article.title as title, article.author as authorName,
                article.reprinted as reprinted, article.introduce as introduce, article.introduce_img as introduceImg,
                FROM_UNIXTIME(article.publish_time, '%Y-%m-%d %H:%i:%s') as publishTime, 
                article.view_count as viewCount, article_type.name as type
                FROM article LEFT JOIN article_type ON article.type_id = article_type.id
                WHERE article.is_publish = 1 AND article_type.name = ? 
                ORDER BY article.publish_time DESC  LIMIT ?,?`;
      result = await this.app.mysql.query(sql, [ request.type, request.offset, request.limit ]);
      countSql = `SELECT count(*) as total FROM article 
                  LEFT JOIN article_type ON article.type_id = article_type.id
                  WHERE article.is_publish = 1 
                  AND article_type.name = ?`;
      countResult = await this.app.mysql.query(countSql, request.type);
    }
    if (result.length > 0) {
      this.ctx.body = {
        success: true,
        data: {
          total: countResult[0].total,
          list: result,
        },
      };
    } else {
      this.ctx.body = {
        success: true,
        message: '获取文章列表失败',
      };
    }
  }

  async getArticleTypes() { // 获取所有的文章类别
    const result = await this.app.mysql.select('article_type');
    if (result.length > 0) {
      this.ctx.body = { success: true, data: result };
    }
  }
}

module.exports = ArticleListController;
