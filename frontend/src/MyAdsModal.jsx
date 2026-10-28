import React from 'react';
import { X, Edit3, Trash2, CheckCircle2, PauseCircle, PlayCircle } from 'lucide-react';

const API_BASE = 'http://localhost:3000/api';

export default function MyAdsModal({ isOpen, onClose, vehicles, currentUserId, onEdit, onRefresh }) {
  if (!isOpen) return null;

  // Filtra apenas os anúncios pertencentes à conta com sessão ativa
  const myVehicles = vehicles.filter((v) => v.userId === currentUserId);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`${API_BASE}/vehicles/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        onRefresh();
      }
    } catch (err) {
      alert('Erro ao atualizar o estado do anúncio.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem a certeza de que pretende eliminar este anúncio?')) return;

    try {
      const res = await fetch(`${API_BASE}/vehicles/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        onRefresh();
      }
    } catch (err) {
      alert('Erro ao eliminar anúncio.');
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px'
    }}>
      <div style={{
        background: '#0f172a', borderRadius: '16px', border: '1px solid #1e293b',
        width: '100%', maxWidth: '750px', maxHeight: '85vh', display: 'flex', flexDirection: 'column'
      }}>
        {/* Cabeçalho do Modal */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #1e293b' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#f8fafc', margin: 0 }}>Os Meus Anúncios</h2>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0' }}>Faça a gestão dos seus veículos publicados</p>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Lista de Anúncios */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {myVehicles.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>
              <p>Ainda não publicou nenhum anúncio nesta conta.</p>
            </div>
          ) : (
            myVehicles.map((v) => {
              const status = v.status || 'ativo';
              return (
                <div key={v.id} style={{
                  background: '#111827', border: '1px solid #1f2937', borderRadius: '12px',
                  padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <img 
                      src={v.fotos?.[0] || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'} 
                      alt={v.modelo}
                      style={{ width: '64px', height: '48px', objectFit: 'cover', borderRadius: '6px' }}
                    />
                    <div>
                      <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#f8fafc', margin: 0 }}>
                        {v.marca} {v.modelo} ({v.ano})
                      </h4>
                      <p style={{ fontSize: '13px', color: '#38bdf8', fontWeight: '600', margin: '4px 0 0' }}>
                        R$ {Number(v.preco).toLocaleString('pt-BR')}
                      </p>
                      <span style={{
                        fontSize: '11px', fontWeight: '600', padding: '2px 8px', borderRadius: '4px',
                        display: 'inline-block', marginTop: '4px',
                        background: status === 'vendido' ? '#14532d' : status === 'pausado' ? '#78350f' : '#064e3b',
                        color: status === 'vendido' ? '#4ade80' : status === 'pausado' ? '#fcd34d' : '#34d399'
                      }}>
                        {status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  {/* Ações */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      onClick={() => onEdit(v)}
                      style={{ background: '#1e293b', border: '1px solid #334155', color: '#38bdf8', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: '600' }}
                    >
                      <Edit3 size={14} /> Editar
                    </button>

                    {status === 'ativo' ? (
                      <button
                        onClick={() => handleStatusChange(v.id, 'pausado')}
                        title="Pausar anúncio"
                        style={{ background: '#1e293b', border: '1px solid #334155', color: '#f59e0b', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
                      >
                        <PauseCircle size={16} />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStatusChange(v.id, 'ativo')}
                        title="Ativar anúncio"
                        style={{ background: '#1e293b', border: '1px solid #334155', color: '#34d399', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
                      >
                        <PlayCircle size={16} />
                      </button>
                    )}

                    <button
                      onClick={() => handleStatusChange(v.id, 'vendido')}
                      title="Marcar como Vendido"
                      style={{ background: '#1e293b', border: '1px solid #334155', color: '#10b981', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
                    >
                      <CheckCircle2 size={16} />
                    </button>

                    <button
                      onClick={() => handleDelete(v.id)}
                      title="Eliminar anúncio"
                      style={{ background: '#1e293b', border: '1px solid #7f1d1d', color: '#f87171', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}