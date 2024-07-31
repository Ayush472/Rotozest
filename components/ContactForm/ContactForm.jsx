"use client";
import { useState } from "react";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaWhatsapp,
} from "react-icons/fa";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here, e.g., sending data to server
    console.log(formData);
    // Clear form fields after submission if needed
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
      message: "",
    });
  };

  return (
    <div className="bg-gray-100 py-5 mt-3 mx-5">
      <div className="container mx-auto flex flex-row md:flex-row justify-center items-center space-y-8 md:space-y-0 md:space-x-8">
        {/* Left Side */}
        <div className="w-full md:w-1/2 text-left pl-4 md:text-left md:border-r-2 border-gray-300">
          <div className="p-8">
            <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
            <p className="mb-2">
              <FaMapMarkerAlt className="inline mr-2" />
              <a
                href="https://www.google.com/maps/place/Rotozest+industries/@22.9908531,72.6420576,17z/data=!3m1!4b1!4m6!3m5!1s0x395e875e3eeb29ab:0x3165aaf70cc5bb7e!8m2!3d22.9908532!4d72.6469285!16s%2Fg%2F11w25gx4yt?entry=ttu"
                target="_blank"
                rel="noopener noreferrer"
              >
                11, Rudra Estate, Nr. Rameshwar Estate,
                <br /> B/h. Mahadev Estate, CTM-Ramol Road,
                <br /> Ramol, Ahmedabad-382449.
              </a>
            </p>
            <p className="mb-2">
              <FaPhone className="inline mr-2" />
              <a href="tel:+919974017582">+91 9974017582</a>
            </p>
            <p className="mb-2">
              <FaPhone className="inline mr-2" />
              <a href="tel:+919974017583">+91 9974017583</a>
            </p>
            <p className="mb-2">
              <FaEnvelope className="inline mr-2" />
              <a href="mailto:info@rotozest.com">info@rotozest.com</a>
            </p>
            <p className="mb-2">
              <FaWhatsapp className="inline mr-2" />
              <a
                href={`https://wa.me/919974017582`}
                target="_blank"
                rel="noopener noreferrer"
              >
                +91 9974017582 (WhatsApp)
              </a>
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full md:w-1/2">
          <div className="p-8">
            <h2 className="text-2xl font-semibold mb-4">Send Us a Message</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Name Fields */}
              <div className="flex space-x-4">
                <div className="w-1/2">
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
                <div className="w-1/2">
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
              </div>

              {/* Email and Mobile Fields */}
              <div className="flex space-x-4">
                <div className="w-1/2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
                <div className="w-1/2">
                  <label
                    htmlFor="mobile"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Mobile
                  </label>
                  <input
                    type="tel"
                    id="mobile"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
              </div>

              {/* Message Field */}
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="px-4 p-1 bg-blue-500 text-white font-semibold rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
