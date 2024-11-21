import {  Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import Bill from "./pages/Bill.jsx";
import EditXsltPage from "./pages/EditXsltPage.jsx";
import DownloadButton from "./pages/dowloadbutton.jsx";

function App() {
    return (
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/bill" element={<Bill/>}/>
                <Route path="/edit" element={<EditXsltPage/>}/>
                <Route path="/dowload" element={<DownloadButton/>}/>
            </Routes>
    );
}

export default App;
