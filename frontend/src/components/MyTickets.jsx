// src/pages/MyTickets.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyTickets } from "@/store/myTicketsSlice";

const MyTickets = () => {
  const dispatch = useDispatch();
  const { myTickets, loading, error } = useSelector((state) => state.myTickets);

  useEffect(() => {
    dispatch(fetchMyTickets());
  }, [dispatch]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">My Tickets</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <ul className="space-y-4">
          {myTickets.map((ticket) => (
            <li key={ticket._id} className="border p-4 rounded bg-white shadow">
              <p><strong>Title:</strong> {ticket.title}</p>
              <p><strong>Description:</strong> {ticket.description}</p>
              <p><strong>Status:</strong> {ticket.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyTickets;
