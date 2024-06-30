import { Directory, DirectoryNotFound } from "./Directory";

describe("DirectoryManger", () => {
  let directory: Directory;

  beforeEach(() => {
    directory = new Directory("");
  });

  it("should be defined", () => {
    expect(directory).toBeDefined();
  });

  describe("create", () => {
    it("should create a directory", () => {
      directory.create("test");
      expect(directory.children.has("test")).toBe(true);
    });

    it("should create a directory even if it already exists", () => {
      directory.create("test");
      directory.create("test");
      expect(directory.children.has("test")).toBe(true);
    });

    it("should create a nested directory", () => {
      directory.create("test/nested");
      expect(directory.children.has("test")).toBe(true);
      expect(directory.children.get("test")!.children.has("nested")).toBe(true);
    });

    it("should create multiple nested directories", () => {
      directory.create("test/nested/deep");
      expect(directory.children.has("test")).toBe(true);
      expect(directory.children.get("test")!.children.has("nested")).toBe(true);
      expect(
        directory.children
          .get("test")!
          .children.get("nested")!
          .children.has("deep")
      ).toBe(true);
    });
  });

  describe("delete", () => {
    it("should delete a directory", () => {
      directory.create("test");
      directory.delete("test");
      expect(directory.children.has("test")).toBe(false);
    });

    it("should delete a nested directory", () => {
      directory.create("test/nested");
      directory.delete("test/nested");

      expect(directory.children.has("test")).toBe(true);
      expect(directory.children.get("test")!.children.has("nested")).toBe(
        false
      );
    });

    it("should throw an error if the directory does not exist", () => {
      expect(() => directory.delete("test")).toThrow(
        new DirectoryNotFound({ target: "test" })
      );
    });
  });

  describe("move", () => {
    it("should move a directory", () => {
      directory.create("targetDir");
      directory.create("test");
      directory.move("test", "targetDir");

      expect(directory.children.has("test")).toBe(false);
      expect(directory.children.has("targetDir")).toBe(true);
      expect(directory.children.get("targetDir")!.children.has("test")).toBe(
        true
      );
    });

    it("should move a nested directory", () => {
      directory.create("targetDir");
      directory.create("srcDir/nested");
      directory.move("srcDir/nested", "targetDir");

      expect(directory.children.has("srcDir")).toBe(true);
      expect(directory.children.get("srcDir")!.children.has("nested")).toBe(
        false
      );
      expect(directory.children.get("targetDir")!.children.has("nested")).toBe(
        true
      );
    });

    it("should move a nested directory to a nested destination, and the parent source directory still intacted", () => {
      directory.create("targetDir/nested");
      directory.create("srcDir/nested");
      directory.move("srcDir/nested", "targetDir/nested");

      expect(directory.children.has("srcDir")).toBe(true);
      expect(directory.children.get("srcDir")!.children.has("nested")).toBe(
        false
      );
      expect(
        directory.children
          .get("targetDir")!
          .children.get("nested")!
          .children.has("nested")
      ).toBe(true);
    });

    it("should throw an error if the source directory does not exist", () => {
      expect(() => directory.move("srcDir", "targetDir")).toThrow(
        new DirectoryNotFound({ target: "srcDir" })
      );
    });

    it("should throw an error if the destination directory does not exist", () => {
      directory.create("srcDir");
      expect(() => directory.move("srcDir", "targetDir")).toThrow(
        new DirectoryNotFound({ target: "targetDir" })
      );
    });
  });

  describe("list", () => {
    it("should list nested directories", () => {
      directory.create("test");
      directory.create("test/nested");
      directory.create("test/nested/deep");

      const cbSpy = jest.fn();

      directory.traverse((indent, name) => {
        cbSpy(indent, name);
      });

      expect(cbSpy).toHaveBeenCalledTimes(3);
      //                               #th of calls, depth, name
      expect(cbSpy).toHaveBeenNthCalledWith(1, 0, "test");
      expect(cbSpy).toHaveBeenNthCalledWith(2, 1, "nested");
      expect(cbSpy).toHaveBeenNthCalledWith(3, 2, "deep");

      cbSpy.mockRestore();
    });

    it("should list multiple nested directories", () => {
      directory.create("test");
      directory.create("test/nested");
      directory.create("test/nested/deep");
      directory.create("test1/nested/deep/deeper");

      const cbSpy = jest.fn();

      directory.traverse((indent, name) => {
        cbSpy(indent, name);
      });

      expect(cbSpy).toHaveBeenCalledTimes(7);
      //                               #th of calls, depth, name
      expect(cbSpy).toHaveBeenNthCalledWith(1, 0, "test");
      expect(cbSpy).toHaveBeenNthCalledWith(2, 1, "nested");
      expect(cbSpy).toHaveBeenNthCalledWith(3, 2, "deep");
      expect(cbSpy).toHaveBeenNthCalledWith(4, 0, "test1");
      expect(cbSpy).toHaveBeenNthCalledWith(5, 1, "nested");
      expect(cbSpy).toHaveBeenNthCalledWith(6, 2, "deep");
      expect(cbSpy).toHaveBeenNthCalledWith(7, 3, "deeper");

      cbSpy.mockRestore();
    });

    it("should list complex structure in alphabetical order", () => {
      directory.create("c_directory");
      directory.create("c_directory/zested");
      directory.create("c_directory/xested/deep");
      directory.create("c_directory/rested/deep/deeper");

      directory.create("a_directory");
      directory.create("a_directory/uested/deep");
      directory.create("a_directory/rested/deep/deeper");
      directory.create("a_directory/nested");

      const cbSpy = jest.fn();

      directory.traverse((indent, name) => {
        cbSpy(indent, name);
      });

      expect(cbSpy).toHaveBeenCalledTimes(14);
      //                               #th of calls, depth, name
      expect(cbSpy).toHaveBeenNthCalledWith(1, 0, "a_directory");
      expect(cbSpy).toHaveBeenNthCalledWith(2, 1, "nested");
      expect(cbSpy).toHaveBeenNthCalledWith(3, 1, "rested");
      expect(cbSpy).toHaveBeenNthCalledWith(4, 2, "deep");
      expect(cbSpy).toHaveBeenNthCalledWith(5, 3, "deeper");
      expect(cbSpy).toHaveBeenNthCalledWith(6, 1, "uested");
      expect(cbSpy).toHaveBeenNthCalledWith(7, 2, "deep");
      expect(cbSpy).toHaveBeenNthCalledWith(8, 0, "c_directory");
      expect(cbSpy).toHaveBeenNthCalledWith(9, 1, "rested");
      expect(cbSpy).toHaveBeenNthCalledWith(10, 2, "deep");
      expect(cbSpy).toHaveBeenNthCalledWith(11, 3, "deeper");
      expect(cbSpy).toHaveBeenNthCalledWith(12, 1, "xested");
      expect(cbSpy).toHaveBeenNthCalledWith(13, 2, "deep");
      expect(cbSpy).toHaveBeenNthCalledWith(14, 1, "zested");

      cbSpy.mockRestore();
    });
  });
});
