import {ReactNode, useCallback, useEffect, useState} from 'react'
import filterIcon from '@carbon/icons/es/filter/20'


import styles from './filter-modalV2.module.css'
import { KDAccordion, KDAccordionItem, KDCheckboxGroup, KDCheckbox, ModalBox, KDButton, KDIcon, KDRadioButtonGroup, KDRadioButton } from '@betaschool-reborn/vital-test/lit-components'
import { BUTTON_ICON_POSITION, BUTTON_KINDS, BUTTON_SIZES } from '@kyndryl-design-system/shidoka-foundation/components/button/defs'
import { useLangContext } from '@betaschool-reborn/vital-test/multiple-language'
import { IVTTagModal } from '@betaschool-reborn/beta-data-type'

export const FilterModalV2 = ({onChange, defaultFilter, tags, label}: {
  onChange: (newFilters: Array<string>) => void,
  defaultFilter: Array<string>,
  tags: IVTTagModal,
  label?: ReactNode
}) => {

  const [checkedOptions, setCheckedOptions] = useState<Array<string>>(defaultFilter)
  const [renderInit, setRenderInit] = useState<number>(0)
  const {ttt} = useLangContext()

  useEffect(() => {
    setCheckedOptions(defaultFilter)
  }, [defaultFilter])


  const onModalClose = useCallback((e: any) => {
    const isOk = (e as  {detail: {returnValue: 'ok' | 'cancel'}}).detail.returnValue === 'ok'
    setRenderInit(renderInit + 1) // force rerender the Accodion
    if (isOk) {
      onChange([... new Set(checkedOptions)])
    } else {
      setCheckedOptions([... new Set(defaultFilter)])
    }
  }, [renderInit, checkedOptions, defaultFilter, onChange])

  const onCheckBoxClick = (e: any, tagsExcluded: Array<string>) => {
    setCheckedOptions([...checkedOptions.filter(t => !tagsExcluded.includes(t)), ...[...new Set<string>(e.detail.value)]])
  }

  const onRadioClick = (e: any, tagsExcluded: Array<string>) => {
    setCheckedOptions([...checkedOptions.filter(t => !tagsExcluded.includes(t)), ...[e.detail.value]])
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
          {label ? label : <>
            {ttt('Bộ Lọc', 'Filter')}
            <KDIcon
              slot='icon'
              icon={filterIcon}
            ></KDIcon>
          </>
          }
        </KDButton>
        { !!defaultFilter.length && !label && <div className={styles.circle} />}
      </div>

      <KDAccordion
        expandLabel={ttt('Mở rộng','Expand')}
        collapseLabel={ttt('Đóng Thẻ','Collapse')}
        filledHeaders 
        compact key={'catalog_' + renderInit}>
          {
            (tags).map(tagList => <KDAccordionItem
            >
              <span slot='title'>
                {ttt(...tagList.title)}
              </span>
              <div slot='body'>

                { !tagList.isSingleChoice &&  <KDCheckboxGroup
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
                    required: ttt('Bắt buộc', 'required'),
                    error: ttt('Lỗi', 'error'),
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
                </KDCheckboxGroup>}

                { tagList.isSingleChoice && 
                  <KDRadioButtonGroup
                    value={checkedOptions.filter(t => tagList.data.map(x => x.tag).includes(t))[0] || ''}
                    onChange={(e: any) => onRadioClick(e, tagList.data.map(x => x.tag))}>
                    
                    {
                    tagList.data.map((option) => {
                      return <KDRadioButton value={option.tag} key={option.tag}>
                        {ttt(...option.lang)}
                      </KDRadioButton>
                    })
                  }
                  </KDRadioButtonGroup>
                }

              </div>
            </KDAccordionItem>)
          }
      </KDAccordion>
    </ModalBox>
}
