const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const dataPath = path.join(__dirname, 'data', 'productos.json');

app.get('/api/productos', (req, res) => {
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Error al leer productos' });
    res.json(JSON.parse(data || '[]'));
  });
});

app.post('/api/productos', (req, res) => {
  fs.writeFile(dataPath, JSON.stringify(req.body, null, 2), (err) => {
    if (err) return res.status(500).json({ error: 'Error al guardar productos' });
    res.json({ message: 'Actualizado correctamente' });
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});