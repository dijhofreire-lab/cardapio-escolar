const STORAGE_PRESENCA = "domUngarelliPresencas";
const STORAGE_SUGESTOES = "domUngarelliSugestoes";

let presencas = JSON.parse(localStorage.getItem(STORAGE_PRESENCA)) || {
  cafe: 0,
  almoco: 0,
  tarde: 0
};

let sugestoes = JSON.parse(localStorage.getItem(STORAGE_SUGESTOES)) || [];

const $ = (id) => document.getElementById(id);

function atualizarData() {
  const agora = new Date();
  $("dataAtual").textContent = agora.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
}

function atualizarResumo() {
  const total = presencas.cafe + presencas.almoco + presencas.tarde;
  $("totalCafe").textContent = presencas.cafe;
  $("totalAlmoco").textContent = presencas.almoco;
  $("totalTarde").textContent = presencas.tarde;
  $("totalGeral").textContent = total;

  const limiteVisual = Math.max(total, 1);
  const percentual = Math.min((total / (limiteVisual + 5)) * 100, 100);
  $("barraProgresso").style.width = percentual + "%";

  $("statusPresenca").textContent = total
    ? `${total} registro(s) de presença realizados hoje.`
    : "Nenhuma presença registrada ainda.";
}

function toast(mensagem) {
  const el = $("toast");
  el.textContent = mensagem;
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 2200);
}

document.querySelectorAll(".btn-presenca").forEach(botao => {
  botao.addEventListener("click", () => {
    const refeicao = botao.dataset.refeicao;
    presencas[refeicao]++;
    localStorage.setItem(STORAGE_PRESENCA, JSON.stringify(presencas));
    atualizarResumo();
    toast("Presença registrada com sucesso!");
  });
});

$("limparPresencas").addEventListener("click", () => {
  if (confirm("Deseja realmente limpar os registros de presença?")) {
    presencas = { cafe: 0, almoco: 0, tarde: 0 };
    localStorage.setItem(STORAGE_PRESENCA, JSON.stringify(presencas));
    atualizarResumo();
    toast("Registros de presença limpos.");
  }
});

$("sugestao").addEventListener("input", (e) => {
  $("contador").textContent = `${e.target.value.length}/300 caracteres`;
});

function renderSugestoes() {
  const lista = $("listaSugestoes");
  lista.innerHTML = "";

  if (!sugestoes.length) {
    lista.innerHTML = `<p class="status">Ainda não há sugestões registradas. Sua ideia pode ser a primeira!</p>`;
    return;
  }

  sugestoes.slice().reverse().forEach(item => {
    const div = document.createElement("div");
    div.className = "sugestao-item";
    div.innerHTML = `
      <strong>${escapeHTML(item.nome)} — ${escapeHTML(item.turma)}</strong>
      <small>${escapeHTML(item.texto)}</small>
    `;
    lista.appendChild(div);
  });
}

function escapeHTML(texto) {
  return texto.replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;",
    '"': "&quot;", "'": "&#039;"
  }[char]));
}

$("formSugestao").addEventListener("submit", (e) => {
  e.preventDefault();

  const nova = {
    nome: $("nome").value.trim(),
    turma: $("turma").value.trim(),
    texto: $("sugestao").value.trim(),
    data: new Date().toLocaleString("pt-BR")
  };

  if (!nova.nome || !nova.turma || !nova.texto) return;

  sugestoes.push(nova);
  localStorage.setItem(STORAGE_SUGESTOES, JSON.stringify(sugestoes));

  e.target.reset();
  $("contador").textContent = "0/300 caracteres";
  renderSugestoes();
  toast("Sugestão enviada com sucesso!");
});

atualizarData();
atualizarResumo();
renderSugestoes();
