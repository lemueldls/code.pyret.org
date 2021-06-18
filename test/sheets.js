import tester from "../test-util/util.js";

describe("Running Google Sheets programs", function () {
  beforeEach(tester.setup);
  afterEach(tester.teardown);

  var sheetsTestsBase = "./test-util/pyret-programs/sheets/";
  tester.doForEachPyretFile(
    it,
    "sheets",
    sheetsTestsBase,
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
