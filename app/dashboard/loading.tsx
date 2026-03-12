export default function Loading() {
  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 bg-slate-50/50 min-h-[100dvh] pb-24 md:pb-8 w-full">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-5">
        <div className="space-y-2 w-full">
          <div className="h-8 md:h-10 w-48 md:w-64 bg-slate-200/70 rounded-xl animate-pulse"></div>
          <div className="h-4 w-60 md:w-96 bg-slate-100 rounded-lg animate-pulse mt-2"></div>
        </div>
        <div className="h-12 w-full md:w-40 bg-slate-100 rounded-2xl animate-pulse hidden md:block shrink-0"></div>
      </div>

      {/* Grid Cards Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-28 md:h-36 bg-slate-100 rounded-[2rem] animate-pulse ${
              i === 1 || i === 4 ? "col-span-2 md:col-span-1" : ""
            }`}
          ></div>
        ))}
      </div>

      {/* Main Content / Table Skeleton */}
      <div className="flex flex-col lg:grid lg:grid-cols-7 gap-4 md:gap-6 w-full mt-6">
        <div className="w-full lg:col-span-4 h-[300px] md:h-[400px] bg-slate-100 rounded-[2rem] md:rounded-[2.5rem] animate-pulse"></div>
        <div className="w-full lg:col-span-3 h-[300px] md:h-[400px] bg-slate-100 rounded-[2rem] md:rounded-[2.5rem] animate-pulse"></div>
      </div>
    </div>
  );
}
