import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";
import { motion } from "framer-motion";

const categorias = ["Todas", "Política", "Futebol", "Economia", "Cultura"];

function Home({ noticias }) {
  const [filtro, setFiltro] = useState("Todas");
  const [busca, setBusca] = useState("");

  const noticiasFiltradas = noticias.filter((n) => {
    const matchCategoria = filtro === "Todas" || n.categoria === filtro;
    const matchBusca = n.titulo.toLowerCase().includes(busca.toLowerCase());
    return matchCategoria && matchBusca;
  });

  return (
    <main style={{ padding: 20 }}>
      <header style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <h1>Agora Brasil</h1>
        <div>
          <input
            placeholder="Buscar título..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            style={{ marginRight: 10 }}
          />
          <Link to="/nova">Nova Notícia</Link>
        </div>
      </header>
      <nav style={{ marginBottom: 20 }}>
        {categorias.map((cat) => (
          <button key={cat} onClick={() => setFiltro(cat)} style={{ marginRight: 5 }}>
            {cat}
          </button>
        ))}
      </nav>
      <section style={{ display: "grid", gap: 20 }}>
        {noticiasFiltradas.map((noticia, idx) => (
          <Link to={`/noticia/${idx}`} key={idx}>
            <motion.div whileHover={{ scale: 1.03 }} style={{ padding: 20, background: "#fff", borderRadius: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
              <h2>{noticia.titulo}</h2>
              <p><i>{noticia.categoria}</i></p>
              <p>{noticia.conteudo.substring(0, 100)}...</p>
            </motion.div>
          </Link>
        ))}
      </section>
    </main>
  );
}

function NovaNoticia({ adicionarNoticia }) {
  const [titulo, setTitulo] = useState("");
  const [categoria, setCategoria] = useState("Política");
  const [conteudo, setConteudo] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    adicionarNoticia({ titulo, categoria, conteudo });
    navigate("/");
  };

  return (
    <main style={{ padding: 20 }}>
      <form onSubmit={handleSubmit}>
        <h2>Nova Notícia</h2>
        <input
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        /><br />
        <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
          {categorias.filter(c => c !== "Todas").map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select><br />
        <textarea
          placeholder="Conteúdo"
          value={conteudo}
          onChange={(e) => setConteudo(e.target.value)}
          required
        /><br />
        <button type="submit">Publicar</button>
      </form>
    </main>
  );
}

function PaginaNoticia({ noticias }) {
  const { id } = useParams();
  const noticia = noticias[parseInt(id)];

  if (!noticia) return <p>Notícia não encontrada.</p>;

  return (
    <main style={{ padding: 20 }}>
      <h1>{noticia.titulo}</h1>
      <p><i>{noticia.categoria}</i></p>
      <p>{noticia.conteudo}</p>
    </main>
  );
}

export default function App() {
  const [noticias, setNoticias] = useState([
    {
      titulo: "Novo projeto de lei é aprovado no Senado",
      categoria: "Política",
      conteudo: "O Senado aprovou nesta terça-feira um novo projeto de lei que..."
    },
    {
      titulo: "Clássico entre Flamengo e Palmeiras termina empatado",
      categoria: "Futebol",
      conteudo: "Em um jogo muito disputado, os times ficaram no 2 a 2..."
    }
  ]);

  const adicionarNoticia = (nova) => {
    setNoticias((prev) => [nova, ...prev]);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home noticias={noticias} />} />
        <Route path="/nova" element={<NovaNoticia adicionarNoticia={adicionarNoticia} />} />
        <Route path="/noticia/:id" element={<PaginaNoticia noticias={noticias} />} />
      </Routes>
    </Router>
  );
}