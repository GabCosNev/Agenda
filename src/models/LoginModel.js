const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs')

const userSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    senha: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 60
    }
});

const LoginModel = mongoose.model('login', userSchema);

class login {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.user = null;
    }
    async register() {
        this.valida();
        if (this.errors.length > 0) return;

        await this.userExists();

        if (this.errors.length > 0) return;

        const salt = bcryptjs.genSaltSync();
        this.body.senha = bcryptjs.hashSync(this.body.senha, salt)

        try {

            this.user = await LoginModel.create(this.body);
        }
        catch (e) {
            console.log(e)
        }
    }

    async userExists() {
        const user = await LoginModel.findOne({ email: this.body.email })
        if (user) this.errors.push('Usuário já existe')

    }
    valida() {
        this.cleanUp();
        if (!validator.isEmail(this.body.email)) {
            this.errors.push('E-mail inválido');
        }
        if (this.body.senha.length < 8 || this.body.senha.length > 60) {
            this.errors.push('A senha tem que ter entre 8 a 60 caracters');
        }
        if (!this.body.senha.match(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)) {
            this.errors.push('Senha precisa ter maiúscula, número e caractere especial.');
        }
        if (this.body.nome.length > 20) {
            this.errors.push('O nome precisa ter menos que 20 caracters');
        }
        if (this.body.email.length > 20) {
            this.errors.push('O nome precisa ter menos que 20 caracters');
        }
    }
    cleanUp() {
        for (const key in this.body) {
            if (typeof this.body[key] !== 'string') {
                this.body[key] = '';
            }
        }
        this.body = {
            nome: this.body.nome,
            email: this.body.email,
            senha: this.body.senha
        }
    }
}

module.exports = login;