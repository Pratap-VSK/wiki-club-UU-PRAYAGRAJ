"use client";

import { useEffect, useState } from "react";
import { fetchAPI } from "@/lib/api";

// Blog data ka structure define kar rahe hain
interface Blog {
  id: number;
  title: string;
  status: string;
  created_at: string;
}

export default function MyBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMyBlogs = async () => {
      try {
        // GET request bhej kar apne blogs fetch karein
        const data = await fetchAPI("/member/blogs/", "GET");
        setBlogs(data);
      } catch (err: any) {
        setError(err.message || "Blogs fetch karne mein error aayi.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyBlogs();
  }, []);

  // Status ke hisaab se color return karne ka function
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <span className="px-3 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">Approved</span>;
      case "REJECTED":
        return <span className="px-3 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full">Rejected</span>;
      default:
        return <span className="px-3 py-1 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded-full">Pending</span>;
    }
  };

  if (loading) {
    return <div className="text-center mt-20 text-gray-600">Loading your blogs...</div>;
  }

  if (error) {
    return <div className="text-center mt-20 text-red-500">{error}</div>;
  }

  return (
    <div className="mx-auto max-w-4xl p-6 mt-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Blogs</h1>
        <a 
          href="/member/create-blog" 
          className="bg-black text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-gray-800 transition"
        >
          + Create New Blog
        </a>
      </div>

      {blogs.length === 0 ? (
        <div className="bg-white p-8 text-center rounded-xl border border-gray-200 shadow-sm">
          <p className="text-gray-500 mb-4">Aapne abhi tak koi blog submit nahi kiya hai.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 font-semibold text-gray-600">Blog Title</th>
                <th className="p-4 font-semibold text-gray-600">Submitted On</th>
                <th className="p-4 font-semibold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="p-4 font-medium text-gray-900">{blog.title}</td>
                  <td className="p-4 text-gray-500">
                    {new Date(blog.created_at).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric"
                    })}
                  </td>
                  <td className="p-4">
                    {getStatusBadge(blog.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}