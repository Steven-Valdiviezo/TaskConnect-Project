import { UsuarioSchema } from './usuario.schema.js';
import { ClienteSchema } from './cliente.schema.js';
import { FreelancerSchema } from './freelancer.schema.js';
import { ProfesionSchema } from './profesion.schema.js';
import { CategoriaSchema } from './categoria.schema.js';
import { ProyectoSchema } from './proyecto.schema.js';
import { PropuestaSchema } from './propuesta.schema.js';
import { ContratoSchema } from './contrato.schema.js';
import { MetodoPagoSchema } from './metodo-pago.schema.js';
import { PagoSchema } from './pago.schema.js';
import { MensajeSchema } from './mensaje.schema.js';
import { CalificacionSchema } from './calificacion.schema.js';
import { Token2faSchema } from './token-2fa.schema.js';
import { ConfiguracionSchema } from './configuracion.schema.js';
import { AuditoriaSchema } from './auditoria.schema.js';

// Lista única que lee el DataSource
export const schemas = [
  UsuarioSchema, ClienteSchema, FreelancerSchema, ProfesionSchema, CategoriaSchema,
  ProyectoSchema, PropuestaSchema, ContratoSchema, MetodoPagoSchema, PagoSchema,
  MensajeSchema, CalificacionSchema, Token2faSchema, ConfiguracionSchema, AuditoriaSchema
];