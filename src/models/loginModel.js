const mongoose = require('mongoose')
const validator = require('validator')
const bcryptjs = require('bcryptjs')

const LoginSchema = new mongoose.Schema({
    email: { type: String, required: true },
    senha: { type: String, required: true }
})

const LoginModel = mongoose.model('Login', LoginSchema)

class Login {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.user = null;
    }

    async login() {
        this.valida();
        if (this.errors.length > 0) return;//verifica se tem erros no meu formulário
        this.user = await LoginModel.findOne({ email: this.body.email })

        if (!this.user) {
            this.errors.push('Usuário inválido.')
            return
        }
        if (!bcryptjs.compareSync(this.body.senha, this.user.senha)) {
            this.errors.push('Senha inválida')
            this.user = null
            return
        }


    }

    async register() {
        this.valida();
        if (this.errors.length > 0) return;//verifica se tem erros no meu formulário

        await this.userExists();//Verifica se o email sendo enviado existe da base de dados

        if (this.errors.length > 0) return;//verifica se tem erros no meu formulário novamente, caso já tenho um usuário com o mesmo email

        const salt = bcryptjs.genSaltSync()
        this.body.senha = bcryptjs.hashSync(this.body.senha, salt)

        this.user = await LoginModel.create(this.body)

    }

    async userExists() {
        this.user = await LoginModel.findOne({ email: this.body.email })//compara o email sendo enviado, a 'tabela' email na base de dados
        if (this.user) this.errors.push('Usuário já existe.')//se user então foe true, adiciona o erro ao array de errors
    }

    valida() {
        this.cleanUp()

        if (!validator.isEmail(this.body.email)) this.errors.push('E-mail inválido')

        if (this.body.senha.length < 3 || this.body.senha.length > 15) {
            this.errors.push('A senha precisa ter entre 3 e 15 caracteres.')
        }
    }

    cleanUp() {
        for (let key in this.body) {
            if (typeof this.body[key] !== 'string') {
                this.body[key] = ''
            }
        }

        this.body = {
            email: this.body.email,
            senha: this.body.senha
        }
    }
}

module.exports = Login