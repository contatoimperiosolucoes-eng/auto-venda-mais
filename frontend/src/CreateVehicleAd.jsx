import React, { useState } from 'react';
import { Camera, Sparkles, Zap } from 'lucide-react';
import PhotoGuideModal from './PhotoGuideModal';

const API_BASE = 'http://localhost:3000/api';

export default function CreateVehicleAd({ token, onCreated, initialData = null }) {
  const isEditing = Boolean(initialData);

  const [step, setStep] = useState(1);
  const [fotos, setFotos] = useState(initialData?.fotos || []);
  const [showPhotoGuide, setShowPhotoGuide] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    tipo: initialData?.tipo || 'carro',
    marca: initialData?.marca || '',
    modelo: initialData?.modelo || '',
    ano: initialData?.ano || '',
    preco: initialData?.preco || '',
    quilometragem: initialData?.quilometragem || '',
    placa_chassi: initialData?.placa_chassi || '',
    potencia: initialData?.potencia || '',
    autonomia: initialData?.autonomia || '',
    descricao: initialData?.descricao || '',
    plano_destaque: initialData?.plano_destaque || 'gratis'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = (e) => {
    e.preventDefault();
    setStep((prev) => prev + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const url = isEditing 
      ? `${API_BASE}/vehicles/${initialData.id}` 
      : `${API_BASE}/vehicles`;

    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ...formData, fotos })
      });

      if (res.ok) {
        alert(isEditing ? 'Anúncio atualizado com sucesso!' : 'Anúncio criado com sucesso!');
        if (onCreated) onCreated();
      } else {
        const data = await res.json();
        alert(data.error || 'Erro ao processar anúncio');
      }
    } catch (err) {
      alert('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 16px' }}>
      <form onSubmit={step === 3 ? handleSubmit : handleNext} style={{ background: '#0f172a', borderRadius: '16px', padding: '32px', border: '1px solid #1e293b' }}>
        
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#f8fafc', marginBottom: '8px' }}>
              {isEditing ? 'Editar Dados do Veículo' : '1. Dados do Veículo'}
            </h2>
            <p style={{ color: '#94a3b8', marginBottom: '24px', fontSize: '13px' }}>Preencha as informações básicas do anúncio.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '6px' }}>Categoria</label>
                <select name="tipo" value={formData.tipo} onChange={handleChange} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #334155', background: '#1e293b', color: '#fff', fontSize: '14px' }}>
                  <option value="carro">Carros</option>
                  <option value="moto">Motos</option>
                  <option value="eletrico">Autopropelidos & E-Bikes ⚡</option>
                  <option value="comercial">Utilitários e Carga</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '6px' }}>Marca</label>
                  <input required type="text" name="marca" value={formData.marca} onChange={handleChange} placeholder="Ex: Honda" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #334155', background: '#1e293b', color: '#fff', fontSize: '14px', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '6px' }}>Modelo</label>
                  <input required type="text" name="modelo" value={formData.modelo} onChange={handleChange} placeholder="Ex: Civic" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #334155', background: '#1e293b', color: '#fff', fontSize: '14px', boxSizing: 'border-box' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '6px' }}>Ano</label>
                  <input required type="number" name="ano" value={formData.ano} onChange={handleChange} placeholder="Ex: 2023" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #334155', background: '#1e293b', color: '#fff', fontSize: '14px', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '6px' }}>Preço (R$)</label>
                  <input required type="number" name="preco" value={formData.preco} onChange={handleChange} placeholder="Ex: 50000" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #334155', background: '#1e293b', color: '#fff', fontSize: '14px', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '6px' }}>
                    {formData.tipo === 'eletrico' ? 'Autonomia (km)' : 'Quilometragem'}
                  </label>
                  <input required type="text" name={formData.tipo === 'eletrico' ? 'autonomia' : 'quilometragem'} value={formData.tipo === 'eletrico' ? formData.autonomia : formData.quilometragem} onChange={handleChange} placeholder={formData.tipo === 'eletrico' ? 'Ex: 50' : 'Ex: 10000'} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #334155', background: '#1e293b', color: '#fff', fontSize: '14px', boxSizing: 'border-box' }} />
                </div>
              </div>

              {formData.tipo !== 'eletrico' && (
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '6px' }}>Placa ou Chassi</label>
                  <input required type="text" name="placa_chassi" value={formData.placa_chassi} onChange={handleChange} placeholder="Ex: ABC1D23" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #334155', background: '#1e293b', color: '#fff', fontSize: '14px', boxSizing: 'border-box' }} />
                </div>
              )}

              {formData.tipo === 'eletrico' && (
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: '#94a3b8', marginBottom: '6px' }}>Potência</label>
                  <input required type="text" name="potencia" value={formData.potencia} onChange={handleChange} placeholder="Ex: 350W" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #334155', background: '#1e293b', color: '#fff', fontSize: '14px', boxSizing: 'border-box' }} />
                </div>
              )}

              <button type="submit" style={{ width: '100%', padding: '14px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', marginTop: '16px' }}>
                Avançar para Fotos
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#f8fafc', marginBottom: '8px' }}>2. Galeria do Veículo</h2>
            <p style={{ color: '#94a3b8', marginBottom: '24px', fontSize: '13px' }}>Adicione as fotos do seu anúncio.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <button 
                type="button"
                onClick={() => setShowPhotoGuide(true)}
                style={{ width: '100%', padding: '24px', background: 'rgba(2, 132, 199, 0.1)', border: '2px dashed #0284c7', borderRadius: '12px', color: '#38bdf8', fontSize: '16px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}
              >
                <Camera size={24} /> {fotos.length > 0 ? `${fotos.length} fotos prontas` : 'Abrir Guia de 14 Fotos'}
              </button>
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" onClick={() => setStep(1)} style={{ flex: 1, padding: '14px', background: '#334155', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                  Voltar
                </button>
                <button type="submit" style={{ flex: 2, padding: '14px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer' }}>
                  Avançar para Planos
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#f8fafc', marginBottom: '8px' }}>3. Escolha o Plano de Destaque</h2>
            <p style={{ color: '#94a3b8', marginBottom: '24px', fontSize: '13px' }}>Selecione o nível de visibilidade para o seu anúncio.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              {/* Gratuito */}
              <label style={{ background: '#111827', border: formData.plano_destaque === 'gratis' ? '2px solid #38bdf8' : '1px solid #1f2937', borderRadius: '12px', padding: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input type="radio" name="plano_destaque" value="gratis" checked={formData.plano_destaque === 'gratis'} onChange={handleChange} />
                  <div>
                    <div style={{ fontWeight: '700', color: '#fff' }}>Gratuito</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>Visibilidade básica na plataforma</div>
                  </div>
                </div>
                <div style={{ fontWeight: '800', color: '#34d399' }}>R$ 0,00</div>
              </label>

              {/* Prata */}
              <label style={{ background: '#111827', border: formData.plano_destaque === 'prata' ? '2px solid #38bdf8' : '1px solid #1f2937', borderRadius: '12px', padding: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input type="radio" name="plano_destaque" value="prata" checked={formData.plano_destaque === 'prata'} onChange={handleChange} />
                  <div>
                    <div style={{ fontWeight: '700', color: '#fff' }}>Prata</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>Destaque acima dos gratuitos na busca</div>
                  </div>
                </div>
                <div style={{ fontWeight: '800', color: '#38bdf8' }}>R$ 19,90</div>
              </label>

              {/* Ouro */}
              <label style={{ background: '#111827', border: formData.plano_destaque === 'ouro' ? '2px solid #f59e0b' : '1px solid #1f2937', borderRadius: '12px', padding: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input type="radio" name="plano_destaque" value="ouro" checked={formData.plano_destaque === 'ouro'} onChange={handleChange} />
                  <div>
                    <div style={{ fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Sparkles size={16} color="#f59e0b" /> Ouro
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>Destaque superior + Divulgação nos Stories do Instagram</div>
                  </div>
                </div>
                <div style={{ fontWeight: '800', color: '#f59e0b' }}>R$ 29,90</div>
              </label>

              {/* Diamond Turbo */}
              <label style={{ background: '#111827', border: formData.plano_destaque === 'diamante' ? '2px solid #38bdf8' : '1px solid #1f2937', borderRadius: '12px', padding: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: formData.plano_destaque === 'diamante' ? '0 0 15px rgba(56, 189, 248, 0.2)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input type="radio" name="plano_destaque" value="diamante" checked={formData.plano_destaque === 'diamante'} onChange={handleChange} />
                  <div>
                    <div style={{ fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Zap size={16} color="#38bdf8" /> Diamond Turbo
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>Topo absoluto + Feed Instagram + Facebook</div>
                  </div>
                </div>
                <div style={{ fontWeight: '800', color: '#38bdf8' }}>R$ 49,90</div>
              </label>

              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button type="button" onClick={() => setStep(2)} style={{ flex: 1, padding: '14px', background: '#334155', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                  Voltar
                </button>
                <button disabled={loading} type="submit" style={{ flex: 2, padding: '14px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
                  {loading ? 'Publicando...' : isEditing ? 'Guardar Alterações' : 'Publicar Anúncio Agora'}
                </button>
              </div>
            </div>
          </div>
        )}

      </form>

      {showPhotoGuide && (
        <PhotoGuideModal 
          onClose={() => setShowPhotoGuide(false)} 
          onComplete={(capturedPhotos) => {
            setFotos(capturedPhotos);
            setShowPhotoGuide(false);
          }}
        />
      )}
    </div>
  );
}