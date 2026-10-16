
const SUPABASE_URL = 'https://tgbsbqlbdssvftitueig.supabase.co';
const SUPABASE_KEY = 'sb_publishable_8WHe5Nl2Z9DLrOq7Q40YoA_db488atB';

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);


async function carregarProdutos() {
  const grid = document.getElementById('products-grid');

  const { data, error } = await supabaseClient
    .from('produtos')
    .select('id, nome, descricao, preco, imagem')
    .eq('ativo', true)
    .order('id');

  if (error) {
    console.error('Erro ao carregar produtos:', error);
    grid.textContent = 'Não foi possível carregar os produtos.';
    return;
  }

  grid.replaceChildren();

  data.forEach((produto) => {
    const card = document.createElement('div');
    card.className = 'product-card';

    const img = document.createElement('img');
    img.src = produto.imagem || '';
    img.alt = produto.nome;

    const info = document.createElement('div');
    info.className = 'card-info';

    const nome = document.createElement('h3');
    nome.textContent = produto.nome;

    const descricao = document.createElement('p');
    descricao.className = 'notes';
    descricao.textContent = produto.descricao || '';

    const preco = document.createElement('span');
    preco.className = 'price';
    preco.textContent = produto.preco.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });

    const botao = document.createElement('button');
    botao.textContent = 'Comprar';
    botao.addEventListener('click', () => {
      addToCart(produto.nome, Number(produto.preco));
    });

    info.append(nome, descricao, preco, botao);
    card.append(img, info);
    grid.appendChild(card);
  });
}

carregarProdutos();


let cart = [];

function toggleCart() {
  const modal = document.getElementById('cart-modal');
  modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
}

function addToCart(name, price) {
  cart.push({ name, price });
  updateCartDisplay();
}

function updateCartDisplay() {
  document.getElementById('cart-count').textContent = cart.length;

  const cartList = document.getElementById('cart-items');
  cartList.innerHTML = '';

  let total = 0;

  cart.forEach((item) => {
    total += item.price;
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${item.name}</span>
      <span>R$ ${item.price.toFixed(2).replace('.', ',')}</span>
    `;
    cartList.appendChild(li);
  });

  document.getElementById('cart-total').textContent = total.toFixed(2).replace('.', ',');
}

function checkout() {
  if (cart.length === 0) {
    alert('Seu carrinho está vazio!');
    return;
  }
  alert('Obrigado por comprar com a 3 Corações! O aroma do café já está a caminho.');
  cart = [];
  updateCartDisplay();
  toggleCart();
}

// Simulação de Recurso Nativo
function openCamera() {
  const status = document.getElementById('native-status');
  status.textContent = "⏳ Solicitando acesso à Câmera Nativa...";
  
  setTimeout(() => {
    status.innerHTML = "⚠️ <strong>Integração requerida:</strong> O leitor de QR Code para promoções de embalagem precisa da ponte nativa (Capacitor/Cordova) para acessar a câmera.";
  }, 1000);
}

function getGPSLocation() {
  const status = document.getElementById('native-status');
  status.textContent = "⏳ Obtendo GPS para buscar cafeterias...";

  setTimeout(() => {
    status.innerHTML = "⚠️ <strong>Permissão necessária:</strong> A geolocalização de alta precisão é gerenciada nativamente no aplicativo móvel.";
  }, 1000);
}