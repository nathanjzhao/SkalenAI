import { useMap } from 'react-leaflet';

export default function MauiButton() {
  const map = useMap();

  const goToMaui = () => {
    map.flyTo([20.798363, -156.331924], 11);
  };

  return (
    <div className="z-10">
      <button onClick={goToMaui} className="px-4 py-2 rounded-full bg-blue-500 text-white">
        Go to Maui
      </button>
    </div>
  );
}