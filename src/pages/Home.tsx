import { FormEvent, useState } from "react";
import { useHistory } from "react-router-dom";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// imagens
import illustrationImg from "../assets/images/illustration.svg";
import logoImg from "../assets/images/logo.svg";
import googleIconImg from "../assets/images/google-icon.svg";
import enterRoomIconImg from "../assets/images/log-in.svg";

import { Button } from "../components/Button";

// css
import "../styles/auth.scss";

// hook de context
import { useAuth } from "../hooks/useAuth";

// firebase
import { database } from "../services/firebaseConnection";

export function Home() {
  const { signInWithGoogle, user } = useAuth();
  const history = useHistory();

  const [roomCode, setRoomCode] = useState("");

  async function handleLoginAndRedirect() {
    if (!user) {
      await signInWithGoogle();
    }
    history.push("/rooms/new");
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault();

    if (roomCode.trim() === "") {
      toast.warn('Digite o código da sala')
      return;
    }

    const roomRef = await database.ref(`rooms/${roomCode}`).get();

    if (!roomRef.exists()) {
      toast.error('Sala não encontrada')
      return;
    }

    history.push(`rooms/${roomCode}`);
  }

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
          <button className="create-room" onClick={handleLoginAndRedirect}>
            <img src={googleIconImg} alt="Icone do Google" />
            Crie sua sala com o Google
          </button>

          <div className="separator">ou entre em uma sala</div>

          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              placeholder="Digite o código da sala"
              onChange={(event) => setRoomCode(event.target.value)}
              value={roomCode}
            />

            <Button type="submit">
              <img src={enterRoomIconImg} alt="ícone de entrar na sala" />
              Entrar na sala
            </Button>
          </form>
        </div>
      </main>
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='colored'
      />
    </div>
  );
}
