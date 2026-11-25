const CHAVE_TEMA = 'biocoreif-tema';

function aplicarTema(tema) {

    document.documentElement.setAttribute(
        'data-tema',
        tema
    );

}

function carregarTema() {

    const temaSalvo = localStorage.getItem(CHAVE_TEMA);

    const tema = temaSalvo === 'claro' ? 'claro' : 'escuro';

    aplicarTema(tema);

}

function alternarTema() {

    const temaAtual =
        document.documentElement.getAttribute('data-tema') || 'escuro';

    const novoTema = temaAtual === 'escuro' ? 'claro' : 'escuro';

    aplicarTema(novoTema);

    localStorage.setItem(CHAVE_TEMA, novoTema);

}

carregarTema();

document.addEventListener('click', function(event) {

    const botao = event.target.closest('#alternar-tema');

    if (!botao) {
        return;
    }

    alternarTema();

});