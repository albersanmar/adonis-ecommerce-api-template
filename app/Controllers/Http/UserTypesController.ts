// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UserType from "App/Models/UserType";

import { v1 as uuidv1 } from "uuid";

export default class UserTypesController {
  public async create({ request, response }) {
    const { name } = request.all()

    if (!name) {
      return response.badRequest({
        code: "MISSING_PARAMS",
        message: "Nombre no valido",
      });
    }

    const uuid = uuidv1();
    await UserType.create({ id: uuid, name: name });
    const userType = await UserType.find(uuid)
    response.send({
      userType: userType,
    })
  }
  public async findOne({ request, response }) {
    const id = request.params().id;

    const userType = await UserType.query()
      .where('id', id)
      .preload('users')
      .first()

    response.send({
      userType: userType,
    });
  }
  public async find({ auth, response }) {
    try {
      await auth.use("api").authenticate();
      if (
        auth.use("api").user!.userTypeId !==
        "dff0dd30-b794-11ec-abe0-236257eb5adb"
      ) {
        return response.badRequest({
          code: "NOT_HAVE_PERMISSION",
          message: "No tiene permiso para hacer esta operación",
        })
      }
    } catch {
      return response.badRequest({
        code: "INVALID_API_TOKEN",
        message: "Token no valido",
      })
    }
    const userTypes = await UserType.query()
      .preload('users')

    response.send({
      userTypes: userTypes,
    });
  }
  public async update({ auth, request, response }) {
    const id = request.params().id;

    try {
      await auth.use("api").authenticate();
      let user = auth.use("api").user;
      if (user!.userTypeId === "dff0dd30-b794-11ec-abe0-236257eb5adb") {
        const { name } = request.all();
        let userType = await UserType.find(id);
        await userType!.merge({
          name: name || undefined,
        }).save();
        return response.send({
          userType: userType
        })
      } else {
        return response.badRequest({
          code: "NOT_HAVE_PERMISSION",
          message: "No tiene permiso para hacer esta operación",
        })
      }
    } catch (error) {
      return response.badRequest({
        code: "INVALID_API_TOKEN",
        message: "Token no valido",
      })
    }
  }
}
