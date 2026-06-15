import { MaterialIcon } from "../shared/MaterialIcon";
import { useCreateRequest } from "../../hooks/useApi";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "../../lib/utils";

interface CreateRequestModalProps {
  open: boolean;
  onClose: () => void;
}

const BLOOD_TYPES = ["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"];
const COMPONENT_TYPES = ["whole_blood", "packed_red_cells", "platelets", "plasma"];

export function CreateRequestModal({ open, onClose }: CreateRequestModalProps) {
  const [bloodType, setBloodType] = useState("O+");
  const [componentType, setComponentType] = useState("whole_blood");
  const [units, setUnits] = useState(1);
  const [urgency, setUrgency] = useState("NORMAL");
  const [notes, setNotes] = useState("");
  
  const createRequest = useCreateRequest();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createRequest.mutateAsync({
        bloodType,
        componentType,
        units,
        urgency,
        notes,
        neededBy: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // Default 24h
      });
      toast.success("Blood request submitted to ENBB");
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to submit request");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-m3-surface-container-lowest w-full max-w-md rounded-2xl shadow-ambient-lg border border-m3-outline-variant overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 border-b border-m3-outline-variant flex justify-between items-center">
          <h3 className="text-headline-sm text-m3-on-surface flex items-center gap-2">
            <MaterialIcon icon="add_card" className="text-m3-primary" /> Create Request
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-m3-surface-variant rounded-full transition-colors">
            <MaterialIcon icon="close" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-label-small font-bold text-m3-on-surface-variant uppercase">Blood Type</label>
              <select 
                className="w-full px-4 py-2 bg-m3-surface-container border border-m3-outline rounded-lg focus:border-m3-primary outline-none"
                value={bloodType}
                onChange={(e) => setBloodType(e.target.value)}
              >
                {BLOOD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-label-small font-bold text-m3-on-surface-variant uppercase">Quantity (Units)</label>
              <input 
                type="number" min="1"
                className="w-full px-4 py-2 bg-m3-surface-container border border-m3-outline rounded-lg focus:border-m3-primary outline-none"
                value={units}
                onChange={(e) => setUnits(parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-label-small font-bold text-m3-on-surface-variant uppercase">Component Type</label>
            <select 
              className="w-full px-4 py-2 bg-m3-surface-container border border-m3-outline rounded-lg focus:border-m3-primary outline-none"
              value={componentType}
              onChange={(e) => setComponentType(e.target.value)}
            >
              {COMPONENT_TYPES.map(t => <option key={t} value={t}>{t.replace(/_/g, ' ').toUpperCase()}</option>)}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-label-small font-bold text-m3-on-surface-variant uppercase">Urgency</label>
            <div className="flex gap-2">
              {["NORMAL", "URGENT", "CRITICAL"].map(u => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setUrgency(u)}
                  className={cn(
                    "flex-1 py-2 text-xs font-bold rounded-lg border transition-all",
                    urgency === u 
                      ? (u === 'CRITICAL' ? "bg-m3-error text-m3-on-error border-m3-error" : "bg-m3-primary text-m3-on-primary border-m3-primary")
                      : "border-m3-outline text-m3-on-surface-variant hover:bg-m3-surface-container-high"
                  )}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
             <label className="text-label-small font-bold text-m3-on-surface-variant uppercase">Notes / Diagnosis</label>
             <textarea 
               className="w-full px-4 py-2 bg-m3-surface-container border border-m3-outline rounded-lg focus:border-m3-primary outline-none min-h-[80px]"
               placeholder="Clinical context or specific requirements..."
               value={notes}
               onChange={(e) => setNotes(e.target.value)}
             />
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 border border-m3-outline text-m3-on-surface rounded-lg font-bold hover:bg-m3-surface-container transition-colors">Cancel</button>
            <button disabled={createRequest.isPending} className="flex-1 py-2.5 bg-m3-primary text-m3-on-primary rounded-lg font-bold hover:opacity-90 disabled:opacity-50">
              {createRequest.isPending ? "Submitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
