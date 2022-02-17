const createError = require('http-errors')
const express = require("express")
const path = require('path')
const app = express()
const port = 8083
const moment = require("moment")
const handlebars = require("express-handlebars")
const logger = require('morgan');
const flash = require('connect-flash')// linha adicional
const session = require('express-session')//linha adicional
const cookieParser = require('cookie-parser');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

app.engine("handlebars", handlebars({
    
    defaultLayout: 'main',
    helpers:{
        formatDate: (date)=>{
            return moment(date).format('DD/MM/YYYY')
        } 
    }
}))

var hbs = require('hbs');// LINHA ADICIONAL
hbs.registerPartials(path.join(__dirname + '/views/partials'));// LINHA ADICIONAL
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: "cursodenode",//chave de acesso
    resave: true,
    saveUninitialized: true
}))

app.use(flash())

app.use((req, res, next)=>{
    //declaração de variáveis globais
    res.locals.success_msg = req.flash('success_msg')// aqui são variáveis globais, criadas com res.locals e são visíveis dm qualquer parte do projeto
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash("error")
    next()
})

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(function(req, res, next) {
    next(createError(404));
});

  // error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
  
module.exports = app;



app.listen(port, function() {
    console.log("Servidor rodando.")
})