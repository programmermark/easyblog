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

  async getNovelList() {
    const request = this.ctx.request.body;
    const sql = 'SELECT * FROM novel LIMIT ?,?';
    const sqlResult = await this.app.mysql.query(sql, [ request.offset, request.limit ]);
    if (sqlResult.length > 0) {
      this.ctx.body = { success: true, data: sqlResult };
    } else {
      this.ctx.body = { success: false, message: '暂无数据' };
    }
  }

  async deleteNovelById() {
    const novelId = this.ctx.params.id;
    const chapterSql = 'SELECT id FROM novel WHERE novel_id = ?';
    const chapterResult = await this.app.mysql.query(chapterSql, [ novelId ]);
    if (chapterResult.length > 0) {
      let idStr = '';
      chapterResult.forEach(item => {
        idStr += item.id + ',';
      });
      idStr = idStr.substr(0, idStr.length - 1);
      const deleteChapterSql = 'DELETE FROM novel_chapter WHERE id IN (?)';
      const deleteChapterResult = await this.app.mysql.query(deleteChapterSql, idStr);
      console.log(deleteChapterResult);
      const deleteNovelSql = 'DELETE FROM novel WHERE id = ?';
      const deleteNovelResult = await this.app.mysql.query(deleteNovelSql, novelId);
      if (deleteNovelResult.affectedRows === 1) {
        this.ctx.body = { success: true, message: '删除小说成功' };
      } else {
        this.ctx.body = { success: false, message: '删除小说是啊比' };
      }
    } else {
      const deleteNovelSql = 'DELETE FROM novel WHERE id = ?';
      const deleteNovelResult = await this.app.mysql.query(deleteNovelSql, novelId);
      if (deleteNovelResult.affectedRows === 1) {
        this.ctx.body = { success: true, message: '删除小说成功' };
      } else {
        this.ctx.body = { success: false, message: '删除小说是啊比' };
      }
    }
  }

}

module.exports = NovelController;
