import tester from "../test-util/util.js";

describe("Running Module programs", function () {
  beforeEach(tester.setup);
  afterEach(tester.teardown);

  var moduleTestsBase = "./test-util/pyret-programs/modules/";
  tester.doForEachPyretFile(
    it,
    "module",
    moduleTestsBase,
    function (programText, testObject) {
      programText = programText.replace(
        "BASE_URL",
        '"' + process.env["BASE_URL"] + '"'
      );
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
