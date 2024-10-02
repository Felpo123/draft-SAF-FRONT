import React, { Dispatch } from "react";
import { Marker, Popup, TileLayer, useMapEvents } from "react-leaflet";

interface MapComponentProps {
  setDashboardState: React.Dispatch<
    React.SetStateAction<{
      revenue: string;
      change: string;
      newCustomers: string;
      activeUsers: string;
      bounceRate: string;
    }>
  >;
}

function MapComponent({ setDashboardState }: MapComponentProps) {
  return (
    <>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker
        position={[51.505, -0.09]}
        eventHandlers={{
          click: () => {
            setDashboardState({
              revenue: "$50,000.00",
              change: "+15% from last month",
              newCustomers: "+2500",
              activeUsers: "+13,000",
              bounceRate: "-4.75%",
            });
          },
        }}
      >
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </>
  );
}

export default MapComponent;
