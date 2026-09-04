import { useState } from 'react';
import { useAuth } from './context/useAuth';

export default function ShiftManagerApp() {
  const { user, logout, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('timbratrice');
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState(null);
  
  // Dati simulati per l'integrazione con Spring Boot
  const [turni] = useState([
    { id: 1, data: '2026-09-02', inizio: '09:00', fine: '17:00', ruolo: 'Backend Dev' },
    { id: 2, data: '2026-09-03', inizio: '10:00', fine: '18:00', ruolo: 'Backend Dev' }
  ]);

  const [reportOre] = useState({
    oreTotali: 160,
    oreLavorate: 124,
    straordinari: 8,
    dipendentiAttivi: 12
  });

  const handleClockToggle = () => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (!isClockedIn) {
      setIsClockedIn(true);
      setClockInTime(now);
      // TODO: fetch('/api/presenze/clock-in', { method: 'POST', ... })
    } else {
      setIsClockedIn(false);
      setClockInTime(null);
      // TODO: fetch('/api/presenze/clock-out', { method: 'POST', ... })
    }
  };

  return (
    <div style={styles.container}>
      {/* Sidebar Navigazione */}
      <aside style={styles.sidebar}>
        <h2 style={styles.logo}>WorkShift Manager</h2>
        {user && (
          <div style={styles.userInfo}>
            <p style={styles.userName}>{user.nome} {user.cognome}</p>
            <p style={styles.userRole}>{isAdmin ? 'Amministratore' : 'Dipendente'}</p>
          </div>
        )}
        <nav style={styles.nav}>
          <button 
            style={activeTab === 'timbratrice' ? styles.activeNavBtn : styles.navBtn} 
            onClick={() => setActiveTab('timbratrice')}>
            🕒 Timbratrice
          </button>
          <button 
            style={activeTab === 'turni' ? styles.activeNavBtn : styles.navBtn} 
            onClick={() => setActiveTab('turni')}>
            📅 Miei Turni
          </button>
          <button 
            style={activeTab === 'report' ? styles.activeNavBtn : styles.navBtn} 
            onClick={() => setActiveTab('report')}>
            📊 Conteggio Ore
          </button>
        </nav>
        <button onClick={logout} style={styles.logoutBtn}>Esci</button>
      </aside>

      {/* Contenuto Principale */}
      <main style={styles.content}>
        {activeTab === 'timbratrice' && (
          <section style={styles.card}>
            <h3>Timbratrice Digitale Dipendente</h3>
            <p>Stato attuale: <strong>{isClockedIn ? 'In Servizio' : 'Fuori Servizio'}</strong></p>
            {isClockedIn && <p>Ingresso registrato alle: {clockInTime}</p>}
            <button 
              onClick={handleClockToggle} 
              style={isClockedIn ? styles.clockOutBtn : styles.clockInBtn}>
              {isClockedIn ? 'Registra Uscita (Clock-Out)' : 'Registra Ingresso (Clock-In)'}
            </button>
          </section>
        )}

        {activeTab === 'turni' && (
          <section style={styles.card}>
            <h3>Pianificazione Turni Assegnati</h3>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Inizio</th>
                  <th>Fine</th>
                  <th>Ruolo</th>
                </tr>
              </thead>
              <tbody>
                {turni.map((turno) => (
                  <tr key={turno.id}>
                    <td>{turno.data}</td>
                    <td>{turno.inizio}</td>
                    <td>{turno.fine}</td>
                    <td>{turno.ruolo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {activeTab === 'report' && (
          <section style={styles.card}>
            <h3>Calcolo e Prospetto Ore (Automatizzato)</h3>
            <div style={styles.metricsGrid}>
              <div style={styles.metricCard}>
                <h4>Ore Lavorate</h4>
                <p style={styles.metricVal}>{reportOre.oreLavorate}h</p>
              </div>
              <div style={styles.metricCard}>
                <h4>Straordinari</h4>
                <p style={styles.metricVal}>{reportOre.straordinari}h</p>
              </div>
              <div style={styles.metricCard}>
                <h4>Target Mensile</h4>
                <p style={styles.metricVal}>{reportOre.oreTotali}h</p>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

const styles = {
  container: { display: 'flex', minHeight: '100vh', fontFamily: 'Segoe UI, sans-serif', backgroundColor: '#f4f6f8' },
  sidebar: { width: '240px', backgroundColor: '#1e293b', color: '#fff', padding: '20px' },
  logo: { fontSize: '1.2rem', marginBottom: '30px' },
  nav: { display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 },
  userInfo: { marginBottom: '20px', padding: '12px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' },
  userName: { margin: 0, fontWeight: '600', fontSize: '0.95rem' },
  userRole: { margin: '4px 0 0 0', fontSize: '0.8rem', color: '#94a3b8' },
  logoutBtn: { padding: '12px', border: 'none', backgroundColor: 'rgba(255,255,255,0.1)', color: '#f87171', textAlign: 'left', cursor: 'pointer', borderRadius: '6px', fontSize: '0.9rem', marginTop: 'auto' },
  navBtn: { padding: '12px', border: 'none', background: 'transparent', color: '#94a3b8', textAlign: 'left', cursor: 'pointer', borderRadius: '6px' },
  activeNavBtn: { padding: '12px', border: 'none', backgroundColor: '#2563eb', color: '#fff', textAlign: 'left', cursor: 'pointer', borderRadius: '6px' },
  content: { flex: 1, padding: '40px' },
  card: { backgroundColor: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
  clockInBtn: { padding: '12px 24px', backgroundColor: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '1rem' },
  clockOutBtn: { padding: '12px 24px', backgroundColor: '#dc2626', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '1rem' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '15px' },
  metricsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginTop: '20px' },
  metricCard: { padding: '16px', backgroundColor: '#f8fafc', borderRadius: '6px', textAlign: 'center', border: '1px solid #e2e8f0' },
  metricVal: { fontSize: '1.8rem', fontWeight: 'bold', color: '#2563eb', margin: '10px 0 0 0' }
};