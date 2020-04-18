'use strict';

const controller = require('egg').Controller;

class TalkController extends controller {
  async getTalkList() {
    const request = this.ctx.request.body;
    const sql = `SELECT 
                talk.id as id,
                user.username as username, 
                talk.content as content,
                talk.publish_time as publishTime,
                talk.like_count as likeCount
                FROM talk LEFT JOIN admin_user AS user ON talk.user_id = user.id
                LIMIT ?,?`;
    const sqlResult = await this.app.mysql.query(sql, [ request.offset, request.limit ]);
    const countSql = 'SELECT count(*) as total from talk';
    const countResult = await this.app.mysql.query(countSql);
    if (sqlResult.length > 0) {
      this.ctx.body = {
        success: true,
        data: {
          total: countResult[0].total,
          list: sqlResult,
        },
      };
    } else {
      this.ctx.body = { success: false, message: '暂无数据' };
    }
  }

  async getTalkById() {
    const id = this.ctx.params.id;
    const sql = 'SELECT * FROM talk WHERE id = ? ';
    const sqlResult = await this.app.mysql.query(sql, [ id ]);
    if (sqlResult.length > 0) {
      this.ctx.body = { success: true, data: sqlResult[0] };
    } else {
      this.ctx.body = { success: false, message: '获取数据失败' };
    }
  }

  async updateTalk() {
    const request = this.ctx.request.body;
    let sql = '';
    let sqlResult;
    if (request.id) {
      sql = 'UPDATE talk SET content = ?, publish_time = ? WHERE id = ? ';
      sqlResult = await this.app.mysql.query(sql, [ request.content, request.updateTime, request.id ]);
      if (sqlResult.affectedRows === 1) {
        this.ctx.body = { success: true, message: '数据更新成功' };
      } else {
        this.ctx.body = { success: false, message: '数据更新失败' };
      }
    } else {
      sql = 'INSERT INTO talk(content, createtime, publish_time, user_id) VALUES(?, ?, ?, ?)';
      sqlResult = await this.app.mysql.query(sql, [ request.content, request.createtime, request.updateTime, request.userId ]);
      if (sqlResult.affectedRows === 1) {
        this.ctx.body = { success: true, message: '数据新增成功' };
      } else {
        this.ctx.body = { success: false, message: '数据新增失败' };
      }
    }
  }

  async deleteTalkById() {
    const talkId = this.ctx.params.id;
    const res = await this.app.mysql.delete('talk', { id: talkId });
    if (res.affectedRows === 1) {
      this.ctx.body = { success: true, message: '删除成功' };
    } else {
      this.ctx.body = { success: false, message: '删除失败' };
    }
  }

}


module.exports = TalkController;
