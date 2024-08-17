import { KDButton, KDHeaderFlyout, KDHeaderFlyouts, KDHeaderLink, KDHeaderNav, KDHeaderUserProfile, KDIcon } from '@betaschool-reborn/vital-test/lit-components'
import './header.scss'
import { reduxSessionActionLogout, useTypedSelector } from '@betaschool-reborn/vital-test/redux'
import userAvatarIcon from '@carbon/icons/es/user--avatar/24';
import logoutIcon from '@kyndryl-design-system/shidoka-foundation/assets/svg/logout.svg';
import { useDispatch } from 'react-redux'
import { BUTTON_SIZES } from '@kyndryl-design-system/shidoka-foundation/components/button/defs';
import { useNavigate } from 'react-router-dom';
import { ELanguage, useLangContext } from '@betaschool-reborn/vital-test/multiple-language';
import { EUserPermissions } from '@betaschool-reborn/beta-data-type';

export const Header = () => {

  const session = useTypedSelector(state => state.session)

  const user = useTypedSelector(state => state.session.userDetails)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {ttt, current, changeLanguage} = useLangContext()

  const logoutAction = () => {
    reduxSessionActionLogout(dispatch)
  }

  const loginButtonClick = () => {
    navigate(`/login?RETURNURL=${encodeURIComponent(window.location.href)}`)
  }

  return <header className='header left-slotted child-open'>
    <KDHeaderNav>
      <KDHeaderLink href='javascript:void(0)'>
        {ttt('Bài thi trắc nghiệm', 'Multiple Choice Test')}
        {
          (session.userDetails?.permissions.includes(EUserPermissions.GLOBAL) || session.userDetails?.permissions.includes(EUserPermissions.VITALTESTEDITOR)) && 
          <KDHeaderLink slot="links" href='/vital-test/question-manage/browser?filters='>
            {ttt('Kho Câu Hỏi', 'Question Management')}
          </KDHeaderLink>
        }
        {
          (session.userDetails?.permissions.includes(EUserPermissions.GLOBAL) || session.userDetails?.permissions.includes(EUserPermissions.VITALTESTEDITOR)) && 
          <KDHeaderLink slot="links" href='/vital-test/exam-management/browser?filters='>
            {ttt('Kho bài thi', 'Exam Management')}
          </KDHeaderLink>
        }
      </KDHeaderLink>
    </KDHeaderNav>
  <a
    href=""
    className="logo-link interactive"
  >
    <img src={'https://betaschool.edu.vn/_next/image?url=%2Fimages%2Flogo-1.png&w=96&q=75'} alt={"logo"}/> 

    <span className="title">{ttt('Hệ Thống Quản Trị BetaSchool','BetaSchool Management System')}</span>
  </a>

  <div className="header__right">
    
  </div>



  {
    user === null && <KDButton size={BUTTON_SIZES.SMALL} href='' onClick={loginButtonClick}>Login</KDButton>
  }

  
    <KDHeaderFlyouts>
      <KDHeaderFlyout>
        <img
          slot='button'
          alt={'language'}
          src={current === ELanguage.VI ? '/assets/icons/flags/ic_flag_vn.svg' : '/assets/icons/flags/ic_flag_us.svg'}
        />
        <KDHeaderLink
          onClick={() => changeLanguage(ELanguage.VI)}
          href='#'
        >
          <img
            alt={'language'}
            src={'/assets/icons/flags/ic_flag_vn.svg'}
          />
          Tiếng Việt
        </KDHeaderLink>
        <KDHeaderLink
          onClick={() => changeLanguage(ELanguage.EN)}
          href='#'
        >
          <img
            alt={'language'}
            src={'/assets/icons/flags/ic_flag_us.svg'}
          />
          English
        </KDHeaderLink>
      </KDHeaderFlyout>
    { user!==null &&
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
          {ttt('Đăng xuất', 'Logout')}
        </KDHeaderLink>
      </KDHeaderFlyout>
       }
    </KDHeaderFlyouts>
 

</header>
}