// js/servicos/buscaService.js
// Pesquisa por texto em sistemas e órgãos.
//
// - Ignora acentos e maiúsculas/minúsculas ("pancreas" acha "Pâncreas").
// - Termo com várias palavras: todas precisam aparecer no item.
// - Ordena por relevância: nome pesa mais que resumo, que pesa mais que o resto.

import { sistemas } from "../dados/sistemas.js";
import { orgaos } from "../dados/orgaos.js";

export const TAMANHO_MINIMO_BUSCA = 2;

/** Remove acentos, deixa minúsculo e tira espaços extras. */
export function normalizarTexto(texto) {
  return String(texto ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

// "importancia" é array nos sistemas e string nos órgãos; aqui tanto faz.
function juntarTextos(...campos) {
  return campos
    .flat()
    .filter((c) => typeof c === "string")
    .join(" ");
}

// Índices montados uma vez só, quando o módulo carrega.
function montarIndice(lista) {
  return lista.map((item) => ({
    item,
    nome: normalizarTexto(item.nome),
    resumo: normalizarTexto(item.resumo),
    detalhes: normalizarTexto(
      juntarTextos(item.caracteristicas, item.funcoes, item.importancia)
    ),
  }));
}

const indiceSistemas = montarIndice(sistemas);
const indiceOrgaos = montarIndice(orgaos);

// 0 = não bate (todas as palavras precisam bater em algum campo).
function pontuar(entrada, palavras) {
  let total = 0;
  for (const palavra of palavras) {
    let pontos = 0;
    if (entrada.nome.startsWith(palavra)) pontos = 6;
    else if (entrada.nome.includes(palavra)) pontos = 5;
    else if (entrada.resumo.includes(palavra)) pontos = 2;
    else if (entrada.detalhes.includes(palavra)) pontos = 1;
    if (pontos === 0) return 0;
    total += pontos;
  }
  return total;
}

function pesquisar(indice, palavras) {
  return indice
    .map((entrada) => ({ item: entrada.item, pontos: pontuar(entrada, palavras) }))
    .filter((r) => r.pontos > 0)
    .sort(
      (a, b) =>
        b.pontos - a.pontos || a.item.nome.localeCompare(b.item.nome, "pt-BR")
    )
    .map((r) => r.item);
}

function prepararTermo(termo) {
  const normalizado = normalizarTexto(termo);
  const valido = normalizado.length >= TAMANHO_MINIMO_BUSCA;
  return { normalizado, valido, palavras: valido ? normalizado.split(" ") : [] };
}

/** Pesquisa só nos sistemas. Retorna [] se o termo for inválido. */
export function buscarSistemas(termo) {
  const { palavras } = prepararTermo(termo);
  return palavras.length ? pesquisar(indiceSistemas, palavras) : [];
}

/** Pesquisa só nos órgãos. Retorna [] se o termo for inválido. */
export function buscarOrgaos(termo) {
  const { palavras } = prepararTermo(termo);
  return palavras.length ? pesquisar(indiceOrgaos, palavras) : [];
}

/**
 * Pesquisa em sistemas e órgãos ao mesmo tempo.
 * Retorna sempre o mesmo formato:
 *   { termo, valido, sistemas: [...], orgaos: [...], total }
 * "valido" é false quando o termo não é texto ou tem menos de 2 caracteres;
 * o front pode usar isso para mostrar "digite pelo menos 2 letras".
 */
export function buscar(termo) {
  const { normalizado, valido, palavras } = prepararTermo(termo);

  if (!valido) {
    return { termo: normalizado, valido: false, sistemas: [], orgaos: [], total: 0 };
  }

  const achadosSistemas = pesquisar(indiceSistemas, palavras);
  const achadosOrgaos = pesquisar(indiceOrgaos, palavras);

  return {
    termo: normalizado,
    valido: true,
    sistemas: achadosSistemas,
    orgaos: achadosOrgaos,
    total: achadosSistemas.length + achadosOrgaos.length,
  };
}