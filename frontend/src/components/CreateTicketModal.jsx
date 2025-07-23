import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import axiosInstance from "@/utils/axiosInstance";

const CreateTicketModal = ({ onTicketCreated }) => {
  const [open, setOpen] = useState(false);
  const [ticket, setTicket] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setTicket((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    if (!ticket.title || !ticket.description) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);
    try {
      const res = await axiosInstance.post("/tickets/create-ticket", ticket);
      toast.success("🎉 Ticket created successfully");
      setOpen(false);
      setTicket({ title: "", description: "" });
      onTicketCreated();
      
    } catch (error) {
      toast.error("❌ Failed to create ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mb-4 mt-5 bg-purple-100 border-purple-400 border-2 hover:bg-purple-200 duration-300 transition ">
          + Create Ticket
        </Button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-md bg-white/90 backdrop-blur-md shadow-2xl border border-gray-300 rounded-xl"
      >
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800">
            🎫 Create New Ticket
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-3">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-semibold text-gray-700">
              Title
            </Label>
            <Input
              id="title"
              name="title"
              placeholder="e.g. Login not working"
              value={ticket.title}
              onChange={handleChange}
              className="focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold text-gray-700">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe your issue..."
              value={ticket.description}
              onChange={handleChange}
              rows={4}
              className="focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold"
          >
            {loading ? "Creating..." : "Create Ticket"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTicketModal;
