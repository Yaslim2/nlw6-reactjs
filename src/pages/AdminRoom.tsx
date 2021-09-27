import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";

// toasts
import "react-toastify/dist/ReactToastify.css";

// imagens
import logoImg from "../assets/images/logo.svg";
import deleteImg from '../assets/images/delete.svg'
import emptyQuestionsImg from '../assets/images/empty-questions.svg'
import errorImg from '../assets/images/alert-circle.svg'

// componentes
import { Button } from "../components/Button";
import { Question } from "../components/Question";
import { RoomCode } from "../components/RoomCode";
import { Loading } from "../components/Loading";

// hooks
import { useRoom } from "../hooks/useRoom";
import { useAuth } from "../hooks/useAuth";


// firebase
import { database } from "../services/firebaseConnection";


// css
import "../styles/room.scss";


type Params = {
    id: string;
};


export function AdminRoom() {
    const [loading, setLoading] = useState(true)
    const [isRoomAdmin, setIsRoomAdmin] = useState(false)
    const [isFinished, setIsFinished] = useState(false)
    const { user } = useAuth()
    const history = useHistory()
    const params = useParams<Params>();
    const roomId = params.id;

    console.log(loading)
    const { questions, title } = useRoom(roomId)
    useEffect(() => {
        async function checkAdminAndRoomIsFinished() {
            const roomAdmin = await database.ref(`rooms/${roomId}/authorId`).get()
            if (roomAdmin.val() === user?.id) {
                setIsRoomAdmin(true)
            }

            const finished = await database.ref(`rooms/${roomId}/endedAt`).get()
            if (finished.exists()) {
                setIsFinished(true)
            }
            setLoading(false)
        }

        checkAdminAndRoomIsFinished()

    }, [roomId, user?.id])

    async function handleEndRoom() {
        await database.ref(`rooms/${roomId}`).update({
            endedAt: new Date()
        })
        history.push('/')
    }

    async function handleDeleteQuestion(questionId: string) {
        if (window.confirm('Tem certeza que deseja excluir esta pergunta?')) {
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
        }
    }

    return (
        ((isRoomAdmin === true && isFinished === false)) ? (
            loading ? (
                <Loading />
            ) : (
                <div id="page-room">
                    <header>
                        <div className="content">
                            <img src={logoImg} alt="logo letmeask" />
                            <div>
                                <RoomCode code={roomId} />
                                <Button onClick={handleEndRoom} isOutlined={true}>Encerrar sala</Button>
                            </div>

                        </div>
                    </header>

                    <main>
                        <div className="room-title">
                            <h1>Sala {title}</h1>
                            {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
                        </div>

                        <div className='questions-list'>
                            {questions.length > 0 ? (questions.map(value => {
                                return (
                                    <Question
                                        key={value.id}
                                        content={value.content}
                                        author={value.author}
                                    >
                                        <button type='button' onClick={() => handleDeleteQuestion(value.id)}>
                                            <img src={deleteImg} alt="Remover pergunta" />
                                        </button>
                                    </Question>
                                )
                            })) : (
                                <div className='no-questions-admin'>
                                    <img src={emptyQuestionsImg} alt="sem perguntas" />
                                    <h2>Nenhuma pergunta por aqui...</h2>
                                    <p>Envie o código desta sala para seus amigos e comece a responder perguntas!</p>
                                </div>
                            )}
                        </div>

                    </main>
                </div>
            )
        ) : (
            loading ? (<Loading />) : (
                <div id='page-error'>
                    <img src={errorImg} alt="error" />
                    {isRoomAdmin ? (<h2>A sala buscada já foi encerrada.</h2>) : (<h2>Você não tem permissão para acessar essa rota.</h2>)}
                </div>
            )
        )
    );
}
