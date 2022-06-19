// simple test with React Testing Library
// http://localhost:3000/counter

import * as React from 'react'
import Counter from '../../components/counter'
import { fireEvent, render } from '@testing-library/react'
import '@testing-library/jest-dom'

test('counter increments and decrements when the buttons are clicked', () => {
  const { container } = render(<Counter />)

  const [decrement, increment] = container.querySelectorAll('button')
  const message = container.firstChild.querySelector('div')

  expect(message.textContent).toBe('Current count: 0')

  fireEvent.click(increment)
  expect(message.textContent).toBe('Current count: 1')
  fireEvent.click(decrement)
  expect(message).toHaveTextContent('Current count: 0')
})
