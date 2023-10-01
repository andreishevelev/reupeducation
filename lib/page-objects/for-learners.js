const ForLearners = function (driver) {
  let self = this;

  const Browser = require('../utils/browser.js');
  const Selenium = require('../utils/selenium.js');

  const browser = new Browser(driver);
  const selenium = new Selenium(driver);

  DEFAULT_TIMEOUT = selenium.DEFAULT_TIMEOUT;

  this.fillInput = async function (inputName, data) {
    try {
      console.log(`\nForLearners.fillInput: ${inputName}`);
      const inputXpath = `//input[@name='${inputName}']`;
      const input = await selenium.waitForElement(By.xpath(inputXpath));

      await browser.scrollTo(input);
      await input.clear();
      await input.sendKeys(data);
      return true;
    } catch (err) {
      console.log(`${err}`);
      return `Can't fill ${inputName} input`;
    }
  }

  // Select option in "Are you interested in continuing your education?" section
  // Takes string that match text of the option
  this.continuing = async function (text) {
    try {
      console.log(`\nForLearners.continuing`);
      const optionXpath = `//span[.="${text}"]`;
      const option = await selenium.waitForElement(By.xpath(optionXpath));

      await browser.scrollTo(option);
      await option.click();
      return true;
    }
    catch (err) {
      console.log(`${err}`);
      return `Can't select ${text} 
      option in "Are you interested in continuing your education?" section`
    }
  }

  this.whenReEnroll = async function (optionText) {
    try {
      console.log(`\nForLearners.whenReEnroll`);
      const menuXpath = `//select[@name="reenrollment_plans"]//option[.="${optionText}"]`;
      const menu = await selenium.waitForElement(By.xpath(menuXpath));

      await browser.scrollTo(menu);
      await menu.click();
      return true;
    }
    catch (err) {
      console.log(`${err}`);
      return `Can't select ${optionText} option 
      in "Do you have a goal for when you would like to re-enroll?" dropdown`
    }
  }

  this.clickSubmit = async function () {
    try {
      console.log(`\nForLearners.clickSubmit`);
      const buttonXpath = `//div[@style='display: block;']//input[@type='submit'] | //input[@value='Next']`;
      const button = await selenium.waitForElement(By.xpath(buttonXpath), 'enabled');

      await browser.scrollTo(button);
      await button.click();
      return true;
    }
    catch (err) {
      console.log(`${err}`);
      return `Can't click 'Submit' button`
    }
  }

  this.getErrorMessage = async function (index) {
    try {
      console.log(`\nForLearners.getErrorMessage`);

      const className = "hs-error-msgs"
      await driver.wait(until.elementLocated(By.className(className)), DEFAULT_TIMEOUT);
      const labels = await driver.findElements(By.className(className));
      await driver.wait(until.elementIsVisible(labels[index]), DEFAULT_TIMEOUT)
      await browser.scrollTo(labels[index]);
      const text = await labels[index].getText();
      return text;
    }
    catch (err) {
      console.log(`${err}`);
      return `Can't get error message`
    }
  }
}
module.exports = ForLearners;