'use strict';

const controller = require('egg').Controller;

class articleListController extends controller {
  async getArticleList() {
    const request = this.ctx.request.body;
    const sql = `SELECT article.id as id,
            article.title as title,
            article.introduce as introduce,
            article.introduce_img as introduceImg,
            article.author as author,
            article.reprinted as reprinted,
            FROM_UNIXTIME(article.publish_time, '%Y-%m-%d %H:%i:%s') as publishTime,
            article.view_count as viewCount,
            article.is_publish as isPublish,
            article_type.name as type
            FROM article LEFT JOIN  article_type
            ON article.type_id = article_type.id ORDER BY article.publish_time DESC LIMIT ?,?`;
    const results = await this.app.mysql.query(sql, [ request.offset, request.limit ]);
    if (results.length > 0) {
      const countResult = await this.app.mysql.query('SELECT count(*) as total FROM article');
      this.ctx.body = {
        success: true,
        data: {
          total: countResult[0].total,
          list: results,
        },
      };
    } else {
      this.ctx.body = {
        success: false,
        message: '获取文章列表失败',
      };
    }
  }

  async changePublishStatus() { // 改变文章发布状态
    const request = this.ctx.request.body;
    const sql = 'UPDATE article SET article.is_publish = ? WHERE article.id = ?';
    const result = await this.app.mysql.query(sql, [ request.isPublish, request.id ]);
    const updateSuccess = result.affectedRows === 1;
    if (updateSuccess) {
      this.ctx.body = {
        success: true,
        message: '更新发布状态成功',
      };
    } else {
      this.ctx.body = {
        success: false,
        message: '更新发布状态失败',
      };
    }
  }

  async delArticleById() {
    const articleId = this.ctx.params.id;
    const res = await this.app.mysql.delete('article', { id: articleId });
    if (res.affectedRows === 1) {
      this.ctx.body = { success: true, message: '删除文章成功' };
    } else {
      this.ctx.body = { success: false, message: '删除文章失败' };
    }
  }

  async getArticleById() {
    const id = this.ctx.params.id;
    if (id) {
      const sql = `SELECT article.id as id,
                article.title as title,
                article.introduce as introduce,
                article.introduce_img as introduceImg,
                article.content as content,
                FROM_UNIXTIME(article.publish_time, '%Y-%m-%d %H:%i:%s') as publishTime,
                article.view_count as viewCount,
                article.author as author,
                article.reprinted as reprinted,
                article.is_publish as isPublish,
                article_type.name as type,
                article_type.id as typeId
                FROM article LEFT JOIN  article_type
                ON article.type_id = article_type.id
                WHERE article.id = ?`;
      const sqlResult = await this.app.mysql.query(sql, [ id ]);
      if (sqlResult.length > 0) {
        this.ctx.body = {
          success: true,
          data: sqlResult[0],
        };
      } else {
        this.ctx.body = {
          success: false,
          message: '获取文章失败',
        };
      }
    } else {
      this.ctx.body = {
        success: false,
        message: '文章id不能为空',
      };
    }
  }
}

module.exports = articleListController;
