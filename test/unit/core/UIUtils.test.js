const { expect, sinon } = require('test/chai-sinon');
const { events } = require('app/core/events');
const proxyquire = require('proxyquire');

describe('UIUtils.js', () => {
  describe('showProgressBar()', () => {
    let req = null, res = null, next = null, logger = null, UIUtils = null;

    before(() => {
      req = {};
      res = { locals: { appeal: { status: events.DWP_RESPOND.name } } };

      next = sinon.spy();
      logger = { error: sinon.spy() };

      UIUtils = proxyquire('app/core/UIUtils', {
        '@hmcts/nodejs-logging': {
          Logger: {
            getLogger: () => {
              return logger;
            }
          }
        }
      });
    });

    it('should show the progress bar', () => {
      UIUtils.showProgressBar(req, res, next);
      expect(res.locals.appeal.showProgressBar).to.eq(true);
      return expect(next).to.have.been.called;
    });

    it('should hide the progress bar', () => {
      res.locals.appeal.status = events.CLOSED.name;
      UIUtils.showProgressBar(req, res, next);
      expect(res.locals.appeal.showProgressBar).to.eq(false);
      return expect(next).to.have.been.called;
    });

    it('should log when unable to map a status to an event', () => {
      res.locals.appeal.status = 'unknown';
      UIUtils.showProgressBar(req, res, next);
      expect(logger.error).to.have.been.calledWith('Unable to map the status unknown to an event:');
      return expect(next).to.have.been.called;
    });

    it('should log when the appeal is undefined', () => {
      res.locals.appeal = null;
      UIUtils.showProgressBar(req, res, next);
      expect(logger.error).to.have.been.calledWith('Undefined appeal');
      return expect(next).to.have.been.called;
    });
  });
});
