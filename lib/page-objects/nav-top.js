const NavTop = function (driver) {
  let self = this;

  const Selenium = require('../utils/selenium.js');
  const selenium = new Selenium(driver);

  DEFAULT_TIMEOUT = selenium.DEFAULT_TIMEOUT;

  this.clickMenu = async function (menuText) {
    try {
      console.log(`\nTopMenu.clickMenu: ${menuText}`);
      const menuXpath = `//a[.='${menuText}']`;
      const menu = await selenium.waitForElement(By.xpath(menuXpath));

      await menu.click();
      return true;
    }
    catch (err) {
      console.log(`${err}`);
      return `Can't click '${menuText}' option in top Nav Menu`
    }
  }

  this.getMenuState = async function (menuText) {
    try {
      console.log(`\nTopMenu.getMenuState: ${menuText}`);
      const menuXpath = `//a[.='${menuText}']`;
      const menu = await selenium.waitForElement(By.xpath(menuXpath));

      const menuClass = await menu.getAttribute('aria-expanded');
      output = (menuClass.indexOf('true') > -1) ? 'open' : 'closed';
    }
    catch (err) {
      console.log(`${err}`);
      return `Can't get ${menuText} menu text`
    }
  }

  this.setMenuState = async function (menuText, state) {
    try {
      console.log(`\nTopMenu.setMenuState: ${menuText} to ${state}`);
      const currState = await self.getMenuState(menuText);
      if (currState != state) {
        await self.clickMenu(menuText);
        return true;
      }
    }
    catch (err) {
      console.log(`${err}`);
      return "Can't set menu state"
    }
  }
}
module.exports = NavTop;