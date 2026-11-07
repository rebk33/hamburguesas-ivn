const CLAVE_ADMIN = "admin123";
let productosGlobales = [];

function login() {
  const password = document.getElementById('pass').value;
  if (password === CLAVE_ADMIN) {
    document.getElementById('login-box').style.display = 'none';
    document.getElementById('admin-box').style.display = 'block';
    cargarDatosAdmin();
  } else {
    alert("Contraseña incorrecta");
  }
}

function cargarDatosAdmin() {
  fetch('/api/productos')
    .then(res => res.json())
    .then(data => {
      productosGlobales = data;
      renderizarListaAdmin();
    });
}

function renderizarListaAdmin() {
  const contenedor = document.getElementById('lista-platillos');
  contenedor.innerHTML = '';

  productosGlobales.forEach((prod) => {
    contenedor.innerHTML += `
      <div style="display:flex; justify-content:space-between; align-items:center; background:#0d0d12; padding:12px; margin-top:8px; border-radius:6px; border:1px solid var(--border-color);">
        <div>
          <strong>${prod.nombre}</strong> (${prod.categoria}) - <span style="color:var(--accent-pink);">$${prod.precio}</span>
        </div>
        <div style="display:flex; gap:8px;">
          <button onclick="prepararEdicion(${prod.id})" style="background:#ffc107; color:black; border:none; padding:6px 10px; border-radius:4px; cursor:pointer; font-weight:bold;">Editar</button>
          <button onclick="eliminarPlatillo(${prod.id})" style="background:#ff4d4d; color:white; border:none; padding:6px 10px; border-radius:4px; cursor:pointer; font-weight:bold;">Eliminar</button>
        </div>
      </div>
    `;
  });
}

function guardarPlatillo() {
  const editId = document.getElementById('edit-id').value;
  const nombre = document.getElementById('nombre').value;
  const precio = parseFloat(document.getElementById('precio').value);
  const categoria = document.getElementById('categoria').value;
  const desc = document.getElementById('desc').value;
  const img = document.getElementById('img').value || 'img/burger-sencilla.jpg';

  if (!nombre || !precio) {
    alert("Por favor completa al menos el nombre y el precio.");
    return;
  }

  if (editId) {
    const index = productosGlobales.findIndex(p => p.id == editId);
    if (index !== -1) {
      productosGlobales[index] = { id: Number(editId), nombre, precio, categoria, descripcion: desc, imagen: img };
    }
  } else {
    const nuevo = { id: Date.now(), nombre, precio, categoria, descripcion: desc, imagen: img };
    productosGlobales.push(nuevo);
  }

  sincronizarServidor();
  limpiarFormulario();
}

function prepararEdicion(id) {
  const prod = productosGlobales.find(p => p.id === id);
  if (!prod) return;

  document.getElementById('edit-id').value = prod.id;
  document.getElementById('nombre').value = prod.nombre;
  document.getElementById('precio').value = prod.precio;
  document.getElementById('categoria').value = prod.categoria;
  document.getElementById('desc').value = prod.descripcion;
  document.getElementById('img').value = prod.imagen;

  document.getElementById('form-titulo').innerText = "Editar Platillo";
  document.getElementById('btn-guardar').innerText = "Actualizar Cambios";
  document.getElementById('btn-cancelar').style.display = "block";
  window.scrollTo({ top: 200, behavior: 'smooth' });
}

function limpiarFormulario() {
  document.getElementById('edit-id').value = '';
  document.getElementById('nombre').value = '';
  document.getElementById('precio').value = '';
  document.getElementById('desc').value = '';
  document.getElementById('img').value = '';
  document.getElementById('form-titulo').innerText = "Agregar Platillo al Menú";
  document.getElementById('btn-guardar').innerText = "Guardar Platillo";
  document.getElementById('btn-cancelar').style.display = "none";
}

function eliminarPlatillo(id) {
  if (confirm("¿Estás seguro de eliminar este platillo?")) {
    productosGlobales = productosGlobales.filter(p => p.id !== id);
    sincronizarServidor();
  }
}

function guardarConfig() {
  alert("Configuración de tienda guardada localmente.");
}

function sincronizarServidor() {
  fetch('/api/productos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productosGlobales)
  })
  .then(res => res.json())
  .then(() => {
    renderizarListaAdmin();
    alert("¡Cambios guardados con éxito!");
  });
}