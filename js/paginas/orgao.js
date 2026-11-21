// js/paginas/orgao.js

import { buscarOrgaoPorId, listarOrgaosRelacionados } from "../servicos/orgaoService.js";
import { buscarSistemaPorId } from "../servicos/sistemaService.js";

// Pega o id da URL: orgao.html?id=cerebro
const params = new URLSearchParams(window.location.search);
const orgaoId = params.get("id");

// Aba ativa no momento
let abaAtiva = "caracteristicas";

// Elementos do HTML
const elNome        = document.getElementById("orgao-nome");
const elSistema     = document.getElementById("orgao-sistema");
const elIcone       = document.getElementById("orgao-icone");
const elConteudo    = document.getElementById("conteudo-aba");
const elImagem      = document.getElementById("orgao-imagem");
const elVoltarLink  = document.getElementById("voltar-link");
const elResumoNome  = document.getElementById("resumo-nome");
const elResumoSist  = document.getElementById("resumo-sistema");
const elResumoTexto = document.getElementById("resumo-texto");

function renderizarAba(orgao) {
  const mapa = {
    caracteristicas: { titulo: "Características", dados: orgao.caracteristicas },
    funcoes:         { titulo: "Funções",          dados: orgao.funcoes },
    importancia:     { titulo: "Importância",      dados: orgao.importancia },
  };

  const { titulo, dados } = mapa[abaAtiva];

  // importancia pode ser string ou array dependendo do órgão
  const itens = Array.isArray(dados)
    ? dados.map(item => `<li>${item}</li>`).join("")
    : `<li>${dados}</li>`;

  elConteudo.innerHTML = `<h3>${titulo}</h3><ul>${itens}</ul>`;
}

function renderizarPagina() {
  const orgao = buscarOrgaoPorId(orgaoId);

  // Se o id não existir, redireciona
  if (!orgao) {
    window.location.href = "explorar.html";
    return;
  }

  // Busca o primeiro sistema do órgão para o voltar link
  const sistemaId = orgao.sistemas[0];
  const sistema   = buscarSistemaPorId(sistemaId);

  // Preenche cabeçalho
  document.title    = `${orgao.nome} — BioCorpo`;
  elNome.textContent = orgao.nome;
  elSistema.textContent = sistema
    ? `${sistema.nome}`
    : orgao.sistemas.join(", ");

  // Ícone
  if (sistema?.icone) {
  elIcone.innerHTML = `<img src="${sistema.icone}" alt="" style="width:55px;height:55px;object-fit:contain;">`;
  } else {
  elIcone.textContent = "◉";
  } 

  // Link de voltar aponta pro sistema correto
  elVoltarLink.href = `sistema.html?id=${sistemaId}`;

  // Imagem
  if (orgao.imagem) {
    elImagem.innerHTML = `<img src="${orgao.imagem}" alt="Imagem do ${orgao.nome}">`;
  } else {
    elImagem.innerHTML = `<span>INSERIR IMAGEM DO ${orgao.nome.toUpperCase()}</span>`;
  }

  // Resumo lateral
  elResumoNome.textContent  = orgao.nome;
  elResumoSist.textContent  = sistema?.nome || orgao.sistemas.join(", ");
  elResumoTexto.textContent = orgao.resumo;

  // Renderiza aba inicial
  renderizarAba(orgao);
}

// Troca de abas
document.querySelectorAll(".aba").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".aba").forEach(b => b.classList.remove("ativa"));
    btn.classList.add("ativa");
    abaAtiva = btn.dataset.aba;

    const orgao = buscarOrgaoPorId(orgaoId);
    renderizarAba(orgao);
  });
});

// Inicia
renderizarPagina();