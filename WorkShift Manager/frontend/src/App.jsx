import React, { useState } from 'react';



// dentro il tuo componente:
useEffect(() => {
  // Richiesta GET al backend Spring Boot
  fetch('http://localhost:8080/api/turni')
    .then((response) => {
      if (!response.ok) throw new Error('Errore durante il recupero turni');
      return response.json();
    })
    .then((data) => setTurni(data))
    .catch((err) => console.error('Impossibile connettersi al backend:', err));
}, []);



export default function Dashboard() {
  const [showModal, setShowModal] = useState(false);
  const [turni, setTurni] = useState([
    { id: 1, dipendente: "Mario", turno: "Mattina", orario: "06:00 - 14:00", stato: "Attivo", totOre: 8, pagamento: 64 },
    { id: 2, dipendente: "juan melgarejo", turno: "Pomeriggio", orario: "12:00 - 22:00", stato: "In attesa", totOre: 10, pagamento: 70 }
  ]);

  const [form, setForm] = useState({
    dipendente: '',
    turno: 'Mattina',
    orario: '08:00 - 16:00',
    totOre: 8,
    pagamento: 64
  });

const handleSalva = (e) => {
  e.preventDefault();

  fetch('http://localhost:8080/api/turni', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Se usi il JWT, scommenta la riga sotto:
      // 'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(form)
  })
    .then((res) => res.json())
    .then((nuovoTurno) => {
      setTurni([...turni, nuovoTurno]); // Aggiorna la tabella a schermo
      setShowModal(false);              // Chiude la finestra
    })
    .catch((err) => console.error('Errore durante il salvataggio:', err));
};

  const handleElimina = (id) => {
    setTurni(turni.filter(t => t.id !== id));
  };

  return (
    <div style={{ padding: '30px', backgroundColor: '#e1bee7', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* Intestazione con pulsante di azione */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ color: '#c0ca33', margin: 0, fontSize: '32px' }}>WorkShift Manager</h1>
          <p style={{ margin: 0, color: '#4a148c' }}>Dashboard gestione turni aziendali</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          style={{ padding: '12px 20px', backgroundColor: '#6a1b9a', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          + Aggiungi Turno / Lavoratore
        </button>
      </div>

      {/* Schede riassuntive dinamiche */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '25px' }}>
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px' }}>
          <h4 style={{ margin: 0, color: '#555' }}>Dipendenti</h4>
          <h2 style={{ margin: '10px 0 0 0' }}>{turni.length}</h2>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px' }}>
          <h4 style={{ margin: 0, color: '#555' }}>Ore lavorate oggi</h4>
          <h2 style={{ margin: '10px 0 0 0' }}>{turni.reduce((acc, t) => acc + Number(t.totOre), 0)} h</h2>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px' }}>
          <h4 style={{ margin: 0, color: '#555' }}>Turni attivi</h4>
          <h2 style={{ margin: '10px 0 0 0' }}>{turni.filter(t => t.stato === 'Attivo').length}</h2>
        </div>
      </div>

      {/* Tabella con azioni */}
      <div style={{ background: 'white', padding: '20px', borderRadius: '12px' }}>
        <h3>Turni di oggi</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid #eee', color: '#777' }}>
              <th style={{ padding: '10px' }}>Dipendente</th>
              <th>Turno</th>
              <th>Orario</th>
              <th>Stato</th>
              <th>Tot Ore</th>
              <th>Tot Pagamento</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {turni.map((t) => (
              <tr key={t.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px 10px' }}>{t.dipendente}</td>
                <td>{t.turno}</td>
                <td>{t.orario}</td>
                <td>
                  <span style={{ color: t.stato === 'Attivo' ? 'green' : '#f57c00', fontWeight: 'bold' }}>
                    {t.stato}
                  </span>
                </td>
                <td>{t.totOre}</td>
                <td>€{t.pagamento}.00</td>
                <td>
                  <button 
                    onClick={() => handleElimina(t.id)}
                    style={{ backgroundColor: '#ffebee', color: '#c62828', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Elimina
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Finestra Modale di Inserimento */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ background: 'white', padding: '25px', borderRadius: '12px', width: '380px' }}>
            <h3 style={{ marginTop: 0 }}>Nuovo Turno</h3>
            <form onSubmit={handleSalva}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>Nome Dipendente</label>
                <input 
                  type="text" 
                  required 
                  style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                  value={form.dipendente}
                  onChange={(e) => setForm({...form, dipendente: e.target.value})}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>Tipo Turno</label>
                <select 
                  style={{ width: '100%', padding: '8px' }}
                  value={form.turno}
                  onChange={(e) => setForm({...form, turno: e.target.value})}
                >
                  <option value="Mattina">Mattina</option>
                  <option value="Pomeriggio">Pomeriggio</option>
                  <option value="Notte">Notte</option>
                </select>
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '5px' }}>Ore Lavorate</label>
                <input 
                  type="number" 
                  style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                  value={form.totOre}
                  onChange={(e) => setForm({...form, totOre: e.target.value, pagamento: e.target.value * 8})}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: '8px 15px', border: '1px solid #ccc', background: 'none', borderRadius: '4px', cursor: 'pointer' }}>Annulla</button>
                <button type="submit" style={{ padding: '8px 15px', backgroundColor: '#6a1b9a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Salva</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}