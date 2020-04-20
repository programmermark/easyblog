'use strict';

const controller = require('egg').Controller;

class ChapterController extends controller {

  async getNovelById() {
    const id = this.ctx.params.id;
    const sql = `SELECT novel.id as novelId, novel.name as novelName, novel.author as author, 
                novel.cover_img as novelCoverImg, novel.summary as novelSummary, novel.createtime as novelCreateTime,
                chapter.id as chapterId, chapter.name as chapterName   
                FROM novel_chapter as chapter 
                RIGHT JOIN novel ON chapter.novel_id = novel.id
                WHERE chapter.novel_id = ? ORDER BY chapter.createtime ASC`;
    const result = await this.app.mysql.query(sql, [ id ]);
    if (result.length > 0) {
      this.ctx.body = {
        success: true,
        data: result,
      };
    } else {
      this.ctx.body = {
        success: false,
        message: '获取小说详情失败',
      };
    }
  }

  async getChapterListById() {
    const id = this.ctx.params.id;
    const sql = `SELECT id, name
                FROM novel_chapter
                WHERE novel_id = ? ORDER BY chapter.createtime ASC`;
    const result = await this.app.mysql.query(sql, [ id ]);
    if (result.length > 0) {
      this.ctx.body = {
        success: true,
        data: result,
      };
    } else {
      this.ctx.body = {
        success: false,
        message: '获取小说列表失败',
      };
    }
  }

  async getChapterById() {
    const id = this.ctx.params.id;
    const sql = `SELECT 
                chapter.id as id,
                chapter.name as title,
                chapter.author as authorName,
                chapter.createtime as createTime,
                chapter.updatetime as updateTime,
                chapter.summary as summary,
                chapter.content as content,
                chapter.view_count as viewCount,
                novel.name as novelName,
                novel.id as novelId
                FROM novel_chapter as chapter 
                LEFT JOIN novel 
                ON chapter.novel_id = novel.id
                WHERE chapter.id = ?`;
    const sqlResult = await this.app.mysql.query(sql, [ id ]);
    if (sqlResult.length > 0) {
      const result = sqlResult[0];
      const nextSql = `SELECT id, createtime FROM novel_chapter WHERE createtime 
                  in((SELECT max(createtime) FROM novel_chapter WHERE createtime< ?), 
                  (SELECT min(createtime) FROM novel_chapter WHERE createtime> ?))`;
      const nextResult = await this.app.mysql.query(nextSql, [ result.createTime, result.createTime ]);
      if (nextResult.length === 2) {
        result.preId = nextResult[0].id;
        result.nextId = nextResult[1].id;
      } else if (nextResult.length === 1) {
        nextResult[0].createTime > result.createTime ?
          result.nextId = nextResult[0].id :
          result.preId = nextResult[0].id;
      }
      this.ctx.body = {
        success: true,
        data: result,
      };
    } else {
      this.ctx.body = {
        success: false,
        message: '获取章节详情失败',
      };
    }
  }
}

module.exports = ChapterController;
