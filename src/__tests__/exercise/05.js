// mocking HTTP requests
// http://localhost:3000/login-submission

import * as React from 'react'
import {render, screen, waitForElementToBeRemoved} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {build, fake} from '@jackfranklin/test-data-bot'
import Login from '../../components/login-submission'
import {rest} from 'msw'
import {setupServer} from 'msw/node'
import {handlers} from 'test/server-handlers'

const server = setupServer(...handlers)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test(`logging in displays the user's username`, async () => {
  const { getUsernameField, getPasswordField, getSubmitButton, getLoader } = renderLogin()
  const {username, password} = buildLoginForm()

  await userEvent.type(getUsernameField(), username)
  await userEvent.type(getPasswordField(), password)
  await userEvent.click(getSubmitButton())

  await waitForElementToBeRemoved(getLoader())
  expect(screen.getByText(username)).toBeInTheDocument()
})

test(`error message is displayed when password isn't provided`, async () => {
  const { getUsernameField, getSubmitButton } = renderLogin()
  const {username} = buildLoginForm()

  await userEvent.type(getUsernameField(), username)
  await userEvent.click(getSubmitButton())
  
  expect(await screen.findByText(/password required/i)).toBeInTheDocument()
})

test(`error message is displayed when password isn't provided using snapshots`, async () => {
  const { getUsernameField, getSubmitButton, getLoader } = renderLogin()
  const {username} = buildLoginForm()

  await userEvent.type(getUsernameField(), username)
  await userEvent.click(getSubmitButton())
  await waitForElementToBeRemoved(getLoader())

  expect(screen.getByRole('alert').textContent).toMatchInlineSnapshot(
    `"password required"`,
  )
})

test(`server sends back 500`, async () => {
  const testErrorMessage = 'something went very wrong' 
  server.use(
    rest.post(
      'https://auth-provider.example.com/api/login',
      async (_, res, ctx) => {
        return res(
          ctx.status(500),
          ctx.json({ message: testErrorMessage})
        )
      },
    )
  )
  const { getUsernameField, getPasswordField, getSubmitButton, getLoader } = renderLogin()
  const {username, password} = buildLoginForm()

  await userEvent.type(getUsernameField(), username)
  await userEvent.type(getPasswordField(), password)
  await userEvent.click(getSubmitButton())
  await waitForElementToBeRemoved(getLoader())

  expect(screen.getByRole('alert')).toHaveTextContent(testErrorMessage)
})

function renderLogin() {
  render(<Login />)
  return {
    getUsernameField: () => screen.getByLabelText(/username/i),
    getPasswordField: () => screen.getByLabelText(/password/i),
    getSubmitButton: () => screen.getByRole('button', {name: /submit/i}),
    getLoader: () => screen.getByLabelText(/loading/i)
  }
}

const buildLoginForm = build({
  fields: {
    username: fake(f => f.internet.userName()),
    password: fake(f => f.internet.password()),
  },
})

// const server = setupServer(
//   rest.post(
//     'https://auth-provider.example.com/api/login',
//     async (req, res, ctx) => {
//       return res(
//         ctx.json({
//           username: req.body.username
//         })
//       )
//     }
//   )
// )

