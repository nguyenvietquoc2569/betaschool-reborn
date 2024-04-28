
import { AuthenticationProvider } from "@microsoft/microsoft-graph-client";
import * as qs from "qs";
import axios from "axios"
import "isomorphic-fetch";
import { Client, ClientOptions } from "@microsoft/microsoft-graph-client";
import { EPeopleType, IMicrosoftAccount } from '@betaschool-reborn/beta-data-type';


let _client:  Client = null

export class ClientCredentialAuthenticationProvider implements AuthenticationProvider {
  public async getAccessToken(): Promise<string> {
      const url: string = "https://login.microsoftonline.com/" + process.env.microsoftTenant + "/oauth2/v2.0/token";
      const body: object = {
          client_id: process.env.microsoftClient_id,
          client_secret: process.env.microsoftClient_secret,
          scope: "https://graph.microsoft.com/.default",
          grant_type: "client_credentials"
      }
      try {
          const response = await axios.post(url, qs.stringify(body))
          if (response.status == 200) {
              return response.data.access_token;
          } else {
              throw new Error("Non 200OK response on obtaining token...")
          }
      }
      catch (error) {
          throw new Error("Error on obtaining token...")
      }
  }
}

function createAuthenticatedClient(): Client {
  if (!_client) {
    const clientOptions: ClientOptions = {
      defaultVersion: "v1.0",
      debugLogging: false,
      authProvider: new ClientCredentialAuthenticationProvider()
    }
    _client = Client.initWithMiddleware(clientOptions);
    setTimeout(() =>{ _client = null }, 60 * 60 * 1000)
  }
  return _client;
}

export async function createClassRoom ({subject,
  allowedPresenters='roleIsPresenter', //everyone organization roleIsPresenter organizer
  lobbyBypassSettings={"scope": "organization", isDialInBypassEnabled: false},
  allowMeetingChat = 'enabled', //disabled, limited, unknownFutureValue
  allowTeamworkReactions = true,
  participants,
  startDateTime = '2019-07-12T14:30:34.2444915-07:00',
  endDateTime = '2019-07-12T15:00:34.2464912-07:00'
}) {
  const onlineMeeting = {
    lobbyBypassSettings,
    startDateTime,
    endDateTime,
    subject: subject,
    allowedPresenters,
    allowMeetingChat,
    allowTeamworkReactions,
    participants
  };
  // console.log(participants)
  
  const client = createAuthenticatedClient();
  // https://docs.microsoft.com/en-us/graph/cloud-communication-online-meeting-application-access-policy
  // https://docs.microsoft.com/en-us/graph/api/application-post-onlinemeetings?view=graph-rest-beta&tabs=javascript
  // https://blog.thoughtstuff.co.uk/2020/09/you-can-now-create-microsoft-teams-meetings-as-an-application-without-a-users-needing-to-be-present-heres-how-to-use-application-access-policy/
  return await client.api(`/users/${process.env.microsoftDelegate}/onlineMeetings`)
    .version('beta')
    .post(onlineMeeting);
}

export const getMicrosoftUser = async (id) => {
  try {
    const client = createAuthenticatedClient();
    const response = await client.api('/users/'+id)
      .get()
    if (response.error) {
      return null
    } else {
      return response as IMicrosoftAccount
    }
  } catch (e) {
    return null
  }
}

export async function findMicsoftAccout(email) {
  const acc = await getMicrosoftUser(email)
  if (acc) {
    return acc
  }
  return null
}

export async function createAccountForStaff(doc, email: string, onPremisesImmutableIdPrefix: string) {
  // let currentMicrosoftAccount = await getAllAccounts()
  const acc = await getMicrosoftUser(email)
  
  if (acc) {
    console.log('khong the tao, account da ton tai:', acc)
    return false
  } else {
    const password = password_generator(10)
    const response = await createAccount({
      displayName: doc.fullname,
      mailNickname: email.split('@')[0],
      userPrincipalName: email,
      password: password,
      jobTitle: doc.type.includes(EPeopleType.staff) ? EPeopleType.staff : (
        doc.type.includes(EPeopleType.teacher) ? EPeopleType.teacher : (
          doc.type.includes(EPeopleType.student) ? EPeopleType.student : ''
        )
      ),
      onPremisesImmutableId: (onPremisesImmutableIdPrefix || '') + doc._id.toString()
    })
    if (response) {
      response.password = password
    }
    return response
  }
}

export const createAccount = async ({displayName, mailNickname, userPrincipalName, password,jobTitle, onPremisesImmutableId}) => {
  try {
    const client = createAuthenticatedClient();
    const user = {
      accountEnabled: true,
      displayName: displayName,
      mailNickname: mailNickname,
      userPrincipalName: userPrincipalName,
      onPremisesImmutableId: onPremisesImmutableId,
      passwordProfile: {
        forceChangePasswordNextSignIn: false,
        password: password
      },
      jobTitle
    };
    const response = await client.api('/users')
      .post(user)
    return response
  } catch (e) {
    console.log('can not create account', displayName, userPrincipalName, e)
    return false
  }
}

export async function _assignClientToGroup (doc, id) {
  assignClientToGroup({
    id: id,
    group: doc.type.includes(EPeopleType.staff) ? process.env.msfFacultyLicenseGroup : (
      doc.type.includes(EPeopleType.teacher) ? process.env.msfFacultyLicenseGroup : (
        doc.type.includes(EPeopleType.student) ? process.env.msfStudentLicenseGroup : ''
      )
    )
  })
}

export const assignClientToGroup = async ({id, group}) => {
  try {
    const client = createAuthenticatedClient();
    const directoryObject = {
      '@odata.id': `https://graph.microsoft.com/v1.0/directoryObjects/${id}`
    };
    
    
    const response = await client.api(`/groups/${group}/members/$ref`)
      .post(directoryObject);
    return response
  } catch (e) {
    console.log('can not assign to group', e)
    return false
  }
}

// async function getUsers(): Promise<any> {

//   const client = createAuthenticatedClient();

//   const request = await client.api("/users")
//       .select("id, displayName, mail")
//       .get()
//       .catch((error) => {
//           console.log(error);
//       });
//   console.log(request.value);
// }

// async function createUsers(): Promise<any> {

//   const client = createAuthenticatedClient();
//   const user = {
//       accountEnabled: true,
//       displayName: 'Adele Vance',
//       mailNickname: 'AdeleV',
//       userPrincipalName: 'AdeleV@sv.betaschool.edu.vn',
//       passwordProfile: {
//       forceChangePasswordNextSignIn: true,
//       password: 'xWwvJ]6NMw+bWH-d'
//     }
//   };

//   const request = await client.api('/users')
// 	.post(user);
//   console.log(request);
// }

// createUsers();

function password_generator( len ) {
  const length = (len)?(len):(10);
  const string = "abcdefghijklmnopqrstuvwxyz"; //to upper 
  const numeric = '0123456789';
  const punctuation = '!@#$%^&*()_+~|}{[]\:;?><,./-=';
  let password = "";
  let character = "";
  while( password.length<length ) {
    const entity1 = Math.ceil(string.length * Math.random()*Math.random());
    const entity2 = Math.ceil(numeric.length * Math.random()*Math.random());
    const entity3 = Math.ceil(punctuation.length * Math.random()*Math.random());
    let hold = string.charAt( entity1 );
      hold = (password.length%2==0)?(hold.toUpperCase()):(hold);
      character += hold;
      character += numeric.charAt( entity2 );
      character += punctuation.charAt( entity3 );
      password = character;
  }
  //password=password.split('').sort(function(){return 0.5-Math.random()}).join('');
  return password.substr(0,len);
}

