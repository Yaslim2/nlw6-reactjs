import { FormEvent, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// toasts
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// imagens
import logoImg from "../assets/images/logo.svg";

// componentes
import { Button } from "../components/Button";
import { RoomCode } from "../components/RoomCode";

// auth
import { useAuth } from "../hooks/useAuth";

// firebase
import { database } from "../services/firebaseConnection";

// css
import "../styles/room.scss";

type Params = {
    id: string;
};

type FirebaseQuestions = Record<string, {
    author: {
        name: string,
        avatar: string,
    },
    content: string,
    isAnswered: boolean,
    isHighlighted: boolean
}>

type Question = {
    id: string
    author: {
        name: string
        avatar: string
    }
    isAnswered: boolean,
    isHighlighted: boolean
}

export function Room() {
    const { user, signInWithGoogle } = useAuth();
    const [newQuestion, setNewQuestion] = useState("");
    const [questions, setQuestions] = useState<Question[]>([])
    const [title, setTitle] = useState('')

    const params = useParams<Params>();
    const roomId = params.id;

    useEffect(() => {
        const roomRef = database.ref(`rooms/${roomId}`)

        roomRef.on('value', room => {

            const databaseRoom = room.val()

            const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {}

            const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighlighted: value.isHighlighted,
                    isAnswered: value.isAnswered
                }
            })
            setTitle(databaseRoom.title)
            setQuestions(parsedQuestions)
        })
    }, [roomId])

    async function handleSendQuestion(event: FormEvent) {
        event.preventDefault();
        if (newQuestion.trim() === "") {
            toast.warn("Digite a sua pergunta");
            return;
        }

        if (!user) {
            toast.error("Você precisa estar logado para realizar uma pergunta");
        }

        const question = {
            content: newQuestion,
            author: {
                name: user?.name,
                avatar: user?.avatar,
            },
            isHighlighted: false,
            isAnswered: false,
        };

        await database.ref(`rooms/${roomId}/questions`).push(question);
        toast.success("Pergunta enviada com sucesso", { autoClose: 2500 });
    }

    async function handleSignInWithGoogle(event: FormEvent) {
        event.preventDefault()
        signInWithGoogle()
    }
    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="" />
                    <RoomCode code={roomId} />
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
                </div>

                <form>
                    <textarea
                        placeholder="O que você deseja perguntar?"
                        onChange={(event) => setNewQuestion(event.target.value)}
                        value={newQuestion}
                    />

                    <div className="form-footer">
                        {user ? (
                            <div className='user-info'>
                                <img src={user.avatar} alt={user.name} />
                                <span>{user.name}</span>
                            </div>
                        ) : (
                            <span>
                                Para enviar uma pergunta, <button onClick={handleSignInWithGoogle}>faça seu login</button>.
                            </span>
                        )}
                        <Button disabled={!user} onClick={handleSendQuestion} type="submit">
                            Enviar pergunta
                        </Button>
                    </div>
                </form>

                {JSON.stringify(questions)}
            </main>
            <ToastContainer
                position="top-center"
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
