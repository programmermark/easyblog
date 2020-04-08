'use strict';

const controller = require('egg').Controller;

class UserSettingController extends controller {

  async updateUserInfo() {
    const request = this.ctx.request.body;
    const updateSql = `UPDATE admin_user SET username = ?, portrait = ?, 
                      bg_img = ?, qq_account = ?, wechat_account = ?, github_url = ?,
                      logo_name = ?, logo_sub = ? WHERE id = ?`;
    const params = [ request.username, request.portrait, request.bgImg, request.qqAccount, request.weChatAccount, request.githubUrl, request.logoName, request.logoSub, request.id ];
    const updateResult = await this.app.mysql.query(updateSql, params);
    if (updateResult.affectedRows === 1) {
      const selectSql = `SELECT username as username, portrait as portrait, bg_img as bgImg,
                        qq_account as qqAccount, wechat_account as weChatAccount, github_url as githubUrl,
                        logo_name as logoName, logo_sub as logoSub
                        FROM admin_user WHERE id = ?`;
      const selectResult = await this.app.mysql.query(selectSql, [ request.id ]);
      if (selectResult.length > 0) {
        this.ctx.body = { success: true, data: selectResult[0], message: '更新个人信息成功' };
      } else {
        this.ctx.body = { success: false, message: '获取个人信息失败' };
      }
    } else {
      this.ctx.body = { success: false, message: '更新个人信息失败' };
    }
  }

  async getUserInfoById() {
    const id = this.ctx.params.id;
    const selectSql = `SELECT username as username, portrait as portrait, bg_img as bgImg,
                        qq_account as qqAccount, wechat_account as weChatAccount, github_url as githubUrl,
                        logo_name as logoName, logo_sub as logoSub
                        FROM admin_user WHERE id = ?`;
    const selectResult = await this.app.mysql.query(selectSql, [ id ]);
    if (selectResult.length > 0) {
      this.ctx.body = { success: true, data: selectResult[0] };
    } else {
      this.ctx.body = { success: false, message: '获取个人信息失败' };
    }
  }

}

module.exports = UserSettingController;
