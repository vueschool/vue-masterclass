import { Form, Field, ErrorMessage, defineRule, configure } from 'vee-validate'
import { required, email, min, url } from '@vee-validate/rules'
import { localize } from '@vee-validate/i18n'
import { mapValues } from 'lodash'

const rules = {
  required: {
    test: required,
    message: '{field} is required'
  },
  email: {
    test: email,
    message: '{field} must be a valid email address'
  },
  min: {
    test: min,
    message: '{field} must be a minimum of 0:{min} characters'
  },
  url: {
    test: url,
    message: '{field} must be a valid URL'
  }
}

export default (app) => {
  generateMessages()
  defineRules()
  app.component('VeeForm', Form)
  app.component('VeeField', Field)
  app.component('VeeErrorMessage', ErrorMessage)
}

function generateMessages () {
  configure({
    generateMessage: localize('en', {
      messages: mapValues(rules, rule => rule.message)
    })
  })
}

function defineRules () {
  Object.keys(rules).forEach(
    rule => defineRule(rule, rules[rule].test)
  )
}
