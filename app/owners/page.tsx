export default function OwnerPage() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-xl bg-white" />
        <div className="aspect-video rounded-xl bg-white" />
        <div className="aspect-video rounded-xl bg-white" />
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-white md:min-h-min" />
    </div>
  );
}
