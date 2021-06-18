import tester from "../test-util/util.js";

describe("Running Image programs", function () {
  beforeEach(tester.setup);
  afterEach(tester.teardown);

  var imageTestsBase = "./test-util/pyret-programs/images/";
  tester.doForEachPyretFile(
    it,
    "image",
    imageTestsBase,
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
