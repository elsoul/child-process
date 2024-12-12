/**
 * Splits a command string into arguments, respecting quoted substrings.
 * Supports double quotes ("") and single quotes ('').
 * @param cmd - The command string to split.
 * @returns An array of command and arguments.
 */
function splitArgs(cmd: string): string[] {
  const args: string[] = []
  let current = ''
  let inDoubleQuotes = false
  let inSingleQuotes = false
  let escaped = false

  for (let i = 0; i < cmd.length; i++) {
    const c = cmd[i]
    if (escaped) {
      current += c
      escaped = false
    } else if (c === '\\') {
      escaped = true
    } else if (c === '"' && !inSingleQuotes) {
      inDoubleQuotes = !inDoubleQuotes
    } else if (c === "'" && !inDoubleQuotes) {
      inSingleQuotes = !inSingleQuotes
    } else if (c === ' ' && !inDoubleQuotes && !inSingleQuotes) {
      if (current.length > 0) {
        args.push(current)
        current = ''
      }
    } else {
      current += c
    }
  }
  if (current.length > 0) {
    args.push(current)
  }
  return args
}

/**
 * Interface representing the result of an execution.
 */
export interface ExecResult {
  /**
   * Indicates whether the command executed successfully.
   */
  success: boolean
  /**
   * The output message or error message from the command execution.
   */
  message: string
}

/**
 * Spawns a child process synchronously, inheriting the parent's stdio streams.
 * @param cmd - The command to execute.
 * @param cwd - The working directory for the command.
 * @returns A Promise resolving to an ExecResult containing success status and message.
 */
export const spawnSync = async (
  cmd: string,
  cwd?: string,
): Promise<ExecResult> => {
  try {
    const argsArray = splitArgs(cmd)
    const firstCmd = argsArray[0]
    const args = argsArray.slice(1)
    const command = new Deno.Command(firstCmd, {
      args,
      cwd,
      stdin: 'inherit',
      stdout: 'inherit',
      stderr: 'inherit',
    })
    const child = command.spawn()

    // Wait for the process to exit
    const status = await child.status

    if (status.success) {
      return {
        success: true,
        message: 'Process completed',
      }
    } else {
      return {
        success: false,
        message: `Process failed with code ${status.code}`,
      }
    }
  } catch (error) {
    return handleError(error)
  }
}

/**
 * Executes a command and collects its output.
 * @param cmd - The command to execute.
 * @param cwd - The working directory for the command.
 * @returns A Promise resolving to an ExecResult containing success status and output message.
 */
export const exec = async (cmd: string, cwd?: string): Promise<ExecResult> => {
  try {
    const argsArray = splitArgs(cmd)
    const firstCmd = argsArray[0]
    const args = argsArray.slice(1)
    const command = new Deno.Command(firstCmd, {
      args,
      cwd,
    })

    // Create a subprocess and collect its output
    const { code, stdout, stderr } = await command.output()

    if (code !== 0) {
      const errorOutput = new TextDecoder().decode(stderr).trim()
      return {
        success: false,
        message: errorOutput,
      }
    }

    const output = new TextDecoder().decode(stdout).trim()

    return {
      success: true,
      message: output,
    }
  } catch (error) {
    return handleError(error)
  }
}

/**
 * Handles errors by logging them and returning an ExecResult.
 * @param error - The error to handle.
 * @returns An ExecResult with success status and error message.
 */
const handleError = (error: unknown): ExecResult => {
  if (error instanceof Error) {
    console.error(error)
    return {
      success: false,
      message: error.message,
    }
  } else {
    return {
      success: false,
      message: 'An unknown error occurred',
    }
  }
}

/**
 * Executes an SSH command on a remote server synchronously.
 *
 * This function constructs and executes an SSH command using a specified RSA key,
 * user credentials, and host address. It navigates to the specified working directory (cwd),
 * sources the user profile, and executes the provided command.
 *
 * @param {string} user - The SSH username to use for connection.
 * @param {string} host - The hostname or IP address of the remote server.
 * @param {string} rsaKeyPath - The path to the RSA private key for authentication.
 * @param {string} execCmd - The command to execute on the remote server.
 * @param {string} [cwd='~'] - The working directory on the remote server. Defaults to the home directory.
 * @returns {Promise<ExecResult>} - A Promise that resolves to an object containing the success status and message.
 *
 * @example
 * // Executes 'solana --version' command on a remote server
 * const user = 'solv'
 * const host = '145.40.126.169'
 * const rsaKey = '~/.ssh/id_rsa'
 * const execCmd = `solana --version`
 *
 * await sshCmd(user, host, rsaKey, execCmd)
 */
export const sshCmd = async (
  user: string,
  host: string,
  rsaKeyPath: string,
  execCmd: string,
  cwd = '~',
): Promise<ExecResult> => {
  const cmd =
    `ssh -i ${rsaKeyPath} -o StrictHostKeyChecking=no ${user}@${host} -p 22 'cd ${cwd} && source ~/.profile && ${execCmd}'`
  return await spawnSync(cmd)
}
