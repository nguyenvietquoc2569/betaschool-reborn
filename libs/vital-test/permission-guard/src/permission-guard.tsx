import { EUserPermissions } from '@betaschool-reborn/beta-data-type'
import { useTypedSelector } from '@betaschool-reborn/vital-test/redux'
import { ReactNode, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import KError from './KError'

interface Props {
  children?: ReactNode
  permissions: EUserPermissions[]
}
export const PermissionGuard = ({
  children,
  permissions
}: Props) => {
  const session = useTypedSelector(state => state.session)
  const navigate = useNavigate()
  const [allow, setAllow] = useState<boolean | null>(null)

  useEffect(() => {
    if (!session.isLoggedIn || !session.userDetails) {
      navigate(`/login?RETURNURL=${encodeURIComponent(window.location.href)}`)
    }
  }, [])
  
  useEffect(() => {
    let isAllowed = true
    for (const per of permissions) {
      if (!session.userDetails?.permissions.includes(per)) {
        isAllowed = false
      }
    }
    setAllow(isAllowed)
  }, [])
  
  if (allow === null) {
    return <></>
  } else {
    if ((allow || session.userDetails?.permissions.includes(EUserPermissions.GLOBAL))) {
      return <>{children}</>
    } else {
      return <><KError></KError></>
    }
  }
}