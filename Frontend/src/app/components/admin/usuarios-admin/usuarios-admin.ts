// src/app/components/admin/usuarios-admin/usuarios-admin.ts — REEMPLAZA
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AdminService } from '../../../core/services/admin.service';
import { DialogoService } from '../../../core/services/dialogo.service';
import { Usuario } from '../../../models/usuario.model';

@Component({
  selector: 'app-usuarios-admin',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './usuarios-admin.html',
  styleUrl: './usuarios-admin.css'
})
export class UsuariosAdmin implements OnInit {
  private fb = inject(FormBuilder);
  private adminSrv = inject(AdminService);
  private dialogo = inject(DialogoService);

  usuarios = signal<Usuario[]>([]);
  cargando = signal(true);
  procesando = signal<number | null>(null);

  textoFiltro = signal('');
  rolFiltro = signal('');

  form = this.fb.group({ texto: [''], rol: [''] });

  usuariosFiltrados = computed(() => {
    const texto = this.textoFiltro();
    const rol = this.rolFiltro();
    return this.usuarios().filter(u =>
      (!rol || u.rol === rol) &&
      (!texto || u.nombre.toLowerCase().includes(texto) || u.correo.toLowerCase().includes(texto))
    );
  });

  totalClientes = computed(() => this.usuarios().filter(u => u.rol === 'cliente').length);
  totalFreelancers = computed(() => this.usuarios().filter(u => u.rol === 'freelancer').length);

  ngOnInit(): void {
    this.form.get('texto')!.valueChanges.subscribe(v => this.textoFiltro.set((v ?? '').toLowerCase().trim()));
    this.form.get('rol')!.valueChanges.subscribe(v => this.rolFiltro.set(v ?? ''));
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.adminSrv.listarUsuarios().subscribe(r => {
      this.usuarios.set(r.usuarios.filter(u => u.rol !== 'administrador'));
      this.cargando.set(false);
    });
  }

  iniciales(nombre: string): string {
    return nombre.split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase();
  }

  async cambiarEstado(u: Usuario): Promise<void> {
    const accion = u.estado === 'activo' ? 'suspender' : 'activar';
    const ok = await this.dialogo.confirmar(`¿Seguro que quieres ${accion} a "${u.nombre}"?`, {
      titulo: u.estado === 'activo' ? 'Suspender usuario' : 'Activar usuario',
      textoConfirmar: u.estado === 'activo' ? 'Sí, suspender' : 'Sí, activar'
    });
    if (!ok) return;

    this.procesando.set(u.id_usuario);
    const peticion = u.estado === 'activo' ? this.adminSrv.desactivarUsuario(u.id_usuario) : this.adminSrv.reactivarUsuario(u.id_usuario);
    peticion.subscribe({
      next: () => { this.cargar(); this.procesando.set(null); },
      error: async (err: any) => {
        await this.dialogo.avisar(err?.error?.mensaje ?? 'No se pudo cambiar el estado del usuario.', 'Error');
        this.procesando.set(null);
      }
    });
  }
}