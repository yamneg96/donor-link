import { MaterialIcon } from "../shared/MaterialIcon";
import { useRecordTransfusion } from "../../hooks/useApi";
import { useState } from "react";
import { toast } from "sonner";

interface RecordTransfusionModalProps {
  open: boolean;
  onClose: () => void;
}

export function RecordTransfusionModal({ open, onClose }: RecordTransfusionModalProps) {
  const [barcode, setBarcode] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientId, setPatientId] = useState("");
  const [notes, setNotes] = useState("");
  const recordTransfusion = useRecordTransfusion();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!barcode || !patientName) return;
    
    try {
      await recordTransfusion.mutateAsync({
        unitBarcode: barcode,
        patientName,
        patientId,
        notes,
        transfusedAt: new Date().toISOString()
      });
      toast.success("Transfusion recorded successfully");
      onClose();
      setBarcode("");
      setPatientName("");
      setPatientId("");
      setNotes("");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to record transfusion");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
      <div className="bg-m3-surface-container-lowest w-full max-w-md rounded-2xl shadow-ambient-lg border border-m3-outline-variant overflow-hidden">
        <div className="px-6 py-4 border-b border-m3-outline-variant flex justify-between items-center">
          <h3 className="text-headline-sm text-m3-on-surface flex items-center gap-2">
            <MaterialIcon icon="vaccines" className="text-m3-primary" /> Record Transfusion
          </h3>
          <button onClick={onClose} className="text-m3-on-surface-variant hover:bg-m3-surface-variant p-2 rounded-full">
            <MaterialIcon icon="close" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-label-small text-m3-on-surface-variant uppercase font-bold">Unit Barcode</label>
            <div className="relative">
              <MaterialIcon icon="qr_code_scanner" className="absolute left-3 top-1/2 -translate-y-1/2 text-m3-on-surface-variant" size={20} />
              <input 
                autoFocus
                className="w-full pl-10 pr-4 py-2.5 bg-m3-surface-container rounded-lg border border-m3-outline focus:border-m3-primary outline-none text-body-main"
                placeholder="Scan or enter barcode..."
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-label-small text-m3-on-surface-variant uppercase font-bold">Patient Name</label>
              <input 
                className="w-full px-4 py-2.5 bg-m3-surface-container rounded-lg border border-m3-outline focus:border-m3-primary outline-none text-body-main"
                placeholder="Full name"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="text-label-small text-m3-on-surface-variant uppercase font-bold">Patient ID (MRN)</label>
              <input 
                className="w-full px-4 py-2.5 bg-m3-surface-container rounded-lg border border-m3-outline focus:border-m3-primary outline-none text-body-main"
                placeholder="ID number"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-label-small text-m3-on-surface-variant uppercase font-bold">Clinical Notes</label>
            <textarea 
              className="w-full px-4 py-2.5 bg-m3-surface-container rounded-lg border border-m3-outline focus:border-m3-primary outline-none text-body-main min-h-[80px]"
              placeholder="Any relevant clinical notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-m3-outline text-m3-secondary rounded-lg font-bold hover:bg-m3-surface-container transition-colors"
            >
              Cancel
            </button>
            <button 
              disabled={recordTransfusion.isPending}
              className="flex-1 py-2.5 bg-m3-primary text-m3-on-primary rounded-lg font-bold hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {recordTransfusion.isPending ? "Recording..." : "Record Units"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
