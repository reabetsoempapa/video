import "bootstrap/dist/css/bootstrap.min.css";
import "./Styling/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import VideoScreen from "./Video";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/video" element={<VideoScreen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
