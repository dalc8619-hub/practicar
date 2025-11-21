const toggleMenu = () => {
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.navbar ul');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    toggle.classList.toggle('open');
  });
};

const validarFormularioContacto = () => {
  const nombre = document.getElementById('nombre');
  if (nombre && (!nombre.value || !nombre.value.trim())) {
    alert('El nombre no puede estar vacío, verifique');
    nombre.focus();
    return false;
  }

  const correo = document.getElementById('correo');
  if (correo && (!correo.value || !correo.value.trim())) {
    alert('El correo no puede estar vacío, verifique');
    correo.focus();
    return false;
  }

  if (correo) {
    const regexCorreo = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regexCorreo.test(correo.value)) {
      alert("Incluye un signo '@' en la dirección de correo electrónico");
      correo.focus();
      return false;
    }
  }

  const mensaje = document.getElementById('mensaje');
  if (mensaje && (!mensaje.value || !mensaje.value.trim())) {
    alert('El mensaje no puede estar vacío, verifique');
    mensaje.focus();
    return false;
  }

  return true;
};

const validarCalculadora = () => {
  const precio = parseFloat(document.getElementById('precioBase')?.value || '');
  if (isNaN(precio) || precio <= 0) {
    alert('Por favor ingresa un valor válido para el precio base.');
    document.getElementById('precioBase')?.focus();
    return false;
  }

  const tiempoBase = parseFloat(document.getElementById('tiempoBase')?.value || '');
  if (isNaN(tiempoBase) || tiempoBase <= 0) {
    alert('Por favor ingresa un valor válido para el tiempo base.');
    document.getElementById('tiempoBase')?.focus();
    return false;
  }

  const factor = parseFloat(document.getElementById('tamano')?.value || '');
  if (!factor) {
    alert('Por favor selecciona el tamaño del vehículo.');
    document.getElementById('tamano')?.focus();
    return false;
  }

  const tiempoNuevo = parseFloat(document.getElementById('tiempoNuevo')?.value || '');
  if (isNaN(tiempoNuevo) || tiempoNuevo <= 0) {
    alert('Por favor ingresa un valor válido para el tiempo estimado.');
    document.getElementById('tiempoNuevo')?.focus();
    return false;
  }

  if (tiempoNuevo < tiempoBase) {
    alert('El tiempo estimado no puede ser menor que el tiempo base.');
    document.getElementById('tiempoNuevo')?.focus();
    return false;
  }

  return true;
};

function realizarCalculo() {
  if (!validarCalculadora()) {
    return;
  }

  const p = parseFloat(document.getElementById('precioBase').value);
  const tb = parseFloat(document.getElementById('tiempoBase').value);
  const tn = parseFloat(document.getElementById('tiempoNuevo').value);
  const factor = parseFloat(document.getElementById('tamano').value);

  const total = ((p * tn) / tb) * factor;
  const fmt = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  });

  const valorCalculado = document.getElementById('valor-calculado');
  if (valorCalculado) {
    valorCalculado.textContent = fmt.format(total);
  }
  const resultado = document.getElementById('resultado');
  if (resultado) {
    resultado.style.display = 'block';
  }
}

window.realizarCalculo = realizarCalculo;

document.addEventListener('DOMContentLoaded', () => {
  toggleMenu();

  const formContacto = document.getElementById('form-contacto');
  formContacto?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validarFormularioContacto()) return;
    alert('Mensaje enviado con éxito.');
    formContacto.reset();
  });

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  document.querySelectorAll('.stat .num').forEach((el) => {
    const original = el.textContent;
    const digits = original.replace(/\D/g, '');
    if (!digits) return;
    const target = parseInt(digits, 10);
    let count = 0;
    const suffix = original.trim().endsWith('+') ? '+' : '';
    const increment = Math.max(1, Math.ceil(target / 40));

    const animate = () => {
      count += increment;
      if (count >= target) {
        el.textContent = original;
      } else {
        el.textContent = `${count}${suffix}`;
        requestAnimationFrame(animate);
      }
    };
    animate();
  });

  document.querySelectorAll('.galeria img').forEach((img) => {
    img.addEventListener('click', () => {
      const overlay = document.createElement('div');
      overlay.className = 'galeria-overlay';
      overlay.style.position = 'fixed';
      overlay.style.inset = '0';
      overlay.style.background = 'rgba(0,0,0,0.85)';
      overlay.style.display = 'flex';
      overlay.style.alignItems = 'center';
      overlay.style.justifyContent = 'center';
      overlay.style.zIndex = '9999';

      const big = document.createElement('img');
      big.src = img.src;
      big.alt = img.alt;
      big.style.maxWidth = '90vw';
      big.style.maxHeight = '90vh';
      big.style.boxShadow = '0 0 20px rgba(0,0,0,0.5)';

      overlay.appendChild(big);
      document.body.appendChild(overlay);

      overlay.addEventListener('click', () => {
        document.body.removeChild(overlay);
      });
    });
  });

  const faqs = document.querySelectorAll('.faqs details');
  faqs.forEach((faq) => {
    faq.addEventListener('toggle', () => {
      if (!faq.open) return;
      faqs.forEach((other) => {
        if (other !== faq) other.open = false;
      });
    });
  });
});
