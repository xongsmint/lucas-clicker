import { useState } from 'react'
import lucas from './assets/lukinhas.png'
import './App.css'

export default function App() {
    const [counter, setCounter] = useState(0)
    const [multiplier, setMultiplier] = useState(1)

    const increment = () => {
        setCounter(counter + Math.floor(1 * multiplier))

        //unlock
        switch (counter) {
            case 67:
                setMultiplier(2.67)
                break

            case 1000:
                setMultiplier(5)
                break
            
            case 5000:
                setMultiplier(6.7)
                break

            case 6767:
                setMultiplier(10)
                break

            case 10_000:
                setMultiplier(15)
                break
        }
    }

    const copiar = async (text) => {
        try {
            await navigator.clipboard.writeText(text)
            alert("Copiado para área de transferência")
        } catch (err) {
            alert(err)
        }
    }

    return (
        <div className="content">
            <h1>Lucas Clicker</h1>
            <img
                src={lucas}
                alt="Lucas"
                onClick={increment}
                width={250}
                id='lucas'
            /> 
            <br />
            <p>Clicks: {counter}</p>
            <p>Click multiplier: {multiplier}</p>
            <label>
                Set manually:
                <input disabled type="number" onChange={(e) => setCounter(e.target.value)} />
            </label>
            <pre
                id='share'
                style={{ cursor: "pointer" }}
                onClick={async () => {
                    await copiar("none")
                }}
            >COMPARTILHE COM AMIGOS</pre>
        </div>
    )
}