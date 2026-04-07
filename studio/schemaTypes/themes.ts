import {TagIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const themes = defineType({
  name: 'themes',
  title: 'Themes',
  type: 'document',
  icon: TagIcon,
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
    defineField({
      name: 'description',
      type: 'text',
    }),
  ]
})
