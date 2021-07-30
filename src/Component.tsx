import { useState } from 'react'
import styles from './styles/index.scss'
import eyeGif from './eye.gif'

const Component: React.FC = () => {
    const [clicked, setClicked] = useState(false)
    return (
        <>
            <h1>React application</h1>
            <button
                type="button"
                style={{
                    all: 'unset',
                    userSelect: 'none',
                    cursor: 'pointer',
                }}
                onClick={() => setClicked((b) => !b)}
            >
                {clicked ? 'clicked' : 'not clicked'}
            </button>
            <img className={styles.image} src={eyeGif} alt="eye animation" />
        </>
    )
}

export default Component
