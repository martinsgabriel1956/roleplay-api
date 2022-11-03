import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import UserFactory from 'Database/factories/UserFactory'

test.group('User', (group) => {
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

  test('it should return 409 when email is already in use', async ({ assert, client }) => {
    const { email } = await UserFactory.create()

    const response = await client.post('/users').json({
      email,
      username: 'test',
      password: 'test',
      avatar: 'https://images.com/avatar/1',
    })

    response.assertStatus(409)
    assert.include(response.body().message, 'email')
  })

  test('it should return 409 when username is already in use', async ({ assert, client }) => {
    const { username } = await UserFactory.create()

    const response = await client.post('/users').json({
      email: 'test@test.com',
      username,
      password: 'test',
      avatar: 'https://images.com/avatar/1',
    })

    response.assertStatus(409)
    assert.include(response.body().message, 'username')
  })

  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
  })

  group.each.teardown(async () => {
    await Database.rollbackGlobalTransaction()
  })
})
