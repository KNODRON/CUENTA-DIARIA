// 1. Define tu personal con sección y rol (PNS o PNI)
const personal = [
  { nombre: 'Tte. Cortes A', seccion: 'Analistas', rol: 'PNS' },
  { nombre: 'SOM Cabezas P',            seccion: 'Analistas', rol: 'PNI' },
  { nombre: 'Subof. Iturra T',            seccion: 'Analistas', rol: 'PNI' },
  { nombre: 'S1 Hormazabal C',        seccion: 'Analistas', rol: 'PNI' },
  { nombre: 'S1 Vargas C',            seccion: 'Analistas', rol: 'PNI' },
  { nombre: 'S1 Muñoz M',           seccion: 'Analistas', rol: 'PNI' },
  { nombre: 'S1 Leal B',        seccion: 'Analistas', rol: 'PNI' },
  { nombre: 'S2 Salazar R',      seccion: 'Analistas', rol: 'PNI' },
  { nombre: 'S2 Jimenez V',           seccion: 'Analistas', rol: 'PNI' },
  { nombre: 'S2 Fernandez V',           seccion: 'Analistas', rol: 'PNI' },
  { nombre: 'S2 Muñoz P',           seccion: 'Analistas', rol: 'PNI' },
  { nombre: 'S2 Pardo A',           seccion: 'Analistas', rol: 'PNI' },
  { nombre: 'S2 San Juan V',           seccion: 'Analistas', rol: 'PNI' },
  { nombre: 'C1 Olivares G',           seccion: 'Analistas', rol: 'PNI' },
  { nombre: 'S2 Correa I',           seccion: 'Tegnologia Forense', rol: 'PNI' },
  { nombre: 'S2 Chavez S',           seccion: 'Tegnologia Forense', rol: 'PNI' },
  { nombre: 'S2 Otarola M',           seccion: 'Tegnologia Forense', rol: 'PNI' },
  { nombre: 'C1 Perez B',           seccion: 'Tegnologia Forense', rol: 'PNI' },
  { nombre: 'C2 Toro V',           seccion: 'Tegnologia Forense', rol: 'PNI' },
  { nombre: 'Subof. Cerda L',           seccion: 'Monitoreo', rol: 'PNI' },
  { nombre: 'S2 Avalos S',           seccion: 'Monitoreo', rol: 'PNI' },
  { nombre: 'S2 Vilo R',           seccion: 'Monitoreo', rol: 'PNI' },
  { nombre: 'C1 Pacheco P',           seccion: 'Monitoreo', rol: 'PNI' },
];

// 2. Etiquetas de casillas (en el mismo orden de tu tabla)
const labels = ['Si','Noche','Franco','Ad.','Lic.','Otro'];

function init() {
  // 2.1 Mostrar fecha
  document.getElementById('fecha').textContent =
    new Date().toLocaleDateString();

  const tbody = document.querySelector('#asistencia tbody');
  let currentSection = null;

  // 2.2 Generar filas dinámicamente, con encabezados de sección
  personal.forEach(person => {
    if (person.seccion !== currentSection) {
      currentSection = person.seccion;
      const secRow = document.createElement('tr');
      const secCell = document.createElement('th');
      secCell.textContent = currentSection.toUpperCase();
      secCell.colSpan = 1 + labels.length; // 1 columna de nombre + un checkbox por label
      secRow.appendChild(secCell);
      tbody.appendChild(secRow);
    }

    const tr = document.createElement('tr');
    // Columna del nombre
    const tdName = document.createElement('td');
    tdName.textContent = person.nombre;
    tr.appendChild(tdName);

    // Generar las casillas, ocultando rol y sección en data-attrs
    labels.forEach(label => {
      const td = document.createElement('td');
      const cb = document.createElement('input');
      cb.type = 'checkbox';
      cb.dataset.label = label;
      cb.dataset.seccion = person.seccion;
      cb.dataset.rol = person.rol;
      td.appendChild(cb);
      tr.appendChild(td);

      // 2.3 Lógica: solo una casilla marcada por fila, toggle al volver a clickear
      cb.addEventListener('change', () => {
        if (cb.checked) {
          tr.querySelectorAll('input[type=checkbox]').forEach(other => {
            if (other !== cb) other.checked = false;
          });
        }
      });
    });

    tbody.appendChild(tr);
  });

  // 2.4 Botón enviar a WhatsApp
  document.getElementById('enviarWhatsApp')
    .addEventListener('click', enviarWhatsApp);
}

function generarResumen() {
  // Inicializa conteos por sección y rol
  const resumen = {};
  personal.forEach(p => {
    if (!resumen[p.seccion]) {
      resumen[p.seccion] = { PNS: 0, PNI: 0 };
    }
  });

  // Cuenta solo las casillas "Si" marcadas
  document
    .querySelectorAll('input[data-label="Si"]:checked')
    .forEach(cb => {
      const sec = cb.dataset.seccion;
      const rol = cb.dataset.rol;
      resumen[sec][rol]++;
    });

  // Construye el texto
  const fecha = new Date().toLocaleDateString();
  let texto = `Buenos días mi coronel, Sección Análisis Criminal: ${fecha}\n`;

  // Por cada sección agrega línea
  for (const sec of Object.keys(resumen)) {
    const { PNS, PNI } = resumen[sec];
    const partes = [];
    if (PNS) partes.push(String(PNS).padStart(2, '0') + ' PNS');
    if (PNI) partes.push(String(PNI).padStart(2, '0') + ' PNI');
    texto += `• ${sec}: ${partes.join(' - ') || '00 PNS'}\n`;
  }

  // Totales
  const totalPNS = Object.values(resumen).reduce((sum, v) => sum + v.PNS, 0);
  const totalPNI = Object.values(resumen).reduce((sum, v) => sum + v.PNI, 0);
  texto += `Total: ${String(totalPNS).padStart(2, '0')} PNS y PNI ${totalPNI}`;

  return texto;
}

function enviarWhatsApp() {
  const mensaje = encodeURIComponent(generarResumen());
  window.open(`https://wa.me/?text=${mensaje}`, '_blank');
}

// 3. Arranca la app cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', init);

