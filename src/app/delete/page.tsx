"use client";

import { useState, useEffect } from "react";
import { Table, Button, message } from "antd";
import axios from "axios";
import { useRouter } from "next/navigation";

const DeletePage = () => {
  const [deletedCourses, setDeletedCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Gunakan useRouter

  const fetchDeletedCourses = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("http://localhost:3000/courses", {
        params: { deleted: "true" }, // Tambahkan parameter deleted=true
      });
      setDeletedCourses(data);
    } catch (error) {
      message.error("Gagal mengambil data yang dihapus");
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (id: number) => {
    try {
      await axios.put(`http://localhost:3000/courses/${id}/restore`);
      message.success("Course berhasil dikembalikan");

      // Hapus dari state agar UI langsung update
      setDeletedCourses((prev) => prev.filter((course: any) => course.id !== id));
    } catch (error) {
      message.error("Gagal mengembalikan course");
    }
  };

  useEffect(() => {
    fetchDeletedCourses();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-gray-700 mt-5 mb-3">
          Kursus yang Dihapus
        </h1>

        <Table
          dataSource={deletedCourses}
          pagination={{ pageSize: 5 }}
          loading={loading}
          columns={[
            { title: "Pelajaran", dataIndex: "name", key: "name" },
            { title: "Pengajar", dataIndex: "instructor", key: "instructor" },
            { title: "Semester", dataIndex: "semester", key: "semester" },
            { title: "Jadwal", dataIndex: "schedule", key: "schedule" },
            {
              title: "Aksi",
              key: "actions",
              render: (_, record: any) => (
                <Button onClick={() => handleRestore(record.id)} type="primary">
                  Restore
                </Button>
              ),
            },
          ]}
          rowKey="id"
        />

        <Button
          type="default"
          className="mt-4"
          onClick={() => router.push("/")}
        >
          Kembali ke Halaman Utama
        </Button>
      </div>
    </div>
  );
};

export default DeletePage;
