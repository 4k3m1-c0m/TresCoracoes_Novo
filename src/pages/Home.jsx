import { Link } from 'react-router-dom';
export default function Home() {
  return <main className="home-page"><header className="topbar"><div className="brand-mark small">3 <span>♥♥♥</span></div><Link className="outline-button" to="/login">Entrar / Cadastrar</Link></header><section className="hero"><p className="eyebrow">O AMOR TEM CHEIRO DE CAFÉ</p><h1>Juntos por um café <em>incomparável.</em></h1><p>Entre na sua conta para acessar a área de gerenciamento da Cafeteria 3 Corações.</p><Link className="primary-link" to="/login">Acessar minha conta</Link></section><footer>☕ Cafeteria 3 Corações · Projeto acadêmico</footer></main>;
}
