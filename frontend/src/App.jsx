import React, { useState, useEffect, useMemo } from 'react';
import { 
  Car, LogIn, CheckCircle2, ShieldCheck, 
  Search, Fuel, Gauge, Camera, LogOut,
  AlertTriangle, TrendingDown, TrendingUp,
  Sparkles, Zap, Building2, BatteryCharging,
  PlusCircle, ArrowLeft, Edit3, Tag, XCircle
} from 'lucide-react';
import VehicleDetails from './VehicleDetails';
import PhotoGuideModal from './PhotoGuideModal';
import AuthModal from './AuthModal';
import StoreProfileModal from './StoreProfileModal';
import CreateVehicleAd from './CreateVehicleAd';
import MyAdsModal from './MyAdsModal';
import { getFipeComparison } from './fipeService';

const API_BASE = 'http://localhost:3000/api';
const DEFAULT_CAR_IMAGE = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80';

const SAMPLE_VEHICLES = [
  {
    id: 'sample-ebike-1',
    tipo: 'eletrico',
    marca: 'Caloi',
    modelo: 'E-Vibe City Tour 350W',
    ano: 2024,
    preco: 6900,
    quilometragem: 450,
    placa_chassi: 'SR-BAT9082X',
    plano_destaque: 'diamante',
    potencia: '350W',
    autonomia: '60 km',
    fotos: ['https://images.unsplash.com/photo-1571068316344-75bc76f77890?auto=format&fit=crop&w=800&q=80']
  },
  {
    id: 'sample-scooter-1',
    tipo: 'eletrico',
    marca: 'Glova / Niu',
    modelo: 'Scooter Autopropelido KQi3',
    ano: 2023,
    preco: 4200,
    quilometragem: 800,
    placa_chassi: 'SR-NIU44120',
    plano_destaque: 'ouro',
    potencia: '500W',
    autonomia: '45 km',
    fotos: ['https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80']
  },
  {
    id: 'sample-moto-1',
    tipo: 'moto',
    marca: 'Honda',
    modelo: 'CB 500F ABS',
    ano: 2022,
    preco: 38500,
    quilometragem: 12000,
    placa_chassi: 'MOT-5A22',
    plano_destaque: 'ouro',
    fotos: ['https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80']
  },
  {
    id: 'sample-utilitario-1',
    tipo: 'comercial',
    marca: 'Fiat',
    modelo: 'Strada Freedom 1.3',
    ano: 2023,
    preco: 92000,
    quilometragem: 24000,
    placa_chassi: 'STR-9B33',
    plano_destaque: 'diamante',
    fotos: ['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80']
  }
];

export default function App() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showPhotoGuide, setShowPhotoGuide] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showStoreModal, setShowStoreModal] = useState(false);
  const [showMyAdsModal, setShowMyAdsModal] = useState(false);
  
  const [showCreateAd, setShowCreateAd] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState('todos');
  const [maxPrice, setMaxPrice] = useState('');
  const [minAno, setMinAno] = useState('');
  const [sortBy, setSortBy] = useState('destaque');

  const currentUserId = localStorage.getItem('userId') || 'meu_usuario_id';

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/vehicles`);
      const data = await res.json();
      
      const rawList = Array.isArray(data) && data.length > 0 ? data : [];
      const combined = [...rawList, ...SAMPLE_VEHICLES];

      const enrichedData = combined.map((v, index) => ({
        ...v,
        plano_destaque: v.plano_destaque || (index === 0 ? 'diamante' : index === 1 ? 'ouro' : 'gratis')
      }));

      setVehicles(enrichedData);
    } catch (err) {
      console.error('Erro ao carregar veículos:', err);
      setVehicles(SAMPLE_VEHICLES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleAuthSuccess = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
    setShowCreateAd(false);
    setEditingVehicle(null);
    setShowMyAdsModal(false);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setFilterTipo('todos');
    setMaxPrice('');
    setMinAno('');
    setSortBy('destaque');
  };

  const hasActiveFilters = Boolean(
    searchTerm || filterTipo !== 'todos' || maxPrice || minAno || sortBy !== 'destaque'
  );

  const filteredVehicles = useMemo(() => {
    const list = vehicles.filter((v) => {
      if (v.status === 'pausado' || v.status === 'vendido') return false;

      const matchSearch = `${v.marca || ''} ${v.modelo || ''}`.toLowerCase().includes(searchTerm.toLowerCase());
      
      const vTipo = (v.tipo || 'carro').toLowerCase();
      const matchTipo = 
        filterTipo === 'todos' ||
        (filterTipo === 'carro' && (vTipo === 'carro' || vTipo === 'automovel')) ||
        (filterTipo === 'moto' && (vTipo === 'moto' || vTipo === 'mota')) ||
        (filterTipo === 'comercial' && (vTipo === 'comercial' || vTipo === 'utilitario' || vTipo === 'caminhao')) ||
        (filterTipo === 'eletrico' && (vTipo === 'eletrico' || vTipo === 'ebike' || vTipo === 'autopropelido' || vTipo === 'bicicleta'));

      const matchPrice = maxPrice === '' || Number(v.preco) <= Number(maxPrice);
      const matchAno = minAno === '' || Number(v.ano) >= Number(minAno);

      return matchSearch && matchTipo && matchPrice && matchAno;
    });

    const pesoPlano = { diamante: 3, ouro: 2, prata: 1.5, gratis: 1 };

    return list.sort((a, b) => {
      if (sortBy === 'destaque') {
        const pesoDiff = (pesoPlano[b.plano_destaque] || 1) - (pesoPlano[a.plano_destaque] || 1);
        if (pesoDiff !== 0) return pesoDiff;
        return Number(b.id) - Number(a.id);
      }

      if (sortBy === 'preco_asc') {
        return Number(a.preco) - Number(b.preco);
      }

      if (sortBy === 'preco_desc') {
        return Number(b.preco) - Number(a.preco);
      }

      if (sortBy === 'ano_desc') {
        return Number(b.ano) - Number(a.ano);
      }

      if (sortBy === 'km_asc') {
        const kmA = Number(a.quilometragem || 0);
        const kmB = Number(b.quilometragem || 0);
        return kmA - kmB;
      }

      return 0;
    });
  }, [vehicles, searchTerm, filterTipo, maxPrice, minAno, sortBy]);

  if (selectedVehicle) {
    return (
      <VehicleDetails 
        vehicle={selectedVehicle} 
        onBack={() => setSelectedVehicle(null)} 
      />
    );
  }

  const isFormOpen = showCreateAd || Boolean(editingVehicle);

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #090d16, #0f172a)', color: '#f8fafc', padding: '24px 16px' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        
        {/* Cabeçalho */}
        <header style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', paddingBottom: '24px', borderBottom: '1px solid #1e293b' }}>
          <div 
            style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
            onClick={() => {
              setShowCreateAd(false);
              setEditingVehicle(null);
            }}
          >
            <div style={{ background: '#0284c7', padding: '10px', borderRadius: '12px', display: 'flex' }}>
              <Car size={28} color="#ffffff" />
            </div>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: '800', letterSpacing: '-0.5px' }}>AutoVenda<span style={{ color: '#38bdf8' }}>+</span></h1>
              <p style={{ fontSize: '12px', color: '#64748b' }}>Classificados Automotivos com Destaque Inteligente</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowStoreModal(true)}
              style={{
                background: '#1e293b',
                color: '#38bdf8',
                border: '1px solid #334155',
                padding: '10px 16px',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Building2 size={16} /> Lojas & Concessionárias
            </button>

            <button
              onClick={() => setShowMyAdsModal(true)}
              style={{
                background: '#1e293b',
                color: '#f8fafc',
                border: '1px solid #334155',
                padding: '10px 14px',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Tag size={16} color="#38bdf8" /> Os Meus Anúncios
            </button>

            {token ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ background: '#064e3b', color: '#34d399', fontSize: '13px', padding: '6px 12px', borderRadius: '9999px', display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: '500' }}>
                  <CheckCircle2 size={16} /> Sessão Ativa
                </span>

                <button 
                  onClick={() => {
                    if (isFormOpen) {
                      setShowCreateAd(false);
                      setEditingVehicle(null);
                    } else {
                      setShowCreateAd(true);
                    }
                  }}
                  style={{ 
                    background: isFormOpen ? '#334155' : 'linear-gradient(135deg, #10b981, #059669)', 
                    color: '#ffffff', 
                    border: 'none', 
                    padding: '10px 18px', 
                    borderRadius: '8px', 
                    fontWeight: '700', 
                    cursor: 'pointer', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    boxShadow: isFormOpen ? 'none' : '0 4px 12px rgba(16, 185, 129, 0.3)'
                  }}
                >
                  {isFormOpen ? <ArrowLeft size={18} /> : <PlusCircle size={18} />}
                  {isFormOpen ? 'Voltar para Vitrine' : 'Criar Anúncio'}
                </button>

                <button 
                  onClick={() => setShowPhotoGuide(true)}
                  title="Testar Câmera Guiada"
                  style={{ background: '#1e293b', color: '#38bdf8', border: '1px solid #334155', padding: '10px', borderRadius: '8px', cursor: 'pointer', display: 'flex' }}
                >
                  <Camera size={18} />
                </button>

                <button
                  onClick={handleLogout}
                  title="Terminar Sessão"
                  style={{ background: '#1e293b', color: '#94a3b8', border: '1px solid #334155', padding: '10px', borderRadius: '8px', cursor: 'pointer', display: 'flex' }}
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowAuthModal(true)}
                style={{ 
                  background: 'linear-gradient(135deg, #0284c7, #2563eb)', 
                  color: '#ffffff', border: 'none', padding: '10px 20px', 
                  borderRadius: '8px', fontWeight: '600', cursor: 'pointer', 
                  display: 'flex', alignItems: 'center', gap: '8px',
                  boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)'
                }}
              >
                <LogIn size={18} /> Entrar / Registar
              </button>
            )}
          </div>
        </header>

        {/* CORPO: ALTERNA ENTRE FORMULÁRIO E VITRINE */}
        {isFormOpen ? (
          <div style={{ marginTop: '32px' }}>
            <CreateVehicleAd 
              token={token}
              initialData={editingVehicle}
              onCreated={() => {
                setShowCreateAd(false);
                setEditingVehicle(null);
                fetchVehicles();
              }}
            />
          </div>
        ) : (
          <>
            <section style={{ 
              margin: '32px 0 24px', 
              background: '#0f172a', 
              padding: '18px 20px', 
              borderRadius: '16px', 
              border: '1px solid #1e293b', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '14px' 
            }}>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
                <div style={{ flex: '1 1 280px', position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Search size={18} color="#64748b" style={{ position: 'absolute', left: '12px' }} />
                  <input 
                    type="text" 
                    placeholder="Pesquisar por marca, modelo, e-bike..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px 10px 38px', borderRadius: '8px', border: '1px solid #334155', background: '#1e293b', color: '#fff', fontSize: '14px', boxSizing: 'border-box' }}
                  />
                </div>

                <select 
                  value={filterTipo} 
                  onChange={(e) => setFilterTipo(e.target.value)}
                  style={{ flex: '0 1 200px', padding: '10px 14px', borderRadius: '8px', border: '1px solid #334155', background: '#1e293b', color: '#fff', fontSize: '14px' }}
                >
                  <option value="todos">Todas as Categorias</option>
                  <option value="carro">Carros</option>
                  <option value="moto">Motos</option>
                  <option value="eletrico">Autopropelidos & E-Bikes ⚡</option>
                  <option value="comercial">Utilitários e Carga</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
                  <input 
                    type="number" 
                    placeholder="Preço Máx (R$)" 
                    value={maxPrice} 
                    onChange={(e) => setMaxPrice(e.target.value)}
                    style={{ width: '140px', padding: '9px 12px', borderRadius: '8px', border: '1px solid #334155', background: '#1e293b', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }}
                  />

                  <input 
                    type="number" 
                    placeholder="Ano Mínimo" 
                    value={minAno} 
                    onChange={(e) => setMinAno(e.target.value)}
                    style={{ width: '120px', padding: '9px 12px', borderRadius: '8px', border: '1px solid #334155', background: '#1e293b', color: '#fff', fontSize: '13px', boxSizing: 'border-box' }}
                  />

                  {hasActiveFilters && (
                    <button
                      onClick={handleClearFilters}
                      style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        color: '#ef4444',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <XCircle size={14} /> Limpar Filtros
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '13px', color: '#94a3b8' }}>Ordenar:</span>
                  <select 
                    value={sortBy} 
                    onChange={(e) => setSortBy(e.target.value)}
                    style={{ padding: '9px 12px', borderRadius: '8px', border: '1px solid #38bdf8', background: '#1e293b', color: '#38bdf8', fontSize: '13px', fontWeight: '600' }}
                  >
                    <option value="destaque">Destaques e Relevância</option>
                    <option value="preco_asc">Menor Preço</option>
                    <option value="preco_desc">Maior Preço</option>
                    <option value="ano_desc">Mais Novos (Ano)</option>
                    <option value="km_asc">Menor Quilometragem</option>
                  </select>
                </div>
              </div>

            </section>

            <main>
              {loading ? (
                <p style={{ textAlign: 'center', color: '#64748b', padding: '40px' }}>A carregar anúncios...</p>
              ) : filteredVehicles.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', background: '#0f172a', borderRadius: '16px', border: '1px dashed #334155' }}>
                  <Car size={48} color="#64748b" style={{ margin: '0 auto 12px' }} />
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#cbd5e1' }}>Nenhum anúncio encontrado</h3>
                  <p style={{ fontSize: '13px', color: '#64748b', marginTop: '6px' }}>
                    Nenhum veículo corresponde aos filtros selecionados.
                  </p>
                  <button 
                    onClick={handleClearFilters}
                    style={{ marginTop: '16px', background: '#0284c7', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
                  >
                    Redefinir Filtros
                  </button>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                  {filteredVehicles.map((v) => {
                    const fipe = getFipeComparison(v);
                    const isDiamante = v.plano_destaque === 'diamante';
                    const isOuro = v.plano_destaque === 'ouro';
                    const isEletrico = v.tipo === 'eletrico';

                    return (
                      <article 
                        key={v.id} 
                        onClick={() => setSelectedVehicle(v)}
                        style={{ 
                          background: '#111827', 
                          borderRadius: '14px', 
                          border: isDiamante ? '2px solid #38bdf8' : isOuro ? '2px solid #f59e0b' : '1px solid #1f2937', 
                          boxShadow: isDiamante ? '0 0 20px rgba(56, 189, 248, 0.25)' : isOuro ? '0 0 15px rgba(245, 158, 11, 0.2)' : 'none',
                          overflow: 'hidden', 
                          display: 'flex', 
                          flexDirection: 'column', 
                          cursor: 'pointer',
                          position: 'relative'
                        }}
                      >
                        {isDiamante && (
                          <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 10, background: 'linear-gradient(135deg, #0284c7, #38bdf8)', color: '#090d16', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px', boxShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
                            <Zap size={14} fill="#090d16" /> TURBO DIAMANTE
                          </div>
                        )}
                        {isOuro && (
                          <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 10, background: 'linear-gradient(135deg, #d97706, #fbbf24)', color: '#090d16', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px', boxShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>
                            <Sparkles size={14} fill="#090d16" /> DESTAQUE OURO
                          </div>
                        )}

                        <div style={{ height: '190px', width: '100%', position: 'relative', overflow: 'hidden', background: '#0f172a' }}>
                          <img 
                            src={v.fotos?.[0] || DEFAULT_CAR_IMAGE} 
                            alt={v.modelo} 
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => { e.target.src = DEFAULT_CAR_IMAGE; }}
                          />
                          <span style={{ position: 'absolute', top: '12px', right: '12px', background: 'rgba(15, 23, 42, 0.85)', color: '#38bdf8', fontSize: '12px', fontWeight: '700', padding: '4px 10px', borderRadius: '8px' }}>
                            {v.ano}
                          </span>
                        </div>

                        {fipe && (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '8px 14px',
                            background: fipe.isSuspeito ? 'rgba(239, 68, 68, 0.18)' : '#0b0f19',
                            borderBottom: '1px solid #1f2937',
                            fontSize: '12px'
                          }}>
                            <span style={{ color: '#94a3b8' }}>
                              Ref. Mercado: <strong style={{ color: '#e2e8f0' }}>R$ {fipe.precoFipe.toLocaleString('pt-BR')}</strong>
                            </span>

                            {fipe.isSuspeito ? (
                              <span style={{ color: '#ef4444', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <AlertTriangle size={14} /> Preço Suspeito
                              </span>
                            ) : (
                              <span style={{ 
                                color: fipe.percentual <= 0 ? '#34d399' : '#f59e0b', 
                                fontWeight: '600', 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: '4px' 
                              }}>
                                {fipe.percentual <= 0 ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
                                {fipe.textoComparacao}
                              </span>
                            )}
                          </div>
                        )}

                        <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', flexGrow: 1, gap: '12px' }}>
                          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#f8fafc' }}>
                            {v.marca} {v.modelo}
                          </h3>

                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', background: '#0b0f19', padding: '10px 12px', borderRadius: '8px', fontSize: '12px', color: '#94a3b8' }}>
                            {isEletrico ? (
                              <>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <BatteryCharging size={14} color="#38bdf8" />
                                  <span>{v.potencia || '350W'}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <Gauge size={14} color="#34d399" />
                                  <span>{v.autonomia || '50 km'}</span>
                                </div>
                              </>
                            ) : (
                              <>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <Gauge size={14} color="#64748b" />
                                  <span>{v.quilometragem ? `${Number(v.quilometragem).toLocaleString('pt-BR')} km` : '0 km'}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <Fuel size={14} color="#64748b" />
                                  <span>{v.placa_chassi ? v.placa_chassi : 'Chassi conf.'}</span>
                                </div>
                              </>
                            )}
                          </div>

                          <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid #1f2937', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '20px', fontWeight: '800', color: '#38bdf8' }}>
                              R$ {Number(v.preco).toLocaleString('pt-BR')}
                            </span>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              {(!String(v.id).startsWith('sample-')) && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingVehicle(v);
                                  }}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    background: '#1e293b',
                                    color: '#38bdf8',
                                    border: '1px solid #334155',
                                    padding: '5px 10px',
                                    borderRadius: '6px',
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                  }}
                                >
                                  <Edit3 size={13} /> Editar
                                </button>
                              )}

                              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#34d399', background: '#064e3b33', padding: '5px 8px', borderRadius: '6px' }}>
                                <ShieldCheck size={14} /> Detalhes &gt;
                              </span>
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </main>
          </>
        )}

        {/* Modal de 14 Fotos */}
        {showPhotoGuide && (
          <PhotoGuideModal 
            onClose={() => setShowPhotoGuide(false)} 
            onComplete={(capturedPhotos) => {
              alert(`${capturedPhotos.length} fotos registadas com sucesso!`);
              setShowPhotoGuide(false);
            }}
          />
        )}

        {/* Modal de Autenticação */}
        <AuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={handleAuthSuccess}
        />

        {/* Modal da Área de Lojas & Concessionárias */}
        <StoreProfileModal 
          isOpen={showStoreModal} 
          onClose={() => setShowStoreModal(false)} 
          storeVehicles={vehicles}
        />

        {/* Modal Os Meus Anúncios */}
        <MyAdsModal 
          isOpen={showMyAdsModal}
          onClose={() => setShowMyAdsModal(false)}
          vehicles={vehicles}
          currentUserId={currentUserId}
          onEdit={(vehicle) => {
            setShowMyAdsModal(false);
            setEditingVehicle(vehicle);
          }}
          onRefresh={fetchVehicles}
        />

      </div>
    </div>
  );
}