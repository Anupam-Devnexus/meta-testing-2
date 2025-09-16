import React, { useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";

export default function ExcelUploader() {
  const [data, setData] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const binaryStr = evt.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      setData(jsonData);
      setShowConfirm(true);
      console.log("Parsed Excel Data:", jsonData);
    };

    reader.readAsBinaryString(file);
  };

  const handleConfirm = async () => {
    try {
      setUploading(true);
      const response = await axios.post("http://ec2-65-2-37-114.ap-south-1.compute.amazonaws.com:3000/auth/api/upload-excel-leads", { data });

      alert("Data uploaded successfully!");
      console.log("Response:", response.data);

      // reset
      setShowConfirm(false);
      setData([]);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload data.");
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setData([]);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      <label
        htmlFor="excelUpload"
        className="inline-block cursor-pointer px-6 py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition"
      >
        Upload Excel File
      </label>
      <input
        type="file"
        id="excelUpload"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        className="hidden"
      />

      {data.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-3 text-gray-800">Preview Parsed Data</h3>
          <div className="max-h-96 overflow-y-auto border border-gray-300 rounded p-4 bg-gray-50">
            <pre className="text-sm whitespace-pre-wrap break-words">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>

          {showConfirm && (
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={handleCancel}
                className="px-5 py-2 rounded border border-gray-400 text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={uploading}
                className={`px-5 py-2 rounded bg-green-600 text-white font-semibold transition ${uploading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"
                  }`}
              >
                {uploading ? "Uploading..." : "Yes, Upload"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
