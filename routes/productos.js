/*exports.buscar = function(req, res){
  var input = JSON.parse(JSON.stringify(req.body));
  campo=input.campo;
  oper=input.oper;
  valor=input.valor;
  var cond=campo+" "+oper+" '%"+valor+"%'";
  var sql="SELECT * FROM cliente WHERE "+cond;
  req.getConnection(function(err,connection){
      
        var query = connection.query(sql,[],function(err,rows)
        {
            if(err)
                console.log("Error Selecting : %s ",err );
			res.json(rows);
         });
		console.log(query.sql);
    });
  
};*/

exports.frmproducto = function (req, res) {
  res.render('frmproducto', { page_title: '' })
  //console.log("Hola soy el frmproducto");
}
exports.buscarXcod = function (req, res) {
  var input = JSON.parse(JSON.stringify(req.body))
  req.getConnection(function (err, connection) {
    var data = { codigo: input.cod }
    var query = connection.query(
      'SELECT p.id as pid, p.descripcion as pdes, pr.id as prid, pr.precio as prec, s.id as sid, s.total as stk FROM producto as p, stock as s, precio as pr WHERE p.id=s.producto_id AND p.id=pr.producto_id AND p.id=pr.producto_id AND ?',
      data,
      function (err, rows) {
        if (err) console.log('Error Selecting : %s ', err)
        console.log(rows)
        res.json(rows)
      }
    )
    console.log(query.sql)
  })
}

/*Guardar un nuevo producto*/
exports.save = function (req, res) {
  var input = JSON.parse(JSON.stringify(req.body))
  req.getConnection(function (err, connection) {
    var data = {
      codigo: input.cod,
      descripcion: input.des,
    }
    var query = connection.query(
      'INSERT INTO producto set ? ',
      data,
      function (err, producto) {
        if (err) {
          console.log('Error inserting : %s ', err.code)
          return res.json(-1)
        }
        const upDesactivarPreciosSql = `
                UPDATE precio 
                  SET estado = '0' 
                  WHERE precio != ${input.pre} 
                  AND producto_id = ${producto.insertId}
              `
        connection.query(upDesactivarPreciosSql, (err, result) => {
          if (err)
            return console.log(
              'Error al actulizar los estados de los precios: %s',
              err.code
            )
        })
        const activarPreciosSql = `
          UPDATE precio
            SET estado = '1'
            WHERE precio = ${input.pre}
            AND producto_id = ${producto.insertId}
        `
        connection.query(activarPreciosSql, (err, result) => {
          if (err) return console.log('Error activar el precio: %s', err.code)
        })
        const selPrecioConPid = `
          SELECT COUNT(*) 
            FROM precio
            WHERE precio = ${input.pre}
            AND producto_id = ${producto.insertId}
        `
        connection.query(selPrecioConPid, (err, result) => {
          if (err) return console.log(result.code)
          console.log(result)
          if (result['COUNT(*)'] != 0) {
            const inPrecioSql = `
              INSERT INTO precio VALUES (0, ${input.pre}, '1', ${producto.insertId})
            `
            connection.query(inPrecioSql, function (err, precio) {
              if (err) {
                console.log('Error guardando precio: %s', err.code)
                return
              }
            })
          }
        })
        const inStockSql = `
          INSERT INTO stock VALUES (0, ${producto.insertId} , ${input.stk}, NOW())
        `
        connection.query(inStockSql, (err, stock) => {
          if (err) return console.log('Error al guardar el stock: %s', err.code)
        })
        res.json(producto.insertId)
      }
    )
    console.log(query.sql) //get raw query
  })
}
/*Validar cliente*/
exports.validarcliente = function (req, res) {
  var input = JSON.parse(JSON.stringify(req.body))
  req.getConnection(function (err, connection) {
    dni = input.dni
    clave = input.clave
    var query = connection.query(
      'SELECT * FROM cliente WHERE dni=? AND clave=?',
      [dni, clave],
      function (err, rows) {
        if (err) console.log('Error Selecting : %s ', err)
        res.json(rows)
      }
    )
    console.log(query.sql)
  })
}
/* GET users listing. */
exports.list = function (req, res) {
  req.getConnection(function (err, connection) {
    var query = connection.query(
      'SELECT * FROM customer',
      function (err, rows) {
        if (err) console.log('Error Selecting : %s ', err)

        res.render('customers', { page_title: 'Customers- UNAM', data: rows })
      }
    )

    //console.log(query.sql);
  })
}

exports.buscarxdni = function (req, res) {
  var input = JSON.parse(JSON.stringify(req.body))
  req.getConnection(function (err, connection) {
    var data = { dni: input.dni }
    var query = connection.query(
      'SELECT * FROM cliente WHERE ?',
      data,
      function (err, rows) {
        if (err) console.log('Error Selecting : %s ', err)
        res.json(rows)
      }
    )
    console.log(query.sql)
  })
}

exports.buscar = function (req, res) {
  var input = JSON.parse(JSON.stringify(req.body))
  req.getConnection(function (err, connection) {
    //var data = {dni: input.dni};
    var camp = input.campo
    var oper = input.operador
    var valor = input.valor
    if (oper == 'LIKE') valor = "'%" + valor + "%'"
    var sql = 'SELECT * FROM producto WHERE ' + camp + ' ' + oper + ' ' + valor

    var query = connection.query(sql, [], function (err, rows) {
      if (err) console.log('Error Selecting : %s ', err)
      res.json(rows)
    })
    console.log(query.sql)
  })
}

exports.getTotalRegs = function (req, res) {
  var input = JSON.parse(JSON.stringify(req.body))
  req.getConnection(function (err, connection) {
    var camp = input.campo
    var oper = input.operador
    var valor = input.valor
    var sql =
      "CALL getTotalRegistros1('producto','" +
      camp +
      "','" +
      oper +
      "','" +
      valor +
      "')"
    var query = connection.query(sql, [], function (err, rows) {
      if (err) console.log('Error Selecting : %s ', err)
      res.json(rows[0][0])
    })
    //console.log(query.sql);
  })
}

exports.edit = function (req, res) {
  var id = req.params.id

  req.getConnection(function (err, connection) {
    var query = connection.query(
      'SELECT * FROM customer WHERE id = ?',
      [id],
      function (err, rows) {
        if (err) console.log('Error Selecting : %s ', err)

        res.render('edit_customer', {
          page_title: 'Edit Customers - Node.js',
          data: rows,
        })
      }
    )

    //console.log(query.sql);
  })
}

exports.update = function (req, res) {
  var input = req.body
  req.getConnection(function (err, connection) {
    connection.query(
      'UPDATE producto SET descripcion = ? WHERE id = ? ',
      [input.des, +input.pid],
      function (err, rows) {
        if (err) console.log('Error Updating : %s ', err)
      }
    )

    const desactivarPreciosSql = `
      UPDATE precio 
        SET estado = '0' 
        WHERE precio != ${input.pre}
        AND producto_id = ${input.pid}
      `
    connection.query(desactivarPreciosSql, (err, result) => {
      if (err)
        return console.log('Error al desactivar de los precios: %s', err.code)
    })
    const activarPreciosSql = `
      UPDATE precio
        SET estado = '1'
        WHERE precio = ${input.pre}
        AND producto_id = ${input.pid}
    `
    connection.query(activarPreciosSql, (err, result) => {
      if (err) return console.log('Error activar el precio: %s', err.code)
    })
    console.log(desactivarPreciosSql)

    const selPrecioConPid = `
          SELECT COUNT(*) 
            FROM precio
            WHERE precio = ${input.pre}
            AND producto_id = ${input.pid}
        `
    connection.query(selPrecioConPid, (err, result) => {
      if (err) return console.log(result.code)
      console.log(result)
      if (result[0]['COUNT(*)'] == 0) {
        const inPrecioSql = `
          INSERT INTO precio VALUES (0, ${input.pre}, '1', ${input.pid})
        `
        connection.query(inPrecioSql, function (err, precio) {
          if (err) {
            console.log('Error guardando precio: %s', err.code)
            return
          }
        })
      }
    })
    const upStockSql = `
      UPDATE stock 
        SET total = ${input.stk}
        WHERE producto_id = ${input.pid}
    `
    connection.query(upStockSql, (err, stock) => {
      if (err) return console.log('Error al guardar el stock: %s', err.code)
    })
    res.json(-2)
  })
}

exports.remove = function (req, res) {
  var input = JSON.parse(JSON.stringify(req.body))
  req.getConnection(function (err, connection) {
    var id = input.id
    connection.query(
      'DELETE FROM cliente WHERE id = ? ',
      [id],
      function (err, rows) {
        if (err) console.log('Error Deleting... : %s ', err)
      }
    )
    res.json(id)
  })
}
