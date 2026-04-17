import {ComponentIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

const entityKindOptions = [
  {title: 'Character Template', value: 'character'},
  {title: 'Creature Template', value: 'creature'},
  {title: 'Location Template', value: 'location'},
  {title: 'Object Template', value: 'object'},
  {title: 'Other Template', value: 'other'},
]

const entityKindTitles = Object.fromEntries(
  entityKindOptions.map(({title, value}) => [value, title]),
)

export const entities = defineType({
  name: 'entities',
  title: 'Entities',
  type: 'document',
  icon: ComponentIcon,
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'name'},
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      kind: 'kind',
    },
    prepare({title, kind}) {
      return {
        title,
        subtitle: entityKindTitles[kind] || 'Entity',
      }
    },
  },
})
