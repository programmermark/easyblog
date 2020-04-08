'use strict';

const controller = require('egg').Controller;

class AboutController extends controller {
  async getAbout() {
    const sql = 'SELECT * FROM aboutme';
    const sqlResult = await this.app.mysql.query(sql);
    if (sqlResult.length > 0) {
      this.ctx.body = { success: true, data: sqlResult[0] };
    } else {
      this.ctx.body = { success: false, message: '获取数据失败' };
    }
  }

  async updateAbout() {
    const request = this.ctx.request.body;
    const sql = 'UPDATE aboutme SET content = ?, updatetime = ? WHERE id = ? ';
    const sqlResult = await this.app.mysql.query(sql, [ request.content, request.updateTime, request.id ]);
    if (sqlResult.affectedRows === 1) {
      this.ctx.body = { success: true, message: '数据更新成功' };
    } else {
      this.ctx.body = { success: false, message: '数据更新失败' };
    }
  }

}


module.exports = AboutController;
