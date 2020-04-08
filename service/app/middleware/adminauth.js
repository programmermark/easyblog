'use strict';

module.exports = () => {
  const adminauth = async (ctx, next) => {
    if (ctx.session.openId) {
      await next();
    } else {
      ctx.body = {
        success: false,
        unlogin: true,
        message: '登陆已失效，请重新登陆',
      };
    }
  };
  return adminauth;
};
