import { KDButton, KDCheckbox, KDLoader, KDTextArea, Textbox } from '@betaschool-reborn/vital-test/lit-components'
import { TextInput } from '@kyndryl-design-system/shidoka-applications/components/reusable/textInput'
import { useState } from 'react'
import { MatchGroup } from './bandau'

enum EStage {
  ESelect,
  ELoading,
  Done
}

export const BocTham = () => {
  const [list,setList] = useState<string>('')
  const [numberGroup, setNumbetGroup] = useState<number>(18)

  const [stage, setStage] = useState<EStage>(EStage.ESelect)
  const [arrayGroup, setArrayGroup] = useState<Array<Array<string>>>([])


  const handleDivide = () => {
    setStage(EStage.ELoading)
    const array = list.replace(/\n/g, ",").split(',').filter(n => !!n).map(n => n.trim())
    const ran = shuffleArray<string>(array)
    setArrayGroup(distributeArray<string>(ran, numberGroup))
    setStage(EStage.Done)
  }
  
  return <>
    {
      stage === EStage.ESelect && <>
        <KDTextArea value={list} onInput={
          ((event: any) => {
            setList(event.detail.value)
          })
        }><div>Danh sách đội</div></KDTextArea>
        <br/>
        <Textbox
          value={numberGroup} inputChange={
          ((event: any) => {
            setNumbetGroup(event.detail.value)
          })
        }><div>Số bảng</div></Textbox>
        <br/>
        <br/>
        <KDButton onClick={()=> {
          handleDivide()
        }}>Bốc thăm</KDButton>
        </>
    }
    {
      stage === EStage.ELoading && 
        <KDLoader></KDLoader>
    }
    {
      stage === EStage.Done && 
      <>
      <div style={{
        display: 'flex',
        'flexFlow': 'wrap',
        rowGap: '32px',
        columnGap: '32px'
      }}>
       {
        arrayGroup.map((group, index) => {
          return <MatchGroup groupName={`Bảng ${index}`} teams={group} ></MatchGroup>
        })
       }
       </div>
       <br/>
       <KDButton onClick={()=> {
          setStage(EStage.ESelect)
        }}>Back</KDButton>
      </>

    }

  </>
}

function shuffleArray<T>(arr: T[]): T[] {
  const result = arr.slice(); // Create a shallow copy
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function distributeArray<T>(arr: T[], n: number): T[][] {
  const result: T[][] = Array.from({ length: n }, () => []);
  arr.forEach((item, index) => {
    result[index % n].push(item);
  });
  return result;
}