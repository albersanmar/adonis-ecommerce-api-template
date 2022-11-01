import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class Admin {
  public async handle({ auth, response }: HttpContextContract, next: () => Promise<void>) {
    if (auth.use("api").user!.userTypeId !==
      "dff0dd30-b794-11ec-abe0-236257eb5adb")
      return response.badRequest({
        code: "NOT_HAVE_PERMISSION",
        message: "No tiene permiso para hacer esta operación",
      })
    await next()
  }
}
