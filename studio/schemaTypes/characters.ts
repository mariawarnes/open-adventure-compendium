import {ComponentIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const characters = defineType({
  name: 'characters',
  title: 'Characters',
  type: 'document',
  icon: ComponentIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name*',
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
      name: 'adventure',
      title: 'Adventure*',
      type: 'reference',
      to: [{type: 'adventures'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'entity',
      title: 'Base Entity',
      description: 'Optional reusable template, such as Male Human Wizard.',
      type: 'reference',
      to: [{type: 'entities'}],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      adventureName: 'adventure.name',
      entityName: 'entity.name',
    },
    prepare({title, adventureName, entityName}) {
      const subtitle = [adventureName, entityName].filter(Boolean).join(' • ')

      return {
        title,
        subtitle: subtitle || 'Adventure Character',
      }
    },
  },
})
