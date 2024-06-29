#!/usr/bin/env ts-node
import { Cli } from "./lib/CliManager";

async function main() {
  new Cli();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
