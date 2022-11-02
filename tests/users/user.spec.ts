import { test } from '@japa/runner'

test.group('User', () => {
  test('it should create a user', async ({ client }) => {
    const userPayload = {
      email: 'test@test.com',
      username: 'test',
      password: 'test',
    }

    const response = await client.post('/users').json(userPayload)

    response.assertStatus(201)
  })
})
