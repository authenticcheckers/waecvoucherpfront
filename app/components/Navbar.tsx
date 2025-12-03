import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between">
      <h1 className="font-bold text-xl">Waec e-Vouchers Hub</h1>
      <div className="space-x-4">
        <Link href="/purchase/wassce">WASSCE</Link>
        <Link href="/purchase/bece">BECE</Link>
        <Link href="/purchase/school-placement">School Placement</Link>
        <Link href="/dashboard">Admin</Link>
      </div>
    </nav>
  );
}
