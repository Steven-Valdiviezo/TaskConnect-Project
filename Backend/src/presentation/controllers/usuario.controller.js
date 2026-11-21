export class UsuarioController {
  // casos: { registrarUsuario, loginUsuario, confirmarLogin2FA, loginPrueba, obtenerPerfil,
  //          actualizarPerfil, obtenerPerfilPublicoFreelancer, obtenerPerfilFreelancerConContacto }
  constructor(casos) {
    this.casos = casos;
  }

  registrar = async (req, res) => {
    const resultado = await this.casos.registrarUsuario.execute(req.body);
    res.status(201).json({ mensaje: 'Usuario registrado correctamente', ...resultado });
  };

  login = async (req, res) => {
    const { correo, contrasena } = req.body;
    if (!correo || !contrasena) {
      return res.status(400).json({ mensaje: 'correo y contrasena son obligatorios' });
    }
    const resultado = await this.casos.loginUsuario.execute({ correo, contrasena });
    res.json({ mensaje: 'Inicio de sesión exitoso', ...resultado });
  };

  // SOLO desarrollo: login sin el paso del correo
  loginPrueba = async (req, res) => {
    const { correo, contrasena } = req.body;
    if (!correo || !contrasena) {
      return res.status(400).json({ mensaje: 'correo y contrasena son obligatorios' });
    }
    const resultado = await this.casos.loginPrueba.execute({ correo, contrasena });
    res.json({ mensaje: 'Inicio de sesión de prueba exitoso (sin 2FA)', ...resultado });
  };

  confirmarLogin2FA = async (req, res) => {
    const resultado = await this.casos.confirmarLogin2FA.execute({ token: req.body.token });
    res.json({ mensaje: 'Inicio de sesión exitoso', ...resultado });
  };

  perfilActual = async (req, res) => {
    const resultado = await this.casos.obtenerPerfil.execute(req.usuario.id_usuario);
    res.json({ mensaje: 'Perfil del usuario autenticado', ...resultado });
  };

  actualizarPerfil = async (req, res) => {
    const resultado = await this.casos.actualizarPerfil.execute(req.usuario, req.body);
    res.json({ mensaje: 'Perfil actualizado correctamente', ...resultado });
  };

  perfilPublicoFreelancer = async (req, res) => {
    const perfil = await this.casos.obtenerPerfilPublicoFreelancer.execute(Number(req.params.id));
    res.json({ mensaje: 'Perfil público del freelancer', perfil });
  };

  perfilFreelancerConContacto = async (req, res) => {
    const perfil = await this.casos.obtenerPerfilFreelancerConContacto.execute(req.usuario, Number(req.params.id));
    res.json({ mensaje: 'Perfil del freelancer con datos de contacto', perfil });
  };
}