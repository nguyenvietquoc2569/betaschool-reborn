import thum from 'thum.io'
//https://www.thum.io/ quocnv@betaschool.edu.vn
export function genLinkThumbnail (url: string) {  
  const thumURL = thum.getThumURL({
    url: url,
    width: 1200,
    crop: 700,
    auth: {
      type: 'md5',
      secret: 'qwer1234',
      keyId: '17270'
    },
  })

  // Add 300 seconds to the current time for a 5 minute expiry
  // var expires = new Date().getTime() + (1000 * 300);
  // var hash = md5(secret + expires + url);
  // var auth = '17270-' + expires + '-' + hash;
  // var imgUrl = 'https://image.thum.io/get/auth/' + auth + '/' + url;

  return 'https:' + thumURL
}

export function genLinkThumbnailSpeakingTestPage (url: string) {  
  const thumURL = thum.getThumURL({
    url: url,
    width: 1200,
    crop: 700,
    auth: {
      type: 'md5',
      secret: 'qwer1234',
      keyId: '17270'
    },
  })

  // Add 300 seconds to the current time for a 5 minute expiry
  // var expires = new Date().getTime() + (1000 * 300);
  // var hash = md5(secret + expires + url);
  // var auth = '17270-' + expires + '-' + hash;
  // var imgUrl = 'https://image.thum.io/get/auth/' + auth + '/' + url;

  return 'https:' + thumURL
}