import {dirname, resolve} from 'node:path'
import {fileURLToPath} from 'node:url'
import {defineCliConfig} from 'sanity/cli'
import {loadEnv} from 'vite'

const studioDir = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(studioDir, '..')
const env = loadEnv(process.env.NODE_ENV ?? 'development', rootDir, '')

function requireEnvValue(name: string, value: string | undefined) {
  const trimmed = value?.trim()

  if (trimmed) {
    return trimmed
  }

  throw new Error(`Missing Sanity configuration. Set ${name} in the repo root env file.`)
}

const projectId = requireEnvValue(
  'SANITY_STUDIO_PROJECT_ID',
  env.SANITY_STUDIO_PROJECT_ID ?? process.env.SANITY_STUDIO_PROJECT_ID,
)

const dataset =
  env.SANITY_STUDIO_DATASET?.trim() || process.env.SANITY_STUDIO_DATASET?.trim() || 'production'

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  deployment: {
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  },
})
