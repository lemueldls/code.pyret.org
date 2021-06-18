import tester from "../test-util/util.js";

describe("Running chart programs", function () {
  beforeEach(tester.setup);
  afterEach(tester.teardown);

  var chartTestsBase = "./test-util/pyret-programs/charts/";
  tester.doForEachPyretFile(
    it,
    "chart",
    chartTestsBase,
    function (programText, testObject) {
      tester.runAndCheckAllTestsPassed(
        programText,
        testObject.browser,
        testObject.test,
        900_000
      );
    },
    900_000
  );
});
