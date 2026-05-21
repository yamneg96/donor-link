import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { MaterialIcon } from "../../components/shared/MaterialIcon";
import { api } from "../../api/client";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  category: z.enum(["general", "technical", "emergency", "feedback", "partnership"]),
});
type FormValues = z.infer<typeof schema>;

export default function ContactPage() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: { category: "general" },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await api.post("/contact", data);
      toast.success("Message sent! We'll get back to you within 24 hours.");
      reset();
    } catch {
      toast.error("Failed to send message. Please try again.");
    }
  };

  const ic = "w-full px-3 py-2 border border-m3-outline-variant rounded-lg bg-m3-surface-container-lowest text-body-compact text-m3-on-surface focus:outline-none focus:border-m3-primary focus:ring-1 focus:ring-m3-primary";
  const lc = "block text-label-caps text-m3-on-surface-variant mb-1.5";
  const ec = "text-xs text-m3-error mt-0.5";

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center">
        <h2 className="text-display-lg text-m3-on-surface">Contact Us</h2>
        <p className="text-body-main text-m3-on-surface-variant mt-2">Have a question, feedback, or need assistance? We're here to help.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: "email", label: "Email", value: "support@donorlink.et" },
          { icon: "phone", label: "Phone", value: "+251-111-25663" },
          { icon: "location_on", label: "Address", value: "Addis Ababa, Ethiopia" },
        ].map((c) => (
          <div key={c.label} className="bg-m3-surface-container-lowest border border-m3-outline-variant rounded-xl p-5 shadow-ambient-md text-center">
            <div className="w-12 h-12 rounded-full bg-m3-primary-container flex items-center justify-center mx-auto mb-3">
              <MaterialIcon icon={c.icon} className="text-m3-on-primary-container" />
            </div>
            <p className="text-label-caps text-m3-on-surface-variant">{c.label}</p>
            <p className="text-body-compact text-m3-on-surface font-semibold mt-1">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-m3-surface-container-lowest border border-m3-outline-variant rounded-xl p-6 shadow-ambient-md">
        <h3 className="text-headline-md text-m3-on-surface mb-4">Send a Message</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className={lc}>Full Name</label><input {...register("name")} className={ic} placeholder="Your name" />{errors.name && <p className={ec}>{errors.name.message}</p>}</div>
            <div><label className={lc}>Email</label><input {...register("email")} type="email" className={ic} placeholder="your@email.com" />{errors.email && <p className={ec}>{errors.email.message}</p>}</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><label className={lc}>Subject</label><input {...register("subject")} className={ic} placeholder="Brief subject" />{errors.subject && <p className={ec}>{errors.subject.message}</p>}</div>
            <div><label className={lc}>Category</label>
              <select {...register("category")} className={ic}>
                <option value="general">General Inquiry</option>
                <option value="technical">Technical Support</option>
                <option value="emergency">Emergency Assistance</option>
                <option value="feedback">Feedback</option>
                <option value="partnership">Partnership</option>
              </select>
            </div>
          </div>
          <div><label className={lc}>Message</label><textarea {...register("message")} rows={5} className={ic} placeholder="Describe your inquiry in detail…" />{errors.message && <p className={ec}>{errors.message.message}</p>}</div>
          <div className="flex justify-end">
            <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 bg-m3-primary text-m3-on-primary rounded-lg text-sm hover:opacity-90 disabled:opacity-50 flex items-center gap-2">
              <MaterialIcon icon="send" size={18} />
              {isSubmitting ? "Sending…" : "Send Message"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
