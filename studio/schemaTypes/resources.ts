import {FolderIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

const resourceTypeOptions = [
  {title: 'Battle Map', value: 'map'},
  {title: 'Playlist', value: 'playlist'},
  {title: 'Soundboard', value: 'soundboard'},
  {title: 'Mini', value: 'mini'},
  {title: 'Token', value: 'token'},
  {title: 'Terrain', value: 'terrain'},
  {title: 'Item Card', value: 'itemCard'},
  {title: 'Handout', value: 'handout'},
  {title: 'Portrait', value: 'portrait'},
  {title: 'Landscape', value: 'landscape'},
  {title: 'VTT Module', value: 'vttModule'},
]

const platformOptions = [
  {title: 'Any', value: 'any'},
  {title: 'Talespire', value: 'talespire'},
  {title: 'Tabletop Simulator', value: 'tabletopSimulator'},
  {title: 'VTT', value: 'vtt'},
]

const resourceTypeTitles = Object.fromEntries(
  resourceTypeOptions.map(({title, value}) => [value, title]),
)

const platformTitles = Object.fromEntries(platformOptions.map(({title, value}) => [value, title]))

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
      name: 'name',
      title: 'Name',
      type: 'string',
      hidden: ({document}) => document?.type !== 'handout',
    }),
    defineField({
      name: 'adventure',
      title: 'Related Adventure',
      type: 'reference',
      to: [{type: 'adventures'}],
      hidden: ({document}) => document?.type !== 'handout' && document?.type !== 'playlist',
    }),
    defineField({
      name: 'material',
      title: 'Material',
      type: 'string',
      hidden: ({document}) => document?.type !== 'mini',
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
      hidden: ({document}) => document?.type !== 'map',
      options: {
        list: platformOptions,
      },
    }),
    defineField({
      name: 'entity',
      title: 'Related Entity*',
      type: 'reference',
      hidden: ({document}) =>
        document?.type !== 'mini' && document?.type !== 'portrait' && document?.type !== 'token',
      to: [{type: 'entities'}],
      validation: (rule) =>
        rule.custom((value, context) => {
          const type = context.document?.type

          if ((type === 'mini' || type === 'portrait' || type === 'token') && !value?._ref) {
            return 'This field is required when type is mini, token or portrait'
          }

          return true
        }),
    }),
    defineField({
      name: 'location',
      title: 'Related Location*',
      type: 'reference',
      hidden: ({document}) =>
        document?.type !== 'map' &&
        document?.type !== 'playlist' &&
        document?.type !== 'soundboard' &&
        document?.type !== 'terrain' &&
        document?.type !== 'landscape',
      to: [{type: 'locations'}],
      validation: (rule) =>
        rule.custom((value, context) => {
          const type = context.document?.type

          if ((type === 'map' || type === 'terrain') && !value?._ref) {
            return 'This field is required when type is ma, landscape or terrain'
          }
          return true
        }),
    }),
    defineField({
      name: 'url',
      title: 'URL*',
      description: 'Do not use direct download links. Link to the page.',
      type: 'url',
      hidden: ({document}) => document?.type === 'portrait' || document?.type === 'landscape',
      validation: (rule) =>
        rule.custom((value, context) => {
          if (
            context.document?.type !== 'portrait' &&
            context.document?.type !== 'landscape' &&
            !value
          ) {
            return 'This field is required unless type is landscape or portrait'
          }

          return true
        }),
    }),
    defineField({
      name: 'image',
      title: 'Image*',
      type: 'image',
      hidden: ({document}) => document?.type !== 'portrait' && document?.type !== 'landscape',
      validation: (rule) =>
        rule.custom((value, context) => {
          if (
            (context.document?.type === 'portrait' || context.document?.type === 'landscape') &&
            !value?.asset?._ref
          ) {
            return 'This field is required when type is portrait or landscape'
          }

          return true
        }),
    }),
    defineField({
      name: 'attribution',
      title: 'Attribution',
      type: 'string',
      hidden: ({document}) => document?.type !== 'portrait' && document?.type !== 'landscape',
    }),
  ],
  preview: {
    select: {
      type: 'type',
      entityName: 'entity.name',
      locationName: 'location.name',
      platform: 'platform',
      subtitle: 'url',
      attribution: 'attribution',
    },
    prepare({type, entityName, platform, locationName, subtitle, attribution}) {
      const platformTitle = platformTitles[platform]

      return {
        title: entityName
          ? entityName + ' ' + (platformTitle ? platformTitle + ' ' : '') + resourceTypeTitles[type]
          : locationName
            ? locationName +
              ' ' +
              (platformTitle ? platformTitle + ' ' : '') +
              resourceTypeTitles[type]
            : resourceTypeTitles[type] || 'Untitled resource',
        subtitle: type === 'portrait' ? attribution : subtitle,
      }
    },
  },
})
