
const langs = ['en', 'th', 'vn']
let initLang = localStorage.getItem('i18nextLng')
initLang = langs.includes(initLang) ? initLang : 'en'

const language = (state = initLang, action) => {
  switch (action.type) {
    case 'CHANG_LANGUAGE':
      return action.language
    default:
      return state
  }
}

export default language
