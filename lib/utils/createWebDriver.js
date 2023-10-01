const selenium = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const os = require("os");

function newDriver() {
  // create WebDriver object
  const driver = new selenium.Builder()
    .forBrowser("chrome")
    .build();
  jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
  return driver;
}

function addAllureReporter(driver) {
  const AllureReporter = require("jasmine-allure-reporter");
  jasmine.getEnv().addReporter(
    new AllureReporter({
      resultsDir: "allure-results",
    })
  );
  // Capture screenshot on test failure
  jasmine.getEnv().addReporter({
    specDone: async function (result) {
      if (result.status === "failed") {      
        await driver.takeScreenshot().then(async function (png) {
          await allure.createAttachment(
            "Screenshot",
            function () {
              return Buffer.from(png, "base64");
            },
            "image/png"
          )();
        });
      }
    },
  });
}

module.exports = {
  newDriver,
  addAllureReporter,
};
