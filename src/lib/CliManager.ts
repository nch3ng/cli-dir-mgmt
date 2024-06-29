import * as readline from "readline";
import { DirectoryManager } from "./DirectoryManager";

const debug = require("debug")("Cli");

// Define a class to handle the CLI logic
export class Cli {
  private rl: readline.Interface;
  private directoryManager: DirectoryManager;
  private history: string[];
  private historyIndex: number;

  constructor() {
    this.directoryManager = new DirectoryManager("");

    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: true,
      historySize: 100
    });

    this.history = [];
    this.historyIndex = -1;

    debug("Cli initialized");
    this.init();
  }

  // Initialize the CLI
  private init() {
    // this.rl.setPrompt("> ");
    // this.rl.prompt();

    this.rl
      .on("line", (line) => {
        this.handleLine(line);
        // this.rl.prompt();
      })
      .on("close", () => {
        // console.log("Exiting...");
        process.exit(0);
      });
    readline.emitKeypressEvents(process.stdin);
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true);
    }
    process.stdin.on("keypress", (str, key) => {
      this.handleKeyPress(str, key);
    });
  }

  private handleLine(line: string) {
    if (line.trim()) {
      this.history.push(line.trim());
      this.historyIndex = this.history.length;
      const [command, args] = this.parseInput(line.trim());
      this.handleCommand(command, args);
    }
    // this.rl.prompt();
  }

  private handleKeyPress(str: string, key: readline.Key) {
    if (key.name === "up" || key.name === "down") {
      if (key.name === "up") {
        if (this.historyIndex > 0) {
          this.historyIndex--;
        }
      } else if (key.name === "down") {
        if (this.historyIndex < this.history.length) {
          this.historyIndex++;
        }
      }

      const historyCommand = this.history[this.historyIndex] || "";
      readline.cursorTo(process.stdout, 0);
      process.stdout.write("> " + historyCommand);
      readline.clearLine(process.stdout, 1);
    }
  }

  private parseInput(input: string): [string, string[]] {
    const parts = input.split(" ");
    const command = parts[0];
    const args = parts.slice(1);
    return [command, args];
  }

  // Handle commands entered by the user
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
      case "hello":
        console.log("Hello, world!");
        break;
      case "help":
        console.log("Available commands: hello, help, exit");
        break;
      default:
        console.log(`Unknown command: ${command}`);
    }
  }
}
