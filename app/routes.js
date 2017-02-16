const _ = require('lodash');
const ServiceLoader = require('app/services/ServiceLoader');
const AppealsService = ServiceLoader.instance().load(ServiceLoader.appeals);
const HealthService = ServiceLoader.instance().load(ServiceLoader.health);
const TokenService = ServiceLoader.instance().load(ServiceLoader.token);
const locale = require('app/assets/locale/en');
const {SHOW_HEARING_DETAILS} = require('app/config');
const express = require('express');
const router = express.Router();
const progressRoot = '/progress';
const notificationRoot = '/manage-email-notifications';
const EMAIL = {
  CHANGE: 'changeEmailAddress',
  STOP: 'stopEmails',
  NO_MATCH: 'Emails do not match',
  NOT_VALID: 'Not a valid email address',
  EMPTY_STRING: 'Please enter an email address'
};
const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

function getAppeal(req, res, next) {
  if (req.params.id) {
    //console.log(`GET:/appeals/${id} : PATH:${req.url}`);
    AppealsService.status(req.params.id).then((appeal) => {
      res.locals.appeal = appeal;
      next();
    }).catch((error) => {
      next(error);
    })
  } else {
    next();
  }
}

router.get(`${progressRoot}/:id/abouthearing`, getAppeal, (req, res) => {
  res.render('about-hearing', _getData(res.locals.appeal));
});

router.get(`${progressRoot}/:id/trackyourappeal`, getAppeal, (req, res) => {
  res.render('track-your-appeal', _getData(res.locals.appeal));
});

router.get(`${progressRoot}/:id/evidence`, getAppeal, (req, res) => {
  res.render('provide-evidence', _getData(res.locals.appeal));
});

router.get(`${progressRoot}/:id/expenses`, getAppeal, (req, res) => {
  res.render('claim-expenses', _getData(res.locals.appeal));
});

router.get(`${progressRoot}/:id/hearingdetails`, getAppeal, (req, res) => {
  if (SHOW_HEARING_DETAILS) {
    res.render('hearing-details', Object.assign({i18n: locale}, {data: res.locals.appeal}));
  } else {
    res.send("Sorry, currently unavailable");
  }
});


function validateToken(req, res, next) {
  if (req.params.mactoken) {
    TokenService.validateToken(req.params.mactoken).then((result) => {
      res.locals.token = result.body.token;
      next();
    }).catch((error) => {
      next(error);
    });
  } else {
    next();
  }
};

router.get(`${notificationRoot}/:mactoken`, validateToken, (req, res, next) => {
  res.render('manage-email-notifications', {
    i18n: locale.notifications.email.manage,
    mactoken: req.params.mactoken,
  });
});

router.post(`${notificationRoot}/:mactoken`, validateToken, (req, res, next) => {
  const userSelection = req.body.emailNotify;
  if(userSelection === EMAIL.CHANGE) {
    res.render('email-address-change', {
      i18n: locale.notifications.email.addressChange,
      mactoken: req.params.mactoken,
    });
  } else if (userSelection === EMAIL.STOP) {
    res.render('confirm-emails-stop', {
      i18n: locale.notifications.email.stop,
      mactoken: req.params.mactoken,
    });
  }
});

router.post(`${notificationRoot}/:mactoken/stop`, validateToken, (req, res, next) => {
  const token = res.locals.token;
  AppealsService.stopReceivingEmails(token.appealId, token.subscriptionId).then((result) => {
    res.render('stopped-email-notifications', {
      data: { id: token.appealId },
      i18n: locale.notifications.email.stopConfirmation,
      mactoken: req.params.mactoken,
    });
  }).catch((error) => {
    next(error);
  });
});


router.get(`${notificationRoot}/:mactoken/change`, validateToken, (req, res, next) => {
  res.render('email-address-change', {
    i18n: locale.notifications.email.addressChange,
    mactoken: req.params.mactoken,
  });
});

router.post(`${notificationRoot}/:mactoken/change`, validateToken, (req, res, next) => {
  const token = res.locals.token;
  const email = req.body.email;
  const email2 = req.body.email2;

  let errors = {
    email: {
      value: email
    },
    email2: {
      value: email2
    }
  };

  if(email === '' && email2 === '') {
    errors.email.message = errors.email2.message = EMAIL.EMPTY_STRING;
    res.status(400);
    res.render('email-address-change', {
      errors: errors,
      i18n: locale.notifications.email.addressChange,
      mactoken: req.params.mactoken,
    });
    return;
  }

  if(email !== email2 ) {
    errors.email.message = errors.email2.message = EMAIL.NO_MATCH;
    res.status(400);
    res.render('email-address-change', {
      errors: errors,
      i18n: locale.notifications.email.addressChange,
      mactoken: req.params.mactoken,
    });
    return;
  }

  if(!EMAIL_REGEX.test(email)) {
    errors.email.message = errors.email2.message = EMAIL.NOT_VALID;
    res.render('email-address-change', {
      errors: errors,
      i18n: locale.notifications.email.addressChange,
      mactoken: req.params.mactoken,
    });
    return;
  }

  const body = { subscription: { email: email } };
  AppealsService.changeEmailAddress(token.appealId, token.subscriptionId, body).then((result) => {
    res.render('email-address-change-confirmed', {
      i18n: locale.notifications.email.addressChangeConfirmed,
      data: { email: email },
      mactoken: req.params.mactoken,
    });
  }).catch((error) => {
    next(error);
  });
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
    message: `Not found, you probably want ${progressRoot}/:id/trackyourappeal`,
    responseCode: 404,
  });
});

_getData = (appeal) => {
  return {
    i18n: locale,
    data: appeal,
    feature: {
      SHOW_HEARING_DETAILS: SHOW_HEARING_DETAILS
    }
  };
};

module.exports = router;
