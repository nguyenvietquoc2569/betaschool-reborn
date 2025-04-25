// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { QuestionPlay } from '../libs/question';
import './header.scss'
import { KDFooter, KDShell } from '@betaschool-reborn/vital-test/lit-components'
import Marquee from "react-fast-marquee";
import { QuestionPlayV2 } from '../libs/questionv2';
import { PasswordProtection, passwords } from '../libs/password';
import { useState } from 'react';

export function App() {

  const [unlock, setUnlock] = useState(false)
  const [refresh, setRefresh] = useState(0)
  const sentOut = (ok: boolean) => {
    if (ok) {
      setUnlock(true)
    } else {
      setRefresh(r => r+1)
    }
  }

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
          

          <span className="title">BỐC THĂM CUỘC THI SÁNG TẠO ROBOT QUẢNG NGÃI </span>
        </a>

        <div className="header__right">
          
        </div>
      </header>




      <main>
        {!unlock && <PasswordProtection passwords={passwords} key={refresh} sentOut={sentOut}></PasswordProtection>}
        {unlock && <QuestionPlayV2></QuestionPlayV2>}
      </main>


      <Marquee>
        <a target='_blank' href='https://www.facebook.com/photo/?fbid=1323616322212814&set=a.701347497773036'>
          Betaschool khai giảng lớp Ôn luyện Toiec với giáo viên chất lượng và học phí siêu ưu đãi 650k/tháng - xem tại đây
        </a>
      </Marquee>
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
