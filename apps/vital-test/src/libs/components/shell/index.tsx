import React, { ReactNode } from 'react'
import { Header } from '../header/header'
import { KDFooter, KDShell } from '@betaschool-reborn/vital-test/lit-components'

export const BTShell: React.FC<{children: ReactNode}> = ({children}
) => {
  return <div style={{margin: 'var(--kd-negative-page-gutter)'}}>
    <KDShell>
      <Header></Header>
      <main>{children}</main>
      <KDFooter>
        <span slot="copyright">
          Copyright © 2024 Nguyen Viet Ltd. All rights reserved.
        </span>
        <span slot='logo'></span>
      </KDFooter>
    </KDShell>
  </div>
}
