import { ShoppingCart } from "lucide-react";

export default function Logo() {
  return (
    <div className="flex items-center gap-2">
      <ShoppingCart className="text-blue-400" size={24} />
      <span className="text-xl font-bold text-white">VyaparLite</span>
    </div>
  );
}