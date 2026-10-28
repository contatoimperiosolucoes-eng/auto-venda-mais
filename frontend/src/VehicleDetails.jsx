import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, ShieldCheck, CheckCircle2, UserCheck, 
  Calendar, PhoneCall, AlertTriangle, MessageSquare, 
  CreditCard, Award, Fuel, Gauge, Eye, TrendingDown, TrendingUp
} from 'lucide-react';
import ChatModal from './ChatModal';
import EscrowModal from './EscrowModal';
import { fetchLiveFipePrice, calculateFipeRatio } from './fipeService';

export default function VehicleDetails({ vehicle, onBack, onStartEscrow }) {
  const [showChat, setShowChat] = useState(false);
  const [showEscrowModal, setShowEscrowModal] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  const [fipeData, setFipeData] = useState(null);
  const [loadingFipe, setLoadingFipe] = useState(true);

  // Consulta FIPE em direto
  useEffect(() => {
    let isMounted = true;
    async function loadFipe() {
      setLoadingFipe(true);
      const res = await fetchLiveFipePrice(vehicle);
      if (isMounted && res) {
        const ratio = calculateFipeRatio(vehicle.preco, res.precoFipe);
        setFipeData({ ...res, ...ratio });
      }
      if (isMounted) setLoadingFipe(false);
    }
    loadFipe();
    return () => { isMounted = false; };
  }, [vehicle]);

  const seller = vehicle.vendedor || {
    nome: 'Carlos Eduardo M.',
    membroDesde: 'Outubro de 2022',
    tempoResposta: 'Responde em menos de 1 hora',
    vendasConcluidas: 14,
    identidadeVerificada: true,
    telefoneVerificado: true,
    documentoVerificado: true,
    reputacao: 'Excelente (4.9 / 5.0)'
  };

  const fotos = vehicle.fotos && vehicle.fotos.length > 0 
    ? vehicle.fotos 
    : ['https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80'];

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '16px 0 48px' }}>
      <button 
        onClick={onBack}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'transparent', border: 'none', color: '#38bdf8',
          fontSize: '15px', fontWeight: '600', cursor: 'pointer', marginBottom: '20px'
        }}
      >
        <ArrowLeft size={18} /> Voltar aos anúncios
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '32px', alignItems: 'start' }}>
        
        {/* Coluna Esquerda: Galeria, Ficha e FIPE Oficial */}
        <div>
          <div style={{ width: '100%', height: '420px', borderRadius: '16px', overflow: 'hidden', background: '#0b0f19', border: '1px solid #1e293b' }}>
            <img 
              src={fotos[selectedPhotoIndex]} 
              alt={vehicle.modelo} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          {fotos.length > 1 && (
            <div style={{ display: 'flex', gap: '10px', marginTop: '12px', overflowX: 'auto', paddingBottom: '6px' }}>
              {fotos.map((foto, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedPhotoIndex(idx)}
                  style={{
                    width: '80px', height: '60px', borderRadius: '8px', overflow: 'hidden',
                    border: selectedPhotoIndex === idx ? '2px solid #38bdf8' : '1px solid #334155',
                    cursor: 'pointer', padding: 0, background: '#0b0f19', flexShrink: 0
                  }}
                >
                  <img src={foto} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}

          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px', marginTop: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <span style={{ fontSize: '13px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {vehicle.marca} • {vehicle.tipo || 'Carro'}
                </span>
                <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#f8fafc', marginTop: '4px' }}>
                  {vehicle.modelo}
                </h1>
              </div>
              <div style={{ fontSize: '32px', fontWeight: '900', color: '#38bdf8' }}>
                R$ {Number(vehicle.preco).toLocaleString('pt-BR')}
              </div>
            </div>

            {/* Bloco Oficial da FIPE em Tempo Real */}
            <div style={{
              background: fipeData?.isSuspeito ? 'rgba(239, 68, 68, 0.12)' : '#1e293b55',
              border: fipeData?.isSuspeito ? '1px solid #ef4444' : '1px solid #334155',
              borderRadius: '12px',
              padding: '16px',
              margin: '20px 0 10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div>
                <div style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>Referência Oficial FIPE</span>
                  {fipeData?.mesReferencia && (
                    <span style={{ background: '#0b0f19', padding: '2px 8px', borderRadius: '4px', color: '#38bdf8', fontSize: '11px' }}>
                      {fipeData.mesReferencia}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: '20px', fontWeight: '800', color: '#f8fafc', marginTop: '4px' }}>
                  {loadingFipe ? 'A consultar FIPE...' : `R$ ${fipeData?.precoFipe.toLocaleString('pt-BR')}`}
                </div>
              </div>

              {!loadingFipe && fipeData && (
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '700',
                    background: fipeData.isSuspeito ? '#ef4444' : fipeData.percentual <= 0 ? '#064e3b' : '#78350f',
                    color: fipeData.isSuspeito ? '#ffffff' : fipeData.percentual <= 0 ? '#34d399' : '#fbbf24'
                  }}>
                    {fipeData.isSuspeito ? <AlertTriangle size={16} /> : fipeData.percentual <= 0 ? <TrendingDown size={16} /> : <TrendingUp size={16} />}
                    {fipeData.textoComparacao}
                  </div>
                  {fipeData.isSuspeito && (
                    <div style={{ fontSize: '11px', color: '#fca5a5', marginTop: '4px' }}>
                      Atenção: Preço muito abaixo do mercado oficial.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Grid de Especificações */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', margin: '20px 0', background: '#1e293b33', padding: '16px', borderRadius: '12px' }}>
              <div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>Ano</div>
                <div style={{ fontSize: '15px', fontWeight: '700', color: '#f8fafc', marginTop: '2px' }}>{vehicle.ano}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>Quilometragem</div>
                <div style={{ fontSize: '15px', fontWeight: '700', color: '#f8fafc', marginTop: '2px' }}>
                  {vehicle.quilometragem ? `${Number(vehicle.quilometragem).toLocaleString('pt-BR')} km` : '0 km'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>Placa / Chassi</div>
                <div style={{ fontSize: '15px', fontWeight: '700', color: '#34d399', marginTop: '2px' }}>
                  {vehicle.placa_chassi || 'Verificado'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>Vistoria 14 Fotos</div>
                <div style={{ fontSize: '15px', fontWeight: '700', color: '#38bdf8', marginTop: '2px' }}>Completa</div>
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#f8fafc', marginBottom: '8px' }}>Descrição do Anúncio</h3>
              <p style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: '1.6' }}>
                {vehicle.descricao || 'Veículo periciado, com todas as revisões em dia, pneus novos e sem sinistros.'}
              </p>
            </div>
          </div>
        </div>

        {/* Coluna Direita: Caixa de Confiança do Vendedor & Ações */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px', padding: '24px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '16px' }}>
              Sobre o Vendedor
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
              <div style={{ 
                width: '52px', height: '52px', borderRadius: '50%', background: 'linear-gradient(135deg, #0284c7, #2563eb)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: '800', color: '#fff' 
              }}>
                {seller.nome.charAt(0)}
              </div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#f8fafc' }}>{seller.nome}</div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>No AutoVenda+ desde {seller.membroDesde}</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: '#111827', padding: '14px', borderRadius: '12px', border: '1px solid #1f2937' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#34d399' }}>
                <CheckCircle2 size={16} />
                <span style={{ color: '#e2e8f0', fontWeight: '500' }}>Identidade Verificada (CPF)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#34d399' }}>
                <CheckCircle2 size={16} />
                <span style={{ color: '#e2e8f0', fontWeight: '500' }}>Telefone Validado via SMS</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#34d399' }}>
                <ShieldCheck size={16} />
                <span style={{ color: '#e2e8f0', fontWeight: '500' }}>Sem pendências no Chassi</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#38bdf8' }}>
                <Award size={16} />
                <span style={{ color: '#e2e8f0', fontWeight: '500' }}>{seller.vendasConcluidas} negociações concluídas</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#94a3b8', marginTop: '14px' }}>
              <Eye size={14} color="#64748b" />
              <span>{seller.tempoResposta}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
              <button
                onClick={() => setShowChat(true)}
                style={{
                  background: '#0284c7', color: '#ffffff', border: 'none', padding: '12px',
                  borderRadius: '10px', fontWeight: '700', fontSize: '14px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)'
                }}
              >
                <MessageSquare size={18} /> Conversar no Chat Seguro
              </button>

              <button
                onClick={() => setShowEscrowModal(true)}
                style={{
                  background: '#10b981', color: '#ffffff', border: 'none', padding: '12px',
                  borderRadius: '10px', fontWeight: '700', fontSize: '14px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
                }}
              >
                <CreditCard size={18} /> Comprar com Custódia Protegida
              </button>
            </div>
          </div>

          <div style={{ background: 'rgba(2, 132, 199, 0.08)', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: '16px', padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#38bdf8', fontWeight: '700', fontSize: '14px', marginBottom: '6px' }}>
              <ShieldCheck size={20} /> Garantia AutoVenda+
            </div>
            <p style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.5' }}>
              O seu dinheiro só é libertado ao vendedor após você conferir o carro pessoalmente e validar a documentação no cartório.
            </p>
          </div>
        </aside>
      </div>

      {showChat && (
        <ChatModal 
          vehicle={vehicle} 
          seller={seller} 
          onClose={() => setShowChat(false)} 
        />
      )}

      <EscrowModal 
        vehicle={vehicle} 
        isOpen={showEscrowModal} 
        onClose={() => setShowEscrowModal(false)} 
      />
    </div>
  );
}