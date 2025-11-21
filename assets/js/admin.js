const keyUsuarios = 'usuariosCarWash';

const leerUsuarios = () => JSON.parse(localStorage.getItem(keyUsuarios) || '[]');
const guardarUsuarios = (arr) => localStorage.setItem(keyUsuarios, JSON.stringify(arr));

const pintarKPIs = (data) => {
  document.getElementById('kpi-total').textContent = data.length;
  document.getElementById('kpi-admins').textContent = data.filter((u) => /administrador/i.test(u.cargo || '')).length;
  document.getElementById('kpi-emps').textContent = data.filter((u) => /empleado/i.test(u.cargo || '')).length;
};

const filtrarUsuarios = (data) => {
  const q = document.getElementById('txt-buscar')?.value.toLowerCase().trim() || '';
  const rol = document.getElementById('sel-rol')?.value || '';
  return data.filter((u) => {
    const coincideRol = !rol || new RegExp(rol, 'i').test(u.cargo || '');
    const coincideQ = !q || [u.usuario, u.nombre, u.correo].some((val) => (val || '').toLowerCase().includes(q));
    return coincideRol && coincideQ;
  });
};

const renderTabla = () => {
  const tbody = document.getElementById('tbody-users');
  if (!tbody) return;
  const usuarios = leerUsuarios();
  pintarKPIs(usuarios);
  const filtrados = filtrarUsuarios(usuarios);
  if (!filtrados.length) {
    tbody.innerHTML = '<tr><td colspan="5">No hay usuarios que coincidan con el filtro.</td></tr>';
    return;
  }

  tbody.innerHTML = filtrados
    .map(
      (u) => `
      <tr>
        <td><b>${u.usuario}</b></td>
        <td>${u.nombre || ''}</td>
        <td>${u.correo || ''}</td>
        <td><span class="tag">${u.cargo || '—'}</span></td>
        <td>
          <div class="row-actions">
            <button class="btn ghost" data-act="toggle" data-user="${u.usuario}">Cambiar cargo</button>
            <button class="btn ghost" data-act="reset" data-user="${u.usuario}">Reset clave</button>
            <button class="btn danger" data-act="del" data-user="${u.usuario}">Eliminar</button>
          </div>
        </td>
      </tr>
    `,
    )
    .join('');
};

const protegerRuta = () => {
  const activo = JSON.parse(localStorage.getItem('usuarioActivo') || 'null');
  if (!activo) {
    window.location.href = 'login.html';
    return null;
  }
  if (!/administrador/i.test(activo.cargo || '')) {
    window.location.href = 'panel_empleado.html';
    return null;
  }
  const sesion = document.getElementById('sesion-actual');
  if (sesion) {
    sesion.textContent = `Sesión: ${activo.usuario} (${activo.cargo})`;
  }
  return activo;
};

document.addEventListener('DOMContentLoaded', () => {
  const activo = protegerRuta();
  if (!activo) return;

  renderTabla();

  document.getElementById('btn-recargar')?.addEventListener('click', renderTabla);
  document.getElementById('txt-buscar')?.addEventListener('input', renderTabla);
  document.getElementById('sel-rol')?.addEventListener('change', renderTabla);

  document.getElementById('btn-logout')?.addEventListener('click', () => {
    localStorage.removeItem('usuarioActivo');
    window.location.href = 'login.html';
  });

  document.getElementById('tbody-users')?.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-act]');
    if (!btn) return;
    const act = btn.dataset.act;
    const usuario = btn.dataset.user;
    const usuarios = leerUsuarios();
    const idx = usuarios.findIndex((u) => (u.usuario || '').toLowerCase() === usuario.toLowerCase());
    if (idx < 0) return;

    if (act === 'del') {
      if (!confirm(`¿Eliminar a "${usuarios[idx].usuario}"?`)) return;
      usuarios.splice(idx, 1);
      guardarUsuarios(usuarios);
      renderTabla();
      return;
    }

    if (act === 'toggle') {
      const actual = usuarios[idx].cargo || '';
      usuarios[idx].cargo = /administrador/i.test(actual) ? 'Empleado' : 'Administrador';
      guardarUsuarios(usuarios);
      renderTabla();
      return;
    }

    if (act === 'reset') {
      const nueva = prompt(`Nueva contraseña para ${usuarios[idx].usuario}:`, '');
      if (nueva === null) return;
      if (!nueva.trim()) {
        alert('La contraseña no puede estar vacía.');
        return;
      }
      usuarios[idx].clave = nueva.trim();
      guardarUsuarios(usuarios);
      alert('Contraseña actualizada.');
      renderTabla();
    }
  });
});
