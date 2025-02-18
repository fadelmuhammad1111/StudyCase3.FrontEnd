"use client";

import "@ant-design/v5-patch-for-react-19";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Form, Input, Button, message } from "antd";
import Image from "next/image";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      setShowSplash(false);
    }, 1500); // Splash screen muncul selama 2 detik
  }, []);

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

  if (showSplash) {
    return (
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center justify-center min-h-screen bg-white"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        >
          <Image src="/logo.png" alt="Logo" width={400} height={150} priority />
        </motion.div>
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: "80%" }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="h-2 bg-black rounded-full mt-4"
        />
        <p className="mt-4 text-black text-lg font-medium">Loading...</p>
      </motion.div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 to-indigo-600 p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-8 bg-white shadow-xl rounded-2xl w-96"
      >
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
      </motion.div>
    </div>
  );
}
