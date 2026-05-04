import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-app flex items-center justify-center">
      <div className="text-center">
        <div
          className="text-6xl text-gold mb-4"
          style={{ fontFamily: "'Amiri', serif" }}
        >
          ٤٠٤
        </div>
        <h1 className="text-2xl font-bold text-primary mb-2">
          Page Not Found
        </h1>
        <p className="text-muted mb-6">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/surah/1"
          className="px-6 py-3 bg-gold text-[#0d1117] rounded-xl font-semibold hover:bg-[#c49833] transition-colors"
        >
          Return to Quran
        </Link>
      </div>
    </div>
  );
}
