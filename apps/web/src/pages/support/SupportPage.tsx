import { useState } from "react";
import { MaterialIcon } from "../../components/shared/MaterialIcon";

const FAQ = [
  { q: "How do I request a blood transfer?", a: "Navigate to Transfer Marketplace and click 'New Transfer Request'. Fill in the blood type, quantity, urgency, and source/destination organizations." },
  { q: "What happens when an emergency is declared?", a: "All regional response centers are notified immediately. The system automatically identifies available blood stock and suggests optimal transfer routes." },
  { q: "How are blood units tracked?", a: "Each unit receives a unique barcode and QR code at collection. The lifecycle (collected → tested → available → transferred → used) is tracked via the immutable inventory ledger." },
  { q: "Who can approve transfers?", a: "Hospital Admins, Regional Admins, and National Admins can approve transfer requests. The required approver role depends on transfer urgency." },
  { q: "How do I report a system issue?", a: "Use the Contact page to submit a support ticket, or email support@donorlink.et directly for critical issues." },
  { q: "What blood types can I filter by?", a: "The system supports all 8 ABO-Rh blood types: A+, A-, B+, B-, AB+, AB-, O+, O-." },
];

export default function SupportPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-display-lg text-m3-on-surface">Support Center</h2>
        <p className="text-body-main text-m3-on-surface-variant mt-2">Find answers, documentation, and support resources.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Quick Actions */}
        {[
          { icon: "article", title: "Documentation", desc: "API docs, user guides, and SOPs", color: "bg-m3-primary-container text-m3-on-primary-container" },
          { icon: "school", title: "Training Portal", desc: "Video tutorials and onboarding", color: "bg-m3-secondary-container text-m3-on-secondary-container" },
          { icon: "support_agent", title: "Contact Support", desc: "Email or call our team", color: "bg-m3-tertiary-container text-m3-on-tertiary-container" },
        ].map((card) => (
          <div key={card.title} className="bg-m3-surface-container-lowest border border-m3-outline-variant rounded-xl p-5 shadow-ambient-md hover:shadow-ambient-lg transition-shadow cursor-pointer">
            <div className={`w-12 h-12 rounded-xl ${card.color} flex items-center justify-center mb-3`}>
              <MaterialIcon icon={card.icon} size={24} />
            </div>
            <h3 className="text-title-sm text-m3-on-surface">{card.title}</h3>
            <p className="text-body-compact text-m3-on-surface-variant mt-1">{card.desc}</p>
          </div>
        ))}
      </div>

      {/* Emergency Hotline */}
      <div className="bg-m3-error-container border border-m3-error rounded-xl p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-m3-error flex items-center justify-center shrink-0">
          <MaterialIcon icon="phone_in_talk" size={24} className="text-m3-on-error" />
        </div>
        <div>
          <h3 className="text-title-sm text-m3-on-error-container">Emergency Support Hotline</h3>
          <p className="text-body-compact text-m3-on-error-container/80">For critical blood supply emergencies, call <strong>+251-111-BLOOD (25663)</strong> — available 24/7</p>
        </div>
      </div>

      {/* FAQ */}
      <div>
        <h3 className="text-headline-md text-m3-on-surface mb-4 flex items-center gap-2">
          <MaterialIcon icon="quiz" /> Frequently Asked Questions
        </h3>
        <div className="space-y-2">
          {FAQ.map((item, i) => (
            <div key={i} className="border border-m3-outline-variant rounded-xl overflow-hidden">
              <button onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="w-full flex justify-between items-center p-4 text-left hover:bg-m3-surface-container transition-colors">
                <span className="text-body-compact text-m3-on-surface font-medium">{item.q}</span>
                <MaterialIcon icon={openIdx === i ? "expand_less" : "expand_more"} className="text-m3-on-surface-variant shrink-0" />
              </button>
              {openIdx === i && (
                <div className="px-4 pb-4 text-body-compact text-m3-on-surface-variant border-t border-m3-outline-variant pt-3">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* System Status */}
      <div className="bg-m3-surface-container-lowest border border-m3-outline-variant rounded-xl p-5 shadow-ambient-md">
        <h3 className="text-title-sm text-m3-on-surface mb-4">System Status</h3>
        <div className="space-y-3">
          {[
            { name: "API Gateway", status: "Operational" },
            { name: "Database Cluster", status: "Operational" },
            { name: "Google Maps Integration", status: "Operational" },
            { name: "Notification Service", status: "Operational" },
          ].map((s) => (
            <div key={s.name} className="flex justify-between items-center">
              <span className="text-body-compact text-m3-on-surface">{s.name}</span>
              <span className="flex items-center gap-2 text-label-caps text-green-700">
                <span className="w-2 h-2 bg-green-500 rounded-full" /> {s.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
