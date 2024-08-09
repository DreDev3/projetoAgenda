const Contato = require('../models/ContatoModel')
exports.index = function (req, res) {
    res.render('contato', { contato: {} })

}

exports.register = async function (req, res) {
    try {
        const contato = new Contato(req.body)
        await contato.register()

        if (contato.errors.length > 0) {
            req.flash('errors', contato.errors)
            req.session.save(() => res.redirect('index'))
            return
        }

        req.flash('success', 'Contato registrado com sucesso.')
        req.session.save(() => res.redirect('/contato/index'))
        return

    } catch (err) {
        console.log(err);
        return res.render('404')
    }

}

exports.editIndex = async function (req, res) {
    if (!req.params.id) return res.render('404')

    const contato = new Contato(req.body)
    const user = await contato.buscaPorId(req.params.id)
    if (!user) return res.render('404')
    res.render('contato', {
        contato: user
    })
}

exports.edit = async function (req, res) {
    try {
        if (!req.params.id) return res.render('404')
        const contato = new Contato(req.body)
        await contato.edit(req.params.id)

        if (contato.errors.length > 0) {
            req.flash('errors', contato.errors)
            req.session.save(() => res.redirect('index'))
            return
        }

        req.flash('success', 'Contato editado com sucesso.')
        req.session.save(() => res.redirect(`/`))
        return

    } catch (err) {
        console.log(err);
        res.render('404')
    }

}

exports.delete = async function (req, res) {
    if (!req.params.id) return res.render('404')

    const contato = new Contato(req.body)
    const contatoDelete = await contato.delete(req.params.id)
    if (!contatoDelete) return res.render('404')

        req.flash('success', 'Contato apagado com sucesso.')
        req.session.save(() => res.redirect('/'))
}