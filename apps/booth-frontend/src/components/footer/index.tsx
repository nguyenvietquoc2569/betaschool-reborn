import { ReactNode } from 'react'
import styles from './style.module.css'
export const FooterApp = ({logo, copyRight, logoUrl, link}: {
  logo: ReactNode,
  copyRight: ReactNode,
  logoUrl?: string,
  link?: ReactNode
} ) => {

  return <footer className={styles.footer}>
  <div className={styles.footerLink}>{link}</div>
  <div className={styles.footerCpr}>
    <div className={styles.logoContainer}>
      <a
        href={logoUrl}
        className={styles.logoLink}
      >
        {logo}
      </a>
    </div>
    <div className={styles.copyRight}>{copyRight}</div>
  </div>
</footer>
}