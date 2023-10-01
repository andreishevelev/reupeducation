const createWebDriver = require("../lib/utils/createWebDriver.js");
const fs = require('fs');
const selenium = require('selenium-webdriver');
By = selenium.By;
until = selenium.until;

const driver = createWebDriver.newDriver();
createWebDriver.addAllureReporter(driver);

// BEGIN page objects
const Browser = require('../lib/utils/browser.js');
const ForLearners = require('../lib/page-objects/for-learners.js');
const NavTop = require('../lib/page-objects/nav-top.js');

const browser = new Browser(driver);
const forLearners = new ForLearners(driver);
const navTop = new NavTop(driver);
// END page objects

// this program takes a config with parameters and test data
const configFile = process.argv[3] + ".json";
const configData = fs.readFileSync(configFile);
const config = JSON.parse(configData);

const url = config["url"];
const userData = config["userData"];
const questions = config["questions"];

describe('Test error messages:', function () {

  beforeAll(async function () {
    // Open the website in the browser
    await driver.get(url);

    // resize the window
    await driver.manage().window().maximize();

    // set a timeout of 60 seconds to load any page
    await driver.manage().setTimeouts({ pageLoad: 60000 });

    // get the handle for the main window, since this automation opens new tabs
    await browser.getMainWindowHandle();
  });

  afterEach(async function () {
  });

  beforeEach(async function () {
    await browser.closeAdditionalWindows();
  });

  afterAll(async function () {
    await driver.quit();
  });

  it('messages about validating required fields are displayed', async function () {
    console.log(`\n** Test if messages about validating required fields are displayed`);
    let result = false;

    result = await navTop.setMenuState('Contact', "open");
    expect(result).toBe(true);

    result = await navTop.clickMenu('For learners');
    expect(result).toBe(true);

    result = await browser.switchToWindow('popup');
    expect(result).toBe(true);

    result = await forLearners.fillInput('firstname', userData.firstName);
    expect(result).toBe(true);

    result = await forLearners.fillInput('lastname', userData.lastName);
    expect(result).toBe(true);

    result = await forLearners.fillInput('email', userData.email);
    expect(result).toBe(true);

    result = await forLearners.fillInput('mobilephone', userData.phone);
    expect(result).toBe(true);

    result = await forLearners.continuing(questions.continuing);
    expect(result).toBe(true);

    result = await forLearners.whenReEnroll(questions.whenReEnroll);
    expect(result).toBe(true);

    submitClicked = await forLearners.clickSubmit();
    expect(submitClicked).toBe(true);

    let expectedMessage = "Please complete this required field."
    let actualMessage = await forLearners.getErrorMessage(0);
    expect(actualMessage).toBe(expectedMessage);

    expectedMessage = "Please complete all required fields."
    actualMessage = await forLearners.getErrorMessage(1);
    expect(actualMessage).toBe(expectedMessage);
  });

  it('email validation message displayed', async function () {
    let expectedMessage = "Email must be formatted correctly. False positive error."
    console.log(`\n** Test if "${expectedMessage}" error message displayed`);
    let result = false;

    result = await navTop.setMenuState('Contact', "open");
    expect(result).toBe(true);

    result = await navTop.clickMenu('For learners');
    expect(result).toBe(true);

    result = await browser.switchToWindow('popup');
    expect(result).toBe(true);

    result = await forLearners.fillInput('email', userData.invalidEmail);
    expect(result).toBe(true);

    const errorMessage = await forLearners.getErrorMessage(0);
    expect(errorMessage).toBe(expectedMessage);
  });
});