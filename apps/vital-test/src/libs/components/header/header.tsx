import { KDButton, KDHeaderFlyout, KDHeaderFlyouts, KDHeaderLink, KDHeaderUserProfile, KDIcon } from '@betaschool-reborn/vital-test/lit-components'
import './header.scss'
import { reduxSessionActionLogout, useTypedSelector } from '@betaschool-reborn/vital-test/redux'
import userAvatarIcon from '@carbon/icons/es/user--avatar/24';
import logoutIcon from '@kyndryl-design-system/shidoka-foundation/assets/svg/logout.svg';
import { useDispatch } from 'react-redux'
import { BUTTON_SIZES } from '@kyndryl-design-system/shidoka-foundation/components/button/defs';

export const Header = () => {
  const isLogin = useTypedSelector(state => state.session.isLoggedIn)
  const isLoading = useTypedSelector(state => state.session.isLoading)
  const user = useTypedSelector(state => state.session.userDetails)
  const dispatch = useDispatch()
  const logoutAction = () => {
    reduxSessionActionLogout(dispatch)
  }

  return <header className='header left-slotted child-open'>
  <a
    href=""
    className="logo-link interactive"
  >
    <img src={'https://betaschool.edu.vn/_next/image?url=%2Fimages%2Flogo-1.png&w=96&q=75'} alt={"logo"}/> 

    <span className="title">BetaSchool Management System</span>
  </a>

  <div className="header__right">
    
  </div>
  {
    user === null && <KDButton size={BUTTON_SIZES.SMALL} href='/login'>Login</KDButton>
  }
  { user!==null &&
    <KDHeaderFlyouts>
      <KDHeaderFlyout>
        <KDIcon slot='button' icon={userAvatarIcon}></KDIcon>
        <KDHeaderUserProfile
          name={user.name}
          subtitle={user.title}
          email={user.emailid}
          profileLink=""
        >
          <KDIcon icon={userAvatarIcon} /> 
        </KDHeaderUserProfile>
        <KDHeaderLink onClick={logoutAction} href='#'>
          <img src={logoutIcon}></img>
          Logout
        </KDHeaderLink>
      </KDHeaderFlyout>
    </KDHeaderFlyouts>
  }

</header>
}