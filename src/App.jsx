import { HashRouter, Routes, Route } from "react-router-dom"
import Clicker from "./pages/clicker/Clicker"
import Login from "./pages/login/Login"

export default function App() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<Clicker />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </HashRouter>
    )
}