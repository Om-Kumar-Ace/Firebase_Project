import { useEffect, useState } from "react";
import { db } from "../firebaseConfig";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import TicketForm from "./TicketForm";

const AdminDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      const ticketsRef = collection(db, "tickets");
      const snapshot = await getDocs(ticketsRef);
      const ticketList = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id, ticketId: doc.id }));
      setTickets(ticketList);
    };

    fetchTickets();
  }, []);

  const updateTicketStatus = async (ticketId, newStatus, assignedTo) => {
    const ticketRef = doc(db, "tickets", ticketId);
    await updateDoc(ticketRef, { status: newStatus, assignedTo });
    alert("Ticket status and assigned user updated.");
  };

  const viewTicketDetails = (ticket) => {
    setSelectedTicket(ticket);
    setIsViewModalOpen(true);
  };

  return (
    <div className="bg-gradient-to-b from-white to-violet-200 min-h-screen p-6 pl-32">
      <h2 className="text-3xl font-semibold text-violet-900 mb-6 text-center">Dashboard</h2>
      
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-violet-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-violet-700 transition"
        >
          Create Ticket
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-opacity-50 bg-violet-700 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-md w-110">
            <TicketForm onClose={() => setIsModalOpen(false)} />
          </div>
        </div>
      )}

      {isViewModalOpen && selectedTicket && (
        <div className="fixed inset-0 bg-opacity-50 bg-violet-700 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-md w-110">
            <h3 className="text-2xl font-semibold mb-4">Ticket Details</h3>
            <p><strong>Ticket ID:</strong> {selectedTicket.ticketId}</p>
            <p><strong>Title:</strong> {selectedTicket.title}</p>
            <p><strong>Description:</strong> {selectedTicket.description}</p>
            <p><strong>Status:</strong> {selectedTicket.status}</p>
            <p><strong>Assigned To:</strong> {selectedTicket.assignedTo}</p>
            <p><strong>Document ID:</strong> {selectedTicket.id}</p>
            <div className="mt-4">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="bg-violet-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-violet-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full table-auto text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 text-left">Ticket ID</th>
              <th className="py-2 px-4 text-left">Title</th>
              <th className="py-2 px-4 text-left">Description</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-left">Assigned To</th>
              <th className="py-2 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map(ticket => (
              <tr key={ticket.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{ticket.ticketId}</td>
                <td className="py-2 px-4">{ticket.title}</td>
                <td className="py-2 px-4">{ticket.description}</td>
                <td className="py-2 px-4">{ticket.status}</td>
                <td className="py-2 px-4">{ticket.assignedTo}</td>
                <td className="py-2 px-4 text-center">
                  <button
                    onClick={() => viewTicketDetails(ticket)}
                    className="bg-blue-500 text-white py-1 px-4 rounded-lg hover:bg-blue-600 transition mr-2"
                  >
                    View
                  </button>
                  <button
                    onClick={() => updateTicketStatus(ticket.id, "closed", ticket.status)}
                    className="bg-green-500 text-white py-1 px-4 rounded-lg hover:bg-green-600 transition mr-2"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => updateTicketStatus(ticket.id, "in-progress", ticket.status)}
                    className="bg-yellow-500 text-white py-1 px-4 rounded-lg hover:bg-yellow-600 transition"
                  >
                    In Progress
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
