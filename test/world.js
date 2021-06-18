import tester from "../test-util/util.js";

describe("Running world programs", function () {
  beforeEach(tester.setup);
  afterEach(tester.teardown);

  var worldTestsBase = "./test-util/pyret-programs/world/";
  tester.doForEachPyretFile(
    it,
    "world",
    worldTestsBase,
    function (programText, testObject) {
      tester.checkWorldProgramRunsCleanly(
        programText,
        testObject.browser,
        testObject.test,
        900_000
      );
    },
    900_000
  );
});
