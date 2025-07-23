import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CreateTicketModal from "@/components/CreateTicketModal";
import axiosInstance from "@/utils/axiosInstance";
import TicketCard from "@/components/TicketCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import NavBar from "@/components/NavBar";
import { useNavigate } from "react-router-dom";
import { Filter, Search, ArrowDownZA, ArrowUpZA } from "lucide-react";
import { io } from "socket.io-client";

const Dashboard = () => {
  const user = useSelector((state) => state.auth.user);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const isAdmin = user?.role === "Admin";

  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("desc"); 

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const endpoint = isAdmin ? "/tickets/get-all-tickets" : `/tickets/my-tickets`;
      const res = await axiosInstance.get(endpoint);
       setTickets(res.data.data);
    } catch (err) {
      toast.error("❌ Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };
  
  const handleTicketCreated = () => {
    setShowModal(false);
    fetchTickets(); 

  };
   useEffect(() => {
    fetchTickets();
  }, [isAdmin]);


  useEffect(() => {
   const socket = io("http://localhost:8000"); // backend URL

  socket.on("ticket-updated", (data) => {
    console.log("🔄 Ticket updated via socket:", data);
    fetchTickets(); 
  });

  return () => {
    socket.disconnect();
  };
}, []);

  
  const filteredTickets = tickets
    .filter((ticket) => {
      if (filter === "All") return true;
      return ticket.status === filter;
    })
    .filter((ticket) =>
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.createdAt.toLowerCase().includes(searchTerm.toLowerCase()) 
    )
    .sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === "asc" ?  dateA - dateB : dateB - dateA;
    });

    const visibleTickets = isAdmin ? filteredTickets.slice(0, 6) : filteredTickets;
    const totalTickets = tickets.length;

  return (
    <>
      <NavBar />
      <div className="space-y-6 pb-6 px-6">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold mt-5">
            {isAdmin ? "🛡️ Admin Dashboard" : `👋 Welcome, ${user?.name}`}
          </h2>

          {!isAdmin && (
            <CreateTicketModal
              open={showModal}
              onClose={() => setShowModal(false)}
              onTicketCreated={handleTicketCreated}
            />
          )}
        </div>

      
        {isAdmin && (
          <div className="bg-blue-100 border-blue-400 border rounded-md p-5 shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-blue-800">📊 Summary</h3>
                <p className="text-sm text-blue-800">
                  Total Tickets: <strong>{tickets.length}</strong>
                </p>
              </div>
              <Button
                className="bg-yellow-100 hover:bg-yellow-200 border-yellow-400 border-2"
                variant="secondary"
                onClick={() => navigate("/admin")}
              >
                View All Tickets →
              </Button>
            </div>
          </div>
        )}

      
        <div className="flex flex-wrap items-center justify-between gap-4 mt-2">
        
          <div className="flex items-center gap-2  flex-col">
             <div className="flex  gap-2">
             <Filter className="text-gray-500" />
            <span className="text-gray-600 font-medium">Filter by:</span>
            {["All", "open", "done"].map((status) => (
              <Button
                key={status}
                onClick={() => setFilter(status)}
                className={`capitalize transition-all duration-200 ${
                  filter === status
                    ? "bg-blue-400 border-blue-400 border-2 text-white "
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {status}
              </Button>
              ))}
              </div>
              <div >Total Tickets : {totalTickets}</div>
          </div>

          { !isAdmin && (
          <div className="flex items-center gap-2">
            <Search className="text-gray-500" />
            <Input
              type="text"
              placeholder="Search by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 focus:border-0"
            />
          </div> )}
          {!isAdmin && (
          <Button
            className="bg-yellow-100 border-yellow-400 border-2 transition hover:bg-yellow-200 duration-300 "
            variant="ghost"
            onClick={() =>
              setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
            }
          >
            {sortOrder === "asc" ? (
              <span className="flex items-center gap-1">
                <ArrowUpZA size={16} /> Oldest First
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <ArrowDownZA size={16} /> Newest First
              </span>
            )}
          </Button> )}
        </div>

        <div className="mt-4">
          {loading ? (
            <p>Loading tickets...</p>
          ) : filteredTickets.length === 0 ? (
            <p className="text-gray-500">No tickets found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {visibleTickets.map((ticket) => (
                <TicketCard key={`${ticket._id}-${ticket.status}`} ticket={ticket} refreshTickets={fetchTickets} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
