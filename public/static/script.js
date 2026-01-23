document.getElementById("lp-form").onsubmit = function(e) {
  e.preventDefault();
  var form = this;
  // Normaliza valores para ponto
  var largura = form.elements.larguraparede.value.replace(',', '.');
  var altura = form.elements.alturaparede.value.replace(',', '.');
  // Validação simples
  if (isNaN(largura) || isNaN(altura) || largura <= 0 || altura <= 0) {
    alert("Digite valores válidos para largura e altura.");
    return;
  }
  form.elements.larguraparede.value = largura;
  form.elements.alturaparede.value = altura;
  var data = new FormData(form);

  fetch("/enviar", {
    method: "POST",
    body: data
  }).then(response => response.text())
    .then(text => {
      if (text === "success") {
        document.getElementById("msgSuccess").style.display = "block";
        // WhatsApp com dados do lead
        const nome = form.elements.nome.value;
        const tel = form.elements.telefone.value;
        const msg = `Olá! Enviei um pedido de orçamento pelo site. Aguardo retorno.`;
        window.open(`https://wa.me/5511994013938?text=${encodeURIComponent(msg)}`, "_blank");
        form.reset();
      } else {
        alert("Erro ao enviar. Tente novamente.");
      }
    });
};

document.getElementById("cta-btn").onclick = function() {
  document.getElementById("form-orcamento").scrollIntoView({ behavior: "smooth" });
};
