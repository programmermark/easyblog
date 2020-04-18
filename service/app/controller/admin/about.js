'use strict';

const controller = require('egg').Controller;

class AboutController extends controller {
  async getAbout() {
    const sql = 'SELECT * FROM aboutme';
    const sqlResult = await this.app.mysql.query(sql);
    if (sqlResult.length > 0) {
      this.ctx.body = { success: true, data: sqlResult[0] };
    }
  }

  async updateAbout() {
    const request = this.ctx.request.body;
    let sql = '';
    let sqlResult;
    if (request.id) {
      sql = 'UPDATE aboutme SET content = ?, updatetime = ? WHERE id = ? ';
      sqlResult = await this.app.mysql.query(sql, [ request.content, request.updateTime, request.id ]);
      if (sqlResult.affectedRows === 1) {
        this.ctx.body = { success: true, message: '数据更新成功' };
      } else {
        this.ctx.body = { success: false, message: '数据更新失败' };
      }
    } else {
      sql = 'INSERT INTO aboutme(content, createtime, updatetime) VALUES(?, ?, ?)';
      sqlResult = await this.app.mysql.query(sql, [ request.content, request.updateTime, request.updateTime ]);
      if (sqlResult.affectedRows === 1) {
        this.ctx.body = { success: true, message: '数据新增成功' };
      } else {
        this.ctx.body = { success: false, message: '数据新增失败' };
      }
    }
  }

}


module.exports = AboutController;
