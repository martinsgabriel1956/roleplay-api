import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import UserFactory from 'Database/factories/UserFactory'

test.group('Update User', (group) => {
  test('it should update an user', async ({ client }) => {
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

  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
  })

  group.each.teardown(async () => {
    await Database.rollbackGlobalTransaction()
  })
})
