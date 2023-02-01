/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})

Route.group(() => {
  // Permissions
  Route.group(() => {
    Route.post('/', 'PermissionsController.store')
    Route.get('/', 'PermissionsController.index')
    Route.get('/:id', 'PermissionsController.show')
    Route.put('/:id', 'PermissionsController.update')
  }).prefix('permissions').middleware(['auth', 'is:root,administrador'])
  // Roles
  Route.group(() => {
    Route.post('/', 'RolesController.store')
    Route.get('/', 'RolesController.index')
    Route.get('/:id', 'RolesController.show')
    Route.put('/:id', 'RolesController.update')
  }).prefix('roles').middleware(['auth', 'is:root,administrador'])
  // Auth
  Route.group(() => {
    Route.post('/register', 'AuthController.register')
    Route.post('/login', 'AuthController.login')
    Route.post('/confirm', 'AuthController.confirm')
  }).prefix('auth')
  Route.group(() => {
    Route.post('/logout', 'AuthController.logout')
  }).prefix('auth').middleware(['auth'])
  // Users
  Route.group(() => {
    Route.post('/', 'UsersController.create')
  }).prefix('users').middleware(['auth'])
  Route.group(() => {
    Route.get('/me', 'UsersController.me')
    Route.put('/:id', 'UsersController.update')
    Route.get('/:id', 'UsersController.findOne')
    Route.get('/', 'UsersController.find')
  }).prefix('users').middleware(['auth'])
}).prefix('api/v1')