import { useState } from 'react'
import lucas from '../../assets/lukinhas.png'
import { useNavigate } from 'react-router-dom'
import './Clicker.css'

export default function Clicker() {
    const [counter, setCounter] = useState(0)
    const [multiplier, setMultiplier] = useState(1)
    const [menuOpen, setMenuOpen] = useState(false)
    let navigate = useNavigate()

    const increment = () => {
        setCounter(prev => prev + Math.floor(1 * multiplier))
    }

    const copiar = async (text) => {
        try {
            await navigator.clipboard.writeText(text)
            alert("Copiado para área de transferência")
        } catch (err) {
            alert(err)
        }
    }

    const goTo = (path) => {
        setMenuOpen(false)
        navigate(path)
    }

    return (
        <div className="content">
            <header className="app-header">
                <button
                    className={`hamburger ${menuOpen ? 'open' : ''}`}
                    onClick={() => setMenuOpen(prev => !prev)}
                    aria-label="Abrir menu"
                    aria-expanded={menuOpen}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                <nav className={`menu-dropdown ${menuOpen ? 'show' : ''}`}>
                    <span className="link-span" onClick={() => goTo("/login")}>LOGIN</span>
                    <span className="link-span" onClick={() => goTo("/join-group")}>ENTRAR EM GRUPO</span>
                </nav>
            </header>

            <h1>Lukinhas Clicker</h1>
            <img
                src={lucas}
                alt="Lucas"
                onClick={increment}
                id='lucas'
                width={250}
            />
            <br />
            <p>Clicks: {counter}</p>
            <p>Click multiplier: {multiplier}</p>

            <pre
                id='share'
                style={{ cursor: "pointer" }}
                onClick={async () => {
                    await copiar("https://xongsmint.github.io/lucas-clicker/")
                }}
            >COMPARTILHE COM AMIGOS</pre>
        </div>
    )
}
