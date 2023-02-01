export default {
    unique: '{{ field }} ya existe',
    required: '{{ field }} es requerido',
    minLength: '{{ field }} debe ser minimo de {{ options.minLength }} caracteres',
    maxLength: '{{ field }} debe ser maximo de {{ options.maxLength }} caracteres',
    email: 'Email no valido',
    phone: 'Telefono no valido',
    'password.regex': 'Formato de contraseña invalido',
    'name.regex': 'Formato de nombre(s) invalido',
    'lastName.regex': 'Formato de apellidos invalido',
    'permissions.array': 'Lista de permisos no valida',
    'permissions.*.string': 'Permiso no valido',
    'permissions.*.exists': 'Permiso no existe',
}