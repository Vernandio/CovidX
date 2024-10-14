"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from "next/image";

export default function DetectionPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedFile) {
      alert("Please select an image to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      setResult(data.message);
      setIsModalOpen(true); // Open the modal with the result
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Floating Background */}
      <div className="absolute inset-0 overflow-hidden animate-float opacity-40">
        <div className="w-[400px] h-[400px] bg-orange-500 rounded-full absolute top-10 left-10"></div>
        <div className="w-[350px] h-[350px] bg-purple-700 rounded-full absolute bottom-20 right-20"></div>
        <div className="w-[300px] h-[300px] bg-blue-400 rounded-full absolute top-2/3 left-2/3"></div>
      </div>

      <div className="relative z-10 max-w-xl text-center px-6">
        <h1 className="text-5xl font-extrabold mb-6">COVID Detection</h1>
        <p className="text-lg text-gray-300 mb-8">
          Upload your lung X-ray image and let our AI-powered system analyze it
          for signs of COVID.
        </p>

        {/* Upload Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center space-y-4">
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="file-input mb-4"
            />

            {/* Image Preview */}
            {imagePreview && (
              <div className="w-[200px] h-[200px] relative rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>

          {/* Detection Button */}
          <Button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600"
          >
            {loading ? "Checking..." : "Check for COVID"}
          </Button>
        </form>
      </div>

      <footer className="absolute bottom-9 text-gray-400">
        <p>© 2024 COVIDX. All rights reserved.</p>
      </footer>

      {/* Modal */}
      {isModalOpen && (
        <>
          {/* Overlay */}
          <div className="fixed inset-0 bg-black bg-opacity-50 z-20"></div>

          {/* Modal Content */}
          <div className="fixed inset-0 flex items-center justify-center z-30">
            <Card className="bg-green-600 text-white p-6 rounded-lg shadow-xl w-[90%] max-w-lg relative">
              <CardHeader className="flex justify-between items-center">
                <CardTitle className="text-2xl font-semibold">Result</CardTitle>
                <button
                  onClick={closeModal}
                  className="text-2xl font-bold hover:text-gray-300 absolute right-4 top-4"
                >
                  &times;
                </button>
              </CardHeader>
              <CardContent className="mt-4">
                <p className="text-lg">{result}</p>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
