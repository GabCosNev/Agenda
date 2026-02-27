const mongoose = require('mongoose');
const validator = require('validator')

const contatoSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        trim: true
    },
    sobrenome: {
        type: String,
        required: false,
        default: '',
        trim: true
    },
    email: {
        type: String,
        required: false,
        unique: true,
        sparse: true,
        lowercase: true
    },
    telefone: {
        type: String,
        required: false,
        default: '',
        lowercase: true
    },
    criadoEm: {
        type: Date, default: Date.now
    }

});

const ContatoModel = mongoose.model('contato', contatoSchema);

class Contato {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.contato = null;
    }

    static async buscaPorId(id) {
        if (typeof id !== 'string') return;
        const contato = await ContatoModel.findById(id)
        return contato;
    }

    static async buscaContatos() {
        const contatos = await ContatoModel.find()
            .sort({ criadoEm: -1 });
        return contatos;

    }
    static async deleteContatos(id) {
        if (typeof id !== 'string') return;
        const contato = await ContatoModel.findByIdAndDelete(id)
        return contato
    }

    async register() {
        this.validation();

        if (this.errors.length > 0) return;

        this.contato = await ContatoModel.create(this.body)

    }
    validation() {
        this.cleanUp();

        if (this.body.email && !validator.isEmail(this.body.email)) {
            this.errors.push('E-mail inválido');
        }
        if (!this.body.nome) {
            this.errors.push('Nome é um campo obrigatório');
        }

        if (!this.body.email && !this.body.telefone) {
            this.errors.push('Insira pelo menos um meio de contato e-mail ou telefone');
        }
    }

    async edit(id) {
        if (typeof id !== 'string') return;
        this.validation();
        if (this.errors.length > 0) return;
        this.contato = await ContatoModel.findByIdAndUpdate(id, this.body, { new: true });
    }

    cleanUp() {
        for (const key in this.body) {
            if (typeof this.body[key] !== 'string') {
                this.body[key] = '';
            }
        }

        this.body = {
            nome: this.body.nome,
            sobrenome: this.body.sobrenome,
            email: this.body.email || null,  
            telefone: this.body.telefone
        }
    }
}

module.exports = Contato;