import React, { useState, useEffect } from 'react';
import {
    ShieldCheck, User, Lock, Building2, MapPin,
    ArrowRight, Globe, BadgeCheck
} from 'lucide-react';
import logo from '../assets/logo.png';
import { useAuth } from '../contexts/AuthContext';

export default function LoginPage() {
    const [view, setView] = useState('login'); // 'signup' or 'login'
    const [userType, setUserType] = useState('booth'); // 'booth' or 'official'

    const navy = "#0f172a";
    const gold = "#D4AF37";
    const slate400 = "#94a3b8";
    const slate500 = "#64748b";
    const slate50 = "#f8fafc";
    const slate100 = "#f1f5f9";
    const slate200 = "#e2e8f0";
    const white = "#ffffff";

    const [boothIdInput, setBoothIdInput] = useState('');
    const [nameInput, setNameInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, signup } = useAuth();

    const districtsList = [
        "North West", "North", "North East", "Shahdara", "East", "West", 
        "Central", "New Delhi", "South West", "South", "South East"
    ];
    const [selectedDistrict, setSelectedDistrict] = useState("Central");

    const [devLogin, setDevLogin] = useState(null);

    useEffect(() => {
        fetch('/dev-login.json')
            .then(res => res.json())
            .then(data => {
                if (data && data.enabled) {
                    setDevLogin(data);
                }
            })
            .catch(() => {});
    }, []);

    const handleDevLogin = async (role) => {
        if (!devLogin) return;
        setError('');
        setLoading(true);
        const creds = devLogin[role];
        let email = '';
        if (role === 'booth') {
            email = `booth_${creds.id}@innovateindia.gov`;
        } else if (role === 'dm') {
            email = `dm_${creds.district.replace(/\s+/g, '_').toLowerCase()}_${creds.name}@innovateindia.gov`;
        } else if (role === 'cm') {
            email = `cm_${creds.name}@innovateindia.gov`;
        }
        try {
            await login(email, creds.password);
        } catch (err) {
            if (err.code === 'invalid-credentials') {
                try {
                    const metadata = role === 'booth'
                        ? { name: creds.name || 'Demo Booth' }
                        : role === 'dm'
                            ? { district: creds.district, name: creds.name || 'Demo DM' }
                            : { department: 'CM Secretariat' };
                    await signup(email, creds.password, role, metadata);
                } catch (regErr) {
                    if (regErr.code === 'email-already-in-use') {
                        // Account exists but wrong password in dev-login.json or DB has old hash
                        setError(`Account exists but password mismatch. Clear app.db and retry, or update dev-login.json password.`);
                    } else {
                        console.error(regErr);
                        setError(regErr.code || regErr.message || 'Auto-registration failed.');
                    }
                }
            } else {
                console.error(err);
                setError(err.code || err.message || 'Dev Authentication failed.');
            }
        }
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (view === 'signup' && passwordInput !== confirmPasswordInput) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);

        let email = '';
        if (userType === 'booth') {
            email = `booth_${boothIdInput}@innovateindia.gov`;
        } else if (userType === 'dm') {
            email = `dm_${selectedDistrict.replace(/\s+/g, '_').toLowerCase()}_${nameInput}@innovateindia.gov`;
        } else if (userType === 'cm') {
            email = `cm_${nameInput}@innovateindia.gov`;
        }

        try {
            if (view === 'login') {
                await login(email, passwordInput);
            } else {
                const metadata = userType === 'booth'
                    ? { name: nameInput }
                    : userType === 'dm'
                        ? { district: selectedDistrict, name: nameInput }
                        : { department: 'CM Secretariat' };
                await signup(email, passwordInput, userType, metadata);
            }
        } catch (err) {
            console.error(err);
            if (err.code === 'invalid-credentials') {
                setError('Account not found or invalid credentials. Please register your access first.');
            } else if (err.code === 'email-already-in-use') {
                setError('This ID is already registered. Please sign in instead.');
            } else {
                setError(err.message || 'Authentication failed. Please verify your details.');
            }
        }
        setLoading(false);
    };

    return (
        <div style={{ display: 'flex', height: '100vh', width: '100%', backgroundColor: white, fontFamily: 'Public Sans, sans-serif', overflow: 'hidden', position: 'relative' }}>
            {devLogin && (
                <div style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    background: '#0f172a',
                    border: '2px solid #cbd5e1',
                    borderRadius: '0px',
                    padding: '16px',
                    zIndex: 1000,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    minWidth: '220px'
                }}>
                    <div style={{ fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', borderBottom: '1px solid #334155', paddingBottom: '6px' }}>Dev Quick Access</div>
                    <button 
                        type="button"
                        onClick={() => handleDevLogin('booth')}
                        disabled={loading}
                        style={{
                            backgroundColor: '#D4AF37',
                            border: 'none',
                            color: '#0f172a',
                            padding: '8px 12px',
                            fontSize: '10px',
                            fontWeight: 900,
                            cursor: 'pointer',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            transition: 'opacity 0.2s'
                        }}
                    >
                        Demo Booth Login
                    </button>
                    <button 
                        type="button"
                        onClick={() => handleDevLogin('dm')}
                        disabled={loading}
                        style={{
                            backgroundColor: '#0f172a',
                            border: '1px solid #D4AF37',
                            color: '#D4AF37',
                            padding: '8px 12px',
                            fontSize: '10px',
                            fontWeight: 900,
                            cursor: 'pointer',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            transition: 'opacity 0.2s'
                        }}
                    >
                        Demo DM Login (Central)
                    </button>
                    <button 
                        type="button"
                        onClick={() => handleDevLogin('cm')}
                        disabled={loading}
                        style={{
                            backgroundColor: '#0f172a',
                            border: '1px solid #94a3b8',
                            color: '#ffffff',
                            padding: '8px 12px',
                            fontSize: '10px',
                            fontWeight: 900,
                            cursor: 'pointer',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            transition: 'opacity 0.2s'
                        }}
                    >
                        Demo CM Login
                    </button>
                </div>
            )}

            {/* LEFT SIDE: Solid Navy Branding */}
            <div style={{
                display: 'none', // Default hidden for mobile
                width: '50%',
                backgroundColor: navy,
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '0 80px',
                position: 'relative'
            }} className="lg-flex">
                <style dangerouslySetInnerHTML={{
                    __html: `
          @media (min-width: 1024px) {
            .lg-flex { display: flex !important; }
          }
        `}} />
                <div style={{ maxWidth: '448px', position: 'relative', zIndex: 10 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '64px' }}>
                        <img src={logo?.src || logo} alt="Logo" style={{ height: '120px', objectFit: 'contain', objectPosition: 'left', display: 'block', marginBottom: '32px' }} />
                        <div style={{ height: '6px', width: '80px', backgroundColor: gold, marginBottom: '24px' }} />
                        <span style={{ color: slate500, fontSize: '12px', fontWeight: 900, letterSpacing: '0.4em', textTransform: 'uppercase', width: 'fit-content' }}>
                            AAkar Intelligence
                        </span>
                    </div>

                    <p style={{ color: slate400, fontSize: '18px', fontWeight: 500, lineHeight: 1.625, maxWidth: '384px' }}>
                        Dedicated infrastructure for CM, District Magistrates, and Booth Officials.
                        Real-time complaints tracking and secure intelligence network.
                    </p>
                </div>
            </div>

            {/* RIGHT SIDE: Form Portal */}
            <div style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '0 32px',
                backgroundColor: white,
                overflowY: 'auto'
            }} className="right-panel">
                <style dangerouslySetInnerHTML={{
                    __html: `
          @media (min-width: 640px) { .right-panel { padding: 0 64px !important; } }
          @media (min-width: 1024px) { 
            .right-panel { width: 50% !important; padding: 0 96px !important; } 
          }
        `}} />
                <div style={{ maxWidth: '448px', width: '100%', margin: '0 auto', padding: '48px 0' }}>

                    <div style={{ marginBottom: '48px', textAlign: 'right' }}>
                        <button
                            onClick={() => setView(view === 'login' ? 'signup' : 'login')}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: slate400,
                                fontSize: '10px',
                                fontWeight: 900,
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                cursor: 'pointer',
                                transition: 'color 0.15s ease'
                            }}
                            onMouseEnter={(e) => e.target.style.color = navy}
                            onMouseLeave={(e) => e.target.style.color = slate400}
                        >
                            {view === 'login' ? 'Register New Access →' : 'Already Authorized? Sign In →'}
                        </button>
                    </div>

                    <div style={{ marginBottom: '40px' }}>
                        <h2 style={{ fontSize: '30px', fontWeight: 900, color: navy, letterSpacing: '-0.025em', textTransform: 'uppercase' }}>
                            {view === 'login' ? 'Portal Login' : 'System Registration'}
                        </h2>
                        <p style={{ color: slate400, fontSize: '10px', fontWeight: 900, marginTop: '8px', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                            Authorized Access Only
                        </p>
                    </div>

                    <div style={{ display: 'flex', border: `2px solid ${slate100}`, borderRadius: '16px', marginBottom: '40px', padding: '6px', backgroundColor: slate50, gap: '4px' }}>
                        <button
                            type="button"
                            onClick={() => setUserType('booth')}
                            style={{
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                padding: '14px 0',
                                borderRadius: '12px',
                                fontSize: '10px',
                                fontWeight: 900,
                                letterSpacing: '0.1em',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                backgroundColor: userType === 'booth' ? navy : 'transparent',
                                color: userType === 'booth' ? white : slate400,
                                boxShadow: userType === 'booth' ? '0 20px 25px -5px rgba(0, 0, 0, 0.1)' : 'none'
                            }}
                        >
                            <MapPin size={14} color={userType === 'booth' ? gold : slate400} /> BOOTH
                        </button>
                        <button
                            type="button"
                            onClick={() => setUserType('dm')}
                            style={{
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                padding: '14px 0',
                                borderRadius: '12px',
                                fontSize: '10px',
                                fontWeight: 900,
                                letterSpacing: '0.1em',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                backgroundColor: userType === 'dm' ? navy : 'transparent',
                                color: userType === 'dm' ? white : slate400,
                                boxShadow: userType === 'dm' ? '0 20px 25px -5px rgba(0, 0, 0, 0.1)' : 'none'
                            }}
                        >
                            <Building2 size={14} color={userType === 'dm' ? gold : slate400} /> DM
                        </button>
                        <button
                            type="button"
                            onClick={() => setUserType('cm')}
                            style={{
                                flex: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                padding: '14px 0',
                                borderRadius: '12px',
                                fontSize: '10px',
                                fontWeight: 900,
                                letterSpacing: '0.1em',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                backgroundColor: userType === 'cm' ? navy : 'transparent',
                                color: userType === 'cm' ? white : slate400,
                                boxShadow: userType === 'cm' ? '0 20px 25px -5px rgba(0, 0, 0, 0.1)' : 'none'
                            }}
                        >
                            <ShieldCheck size={14} color={userType === 'cm' ? gold : slate400} /> CM
                        </button>
                    </div>

                    {error && (
                        <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '12px 16px', borderRadius: '12px', marginBottom: '24px', fontSize: '11px', fontWeight: 700, border: '1px solid #fca5a5' }}>
                            {error}
                        </div>
                    )}

                    <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} onSubmit={handleSubmit}>
                        {view === 'signup' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {userType === 'booth' && (
                                    <>
                                        <FlatField label="Name of the Official" icon={<User size={16} />} placeholder="In-charge Full Name" value={nameInput} onChange={setNameInput} />
                                        <FlatField label="Booth ID" icon={<BadgeCheck size={16} />} placeholder="Enter unique Booth #" value={boothIdInput} onChange={setBoothIdInput} />
                                        <FlatField label="State" icon={<Globe size={16} />} placeholder="Enter State / Union Territory" />
                                    </>
                                )}
                                {userType === 'dm' && (
                                    <>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                            <label style={{ fontSize: '9px', fontWeight: 900, color: slate400, textTransform: 'uppercase', letterSpacing: '0.1em', marginLeft: '4px' }}>District</label>
                                            <select 
                                                value={selectedDistrict}
                                                onChange={e => setSelectedDistrict(e.target.value)}
                                                style={{ width: '100%', backgroundColor: slate50, border: `1px solid ${slate200}`, borderRadius: '12px', padding: '16px', fontSize: '12px', fontWeight: 700, outline: 'none' }}
                                            >
                                                {districtsList.map(d => <option key={d} value={d}>{d}</option>)}
                                            </select>
                                        </div>
                                        <FlatField label="Gov Official ID / Name" icon={<User size={16} />} placeholder="Enter registered name or DM ID" value={nameInput} onChange={setNameInput} />
                                    </>
                                )}
                                {userType === 'cm' && (
                                    <>
                                        <FlatField label="Gov Official ID" icon={<ShieldCheck size={16} />} placeholder="GOV-XXXX-XXXX" value={nameInput} onChange={setNameInput} />
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                            <label style={{ fontSize: '9px', fontWeight: 900, color: slate400, textTransform: 'uppercase', letterSpacing: '0.1em', marginLeft: '4px' }}>Department</label>
                                            <select style={{ width: '100%', backgroundColor: slate50, border: `1px solid ${slate200}`, borderRadius: '12px', padding: '16px', fontSize: '12px', fontWeight: 700, outline: 'none' }}>
                                                <option>CM Secretariat</option>
                                                <option>Election Commission</option>
                                                <option>Administration</option>
                                            </select>
                                        </div>
                                    </>
                                )}
                                <FlatField label="Password" icon={<Lock size={16} />} placeholder="••••••••" type="password" value={passwordInput} onChange={setPasswordInput} />
                                <FlatField label="Confirm Password" icon={<Lock size={16} />} placeholder="••••••••" type="password" value={confirmPasswordInput} onChange={setConfirmPasswordInput} />

                                <button type="submit" disabled={loading} style={{
                                    width: '100%',
                                    backgroundColor: loading ? slate400 : navy,
                                    color: white,
                                    padding: '16px',
                                    marginTop: '16px',
                                    borderRadius: '16px',
                                    fontWeight: 900,
                                    fontSize: '10px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.3em',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '12px',
                                    border: 'none',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    boxShadow: loading ? 'none' : '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                                }}>
                                    {loading ? 'Processing...' : (userType === 'booth' ? 'Register Booth' : userType === 'dm' ? 'Register DM' : 'Register CM')} {!loading && <ArrowRight size={16} color={gold} />}
                                </button>
                            </div>
                        )}

                        {view === 'login' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {userType === 'booth' && (
                                    <>
                                        <FlatField label="Official Name" icon={<User size={16} />} placeholder="Enter registered name" value={nameInput} onChange={setNameInput} />
                                        <FlatField label="Booth ID" icon={<BadgeCheck size={16} />} placeholder="Enter unique Booth #" value={boothIdInput} onChange={setBoothIdInput} />
                                    </>
                                )}
                                {userType === 'dm' && (
                                    <>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                            <label style={{ fontSize: '9px', fontWeight: 900, color: slate400, textTransform: 'uppercase', letterSpacing: '0.1em', marginLeft: '4px' }}>District</label>
                                            <select 
                                                value={selectedDistrict}
                                                onChange={e => setSelectedDistrict(e.target.value)}
                                                style={{ width: '100%', backgroundColor: slate50, border: `1px solid ${slate200}`, borderRadius: '12px', padding: '16px', fontSize: '12px', fontWeight: 700, outline: 'none' }}
                                            >
                                                {districtsList.map(d => <option key={d} value={d}>{d}</option>)}
                                            </select>
                                        </div>
                                        <FlatField label="DM ID / Name" icon={<User size={16} />} placeholder="Enter DM ID" value={nameInput} onChange={setNameInput} />
                                    </>
                                )}
                                {userType === 'cm' && (
                                    <FlatField label="CM Secretariat ID" icon={<ShieldCheck size={16} />} placeholder="Enter ID" value={nameInput} onChange={setNameInput} />
                                )}
                                <FlatField label="Password" icon={<Lock size={16} />} placeholder="••••••••" type="password" value={passwordInput} onChange={setPasswordInput} />

                                <button type="submit" disabled={loading} style={{
                                    width: '100%',
                                    backgroundColor: loading ? slate400 : navy,
                                    color: white,
                                    padding: '16px',
                                    marginTop: '32px',
                                    borderRadius: '16px',
                                    fontWeight: 900,
                                    fontSize: '10px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.3em',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '12px',
                                    border: 'none',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.2s ease'
                                }}>
                                    {loading ? 'Authorizing...' : 'Authorize Login'} {!loading && <ArrowRight size={16} color={gold} />}
                                </button>
                            </div>
                        )}
                    </form>

                    <footer style={{ marginTop: '48px', textAlign: 'center' }}>
                        <p style={{ fontSize: '10px', color: slate400, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', lineHeight: 1.6 }}>
                            © 2026 <img src={logo?.src || logo} alt="Logo" style={{ height: '14px', verticalAlign: 'middle', margin: '0 4px', filter: 'brightness(0)' }} /> • National Data Network <br />
                            <span style={{ color: gold }}>Secure Intelligence Node</span>
                        </p>
                    </footer>
                </div>
            </div>

        </div>
    );
}

function FlatField({ label, icon, placeholder, type = "text", value, onChange }) {
    const slate200 = "#e2e8f0";
    const slate50 = "#f8fafc";
    const slate300 = "#cbd5e1";
    const slate400 = "#94a3b8";

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '9px', fontWeight: 900, color: slate400, textTransform: 'uppercase', letterSpacing: '0.1em', marginLeft: '4px' }}>{label}</label>
            <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: slate300 }}>{icon}</div>
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    style={{
                        width: '100%',
                        backgroundColor: slate50,
                        border: `1px solid ${slate200}`,
                        borderRadius: '12px',
                        padding: '16px 16px 16px 48px',
                        fontSize: '12px',
                        fontWeight: 700,
                        outline: 'none',
                        transition: 'border-color 0.2s ease'
                    }}
                    placeholder={placeholder}
                    onFocus={(e) => e.target.style.borderColor = "#D4AF37"}
                    onBlur={(e) => e.target.style.borderColor = slate200}
                />
            </div>
        </div>
    );
}
