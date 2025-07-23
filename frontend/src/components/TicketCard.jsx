import { useState } from "react";
import { useSelector,useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle ,DialogFooter} from "@/components/ui/dialog";
import { deleteTicketById } from "@/store/adminSlice";
import { toast } from "sonner";
import {Eye,Trash2,Loader2} from "lucide-react";
import { updateTicketStatus } from "@/store/adminSlice";

const TicketCard = ({ ticket ,refreshTickets}) => {
  const dispatch = useDispatch();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === "Admin";

  const handleStatusChange =async  (e) => {
    const newStatus = e.target.value;
    const res = await dispatch(updateTicketStatus({ ticketId: ticket._id, status: newStatus }));
     if (res.meta.requestStatus === "fulfilled") {
          toast.success("Status updated successfully!");
          setOpen(false)
        } else {
          toast.error("Failed to update status.");
    }
  };


  const handleConfirmedDelete = async () => {
       setLoading(true); 
      const res = await dispatch(deleteTicketById(ticket._id));
      if (res.meta.requestStatus === "fulfilled") {
            toast.success("Ticket deleted successfully");
            setConfirmOpen(false);
            refreshTickets();
      } else {
        toast.error("Failed to delete ticket");
      }
  };

  const readableDateAndTime = (time) =>
    new Date(time).toLocaleString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

  const truncate = (text, maxLength = 60) =>
    text.length > maxLength ? text.slice(0, maxLength) + "..." : text;

  return (
    <>
      <Card
        
        className="border-2 border-gray-200 shadow-sm hover:shadow-md cursor-pointer transition duration-300"
      >
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-800">
            {ticket.title}
          </CardTitle>
          <div className="flex  justify-between items-center ">
              <Button
                      size="icon"
                      variant="ghost"
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => setOpen(true)}
                    >
                      <Eye className="w-5 h-5" />
              </Button>
          <span
            className={`px-2 py-1 text-xs rounded font-semibold ${
              ticket.status === "done"
                ? "bg-green-100 text-green-700 border border-green-500"
                : "bg-yellow-100 text-yellow-700 border border-yellow-500"
            }`}
          >
            {ticket.status.toUpperCase()}
          </span> 
          </div>  
        </CardHeader>
        <CardContent className="text-sm space-y-1 text-gray-700">

           {isAdmin &&( <p><strong>Created By:</strong> {ticket.createdBy?.name}</p>)}
           {isAdmin && ( <p><strong>Email:</strong> {ticket.createdBy?.email}</p>)}
           { isAdmin && (<p><strong>Customer ID:</strong> {ticket.customerId}</p>)}
           <p><strong>Description:</strong> {truncate(ticket.description)}</p>
            <p><strong>CreatedAt:</strong> {readableDateAndTime(ticket.createdAt)} </p>
          {isAdmin && (<Button
                    size="sm"
                    variant="destructive"
                    className="mt-3 w-[100px] flex items-center justify-center gap-2 border-2 border-gray-400 text-black"
                    onClick={() => setConfirmOpen(true)}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                    Delete
            </Button>)}

          {/* {isAdmin && (
            <div className="mt-2">
              <label className="block text-sm text-gray-700 font-medium">Change Status</label>
              <select
                value={ticket.status}
                onChange={handleStatusChange}
                className="w-full border rounded px-2 py-1 text-sm mt-1"
              >
                <option value="open">Open</option>
                <option value="done">Done</option>
              </select>
            </div>
          )} */}

          


         
        </CardContent>
      </Card>

      {/* Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
            className="sm:max-w-lg bg-white rounded-xl shadow-lg p-6 space-y-4"
            style={{
              backdropFilter: "blur(4px)",
              backgroundColor: "rgba(255,255,255,0.95)"
            }}
          >
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-gray-800">
                {ticket.title}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-2 text-sm text-gray-700">
                {isAdmin ? (
                  <div className="space-y-1">
                    <label className="block font-medium text-sm text-gray-700">Change Status:</label>
                    <select
                      value={ticket.status}
                      onChange={handleStatusChange}
                      className="w-full border rounded px-2 py-1 text-sm"
                    >
                      <option value="open">Open</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                ) : (
                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-white text-xs font-medium ${
                        ticket.status === "done" ? "bg-green-500" : "bg-yellow-500"
                      }`}
                    >
                      {ticket.status.toUpperCase()}
                    </span>
                  </p>
                )}

              
               {isAdmin &&( <p><strong>Created By:</strong> {ticket.createdBy?.name}</p>)}
               {isAdmin && ( <p><strong>Email:</strong> {ticket.createdBy?.email}</p>)}
                {isAdmin && (<p><strong>Customer ID:</strong> {ticket.customerId}</p>)}
                <p><strong>Description:</strong> {ticket.description}</p>
                 <p><strong>CreatedAt:</strong> {readableDateAndTime(ticket.createdAt)}</p>
            </div>

            <DialogFooter>
              <Button className="border" variant="secondary" onClick={() => setOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>

      </Dialog>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
            <DialogContent
              className="sm:max-w-md bg-white rounded-xl shadow-xl border border-red-200 p-6 space-y-4"
              style={{
                backdropFilter: "blur(6px)",
                backgroundColor: "rgba(255, 255, 255, 0.95)",
              }}
            >
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold text-red-600">
                  ⚠️ Confirm Deletion
                </DialogTitle>
              </DialogHeader>

              <p className="text-gray-700 text-sm">
                Are you sure you want to delete this ticket? <br />
                <span className="text-red-500 font-medium">This action cannot be undone.</span>
              </p>

              <div className="text-sm text-gray-600 space-y-1 bg-gray-50 p-3 rounded border border-gray-200">
                <p><strong>Title:</strong> {ticket.title}</p>
                <p><strong>Description:</strong> {truncate(ticket.description, 80)}</p>
                <p><strong>Status:</strong> {ticket.status.toUpperCase()}</p>
              </div>

              <DialogFooter className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setConfirmOpen(false)}>
                  Cancel
                </Button>
                <Button className="border text-black" variant="destructive" disabled={loading} onClick={handleConfirmedDelete}>
                 {loading ? <Loader2 className="animate-spin h-4 w-4" /> : "Yes, Delete"}
                </Button>

              </DialogFooter>
            </DialogContent>
       </Dialog>


    </>
  );
};

export default TicketCard;
