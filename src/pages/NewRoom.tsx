import { Link, useHistory } from "react-router-dom";
import { FormEvent, useState } from 'react'

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// imagens
import illustrationImg from "../assets/images/illustration.svg";
import logoImg from "../assets/images/logo.svg";
import playIcon from "../assets/images/play-circle.svg";

import { Button } from "../components/Button";

// hook de context
import { useAuth } from "../hooks/useAuth";

// css
import "../styles/auth.scss";

// firebase
import { database } from "../services/firebaseConnection";

export function NewRoom() {
  const history = useHistory()
  const { user } = useAuth();

  const [newRoom, setNewRoom] = useState('')

  async function handleCreateRoom(event: FormEvent) {
    event.preventDefault()

    if (newRoom.trim() === '') {
      toast.warn('Digite um nome para a sala')
      return
    }
    const roomRef = database.ref('rooms')

    const firebaseRoom = await roomRef.push({
      title: newRoom,
      authorId: user?.id
    })

    history.push(`/rooms/admin/${firebaseRoom.key}`)
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
          <h2>Criar uma nova sala</h2>
          <form onSubmit={handleCreateRoom}>
            <input
              type="text"
              placeholder="Nome da sala"
              onChange={event => setNewRoom(event.target.value)}
              value={newRoom}
            />

            <Button disabled={!user} type="submit">
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
