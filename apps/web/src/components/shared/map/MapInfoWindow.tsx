/* ================================================================== */
/* MAP INFO WINDOW — Info overlay for selected markers                 */
/* ================================================================== */

import { InfoWindow } from "@vis.gl/react-google-maps";
import type { MapMarkerData } from "./map.types";

interface MapInfoWindowProps {
  marker: MapMarkerData;
  onClose: () => void;
  renderContent?: (marker: MapMarkerData, close: () => void) => React.ReactNode;
}

export function MapInfoWindowOverlay({
  marker,
  onClose,
  renderContent,
}: MapInfoWindowProps) {
  return (
    <InfoWindow
      position={{ lat: marker.lat, lng: marker.lng }}
      onCloseClick={onClose}
    >
      {renderContent?.(marker, onClose)}
    </InfoWindow>
  );
}
