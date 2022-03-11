import { Form, Field, ErrorMessage, defineRule, configure } from 'vee-validate'
import { required, email, min, url } from '@vee-validate/rules'
import { localize } from '@vee-validate/i18n'
import { db } from '@/helpers/firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'
export default app => {
  defineRule('required', required)
  defineRule('email', email)
  defineRule('min', min)
  defineRule('url', url)
  defineRule('unique', async (value, args) => {
    let coll, field, excluding
    if (Array.isArray(args)) {
      ;[coll, field, excluding] = args
    } else {
      ;({ coll, field, excluding } = args)
    }
    if (value === excluding) return true
    const queryArgs = [collection(db, coll), where(field, '==', value)]
    const fieldQuery = query(...queryArgs)
    const querySnapshot = await getDocs(fieldQuery)
    return querySnapshot.empty
  })

  configure({
    generateMessage: localize('en', {
      messages: {
        required: '{field} is required',
        email: '{field} must be a valid email',
        min: '{field} must be a minimum of 0:{min} characters',
        unique: '{field} is already taken',
        url: '{field} must be a valid URL'
      }
    })
  })

  app.component('VeeForm', Form)
  app.component('VeeField', Field)
  app.component('VeeErrorMessage', ErrorMessage)
}
