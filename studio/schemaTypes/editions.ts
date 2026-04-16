import {VersionsIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const editions = defineType({
  name: 'editions',
  title: 'Editions',
  type: 'document',
  icon: VersionsIcon,
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
