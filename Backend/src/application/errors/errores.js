// Errores de la capa de aplicación. Llevan el código HTTP en "status",
// así el middleware y los controllers actuales siguen funcionando igual.
export class ErrorAplicacion extends Error {
  constructor(mensaje, status = 500) {
    super(mensaje);
    this.name = this.constructor.name;
    this.status = status;
  }
}

export class ErrorValidacion extends ErrorAplicacion {
  constructor(mensaje) { super(mensaje, 400); }
}

export class NoAutorizado extends ErrorAplicacion {   // credenciales o token inválidos
  constructor(mensaje) { super(mensaje, 401); }
}

export class Prohibido extends ErrorAplicacion {      // autenticado pero sin permiso
  constructor(mensaje) { super(mensaje, 403); }
}

export class NoEncontrado extends ErrorAplicacion {
  constructor(mensaje) { super(mensaje, 404); }
}

export class Conflicto extends ErrorAplicacion {      // duplicados, estados que no lo permiten
  constructor(mensaje) { super(mensaje, 409); }
}

export class ErrorServicioExterno extends ErrorAplicacion {   // ej. falla el envío del correo
  constructor(mensaje) { super(mensaje, 502); }
}