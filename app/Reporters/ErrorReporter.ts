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

    /**
     * Tracking reported errors
     */
    private errors: ErrorNode[] = []

    constructor(
        private messages: MessagesBagContract,
        private bail: boolean,
    ) {
    }

    /**
     * Invoked by the validation rules to
     * report the error
     */
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
        console.log(rule, pointer)
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