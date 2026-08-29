import { useState, useEffect, useRef } from 'react'
import lucas from '../../assets/lukinhas.png'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import './Clicker.css'

export default function Clicker() {
    // pendingRef guarda os cliques ainda não enviados ao servidor.
    // Usar um ref evita o problema de "closure obsoleta": o setInterval
    // lê pendingRef.current em tempo real, e não um valor "congelado"
    // no momento em que o efeito foi criado.
    const pendingRef = useRef(0)

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

                // só zera o que foi de fato confirmado pelo servidor;
                // se o usuário clicou mais durante o fetch, isso não se perde
                pendingRef.current -= increment
            } catch (err) {
                // mantém pendingRef intacto para tentar de novo no próximo tick
                setError(err)
            }
        }, 10_000) // 10s

        return () => clearInterval(id)
    }, [apiUrl, userLogged])

    const increment = () => {
        pendingRef.current += 1 * multiplier // pendente de envio ao servidor
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
                    {userLogged ? "" : <span className="link-span" onClick={() => goTo("/login")}>LOGIN</span>}
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
