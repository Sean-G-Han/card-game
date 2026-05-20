import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./pages/AuthPage";

function App() {
    return (
        <>
            <h1>TEST</h1>
            <Router>
                <div className="d-flex flex-column vh-100">
                    <div className="flex-grow-1">
                        <Routes>
                            <Route path="/" element={<AuthPage/>} />
                        </Routes>
                    </div>
                </div>
            </Router>
        </>
    );
}

export default App;
