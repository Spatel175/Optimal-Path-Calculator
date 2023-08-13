import React, {useState} from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import stateCoordinates from './stateCoordinates.json';
import { Icon } from 'leaflet';

const MapComponent = ({ onUpdateState }) => {
    
  const customIcon = new Icon({
    iconUrl: require("./placeholder.png"),
    iconSize: [20,20]
  });
  
  const handleMarkerClick = (stateName) => {
       // Update startState or goalState with abbreviation
    onUpdateState(stateCoordinates[stateName].abv);
    
  };


  return (
    <div>
      <MapContainer
        center={[41.5, -100]} // Nebraska
        zoom={4}
        style={{ height: '800px', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* <Line betweenStateA={stateA} andStateB={stateB} /> */}
        {Object.keys(stateCoordinates).map(stateName => (
          <Marker
            key={stateName}
            icon={customIcon}
            position={[
              stateCoordinates[stateName].lat,
              stateCoordinates[stateName].lng,
            ]}
            eventHandlers={{
              click: () => handleMarkerClick(stateName),
              mouseover: (event) => event.target.openPopup(),
            }}  
          >
              <Popup>{stateName}</Popup>
           
          </Marker>
        ))}
        
      </MapContainer>
     
    </div>
  );
};

export default MapComponent;
