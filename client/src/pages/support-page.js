import React, { useState } from "react";
import axios from "axios";

const SupportPage = () => {
  const [formData, setFormData] = useState({
    type_id: "",
    content: "",
  });
  const [notification, setNotification] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:1111/api/feedback", 
      {
        content: formData.content,
        type_id: formData.type_id,
      }, {
        withCredentials: true,
      });
      
      console.log("API Response:", response.data);
      setNotification("Your message has been sent successfully!");
      setFormData({
        type_id: "",
        content: "",
      });
      
      // Hide notification after 3 seconds
      setTimeout(() => {
        setNotification("");
      }, 3000);
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      setNotification("There was an error sending your message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-blue m-8 rounded-md">
      <div className="py-8 lg:py-16 px-4 mx-auto max-w-screen-md">
        <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-center text-white">
          Contact Us
        </h2>
        <p className="mb-8 lg:mb-16 font-light text-center text-white sm:text-xl">
          Got a technical issue? Want to send feedback about a beta feature? Need details about our Business plan? Let us know.
        </p>

        <form className="space-y-8" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="type_id" className="block mb-2 text-sm font-medium text-white">
              Subject
            </label>
            <select
              id="type_id"
              name="type_id"
              value={formData.type_id}
              onChange={handleChange}
              className="block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500"
              required
            >
              <option value="">Select a subject</option>
              <option value="1">General</option>
              <option value="2">Complaint</option>
              <option value="3">Support</option>
              <option value="4">Suggestion</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="content" className="block mb-2 text-sm font-medium text-white">
              Your message
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows="6"
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Leave a comment..."
              required
            ></textarea>
          </div>
          {notification && (
            <div className="mb-6 text-center text-green-600 font-semibold bg-green-100 p-4 rounded-md">
              {notification}
            </div>
          )}
          <button
            type="submit"
            className="py-3 px-5 bg-white text-sm font-medium text-center text-black rounded-lg bg-primary-700 sm:w-fit hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send message"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default SupportPage;
