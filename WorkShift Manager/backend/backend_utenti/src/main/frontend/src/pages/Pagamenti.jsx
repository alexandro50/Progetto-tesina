import { useState, useEffect } from 'react';
import api from '../services/api';

export default function Pagamenti() {
  const [dipendenti, setDipendenti] = useState([]);
  const [selezionatoId, setSelezionatoId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    let canceller = false;
    const carica = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/api/pagamenti/dipendenti');
        if (!canceller) {
          setDipendenti(res.data);
          if (selezionatoId && !res.data.some((d) => d.id === selezionatoId)) {
            setSelezionatoId(null);
          }
        }
      } catch {
        if (!canceller) setError('Impossibile caricare i dipendenti.');
      } finally {
        if (!canceller) setLoading(false);
      }
    };
    carica();
    return () => { canceller = true; };
  }, []);

  const selezionato = dipendenti.find((d) => d.id === selezionatoId) || null;

  const aggiornaTariffa = async (dipendente, nuovaTariffa) => {
    setSaving(true);
    setMsg('');
    try {
      const res = await api.put(`/api/pagamenti/dipendenti/${dipendente.id}/tariffa`, {
        tariffaOraria: nuovaTariffa,
      });
      setDipendenti((prev) => prev.map((d) => (d.id === dipendente.id ? res.data : d)));
      setMsg(`Tariffa di ${res.data.nome} ${res.data.cognome} aggiornata a ${formatEuro(res.data.tariffaOraria)}/ora.`);
    } catch (e) {
      const m = e.response?.data || 'Errore durante il salvataggio della tariffa.';
      setMsg(typeof m === 'string' ? m : 'Errore durante il salvataggio della tariffa.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h3 style={styles.title}>Gestione Pagamenti</h3>
      <p style={styles.subtitle}>Seleziona un dipendente per visualizzare le ore lavorate e impostare la tariffa oraria.</p>

      {error && <div style={styles.errorBox}>{error}</div>}
      {msg && <div style={styles.infoBox}>{msg}</div>}

      {loading && <div style={styles.loading}>Caricamento...</div>}

      <div style={styles.layout}>
        <div style={styles.listPanel}>
          <h4 style={styles.panelTitle}>Dipendenti ({dipendenti.length})</h4>
          {dipendenti.length === 0 && !loading && (
            <p style={styles.empty}>Nessun dipendente registrato.</p>
          )}
          {dipendenti.map((d) => (
            <button
              key={d.id}
              onClick={() => { setSelezionatoId(d.id); setMsg(''); }}
              style={d.id === selezionatoId ? styles.listItemActive : styles.listItem}>
              <span style={styles.listName}>{d.nome} {d.cognome}</span>
              <span style={styles.listOre}>{d.oreTotali}h</span>
            </button>
          ))}
        </div>

        <div style={styles.detailPanel}>
          {!selezionato ? (
            <p style={styles.placeholder}>Seleziona un dipendente dalla lista per vedere i dettagli.</p>
          ) : (
            <DettaglioDipendente
              key={selezionato.id}
              dipendente={selezionato}
              saving={saving}
              onSalva={aggiornaTariffa}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function DettaglioDipendente({ dipendente, saving, onSalva }) {
  const [tariffa, setTariffa] = useState(
    dipendente.tariffaOraria != null ? String(dipendente.tariffaOraria) : ''
  );

  const tariffaNum = parseFloat(tariffa.replace(',', '.'));
  const tariffaValida = !isNaN(tariffaNum) && tariffaNum >= 0;
  const importoTotale = tariffaValida ? dipendente.oreTotali * tariffaNum : null;

  return (
    <div>
      <h4 style={styles.panelTitle}>Dettaglio Dipendente</h4>

      <div style={styles.profile}>
        <div style={styles.avatar}>{initials(dipendente.nome, dipendente.cognome)}</div>
        <div>
          <p style={styles.profileName}>{dipendente.nome} {dipendente.cognome}</p>
          <p style={styles.profileMeta}>{dipendente.email}</p>
          <p style={styles.profileMeta}>Ruolo: {dipendente.ruolo === 'RUOLO_ADMIN' ? 'Amministratore' : 'Dipendente'}</p>
        </div>
      </div>

      <div style={styles.summaryGrid}>
        <div style={styles.summaryCard}>
          <h5>Ore Lavorate</h5>
          <p style={styles.summaryVal}>{dipendente.oreTotali}h</p>
        </div>
        <div style={styles.summaryCard}>
          <h5>Tariffa Oraria</h5>
          <p style={styles.summaryVal}>{dipendente.tariffaOraria != null ? formatEuro(dipendente.tariffaOraria) : '—'}</p>
        </div>
      </div>

      <div style={styles.tariffForm}>
        <label style={styles.label}>Tariffa oraria (EUR)</label>
        <div style={styles.tariffRow}>
          <input
            type="number"
            step="0.01"
            min="0"
            value={tariffa}
            onChange={(e) => setTariffa(e.target.value)}
            placeholder="es. 12.50"
            style={styles.input}
          />
          <button
            onClick={() => onSalva(dipendente, tariffaNum)}
            disabled={saving || !tariffaValida}
            style={saving || !tariffaValida ? { ...styles.btn, ...styles.btnDisabled } : styles.btn}>
            {saving ? 'Salvataggio...' : 'Salva Tariffa'}
          </button>
        </div>
      </div>

      <div style={styles.paymentCard}>
        <h5>Importo Totale</h5>
        {importoTotale != null ? (
          <p style={styles.paymentVal}>{formatEuro(importoTotale)}</p>
        ) : (
          <p style={styles.paymentHint}>Inserisci una tariffa per calcolare l'importo.</p>
        )}
        {importoTotale != null && (
          <p style={styles.paymentCalc}>
            {dipendente.oreTotali}h × {formatEuro(tariffaNum)} = <strong>{formatEuro(importoTotale)}</strong>
          </p>
        )}
      </div>
    </div>
  );
}

function initials(nome, cognome) {
  return `${(nome || '?')[0] || '?'}${(cognome || '?')[0] || '?'}`.toUpperCase();
}

function formatEuro(value) {
  return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(value);
}

const styles = {
  title: { margin: '0 0 4px 0', color: '#1e293b' },
  subtitle: { margin: '0 0 18px 0', color: '#64748b' },
  loading: { textAlign: 'center', padding: '20px', color: '#64748b' },
  errorBox: { backgroundColor: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', fontSize: '0.9rem', marginBottom: '15px' },
  infoBox: { backgroundColor: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '10px 14px', fontSize: '0.9rem', marginBottom: '15px' },
  layout: { display: 'flex', gap: '20px', marginTop: '10px' },
  listPanel: { flex: 1, minWidth: '260px', backgroundColor: '#1467ba', borderRadius: '8px', padding: '16px', border: '1px solid #026029', alignSelf: 'flex-start' },
  detailPanel: { flex: 2, backgroundColor: '#fff', borderRadius: '8px', padding: '20px', border: '1px solid #e2e8f0' },
  panelTitle: { margin: '0 0 12px 0', color: '#1e293b' },
  empty: { color: '#94a3b8', fontStyle: 'italic' },
  placeholder: { color: '#94a3b8', fontStyle: 'italic' },
  listItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '12px', border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: '6px', textAlign: 'left', fontSize: '0.95rem' },
  listItemActive: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', padding: '12px', border: 'none', backgroundColor: '#2563eb', color: '#fff', cursor: 'pointer', borderRadius: '6px', textAlign: 'left', fontSize: '0.95rem' },
  listName: { fontWeight: '600' },
  listOre: { color: 'inherit', opacity: 0.8 },
  profile: { display: 'flex', alignItems: 'center', gap: '14px', padding: '14px', backgroundColor: '#f1f5f9', borderRadius: '8px', marginBottom: '16px' },
  avatar: { width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#2563eb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '1.1rem' },
  profileName: { margin: 0, fontWeight: '700', fontSize: '1.1rem', color: '#1e293b' },
  profileMeta: { margin: '3px 0 0 0', color: '#64748b', fontSize: '0.9rem' },
  summaryGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginBottom: '16px' },
  summaryCard: { padding: '14px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center' },
  summaryVal: { fontSize: '1.6rem', fontWeight: 'bold', color: '#2563eb', margin: '8px 0 0 0' },
  tariffForm: { marginBottom: '16px' },
  label: { display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#334155', marginBottom: '6px' },
  tariffRow: { display: 'flex', gap: '10px' },
  input: { padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.95rem', flex: 1, outline: 'none' },
  btn: { padding: '10px 18px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer' },
  btnDisabled: { backgroundColor: '#93c5fd', cursor: 'not-allowed' },
  paymentCard: { padding: '18px', backgroundColor: '#ecfdf5', borderRadius: '8px', border: '1px solid #a7f3d0', textAlign: 'center' },
  paymentVal: { fontSize: '2.2rem', fontWeight: 'bold', color: '#059669', margin: '8px 0 0 0' },
  paymentHint: { color: '#64748b', fontStyle: 'italic', margin: '10px 0 0 0' },
  paymentCalc: { color: '#065f46', margin: '10px 0 0 0', fontSize: '0.95rem' },
};
