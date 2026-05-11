import Header from "../../components/Header";
import { MapView } from "../../components/map/MapView";
import NavbarStudent from "../../components/student/NavbarStudent";

export default function StudentDashboard() {

  const universityCenter: [number, number] = [3.341, -76.530];

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white">

      <div className="relative z-20">
        <Header />
      </div>

      <main className="flex-1 relative z-10 -mt-16">
        <MapView center={universityCenter} zoom={17} />
      </main>

      <div className="relative z-20">
        <NavbarStudent />
      </div>

    </div>
  );
}