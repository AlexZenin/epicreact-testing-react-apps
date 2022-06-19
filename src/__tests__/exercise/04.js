// form testing
// http://localhost:3000/login

import * as React from 'react'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Login from '../../components/login'
import faker from 'faker'
import { build, fake } from '@jackfranklin/test-data-bot'

function buildLoginForm(params = {}) {
  const username = params.username ??  faker.internet.userName()
  const password = params.password ?? faker.internet.password()
  return {username, password}
}

// Less verbose, but probably less efficient
function buildLoginForm2(overrides) {
  return {
    username: faker.internet.userName(), 
    password: faker.internet.password(),
    ...overrides
  }
}

const userBuilder = build({
  fields: {
    username: fake(f => f.internet.userName()),
    password: fake(f => f.internet.password())
  }
})

test('submitting the form calls onSubmit with username and password', async () => {
  const {username, password} = userBuilder()
  const handleSubmit = jest.fn()
  render(<Login onSubmit={handleSubmit} />)
  const usernameInput = screen.getByLabelText(/username/i)
  const passwordInput = screen.getByLabelText(/password/i)
  const submitButton = screen.getByRole('button', {name: /submit/i})

  await userEvent.type(usernameInput, username)
  await userEvent.type(passwordInput, password)
  await userEvent.click(submitButton)
  
  expect(handleSubmit).toHaveBeenCalledWith({
    username,
    password,
  })
  expect(handleSubmit).toHaveBeenCalledTimes(1)
})

/*
eslint
  no-unused-vars: "off",
*/
