import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Stats from './components/Stats';
import Schedule from './components/Schedule';
import Results from './components/Results';
import Roster from './components/Roster';
import Sponsors from './components/Sponsors';
import CTA from './components/CTA';
import Footer from './components/Footer';
import AdminLayout from './components/admin/AdminLayout';
import AdminLogin from './components/admin/AdminLogin';
import AdminGames from './components/admin/AdminGames';
import AdminResults from './components/admin/AdminResults';
import AdminTeams from './components/admin/AdminTeams';
import AdminPlayers from './components/admin/AdminPlayers';
import ProtectedRoute from './components/admin/ProtectedRoute';

function HomePage() {
    return (
        <>
            <Header />
            <Hero />
            <Sponsors />
            <Stats />
            <Schedule />
            <Results />
            <Roster />
            <CTA />
            <Footer />
        </>
    );
}

function App() {
    return (
        <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />

            {/* Admin login */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Protected admin routes */}
            <Route
                path="/admin"
                element={
                    <ProtectedRoute>
                        <AdminLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<Navigate to="/admin/games" replace />} />
                <Route path="games" element={<AdminGames />} />
                <Route path="results" element={<AdminResults />} />
                <Route path="teams" element={<AdminTeams />} />
                <Route path="players" element={<AdminPlayers />} />
            </Route>

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;
