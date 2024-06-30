import * as readline from "readline";
import { DirectoryManager } from "./DirectoryManager";

const debug = require("debug")("CliManager");

export class Cli {
  private rl: readline.Interface;
  private directoryManager: DirectoryManager;

  constructor(
    readonly options: { showPrompt: boolean } = { showPrompt: true }
  ) {
    this.directoryManager = new DirectoryManager();

    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: true
    });

    debug("Cli initialized");
    this.init();
  }

  private init() {
    if (this.options.showPrompt) {
      this.rl.setPrompt("> ");
      this.rl.prompt();
    }
    this.rl
      .on("line", (line) => {
        this.handleLine(line);
        if (this.options.showPrompt) {
          this.rl.prompt();
        }
      })
      .on("close", () => {
        process.exit(0);
      });
  }

  private handleLine(line: string) {
    if (line.trim()) {
      const [command, args] = this.parseInput(line.trim());
      this.handleCommand(command, args);
    }
    if (this.options.showPrompt) {
      this.rl.prompt();
    }
  }

  private parseInput(input: string): [string, string[]] {
    const parts = input.split(" ");
    const command = parts[0];
    const args = parts.slice(1);
    return [command, args];
  }

  private handleCommand(command: string, args: string[]) {
    switch (command) {
      case "CREATE":
        this.directoryManager.create(args[0]);
        break;
      case "MOVE":
        this.directoryManager.move(args[0], args[1]);
        break;
      case "DELETE":
        this.directoryManager.delete(args[0]);
        break;
      case "LIST":
        this.directoryManager.list();
        break;
      case "exit":
        this.rl.close();
        break;
      default:
        console.log(`Unknown command: ${command}`);
        console.log(
          "Available commands: CREATE <dir>, MOVE <srcDir> <destDir>, DELETE <dir>, LIST, exit"
        );
        break;
    }
  }
}
