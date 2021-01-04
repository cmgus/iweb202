var express = require('express')
var routes = require('./routes')
var http = require('http')
var path = require('path')
var morgan = require('morgan')
//
var productos = require('./routes/productos')
var app = express()
var connection = require('express-myconnection')
var mysql = require('mysql')

//all environments
app.set('port', process.env.PORT || 4300)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(morgan('dev'))
app.use(express.static(path.join(__dirname, 'public')))

/*------------------------------------------
    connection peer, register as middleware
    type koneksi : single,pool and request 
-------------------------------------------*/
/* app.use(  
    connection(mysql,{
        host: 'localhost',
        user: 'root',
        password : '',
        port : 3306, //port mysql
        database:'examena'
    },'pool') //or single
); */
app.use(
  connection(
    mysql,
    {
      host: 'localhost',
      user: 'jaszert',
      password: 'admin',
      port: 3306, //port mysql
      database: 'ex_web',
    },
    'pool'
  ) //or single
)

/*app.get('/clientes/frmcliente',clientes.frmcliente);
app.post('/clientes/save',clientes.save);
app.post('/clientes/remove',clientes.remove);
app.post('/clientes/update',clientes.update);
app.post('/clientes/buscar',clientes.buscar);
app.post('/clientes/buscarxdni',clientes.buscarxdni);
app.post('/clientes/validarcliente',clientes.validarcliente);
app.post('/clientes/getTotalRegs',clientes.getTotalRegs);*/
app.get('/productos/frmproducto', productos.frmproducto)
app.post('/productos/save', productos.save)
app.post('/productos/buscarXcod', productos.buscarXcod)
app.post('/productos/update', productos.update)
/*app.post('/productos/remove',producto.remove);
app.post('/productos/update',producto.update);
app.post('/clientes/buscar',producto.buscar);*/
//app.post('/clientes/buscarxdni',clientes.buscarxdni);
//app.post('/productos/validarproducto',clientes.validarcliente);
//app.post('/productos/getTotalRegs',producto.getTotalRegs);
/////

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server escuchando en puerto ' + app.get('port'))
})
