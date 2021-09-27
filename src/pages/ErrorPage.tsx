import { useEffect, useState } from 'react'
import errorImg from '../assets/images/alert-circle.svg'

type ErrorPageProps = {
    isRoomAdmin: boolean;
    isFinished: boolean;
    roomIdExists: boolean;
}

export function ErrorPage({isRoomAdmin, roomIdExists, isFinished}: ErrorPageProps) {
    const [loader, setLoader] = useState(false)

    useEffect(() => {
        setTimeout(() => { setLoader(true) }, 100)
    }, [])
    return (

        <div>
           {loader && (
               <div id="page-error">
                   <img src={errorImg} alt="error" />
                   <h2>{roomIdExists ? (isFinished ? 'A sala buscada já foi encerrada.' : 'Você não tem permissão para acessar esta página.') : 'A sala buscada não existe.'}</h2>
               </div>
           )}
        </div>


    )
}