import { useNavigate } from 'react-router-dom'
import './PageNotFound.css'

export default function PageNotFound() {
    let navigate = useNavigate()

    return (
        <div className="content notfound-content">
            <div className="coin-lost">
                <span className="coin-face">?</span>
            </div>

            <h1 className="notfound-code">404</h1>
            <p className="notfound-title">Página não encontrada</p>
            <p className="notfound-subtitle">
                Essa rota parece estar quebrada
            </p>

            <button
                className="back-btn"
                onClick={() => navigate("/")}
            >
                VOLTAR PRO INÍCIO
            </button>
        </div>
    )
}
