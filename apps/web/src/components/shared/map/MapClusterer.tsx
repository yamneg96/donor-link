/* ================================================================== */
/* MAP CLUSTERER — Marker clustering via @googlemaps/markerclusterer   */
/* ================================================================== */

import { useEffect, useRef, useCallback } from "react";
import { AdvancedMarker, useMap } from "@vis.gl/react-google-maps";
import { MarkerClusterer, type Marker } from "@googlemaps/markerclusterer";
import type { MapMarkerData } from "./map.types";
import { getSeverityStyles } from "./map.utils";
import { MapMarker } from "./MapMarker";

interface MapClustererProps {
  markers: MapMarkerData[];
  onSelectMarker: (marker: MapMarkerData) => void;
}

export function MapClusterer({ markers, onSelectMarker }: MapClustererProps) {
  const map = useMap();
  const clusterer = useRef<MarkerClusterer | null>(null);
  const markersRef = useRef<Record<string, Marker>>({});

  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({ map });
    }
  }, [map]);

  const updateClusterer = useCallback(() => {
    if (!clusterer.current) return;
    clusterer.current.clearMarkers();
    clusterer.current.addMarkers(Object.values(markersRef.current));
  }, []);

  const createMarkerRef = useCallback(
    (id: string) => (marker: Marker | null) => {
      if (marker) {
        markersRef.current[id] = marker;
      } else {
        delete markersRef.current[id];
      }
      updateClusterer();
    },
    [updateClusterer],
  );

  useEffect(() => {
    updateClusterer();
  }, [markers, updateClusterer]);

  return (
    <>
      {markers.map((marker) => {
        const styles = getSeverityStyles(marker.severity);
        return (
          <AdvancedMarker
            key={marker.id}
            position={{ lat: marker.lat, lng: marker.lng }}
            ref={createMarkerRef(String(marker.id))}
            onClick={() => onSelectMarker(marker)}
          >
            <MapMarker severity={marker.severity} styles={styles} />
          </AdvancedMarker>
        );
      })}
    </>
  );
}
