import { IVTTagModal, IVTTest } from '@betaschool-reborn/beta-data-type'
import { FilterBox, KDButton, KDIcon, KDLoader, KDOverflowMenu, KDPagination, KDTable, KDTableContainer, KDTag, KDTagGroups, KDTBody, KDTFooter, KDTHeader, KDTTd, KDTTh, KDTTr, Textbox } from '@betaschool-reborn/vital-test/lit-components'
import { useLangContext } from '@betaschool-reborn/vital-test/multiple-language'
import { reduxCommonActionShowNotification } from '@betaschool-reborn/vital-test/redux'
import { getBaseUrlForServiceFromFrontend, SecurePost, useDebounce } from '@betaschool-reborn/vital-test/utils'
import { Fragment, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import searchIcon from '@carbon/icons/es/search/24'
import { FilterModalV2 } from '@betaschool-reborn/vital-test/pages/vital/share'
import redreshIcon from '@carbon/icons/es/renew/24'
import filterRemoveIcon from '@carbon/icons/es/close--filled/16'
import { BUTTON_ICON_POSITION, BUTTON_KINDS, BUTTON_SIZES } from '@kyndryl-design-system/shidoka-foundation/components/button/defs'
import { DownloadTestButton } from '../buttons/download-test'

interface Props {
  examId: string,
}
export const TestList = ({examId}: Props) => {
  const {ttt} = useLangContext()
  const [text, setText] = useState('')
  const [tests, setTests] = useState<Array<IVTTest>>([])
  const [extraTags, setExtraTags] = useState<IVTTagModal>([])
  const [tags, setTags] = useState<Array<string>>([])
  const [perPage, setPerPage] = useState(10)
  const [isLoading, setLoading] = useState(false)
  const [searchTrigger, setSearchTrigger] = useState<boolean>(true)
  const dispatch = useDispatch()
  const [pagination, setPagination] = useState<{
    page: number,
    count: number
  }>({
    page: 0,
    count: 0
  })

  useDebounce(() => {
    setLoading(true)
    SecurePost(getBaseUrlForServiceFromFrontend(), {
      url: '/api/v1/vital-test/test/get',
      data: {
        page: pagination.page,
        perPage,
        examId,
        text,
        tags
      }
    }).then(data => {
      setLoading(false)
      if (data.status === 200) {
        if (data.data.code === 200) {
          setTests(data.data.data)
          setPagination({
            count: data.data.pagination.count,
            page: pagination.page
          })
          setExtraTags(data.data.extraTags)
        }
        if (data.data.code === 404) {
          setTests([])
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
      setTests([])
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
  }, [examId, tags, text, searchTrigger], 1000)
  return <>
    {isLoading && <KDLoader></KDLoader>}
    {!isLoading && <>
      <h2>{ttt('Danh sách đề thi', 'Tests')}</h2>
      <br/>
      <FilterBox>
        <Textbox
          placeholder={ttt('Tìm kiếm', 'Search')}
          size='sm'
          hideLabel
          iconRight={false}
          iconSlotted={true}
          value={text}
          inputChange={(e: any) => { setText(e.detail.value) }}
          // @on-input=${(e: any) => this._handleSearch(e)}
        >
          <KDIcon slot='icon' icon={searchIcon}></KDIcon>
          {ttt('Tìm kiếm', 'Search')}
        </Textbox>

        <FilterModalV2 onChange={setTags} defaultFilter={tags} tags={extraTags} ></FilterModalV2>

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
                tags.map((filter: string) => {
                  return <Fragment key={filter}>
                   
                    <KDTag
                      noTruncation={true}
                      key={filter}
                      tagColor={!filter.includes('::') ? 'spruce' : 'cat03'}
                      data-testid='tag'
                      // onClick={() => toggleFilter(filter)}
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
              onClick={() => setTags([])}
            >
              <KDIcon slot='icon' icon={filterRemoveIcon}></KDIcon>
              {ttt('Xoá bộ lọc', 'clear filter')}
            </KDButton>
      </FilterBox>
      <>
        <KDTableContainer style={{
          overflowX: 'unset'
        }}>
          <KDTable>
            <KDTHeader>
              <KDTTr>
                <KDTTh>Code</KDTTh>
                <KDTTh>{ttt('Tạo bởi', 'Created By')}</KDTTh>
                <KDTTh>{ttt('Tạo ngày', 'Created Day')}</KDTTh>
                <KDTTh></KDTTh>
              </KDTTr>
            </KDTHeader>
            <KDTBody>
              {
                tests.map((q, _i) => <KDTTr
                  >
                  <KDTTd>
                    {q.code}
                  </KDTTd>
                  <KDTTd>
                    {q.editor && <>
                      {q.editor.name} <br/>
                      <em>{q.editor.emailid }</em>
                    </>
                    }
                    {!q.editor && 
                      <em>{ ttt('Tạo từ máy', 'Created from bot') }</em>
                    }
                    
                  </KDTTd>
                  <KDTTd>
                    {new Date(q.createdByDay).toLocaleDateString()}
                  </KDTTd>
                  <KDTTd>
                    <KDOverflowMenu
                      anchorRight
                      assistiveText="Actions"
                    >
                      <DownloadTestButton id={q._id || ''} setLoading={setLoading}></DownloadTestButton>
                    </KDOverflowMenu>
                  </KDTTd>
                </KDTTr>)
              }
            </KDTBody>
            
          </KDTable>
        </KDTableContainer>
        <KDTFooter>
          <KDPagination
            pageSize={perPage}
            pageSizeOptions={[3,5,10,15,20,30,40,50]}
            count={pagination.count}
            pageNumber={pagination.page+1}

            onPageSizeChange={(e: any) => {
              setPerPage(e.detail.value)
              setPagination({
                page: 0,
                count: 0
              })
              setSearchTrigger(!searchTrigger)
            }}

            onPageNumberChange={(e: any) => {
              console.log('onPageNumberChange', e)
              setPagination({
                page: Number(e.detail.value) - 1,
                count: pagination.count
              })
              setSearchTrigger(!searchTrigger)
            }}

          />
        </KDTFooter>
      </>
    </>}
  </>
}