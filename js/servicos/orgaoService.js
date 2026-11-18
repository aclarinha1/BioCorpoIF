// js/servicos/orgaoService.js
// Consultas relacionadas aos órgãos.
// Mesma convenção do sistemaService: objeto ou null; lista ou [].

import { orgaos } from "../dados/orgaos.js";

function normalizarId(id) {
  if (typeof id !== "string") return null;
  const limpo = id.trim().toLowerCase();
  return limpo === "" ? null : limpo;
}

// Um órgão pode ter mais de um sistema, então a checagem é com "some".
function pertenceAoSistema(orgao, idSistemaNorm) {
  return orgao.sistemas.some((s) => s.toLowerCase() === idSistemaNorm);
}

/** Lista todos os órgãos. */
export function listarOrgaos() {
  return [...orgaos];
}

/** Busca um órgão pelo id. Retorna o objeto ou null. */
export function buscarOrgaoPorId(id) {
  const idNorm = normalizarId(id);
  if (!idNorm) return null;
  return orgaos.find((o) => o.id.toLowerCase() === idNorm) ?? null;
}

/** true se existir um órgão com esse id. */
export function orgaoExiste(id) {
  return buscarOrgaoPorId(id) !== null;
}

/**
 * Lista os órgãos de um sistema.
 * Inclui órgãos compartilhados (ex.: pâncreas aparece em endócrino e digestório).
 * Retorna [] se o sistema não existir, for inválido ou ainda não tiver órgãos
 * (hoje é o caso do sistema esquelético).
 */
export function listarOrgaosDoSistema(sistemaId) {
  const idNorm = normalizarId(sistemaId);
  if (!idNorm) return [];
  return orgaos.filter((o) => pertenceAoSistema(o, idNorm));
}

/**
 * Órgãos relacionados a um órgão: os que dividem pelo menos um sistema com ele
 * (sem incluir o próprio). Útil para a navegação na página do órgão.
 */
export function listarOrgaosRelacionados(orgaoId) {
  const orgao = buscarOrgaoPorId(orgaoId);
  if (!orgao) return [];

  const idsDoOrgao = orgao.sistemas.map((s) => s.toLowerCase());
  return orgaos.filter(
    (o) =>
      o.id !== orgao.id &&
      o.sistemas.some((s) => idsDoOrgao.includes(s.toLowerCase()))
  );
}