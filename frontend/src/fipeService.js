// Base de dados local para resposta instantânea no catálogo
const FIPE_DATABASE = [
  { marca: 'Honda', modelo: 'Civic', ano: 2008, precoFipe: 48500 },
  { marca: 'Honda', modelo: 'Civic', ano: 2019, precoFipe: 104000 },
  { marca: 'Honda', modelo: 'Civic', ano: 2020, precoFipe: 112000 },
  { marca: 'Toyota', modelo: 'Corolla', ano: 2020, precoFipe: 125000 },
  { marca: 'Toyota', modelo: 'Corolla', ano: 2021, precoFipe: 142000 },
  { marca: 'Toyota', modelo: 'Corolla', ano: 2023, precoFipe: 152000 },
  { marca: 'Fiat', modelo: 'Uno', ano: 2020, precoFipe: 39500 },
  { marca: 'Volkswagen', modelo: 'Golf', ano: 2022, precoFipe: 192000 }
];

const fipeCache = new Map();

/**
 * Função síncrona usada diretamente na listagem do App.jsx
 */
export function getFipeComparison(vehicle) {
  if (!vehicle) return null;

  const fipeEntry = FIPE_DATABASE.find((item) => {
    const mesmoAno = Number(item.ano) === Number(vehicle.ano);
    const mesmaMarca = item.marca.toLowerCase() === (vehicle.marca || '').toLowerCase();
    const mesmoModelo = (vehicle.modelo || '').toLowerCase().includes(item.modelo.toLowerCase());
    return mesmaMarca && mesmoModelo && mesmoAno;
  });

  const precoFipe = fipeEntry ? fipeEntry.precoFipe : Number(vehicle.preco);
  const precoAnuncio = Number(vehicle.preco);
  const percentual = Math.round(((precoAnuncio - precoFipe) / precoFipe) * 100);
  const isSuspeito = percentual <= -30;

  return {
    precoFipe,
    precoAnuncio,
    percentual,
    isSuspeito,
    textoComparacao: percentual < 0 
      ? `${Math.abs(percentual)}% abaixo da FIPE` 
      : percentual > 0 
        ? `${percentual}% acima da FIPE` 
        : 'Na média da FIPE'
  };
}

/**
 * Cálculo de rácio para uso flexível
 */
export function calculateFipeRatio(precoAnuncio, precoFipe) {
  const preco = Number(precoAnuncio);
  const fipe = Number(precoFipe);
  if (!fipe || isNaN(fipe)) return null;

  const percentual = Math.round(((preco - fipe) / fipe) * 100);
  const isSuspeito = percentual <= -30;

  return {
    precoFipe: fipe,
    precoAnuncio: preco,
    percentual,
    isSuspeito,
    textoComparacao: percentual < 0 
      ? `${Math.abs(percentual)}% abaixo da FIPE` 
      : percentual > 0 
        ? `${percentual}% acima da FIPE` 
        : 'Na média da FIPE'
  };
}

/**
 * Consulta da API FIPE em direto para a página de detalhes
 */
export async function fetchLiveFipePrice(vehicle) {
  if (!vehicle || !vehicle.marca || !vehicle.modelo) return null;

  const cacheKey = `${vehicle.marca}_${vehicle.modelo}_${vehicle.ano}`.toLowerCase();
  if (fipeCache.has(cacheKey)) {
    return fipeCache.get(cacheKey);
  }

  try {
    const resMarcas = await fetch('https://parallelum.com.br/fipe/api/v1/carros/marcas');
    const marcas = await resMarcas.json();
    const marcaMatch = marcas.find((m) => 
      m.nome.toLowerCase().includes(vehicle.marca.toLowerCase()) ||
      vehicle.marca.toLowerCase().includes(m.nome.toLowerCase())
    );

    if (!marcaMatch) throw new Error('Marca não encontrada');

    const resModelos = await fetch(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${marcaMatch.codigo}/modelos`);
    const dadosModelos = await resModelos.json();
    const modeloMatch = dadosModelos.modelos.find((m) =>
      m.nome.toLowerCase().includes(vehicle.modelo.toLowerCase()) ||
      vehicle.modelo.toLowerCase().includes(m.nome.toLowerCase())
    );

    if (!modeloMatch) throw new Error('Modelo não encontrado');

    const resAnos = await fetch(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${marcaMatch.codigo}/modelos/${modeloMatch.codigo}/anos`);
    const anos = await resAnos.json();
    const anoMatch = anos.find((a) => a.nome.includes(String(vehicle.ano))) || anos[0];

    if (!anoMatch) throw new Error('Ano não encontrado');

    const resDetalhes = await fetch(`https://parallelum.com.br/fipe/api/v1/carros/marcas/${marcaMatch.codigo}/modelos/${modeloMatch.codigo}/anos/${anoMatch.codigo}`);
    const detalhes = await resDetalhes.json();
    const valorNumerico = Number(detalhes.Valor.replace(/[R$\s.]/g, '').replace(',', '.'));

    const resultado = {
      precoFipe: valorNumerico,
      codigoFipe: detalhes.CodigoFipe,
      mesReferencia: detalhes.MesReferencia,
      origem: 'FIPE Oficial'
    };

    fipeCache.set(cacheKey, resultado);
    return resultado;
  } catch (error) {
    const fallback = getFipeComparison(vehicle);
    return {
      precoFipe: fallback.precoFipe,
      codigoFipe: 'FIPE-REF',
      mesReferencia: 'Média de mercado',
      origem: 'Base Local'
    };
  }
}