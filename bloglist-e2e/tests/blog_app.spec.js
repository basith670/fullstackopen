const {
    test,
    expect,
    beforeEach,
    describe
  } = require('@playwright/test')
  
  describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
      await request.post(
        'http://localhost:3003/api/testing/reset'
      )
  
      await request.post(
        'http://localhost:3003/api/users',
        {
          data: {
            username: 'basith',
            password: 'basith@123',
            name: 'Muhammad Basith'
          }
        }
      )
  
      await page.goto('http://localhost:5173/login')
    })
  
    describe('Login', () => {
      test('succeeds with correct credentials', async ({ page }) => {
        await page.getByLabel('username').fill('basith')
        await page.getByLabel('password').fill('basith@123')
  
        await page.getByRole(
          'button',
          { name: 'login' }
        ).click()
  
        await expect(page).toHaveURL(
          'http://localhost:5173/'
        )
  
        await expect(
          page.getByText('Muhammad Basith logged in')
        ).toBeVisible()
  
        await expect(
          page.getByRole(
            'button',
            { name: 'logout' }
          )
        ).toBeVisible()
      })
  
      test('fails with wrong credentials', async ({ page }) => {
        await page.getByLabel('username').fill('basith')
        await page.getByLabel('password').fill('wrongpassword')
  
        await page.getByRole(
          'button',
          { name: 'login' }
        ).click()
  
        await expect(
          page.getByText(
            'Wrong username or password'
          ).first()
        ).toBeVisible()
  
        await expect(page).toHaveURL(
          'http://localhost:5173/login'
        )
      })
    })
  
    describe('When logged in', () => {
      beforeEach(async ({ page }) => {
        await page.getByLabel('username').fill('basith')
        await page.getByLabel('password').fill('basith@123')
  
        await page.getByRole(
          'button',
          { name: 'login' }
        ).click()
  
        await expect(page).toHaveURL(
          'http://localhost:5173/'
        )
  
        await expect(
          page.getByRole(
            'button',
            { name: 'logout' }
          )
        ).toBeVisible()
      })
  
      test(
        'a logged-in user can create a blog',
        async ({ page }) => {
          await page.getByRole(
            'link',
            { name: 'create new blog' }
          ).click()
  
          await expect(page).toHaveURL(
            'http://localhost:5173/create'
          )
  
          await page.getByLabel('title').fill(
            'The React Test Blog'
          )
  
          await page.getByLabel('author').fill(
            'Muhammad Basith'
          )
  
          await page.getByLabel('url').fill(
            'https://example.com/react-test'
          )
  
          await page.getByRole(
            'button',
            { name: 'create' }
          ).click()
  
          await expect(page).toHaveURL(
            'http://localhost:5173/'
          )
  
          await expect(
            page.getByRole(
              'link',
              { name: 'The React Test Blog' }
            )
          ).toBeVisible()
        }
      )
  
      test(
        'a logged-in user can like a blog',
        async ({ page }) => {
          await page.getByRole(
            'link',
            { name: 'create new blog' }
          ).click()
  
          await page.getByLabel('title').fill(
            'Blog to Like'
          )
  
          await page.getByLabel('author').fill(
            'Muhammad Basith'
          )
  
          await page.getByLabel('url').fill(
            'https://example.com/blog-to-like'
          )
  
          await page.getByRole(
            'button',
            { name: 'create' }
          ).click()
  
          await expect(page).toHaveURL(
            'http://localhost:5173/'
          )
  
          const blogLink = page.getByRole(
            'link',
            {
              name: 'Blog to Like'
            }
          )
  
          await expect(blogLink).toBeVisible()
  
          await blogLink.click()
  
          await expect(page).toHaveURL(
            /\/blogs\/.+/
          )
  
          await expect(
            page.getByText('likes 0')
          ).toBeVisible()
  
          await expect(
            page.getByRole(
              'button',
              { name: 'like' }
            )
          ).toBeVisible()
  
          await page.getByRole(
            'button',
            { name: 'like' }
          ).click()
  
          await expect(
            page.getByText('likes 1')
          ).toBeVisible()
        }
      )
  
      test(
        'a logged-in user can delete a blog',
        async ({ page }) => {
          await page.getByRole(
            'link',
            { name: 'create new blog' }
          ).click()
  
          await page.getByLabel('title').fill(
            'Blog to Delete'
          )
  
          await page.getByLabel('author').fill(
            'Muhammad Basith'
          )
  
          await page.getByLabel('url').fill(
            'https://example.com/blog-to-delete'
          )
  
          await page.getByRole(
            'button',
            { name: 'create' }
          ).click()
  
          await expect(page).toHaveURL(
            'http://localhost:5173/'
          )
  
          const blogLink = page.getByRole(
            'link',
            {
              name: 'Blog to Delete'
            }
          )
  
          await expect(blogLink).toBeVisible()
  
          await blogLink.click()
  
          await expect(page).toHaveURL(
            /\/blogs\/.+/
          )
  
          const removeButton = page.getByRole(
            'button',
            { name: 'remove' }
          )
  
          await expect(removeButton).toBeVisible()
  
          page.on('dialog', async dialog => {
            expect(dialog.type()).toBe('confirm')
  
            expect(dialog.message()).toContain(
              'Remove blog "Blog to Delete" by Muhammad Basith?'
            )
  
            await dialog.accept()
          })
  
          await removeButton.click()
  
          await expect(page).toHaveURL(
            'http://localhost:5173/'
          )
  
          await expect(
            page.getByRole(
              'link',
              { name: 'Blog to Delete' }
            )
          ).not.toBeVisible()
        }
      )
    })
  })