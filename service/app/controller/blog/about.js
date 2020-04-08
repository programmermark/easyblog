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
}

module.exports = AboutController;
