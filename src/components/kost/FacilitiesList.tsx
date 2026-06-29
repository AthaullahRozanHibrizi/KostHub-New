import { Wifi, Wind, Bath, Bed, Tv, Refrigerator, UtensilsCrossed, Shirt, Car, Bike, Shield, Camera, Building2, Waves, Dumbbell, Coffee, Check } from "lucide-react";

const FACILITY_ICON_MAP: Record<string, React.ElementType> = {
  "Wi-Fi": Wifi,
  "AC": Wind,
  "Kamar Mandi Dalam": Bath,
  "Kamar Mandi Luar": Bath,
  "Kasur": Bed,
  "TV": Tv,
  "Kulkas": Refrigerator,
  "Dapur Bersama": UtensilsCrossed,
  "Laundry": Shirt,
  "Parkir Motor": Bike,
  "Parkir Mobil": Car,
  "Keamanan 24 Jam": Shield,
  "CCTV": Camera,
  "Lift": Building2,
  "Kolam Renang": Waves,
  "Gym": Dumbbell,
  "Rooftop": Coffee,
};

interface FacilitiesListProps {
  facilities: string[];
}

export function FacilitiesList({ facilities }: FacilitiesListProps) {
  if (!facilities || facilities.length === 0) {
    return <p className="text-gray-500 text-sm">Tidak ada fasilitas yang tercantum.</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {facilities.map((facility) => {
        const Icon = FACILITY_ICON_MAP[facility] || Check;
        return (
          <div
            key={facility}
            className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/8 group hover:border-violet-500/30 hover:bg-violet-500/5 transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0 group-hover:bg-violet-500/20 transition-colors">
              <Icon className="w-4 h-4 text-violet-400" />
            </div>
            <span className="text-sm text-gray-300">{facility}</span>
          </div>
        );
      })}
    </div>
  );
}
