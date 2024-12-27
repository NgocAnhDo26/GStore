import React, { useState } from "react";

const Security = () => {
  const [accountData, setAccountData] = useState({
    username: "Username content",
    email: "abc@gmail.com",
    fullName: "Full Name content",
    startingDay: "01/01/2025",
  });

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="flex flex-col gap-6 rounded-xl bg-white p-8">
      <div className="border-b text-2xl font-bold">Security</div>
      <div className="flex flex-col-reverse md:flex-row">
        <form className="flex w-full flex-col p-2 md:w-1/2">
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
          Password must be at least 8 characters long.
          <br />
          Include at least one uppercase letter, one lowercase letter and one
          number.
          <br />
          Avoid using passwords recently used.
        </div>
      </div>
    </div>
  );
};

export default Security;
