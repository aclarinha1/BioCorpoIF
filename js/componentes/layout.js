async function carregarComponente(elemento, arquivo) {
    try {
        const resposta = await fetch(arquivo);

        if (!resposta.ok) {
            throw new Error(`Erro ao carregar ${arquivo}`);
        }

        const conteudo = await resposta.text();

        document.getElementById(elemento).innerHTML = conteudo;

    } catch (erro) {
        console.error(erro);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    carregarComponente('sobre', 'sobre.html');
    carregarComponente('explorar', 'explorar.html');
});