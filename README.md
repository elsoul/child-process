# `@elsoul/child-process`

`@elsoul/child-process` is a lightweight utility library for executing shell
commands within [Deno](https://deno.land/). It provides simple and intuitive
functions to run commands synchronously or asynchronously, capturing output and
handling errors gracefully.

## Features

- **Simple API**: Minimal and easy-to-use functions `exec`, `spawnSync`, and
  `sshCmd` for command execution.
- **Error Handling**: Robust error handling with detailed messages and status
  codes.
- **Argument Parsing**: Advanced argument parsing that correctly handles quoted
  strings and escaped characters.
- **TypeScript Support**: Fully typed with TypeScript, providing type safety and
  IntelliSense support.
- **Cross-Platform**: Works seamlessly across different operating systems
  supported by Deno.

## Installation

You can import `@elsoul/child-process` directly from the JavaScript Standard
Registry (JSR) or from Deno Land:

### Using JSR

```ts
import { exec, spawnSync, sshCmd } from 'jsr:@elsoul/child-process'
```

### Using Deno Land

```ts
import {
  exec,
  spawnSync,
  sshCmd,
} from 'https://deno.land/x/child_process/mod.ts'
```

## Usage

`@elsoul/child-process` allows you to execute shell commands effortlessly within
your Deno applications. Below are examples of how to use the provided functions.

### Executing a Command Asynchronously

The `exec` function runs a command and collects its output asynchronously.

```ts
import { exec } from '@elsoul/child-process'

const result = await exec('echo "Hello, World!"')

if (result.success) {
  console.log('Command Output:', result.message)
} else {
  console.error('Command Failed:', result.message)
}
```

**Output:**

```
Command Output: Hello, World!
```

### Spawning a Process Synchronously

The `spawnSync` function spawns a child process synchronously, inheriting the
parent process's standard input/output streams.

```ts
import { spawnSync } from '@elsoul/child-process'

const result = await spawnSync('ls -la')

if (result.success) {
  console.log('Process completed successfully.')
} else {
  console.error('Process failed:', result.message)
}
```

**Output:**

```
(total output of `ls -la` command)
Process completed successfully.
```

### Executing SSH Commands Remotely

The `sshCmd` function allows you to execute commands on a remote server via SSH
using an RSA key for authentication. It also allows specifying the working
directory on the remote server.

```ts
import { sshCmd } from '@elsoul/child-process'

const result = await sshCmd(
  'solv',
  'x.x.x.x',
  '~/.ssh/id_rsa',
  'solana --version',
)

if (result.success) {
  console.log('Command Output:', result.message)
} else {
  console.error('Command Failed:', result.message)
}
```

**Output:**

```
Command Output: solana-cli 1.8.5 (src:1a2bc3d4)
```

### Handling Errors

Both `exec` and `spawnSync` provide detailed error information when a command
fails.

```ts
import { exec } from '@elsoul/child-process'

const result = await exec('some-invalid-command')

if (!result.success) {
  console.error('Error Message:', result.message)
}
```

**Output:**

```
Error Message: Failed to execute command: some-invalid-command
Error output: some-invalid-command: command not found
```

### Advanced Argument Parsing

The library handles complex command strings with quotes and escaped characters.

```ts
import { exec } from '@elsoul/child-process';

const result = await exec('echo "This is a test with spaces and 'single quotes'"');

console.log('Command Output:', result.message);
```

**Output:**

```
Command Output: This is a test with spaces and 'single quotes'
```

## API Reference

### Interfaces

#### `ExecResult`

Represents the result of a command execution.

- `success: boolean` - Indicates if the command executed successfully.
- `message: string` - The output or error message from the command.

### Functions

#### `exec(cmd: string): Promise<ExecResult>`

Executes a command asynchronously and collects its output.

- **Parameters:**
  - `cmd: string` - The command to execute.
- **Returns:** `Promise<ExecResult>` - The result of the command execution.

#### `spawnSync(cmd: string): Promise<ExecResult>`

Spawns a child process synchronously, inheriting standard I/O streams.

- **Parameters:**
  - `cmd: string` - The command to execute.
- **Returns:** `Promise<ExecResult>` - The result of the process execution.

#### `sshCmd(user: string, host: string, rsaKeyPath: string, execCmd: string, cwd = '~'): Promise<ExecResult>`

Executes an SSH command on a remote server synchronously.

- **Parameters:**
  - `user: string` - The SSH username to use for connection.
  - `host: string` - The hostname or IP address of the remote server.
  - `rsaKeyPath: string` - The path to the RSA private key for authentication.
  - `execCmd: string` - The command to execute on the remote server.
  - `cwd: string` - The working directory on the remote server. Defaults to the
    home directory.
- **Returns:** `Promise<ExecResult>` - The result of the SSH command execution.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an
issue on GitHub:

- [GitHub Repository](https://github.com/elsoul/child-process)

This project is intended to be a safe, welcoming space for collaboration, and
contributors are expected to adhere to the
[Contributor Covenant](http://contributor-covenant.org) code of conduct.

## License

The package is available as open source under the terms of the
[Apache-2.0 License](https://www.apache.org/licenses/LICENSE-2.0).

## Code of Conduct

Everyone interacting in the `@elsoul/child-process` project’s codebases, issue
trackers, chat rooms, and mailing lists is expected to follow the
[code of conduct](https://github.com/elsoul/child-process/blob/master/CODE_OF_CONDUCT.md).
