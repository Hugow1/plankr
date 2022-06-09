import Link from "next/link";

export default function Footer() {
  return (
    <div className="bg-gray-800 w-full max-w-md bottom-0 absolute z-10 text-white flex justify-between px-20 py-5">
      <Link href="/">Home</Link>
      <Link href="/stats">Stats</Link>
    </div>
  );
}
