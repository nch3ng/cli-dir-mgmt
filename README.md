# Directory Manager

[![CI](https://github.com/nch3ng/cli-dir-mgmt/actions/workflows/ci.yml/badge.svg)](https://github.com/nch3ng/cli-dir-mgmt/actions/workflows/ci.yml)

This is a project that manages an in-memory directory structure using TypeScript. The program can create, delete, move directories, and print the directory structure in alphabetical order.

## Prerequisites

- [Node.js](https://nodejs.org/en/download/) (version 20 or higher)
- [npm](https://www.npmjs.com/get-npm) (comes with Node.js)

## Getting Started

```sh
git clone https://github.com/nch3ng/cli-dir-mgmt.git
cd cli-dir-mgmt
npm install
```

## Exec

The implementation initially functioned as a prompt console but eventually adapted to receive standard input. Therefore, according to the requirement, it can be achieved by reading the file and piping it to the command. The input commands are pre-configured in the test-cases/inputs/main.input file.

```bash
cat test-cases/inputs/main.input | npm run start -- --no-prompt
```

Alternatively, you can run the prompt interface using the command npm run start and enter the commands directly into the prompt.

```bash
npm run start
```

The smoke test verifies that the basic functionality works as expected by comparing the expected output with the actual output. To run the smoke test, use the following command:

```bash
npm run smoke
```

This will ensure that the essential requirements are met and the application behaves correctly under normal conditions.

## Development

To get started with development, follow these steps:

```bash
git clone https://github.com/nch3ng/cli-dir-mgmt.git
cd cli-dir-mgmt
npm install
npm run start:dev
```

## Test

To run the unit tests, use the following command:

```
npm run test
```
