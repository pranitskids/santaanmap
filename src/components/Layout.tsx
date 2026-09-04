import { LockKeyhole, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { isEmbedMode } from "../lib/attribution";

export function Header() {
  if (isEmbedMode()) {
    return null;
  }

  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          to="/"
          aria-label="Santaan — Science for Smiles"
          className="shrink-0"
        >
          <img
            src="/santaan-logo.png"
            alt="Santaan — Science for Smiles"
            className="h-10 w-auto max-w-[132px] object-contain object-left sm:h-12 sm:max-w-[160px]"
          />
        </Link>
        <p lang="or" className="max-w-[185px] text-right text-[12px] font-extrabold leading-[1.35] text-[#075e58] sm:max-w-none sm:text-sm">
          ଯଦି ସଠିକ୍ ବୁଝିବା, ତେବେ ପାରିବା।
        </p>
        <span className="hidden items-center gap-2 rounded-full bg-teal-50 px-3 py-2 text-xs font-semibold text-teal-800 sm:flex">
          <LockKeyhole className="h-4 w-4" aria-hidden="true" />
          No contact unless requested
        </span>
      </div>
    </header>
  );
}

export function Footer() {
  if (isEmbedMode()) {
    return null;
  }

  return (
    <footer className="border-t border-slate-200 bg-white px-4 py-6 sm:px-6">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 text-xs leading-5 text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <span className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-teal-700" aria-hidden="true" />
          Santaan Fertility · Odisha
        </span>
        <span>
          Educational reference only. A clinician must confirm medical decisions.
        </span>
      </div>
    </footer>
  );
}
