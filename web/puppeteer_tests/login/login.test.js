
const url = 'https://dev.portway.app'

const username = process.env.TEST_USER_EMAIL
const password = process.env.TEST_USER_PASSWORD

describe('Portway', () => {
  beforeAll(async () => {
    await page.goto(url)
  })

  it('should be titled "Portway"', async () => {
    await expect(page.title()).resolves.toMatch('Portway')
  })

  it('should fill in the login fields', async () => {
    await expect(page).toFillForm('form[name="login"]', {
      email: username,
      password
    })
  })

  it('should login', async () => {
    await expect(page).toClick('input[name="submit"]')
  })

  it('should show the project page', async () => {
    await page.waitForNavigation({
      waitUntil: 'networkidle2'
    })
    await expect(page).toMatch('New Project')
  })

  it('should click new project', async () => {
    await expect(page).toClick('button[title="New Project"]')
  })

  it('should fill out the project form', async () => {
    await expect(page).toFillForm('form[name="newProject"]', {
      name: 'BonkeyJustice™',
      description: 'Justice: BonkeyStyle™'
    })
  })

  it('should submit the project form', async () => {
    // Wait for the form to enable itself after it has data
    // await new Promise(resolve => setTimeout(resolve, 2000))
    await expect(page).toClick('input[type="submit"]')
  })

  it('should add a document', async () => {
    await page.waitForNavigation({
      waitUntil: 'networkidle2'
    })
    await expect(page).toClick('button[name="addDocument"]')
  })

  it('should add a document title', async () => {
    await expect(page).toFill('input[name="newDocument"]', 'An Introduction to BonkeyJustice')
    await page.keyboard.press('Enter')
  })

  it('should add text to the document', async () => {
    // We need to wait for codemirror to mount, not sure how else to do it
    await new Promise(resolve => setTimeout(resolve, 500))
    await expect(page).toFill('div.document-field__text', '# Intro\n\nWelcome to BonkeyJustice')
    // Wait to make sure the debounce thing saves the doc
    await new Promise(resolve => setTimeout(resolve, 1000))
  })

  it('should go to the projects page', async () => {
    await expect(page).toClick('a[name="projects"]')
  })

  it('should delete BonkeyJustice', async () => {
    await expect(page).toClick('li[name="BonkeyJustice™"] button[name="deleteProject"]')
    await expect(page).toClick('button', { text: 'Yes, delete this project' })
  })
})
