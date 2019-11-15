
export default jest.fn(() => {
  // Mocks the return of a function that would run a worker thread
  // so we can see what args are passed to this return func
  return jest.fn()
})