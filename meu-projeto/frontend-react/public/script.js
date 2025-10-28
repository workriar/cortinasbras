document.addEventListener('DOMContentLoaded', function () {
    // Carrossel funcional
    const slides = document.querySelectorAll('.carousel .slide');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    let currentIdx = 0;
    function showSlide(idx) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === idx);
        });
    }
    function nextSlide() {
        currentIdx = (currentIdx + 1) % slides.length;
        showSlide(currentIdx);
    }
    function prevSlide() {
        currentIdx = (currentIdx - 1 + slides.length) % slides.length;
        showSlide(currentIdx);
    }
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // autoplay
    setInterval(nextSlide, 4000);
    showSlide(currentIdx);

    // Suavizar scroll CTA
    const ctaBtn = document.getElementById('cta-btn');
    const formSection = document.getElementById('form-orcamento');
    ctaBtn.addEventListener('click', function () {
        formSection.scrollIntoView({ behavior: 'smooth' });
    });

    // Formulário com feedback Flask
    const form = document.getElementById('lp-form');
    const msgSuccess = document.getElementById('msgSuccess');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(form);
        fetch(form.action, { method: 'POST', body: formData })
            .then(response => response.text())
            .then(data => {
                if (data === 'success') {
                    msgSuccess.style.display = 'block';
                    form.reset();
                    setTimeout(() => { msgSuccess.style.display = 'none'; }, 5000);
                } else {
                    alert('Erro ao enviar. Tente novamente.');
                }
            })
            .catch(error => {
                alert('Erro ao enviar formulário. Tente novamente.');
                console.error(error);
            });
    });
});
