import React, { useEffect, useState, useMemo } from "react";
import { FaWhatsapp, FaFilter } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import { FiCheck } from "react-icons/fi";

const TAG_COLORS = [
  "bg-blue-100 text-blue-700",
  "bg-green-100 text-green-700",
  "bg-yellow-100 text-yellow-700",
  "bg-purple-100 text-purple-700",
  "bg-red-100 text-red-700",
];

export default function DynamicDataTable({ apiData, patchApi = '' }) {
  // Normalize API data
  const rows = useMemo(() => {
    if (!apiData) return [];
    if (Array.isArray(apiData)) return apiData;
    return apiData.submissions || apiData.leads || [];
  }, [apiData]);

  const [enabledRows, setEnabledRows] = useState({});
  const [remarks, setRemarks] = useState({});
  const [tags, setTags] = useState({});
  const [showGlobalRemarks, setShowGlobalRemarks] = useState(false);
  const [globalRemark1, setGlobalRemark1] = useState("");
  const [globalRemark2, setGlobalRemark2] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customRemark1, setCustomRemark1] = useState("");
  const [remarkOptions1, setRemarkOptions1] = useState([
    "New Lead",
    "Appointment Scheduled",
    "Called",
    "Hot Lead",
    "Converted",
    "Other",
  ]);
  const [submitting, setSubmitting] = useState(false);

  const isAnyRowSelected = Object.values(enabledRows).some(Boolean);

  // Initialize rows
  useEffect(() => {
    const initEnabled = {};
    const initRemarks = {};
    const initTags = {};
    rows.forEach((row, idx) => {
      const id = row.id || row._id || idx;
      initEnabled[id] = false;
      initRemarks[id] = { remark1: "", remark2: "" };
      initTags[id] = [];
    });
    setEnabledRows(initEnabled);
    setRemarks(initRemarks);
    setTags(initTags);
  }, [rows]);

  // Helpers
  const detectEmail = (row) =>
    Object.entries(row).find(([k]) => k.toLowerCase().includes("email"))?.[1] || "";
  const detectPhone = (row) =>
    Object.entries(row).find(([k]) => k.toLowerCase().includes("phone"))?.[1] || "";

  const toggleRow = (id) =>
    setEnabledRows((prev) => ({ ...prev, [id]: !prev[id] }));

  const addTag = (id, newTag) => {
    if (!newTag.trim()) return;
    setTags((prev) => ({
      ...prev,
      [id]: [
        ...prev[id],
        { text: newTag, color: TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)] },
      ],
    }));
  };

  // Global Remarks
  const handleRemark1Change = (value) => {
    if (value === "Other") {
      setShowCustomInput(true);
      setGlobalRemark1("");
    } else {
      setGlobalRemark1(value);
      setShowCustomInput(false);
    }
  };

  const addCustomRemark = () => {
    if (!customRemark1.trim()) return;
    setRemarkOptions1((prev) => [customRemark1, ...prev.filter((o) => o !== "Other"), "Other"]);
    setGlobalRemark1(customRemark1);
    setCustomRemark1("");
    setShowCustomInput(false);
  };

  const applyGlobalRemarks = () => {
    setRemarks((prev) => {
      const updated = { ...prev };
      Object.keys(enabledRows)
        .filter((id) => enabledRows[id])
        .forEach((id) => {
          updated[id] = { remark1: globalRemark1, remark2: globalRemark2 };
        });
      return updated;
    });
  };

  // Bulk Communication
  const sendWhatsApp = () => {
    rows.forEach((row, idx) => {
      const id = row.id || row._id || idx;
      if (!enabledRows[id]) return;
      const phone = detectPhone(row);
      if (!phone) return;
      const msg = encodeURIComponent(
        `Hello ${row.name || row.full_name || "Customer"},\nRemark 1: ${remarks[id]?.remark1 || globalRemark1}\nRemark 2: ${remarks[id]?.remark2 || globalRemark2}`
      );
      window.open(`https://wa.me/${phone}?text=${msg}`, "_blank");
    });
  };

  const sendGmail = () => {
    rows.forEach((row, idx) => {
      const id = row.id || row._id || idx;
      if (!enabledRows[id]) return;
      const email = detectEmail(row);
      if (!email) return;
      const subject = encodeURIComponent("Follow Up");
      const body = encodeURIComponent(
        `Hi ${row.name || row.full_name || "Customer"},\n\nRemark 1: ${remarks[id]?.remark1 || globalRemark1}\nRemark 2: ${remarks[id]?.remark2 || globalRemark2}\n\nThanks,\nTeam`
      );
      window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`, "_blank");
    });
  };


  const submitChanges = async () => {
    if (!patchApi) {
      alert("Patch API endpoint not provided.");
      return;
    }

    setSubmitting(true);
    try {
      const token = JSON.parse(localStorage.getItem("UserDetails"));

      // Collect enabled rows
      const updates = Object.keys(enabledRows)
        .filter((id) => enabledRows[id])
        .map((id) => {
          const row = rows.find((r) => (r._id || r.id) === id);
          if (!row) return null;

          return {
            _id: row._id || row.id,
            remarks1: remarks[id]?.remark1 || row.remarks1 || "",
            remarks2: remarks[id]?.remark2 || row.remarks2 || "",
            tags: tags[id]?.length ? tags[id] : row.tags || [],
          };
        })
        .filter(Boolean);

      if (!updates.length) {
        alert("No rows selected to update.");
        return;
      }

      // ❗ Pick first row’s data (backend only supports one updateData)
      const ids = updates.map((u) => u._id);
      const updateData = {
        remarks1: updates[0].remarks1,
        remarks2: updates[0].remarks2,
        tags: updates[0].tags,
      };

      console.log("Payload being sent:", { ids, updateData });

      const res = await fetch(`${patchApi}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token.token}` : "",
        },
        body: JSON.stringify({ ids, updateData }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Failed: ${errText}`);
      }

      const response = await res.json();
      console.log("Patch response:", response);
      console.log("Changes submitted successfully!");
    } catch (err) {
      console.error("Error submitting:", err);
      console.log("Error submitting changes! " + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (!rows.length) return <p className="text-gray-500">No data available</p>;

  const headers = Object.keys(rows[0]).filter((k) => k !== "_id" && k !== "id");

  return (
    <div className="p-4 space-y-4">
      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-2">
        <FaWhatsapp
          onClick={sendWhatsApp}
          className={`p-1 bg-green-600 text-white text-3xl rounded-md cursor-pointer shadow-sm hover:bg-green-700 transition ${!isAnyRowSelected ? "opacity-50 cursor-not-allowed" : ""}`}
          title="Send WhatsApp"
        />
        <SiGmail
          onClick={sendGmail}
          className={`p-1 bg-red-600 text-white text-3xl rounded-md cursor-pointer shadow-sm hover:bg-red-700 transition ${!isAnyRowSelected ? "opacity-50 cursor-not-allowed" : ""}`}
          title="Send Email"
        />
        <FaFilter
          onClick={() => isAnyRowSelected && setShowGlobalRemarks((p) => !p)}
          className={`text-blue-600 text-2xl cursor-pointer ${!isAnyRowSelected ? "opacity-50 cursor-not-allowed" : ""}`}
          title="Global Remarks"
        />
        <button
          onClick={submitChanges}
          disabled={!isAnyRowSelected || submitting}
          className={`ml-auto px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {submitting ? "Submitting..." : "Submit Changes"}
        </button>
      </div>

      {/* Global Remarks */}
      {showGlobalRemarks && (
        <div className="w-full bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex flex-wrap gap-3 items-center">
          <select
            value={globalRemark1}
            onChange={(e) => handleRemark1Change(e.target.value)}
            disabled={!isAnyRowSelected}
            className="px-4 py-2 border-b border-gray-300 text-sm disabled:opacity-50"
          >
            <option value="">Select Remark 1</option>
            {remarkOptions1.map((opt, idx) => (
              <option key={idx} value={opt}>{opt}</option>
            ))}
          </select>

          {showCustomInput && (
            <div className="flex gap-2 items-center">
              <input
                type="text"
                placeholder="Enter custom remark"
                value={customRemark1}
                onChange={(e) => setCustomRemark1(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <button
                onClick={addCustomRemark}
                className="flex items-center gap-1 px-2 py-2 bg-green-600 text-white rounded-full shadow-sm hover:bg-green-700"
              >
                <FiCheck />
              </button>
            </div>
          )}

          <input
            type="text"
            placeholder="Enter Remark 2"
            value={globalRemark2}
            onChange={(e) => setGlobalRemark2(e.target.value)}
            className="px-4 py-2 border-b border-gray-300 text-sm outline-none flex-1"
          />

          <button
            onClick={applyGlobalRemarks}
            className="flex items-center gap-2 px-2 py-2 bg-blue-600 text-white rounded-full shadow-sm hover:bg-blue-700"
          >
            <FiCheck className="text-lg" />
          </button>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow border">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border text-center">Select</th>
              {headers.map((h, i) => (
                <th key={i} className="py-2 px-4 border capitalize">{h}</th>
              ))}
              <th className="py-2 px-4 border">Remarks</th>
              <th className="py-2 px-4 border">Tags</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => {
              const id = row.id || row._id || idx;
              return (
                <tr key={id} className={`hover:bg-gray-50 ${enabledRows[id] ? "bg-gray-100" : ""}`}>
                  <td className="py-2 px-4 border text-center">
                    <input
                      type="checkbox"
                      checked={enabledRows[id] || false}
                      onChange={() => toggleRow(id)}
                      className="w-5 h-5 accent-blue-500"
                    />
                  </td>
                  {headers.map((h, i) => (
                    <td key={i} className="py-2 px-4 border">{row[h] || "-"}</td>
                  ))}
                  <td className="py-2 px-4 border text-xs">{remarks[id]?.remark2 || "-"}</td>
                  <td className="py-2 px-4 border">
                    <div className="flex flex-wrap gap-1 mb-1">
                      {tags[id]?.map((tag, tIdx) => (
                        <span key={tIdx} className={`px-2 py-1 text-xs rounded ${tag.color}`}>{tag.text}</span>
                      ))}
                    </div>
                    <p className="font-semibold">{remarks[id]?.remark1 || "-"}</p>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}