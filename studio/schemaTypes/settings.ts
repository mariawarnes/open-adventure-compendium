import {EarthGlobeIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const settings = defineType({
  name: 'settings',
  title: '',
  type: 'document',
  icon: EarthGlobeIcon,
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
      name: 'themes',
      type: 'array',
        of: [
          {
            type: 'reference',
            to: [
              {type: 'themes'}
            ]
          }
        ]
    })
  ]
})
