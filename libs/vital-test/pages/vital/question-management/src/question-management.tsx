import { PermissionGuard } from '@betaschool-reborn/vital-test/permission-guard';
import styles from './question-management.module.scss';

import { EUserPermissions } from '@betaschool-reborn/beta-data-type';
import { useLangContext } from '@betaschool-reborn/vital-test/multiple-language';
import { Fragment, useState } from 'react';
import { LoadingScreen, useDebounce, useSearchFiltersBaseUrlHook } from '@betaschool-reborn/vital-test/utils';
import { FilterBox, KDButton, KDIcon, KDTag, KDTagGroups, Textbox } from '@betaschool-reborn/vital-test/lit-components';
import searchIcon from '@carbon/icons/es/search/24'
import addIcon from '@carbon/icons/es/add--large/24'
import { BUTTON_ICON_POSITION, BUTTON_KINDS, BUTTON_SIZES } from '@kyndryl-design-system/shidoka-foundation/components/button/defs'
import filterRemoveIcon from '@carbon/icons/es/close--filled/16'

/* eslint-disable-next-line */
export interface QuestionManagementProps {}

export function QuestionManagement(props: QuestionManagementProps) {
  const {ttt} = useLangContext()
  const [isLoading, setLoading] = useState(false)

  const {
    toggleFilter,
    setQuery,
    filters,
    search
  } = useSearchFiltersBaseUrlHook()

  const [searchText, setSearchText] = useState<string>(search)

  useDebounce(() => {
    setQuery(searchText, filters)
  }, [searchText], 1000)

  return (
    <PermissionGuard permissions={[EUserPermissions.VITALTESTEDITOR]}>
      <h1>{ttt('Quản lý câu hỏi', 'Question Management')}</h1>
      {
        isLoading && <LoadingScreen></LoadingScreen>
      }
      <br />
      {
        !isLoading && <>
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

            <KDButton
              kind={BUTTON_KINDS.TERTIARY}
              size={BUTTON_SIZES.SMALL}
              iconPosition={BUTTON_ICON_POSITION.LEFT}
              slot='actions'
              href='/vital-test/question-manage/add'
            >
              <KDIcon
                slot='icon'
                icon={addIcon}
              ></KDIcon>
              {ttt('Thêm 1 câu hỏi', 'Add new question')}
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
                      key={filter}
                      tagColor='spruce'
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
          <div></div>
        </>
      }
    </PermissionGuard>
  );
}

export default QuestionManagement;
