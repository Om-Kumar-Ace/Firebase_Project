import React, { useEffect, useState } from "react";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const AdminTicketEditor = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [updatedDetails, setUpdatedDetails] = useState({
    status: "",
    priority: "",
    description: "",
  });

  useEffect(() => {
    const fetchTickets = async () => {
      const ticketsRef = collection(db, "tickets");
      const snapshot = await getDocs(ticketsRef);
      const ticketList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTickets(ticketList);
    };

    fetchTickets();
  }, []);

  const handleSelectTicket = (ticket) => {
    setSelectedTicket(ticket);
    setUpdatedDetails({
      status: ticket.status || "",
      priority: ticket.priority || "",
      description: ticket.description || "",
    });
  };

  const handleChange = (e) => {
    setUpdatedDetails({ ...updatedDetails, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    if (!selectedTicket) return;

    const ticketRef = doc(db, "tickets", selectedTicket.id);
    await updateDoc(ticketRef, updatedDetails);

    alert("Ticket updated successfully!");

    // Update local state
    setTickets(
      tickets.map((t) =>
        t.id === selectedTicket.id ? { ...t, ...updatedDetails } : t
      )
    );

    setSelectedTicket(null);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-violet-700 mb-4"> Ticket manager</h1>

      {/* Ticket List */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Select a Ticket:</h2>
        <ul className="bg-white p-4 rounded-md shadow-md max-h-64 overflow-y-auto">
          {tickets.map((ticket) => (
            <li
              key={ticket.id}
              className="p-3 cursor-pointer hover:bg-violet-200 rounded-md mb-2"
              onClick={() => handleSelectTicket(ticket)}
            >
              {ticket.title} - <span className="font-semibold">{ticket.status}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Ticket Edit Form */}
      {selectedTicket && (
        <div className="bg-white p-6 rounded-md shadow-md">
          <h2 className="text-xl font-semibold mb-4">Modify Ticket Details</h2>

          <label className="block font-medium">Status:</label>
          <select
            name="status"
            value={updatedDetails.status}
            onChange={handleChange}
            className="w-full p-2 border rounded-md mb-4"
          >
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>

          <label className="block font-medium">Priority:</label>
          <select
            name="priority"
            value={updatedDetails.priority}
            onChange={handleChange}
            className="w-full p-2 border rounded-md mb-4"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <label className="block font-medium">Description:</label>
          <textarea
            name="description"
            value={updatedDetails.description}
            onChange={handleChange}
            className="w-full p-2 border rounded-md mb-4"
          />
          
          <label className="block font-medium">Assign To :</label>
          <textarea
            name="assignto"
            value={updatedDetails.assignTo}
            onChange={handleChange}
            className="w-full p-2 border rounded-md mb-4"
          />

          <button
            onClick={handleUpdate}
            className="bg-violet-600 text-white px-4 py-2 rounded-md hover:bg-violet-500"
          >
            Update Ticket
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminTicketEditor;
