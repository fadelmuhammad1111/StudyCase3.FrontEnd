"use client";

import { useState, useEffect } from "react";
import { Table, message } from "antd";
import axios from "axios";

const ArchivedCourses = () => {
  const [archivedCourses, setArchivedCourses] = useState([]);

  const fetchArchivedCourses = async () => {
    try {
      const { data } = await axios.get("http://localhost:3000/archived-courses");
      setArchivedCourses(data);
    } catch (error) {
      message.error("Gagal mengambil data arsip");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchArchivedCourses();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-gray-700 mt-5 mb-3">Arsip Kursus</h1>
        <Table
          dataSource={archivedCourses}
          columns={[
            { title: "Pelajaran", dataIndex: "name", key: "name" },
            { title: "Pengajar", dataIndex: "instructor", key: "instructor" },
            { title: "Semester", dataIndex: "semester", key: "semester" },
            { title: "Jadwal", dataIndex: "schedule", key: "schedule" },
            { title: "Ruangan", dataIndex: "roomNumber", key: "roomNumber" },
            { title: "Status", dataIndex: "status", key: "status" },
          ]}
          rowKey="id"
        />
      </div>
    </div>
  );
};

export default ArchivedCourses;
