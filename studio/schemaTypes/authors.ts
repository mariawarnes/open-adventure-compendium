import { UserIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

export const authors = defineType({
  name: 'authors',
  title: 'Authors',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
    }),
  ]
})
