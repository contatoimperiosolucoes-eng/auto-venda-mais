import React, { useState } from 'react';
import { X, Send, ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';

export default function ChatModal({ vehicle, seller, onClose }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'system',
      text: '🔒 Dica de Segurança AutoVenda+: Nunca faça pagamentos adiantados nem envie senhas/códigos. Utilize sempre a nossa Custódia Protegida para garantir a entrega do veículo.'
    },
    {
      id: 2,
      sender: 'seller',
      text: `Olá! Obrigado pelo interesse no ${vehicle.modelo}. O veículo está disponível para visita presencial.`
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [warningMessage, setWarningMessage] = useState('');

  // Regras de Moderação Anti-Fraude
  const PHONE_REGEX = /(\(?\d{2}\)?\s?)?(9\s?\d{4}[-\s]?\d{4}|\d{4}[-\s]?\d{4})/g;
  const SUSPICIOUS_WORDS_REGEX = /\b(zap|whatsapp|chama no|pix adiantado|sinal adiantado|deposito antes|transferencia direta)\b/gi;

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    let moderatedText = inputMessage;
    let foundFraudRisk = false;

    // 1. Deteta e mascara números de telefone / WhatsApp
    if (PHONE_REGEX.test(inputMessage)) {
      moderatedText = moderatedText.replace(PHONE_REGEX, '[CONTATO OCULTO POR SEGURANÇA]');
      foundFraudRisk = true;
    }

    // 2. Deteta palavras de risco
    if (SUSPICIOUS_WORDS_REGEX.test(inputMessage)) {
      foundFraudRisk = true;
    }

    if (foundFraudRisk) {
      setWarningMessage('Aviso: Negociações fora da plataforma anulam a Garantia de Custódia e proteção contra golpes.');
    } else {
      setWarningMessage('');
    }

    // Adiciona a mensagem do comprador (com moderação aplicada)
    const newMsg = {
      id: Date.now(),
      sender: 'buyer',
      text: moderatedText,
      moderated: foundFraudRisk
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMessage('');

    // Resposta automática simulada do vendedor após 1.5s
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'seller',
          text: 'Entendido! Recomendo agendarmos a vistoria presencial através do botão de Custódia Protegida.'
        }
      ]);
    }, 1500);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1100,
      backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px'
    }}>
      <div style={{
        background: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px',
        width: '100%', maxWidth: '540px', height: '620px', display: 'flex', flexDirection: 'column',
        boxShadow: '0 20px 40px rgba(0,0,0,0.5)', overflow: 'hidden'
      }}>
        {/* Topo do Chat */}
        <header style={{
          padding: '16px 20px', background: '#111827', borderBottom: '1px solid #1f2937',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px', height: '40px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #0284c7, #2563eb)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: '700', color: '#fff', fontSize: '16px'
            }}>
              {seller.nome.charAt(0)}
            </div>
            <div>
              <div style={{ fontWeight: '700', color: '#f8fafc', fontSize: '15px' }}>{seller.nome}</div>
              <div style={{ fontSize: '12px', color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <ShieldCheck size={14} /> Identidade Verificada
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </header>

        {/* Resumo do Veículo no Topo */}
        <div style={{
          padding: '10px 16px', background: '#0b0f19', borderBottom: '1px solid #1e293b',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px'
        }}>
          <span style={{ color: '#cbd5e1' }}>{vehicle.marca} {vehicle.modelo} ({vehicle.ano})</span>
          <span style={{ color: '#38bdf8', fontWeight: '700' }}>R$ {Number(vehicle.preco).toLocaleString('pt-BR')}</span>
        </div>

        {/* Corpo das Mensagens */}
        <div style={{
          flex: 1, padding: '16px', overflowY: 'auto', display: 'flex',
          flexDirection: 'column', gap: '12px', background: '#090d16'
        }}>
          {messages.map((msg) => {
            if (msg.sender === 'system') {
              return (
                <div key={msg.id} style={{
                  background: 'rgba(2, 132, 199, 0.1)', border: '1px solid rgba(56, 189, 248, 0.25)',
                  padding: '10px 14px', borderRadius: '10px', fontSize: '12px', color: '#93c5fd', lineHeight: '1.4'
                }}>
                  {msg.text}
                </div>
              );
            }

            const isBuyer = msg.sender === 'buyer';
            return (
              <div key={msg.id} style={{
                alignSelf: isBuyer ? 'flex-end' : 'flex-start',
                maxWidth: '80%', display: 'flex', flexDirection: 'column',
                alignItems: isBuyer ? 'flex-end' : 'flex-start'
              }}>
                <div style={{
                  background: isBuyer ? '#0284c7' : '#1e293b',
                  color: '#ffffff', padding: '10px 14px', borderRadius: '14px',
                  borderBottomRightRadius: isBuyer ? '2px' : '14px',
                  borderBottomLeftRadius: !isBuyer ? '2px' : '14px',
                  fontSize: '14px', lineHeight: '1.4'
                }}>
                  {msg.text}
                </div>
                {msg.moderated && (
                  <span style={{ fontSize: '11px', color: '#f87171', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <ShieldAlert size={12} /> Dados de contacto mascarados por segurança
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Alerta Dinâmico de Moderação */}
        {warningMessage && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)', borderTop: '1px solid #ef4444',
            padding: '8px 16px', fontSize: '12px', color: '#fca5a5', display: 'flex',
            alignItems: 'center', gap: '8px'
          }}>
            <AlertTriangle size={16} />
            <span>{warningMessage}</span>
          </div>
        )}

        {/* Caixa de Entrada de Texto */}
        <form onSubmit={handleSendMessage} style={{
          padding: '14px 16px', background: '#111827', borderTop: '1px solid #1f2937',
          display: 'flex', gap: '10px', alignItems: 'center'
        }}>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Escreva uma mensagem segura..."
            style={{
              flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1px solid #334155',
              background: '#1e293b', color: '#ffffff', fontSize: '14px', outline: 'none'
            }}
          />
          <button
            type="submit"
            style={{
              background: '#0284c7', color: '#ffffff', border: 'none', padding: '10px 16px',
              borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: '6px', fontWeight: '600'
            }}
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}