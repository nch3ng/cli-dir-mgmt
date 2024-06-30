const debug = require("debug")("Directory");

export class DirectoryNotFound extends Error {
  public target: string;
  public statusCode: number = 404;

  constructor(readonly payload: { target: string }) {
    super("DirectoryNotFound");
    this.target = payload.target;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class Directory {
  name: string;
  children: Map<string, Directory>;

  constructor(name: string) {
    this.name = name;
    this.children = new Map();
  }

  create(path: string): void {
    const parts = path.split("/");
    let current: Directory = this;

    for (const part of parts) {
      debug(part);
      if (!current.children.has(part)) {
        current.children.set(part, new Directory(part));
      }
      current = current.children.get(part)!;
    }
  }

  delete(path: string): void {
    const parts = path.split("/");
    return this._delete(parts);
  }

  private _delete(parts: string[]) {
    const parentPath = parts.slice(0, -1);
    const directoryToDelete = parts[parts.length - 1];

    let current: Directory = this;
    for (const part of parentPath) {
      if (!current.children.has(part)) {
        throw new DirectoryNotFound({
          target: part
        });
      }
      current = current.children.get(part)!;
    }

    if (current.children.has(directoryToDelete)) {
      current.children.delete(directoryToDelete);
    } else {
      throw new DirectoryNotFound({
        target: directoryToDelete
      });
    }
  }

  move(srcPath: string, destPath: string): void {
    const srcParts = srcPath.split("/");
    const destParts = destPath.split("/");

    const srcDir = this._get(srcParts, 0);
    if (!srcDir) {
      throw new DirectoryNotFound({
        target: srcPath
      });
    }

    const destDir = this._get(destParts, 0);

    if (destDir) {
      destDir.children.set(srcDir.name, srcDir);

      this._delete(srcParts);
    } else {
      throw new DirectoryNotFound({
        target: destPath
      });
    }
  }

  private _get(parts: string[], index: number): Directory | null {
    if (index >= parts.length) {
      return this;
    }

    const part = parts[index];
    const current = this.children.get(part);

    if (!current) {
      return null;
    }

    return current._get(parts, index + 1);
  }

  traverse(callback: (depth: number, directoryName: string) => void): void {
    const sortedChildren = Array.from(this.children.keys()).sort();
    for (const key of sortedChildren) {
      this.children.get(key)!._traverse(0, callback);
    }
  }

  private _traverse(
    depth: number = 0,
    callback: (depth: number, directoryName: string) => void
  ): void {
    callback?.(depth, this.name);

    const sortedChildren = Array.from(this.children.keys()).sort();
    for (const key of sortedChildren) {
      this.children.get(key)!._traverse(depth + 1, callback);
    }
  }
}
