import { PermissionGuard } from '@betaschool-reborn/vital-test/permission-guard';
import styles from './question-management.module.scss';

import { EUserPermissions, EVTApproveStatus, IVTProblem } from '@betaschool-reborn/beta-data-type';
import { useLangContext } from '@betaschool-reborn/vital-test/multiple-language';
import { Fragment, useEffect, useState } from 'react';
import { getBaseUrlForServiceFromFrontend, LoadingScreen, SecurePost, useDebounce, useSearchFiltersBaseUrlHook } from '@betaschool-reborn/vital-test/utils';
import { FilterBox, KDButton, KDIcon, KDTable, KDTableContainer, KDTag, KDTagGroups, KDTBody, KDTHeader, KDTTd, KDTTh, KDTTr, Textbox } from '@betaschool-reborn/vital-test/lit-components';
import searchIcon from '@carbon/icons/es/search/24'
import addIcon from '@carbon/icons/es/add--large/24'
import { BUTTON_ICON_POSITION, BUTTON_KINDS, BUTTON_SIZES } from '@kyndryl-design-system/shidoka-foundation/components/button/defs'
import filterRemoveIcon from '@carbon/icons/es/close--filled/16'
import { FilterModalV2 } from './components/filter-modal/FilterModalV2';
import { reduxCommonActionShowNotification } from '@betaschool-reborn/vital-test/redux';
import { useDispatch } from 'react-redux';

/* eslint-disable-next-line */
export interface QuestionManagementProps {}

export function QuestionManagement(props: QuestionManagementProps) {
  const {ttt} = useLangContext()
  const [isLoading, setLoading] = useState(false)
  const dispatch = useDispatch()

  const {
    toggleFilter,
    setQuery,
    filters,
    search
  } = useSearchFiltersBaseUrlHook()

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


  useDebounce(() => {
    setQuery(searchText, filters)
  }, [searchText], 1000)

  useEffect(() => {
    setPagination({
      page: 0,
      count: 0
    })
  }, [search, filters])


  useEffect(() => {
    if (pagination.count!==0) {
      return
    }

    setLoading(true)
    SecurePost(getBaseUrlForServiceFromFrontend(), {
      url: '/api/v1/vital-test/get-problem',
      data: {
        page: 0,
        perPage,
        text: search,
        tags: filters
      }
    }).then(data => {
      setLoading(false)
      if (data.status === 200) {
        if (data.data.code === 200) {
          setQuestion(data.data.data)
          // setPagination({
          //   count: data.data.count,
          //   page: 0
          // })
        }
        if (data.data.code === 404) {
          setQuestion([])
          // setPagination({
          //   count: 0,
          //   page: 0
          // })
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
      // setPagination({
      //   count: 0,
      //   page: 0
      // })
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
  }, [pagination])

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
            <FilterModalV2></FilterModalV2>

            <KDButton
              kind={BUTTON_KINDS.TERTIARY}
              size={BUTTON_SIZES.SMALL}
              iconPosition={BUTTON_ICON_POSITION.LEFT}
              slot='actions'
              href={'/vital-test/question-manage/add?tags=' + encodeURIComponent(filters.join(';'))}
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
          {
            !isLoading && <KDTableContainer>
              <KDTable>
                <KDTHeader>
                  <KDTTr>
                    <KDTTh>ID</KDTTh>
                    <KDTTh>Question</KDTTh>
                    <KDTTh>Phân Loại</KDTTh>
                    <KDTTh>Tags</KDTTh>
                    <KDTTh>{ttt('Trạng thái', 'Status')}</KDTTh>
                    <KDTTh></KDTTh>
                  </KDTTr>
                </KDTHeader>
                <KDTBody>
                  {
                    questions.map(q => <KDTTr>
                      <KDTTd>
                        {q._id}
                      </KDTTd>
                      <KDTTd>
                        {q.question}
                      </KDTTd>
                      <KDTTd>
                        {q.category}
                      </KDTTd>
                      <KDTTd>
                        {q.tags.map(t => <KDTag noTruncation={true} label={t} style={{marginRight: '4px'}}></KDTag>)}
                      </KDTTd>
                      <KDTTd>
                        {q.isActive ? <KDTag noTruncation={true} label='active' tagColor='cat02' shade='dark' style={{marginRight: '4px'}}></KDTag> : <KDTag noTruncation={true} label='deactive' tagColor='cat03' shade='dark' style={{marginRight: '4px'}}></KDTag>}
                        {q.approveStatus === EVTApproveStatus.APPROVED && <KDTag noTruncation={true} label={ttt('Đã Duyệt', 'Approved')} tagColor='passed' shade='dark' style={{marginRight: '4px'}}></KDTag>}
                        {q.approveStatus === EVTApproveStatus.UNAPPROVED && <KDTag noTruncation={true} label={ttt('Chờ Duyệt', 'Waiting Approving')} tagColor='warning' shade='dark' style={{marginRight: '4px'}}></KDTag>}
                        {q.approveStatus === EVTApproveStatus.NEEDWORK && <KDTag noTruncation={true} label={ttt('Yêu cầu chỉnh sửa', 'Need work')} tagColor='failed' shade='dark' style={{marginRight: '4px'}}></KDTag>}
                      </KDTTd>
                      <KDTTd></KDTTd>
                    </KDTTr>)
                  }
                </KDTBody>
              </KDTable>
            </KDTableContainer>
          }

        </>
      }
    </PermissionGuard>
  );
}

export default QuestionManagement;
