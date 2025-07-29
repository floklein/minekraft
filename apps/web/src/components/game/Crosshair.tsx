export default function Crosshair() {
  return (
    <div className="pointer-events-none fixed inset-0 flex items-center justify-center">
      <div className="h-1.5 w-1.5 bg-white opacity-75" />
    </div>
  );
}
