var express = require('express');
var router = express.Router();

const Cliente = require('../models/Cliente')//model aluno, isere um aluno

/* GET home page. */
router.get("/",function(req, res, next){
    res.render("index")
})

router.get("/listaAnimais", (req, res, next)=>{
    res.render("listaAnimais")
})

router.get("/listaBrinquedos", (req, res, next)=>{
    res.render("listaBrinquedos")
})

router.get("/listaHigiene", (req, res, next)=>{
    res.render("listaHigiene")
})

router.get("/cadastroCliente", (req, res, next)=>{
    res.render("cadastroCliente")
})

router.post("/criarCliente", (req, res, next)=>{
            var erros = []
            if(!req.body.nome || req.body.nome.length < 3 || typeof req.body.nome == undefined || req.body.nome == null){
                erros.push({texto: "Nome inválido, certifique-se de que preencheu o campo corretamente."})
            }
            if(!req.body.sobrenome || req.body.sobrenome.length < 3 || typeof req.body.sobrenome == undefined || req.body.sobrenome == null){
                erros.push({texto: "Sobrenome inválido, certifique-se de que preencheu o campo corretamente."})
            }
            if(!req.body.email || typeof req.body.email == undefined || req.body.email == null || req.body.email.indexOf("@") == -1){
                erros.push({texto: "E-mail inválido, certifique-se de que preencheu o campo corretamente."})
            }
            if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
                erros.push({texto: "Senha inválida, certifique-se de que preencheu o campo corretamente."})
            }
            else if(req.body.senha.length < 3){
                erros.push({texto: "Sua senha deve ter três ou mais caractéres."})
            }
            if(!req.body.telefone || typeof req.body.telefone == undefined || req.body.telefone == null){
                erros.push({texto: "Telefone inválido, certifique-se de que preencheu o campo corretamente."})
            }
            else if(req.body.telefone.length != 11 && req.body.telefone.length != 13){
                erros.push({texto: "Seu telefone deve ter onze (11) ou treze (13) dígitos, certifique-se que colocar seu DDD, você também pode inserir seu código de país."})
            }
            if(erros.length > 0){
                res.render("cadastroCliente", {erros: erros})
            }else{
                Cliente.findOne({ where: { email: req.body.email } }).then((cliente)=>{
                if(cliente){
                    req.flash("error_msg", "E-mail já cadastrado. Tente novamente.")
                    res.redirect('/cadastroCliente')
                }else{
                    Cliente.create({
                        nome: req.body.nome,
                        sobrenome: req.body.sobrenome,
                        email: req.body.email,
                        senha: req.body.senha,
                        telefone: req.body.telefone
                }).then(()=>{
                    res.cookie("dadosAluno", req.body.email)

                    res.redirect('/')  
                }).catch((erro)=>{
                    req.flash("error_msg", "Erro ao salvar usuário")
                })
            }
        })
    }
})

router.get('/clientes',(req, res, next)=>{
    Cliente.findAll().then((clientes)=>{
        res.render('clientes',{clientes: clientes})
    })
})

router.get('/editarCliente/:id',(req, res)=>{
    id=req.params.id
    Cliente.findOne({ where: { id } }).then(client => {
        res.render('editarCliente', { form: client})
    }).catch(err => {
        res.redirect('/')
    })
})
router.post('/editarCliente/:id', (req, res)=>{
            const {id} = req.params
            var erros = []
            if(!req.body.nome || req.body.nome.length < 3 || typeof req.body.nome == undefined || req.body.nome == null){
                erros.push({texto: "Nome inválido, certifique-se de que preencheu o campo corretamente."})
            }
            if(!req.body.sobrenome || req.body.sobrenome.length < 3 || typeof req.body.sobrenome == undefined || req.body.sobrenome == null){
                erros.push({texto: "Sobrenome inválido, certifique-se de que preencheu o campo corretamente."})
            }
            if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
                erros.push({texto: "Senha inválida, certifique-se de que preencheu o campo corretamente."})
            }
            else if(req.body.senha.length < 3){
                erros.push({texto: "Sua senha deve ter três ou mais caractéres."})
            }
            if(!req.body.telefone || typeof req.body.telefone == undefined || req.body.telefone == null){
                erros.push({texto: "Telefone inválido, certifique-se de que preencheu o campo corretamente."})
            }
            else if(req.body.telefone.length != 11 && req.body.telefone.length != 13){
                erros.push({texto: "Seu telefone deve ter onze (11) ou treze (13) dígitos, certifique-se que colocar seu DDD, você também pode inserir seu código de país."})
            }
            if(erros.length > 0){
                Cliente.findOne({ where: { id } }).then(client => {
                    res.render("editarCliente", {erros: erros, form: client})
                })
            }else{
                Cliente.update({
                    nome: req.body.nome,
                    sobrenome: req.body.sobrenome,
                    senha: req.body.senha,
                    telefone: req.body.telefone
                },{
                    where: {id: id},
                }).then(()=>{
                    res.redirect('/clientes')
                }).catch((erro)=>{
                    res.redirect('/editarCliente/:id')
                    console.log(`Erro ao editar: ${erro}`)
                })
            }
})

router.get('/deletarCliente/:id', (req, res, next)=>{
    const { id } = req.params
    Cliente.destroy({
        where: { id }
    }).then(()=>{
        res.redirect('/clientes')
        console.log('registro excluído com sucesso!')
    }).catch((erro)=>{
        res.redirect('/clientes')
        console.log(`erro ao excluir registro: ${erro}`)
    })
})

router.get('/cookie', (req, res, next)=>{
    res.send(req.cookies)
})

module.exports = router;
