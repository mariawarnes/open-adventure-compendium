import {JoystickIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const systems = defineType({
  name: 'systems',
  title: 'Systems',
  type: 'document',
  icon: JoystickIcon,
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
