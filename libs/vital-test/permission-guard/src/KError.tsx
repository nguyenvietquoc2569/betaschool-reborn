import styles from './KError.module.css'
import errorImage from './error.svg'

function KError({ ...props }) {

  return (
    <div className={styles.container}>
      <img style={{
        marginLeft: 'auto',
        marginRight: 'auto'
      }} src={errorImage}></img>
      <div className={styles.err_container}>
        <span className={styles.titleText}>
          No Permission
        </span>
        <span className={styles.subtitle}>
          Please connect to Administrator for granting the permission
        </span>
      </div>
    </div>
  )
}

export default KError
