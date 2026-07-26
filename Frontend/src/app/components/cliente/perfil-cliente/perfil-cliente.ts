import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../../../core/services/usuario.service';
import { AuthService } from '../../../core/services/auth.service';
import { PerfilCliente as PerfilClienteModel } from '../../../models/usuario.model';

@Component({
  selector: 'app-perfil-cliente',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './perfil-cliente.html'
})
export class PerfilCliente implements OnInit {
  private fb = inject(FormBuilder);
  private usuarioSrv = inject(UsuarioService);
  private auth = inject(AuthService);

  editando = signal(false);
  guardando = signal(false);
  error = signal<string | null>(null);
  iniciales = signal('');

  usuario = this.auth.usuario;

  form = this.fb.group({
    nombre: ['', Validators.required],
    correo: [{ value: '', disabled: true }],
    telefono: [''],
    empresa: [''],
    direccion: ['']
  });

  ngOnInit(): void {
    this.usuarioSrv.obtenerPerfil().subscribe(r => {
      const perfil = r.perfil as PerfilClienteModel | null;
      this.form.patchValue({
        nombre: r.usuario.nombre,
        correo: r.usuario.correo,
        telefono: r.usuario.telefono ?? '',
        empresa: perfil?.empresa ?? '',
        direccion: perfil?.direccion ?? ''
      });
      this.iniciales.set(r.usuario.nombre.split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase());
    });
  }

  activarEdicion(): void { this.editando.set(true); }
  cancelarEdicion(): void { this.editando.set(false); }

  guardar(): void {
    if (this.form.controls.nombre.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.guardando.set(true);
    this.error.set(null);
    const v = this.form.getRawValue();

    this.usuarioSrv.actualizarPerfil({
      nombre: v.nombre!, telefono: v.telefono || undefined, empresa: v.empresa || undefined, direccion: v.direccion || undefined
    }).subscribe({
      next: () => { this.guardando.set(false); this.editando.set(false); },
      error: (err: any) => {
        this.guardando.set(false);
        this.error.set(err?.error?.mensaje ?? 'No se pudo actualizar el perfil.');
      }
    });
  }
}