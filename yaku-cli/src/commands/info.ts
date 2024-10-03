import assert from 'node:assert'
import { Command } from 'commander'
import { handleRestApiError } from '../common.js'
import { ApiClient } from '@B-S-F/yaku-client-lib'
import { connect } from '../connect.js'

export function createInfoCommand(program: Command) {
  let client: ApiClient
  program
    .command('info')
    .description('Get service info')
    .showHelpAfterError()
    .option('--only <name>', 'Get only the specified info')
    .action(async (options) => {
      try {
        assert(client, 'Client not defined, please check your configuration')
        const info = await client.getServiceInfo()
        if (options.only && options.only in info) {
          console.log((info as any)[options.only])
        } else {
          console.log(JSON.stringify(info, null, 2))
        }
      } catch (err) {
        handleRestApiError(err)
      }
    })
    .hook('preAction', async () => {
      client = (await connect()).client
    })
}
