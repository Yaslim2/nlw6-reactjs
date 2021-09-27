import { useEffect, useState } from 'react'
import errorImg from '../assets/images/alert-circle.svg'
export function ErrorPage(props: { isRoomAdmin: boolean }) {
    const [loader, setLoader] = useState(false)

    useEffect(() => {
        setTimeout(() => { setLoader(true) }, 100)
    }, [])
    return (

        <div>
            {
                props.isRoomAdmin
                    ?
                    loader && (
                        <div id='page-error'>
                            <img src={errorImg} alt="error" />
                            <h2>A sala buscada já foi encerrada.</h2>
                        </div>
                    )
                    :
                    loader && (
                        <div id='page-error'>
                            <img src={errorImg} alt="error" />
                            <h2>Você não tem permissão para acessar essa rota.</h2>
                        </div>
                    )
            }
        </div>


    )
}