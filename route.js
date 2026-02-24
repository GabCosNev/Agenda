const express = require('express')
const route = express.Router();
const homeController = require('./src/controllers/homeController')
const loginController = require('./src/controllers/loginController')


//Rotas da home
route.get('/', homeController.agenda);

//Rotas de login
route.get('/login/register', loginController.loginRegister);
route.get('/logout', loginController.logout);

//post login
route.post('/register', loginController.register);
route.post('/login', loginController.login);



module.exports = route;