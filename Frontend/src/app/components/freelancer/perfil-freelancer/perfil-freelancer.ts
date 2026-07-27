import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../../../core/services/usuario.service';
import { AuthService } from '../../../core/services/auth.service';
import { CatalogoService } from '../../../core/services/catalogo.service';
import { ContratoService } from '../../../core/services/contrato.service';
import { PagoService } from '../../../core/services/pago.service';
import { CalificacionService } from '../../../core/services/calificacion.service';
import { PerfilFreelancer as PerfilFreelancerModel } from '../../../models/usuario.model';
import { Profesion } from '../../../models/catalogo.model';

@Component({
  selector: 'app-perfil-freelancer',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './perfil-freelancer.html'
})
export class PerfilFreelancer implements OnInit {
  private fb = inject(FormBuilder);
  private usuarioSrv = inject(UsuarioService);
  private auth = inject(AuthService);
  private catalogo = inject(CatalogoService);
  private contratoSrv = inject(ContratoService);
  private pagoSrv = inject(PagoService);
  private calificacionSrv = inject(CalificacionService);

  usuario = this.auth.usuario;
  iniciales = signal('');
  editando = signal(false);
  guardando = signal(false);
  error = signal<string | null>(null);
  profesiones = signal<Profesion[]>([]);

  rating = signal(0);
  contratosCompletados = signal(0);
  ingresosTotales = signal(0);

  form = this.fb.group({
    nombre: ['', Validators.required],
    correo: [{ value: '', disabled: true }],
    telefono: [''],
    id_profesion: [null as number | null, Validators.required],
    experiencia: [0, [Validators.required, Validators.min(0), Validators.max(60)]],
    descripcion: ['', Validators.required]
  });

  ngOnInit(): void {
    this.catalogo.listarProfesiones().subscribe(r => this.profesiones.set(r.profesiones));

    this.usuarioSrv.obtenerPerfil().subscribe(r => {
      const perfil = r.perfil as PerfilFreelancerModel | null;
      this.form.patchValue({
        nombre: r.usuario.nombre,
        correo: r.usuario.correo,
        telefono: r.usuario.telefono ?? '',
        id_profesion: perfil?.id_profesion ?? null,
        experiencia: perfil?.experiencia ?? 0,
        descripcion: perfil?.descripcion ?? ''
      });
      this.iniciales.set(r.usuario.nombre.split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase());
    });

    const idFreelancer = this.usuario()?.id_freelancer;
    if (idFreelancer) {
      this.calificacionSrv.reputacionDe(idFreelancer).subscribe(r => this.rating.set(Number(r.reputacion)));
    }

    this.contratoSrv.listarMios().subscribe(r => {
      this.contratosCompletados.set(r.contratos.filter(c => c.estado === 'completado').length);
    });

    this.pagoSrv.listarDeMisContratos().subscribe(lista => {
      const total = lista.filter(x => x.pago?.estado === 'pagado')
        .reduce((acc, x) => acc + (Number(x.pago!.monto) - Number(x.pago!.comision)), 0);
      this.ingresosTotales.set(total);
    });
  }

  activarEdicion(): void { this.editando.set(true); }
  cancelarEdicion(): void { this.editando.set(false); }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.guardando.set(true);
    this.error.set(null);
    const v = this.form.getRawValue();

    this.usuarioSrv.actualizarPerfil({
      nombre: v.nombre!, telefono: v.telefono || undefined,
      id_profesion: v.id_profesion!, experiencia: v.experiencia!, descripcion: v.descripcion!
    }).subscribe({
      next: () => { this.guardando.set(false); this.editando.set(false); },
      error: (err: any) => {
        this.guardando.set(false);
        this.error.set(err?.error?.mensaje ?? 'No se pudo actualizar el perfil.');
      }
    });
  }
}