const Browser = function (driver) {
  let self = this;
  let mainHandle;
  let popupHandle;

  /* This function gets the window handle for the main window.
   * To work correctly, this function MUST be
   * called BEFORE any popup window has been opened.
   */
  this.getMainWindowHandle = async function () {
    try {
      self.mainHandle = await driver.getWindowHandle();
    }
    catch (err) {
      console.log('browser.getMainWindowHandle: ', err)
    }
  }

  /* This function gets the window handle for the popup window.
   * To work correctly, this function MUST be
   * called AFTER any popup window has been opened.
   */
  this.getPopupHandle = async function () {
    try {
      const allHandles = await driver.getAllWindowHandles();
      for (let i = 0; i < allHandles.length; i++) {
        if (allHandles[i] != self.mainHandle) {
          self.popupHandle = allHandles[i];
        }
      }
    }
    catch (err) {
      console.log('browser.getPopupHandle: ', err)
    }
  }

  /* This function sets a given window as active. To set the main window,
   * call this with the parameter 'main'.  To set the popup window, call
   * this with the parameter 'popup'.  NOTE: Not setting the active window
   * correctly will cause errors / tests to fail, so keep that in mind.
   */
  this.switchToWindow = async function (window) {
    try {
      if (window == 'main') {
        await driver.switchTo().window(self.mainHandle);
        return true;
      }

      if (window == 'popup') {
        await self.getPopupHandle();
        await driver.switchTo().window(self.popupHandle);
        return true;
      }
    }
    catch (err) {
      console.log('browser.switchToWindow: ', err)
      return "Can't switch to window"
    }
  }

  this.closeAdditionalWindows = async function () {
    try {
      const handles = await driver.getAllWindowHandles();
      await driver.switchTo().window(handles[0]);

      // Close all other tabs
      for (let i = 1; i < handles.length; i++) {
        await driver.switchTo().window(handles[i]);
        await driver.close();
      }

      // Switch back to the first tab
      await driver.switchTo().window(handles[0]);
    }
    catch (err) {
      console.log('browser.closeAdditionalWindows: ', err)
    }
  }

  this.closeWindow = async function () {
    try {
      await driver.close();
    }
    catch (err) {
      console.log('browser.closeWindow: ', err)
    }
  }

  this.scrollTo = async function (elementToScrollTo) {
    try {
      let cmd = 'arguments[0].scrollIntoView({ behavior: "auto", block: "end" });'
      await driver.executeScript(cmd, elementToScrollTo);

      // Wait for the element to be in the viewport
      await driver.wait(async () => {
        return self.isElementInViewport(elementToScrollTo);
      }, 10000);
    }
    catch (err) {
      console.log('browser.scrollTo:', err)
    }
  }

  // This function to check if an element is in the viewport
  this.isElementInViewport = async function (element) {
    try {
      const yOffset = await driver.executeScript('return arguments[0].getBoundingClientRect().top;', element);
      const viewportHeight = await driver.executeScript('return window.innerHeight');
      if (yOffset >= 0 && yOffset < viewportHeight) {
        return true;
      } else {
      }
    }
    catch (err) {
      console.log('browser.isElementInViewport:', err)
    }
  }
}
module.exports = Browser;