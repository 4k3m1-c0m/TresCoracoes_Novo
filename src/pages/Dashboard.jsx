import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ nome: '', descricao: '', preco: '', estoque: '0', imagem: '' });
  const [saving, setSaving] = useState(false);
  const name = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'Cliente';
  const avatar = user?.user_metadata?.avatar_url || user?.user_metadata?.picture;

  async function loadProducts() {
    setLoading(true); setError('');
    const { data, error } = await supabase.from('produtos').select('*').order('id', { ascending: true });
    if (error) setError(error.message); else setProducts(data || []);
    setLoading(false);
  }
  useEffect(() => { loadProducts(); }, []);

  async function addProduct(e) {
    e.preventDefault(); setSaving(true); setError('');
    const { error } = await supabase.from('produtos').insert({
      nome: form.nome.trim(), descricao: form.descricao.trim(), preco: Number(form.preco),
      estoque: Number(form.estoque), imagem: form.imagem.trim() || null, ativo: true
    });
    if (error) setError(error.message);
    else { setForm({ nome: '', descricao: '', preco: '', estoque: '0', imagem: '' }); await loadProducts(); }
    setSaving(false);
  }

  async function deleteProduct(id) {
    if (!window.confirm('Deseja excluir este produto?')) return;
    const { error } = await supabase.from('produtos').delete().eq('id', id);
    if (error) setError(error.message); else setProducts(items => items.filter(item => item.id !== id));
  }

  async function handleLogout() {
    const { error } = await signOut();
    if (error) setError(error.message);
  }

  return <main className="dashboard-page"><header className="dashboard-header"><div><div className="brand-mark small">3 <span>♥♥♥</span></div><p className="muted">Painel de gerenciamento</p></div><button className="outline-button" onClick={handleLogout}>Sair</button></header>
    <section className="profile-card">{avatar ? <img className="avatar" src={avatar} alt="Foto do perfil" referrerPolicy="no-referrer" /> : <div className="avatar initials">{name.charAt(0).toUpperCase()}</div>}<div><p className="eyebrow">SESSÃO ATIVA</p><h1>Olá, {name}!</h1><p className="muted">{user?.email}</p></div></section>
    <section className="dashboard-content"><div className="section-heading"><div><p className="eyebrow">CRUD DE PRODUTOS</p><h2>Gerenciar produtos</h2></div><button className="outline-button" onClick={loadProducts}>Atualizar</button></div>
      <form className="product-form" onSubmit={addProduct}><h3>Adicionar produto</h3><div className="form-grid"><label>Nome<input required value={form.nome} onChange={e => setForm({...form, nome:e.target.value})} placeholder="Nome do café" /></label><label>Preço (R$)<input required type="number" min="0.01" step="0.01" value={form.preco} onChange={e => setForm({...form, preco:e.target.value})} placeholder="18,90" /></label><label>Estoque<input required type="number" min="0" step="1" value={form.estoque} onChange={e => setForm({...form, estoque:e.target.value})} /></label><label>Imagem (URL ou caminho)<input value={form.imagem} onChange={e => setForm({...form, imagem:e.target.value})} placeholder="./img/cafe.png" /></label><label className="full-width">Descrição<input value={form.descricao} onChange={e => setForm({...form, descricao:e.target.value})} placeholder="Descrição do produto" /></label></div><button className="primary-button" disabled={saving}>{saving ? 'Salvando...' : 'Salvar produto'}</button></form>
      {error && <p className="feedback error">Erro: {error}. Confira as políticas RLS da tabela produtos.</p>}
      <div className="products-heading"><h3>Produtos cadastrados</h3><span>{products.length} itens</span></div>
      {loading ? <p className="muted">Carregando...</p> : products.length === 0 ? <p className="muted">Nenhum produto cadastrado.</p> : <div className="product-list">{products.map(p => <article className="product-row" key={p.id}><div className="product-thumb">{p.imagem ? <img src={p.imagem} alt="" onError={e => {e.currentTarget.style.display='none';}} /> : '☕'}</div><div className="product-details"><strong>{p.nome}</strong><p>{p.descricao || 'Sem descrição'}</p><span>{Number(p.preco).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})} · Estoque: {p.estoque}</span></div><button className="delete-button" onClick={() => deleteProduct(p.id)} aria-label={`Excluir ${p.nome}`}>Excluir</button></article>)}</div>}
    </section>
  </main>;
}
