import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logar from './components/login'
import './Login.css'

export default function Login() {
    const [firstName, setFirstname] = useState("")
    const [lastName, setLastName] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    let navigate = useNavigate()

    const [alrHaveAcc, setAlrHaveAcc] = useState(false)

    return (
        <div className="content">
            <p className='back' onClick={() => navigate("/")}>voltar</p>

            {alrHaveAcc ? (
                <form>
                    <label>
                        Primeiro nome: 
                        <input
                            type="text"
                            placeholder="Seu nome aqui..."
                            maxLength={24}
                            onChange={(e) => setFirstname(e.target.value)}
                        />
                    </label>
                    <label>
                        Sobrenome:
                        <input
                            type="text"
                            maxLength={32}
                            placeholder="Seu sobrenome aqui..."
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </label>
                    <label>
                        Nome de usuário *máx 16 caracteres e somente letras:
                        <input
                            type="text"
                            maxLength={16}
                            placeholder="Digite seu username..."
                            onChange={(e) => {
                                const novoValor = e.target.value.replace(/[^a-zA-Z]/g, '')
                                setUsername(novoValor)
                            }}
                        />
                    </label>
                    <label>
                        Senha *máx 8 caracteres e somente letras e números:
                        <input
                            type="text"
                            placeholder="Digite sua senha..."
                            maxLength={8}
                            onChange={(e) => {
                                const novoValor = e.target.value.replace(/[^a-zA-Z0-9]/g, '')
                                setPassword(novoValor)
                            }}
                        />
                    </label>


                <p>Já tem uma conta? <span className="link-span" onClick={() => setAlrHaveAcc(false)}>Login</span></p>
                </form>
            ) : <Logar />}
        </div>
    )
}
