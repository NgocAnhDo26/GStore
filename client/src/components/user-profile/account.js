import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const Account = () => {
  const [accountData, setAccountData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:1111/api/profile/info", { withCredentials: true })
      .then((res) => {
        setAccountData(res.data);
        console.log(res.data);
      })
      .catch((error) => {
        console.log("Error: ", error.response?.data || error.message);
      });
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    birthdate: "",
    phone: "",
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const useChangeData = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:1111/api/profile/info", formData, {
        withCredentials: true,
      })
      .then((res) => {
        console.log("Form Data Submitted:", formData);
        console.log("Response Data:", res.data);
        setAccountData(res.data); 

        const updatedUser = JSON.parse(localStorage.getItem("user"));
        updatedUser.username = res.data.username; 
        localStorage.setItem("user", JSON.stringify(updatedUser)); 

        Swal.fire("Profile updated successfully!");
      })
      .catch((error) => {
        console.log("Error:", error.response?.data || error.message);
      });
  };

  return (
    <div className="flex flex-col gap-6 rounded-xl bg-white p-8">
      <div className="border-b text-2xl font-bold">General</div>
      <div className="flex flex-col gap-8 pt-4 md:flex-row">
        <div className="flex-grow">
          <div>Username</div>
          <div className="text-xs text-gray-500">{accountData.username}</div>
        </div>
        <div className="flex-grow">
          <div>Email</div>
          <div className="text-xs text-gray-500">{accountData.email}</div>
        </div>
        <div className="flex-grow">
          <div>Phone Number</div>
          <div className="text-xs text-gray-500">{accountData.phone}</div>
        </div>
        <div className="flex-grow">
          <div>Birthdate</div>
          <div className="text-xs text-gray-500">
            {accountData?.birthdate?.split("T")[0] || "N/A"}
          </div>
        </div>
        <div className="flex-grow">
          <div>Starting Day</div>
          <div className="text-xs text-gray-500">
            {accountData?.create_time?.split("T")[0] || "N/A"}
          </div>
        </div>
      </div>

      <form className="flex flex-col border-t pt-4">
        <div>Personal</div>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleFormChange}
          placeholder="Username"
          className="mb-4 w-1/2 rounded-lg border p-2"
        />
        <input
          type="date"
          name="birthdate"
          value={formData.birthdate}
          onChange={handleFormChange}
          placeholder="Birthdate"
          className="mb-4 w-1/2 rounded-lg border p-2"
        />
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleFormChange}
          placeholder="Phone Number"
          className="mb-4 w-1/2 rounded-lg border p-2"
        />
        <button
          type="submit"
          className="w-1/4 rounded-md bg-custom-dark2 p-2 text-white"
          onClick={useChangeData}
        >
          Change
        </button>
      </form>
    </div>
  );
};

export default Account;
