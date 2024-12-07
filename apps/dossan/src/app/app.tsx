// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { QuestionPlay } from '../libs/question';
import './header.scss'
import { KDFooter, KDShell } from '@betaschool-reborn/vital-test/lit-components'

export function App() {
  return (
    
    <div style={{margin: 'var(--kd-negative-page-gutter)'}}>
      <KDShell>
      <header className='header left-slotted child-open'>
       <a
          href=""
          className="logo-link interactive"
        >
          <img src={'assets/doosan.png'} height={68} alt='logodossan' ></img>
          <img src={'https://betaschool.edu.vn/_next/image?url=%2Fimages%2Flogo-1.png&w=96&q=75'} alt={"logo"} style={{
            marginLeft: '10px',
          }}/>
          

          <span className="title">DOOSAN - BETASCHOOL INTERNAL TOEIC EXAM PRACTICE</span>
        </a>

        <div className="header__right">
          
        </div>
      </header>




      <main>
          <QuestionPlay></QuestionPlay>
      </main>


      <KDFooter>
        <span slot="copyright">
          Copyright © 2024 Nguyen Viet Ltd. All rights reserved.
        </span>
        <span slot='logo'></span>
      </KDFooter>
      </KDShell>
    </div>
  );
}

export default App;
