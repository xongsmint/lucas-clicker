import { useEffect, useState } from "react"
import Cookies from "js-cookie"

export default function Profile() {
    const [data, setData] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)

    const apiUrl = import.meta.env.VITE_DATABASE_URL

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

    if (loading) return <div className="content">Loading...</div>
    if (error) return <div className="content">Error: {error.message}</div>

    return (
        <div className="content">
            <p>Olá, {data.first_name} {data.last_name}!</p>
        </div>
    )
}
