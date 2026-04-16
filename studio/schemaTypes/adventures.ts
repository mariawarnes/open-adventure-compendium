import {BookIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const adventures = defineType({
  name: 'adventures',
  title: 'Adventures',
  type: 'document',
  icon: BookIcon,
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
      name: 'publishedAt',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
      hidden: true,
    }),
    defineField({
      name: 'authors',
      title: 'Author(s)',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'authors'}],
        },
      ],
    }),
    defineField({
      name: 'duration',
      title: 'Duration*',
      type: 'string',
      options: {
        list: [
          {title: 'One-shot', value: 'one-shot'},
          {title: 'Multi-session', value: 'multi-session'},
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'website',
      type: 'url',
    }),
    defineField({
      name: 'campaignGuide',
      type: 'url',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'edition',
      title: 'Compatible Game Edition(s)*',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'editions'}],
        },
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'recommendedLevels',
      title: 'Recommended Level(s)',
      type: 'array',
      of: [
        {
          type: 'string',
          options: {
            list: [
              {title: '1', value: '1'},
              {title: '2', value: '2'},
              {title: '3', value: '3'},
              {title: '4', value: '4'},
              {title: '5', value: '5'},
              {title: '6', value: '6'},
              {title: '7', value: '7'},
              {title: '8', value: '8'},
              {title: '9', value: '9'},
              {title: '10', value: '10'},
              {title: '11', value: '11'},
              {title: '12', value: '12'},
              {title: '13', value: '13'},
              {title: '14', value: '14'},
              {title: '15', value: '15'},
              {title: '16', value: '16'},
              {title: '17', value: '17'},
              {title: '18', value: '18'},
              {title: '19', value: '19'},
              {title: '20', value: '20'},
            ],
          },
        },
      ],
    }),
    defineField({
      name: 'recommendedPartySize',
      type: 'array',
      of: [
        {
          type: 'string',
          options: {
            list: [
              {title: '1', value: '1'},
              {title: '2', value: '2'},
              {title: '3', value: '3'},
              {title: '4', value: '4'},
              {title: '5', value: '5'},
              {title: '6', value: '6'},
              {title: '7', value: '7'},
              {title: '8', value: '8'},
            ],
          },
        },
      ],
    }),
    defineField({
      name: 'encounters',
      title: 'Encounter(s)',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'adventureEntity',
          title: 'Entity',
          fields: [
            defineField({
              name: 'encounterName',
              title: 'Name',
              type: 'string',
            }),
            defineField({
              name: 'locations',
              title: 'Location(s)',
              type: 'array',
              of: [
                {
                  type: 'reference',
                  to: [{type: 'locations'}],
                },
              ],
            }),
            defineField({
              name: 'entities',
              title: 'Entity(ies)',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'adventureEntity',
                  title: 'Entity',
                  fields: [
                    defineField({
                      name: 'entity',
                      title: 'Entity',
                      type: 'reference',
                      to: [{type: 'entities'}],
                      validation: (rule) => rule.required(),
                    }),
                    defineField({
                      name: 'name',
                      title: 'Name',
                      type: 'string',
                    }),
                    defineField({
                      name: 'quantity',
                      title: 'Quantity',
                      type: 'number',
                      initialValue: 1,
                      validation: (rule) => rule.required().integer().min(1),
                    }),
                  ],
                  preview: {
                    select: {
                      name: 'name',
                      entityName: 'entity.name',
                      quantity: 'quantity',
                    },
                    prepare({name, entityName, quantity}) {
                      return {
                        title: name || entityName || 'Untitled entity',
                        subtitle: `Quantity: ${quantity ?? 1}`,
                      }
                    },
                  },
                },
              ],
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'characters',
      title: 'Character(s)',
      description: 'Named characters who appear in the Campaign Guide.',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'entities'}],
        },
      ],
    }),
    defineField({
      name: 'locations',
      title: 'Locations(s)',
      description: 'Named locations which appear in the Campaign Guide.',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'locations'}],
        },
      ],
    }),
  ],
})
