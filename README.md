# CarWash Pro

Sitio web estático con experiencia completa para un negocio de detailing y lavado automotriz. Incluye landing page con calculadora, formulario de contacto y galería, además de un portal interno con login, panel administrativo y panel para empleados.

## Estructura

- `index.html`: página principal con secciones de servicios, métricas animadas, calculadora de tarifas y formulario de contacto.
- `login.html`: acceso al portal interno.
- `panel_admin.html`: tablero para administrar cuentas de usuarios.
- `panel_empleado.html`: espacio donde el personal registra servicios.
- `assets/css/styles.css`: hoja de estilos global.
- `assets/js/main.js`: interacciones de la landing (menú móvil, formulario, calculadora, galería, FAQs).
- `assets/js/login.js`: manejo de usuarios demo, validación y redirección por rol.
- `assets/js/admin.js`: lógica del panel administrativo.
- `assets/js/empleado.js`: registro y listado de servicios creados por cada empleado.

## Cómo ejecutar

No se requieren dependencias adicionales. Levanta un servidor local (por ejemplo `python -m http.server 8000`) y visita:

- `http://localhost:8000/index.html` para la landing.
- `http://localhost:8000/login.html` para crear sesión.
- Después de iniciar sesión se redirige automáticamente al panel correspondiente.

Las credenciales demo se generan desde el botón "Crear cuentas demo" en `login.html` (usuario/contraseña `admin/123456` y `empleado/123456`).
