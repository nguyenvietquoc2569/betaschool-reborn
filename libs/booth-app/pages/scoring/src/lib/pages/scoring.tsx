import { useState } from 'react';
import styles from './scoring.module.scss';
import { GuideScreen } from '../components/guide-screen/guide-screen';
import { CaptureScreen } from '../components/capture/capture';
import { getBaseUrlForServiceFromFrontend, SecurePost } from '@betaschool-reborn/vital-test/utils';

/* eslint-disable-next-line */
export interface ScoringProps {}

enum EStage {
  guideScreen,
  capture,
  uploading,
  result
}
export function Scoring(props: ScoringProps) {
  const [stage, setStage] = useState<EStage>(EStage.capture)

  const scoreAAnswerSheet = (answerSheet: string) => {
    setStage(EStage.uploading)
    SecurePost(getBaseUrlForServiceFromFrontend(), {
      url: '/api/v1/vital-test/answersheet/upload',
      data: {
        base64: answerSheet
      }
    }).then(data => {
      if (data.status === 200) {
        console.log(data)
      }
      setStage(EStage.capture)
    }).catch((e) => {
      console.log(e.toString())
    })
  }
  return (
    <div className={styles['container']}>
      {
        stage===EStage.capture && <CaptureScreen score={scoreAAnswerSheet}></CaptureScreen>
      }
      {
        stage===EStage.uploading && <GuideScreen></GuideScreen>
      }
    </div>
  );
}

export default Scoring;
