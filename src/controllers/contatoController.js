const Contato = require('../models/ContatoModel')

exports.index = (req, res) => {
    res.render('contato');
}
exports.register = async function (req, res) {
    try {
        const contato = new Contato(req.body);
        await contato.register()

        if (contato.errors.length > 0) {
            req.flash('errors', contato.errors);
            return req.session.save(() => res.redirect('/contato'));
        }
        req.flash('success', 'Contato Criado');
        return req.session.save(() => res.redirect('/contato'));
    }
    catch (e) {
        console.log(e);
        return res.render('404');
    }
}


