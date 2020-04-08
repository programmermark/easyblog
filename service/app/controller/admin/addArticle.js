'use strict';

const controller = require('egg').Controller;

class AddArticleController extends controller {

  async addArticleType() {
    const body = this.ctx.request.body;
    const typeName = body.type;
    const insertSql = 'INSERT INTO article_type ( name ) VALUE ( ? )';
    const insertResult = await this.app.mysql.query(insertSql, [ typeName ]);
    if (insertResult.affectedRows === 1) {
      const types = await this.app.mysql.select('article_type');
      if (types.length > 0) {
        this.ctx.body = { success: true, data: types };
      } else {
        this.ctx.body = { success: false, message: '获取文章类别失败' };
      }
    } else {
      this.ctx.body = { success: false, message: '添加文章类别失败' };
    }
  }

  async getTypeInfo() {
    const types = await this.app.mysql.select('article_type');
    if (types.length > 0) {
      this.ctx.body = {
        data: types,
        success: true,
      };
    } else {
      this.ctx.body = {
        message: '获取文章类别失败',
        success: false,
      };
    }
  }

  async addArticle() {
    const tmpArticle = this.ctx.request.body;
    const result = await this.app.mysql.insert('article', tmpArticle);
    const insertSuccess = result.affectedRows === 1;
    const insertId = result.insertId;
    if (insertSuccess) {
      this.ctx.body = {
        success: insertSuccess,
        data: {
          id: insertId,
        },
        message: '发布文章成功',
      };
    } else {
      this.ctx.body = {
        success: insertSuccess,
        message: '发布文章失败',
      };
    }
  }

  async updateArticle() {
    const tmpArticle = this.ctx.request.body;
    const result = await this.app.mysql.update('article', tmpArticle);
    const updateSuccess = result.affectedRows === 1;
    if (updateSuccess) {
      this.ctx.body = {
        success: updateSuccess,
        message: '更新文章成功',
      };
    } else {
      this.ctx.body = {
        success: updateSuccess,
        message: '更新文章失败',
      };
    }
  }
}

module.exports = AddArticleController;
