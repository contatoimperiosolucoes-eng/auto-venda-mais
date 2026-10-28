import React, { useState } from 'react';
import { 
  Building2, X, CheckCircle2, ShieldCheck, MapPin, 
  Phone, PlusCircle, Car, ArrowUpRight, BarChart3 
} from 'lucide-react';

export default function StoreProfileModal({ isOpen, onClose, storeVehicles = [] }) {
  const [activeTab, setActiveTab] = useState('stock'); // 'stock' ou 'info'

  if (!isOpen) return null;

  const storeInfo = {
    nome: 'Prime Motors Concessionária',
    cnpj: '45.123.789/0001-90',
    localizacao: 'Av. das Américas, 4500 - Barra da Tijuca, RJ',
    contacto: '(21) 3456-7890',
    anoFundacao: '2016',
    veiculosVendidos: 340,
    avaliacao: '4.9 ★★★★★'
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1200,
      backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(5px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
    }}>
      <div style={{
        background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px',
        width: '100%', maxWidth: '850px', maxHeight: '90vh', display: 'flex', 
        flexDirection: 'column', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.7)'
      }}>
        {/* Banner do Lojista */}
        <div style={{
          height: '140px', background: 'linear-gradient(135deg, #0369a1, #0284c7)',
          position: 'relative', padding: '20px', display: 'flex', justifyContent: 'space-between'
        }}>
          <button 
            onClick={onClose}
            style={{ 
              position: 'absolute', top: '16px', right: '16px', 
              background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff', 
              borderRadius: '50%', padding: '6px', cursor: 'pointer', display: 'flex' 
            }}
          >
            <X size={18} />
          </button>

          <div style={{ position: 'absolute', bottom: '-35px', left: '24px', display: 'flex', alignItems: 'flex-end', gap: '16px' }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '16px', background: '#0b0f19',
              border: '3px solid #1e293b', display: 'flex', alignItems: 'center', 
              justifyContent: 'center', color: '#38bdf8'
            }}>
              <Building2 size={40} />
            </div>
            <div style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#f8fafc' }}>{storeInfo.nome}</h2>
                <span style={{ 
                  background: 'linear-gradient(135deg, #d97706, #fbbf24)', color: '#090d16', 
                  fontSize: '11px', fontWeight: '800', padding: '2px 8px', borderRadius: '6px' 
                }}>
                  LOJA OFICIAL
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                <MapPin size={12} /> {storeInfo.localizacao}
              </p>
            </div>
          </div>
        </div>

        {/* Barra de Navegação Interna */}
        <div style={{ 
          padding: '48px 24px 0', borderBottom: '1px solid #1e293b', 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center' 
        }}>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button
              onClick={() => setActiveTab('stock')}
              style={{
                background: 'transparent', border: 'none', 
                borderBottom: activeTab === 'stock' ? '2px solid #38bdf8' : '2px solid transparent',
                color: activeTab === 'stock' ? '#38bdf8' : '#94a3b8', 
                fontWeight: '700', padding: '10px 4px', cursor: 'pointer', fontSize: '14px'
              }}
            >
              Stock da Loja ({storeVehicles.length || 3})
            </button>
            <button
              onClick={() => setActiveTab('info')}
              style={{
                background: 'transparent', border: 'none', 
                borderBottom: activeTab === 'info' ? '2px solid #38bdf8' : '2px solid transparent',
                color: activeTab === 'info' ? '#38bdf8' : '#94a3b8', 
                fontWeight: '700', padding: '10px 4px', cursor: 'pointer', fontSize: '14px'
              }}
            >
              Dados da Empresa & Garantias
            </button>
          </div>

          <button
            onClick={() => alert('Fluxo para adicionar novo veículo diretamente pelo painel do lojista!')}
            style={{
              background: '#0284c7', color: '#fff', border: 'none', 
              padding: '8px 14px', borderRadius: '8px', fontWeight: '600', 
              fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
            }}
          >
            <PlusCircle size={16} /> Adicionar Veículo
          </button>
        </div>

        {/* Conteúdo das Abas */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          {activeTab === 'stock' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Resumo do Stock */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '8px' }}>
                <div style={{ background: '#111827', padding: '14px', borderRadius: '10px', border: '1px solid #1f2937' }}>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>Veículos Ativos</div>
                  <div style={{ fontSize: '20px', fontWeight: '800', color: '#38bdf8', marginTop: '4px' }}>
                    {storeVehicles.length || 3}
                  </div>
                </div>
                <div style={{ background: '#111827', padding: '14px', borderRadius: '10px', border: '1px solid #1f2937' }}>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>Visualizações / Mês</div>
                  <div style={{ fontSize: '20px', fontWeight: '800', color: '#34d399', marginTop: '4px' }}>12.450</div>
                </div>
                <div style={{ background: '#111827', padding: '14px', borderRadius: '10px', border: '1px solid #1f2937' }}>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>Vendas Concluídas</div>
                  <div style={{ fontSize: '20px', fontWeight: '800', color: '#f59e0b', marginTop: '4px' }}>{storeInfo.veiculosVendidos}</div>
                </div>
              </div>

              {/* Lista dos Veículos do Lojista */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {(storeVehicles.length > 0 ? storeVehicles : [
                  { id: '1', modelo: 'Civic EXS', marca: 'Honda', ano: 2008, preco: 46000, placa_chassi: 'LVX2I03' },
                  { id: '2', modelo: 'Corolla Altis', marca: 'Toyota', ano: 2021, preco: 139000, placa_chassi: 'XYZ9K99' },
                  { id: '3', modelo: 'Golf GTI', marca: 'Volkswagen', ano: 2022, preco: 185000, placa_chassi: 'BRA2E19' }
                ]).map((car) => (
                  <div 
                    key={car.id}
                    style={{
                      background: '#111827', border: '1px solid #1f2937', borderRadius: '10px',
                      padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Car size={20} color="#38bdf8" />
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '14px', color: '#f8fafc' }}>
                          {car.marca} {car.modelo} ({car.ano})
                        </div>
                        <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                          Chassi/Placa: {car.placa_chassi}
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <span style={{ fontWeight: '800', color: '#38bdf8', fontSize: '15px' }}>
                        R$ {Number(car.preco).toLocaleString('pt-BR')}
                      </span>
                      <span style={{ 
                        fontSize: '11px', background: '#064e3b', color: '#34d399', 
                        padding: '4px 8px', borderRadius: '6px', fontWeight: '700' 
                      }}>
                        PUBLICADO
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Aba de Dados e Credenciais */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: '12px', padding: '18px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#f8fafc', marginBottom: '12px' }}>
                  Credenciais Jurídicas
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', fontSize: '13px' }}>
                  <div>
                    <span style={{ color: '#94a3b8' }}>CNPJ Registado: </span>
                    <strong style={{ color: '#e2e8f0' }}>{storeInfo.cnpj}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#94a3b8' }}>Telefone Comercial: </span>
                    <strong style={{ color: '#e2e8f0' }}>{storeInfo.contacto}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#94a3b8' }}>Empresa no Mercado Desde: </span>
                    <strong style={{ color: '#e2e8f0' }}>{storeInfo.anoFundacao}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#94a3b8' }}>Classificação Média: </span>
                    <strong style={{ color: '#34d399' }}>{storeInfo.avaliacao}</strong>
                  </div>
                </div>
              </div>

              <div style={{ background: 'rgba(2, 132, 199, 0.08)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontWeight: '700', fontSize: '14px', marginBottom: '6px' }}>
                  <ShieldCheck size={18} /> Vantagens da Loja Credenciada AutoVenda+
                </div>
                <ul style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.6', margin: 0, paddingLeft: '20px' }}>
                  <li>Garantia mecânica de 90 dias obrigatória incluída em todos os contratos.</li>
                  <li>Laudo cautelar emitido e validado para 100% dos veículos em stock.</li>
                  <li>Atendimento presencial no showroom com custódia e emissão imediata de nota fiscal.</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}