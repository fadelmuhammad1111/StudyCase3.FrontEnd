"use client";

import "@ant-design/v5-patch-for-react-19";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Table, Button, Modal, Form, Input, Select, message, Dropdown } from "antd";
import { EllipsisOutlined, EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import axios from "axios";
import Navbar from "@/components/Navbar";

const { Option } = Select;

interface Course {
  id: number;
  name: string;
  instructor: string;
  semester: string;
  status: string;
}

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchCourses = async () => {
    try {
      const { data } = await axios.get(`http://localhost:3000/courses`, {
        params: { search: searchTerm }, // Tambahkan search ke request
      });
      setCourses(data);
    } catch (error) {
      message.error("Gagal mengambil data");
      console.error(error);
    }
  };

  const handleEdit = (record: Course) => {
    setEditingCourse(record);
    form.setFieldsValue(record);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (values: any) => {
    try {
      setLoading(true);
      if (editingCourse) {
        await axios.put(`http://localhost:3000/courses/${editingCourse.id}`, values);
        message.success("Course berhasil diperbarui");
        fetchCourses();
        setIsEditModalOpen(false);
        form.resetFields();
        setEditingCourse(null);
      } else {
        message.error("Course tidak ditemukan");
      }
    } catch (error) {
      message.error("Gagal memperbarui course");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (values: any) => {
    try {
      setLoading(true);
      await axios.post("http://localhost:3000/courses", { ...values, status: "Progress", createdBy: "admin" });
      message.success("Course berhasil ditambahkan");
      fetchCourses();
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      message.error("Gagal menambahkan course");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSoftDelete = async (id: number) => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:3000/courses/${id}`);
      message.success("Course berhasil dihapus");
      fetchCourses();
    } catch (error) {
      message.error("Gagal menghapus course");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  

  const confirmDelete = (id: number) => {
    Modal.confirm({
      title: "Apakah Anda yakin ingin menghapus jadwal ini?",
      okText: "Ya",
      cancelText: "Batal",
      onOk: () => handleSoftDelete(id),
    });
  };

  const handleToggleStatus = async (id: number, currentStatus: string) => {
    try {
      setLoading(true);
      let newStatus = currentStatus === "Done" ? "Progress" : "Done";
  
      if (currentStatus === "Canceled") {
        message.warning("Course telah dibatalkan dan tidak bisa diubah.");
        setLoading(false);
        return;
      }
  
      await axios.put(`http://localhost:3000/courses/${id}`, { status: newStatus });
  
      // Update langsung di state agar UI lebih cepat merespons
      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.id === id ? { ...course, status: newStatus } : course
        )
      );
  
      message.success(`Status berhasil diubah menjadi "${newStatus}"`);
    } catch (error) {
      message.error("Gagal memperbarui status");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchCourses();
  }, [searchTerm]); // Fetch data setiap kali search berubah
  

  return (
  <div>
      <Navbar />
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-gray-700 mt-5 mb-3">Manajemen Kursus</h1>
        <div className="flex justify-between items-center mb-4">
          <Input
            prefix={<SearchOutlined className="text-gray-400" />}
            placeholder="Cari Jadwal Les..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-80 px-4 py-2 rounded-full border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex gap-2">
            <Link href="/delete">
              <Button type="primary" danger icon={<DeleteOutlined />} />
            </Link>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
            </Button>
          </div>
        </div>

        <Table
          className="rounded-lg shadow-md"
          dataSource={[...courses].sort((a, b) => (a.status === "Done" ? -1 : 1))} // Default sorted ASC
          pagination={{ 
            pageSize: 5,
          }}
          
          columns={[
            { title: "Pelajaran", dataIndex: "name", key: "name" },
            { title: "Pengajar", dataIndex: "instructor", key: "instructor" },
            { title: "Semester", dataIndex: "semester", key: "semester" },
            { title: "Jadwal", dataIndex: "schedule", key: "schedule" },
            {
              title: "Tanggal",
              dataIndex: "date",
              key: "date",
              render: (date:string) => dayjs(date).format('DD-MM-YYYY'),
            },
            { title: "Ruangan", dataIndex: "roomNumber", key: "roomNumber" },
            {
              title: "Status",
              dataIndex: "status",
              key: "status",
              render: (status, record) => (
                <span
                  onClick={() => record.status !== "Canceled" && handleToggleStatus(record.id, record.status)}
                  className={`px-3 py-1 rounded-full text-white cursor-pointer transition-all duration-200 
                    ${
                      status === "Done"
                        ? "bg-green-500 hover:bg-green-600"
                        : status === "Canceled"
                        ? "bg-red-500 cursor-not-allowed"
                        : "bg-yellow-500 hover:bg-yellow-600"
                    }`}
                >
                  {status}
                </span>
              ),
            },
            {
              title: "Aksi",
              key: "actions",
              render: (_, record) => (
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: "edit",
                        label: (
                          <button
                            onClick={() => handleEdit(record)}
                            className="flex items-center gap-2 p-2 cursor-pointer text-left"
                          >
                            <EditOutlined />
                            Edit
                          </button>
                        ),
                      },
                      {
                        key: "delete",
                        label: (
                          <button
                            onClick={() => confirmDelete(record.id)}
                            className="flex items-center gap-2 p-2 cursor-pointer text-red-500 text-left"
                          >
                            <DeleteOutlined />
                            Hapus
                          </button>
                        ),
                      },
                    ],
                  }}
                  trigger={["click"]}
                >
                  <Button type="text" icon={<EllipsisOutlined />} />
                </Dropdown>
              ),
            },
            
          ]}
          rowKey="id"
          loading={loading}
        />
      </div>

      {/* Modal Tambah */}
      <Modal
        title="Tambah Jadwal"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={loading}
      >
        <Form form={form} onFinish={handleAdd} layout="vertical">
        <Form.Item name="name" label="Pelajaran" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="instructor" label="Pengajar" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="semester" label="Semester" rules={[{ required: true }]}>
            <Select>
              <Option value="Ganjil">Ganjil</Option>
              <Option value="Genap">Genap</Option>
            </Select>
          </Form.Item>
          <Form.Item name="credits" label="SKS" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="schedule" label="Hari" rules={[{ required: true }]}>
            <Select>
              <Option value="Senin">Senin</Option>
              <Option value="Selasa">Selasa</Option>
              <Option value="Rabu">Rabu</Option>
              <Option value="Kamis">Kamis</Option>
              <Option value="Jumat">Jumat</Option>
              <Option value="Sabtu">Sabtu</Option>
              <Option value="Minggu">Minggu</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="date"
            label="Tanggal"
            rules={[{ required: true }]}
            getValueProps={(value) => ({ value: value ? dayjs(value) : null })}
          >
            <DatePicker format="DD-MM-YYYY" />
          </Form.Item>
          <Form.Item name="department" label="Departemen" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="roomNumber" label="Ruangan" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Edit */}
      <Modal
        title="Edit Jadwal"
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={loading}
      >
        <Form form={form} onFinish={handleEditSubmit} layout="vertical">
        <Form.Item name="name" label="Pelajaran" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="instructor" label="Pengajar" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="semester" label="Semester" rules={[{ required: true }]}>
            <Select>
              <Option value="Ganjil">Ganjil</Option>
              <Option value="Genap">Genap</Option>
            </Select>
          </Form.Item>
          <Form.Item name="credits" label="SKS" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="department" label="Departemen" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="roomNumber" label="Ruangan" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
    </div>
  );
};

export default Courses;
