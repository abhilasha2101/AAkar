import React from 'react';
import { Activity, ShieldAlert, Award, Clock, Heart } from 'lucide-react';

export default function HealthDepartmentPanel() {
  return (
    <div style={{ fontFamily: 'var(--font)', color: 'var(--gray-900)' }}>
      {/* ── Header ── */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: '20px',
        borderBottom: '1px solid var(--gray-200)',
        marginBottom: '24px'
      }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--blue-700)', margin: 0 }}>
            Department of Health & Family Welfare
          </h2>
          <p style={{ fontSize: '11px', color: 'var(--gray-500)', margin: '4px 0 0 0', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            State Level Operations & Facility Monitoring
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', border: '1px solid var(--amber-500)', background: 'var(--amber-50)', color: '#92600a', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          <ShieldAlert size={14} />
          MODULE INTEGRATION READY
        </div>
      </div>

      {/* ── Key Indicators ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '28px' }}>
        <div style={{ background: 'white', border: '1px solid var(--gray-200)', padding: '20px' }}>
          <div style={{ fontSize: '9px', fontWeight: 800, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
            TOTAL HOSPITALS
          </div>
          <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--gray-900)' }}>38</div>
          <div style={{ fontSize: '10px', color: 'var(--gray-500)', marginTop: '4px', fontWeight: 600 }}>State & District Facilities</div>
        </div>
        <div style={{ background: 'white', border: '1px solid var(--gray-200)', padding: '20px' }}>
          <div style={{ fontSize: '9px', fontWeight: 800, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
            ACTIVE SCHEMES
          </div>
          <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--gray-900)' }}>12</div>
          <div style={{ fontSize: '10px', color: 'var(--green-600)', marginTop: '4px', fontWeight: 700 }}>100% Operational</div>
        </div>
        <div style={{ background: 'white', border: '1px solid var(--gray-200)', padding: '20px' }}>
          <div style={{ fontSize: '9px', fontWeight: 800, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
            VOTER COMPLAINTS
          </div>
          <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--gray-900)' }}>—</div>
          <div style={{ fontSize: '10px', color: 'var(--gray-400)', marginTop: '4px', fontWeight: 600 }}>No active health issues flagged</div>
        </div>
        <div style={{ background: 'white', border: '1px solid var(--gray-200)', padding: '20px' }}>
          <div style={{ fontSize: '9px', fontWeight: 800, color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
            PERFORMANCE SCORE
          </div>
          <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--blue-600)' }}>94.2</div>
          <div style={{ fontSize: '10px', color: 'var(--gray-500)', marginTop: '4px', fontWeight: 600 }}>Grade A (Excellent)</div>
        </div>
      </div>

      {/* ── Placeholder Information Card ── */}
      <div style={{
        background: 'var(--blue-700)',
        border: '1px solid var(--blue-800)',
        padding: '36px',
        textAlign: 'center',
        color: 'white'
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', border: '1px dashed rgba(255,255,255,0.3)', marginBottom: '20px' }}>
          <Heart size={28} className="text-white" style={{ color: 'var(--amber-500)' }} />
        </div>
        <h3 style={{ fontSize: '14px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 10px 0', color: 'var(--amber-500)' }}>
          Health Department Dashboard Template Ready
        </h3>
        <p style={{ fontSize: '12px', color: 'var(--blue-100)', maxWidth: '560px', margin: '0 auto 24px auto', lineHeight: '1.6', fontWeight: 500 }}>
          This component is linked to the navigation bar. Your colleague can pull your latest commits and safely write her Health Department dashboard logic right inside this file (<code style={{ background: 'rgba(0,0,0,0.2)', padding: '2px 6px', fontFamily: 'monospace' }}>HealthDepartmentPanel.jsx</code>) without causing any merge conflicts.
        </p>
        <div style={{ display: 'inline-flex', gap: '12px', justifyContent: 'center' }}>
          <div style={{ border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', padding: '8px 16px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            File: HealthDepartmentPanel.jsx
          </div>
          <div style={{ border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)', padding: '8px 16px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Status: Skeleton Structured
          </div>
        </div>
      </div>
    </div>
  );
}
