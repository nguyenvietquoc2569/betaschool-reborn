import { useState } from 'react';
import styles from './scoring.module.scss';
import { GuideScreen } from '../components/guide-screen/guide-screen';

/* eslint-disable-next-line */
export interface ScoringProps {}

enum EStage {
  guideScreen,
  capture,
  uploading,
  result
}
export function Scoring(props: ScoringProps) {
  const [stage, setStage] = useState<EStage>(EStage.guideScreen)
  return (
    <div className={styles['container']}>
      {
        stage===EStage.guideScreen && <GuideScreen></GuideScreen>
      }
    </div>
  );
}

export default Scoring;
