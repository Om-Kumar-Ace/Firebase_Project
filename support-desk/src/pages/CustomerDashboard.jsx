import { useEffect, useState } from "react";
import { db, auth } from "../firebaseConfig";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import TicketForm from "./TicketForm";

const CustomerDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // For confirmation modal
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      const user = auth.currentUser;
      const ticketsRef = collection(db, "tickets");
      const snapshot = await getDocs(ticketsRef);
      const ticketList = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

      setTickets(ticketList.filter(ticket => ticket.email === user.email));
    };

    fetchTickets();
  }, []);

  const deleteTicket = async () => {
    try {
      if (!selectedTicket) return;
      await deleteDoc(doc(db, "tickets", selectedTicket.id));
      setTickets(tickets.filter(ticket => ticket.id !== selectedTicket.id));
      alert("Ticket deleted.");
      setIsDeleteModalOpen(false); 
    } catch (error) {
      console.error("Error deleting ticket:", error);
      alert("There was an error deleting the ticket. Please try again.");
      setIsDeleteModalOpen(false); 
    }
  };

  const viewTicket = (ticket) => {
    setSelectedTicket(ticket);
    setIsViewModalOpen(true);
  };

  return (
    <div className="bg-gradient-to-r from-violet-400 via-indigo-200 to-purple-100 min-h-screen p-6">
      <h2 className="text-4xl font-semibold text-center mb-8 text-violet">Customer Dashboard</h2>

      <div className="flex justify-center mb-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-violet-600 to-violet-700 text-white px-6 py-2 rounded-lg shadow-md hover:from-violet-700 hover:to-violet-800 transition"
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
                className="bg-gradient-to-r from-violet-600 to-violet-700 text-white px-6 py-2 rounded-lg shadow-md hover:from-violet-700 hover:to-violet-800 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedTicket && (
        <div className="fixed inset-0 bg-gradient-to-r from-violet-200 to-violet-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-md w-110">
            <h3 className="text-2xl font-semibold mb-4">Confirm Deletion</h3>
            <p>Are you sure you want to delete the ticket with ID: {selectedTicket.ticketId}?</p>
            <div className="mt-4">
              <button
                onClick={deleteTicket}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-lg shadow-md hover:from-red-600 hover:to-red-700 transition mr-2"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-2 rounded-lg shadow-md hover:from-gray-600 hover:to-gray-700 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full table-auto text-sm">
          <thead className="bg-gradient-to-r from-violet-500 to-violet-600 text-white">
            <tr>
              <th className="py-2 px-4 text-left">Ticket ID</th>
              <th className="py-2 px-4 text-left">Title</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="max-h-[400px] overflow-y-auto">
            {tickets.map(ticket => (
              <tr key={ticket.id} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{ticket.id}</td>
                <td className="py-2 px-4">{ticket.title}</td>
                <td className="py-2 px-4">{ticket.status}</td>
                <td className="py-2 px-4 text-center">
                  <button
                    onClick={() => viewTicket(ticket)}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-1 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition mr-2"
                  >
                    View
                  </button>
                  <button
                    onClick={() => {
                      setSelectedTicket(ticket);
                      setIsDeleteModalOpen(true);
                    }}
                    className="bg-gradient-to-r from-red-500 to-red-600 text-white py-1 px-4 rounded-lg hover:from-red-600 hover:to-red-700 transition"
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
