"use client";

import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LodgeComplaintPanel from "../../components/LodgeComplaintPanel";

export default function PortalPage() {
  const { currentUser, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!currentUser || currentUser.role !== 'booth')) {
      router.push("/login");
    }
  }, [currentUser, loading, router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  if (loading || !currentUser || currentUser.role !== 'booth') {
    return (
      <div className="loading-state" style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', fontFamily: 'sans-serif' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <div className="spinner" style={{ width: '24px', height: '24px', border: '3px solid #e2e8f0', borderTopColor: '#0f172a', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Loading...</span>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Extract booth ID from email
  const boothId = currentUser.email ? currentUser.email.split('@')[0].split('_').slice(1).join('_') : null;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Booth Header with Logout */}
      <div style={{
        padding: '12px 40px',
        background: 'white',
        borderBottom: '1px solid var(--gray-100)',
        display: 'flex',
        justifyContent: 'flex-end'
      }}>
        <button
          onClick={handleLogout}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--gray-500)',
            fontSize: '11px',
            fontWeight: '800',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          Terminate Session <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--red-500)' }} />
        </button>
      </div>
      <div className="content" style={{ padding: '0' }}>
        <LodgeComplaintPanel boothId={boothId} />
      </div>
    </div>
  );
}
