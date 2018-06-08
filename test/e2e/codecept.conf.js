const config = require('config');

exports.config = {
  tests: './**/*.test.js',
  output: process.cwd()+'/functional-output',
  timeout: 1000,
  helpers: {
    Puppeteer: {
      url: process.env.TEST_URL || 'https://localhost:3000',
      waitForTimeout: parseInt(config.get('e2e.waitForTimeout')),
      waitForAction: parseInt(config.get('e2e.waitForAction')),
      smartWait: '5000',
      show: false,
      windowSize: ' 800x1000',
      chrome: {
        ignoreHTTPSErrors: true,
        args: ['--no-sandbox',
        "--proxy-server=proxyout.reform.hmcts.net:8080"]
      }
    },
    MyPuppeteer: {
          "require": "./helpers/JSWait.js"
        }
  },
  include: { I: './page-objects/steps.js' },
  bootstrap: false,
  mocha: {
    reporterOptions: {
      'codeceptjs-cli-reporter': {
        stdout: '-',
        options: { steps: true }
      },
      'mocha-junit-reporter': {
        stdout: '-',
        options: { mochaFile: process.env.OUTPUT_DIR + '/result.xml' }
      },
      mochawesome: {
        stdout: '-',
        options: {
          reportDir: process.env.OUTPUT_DIR || './functional-output',
          reportName: 'index',
          inlineAssets: true,
          charts: true
        }
      }
    }
  },
  name: 'TYA tests'
};
