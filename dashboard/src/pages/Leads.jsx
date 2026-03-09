import { useState, useEffect } from 'react';
import { useIsMobile } from '../hooks/useIsMobile';

// ── Inject styles ──────────────────────────────────────────
function useLeadsStyles() {
  useEffect(() => {
    if (document.getElementById('leads-styles')) return;
    const el = document.createElement('style');
    el.id = 'leads-styles';
    el.textContent = `
      @keyframes leadsFadeIn { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
      .leads-row { transition: background-color 0.15s; }
      .leads-row:hover { background-color: rgba(255,255,255,0.04) !important; }
      .leads-export-btn:hover { background-color: rgba(200,241,53,0.18) !important; border-color: rgba(200,241,53,0.5) !important; }
      .leads-save-btn:hover { box-shadow: 0 0 20px rgba(200,241,53,0.4) !important; transform: translateY(-1px) !important; }
      .leads-back-btn:hover { color: #C8F135 !important; }
      .leads-detail { animation: leadsFadeIn 0.2s ease both; }
      .leads-textarea::placeholder { color: #2E2E42; }
      .leads-textarea:focus { outline: none; }
      .leads-select:focus { outline: none; }
    `;
    document.head.appendChild(el);
  }, []);
}

// ── Status config ──────────────────────────────────────────
const STATUSES = [
  { value: 'new',         label: 'New',         color: '#F59E0B', bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.3)'  },
  { value: 'in_progress', label: 'In Progress',  color: '#818CF8', bg: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.3)'  },
  { value: 'converted',   label: 'Converted',    color: '#10B981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)'  },
  { value: 'lost',        label: 'Lost',         color: '#F87171', bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.28)'  },
  { value: 'closed',      label: 'Closed',       color: '#55556A', bg: 'rgba(255,255,255,0.06)',border: 'rgba(255,255,255,0.1)' },
];

const getStatus  = (v) => STATUSES.find((s) => s.value === v) || STATUSES[0];
const formatDate = (ts) => ts ? new Date(ts).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

// ── Avatar color pool ──────────────────────────────────────
const AVATAR_COLORS = [
  { bg: 'rgba(99,102,241,0.2)',  color: '#818CF8' },
  { bg: 'rgba(200,241,53,0.15)', color: '#C8F135' },
  { bg: 'rgba(139,92,246,0.2)',  color: '#A78BFA' },
  { bg: 'rgba(16,185,129,0.15)', color: '#10B981' },
  { bg: 'rgba(245,158,11,0.15)', color: '#F59E0B' },
];
const avatarColor = (name) => AVATAR_COLORS[(name?.charCodeAt(0) || 0) % AVATAR_COLORS.length];

// ── Main component ─────────────────────────────────────────
export default function Leads({ installId, token }) {
  const isMobile = useIsMobile();
  useLeadsStyles();

  const [leads,        setLeads]        = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [selectedLead, setSelectedLead] = useState(null);
  const [saving,       setSaving]       = useState(false);
  const [editStatus,   setEditStatus]   = useState('');
  const [editNotes,    setEditNotes]    = useState('');
  const [saveSuccess,  setSaveSuccess]  = useState(false);

  useEffect(() => { fetchLeads(); }, [installId]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${import.meta.env.VITE_API_URL}/api/leads`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setLeads(data);
    } catch (err) { console.error('Failed to fetch leads:', err); }
    finally { setLoading(false); }
  };

  const handleSelectLead = (lead) => {
    setSelectedLead(lead);
    setEditStatus(lead.status || 'new');
    setEditNotes(lead.notes || '');
    setSaveSuccess(false);
  };

  const handleSaveLead = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/leads/${selectedLead.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: editStatus, notes: editNotes }),
      });
      if (res.ok) {
        setLeads(prev => prev.map(l => l.id === selectedLead.id ? { ...l, status: editStatus, notes: editNotes } : l));
        setSelectedLead({ ...selectedLead, status: editStatus, notes: editNotes });
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
      }
    } catch (err) { console.error('Failed to save lead:', err); }
    finally { setSaving(false); }
  };

  const exportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Company', 'Services', 'Custom Answer', 'Status', 'Notes', 'Submitted'];
    const rows    = leads.map(l => [
      l.name || '', l.email || '', l.phone || '', l.company || '',
      l.services || '', l.custom || '', getStatus(l.status).label,
      l.notes || '', formatDate(l.timestamp),
    ]);
    const csv  = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = `leads_${new Date().toISOString().split('T')[0]}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  // ── Detail panel ───────────────────────────────────────
  const renderDetail = () => {
    const av  = avatarColor(selectedLead.name);
    const st  = getStatus(selectedLead.status);

    return (
      <div className="leads-detail" style={{
        ...s.detail,
        width:    isMobile ? '100%' : '300px',
        minWidth: isMobile ? 'unset' : '300px',
        position: isMobile ? 'absolute' : 'relative',
        inset:    isMobile ? 0 : 'auto',
        zIndex:   isMobile ? 10 : 'auto',
      }}>
        {/* Header */}
        <div style={s.detailHead}>
          {isMobile && (
            <button className="leads-back-btn" style={s.backBtn} onClick={() => setSelectedLead(null)}>← Back</button>
          )}
          {!isMobile && (
            <button style={s.closeBtn} onClick={() => setSelectedLead(null)}>✕</button>
          )}

          <div style={{ ...s.detailAv, backgroundColor: av.bg, color: av.color }}>
            {selectedLead.name?.charAt(0)?.toUpperCase() || 'V'}
          </div>
          <h3 style={s.detailName}>{selectedLead.name || 'Visitor'}</h3>
          <span style={{ ...s.badge, backgroundColor: st.bg, color: st.color, border: `1px solid ${st.border}` }}>
            {st.label}
          </span>
        </div>

        {/* Info rows */}
        <div style={s.detailBody}>
          {[
            { label: 'Email',     value: selectedLead.email },
            { label: 'Phone',     value: selectedLead.phone },
            { label: 'Company',   value: selectedLead.company },
            { label: 'Services',  value: selectedLead.services },
            { label: 'Answer',    value: selectedLead.custom },
            { label: 'Submitted', value: formatDate(selectedLead.timestamp) },
          ].filter(r => r.value).map(({ label, value }) => (
            <div key={label} style={s.infoRow}>
              <span style={s.infoLabel}>{label}</span>
              <span style={s.infoValue}>{value}</span>
            </div>
          ))}

          <div style={s.divider} />

          {/* Status select */}
          <div style={s.field}>
            <label style={s.fieldLabel}>Status</label>
            <select className="leads-select" style={s.select} value={editStatus}
              onChange={e => setEditStatus(e.target.value)}>
              {STATUSES.map(st => <option key={st.value} value={st.value}>{st.label}</option>)}
            </select>
          </div>

          {/* Notes */}
          <div style={s.field}>
            <label style={s.fieldLabel}>Notes</label>
            <textarea className="leads-textarea" style={s.textarea} rows={4}
              value={editNotes} onChange={e => setEditNotes(e.target.value)}
              placeholder="Add notes about this lead..." />
          </div>

          <button className="leads-save-btn"
            style={{ ...s.saveBtn, opacity: saving ? 0.75 : 1,
              backgroundColor: saveSuccess ? 'rgba(16,185,129,0.15)' : '#C8F135',
              color: saveSuccess ? '#10B981' : '#080810',
              border: saveSuccess ? '1px solid rgba(16,185,129,0.35)' : 'none',
              boxShadow: saveSuccess ? 'none' : '0 0 14px rgba(200,241,53,0.2)',
            }}
            onClick={handleSaveLead} disabled={saving}>
            {saving ? 'Saving...' : saveSuccess ? '✅ Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>
    );
  };

  // ── Table ──────────────────────────────────────────────
  const renderTable = () => (
    <div style={s.tableWrap}>

      {/* Toolbar */}
      <div style={s.toolbar}>
        <div>
          <p style={s.toolbarTitle}>Leads</p>
          <p style={s.toolbarSub}>{leads.length} total · click a row to view details</p>
        </div>
        <button className="leads-export-btn" style={s.exportBtn} onClick={exportCSV}>
          ↓ Export CSV
        </button>
      </div>

      {/* Status chips */}
      <div style={s.chips}>
        {STATUSES.map(st => {
          const count = leads.filter(l => (l.status || 'new') === st.value).length;
          return (
            <div key={st.value} style={{
              ...s.chip,
              backgroundColor: st.bg, color: st.color,
              border: `1px solid ${st.border}`,
            }}>
              {st.label} <span style={{ fontWeight: '800', marginLeft: '4px' }}>{count}</span>
            </div>
          );
        })}
      </div>

      {/* Table */}
      {loading ? (
        <div style={s.empty}>
          <div style={s.emptyIcon}>⏳</div>
          <p style={s.emptyTitle}>Loading leads...</p>
        </div>
      ) : leads.length === 0 ? (
        <div style={s.empty}>
          <div style={s.emptyIcon}>📋</div>
          <p style={s.emptyTitle}>No leads yet</p>
          <p style={s.emptySub}>Leads captured from your widget will appear here.</p>
        </div>
      ) : (
        <div style={s.scrollArea}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Name</th>
                {!isMobile && <th style={s.th}>Email</th>}
                {!isMobile && <th style={s.th}>Phone</th>}
                {!isMobile && <th style={s.th}>Services</th>}
                <th style={s.th}>Status</th>
                {!isMobile && <th style={s.th}>Date</th>}
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => {
                const st         = getStatus(lead.status);
                const av         = avatarColor(lead.name);
                const isSelected = selectedLead?.id === lead.id;
                return (
                  <tr key={lead.id} className="leads-row"
                    style={{
                      ...s.tr,
                      backgroundColor: isSelected ? 'rgba(200,241,53,0.06)' : 'transparent',
                      borderLeft: isSelected ? '2px solid rgba(200,241,53,0.5)' : '2px solid transparent',
                    }}
                    onClick={() => handleSelectLead(lead)}>

                    <td style={s.td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ ...s.av, backgroundColor: av.bg, color: av.color }}>
                          {lead.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <span style={s.nameText}>{lead.name || '—'}</span>
                      </div>
                    </td>

                    {!isMobile && <td style={s.td}><span style={s.cellMuted}>{lead.email || '—'}</span></td>}
                    {!isMobile && <td style={s.td}><span style={s.cellMuted}>{lead.phone || '—'}</span></td>}
                    {!isMobile && (
                      <td style={s.td}>
                        <span style={{ ...s.cellMuted, maxWidth: '130px', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {lead.services || '—'}
                        </span>
                      </td>
                    )}

                    <td style={s.td}>
                      <span style={{ ...s.badge, backgroundColor: st.bg, color: st.color, border: `1px solid ${st.border}` }}>
                        {st.label}
                      </span>
                    </td>

                    {!isMobile && <td style={{ ...s.td }}><span style={s.cellMuted}>{formatDate(lead.timestamp)}</span></td>}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <div style={{ ...s.root, position: 'relative' }}>
      {isMobile ? (
        selectedLead ? renderDetail() : renderTable()
      ) : (
        <>
          {renderTable()}
          {selectedLead && renderDetail()}
        </>
      )}
    </div>
  );
}

// ── Styles ─────────────────────────────────────────────────
const s = {
  root: {
    flex: 1, display: 'flex', overflow: 'hidden',
    backgroundColor: 'transparent',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  tableWrap: {
    flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden',
  },

  // Toolbar
  toolbar: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '20px 24px 14px',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
    flexShrink: 0,
  },
  toolbarTitle: {
    fontFamily: "'Bricolage Grotesque', sans-serif",
    fontSize: '20px', fontWeight: '800', color: '#EDEAF5', margin: 0, letterSpacing: '-0.02em',
  },
  toolbarSub: { fontSize: '12px', color: '#3A3A52', margin: '3px 0 0 0' },
  exportBtn: {
    padding: '9px 18px',
    backgroundColor: 'rgba(200,241,53,0.08)',
    color: '#C8F135',
    border: '1px solid rgba(200,241,53,0.25)',
    borderRadius: '8px', fontSize: '13px', fontWeight: '700',
    cursor: 'pointer', transition: 'all 0.2s',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },

  // Status chips
  chips: {
    display: 'flex', gap: '8px', padding: '12px 24px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    flexWrap: 'wrap', flexShrink: 0,
  },
  chip: {
    fontSize: '11px', fontWeight: '600', padding: '4px 10px',
    borderRadius: '20px', display: 'flex', alignItems: 'center',
  },

  // Table
  scrollArea: { flex: 1, overflowY: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    padding: '11px 16px', fontSize: '10px', fontWeight: '700',
    color: '#3A3A52', textAlign: 'left',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
    textTransform: 'uppercase', letterSpacing: '0.08em',
    backgroundColor: 'rgba(255,255,255,0.02)',
    position: 'sticky', top: 0, zIndex: 1,
  },
  tr: {
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    cursor: 'pointer', transition: 'all 0.15s',
  },
  td: {
    padding: '12px 16px', fontSize: '13px',
    color: '#AAAABC', verticalAlign: 'middle',
  },
  av: {
    width: '30px', height: '30px', minWidth: '30px', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '12px', fontWeight: '700',
  },
  nameText: { fontWeight: '600', color: '#EDEAF5', fontSize: '13px' },
  cellMuted: { color: '#55556A', fontSize: '12px' },
  badge: {
    fontSize: '10px', fontWeight: '700', padding: '3px 9px',
    borderRadius: '20px', whiteSpace: 'nowrap', letterSpacing: '0.03em',
  },

  // Empty state
  empty: {
    padding: '80px 24px', textAlign: 'center',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
  },
  emptyIcon: {
    fontSize: '32px', width: '64px', height: '64px',
    backgroundColor: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  emptyTitle: { fontSize: '15px', fontWeight: '700', color: '#AAAABC', margin: 0 },
  emptySub:   { fontSize: '13px', color: '#3A3A52', margin: 0, lineHeight: '1.6' },

  // Detail panel
  detail: {
    backgroundColor: '#0F0F1A',
    borderLeft: '1px solid rgba(255,255,255,0.08)',
    display: 'flex', flexDirection: 'column', overflowY: 'auto',
  },
  detailHead: {
    padding: '24px 16px 20px',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
    position: 'relative',
  },
  detailAv: {
    width: '56px', height: '56px', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '22px', fontWeight: '800',
  },
  detailName: {
    fontFamily: "'Bricolage Grotesque', sans-serif",
    fontSize: '16px', fontWeight: '800', color: '#EDEAF5', margin: 0,
  },
  detailBody: {
    padding: '16px', display: 'flex', flexDirection: 'column', gap: '2px', flex: 1,
  },
  infoRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', gap: '8px',
  },
  infoLabel: { fontSize: '11px', color: '#3A3A52', flexShrink: 0, textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '600' },
  infoValue: { fontSize: '13px', fontWeight: '600', color: '#EDEAF5', textAlign: 'right', wordBreak: 'break-word' },
  divider:   { borderTop: '1px solid rgba(255,255,255,0.06)', margin: '12px 0 8px' },
  field:     { marginTop: '12px' },
  fieldLabel: {
    display: 'block', fontSize: '11px', fontWeight: '600', color: '#55556A',
    marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em',
  },
  select: {
    width: '100%', padding: '11px 14px',
    backgroundColor: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px', fontSize: '14px', color: '#EDEAF5',
    cursor: 'pointer', boxSizing: 'border-box',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    transition: 'border-color 0.2s',
  },
  textarea: {
    width: '100%', padding: '11px 14px',
    backgroundColor: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '10px', fontSize: '13px', color: '#EDEAF5',
    boxSizing: 'border-box', resize: 'vertical',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    lineHeight: '1.6',
    transition: 'border-color 0.2s',
  },
  saveBtn: {
    width: '100%', padding: '12px',
    border: 'none', borderRadius: '10px',
    fontSize: '14px', fontWeight: '700', cursor: 'pointer', marginTop: '14px',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    transition: 'all 0.2s',
  },
  backBtn: {
    background: 'none', border: 'none', color: '#818CF8',
    fontSize: '14px', fontWeight: '600', cursor: 'pointer',
    alignSelf: 'flex-start', padding: '0 0 8px 0',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    transition: 'color 0.2s',
  },
  closeBtn: {
    position: 'absolute', top: '12px', right: '12px',
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
    color: '#55556A', cursor: 'pointer',
    width: '28px', height: '28px', borderRadius: '8px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '13px', lineHeight: 1, transition: 'all 0.15s',
  },
};