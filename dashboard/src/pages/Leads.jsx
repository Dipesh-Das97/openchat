import { useState, useEffect } from 'react';
import { useIsMobile } from '../hooks/useIsMobile';

const STATUSES = [
    { value: 'new', label: 'New', color: '#F59E0B', bg: '#FFF', rowBg: '#FFFFFF' },
    { value: 'in_progress', label: 'In Progress', color: '#3B82F6', bg: '#EFF6FF', rowBg: '#EFF6FF' },
    { value: 'converted', label: 'Converted', color: '#10B981', bg: '#F0FDF4', rowBg: '#F0FDF4' },
    { value: 'lost', label: 'Lost', color: '#EF4444', bg: '#FFF1F2', rowBg: '#FFF1F2' },
    { value: 'closed', label: 'Closed', color: '#6B7280', bg: '#F9FAFB', rowBg: '#F9FAFB' },
];

const getStatus = (value) => STATUSES.find((s) => s.value === value) || STATUSES[0];

const formatDate = (timestamp) => {
    if (!timestamp) return '—';
    return new Date(timestamp).toLocaleDateString([], {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};

export default function Leads({ installId, token }) {
    const isMobile = useIsMobile();
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedLead, setSelectedLead] = useState(null);
    const [saving, setSaving] = useState(false);
    const [editStatus, setEditStatus] = useState('');
    const [editNotes, setEditNotes] = useState('');
    const [saveSuccess, setSaveSuccess] = useState(false);

    useEffect(() => {
        fetchLeads();
    }, [installId]);

    const fetchLeads = async () => {
        setLoading(true);
        try {
            const res = await fetch('http://localhost:5000/api/leads', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setLeads(data);
        } catch (err) {
            console.error('Failed to fetch leads:', err);
        } finally {
            setLoading(false);
        }
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
            const res = await fetch(`http://localhost:5000/api/leads/${selectedLead.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status: editStatus, notes: editNotes }),
            });

            if (res.ok) {
                // Update local state
                setLeads((prev) => prev.map((l) =>
                    l.id === selectedLead.id
                        ? { ...l, status: editStatus, notes: editNotes }
                        : l
                ));
                setSelectedLead({ ...selectedLead, status: editStatus, notes: editNotes });
                setSaveSuccess(true);
                setTimeout(() => setSaveSuccess(false), 2000);
            }
        } catch (err) {
            console.error('Failed to save lead:', err);
        } finally {
            setSaving(false);
        }
    };

    const exportCSV = () => {
        const headers = ['Name', 'Email', 'Phone', 'Company', 'Services', 'Custom Answer', 'Status', 'Notes', 'Submitted'];
        const rows = leads.map((l) => [
            l.name || '',
            l.email || '',
            l.phone || '',
            l.company || '',
            l.services || '',
            l.custom || '',
            getStatus(l.status).label,
            l.notes || '',
            formatDate(l.timestamp),
        ]);

        const csv = [headers, ...rows]
            .map((row) => row.map((v) => `"${v}"`).join(','))
            .join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `leads_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // ── Detail Panel ──
    const renderDetailPanel = () => (
        <div style={{
            ...styles.detailPanel,
            width: isMobile ? '100%' : '300px',
            minWidth: isMobile ? 'unset' : '300px',
            height: isMobile ? '100%' : 'auto',
            position: isMobile ? 'absolute' : 'relative',
            top: 0, left: 0, right: 0, bottom: 0,
            zIndex: isMobile ? 10 : 'auto',
        }}>
            {/* Header */}
            <div style={styles.detailHeader}>
                {isMobile && (
                    <button style={styles.backBtn} onClick={() => setSelectedLead(null)}>
                        ← Back
                    </button>
                )}
                {!isMobile && (
                    <button
                        style={styles.closeDetailBtn}
                        onClick={() => setSelectedLead(null)}
                        title="Close"
                    >
                        ✕
                    </button>
                )}
                <div style={styles.detailAvatar}>
                    {selectedLead.name?.charAt(0)?.toUpperCase() || 'V'}
                </div>
                <h3 style={styles.detailName}>{selectedLead.name || 'Visitor'}</h3>
                <span style={{
                    ...styles.statusBadge,
                    backgroundColor: getStatus(selectedLead.status).bg,
                    color: getStatus(selectedLead.status).color,
                }}>
                    {getStatus(selectedLead.status).label}
                </span>
            </div>

            {/* Info */}
            <div style={styles.detailBody}>
                {[
                    { label: 'Email', value: selectedLead.email },
                    { label: 'Phone', value: selectedLead.phone },
                    { label: 'Company', value: selectedLead.company },
                    { label: 'Services', value: selectedLead.services },
                    { label: 'Answer', value: selectedLead.custom },
                    { label: 'Submitted', value: formatDate(selectedLead.timestamp) },
                ].map(({ label, value }) => value ? (
                    <div key={label} style={styles.detailRow}>
                        <span style={styles.detailLabel}>{label}</span>
                        <span style={styles.detailValue}>{value}</span>
                    </div>
                ) : null)}

                {/* Status */}
                <div style={styles.field}>
                    <label style={styles.fieldLabel}>Status</label>
                    <select
                        style={styles.select}
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value)}
                    >
                        {STATUSES.map((s) => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                    </select>
                </div>

                {/* Notes */}
                <div style={styles.field}>
                    <label style={styles.fieldLabel}>Notes</label>
                    <textarea
                        style={styles.textarea}
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        placeholder="Add notes about this lead..."
                        rows={4}
                    />
                </div>

                <button
                    style={{
                        ...styles.saveBtn,
                        backgroundColor: saveSuccess ? '#059669' : '#4F46E5',
                        opacity: saving ? 0.7 : 1,
                    }}
                    onClick={handleSaveLead}
                    disabled={saving}
                >
                    {saving ? 'Saving...' : saveSuccess ? '✅ Saved!' : 'Save Changes'}
                </button>
            </div>
        </div>
    );

    // ── Table ──
    const renderTable = () => (
        <div style={styles.tableContainer}>

            {/* Toolbar */}
            <div style={styles.toolbar}>
                <div>
                    <p style={styles.toolbarTitle}>Leads</p>
                    <p style={styles.toolbarSub}>{leads.length} total</p>
                </div>
                <button style={styles.exportBtn} onClick={exportCSV}>
                    ⬇️ Export CSV
                </button>
            </div>

            {/* Status summary */}
            <div style={styles.statusSummary}>
                {STATUSES.map((s) => {
                    const count = leads.filter((l) => (l.status || 'new') === s.value).length;
                    return (
                        <div key={s.value} style={{
                            ...styles.statusChip,
                            backgroundColor: s.bg,
                            color: s.color,
                            border: `1px solid ${s.color}30`,
                        }}>
                            {s.label}: {count}
                        </div>
                    );
                })}
            </div>

            {/* Table */}
            {loading ? (
                <div style={styles.empty}>Loading leads...</div>
            ) : leads.length === 0 ? (
                <div style={styles.empty}>
                    <p style={styles.emptyTitle}>No leads yet</p>
                    <p style={styles.emptySub}>Leads from your widget will appear here.</p>
                </div>
            ) : (
                <div style={styles.tableWrapper}>
                    <table style={styles.table}>
                        <thead>
                            <tr style={styles.thead}>
                                <th style={styles.th}>Name</th>
                                {!isMobile && <th style={styles.th}>Email</th>}
                                {!isMobile && <th style={styles.th}>Phone</th>}
                                {!isMobile && <th style={styles.th}>Services</th>}
                                <th style={styles.th}>Status</th>
                                {!isMobile && <th style={styles.th}>Date</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {leads.map((lead) => {
                                const status = getStatus(lead.status);
                                const isSelected = selectedLead?.id === lead.id;
                                return (
                                    <tr
                                        key={lead.id}
                                        style={{
                                            ...styles.tr,
                                            backgroundColor: isSelected ? '#EEF2FF' : status.rowBg,
                                            cursor: 'pointer',
                                            outline: isSelected ? '2px solid #4F46E5' : 'none',
                                        }}
                                        onClick={() => handleSelectLead(lead)}
                                    >
                                        <td style={styles.td}>
                                            <div style={styles.nameCell}>
                                                <div style={styles.nameAvatar}>
                                                    {lead.name?.charAt(0)?.toUpperCase() || '?'}
                                                </div>
                                                <span style={styles.nameTxt}>{lead.name || '—'}</span>
                                            </div>
                                        </td>
                                        {!isMobile && <td style={styles.td}>{lead.email || '—'}</td>}
                                        {!isMobile && <td style={styles.td}>{lead.phone || '—'}</td>}
                                        {!isMobile && (
                                            <td style={styles.td}>
                                                <span style={styles.servicesTxt}>
                                                    {lead.services || '—'}
                                                </span>
                                            </td>
                                        )}
                                        <td style={styles.td}>
                                            <span style={{
                                                ...styles.statusBadge,
                                                backgroundColor: status.bg,
                                                color: status.color,
                                            }}>
                                                {status.label}
                                            </span>
                                        </td>
                                        {!isMobile && (
                                            <td style={styles.td}>{formatDate(lead.timestamp)}</td>
                                        )}
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
        <div style={{ ...styles.container, position: 'relative' }}>
            {isMobile ? (
                <>
                    {selectedLead ? renderDetailPanel() : renderTable()}
                </>
            ) : (
                <>
                    {renderTable()}
                    {selectedLead && renderDetailPanel()}
                </>
            )}
        </div>
    );
}

const styles = {
    container: {
        flex: 1,
        display: 'flex',
        overflow: 'hidden',
        backgroundColor: '#F9FAFB',
    },
    tableContainer: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 24px 12px',
        backgroundColor: '#fff',
        borderBottom: '1px solid #E5E7EB',
    },
    toolbarTitle: {
        fontSize: '18px',
        fontWeight: '700',
        color: '#111827',
        margin: 0,
    },
    toolbarSub: {
        fontSize: '13px',
        color: '#9CA3AF',
        margin: 0,
    },
    exportBtn: {
        padding: '8px 16px',
        backgroundColor: '#fff',
        color: '#4F46E5',
        border: '1px solid #4F46E5',
        borderRadius: '8px',
        fontSize: '13px',
        fontWeight: '600',
        cursor: 'pointer',
    },
    statusSummary: {
        display: 'flex',
        gap: '8px',
        padding: '12px 24px',
        backgroundColor: '#fff',
        borderBottom: '1px solid #E5E7EB',
        flexWrap: 'wrap',
    },
    statusChip: {
        fontSize: '12px',
        fontWeight: '600',
        padding: '4px 10px',
        borderRadius: '20px',
    },
    tableWrapper: {
        flex: 1,
        overflowY: 'auto',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    thead: {
        backgroundColor: '#F9FAFB',
        position: 'sticky',
        top: 0,
        zIndex: 1,
    },
    th: {
        padding: '12px 16px',
        fontSize: '12px',
        fontWeight: '700',
        color: '#6B7280',
        textAlign: 'left',
        borderBottom: '1px solid #E5E7EB',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
    },
    tr: {
        borderBottom: '1px solid #F3F4F6',
        transition: 'background-color 0.15s',
    },
    td: {
        padding: '12px 16px',
        fontSize: '13px',
        color: '#374151',
        verticalAlign: 'middle',
    },
    nameCell: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
    nameAvatar: {
        width: '28px',
        height: '28px',
        minWidth: '28px',
        borderRadius: '50%',
        backgroundColor: '#EEF2FF',
        color: '#4F46E5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '11px',
        fontWeight: '700',
    },
    nameTxt: {
        fontWeight: '600',
        color: '#111827',
    },
    servicesTxt: {
        fontSize: '12px',
        color: '#6B7280',
        maxWidth: '150px',
        display: 'block',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    statusBadge: {
        fontSize: '11px',
        fontWeight: '600',
        padding: '3px 8px',
        borderRadius: '20px',
        whiteSpace: 'nowrap',
    },
    empty: {
        padding: '60px 24px',
        textAlign: 'center',
    },
    emptyTitle: {
        fontSize: '16px',
        fontWeight: '600',
        color: '#374151',
        margin: '0 0 8px 0',
    },
    emptySub: {
        fontSize: '13px',
        color: '#9CA3AF',
        margin: 0,
    },
    detailPanel: {
        position: 'relative',
        backgroundColor: '#fff',
        borderLeft: '1px solid #E5E7EB',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
    },
    detailHeader: {
        padding: '24px 16px 16px',
        borderBottom: '1px solid #E5E7EB',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
    },
    backBtn: {
        background: 'none',
        border: 'none',
        color: '#4F46E5',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        alignSelf: 'flex-start',
        padding: '0 0 8px 0',
    },
    detailAvatar: {
        width: '52px',
        height: '52px',
        borderRadius: '50%',
        backgroundColor: '#EEF2FF',
        color: '#4F46E5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px',
        fontWeight: '700',
    },
    detailName: {
        fontSize: '16px',
        fontWeight: '700',
        color: '#111827',
        margin: 0,
    },
    detailBody: {
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
    },
    detailRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: '8px 0',
        borderBottom: '1px solid #F3F4F6',
        gap: '8px',
    },
    detailLabel: {
        fontSize: '12px',
        color: '#6B7280',
        flexShrink: 0,
    },
    detailValue: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#111827',
        textAlign: 'right',
        wordBreak: 'break-word',
    },
    field: {
        marginTop: '12px',
    },
    fieldLabel: {
        display: 'block',
        fontSize: '13px',
        fontWeight: '600',
        color: '#374151',
        marginBottom: '6px',
    },
    select: {
        width: '100%',
        padding: '10px 14px',
        borderRadius: '8px',
        border: '1px solid #D1D5DB',
        fontSize: '14px',
        outline: 'none',
        boxSizing: 'border-box',
        color: '#111827',
        backgroundColor: '#fff',
        cursor: 'pointer',
    },
    textarea: {
        width: '100%',
        padding: '10px 14px',
        borderRadius: '8px',
        border: '1px solid #D1D5DB',
        fontSize: '14px',
        outline: 'none',
        boxSizing: 'border-box',
        color: '#111827',
        fontFamily: 'Arial, sans-serif',
        resize: 'vertical',
    },
    saveBtn: {
        width: '100%',
        padding: '10px',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        marginTop: '12px',
        transition: 'background-color 0.2s',
    },
    closeDetailBtn: {
        position: 'absolute',
        top: '12px',
        right: '12px',
        background: 'none',
        border: 'none',
        fontSize: '16px',
        color: '#9CA3AF',
        cursor: 'pointer',
        padding: '4px',
        borderRadius: '4px',
        lineHeight: 1,
    },
};