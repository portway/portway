describe('Portway', () => {
  beforeAll(async () => {
    await page.goto('https://dev.portway.app')
  })

  it('should be titled "Portway"', async () => {
    await expect(page.title()).resolves.toMatch('Portway')
  })

  it('should navigate to login', async () => {
    await expect(page).toClick('Sign in')
  })
})
