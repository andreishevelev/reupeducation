const Selenium = function (driver) {
	let self = this;

	// this timeout must be defined and adjusted according
	//  to the maximum time required to load any element in the product.
	this.DEFAULT_TIMEOUT = 5000;

	// global method that waits until the element loaded on the page
	// parameters: 'locator' - accepts values from webdriver.By (i.e. By.Xpath || By.Id etc.),
	// 'enabled' determines if should wait for enabled state

	this.waitForElement = async function (locator, enabled) {
		let output;
		if (enabled == undefined) {
			await driver.wait(until.elementLocated(locator), DEFAULT_TIMEOUT);
			output = await driver.wait(until.elementIsVisible(driver.findElement(locator)), DEFAULT_TIMEOUT);
		}
		else if (enabled == 'enabled') {
			await driver.wait(until.elementLocated(locator), DEFAULT_TIMEOUT);
			await driver.wait(until.elementIsVisible(driver.findElement(locator)), DEFAULT_TIMEOUT);
			output = await driver.wait(until.elementIsEnabled(driver.findElement(locator)), DEFAULT_TIMEOUT);
		}
		else {
			throw new Error('incorrect value of the enabled parameter');
		}
		return output;
	}
}
module.exports = Selenium;