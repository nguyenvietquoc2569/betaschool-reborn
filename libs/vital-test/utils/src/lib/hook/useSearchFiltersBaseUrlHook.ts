import { useSearchParams } from "react-router-dom"
import { useCallback, useMemo } from 'react'


export const useSearchFiltersBaseUrlHook = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const search = useMemo(() => {
    return searchParams.get('search') ? decodeURIComponent(searchParams.get('search') as string) : ''
  }, [searchParams])

  const filters: Array<string> = useMemo(() => {
    if (!searchParams.get('filters')) {
      return []
    }

    return (searchParams.get('filters') as string)?.split(';')

  }, [searchParams])

  const setQuery = useCallback(async (
    search: string,
    filters: Array<string>,
  ): Promise<void> => {
    const filtersString = filters?.length ? filters.join(';').toString() : ''

    setSearchParams({
      ...(search? {search}: {}),
      ...(filters? {filters: filtersString}: {}),
    })


  }, [setSearchParams])

  /**
   * Add or remove checked filters
   */
  const toggleFilter = useCallback((
    data: string
  ): void => {

    const currentFilters = [...filters]
    // Remove a single filter (from CategoryTags)
    if (currentFilters.includes(data)) {
      setQuery(search, currentFilters.filter(x => x!==data))
    } else {
      setQuery(search, [...currentFilters, data])
    }
    

  }, [filters, setQuery, search])

  const setFilter = useCallback((data: Array<string>) => {
    setQuery(search, data)
  }, [setQuery, search])

  return {
    filters,
    search,
    setQuery,
    toggleFilter,
    setFilter
  }
}
