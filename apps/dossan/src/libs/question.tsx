import { KDButton, KDDropDown, KDDropDownOption, KDTab, KDTabPanel, KDTabs } from '@betaschool-reborn/vital-test/lit-components'
import { useState } from 'react'
import { doosanQuestionData } from './questions.data'
import {PdfViewer} from './pdf-viewer'
import ReactPlayer from 'react-player'


export const QuestionPlay = () => {
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

      {
        questionSetSelected !== -1 && 
        <KDTabs
          key={questionSetSelected}
          tabSize='md'
          tabStyle='contained'
          onChange={(e: any) => {
            setTabSelected(e.detail.selectedTabId)
          }}
          style={{
            width: '100%',
          }}
        >
          {
            doosanQuestionData.questions[questionSetSelected].parts.map((part, index) => {
              return <KDTab slot='tabs' id={String(index)} selected={tabSelected===String(index)}>
                {part.name}
              </KDTab>
            })
          }

          {
            doosanQuestionData.questions[questionSetSelected].parts.map((part, index) => {
              return <KDTabPanel tabId={String(index)} >
                {
                  part.type === 'pdf' &&  <PdfViewer pdfUrl={part.url} />
                }

                {
                  part.type === 'audio' &&  <ReactPlayer height={100} url={part.url} controls={true}/>
                }

                {
                  part.type === 'image' &&  <img src={part.url}/>
                }

                {
                  part.type === 'file' && <KDButton onClick={() => window.open(part.url, "_blank")} href='javascript:void(0)' >
                  Download {part.name}
                </KDButton>
                }
              </KDTabPanel>
            })
          }
        </KDTabs>
      }
      
  </>
}