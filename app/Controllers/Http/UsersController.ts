// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// import Mail from '@ioc:Adonis/Addons/Mail'

import User from "App/Models/User";

import { v1 as uuidv1 } from "uuid";

export default class UsersController {
  public async create({ request, response }) {
    const { email, name, phone, password, userTypeId } = request.all()
    if (!email || !name || !phone || !userTypeId) {
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

    let user = await User.query()
      .where("email", email)
      .first()
    if (user) {
      return response.badRequest({
        code: "EMAIL_EXISTS",
        message: "El email ya es usuado por otro usuario",
      })
    }

    const userType = await UserType.find(userTypeId);
    if (!userType) {
      return response.badRequest({
        code: "INVALID_USER_TYPE",
        message: "Tipo de usuario no valido",
      });
    }

    const uuid = uuidv1();
    user = await User.create({
      id: uuid,
      name: name,
      email: email,
      password: password,
      phone: phone,
      userTypeId: userTypeId,
      confirm: true,
    });

    return response.send({
      user: user,
    });
  }

  public async find({ response }) {
    let users = await User.query().preload("userType");
    return response.send({
      users: users,
    });
  }

  public async update({ request, response }) {
    const id = request.params().id;

    const { name, email, phone, password, userTypeId } = request.all();

    if (email) {
      const user = await User.query()
        .where('email', email)
        .first()

      if (user) {
        return response.badRequest({
          code: "EMAIL_EXISTS",
          message: "El email ya es usuado por otro usuario",
        })
      }
    }

    const user = await User.find(id);

    await user!.merge({
      name: name || undefined,
      email: email || undefined,
      phone: phone || undefined,
      password: password || undefined,
      userTypeId: userTypeId || undefined,
    }).save();

    return response.send({
      user: user,
    });
  }

  public async findOne({ request, response }) {
    const id = request.params().id;
    const user = await User.query()
      .where("id", id)
      .preload("userType")
      .first();
    return response.send({
      user: user,
    });
  }
  public async me({ auth, response }) {
    const authUser = auth.use("api").user!

    const user = await User.query()
      .where("id", authUser.id)
      .preload("roles")
      .first()

    response.send({
      user: user,
    });
  }
}
