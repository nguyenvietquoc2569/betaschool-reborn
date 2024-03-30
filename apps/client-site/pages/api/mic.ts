import Cookies from 'cookies'
import {sp, getIdpByDomain} from '../../middleware/idp'
import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookies = new Cookies(req, res)
  const {body} = req
  
  if (!body) {
    res.json({error: 'this is saml, please connect support with code 1989'})
    return
  }

  const {SAMLRequest, RelayState, username} = body
  if (!(SAMLRequest && RelayState && username)) {
    res.json({error: 'this is saml, please connect support with code 1989'})
    return
  }

  if (!getIdpByDomain(username.split('@')[1].toLowerCase())) {
    res.json({error: 'we not support this domain 3432'})
    return
  }

  getIdpByDomain(username.split('@')[1].toLowerCase()).parseLoginRequest(sp, 'post', req)
  .then((parseResult: any) => {
    const domain = username.split('@')[1]
    cookies.set('domain', domain.toLowerCase(), {
      httpOnly: false
    })
    cookies.set('parseResult', JSON.stringify(parseResult), {
      httpOnly: false
    })
    cookies.set('RelayState', RelayState, {
      httpOnly: false
    })
    res.redirect(302, `/samllogin`)
  })
}