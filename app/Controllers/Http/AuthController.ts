// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
//import Mail from '@ioc:Adonis/Addons/Mail'
import Env from "@ioc:Adonis/Core/Env";

import User from "App/Models/User";
import UserType from "App/Models/UserType";

import { v1 as uuidv1 } from "uuid";

export default class AuthController {
    public async register({ request, response }) {
        const userType = request.input("userType");
        const email = request.input("email");
        const name = request.input("name");
        const password = request.input("password");
        if (!userType) {
            response.badRequest({
                code: "USER_TYPE_INVALID",
                message: "Tipo de usuario no valido",
            });
            return;
        }
        if (typeof password !== "string") {
            response.badRequest({
                code: "PASSWORD_INVALID",
                message: "Contraseña no valida",
            });
            return;
        }
        if (!this.ValidateEmail(email)) {
            response.badRequest({
                code: "EMAIL_INVALID",
                message: "Email no valido",
            });
            return;
        }
        const users = await User.query().where("email", email);
        if (users.length > 0) {
            response.badRequest({
                code: "EMAIL_EXISTS",
                message: "El email ya es usuado por otro usuario",
            });
            return;
        }
        switch (userType) {
            case "01f92010-c7d8-11ec-a218-f9aad418431a": // Proveedor
                // case "dff0dd30-b794-11ec-abe0-236257eb5adb": // Administrador
                const uuid = uuidv1();
                const userTypeM = await UserType.find(userType);
                const user = await User.create({
                    id: uuid,
                    name: name,
                    email: email,
                    password: password,
                    confirm: true,
                });
                await userTypeM?.related("users").save(user);
                /*await Mail.send((message) => {
                                    message
                                        .from(Env.get('SMTP_USERNAME'))
                                        .to(email)
                                        .subject('Bienvenido a LiveRanch')
                                        .htmlView('emails/confirm', {
                                            url: `${Env.get('ROOT_URL')}api/v1/auth/confirm?token=${uuid}`,
                                        })
                                })*/
                response.status(200);
                response.send({
                    code: "USER_CREATED_SUCCESSFULLY",
                    message: "Usuario creado correctamenta",
                    user: user,
                });
                return;
            default:
                response.badRequest({
                    code: "USER_TYPE_INVALID",
                    message: "Tipo de usuario no valido",
                });
                return;
        }
    }
    public async login({ auth, request, response }) {
        const email = request.input("email");
        const password = request.input("password");
        if (typeof password !== "string") {
            response.badRequest({
                code: "PASSWORD_INVALID",
                message: "Contraseña no valida",
            });
            return;
        }
        if (!this.ValidateEmail(email)) {
            response.badRequest({
                code: "EMAIL_INVALID",
                message: "Email no valido",
            });
            return;
        }
        const users = await User.query().where("email", email);
        if (users.length === 0) {
            response.badRequest({
                code: "INVALID_CREDENTIALS",
                message: "El usuario no existe",
            });
            return;
        } else if (users[0].confirm !== true) {
            response.badRequest({
                code: "USER_NOT_CONFIRMED",
                message: "El usuario no ha sido confirmado",
            });
            return;
        } else if (users[0].blocked === true) {
            response.badRequest({
                code: "USER_BLOCKED",
                message: "Usuario bloqueado",
            });
            return;
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
        response.status(200);
        response.send({
            code: "SESSION_CLOSED_SUCCESSFULLY",
            message: "Sesión cerrada correctamente",
        });
        return;
    }
    public async confirm({ request, response }) {
        const token = request.all().token;
        const user = await User.findBy("confirm_token", token);
        if (user !== null) {
            user!.confirm = true;
            user!.confirmToken = "";
            user!.save();
        }
        response.redirect().toPath(Env.get("REDIRECT_URL"));
    }
    private ValidateEmail(email: string): Boolean {
        const regex =
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        return regex.test(email);
    }
}
