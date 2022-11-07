import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import UserFactory from 'Database/factories/UserFactory'
import Hash from '@ioc:Adonis/Core/Hash'

test.group('Update User', (group) => {
  test('it should update an user', async ({ client }) => {
    const { id, password } = await UserFactory.create()
    const email = 'email@testemail.com'
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

  test('it should return 422 when required data is not provided', async ({ assert, client }) => {
    const { id } = await UserFactory.create()
    const response = await client.put(`/users/${id}`).json({})
    response.assertStatus(422)
    assert.equal(response.body().code, 'BAD_REQUEST')
    assert.equal(response.body().status, 422)
  })

  test('it should return 422 when providing an invalid email', async ({ assert, client }) => {
    const { id, password, avatar } = await UserFactory.create()
    const response = await client.put(`/users/${id}`).json({
      password,
      avatar,
      email: 'test@',
    })

    response.assertStatus(422)
    assert.equal(response.body().code, 'BAD_REQUEST')
    assert.equal(response.body().status, 422)
  })

  test('it should return 422 when providing an invalid password', async ({ assert, client }) => {
    const { id, email, avatar } = await UserFactory.create()
    const response = await client.put(`/users/${id}`).json({
      password: 'tes',
      email,
      avatar,
    })

    response.assertStatus(422)
    assert.equal(response.body().code, 'BAD_REQUEST')
    assert.equal(response.body().status, 422)
  })

  test('it should return 422 when providing an invalid avatar', async ({ assert, client }) => {
    const { id, password, email } = await UserFactory.create()
    const response = await client.put(`/users/${id}`).json({
      password,
      email,
      avatar: 'cvdsbjv',
    })

    response.assertStatus(422)
    assert.equal(response.body().code, 'BAD_REQUEST')
    assert.equal(response.body().status, 422)
  })

  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
  })

  group.each.teardown(async () => {
    await Database.rollbackGlobalTransaction()
  })
})
