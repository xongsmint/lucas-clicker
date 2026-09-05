import { useState, useEffect, useRef } from 'react'
import lucas from '../../assets/lukinhas.png'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import './Clicker.css'

export default function Clicker({ apiUrl }) {
    const pendingRef = useRef(0)

    const [clicks, setClicks] = useState(() => {
        const saved = localStorage.getItem("clicks")
        if (saved === null) return 0

        let parsed
        try {
            parsed = JSON.parse(saved)
        } catch {
            return 0
        }

        const num = Number(parsed)
        return Number.isInteger(num) ? num : 0
    })
    const [multiplier, setMultiplier] = useState(1)
    const [username, setUsername] = useState(null)

    const [menuOpen, setMenuOpen] = useState(false)
    const [userLogged, setUserLogged] = useState(false)

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const navigate = useNavigate()

    // CHECK IF LOGGED AND FETCH CLICKS AND MULTIPLIER AT START
    useEffect(() => {
        const accessToken = Cookies.get("accessToken")
        if (!accessToken) return

        setUserLogged(true)

        const controller = new AbortController()

        const fetchStats = async () => {
            try {
                setLoading(true)

                const response = await fetch(apiUrl + "/stats", {
                    method: "GET",
                    headers: { "Authorization": `Bearer ${accessToken}` },
                    signal: controller.signal,
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

        return () => controller.abort()
    }, [apiUrl])

    // FETCH PROFILE (to know who's logged in)
    useEffect(() => {
        const accessToken = Cookies.get("accessToken")
        if (!accessToken) return

        const controller = new AbortController()

        async function fetchProfile() {
            try {
                const response = await fetch(apiUrl + "/profile", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${accessToken}`
                    },
                    signal: controller.signal
                })

                if (!response.ok) {
                    throw new Error(`Request failed with status ${response.status}`)
                }

                const json = await response.json()
                setUsername(json.username)
            } catch (err) {
                if (err.name !== "AbortError") {
                    setError(err)
                }
            }
        }

        fetchProfile()

        return () => controller.abort()
    }, [apiUrl])

    // PERIODICALLY FLUSH PENDING CLICKS TO THE SERVER
    useEffect(() => {
        if (!userLogged) return

        const accessToken = Cookies.get("accessToken")

        const id = setInterval(async () => {
            const increment = pendingRef.current
            if (increment === 0) return // nada pra enviar, evita POST vazio

            try {
                const response = await fetch(apiUrl + "/clicks", {
                    method: "POST",
                    headers: {
                        "Content-type": "application/json",
                        "Authorization": `Bearer ${accessToken}`
                    },
                    body: JSON.stringify({ increment })
                })

                if (!response.ok) {
                    throw new Error(`Request failed with status ${response.status}`)
                }

                pendingRef.current -= increment
            } catch (err) {
                setError(err)
            }
        }, 10_000) // 10s

        return () => clearInterval(id)
    }, [apiUrl, userLogged])

    const increment = () => {
        pendingRef.current += 1 * multiplier
        setClicks(prev => prev + (1 * multiplier))
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
                    {userLogged ? "" : <span className="link-span" onClick={() => goTo("/login")}>LOGIN</span>}
                    {userLogged ? <span className="link-span" onClick={() => goTo("/perfil")}>PERFIL</span> : ""}
                    <span className="link-span" onClick={() => goTo("/ranking")}>RANKING</span>
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
            {username === "fabio" && isFabioTimedOut() ? <p style={{ color: "red" }}>Você está de castigo até amanhã 😤</p> : ""}
            {error ? <p style={{ color: "red" }}>Erro ao sincronizar: {error.message}</p> : ""}

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
