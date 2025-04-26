clients.forEach(client => {
    const row = `
      <tr>
        <td>${client.id}</td>
        <td>${client.nom}</td>
        <td>${client.age}</td>
        <td>
          <button class="btn btn-warning btn-sm me-1" onclick="modifierClient(${client.id})">Modifier</button>
          <button class="btn btn-danger btn-sm" onclick="supprimerClient(${client.id})">Supprimer</button>
        </td>
      </tr>
    `;
    tableBody.innerHTML += row;
  });
  //Ajouter une fonction afin de supprimer le client : 
  function supprimerClient(id) {
    if (confirm('Voulez-vous vraiment supprimer ce client ?')) {
      axios.delete(`http://localhost:3000/clients/${id}`)
        .then(response => {
          alert('Client supprimé avec succès');
          chargerClients(); // Refresh table
        })
        .catch(error => {
          console.error('Erreur suppression client:', error);
          alert('Erreur lors de la suppression');
        });
    }
  }
  //on ajoute une fonction pour modifier le client
  function modifierClient(id) {
    axios.get(`http://localhost:3000/clients/${id}`)
      .then(response => {
        const client = response.data;
        document.getElementById('clientId').value = client.id;
        document.getElementById('clientNom').value = client.nom;
        document.getElementById('clientAge').value = client.age;
  
        document.getElementById('clientId').disabled = true;
  
        const clientModal = new bootstrap.Modal(document.getElementById('clientModal'));
        clientModal.show();
  
        const form = document.getElementById('clientForm');
        form.onsubmit = function(e) {
          e.preventDefault();
  
          const nom = document.getElementById('clientNom').value;
          const age = document.getElementById('clientAge').value;
  
          axios.put(`http://localhost:3000/clients/${id}`, {
            nom: nom,
            age: Number(age)
          })
          .then(response => {
            clientModal.hide();
            chargerClients();
            form.reset();
            form.onsubmit = addClient; 
            document.getElementById('clientId').disabled = false;
          })
          .catch(error => {
            console.error('Erreur modification client:', error);
            alert('Erreur lors de la modification');
          });
        }
      })
      .catch(error => {
        console.error('Erreur chargement client:', error);
        alert('Erreur lors de la récupération du client');
      });
  }
  //Adapter ajouter client 
  function addClient(e) {
    e.preventDefault();
    const id = document.getElementById('clientId').value;
    const nom = document.getElementById('clientNom').value;
    const age = document.getElementById('clientAge').value;
  
    axios.post('http://localhost:3000/clients', {
      id: Number(id),
      nom: nom,
      age: Number(age)
    })
    .then(response => {
      const clientModal = bootstrap.Modal.getInstance(document.getElementById('clientModal'));
      clientModal.hide();
      chargerClients();
      document.getElementById('clientForm').reset();
    })
    .catch(error => {
      console.error('Erreur ajout client:', error.response.data);
      alert('Erreur: ' + error.response.data.message);
    });
  }
  document.getElementById('clientForm').addEventListener('submit', addClient);