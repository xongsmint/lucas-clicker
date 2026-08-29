import { useEffect, useState } from 'react'
import './Ranking.css'

export default function Ranking({ apiUrl, onBack }) {
  const [players, setPlayers] = useState([])
  const [status, setStatus] = useState('loading') // 'loading' | 'ok' | 'error'

  useEffect(() => {
    let cancelled = false

    async function loadRanking() {
      setStatus('loading')
      try {
        const res = await fetch(apiUrl + '/ranking')
        if (!res.ok) throw new Error('Falha ao buscar ranking')
        const data = await res.json()
        if (!cancelled) {
          setPlayers(Array.isArray(data) ? data : [])
          setStatus('ok')
        }
      } catch (err) {
        if (!cancelled) setStatus('error')
      }
    }

    loadRanking()
    return () => {
      cancelled = true
    }
  }, [apiUrl])

  const medalClass = (position) => {
    if (position === 1) return 'medal medal-gold'
    if (position === 2) return 'medal medal-silver'
    if (position === 3) return 'medal medal-bronze'
    return 'medal'
  }

  const fullName = (player) => {
    const name = [player.first_name, player.last_name].filter(Boolean).join(' ').trim()
    return name || player.username || 'Jogador'
  }

  return (
    <div className="ranking-page">
      <div className="ranking-card">
        <div className="ranking-header">
          {onBack && (
            <button className="back-btn" onClick={onBack} aria-label="Voltar">
              ←
            </button>
          )}
          <h1>RANKING</h1>
          <span className="subtitle">Top 5 cliques</span>
        </div>

        {status === 'loading' && (
          <div className="ranking-state">
            <div className="coin-spinner" aria-hidden="true" />
            <p>Contando moedas...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="ranking-state">
            <p className="error-text">Não foi possível carregar o ranking.</p>
          </div>
        )}

        {status === 'ok' && players.length === 0 && (
          <div className="ranking-state">
            <p>Ainda ninguém clicou. Seja o primeiro!</p>
          </div>
        )}

        {status === 'ok' && players.length > 0 && (
          <ol className="ranking-list">
            {players.map((player) => (
              <li key={player.position} className="ranking-row">
                <span className={medalClass(player.position)}>{player.position}</span>

                <span className="ranking-info">
                  <span className="ranking-name">{fullName(player)}</span>
                  <span className="ranking-username">@{player.username}</span>
                </span>

                <span className="ranking-clicks">
                  {player.clicks.toLocaleString('pt-BR')}
                  <span className="clicks-label">cliques</span>
                </span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  )
}
