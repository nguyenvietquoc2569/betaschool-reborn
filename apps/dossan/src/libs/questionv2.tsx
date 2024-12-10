import { KDButton, KDDropDown, KDDropDownOption, KDTab, KDTabPanel, KDTabs } from '@betaschool-reborn/vital-test/lit-components'
import { useState } from 'react'
import { doosanQuestionData } from './questions.data'
import {PdfViewer} from './pdf-viewer'
import ReactPlayer from 'react-player'


export const QuestionPlayV2 = () => {
  const [tabSelected, setTabSelected] = useState<string>('0')
  const [questionSetSelected, setQuestionSetSelected] = useState<number>(0)

  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }: {numPages: number}) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  return <>
      <KDDropDown
        onChange={(e: any) => {
          setQuestionSetSelected(Number(e.detail.value))
          setTabSelected(String(0))
        }}
        value={String(questionSetSelected)}
      >
        <span slot="label">Select a question set</span>
        {
          doosanQuestionData.questions.map((question, index) => {
            return <KDDropDownOption value={String(index)}>{question.name}</KDDropDownOption>
          })
        }

      </KDDropDown>
      <br></br><br></br>

      <h1>{doosanQuestionData.questions[questionSetSelected].name}</h1>
      <br></br>
      {
            doosanQuestionData.questions[questionSetSelected].parts.map((part, index) => {
              return <>
                <h2>{part.name}</h2>
                {
                  part.type === 'audio' &&  
                    <ReactPlayer height={100} url={part.url} controls={true}/>
                }

                {
                  part.type !== 'audio' &&  <KDButton onClick={() => window.open(part.url, "_blank")} href='javascript:void(0)' >
                    Download PDF/Image to view or print
                  </KDButton>
                }
                <br></br>
                <br></br>
              </>
            })
          }
  </>
}