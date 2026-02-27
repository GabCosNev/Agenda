const { render } = require('ejs');
const Contato = require('../models/ContatoModel')

exports.index = (req, res) => {
    res.render('contato', {
        contato: {}
    });
}
exports.register = async function (req, res) {
    try {
        const contato = new Contato(req.body);
        await contato.register()

        if (contato.errors.length > 0) {
            req.flash('errors', contato.errors);
            return req.session.save(() => res.redirect('/contato/'));
        }
        req.flash('success', 'Contato Criado');
        return req.session.save(() => res.redirect(`/contato/${contato.contato._id}`));
    }
    catch (e) {
        console.log(e);
        return res.render('404');
    }
}

exports.editContato = async function (req, res) {
    try {
        if (!req.params.id) return render('404');

        const contato = await Contato.buscaPorId(req.params.id);

        if (!contato) return res.render('404');

        res.render('contato', { contato });
    }
    catch (e) {
        console.log(e);
        render('404')
    }
}

exports.delete = async (req, res) => {
    try {
    if (!req.params.id) return render('404');

    const contato = await Contato.deleteContatos(req.params.id);

    if (!contato) return res.render('404');

    req.flash('success', 'Contato apagado com sucesso.')
    req.session.save(()=>{ res.redirect('/')})
    }
    catch(e){
        console.log(e);
        res.render('404');
    }

}

exports.edit = async function (req, res) {

    try {
        if (!req.params.id) return render('404');
        const contato = new Contato(req.body);
        await contato.edit(req.params.id)

        if (contato.errors.length > 0) {
            req.flash('errors', contato.errors);
            return req.session.save(() => res.redirect(`/contato/${req.params.id}`));
        }
        req.flash('success', 'Contato editado com sucesso');
        return req.session.save(() => res.redirect(`/contato/${contato.contato._id}`));
    }

    catch (e) {
        console.log(e);
        return res.render('404');
    }

}
