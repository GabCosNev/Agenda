const express = require('express');
const route = express.Router();
const homeController = require('./src/controllers/homeController');
const loginController = require('./src/controllers/loginController');
const contatoController = require('./src/controllers/contatoController');
const {loginRequired} = require('./src/middlewares/middleware');

//Rotas da home
route.get('/', homeController.index);

//Rotas user
route.get('/user/loginRegister', loginController.loginRegister);
route.get('/user/logout', loginController.logout);
route.post('/user/register', loginController.register);
route.post('/user/login', loginController.login);

//Rotas Contato
route.get('/contato', loginRequired, contatoController.index);
route.post('/contato/register', loginRequired, contatoController.register);
route.post('/contato/edit/:id', loginRequired, contatoController.edit);
route.get('/contato/:id', loginRequired, contatoController.editContato);
route.get('/contato/delete/:id', loginRequired, contatoController.delete);

module.exports = route;