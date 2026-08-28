import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Logar from './components/login'
import Register from './components/register'
import Cookies from 'js-cookie'
import './Login.css'

export default function Login() {
    const [firstName, setFirstname] = useState("")
    const [lastName, setLastName] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    let navigate = useNavigate()

    useEffect(() => {
        if (Cookies.get("accessToken")) {
            navigate("/")
            alert("Você já está conectado!")
        }
    }, [])

    const [alrHaveAcc, setAlrHaveAcc] = useState(false)

    return (
        <div className="content">
            <p className='back' onClick={() => navigate("/")}>voltar</p>

            {alrHaveAcc ? (
                <>
                    <Register />
                    <p>Já tem uma conta? <span className="link-span" onClick={() => setAlrHaveAcc(false)}>Login</span></p>
                </>
            ) : (
            <>
                <Logar />
                <p>Ainda não tem uma conta?<span className="link-span" onClick={() => setAlrHaveAcc(true)}>Registrar</span></p>
            </>
            )}
        </div>
    )
}
