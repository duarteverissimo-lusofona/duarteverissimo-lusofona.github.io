let counter = 0;
const body = document.body;
const finalImage = document.querySelector('#final-image');
const main = document.querySelector('main');
const mousePosition = document.querySelector('#mouse-position');
const img = document.querySelector('#dark-img');
const counterElement = document.querySelector('#counter');

function count() {
    counter++;
    counterElement.textContent = 2025 + counter;
}

document.querySelector('#heading').addEventListener('click', count);

document.querySelector('#dark-img').addEventListener('click', () => {
    let opacity = 0;
    const fadeInterval = setInterval(() => {
        opacity += 0.1;
        body.style.backgroundColor = `rgba(0, 0, 0, ${opacity})`;

        if (opacity >= 1) {
            clearInterval(fadeInterval);
            body.classList.add('hidden-main');
            finalImage.classList.add('visible');
        }
    }, 100);
});

document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mouseover', () => {
        const color = card.getAttribute('data-color');
        main.style.backgroundColor = color;
    });

    card.addEventListener('mouseout', () => {
        if (!body.classList.contains('hidden-main')) {
            main.style.backgroundColor = '#f9f9f9';
        }
    });
});

const container = document.querySelector('.container');

container.addEventListener('mousemove', function(e) {
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mousePosition.textContent = `Posição do rato no container: (${Math.round(x)}, ${Math.round(y)})`;
    img.style.transform = 'scale(1.03)';
    img.style.borderColor = '#3498db';
});

container.addEventListener('mouseout', function() {
    img.style.transform = 'scale(1)';
    img.style.borderColor = '#ddd';
    mousePosition.textContent = 'Posição do rato: (0, 0)';
});

const footer = document.querySelector('footer');

footer.addEventListener('dblclick', (e) => {
    footer.classList.toggle('large');
});