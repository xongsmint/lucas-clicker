import { useState, useEffect, useRef, useCallback } from 'react'
import lucas from '../../assets/lukinhas.png'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import './Clicker.css'

// Hook central: encapsula o "ritual" repetido de checar token,
// criar AbortController, fazer fetch autenticado e limpar no unmount.
function useAuthFetch(apiUrl, path, { onSuccess, onError, deps = [] }) {
    useEffect(() => {
        const accessToken = Cookies.get("accessToken")
        if (!accessToken) return

        const controller = new AbortController()

        async function run() {
            try {
                const response = await fetch(apiUrl + path, {
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

                onSuccess(await response.json())
            } catch (err) {
                if (err.name !== "AbortError") onError?.(err)
            }
        }

        run()
        return () => controller.abort()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [apiUrl, path, ...deps])
}

export default function Clicker({ apiUrl }) {
    const pendingRef = useRef(0)

    // CLICKS & LOCALSTORAGE
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

    // MULTIPLIER & LOCAL STORAGE
    const [multiplier, setMultiplier] = useState(() => {
        const saved = localStorage.getItem("multiplier")
        if (saved === null) return 1

        let parsed
        try {
            parsed = JSON.parse(saved)
        } catch {
            return 1
        }

        const num = Number(parsed)
        return Number.isInteger(num) && num > 0 ? num : 1
    })

    const [username, setUsername] = useState(null)

    const [menuOpen, setMenuOpen] = useState(false)
    const [userLogged, setUserLogged] = useState(false)

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const navigate = useNavigate()

    useEffect(() => {
        localStorage.setItem("clicks", JSON.stringify(clicks))
    }, [clicks])

    useEffect(() => {
        localStorage.setItem("multiplier", JSON.stringify(multiplier))
    }, [multiplier])

    // marca userLogged assim que existir token
    useEffect(() => {
        setUserLogged(!!Cookies.get("accessToken"))
    }, [])

    // STATS (clicks + multiplier)
    useAuthFetch(apiUrl, "/stats", {
        onSuccess: (json) => {
            setClicks(json.clicks)
            setMultiplier(json.multiplier)
            setLoading(false)
        },
        onError: (err) => {
            setError(err)
            setLoading(false)
        }
    })

    // dispara o loading só quando existe token (evita loading eterno pra visitante)
    useEffect(() => {
        if (Cookies.get("accessToken")) setLoading(true)
    }, [])

    // PROFILE (username)
    useAuthFetch(apiUrl, "/profile", {
        onSuccess: (json) => setUsername(json.username),
        onError: (err) => setError(err)
    })

    // flush periodico
    useEffect(() => {
        if (!userLogged) return

        const accessToken = Cookies.get("accessToken")

        const flush = async () => {
            const rawClicks = pendingRef.current
            if (rawClicks === 0) return

            try {
                const response = await fetch(apiUrl + "/clicks", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${accessToken}`
                    },
                    body: JSON.stringify({ clicks: rawClicks })
                })

                if (!response.ok) {
                    throw new Error(`Request failed with status ${response.status}`)
                }

                const data = await response.json()

                setClicks(data.clicks)
                setMultiplier(data.multiplier)

                pendingRef.current -= rawClicks
            } catch (err) {
                setError(err)
            }
        }

        const id = setInterval(flush, 10_000)

        const onHide = () => {
            if (document.visibilityState === "hidden") flush()
        }
        document.addEventListener("visibilitychange", onHide)

        return () => {
            clearInterval(id)
            document.removeEventListener("visibilitychange", onHide)
        }
    }, [apiUrl, userLogged])

    const increment = useCallback(() => {
        pendingRef.current += 1
        setClicks(prev => prev + (1 * multiplier)) // visual
    }, [multiplier])

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
