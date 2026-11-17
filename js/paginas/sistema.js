// js/paginas/sistema.js

import { buscarSistemaPorId } from "../servicos/sistemaService.js";
import { listarOrgaosDoSistema } from "../servicos/orgaoService.js";

// Pega o id da URL: sistema.html?id=nervoso
const params = new URLSearchParams(window.location.search);
const sistemaId = params.get("id");

// Aba ativa no momento
let abaAtiva = "orgaos";

// Elementos do HTML
const elNome        = document.getElementById("sistema-nome");
const elDescricao   = document.getElementById("sistema-descricao");
const elIcone       = document.getElementById("sistema-icone");
const elConteudo    = document.getElementById("conteudo-aba");
const elImagem      = document.getElementById("sistema-imagem");
const elResumoNome  = document.getElementById("resumo-nome");
const elResumoOrgaos= document.getElementById("resumo-orgaos");
const elResumoFuncao= document.getElementById("resumo-funcao");
const elResumoImport= document.getElementById("resumo-importancia");
const elResumoIcone = document.getElementById("resumo-icone");

function renderizarAba(sistema, orgaos) {
  if (abaAtiva === "orgaos") {
    // Lista os órgãos como links para orgao.html
    const itens = orgaos.map(o =>
      `<li><a href="orgao.html?id=${o.id}">${o.nome}</a></li>`
    ).join("");
    elConteudo.innerHTML = `<h3>Principais órgãos</h3><ul>${itens}</ul>`;

  } else {
    // Características, funções ou importância — todos são arrays
    const mapa = {
      caracteristicas: { titulo: "Características", dados: sistema.caracteristicas },
      funcoes:         { titulo: "Funções",          dados: sistema.funcoes },
      importancia:     { titulo: "Importância",      dados: sistema.importancia },
    };
    const { titulo, dados } = mapa[abaAtiva];
    const itens = dados.map(item => `<li>${item}</li>`).join("");
    elConteudo.innerHTML = `<h3>${titulo}</h3><ul>${itens}</ul>`;
  }
}

function renderizarPagina() {
  const sistema = buscarSistemaPorId(sistemaId);

  // Se o id não existir, redireciona
  if (!sistema) {
    window.location.href = "explorar.html";
    return;
  }

  const orgaos = listarOrgaosDoSistema(sistemaId);

  // Preenche cabeçalho
  document.title = `${sistema.nome} — BioCorpo`;
  elNome.textContent = sistema.nome;
  elDescricao.textContent = sistema.resumo;
  elIcone.textContent = sistema.icone || "◉";

  // Preenche imagem (placeholder enquanto não tem)
  if (sistema.imagem) {
    elImagem.innerHTML = `<img src="${sistema.imagem}" alt="Imagem do ${sistema.nome}">`;
  } else {
    elImagem.innerHTML = `<span>INSERIR IMAGEM DO ${sistema.nome.toUpperCase()}</span>`;
  }

  // Preenche resumo lateral
  elResumoNome.textContent   = sistema.nome;
  elResumoIcone.textContent  = sistema.icone || "◉";
  elResumoOrgaos.textContent = orgaos.map(o => o.nome).join(", ") + ".";
  elResumoFuncao.textContent = sistema.funcoes[0];
  elResumoImport.textContent = sistema.importancia[0];

  // Renderiza aba inicial
  renderizarAba(sistema, orgaos);
}

// Troca de abas
document.querySelectorAll(".aba").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".aba").forEach(b => b.classList.remove("ativa"));
    btn.classList.add("ativa");
    abaAtiva = btn.dataset.aba;

    const sistema = buscarSistemaPorId(sistemaId);
    const orgaos  = listarOrgaosDoSistema(sistemaId);
    renderizarAba(sistema, orgaos);
  });
});

// Inicia
renderizarPagina();