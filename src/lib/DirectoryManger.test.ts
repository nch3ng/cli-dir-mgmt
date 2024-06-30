import { DirectoryManager } from "./DirectoryManager";

describe("DirectoryManger", () => {
  let directoryManager: DirectoryManager;

  beforeEach(() => {
    directoryManager = new DirectoryManager();
  });

  it("should be defined", () => {
    expect(directoryManager).toBeDefined();
  });

  describe("delete", () => {
    it("should print the error message if the directory does not exist", () => {
      const logSpy = jest.spyOn(console, "log").mockImplementation();

      directoryManager.delete("test/nested");

      expect(logSpy).toHaveBeenCalledWith(
        "Cannot delete test/nested - test does not exist"
      );

      logSpy.mockRestore();
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

  describe("move", () => {
    it("should print the error message if the source directory does not exist", () => {
      const logSpy = jest.spyOn(console, "log").mockImplementation();

      directoryManager.move("test/nested", "test/nested/deep");

      expect(logSpy).toHaveBeenCalledWith(
        "Cannot move test/nested to test/nested/deep - test/nested does not exist"
      );

      logSpy.mockRestore();
    });

    it("should print the error message if the destination directory does not exist", () => {
      directoryManager.create("test");

      const logSpy = jest.spyOn(console, "log").mockImplementation();

      directoryManager.move("test", "test/nested/deep");

      expect(logSpy).toHaveBeenCalledWith(
        "Cannot move test/nested to test/nested/deep - test/nested does not exist"
      );

      logSpy.mockRestore();
    });
  });
});
