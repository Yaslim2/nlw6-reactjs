import copyImage from '../assets/images/copy.svg'

import '../styles/roomCode.scss'

type RoomCodeProps = {
    code: string
}

export function RoomCode(props: RoomCodeProps) {
    function copyRoomCodeToClipBoard() {
        navigator.clipboard.writeText(props.code)
    }

    return (
        <button onClick={copyRoomCodeToClipBoard} className="room-code">
            <div>
                <img src={copyImage} alt="Copy room code" />
            </div>
            <span>Sala #{props.code}</span>
        </button>
    )
}