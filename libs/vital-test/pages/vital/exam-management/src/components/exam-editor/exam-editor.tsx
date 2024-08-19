import { defaultVTExam, defaultVTExamPart, IVTExam, IVTFormError, IVTTagModal, validateVTExam } from '@betaschool-reborn/beta-data-type';
import { KDButton, KDNumberInput, KDTab, KDTabPanel, KDTabs, KDTextArea, Textbox } from '@betaschool-reborn/vital-test/lit-components';
import { useLangContext } from '@betaschool-reborn/vital-test/multiple-language';
import { FilterModalV2 } from '@betaschool-reborn/vital-test/pages/vital/share';
import { BUTTON_ICON_POSITION, BUTTON_KINDS, BUTTON_TYPES } from '@kyndryl-design-system/shidoka-foundation/components/button/defs';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux'
import CreatableSelect from 'react-select/creatable'
import Select from 'react-select'
import { getBaseUrlForServiceFromFrontend, SecurePost } from '@betaschool-reborn/vital-test/utils';
import { reduxCommonActionShowNotification } from '@betaschool-reborn/vital-test/redux';
import style from './style.module.css'

export interface ExamEditorProps {
  exam: IVTExam,
  isNew: boolean,
  onChange: (q: IVTExam) => void,
  onSubmit: (p: IVTExam) => void,
}

export function ExamEditor({exam = defaultVTExam, isNew, onChange, onSubmit}: ExamEditorProps) {
  const {ttt} = useLangContext()


  const [tags, setTags] = useState<Array<string>>([])
  const [suggestTags, setSuggestTags] = useState<IVTTagModal>([])
  // const [extraExamTags, setExtraExamTags] = useState<IVTTagModal>([])

  const [problemTags, setProblemTags] = useState<Array<string>>([])
  const [suggestProblemTags, setSuggestProblemTags] = useState<IVTTagModal>([])
  const [errors, setErrors] = useState<IVTFormError>({})

  const dispatch = useDispatch()
  const [tabSelected, setTabSelected] = useState<string>('0')

  const getTheTags = () => {
    SecurePost(getBaseUrlForServiceFromFrontend(), {
      url: '/api/v1/vital-test/exam/getTags',
    }).then(data => {
      if (data.status === 200) {
        if (data.data.code === 200) {
          setTags(data.data.data)
          setSuggestTags(data.data.suggestExamTags)
          // setExtraExamTags(data.data.extraExamTags)
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
            title: 'getExamTheTags error',
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
        title: 'getExamTheTags error',
        type: 'danger',
      })
    })
  }

  const getTheProblemTags = () => {
    SecurePost(getBaseUrlForServiceFromFrontend(), {
      url: '/api/v1/vital-test/getTags',
    }).then(data => {
      if (data.status === 200) {
        if (data.data.code === 200) {
          setProblemTags(data.data.data)
          setSuggestProblemTags(data.data.suggestTags)
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
            title: 'getExamTheTags error',
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
        title: 'getExamTheTags error',
        type: 'danger',
      })
    })
  }

  useEffect(() => {
    getTheTags()
    getTheProblemTags()
  }, [])

  const submit = () => {
    const err = validateVTExam(exam)
    if (Object.values(err).length) {
      setErrors(err)
    } else {
      onSubmit(exam)
    }
  }

  return <>
    <h1>{isNew ? ttt('Thêm một kì thi mới','Add New Exam'): ttt('Sửa một kì thi','Edit a exam')}</h1>
    <br></br>
    <h3>{ttt('Tags', 'Tags')} : <FilterModalV2
      onChange={(newTags) => {
        onChange({
          ...exam,
          tags: newTags
        })
      }}
      defaultFilter={exam.tags}
      tags={[{
        id: 0,
        title: ['Tuỳ chọn', 'Custom Tags'],
        data: (tags).map(t => ({tag: t, lang: [t,t]}))
      },...suggestTags]}
      label={ttt('(Hỗ trợ tag)', '(Tag wizards)')}
    ></FilterModalV2></h3>
    <CreatableSelect
      isMulti
      onChange={(e) => {
        onChange({
          ...exam,
          tags: e.map((e:any) => e.value)
        })
      }}
      value={exam.tags.map(v => ({ value: v, label: v }))}
    />
    {errors.tags && <span className={style.error}>{ttt(...errors.tags)}</span>}
    <br/>
    <br></br>

    <h4 slot='label'>{ttt('Tên kì thi', 'Exam name')}</h4>
    <Textbox
      size='md'
      hideLabel
      value={exam.name || ''}
      inputChange={(e: any) => { onChange({
        ...exam,
        name: e.detail.value
      })}}
      invalidText={!errors['name'] ? '' : ttt(...errors[`name`])}
    ></Textbox>
    <br></br>

    <KDTextArea style={{
      maxWidth: '800px',
      width: '100%',
      marginBottom: '24px'
    }}
      value={exam.des || ''}
      onInput={(e: any) => {
        onChange({
          ...exam,
          des: e.detail.value
        })
      }}
      invalidText={!errors['des'] ? '' : ttt(...errors[`des`])}
    ></KDTextArea>

    <br/>
    <KDButton
      type={BUTTON_TYPES.BUTTON} kind={BUTTON_KINDS.PRIMARY_APP}
      onClick={() => {
        onChange({
          ...exam,
          parts: [...exam.parts, defaultVTExamPart]
        })
      }}
    >
      {ttt('Thêm 1 phần', 'Add a part')}
    </KDButton>

    <br/>
    <br/>

    {errors.parts && <span className={style.error}>{ttt(...errors.parts)}</span>}
    <KDTabs
      tabSize='md'
      tabStyle='contained'
      onChange={(e: any) => {
        setTabSelected(e.detail.selectedTabId)
      }}
    >

    {
      exam.parts.map((part, index) => {
        return <KDTab slot='tabs' id={String(index)} selected={tabSelected===String(index)}>
          {ttt('Phần:', 'Part:')} <strong>{part.name || index}</strong>
        </KDTab>
      })
    }
    {
      exam.parts.map((part, index) => {
        return <KDTabPanel id={`${index}`} visible={tabSelected===String(index)}>
          <br/>
          <h4>{ttt('Tên ', 'Name')}</h4>
          <Textbox
            size='md'
            hideLabel
            value={part.name || ''}
            inputChange={(e: any) => { onChange({
              ...exam,
              parts: exam.parts.map((ele,i) => {
                if (i===index) {
                  return {
                    ...ele,
                    name: e.detail.value
                  }
                } else return ele
              })
            })}}
            invalidText={!errors[`parts[${index}].name`] ? '' : ttt(...errors[`parts[${index}].name`])}
          ></Textbox>
          <br></br>
          <br></br>
          <h4>{ttt('Tổng Điểm ', 'Point')}</h4>
          <KDNumberInput
            value={part.totalPoint}
            onChange={(e: any) => { 
              onChange({
                ...exam,
                parts: exam.parts.map((ele,i) => {
                  if (i===index) {
                    return {
                      ...ele,
                      totalPoint: Number(e.detail.value) 
                    }
                  } else return ele
                })
            })}}
            invalidText={!errors[`parts[${index}].totalPoint`] ? '' : ttt(...errors[`parts[${index}].totalPoint`])}
          ></KDNumberInput>
          <br></br>
          <br></br>
          {errors[`parts[${index}].tags`] && <span className={style.error}>{ttt(...errors[`parts[${index}].tags`])}</span>}
          <h3>{ttt('Tags', 'Tags')} : <FilterModalV2
            onChange={(newTags) => {
              onChange({
                ...exam,
                parts: exam.parts.map((ele,i) => {
                  if (i===index) {
                    return {
                      ...ele,
                      tags: newTags
                    }
                  } else return ele
                })
              })
            }}
            defaultFilter={part.tags}
            tags={[{
              id: 0,
              title: ['Tuỳ chọn', 'Custom Tags'],
              data: (problemTags).map(t => ({tag: t, lang: [t,t]}))
            },...suggestProblemTags]}
            label={ttt('(Hỗ trợ tag)', '(Tag wizards)')}
          ></FilterModalV2></h3>
          <Select
            isMulti
            onChange={(e) => {
              onChange({
                ...exam,
                parts: exam.parts.map((ele,i) => {
                  if (i===index) {
                    return {
                      ...ele,
                      tags: e.map(t => t.value)
                    }
                  } else return ele
                })
              })
            }}
            value={part.tags.map(v => ({ value: v, label: v }))}
            options={[
              ...problemTags.map(t => ({value: t, label: t})),
              ...suggestProblemTags.reduce((pre: Array<string>, t) => ([...pre, ...t.data.map(x => (x.tag))]), []).map(t => ({value: t, label: t}))
            ]}
          />
          <br></br>

          {exam.parts.length !== 1 && <KDButton type={BUTTON_TYPES.BUTTON} kind={BUTTON_KINDS.PRIMARY_APP} destructive={true}
            style={{
              marginRight: '8px'
            }}
            onClick={() => {
              onChange({
                ...exam,
                parts: exam.parts.filter((ele,i) => (index !== i))
              })
            }}
          >
            {ttt(`Xoá phần ${part.name || index}`, `Remove part ${part.name|| index}`)}
          </KDButton>}
          <KDButton type={BUTTON_TYPES.BUTTON} kind={BUTTON_KINDS.PRIMARY_APP}
            onClick={() => {
              window.open(`/vital-test/exam-management/partcheck?tags=${encodeURIComponent(part.tags.join(';'))}&totalPoint=${part.totalPoint}`, '_blank')?.focus();
              
            }}
          >
            {ttt('Thử nghiệm', 'Test this part')}
          </KDButton>
        </KDTabPanel>
      })
    }
    </KDTabs>
    <hr/>
    <KDButton onClick={() => {submit()}} iconPosition={BUTTON_ICON_POSITION.LEFT}>{isNew ? ttt('Thêm mới', 'Add new') : ttt('Lưu lại', 'Save')}</KDButton>
    <KDButton style={{
      marginLeft: '24px'
    }} iconPosition={BUTTON_ICON_POSITION.LEFT} kind={BUTTON_KINDS.TERTIARY} href={
      '/vital-test/exam-management/browser?filters=' + encodeURIComponent(exam.tags.join(';'))
    }>{ttt('Quay lại', 'Back to list')}</KDButton>
  </>
}