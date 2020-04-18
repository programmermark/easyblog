'use strict';

const controller = require('egg').Controller;

class NovelController extends controller {
  async addNovel() {
    const request = this.ctx.request.body;
    const sql = `INSERT INTO novel(name, author, cover_img, summary, createtime, updatetime)
                VALUES(?, ?, ?, ?, ?, ?)`;
    const params = [ request.name, request.author, request.coverImg, request.summary, request.createTime, request.createTime ];
    const sqlResult = await this.app.mysql.query(sql, params);
    if (sqlResult.affectedRows === 1) {
      this.ctx.body = { success: true, message: '新增小说成功' };
    } else {
      this.ctx.body = { success: false, message: '新增小说失败' };
    }
  }

  async updateNovel() {
    const request = this.ctx.request.body;
    const sql = `UPDATE novel SET name = ?, author = ?, 
                cover_img = ?, summary = ?,  updatetime = ?
                WHERE id = ?`;
    const params = [ request.name, request.author, request.coverImg, request.summary, request.updateTime, request.id ];
    const sqlResult = await this.app.mysql.query(sql, params);
    if (sqlResult.affectedRows === 1) {
      this.ctx.body = { success: true, message: '更新小说成功' };
    } else {
      this.ctx.body = { success: false, message: '更新小说失败' };
    }
  }

  async getNovelById() {
    const novelId = this.ctx.params.id;
    const sql = 'SELECT * FROM novel WHERE novel.id = ?';
    const sqlResult = await this.app.mysql.query(sql, [ novelId ]);
    if (sqlResult.length > 0) {
      this.ctx.body = { success: true, data: sqlResult[0] };
    } else {
      this.ctx.body = { success: false, message: '该小说不存在' };
    }
  }

}

module.exports = NovelController;
