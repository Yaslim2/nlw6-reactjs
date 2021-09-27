import logoImg from "../assets/images/logo.svg";

import '../styles/loading.scss'
export function Loading() {
    return (
        <div id='loading-page'>
            <img src={logoImg} alt="logo do app" />
        </div>
    )
}