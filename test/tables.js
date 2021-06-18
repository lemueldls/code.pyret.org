import tester from "../test-util/util.js";

describe("Running Tables programs", function () {
  beforeEach(tester.setup);
  afterEach(tester.teardown);

  var tablesTestsBase = "./test-util/pyret-programs/tables/";
  tester.doForEachPyretFile(
    it,
    "tables",
    tablesTestsBase,
    function (programText, testObject) {
      tester.checkTableRendersCorrectly(
        programText,
        testObject.browser,
        testObject.test,
        900_000
      );
    },
    900_000
  );
});
