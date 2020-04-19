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
    const countSql = 'SELECT count(*) as total from novel';
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

  async deleteNovelById() {
    const novelId = this.ctx.params.id;
    const chapterSql = 'SELECT id FROM novel_chapter WHERE novel_id = ?';
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
        this.ctx.body = { success: false, message: '删除小说失败' };
      }
    } else {
      const deleteNovelSql = 'DELETE FROM novel WHERE id = ?';
      const deleteNovelResult = await this.app.mysql.query(deleteNovelSql, novelId);
      if (deleteNovelResult.affectedRows === 1) {
        this.ctx.body = { success: true, message: '删除小说成功' };
      } else {
        this.ctx.body = { success: false, message: '删除小说失败' };
      }
    }
  }

  async getChapterList() {
    const request = this.ctx.request.body;
    const novelSql = 'SELECT * FROM novel WHERE id = ?';
    const novelResult = await this.app.mysql.query(novelSql, [ request.id ]);
    const selectSql = `SELECT * FROM novel_chapter
                WHERE novel_id = ? LIMIT ?,?`;
    const sqlResult = await this.app.mysql.query(selectSql, [ request.id, request.offset, request.limit ]);
    const countSql = 'SELECT count(*) as total from novel_chapter';
    const countResult = await this.app.mysql.query(countSql);
    if (sqlResult.length > 0) {
      this.ctx.body = {
        success: true,
        data: {
          novel: novelResult[0],
          total: countResult[0].total,
          list: sqlResult,
        },
      };
    } else {
      this.ctx.body = { success: false, message: '暂无数据' };
    }
  }

  async getChapterById() {
    const id = this.ctx.params.id;
    const sql = 'SELECT * FROM novel_chapter WHERE id = ?';
    const result = await this.app.mysql.query(sql, [ id ]);
    if (result.length > 0) {
      this.ctx.body = {
        success: true,
        data: result[0],
      };
    } else {
      this.ctx.body = { success: false, message: '暂无数据' };
    }
  }

  async addChapter() {
    const request = this.ctx.request.body;
    if (request.chapterId) {
      const sql = `UPDATE novel_chapter SET novel_id = ?, name = ?, author = ?,
                  content = ?, updatetime = ?, summary = ? WHERE id = ?`;
      const params = [ request.novelId, request.name, request.author, request.content, request.updateTime, request.summary, request.chapterId ];
      const result = await this.app.mysql.query(sql, params);
      if (result.affectedRows === 1) {
        this.ctx.body = {
          success: true,
          message: '更新章节成功',
        };
      } else {
        this.ctx.body = {
          success: false,
          message: '更新章节失败',
        };
      }
    } else {
      const sql = `INSERT INTO novel_chapter(novel_id, name, author, content, 
                  createtime, updatetime, summary) VALUES(?,?,?,?,?,?,?)`;
      const params = [ request.novelId, request.name, request.author, request.content, request.updateTime, request.updateTime, request.summary ];
      const result = await this.app.mysql.query(sql, params);
      if (result.affectedRows === 1) {
        this.ctx.body = {
          success: true,
          message: '新增章节成功',
        };
      } else {
        this.ctx.body = {
          success: false,
          message: '新增章节失败',
        };
      }
    }
  }

  async deleteChapterById() {
    const id = this.ctx.params.id;
    const sql = 'DELETE FROM novel_chapter WHERE id = ?';
    const result = await this.app.mysql.query(sql, [ id ]);
    if (result.affectedRows === 1) {
      this.ctx.body = {
        success: true,
        message: '删除章节成功',
      };
    } else {
      this.ctx.body = { success: false, message: '删除章节失败' };
    }
  }


}

module.exports = NovelController;
