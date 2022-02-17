const Sequelize = require("sequelize")

const sequelize = new Sequelize('entrega3','postgres','1234',{
    host: "localhost",
    dialect: "postgres"
})

sequelize.authenticate().then(()=>{
    console.log("conectado com sucesso ao banco")
}).catch((erro)=>{
    console.log(`erro ao conectar ao banco: ${erro}`)
})

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
}