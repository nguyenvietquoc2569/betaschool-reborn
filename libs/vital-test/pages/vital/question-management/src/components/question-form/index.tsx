import { defaultVTProblem, EVTProblemCategory, IVTProblem, IVTTagModal, VTProblemCategoryList } from '@betaschool-reborn/beta-data-type';
import { KDButton, KDDropDown, KDDropDownOption, KDRadioButton, KDRadioButtonGroup, KDTextArea, Textbox } from '@betaschool-reborn/vital-test/lit-components';
import { useLangContext } from '@betaschool-reborn/vital-test/multiple-language';
import { ProblemQuilEditor } from '../problem-editor/qill-editor-for-problem';
import { useEffect, useState } from 'react';
import { getBaseUrlForServiceFromFrontend, SecurePost } from '@betaschool-reborn/vital-test/utils';
import { reduxCommonActionShowNotification } from '@betaschool-reborn/vital-test/redux';
import { useDispatch } from 'react-redux';
import CreatableSelect from 'react-select/creatable'
import { BUTTON_ICON_POSITION, BUTTON_KINDS } from '@kyndryl-design-system/shidoka-foundation/components/button/defs';
import { FilterModalV2 } from '../filter-modal/FilterModalV2';

export interface QuestionEditorProps {
  question: IVTProblem,
  isNew: boolean,
  onChange: (q: IVTProblem) => void,
  onSubmit: (p: IVTProblem) => void
}

export function ProblemEditor({question = defaultVTProblem, isNew, onChange, onSubmit}: QuestionEditorProps) {
  const {ttt} = useLangContext()
  const [tags, setTags] = useState<Array<string>>([])
  const [suggestTags, setSuggestTags] = useState<IVTTagModal>([])

  const dispatch = useDispatch()

  const getTheTags = () => {
    SecurePost(getBaseUrlForServiceFromFrontend(), {
      url: '/api/v1/vital-test/getTags',
    }).then(data => {
      if (data.status === 200) {
        if (data.data.code === 200) {
          setTags(data.data.data)
          setSuggestTags(data.data.suggestTags)
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
  }

  useEffect(() => {
    getTheTags()
  }, [])

  return <>
    <h1>{isNew ? ttt('Thêm một câu hỏi mới','Add New Question'): ttt('Sửa một câu hỏi','Edit New Question')}</h1>
    <br></br>
    <h3>{ttt('Tags', 'Tags')}</h3>
    <CreatableSelect
      isMulti
      onChange={(e) => {
        onChange({
          ...question,
          tags: e.map((e:any) => e.value)
        })
      }}
      value={question.tags.map(v => ({ value: v, label: v }))}
    />
    <br></br>
    <FilterModalV2
      onChange={(newTags) => {
        onChange({
          ...question,
          tags: newTags
        })
      }}
      defaultFilter={question.tags}
      tags={[{
        id: 0,
        title: ['Tuỳ chọn', 'Custom Tags'],
        data: (tags).map(t => ({tag: t, lang: [t,t]}))
      },...suggestTags]}
      label={ttt('Hỗ trợ tag', 'Tag wizards')}
    ></FilterModalV2>
    <br/><br/>
    <KDDropDown
      value={question.category}
      onChange={(e: any)=> onChange({
        ...question,
        category: e.detail.value
      })}
    >
      <span slot="label">{ttt('Phân loại', 'Category')}</span>
      {VTProblemCategoryList.map(v => (
        <KDDropDownOption value={v}>{v}</KDDropDownOption>
      ))}
    </KDDropDown>
    <br></br>
    <br></br>
    <span>{ttt('Câu hỏi', 'Question')}</span>
    <ProblemQuilEditor html={question.question} onChange={(e) => {onChange({
      ...question,
      question: e
    })}}></ProblemQuilEditor>
    <br></br>
    <KDRadioButtonGroup
      value={String(question.correctAnswerIndex)}
    >
      <h3 slot='label'>{ttt('Các Lựa chọn', 'Choices')}</h3>
      {
        Array(question.numberOfOptions).fill(0).map((_,value) => {
          return <>
            <KDRadioButton value={String(value)}
              onChange={(e: any) => {
                onChange({
                  ...question,
                  correctAnswerIndex: Number(e.detail.value)
                })
              }}
            >
              {ttt('Lựa chọn ', 'Option') + String(value)}    
            </KDRadioButton>
            <KDTextArea style={{
                maxWidth: '800px',
                width: '100%',
                marginBottom: '24px'
              }}
              onInput={(e: any) => {
                const answers = [...question.anwsers]
                answers[value] = e.detail.value
                onChange({
                  ...question,
                  anwsers: answers
                })
              }}
            ></KDTextArea>
          </>
        }) 
      }
      
    </KDRadioButtonGroup>
    <br/>
    <KDButton onClick={() => {onSubmit(question)}} iconPosition={BUTTON_ICON_POSITION.LEFT}>{isNew ? ttt('Thêm mới', 'Add new') : ttt('Lưu lại', 'Save')}</KDButton>
    <KDButton style={{
      marginLeft: '24px'
    }} iconPosition={BUTTON_ICON_POSITION.LEFT} kind={BUTTON_KINDS.TERTIARY} href={
      '/vital-test/question-manage/browser?filters=' + encodeURIComponent(question.tags.join(';'))
    }>{ttt('Huỷ Bỏ', 'Cancel')}</KDButton>
  </>
}