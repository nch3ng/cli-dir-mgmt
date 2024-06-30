import { DirectoryNotFound, Directory } from "./Directory";

const debug = require("debug")("DirectoryManager");

export class DirectoryManager {
  private directory: Directory;
  constructor() {
    this.directory = new Directory("");
  }

  create(path: string): void {
    this.directory.create(path);
    debug(`Directory created: ${path}`);
  }

  delete(path: string): void {
    try {
      this.directory.delete(path);
      debug(`Directory deleted: ${path}`);
    } catch (error) {
      if (error instanceof DirectoryNotFound) {
        console.log(`Cannot delete ${path} - ${error.target} does not exist`);
      } else {
        throw error;
      }
    }
  }

  move(srcPath: string, destPath: string): void {
    try {
      this.directory.move(srcPath, destPath);
      debug(`Directory ${srcPath} has been moved to ${destPath}`);
    } catch (error) {
      if (error instanceof DirectoryNotFound) {
        console.log(
          `Cannot move ${srcPath} to ${destPath} - ${error.target} does not exist`
        );
      } else {
        throw error;
      }
    }
  }

  list(): void {
    this.directory.traverse((depth: number, directoryName: string) => {
      console.log(" ".repeat(depth * 2) + directoryName);
    });
  }
}
