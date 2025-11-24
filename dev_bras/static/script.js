// Smooth scroll reveal on page load and scroll
document.addEventListener('DOMContentLoaded', () => {
    // Inicializa animações de entrada
    initScrollReveal();
    
    // Adiciona smooth scroll para todos os links internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Adiciona efeito parallax suave no hero
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.carousel-inner');
        parallaxElements.forEach(el => {
            el.style.transform = `translateY(${scrolled * 0.3}px)`;
        });
    });
});

// Scroll Reveal Animation
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.card, .benefit-icon, h2, h3, .btn-warning, form');
    
    const revealOnScroll = () => {
        revealElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                el.classList.add('reveal', 'active');
            }
        });
    };
    
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger on load
}

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

// Auto-rotate com pausa no hover
let carouselInterval = setInterval(nextSlide, 5000);
const carousel = document.querySelector('#heroCarousel, .carousel');
if (carousel) {
    carousel.addEventListener('mouseenter', () => {
        clearInterval(carouselInterval);
    });
    carousel.addEventListener('mouseleave', () => {
        carouselInterval = setInterval(nextSlide, 5000);
    });
}

// Scroll suave para formulário
document.getElementById('cta-btn')?.addEventListener('click', () => {
    document.getElementById('form-orcamento')?.scrollIntoView({ behavior: 'smooth' });
});

// Envio do formulário para WhatsApp com animação
const form = document.getElementById('lp-form');
const whatsappNumber = '5511992891070'; // Número do WhatsApp

form?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Animação do botão durante envio
    submitBtn.textContent = 'Enviando...';
    submitBtn.disabled = true;
    submitBtn.style.opacity = '0.7';
    
    const nome = document.getElementById('nome').value;
    const telefone = document.getElementById('telefone').value;
    const largura = document.getElementById('larguraparede')?.value || '';
    const altura = document.getElementById('alturaparede')?.value || '';
    
    // Monta a mensagem para WhatsApp
    const mensagem = `Olá! Gostaria de solicitar um orçamento:

*Nome:* ${nome}
*Telefone:* ${telefone}
${largura ? `*Largura da parede:* ${largura}m` : ''}
${altura ? `*Altura da parede:* ${altura}m` : ''}

Aguardo retorno!`;
    
    // Codifica a mensagem para URL
    const mensagemCodificada = encodeURIComponent(mensagem);
    
    // URL do WhatsApp
    const urlWhatsApp = `https://wa.me/${whatsappNumber}?text=${mensagemCodificada}`;
    
    // Pequeno delay para dar feedback visual
    setTimeout(() => {
        // Abre o WhatsApp em nova aba
        window.open(urlWhatsApp, '_blank');
        
        // Mostra mensagem de sucesso com animação
        const msgSuccess = document.getElementById('msgSuccess');
        if (msgSuccess) {
            msgSuccess.style.display = 'block';
            msgSuccess.style.animation = 'fadeInUp 0.5s ease';
        }
        
        // Reseta o formulário
        form.reset();
        
        // Restaura botão
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
        
        // Esconde mensagem após 5 segundos
        setTimeout(() => {
            if (msgSuccess) {
                msgSuccess.style.animation = 'fadeIn 0.3s ease reverse';
                setTimeout(() => {
                    msgSuccess.style.display = 'none';
                }, 300);
            }
        }, 5000);
    }, 800);
});

// Adiciona validação visual nos inputs
document.querySelectorAll('input, select, textarea').forEach(input => {
    input.addEventListener('focus', function() {
        this.style.transform = 'scale(1.02)';
    });
    
    input.addEventListener('blur', function() {
        this.style.transform = 'scale(1)';
    });
});
