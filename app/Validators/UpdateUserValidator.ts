import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateUserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    password: schema.string({}, [rules.minLength(4)]),
    email: schema.string({}, [rules.email()]),
    avatar: schema.string.optional({}, [rules.url()]),
  })

  public messages: CustomMessages = {}
}
