// Datos del personal con nombre, sección y rol (PNS/PNI)
const personal = [
  { nombre: 'Petronila Sinforoza', seccion: 'Analistas', rol: 'PNS' },
  { nombre: 'Juan Perico',        seccion: 'Analistas', rol: 'PNI' },
  { nombre: 'Los Palotes',         seccion: 'Analistas', rol: 'PNI' },
  { nombre: 'Gabriela Albino',     seccion: 'Tecnología Forense', rol: 'PNS' },
  { nombre: 'Andrea Lara',         seccion: 'Tecnología Forense', rol: 'PNI' },
  { nombre: 'Agustín Jiménez',     seccion: 'Tecnología Forense', rol: 'PNI' },
  { nombre: 'Francisca Jiménez',   seccion: 'Monitoreo', rol: 'PNI' },
  { nombre: 'Juan Jiménez',        seccion: 'Monitoreo', rol: 'PNI' }
];

document.addEventListener('DOMContentLoaded', () => {
  init();
  document.getElementById('generarReporte')
    .addEventListener('click', () => alert(generarReporte()));
  document.getElementById('enviarWhatsApp')
    .addEventListener('click', () => {
      const msg = encodeURIComponent(generarReporte());
      window.open(`https://wa.me/?text=${msg}`, '_blank');
    });
});

function init() {
  // Mostrar fecha
  document.getElementById('fecha').textContent = new Date().toLocaleDateString();

  const tbody = document.querySelector('#asistencia tbody');
  let current = '';

  personal.forEach(persona => {
    // Encabezado de sección
    if (persona.seccion !== current) {
      current = persona.seccion;
      const headerRow = document.createElement('tr');
      const th = document.createElement('th');
      th.colSpan = 8;
      th.textContent = current.toUpperCase();
      th.style.textAlign = 'left';
      headerRow.appendChild(th);
      tbody.appendChild(headerRow);
    }
    // Fila de persona
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${persona.nombre}</td>` +
      ['Si','No','Lic.','Ad.','Noche','Franco','Otro']
      .map(label =>
        `<td><input type="checkbox" 
          data-label="${label}" 
          data-rol="${persona.rol}" 
          data-seccion="${persona.seccion}"></td>`
      ).join('');
    tbody.appendChild(tr);

    // Un solo check permitido por fila
    const checks = tr.querySelectorAll('input[type="checkbox"]');
    checks.forEach(cb => cb.addEventListener('change', () => {
      if (cb.checked) checks.forEach(other => { if (other !== cb) other.checked = false; });
    }));
  });
}

function generarReporte() {
  const fecha = document.getElementById('fecha').textContent;
  const conteos = {
    'Analistas': { PNS: 0, PNI: 0 },
    'Tecnología Forense': { PNS: 0, PNI: 0 },
    'Monitoreo': { PNS: 0, PNI: 0 }
  };

  // Contar solo los que marcaron 'Si'
  document.querySelectorAll('#asistencia tbody tr').forEach(tr => {
    const siCheckbox = tr.querySelector('input[data-label="Si"]');
    if (siCheckbox && siCheckbox.checked) {
      const sec = siCheckbox.dataset.seccion;
      const rol = siCheckbox.dataset.rol;
      conteos[sec][rol]++;
    }
  });

  // Formatear mensaje
  const pad = n => n.toString().padStart(2, '0');
  let msg = `Buenos días mi coronel, Sección Análisis Criminal: ${fecha}
`;
  msg += `• Analistas: ${pad(conteos['Analistas'].PNS)} PNS - ${pad(conteos['Analistas'].PNI)} PNI
`;
  msg += `• Tecnología Forense: ${pad(conteos['Tecnología Forense'].PNI)} PNI
`;
  msg += `• Monitoreo: ${pad(conteos['Monitoreo'].PNI)} PNI
`;
  const totalPNS = conteos['Analistas'].PNS + conteos['Tecnología Forense'].PNS;
  const totalPNI = conteos['Analistas'].PNI + conteos['Tecnología Forense'].PNI + conteos['Monitoreo'].PNI;
  msg += `Total: ${pad(totalPNS)} PNS y ${pad(totalPNI)} PNI`;
  return msg;
}
```js
// Datos: nombre, sección y rol (PNS/PNI) ocultos en UI, pero usados para conteos
const personal = [
  { nombre: 'Petronila Sinforoza', seccion: 'Analistas', rol: 'PNS' },
  { nombre: 'Juan Perico',        seccion: 'Analistas', rol: 'PNI' },
  { nombre: 'Los Palotes',         seccion: 'Analistas', rol: 'PNI' },
  { nombre: 'Gabriela Albino',     seccion: 'Tecnología Forense', rol: 'PNS' },
  { nombre: 'Andrea Lara',         seccion: 'Tecnología Forense', rol: 'PNI' },
  { nombre: 'Agustín Jiménez',     seccion: 'Tecnología Forense', rol: 'PNI' },
  { nombre: 'Francisca Jiménez',   seccion: 'Monitoreo', rol: 'PNI' },
  { nombre: 'Juan Jiménez',        seccion: 'Monitoreo', rol: 'PNI' }
];

function init() {
  // Fecha automática
  document.getElementById('fecha').textContent = new Date().toLocaleDateString();

  const tbody = document.querySelector('#asistencia tbody');
  let currentSection = '';

  personal.forEach(persona => {
    // Añadir encabezado de sección
    if (persona.seccion !== currentSection) {
      currentSection = persona.seccion;
      const trh = document.createElement('tr');
      const th = document.createElement('th');
      th.colSpan = 8;
      th.textContent = persona.seccion.toUpperCase();
      th.style.textAlign = 'left';
      trh.appendChild(th);
      tbody.appendChild(trh);
    }

    // Fila de persona: solo nombre y checkboxes con atributos data
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${persona.nombre}</td>` +
      ['Si','No','Lic.','Ad.','Noche','Franco','Otro']
        .map(label =>
          `<td><input type="checkbox" data-label="${label}" ` +
          `data-rol="${persona.rol}" data-seccion="${persona.seccion}"></td>`
        ).join('');
    tbody.appendChild(tr);

    // Selección única por fila
    const checks = tr.querySelectorAll('input[type="checkbox"]');
    checks.forEach(cb => cb.addEventListener('change', () => {
      if (cb.checked) {
        checks.forEach(other => { if (other !== cb) other.checked = false; });
      }
    }));
  });

  // Botones
  document.getElementById('generarReporte')
    .addEventListener('click', () => alert(generarReporte()));

  document.getElementById('enviarWhatsApp')
    .addEventListener('click', () => {
      const mensaje = encodeURIComponent(generarReporte());
      window.open(`https://wa.me/?text=${mensaje}`, '_blank');
    });
}

function generarReporte() {
  const fecha = document.getElementById('fecha').textContent;
  const conteos = {
    'Analistas': { PNS: 0, PNI: 0 },
    'Tecnología Forense': { PNS: 0, PNI: 0 },
    'Monitoreo': { PNS: 0, PNI: 0 }
  };

  // Contar solo 'Si'
  document.querySelectorAll('#asistencia tbody tr').forEach(tr => {
    const cb = tr.querySelector('input[data-label="Si"]');
    if (cb && cb.checked) {
      const seccion = cb.dataset.seccion;
      const rol = cb.dataset.rol;
      conteos[seccion][rol]++;
    }
  });

  // Formateo del mensaje
  let texto = `Buenos días mi coronel, Sección Análisis Criminal: ${fecha}
`;
  texto += `• Analistas: ${pad(conteos['Analistas'].PNS)} PNS - ${pad(conteos['Analistas'].PNI)} PNI
`;
  texto += `• Tecnología Forense: ${pad(conteos['Tecnología Forense'].PNI)} PNI
`;
  texto += `• Monitoreo: ${pad(conteos['Monitoreo'].PNI)} PNI
`;
  const totalPNS = conteos['Analistas'].PNS + conteos['Tecnología Forense'].PNS;
  const totalPNI = conteos['Analistas'].PNI + conteos['Tecnología Forense'].PNI + conteos['Monitoreo'].PNI;
  texto += `Total: ${pad(totalPNS)} PNS y ${pad(totalPNI)} PNI`;
  return texto;
}

function pad(n) { return n.toString().padStart(2, '0'); }

document.addEventListener('DOMContentLoaded', init);
```js
// Datos: nombre, sección y rol (PNS/PNI)
const personal = [
  { nombre: 'Petronila Sinforoza', seccion: 'Analistas', rol: 'PNS' },
  { nombre: 'Juan Perico',        seccion: 'Analistas', rol: 'PNI' },
  { nombre: 'Los Palotes',         seccion: 'Analistas', rol: 'PNI' },
  { nombre: 'Gabriela Albino',     seccion: 'Tecnología Forense', rol: 'PNS' },
  { nombre: 'Andrea Lara',         seccion: 'Tecnología Forense', rol: 'PNI' },
  { nombre: 'Agustín Jiménez',     seccion: 'Tecnología Forense', rol: 'PNI' },
  { nombre: 'Francisca Jiménez',   seccion: 'Monitoreo', rol: 'PNI' },
  { nombre: 'Juan Jiménez',        seccion: 'Monitoreo', rol: 'PNI' }
];

function init() {
  // Mostrar fecha
  document.getElementById('fecha').textContent = new Date().toLocaleDateString();

  const tbody = document.querySelector('#asistencia tbody');
  let currentSection = '';

  personal.forEach(persona => {
    // Agregar encabezado de sección
    if (persona.seccion !== currentSection) {
      currentSection = persona.seccion;
      const trh = document.createElement('tr');
      const th = document.createElement('th');
      th.colSpan = 8;
      th.textContent = persona.seccion.toUpperCase();
      th.style.textAlign = 'left';
      trh.appendChild(th);
      tbody.appendChild(trh);
    }

    // Fila individual: solo nombre + casillas (rol oculto, no visible)
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${persona.nombre}</td>` +
      ['Si','No','Lic.','Ad.','Noche','Franco','Otro']
        .map(label => `<td><input type="checkbox" data-label="${label}" data-rol="${persona.rol}" data-seccion="${persona.seccion}"></td>`)
        .join('');
    tbody.appendChild(tr);

    // Selección única por fila
    const checks = tr.querySelectorAll('input[type="checkbox"]');
    checks.forEach(cb => cb.addEventListener('change', () => {
      if (cb.checked) {
        checks.forEach(o => { if (o !== cb) o.checked = false; });
      }
    }));
  });

  // Botones
  document.getElementById('generarReporte')
    .addEventListener('click', () => alert(generarReporte()));

  document.getElementById('enviarWhatsApp')
    .addEventListener('click', () => {
      const mensaje = encodeURIComponent(generarReporte());
      window.open(`https://wa.me/?text=${mensaje}`, '_blank');
    });
}

function generarReporte() {
  const fecha = document.getElementById('fecha').textContent;
  const conteos = {
    'Analistas': { PNS: 0, PNI: 0 },
    'Tecnología Forense': { PNS: 0, PNI: 0 },
    'Monitoreo': { PNS: 0, PNI: 0 }
  };

  // Contar solo casillas "Si"
  document.querySelectorAll('#asistencia tbody tr').forEach(tr => {
    const cb = tr.querySelector('input[data-label="Si"]');
    if (cb && cb.checked) {
      const rol = cb.dataset.rol;
      const seccion = cb.dataset.seccion;
      conteos[seccion][rol]++;
    }
  });

  // Construir mensaje
  let texto = `Buenos días mi coronel, Sección Análisis Criminal: ${fecha}
`;
  texto += `• Analistas: ${pad(conteos['Analistas'].PNS)} PNS - ${pad(conteos['Analistas'].PNI)} PNI
`;
  texto += `• Tecnología Forense: ${pad(conteos['Tecnología Forense'].PNI)} PNI
`;
  texto += `• Monitoreo: ${pad(conteos['Monitoreo'].PNI)} PNI
`;
  const totalPNS = conteos['Analistas'].PNS + conteos['Tecnología Forense'].PNS;
  const totalPNI = conteos['Analistas'].PNI + conteos['Tecnología Forense'].PNI + conteos['Monitoreo'].PNI;
  texto += `Total: ${pad(totalPNS)} PNS y ${pad(totalPNI)} PNI`;
  return texto;
}

function pad(n) { return n.toString().padStart(2, '0'); }

document.addEventListener('DOMContentLoaded', init);
```js
// Lista con nombre, sección y rol (PNS/PNI)
const personal = [
  { nombre: 'Petronila Sinforoza', seccion: 'Analistas', rol: 'PNS' },
  { nombre: 'Juan Perico',      seccion: 'Analistas', rol: 'PNI' },
  { nombre: 'Los Palotes',       seccion: 'Analistas', rol: 'PNI' },
  { nombre: 'Gabriela Albino',   seccion: 'Tecnología Forense', rol: 'PNS' },
  { nombre: 'Andrea Lara',       seccion: 'Tecnología Forense', rol: 'PNI' },
  { nombre: 'Agustín Jiménez',   seccion: 'Tecnología Forense', rol: 'PNI' },
  { nombre: 'Francisca Jiménez', seccion: 'Monitoreo', rol: 'PNI' },
  { nombre: 'Juan Jiménez',      seccion: 'Monitoreo', rol: 'PNI' }
];

function init() {
  // Fecha automática
  document.getElementById('fecha').textContent = new Date().toLocaleDateString();

  const tbody = document.querySelector('#asistencia tbody');
  let currentSection = '';

  personal.forEach(persona => {
    // Insertar encabezado de sección si cambia
    if (persona.seccion !== currentSection) {
      currentSection = persona.seccion;
      const trh = document.createElement('tr');
      const th = document.createElement('th');
      th.colSpan = 8;
      th.textContent = persona.seccion.toUpperCase();
      th.style.textAlign = 'left';
      trh.appendChild(th);
      tbody.appendChild(trh);
    }
    // Crear fila de persona
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${persona.nombre}</td>
      <td>${persona.rol}</td>
      ${['Si','No','Lic.','Ad.','Noche','Franco','Otro']
        .map(label => `<td><input type="checkbox" data-label="${label}"></td>`)
        .join('')}
    `;
    tbody.appendChild(tr);

    // Selección única por fila
    const checks = tr.querySelectorAll('input[type="checkbox"]');
    checks.forEach(cb => cb.addEventListener('change', () => {
      if (cb.checked) checks.forEach(o => { if (o !== cb) o.checked = false; });
    }));
  });

  document.getElementById('generarReporte')
    .addEventListener('click', () => alert(generarReporte()));

  document.getElementById('enviarWhatsApp')
    .addEventListener('click', () => {
      const mensaje = encodeURIComponent(generarReporte());
      window.open(`https://wa.me/?text=${mensaje}`, '_blank');
    });
}

function generarReporte() {
  const fecha = document.getElementById('fecha').textContent;
  // Inicializar conteos por sección y rol
  const conteos = {
    'Analistas': { PNS: 0, PNI: 0 },
    'Tecnología Forense': { PNS: 0, PNI: 0 },
    'Monitoreo': { PNS: 0, PNI: 0 }
  };

  // Recorre cada fila de persona
  document.querySelectorAll('#asistencia tbody tr').forEach(tr => {
    const cols = tr.children;
    const nombre = cols[0].textContent;
    const rol = cols[1].textContent;
    const sectionRow = personal.find(p => p.nombre === nombre);
    if (!sectionRow) return;
    // Si marca "Si", contará esa presencia
    const cbSi = cols[2].querySelector('input');
    if (cbSi && cbSi.checked) conteos[sectionRow.seccion][rol]++;
  });

  // Construir texto
  let texto = `Buenos días mi coronel, Sección Análisis Criminal: ${fecha}
`;
  texto += `• Analistas: ${pad(conteos['Analistas'].PNS)} PNS - ${pad(conteos['Analistas'].PNI)} PNI
`;
  texto += `• Tecnología Forense: ${pad(conteos['Tecnología Forense'].PNI)} PNI
`;
  texto += `• Monitoreo: ${pad(conteos['Monitoreo'].PNI)} PNI
`;
  const totalPNS = conteos['Analistas'].PNS + conteos['Tecnología Forense'].PNS;
  const totalPNI = conteos['Analistas'].PNI + conteos['Tecnología Forense'].PNI + conteos['Monitoreo'].PNI;
  texto += `Total: ${pad(totalPNS)} PNS y ${pad(totalPNI)} PNI`;
  return texto;
}

function pad(n) {
  return n.toString().padStart(2, '0');
}

document.addEventListener('DOMContentLoaded', init);
