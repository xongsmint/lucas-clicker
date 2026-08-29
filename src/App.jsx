import { HashRouter, Routes, Route } from "react-router-dom"
import Clicker from "./pages/clicker/Clicker"
import Login from "./pages/login/Login"
import PageNotFound from "./pages/pagenotfound/PageNotFound"
import Profile from "./pages/profile/Profile"
import Ranking from "./pages/ranking/Ranking"

export default function App() {
    const apiUrl = import.meta.env.VITE_DATABASE_URL

    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<Clicker apiUrl={apiUrl} />} />
                <Route path="/login" element={<Login apiUrl={apiUrl} />} />
                <Route path="/perfil" element={<Profile apiUrl={apiUrl} />} />
                <Route path="/ranking" element={<Ranking apiUrl={apiUrl} />} />
                <Route path="*" element={<PageNotFound />} />
            </Routes>
        </HashRouter>
    )
}