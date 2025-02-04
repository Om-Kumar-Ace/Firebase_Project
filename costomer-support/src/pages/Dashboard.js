import React, { useState, useEffect } from 'react';
import { firestore } from '../Firebase';

const Dashboard = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    const fetchTickets = async () => {
      const ticketsSnapshot = await firestore.collection('tickets').get();
      setTickets(ticketsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchTickets();
  }, []);

  const handleDelete = async (id) => {
    await firestore.collection('tickets').doc(id).delete();
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Ticket ID</th>
            <th>Title</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => (
            <tr key={ticket.id}>
              <td>{ticket.id}</td>
              <td>{ticket.title}</td>
              <td>{ticket.status}</td>
              <td>
                <button onClick={() => handleDelete(ticket.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
