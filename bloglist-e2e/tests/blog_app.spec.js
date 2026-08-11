const { test, expect, beforeEach, describe } = require('@playwright/test')

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

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(
      page.getByText('Log in to application')
    ).toBeVisible()

    await expect(
      page.getByLabel('username')
    ).toBeVisible()

    await expect(
      page.getByLabel('password')
    ).toBeVisible()

    await expect(
      page.getByRole('button', { name: 'login' })
    ).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByLabel('username').fill('basith')
      await page.getByLabel('password').fill('basith@123')

      await page.getByRole(
        'button',
        { name: 'login' }
      ).click()

      await expect(
        page.getByText('Muhammad Basith')
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
        page.getByText('Wrong username or password')
      ).toBeVisible()
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

      await expect(
        page.getByRole(
          'button',
          { name: 'logout' }
        )
      ).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole(
        'button',
        { name: 'create new blog' }
      ).click()

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

      await expect(
        page.getByText(
          'The React Test Blog Muhammad Basith'
        )
      ).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await page.getByRole(
        'button',
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

      const blog = page.getByText(
        'Blog to Like Muhammad Basith'
      )

      await expect(blog).toBeVisible()

      await blog
        .locator('..')
        .getByRole(
          'button',
          { name: 'view' }
        )
        .click()

      await expect(
        page.getByText('likes 0')
      ).toBeVisible()

      await page.getByRole(
        'button',
        { name: 'like' }
      ).click()

      await expect(
        page.getByText('likes 1')
      ).toBeVisible()
    })

    test('the user who added the blog can delete it', async ({ page }) => {
      await page.getByRole(
        'button',
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

      const blogTitle = page.getByText(
        'Blog to Delete Muhammad Basith'
      )

      await expect(blogTitle).toBeVisible()

      const blogContainer = blogTitle.locator('../..')

      await blogContainer
        .getByRole(
          'button',
          { name: 'view' }
        )
        .click()

      await expect(
        blogContainer.getByRole(
          'button',
          { name: 'remove' }
        )
      ).toBeVisible()

      page.on('dialog', async dialog => {
        expect(dialog.type()).toBe('confirm')

        expect(dialog.message()).toContain(
          'Remove blog "Blog to Delete" by Muhammad Basith?'
        )

        await dialog.accept()
      })

      await blogContainer
        .getByRole(
          'button',
          { name: 'remove' }
        )
        .click()

      await expect(
        page.getByText(
          'Blog to Delete Muhammad Basith'
        )
      ).not.toBeVisible()
    })

    test('blogs are ordered according to likes', async ({
      page,
      request
    }) => {
      /*
       * Get the token through the UI.
       * This keeps the test authenticated as the
       * same user that is logged into the browser.
       */

      const loginResponse = await request.post(
        'http://localhost:3003/api/login',
        {
          data: {
            username: 'basith',
            password: 'basith@123'
          }
        }
      )

      expect(loginResponse.ok()).toBeTruthy()

      const loggedUser = await loginResponse.json()

      const token = loggedUser.token

      /*
       * Create three blogs directly through the API
       * with different like counts.
       *
       * This lets the test focus on what 5.23 actually
       * asks us to test: the ordering in the UI.
       */

      const createBlog = async (
        title,
        likes
      ) => {
        const response = await request.post(
          'http://localhost:3003/api/blogs',
          {
            headers: {
              Authorization: `Bearer ${token}`
            },
            data: {
              title,
              author: 'Muhammad Basith',
              url: `https://example.com/${title
                .toLowerCase()
                .replaceAll(' ', '-')}`,
              likes
            }
          }
        )

        expect(response.ok()).toBeTruthy()

        return response.json()
      }

      await createBlog(
        'Blog With 2 Likes',
        2
      )

      await createBlog(
        'Blog With 5 Likes',
        5
      )

      await createBlog(
        'Blog With 10 Likes',
        10
      )

      /*
       * Reload the page so the application fetches
       * the three newly-created blogs.
       */

      await page.reload()

      /*
       * Verify all three blogs are displayed.
       */

      await expect(
        page.getByText(
          'Blog With 2 Likes Muhammad Basith'
        )
      ).toBeVisible()

      await expect(
        page.getByText(
          'Blog With 5 Likes Muhammad Basith'
        )
      ).toBeVisible()

      await expect(
        page.getByText(
          'Blog With 10 Likes Muhammad Basith'
        )
      ).toBeVisible()

      /*
       * Read the rendered blog components in DOM order.
       */

      const blogs = page.locator('.blog')

      await expect(blogs).toHaveCount(3)

      const titles = await blogs.allTextContents()

      /*
       * The expected order is:
       *
       * 10 likes
       * 5 likes
       * 2 likes
       */

      expect(titles[0]).toContain(
        'Blog With 10 Likes Muhammad Basith'
      )

      expect(titles[1]).toContain(
        'Blog With 5 Likes Muhammad Basith'
      )

      expect(titles[2]).toContain(
        'Blog With 2 Likes Muhammad Basith'
      )
    })
  })
})