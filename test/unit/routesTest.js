const application = require('app');
const request = require('supertest');
const {expect} = require('test/chai-sinon');

describe('Node.js application/server', () => {


  describe('the application after initialisation', function () {

    let app;

    beforeEach(function () {
      app = application();
    });

    afterEach(() => {
      app.srv.close();
    });

    describe('making application route requests which result in a HTTP 200', () => {

      it('should respond to /progress/md100/abouthearing route with a HTTP 200:OK', function (done) {
        request(app.exp)
          .get('/progress/md100/abouthearing')
          .expect(200, done);
      });

      it('should respond to /progress/md100/expenses route with a HTTP 200:OK', function (done) {
        request(app.exp)
          .get('/progress/md100/expenses')
          .expect(200, done);
      });

      it('should respond to /progress/md400/hearingdetails route with a HTTP 200:OK', function (done) {
        request(app.exp)
          .get('/progress/md400/hearingdetails')
          .expect(200, done);
      });

      it('should respond to /progress/md100/evidence route with a HTTP 200:OK', function (done) {
        request(app.exp)
          .get('/progress/md100/evidence')
          .expect(200, done);
      });

      it('should respond to /progress/md100/trackyourappeal route with a HTTP 200:OK', function (done) {
        request(app.exp)
          .get('/progress/md100/trackyourappeal')
          .expect(200, done);
      });

      it('should respond to the /status route with a HTTP 200:OK', function (done) {
        request(app.exp)
          .get('/status')
          .expect('Content-Type', /json/)
          .expect(200, done);
      });

    });

    describe('making email notifications route requests which result in a HTTP 200', () => {

      it('should respond to the /manage-email-notifications/:mactoken route', function (done) {
        request(app.exp)
          .get('/manage-email-notifications/NnwxNDg3MDY1ODI4fDExN3BsSDdrVDc=')
          .expect(200, done);
      });

      it('should respond to the /manage-email-notifications route when posting "changeEmailAddress" ', function (done) {
        request(app.exp)
          .post('/manage-email-notifications/NnwxNDg3MDY1ODI4fDExN3BsSDdrVDc=')
          .send({'emailNotify': 'changeEmailAddress'})
          .expect(200, done);
      });

      it('should respond to the /manage-email-notifications route when posting "stopEmails" ', function (done) {
        request(app.exp)
          .post('/manage-email-notifications/NnwxNDg3MDY1ODI4fDExN3BsSDdrVDc=')
          .send({'emailNotify': 'stopEmails'})
          .expect(200, done);
      });

      it('should respond to the /manage-email-notifications/token/stop route', function (done) {
        request(app.exp)
          .get('/manage-email-notifications/NnwxNDg3MDY1ODI4fDExN3BsSDdrVDc=/stop')
          .expect(200, done);
      });

      it('should respond to the /manage-email-notifications/token/change route', function (done) {
        request(app.exp)
          .post('/manage-email-notifications/NnwxNDg3MDY1ODI4fDExN3BsSDdrVDc=/change')
          .send({'email': 'person@example.com', 'email2': 'person@example.com'})
          .expect(200, done);
      });
    });

    describe('making email notifications route requests which result in an HTTP 400', () => {
      [
        {path: '/manage-email-notifications/invalid', method: 'get'},
        {path: '/manage-email-notifications/invalid', method: 'post', data: {
          'emailNotify': 'changeEmailAddress'
        }},
        {path: '/manage-email-notifications/invalid/stop', method: 'get'},
        {path: '/manage-email-notifications/invalid/change', method: 'post', data: {
          'email': 'person@example.com', 'email2': 'person@example.com'
        }},
      ].forEach((value) => {
        it('should respond to the ' + value.path + ' route when given an invalid token', function (done) {
          let call = request(app.exp)[value.method](value.path)
          if (value.data) {
            call = call.send(value.data);
          }
          call.expect(400, done);
        });
      });

      it('should respond to the /manage-email-notifications/token/change route when both emails are empty', (done) => {
        request(app.exp)
        .post('/manage-email-notifications/NnwxNDg3MDY1ODI4fDExN3BsSDdrVDc=/change')
        .send({'email': '', 'email2': ''})
        .expect(400, done);
      });


      it('should respond to the /manage-email-notifications-change route when given mismatched emails', (done) => {
        request(app.exp)
          .post('/manage-email-notifications/NnwxNDg3MDY1ODI4fDExN3BsSDdrVDc=/change')
          .send({'email': 'person@example.com', 'email2': 'other@example.com'})
          .expect(400, done);
      });

    });

    describe('making application route requests which result in a HTTP 404', () => {

      it('should respond to / route with a HTTP 404:Not found', function (done) {
        request(app.exp)
          .get('/')
          .expect(404, done);
      });

      it('should respond to an unknown route with a HTTP 404:Not found', function (done) {
        request(app.exp)
          .get('/foo')
          .expect(404, done);
      });

      it('should respond to an unknown id with a HTTP 404:Not found', function (done) {
        request(app.exp)
          .get('/progress/999/trackyourappeal')
          .expect(404, done)
      });

    });

  });

});
