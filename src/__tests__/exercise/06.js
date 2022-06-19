// mocking Browser APIs and modules
// http://localhost:3000/location

import * as React from 'react'
import {render, screen, act} from '@testing-library/react'
import Location from '../../examples/location'
import {useCurrentPosition} from 'react-use-geolocation'

const FAKE_LAT = 123
const FAKE_LONG = 456

function deferred() {
  let resolve, reject
  const promise = new Promise((res, rej) => {
    resolve = res
    reject = rej
  })
  return {promise, resolve, reject}
}

const fakePosition = {
  coords: {
    latitude: FAKE_LAT,
    longitude: FAKE_LONG,
  }
}


jest.mock('react-use-geolocation') 

// beforeAll(() => {
//   window.navigator.geolocation = {
//     getCurrentPosition: jest.fn()
//   }
// })

test.skip('displays the users current location', async () => {
  const fakePosition = {
    coords: {
      latitude: FAKE_LAT,
      longitude: FAKE_LONG,
    }
  }

  const { promise, resolve } = deferred()
    
  window.navigator.geolocation.getCurrentPosition.mockImplementation(cb => {
    promise.then(() => cb(fakePosition)) 
  })

  render(<Location />)

  expect(screen.getByLabelText(/loading/i)).toBeInTheDocument()

  await act(async () => {
    resolve()
    await promise
  })

  // await waitForElementToBeRemoved(screen.getByLabelText(/loading/i))
  expect(screen.queryByLabelText(/loading/i)).not.toBeInTheDocument()

  expect(screen.getByText(/latitude/i)).toHaveTextContent(FAKE_LAT)
  expect(screen.getByText(/longitude/i)).toHaveTextContent(FAKE_LONG)
})

test.only('displays the users current location mocking the module', () => {
  let setMockPosition
  const useMockCurrentPosition = () => {
    const [position, setPosition] = React.useState(null)
    setMockPosition = setPosition
    return [position, null] 
  } 
  useCurrentPosition.mockImplementation(useMockCurrentPosition)
  render(<Location />)
  
  expect(screen.getByLabelText(/loading/i)).toBeInTheDocument()
  
  act(() => {
    setMockPosition(fakePosition)
  })
  expect(screen.getByText(/latitude/i)).toHaveTextContent(FAKE_LAT)
  expect(screen.getByText(/longitude/i)).toHaveTextContent(FAKE_LONG)
})

/*
eslint
  no-unused-vars: "off",
*/
