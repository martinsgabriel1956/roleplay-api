import { test } from '@japa/runner'

test.group('User', () => {
  test('it should create a user', async ({ client, assert }) => {
    const userPayload = {
      email: 'test@test.com',
      username: 'test',
      password: 'test',
      avatar: 'https://images.com/avatar/1',
    }

    const response = await client.post('/users').json(userPayload)
    const { password, avatar, ...expected } = userPayload

    response.assertStatus(201)
    response.assertBodyContains({ user: expected })
    assert.notExists(response.body().user.password, 'Password defined')
  })
})
