import { cn } from "@/lib/utils";

type StatusVariant =
  | "urgent"
  | "pending"
  | "in-progress"
  | "completed"
  | "cancelled"
  | "ppng"
  | "new"
  | "default";

function inferVariant(label: string): StatusVariant {
  const l = label.toLowerCase();
  if (l.includes("urgent") || l.includes("เร่งด่วน")) return "urgent";
  if (l.includes("pending") || l.includes("รอเริ่ม")) return "pending";
  if (l.includes("ป.ป.ง.")) return "ppng";
  if (l.includes("in progress") || l.includes("กำลัง")) return "in-progress";
  if (l.includes("complet") || l.includes("เสร็จ")) return "completed";
  if (l.includes("cancel") || l.includes("ยกเลิก")) return "cancelled";
  if (l === "new" || l === "ใหม่") return "new";
  return "default";
}

const variantClasses: Record<StatusVariant, string> = {
  urgent: "bg-red-100 text-red-700 border-red-200",
  pending: "bg-amber-100 text-amber-700 border-amber-200",
  ppng: "bg-orange-100 text-orange-700 border-orange-200",
  "in-progress": "bg-blue-100 text-blue-700 border-blue-200",
  completed: "bg-green-100 text-green-700 border-green-200",
  cancelled: "bg-gray-100 text-gray-500 border-gray-200",
  new: "bg-indigo-100 text-indigo-700 border-indigo-200",
  default: "bg-gray-100 text-gray-600 border-gray-200",
};

interface StatusBadgeProps {
  label: string;
  variant?: StatusVariant;
  className?: string;
}

export function StatusBadge({ label, variant, className }: StatusBadgeProps) {
  const v = variant ?? inferVariant(label);
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        variantClasses[v],
        className
      )}
    >
      {label}
    </span>
  );
}
