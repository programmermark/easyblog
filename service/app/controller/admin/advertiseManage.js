'use strict';

const controller = require('egg').Controller;

class AdvertiseManageController extends controller {

  async getAdvertiseList() {
    const request = this.ctx.request.body;
    const selectSql = 'SELECT * FROM advertise LIMIT ?,?';
    const selectResult = await this.app.mysql.query(selectSql, [ request.offset, request.limit ]);
    if (selectResult.length > 0) {
      const countSql = 'SELECT count(*) as total from advertise';
      const countResult = await this.app.mysql.query(countSql);
      this.ctx.body = {
        success: true,
        data: {
          total: countResult[0].total,
          list: selectResult,
        } };
    } else {
      this.ctx.body = { success: false, message: '获取广告列表失败' };
    }
  }

  async addAdvertise() {
    const request = this.ctx.request.body;
    const insertSql = 'INSERT INTO advertise(img, imgurl, createtime, updatetime) VALUES(?,?,?,?)';
    const insertResult = await this.app.mysql.query(insertSql, [ request.img, request.adverLink, request.createTime, request.updateTime ]);
    if (insertResult.affectedRows === 1) {
      this.ctx.body = {
        success: true,
        data: {
          id: insertResult.insertId,
        },
        message: '新增广告成功',
      };
    } else {
      this.ctx.body = {
        success: false,
        message: '新增广告失败',
      };
    }
  }

  async updateAdvertise() {
    const request = this.ctx.request.body;
    const updateSql = 'UPDATE advertise set img = ?, imgurl = ?, updatetime = ? WHERE id = ?';
    const updateResult = await this.app.mysql.query(updateSql, [ request.img, request.adverLink, request.updateTime, request.id ]);
    if (updateResult.affectedRows === 1) {
      this.ctx.body = {
        success: true,
        message: '修改广告成功',
      };
    } else {
      this.ctx.body = {
        success: false,
        message: '修改广告失败',
      };
    }
  }

  async updateAdvertiseIsShow() {
    const request = this.ctx.request.body;
    const updateSql = 'UPDATE advertise set isshow = ? WHERE id = ?';
    const updateResult = await this.app.mysql.query(updateSql, [ request.isShow, request.id ]);
    if (updateResult.affectedRows === 1) {
      this.ctx.body = {
        success: true,
        message: '修改发布状态成功',
      };
    } else {
      this.ctx.body = {
        success: false,
        message: '修改发布状态失败',
      };
    }
  }

  async deleteAdvertiseById() {
    const advertiseId = this.ctx.params.id;
    const res = await this.app.mysql.delete('advertise', { id: advertiseId });
    if (res.affectedRows === 1) {
      this.ctx.body = { success: true, message: '删除成功' };
    } else {
      this.ctx.body = { success: false, message: '删除失败' };
    }

  }

}


module.exports = AdvertiseManageController;
