var prods
var prini
// var prest = 0
const mesajitos = {
  DUP_COD: 'El código ya fue registrado',
  UP_OK: 'Registro actualizado',
  IN_OK: 'El registro se guardó',
}
function guardar() {
  pid = $('#producto_id').html()
  cod = $('#cod').val()
  des = $('#des').val()
  pre = $('#pre').val()
  stk = $('#stk').val()

  prid = $('#prid').val()
  sid = $('#sid').val()
  // if (prini != pre) prest = 1
  datos = `pid=${pid}&cod=${cod}&des=${des}&prid=${prid}&pre=${pre}&stk=${stk}&sid=${sid}`
  url = '/productos/save'
  if (pid > 0) url = '/productos/update'

  /* if (pid > 0) {
    console.log('Actualizando....')
    console.log(datos)
  } else {
    console.log('Insertando....')
    console.log(datos)
  } */

  $.ajax({
    type: 'post',
    url: url,
    data: datos,
    success: function (html) {
      if (html == -1) {
        $('#mensajito').html('El código ya esa registrado')
        return
      }
      if (html == -2) {
        $('#mensajito').html('El registro fue actualizado')
        return
      }
      $('#producto_id').html(+html)
      $('#mensajito').html('Registro guardado')
    },
  })
}
function buscarXcod() {
  cod = $('#cod').val()
  $.ajax({
    type: 'post',
    url: '/productos/buscarXcod',
    data: 'cod=' + cod,
    success: function (html) {
      console.table(html)

      prods = html
      showData(0)
    },
  })
}
function showData(fila) {
  console.log(fila + ' ' + prods[fila].pid)
  $('#producto_id').html(prods[fila].pid)
  $('#des').val(prods[fila].pdes)
  $('#pre').val(prods[fila].prec)
  $('#stk').val(prods[fila].stk)

  $('#prid').val(prods[fila].prid)
  $('#sid').val(prods[fila].sid)
  //Establecemos el precio inicial
  // prini = prods[fila].prec
}
