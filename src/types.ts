export type CmdScriptParams = { [key: string]: string }

export type CmdScriptConfig = {
  command: Exclude<string, 'help'>,
  description: string,
  execute?: (params: CmdScriptParams) => void,
  children?: CmdScriptConfig[]
}