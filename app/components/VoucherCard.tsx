export default function VoucherCard({ serial, pin }: any) {
  return (
    <div className="border p-4 rounded-lg shadow-md bg-white mt-4">
      <h3 className="font-bold mb-2">Your Voucher</h3>
      <p>Serial Number: {serial}</p>
      <p>PIN: {pin}</p>
      <a
        href={`http://localhost:5000/pdfs/${serial}.pdf`} 
        target="_blank"
        className="text-blue-600 underline mt-2 inline-block"
      >
        Download PDF
      </a>
    </div>
  );
}
