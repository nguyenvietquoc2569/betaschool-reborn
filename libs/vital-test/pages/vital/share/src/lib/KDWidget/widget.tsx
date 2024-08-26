import React from 'react'
import cl from 'classnames' // eslint-disable-line
import styles from './widget.module.scss'

interface Props {
  widgetTitle: string,
  children: React.ReactNode,
  subTitle?: string
}
export const KDWidget = ({subTitle, widgetTitle, children}: Props) => {
  return <div className={cl({[styles.widget]: true})}>
  <div className={styles['widget-header']}>

    <div className={styles['title-desc']}>
      <div className={styles['title']}>
        {widgetTitle}
      </div>

      <div className={styles['description']}>{subTitle}</div>
    </div>

    <div className={styles['actions']}>
    </div>
  </div>

  <div className={styles['widget-content']}>
    {children}
  </div>
</div>
}