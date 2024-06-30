#!/usr/bin/env ts-node
import { Cli } from "./lib/CliManager";

async function main() {
  // Just make it simple as the 3rd party library is forbidden
  const args = process.argv.slice(2);

  new Cli({ showPrompt: args.includes("--no-prompt") ? false : true });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
