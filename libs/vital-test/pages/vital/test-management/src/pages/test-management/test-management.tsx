import { PermissionGuard } from '@betaschool-reborn/vital-test/permission-guard';

import { EUserPermissions, EVTApproveStatus, IVTProblem, IVTTagModal } from '@betaschool-reborn/beta-data-type';
import { useLangContext } from '@betaschool-reborn/vital-test/multiple-language';
import { Fragment, useEffect, useState } from 'react';
import { getBaseUrlForServiceFromFrontend, LoadingScreen, SecurePost, useDebounce, useSearchFiltersBaseUrlHook } from '@betaschool-reborn/vital-test/utils';
import { FilterBox, KDButton, KDIcon, KDOverflowMenu, KDOverflowMenuItem, KDPagination, KDTable, KDTableContainer, KDTag, KDTagGroups, KDTBody, KDTFooter, KDTHeader, KDTTd, KDTTh, KDTTr, Textbox } from '@betaschool-reborn/vital-test/lit-components';
import searchIcon from '@carbon/icons/es/search/24'
import addIcon from '@carbon/icons/es/add--large/24'
import redreshIcon from '@carbon/icons/es/renew/24'
import { BUTTON_ICON_POSITION, BUTTON_KINDS, BUTTON_SIZES } from '@kyndryl-design-system/shidoka-foundation/components/button/defs'
import filterRemoveIcon from '@carbon/icons/es/close--filled/16'
import { reduxCommonActionShowNotification } from '@betaschool-reborn/vital-test/redux';
import { useDispatch } from 'react-redux';
import { FilterModalV2 } from '@betaschool-reborn/vital-test/pages/vital/share';

export const TestManagement = () => {
  const {ttt} = useLangContext()
  const [isLoading, setLoading] = useState(false)
  const dispatch = useDispatch()

  const {
    toggleFilter,
    setQuery,
    filters,
    search,
    setFilter
  } = useSearchFiltersBaseUrlHook()

  const [extraTags, setExtraTags] = useState<IVTTagModal>([])
  const [searchTrigger, setSearchTrigger] = useState<boolean>(true)
  const [searchText, setSearchText] = useState<string>(search)
  const [questions, setQuestion] = useState<Array<IVTProblem>>([])
  const [perPage, setPerPage] = useState(10)
  const [pagination, setPagination] = useState<{
    page: number,
    count: number
  }>({
    page: 0,
    count: 0
  })
  
  const onFilterChange = (newFilters: Array<string>) => {
    setFilter([...new Set(newFilters)])
  }

  useDebounce(() => {
    setQuery(searchText, filters)
  }, [searchText], 1000)

  useEffect(() => {
    setPagination({
      page: 0,
      count: 0
    })
    setSearchTrigger(!searchTrigger)
  }, [search, filters])

  useDebounce(() => {
    setLoading(true)
    SecurePost(getBaseUrlForServiceFromFrontend(), {
      url: '/api/v1/vital-test/exam/get-working',
      data: {
        page: pagination.page,
        perPage,
        text: search,
        tags: filters
      }
    }).then(data => {
      setLoading(false)
      if (data.status === 200) {
        if (data.data.code === 200) {
          setQuestion(data.data.data)
          setPagination({
            count: data.data.pagination.count,
            page: pagination.page
          })
        }
        if (data.data.code === 404) {
          setQuestion([])
          setPagination({
            count: 0,
            page: 0
          })
          reduxCommonActionShowNotification(dispatch, {
            ...{
              text: '',
              title: '',
              type: 'success',
              shown: false
            },
            text: data.data.error,
            title: 'Get Question error',
            type: 'danger',
          })
        }
      }
    }).catch((e) => {
      setLoading(false)
      setQuestion([])
      setPagination({
        count: 0,
        page: 0
      })
      reduxCommonActionShowNotification(dispatch, {
        ...{
          text: '',
          title: '',
          type: 'success',
          shown: false
        },
        text: e.toString(),
        title: 'Get Question error',
        type: 'danger',
      })
    })
  }, [searchTrigger], 300)

  useEffect(() => {
    SecurePost(getBaseUrlForServiceFromFrontend(), {
      url: '/api/v1/vital-test/exam/getTags',
    }).then(data => {
      // setTagLoading(false)
      if (data.status === 200) {
        if (data.data.code === 200) {
          const customTags: Array<string> = data.data.data
          setExtraTags([
            {
              title: ['Tag tuỷ chỉnh', 'Custom tag'],
              id: 0,
              data: customTags.map(t => ({
                tag: t,
                lang: [t, t]
              }))
            },
            ...data.data.suggestExamTags
          ])
        }
        if (data.data.code === 404) {
          setExtraTags([])
          reduxCommonActionShowNotification(dispatch, {
            ...{
              text: '',
              title: '',
              type: 'success',
              shown: false
            },
            text: data.data.error,
            title: 'getTheTags error',
            type: 'danger',
          })
        }
      }
    }).catch((e) => {
      // setTagLoading(false)
      setExtraTags([])
      reduxCommonActionShowNotification(dispatch, {
        ...{
          text: '',
          title: '',
          type: 'success',
          shown: false
        },
        text: e.toString(),
        title: 'getTheTags error',
        type: 'danger',
      })
    })
  }, [])

  return (
    <PermissionGuard permissions={[EUserPermissions.VITALTESTRUNNER, EUserPermissions.VITALTESTEDITOR]}>
      <h1>{ttt('Quản lý Đề thi', 'Test Management')}</h1>
      {
        isLoading && <LoadingScreen></LoadingScreen>
      }
      <br />
      {
        !isLoading && <>
          <h2>{ttt('Danh sách kỳ thi', 'Exam')}</h2>
          <FilterBox>
            <Textbox
              placeholder={ttt('Tìm kiếm', 'Search')}
              size='sm'
              hideLabel
              iconRight={false}
              iconSlotted={true}
              value={searchText}
              inputChange={(e: any) => { setSearchText(e.detail.value) }}
              // @on-input=${(e: any) => this._handleSearch(e)}
            >
              <KDIcon slot='icon' icon={searchIcon}></KDIcon>
              {ttt('Tìm kiếm', 'Search')}
            </Textbox>

            <FilterModalV2 onChange={onFilterChange} defaultFilter={filters} tags={extraTags} ></FilterModalV2>

            <KDButton
              kind={BUTTON_KINDS.TERTIARY}
              size={BUTTON_SIZES.SMALL}
              iconPosition={BUTTON_ICON_POSITION.LEFT}
              slot='actions'
              onClick={() => {
                setSearchTrigger(!searchTrigger)
              }}
            >
              <KDIcon
                slot='icon'
                icon={redreshIcon}
              ></KDIcon>
              {ttt('Làm mới', 'Refresh')}
            </KDButton>
            <KDTagGroups
              slot='tags'
              filter={true}
              limitTags={true}
              textStrings={{
                showAll : ttt('Xem thêm', 'Show all'),
                showLess : ttt('Ẩn bớt', 'Show less')
              }}
            >
              {
                filters.map((filter: string) => {
                  return <Fragment key={filter}>
                   
                    <KDTag
                      noTruncation={true}
                      key={filter}
                      tagColor={!filter.includes('::') ? 'spruce' : 'cat03'}
                      data-testid='tag'
                      onClick={() => toggleFilter(filter)}
                      label={filter}
                    >
                    </KDTag>
                 
                  </Fragment>
                })
              }
            </KDTagGroups>
            <KDButton
              slot='tags'
              kind={BUTTON_KINDS.TERTIARY}
              size={BUTTON_SIZES.SMALL}
              iconPosition={BUTTON_ICON_POSITION.RIGHT}
              onClick={() => setQuery(search, [])}
            >
              <KDIcon slot='icon' icon={filterRemoveIcon}></KDIcon>
              {ttt('Xoá bộ lọc', 'clear filter')}
            </KDButton>
          </FilterBox>
          <br />
          </>
      }
    </PermissionGuard>
  );
}
