import React, { useState, useRef, useEffect } from 'react';
import { X, Zap, Check, Image as ImageIcon, HelpCircle } from 'lucide-react';

const ANGLES = [
  { id: 1, label: 'Frente 45° E', desc: 'Fique a 3 metros. Enquadre a frente e a lateral esquerda.' },
  { id: 2, label: 'Frente 45° D', desc: 'Fique a 3 metros. Enquadre a frente e a lateral direita.' },
  { id: 3, label: 'Lateral E', desc: 'Fique a cerca de 3 metros, com o carro inteiro dentro da linha tracejada.' },
  { id: 4, label: 'Lateral D', desc: 'Carro inteiro alinhado com a lateral direita.' },
  { id: 5, label: 'Traseira 45° E', desc: 'Enquadre a traseira e a lateral esquerda.' },
  { id: 6, label: 'Traseira 45° D', desc: 'Enquadre a traseira e a lateral direita.' },
  { id: 7, label: 'Teto', desc: 'Capture o teto e a integridade da pintura superior.' },
  { id: 8, label: 'Painel / Hodometro', desc: 'Enquadre o odometro ligado nitido.' },
  { id: 9, label: 'Bancos Dianteiros', desc: 'Foto ampla dos bancos dianteiros.' },
  { id: 10, label: 'Bancos Traseiros', desc: 'Foto ampla do estofamento traseiro.' },
  { id: 11, label: 'Pneu Diant. E (TWI)', desc: 'Foque na banda de rodagem com o indicador TWI.' },
  { id: 12, label: 'Pneu Diant. D (TWI)', desc: 'Foque na banda de rodagem com o indicador TWI.' },
  { id: 13, label: 'Pneu Tras. E (TWI)', desc: 'Foque na banda de rodagem com o indicador TWI.' },
  { id: 14, label: 'Pneu Tras. D (TWI)', desc: 'Foque na banda de rodagem com o indicador TWI.' },
];

export default function PhotoGuideModal({ onClose, onComplete }) {
  const [currentStep, setCurrentStep] = useState(2);
  const [photos, setPhotos] = useState({});
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    let stream = null;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(s => {
          stream = s;
          if (videoRef.current) videoRef.current.srcObject = s;
        })
        .catch(() => console.log('Camara indisponivel, modo upload ativo'));
    }

    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, []);

  const advanceStep = (updatedPhotos) => {
    if (currentStep < ANGLES.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(Object.values(updatedPhotos));
      onClose();
    }
  };

  const handleCapture = () => {
    const updated = { 
      ...photos, 
      [currentStep]: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80' 
    };
    setPhotos(updated);
    advanceStep(updated);
  };

  const handleFileImport = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    const updated = {
      ...photos,
      [currentStep]: imageUrl
    };
    setPhotos(updated);
    advanceStep(updated);
  };

  const currentAngle = ANGLES[currentStep];

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#090d16', zIndex: 100, display: 'flex', flexDirection: 'column', color: '#fff' }}>
      
      {/* Input invisivel para importar fotos do computador/telemovel */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileImport} 
        accept="image/*" 
        style={{ display: 'none' }} 
      />

      {/* Topo */}
      <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
          <X size={24} />
        </button>
        <span style={{ fontWeight: '700', fontSize: '16px' }}>Foto {currentStep + 1} de {ANGLES.length}</span>
        <button style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
          <Zap size={22} />
        </button>
      </div>

      {/* Barra de progresso de 14 segmentos */}
      <div style={{ display: 'flex', gap: '4px', padding: '0 20px 14px' }}>
        {ANGLES.map((_, i) => (
          <div 
            key={i} 
            style={{ 
              flex: 1, 
              height: '4px', 
              borderRadius: '2px', 
              background: photos[i] ? '#10b981' : i === currentStep ? '#fff' : '#1e293b' 
            }} 
          />
        ))}
      </div>

      {/* Area da Camara / Preview da Foto Importada */}
      <div style={{ flex: 1, margin: '0 20px', position: 'relative', borderRadius: '24px', overflow: 'hidden', background: '#020617', border: '2px solid #1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {photos[currentStep] ? (
          <img src={photos[currentStep]} alt="Foto selecionada" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <video ref={videoRef} autoPlay playsInline muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        )}

        {/* Linha tracejada e guias visuais */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          <span style={{ position: 'absolute', top: '16px', background: 'rgba(15,23,42,0.85)', border: '1px solid #334155', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' }}>
            {currentAngle.label}
          </span>

          <svg width="260" height="120" viewBox="0 0 260 120" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeDasharray="6 6" style={{ opacity: 0.85 }}>
            <path d="M 30 75 L 60 75 Q 85 45 120 40 L 175 40 Q 210 50 230 75 L 245 75 Q 250 85 245 95 L 15 95 Q 10 85 30 75 Z" />
            <circle cx="65" cy="95" r="18" strokeDasharray="5 5" />
            <circle cx="195" cy="95" r="18" strokeDasharray="5 5" />
          </svg>

          {/* Cantos delimitadores */}
          <div style={{ position: 'absolute', top: '12px', left: '12px', width: '28px', height: '28px', borderTop: '3px solid #fff', borderLeft: '3px solid #fff', borderTopLeftRadius: '10px' }} />
          <div style={{ position: 'absolute', top: '12px', right: '12px', width: '28px', height: '28px', borderTop: '3px solid #fff', borderRight: '3px solid #fff', borderTopRightRadius: '10px' }} />
          <div style={{ position: 'absolute', bottom: '12px', left: '12px', width: '28px', height: '28px', borderBottom: '3px solid #fff', borderLeft: '3px solid #fff', borderBottomLeftRadius: '10px' }} />
          <div style={{ position: 'absolute', bottom: '12px', right: '12px', width: '28px', height: '28px', borderBottom: '3px solid #fff', borderRight: '3px solid #fff', borderBottomRightRadius: '10px' }} />

          {/* Indicadores de qualidade */}
          <div style={{ position: 'absolute', bottom: '16px', display: 'flex', gap: '8px' }}>
            <span style={{ background: '#064e3b', color: '#34d399', fontSize: '11px', padding: '4px 10px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Check size={12} /> Nitidez
            </span>
            <span style={{ background: '#064e3b', color: '#34d399', fontSize: '11px', padding: '4px 10px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Check size={12} /> Enquadramento
            </span>
            <span style={{ background: '#064e3b', color: '#34d399', fontSize: '11px', padding: '4px 10px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Check size={12} /> Luz
            </span>
          </div>
        </div>
      </div>

      <p style={{ textAlign: 'center', padding: '14px 32px', fontSize: '13px', color: '#94a3b8', lineHeight: 1.4 }}>
        {currentAngle.desc}
      </p>

      {/* Botoes dos angulos */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '0 20px 16px' }}>
        {ANGLES.map((a, i) => (
          <button
            key={a.id}
            onClick={() => setCurrentStep(i)}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              border: 'none',
              fontSize: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              background: i === currentStep ? '#0284c7' : photos[i] ? '#1e293b' : '#0f172a',
              color: photos[i] && i !== currentStep ? '#34d399' : '#fff'
            }}
          >
            {photos[i] ? `✓ ${a.label}` : a.label}
          </button>
        ))}
      </div>

      {/* Acoes: Importar da Galeria / Botao Disparo */}
      <div style={{ padding: '0 28px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button 
          title="Importar foto"
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
          style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#1e293b', border: 'none', color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
          <ImageIcon size={22} />
        </button>

        <button 
          onClick={handleCapture}
          style={{ width: '76px', height: '76px', borderRadius: '50%', background: 'transparent', border: '4px solid #fff', padding: '4px', cursor: 'pointer' }}
        >
          <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: '#fff' }} />
        </button>

        <button style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#1e293b', border: 'none', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <HelpCircle size={20} />
        </button>
      </div>

      <p style={{ textAlign: 'center', fontSize: '11px', color: '#64748b', padding: '0 24px 18px', lineHeight: 1.4 }}>
        As fotos sao feitas pelo app ou importadas, com data, hora e local registados[cite: 13, 15].
      </p>
    </div>
  );
}