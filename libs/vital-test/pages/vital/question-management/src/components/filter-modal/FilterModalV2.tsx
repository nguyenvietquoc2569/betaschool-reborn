import React, {useCallback, useEffect, useState} from 'react'
import filterIcon from '@carbon/icons/es/filter/20'


import styles from './filter-modalV2.module.css'
import { KDAccordion, KDAccordionItem, KDCheckboxGroup, KDCheckbox, ModalBox, KDButton, KDIcon } from '@betaschool-reborn/vital-test/lit-components'
import { BUTTON_ICON_POSITION, BUTTON_KINDS, BUTTON_SIZES } from '@kyndryl-design-system/shidoka-foundation/components/button/defs'
import { getBaseUrlForServiceFromFrontend, SecurePost, useSearchFiltersBaseUrlHook } from '@betaschool-reborn/vital-test/utils'
import { useLangContext } from '@betaschool-reborn/vital-test/multiple-language'
import { useDispatch } from 'react-redux'
import { reduxCommonActionShowNotification } from '@betaschool-reborn/vital-test/redux'
import { IVTTagModal } from '@betaschool-reborn/beta-data-type'

export const FilterModalV2 = () => {
  const {
    filters,
    setFilter
  } = useSearchFiltersBaseUrlHook()
  const dispatch = useDispatch()

  const [checkedOptions, setCheckedOptions] = useState<Array<string>>(filters)
  const [renderInit, setRenderInit] = useState<number>(0)
  const {ttt} = useLangContext()
  const [tags, setTags] = useState<Array<string>>([])
  const [extraTags, setExtraTags] = useState<IVTTagModal>([])

  useEffect(() => {
    SecurePost(getBaseUrlForServiceFromFrontend(), {
      url: '/api/v1/vital-test/getTags',
    }).then(data => {
      // setTagLoading(false)
      if (data.status === 200) {
        if (data.data.code === 200) {
          setTags(data.data.data)
          setExtraTags(data.data.extraTags)
        }
        if (data.data.code === 404) {
          setTags([])
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
      setTags([])
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

  useEffect(() => {
    setCheckedOptions(filters)
  }, [filters])


  const onModalClose = useCallback((e: any) => {
    const isOk = (e as  {detail: {returnValue: 'ok' | 'cancel'}}).detail.returnValue === 'ok'
    setRenderInit(renderInit + 1) // force rerender the Accodion
    if (isOk) {
      setFilter(checkedOptions)
    } else {
      setFilter(filters) // cancel
      // setFilter([]) // clear all
      setCheckedOptions(filters)
    }
  }, [filters, renderInit, checkedOptions, setFilter])

  const onCheckBoxClick = (e: any, tagsExcluded: Array<string>) => {
    setCheckedOptions([...checkedOptions.filter(t => !tagsExcluded.includes(t)), ...[...new Set<string>(e.detail.value)]])
  }

  return <ModalBox
      size='lg'
      titleText={ttt('Tags', 'Tags')}
      onClose={onModalClose}
      okText={ttt('Lọc', 'Filter')}
      cancelText={ttt('Huỷ', 'Cancel')}
      // okDisabled={checkedOptions.reduce(((count, catagory) => (count + catagory.options.length)), 0) === 0}
    >
      <div 
        className={styles.buttonWrapper} 
        slot='anchor'>
        <KDButton
          kind={BUTTON_KINDS.TERTIARY}
          size={BUTTON_SIZES.SMALL}
          iconPosition={BUTTON_ICON_POSITION.LEFT}
          data-testid='button-filter-modal'
        >
          {ttt('Bộ Lọc', 'Filter')}
          <KDIcon
            slot='icon'
            icon={filterIcon}
          ></KDIcon>
        </KDButton>
        { !!filters.length && <div className={styles.circle} />}
      </div>

      <KDAccordion
        expandLabel={ttt('Mở rộng','Expand')}
        collapseLabel={ttt('Đóng Thẻ','Collapse')}
        filledHeaders 
        compact key={'catalog_' + renderInit}>
          <KDAccordionItem
          >
            <span slot='title'>
                Tags
            </span>
            <div slot='body'>
              <KDCheckboxGroup
                name={'tags'}
                hideLegend
                selectAll
                filterable
                value={checkedOptions}
                onChange={(e: any) => onCheckBoxClick(e, tags)}

                textStrings={{
                  selectAll:ttt('Chọn tất cả', 'Select All'),
                  showMore: ttt('Hiện thêm', 'Show more'),
                  showLess:  ttt('Ẩn bớt', 'Show less'),
                  search:  ttt('Tìm kiếm', 'search'),
                }}
              >
                <span slot='label'>Tags</span>
                {
                  tags.map((option) => {
                    return <KDCheckbox value={option} key={option}>
                      {option}
                    </KDCheckbox>
                  })
                }
              </KDCheckboxGroup>
            </div>
          </KDAccordionItem>
          {
            (extraTags).map(tagList => <KDAccordionItem
            >
              <span slot='title'>
                {ttt(...tagList.title)}
              </span>
              <div slot='body'>

                <KDCheckboxGroup
                  name={'tags'}
                  hideLegend
                  selectAll
                  filterable
                  value={checkedOptions.filter(t => tagList.data.map(x => x.tag).includes(t))}
                  onChange={(e: any) => onCheckBoxClick(e, tagList.data.map(x => x.tag))}

                  textStrings={{
                    selectAll:ttt('Chọn tất cả', 'Select All'),
                    showMore: ttt('Hiện thêm', 'Show more'),
                    showLess:  ttt('Ẩn bớt', 'Show less'),
                    search:  ttt('Tìm kiếm', 'search'),
                  }}
                >
                  <span slot='label'>Tags</span>
                  {
                    tagList.data.map((option) => {
                      return <KDCheckbox value={option.tag} key={option.tag}>
                        {ttt(...option.lang)}
                      </KDCheckbox>
                    })
                  }
                </KDCheckboxGroup>

              </div>
            </KDAccordionItem>)
          }
      </KDAccordion>
      

    </ModalBox>
}
