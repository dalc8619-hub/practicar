const KEY_SERVICIOS = 'serviciosCarWash';

const protegerEmpleado = () => {
  const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo') || 'null');
  if (!usuarioActivo) {
    window.location.href = 'login.html';
    return null;
  }
  if (/administrador/i.test(usuarioActivo.cargo || '')) {
    window.location.href = 'panel_admin.html';
    return null;
  }
  return usuarioActivo;
};

const guardarServicios = (arr) => localStorage.setItem(KEY_SERVICIOS, JSON.stringify(arr));
const leerServicios = () => JSON.parse(localStorage.getItem(KEY_SERVICIOS) || '[]');

const renderServicios = (usuario) => {
  const contenedor = document.getElementById('listaServicios');
  if (!contenedor) return;
  const servicios = leerServicios().filter((s) => s.usuario === usuario);
  contenedor.innerHTML = '';
  if (!servicios.length) {
    contenedor.innerHTML = '<p>No hay servicios registrados aún.</p>';
    return;
  }
  servicios
    .sort((a, b) => (a.fecha > b.fecha ? -1 : 1))
    .forEach((s) => {
      const div = document.createElement('div');
      div.className = 'servicio-item';
      div.innerHTML = `
        <div class="meta">
          <strong>${s.fecha}</strong> — ${s.nombreCliente} (<em>${s.placa}</em>) · ${s.tipo}
        </div>
        <div class="acciones">
          <button class="btn ghost" data-id="${s.id}">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      `;
      div.querySelector('button')?.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        const todos = leerServicios();
        const idx = todos.findIndex((x) => x.id === id);
        if (idx !== -1) {
          todos.splice(idx, 1);
          guardarServicios(todos);
          renderServicios(usuario);
          mostrarMsg('Servicio eliminado.', 'ok');
        }
      });
      contenedor.appendChild(div);
    });
};

const mostrarMsg = (texto, tipo = 'ok') => {
  const msg = document.getElementById('msg');
  if (!msg) return;
  msg.className = `msg ${tipo === 'ok' ? 'ok' : 'err'}`;
  msg.textContent = texto;
  msg.style.display = 'block';
  setTimeout(() => {
    msg.style.display = 'none';
  }, 2500);
};

document.addEventListener('DOMContentLoaded', () => {
  const activo = protegerEmpleado();
  if (!activo) return;

  document.getElementById('nombreEmpleado').textContent = activo.nombre || '—';
  document.getElementById('cargoEmpleado').textContent = activo.cargo || '—';
  document.getElementById('usuarioEmpleado').textContent = activo.usuario || '—';

  document.getElementById('cerrarSesion')?.addEventListener('click', () => {
    localStorage.removeItem('usuarioActivo');
    window.location.href = 'login.html';
  });

  const form = document.getElementById('form-servicio');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombreCliente = document.getElementById('nombreCliente').value.trim();
    const placa = document.getElementById('placaVehiculo').value.trim().toUpperCase();
    const tipo = document.getElementById('tipoServicio').value;
    const fecha = document.getElementById('fechaServicio').value;

    if (!nombreCliente) {
      alert('Por favor, ingresa el nombre del cliente.');
      document.getElementById('nombreCliente').focus();
      return;
    }
    if (!placa) {
      alert('Por favor, ingresa la placa del vehículo.');
      document.getElementById('placaVehiculo').focus();
      return;
    }
    if (!tipo) {
      alert('Por favor, selecciona un tipo de servicio.');
      document.getElementById('tipoServicio').focus();
      return;
    }
    if (!fecha) {
      alert('Por favor, selecciona una fecha.');
      document.getElementById('fechaServicio').focus();
      return;
    }

    const servicios = leerServicios();
    servicios.push({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      usuario: activo.usuario,
      nombreCliente,
      placa,
      tipo,
      fecha,
    });
    guardarServicios(servicios);
    form.reset();
    mostrarMsg('Servicio registrado con éxito.', 'ok');
    renderServicios(activo.usuario);
  });

  renderServicios(activo.usuario);
});
