// js/servicos/sistemaService.js
// Consultas relacionadas aos sistemas do corpo humano.
//
// Convenção de retorno (vale para todos os services):
//  - busca de UM item  -> o objeto, ou null se não existir / id inválido
//  - busca de VÁRIOS   -> array (vazio se não houver resultado ou id inválido)
// Nenhuma função lança erro por causa de id inválido.

import { sistemas } from "../dados/sistemas.js";
import { orgaos } from "../dados/orgaos.js";

// Aceita só string não vazia; ignora espaços e maiúsculas/minúsculas.
function normalizarId(id) {
  if (typeof id !== "string") return null;
  const limpo = id.trim().toLowerCase();
  return limpo === "" ? null : limpo;
}

/** Lista todos os sistemas (cópia do array, para ninguém alterar o original). */
export function listarSistemas() {
  return [...sistemas];
}

/** Busca um sistema pelo id. Retorna o objeto ou null. */
export function buscarSistemaPorId(id) {
  const idNorm = normalizarId(id);
  if (!idNorm) return null;
  return sistemas.find((s) => s.id.toLowerCase() === idNorm) ?? null;
}

/** true se existir um sistema com esse id. */
export function sistemaExiste(id) {
  return buscarSistemaPorId(id) !== null;
}

/**
 * Lista os sistemas aos quais um órgão pertence (ex.: pâncreas -> endócrino e digestório).
 * Retorna [] se o órgão não existir ou o id for inválido.
 */
export function listarSistemasDoOrgao(orgaoId) {
  const idNorm = normalizarId(orgaoId);
  if (!idNorm) return [];

  const orgao = orgaos.find((o) => o.id.toLowerCase() === idNorm);
  if (!orgao) return [];

  return orgao.sistemas
    .map((sistemaId) => buscarSistemaPorId(sistemaId))
    .filter(Boolean); // vai descartar referências a sistemas que não existem
}
//deixando explicito pra vcs tentar 
//entender o que eu fiz, mas é basicamente a mesma 
//coisa que o orgaoService, só que invertido