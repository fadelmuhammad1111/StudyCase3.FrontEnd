"use client";

import "@ant-design/v5-patch-for-react-19";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Form, Input, Button, message } from "antd";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (result?.error) {
        message.error("Email atau password salah!");
      } else {
        message.success("Login berhasil!");
        router.push("/dashboard"); // Atau halaman yang sesuai setelah login
      }
    } catch (error) {
      console.error("Login error:", error);
      message.error("Terjadi kesalahan saat login. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 to-indigo-600 p-6">
      <div className="p-8 bg-white shadow-xl rounded-2xl w-96">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
            <Input className="h-10 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500" />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true }]}>
            <Input.Password className="h-10 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500" />
          </Form.Item>
          <Link href="/dashboard">
            <Button type="primary" htmlType="submit" loading={loading} className="w-full mt-2">
              Login
            </Button>
            </Link>
        </Form>
        <p className="text-center text-sm text-gray-600 mt-4">
          Belum punya akun?{" "}
          <Link href="/auth/register" className="text-blue-500 hover:underline">
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
