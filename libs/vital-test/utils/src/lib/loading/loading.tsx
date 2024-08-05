import styles from './loading.module.css'
import ellipse from './Ellipse.png'

export const LoadingScreen = () => {
  return <div className={styles.full}>
    <div className={styles.container}>
      <img src={ellipse} className={styles.loading} alt='loading circle image'></img>
    </div>
  </div>
}