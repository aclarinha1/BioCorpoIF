
(() => {
    const board = document.querySelector('.anatomy-board');
    const bodyImage = document.querySelector('.body-figure img');
    const svg = document.querySelector('.connectors');
    const items = [...document.querySelectorAll('.organ-item')];

    if (!board || !bodyImage || !svg || !items.length) return;

    const ns = 'http://www.w3.org/2000/svg';

    function createSvgElement(tag, attributes) {
        const element = document.createElementNS(ns, tag);

        Object.entries(attributes).forEach(([key, value]) => {
            element.setAttribute(key, value);
        });

        return element;
    }

    function drawConnectors() {
        if (window.innerWidth <= 560) {
            svg.replaceChildren();
            return;
        }

        const boardRect = board.getBoundingClientRect();
        const imageRect = bodyImage.getBoundingClientRect();

        if (!boardRect.width || !imageRect.width || !imageRect.height) {
            return;
        }

        svg.setAttribute(
            'viewBox',
            `0 0 ${boardRect.width} ${boardRect.height}`
        );

        svg.setAttribute('preserveAspectRatio', 'none');
        svg.replaceChildren();

        items.forEach(item => {
            const itemRect = item.getBoundingClientRect();
            const isLeft = item.closest('.organ-list-left') !== null;

            // Ponto de saída na borda do botão.
            const startX = (
                isLeft ? itemRect.right : itemRect.left
            ) - boardRect.left;

            const startY =
                itemRect.top + itemRect.height / 2 - boardRect.top;

            // Posição do órgão em relação à imagem.
            const targetX =
                imageRect.left - boardRect.left +
                imageRect.width * (Number(item.dataset.x) / 100);

            const targetY =
                imageRect.top - boardRect.top +
                imageRect.height * (Number(item.dataset.y) / 100);

            const middleX = (startX + targetX) / 2;

            const path = createSvgElement('path', {
                d: `M ${startX} ${startY} H ${middleX} L ${targetX} ${targetY}`
            });

            const dot = createSvgElement('circle', {
                cx: targetX,
                cy: targetY,
                r: 3.5,
                class: 'connector-dots'
            });

            svg.append(path, dot);
        });
    }

    // Interação dos órgãos.
    items.forEach(item => {
        item.addEventListener('click', () => {
            const wasActive = item.classList.contains('is-active');

            items.forEach(other => other.classList.remove('is-active'));

            if (!wasActive) {
                item.classList.add('is-active');
            }
        });

        item.addEventListener('keydown', event => {
            if (event.key === 'Escape') {
                item.classList.remove('is-active');
            }
        });
    });

    document.addEventListener('click', event => {
        if (!event.target.closest('.organ-item')) {
            items.forEach(item => item.classList.remove('is-active'));
        }
    });

    // Atualiza quando o tamanho da janela muda.
    window.addEventListener('resize', drawConnectors);

    // Atualiza quando a imagem termina de carregar.
    bodyImage.addEventListener('load', drawConnectors);

    // Atualiza após o carregamento das imagens dos órgãos.
    document.querySelectorAll('.organ-picture img').forEach(img => {
        img.addEventListener('load', drawConnectors);
    });

    // Observa alterações de tamanho.
    const observer = new ResizeObserver(drawConnectors);

    observer.observe(board);
    observer.observe(bodyImage);

    items.forEach(item => observer.observe(item));

    // Recalcula após alterações de layout e rolagem.
    window.addEventListener('scroll', drawConnectors, true);

    // Desenho inicial após o navegador organizar o layout.
    requestAnimationFrame(() => {
        requestAnimationFrame(drawConnectors);
    });
})();
