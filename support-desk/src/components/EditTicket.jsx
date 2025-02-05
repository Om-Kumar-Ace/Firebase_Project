import { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";

const EditTicket = () => {
  const { id } = useParams();
  const navigate = useNavigate();  
  const [ticket, setTicket] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [loading, setLoading] = useState(true); // New loading state
  const [error, setError] = useState(""); // New error state

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const ticketRef = doc(db, "tickets", id);
        const ticketSnap = await getDoc(ticketRef);
        if (ticketSnap.exists()) {
          const ticketData = ticketSnap.data();
          setTicket(ticketData);
          setTitle(ticketData.title);
          setDescription(ticketData.description);
          setAssignedTo(ticketData.assignedTo);
        } else {
          setError("Ticket not found!");
        }
      } catch (err) {
        setError("Error fetching ticket data!");
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  const handleSaveChanges = async () => {
    if (!title || !description || !assignedTo) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setError(""); // Reset error before updating

    try {
      const ticketRef = doc(db, "tickets", id);
      await updateDoc(ticketRef, { title, description, assignedTo });
      alert("Ticket updated successfully");
      navigate("/ticket-management");  // Use navigate to push to a different route
    } catch (err) {
      setError("Error updating ticket!");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="text-xl text-violet-700">Loading...</span>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-white to-violet-200 min-h-screen p-6">
      <h2 className="text-3xl font-semibold text-violet-900 mb-6">Edit Ticket</h2>
      {error && <div className="text-red-600 mb-4">{error}</div>} {/* Display error if present */}
      {ticket && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Enter title"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Enter description"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700">Assigned To</label>
            <input
              type="text"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg"
              placeholder="Assign to..."
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleSaveChanges}
              className="bg-violet-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-violet-700 transition"
              disabled={loading} // Disable button while saving
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditTicket;
