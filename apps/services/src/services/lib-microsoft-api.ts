
import { AuthenticationProvider } from "@microsoft/microsoft-graph-client";
import * as qs from "qs";
import axios from "axios"
import "isomorphic-fetch";
import { Client, ClientOptions } from "@microsoft/microsoft-graph-client";


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