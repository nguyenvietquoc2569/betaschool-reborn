// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { QuestionPlay } from '../libs/question';
import './header.scss'
import { KDFooter, KDShell } from '@betaschool-reborn/vital-test/lit-components'
import Marquee from "react-fast-marquee";
import { QuestionPlayV2 } from '../libs/questionv2';
import { PasswordProtection, passwords } from '../libs/password';
import { useState } from 'react';
import { BocTham } from '../libs/spkt/boctham';

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
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRY8hrOqKKV1GeWf7b_YZ93kNqj_gSEsi0Hjg&s" height={68} alt='logodossan' ></img>
          <img src={'https://scontent-hkg1-1.xx.fbcdn.net/v/t39.30808-6/474488971_1333705871378720_7009368911692003946_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=cXr7KBPRNu0Q7kNvwHC5TEi&_nc_oc=Adn4uUvaIvUBFF9-FTkN8A_R-s71f3ZPvte6A6jI5uiNJGEuCMlyhkshK8zFDhuO__g&_nc_zt=23&_nc_ht=scontent-hkg1-1.xx&_nc_gid=ICS3jYn2NN-1HbIUYBojQg&oh=00_AfE6hetVsxkt5nGv3NKTLYpR53n8dvCMyBfnuM0VKvQNGA&oe=6810A5CE'} alt={"logo"} style={{
            marginLeft: '10px',
          }}/>
          

          <span className="title">BỐC THĂM CUỘC THI SÁNG TẠO ROBOT QUẢNG NGÃI 2025</span>
          &nbsp; --- <img src={'https://betaschool.edu.vn/_next/image?url=%2Fimages%2Flogo-1.png&w=96&q=75'} alt={"logo"} style={{
            marginLeft: '10px',
          }}/> Hỗ trợ
        </a>

        <div className="header__right">
          
        </div>
      </header>




      <main>
        <BocTham></BocTham>
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
