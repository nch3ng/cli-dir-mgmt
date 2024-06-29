import { DirectoryManager } from "./DirectoryManager";

describe("DirectoryManger", () => {
  let directoryManager: DirectoryManager;

  beforeEach(() => {
    directoryManager = new DirectoryManager("");
  });

  it("should be defined", () => {
    expect(directoryManager).toBeDefined();
  });

  describe("create", () => {
    it("should create a directory", () => {
      directoryManager.create("test");
      expect(directoryManager.children.has("test")).toBe(true);
    });

    it("should create a nested directory", () => {
      directoryManager.create("test/nested");
      expect(directoryManager.children.has("test")).toBe(true);
      expect(
        directoryManager.children.get("test")!.children.has("nested")
      ).toBe(true);
    });

    it("should create multiple nested directories", () => {
      directoryManager.create("test/nested/deep");
      expect(directoryManager.children.has("test")).toBe(true);
      expect(
        directoryManager.children.get("test")!.children.has("nested")
      ).toBe(true);
      expect(
        directoryManager.children
          .get("test")!
          .children.get("nested")!
          .children.has("deep")
      ).toBe(true);
    });
  });

  describe("delete", () => {
    it("should delete a directory", () => {
      directoryManager.create("test");
      directoryManager.delete("test");
      expect(directoryManager.children.has("test")).toBe(false);
    });

    it("should delete a nested directory", () => {
      directoryManager.create("test/nested");
      directoryManager.delete("test/nested");

      expect(directoryManager.children.has("test")).toBe(true);
      expect(
        directoryManager.children.get("test")!.children.has("nested")
      ).toBe(false);
    });
  });

  describe("move", () => {
    it("should move a directory", () => {
      directoryManager.create("targetDir");
      directoryManager.create("test");
      directoryManager.move("test", "targetDir");

      expect(directoryManager.children.has("test")).toBe(false);
      expect(directoryManager.children.has("targetDir")).toBe(true);
      expect(
        directoryManager.children.get("targetDir")!.children.has("test")
      ).toBe(true);
    });

    it("should move a nested directory", () => {
      directoryManager.create("targetDir");
      directoryManager.create("srcDir/nested");
      directoryManager.move("srcDir/nested", "targetDir");

      expect(directoryManager.children.has("srcDir")).toBe(true);
      expect(
        directoryManager.children.get("srcDir")!.children.has("nested")
      ).toBe(false);
      expect(
        directoryManager.children.get("targetDir")!.children.has("nested")
      ).toBe(true);
    });

    it("should move a nested directory to a nested destination, and the parent source directory still intacted", () => {
      directoryManager.create("targetDir/nested");
      directoryManager.create("srcDir/nested");
      directoryManager.move("srcDir/nested", "targetDir/nested");

      expect(directoryManager.children.has("srcDir")).toBe(true);
      expect(
        directoryManager.children.get("srcDir")!.children.has("nested")
      ).toBe(false);
      expect(
        directoryManager.children
          .get("targetDir")!
          .children.get("nested")!
          .children.has("nested")
      ).toBe(true);
    });
  });

  describe("list", () => {
    it("should list nested directories", () => {
      directoryManager.create("test");
      directoryManager.create("test/nested");
      directoryManager.create("test/nested/deep");

      const logSpy = jest.spyOn(console, "log").mockImplementation();

      directoryManager.list();

      expect(logSpy).toHaveBeenCalledTimes(3);
      expect(logSpy).toHaveBeenNthCalledWith(1, "test");
      expect(logSpy).toHaveBeenNthCalledWith(2, "  nested");
      expect(logSpy).toHaveBeenNthCalledWith(3, "    deep");

      logSpy.mockRestore();
    });

    it("should list multiple nested directories", () => {
      directoryManager.create("test");
      directoryManager.create("test/nested");
      directoryManager.create("test/nested/deep");
      directoryManager.create("test1/nested/deep/deeper");

      const logSpy = jest.spyOn(console, "log").mockImplementation();

      directoryManager.list();

      expect(logSpy).toHaveBeenCalledTimes(7);
      expect(logSpy).toHaveBeenNthCalledWith(1, "test");
      expect(logSpy).toHaveBeenNthCalledWith(2, "  nested");
      expect(logSpy).toHaveBeenNthCalledWith(3, "    deep");
      expect(logSpy).toHaveBeenNthCalledWith(4, "test1");
      expect(logSpy).toHaveBeenNthCalledWith(5, "  nested");
      expect(logSpy).toHaveBeenNthCalledWith(6, "    deep");
      expect(logSpy).toHaveBeenNthCalledWith(7, "      deeper");

      logSpy.mockRestore();
    });

    it("should list complex structure in alphabetical order", () => {
      directoryManager.create("c_directory");
      directoryManager.create("c_directory/zested");
      directoryManager.create("c_directory/xested/deep");
      directoryManager.create("c_directory/rested/deep/deeper");

      directoryManager.create("a_directory");
      directoryManager.create("a_directory/uested/deep");
      directoryManager.create("a_directory/rested/deep/deeper");
      directoryManager.create("a_directory/nested");

      const logSpy = jest.spyOn(console, "log").mockImplementation();

      directoryManager.list();

      expect(logSpy).toHaveBeenCalledTimes(14);
      expect(logSpy).toHaveBeenNthCalledWith(1, "a_directory");
      expect(logSpy).toHaveBeenNthCalledWith(2, "  nested");
      expect(logSpy).toHaveBeenNthCalledWith(3, "  rested");
      expect(logSpy).toHaveBeenNthCalledWith(4, "    deep");
      expect(logSpy).toHaveBeenNthCalledWith(5, "      deeper");
      expect(logSpy).toHaveBeenNthCalledWith(6, "  uested");
      expect(logSpy).toHaveBeenNthCalledWith(7, "    deep");
      expect(logSpy).toHaveBeenNthCalledWith(8, "c_directory");
      expect(logSpy).toHaveBeenNthCalledWith(9, "  rested");
      expect(logSpy).toHaveBeenNthCalledWith(10, "    deep");
      expect(logSpy).toHaveBeenNthCalledWith(11, "      deeper");
      expect(logSpy).toHaveBeenNthCalledWith(12, "  xested");
      expect(logSpy).toHaveBeenNthCalledWith(13, "    deep");
      expect(logSpy).toHaveBeenNthCalledWith(14, "  zested");

      logSpy.mockRestore();
    });
  });
});
