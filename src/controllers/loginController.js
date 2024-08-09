const Login = require('../models/loginModel')

exports.index = (req, res) => {
    if (req.session.user) return res.render('login-logado')
    return res.render('login')
}

exports.register = async function (req, res) {
    try {
        const login = new Login(req.body)
        await login.register()//Como o metódo register dentro da class Login é uma promessa e necessita retornar uma promessa resolvida, ou um erro, esse metódo também precisar do async await, esperar a resopnta do metódo para então ser executada

        if (login.errors.length > 0) {//O metódo register já verifica se existem errors, aqui os errors serão exibidos caso existam
            req.flash('errors', login.errors)
            req.session.save(function () {
                return res.redirect('index')
            })
            return
        }
        req.flash('success', 'Seu usuário foi cadastrado com sucesso!')
        req.session.save(function () {
            return res.redirect('index')
        })
    } catch (err) {
        console.log(err);
        return res.render('404')
    }
}

exports.login = async function (req, res) {
    try {
        const login = new Login(req.body)
        await login.login()//Como o metódo register dentro da class Login é uma promessa e necessita retornar uma promessa resolvida, ou um erro, esse metódo também precisar do async await, esperar a resopnta do metódo para então ser executada

        if (login.errors.length > 0) {//O metódo register já verifica se existem errors, aqui os errors serão exibidos caso existam
            req.flash('errors', login.errors)
            req.session.save(function () {
                return res.redirect('index')
            })
            return
        }
        
        req.session.user = login.user
        req.session.save(function () {
            return res.redirect('index')
        })
    } catch (err) {
        console.log(err);
        return res.render('404')
    }
}

exports.logout = function(req, res) {
    req.session.destroy()
    res.redirect('/')
}