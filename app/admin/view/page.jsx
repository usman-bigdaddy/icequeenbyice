"use client";

import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

export default function Page() {
  const [admins, setAdmins] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    role: "",
    password: "admin419",
  });
  const token = Cookies.get("token");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAdmin((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await axios.get("/api/admin", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAdmins(res.data.data);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      }
    };
    fetchAdmin();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/admin", newAdmin, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Close modal
      setShowModal(false);
      // Reset form
      setNewAdmin({
        name: "",
        email: "",
        password: "admin419",
      });
      const res = await axios.get("/api/admin", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setAdmins(res.data.data);
      }
      setAdmins(res.data.data);
    } catch (error) {
      console.error("Error creating:", error);
    }
  };

  return (
    <>
      <div className="p-6">
        {/* Button to open modal */}
        <div className="mb-4">
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Add Admin
          </button>
        </div>

        {/* Table */}
        <div className="bg-white p-6 rounded-lg shadow-md w-full overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-4 text-left text-gray-700 font-semibold">
                  Name
                </th>
                <th className="p-4 text-left text-gray-700 font-semibold">
                  Email
                </th>
                <th className="p-4 text-left text-gray-700 font-semibold">
                  Role
                </th>
              </tr>
            </thead>
            <tbody>
              {admins.map((row) => (
                <tr
                  key={row._id}
                  className="hover:bg-gray-50 transition duration-200 ease-in-out border-b border-gray-200"
                >
                  <td className="p-4 text-gray-800">{row.name}</td>
                  <td className="p-4 text-gray-800">{row.email}</td>
                  <td className="p-4 text-gray-800">{row.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <div className="flex justify-between items-center">
              <h2 className="text-xl text-black font-semibold">
                Create New Admin
              </h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setShowModal(false)}
              >
                X
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4">
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-black"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Please Enter Full Name"
                  name="name"
                  value={newAdmin.name}
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full text-black border rounded-lg"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-black"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Please Enter Email"
                  name="email"
                  value={newAdmin.email}
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full text-black border rounded-lg"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-black"
                >
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={newAdmin.role}
                  onChange={handleInputChange}
                  className="mt-1 p-2 w-full text-black border rounded-lg"
                  required
                >
                  <option value="">Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="staff">Staff</option>
                </select>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
