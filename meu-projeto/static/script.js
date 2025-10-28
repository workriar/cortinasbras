// Carrossel
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    showSlide(currentSlide);
}

document.querySelector('.carousel-btn.next')?.addEventListener('click', nextSlide);
document.querySelector('.carousel-btn.prev')?.addEventListener('click', prevSlide);

// Auto-rotate
setInterval(nextSlide, 5000);

// Scroll suave para formulário
document.getElementById('cta-btn')?.addEventListener('click', () => {
    document.getElementById('form-orcamento')?.scrollIntoView({ behavior: 'smooth' });
});

// Envio do formulário para WhatsApp
const form = document.getElementById('lp-form');
const whatsappNumber = '5511992891070'; // Número do WhatsApp

form?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const nome = document.getElementById('nome').value;
    const telefone = document.getElementById('telefone').value;
    const largura = document.getElementById('larguraparede').value;
    const altura = document.getElementById('alturaparede').value;
    
    // Monta a mensagem para WhatsApp
    const mensagem = `Olá! Gostaria de solicitar um orçamento:

*Nome:* ${nome}
*Telefone:* ${telefone}
*Largura da parede:* ${largura}m
*Altura da parede:* ${altura}m

Aguardo retorno!`;
    
    // Codifica a mensagem para URL
    const mensagemCodificada = encodeURIComponent(mensagem);
    
    // URL do WhatsApp
    const urlWhatsApp = `https://wa.me/${whatsappNumber}?text=${mensagemCodificada}`;
    
    // Abre o WhatsApp em nova aba
    window.open(urlWhatsApp, '_blank');
    
    // Mostra mensagem de sucesso
    const msgSuccess = document.getElementById('msgSuccess');
    msgSuccess.style.display = 'block';
    
    // Reseta o formulário
    form.reset();
    
    // Esconde mensagem após 5 segundos
    setTimeout(() => {
        msgSuccess.style.display = 'none';
    }, 5000);
});
