import { Form, Field, ErrorMessage, defineRule, configure } from 'vee-validate'
import { required, email, min, url } from '@vee-validate/rules'
import { localize } from '@vee-validate/i18n'
import mapValues from 'lodash/mapValues'
import firebase from 'firebase'

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
  },
  unique: {
    async test (value, options) {
      const [collection, field, excluding] = options
      if (value === excluding) return true
      const querySnapshot = await firebase.firestore().collection(collection).where(field, '==', value).get()
      return querySnapshot.empty
    },
    message: '{field} is already taken'
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
