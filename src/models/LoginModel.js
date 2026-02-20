const mongoose = require('mongoose');
const validator = require('validator');

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
        maxlength: 50,
        match: [
            /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,50}$/]
    }
});

const LoginModel = mongoose.model('login', userSchema);

class login {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.user = null;
    }
    register() {
        this.valida();
        if (this.errors.length > 0) return;
        
    }
    valida() {
        this.cleanUp();
        if (!validator.isEmail(this.body.email)) {
            this.errors.push('E-mail inválido');
        }
        if (this.body.senha.length < 8 || this.body.senha.length > 50) {
            this.errors.push('A senha precisa ter entre 3 e 50 caracters')
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