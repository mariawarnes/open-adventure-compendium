import {FolderIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

const resourceTypeOptions = [
  {title: 'Campaign Guide', value: 'campaignGuide'},
  {title: 'Map', value: 'map'},
  {title: 'Playlist', value: 'playlist'},
  {title: 'Soundboard', value: 'soundboard'},
  {title: 'Mini', value: 'mini'},
  {title: 'Terrain', value: 'terrain'},
  {title: 'Item Card', value: 'itemCard'},
  {title: 'Handout', value: 'handout'},
  {title: 'Portrait', value: 'portrait'},
  {title: 'VTT Module', value: 'vttModule'},
]

const platformOptions = [
  {title: 'Talespire', value: 'talespire'},
  {title: 'Tabletop Simulator', value: 'tabletopSimulator'},
  {title: 'VTT', value: 'vtt'},
]

const resourceTypeTitles = Object.fromEntries(
  resourceTypeOptions.map(({title, value}) => [value, title])
)

const platformTitles = Object.fromEntries(
  platformOptions.map(({title, value}) => [value, title])
)

export const resources = defineType({
  name: 'resources',
  title: 'Resources',
  type: 'document',
  icon: FolderIcon,
  fields: [

    defineField({
      name: 'type',
      title: 'Type*',
      type: 'string',
      options: {
        list: resourceTypeOptions,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'modes',
      title: 'Modes',
      type: 'string',
      hidden: ({document}) => document?.type !== 'map' && document?.type !== 'mini',
      options: {
        list: [
          {title: 'Digital', value: 'digital'},
          {title: 'Physical', value: 'physical'},
        ],
      },
    }),
    defineField({
      name: 'material',
      title: 'Material',
      type: 'string',
      hidden: ({document}) => document?.modes !== 'physical',
      options: {
        list: [
          {title: 'Paper', value: 'paper'},
          {title: 'Plastic', value: 'plastic'},
        ],
      },
    }),
    defineField({
      name: 'platform',
      title: 'Platform',
      type: 'string',
      hidden: ({ document }) => document?.modes !== 'digital',
      options: {
        list: platformOptions,
      },
    }),
    defineField({
      name: 'entity',
      title: 'Related Entity*',
      type: 'reference',
      hidden: ({ document }) => document?.type !== 'mini' && document?.type !== 'portrait',
      to: [
        {type: 'entities'}
      ],
      validation: (rule) =>
        rule.custom((value, context) => {
          const type = context.document?.type

          if ((type === 'mini' || type === 'portrait') && !value?._ref) {
            return 'This field is required when type is mini or portrait'
          }

          return true
        }),
    }),
    defineField({
      name: 'location',
      title: 'Related Location*',
      type: 'reference',
      hidden: ({ document }) => document?.type !== 'map' && document?.type !== 'terrain',
      to: [
        {type: 'locations'}
      ],
      validation: (rule) =>
        rule.custom((value, context) => {
          const type = context.document?.type

          if ((type === 'map' || type === 'terrain') && !value?._ref) {
            return 'This field is required when type is map or terrain'
          }
          return true
        }),
    }),
    defineField({
      name: 'url',
      title: 'URL*',
      description: 'Do not use direct download links. Link to the page.',
      type: 'url',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      type: 'type',
      entityName: 'entity.name',
      locationName: 'location.name',
      platform: 'platform',
      subtitle: 'url',
    },
    prepare({type, entityName, platform, locationName, subtitle}) {
      const platformTitle = platformTitles[platform]

      return {
        title: entityName ? entityName + " " + (platformTitle ? platformTitle + " " : "") + resourceTypeTitles[type] : locationName ? locationName + " " + (platformTitle ? platformTitle + " " : "") + resourceTypeTitles[type] : resourceTypeTitles[type] || 'Untitled resource',
        subtitle,
      }
    },
  },
})
