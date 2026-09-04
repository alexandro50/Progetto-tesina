import { useState, useEffect } from 'react';
import { useAuth } from './context/useAuth';
import api from './services/api';
import Pagamenti from './pages/Pagamenti';

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
}

export default function ShiftManagerApp() {
  const { user, logout, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState(null);
  const [clockOutTime, setClockOutTime] = useState(null);
  const [timbrMsg, setTimbrMsg] = useState('');
  const [timbrLoading, setTimbrLoading] = useState(false);
  const [turni, setTurni] = useState([]);
  const [mieiTurni, setMieiTurni] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formMsg, setFormMsg] = useState('');

  const ricaricaDati = async () => {
    try {
      const [tutti, miei] = await Promise.all([
        api.get('/api/turni'),
        user?.id ? api.get(`/api/turni/utente/${user.id}`) : Promise.resolve({ data: [] }),
      ]);
      setTurni(tutti.data);
      setMieiTurni(miei.data);
    } catch {
      setError('Impossibile caricare i turni dal server.');
    }
  };

  useEffect(() => {
    let canceller = false;

    const carica = async () => {
      if (canceller) return;
      setLoading(true);
      setError('');
      try {
        if (activeTab === 'dashboard') {
          const response = await api.get('/api/turni');
          if (!canceller) setTurni(response.data);
        } else if (activeTab === 'turni' && user?.id) {
          const response = await api.get(`/api/turni/utente/${user.id}`);
          if (!canceller) setMieiTurni(response.data);
        }
      } catch {
        if (!canceller) {
          if (activeTab === 'dashboard') setError('Impossibile caricare i turni dal server.');
          if (activeTab === 'turni') setMieiTurni([]);
        }
      } finally {
        if (!canceller) setLoading(false);
      }
    };

    carica();

    return () => {
      canceller = true;
    };
  }, [activeTab, user?.id]);

  const timbraInizio = async () => {
    setTimbrLoading(true);
    setTimbrMsg('');
    try {
      const res = await api.post('/api/turni/timbratura/inizio');
      setIsClockedIn(true);
      setClockInTime(res.data.inizioOrario);
      setClockOutTime(null);
      setTimbrMsg(`Ingresso registrato alle ${formatTime(res.data.inizioOrario)}.`);
      await ricaricaDati();
    } catch (e) {
      const msg = e.response?.data || 'Errore durante la registrazione dell\'ingresso.';
      setTimbrMsg(typeof msg === 'string' ? msg : 'Errore durante la registrazione dell\'ingresso.');
    } finally {
      setTimbrLoading(false);
    }
  };

  const timbraFine = async () => {
    setTimbrLoading(true);
    setTimbrMsg('');
    try {
      const res = await api.post('/api/turni/timbratura/fine');
      setIsClockedIn(false);
      setClockOutTime(res.data.fineOrario);
      setTimbrMsg(`Uscita registrata alle ${formatTime(res.data.fineOrario)}. Turno salvato.`);
      await ricaricaDati();
    } catch (e) {
      const msg = e.response?.data || 'Errore durante la registrazione dell\'uscita.';
      setTimbrMsg(typeof msg === 'string' ? msg : 'Errore durante la registrazione dell\'uscita.');
    } finally {
      setTimbrLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab !== 'timbratrice') return;
    let canceller = false;
    const carica = async () => {
      setTimbrLoading(true);
      setTimbrMsg('');
      try {
        const res = await api.get('/api/turni/timbratura/stato');
        if (!canceller) {
          if (res.data) {
            setIsClockedIn(true);
            setClockInTime(res.data.inizioOrario);
            setClockOutTime(null);
          } else {
            setIsClockedIn(false);
            setClockInTime(null);
            setClockOutTime(null);
          }
        }
      } catch {
        if (!canceller) setTimbrMsg('Impossibile verificare lo stato della timbratura.');
      } finally {
        if (!canceller) setTimbrLoading(false);
      }
    };
    carica();
    return () => { canceller = true; };
  }, [activeTab]);

  const aggiungiTurno = async (dati) => {
    setFormMsg('');
    setError('');
    try {
      await api.post('/api/turni/miei', {
        utenteId: user.id,
        inizioOrario: dati.inizio,
        fineOrario: dati.fine,
        note: dati.note || '',
      });
      await ricaricaDati();
      setFormMsg('Turno aggiunto con successo.');
      return true;
    } catch (e) {
      const msg = e.response?.data || 'Errore durante la creazione del turno.';
      setFormMsg(typeof msg === 'string' ? msg : 'Errore durante la creazione del turno.');
      return false;
    }
  };

  const eliminaTurno = async (turnoId) => {
    if (!window.confirm('Vuoi eliminare questo turno?')) return;
    setError('');
    try {
      await api.delete(`/api/turni/miei/${turnoId}`);
      await ricaricaDati();
    } catch (e) {
      const msg = e.response?.data || 'Errore durante l\'eliminazione del turno.';
      setError(typeof msg === 'string' ? msg : 'Errore durante l\'eliminazione del turno.');
    }
  };

  const totali = {
    dipendenti: new Set(turni.map((t) => t.utenteId)).size,
    turni: turni.length,
  };

  return (
    <div style={styles.container}>
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
            style={activeTab === 'dashboard' ? styles.activeNavBtn : styles.navBtn}
            onClick={() => setActiveTab('dashboard')}>
            📊 Dashboard
          </button>
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
          {isAdmin && (
            <button
              style={activeTab === 'pagamenti' ? styles.activeNavBtn : styles.navBtn}
              onClick={() => setActiveTab('pagamenti')}>
              💶 Pagamenti
            </button>
          )}
        </nav>
        <button onClick={logout} style={styles.logoutBtn}>Esci</button>
      </aside>

      <main style={styles.content}>
        {loading && <div style={styles.loading}>Caricamento...</div>}

        {activeTab === 'dashboard' && (
          <section style={styles.card}>
            <h3 style={styles.cardTitle}>Turni dei Lavoratori</h3>
            {error && <div style={styles.error}>{error}</div>}
            <div style={styles.metricsGrid}>
              <div style={styles.metricCard}>
                <h4>Dipendenti con turno</h4>
                <p style={styles.metricVal}>{totali.dipendenti}</p>
              </div>
              <div style={styles.metricCard}>
                <h4>Turni pianificati</h4>
                <p style={styles.metricVal}>{totali.turni}</p>
              </div>
            </div>
            <DashboardTable turni={turni} />
          </section>
        )}

        {activeTab === 'timbratrice' && (
          <section style={styles.card}>
            <h3 style={styles.cardTitle}>Timbratrice Digitale Dipendente</h3>
            {timbrLoading && <p style={styles.timbrLoading}>Caricamento...</p>}
            <p>Stato attuale: <strong style={isClockedIn ? styles.inService : styles.outService}>{isClockedIn ? 'In Servizio' : 'Fuori Servizio'}</strong></p>
            {isClockedIn && clockInTime && (
              <p>🕒 Ingresso registrato alle: <strong>{formatTime(clockInTime)}</strong></p>
            )}
            {!isClockedIn && clockOutTime && (
              <p>🏁 Ultima uscita registrata alle: <strong>{formatTime(clockOutTime)}</strong></p>
            )}
            {timbrMsg && (
              <div style={timbrMsg.toLowerCase().includes('errore') ? styles.errorBox : styles.success}>
                {timbrMsg}
              </div>
            )}
            <div style={styles.timbrBtnRow}>
              {isClockedIn ? (
                <button
                  onClick={timbraFine}
                  disabled={timbrLoading}
                  style={timbrLoading ? { ...styles.clockOutBtn, opacity: 0.6, cursor: 'not-allowed' } : styles.clockOutBtn}>
                  Registra Uscita (Clock-Out)
                </button>
              ) : (
                <button
                  onClick={timbraInizio}
                  disabled={timbrLoading}
                  style={timbrLoading ? { ...styles.clockInBtn, opacity: 0.6, cursor: 'not-allowed' } : styles.clockInBtn}>
                  Registra Ingresso (Clock-In)
                </button>
              )}
            </div>
          </section>
        )}

        {activeTab === 'turni' && (
          <section style={styles.card}>
            <h3 style={styles.cardTitle}>Gestione dei Miei Turni</h3>
            <p style={styles.subtext}>Inserisci gli orari del tuo turno per <strong>{user?.nome} {user?.cognome}</strong></p>
            <TurnoForm onSubmit={aggiungiTurno} formMsg={formMsg} setFormMsg={setFormMsg} />
            {error && <div style={styles.error}>{error}</div>}
            <h4 style={styles.sectionTitle}>I Miei Turni</h4>
            <MieiTurniTable turni={mieiTurni} onDelete={eliminaTurno} />
          </section>
        )}

        {activeTab === 'pagamenti' && isAdmin && (
          <section style={styles.card}>
            <Pagamenti />
          </section>
        )}
      </main>
    </div>
  );
}

function TurnoForm({ onSubmit, formMsg, setFormMsg }) {
  const [data, setData] = useState('');
  const [entrata, setEntrata] = useState('');
  const [uscita, setUscita] = useState('');
  const [note, setNote] = useState('');
  const [inviando, setInviando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data || !entrata || !uscita) {
      setFormMsg('Compila data, ora di entrata e ora di uscita.');
      return;
    }
    const inizio = `${data}T${entrata}:00`;
    const fine = `${data}T${uscita}:00`;
    setInviando(true);
    const ok = await onSubmit({ inizio, fine, note });
    setInviando(false);
    if (ok) {
      setData('');
      setEntrata('');
      setUscita('');
      setNote('');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      {formMsg && (
        <div style={formMsg.toLowerCase().includes('successo') ? styles.success : styles.errorBox}>
          {formMsg}
        </div>
      )}
      <div style={styles.formRow}>
        <div style={styles.field}>
          <label style={styles.label}>Data</label>
          <input type="date" value={data} onChange={(e) => setData(e.target.value)} required style={styles.input} />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Ora Entrata</label>
          <input type="time" value={entrata} onChange={(e) => setEntrata(e.target.value)} required style={styles.input} />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>Ora Uscita</label>
          <input type="time" value={uscita} onChange={(e) => setUscita(e.target.value)} required style={styles.input} />
        </div>
      </div>
      <div style={styles.field}>
        <label style={styles.label}>Note (opzionale)</label>
        <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Es. turno mattina" style={styles.input} />
      </div>
      <button type="submit" disabled={inviando} style={inviando ? { ...styles.addBtn, ...styles.buttonDisabled } : styles.addBtn}>
        {inviando ? 'Salvataggio...' : 'Aggiungi Turno'}
      </button>
    </form>
  );
}

function DashboardTable({ turni }) {
  if (turni.length === 0) {
    return <p style={styles.empty}>Nessun turno pianificato.</p>;
  }
  return (
    <table style={styles.table}>
      <thead>
        <tr>
          <th>Nome</th>
          <th>Cognome</th>
          <th>Email</th>
          <th>Data</th>
          <th>Entrata</th>
          <th>Uscita</th>
          <th>Note</th>
        </tr>
      </thead>
      <tbody>
        {turni.map((turno) => (
          <tr key={turno.id}>
            <td>{turno.nome}</td>
            <td>{turno.cognome}</td>
            <td>{turno.email}</td>
            <td>{formatDate(turno.inizioOrario)}</td>
            <td>{formatTime(turno.inizioOrario)}</td>
            <td>{formatTime(turno.fineOrario)}</td>
            <td>{turno.note || '-'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function MieiTurniTable({ turni, onDelete }) {
  if (turni.length === 0) {
    return <p style={styles.empty}>Non hai turni assegnati.</p>;
  }
  return (
    <table style={styles.table}>
      <thead>
        <tr>
          <th>Data</th>
          <th>Entrata</th>
          <th>Uscita</th>
          <th>Note</th>
          <th>Azioni</th>
        </tr>
      </thead>
      <tbody>
        {turni.map((turno) => (
          <tr key={turno.id}>
            <td>{formatDate(turno.inizioOrario)}</td>
            <td>{formatTime(turno.inizioOrario)}</td>
            <td>{formatTime(turno.fineOrario)}</td>
            <td>{turno.note || '-'}</td>
            <td>
              <button onClick={() => onDelete(turno.id)} style={styles.deleteBtn}>Elimina</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const styles = {
  container: { display: 'flex', minHeight: '100vh', fontFamily: 'Segoe UI, sans-serif', backgroundColor: '#f4f6f8' },
  sidebar: { width: '240px', backgroundColor: '#1e293b', color: '#fff', padding: '20px', display: 'flex', flexDirection: 'column' },
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
  cardTitle: { marginTop: 0, color: '#1e293b' },
  subtext: { color: '#64748b', marginTop: 0 },
  sectionTitle: { marginTop: '28px', color: '#1e293b' },
  empty: { color: '#94a3b8', fontStyle: 'italic' },
  loading: { textAlign: 'center', padding: '20px', color: '#64748b' },
  error: { backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', fontSize: '0.9rem', marginBottom: '15px' },
  errorBox: { backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', fontSize: '0.9rem', marginBottom: '15px' },
  success: { backgroundColor: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '10px 14px', fontSize: '0.9rem', marginBottom: '15px' },
  form: { display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px', padding: '18px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' },
  formRow: { display: 'flex', gap: '14px', flexWrap: 'wrap' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, minWidth: '140px' },
  label: { fontSize: '0.85rem', fontWeight: '600', color: '#334155' },
  input: { padding: '9px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.95rem', outline: 'none' },
  addBtn: { padding: '11px 20px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer', alignSelf: 'flex-start' },
  buttonDisabled: { backgroundColor: '#93c5fd', cursor: 'not-allowed' },
  deleteBtn: { padding: '6px 12px', backgroundColor: '#dc2626', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.85rem', cursor: 'pointer' },
  clockInBtn: { padding: '12px 24px', backgroundColor: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '1rem' },
  clockOutBtn: { padding: '12px 24px', backgroundColor: '#dc2626', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '1rem' },
  timbrLoading: { color: '#64748b', fontStyle: 'italic' },
  inService: { color: '#16a34a' },
  outService: { color: '#dc2626' },
  timbrBtnRow: { marginTop: '20px' },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: '15px' },
  metricsGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '24px' },
  metricCard: { padding: '16px', backgroundColor: '#f8fafc', borderRadius: '6px', textAlign: 'center', border: '1px solid #e2e8f0' },
  metricVal: { fontSize: '1.8rem', fontWeight: 'bold', color: '#2563eb', margin: '10px 0 0 0' }
};
