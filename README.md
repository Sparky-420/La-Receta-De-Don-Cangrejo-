# La Receta de Don Cangrejo Pro MX

Aplicación para el control de producción artesanal de longaniza: recetas, lotes, premix de curado, costeo y seguimiento del proceso de planta.

## Tecnología

- React 19 y TypeScript.
- TanStack Start y TanStack Router.
- Vite 8 y Tailwind CSS 4.
- Bun para instalación y gestión de dependencias.
- Vitest y Testing Library para pruebas.
- Capacitor para preparar el paquete Android.

## Requisitos

- Bun (versión actual).
- Java 21 para la compilación Android.
- Android SDK para compilar localmente el APK.

## Desarrollo local

```bash
bun install
bun run dev
```

## Validaciones

```bash
bun run test
bun run lint
bun run build
```

## Compilar el APK Android

El workflow `.github/workflows/build-apk.yml` prepara el proyecto Capacitor y ejecuta Gradle para generar el APK Debug.

Se puede iniciar de dos maneras:

1. Haciendo push a la rama `main`.
2. Desde GitHub: **Actions → Compilar APK Android → Run workflow**.

El artefacto generado se publica como `Don-Cangrejo-Pro-APK`.

## Estructura del proyecto

- `src/routes/`: rutas y estructura principal de la aplicación.
- `src/components/ui/`: componentes de interfaz.
- `src/legacy/`: implementación heredada de Don Cangrejo.
- `src/test/`: pruebas automatizadas.
- `scripts/prepare-android.ts`: preparación del proyecto Android.
- `roadmap.md`: seguimiento de trabajo pendiente.

## Repositorio

El proyecto se mantiene en GitHub y puede desarrollarse localmente o desde Lovable. Los cambios de código deben revisarse antes de integrarse a `main`.
