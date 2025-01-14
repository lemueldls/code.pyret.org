import assert from "node:assert";
import tester from "../test-util/util.js";
import webdriver from "selenium-webdriver";

describe("Basic page loads", function () {
  beforeEach(tester.setup);
  afterEach(tester.teardown);

  /*
  it("should load the index", function(done) {
    this.timeout(10000);
    this.browser.get(this.base);
    var headline = this.browser.findElement(webdriver.By.id('right'));
    this.browser.call(done);
  });
*/

  it("should load the editor", function (done) {
    this.timeout(80_000);
    var self = this;
    this.browser.get(this.base + "/editor");
    this.browser.wait(function () {
      return tester.pyretLoaded(self.browser);
    });
    this.browser.call(done);
  });
});
