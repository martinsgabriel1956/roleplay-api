import { test } from '@japa/runner'

const baseUrl = `http://${process.env.HOST}:${process.env.PORT}`

test.group('User', () => {
  test('it should create a user', async ({ assert, client }) => {
    const userPayload = {
      email: 'test@test.com',
      username: 'test',
      password: 'test',
    }

    await client.post('/users').json(userPayload)
  })
})
