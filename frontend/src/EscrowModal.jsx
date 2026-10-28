import React, { useState } from 'react';
import { X, ShieldCheck, Lock, CheckCircle2, Calendar, FileText, ArrowRight } from 'lucide-react';

export default function EscrowModal({ vehicle, isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [depositAmount, setDepositAmount] = useState('1000'); // Sinal de reserva padrão R$ 1.000
  const [scheduledDate, setScheduledDate] = useState('');

  if (!isOpen || !vehicle) return null;

  const handleConfirmReservation = (e) => {
    e.preventDefault();
    if (!scheduledDate) {
      alert('Por favor, selecione a data pretendida para a vistoria.');
      return;
    }
    setStep(2);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1200,
      backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
    }}>
      <div style={{
        background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px',
        width: '100%', maxWidth: '520px', padding: '28px', position: 'relative', color: '#f8fafc',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
      }}>
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        {/* Cabeçalho */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div style={{ background: '#064e3b', padding: '8px', borderRadius: '10px', color: '#34d399', display: 'flex' }}>
            <Lock size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '800' }}>Custódia Protegida AutoVenda+</h2>
            <p style={{ fontSize: '12px', color: '#94a3b8' }}>Garantia total até à entrega do veículo e documento</p>
          </div>
        </div>

        {/* Resumo do Veículo */}
        <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '12px 16px', margin: '18px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '700' }}>{vehicle.marca} {vehicle.modelo}</div>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>Ano: {vehicle.ano} | Chassi: {vehicle.placa_chassi || 'Verificado'}</div>
          </div>
          <div style={{ fontSize: '18px', fontWeight: '800', color: '#38bdf8' }}>
            R$ {Number(vehicle.preco).toLocaleString('pt-BR')}
          </div>
        </div>

        {step === 1 ? (
          <form onSubmit={handleConfirmReservation} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Como funciona */}
            <div style={{ background: '#0b0f19', padding: '14px', borderRadius: '10px', border: '1px solid #1e293b', fontSize: '12px', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#34d399', fontWeight: '600' }}>
                <CheckCircle2 size={16} /> 1. O valor fica retido na plataforma (não vai para o vendedor)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontWeight: '600' }}>
                <CheckCircle2 size={16} /> 2. Realizam a vistoria presencial juntos
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8' }}>
                <CheckCircle2 size={16} /> 3. Se não gostar do carro, o dinheiro é devolvido a 100%
              </div>
            </div>

            <div>
              <label style={{ fontSize: '13px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                Valor do Sinal de Reserva em Custódia (R$)
              </label>
              <input 
                type="number" 
                value={depositAmount} 
                onChange={(e) => setDepositAmount(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #334155', background: '#1e293b', color: '#fff', fontSize: '14px' }}
                required 
              />
            </div>

            <div>
              <label style={{ fontSize: '13px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>
                Data Prevista para Vistoria Presencial
              </label>
              <input 
                type="date" 
                value={scheduledDate} 
                onChange={(e) => setScheduledDate(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #334155', background: '#1e293b', color: '#fff', fontSize: '14px' }}
                required 
              />
            </div>

            <button
              type="submit"
              style={{
                background: '#10b981', color: '#ffffff', border: 'none', padding: '12px',
                borderRadius: '8px', fontWeight: '700', fontSize: '14px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '6px'
              }}
            >
              Avançar com Reserva Segura <ArrowRight size={16} />
            </button>
          </form>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'center', padding: '12px 0' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#064e3b', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
              <ShieldCheck size={36} />
            </div>

            <h3 style={{ fontSize: '18px', fontWeight: '700' }}>Reserva em Custódia Solicitada!</h3>
            
            <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: '1.5' }}>
              O valor de <strong>R$ {Number(depositAmount).toLocaleString('pt-BR')}</strong> foi colocado sob proteção segura para a vistoria marcada a <strong>{scheduledDate}</strong>.
            </p>

            <div style={{ background: '#111827', padding: '14px', borderRadius: '10px', textAlign: 'left', fontSize: '12px', color: '#cbd5e1', border: '1px solid #1f2937' }}>
              <strong>Código do Contrato:</strong> ESC-{Math.floor(100000 + Math.random() * 900000)}<br />
              <strong>Estado:</strong> Aguardando validação presencial das partes
            </div>

            <button
              onClick={onClose}
              style={{
                background: '#0284c7', color: '#ffffff', border: 'none', padding: '12px',
                borderRadius: '8px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', marginTop: '8px'
              }}
            >
              Concluir e Voltar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}