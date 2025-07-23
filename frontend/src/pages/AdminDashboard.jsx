import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllTickets} from "@/store/adminSlice";
import {
  Ticket,
  CheckCircle,
  Clock,
  Loader2,
  ShieldCheck,
  Filter, Search, ArrowDownZA, ArrowUpZA
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import NavBar from "@/components/NavBar";
import { useNavigate } from "react-router-dom";
import TicketCard from "@/components/TicketCard";

import { io } from "socket.io-client";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tickets, loading, error } = useSelector((state) => state.admin);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("desc"); 

  useEffect(() => {
    dispatch(fetchAllTickets());
  }, [dispatch]);

  useEffect(()=> {
      const socket = io("http://localhost:8000");

      socket.on("ticket-updated", (data) => {
         console.log("🔄 Ticket updated via socket:", data);
         dispatch(fetchAllTickets());
      });
      return () => {
        socket.disconnect();
      };
  },[])

 const totalTickets = tickets.length;
  const resolvedTickets = tickets.filter((t) => t.status === "done").length;
  const pendingTickets = totalTickets - resolvedTickets;

   const filteredTickets = tickets
    .filter((ticket) => {
      if (filter === "All") return true;
      return ticket.status === filter;
    })
    .filter((ticket) =>
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.createdBy?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.createdAt.toLowerCase().includes(searchTerm.toLowerCase()) 
    )
    .sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return sortOrder === "asc" ?  dateB - dateA:dateA - dateB;
    });

  return (
    <>
      <NavBar />
      <div className="space-y-10 px-6 md:px-10 py-6  min-h-screen">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-blue-600" />
              Admin Control Panel
            </h1>
            <p className="text-gray-500 mt-1 text-sm">Manage tickets across all tenants</p>
          </div>
          <Button
            className="border border-purple-500 text-purple-600 hover:bg-purple-100 transition"
            variant="outline"
            onClick={() => navigate("/dashboard")}
          >
            ⬅ Back to Dashboard
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card className="bg-blue-100 border-blue-400 shadow-sm">
            <CardHeader className="flex items-center gap-2">
              <Ticket className="text-blue-800" />
              <CardTitle className="text-blue-800">Total Tickets</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-bold text-blue-700">{totalTickets}</CardContent>
          </Card>

          <Card className="bg-green-100 border-green-400 shadow-sm">
            <CardHeader className="flex items-center gap-2">
              <CheckCircle className="text-green-800" />
              <CardTitle className="text-green-800">Resolved</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-bold text-green-700">{resolvedTickets}</CardContent>
          </Card>

          <Card className="bg-yellow-100 border-yellow-400 shadow-sm">
            <CardHeader className="flex items-center gap-2">
              <Clock className="text-yellow-800" />
              <CardTitle className="text-yellow-800">Pending</CardTitle>
            </CardHeader>
            <CardContent className="text-3xl font-bold text-yellow-700">{pendingTickets}</CardContent>
          </Card>
        </div>

        {/* Filter Buttons */}
       <div className="flex flex-wrap items-center justify-between gap-4 mt-2">
              <div className="flex gap-3 items-center mt-4">
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


            
          <div className="flex items-center gap-2">
            <Search className="text-gray-500" />
            <Input
              type="text"
              placeholder="Search by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 focus:border-0"
            />
          </div> 

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
          </Button>
      </div>


        {/* Ticket List */}
        {loading ? (
          <div className="flex items-center space-x-2 text-gray-600 mt-6">
            <Loader2 className="animate-spin w-5 h-5" />
            <span>Loading tickets...</span>
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : filteredTickets.length === 0 ? (
          <p className="text-gray-400 italic mt-4">No tickets found for selected filter.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-2">
            {filteredTickets.map((ticket) => (
                 <TicketCard key={ticket._id} ticket={ticket} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default AdminDashboard;
