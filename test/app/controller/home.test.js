'use strict';

const { app, assert } = require('egg-mock/bootstrap');

describe('test/app/controller/home.test.js', () => {

  it('should assert', function* () {
    const pkg = require('../../../package.json');
    assert(app.config.keys.startsWith(pkg.name));

    // const ctx = app.mockContext({});
    // yield ctx.service.xx();
  });

  it('should GET /', () => {
    return app.httpRequest()
      .get('/qiju')
      .expect('Hi, ThinkPHP is now in ' + app.config.env + ' mode. —— 2019年04月15日11:40:58。')
      .expect(200);
  });

  // it('should Redirect Auth/View', async () => {
  //   const { config } = app;
  //   const view = config.qiju.host + '/view';
  //   const auth = config.qiju.host + `/qiju/${config.apiLevel}/api/auth?redirect=${encodeURIComponent(view)}`;
  //   let result = await app.httpRequest()
  //     .get('/qiju/home')
  //     .expect(302);
  //   assert(result.header.location === auth);
  //   app.mockSession({ openid: 'test' });
  //   result = await app.httpRequest()
  //     .get('/qiju/home')
  //     .expect(302);
  //   assert(result.header.location === view);
  // });

});
