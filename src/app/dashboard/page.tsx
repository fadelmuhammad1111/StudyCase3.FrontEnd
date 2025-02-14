"use client";

import { Card, Statistic, Table, Tag, Skeleton } from "antd";
import { UserOutlined, BookOutlined, HomeOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useTransform } from "framer-motion";
import axios from "axios";
import Navbar from "@/components/Navbar";

const Dashboard = () => {
  const [stats, setStats] = useState({ courses: 100, instructors: 321, students: 1043, rooms: 908 });
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const springValue = useSpring(0, { stiffness: 100, damping: 10 });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      setTimeout(async () => {
        const { data } = await axios.get("http://localhost:3000/courses");
        setCourses(data.slice(0, 5)); // Ambil 5 kursus terbaru
        setIsLoading(false);
      }, 1000); // Simulasi delay loading
    } catch (error) {
      console.error("Error fetching courses", error);
      setIsLoading(false);
    }
  };

  const AnimatedStatistic = ({ value }: { value: number }) => {
    const count = useMotionValue(0);
    const springValue = useSpring(count, { stiffness: 100, damping: 10 });
    const rounded = useTransform(springValue, (latest) => Math.round(latest)); // Pindahin ke sini
  
    useEffect(() => {
      count.set(value);
    }, [value, count]);
  
    return <motion.span>{rounded}</motion.span>;
  };
  

  const columns = [
    { title: "Course Name", dataIndex: "name", key: "name" },
    { title: "Instructor", dataIndex: "instructor", key: "instructor" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "Done" ? "green" : status === "Progress" ? "blue" : "red"}>
          {status}
        </Tag>
      ),
    },
  ];

  return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <Navbar />
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {/* Loading Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {isLoading ? (
          [...Array(4)].map((_, index) => (
            <Card key={index}>
              <Skeleton active />
            </Card>
          ))
        ) : (
          <>
            <Card>
              <Statistic
                title="Total Jadwal"
                valueRender={() => <AnimatedStatistic value={stats.courses} />}
                prefix={<BookOutlined />}
              />
            </Card>
            <Card>
              <Statistic
                title="Instruktur"
                valueRender={() => <AnimatedStatistic value={stats.instructors} />}
                prefix={<UserOutlined />}
              />
            </Card>
            <Card>
              <Statistic
                title="Murid"
                valueRender={() => <AnimatedStatistic value={stats.students} />}
                prefix={<UserOutlined />}
              />
            </Card>
            <Card>
              <Statistic
                title="Ruangan"
                valueRender={() => <AnimatedStatistic value={stats.rooms} />}
                prefix={<HomeOutlined />}
              />
            </Card>
          </>
        )}
      </div>

      {/* Loading Table */}
      <Card title="" className="mb-6">
        {isLoading ? (
          <Skeleton active paragraph={{ rows: 5 }} />
        ) : (
          <Table columns={columns} dataSource={courses} rowKey="id" pagination={false} />
        )}
      </Card>
    </div>
  );
};

export default Dashboard;
