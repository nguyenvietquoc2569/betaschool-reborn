export const getAbsoluteBase = () => {
  try {
    const enviroment = (process.env.ENV || 'dev').toLocaleLowerCase()
    switch (enviroment) {
      case 'dev':
        return 'http://localhost:4200'
      case 'qa':
        return 'https://clientsiteqa.betaschool.edu.vn'
      case 'prod':
        return 'https://client.betaschool.edu.vn'
    }
  } catch (e) {
    console.log(e)
  }
  return ''
}