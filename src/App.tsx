import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/Layout";
import LibraryMap from "./pages/LibraryMap";
import JourneyMap from "./pages/JourneyMap";
import PatientHeatMap from "./pages/PatientHeatMap";
import RapidIVFGuide from "./pages/RapidIVFGuide";
import Guide from "./pages/Guide";
import Consultation from "./pages/Consultation";
import Payment from "./pages/Payment";

export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#f7f5ef] text-slate-950">
        <Header />
        <Routes>
          <Route path="/" element={<RapidIVFGuide />} />
          <Route path="/en" element={<RapidIVFGuide />} />
          <Route path="/or" element={<RapidIVFGuide />} />
          <Route path="/quick-guide" element={<RapidIVFGuide />} />
          <Route path="/guide/:token" element={<Guide />} />
          <Route path="/consultation" element={<Consultation />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/map" element={<PatientHeatMap />} />
          <Route path="/library" element={<LibraryMap />} />
          <Route path="/journey" element={<JourneyMap />} />
          <Route path="*" element={<RapidIVFGuide />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
