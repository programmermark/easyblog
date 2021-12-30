"use strict";

const controller = require("egg").Controller;

class CommentController extends controller {
  async visitorLogin() {
    const request = this.ctx.request.body;
    const checkSql =
      "SELECT id, nickname, portrait FROM visitor WHERE visitor.email = ?";
    const checkResults = await this.app.mysql.query(checkSql, [request.email]);
    if (checkResults.length > 0) {
      this.ctx.body = {
        success: true,
        data: {
          id: checkResults[0].id,
          portrait: checkResults[0].portrait,
          nickname: checkResults[0].nickname,
        },
      };
    } else {
      const sql = "INSERT INTO visitor(nickname, email, site) VALUES(?, ?, ?)";
      const results = await this.app.mysql.query(sql, [
        request.nickname,
        request.email,
        request.site,
      ]);
      if (results.affectedRows === 1) {
        this.ctx.body = {
          success: true,
          data: {
            id: results.insertId,
            portrait: "",
            nickname: request.nickname,
          },
        };
      } else {
        this.ctx.body = {
          success: false,
          message: "注册失败",
        };
      }
    }
  }

  async updatePortrait() {
    const request = this.ctx.request.body;
    const sql = "UPDATE visitor SET portrait = ? WHERE visitor.id = ?";
    const result = await this.app.mysql.query(sql, [
      request.portrait,
      request.id,
    ]);
    if (result.affectedRows === 1) {
      this.ctx.body = {
        success: true,
      };
    } else {
      this.ctx.body = {
        success: false,
      };
    }
  }

  async addComment() {
    const request = this.ctx.request.body;
    let sql = "";
    const valus = [
      request.visitorId,
      request.comment,
      request.publishTime,
      request.parentId,
    ];
    if (request.typeName === "talkId") {
      sql =
        "INSERT INTO visitor_comment(visitor_id, comment, publish_time, talk_id";
    } else if (request.typeName === "articleId") {
      sql =
        "INSERT INTO visitor_comment(visitor_id, comment, publish_time, article_id";
    } else if (request.typeName === "novelId") {
      sql =
        "INSERT INTO visitor_comment(visitor_id, comment, publish_time, novel_id";
    } else if (request.typeName === "aboutId") {
      sql =
        "INSERT INTO visitor_comment(visitor_id, comment, publish_time, adout_id";
    }
    if (request.beCommentId) {
      sql += ", be_comment_id ) VALUES (?, ?, ?, ?, ?)";
      valus.push(request.beCommentId);
    } else {
      sql += ") VALUES (?, ?, ?, ?)";
    }
    const result = await this.app.mysql.query(sql, valus);
    if (result.affectedRows === 1) {
      let selectSql = "";
      if (request.typeName === "talkId") {
        selectSql = `SELECT visitor_comment.id as id, visitor_comment.be_comment_id as beCommentId, 
          visitor_comment.comment as comment, visitor_comment.publish_time as publishTime, visitor_like.id as likeId, visitor_like.visitor_id as likeVisitorId,
          visitor.id as visitorId, visitor.nickname as nickname, visitor.portrait as  portrait, visitor.site as site
          FROM visitor_comment 
          LEFT JOIN visitor ON visitor_comment.visitor_id = visitor.id
          LEFT JOIN visitor_like ON visitor_comment.id = visitor_like.comment_id
          WHERE talk_id = ?  
          ORDER BY visitor_comment.publish_time DESC LIMIT ?,?`;
      } else if (request.typeName === "articleId") {
        selectSql = `SELECT visitor_comment.id as id, visitor_comment.be_comment_id as beCommentId, 
          visitor_comment.comment as comment, visitor_comment.publish_time as publishTime, visitor_like.id as likeId, visitor_like.visitor_id as likeVisitorId,
          visitor.id as visitorId, visitor.nickname as nickname, visitor.portrait as  portrait, visitor.site as site
          FROM visitor_comment 
          LEFT JOIN visitor ON visitor_comment.visitor_id = visitor.id
          LEFT JOIN visitor_like ON visitor_comment.id = visitor_like.comment_id
          WHERE article_id = ?  
          ORDER BY visitor_comment.publish_time DESC LIMIT ?,?`;
      } else if (request.typeName === "novelId") {
        selectSql = `SELECT visitor_comment.id as id, visitor_comment.be_comment_id as beCommentId, 
          visitor_comment.comment as comment, visitor_comment.publish_time as publishTime, visitor_like.id as likeId, visitor_like.visitor_id as likeVisitorId,
          visitor.id as visitorId, visitor.nickname as nickname, visitor.portrait as  portrait, visitor.site as site
          FROM visitor_comment 
          LEFT JOIN visitor ON visitor_comment.visitor_id = visitor.id
          LEFT JOIN visitor_like ON visitor_comment.id = visitor_like.comment_id
          WHERE novel_id = ?  
          ORDER BY visitor_comment.publish_time DESC LIMIT ?,?`;
      } else if (request.typeName === "aboutId") {
        selectSql = `SELECT visitor_comment.id as id, visitor_comment.be_comment_id as beCommentId, 
          visitor_comment.comment as comment, visitor_comment.publish_time as publishTime, visitor_like.id as likeId, visitor_like.visitor_id as likeVisitorId,
          visitor.id as visitorId, visitor.nickname as nickname, visitor.portrait as  portrait, visitor.site as site
          FROM visitor_comment 
          LEFT JOIN visitor ON visitor_comment.visitor_id = visitor.id
          LEFT JOIN visitor_like ON visitor_comment.id = visitor_like.comment_id
          WHERE about_id = ?  
          ORDER BY visitor_comment.publish_time DESC LIMIT ?,?`;
      }
      const selectResults = await this.app.mysql.query(selectSql, [
        request.parentId,
        request.offset,
        request.limit,
      ]);
      if (selectResults.length > 0) {
        /** 获取去重后的id列表 */
        const commentIds = [
          ...new Set(selectResults.map((result) => result.id)),
        ];
        const result = commentIds.map((id) => {
          const commentList = selectResults.filter(
            (result) => result.id === id
          );
          let commentLike = [];
          if (commentList.length > 0) {
            commentLike = commentList.map((item) => ({
              id: item.likeId,
              visitorId: item.likeVisitorId,
            }));
          }
          return {
            id: commentList[0].id,
            beCommentId: commentList[0].beCommentId,
            comment: commentList[0].comment,
            publishTime: commentList[0].publishTime,
            visitorId: commentList[0].visitorId,
            nickname: commentList[0].nickname,
            portrait: commentList[0].portrait,
            site: commentList[0].site,
            likeList: commentLike,
          };
        });
        this.ctx.body = {
          success: true,
          data: result,
          message: "发表评论成功",
        };
      } else {
        this.ctx.body = {
          success: false,
          message: "发表评论失败",
        };
      }
    }
  }

  async getComments() {
    const request = this.ctx.request.body;
    let selectSql = "";
    if (request.typeName === "talkId") {
      selectSql = `SELECT visitor_comment.id as id, visitor_comment.be_comment_id as beCommentId, 
          visitor_comment.comment as comment, visitor_comment.publish_time as publishTime, visitor_like.id as likeId, visitor_like.visitor_id as likeVisitorId,
          visitor.id as visitorId, visitor.nickname as nickname, visitor.portrait as  portrait, visitor.site as site
          FROM visitor_comment 
          LEFT JOIN visitor ON visitor_comment.visitor_id = visitor.id
          LEFT JOIN visitor_like ON visitor_comment.id = visitor_like.comment_id
          WHERE talk_id = ?  
          ORDER BY visitor_comment.publish_time DESC LIMIT ?,?`;
    } else if (request.typeName === "articleId") {
      selectSql = `SELECT visitor_comment.id as id, visitor_comment.be_comment_id as beCommentId, 
          visitor_comment.comment as comment, visitor_comment.publish_time as publishTime, visitor_like.id as likeId, visitor_like.visitor_id as likeVisitorId,
          visitor.id as visitorId, visitor.nickname as nickname, visitor.portrait as  portrait, visitor.site as site
          FROM visitor_comment 
          LEFT JOIN visitor ON visitor_comment.visitor_id = visitor.id
          LEFT JOIN visitor_like ON visitor_comment.id = visitor_like.comment_id
          WHERE article_id = ?  
          ORDER BY visitor_comment.publish_time DESC LIMIT ?,?`;
    } else if (request.typeName === "novelId") {
      selectSql = `SELECT visitor_comment.id as id, visitor_comment.be_comment_id as beCommentId, 
          visitor_comment.comment as comment, visitor_comment.publish_time as publishTime, visitor_like.id as likeId, visitor_like.visitor_id as likeVisitorId,
          visitor.id as visitorId, visitor.nickname as nickname, visitor.portrait as  portrait, visitor.site as site
          FROM visitor_comment 
          LEFT JOIN visitor ON visitor_comment.visitor_id = visitor.id
          LEFT JOIN visitor_like ON visitor_comment.id = visitor_like.comment_id
          WHERE novel_id = ?  
          ORDER BY visitor_comment.publish_time DESC LIMIT ?,?`;
    } else if (request.typeName === "aboutId") {
      selectSql = `SELECT visitor_comment.id as id, visitor_comment.be_comment_id as beCommentId, 
          visitor_comment.comment as comment, visitor_comment.publish_time as publishTime, visitor_like.id as likeId, visitor_like.visitor_id as likeVisitorId,
          visitor.id as visitorId, visitor.nickname as nickname, visitor.portrait as  portrait, visitor.site as site
          FROM visitor_comment 
          LEFT JOIN visitor ON visitor_comment.visitor_id = visitor.id
          LEFT JOIN visitor_like ON visitor_comment.id = visitor_like.comment_id
          WHERE about_id = ?  
          ORDER BY visitor_comment.publish_time DESC LIMIT ?,?`;
    }
    const selectResults = await this.app.mysql.query(selectSql, [
      request.parentId,
      request.offset,
      request.limit,
    ]);
    if (selectResults) {
      /** 获取去重后的id列表 */
      const commentIds = [...new Set(selectResults.map((result) => result.id))];
      const result = commentIds.map((id) => {
        const commentList = selectResults.filter((result) => result.id === id);
        let commentLike = [];
        if (commentList.length > 0) {
          commentLike = commentList.map((item) => ({
            id: item.likeId,
            visitorId: item.likeVisitorId,
          }));
        }
        return {
          id: commentList[0].id,
          beCommentId: commentList[0].beCommentId,
          comment: commentList[0].comment,
          publishTime: commentList[0].publishTime,
          visitorId: commentList[0].visitorId,
          nickname: commentList[0].nickname,
          portrait: commentList[0].portrait,
          site: commentList[0].site,
          likeList: commentLike,
        };
      });
      this.ctx.body = {
        success: true,
        data: result,
      };
    }
  }

  /**
   * 点赞评论或者取消点赞
   * isAdd: true: 点赞评论， false: 取消点赞
   * visitorId: 访客id
   * commentId: 评论id
   */
  async addLikeCount() {
    const request = this.ctx.request.body;
    const { isAdd, visitorId, commentId } = request;
    let sql = "";
    if (isAdd) {
      sql = "INSERT INTO visitor_like(visitor_id, comment_id) VALUES(?, ?)";
    } else {
      sql = "DELETE FROM visitor_like WHERE visitor_id = ? AND comment_id = ?";
    }
    const updateResult = await this.app.mysql.query(sql, [
      visitorId,
      commentId,
    ]);
    if (updateResult.affectedRows === 1) {
      this.ctx.body = {
        success: true,
      };
    } else {
      this.ctx.body = {
        success: false,
        data: "程序故障，点赞未生效",
      };
    }
  }
}

module.exports = CommentController;
