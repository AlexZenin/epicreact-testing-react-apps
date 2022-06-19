// simple test with ReactDOM
// http://localhost:3000/counter

import * as React from 'react'
import {act} from 'react-dom/test-utils'
import {createRoot} from 'react-dom/client'
import Counter from '../../components/counter'

// NOTE: this is a new requirement in React 18
// https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html#configuring-your-testing-environment
// Luckily, it's handled for you by React Testing Library :)
global.IS_REACT_ACT_ENVIRONMENT = true

test('counter increments and decrements when the buttons are clicked', () => {
  const divElement = document.createElement('div')
  document.body.append(divElement)
  const rootNode = createRoot(divElement)

  act(() => rootNode.render(<Counter />))
  const [decrementButton, incrementButton] = divElement.querySelectorAll('button')
  const message = divElement.firstChild.querySelector('div')
  
  expect(message.textContent).toBe('Current count: 0')
  act(() => incrementButton.dispatchEvent(new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
  })))
  expect(message.textContent).toBe('Current count: 1')
  act(() => decrementButton.dispatchEvent(new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
  })))
  expect(message.textContent).toBe('Current count: 0')

  divElement.remove()
})

/* eslint no-unused-vars:0 */
