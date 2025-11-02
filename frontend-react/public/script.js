(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    /* Carrossel simples */
    const carousel = document.querySelector('.carousel');
    if (carousel) {
      const slides = carousel.querySelectorAll('.slide');
      const prevBtn = carousel.querySelector('.carousel-btn.prev');
      const nextBtn = carousel.querySelector('.carousel-btn.next');
      if (slides.length > 1 && prevBtn && nextBtn) {
        let currentIdx = 0;
        const showSlide = (idx) => {
          slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === idx);
          });
        };
        const nextSlide = () => {
          currentIdx = (currentIdx + 1) % slides.length;
          showSlide(currentIdx);
        };
        const prevSlide = () => {
          currentIdx = (currentIdx - 1 + slides.length) % slides.length;
          showSlide(currentIdx);
        };
        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);
        setInterval(nextSlide, 4000);
        showSlide(currentIdx);
      }
    }

    /* CTA com scroll suave */
    const ctaBtn = document.getElementById('cta-btn');
    const formSection = document.getElementById('form-orcamento');
    if (ctaBtn && formSection) {
      ctaBtn.addEventListener('click', function (event) {
        event.preventDefault();
        formSection.scrollIntoView({ behavior: 'smooth' });
      });
    }

    const form = document.getElementById('lp-form') || document.getElementById('orcamentoForm');
    const msgSuccess = document.getElementById('msgSuccess');
    const modalElement = document.getElementById('whatsappModal');
    const enderecoEl = document.getElementById('endereco');
    const mapFrame = document.getElementById('mapFrame');

    function updateMapFromEndereco() {
      if (!enderecoEl || !mapFrame) return;
      const value = enderecoEl.value && enderecoEl.value.trim();
      if (!value) return;
      const q = encodeURIComponent(value);
      mapFrame.src = `https://www.google.com/maps?q=${q}&output=embed`;
    }

    if (enderecoEl && mapFrame) {
      const debounce = (fn, wait) => {
        let timer = null;
        return function (...args) {
          if (timer) clearTimeout(timer);
          timer = setTimeout(() => fn.apply(this, args), wait);
        };
      };

      enderecoEl.addEventListener('blur', updateMapFromEndereco);
      enderecoEl.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
          event.preventDefault();
          updateMapFromEndereco();
        }
      });
      enderecoEl.addEventListener('input', debounce(() => {
        if (enderecoEl.value && enderecoEl.value.trim()) {
          updateMapFromEndereco();
        }
      }, 700));
      if (enderecoEl.value && enderecoEl.value.trim()) {
        updateMapFromEndereco();
      }
    }

    if (!form) {
      return;
    }

    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      event.stopPropagation();

      const decimalIds = ['parede', 'altura_parede', 'janela_largura', 'janela_altura'];
      decimalIds.forEach((id) => {
        const el = document.getElementById(id);
        if (el && el.value) {
          el.value = el.value.trim().replace(',', '.');
        }
      });

      if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
      }
      form.classList.remove('was-validated');

      let modal = null;
      if (modalElement && window.bootstrap?.Modal) {
        modal = window.bootstrap.Modal.getOrCreateInstance(modalElement);
        modal.show();
      }

      const formData = new FormData(form);
      try {
        const response = await fetch(form.action || '/enviar', {
          method: 'POST',
          body: formData,
        });
        const text = await response.text();
        if (text.trim() !== 'success') {
          throw new Error(`Resposta inesperada: ${text}`);
        }
        if (msgSuccess) {
          msgSuccess.style.display = 'block';
        }
      } catch (error) {
        console.error('Erro ao enviar formulário', error);
        if (modal) {
          modal.hide();
        }
        alert('Erro ao enviar formulário. Tente novamente.');
        return;
      }

      const nome = formData.get('nome') || '';
      const telefone = formData.get('telefone') || '';
      const parede = formData.get('parede') || '';
      const alturaParede = formData.get('altura_parede') || '';
      const janelaLargura = formData.get('janela_largura') || '';
      const janelaAltura = formData.get('janela_altura') || '';
      const tecido = formData.get('tecido') || '';
      const instalacao = formData.get('instalacao') || '';
      const observacoes = formData.get('observacoes') || '';
      const endereco = formData.get('endereco') || '';

      let msg = `Olá! Gostaria de um orçamento de cortina sob medida:%0A`;
      msg += `*Nome:* ${nome}%0A`;
      msg += `*Telefone:* ${telefone}%0A`;
      msg += `*Parede:* ${parede}m (L) x ${alturaParede}m (A)%0A`;
      msg += `*Janela:* ${janelaLargura}m (L) x ${janelaAltura}m (A)%0A`;
      msg += `*Tecido:* ${tecido}%0A`;
      msg += `*Instalação:* ${instalacao}%0A`;
      if (observacoes) msg += `*Observações:* ${observacoes}%0A`;
      if (endereco) msg += `*Endereço:* ${endereco}%0A`;

      try {
        const p = parseFloat(parede) || 0;
        const h = parseFloat(alturaParede) || 0;
        const jw = parseFloat(janelaLargura) || 0;
        const jh = parseFloat(janelaAltura) || 0;
        const area = Math.max(0, (p * h) - (jw * jh));
        const conversionValue = parseFloat(area.toFixed(2));
        if (typeof window.gtag === 'function') {
          window.gtag('event', 'conversion', {
            send_to: 'AW-17672945118/NDfiCJKV5bMbEN77jutB',
            value: conversionValue,
            currency: 'BRL',
          });
        }
      } catch (error) {
        console.warn('Falha ao calcular conversão para gtag', error);
      }

      setTimeout(() => {
        window.location.href = `https://wa.me/5511992891070?text=${msg}`;
      }, 1200);

      form.reset();
      if (msgSuccess) {
        setTimeout(() => {
          msgSuccess.style.display = 'none';
        }, 5000);
      }
    });
  });
})();
