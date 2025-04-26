const express = require('express');
const mongoose = require('mongoose');
const Client = require('./models/Client');
const app = express();
app.use(express.json()); // ou bodyParser si tu l'utilises encore
// Connexion à MongoDB
mongoose.connect('mongodb://admin:1234@localhost:27017/Clientdb?authSource=admin')
.then(() => console.log('MongoDB connecté'))
.catch(err => console.error('Erreur MongoDB:', err));
// Route : Ajouter un client
app.post('/clients', async (req, res) => {
try {
const client = new Client(req.body);
await client.save();
res.status(201).json(client);
} catch (err) {

res.status(400).json({ message: err.message });
}
});
// Route : Lister tous les clients
app.get('/clients', async (req, res) => {
const clients = await Client.find();
res.json(clients);
});
// Route : Obtenir un client par id
app.get('/clients/:id', async (req, res) => {
try {
const client = await Client.findOne({ id: req.params.id });
if (!client) return res.status(404).json({ message: 'Client non trouvé' });
res.json(client);
} catch (err) {
res.status(500).json({ message: err.message });
}
});
app.listen(3000, () => {
console.log('Serveur démarré sur http://localhost:3000');
});