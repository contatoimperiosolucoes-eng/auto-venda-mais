import React, { useState, useEffect, useMemo } from 'react';
import { 
  Car, LogIn, CheckCircle2, ShieldCheck, 
  Search, Fuel, Gauge, Camera, LogOut,
  AlertTriangle, TrendingDown, TrendingUp,
  Sparkles, Zap, Building2, BatteryCharging,
  PlusCircle, ArrowLeft, Edit3, Tag, XCircle, User
} from 'lucide-react';
import VehicleDetails from './VehicleDetails';
import PhotoGuideModal from './PhotoGuideModal';
import AuthModal from './AuthModal';
import StoreProfileModal from './StoreProfileModal';
import CreateVehicleAd from './CreateVehicleAd';
import MyAdsModal from './MyAdsModal';
import { getFipeComparison } from './fipeService';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://auto-venda-mais.onrender.com/api';
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
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

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

  const currentUserId = currentUser?.id || localStorage.getItem('userId') || 'meu_usuario_id';
  const canPublish = currentUser && (currentUser.role === 'vendedor' || currentUser.role === 'admin');

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

  const handleAuthSuccess = (userData) => {
    // Aceita tanto objeto de utilizador como token direto
    if (userData && userData.token) {
      setToken(userData.token);
      setCurrentUser(userData.user || userData);
    } else {
      const savedToken = localStorage.getItem('token');
      const savedUser = localStorage.getItem('user');
      if (savedToken) setToken(savedToken);
      if (savedUser) {
        try {
          setCurrentUser(JSON.parse(savedUser));
        } catch {
          setCurrentUser(null);
        }
      }
    }
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setToken('');
    setCurrentUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
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
    searchTerm || filterTipo !== 'todos' || maxPrice || minAno