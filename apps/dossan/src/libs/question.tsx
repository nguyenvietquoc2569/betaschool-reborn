import { KDTab, KDTabs } from '@betaschool-reborn/vital-test/lit-components'
import { useState } from 'react'

export const QuestionPlay = () => {
  const [tabSelected, setTabSelected] = useState<string>('0')
  return <div>
     <KDTabs
      tabSize='md'
      tabStyle='contained'
      onChange={(e: any) => {
        setTabSelected(e.detail.selectedTabId)
      }}
    >

        <KDTab slot='tabs' id={String(0)} selected={tabSelected===String(0)}>
          Part 0
        </KDTab>
        <KDTab slot='tabs' id={String(1)} selected={tabSelected===String(1)}>
          Part 1
        </KDTab>
    </KDTabs>
  </div>
}