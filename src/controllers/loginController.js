const Login = require('../models/LoginModel')

exports.loginRegister = (req, res) => {
    if(req.session.user) return res.render('loginLogado');
    return res.render('loginRegister');
}

exports.register = async function (req, res) {
    try {
        const login = new Login(req.body);
        await login.register();

        if (login.errors.length > 0) {
            req.flash('errors', login.errors);
            return req.session.save(() => res.redirect('/login/register'));
        }
        req.flash('success', 'Usuário cadastrado com sucesso!');
        return req.session.save(() => res.redirect('/login/register'));

    } catch (e) {
        console.log(e);
        return res.render('404');
    }
}
exports.login = async function (req, res) {
    try {
        const login = new Login(req.body);
        await login.login();

        if (login.errors.length > 0) {
            req.flash('errors', login.errors);
            return req.session.save(() => res.redirect('/login/register'));
        }
        req.session.user = login.user;
        return req.session.save(() => res.redirect('/'));

    } catch (e) {
        console.log(e);
        return res.render('404');
    }
}

exports.logout = function (req, res) {
    req.session.destroy();
    res.redirect('/')
}