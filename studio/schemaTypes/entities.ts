import {ComponentIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

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
})
