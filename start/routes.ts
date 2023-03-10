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
    Route.post('/', 'PermissionsController.store').middleware('is:root')
    Route.put('/:id', 'PermissionsController.update').middleware('is:root')
    Route.get('/', 'PermissionsController.show').middleware('is:root,administrador')
    Route.get('/:id', 'PermissionsController.index').middleware('is:root,administrador')
  }).prefix('permissions').middleware(['auth'])
  // Roles
  Route.group(() => {
    Route.post('/', 'RolesController.store').middleware('is:root')
    Route.put('/:id', 'RolesController.update').middleware('is:root')
    Route.get('/', 'RolesController.show').middleware('is:root,administrador')
    Route.get('/:id', 'RolesController.index').middleware('is:root,administrador')
  }).prefix('roles').middleware(['auth'])
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
    Route.group(() => {
      Route.get('/', 'UserFavoriteProductsController.show')
      Route.post('/attach', 'UserFavoriteProductsController.store')
      Route.delete('/detach', 'UserFavoriteProductsController.delete')
    }).prefix('favorite/products').middleware('is:cliente')
    Route.post('/', 'UsersController.store').middleware('is:root,administrador')
    Route.put('/:id', 'UsersController.update').middleware('is:root,administrador,cliente')
    Route.get('/', 'UsersController.show')
    Route.get('/me', 'UsersController.me')
    Route.get('/:id', 'UsersController.index')
  }).prefix('users').middleware(['auth'])
  // Media
  Route.group(() => {
    Route.post('/', 'MediaController.store')
    Route.get('/', 'MediaController.show')
    Route.get('/:id', 'MediaController.index')
    Route.delete('/:id', 'MediaController.delete')
    Route.put('/:id', 'MediaController.update')
  }).prefix('media/upload').middleware(['auth', 'is:root,administrador,cliente'])
  // Categories
  Route.group(() => {
    Route.post('/', 'CategoriesController.store')
    Route.delete('/:id', 'CategoriesController.delete')
    Route.put('/:id', 'CategoriesController.update')
  }).prefix('categories').middleware(['auth', 'is:root,administrador'])
  Route.group(() => {
    Route.get('/', 'CategoriesController.show')
    Route.get('/:id', 'CategoriesController.index')
  }).prefix('categories')
  // Commerces
  Route.group(() => {
    Route.get('/', 'CommercesController.showMe')
    Route.put('/', 'CommercesController.updateMe')
  }).prefix('commerces/me').middleware(['auth', 'is:cliente'])
  Route.group(() => {
    Route.post('/', 'CommercesController.store')
    Route.put('/:id', 'CommercesController.update')
  }).prefix('commerces').middleware(['auth', 'is:root,administrador'])
  Route.group(() => {
    Route.get('/', 'CommercesController.show')
    Route.get('/:id', 'CommercesController.index')
  }).prefix('commerces')
  // Products
  Route.group(() => {
    Route.post('/', 'ProductsController.store')
    Route.put('/:id', 'ProductsController.update')
  }).prefix('products').middleware(['auth', 'is:root,administrador,cliente'])
  Route.group(() => {
    Route.get('/', 'ProductsController.show')
    Route.get('/:id', 'ProductsController.index')
  }).prefix('products')
  // Cart
  Route.group(() => {
    Route.get('/', 'CartsController.show')
    Route.post('/attach', 'CartsController.store')
    Route.delete('/detach', 'CartsController.delete')
  }).prefix('carts')
}).prefix('api/v1')