"use client";
// This page exists solely to catch Paystack's redirect to /voucher/success
// and forward the query params (?reference= & ?trxref=) to the real success page.
import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RefreshCw } from "lucide-react";

function Redirector() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const reference = searchParams.get("reference");
    const trxref    = searchParams.get("trxref");

    const params = new URLSearchParams();
    if (reference) params.set("reference", reference);
    if (trxref)    params.set("trxref", trxref);

    router.replace(`/success?${params.toString()}`);
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-mesh flex flex-col items-center justify-center gap-4">
      <RefreshCw size={36} className="text-amber-500 animate-spin" />
      <p className="text-slate-600 font-bold text-lg">Confirming your payment...</p>
      <p className="text-slate-400 text-sm">You'll be redirected in a moment</p>
    </div>
  );
}

export default function VoucherSuccessRedirect() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-mesh flex items-center justify-center">
        <RefreshCw size={36} className="text-amber-500 animate-spin" />
      </div>
    }>
      <Redirector />
    </Suspense>
  );
}
