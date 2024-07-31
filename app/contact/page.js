// app/contact/page.js
import React from "react";
import ContactForm from "@/components/ContactForm/ContactForm";
import Header from "@/components/header/Header";
//import { GoogleMap, LoadScript } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: -3.745,
  lng: -38.523,
};
const Contact = () => {
  return (
    <div className="container bg-white ">
      <Header />
      <h1 className="text-3xl text-center pt-4 font-bold mb-6">Contact Us</h1>
      {/* <LoadScript googleMapsApiKey="AIzaSyC2ln_F-rdyH2hA7G4_5Ws8djM2XPa_P2Y">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={10}
          >
          </GoogleMap>
        </LoadScript> */}
      <ContactForm />
    </div>
  );
};

export default Contact;
