import {setSchemaValidator, ServiceProvider, IdentityProvider} from 'samlify'

setSchemaValidator({
  validate: (response: string) => {
    /* implment your own or always returns a resolved promise to skip */
    return Promise.resolve('skipped');
  }
});
const metadataIdpCreate = (uri:string) =>  `<?xml version="1.0"?>
<md:EntityDescriptor xmlns:md="urn:oasis:names:tc:SAML:2.0:metadata" validUntil="2021-05-26T13:46:20Z" cacheDuration="PT1622468780S" entityID="${uri}">
  <md:IDPSSODescriptor WantAuthnRequestsSigned="false" protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
    <md:KeyDescriptor use="signing">
      <ds:KeyInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
        <ds:X509Data>
          <ds:X509Certificate>MIIDyDCCArACCQDHEza6R33MvzANBgkqhkiG9w0BAQUFADCBpTELMAkGA1UEBhMCVk4xEzARBgNVBAgMClF1YW5nIE5nYWkxETAPBgNVBAcMCEJpbmggU29uMRMwEQYDVQQKDApCZXRhc2Nob29sMRswGQYDVQQLDBJCZXRhc2Nob29sIEJpbmhTb24xEzARBgNVBAMMCkJldGFzY2hvb2wxJzAlBgkqhkiG9w0BCQEWGHF1b2NudkBiZXRhc2Nob29sLmVkdS52bjAeFw0yMTA1MjQwMTMzMTNaFw0yMjA1MjQwMTMzMTNaMIGlMQswCQYDVQQGEwJWTjETMBEGA1UECAwKUXVhbmcgTmdhaTERMA8GA1UEBwwIQmluaCBTb24xEzARBgNVBAoMCkJldGFzY2hvb2wxGzAZBgNVBAsMEkJldGFzY2hvb2wgQmluaFNvbjETMBEGA1UEAwwKQmV0YXNjaG9vbDEnMCUGCSqGSIb3DQEJARYYcXVvY252QGJldGFzY2hvb2wuZWR1LnZuMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAq3ywkPAA5r5TlcsAr37G5PfjLt5TzDsevdLMOtJG+m6l3yhXlAkhXUbbxZLb8shCmeFiG6HrmEdWnC6WafYbmUWGLgauJrxTwnQpSDw5aUiu1I1xED7HXxovqbjE8q8hvhPNSQ68dzRzc6ptGyfho25hF8pXPpkboEVlRsNHTWoGDAgg39oTJlgjkTTY2+pso8UMLWq4B5TUI5e4P2JKISQgIALUHEcDIvz7cFdAZUwuZ0djcSEcR4v0DHcaQZda7jULFCmXQOGL3+rGQWw/gY1W+cKjiaE74MaKtdCoYOsNc9zFhG/nnmZtIwibRBX7woVk3WJwGnbLUMBQyWi1PQIDAQABMA0GCSqGSIb3DQEBBQUAA4IBAQAXC4LygQ8mvPxgHUoBGfAuNoKHmAoK6p6aL5CyLwJffYEBfbvDZwZ2mO1tMAukjst9bkr9uHlcKmVU3sXyru4FG0cEt8LsqmOTwqNL7N3S+OFX6nugxpATcvC8YCMM5GzUJAZJh0MSWbSHiQpnYihHTU3erZK+xWKfr8D8nDLdFL62vElkdMVcB4IhD5NFmXfNsq7nqO9Xn+8jKjOjz/kaWY4QEVlTsZrxtfM5shuHSbJw1awdCIgZulzJ2wsv2M7gRIcomcb0vm1+Qlue8lpprCIocFdwAo0ftfcf7ZjtkMKoNhLME228qw4XwufUiBoSlkPfHbEwqGqZeGPDHEVp</ds:X509Certificate>
        </ds:X509Data>
      </ds:KeyInfo>
    </md:KeyDescriptor>
    <md:KeyDescriptor use="encryption">
      <ds:KeyInfo xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
        <ds:X509Data>
          <ds:X509Certificate>MIIDyDCCArACCQDHEza6R33MvzANBgkqhkiG9w0BAQUFADCBpTELMAkGA1UEBhMCVk4xEzARBgNVBAgMClF1YW5nIE5nYWkxETAPBgNVBAcMCEJpbmggU29uMRMwEQYDVQQKDApCZXRhc2Nob29sMRswGQYDVQQLDBJCZXRhc2Nob29sIEJpbmhTb24xEzARBgNVBAMMCkJldGFzY2hvb2wxJzAlBgkqhkiG9w0BCQEWGHF1b2NudkBiZXRhc2Nob29sLmVkdS52bjAeFw0yMTA1MjQwMTMzMTNaFw0yMjA1MjQwMTMzMTNaMIGlMQswCQYDVQQGEwJWTjETMBEGA1UECAwKUXVhbmcgTmdhaTERMA8GA1UEBwwIQmluaCBTb24xEzARBgNVBAoMCkJldGFzY2hvb2wxGzAZBgNVBAsMEkJldGFzY2hvb2wgQmluaFNvbjETMBEGA1UEAwwKQmV0YXNjaG9vbDEnMCUGCSqGSIb3DQEJARYYcXVvY252QGJldGFzY2hvb2wuZWR1LnZuMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAq3ywkPAA5r5TlcsAr37G5PfjLt5TzDsevdLMOtJG+m6l3yhXlAkhXUbbxZLb8shCmeFiG6HrmEdWnC6WafYbmUWGLgauJrxTwnQpSDw5aUiu1I1xED7HXxovqbjE8q8hvhPNSQ68dzRzc6ptGyfho25hF8pXPpkboEVlRsNHTWoGDAgg39oTJlgjkTTY2+pso8UMLWq4B5TUI5e4P2JKISQgIALUHEcDIvz7cFdAZUwuZ0djcSEcR4v0DHcaQZda7jULFCmXQOGL3+rGQWw/gY1W+cKjiaE74MaKtdCoYOsNc9zFhG/nnmZtIwibRBX7woVk3WJwGnbLUMBQyWi1PQIDAQABMA0GCSqGSIb3DQEBBQUAA4IBAQAXC4LygQ8mvPxgHUoBGfAuNoKHmAoK6p6aL5CyLwJffYEBfbvDZwZ2mO1tMAukjst9bkr9uHlcKmVU3sXyru4FG0cEt8LsqmOTwqNL7N3S+OFX6nugxpATcvC8YCMM5GzUJAZJh0MSWbSHiQpnYihHTU3erZK+xWKfr8D8nDLdFL62vElkdMVcB4IhD5NFmXfNsq7nqO9Xn+8jKjOjz/kaWY4QEVlTsZrxtfM5shuHSbJw1awdCIgZulzJ2wsv2M7gRIcomcb0vm1+Qlue8lpprCIocFdwAo0ftfcf7ZjtkMKoNhLME228qw4XwufUiBoSlkPfHbEwqGqZeGPDHEVp</ds:X509Certificate>
        </ds:X509Data>
      </ds:KeyInfo>
    </md:KeyDescriptor>
    <md:SingleLogoutService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect" Location="https://samllogin.betaschool.edu.vn/samlssologout/mic"/>
    <md:NameIDFormat>urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified</md:NameIDFormat>
    <md:SingleSignOnService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-Redirect" Location="https://samllogin.betaschool.edu.vn/samlsso/mic"/>
  </md:IDPSSODescriptor>
</md:EntityDescriptor>`
const template = `<samlp:Response xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol" ID="{ID}" Version="2.0" IssueInstant="{IssueInstant}" Destination="{Destination}" Consent="urn:oasis:names:tc:SAML:2.0:consent:unspecified" InResponseTo="{InResponseTo}">
<Issuer xmlns="urn:oasis:names:tc:SAML:2.0:assertion">{Issuer}</Issuer>
<samlp:Status>
  <samlp:StatusCode Value="urn:oasis:names:tc:SAML:2.0:status:Success"/>
</samlp:Status>
<Assertion xmlns="urn:oasis:names:tc:SAML:2.0:assertion" ID="{AssertionID}" IssueInstant="{IssueInstant}" Version="2.0">
  <Issuer>{Issuer}</Issuer>
  <Subject>
    <NameID Format="{NameIDFormat}">{NameID}</NameID>
    <SubjectConfirmation Method="urn:oasis:names:tc:SAML:2.0:cm:bearer">
      <SubjectConfirmationData InResponseTo="{InResponseTo}" NotOnOrAfter="{SubjectConfirmationDataNotOnOrAfter}" Recipient="{SubjectRecipient}"/>
    </SubjectConfirmation>
  </Subject>
  <Conditions NotBefore="{ConditionsNotBefore}" NotOnOrAfter="{ConditionsNotOnOrAfter}">
    <AudienceRestriction>
      <Audience>urn:federation:MicrosoftOnline</Audience>
    </AudienceRestriction>
  </Conditions>
  <AuthnStatement AuthnInstant="{now}" SessionIndex="{sessionIndex}">
    <AuthnContext>
      <AuthnContextClassRef>urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport</AuthnContextClassRef>
    </AuthnContext>
  </AuthnStatement>
  <AttributeStatement>
    <Attribute Name="IDPEmail">
      <AttributeValue>{IDPEmail}</AttributeValue>
    </Attribute>
  </AttributeStatement>
</Assertion>
</samlp:Response>`
const privateKey = `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCrfLCQ8ADmvlOV
ywCvfsbk9+Mu3lPMOx690sw60kb6bqXfKFeUCSFdRtvFktvyyEKZ4WIboeuYR1ac
LpZp9huZRYYuBq4mvFPCdClIPDlpSK7UjXEQPsdfGi+puMTyryG+E81JDrx3NHNz
qm0bJ+GjbmEXylc+mRugRWVGw0dNagYMCCDf2hMmWCORNNjb6myjxQwtargHlNQj
l7g/YkohJCAgAtQcRwMi/PtwV0BlTC5nR2NxIRxHi/QMdxpBl1ruNQsUKZdA4Yvf
6sZBbD+BjVb5wqOJoTvgxoq10Khg6w1z3MWEb+eeZm0jCJtEFfvChWTdYnAadstQ
wFDJaLU9AgMBAAECggEAJe76G8WLXX9ie/Mg3rE7i/Ctp3N0s+ur/C+CD8zt+H27
YWbKIKv4XmrLOKQo1UapPOLXUed6dv/oz7maeiv/pOL1MH83zMfB+3S4oQr5ZCm4
yrnS9dX9QjNHsdJ2dnx5CVPWCEAjPncyxrY/Vk93ITDMd3fB3s39h3FyWrndrujV
LzWC4LGg88UpxocxjenADLBeDN9APqi+bJKkjwr9Q0C6lz4NKHF2BsWrGPlG2K/J
MkTwwQeCdrO6/raNMb5ulg5NdnlzRs2dtuBIvlwOVHrsVic7I2tENK0lDbK2YU6d
d/mUJIGUhPxY83/CcNRjKLzeN2NTgcMoaPH0l4UQYQKBgQDgJzDFJ6rhCNP85vi0
h1yMQ84/+XUExD9wgdONRoZ9KyBj3snuZ5s4FxzjVTTn8e2QhClklVNbUk/3eCyN
enVoix5PGpoUT751rBS/XaTwRD9vaoeBuGbDk8wqfr0lkpOKWteMFInLS5X1Xbzv
JLMxOkC8tJz8XPw1FP22ngD/RQKBgQDD2fN8vOPsJNw5P11AMawyhBYul/3fzNfQ
2J0ImI4qwqmyHn5gsNQC/EU1/bU8G+BpQ01ouUsxfnCiCN15FUMInGTG8eXwLMpc
EdxI7CJ8zrPerP5l84PCu9D4fW7gWC/NJf+x8H7OWYtwzFQz341iaeT/9FUpV4pV
4gL1i6thmQKBgQCY3WE/Mzwv16tqb8Hwq9eLuLoxmtgY9hUljwRM9mnFduHR+h/Q
PEv4xppm1rcL70tKITdxZvy/7LSoWgZYPclQEIANBmFJtNB4w3AqyZwwVvrD6uya
pL1AZ8z2thQcSYfg9O7Gk0Mdp2CPQuwUUvz5d3aquqnM2UUOllAoeDzJ2QKBgF3p
J3DbnirAbfzhXlSGvPwoC/7hkLF8psuU4o+Znynv17D6ID067R5VWtaNxhaBg3TV
+ctKdjzQVS/NMm15/X+mhkhC+6/TumC1i7xHxi20a9lNeFrojniU2Joeg0j94EXt
f5MSL6vAkjVPNNz+x+u1vUHiJefB+yo9So/1HgOZAoGBAKUQo8ULzZs4Cayime5U
raX+OlhyFiMyGa80P/bFOo+XeO2814fsZ45NreLWxwlnsLkx+zG5FjKVxzvmZgQX
M8O+4NsFnuDZhKrucKjOhdFvuxLeO3ngL/TwLiZRThpc9SY4trkHFjW7D9Hx7hd8
b6Cx7xhmp1oLUHKSb5rvWrGR
-----END PRIVATE KEY-----`


export const sp = ServiceProvider({ metadata: `<?xml version="1.0" encoding="utf-8"?><EntityDescriptor ID="_95aa85ca-c26f-4bcc-8de0-c11dd06b1fd1" entityID="urn:federation:MicrosoftOnline" xmlns="urn:oasis:names:tc:SAML:2.0:metadata" xmlns:alg="urn:oasis:names:tc:SAML:metadata:algsupport"><Signature xmlns="http://www.w3.org/2000/09/xmldsig#"><SignedInfo><CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#" /><SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1" /><Reference URI="#_95aa85ca-c26f-4bcc-8de0-c11dd06b1fd1"><Transforms><Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature" /><Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#" /></Transforms><DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1" /><DigestValue>7GEdGp1cdHfssxzRwj+6CdAk1pY=</DigestValue></Reference></SignedInfo><SignatureValue>ETAmIGZ8z1tZ10ZH7RVSBp3GIoVrGXezH3gkXBOcyFVMjptwBPjeubD5B5+pLlIwmjrQi61Ft2WY2IEw86/8n4xfSV4rgyE2b6lMq39qJTbFi2pTnAtYDodWqT5zb9nZAOCvLBMUapapVFL9+J3nvEp6gjGYst20ydYPNmtJuHLAQhgPyQr5MNfneadJxiOAHyTY+nUJYQ1s4uzn5m+9RTLBiigLxG5GevHZ2sdj/zHIih0TvyDmAbKT4vJ4VuMcmbI2O/w1BM8AoeJOryTMwTSbpPKXrA8YGjQ5c8ckRhJz8wvaa+BbFZL8HWoRBzf/OMtMFEBVZy6GWN16BfrmKQ==</SignatureValue><KeyInfo><X509Data><X509Certificate>MIIC/TCCAeWgAwIBAgIQN/GPegnT8blP2EcSdMMbBzANBgkqhkiG9w0BAQsFADApMScwJQYDVQQDEx5MaXZlIElEIFNUUyBTaWduaW5nIFB1YmxpYyBLZXkwHhcNMjEwMjE4MDAwMDAwWhcNMjYwMjE4MDAwMDAwWjApMScwJQYDVQQDEx5MaXZlIElEIFNUUyBTaWduaW5nIFB1YmxpYyBLZXkwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDXdLGU2Ll5RPdDUnKQ+f/HS5qiTay2cCh9U2AS6oDM6SOxVhYGtoeJ1VPebcLnpgLfhPxzrwWoVzXSEF+VRQbnYID2Jb4khjgyEeoThk3VqrThwhahpSbBg2vo06vIOp1TS2R1BiwHKTLoB1i1IJnaIFSC3BN6pY4flXWyLQt/5ABXElv2XZLqXM9Eefj6Ji40nLIsiW4dWw3BDa/ywWW0MsiW5ojGq4vovcAgENe/4NUbju70gHP/WS5D9bW5p+OIQi7/unrlWe/h3A6jtBbbRlXYXlN+Z22uTTyyCD/W8zeXaACLvHagwEMrQePDXBZqc/iX2kI+ooZr1sC/H39RAgMBAAGjITAfMB0GA1UdDgQWBBSrX2dm3LwT9jb/p+bAAdYQpE+/NjANBgkqhkiG9w0BAQsFAAOCAQEAeqJfYHnsA9qhGttXFfFpPW4DQLh5w6JCce7vGvWINr5fr1DnQdcOr+wwjQ/tqbckAL2v6z1AqjhS78kbfegnAQDwioJZ1olYYvLOxKoa6HF+b1/p0Mlub8Zukk2n1b2lKPBBOibOasSY7gQDwlIZi7tl9nMTxUfdYK+E5Axv7DVnmUCwcnnpV5/1SFdNyW2kWO4C68rrjMOvECfwrKkbfVJM8f9krEUBuoBF8dTDv7D2ZM4Q2buC70NbfaNWUX0yFvKI0IuTqk8RBfGTRQ4fZAbhMPaykEpBu6dNjTi5YOa0lNqFGS7Ax7leCh5x9lV8elcLkXs8ySo8AOQJk0hgIw==</X509Certificate></X509Data></KeyInfo></Signature><SPSSODescriptor WantAssertionsSigned="true" protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol"><KeyDescriptor use="signing"><KeyInfo xmlns="http://www.w3.org/2000/09/xmldsig#"><X509Data><X509Certificate>MIIC/TCCAeWgAwIBAgIQbgDHfi3t1JNGVqwD5/7lmjANBgkqhkiG9w0BAQsFADApMScwJQYDVQQDEx5MaXZlIElEIFNUUyBTaWduaW5nIFB1YmxpYyBLZXkwHhcNMjAxMjIxMDAwMDAwWhcNMjUxMjIxMDAwMDAwWjApMScwJQYDVQQDEx5MaXZlIElEIFNUUyBTaWduaW5nIFB1YmxpYyBLZXkwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDFT0/0/2qQurnYa0LbJHF9YYozhEH6r9mCxVDBYbewSG4tGgrWpsewQ/96pcczGMQctMvU+h2eX38Hx/f9JAIDbuRQzQlsPhQS7DDZ6WlTXU+t8d/g2C7fpSoLs4KVdJih4xyjLUWj+BK/ijsRjBt4Riw9VbJH/DdWKyoSMbECEiE+s1RtLP/eYoMmNfxyQGqWirCNqVNBTlqzYQp4dgF0foYy4ktoxwmQOVoTcIMFYp1I4pFPI7CxuMLkfK0X7aTbM7YGphvMfJxJkjrQdyI7G5d1t4DNi3zkEbBT7FGAr6qPt3Kn9ralpqJKHdpEBA9N0vNwQo5XTYIhUbPQ16IRAgMBAAGjITAfMB0GA1UdDgQWBBRs7tPmfkksSr67KtElHjYZbeaCTjANBgkqhkiG9w0BAQsFAAOCAQEAJqwMZSjQJ36x+1sty6EeLKQLQewQwPaEC47Zut+8bXed6Q8jMZ0bfa/MM7XquEcabaMZLQuKLft44YXwXXQOfQrI2qjQr3eToJFlDT9hR0rfp9wQqttDxd6Aa6RWwDTgo5oKUQCTKLHhEy8uWzScK0eGt2d7TWTaDXjRSwNq6tM7fRhZs07tKBV3xfi9EQy/mlavAMFRBVm86NSo7AsOG1IOMq03U3ooCWAXh9PdvvHNfHhH19futAnC/HeOjwRF1Qc527aBMphYFQLdiThfmfmiE/AhQqCwZ2oE7uCJhBtR+Kb1ZGhjI35pHfsSqGiFa7Kr+5ave822PDcke89Mvg==</X509Certificate></X509Data></KeyInfo></KeyDescriptor><KeyDescriptor use="signing"><KeyInfo xmlns="http://www.w3.org/2000/09/xmldsig#"><X509Data><X509Certificate>MIIC/TCCAeWgAwIBAgIQN/GPegnT8blP2EcSdMMbBzANBgkqhkiG9w0BAQsFADApMScwJQYDVQQDEx5MaXZlIElEIFNUUyBTaWduaW5nIFB1YmxpYyBLZXkwHhcNMjEwMjE4MDAwMDAwWhcNMjYwMjE4MDAwMDAwWjApMScwJQYDVQQDEx5MaXZlIElEIFNUUyBTaWduaW5nIFB1YmxpYyBLZXkwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDXdLGU2Ll5RPdDUnKQ+f/HS5qiTay2cCh9U2AS6oDM6SOxVhYGtoeJ1VPebcLnpgLfhPxzrwWoVzXSEF+VRQbnYID2Jb4khjgyEeoThk3VqrThwhahpSbBg2vo06vIOp1TS2R1BiwHKTLoB1i1IJnaIFSC3BN6pY4flXWyLQt/5ABXElv2XZLqXM9Eefj6Ji40nLIsiW4dWw3BDa/ywWW0MsiW5ojGq4vovcAgENe/4NUbju70gHP/WS5D9bW5p+OIQi7/unrlWe/h3A6jtBbbRlXYXlN+Z22uTTyyCD/W8zeXaACLvHagwEMrQePDXBZqc/iX2kI+ooZr1sC/H39RAgMBAAGjITAfMB0GA1UdDgQWBBSrX2dm3LwT9jb/p+bAAdYQpE+/NjANBgkqhkiG9w0BAQsFAAOCAQEAeqJfYHnsA9qhGttXFfFpPW4DQLh5w6JCce7vGvWINr5fr1DnQdcOr+wwjQ/tqbckAL2v6z1AqjhS78kbfegnAQDwioJZ1olYYvLOxKoa6HF+b1/p0Mlub8Zukk2n1b2lKPBBOibOasSY7gQDwlIZi7tl9nMTxUfdYK+E5Axv7DVnmUCwcnnpV5/1SFdNyW2kWO4C68rrjMOvECfwrKkbfVJM8f9krEUBuoBF8dTDv7D2ZM4Q2buC70NbfaNWUX0yFvKI0IuTqk8RBfGTRQ4fZAbhMPaykEpBu6dNjTi5YOa0lNqFGS7Ax7leCh5x9lV8elcLkXs8ySo8AOQJk0hgIw==</X509Certificate></X509Data></KeyInfo></KeyDescriptor><KeyDescriptor use="signing"><KeyInfo xmlns="http://www.w3.org/2000/09/xmldsig#"><X509Data><X509Certificate>MIIC/TCCAeWgAwIBAgIQN/GPegnT8blP2EcSdMMbBzANBgkqhkiG9w0BAQsFADApMScwJQYDVQQDEx5MaXZlIElEIFNUUyBTaWduaW5nIFB1YmxpYyBLZXkwHhcNMjEwMjE4MDAwMDAwWhcNMjYwMjE4MDAwMDAwWjApMScwJQYDVQQDEx5MaXZlIElEIFNUUyBTaWduaW5nIFB1YmxpYyBLZXkwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDXdLGU2Ll5RPdDUnKQ+f/HS5qiTay2cCh9U2AS6oDM6SOxVhYGtoeJ1VPebcLnpgLfhPxzrwWoVzXSEF+VRQbnYID2Jb4khjgyEeoThk3VqrThwhahpSbBg2vo06vIOp1TS2R1BiwHKTLoB1i1IJnaIFSC3BN6pY4flXWyLQt/5ABXElv2XZLqXM9Eefj6Ji40nLIsiW4dWw3BDa/ywWW0MsiW5ojGq4vovcAgENe/4NUbju70gHP/WS5D9bW5p+OIQi7/unrlWe/h3A6jtBbbRlXYXlN+Z22uTTyyCD/W8zeXaACLvHagwEMrQePDXBZqc/iX2kI+ooZr1sC/H39RAgMBAAGjITAfMB0GA1UdDgQWBBSrX2dm3LwT9jb/p+bAAdYQpE+/NjANBgkqhkiG9w0BAQsFAAOCAQEAeqJfYHnsA9qhGttXFfFpPW4DQLh5w6JCce7vGvWINr5fr1DnQdcOr+wwjQ/tqbckAL2v6z1AqjhS78kbfegnAQDwioJZ1olYYvLOxKoa6HF+b1/p0Mlub8Zukk2n1b2lKPBBOibOasSY7gQDwlIZi7tl9nMTxUfdYK+E5Axv7DVnmUCwcnnpV5/1SFdNyW2kWO4C68rrjMOvECfwrKkbfVJM8f9krEUBuoBF8dTDv7D2ZM4Q2buC70NbfaNWUX0yFvKI0IuTqk8RBfGTRQ4fZAbhMPaykEpBu6dNjTi5YOa0lNqFGS7Ax7leCh5x9lV8elcLkXs8ySo8AOQJk0hgIw==</X509Certificate></X509Data></KeyInfo></KeyDescriptor><SingleLogoutService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST" Location="https://login.microsoftonline.com/login.srf" /><NameIDFormat>urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress</NameIDFormat><NameIDFormat>urn:mace:shibboleth:1.0:nameIdentifier</NameIDFormat><NameIDFormat>urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified</NameIDFormat><NameIDFormat>urn:oasis:names:tc:SAML:2.0:nameid-format:transient</NameIDFormat><NameIDFormat>urn:oasis:names:tc:SAML:2.0:nameid-format:persistent</NameIDFormat><AssertionConsumerService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST" Location="https://login.microsoftonline.com/login.srf" index="0" isDefault="true" /><AssertionConsumerService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST-SimpleSign" Location="https://login.microsoftonline.com/login.srf" index="1" /><AssertionConsumerService Binding="urn:oasis:names:tc:SAML:2.0:bindings:PAOS" Location="https://login.microsoftonline.com/login.srf" index="2" /></SPSSODescriptor><Extensions><alg:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1" /><alg:SigningMethod Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1" /></Extensions></EntityDescriptor>`});

const domainURIMap: {
  [key: string]: string
} = {
  "localhost": "betaschool.edu.vn.login",
  "betaschool.edu.vn": "betaschool.edu.vn.login",
  "sv.betaschool.edu.vn": "betaschool.edu.vn.login",
  "thptbinhson.edu.vn": "thptbinhson.edu.vn.login",
  "sv.thptbinhson.edu.vn": "thptbinhson.edu.vn.login"
}

const idpMap: {
  [key: string]: any
} = {}
Object.keys(domainURIMap).map((d) => {
  idpMap[d] = IdentityProvider({
    metadata: metadataIdpCreate((Object.values(domainURIMap).includes(d) && domainURIMap[d]) ? domainURIMap[d] : 'betaschool.edu.vn.login'),
    privateKey: privateKey,
    isAssertionEncrypted: false,
    loginResponseTemplate: {
      context: template,
      attributes: []
    },
    // customTagReplacement: (value: string) => ({context: value})
  });
})

export const getIdpByDomain = (domain: string) => {
  return idpMap[domain]
}

