import { HashRouter, Routes, Route } from "react-router-dom"
import Clicker from "./pages/clicker/Clicker"

export default function App() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<Clicker />} />
            </Routes>
        </HashRouter>
    )
}