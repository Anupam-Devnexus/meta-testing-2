import React, { useState, useEffect } from "react";
import useLeadStore from "../../Zustand/LeadsGet";

export const Oppur = () => {
  const { data, loading, error, fetchData } = useLeadStore();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Ensure leads array exists
  const leads = data?.leads || [];

  // Color mapping
  const remarkColors = {
    "New Lead": "bg-blue-100 text-blue-700 border border-blue-300",
    "Appointment Scheduled": "bg-purple-100 text-purple-700 border border-purple-300",
    "Called": "bg-yellow-100 text-yellow-700 border border-yellow-300",
    "Hot Leads": "bg-red-100 text-red-700 border border-red-300",
    "Converted": "bg-green-100 text-green-700 border border-green-300",
    "Other": "bg-gray-100 text-gray-700 border border-gray-300",
  };

  // Get table headers dynamically from keys of first lead
  const headers = leads.length > 0 ? Object.keys(leads[0]) : [];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-[var(--primary-color)] mb-4">
        Opportunities (Leads from Social Media Ads)
      </h2>

      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="w-full text-left border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-[var(--primary-color)] text-white">
            <tr>
              {headers.map((header) => (
                <th key={header} className="px-4 py-3 capitalize">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr
                key={lead._id || lead.id}
                className="border-t hover:bg-gray-50 transition"
              >
                {headers.map((header) => (
                  <td key={header} className="px-4 py-3">
                    {header === "status" ? (
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          remarkColors[lead[header]] || remarkColors["Other"]
                        }`}
                      >
                        {lead[header] || "Other"}
                      </span>
                    ) : header === "userRemark" ? (
                      <input
                        type="text"
                        defaultValue={lead[header] || ""}
                        className="w-full px-2 py-1 border rounded-md text-sm focus:ring-2 focus:ring-[var(--primary-color)] outline-none"
                      />
                    ) : (
                      lead[header] || "—"
                    )}
                  </td>
                ))}
              </tr>
            ))}
            {leads.length === 0 && (
              <tr>
                <td
                  colSpan={headers.length || 1}
                  className="text-center py-4 text-gray-500"
                >
                  No leads found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
