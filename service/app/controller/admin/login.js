'use strict';

const controller = require('egg').Controller;
const md5 = require('js-md5');

class LoginController extends controller {

  async checkRegister() {
    const body = this.ctx.request.body;
    const username = body.username;
    const account = body.account;
    const password = body.password;
    const registerTime = body.registerTime;
    const checkSql = 'SELECT id, account FROM admin_user as user where user.account = ?';
    const checkResult = await this.app.mysql.query(checkSql, [ account ]);
    if (checkResult.length === 0) {
      const sql = `INSERT INTO admin_user ( username, account, password, register_time ) 
        VALUES ( ?, ?, ?, ? )`;
      const registerResult = await this.app.mysql.query(sql, [ username, account, md5(password), registerTime ]);
      if (registerResult.affectedRows === 1) {
        this.ctx.body = { success: true, message: '注册成功' };
      } else {
        this.ctx.body = { success: false, message: '注册失败' };
      }
    } else {
      this.ctx.body = { success: false, message: '手机号已被注册' };
    }
  }

  async checkLogin() {
    const body = this.ctx.request.body;
    const account = body.account;
    const password = body.password;
    const checkSql = `SELECT id, username from admin_user AS user WHERE 
                user.account = ? AND user.password = ?`;
    const checkResult = await this.app.mysql.query(checkSql, [ account, md5(password) ]);
    if (checkResult.length > 0) {
      const timeNow = Date.now().toString();
      const updateSql = `UPDATE admin_user AS user SET user.login_time = 
                ? WHERE user.account = 
                ? AND user.password = ? `;
      const updateResult = await this.app.mysql.query(updateSql, [ timeNow.substr(0, 10), account, md5(password) ]);
      if (updateResult.affectedRows === 1) {
        this.ctx.session.openId = { openId: timeNow };
        this.ctx.body = {
          success: true,
          message: '登陆成功',
          data: {
            openId: timeNow,
            id: checkResult[0].id,
            username: checkResult[0].username,
          },
        };
      } else {
        this.ctx.body = { success: false, message: '登陆失败' };
      }
    } else {
      this.ctx.body = { success: false, message: '登陆失败' };
    }
  }
}

module.exports = LoginController;
