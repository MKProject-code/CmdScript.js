#!/usr/bin/env node
import path from 'path'
import {exec} from 'child_process'
import os from 'os'

// https://github.com/xxorax/node-shell-escape/blob/master/shell-escape.js
// return a shell compatible format
function shellEscape(a: string[]) {
  return a.map(arg => {
    if (/[^A-Za-z0-9_\/:=-]/.test(arg)) {
      arg = '\'' + arg.replace(/'/g, '\'\\\'\'') + '\''
      arg = arg.replace(/^(?:'')+/g, '') // unduplicate single-quote at the beginning
      .replace(/\\'''/g, '\\\'') // remove non-escaped single-quote if there are enclosed between 2 escaped
    }
    return arg
  }).join(' ')
}

const packageJson = require(path.join(process.cwd(), 'package.json'))

if (!packageJson.cmdscript || packageJson.cmdscript.length === 0) {
  console.log('Please check your package.json and ensure the "cmdscript" field is set correctly to the path of a .js or .ts file.')
} else {
  const scriptPath = path.join(process.cwd(), packageJson.cmdscript)
  const args = process.argv.slice(2)

  const isTypeScript = scriptPath.endsWith('.ts')
  const command = isTypeScript ? `ts-node` : `node`

  checkCommandAvailability(command, (isAvailable) => {
    if (!isAvailable) {
      console.error(`Command "${command}" is not available. Check if you have the appropriate tools installed.`)
    } else {
      const escapedCommand = shellEscape([command, scriptPath, ...args])
      exec(escapedCommand, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing the command: ${error.message}`)
          return
        }
        if (stderr) {
          console.error(`Error: ${stderr}`)
          return
        }
        console.log(stdout)
      })
    }
  })
}

function checkCommandAvailability(command: string, callback: (isAvailable: boolean) => void) {
  const isWindows = os.platform() === 'win32'
  const cmd = isWindows ? ['where'] : ['command', '-v']

  const escapedCommand = shellEscape([...cmd, command])
  exec(escapedCommand, (error, stdout, stderr) => {
    if (error) {
      // console.error(`Error while checking availability of ${command}: ${error.message}`)
      callback(false)
      return
    }
    if (stderr) {
      // console.error(`Error: ${stderr}`)
      callback(false)
      return
    }
    if (stdout) {
      callback(true)
      return
    } else {
      // console.log(`Command "${command}" is not available. Check if you have the appropriate tools installed.`)
      callback(false)
      return
    }
  })
}
