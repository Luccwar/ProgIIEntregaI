const db = require('./db')

const Cliente = db.sequelize.define('tabela_cliente',{
    nome: {
        type: db.Sequelize.STRING
    },
    sobrenome: {
        type: db.Sequelize.STRING
    },
    email: {
        type: db.Sequelize.STRING
    },
    senha: {
        type: db.Sequelize.STRING
    },
    telefone: {
        type: db.Sequelize.STRING
    }
})
//Cliente.sync({force: true})

module.exports = Cliente