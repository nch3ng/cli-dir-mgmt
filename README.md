# Directory Manager

This is a Node.js project that demonstrates how to manage an in-memory directory structure using TypeScript. The program can create, delete, move directories, and print the directory structure in alphabetical order.

## Prerequisites

- [Node.js](https://nodejs.org/en/download/) (version 20 or higher)
- [npm](https://www.npmjs.com/get-npm) (comes with Node.js)

## Setup

```sh
git clone https://github.com/nch3ng/cli-dir-mgmt.git
cd cli-dir-mgmt
npm install
```

## Exec

You can run the prompt interface by using the command npm run start and typing in your prompt, or by reading through the file and piping it to the command. The input commands are pre-configured in the commands.input file.

```bash
cat commands.input | npm run start
```

The smoke test verifies that the basic functionality works as expected by comparing the expected output with the actual output. To run the smoke test, use the following command:

```
npm run smoke
```

This will ensure that the essential requirements are met and the application behaves correctly under normal conditions.

## Development

To get started with development, follow these steps:

```sh
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
