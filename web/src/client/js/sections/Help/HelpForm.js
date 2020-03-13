import React, { useRef } from 'react'

import useDataService from 'Hooks/useDataService'
import dataMapper from 'Libs/dataMapper'

import Store from '../../reducers'
import { standardFormSubmit } from 'Actions/form'

import Form from 'Components/Form/Form'
import FormField from 'Components/Form/FormField'
import './_HelpForm.scss'

const HelpForm = () => {
  const { data: currentUser } = useDataService(dataMapper.users.current())
  const { data: currentOrg } = useDataService(dataMapper.organizations.current())

  const formName = useRef('help-form')

  function formChangeHandler(e) {
    const formData = new FormData(e.target)
    const body = {}
    body.name = formData.get('name')
    body.email = formData.get('email')
    body.company = formData.get('company')
    body.subject = formData.get('subject')
    body.message = formData.get('message')
    Store.dispatch(standardFormSubmit(formName.current, body))
  }

  return (
    <Form
      className="help-form"
      encType="multipart/form-data"
      name={formName.current}
      onSubmit={formChangeHandler}
      submitLabel="Send"
    >
      <FormField
        defaultValue={currentUser.name}
        id="name"
        name="name"
        type="hidden"
      />
      <FormField
        defaultValue={currentUser.email}
        id="email"
        name="email"
        type="hidden"
      />
      <FormField
        defaultValue={currentOrg.name}
        id="company"
        name="company"
        type="hidden"
      />
      <p>What can we help you with?</p>
      <div className="help-form__options">
        <FormField
          checked
          id="form-request"
          label="Feature request"
          name="subject"
          value="[App] Feature request"
          type="radio"
        />
        <FormField
          label="Pricing"
          id="form-pricing"
          name="subject"
          value="[App] Pricing"
          type="radio"
        />
        <FormField
          label="Bug"
          id="form-bug"
          name="subject"
          value="[App] Bug report"
          type="radio"
        />
        <FormField
          label="Account / billing"
          id="form-account"
          name="subject"
          value="[App] Account / billing"
          type="radio"
        />
        <FormField
          label="Question"
          id="form-question"
          name="subject"
          value="[App] Question"
          type="radio"
        />
        <FormField
          label="Other"
          id="form-other"
          name="subject"
          value="[App] Other"
          type="radio"
        />
      </div>
      <p>What would you like to say?</p>
      <FormField
        aria-label="Your message"
        id="form-textarea"
        large
        name="message"
        placeholder="Your message..."
        required
        type="textarea"
      />
    </Form>
  )
}

export default HelpForm
