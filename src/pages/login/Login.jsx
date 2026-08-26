import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
                            maxLength={16}
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


                <p>Já tem uma conta? <span className="link-span" onClick={() => setAlrHaveAcc(false)}>Login</span></p>
                </form>
            ) : (
                <form>
                    <label>
                        Nome de usuário:
                        <input
                            type="text"
                            placeholder="Digite seu nome de usuário..."
                            maxLength={16}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </label>
                    <label>
                        Senha:
                        <input
                            type="text"
                            placeholder="Digite sua senha..."
                            maxLength={8}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </label>
                    
                    <p>Ainda não tem conta? <span className="link-span" onClick={() => setAlrHaveAcc(true)}>Registrar</span></p>
                </form>
            )}
        </div>
    )
}
