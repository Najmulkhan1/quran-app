import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center">
      <div className="text-center">
        <div
          className="text-6xl text-[#d4a843] mb-4"
          style={{ fontFamily: "'Amiri', serif" }}
        >
          ٤٠٤
        </div>
        <h1 className="text-2xl font-bold text-[#e6edf3] mb-2">
          Page Not Found
        </h1>
        <p className="text-[#636e7b] mb-6">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/surah/1"
          className="px-6 py-3 bg-[#d4a843] text-[#0d1117] rounded-xl font-semibold hover:bg-[#c49833] transition-colors"
        >
          Return to Quran
        </Link>
      </div>
    </div>
  );
}
