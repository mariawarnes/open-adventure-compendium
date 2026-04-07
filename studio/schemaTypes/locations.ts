import {PinIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const locations = defineType({
  name: 'locations',
  title: 'Locations',
  type: 'document',
  icon: PinIcon,
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
  ]
})
