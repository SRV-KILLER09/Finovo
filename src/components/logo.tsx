import { cn } from "@/lib/utils";
import Image from "next/image";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Image src="https://i.postimg.cc/QC7NnVp9/2635078e-c51d-44f2-9be3-3f27a54e13cf.png" alt="Finovo Logo" width={24} height={24} className="h-6 w-6" />
      <span className="font-bold text-lg text-foreground font-headline">Finovo</span>
    </div>
  );
}
