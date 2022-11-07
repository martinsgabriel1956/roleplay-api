import Database from '@ioc:Adonis/Lucid/Database'
import Mail from '@ioc:Adonis/Addons/Mail'
import { test } from '@japa/runner'
import UserFactory from 'Database/factories/UserFactory'

test.group('Passwords', (group) => {
  test('it should send email with forgot password instructions', async ({ client, assert }) => {
    const user = await UserFactory.create()

    const mailer = Mail.fake('smtp')

    const response = await client.post('/forgot-password').json({
      email: user.email,
      resetPasswordUrl: 'url',
    })

    response.assertStatus(204)

    Mail.restore()
  })

  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
  })

  group.each.teardown(async () => {
    await Database.rollbackGlobalTransaction()
  })
})
