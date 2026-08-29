import { useState, useEffect } from 'react'
import lucas from '../../assets/lukinhas.png'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import './Clicker.css'

export default function Clicker() {
    const [counter, setCounter] = useState(0)
    const [clicks, setClicks] = useState(0)
    const [multiplier, setMultiplier] = useState(1)

    const [menuOpen, setMenuOpen] = useState(false)

    const [userLogged, setUserLogged] = useState(false)

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const navigate = useNavigate()

    const apiUrl = import.meta.env.VITE_DATABASE_URL

    // CHECK IF LOGGED AND FETCH CLICKS AND MULTIPLIER AT START
    useEffect(() => {
        const accessToken = Cookies.get("accessToken")

        if (accessToken) {
            setUserLogged(true)

            const fetchStats = async () => {
                try {
                    setLoading(true)

                    const response = await fetch(apiUrl + "/stats", {
                        method: "GET",
                        headers: { "Authorization": `Bearer ${accessToken}` },
                    })

                    if (!response.ok) {
                        throw new Error(`Request failed with status ${response.status}`)
                    }

                    const json = await response.json()
                    setClicks(json.clicks)
                    setMultiplier(json.multiplier)
                } catch (err) {
                    if (err.name !== "AbortError") {
                        setError(err)
                    }
                } finally {
                    setLoading(false)
                }
            }

            fetchStats()
        }
    }, [apiUrl])

    const increment = () => {
        setCounter(prev => prev + (1 * multiplier)) // pendente de envio ao servidor
        setClicks(prev => prev + (1 * multiplier)) // total exibido na tela
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
                    {userLogged ? <span className="link-span" onClick={() => goTo("/join-group")}>ENTRAR EM GRUPO</span> : ""}
                    {userLogged ? <span className="link-span" onClick={() => goTo("/perfil")}>PERFIL</span> : ""}
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

            <p>Clicks: {loading ? "-" : clicks}</p>
            <p>Click multiplier: {loading ? "-" : multiplier}</p>
            {userLogged ? "" : <p>Você não está logado! Jogar sem conta faz você correr o risco de perder os cliques e bloqueia os sistemas de skins e skills.</p>}
            {/* <p>c: {counter}</p> */}

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
