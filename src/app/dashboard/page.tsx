"use client";

import { Card, Statistic, Table, Tag, Skeleton } from "antd";
import { UserOutlined, BookOutlined, HomeOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import axios from "axios";
import Navbar from "@/components/Navbar";

const Dashboard = () => {
  const [stats, setStats] = useState({ courses: 100, instructors: 321, students: 1043, rooms: 908 });
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      setTimeout(async () => {
        const { data } = await axios.get("http://localhost:3000/courses");
        setCourses(data.slice(0, 5));
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching courses", error);
      setIsLoading(false);
    }
  };

  const AnimatedStatistic = ({ value }: { value: number }) => {
    const count = useMotionValue(0);
    const springValue = useSpring(count, { stiffness: 100, damping: 10 });
    const rounded = useTransform(springValue, (latest) => Math.round(latest));

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
        <Tag color={status === "Done" ? "green" : status === "Progress" ? "blue" : "red"}>{status}</Tag>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Dashboard</h1>

        {/* Statistic Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {isLoading ? (
            [...Array(4)].map((_, index) => (
              <Card key={index} className="rounded-xl shadow-sm">
                <Skeleton active />
              </Card>
            ))
          ) : (
            <>
              <Card className="rounded-xl shadow-sm border border-gray-200">
                <Statistic title="Total Jadwal" valueRender={() => <AnimatedStatistic value={stats.courses} />} prefix={<BookOutlined />} />
              </Card>
              <Card className="rounded-xl shadow-sm border border-gray-200">
                <Statistic title="Instruktur" valueRender={() => <AnimatedStatistic value={stats.instructors} />} prefix={<UserOutlined />} />
              </Card>
              <Card className="rounded-xl shadow-sm border border-gray-200">
                <Statistic title="Murid" valueRender={() => <AnimatedStatistic value={stats.students} />} prefix={<UserOutlined />} />
              </Card>
              <Card className="rounded-xl shadow-sm border border-gray-200">
                <Statistic title="Ruangan" valueRender={() => <AnimatedStatistic value={stats.rooms} />} prefix={<HomeOutlined />} />
              </Card>
            </>
          )}
        </div>

        {/* Recent Courses Table */}
        <Card className="rounded-xl shadow-sm border border-gray-200" title="Recent Courses">
          {isLoading ? (
            <Skeleton active paragraph={{ rows: 5 }} />
          ) : (
            <Table columns={columns} dataSource={courses} rowKey="id" pagination={false} />
          )}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
