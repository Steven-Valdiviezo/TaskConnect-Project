import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { CatalogoService } from '../../../core/services/catalogo.service';
import { Profesion } from '../../../models/catalogo.model';
import { RegistroPayload } from '../../../models/usuario.model';
import {
  sinSoloEspacios, nombreCompleto, correoRegistro, telefonoEcuador, politicaContrasena,
  contrasenasIguales, evaluarContrasena, fuerzaContrasena, mensajeError, normalizar
} from '../../../core/validators/validadores';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class Registro implements OnInit {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private catalogo = inject(CatalogoService);
  private router = inject(Router);

  profesiones = signal<Profesion[]>([]);
  cargando = signal(false);
  error = signal<string | null>(null);
  exito = signal(false);

  verContrasena = signal(false);
  verConfirmar = signal(false);

  form = this.fb.group({
    rol: ['cliente' as 'cliente' | 'freelancer', Validators.required],
    nombre: ['', [Validators.required, sinSoloEspacios, nombreCompleto, Validators.maxLength(100)]],
    correo: ['', [Validators.required, correoRegistro]],
    contrasena: ['', [Validators.required, politicaContrasena]],
    confirmar: ['', Validators.required],
    telefono: ['', [telefonoEcuador]],
    empresa: ['', [Validators.maxLength(30)]],
    direccion: ['', [Validators.maxLength(100)]],
    id_profesion: [null as number | null],
    descripcion: ['', [Validators.maxLength(500)]],
    experiencia: [0, [Validators.min(0), Validators.max(60), Validators.pattern(/^\d+$/)]]
  }, { validators: contrasenasIguales });

  // Para usarlo en la plantilla: {{ msg(form.controls.nombre) }}
  msg = mensajeError;

  // Lista de requisitos de la contraseña (se recalcula mientras escribe)
  reglasContrasena() {
    const v = this.form.getRawValue();
    return evaluarContrasena(v.contrasena ?? '', v.correo ?? '', v.nombre ?? '');
  }
  
  fuerza() {
    const v = this.form.getRawValue();
    return fuerzaContrasena(v.contrasena ?? '', v.correo ?? '', v.nombre ?? '');
  }

  ngOnInit(): void {
    this.catalogo.listarProfesiones().subscribe(r => this.profesiones.set(r.profesiones));

    // La contraseña no puede contener el nombre/correo: si cambian, se vuelve a validar
    this.form.controls.correo.valueChanges.subscribe(() => this.form.controls.contrasena.updateValueAndValidity());
    this.form.controls.nombre.valueChanges.subscribe(() => this.form.controls.contrasena.updateValueAndValidity());

    // Profesión y descripción solo son obligatorias si el rol es freelancer
    this.form.controls.rol.valueChanges.subscribe(() => this.ajustarValidadoresPorRol());
    this.ajustarValidadoresPorRol();
  }

  private ajustarValidadoresPorRol(): void {
    const { id_profesion, descripcion } = this.form.controls;
    if (this.esFreelancer) {
      id_profesion.setValidators([Validators.required]);
      descripcion.setValidators([Validators.required, sinSoloEspacios, Validators.minLength(20), Validators.maxLength(500)]);
    } else {
      id_profesion.clearValidators();
      descripcion.setValidators([Validators.maxLength(500)]);
    }
    id_profesion.updateValueAndValidity();
    descripcion.updateValueAndValidity();
  }

  get esFreelancer(): boolean {
    return this.form.controls.rol.value === 'freelancer';
  }

  enviar(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.error.set('Revisa los campos marcados en rojo.');
      return;
    }

    // Se limpian los datos antes de enviarlos
    const v = this.form.getRawValue();
    v.nombre = normalizar(v.nombre);
    v.correo = (v.correo ?? '').trim().toLowerCase();
    v.telefono = (v.telefono ?? '').replace(/[\s-]/g, '');

    const payload: RegistroPayload = v.rol === 'cliente'
      ? { nombre: v.nombre!, correo: v.correo!, contrasena: v.contrasena!, telefono: v.telefono || undefined,
          rol: 'cliente', perfil: { empresa: v.empresa || undefined, direccion: v.direccion || undefined } }
      : { nombre: v.nombre!, correo: v.correo!, contrasena: v.contrasena!, telefono: v.telefono || undefined,
          rol: 'freelancer', perfil: { id_profesion: v.id_profesion!, descripcion: v.descripcion!, experiencia: v.experiencia ?? 0 } };

    this.error.set(null);
    this.cargando.set(true);
    this.auth.registrar(payload).subscribe({
      next: () => {
        this.cargando.set(false);
        this.exito.set(true);
        setTimeout(() => this.router.navigateByUrl('/login'), 1500);
      },
      error: (err: any) => {
        this.cargando.set(false);
        this.error.set(err?.error?.mensaje ?? 'No se pudo completar el registro.');
      }
    });
  }
}