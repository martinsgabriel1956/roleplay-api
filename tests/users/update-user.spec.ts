import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import UserFactory from 'Database/factories/UserFactory'
import Hash from '@ioc:Adonis/Core/Hash'

test.group('Update User', (group) => {
  test('it should update an user', async ({ client, assert }) => {
    const { id, password } = await UserFactory.create()
    const email = 'test@test.com'
    const avatar = 'http://github.com/martinsgabriel1956.png'

    const response = await client.put(`/users/${id}`).json({
      email,
      avatar,
      password,
    })

    response.assertStatus(200)
    response.assertBodyContains({
      user: {
        email,
        avatar,
        id,
      },
    })
  })

  test('it should update the password of the user', async ({ assert, client }) => {
    const user = await UserFactory.create()
    const password = 'test'

    const response = await client.put(`/users/${user.id}`).json({
      email: user.email,
      avatar: user.avatar,
      password,
    })

    response.assertStatus(200)
    response.assertBodyContains({
      user: {
        id: user.id,
      },
    })

    await user.refresh()
    assert.isTrue(await Hash.verify(user.password, password))
  })

  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
  })

  group.each.teardown(async () => {
    await Database.rollbackGlobalTransaction()
  })
})
