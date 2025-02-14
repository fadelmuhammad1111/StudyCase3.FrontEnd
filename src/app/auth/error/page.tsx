"use client";

export default function AuthError() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-red-100">
      <div className="p-6 bg-white shadow-md rounded-lg w-96">
        <h2 className="text-xl font-bold text-center mb-4 text-red-500">Login Error</h2>
        <p className="text-center">Terjadi kesalahan saat login. Silakan coba lagi.</p>
      </div>
    </div>
  );
}
