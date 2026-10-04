"use client";

import { useState } from "react";
import { fetchAPI } from "@/lib/api";

export default function CreateBlogPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setIsError(false);

    try {
      // DRF backend ke member endpoint par blog data bhejein
      await fetchAPI("/member/blogs/", "POST", {
        title,
        content,
      });
      
      setMessage("Blog successfully submit ho gaya hai! Admin approval ka wait karein.");
      setTitle("");
      setContent("");
    } catch (error: any) {
      setIsError(true);
      setMessage("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl p-6 mt-10">
      <h1 className="text-3xl font-bold mb-6">Create a New Blog</h1>
      
      {message && (
        <div className={`p-4 mb-6 rounded-md ${isError ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow-md border">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Blog Title</label>
          <input
            type="text"
            required
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter an engaging title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Blog Content</label>
          <textarea
            required
            rows={8}
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none resize-y"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your blog content here..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-black px-4 py-2 text-white font-semibold hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit for Review"}
        </button>
      </form>
    </div>
  );
}