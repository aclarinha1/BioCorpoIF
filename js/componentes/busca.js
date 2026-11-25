import {
    buscarOrgaos,
    buscarSistemas,
    normalizarTexto,
    TAMANHO_MINIMO_BUSCA
} from "../servicos/buscaService.js";

const overlay = document.createElement("div");

overlay.className = "busca-overlay";

overlay.innerHTML = `
    <div class="busca-container"
         role="dialog"
         aria-modal="true"
         aria-labelledby="busca-titulo">

        <div class="busca-cabecalho">

            <h2 class="busca-titulo" id="busca-titulo">
                Pesquisar no BioCorpoIF
            </h2>

            <button
                type="button"
                class="busca-fechar"
                aria-label="Fechar pesquisa">
                &times;
            </button>

        </div>

        <input
            type="search"
            class="busca-input"
            placeholder="Digite um órgão ou sistema..."
            aria-label="Pesquisar órgão ou sistema"
            autocomplete="off">

        <div class="busca-resultados" aria-live="polite">
            <p class="busca-mensagem">
                Digite o nome de um órgão ou sistema.
            </p>
        </div>

    </div>
`;

document.body.appendChild(overlay);

const campoBusca = overlay.querySelector(".busca-input");
const resultados = overlay.querySelector(".busca-resultados");
const botaoFechar = overlay.querySelector(".busca-fechar");

let botaoAbertura;
let overflowAnterior;

function mostrarMensagem(texto) {
    const mensagem = document.createElement("p");

    mensagem.className = "busca-mensagem";
    mensagem.textContent = texto;

    resultados.replaceChildren(mensagem);
}

function abrirBusca() {
    overlay.classList.add("ativa");

    overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    campoBusca.value = "";

    mostrarMensagem(
        "Digite o nome de um órgão ou sistema."
    );

    campoBusca.focus();
}

function fecharBusca() {
    overlay.classList.remove("ativa");

    document.body.style.overflow = overflowAnterior || "";

    botaoAbertura?.focus();
}

function criarResultado(item, tipo) {

    const link = document.createElement("a");
    link.className = "busca-resultado";

    const pagina = tipo === "Órgão"
        ? "orgao.html"
        : "sistema.html";

    link.href = `${pagina}?id=${encodeURIComponent(item.id)}`;

    const nome = document.createElement("span");
    nome.className = "busca-resultado-nome";
    nome.textContent = item.nome;

    const categoria = document.createElement("span");
    categoria.className = "busca-resultado-tipo";
    categoria.textContent = tipo;

    link.append(nome, categoria);

    return link;
}

function pesquisar() {

    const termo = campoBusca.value.trim();
    const termoNormalizado = normalizarTexto(termo);

    resultados.replaceChildren();

    if (termoNormalizado.length < TAMANHO_MINIMO_BUSCA) {

        mostrarMensagem(
            "Digite pelo menos duas letras."
        );

        return;
    }

    const orgaos = buscarOrgaos(termo);
    const sistemas = buscarSistemas(termo);

    const encontrados = [
        ...orgaos.map(item => ({
            item,
            tipo: "Órgão"
        })),

        ...sistemas.map(item => ({
            item,
            tipo: "Sistema"
        }))
    ];

    encontrados.sort((a, b) => {

        function prioridade(resultado) {
            const nome = normalizarTexto(resultado.item.nome);

            if (nome === termoNormalizado) return 3;
            if (nome.startsWith(termoNormalizado)) return 2;
            if (nome.includes(termoNormalizado)) return 1;

            return 0;
        }

        return prioridade(b) - prioridade(a);
    });

    if (encontrados.length === 0) {

        mostrarMensagem(
            "Nenhum órgão ou sistema encontrado."
        );

        return;
    }

    encontrados.forEach(({ item, tipo }) => {
        resultados.appendChild(
            criarResultado(item, tipo)
        );
    });
}

document.addEventListener("click", function(event) {

    const botao = event.target.closest("#abrir-busca");

    if (botao) {
        event.preventDefault();

        botaoAbertura = botao;
        abrirBusca();
    }
});

campoBusca.addEventListener("input", pesquisar);

botaoFechar.addEventListener("click", fecharBusca);

overlay.addEventListener("click", function(event) {

    if (event.target === overlay) {
        fecharBusca();
    }
});

document.addEventListener("keydown", function(event) {

    if (
        event.key === "Escape" &&
        overlay.classList.contains("ativa")
    ) {
        fecharBusca();
    }
});

campoBusca.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {

        event.preventDefault();

        const primeiroResultado = resultados.querySelector(
            ".busca-resultado"
        );

        if (primeiroResultado) {
            window.location.href = primeiroResultado.href;
        }
    }
});