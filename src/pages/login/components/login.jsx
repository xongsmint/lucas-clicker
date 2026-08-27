import { useState, useEffect } from "react"
import Cookies from "js-cookie"
import { useNavigate } from "react-router-dom"

export default function Logar() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const navigate = useNavigate()

    const apiUrl = import.meta.env.VITE_DATABASE_URL

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            console.log("requesting")
            const response = await fetch(apiUrl + "/login", {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            })
            console.log("requested")

            if (response.ok) {
                const data = await response.json()
                Cookies.set('accessToken', data.access_token)
                console.log(Cookies.get('accessToken'))
                navigate("/")
            }
        } catch(err) {
            alert(`Error: ${err}`)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Nome de usuário:
                <input
                    type="text"
                    placeholder="Digite seu nome de usuário..."
                    minLength={5}
                    maxLength={16}
                    onChange={(e) => {
                        const onlyLetters = e.target.value.replace(/[^a-zA-Z\s]/g, '')
                        setUsername(onlyLetters)
                    }}
                />
            </label>
            <label>
                Senha:
                <input
                    type="text"
                    placeholder="Digite sua senha..."
                    minLength={6}
                    maxLength={8}
                    onChange={(e) => {
                        const alphanumeric = e.target.value.replace(/[^a-zA-Z0-9]/g, '')
                        setPassword(alphanumeric)
                    }}
                />
            </label>
            
            <button
                type="submit">ENTRAR</button>
        </form>
    )
}