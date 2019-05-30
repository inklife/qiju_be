'use strict';

const crypto = require('crypto');
const Service = require('egg').Service;

class UserService extends Service {
  // 返回 -1/1，表示登录 失败/成功
  async login({ email, phone, password }) {
    let user_info;
    if (email) {
      user_info = await this.app.mysql.get('user_info', { email });
    } else if (phone) {
      user_info = await this.app.mysql.query(
        'select * from user_info where phone=? ORDER BY create_time asc LIMIT 1',
        phone
      );
      if (Array.isArray(user_info)) {
        user_info = user_info[0];
      }
    }
    if (!user_info) {
      this.logger.info(`登录失败 - 未找到用户|${email}|${phone}`);
      return { code: -1 };
    }
    password = crypto
      .createHmac('sha256', user_info.salt.toString())
      .update(password.toString())
      .digest('hex');
    if (password === user_info.password) {
      this.logger.info(user_info);
      return { code: 1, user_id: user_info.user_id };
    }
    this.logger.info(`登录失败 - 密码不正确|${email}|${phone}`);
    return { code: -1 };
  }

  async getUserInfo({ user_id }) {
    const user = await this.app.mysql.get('user_info', { user_id });
    return user;
  }

  async register(
    // eslint-disable-next-line no-unused-vars
    user_id,
    password,
    salt,
    email,
    phone,
    gender,
    region
  ) {
    password = crypto
      .createHmac('sha256', salt.toString())
      .update(password.toString())
      .digest('hex');
    return await this.app.mysql.insert('user_info', {
      user_id,
      password,
      salt,
      email,
      phone,
      gender,
      region,
    });
  }

  async checkUserDuplicate({ email }) {
    const user = await this.app.mysql.get('user_info', { email });
    return !!user;
  }
  // 更新用户资料
  async updateUserPage(user_id, { user_image, user_name, gender, region }) {
    const options = {
      where: { user_id },
    };
    const result = await this.app.mysql.update(
      'user_info',
      {
        user_image,
        user_name,
        gender,
        region,
      },
      options
    ); // 更新 posts 表中的记录
    return result.affectedRows === 1;
  }
  // 邮箱重置密码
  async resetPassword(email, password) {
    const salt = this.ctx.helper.random(6);
    password = crypto
      .createHmac('sha256', salt.toString())
      .update(password.toString())
      .digest('hex');
    return await this.app.mysql.query(
      'UPDATE user_info SET password=? , salt=? WHERE email=?;',
      [ password, salt, email ]
    );
  }
}

module.exports = UserService;
