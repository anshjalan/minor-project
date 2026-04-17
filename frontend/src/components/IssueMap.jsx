import { useEffect } from "react";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png"
});

function MapUpdater({ selectedIssueId, issues }) {
  const map = useMap();
  useEffect(() => {
    if (selectedIssueId) {
      const issue = issues.find(i => i._id === selectedIssueId);
      if (issue) {
        map.flyTo([issue.location.latitude, issue.location.longitude], 16, { animate: true });
      }
    }
  }, [selectedIssueId, issues, map]);
  return null;
}

export default function IssueMap({ issues, selectedIssueId }) {
  const center = issues.length
    ? [issues[0].location.latitude, issues[0].location.longitude]
    : [20.5937, 78.9629];

  return (
    <div className="h-[380px] overflow-hidden rounded-3xl border border-slate-200 shadow-card">
      <MapContainer center={center} zoom={issues.length ? 13 : 5} scrollWheelZoom className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {issues.map((issue) => (
          <Marker key={issue._id} position={[issue.location.latitude, issue.location.longitude]}>
            <Popup>
              <strong>{issue.category}</strong>
              <br />
              {issue.aiSummary || issue.description}
            </Popup>
          </Marker>
        ))}
        <MapUpdater selectedIssueId={selectedIssueId} issues={issues} />
      </MapContainer>
    </div>
  );
}
