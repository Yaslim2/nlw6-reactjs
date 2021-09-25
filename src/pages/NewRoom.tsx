import { Link } from "react-router-dom";

// imagens
import illustrationImg from "../assets/images/illustration.svg";
import logoImg from "../assets/images/logo.svg";
import playIcon from "../assets/images/play-circle.svg";

import { Button } from "../components/Button";

// hook de context
import { useAuth } from "../hooks/useAuth";

// css
import "../styles/auth.scss";

export function NewRoom() {
  const { user } = useAuth();

  return (
    <div id="page-auth">
      <aside>
        <img
          src={illustrationImg}
          alt="Ilustração simbolizando perguntas e respostas"
        />
        <strong>Crie salas de Q&amp;A ao-vivo</strong>
        <p>Tire as dúvidas de sua audiência em tempo real</p>
      </aside>

      <main>
        <div className="main-content">
          <img src={logoImg} alt="Logo da aplicação" />
          <h2>Criar uma nova sala</h2>
          <form>
            <input type="text" placeholder="Código da sala" />

            <Button type="submit">
              <img src={playIcon} alt="icone de play" />
              Criar sala
            </Button>
          </form>

          <p>
            Quer entrar em uma sala já existente?{" "}
            <Link to="/">clique aqui</Link>
          </p>
        </div>
      </main>
    </div>
  );
}
