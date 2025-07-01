document.addEventListener('DOMContentLoaded', function () {
  const formulario = document.getElementById('formulario-estudiante');
  const listaRegistros = document.getElementById('lista-registros');
  const estudiantesGuardados = [];

  // Mostrar nota en tiempo real al escribir calificación
  document.getElementById('calificacion').addEventListener('input', function () {
    const valor = parseInt(this.value);
    const notaInput = document.getElementById('nota');

    if (!isNaN(valor) && valor >= 1 && valor <= 100) {
      const notaCalculada = Math.min(((valor / 100) * 6 + 1).toFixed(1), 7.0);
      notaInput.value = notaCalculada;
    } else {
      notaInput.value = "";
    }
  });

  formulario.addEventListener('submit', function (e) {
    e.preventDefault();

    const fecha = document.getElementById('fecha').value;
    const rut = document.getElementById('rut').value.trim();
    const apellidos = document.getElementById('apellidos').value.trim();
    const nombres = document.getElementById('nombres').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const calificacion = parseInt(document.getElementById('calificacion').value);
    const nota = parseFloat(document.getElementById('nota').value); // Ya viene calculada
    const evaluacion = document.getElementById('evaluacion').value.trim();
    const asignatura = document.getElementById('asignatura').value.trim();
    const curso = document.getElementById('curso').value.trim();

    if (new Date(fecha) > new Date()) {
      alert("La fecha no puede ser futura.");
      return;
    }
    if (!validarRut(rut)) {
      alert("RUT inválido.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      alert("Correo inválido.");
      return;
    }
    if (isNaN(calificacion) || calificacion < 1 || calificacion > 100) {
      alert("La calificación debe estar entre 1 y 100.");
      return;
    }

    const estudiante = {
      fecha,
      rut,
      apellidos,
      nombres,
      correo,
      calificacion,
      nota,
      evaluacion,
      asignatura,
      curso
    };

    estudiantesGuardados.push(estudiante);

    console.log("Estudiante registrado:", estudiante);
    mostrarRegistros(estudiantesGuardados);

    alert("Registro guardado correctamente.");

    formulario.reset();
    document.getElementById('nota').value = "";
  });

function mostrarRegistros(estudiantes) {
  if (estudiantes.length === 0) {
    listaRegistros.innerHTML = "<p>No hay registros aún.</p>";
    return;
  }

  let html = "<ul>";
  estudiantes.forEach((est, index) => {
    html += `
      <li>
        <strong>${index + 1}. ${est.nombres} ${est.apellidos}</strong>
        <div>RUT: ${est.rut}</div>
        <div>Fecha: ${est.fecha}</div>
        <div>Correo: ${est.correo}</div>
        <div>Calificación: ${est.calificacion}</div>
        <div>Nota: ${est.nota}</div>
        <div>Evaluación: ${est.evaluacion || '-'}</div>
        <div>Asignatura: ${est.asignatura}</div>
        <div>Curso: ${est.curso}</div>
      </li>
    `;
  });
  html += "</ul>";

  listaRegistros.innerHTML = html;
}

});

function validarRut(rut) {
  rut = rut.replace(/\./g, "").replace("-", "");
  const cuerpo = rut.slice(0, -1);
  const dv = rut.slice(-1).toUpperCase();

  let suma = 0;
  let multiplo = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo.charAt(i)) * multiplo;
    multiplo = multiplo < 7 ? multiplo + 1 : 2;
  }

  const dvEsperado = 11 - (suma % 11);
  let dvFinal = dvEsperado === 11 ? "0" : dvEsperado === 10 ? "K" : dvEsperado.toString();

  return dvFinal === dv;
}
