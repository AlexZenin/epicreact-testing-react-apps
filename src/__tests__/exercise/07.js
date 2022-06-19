// testing with context and a custom render method
// http://localhost:3000/easy-button

import * as React from 'react'
// import {render as rtlRender, screen} from '@testing-library/react'
import {render, screen} from 'test/test-utils'
import {ThemeProvider} from '../../components/theme'
import EasyButton from '../../components/easy-button'

// Custom render function
// function render(ui, options = {}) {
//   const {providerProps, renderOptions} = options
//   function Wrapper({children}) {
//     return (<ThemeProvider {...providerProps}>{children}</ThemeProvider>)
//   }
//   return rtlRender(ui, {wrapper: Wrapper, ...renderOptions})
// }


test('renders with the light styles for the light theme', () => {
  render(<EasyButton>Easy</EasyButton>)
  const button = screen.getByRole('button', {name: /easy/i})
  expect(button).toHaveStyle(`
    background-color: white;
    color: black;
  `)
})

test('renders with the dark styles for the dark theme', () => {
  render(<EasyButton>Easy</EasyButton>, {theme: 'dark'})
  const button = screen.getByRole('button', {name: /easy/i})
  expect(button).toHaveStyle(`
    background-color: black;
    color: white;
  `)
})

/* eslint no-unused-vars:0 */
