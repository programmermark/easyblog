'use strict';

const controller = require('egg').Controller;
class ArticleDetailController extends controller {
  async getArticleDetailById() {
    const id = this.ctx.params.id;
    const sql = `SELECT 
                article.id as id,
                article.title as title,
                article.author as authorName,
                article.reprinted as reprinted,
                article.publish_time as publishTime,
                article.introduce as introduce,
                article.introduce_img as introduceImg
                article.content as content,
                article.view_count as viewCount,
                type.name as type
                FROM article 
                LEFT JOIN article_type as type
                ON article.type_id = type.id
                WHERE article.id = ? AND article.is_publish = 1`;
    const result = await this.app.mysql.query(sql, [ id ]);
    if (result.length > 0) {
      this.ctx.body = {
        success: true,
        data: result[0],
      };
    } else {
      this.ctx.body = {
        success: false,
        message: '获取文章详情失败',
      };
    }
  }
}

module.exports = ArticleDetailController;
