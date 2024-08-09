require('dotenv').config()//import necessario para esconder os dados da conta do BD
const express = require('express')
const app = express()
const mongoose = require('mongoose')//Importe necessario para conectar ao MongoDB
mongoose.connect(process.env.CONNECTIONSTRING)
    .then(() => {//cria a conexão com o banco de dados e escode os dados da conta do BD no arquivo env dentro da pasta raiz, e aqui colocamos a chave que trás o valor do link de conexão com o BD
        console.log('Conectei a base de dados');
        app.emit('chave')
    })
    .catch(err => console.log(err))

const session = require('express-session')//Para reconhecer o navegador do cliente e a sua conta de acesso, e armazenar as informações do acesso para uso posterior(cookie)
const MongoStore = require('connect-mongo')//Para salvar as sessões no banco de dados, pois por padrão as sessões são salvas em memoria, e isso pode sobrecarregar a memoria da maquina em servidor de produção
const flash = require('connect-flash')//Para mensagens auto destrutivas, elas aparecem e somem sem ficar ocupando espaço na base de dados, esse import funciona em conjunto com o session
const routes = require('./routes')
const path = require('path')//Para acessar os caminhos dos arquivos e pastas
const helmet = require('helmet')//Para deixar a aplicação mais segura
const csrf = require('csurf')//Serve para nenhuma pagina, aplicativo ou qualquer outra coisa externa consiga postar((POST)Criar conteúdo) dentro da nossa aplicação
const { middlewareGlobal, checkCsrfError, csrfMiddleware } = require('./src/middlewares/middleware')

app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('./public'))//Para acessar todos os tipos de arquivos estaticos dentro da aplicação

const sessionOptions = session({
    secret: 'sdfjsdfishdfhdsuifhisdhfiushdfhdifsifhdfusd',
    store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
})

app.use(sessionOptions)
app.use(flash())

app.set('views', path.resolve(__dirname, 'src', 'views'))//aqui é a direção dos arquivos que serão rederizados na tela
app.set('view engine', 'ejs')//aqui a engine usada para renderizar esses arquivos, nesse caso está sendo usado o ejs

app.use(csrf())

app.use(middlewareGlobal)
app.use(checkCsrfError)
app.use(csrfMiddleware)
app.use(routes)

app.on('chave', () => {
    app.listen(3000, () => {
        console.log('Acessar http://localhost:3000');
        console.log('Servidor executando na porta 3000');
    })
})

