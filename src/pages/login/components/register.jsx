import { useState } from "react"
import Cookies from "js-cookie"
import { useNavigate } from "react-router-dom"
import './registrar.css'

export default function Register() {
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const navigate = useNavigate()

    const apiUrl = import.meta.env.VITE_DATABASE_URL

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            setIsLoading(true)
            
            const response = await fetch(apiUrl + "/users", {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({
                    first_name: firstName,
                    last_name: lastName,
                    username: username,
                    password: password
                })
            })

            if (response.ok) {
                const data = await response.json()
                Cookies.set('accessToken', data.access_token)
                navigate("/")
            } else {
                alert("Não foi possível concluir o cadastro.")
            }
        } catch (err) {
            alert(`Error: ${err}`)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="name-row">
                <label>
                    Nome:
                    <input
                        type="text"
                        placeholder="Nome..."
                        minLength={2}
                        maxLength={20}
                        onChange={(e) => {
                            const onlyLetters = e.target.value.replace(/[^a-zA-Z\s]/g, '')
                            setFirstName(onlyLetters)
                        }}
                        required
                    />
                </label>
                <label>
                    Sobrenome:
                    <input
                        type="text"
                        placeholder="Sobrenome..."
                        minLength={2}
                        maxLength={20}
                        onChange={(e) => {
                            const onlyLetters = e.target.value.replace(/[^a-zA-Z\s]/g, '')
                            setLastName(onlyLetters)
                        }}
                        required
                    />
                </label>
            </div>

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
                    required
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
                    required
                />
            </label>

            <button type="submit" disabled={isLoading}>REGISTRAR</button>
        </form>
    )
}