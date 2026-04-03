import type {FilterTokenBase, FilterTokenStrategy, FilterValue, TokenStep, ValueGroup} from '~/types/filteredSearch'
import type {Product} from '~/types/fragmentAliases'

// ---------------------------------------------------------------------------
// Shared operator types and values
// ---------------------------------------------------------------------------

export type FilterOperator = 'is' | 'is one of' | 'is not one of'

export const defaultOperators: FilterValue<FilterOperator>[] = [
  { id: 'is', label: 'is' },
  { id: 'is one of', label: 'is one of' },
  { id: 'is not one of', label: 'is not one of' },
]

// ---------------------------------------------------------------------------
// OperatorValueToken — the base token shape for operator→value strategies
// ---------------------------------------------------------------------------

export type OperatorValueToken = FilterTokenBase & {
  operator: FilterOperator
  valueId: string | string[]
  valueLabel: string | string[]
}

type GetValuesFn = (
  search: string,
  token: Partial<OperatorValueToken>,
) => FilterValue[] | ValueGroup[]

// ---------------------------------------------------------------------------
// createOperatorValueStrategy
//
// Factory for any strategy that follows the operator → value step pattern.
// Pass getValues to supply dynamic value options for the value step.
// ---------------------------------------------------------------------------

export function createOperatorValueStrategy<I, VI extends { id: string }>(
  id: string,
  label: string,
  icon: string,
  getValuesList: (item: I) => VI[],
): (getValues: GetValuesFn) => FilterTokenStrategy<I, OperatorValueToken> {
  return getValues => ({
    id,
    label,
    icon,
    steps: [
      {
        id: 'operator',
        getSelectableItems: () => ({
          values: defaultOperators,
          multiple: false,
          anyAllowed: false,
          noneAllowed: false,
        }),
        onSelect: (value, token) => ({ ...token, operator: value.id }),
        getTokenLabel: token => token.operator ?? '',
        getLabelClass: token => token.operator === 'is not one of' ? 'text-error' : 'text-muted',
        // Resetting operator also clears value fields downstream
        resetFromHere: ({ operator, valueId, valueLabel, ...rest }) => rest,
      } satisfies TokenStep<OperatorValueToken, FilterOperator>,
      {
        id: 'value',
        getSelectableItems: (search, token) => ({
          values: getValues(search, token),
          multiple: token.operator !== 'is',
          noneAllowed: true,
          anyAllowed: token.operator === 'is',
        }),
        onSelect: (value, token) => ({
          ...token,
          valueId: value.id,
          valueLabel: value.label,
        }),
        onMultiSelect: (values, token) => ({
          ...token,
          valueId: values.map(v => v.id),
          valueLabel: values.map(v => v.label),
        }),
        getTokenLabel: (token) => {
          const label = token.valueLabel
          if (!label) return ''
          return Array.isArray(label) ? label.join(', ') : label
        },
        getLabelClass: () => '',
        resetFromHere: ({ valueId, valueLabel, ...rest }) => rest,
      } satisfies TokenStep<OperatorValueToken, string>,
    ],
    initToken: () => ({ uid: crypto.randomUUID() }),
    buildToken: partial => ({ ...partial } as OperatorValueToken),
    filterFn: (item: I, token) => {
      const valueList = getValuesList(item)
      const values = Array.isArray(token.valueId) ? token.valueId : [token.valueId]
      if (token.operator === 'is' || token.operator === 'is one of') {
        const includesNone = values.includes('none')
        const includesAny = values.includes('any')

        return (includesNone && valueList.length === 0)
          || (includesAny && valueList.length > 0)
          || valueList.some(s => values.includes(s.id))
      }
      // else: "is not one of"
      return !valueList.some(s => token.valueId.includes(s.id))
    },
  })
}

// ---------------------------------------------------------------------------
// Concrete strategy factories
// ---------------------------------------------------------------------------

export const getFacetFilterStrategy = createOperatorValueStrategy(
  'tags',
  'Tag',
  'i-lucide-tag',
  (item: Product) => item.facetValues ?? [],
)
