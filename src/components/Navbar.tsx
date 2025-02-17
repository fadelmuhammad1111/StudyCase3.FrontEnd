"use client";

import Link from "next/link";

const Navbar = () => {
  return (
    <div className="container mx-auto pt-20">

    <nav className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg p-4 fixed top-0 left-0 w-full z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          <Link href="/dashboard">Manajemen Kursus</Link>
        </h1>

        <div className="flex gap-6 items-center">
          <Link
            href="/dashboard"
            className="hover:bg-white hover:text-blue-600 px-4 py-2 rounded-lg transition duration-300"
          >
            Dashboard
          </Link>
          <Link
            href="/course"
            className="hover:bg-white hover:text-blue-600 px-4 py-2 rounded-lg transition duration-300"
          >
            Jadwal
          </Link>
          <Link
            href="/"
            className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition duration-300"
          >
            Logout
          </Link>
        </div>
      </div>
    </nav>
    </div>
  );
};

export default Navbar;
