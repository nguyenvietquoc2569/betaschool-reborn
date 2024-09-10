import { useLangContext } from '@betaschool-reborn/vital-test/multiple-language'
import gif from './scanner.gif'
import styles from './style.module.css'
// import { KDButton } from '@betaschool-reborn/vital-test/lit-components'
// import { BUTTON_SIZES } from '@kyndryl-design-system/shidoka-foundation/components/button/defs'
export const GuideScreen = () => {
  const {ttt} = useLangContext()
  return <>
    <h3>{ttt('Đang kiểm tra và chấm bài', 'Scoring your answersheet')}</h3>
    <img src={gif} className={styles.img} alt="Scanner GIF"></img>
    
    {/* <KDButton size={BUTTON_SIZES.LARGE}>{ttt('Tờ trả lời đã ở trong khay', 'The answer sheet was in the place')}</KDButton> */}
  </>
}