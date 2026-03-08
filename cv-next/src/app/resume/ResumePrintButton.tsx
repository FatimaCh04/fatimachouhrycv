'use client';

export default function ResumePrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 bg-indigo-500 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-indigo-400 transition-colors"
    >
      <span className="material-symbols-outlined text-lg">download</span>
      Download / Save as PDF
    </button>
  );
}
