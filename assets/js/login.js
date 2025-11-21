const KEY = 'usuariosCarWash';

const seedUsuarios = () => {
  const demo = [
    {
      nombre: 'Ana Martínez',
      correo: 'ana@carwashpro.com',
      cargo: 'Administrador',
      usuario: 'admin',
      clave: '123456',
    },
    {
      nombre: 'Carlos Ríos',
      correo: 'carlos@carwashpro.com',
      cargo: 'Empleado',
      usuario: 'empleado',
      clave: '123456',
    },
  ];
  localStorage.setItem(KEY, JSON.stringify(demo));
  return demo;
};

const leerUsuarios = () => JSON.parse(localStorage.getItem(KEY) || '[]');

const ensureSeed = () => {
  const usuarios = leerUsuarios();
  if (!usuarios.length) {
    seedUsuarios();
  }
};

document.addEventListener('DOMContentLoaded', () => {
  ensureSeed();

  const passInput = document.getElementById('clave');
  const passToggle = document.getElementById('toggle-login-clave');
  passToggle?.addEventListener('click', () => {
    if (!passInput) return;
    const tipo = passInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passInput.setAttribute('type', tipo);
    passToggle.innerHTML = tipo === 'password'
      ? '<i class="fa-solid fa-eye"></i>'
      : '<i class="fa-solid fa-eye-slash"></i>';
  });

  const msg = document.getElementById('mensaje-login');
  const formLogin = document.getElementById('form-login');
  formLogin?.addEventListener('submit', (e) => {
    e.preventDefault();

    const usuario = document.getElementById('usuario')?.value.trim();
    const clave = document.getElementById('clave')?.value.trim();

    if (!usuario || !clave) {
      alert('Por favor, ingresa tu usuario y contraseña.');
      if (!usuario) {
        document.getElementById('usuario')?.focus();
      } else {
        document.getElementById('clave')?.focus();
      }
      return;
    }

    const usuarios = leerUsuarios();
    const user = usuarios.find(
      (u) => u.usuario?.toLowerCase() === usuario.toLowerCase() && u.clave === clave,
    );

    if (!user) {
      alert('Usuario o contraseña incorrectos.');
      document.getElementById('usuario')?.focus();
      return;
    }

    const usuarioActivo = {
      nombre: user.nombre,
      correo: user.correo,
      cargo: user.cargo,
      usuario: user.usuario,
    };
    localStorage.setItem('usuarioActivo', JSON.stringify(usuarioActivo));

    if (msg) {
      msg.className = 'mensaje ok';
      msg.textContent = '✔ Iniciando sesión...';
    }

    const esAdmin = /administrador/i.test(user.cargo || '');
    const destino = esAdmin ? 'panel_admin.html' : 'panel_empleado.html';

    setTimeout(() => {
      window.location.href = destino;
    }, 800);
  });

  const btnDemo = document.getElementById('btn-demo');
  btnDemo?.addEventListener('click', () => {
    seedUsuarios();
    alert('Cuentas demo creadas: admin / 123456 y empleado / 123456');
  });
});
