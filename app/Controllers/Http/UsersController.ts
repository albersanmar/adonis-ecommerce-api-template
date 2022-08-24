// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// import Mail from '@ioc:Adonis/Addons/Mail'

import User from "App/Models/User";
import UserType from 'App/Models/UserType';

import { v1 as uuidv1 } from "uuid";

export default class UsersController {
  public async create({ auth, request, response }) {
    const userType = request.input("userType");
    const email = request.input("email");
    const name = request.input("name");
    const password = request.input("password");
    try {
      await auth.use("api").authenticate();
      if (
        auth.use("api").user!.userTypeId !==
        "dff0dd30-b794-11ec-abe0-236257eb5adb"
      ) {
        response.status(400);
        response.badRequest({
          code: "NOT_HAVE_PERMISSION",
          message: "No tiene permiso para hacer esta operación",
        });
        return;
      }
    } catch {
      response.status(400);
      response.badRequest({
        code: "INVALID_API_TOKEN",
        message: "Token no valido",
      });
      return;
    }
    if (!userType) {
      response.status(400);
      response.send({
        code: "USER_TYPE_INVALID",
        message: "Tipo de usuario no valido",
      });
      return;
    }
    if (typeof password !== "string") {
      response.status(400);
      response.badRequest({
        code: "PASSWORD_INVALID",
        message: "Contraseña no valida",
      });
      return;
    }
    if (!this.ValidateEmail(email)) {
      response.status(400);
      response.badRequest({
        code: "EMAIL_INVALID",
        message: "Email no valido",
      });
      return;
    }
    const users = await User.query().where("email", email);
    if (users.length > 0) {
      response.status(400);
      response.badRequest({
        code: "EMAIL_EXISTS",
        message: "El email ya es usuado por otro usuario",
      });
      return;
    }
    switch (userType) {
      case "dff0dd30-b794-11ec-abe0-236257eb5adb": // Administrador
      case "01f92010-c7d8-11ec-a218-f9aad418431a": // Cliente
        const uuid = uuidv1();
        const userTypeM = await UserType.find(userType);
        const user = await User.create({
          id: uuid,
          name: name,
          email: email,
          password: password,
          confirm: true,
        });
        await userTypeM?.related('users').save(user)
        /*await Mail.send((message) => {
                    message
                        .from(Env.get('SMTP_USERNAME'))
                        .to(email)
                        .subject('Bienvenido a LiveRanch')
                        .htmlView('emails/confirm', {
                            url: `${Env.get('ROOT_URL')}api/v1/auth/confirm?token=${uuid}`,
                        })
                })*/
        return response.send({
          code: "USER_CREATED_SUCCESSFULLY",
          message: "Usuario creado correctamenta",
          user: user,
        });
      default:
        return response.badRequest({
          code: "USER_TYPE_INVALID",
          message: "Tipo de usuario no valido",
        });
    }
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
        });
      }
    } catch {
      return response.badRequest({
        code: "INVALID_API_TOKEN",
        message: "Token no valido",
      });
    }
    let users = await User.query().preload("userType");
    return response.send({
      users: users,
    });
  }
  public async update({ auth, request, response }) {
    const id = request.params().id;
    if (typeof id !== "string") {
      return response.badRequest({
        code: "ID_INVALID",
        message: "ID no valido",
      });
    }
    let user = auth.use("api").user;
    if (
      user!.id === id ||
      user!.userTypeId === "dff0dd30-b794-11ec-abe0-236257eb5adb"
    ) {
      const userFields = request.all();
      user = await User.find(id);
      await user.merge({
        name: userFields.name || undefined,
        userTypeId: userFields.userTypeId || undefined,
        publicName: userFields.publicName || undefined,
        profilePicture: userFields.profilePicture || undefined,
        phone: userFields.phone || undefined,
        birthday: userFields.birthday || undefined,
        description: userFields.description || undefined,
        city: userFields.city || undefined,
        state: userFields.state || undefined,
        ranchName: userFields.ranchName || undefined,
        ranchDescription: userFields.ranchDescription || undefined,
        ranchImages: userFields.ranchImages ? JSON.stringify(userFields.ranchImages) : undefined,
      }).save();
      return response.send({
        user: user,
      });
    } else {
      return response.badRequest({
        code: "NOT_HAVE_PERMISSION",
        message: "No tiene permiso para hacer esta operación",
      });
    }
  }
  public async findOne({ request, response }) {
    const id = request.params().id;
    const users = await User.query().where("id", id).preload("userType");
    return response.send({
      user: users[0],
    });
  }
  public async me({ auth, response }) {
    let user = auth.use("api").user!;
    let users = await User.query()
      .where("id", user.id)
      .preload("userType")
    response.status(200);
    response.send({
      user: users[0],
    });
  }
  private ValidateEmail(email: string): Boolean {
    const regex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return regex.test(email);
  }
}
