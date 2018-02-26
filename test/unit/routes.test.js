const HttpStatus = require('http-status-codes');
const app = require('app');
const request = require('supertest');

describe('routes.js', () => {

  describe('making application route requests which result in a HTTP 200', () => {

    let url;

    it('should respond to /progress/md002/abouthearing', (done) => {
      url = '/progress/md002/abouthearing';
      request(app)
        .get(url)
        .expect('Location', '/validate-surname/md002')
        .expect(HttpStatus.MOVED_TEMPORARILY, done);
    });

    it('should respond to /progress/md002/expenses', (done) => {
      url = '/progress/md002/expenses';
      request(app)
        .get(url)
        .expect('Location', '/validate-surname/md002')
        .expect(HttpStatus.MOVED_TEMPORARILY, done);
    });

    it('should respond to /progress/md007/hearingdetails', (done) => {
      url = '/progress/md007/hearingdetails';
      request(app)
        .get(url)
        .expect('Location', '/validate-surname/md007')
        .expect(HttpStatus.MOVED_TEMPORARILY, done);
    });

    it('should respond to /progress/md007/hearingdetails/10', (done) => {
      url = '/progress/md007/hearingdetails/10';
      request(app)
        .get(url)
        .expect('Location', '/validate-surname/md007')
        .expect(HttpStatus.MOVED_TEMPORARILY, done);
    });

    it('should respond to /progress/md002/evidence', (done) => {
      url = '/progress/md002/evidence';
      request(app)
        .get(url)
        .expect('Location', '/validate-surname/md002')
        .expect(HttpStatus.MOVED_TEMPORARILY, done);
    });

    it('should respond to /progress/md002/trackyourappeal', (done) => {
      url = '/progress/md002/trackyourappeal';
      request(app)
        .get(url)
        .expect('Location', '/validate-surname/md002')
        .expect(HttpStatus.MOVED_TEMPORARILY, done);
    });

    it('should respond to /progress/md002/contactus', (done) => {
      url = '/progress/md002/contactus';
      request(app)
        .get(url)
        .expect('Location', '/validate-surname/md002')
        .expect(HttpStatus.MOVED_TEMPORARILY, done);
    });

    it('should respond to /cookiepolicy', (done) => {
      request(app)
        .get('/cookiepolicy')
        .expect(HttpStatus.OK, done);
    });

    it('should respond to /robots.txt', (done) => {
      request(app)
        .get('/robots.txt')
        .expect('Content-Type', 'text/plain; charset=utf-8')
        .expect('User-agent: *\nDisallow: /')
        .expect(HttpStatus.OK, done);
    });

  });

  describe('/manage-email-notifications/mactoken', () => {

    const url = '/manage-email-notifications/NnwxNDg3MDY1ODI4fDExN3BsSDdrVDc=';

    it('should respond with a HTTP 200 when performing a GET', (done) => {
      request(app)
        .get(url)
        .expect(HttpStatus.OK, done);
    });

    it('should respond with a HTTP 302 when POSTing \'changeEmail\'', (done) => {
      request(app)
        .post(url)
        .send({'type': 'changeEmail'})
        .expect('Location', `${url}/change`)
        .expect(HttpStatus.MOVED_TEMPORARILY, done);
    });

    it('should respond with a HTTP 302 when POSTing \'stopEmail\'', (done) => {
      request(app)
        .post(url)
        .send({'type': 'stopEmail'})
        .expect('Location', `${url}/stop`)
        .expect(HttpStatus.MOVED_TEMPORARILY, done);
    });

    it('should respond with a HTTP 400 when POSTing an \'unknown\' type', (done) => {
      request(app)
        .post(url)
        .send({'type': 'unknown'})
        .expect(HttpStatus.BAD_REQUEST, done);
    });

  });

  describe('/manage-email-notifications/mactoken/stop', () => {

    it('should respond with a HTTP 200 when performing a GET', (done) => {
      request(app)
        .get('/manage-email-notifications/NnwxNDg3MDY1ODI4fDExN3BsSDdrVDc=/stop')
        .expect(HttpStatus.OK, done);
    });

  });

  describe('/manage-email-notifications/mactoken/stopconfirm', () => {

    it('should respond with a HTTP 200 when performing a GET', (done) => {
      request(app)
        .get('/manage-email-notifications/NnwxNDg3MDY1ODI4fDExN3BsSDdrVDc=/stopconfirm')
        .expect(HttpStatus.OK, done);
    });

  });

  describe('/manage-email-notifications/mactoken/change', () => {

    const url = '/manage-email-notifications/NnwxNDg3MDY1ODI4fDExN3BsSDdrVDc=/change';

    it('should respond with a HTTP 200 when performing a GET', (done) => {
      request(app)
        .get(url)
        .expect(HttpStatus.OK, done);
    });

    it('should respond with a HTTP 200 when POSTing both email addresses', (done) => {
      request(app)
        .post(url)
        .send({'email': 'person@example.com', 'confirmEmail': 'person@example.com'})
        .expect(HttpStatus.OK, done);
    });

    it('should respond with a HTTP 400 when POSTing empty strings as email addresses', (done) => {
      request(app)
        .post(url)
        .send({'email': '', 'confirmEmail': ''})
        .expect(HttpStatus.BAD_REQUEST, done);
    });

    it('should respond with a HTTP 400 when POSTing non email addresses', (done) => {
      request(app)
        .post(url)
        .send({'email': 'rubb@ish', 'confirmEmail': 'rubb@ish'})
        .expect(HttpStatus.BAD_REQUEST, done);
    });

    it('should respond with a HTTP 400 when POSTing email address that do not match', (done) => {
      request(app)
        .post(url)
        .send({'email': 'person@example.com', 'confirmEmail': 'person@example.net'})
        .expect(HttpStatus.BAD_REQUEST, done);
    });

  });

  describe('making application route requests which result in a HTTP 404', () => {

    it('should respond to / route with a HTTP 404:Not found', (done) => {
      request(app)
        .get('/')
        .expect(HttpStatus.NOT_FOUND, done);
    });

    it('should respond to an unknown route with a HTTP 404:Not found', (done) => {
      request(app)
        .get('/foo')
        .expect(HttpStatus.NOT_FOUND, done);
    });

    it('should respond to an unknown id with a HTTP 404:Not found', (done) => {
      request(app)
        .get('/progress/999/trackyourappeal')
        .expect(HttpStatus.MOVED_TEMPORARILY, done);
    });

  });

});