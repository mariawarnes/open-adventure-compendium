import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {iconPicker} from 'sanity-plugin-icon-picker'
import {structureTool} from 'sanity/structure'
import {schemaTypes} from './schemaTypes'

const projectId = import.meta.env.SANITY_STUDIO_PROJECT_ID?.trim()
const dataset = import.meta.env.SANITY_STUDIO_DATASET?.trim() || 'production'

if (!projectId) {
  throw new Error(
    'Missing Sanity configuration. Set SANITY_STUDIO_PROJECT_ID in the repo root env file.',
  )
}

export default defineConfig({
  name: 'default',
  title: 'open-adventure-compendium',
  projectId,
  dataset,
  plugins: [structureTool(), visionTool(), iconPicker()],
  schema: {
    types: schemaTypes,
  },
})
