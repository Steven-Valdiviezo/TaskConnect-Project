import { Token2faRepository } from '../../domain/ports/token-2fa-repository.js';

export class TypeOrmToken2faRepository extends Token2faRepository {
  constructor(dataSource) {
    super();
    this.dataSource = dataSource;
  }

  async crear({ id_usuario, token_hash, minutos }) {
    // en una transacción: o se invalida el anterior y se crea el nuevo, o no pasa nada
    await this.dataSource.transaction(async (manager) => {
      await manager.update('Token2fa', { id_usuario, usado: false }, { usado: true });

      // la expiración se calcula en la BD (misma consulta de antes, con parámetros)
      await manager.query(
        `INSERT INTO token_2fa (id_usuario, token_hash, fecha_expiracion)
         VALUES ($1, $2, CURRENT_TIMESTAMP + make_interval(mins => $3))`,
        [id_usuario, token_hash, minutos]
      );
    });
  }

  // Consumo atómico: valida y marca como usado en una sola sentencia.
  // Se usa el QueryBuilder porque dataSource.query() en UPDATE devuelve [filas, cantidad] y no solo las filas.
  async consumir(token_hash) {
    const resultado = await this.dataSource
      .createQueryBuilder()
      .update('Token2fa')
      .set({ usado: true })
      .where('token_hash = :token_hash', { token_hash })
      .andWhere('usado = false')
      .andWhere('fecha_expiracion > CURRENT_TIMESTAMP')
      .returning('id_usuario')
      .execute();

    return resultado.raw?.[0]; // { id_usuario } o undefined
  }
}