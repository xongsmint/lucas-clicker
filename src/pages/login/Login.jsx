import { useState } from 'react'
import './Login.css'

export default function Login() {
    const [firstName, setFirstname] = useState("")
    const [lastName, setLastName] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    return (
        <div className="content">
            <form>
                <label>
                    Primeiro nome: 
                    <input
                        type="text"
                        placeholder="Seu nome aqui..."
                        onChange={(e) => setFirstname(e.target.value)}
                    />
                </label>
                <label>
                    Sobrenome:
                    <input
                        type="text"
                        placeholder="Seu sobrenome aqui..."
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </label>
                <label>
                    Nome de usuário:
                    <input
                        type="text"
                        placeholder="Digite seu username..."
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </label>
                <label>
                    Senha *máx 8 caracteres e somente letras e numeros:
                    <input
                        type="text"
                        placeholder="Digite sua senha..."
                        maxLength={8}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>
            </form>
        </div>
    )
}
