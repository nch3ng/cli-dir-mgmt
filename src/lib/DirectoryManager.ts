const debug = require("debug")("DirectoryManager");

export class DirectoryManager {
  name: string;
  children: Map<string, DirectoryManager>;

  constructor(name: string) {
    this.name = name;
    this.children = new Map();
  }

  create(path: string): void {
    const parts = path.split("/");
    let current: DirectoryManager = this;

    for (const part of parts) {
      if (!current.children.has(part)) {
        current.children.set(part, new DirectoryManager(part));
      }
      current = current.children.get(part)!;
    }
    debug(`Directory created: ${path}`);
  }

  delete(path: string): void {
    const parts = path.split("/");
    if (this._delete(parts, 0, path)) {
      debug(`Directory deleted: ${path}`);
    } else {
      debug(`Directory not found: ${path}`);
    }
  }

  private _delete(parts: string[], index: number, origin: string): boolean {
    const parentPath = parts.slice(0, -1);
    const directoryToDelete = parts[parts.length - 1];

    let current: DirectoryManager = this;
    for (const part of parentPath) {
      if (!current.children.has(part)) {
        console.log(`Cannot delete ${origin} - ${part} does not exist`);
        return false;
      }
      current = current.children.get(part)!;
    }

    if (current.children.has(directoryToDelete)) {
      current.children.delete(directoryToDelete);
      return true;
    } else {
      console.log(
        `Cannot delete ${origin} - ${directoryToDelete} does not exist`
      );
      return false;
    }
  }

  move(srcPath: string, destPath: string): void {
    const srcParts = srcPath.split("/");
    const destParts = destPath.split("/");

    const srcDir = this._get(srcParts, 0);
    if (!srcDir) {
      console.log(`Source directory not found: ${srcPath}`);
      return;
    }

    const destDir = this._get(destParts, 0);

    if (destDir) {
      destDir.children.set(srcDir.name, srcDir);

      this._delete(srcParts, 0, srcPath);
      debug(`Directory ${srcPath} has been moved to ${destPath}`);
    }
  }

  private _get(parts: string[], index: number): DirectoryManager | null {
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

  list(): void {
    const sortedChildren = Array.from(this.children.keys()).sort();
    for (const key of sortedChildren) {
      this.children.get(key)!._list("");
    }
  }

  private _list(indent: string = ""): void {
    console.log(indent + this.name);

    const sortedChildren = Array.from(this.children.keys()).sort();
    for (const key of sortedChildren) {
      this.children.get(key)!._list(indent + "  ");
    }
  }
}
