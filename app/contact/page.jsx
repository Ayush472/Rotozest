// app/contact/page.js
import React from "react";
import ContactForm from "@/components/ContactForm/ContactForm";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/page";
import { IoIosArrowDown } from "react-icons/io";

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
    <div className=" bg-white ">
      <Header />
      <div className="text-center pt-4 font-bold my-6">
        <h1 className="text-3xl">Contact Us</h1>
        <div className="flex justify-center mt-2">
          <IoIosArrowDown className="text-2xl" />
        </div>
      </div>
      <div className="relative h-96 w-full">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14691.583817644421!2d72.6469285!3d22.9908532!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e875e3eeb29ab%3A0x3165aaf70cc5bb7e!2sRotozest%20industries!5e0!3m2!1sen!2sin!4v1722445824306!5m2!1sen!2sin"
          className="absolute top-0 left-0 w-full h-full"
          style={{ border: "0px" }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
      <div className="mb-4">
        <ContactForm />
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
