import ScissorsLoader from "@/components/ui/ScissorsLoader";

export default function Loading() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <ScissorsLoader label="Loading designs" />
    </div>
  );
}