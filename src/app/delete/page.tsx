"use client";

import "@ant-design/v5-patch-for-react-19";
import { useState, useEffect } from "react";
import { Table, Button, message, Dropdown, Modal } from "antd"; // Impor Modal
import { EllipsisOutlined, RedoOutlined, DeleteOutlined } from "@ant-design/icons"; // Impor ikon
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

  const handlePermanentDelete = (id: number) => {
    // Tampilkan modal konfirmasi sebelum menghapus
    Modal.confirm({
      title: "Apakah Anda yakin?",
      content: "Anda akan menghapus kursus ini secara permanen. Kursus ini tidak dapat dikembalikan.",
      onOk: async () => {
        try {
          await axios.delete(`http://localhost:3000/courses/${id}/permanent-delete`);
          message.success("Course berhasil dihapus permanen");

          // Hapus dari state agar UI langsung update
          setDeletedCourses((prev) => prev.filter((course: any) => course.id !== id));
        } catch (error) {
          message.error("Gagal menghapus course secara permanen");
        }
      },
      onCancel: () => {
        message.info("Penghapusan dibatalkan");
      },
    });
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
              render: (_, record: { id: number }) => (
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "restore",
                        label: (
                          <span>
                            <RedoOutlined style={{ marginRight: 8 }} />
                            Restore
                          </span>
                        ),
                        onClick: () => handleRestore(record.id),
                      },
                      {
                        key: "delete",
                        label: (
                          <span>
                            <DeleteOutlined style={{ marginRight: 8 }} />
                            Delete Permanently
                          </span>
                        ),
                        onClick: () => handlePermanentDelete(record.id),
                        danger: true,
                      },
                    ],
                  }}
                  trigger={["click"]}
                >
                  <Button icon={<EllipsisOutlined />} />
                </Dropdown>
              ),
            },
          ]}
          rowKey="id"
        />

        <Button
          type="default"
          className="mt-4"
          onClick={() => router.push("/course")}
        >
          Kembali ke Halaman Jadwal
        </Button>
      </div>
    </div>
  );
};

export default DeletePage;
