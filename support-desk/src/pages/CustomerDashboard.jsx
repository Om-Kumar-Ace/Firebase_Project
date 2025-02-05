import { useEffect, useState } from "react";
import { db, auth } from "../firebaseConfig";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import TicketForm from "./TicketForm";

const CustomerDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      const user = auth.currentUser;
      const ticketsRef = collection(db, "tickets");
      const snapshot = await getDocs(ticketsRef);
      const ticketList = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

      setTickets(ticketList.filter(ticket => ticket.createdBy === user.email));
    };

    fetchTickets();
  }, []);

  const deleteTicket = async (ticketId) => {
    await deleteDoc(doc(db, "tickets", ticketId));
    alert("Ticket deleted.");
    setTickets(tickets.filter(ticket => ticket.id !== ticketId));
  };

  const viewTicket = (ticket) => {
    setSelectedTicket(ticket);
    setIsViewModalOpen(true);
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <h2 className="text-3xl font-semibold text-center mb-6">Customer Dashboard</h2>

      <div className="flex justify-center mb-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-violet-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-violet-700 transition"
        >
          Create Ticket
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gradient-to-r from-violet-200 to-violet-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-md w-110">
            <TicketForm onClose={() => setIsModalOpen(false)} />
          </div>
        </div>
      )}

      {isViewModalOpen && selectedTicket && (
        <div className="fixed inset-0 bg-gradient-to-r from-violet-200 to-violet-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-md w-110">
            <h3 className="text-2xl font-semibold mb-4">Ticket Details</h3>
            <p><strong>Ticket ID:</strong> {selectedTicket.ticketId}</p>
            <p><strong>Title:</strong> {selectedTicket.title}</p>
            <p><strong>Description:</strong> {selectedTicket.description}</p>
            <p><strong>Status:</strong> {selectedTicket.status}</p>
            <p><strong>Created By:</strong> {selectedTicket.createdBy}</p>
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
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="max-h-[400px] overflow-y-auto">
            {tickets.map(ticket => (
              <tr key={ticket.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{ticket.ticketId}</td>
                <td className="py-2 px-4">{ticket.title}</td>
                <td className="py-2 px-4">{ticket.status}</td>
                <td className="py-2 px-4 text-center">
                  <button
                    onClick={() => viewTicket(ticket)}
                    className="bg-blue-500 text-white py-1 px-4 rounded-lg hover:bg-blue-600 transition mr-2"
                  >
                    View
                  </button>
                  <button
                    onClick={() => deleteTicket(ticket.id)}
                    className="bg-red-500 text-white py-1 px-4 rounded-lg hover:bg-red-600 transition"
                  >
                    Delete
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

export default CustomerDashboard;
