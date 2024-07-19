import './header.scss'
import logo from './betaschool.svg'

export const Header = () => {
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

</header>
}