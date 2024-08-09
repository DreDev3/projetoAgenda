const Contato = require('../models/ContatoModel')

exports.index = async (req, res) => {
    const contato = new Contato(req.body)
    if(!req.session.user) {
        res.render('wellcome')
        return
    }
    const contatos = await contato.buscaContatos()
    res.render('index', { contatos })
    return
}
