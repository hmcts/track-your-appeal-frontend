Feature('Track your Appeal Error Pages Tests');

Scenario('verify 404 Error Page', function*(I) {
  I.amOnPage('/progress/111111/trackyourappeal');
  I.see("Sorry, this page could not be found");
  I.see('Cookie');
  I.click('Cookie');
  I.see('Cookie Policy');
});