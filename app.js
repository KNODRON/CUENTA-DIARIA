const personal = [
  { nombre: 'Tte. Cortes A', seccion: 'Analistas', rol: 'PNS' },
  { nombre: 'SOM Cabezas P', seccion: 'Analistas', rol: 'PNI' },
  { nombre: 'Subof. Iturra T', seccion: 'Analistas', rol: 'PNI' },
  { nombre: 'S1 Hormazabal C', seccion: 'Analistas', rol: 'PNI' },
  { nombre: 'S1 Vargas C', seccion: 'Analistas', rol: 'PNI' },
  { nombre: 'S1 Muñoz M', seccion: 'Analistas', rol: 'PNI' },
  { nombre: 'S1 Leal B', seccion: 'Analistas', rol: 'PNI' },
  { nombre: 'S2 Salazar R', seccion: 'Analistas', rol: 'PNI' },
  { nombre: 'S2 Jimenez V', seccion: 'Analistas', rol: 'PNI' },
  { nombre: 'S2 Fernandez V', seccion: 'Analistas', rol: 'PNI' },
  { nombre: 'S2 Muñoz P', seccion: 'Analistas', rol: 'PNI' },
  { nombre: 'S2 Pardo A', seccion: 'Analistas', rol: 'PNI' },
  { nombre: 'S2 San Juan V', seccion: 'Analistas', rol: 'PNI' },
  { nombre: 'C1 Olivares G', seccion: 'Analistas', rol: 'PNI' },
  { nombre: 'S2 Correa I', seccion: 'Tegnologia Forense', rol: 'PNI' },
  { nombre: 'S2 Chavez S', seccion: 'Tegnologia Forense', rol: 'PNI' },
  { nombre: 'S2 Otarola M', seccion: 'Tegnologia Forense', rol: 'PNI' },
  { nombre: 'C1 Perez B', seccion: 'Tegnologia Forense', rol: 'PNI' },
  { nombre: 'C2 Toro V', seccion: 'Tegnologia Forense', rol: 'PNI' },
  { nombre: 'Subof. Cerda L', seccion: 'Monitoreo', rol: 'PNI' },
  { nombre: 'S2 Avalos S', seccion: 'Monitoreo', rol: 'PNI' },
  { nombre: 'S2 Vilo R', seccion: 'Monitoreo', rol: 'PNI' },
  { nombre: 'C1 Pacheco P', seccion: 'Monitoreo', rol: 'PNI' }
];

function init() {
  // Fecha
  const fechaDiv = document.getElementById('fecha');
  const hoy = new Date();
  fechaDiv.textContent = hoy.toLocaleDateString('es-CL', {
    day:'numeric', month:'long', year:'numeric'
  });

  // Tabla
  const tbody = document.querySelector('#asistencia tbody');
  personal.forEach(p => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${p.nombre}</td>
      ${['Si','Noche','Franco','Ad.','Lic.','Otro']
        .map(tipo => `<td><input type="checkbox" data-nombre="${p.nombre}" data-tipo="${tipo}"></td>`)
        .join('')}
    `;
    tbody.appendChild(tr);

    // Solo 1 checkbox por fila
    const checks = tr.querySelectorAll('input[type="checkbox"]');
    checks.forEach(cb => {
      cb.addEventListener('click', () => {
        if (!cb.checked) return;
        checks.forEach(o => { if (o!==cb) o.checked = false; });
      });
    });
  });

  // Enviar WhatsApp
  document.getElementById('enviarWhatsApp')
    .addEventListener('click', () => {
      const rows = document.querySelectorAll('#asistencia tbody tr');
      let msg = `📋 Asistencia ${hoy.toLocaleDateString('es-CL')}\n`;
      rows.forEach(tr => {
        const nombre = tr.cells[0].textContent;
        const sel = Array.from(tr.querySelectorAll('input:checked'))
                      .map(cb => cb.dataset.tipo)
                      .join(', ');
        msg += `• ${nombre}: ${sel || 'Sin marcar'}\n`;
      });
      window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
    });
}

document.addEventListener('DOMContentLoaded', init);
