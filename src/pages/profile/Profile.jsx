import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Cookies from "js-cookie"
import "./profile.css"

export default function Profile({ apiUrl }) {
    const [data, setData] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate()

    useEffect(() => {
        const controller = new AbortController()

        async function fetchProfile() {
            try {
                setLoading(true)
                const accessToken = Cookies.get("accessToken")

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
                setData(json)
            } catch (err) {
                if (err.name !== "AbortError") {
                    setError(err)
                }
            } finally {
                setLoading(false)
            }
        }

        fetchProfile()

        return () => controller.abort()
    }, [apiUrl])

    const initials = data
        ? `${data.first_name?.[0] ?? ""}${data.last_name?.[0] ?? ""}`.toUpperCase()
        : ""

    if (loading) {
        return (
            <div className="content profile-card">
                <p className="back" onClick={() => navigate("/")}>voltar</p>
                <div className="coin-spinner" aria-hidden="true" />
                <p className="profile-status">carregando ficha...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="content profile-card">
                <p className="back" onClick={() => navigate("/")}>voltar</p>
                <div className="profile-error-badge">!</div>
                <p className="profile-status profile-status--error">
                    Erro: {error.message}
                </p>
            </div>
        )
    }

    if (!data) {
        return (
            <div className="content profile-card">
                <p className="back" onClick={() => navigate("/")}>voltar</p>
                <div className="profile-error-badge">?</div>
                <p className="profile-status profile-status--error">
                    Nenhum dado de perfil encontrado.
                </p>
            </div>
        )
    }

    return (
        <div className="content profile-card">
            <p className="back" onClick={() => navigate("/")}>voltar</p>

            <div className="profile-avatar">{initials}</div>

            <p className="profile-greeting">
                Olá, <span className="profile-name">{data.first_name} {data.last_name}</span>!
            </p>
        </div>
    )
}
