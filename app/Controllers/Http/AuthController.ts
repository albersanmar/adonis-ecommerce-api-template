// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
//import Mail from '@ioc:Adonis/Addons/Mail'
import Env from "@ioc:Adonis/Core/Env";

import User from "App/Models/User";

import { v1 as uuidv1 } from "uuid";

export default class AuthController {
    public async register({ request, response }) {
        const { email, name, phone, password, } = request.all()

        if (!email || !name || !phone || !password) {
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
            .first();
        if (user) {
            return response.badRequest({
                code: "EMAIL_EXISTS",
                message: "El email ya es usuado por otro usuario",
            });
        }

        const uuid = uuidv1();
        user = await User.create({
            id: uuid,
            name: name,
            email: email,
            phone: phone,
            password: password,
            userTypeId: "01f92010-c7d8-11ec-a218-f9aad418431a", // Cliente
            confirm: true,
        });

    }
    public async login({ auth, request, response }) {
        const { email, password } = request.all()

        if (!email || !password) {
            return response.badRequest({
                code: "MISSING_PARAMS",
                message: "Faltan parametros",
            });
        }

        if (!this.ValidateEmail(email)) {
            return response.badRequest({
                code: "EMAIL_INVALID",
                message: "Email no valido",
            });
        }
        const user = await User.query()
            .where("email", email)
            .first()
        if (!user) {
            return response.badRequest({
                code: "USER_NOT_FOUND",
                message: "El usuario no existe",
            })
        }
        if (!user.confirm) {
            return response.badRequest({
                code: "USER_NOT_CONFIRMED",
                message: "El usuario no ha sido confirmado",
            })
        }
        if (user.blocked) {
            return response.badRequest({
                code: "USER_BLOCKED",
                message: "Usuario bloqueado",
            })
        }
        try {
            const token = await auth.use("api").attempt(email, password);
            return token;
        } catch (error) {
            return response.badRequest({
                code: "INVALID_CREDENTIALS",
                message: "Correo o contraseña invalido",
            });
        }
    }
    public async logout({ auth, response }) {
        await auth.use("api").revoke();
        return response.send({
            code: "SESSION_CLOSED_SUCCESSFULLY",
            message: "Sesión cerrada correctamente",
        });
    }
    public async confirm({ request, response }) {
        const token = request.all().token;
        const user = await User.findBy("confirm_token", token);
        if (user !== null) {
            user!.confirm = true;
            user!.confirmToken = "";
            user!.save();
        }
        return response.redirect().toPath(Env.get("REDIRECT_URL"));
    }
    private ValidateEmail(email: string): Boolean {
        const regex =
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        return regex.test(email);
    }
}
