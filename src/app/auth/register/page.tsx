"use client";

import "@ant-design/v5-patch-for-react-19";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Form, Input, Button, message } from "antd";
import Link from "next/link";

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: { name: string; email: string; password: string }) => {
    setLoading(true);
    try {
      const response = await axios.post("/api/auth/register", values);
      message.success(response.data.message);
      router.push("/login"); // Redirect ke halaman login setelah sukses
    } catch (err: any) {
      message.error(err.response?.data?.message || "Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 to-indigo-700 p-6">
      <div className="p-8 bg-white shadow-2xl rounded-2xl w-96">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Daftar Akun</h2>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="name" label="Nama" rules={[{ required: true, message: "Nama wajib diisi" }]}>
            <Input
              placeholder="Masukkan nama"
              className="h-10 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: "email", message: "Email tidak valid" }]}
          >
            <Input
              placeholder="Masukkan email"
              className="h-10 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </Form.Item>

          <Form.Item name="password" label="Password" rules={[{ required: true, message: "Password wajib diisi" }]}>
            <Input.Password
              placeholder="Masukkan password"
              className="h-10 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </Form.Item>

          {/* Tombol Daftar */}
          <Form.Item>
          <Link href="/dashboard" className="text-blue-500 hover:underline">
            <Button type="primary" htmlType="submit" loading={loading} className="w-full mt-2">
              Daftar  
            </Button>
            </Link>
          </Form.Item>  
        </Form>

        {/* Link ke Login */}
        <p className="text-center text-sm text-gray-600">
          Sudah punya akun?{" "}
          <Link href="/" className="text-blue-500 hover:underline">
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
