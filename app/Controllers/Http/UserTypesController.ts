// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UserType from "App/Models/UserType";

import { v1 as uuidv1 } from "uuid";

export default class UserTypesController {
  public async create({ auth, request, response }) {
    try {
      await auth.use("api").authenticate();
      if (
        auth.use("api").user!.userTypeId !==
        "dff0dd30-b794-11ec-abe0-236257eb5adb"
      ) {
        response.status(400);
        response.send({
          code: "NOT_HAVE_PERMISSION",
          message: "No tiene permiso para hacer esta operación",
        });
        return;
      }
    } catch {
      response.status(400);
      response.send({
        code: "INVALID_API_TOKEN",
        message: "Token no valido",
      });
      return;
    }
    const name = request.input("name");
    if (typeof name !== "string") {
      response.status(400);
      response.send({
        code: "NAME_INVALID",
        message: "Nombre no valido",
      });
      return;
    }
    const uuid = uuidv1();
    const userType = await UserType.create({ id: uuid, name: name });
    response.status(200);
    response.send({
      code: "SUCCESSFULLY_REGISTED_USER_TYPE",
      message: "Tipo de usuario creado exitosamente",
      userType: userType,
    });
  }
  public async findOne({ request, response }) {
    const id = request.params().id;
    if (typeof id !== "string") {
      response.status(400);
      response.send({
        code: "ID_INVALID",
        message: "ID no valido",
      });
      return;
    }
    const userType = await UserType.find(id);
    if (userType === null) {
      response.status(400);
      response.send({
        code: "USER_TYPE_NOT_EXIST",
        message: "El tipo de usuario no existe",
      });
      return;
    }
    response.status(200);
    response.send({
      userType: userType,
    });
  }
  public async find({ auth, request, response }) {
    const name = request.all().name;
    try {
      await auth.use("api").authenticate();
      if (
        auth.use("api").user!.userTypeId !==
        "dff0dd30-b794-11ec-abe0-236257eb5adb"
      ) {
        response.status(400);
        response.send({
          code: "NOT_HAVE_PERMISSION",
          message: "No tiene permiso para hacer esta operación",
        });
        return;
      }
    } catch {
      response.status(400);
      response.send({
        code: "INVALID_API_TOKEN",
        message: "Token no valido",
      });
      return;
    }
    let userTypes;
    if (typeof name === "string") {
      userTypes = await UserType.query().where("name", name);
    } else {
      userTypes = await UserType.query();
    }
    response.status(200);
    response.send({
      userTypes: userTypes,
    });
  }
  public async update({ auth, request, response }) {
    const id = request.params().id;
    if (typeof id !== "string") {
      response.status(400);
      response.send({
        code: "ID_INVALID",
        message: "ID no valido",
      });
      return;
    }
    try {
      await auth.use("api").authenticate();
      let user = auth.use("api").user;
      if (user!.userTypeId === "dff0dd30-b794-11ec-abe0-236257eb5adb") {
        const userTypeFields = request.all();
        let userType = await UserType.find(id);
        await userType!.merge(userTypeFields).save();
        response.status(200);
        response.send({
          code: "USER_UPDATED_SUCCESFULLY",
          message: "Tipo de usuario actualizado correctamente",
          userType: userType
        });
        return;
      } else {
        response.status(400);
        response.send({
          code: "NOT_HAVE_PERMISSION",
          message: "No tiene permiso para hacer esta operación",
        });
        return;
      }
    } catch (error) {
      response.status(400);
      response.send({
        code: "INVALID_API_TOKEN",
        message: "Token no valido",
      });
      return;
    }
  }
}
