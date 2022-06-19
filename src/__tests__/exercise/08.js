// testing custom hooks
// http://localhost:3000/counter-hook

import * as React from 'react'
import {render, screen, renderHook} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import useCounter from '../../components/use-counter'
import { act } from 'react-dom/test-utils'

function setupTest(...args) {
  const results = {}
  function TestComponent() {
    Object.assign(results, useCounter(...args))
    return null
  }
  render(<TestComponent />)
  return results
}

function Counter() {
  const {count, increment, decrement} = useCounter()

  return (
    <div>
      <p aria-label='count'>{count}</p>
      <button onClick={increment}>increment</button>
      <button onClick={decrement}>decrement</button>
    </div>
  )
}

test('exposes the count and increment/decrement functions', async () => {
  const { getCount, getIncrementButton, getDecrementButton } = renderCounter()
  
  expect(getCount()).toHaveTextContent('0') 
  await userEvent.click(getIncrementButton())
  expect(getCount()).toHaveTextContent('1')
  await userEvent.click(getDecrementButton())
  expect(getCount()).toHaveTextContent('0')
})

test(`exposes the count and increment/decrement functions without using a custom component`, () => {
  // Won't work if we move TestComponent outside of the test, since calling
  //  results.count would re-render the component, and results will be a new
  //  reference to a new object that we no longer have access to. 
  let results
  function TestComponent(props) {
    results = useCounter(props)
    return null
  }
  render(<TestComponent />)
  
  expect(results.count).toEqual(0)
  act(() => results.increment())
  expect(results.count).toEqual(1)
  act(() => results.decrement())
  expect(results.count).toEqual(0)
})

test(`exposes the count and increment/decrement functions without using a custom component`, () => {
  const results = setupTest()
  
  expect(results.count).toEqual(0)
  act(() => results.increment())
  expect(results.count).toEqual(1)
  act(() => results.decrement())
  expect(results.count).toEqual(0)
})

test(`exposes the count and increment/decrement functions using react hooks library`, () => {
  const {result} = renderHook(() => useCounter())
  
  expect(result.current.count).toEqual(0)
  act(() => result.current.increment())
  expect(result.current.count).toEqual(1)
  act(() => result.current.decrement())
  expect(result.current.count).toEqual(0)
})

function renderCounter() {
  render(<Counter />)
  return {
    getCount: () => screen.getByLabelText('count'),
    getIncrementButton: () => screen.getByRole('button', { name: /increment/i}),
    getDecrementButton: () => screen.getByRole('button', { name: /decrement/i})
  }
}

/* eslint no-unused-vars:0 */
