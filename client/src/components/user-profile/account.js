import React, { useState } from "react";

const Account = () => {
  const [accountData, setAccountData] = useState({
    username: "Username content",
    email: "abc@gmail.com",
    fullName: "Full Name content",
    startingDay: "01/01/2025",
  });

  const [formData, setFormData] = useState({
    fullName: "",
    birthDay: "",
    phoneNumber: "",
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <div className="flex flex-col gap-6 rounded-xl  bg-white p-8">
      <div className="text-2xl font-bold border-b">General</div>
      <div className="flex flex-col gap-8  pt-4 md:flex-row">
        <div className="flex-grow">
          <div>Username</div>
          <div className="text-xs text-gray-500">{accountData.username}</div>
        </div>
        <div className="flex-grow">
          <div>Email</div>
          <div className="text-xs text-gray-500">{accountData.email}</div>
        </div>
        <div className="flex-grow">
          <div>Full Name</div>
          <div className="text-xs text-gray-500">{accountData.fullName}</div>
        </div>
        <div className="flex-grow">
          <div>Starting Day</div>
          <div className="text-xs text-gray-500">{accountData.startingDay}</div>
        </div>
      </div>

      <form className="flex flex-col border-t  pt-4">
        <div>Personal</div>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleFormChange}
          placeholder="Full Name"
          className="mb-4 w-1/2 rounded-lg border p-2"
        />
        <input
          type="date"
          name="birthDay"
          value={formData.birthDay}
          onChange={handleFormChange}
          placeholder="Birth Day"
          className="mb-4 w-1/2 rounded-lg border p-2"
        />
        <input
          type="text"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleFormChange}
          placeholder="Phone Number"
          className="mb-4 w-1/2 rounded-lg border p-2"
        />
        <button
          type="submit"
          className="w-1/4 rounded-md bg-custom-dark2 p-2 text-white"
        >
          Change
        </button>
      </form>
    </div>
  );
};

export default Account;
