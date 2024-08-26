import { defaultVTProblem, defaultVTQuestion, EVTProblemCategory, EVTQuestionType, IVTFormError, IVTProblem, IVTTagModal, validateVTQuestion, VTProblemCategoryList } from '@betaschool-reborn/beta-data-type';
import { KDButton, KDDropDown, KDDropDownOption, KDRadioButton, KDRadioButtonGroup, KDTab, KDTabPanel, KDTabs, KDTextArea, Textbox } from '@betaschool-reborn/vital-test/lit-components';
import { useLangContext } from '@betaschool-reborn/vital-test/multiple-language';
import { ProblemQuilEditor } from '../problem-editor/qill-editor-for-problem';
import { useEffect, useState } from 'react';
import { getBaseUrlForServiceFromFrontend, SecurePost } from '@betaschool-reborn/vital-test/utils';
import { reduxCommonActionShowNotification } from '@betaschool-reborn/vital-test/redux';
import { useDispatch } from 'react-redux';
import CreatableSelect from 'react-select/creatable'
import { BUTTON_ICON_POSITION, BUTTON_KINDS, BUTTON_TYPES } from '@kyndryl-design-system/shidoka-foundation/components/button/defs';
import { FilterModalV2, KDWidget } from '@betaschool-reborn/vital-test/pages/vital/share';
import style from './styles.module.css'
import { v4 as uuidv4 } from 'uuid'
import Select from 'react-select'

export interface QuestionEditorProps {
  question: IVTProblem,
  isNew: boolean,
  onChange: (q: IVTProblem) => void,
  onSubmit: (p: IVTProblem) => void,
}

export function ProblemEditor({question = defaultVTProblem, isNew, onChange, onSubmit}: QuestionEditorProps) {
  const {ttt} = useLangContext()
  const [tags, setTags] = useState<Array<string>>([])
  const [suggestTags, setSuggestTags] = useState<IVTTagModal>([])
  const [errors, setErrors] = useState<IVTFormError>({})
  const [tabSelected, setTabSelected] = useState<string>('0')

  const submit = () => {
    const err = validateVTQuestion(question)
    if (Object.values(err).length) {
      setErrors(err)
    } else {
      onSubmit(question)
    }
  }

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

    <KDWidget
      widgetTitle={ttt('Thông tin chung', 'General')}>
      <h4>{ttt('Tags', 'Tags')}</h4>
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
      {errors.tags && <span className={style.error}>{ttt(...errors.tags)}</span>}
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
    </KDWidget>
    <br/>

    <KDWidget
      widgetTitle={ttt('Cấu trúc câu hỏi', 'Question Structure')}
    >
      <KDButton onClick={() => {
        onChange({
          ...question,
          idCount: question.idCount + 1,
          questions: [
            ...question.questions,
            {
              ...defaultVTQuestion,
              name: 'Question-' + (question.idCount + 1),
              id: uuidv4()
            }
          ]
        })
      }}
      iconPosition={BUTTON_ICON_POSITION.LEFT}>{ttt('Thêm 1 câu hỏi con', 'Add a child question')}</KDButton> <br/> <br/>

      <KDTabs
        tabSize='md'
        tabStyle='contained'
        onChange={(e: any) => {
          setTabSelected(e.detail.selectedTabId)
        }}
      >
        {
          question.questions.map((part, index) => {
            return <KDTab slot='tabs' id={String(index)} selected={tabSelected===String(index)}>
              {ttt('Câu hỏi:', 'question:')} <strong>{part.name || index}</strong>
            </KDTab>
          })
        }

        {
          question.questions.map((part, index) => {
            return <KDTabPanel id={`${index}`} visible={tabSelected===String(index)}>
              <h4>{ttt('Câu', 'Question')} {`{{${index}}}`}</h4><br/>
              <h4>{ttt('Tên ', 'Name')}</h4>
              <Textbox
                size='md'
                hideLabel
                value={part.name || ''}
                inputChange={(e: any) => { onChange({
                  ...question,
                  questions: question.questions.map((ele,i) => {
                    if (i===index) {
                      return {
                        ...ele,
                        name: e.detail.value
                      }
                    } else return ele
                  })
                })}}
                invalidText={!errors[`parts[${index}].name`] ? '' : ttt(...errors[`parts[${index}].name`])}
              ></Textbox> <br/><br/>

              {/* <h4>{ttt('Loại câu hỏi', 'Question Type')}</h4>
              <Select 
                options={[
                  {value: EVTQuestionType.OPTION, label: ttt('Trắc nghiệm ABCD', 'Multiple Options')}
                ]}
                value={[{value:part.anwsers[0] || '', label: part.anwsers[0] || ''}]}
                onChange={(e) => {
                  onChange({
                    ...question,
                    questions: question.questions.map((ele,i) => {
                      if (i===index) {
                        return {
                          ...ele,
                          anwsers: [e?.value]
                        }
                      } else return ele
                    })
                  })
                }}
              ></Select> */}
              {
                part.type === EVTQuestionType.OPTION && <>
                  <h4>{ttt('Đáp án chính xác ', 'Correct Answer')}</h4>
                  <Select 
                    options={['A', 'B', 'C', 'D'].map(t => ({value: t, label: t}))}
                    value={[{value:part.anwsers[0] || '', label: part.anwsers[0] || ''}]}
                    onChange={(e) => {
                      onChange({
                        ...question,
                        questions: question.questions.map((ele,i) => {
                          if (i===index) {
                            return {
                              ...ele,
                              anwsers: [e?.value]
                            }
                          } else return ele
                        })
                      })
                    }}
                  ></Select>
                </>
              }
              {question.questions.length !== 1 && <KDButton type={BUTTON_TYPES.BUTTON} kind={BUTTON_KINDS.PRIMARY_APP} destructive={true}
                style={{
                  marginTop: '8px'
                }}
                onClick={() => {
                  setTabSelected('0')
                  onChange({
                    ...question,
                    questions: question.questions.filter((ele,i) => (index !== i))
                  })
                }}
              >
                {ttt(`Xoá phần ${part.name || index}`, `Remove part ${part.name|| index}`)}
              </KDButton>}
            </KDTabPanel>
          })
        }
      </KDTabs>



    </KDWidget>

    <br/>

    <KDWidget
      widgetTitle={ttt('Câu hỏi', 'Question')}
    >
       <ProblemQuilEditor html={question.htmlMakeUp} onChange={(e) => {
        onChange({
          ...question,
          htmlMakeUp: e
        })}}></ProblemQuilEditor>
        <br />
        <em>{ttt('Dùng {{0}} để thay thế cho câu đầu tiên của trong câu hỏi, ví dụ, thay vì viết "Câu 0:" hãy viết "Câu {{0}}:"', '')}</em> <br/>
        <em>{ttt('Dùng {{x}} để thay thế cho số thứ tự của câu hỏi tổng, Ví dụ {{x}} sẽ được thay thế cho III (3 la mã)', '')}</em>
    </KDWidget>

    <br/>
    <br/>
    <KDButton onClick={submit} iconPosition={BUTTON_ICON_POSITION.LEFT}>{isNew ? ttt('Thêm mới', 'Add new') : ttt('Lưu lại', 'Save')}</KDButton>
    <KDButton style={{
      marginLeft: '24px'
    }} iconPosition={BUTTON_ICON_POSITION.LEFT} kind={BUTTON_KINDS.TERTIARY} href={
      '/vital-test/question-manage/browser?filters=' + encodeURIComponent(question.tags.join(';'))
    }>{ttt('Huỷ Bỏ', 'Cancel')}</KDButton>
  </>
}