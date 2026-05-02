export default function SearchResultsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {Array.from({ length: 6 }, (_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-4xl border border-stone-200 bg-white/85 p-3 shadow-sm"
        >
          <div className="h-64 rounded-4xl bg-stone-200" />
          <div className="mt-3 h-6 w-2/3 rounded-full bg-stone-200" />
          <div className="mt-3 h-3.5 w-1/2 rounded-full bg-stone-200" />
          <div className="mt-3 h-4 w-full rounded-full bg-stone-200" />
          <div className="mt-2 h-4 w-[90%] rounded-full bg-stone-200" />
          <div className="mt-2 h-4 w-[75%] rounded-full bg-stone-200" />
        </div>
      ))}
    </div>
  );
}
