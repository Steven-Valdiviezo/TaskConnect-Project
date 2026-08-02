import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { CatalogoService } from '../../../core/services/catalogo.service';
import { Profesion } from '../../../models/catalogo.model';
import { RegistroPayload } from '../../../models/usuario.model';

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
    nombre: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    contrasena: ['', [Validators.required, Validators.minLength(8)]],
    confirmar: ['', Validators.required],
    telefono: [''],
    empresa: [''],
    direccion: [''],
    id_profesion: [null as number | null],
    descripcion: [''],
    experiencia: [0]
  });

  ngOnInit(): void {
    this.catalogo.listarProfesiones().subscribe(r => this.profesiones.set(r.profesiones));
  }

  get esFreelancer(): boolean {
    return this.form.controls.rol.value === 'freelancer';
  }

  enviar(): void {
    this.form.markAllAsTouched();
    if (this.form.controls.nombre.invalid || this.form.controls.correo.invalid ||
        this.form.controls.contrasena.invalid || this.form.controls.confirmar.invalid) {
      this.error.set('Completa todos los campos obligatorios.');
      return;
    }
  
    const v = this.form.getRawValue();
  
    if (v.contrasena !== v.confirmar) {
      this.error.set('Las contraseñas no coinciden.');
      return;
    }
  
    if (v.rol === 'freelancer' && (!v.id_profesion || !v.descripcion?.trim())) {
      this.error.set('Selecciona tu profesión y agrega una breve descripción.');
      return;
    }
    
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