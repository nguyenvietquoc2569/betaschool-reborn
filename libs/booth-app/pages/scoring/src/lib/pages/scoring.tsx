import { useState } from 'react';
import styles from './scoring.module.scss';
import { GuideScreen } from '../components/guide-screen/guide-screen';
import { CaptureScreen } from '../components/capture/capture';
import { getBaseUrlForServiceFromFrontend, SecurePost } from '@betaschool-reborn/vital-test/utils';
import { AnalysisScreen } from '../components/analysis/analysis';
import { AnnotateImageResponse } from '../type/gcv.type';

/* eslint-disable-next-line */
export interface ScoringProps {}

enum EStage {
  guideScreen,
  capture,
  uploading,
  analysis,
  result
}
export function Scoring(props: ScoringProps) {
  const [stage, setStage] = useState<EStage>(EStage.capture)

  const [uploadUrl, setUploadUrl] = useState<string>('')
  const [gvc, setGvc] = useState<AnnotateImageResponse>({})

  const scoreAAnswerSheet = (answerSheet: string) => {
    setStage(EStage.uploading)
    SecurePost(getBaseUrlForServiceFromFrontend(), {
      url: '/api/v1/vital-test/answersheet/upload',
      data: {
        base64: answerSheet
      }
    }).then(data => {
      if (data.status === 200) {
        setUploadUrl(data.data.data.fileUrl)
        setGvc(data.data.data.gvc[0])

        setStage(EStage.analysis)
      } else {
        setStage(EStage.capture)
      }
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
      {
        stage===EStage.analysis && <AnalysisScreen gvc={gvc} backToCapture={() => { setStage(EStage.capture)}} img={uploadUrl}></AnalysisScreen>
      }
    </div>
  );
}

export default Scoring;
