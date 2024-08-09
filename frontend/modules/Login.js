import validator from "validator"
export default class Login {
    constructor(formClass) {
        this.form = document.querySelector(formClass)
    }

    init() {
        this.events()
    }

    events() {
        if (!this.form) return
        this.form.addEventListener('submit', e => {
            e.preventDefault()

            if(this.form === document.querySelector('.form-cadastro')){
                this.validateCadastro(e)                
            }
            if(this.form === document.querySelector('.form-login')){
                this.validateLogin(e)         
            }
        })
    }

    validateCadastro(e) {
        const el = e.target
        const emailInput = el.querySelector('input[name="email"]')
        const senhaInput = el.querySelector('input[name="senha"]')
        const emailError = el.querySelector('.cad-email-inv')
        const senhaError = el.querySelector('.cad-senha-inv')
        let error = false

        if(!validator.isEmail(emailInput.value)) {
            emailError.style.color = 'red'
            emailError.style.fontSize = '12px'
            emailError.innerHTML = 'E-mail inválido.'
            error = true
        } else {
            emailError.innerHTML = ''
        }

        if(senhaInput.value.length < 3 || senhaInput.value.length > 15) {
            senhaError.style.color = 'red'
            senhaError.style.fontSize = '12px'
            senhaError.innerHTML = 'A senha precisa ter entre 3 e 15 caracteres.'
            error = true
        } else {
            senhaError.innerHTML = ''
        }

        if(!error) el.submit()
    }

    validateLogin(e) {
        const el = e.target
        const emailInput = el.querySelector('input[name="email"]')
        const senhaInput = el.querySelector('input[name="senha"]')
        const emailError = el.querySelector('.login-email-inv')
        const senhaError = el.querySelector('.login-senha-inv')
        let error = false

        if(!validator.isEmail(emailInput.value)) {
            emailError.style.color = 'red'
            emailError.style.fontSize = '12px'
            emailError.innerHTML = 'E-mail inválido.'
            error = true
        } else {
            emailError.innerHTML = ''
        }

        if(senhaInput.value.length < 3 || senhaInput.value.length > 15) {
            senhaError.style.color = 'red'
            senhaError.style.fontSize = '12px'
            senhaError.innerHTML = 'A senha precisa ter entre 3 e 15 caracteres.'
            error = true
        } else {
            senhaError.innerHTML = ''
        }

        if(!error) el.submit()
    }
}