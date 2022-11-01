import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class User {
  public async handle({ auth, request, response }: HttpContextContract, next: () => Promise<void>) {
    const id = request.params().id
    const user = auth.use("api").user
    if (
      user!.userTypeId !== "dff0dd30-b794-11ec-abe0-236257eb5adb" && // Admin
      user!.id === id
    )
      return response.badRequest({
        code: "NOT_HAVE_PERMISSION",
        message: "No tiene permiso para hacer esta operación",
      })
    await next()
  }
}
