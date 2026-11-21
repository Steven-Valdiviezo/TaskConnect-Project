// Uso: node scripts/flujo-completo.js <correoCliente> <claveCliente> <correoFreelancer> <claveFreelancer> [<correoAdmin> <claveAdmin>]
// ATENCIÓN: crea datos de prueba reales en la base (con "Prueba flujo hexagonal" en el título o el texto)
const API = process.env.API_NUEVA ?? 'http://localhost:3001';
const [, , cCorreo, cClave, fCorreo, fClave, aCorreo, aClave] = process.argv;

if (!cCorreo || !cClave || !fCorreo || !fClave) {
  console.log('Faltan credenciales. Uso: node scripts/flujo-completo.js <correoCliente> <claveCliente> <correoFreelancer> <claveFreelancer> [<correoAdmin> <claveAdmin>]');
  process.exit(1);
}

// ---------- utilidades ----------
const pedir = async (metodo, ruta, { token, cuerpo } = {}) => {
  const r = await fetch(API + ruta, {
    method: metodo,
    headers: { ...(cuerpo && { 'Content-Type': 'application/json' }), ...(token && { Authorization: `Bearer ${token}` }) },
    body: cuerpo ? JSON.stringify(cuerpo) : undefined
  });
  const texto = await r.text();
  let cuerpoRespuesta;
  try { cuerpoRespuesta = JSON.parse(texto); } catch { cuerpoRespuesta = texto; }
  return { status: r.status, cuerpo: cuerpoRespuesta };
};

const esperar = (condicion, mensaje) => (condicion ? null : mensaje);
let pasosOk = 0;

// Hace la petición, comprueba el estado HTTP esperado y, si se pide, el contenido. Si algo falla, se detiene.
const paso = async (etiqueta, metodo, ruta, { token, cuerpo, esperado = 200, verificar } = {}) => {
  const r = await pedir(metodo, ruta, { token, cuerpo });
  let problema = r.status === esperado ? null : `se esperaba ${esperado} y llegó ${r.status}`;
  if (!problema && verificar) problema = verificar(r.cuerpo);

  if (problema) {
    console.log('FALLA', r.status, etiqueta, `\n       ${problema}\n       cuerpo: ${JSON.stringify(r.cuerpo).slice(0, 250)}`);
    throw new Error(`Se detiene en: ${etiqueta}`);
  }
  pasosOk++;
  console.log('OK   ', r.status, etiqueta);
  return r.cuerpo;
};

const iniciarSesion = async (correo, contrasena) => {
  const r = await pedir('POST', '/api/usuarios/login-prueba', { cuerpo: { correo, contrasena } });
  if (r.status !== 200) throw new Error(`No se pudo iniciar sesión con ${correo}: ${r.status} ${JSON.stringify(r.cuerpo)}`);
  return r.cuerpo; // { token, usuario }
};

const creados = {}; // ids para el resumen final

try {
  // ---------- preparación ----------
  console.log('--- preparación ---');
  const cliente = await iniciarSesion(cCorreo, cClave);
  const freelancer = await iniciarSesion(fCorreo, fClave);
  const TC = cliente.token;
  const TF = freelancer.token;

  const categorias = await paso('categorías', 'GET', '/api/categorias');
  const metodos = await paso('métodos de pago', 'GET', '/api/metodos-pago');
  const idCategoria = categorias.categorias[0].id_categoria;
  const idMetodo = metodos.metodos[0].id_metodo_pago;
  const futura = new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().slice(0, 10);

  const crearProyecto = async (letra) => {
    const r = await paso(`cliente publica el proyecto ${letra}`, 'POST', '/api/proyectos', {
      token: TC, esperado: 201,
      cuerpo: {
        titulo: `Prueba flujo hexagonal ${letra}`,
        descripcion: `Proyecto de prueba ${letra} creado por el script del flujo completo`,
        presupuesto: 100, id_categoria: idCategoria, fecha_entrega: futura
      },
      verificar: (b) => esperar(b.proyecto.estado === 'abierto' && b.proyecto.presupuesto === 100,
        `estado=${b.proyecto.estado}, presupuesto es ${typeof b.proyecto.presupuesto}`)
    });
    return r.proyecto.id_proyecto;
  };

  const enviarPropuesta = async (idProyecto, monto, etiqueta) => {
    const r = await paso(etiqueta, 'POST', '/api/propuestas', {
      token: TF, esperado: 201,
      cuerpo: { id_proyecto: idProyecto, mensaje: 'Puedo entregarlo en cinco días con buena calidad', monto_propuesto: monto },
      verificar: (b) => esperar(b.propuesta.estado === 'pendiente' && b.propuesta.monto_propuesto === monto,
        `estado=${b.propuesta.estado}, monto=${b.propuesta.monto_propuesto}`)
    });
    return r.propuesta.id_propuesta;
  };

  const proyectoPorId = (id) => paso(`consultar proyecto ${id}`, 'GET', `/api/proyectos/${id}`);

  // ---------- proyecto A: camino feliz ----------
  console.log('\n--- proyecto A: publicar y proponer ---');
  const A = await crearProyecto('A');
  creados.proyectoA = A;

  await paso('detalle de A trae categoría y cliente', 'GET', `/api/proyectos/${A}`, {
    verificar: (b) => esperar(b.proyecto.nombre_categoria && b.proyecto.nombre_cliente, 'faltan nombre_categoria o nombre_cliente')
  });
  await paso('cliente edita la descripción de A', 'PUT', `/api/proyectos/${A}`, {
    token: TC,
    cuerpo: { titulo: 'Prueba flujo hexagonal A', descripcion: 'Descripción editada por el script del flujo completo', presupuesto: 100, id_categoria: idCategoria, fecha_entrega: futura },
    verificar: (b) => esperar(b.proyecto.descripcion.startsWith('Descripción editada'), 'la descripción no cambió')
  });
  await paso('freelancer no puede editar proyectos (403)', 'PUT', `/api/proyectos/${A}`, { token: TF, esperado: 403, cuerpo: {} });

  const propuestaA = await enviarPropuesta(A, 90, 'freelancer envía propuesta a A');
  await paso('propuesta repetida la frena el trigger (400)', 'POST', '/api/propuestas', {
    token: TF, esperado: 400,
    cuerpo: { id_proyecto: A, mensaje: 'Puedo entregarlo en cinco días con buena calidad', monto_propuesto: 90 },
    verificar: (b) => esperar(/activa/i.test(b.mensaje), `mensaje inesperado: ${b.mensaje}`)
  });
  await paso('propuesta sobre el presupuesto (400)', 'POST', '/api/propuestas', {
    token: TF, esperado: 400,
    cuerpo: { id_proyecto: A, mensaje: 'Puedo entregarlo en cinco días con buena calidad', monto_propuesto: 500 }
  });
  await paso('freelancer ve su propuesta en "enviadas"', 'GET', '/api/propuestas/mias/enviadas', {
    token: TF, verificar: (b) => esperar(b.propuestas.some((p) => p.id_propuesta === propuestaA), 'no aparece')
  });
  await paso('cliente ve la propuesta en "recibidas"', 'GET', '/api/propuestas/mias/recibidas', {
    token: TC, verificar: (b) => esperar(b.propuestas.some((p) => p.id_propuesta === propuestaA), 'no aparece')
  });

  // ---------- proyecto A: contrato ----------
  console.log('\n--- proyecto A: contrato ---');
  const contratoA = (await paso('cliente acepta la propuesta (genera el contrato)', 'POST', `/api/contratos/aceptar/${propuestaA}`, {
    token: TC, esperado: 201, verificar: (b) => esperar(b.contrato.estado === 'activo', `estado=${b.contrato.estado}`)
  })).contrato.id_contrato;
  creados.contratoA = contratoA;

  await paso('trigger: el proyecto pasó a "ejecucion"', 'GET', `/api/proyectos/${A}`, {
    verificar: (b) => esperar(b.proyecto.estado === 'ejecucion', `estado=${b.proyecto.estado}`)
  });
  await paso('trigger: la propuesta quedó "aceptada"', 'GET', `/api/propuestas/proyecto/${A}`, {
    token: TC,
    verificar: (b) => esperar(b.propuestas[0].estado === 'aceptada', `estado=${b.propuestas[0].estado}`)
  });
  await paso('cliente ve el contrato con su contraparte', 'GET', '/api/contratos/mios', {
    token: TC,
    verificar: (b) => esperar(b.contratos.find((c) => c.id_contrato === contratoA)?.nombre_contraparte, 'sin contraparte')
  });
  await paso('freelancer ve el mismo contrato', 'GET', '/api/contratos/mios', {
    token: TF, verificar: (b) => esperar(b.contratos.some((c) => c.id_contrato === contratoA), 'no aparece')
  });
  await paso('aceptar otra vez la misma propuesta (400)', 'POST', `/api/contratos/aceptar/${propuestaA}`, { token: TC, esperado: 400 });
  await paso('freelancer no puede completar contratos (403)', 'PATCH', `/api/contratos/${contratoA}/completar`, { token: TF, esperado: 403 });

  // ---------- proyecto A: mensajes ----------
  console.log('\n--- proyecto A: mensajes ---');
  await paso('cliente envía un mensaje', 'POST', '/api/mensajes', {
    token: TC, esperado: 201,
    cuerpo: { destinatario: freelancer.usuario.id_usuario, contenido: '  Prueba flujo hexagonal: ¿cómo vas?  ' },
    verificar: (b) => esperar(b.datos.contenido === 'Prueba flujo hexagonal: ¿cómo vas?' && b.datos.leido === false, 'contenido o leido incorrectos')
  });
  await paso('mensaje a sí mismo (400)', 'POST', '/api/mensajes', {
    token: TC, esperado: 400, cuerpo: { destinatario: cliente.usuario.id_usuario, contenido: 'hola' }
  });
  await paso('freelancer tiene mensajes sin leer', 'GET', '/api/mensajes/no-leidos', {
    token: TF, verificar: (b) => esperar(b.total >= 1, `total=${b.total}`)
  });
  const conversacion = await paso('freelancer abre la conversación', 'GET', `/api/mensajes/conversacion/${cliente.usuario.id_usuario}`, { token: TF });
  const idMensaje = [...conversacion.conversacion].reverse().find((m) => m.contenido.startsWith('Prueba flujo hexagonal')).id_mensaje;
  await paso('el remitente no puede marcarlo leído (404)', 'PATCH', `/api/mensajes/${idMensaje}/leido`, { token: TC, esperado: 404 });
  await paso('el destinatario lo marca leído', 'PATCH', `/api/mensajes/${idMensaje}/leido`, {
    token: TF, verificar: (b) => esperar(b.datos.leido === true, 'leido sigue en false')
  });

  // ---------- proyecto A: pago ----------
  console.log('\n--- proyecto A: pago ---');
  const pago = await paso('cliente registra el pago', 'POST', '/api/pagos', {
    token: TC, esperado: 201, cuerpo: { id_contrato: contratoA, id_metodo_pago: idMetodo, monto: 90 },
    verificar: (b) => esperar(b.pago.comision === 9 && b.pago.estado === 'pendiente',
      `comision=${b.pago.comision}, estado=${b.pago.estado}`)
  });
  console.log(`       calculado por los triggers -> comisión: ${pago.pago.comision} | tarifa_iva: ${pago.pago.tarifa_iva} | iva: ${pago.pago.iva}`);
  const idPago = pago.pago.id_pago;
  creados.pagoA = idPago;

  await paso('segundo pago del mismo contrato (409, UNIQUE)', 'POST', '/api/pagos', {
    token: TC, esperado: 409, cuerpo: { id_contrato: contratoA, id_metodo_pago: idMetodo, monto: 90 }
  });
  await paso('consultar el pago del contrato', 'GET', `/api/pagos/contrato/${contratoA}`, {
    token: TC, verificar: (b) => esperar(b.pago.id_pago === idPago, 'otro pago')
  });
  await paso('freelancer no puede confirmar pagos (403)', 'PATCH', `/api/pagos/${idPago}/marcar-pagado`, { token: TF, esperado: 403 });
  await paso('cliente confirma el pago', 'PATCH', `/api/pagos/${idPago}/marcar-pagado`, {
    token: TC, verificar: (b) => esperar(b.pago.estado === 'pagado' && b.pago.fecha_pago, 'sin estado pagado o sin fecha_pago')
  });
  await paso('confirmar otra vez (400)', 'PATCH', `/api/pagos/${idPago}/marcar-pagado`, { token: TC, esperado: 400 });

  // ---------- proyecto A: completar y calificar ----------
  console.log('\n--- proyecto A: completar y calificar ---');
  await paso('cliente completa el contrato', 'PATCH', `/api/contratos/${contratoA}/completar`, {
    token: TC, verificar: (b) => esperar(b.contrato.estado === 'completado' && b.contrato.fecha_fin, 'sin estado completado o sin fecha_fin')
  });
  await paso('trigger: el proyecto pasó a "finalizado"', 'GET', `/api/proyectos/${A}`, {
    verificar: (b) => esperar(b.proyecto.estado === 'finalizado', `estado=${b.proyecto.estado}`)
  });
  await paso('cancelar un contrato completado lo frena el trigger (400)', 'PATCH', `/api/contratos/${contratoA}/cancelar`, {
    token: TC, esperado: 400, verificar: (b) => esperar(/completado/i.test(b.mensaje), `mensaje inesperado: ${b.mensaje}`)
  });
  await paso('freelancer no puede calificar (403)', 'POST', '/api/calificaciones', {
    token: TF, esperado: 403, cuerpo: { id_contrato: contratoA, puntuacion: 5 }
  });
  await paso('cliente califica al freelancer', 'POST', '/api/calificaciones', {
    token: TC, esperado: 201,
    cuerpo: { id_contrato: contratoA, puntuacion: 4, comentario: 'Prueba flujo hexagonal: buen trabajo' },
    verificar: (b) => esperar(b.calificacion.puntuacion === 4 && b.calificacion.id_calificado === freelancer.usuario.id_usuario, 'datos incorrectos')
  });
  await paso('calificar dos veces el mismo contrato (409, UNIQUE)', 'POST', '/api/calificaciones', {
    token: TC, esperado: 409, cuerpo: { id_contrato: contratoA, puntuacion: 5 }
  });
  await paso('el freelancer ve su calificación', 'GET', `/api/calificaciones/usuario/${freelancer.usuario.id_usuario}`, {
    verificar: (b) => esperar(b.calificaciones.some((c) => c.comentario?.startsWith('Prueba flujo hexagonal')), 'no aparece')
  });
  const reputacion = await paso('reputación del freelancer', 'GET', `/api/calificaciones/reputacion/${freelancer.usuario.id_freelancer}`, {
    verificar: (b) => esperar(typeof b.reputacion === 'number', `reputacion es ${typeof b.reputacion}`)
  });
  console.log(`       reputación actual: ${reputacion.reputacion}`);
  await paso('el cliente ve su calificación emitida', 'GET', '/api/calificaciones/mias/emitidas', {
    token: TC, verificar: (b) => esperar(b.calificaciones.some((c) => c.id_contrato === contratoA), 'no aparece')
  });

  // ---------- proyecto B: rechazar y cancelar ----------
  console.log('\n--- proyecto B: rechazar y cancelar ---');
  const B = await crearProyecto('B');
  creados.proyectoB = B;
  const propuestaB = await enviarPropuesta(B, 80, 'freelancer envía propuesta a B');
  await paso('cliente rechaza la propuesta', 'PATCH', `/api/propuestas/${propuestaB}/rechazar`, {
    token: TC, verificar: (b) => esperar(b.propuesta.estado === 'rechazada', `estado=${b.propuesta.estado}`)
  });
  await paso('rechazarla otra vez (404, ya no está pendiente)', 'PATCH', `/api/propuestas/${propuestaB}/rechazar`, { token: TC, esperado: 404 });
  await paso('cliente cancela el proyecto B (transacción)', 'PATCH', `/api/proyectos/${B}/cancelar`, {
    token: TC, verificar: (b) => esperar(b.proyecto.estado === 'cancelado', `estado=${b.proyecto.estado}`)
  });
  await paso('cancelar B otra vez (400)', 'PATCH', `/api/proyectos/${B}/cancelar`, { token: TC, esperado: 400 });
  await paso('cancelar A, que ya está finalizado (400)', 'PATCH', `/api/proyectos/${A}/cancelar`, { token: TC, esperado: 400 });
  await paso('propuesta a un proyecto cancelado la frena el trigger (400)', 'POST', '/api/propuestas', {
    token: TF, esperado: 400,
    cuerpo: { id_proyecto: B, mensaje: 'Puedo entregarlo en cinco días con buena calidad', monto_propuesto: 50 }
  });

  // ---------- proyecto C: retirar ----------
  console.log('\n--- proyecto C: retirar propuesta ---');
  const C = await crearProyecto('C');
  creados.proyectoC = C;
  const propuestaC = await enviarPropuesta(C, 70, 'freelancer envía propuesta a C');
  await paso('retirarla siendo el cliente (403)', 'DELETE', `/api/propuestas/${propuestaC}`, { token: TC, esperado: 403 });
  await paso('freelancer retira su propuesta', 'DELETE', `/api/propuestas/${propuestaC}`, { token: TF });
    await paso('cliente cancela C para no dejarlo abierto', 'PATCH', `/api/proyectos/${C}/cancelar`, { token: TC });

  // ---------- proyecto D: cancelar con contrato activo ----------
  console.log('\n--- proyecto D: cancelar con contrato activo ---');
  const D = await crearProyecto('D');
  creados.proyectoD = D;
  const propuestaD = await enviarPropuesta(D, 60, 'freelancer envía propuesta a D');
  const contratoD = (await paso('cliente acepta la propuesta de D', 'POST', `/api/contratos/aceptar/${propuestaD}`, { token: TC, esperado: 201 })).contrato.id_contrato;
  creados.contratoD = contratoD;
  await paso('cliente cancela D: proyecto y contrato en una transacción', 'PATCH', `/api/proyectos/${D}/cancelar`, {
    token: TC, verificar: (b) => esperar(b.proyecto.estado === 'cancelado', `estado=${b.proyecto.estado}`)
  });
  await paso('el contrato de D quedó "cancelado"', 'GET', '/api/contratos/mios', {
    token: TC, verificar: (b) => esperar(b.contratos.find((c) => c.id_contrato === contratoD)?.estado === 'cancelado', 'el contrato no se canceló')
  });
  await paso('el proyecto D no se reabrió (trigger)', 'GET', `/api/proyectos/${D}`, {
    verificar: (b) => esperar(b.proyecto.estado === 'cancelado', `estado=${b.proyecto.estado}`)
  });

  // ---------- administrador (opcional) ----------
  if (aCorreo && aClave) {
    console.log('\n--- administrador ---');
    const TA = (await iniciarSesion(aCorreo, aClave)).token;
    await paso('auditoría registró el contrato A', 'GET', '/api/admin/auditoria?tabla=contrato&limite=50', {
      token: TA, verificar: (b) => esperar(b.registros.some((r) => r.id_registro === contratoA), 'no hay registros del contrato A')
    });
    await paso('auditoría registró el pago A', 'GET', '/api/admin/auditoria?tabla=pago&limite=50', {
      token: TA, verificar: (b) => esperar(b.registros.some((r) => r.id_registro === idPago), 'no hay registros del pago A')
    });
        // La base prohíbe el borrado físico de proyectos (trigger): la API devuelve el mensaje del trigger
    await paso('eliminar un proyecto: lo frena el trigger (400)', 'DELETE', `/api/proyectos/${B}`, {
      token: TA, esperado: 400, verificar: (b) => esperar(/eliminar físicamente/i.test(b.mensaje), `mensaje inesperado: ${b.mensaje}`)
    });
    await paso('eliminar un proyecto inexistente (404)', 'DELETE', '/api/proyectos/99999999', { token: TA, esperado: 404 });
  }

  console.log(`\nTodo bien: ${pasosOk} pasos correctos.`);
} catch (error) {
  console.log(`\n${error.message}. Pasos correctos antes del fallo: ${pasosOk}.`);
  process.exitCode = 1;
} finally {
  console.log('Datos de prueba que quedaron en la base:', JSON.stringify(creados));
}