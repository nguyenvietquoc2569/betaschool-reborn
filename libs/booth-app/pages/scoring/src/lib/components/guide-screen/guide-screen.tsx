import { useLangContext } from '@betaschool-reborn/vital-test/multiple-language'
import gif from './place.gif'
import styles from './style.module.css'
import { KDButton } from '@betaschool-reborn/vital-test/lit-components'
import { BUTTON_SIZES } from '@kyndryl-design-system/shidoka-foundation/components/button/defs'
export const GuideScreen = () => {
  const {ttt} = useLangContext()
  return <>
    <h3>{ttt('Vui lòng đặt Answer Sheet vào khay đọc bài', 'Please place the answer sheet to the reading place')}</h3>
    <img src={gif} className={styles.img} alt="Scanner GIF"></img>
    
    <KDButton size={BUTTON_SIZES.LARGE}>{ttt('Tờ trả lời đã ở trong khay', 'The answer sheet was in the place')}</KDButton>
  </>
}