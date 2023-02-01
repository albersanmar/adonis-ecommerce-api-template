import {
    ValidationException,
    MessagesBagContract,
    ErrorReporterContract,
} from '@ioc:Adonis/Core/Validator'

/**
 * The shape of an individual error
 */
type ErrorNode = {
    code: string,
    message: string,
}

export class ErrorReporter implements ErrorReporterContract<{ errors: ErrorNode[] }> {
    public hasErrors = false

    private errors: ErrorNode[] = []

    constructor(
        private messages: MessagesBagContract,
        private bail: boolean,
    ) {
    }

    public report(
        pointer: string,
        rule: string,
        message: string,
        arrayExpressionPointer?: string,
        args?: any
    ) {
        this.hasErrors = true

        const errorMessage = this.messages.get(
            pointer,
            rule,
            message,
            arrayExpressionPointer,
            args,
        )
        let code = ''
        console.log(rule, pointer, arrayExpressionPointer, args)
        switch (rule) {
            case 'required':
                code = 'MISSING_PARAMS'
                break
            case 'unique':
                code = 'NON_UNIQUE_PARAMS'
                break
            case 'minLength':
            case 'maxLength':
                code = 'PARAMS_LENTH'
                break
            case 'email':
                code = 'INVALID_EMAIL'
                break
            case 'phone':
                code = 'INVALID_PHONE'
                break
            case 'regex':
                code = 'INVALID_FORMAT'
                break
            case 'array':
                code = 'INVALID_ARRAY'
                break
            case 'string':
                code = 'INVALID_STRING'
                break
            case 'exists':
                code = 'ELEMENT_NOT_FOUND'
                break
        }

        this.errors.push({ message: errorMessage, code: code })

        if (this.bail) {
            throw this.toError()
        }
    }

    public toError() {
        throw new ValidationException(false, this.toJSON())
    }

    public toJSON() {
        return {
            errors: this.errors,
        }
    }
}