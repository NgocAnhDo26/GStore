import React, { useState } from "react";
import axios from "axios";

const Security = () => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:1111/auth/security", 
        {
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
      }
      , { withCredentials: true })
      ;

      console.log(response)
      setSuccessMessage("Password changed successfully.");
      setError("");
      setFormData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.log(error)
      setError(error.response.data.message);
      setSuccessMessage("");
    }
  };

  return (
    <div className="flex flex-col gap-6 rounded-xl bg-white p-8">
      <div className="border-b text-2xl font-bold">Security</div>
      <div className="flex flex-col-reverse md:flex-row">
        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col p-2 md:w-1/2"
        >
          <div>Change Password</div>
          <input
            type="password"
            name="oldPassword"
            value={formData.oldPassword}
            onChange={handleFormChange}
            placeholder="Old Password"
            className="mb-4 w-1/2 rounded-lg border p-2 md:w-full"
          />
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleFormChange}
            placeholder="New Password"
            className="mb-4 w-1/2 rounded-lg border p-2 md:w-full"
          />
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleFormChange}
            placeholder="Confirm Password"
            className="mb-4 w-1/2 rounded-lg border p-2 md:w-full"
          />
          <button
            type="submit"
            className="w-1/4 rounded-md bg-custom-dark2 p-2 text-white md:w-1/2"
          >
            Change
          </button>
        </form>
        <div className="w-full p-2 md:w-1/2 md:border-l md:pt-4">
          Password should be at least 8 characters long for better security.
          <br />
          <br />
          Avoid using passwords recently used.
        </div>
      </div>

      {/* Show error or success message */}
      {error && <div className="text-red-500">{error}</div>}
      {successMessage && <div className="text-green-500">{successMessage}</div>}
    </div>
  );
};

export default Security;
