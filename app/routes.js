const _ = require('lodash');
const ServiceLoader = require('app/services/ServiceLoader');
const AppealsService = ServiceLoader.instance().load(ServiceLoader.appeals);
const HealthService = ServiceLoader.instance().load(ServiceLoader.health);
const locale = require('app/assets/locale/en');
const express = require('express');
const router = express.Router();
const rootPath = '/progress';

router.use((req, res, next) => {

  if(_.startsWith(req.url, rootPath)) {
    let id = req.url.split('/')[2];
    //console.log(`GET:/appeals/${id} : PATH:${req.url}`);
    AppealsService.status(id).then((appeal) => {
      res.locals.appeal = appeal;
      next();
    }).catch((error) => {
      next(error);
    })
  } else {
    next();
  }

});

router.get(`${rootPath}/:id/abouthearing`, (req, res) => {
  res.render('about-hearing', Object.assign({i18n: locale}, {data: res.locals.appeal}));
});

router.get(`${rootPath}/:id/trackyourappeal`, (req, res) => {
  res.render('track-your-appeal', Object.assign({i18n: locale}, {data: res.locals.appeal}));
});

router.get(`${rootPath}/:id/evidence`, (req, res) => {
  res.render('provide-evidence', Object.assign({i18n: locale}, {data: res.locals.appeal}));
});

router.get(`${rootPath}/:id/expenses`, (req, res) => {
  res.render('claim-expenses', Object.assign({i18n: locale}, {data: res.locals.appeal}));
});

router.get(`${rootPath}/:id/hearingdetails`, (req, res) => {
  res.render('hearing-details', Object.assign({i18n: locale}, {data: res.locals.appeal}));
});

router.get('/status', (req, res, next) => {
  //console.log(`GET:/health: PATH:${req.url}`);
  HealthService.health().then((health) => {
    res.json(health.body);
  });
});

router.get('/', function (req, res, next) {
  //console.log(`PATH:${req.url}`);
  return next({
    message: `Not found, you probably want ${rootPath}/:id/trackyourappeal`,
    responseCode: 404,
  });
});

module.exports = router;
