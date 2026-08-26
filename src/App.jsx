import { HashRouter, Routes, Route } from "react-router-dom"
import Clicker from "./pages/clicker/Clicker"
import Login from "./pages/login/Login"
import PageNotFound from "./pages/pagenotfound/PageNotFound"

export default function App() {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<Clicker />} />
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<PageNotFound />} />
            </Routes>
        </HashRouter>
    )
}