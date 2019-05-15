'use strict';
const nodemailer = require('nodemailer');
const nodemailer_API = Symbol('Application#nodemailer_API');

module.exports = {
  get email() {
    if (!this[nodemailer_API]) {
      const api = nodemailer.createTransport(this.config.email);
      this[nodemailer_API] = api;
    }
    return this[nodemailer_API];
  },
};
