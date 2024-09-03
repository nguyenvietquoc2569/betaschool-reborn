import '@kyndryl-design-system/shidoka-foundation/css/grid.css'
import { useLangContext } from '@betaschool-reborn/vital-test/multiple-language';
import styles from './mainpage.module.scss';
import { useNavigate } from 'react-router-dom';

/* eslint-disable-next-line */
export interface MainpageProps {}

export function Mainpage(props: MainpageProps) {
  const {ttt} = useLangContext()
  const navigate = useNavigate()
  return (
    <div className='kd-grid'>
      <div className='kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-6 kd-grid__col--xl-6 kd-grid__col--max-6'>
        <button
          onClick={() => { navigate("/scoring", { replace: true }) }}
          className={`${styles['kd-btn--primary-app']} ${styles['kd-btn--large']}`}><h1>{ttt('Chấm bài tập', 'Submit a test')}</h1></button>
      </div>
      <div className='kd-grid__col--sm-4 kd-grid__col--md-4 kd-grid__col--lg-6'>
        <button disabled className={`${styles['kd-btn--primary-app']} ${styles['kd-btn--large']}`}>abcd</button>
      </div>
      
    </div>
  );
}

export default Mainpage;
