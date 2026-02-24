require('dotenv').config();

const path = require('path');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const routes = require('./route');
const { middlewareGlobal, checkCsrfError, csrfMiddleware } = require('./src/middlewares/middleware');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const helmet = require('helmet');
const csrf = require('csurf');

//Conexão com MongoDB
mongoose.connect(process.env.CONNECTION_STRING)
  .then(() => {
    console.log('Conectado ao MongoDB');

    app.listen(3000, () => {
      console.log('Servidor rodando em http://localhost:3000');
    });
  })
  .catch(e => console.log('Erro ao conectar no MongoDB:', e));

//Configuração da sessão
const sessionOptions = session({
  secret: process.env.SESSION_SECRET || 'segredoSuperSeguro',
  store: MongoStore.create({
    client: mongoose.connection.getClient()
  }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true
  }
});

// Configurações
app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

//Middlewares básicos
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(helmet({ contentSecurityPolicy: false }));
//Ordem correta (IMPORTANTE)
app.use(sessionOptions);
app.use(flash());
app.use(csrf());

app.use(middlewareGlobal);
app.use(csrfMiddleware);   // gera o token
app.use(checkCsrfError);   // trata erro
app.use(routes);

//Tratamento de erro geral
app.on('error', (err) => {
  console.log('Erro na aplicação:', err);
});