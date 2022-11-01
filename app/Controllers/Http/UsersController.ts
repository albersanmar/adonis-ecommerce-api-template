// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// import Mail from '@ioc:Adonis/Addons/Mail'

import User from "App/Models/User";
import UserType from 'App/Models/UserType';

import { v1 as uuidv1 } from "uuid";

export default class UsersController {
  public async create({ auth, request, response }) {
    const { email, name, phone, password, userTypeId } = request.all()
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
      })
    }
    if (!email || !name || !userTypeId) {
      return response.badRequest({
        code: "MISSING_PARAMS",
        message: "Faltan parametros",
      });
    }

    if (!this.ValidateEmail(email)) {
      return response.badRequest({
        code: "EMAIL_INVALID",
        message: "Email no valido",
      })
    }
    const user = await User.query()
      .where("email", email)
      .first()
    if (user) {
      return response.badRequest({
        code: "EMAIL_EXISTS",
        message: "El email ya es usuado por otro usuario",
      })
    }
    switch (userTypeId) {
      case "dff0dd30-b794-11ec-abe0-236257eb5adb": // Administrador
      case "01f92010-c7d8-11ec-a218-f9aad418431a": // Cliente
        const uuid = uuidv1();
        const userType = await UserType.find(userTypeId);
        const user = await User.create({
          id: uuid,
          name: name,
          email: email,
          password: password || undefined,
          phone: phone || undefined,
          confirm: true,
        });
        await userType?.related('users').save(user)
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
          user: user,
        });
      default:
        return response.badRequest({
          code: "USER_TYPE_INVALID",
          message: "Tipo de usuario no valido",
        });
    }
  }
  public async find({ response }) {
    let users = await User.query().preload("userType");
    return response.send({
      users: users,
    });
  }
  public async update({ auth, request, response }) {
    const id = request.params().id;
    let user = auth.use("api").user;
    if (
      user!.id === id ||
      user!.userTypeId === "dff0dd30-b794-11ec-abe0-236257eb5adb"
    ) {
      const { name, email, phone, password, userTypeId } = request.all();
      user = await User.find(id);
      await user.merge({
        name: name || undefined,
        email: email || undefined,
        phone: phone || undefined,
        password: password || undefined,
        userTypeId: userTypeId || undefined,
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
    const authUser = auth.use("api").user!

    const user = await User.query()
      .where("id", authUser.id)
      .preload("userType")
      .first()

    response.send({
      user: user,
    });
  }
  private ValidateEmail(email: string): Boolean {
    const regex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    return regex.test(email);
  }
}
