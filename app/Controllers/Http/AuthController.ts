import { ErrorReporter } from './../../Reporters/ErrorReporter';
// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
//import Mail from '@ioc:Adonis/Addons/Mail'

import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Env from "@ioc:Adonis/Core/Env";

import User from "App/Models/User";

export default class AuthController {
    public async register({ request, response }) {
        const customSchema = schema.create({
            email: schema.string({ trim: true }, [
                rules.email(),
                rules.unique({ table: 'users', column: 'email' })
            ]),
            password: schema.string([
                rules.minLength(8),
                rules.maxLength(32)
            ]),
            phone: schema.string({ trim: true }, [
                rules.minLength(10),
                rules.unique({ table: 'users', column: 'phone' })
            ]),
            name: schema.string({ trim: true }, [
                rules.minLength(3),
                rules.maxLength(64)
            ]),
            lastName: schema.string({ trim: true }, [
                rules.minLength(3),
                rules.maxLength(64)
            ])
        })
        const customMessages = {
            unique: '{{ field }} ya existe',
            required: '{{ field }} es requerido',
            minLength: '{{ field }} debe ser minimo de {{ options.minLength }} caracteres',
            maxLength: '{{ field }} debe ser maximo de {{ options.maxLength }} caracteres',
            email: 'Email no valido',
            phone: 'Telefono no valido',
        }

        try {
            const payload = await request.validate({ schema: customSchema, messages: customMessages, reporter: ErrorReporter })
            const user = await User.create({
                ...payload
            })
            return response.send({
                user: user
            })
        } catch (error) {
            console.log(error)
            if (error.messages?.errors?.length > 0) {
                return response.badRequest(error.messages.errors[0])
            }
            return response.babRequest(error)
        }

        /*
        user = await User.create({
            id: uuid,
            name: name,
            email: email,
            phone: phone,
            password: password,
            userTypeId: "01f92010-c7d8-11ec-a218-f9aad418431a", // Cliente
            confirm: true,
        });*/

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
