import { Form, Field, ErrorMessage, defineRule } from 'vee-validate'
import { required, email } from '@vee-validate/rules'
export default (app) => {
  defineRule('required', required)
  defineRule('email', email)

  app.component('VeeForm', Form)
  app.component('VeeField', Field)
  app.component('VeeErrorMessage', ErrorMessage)
}
