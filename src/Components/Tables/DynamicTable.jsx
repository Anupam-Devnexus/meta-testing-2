import React, { useEffect, useState } from "react";

export default function LeadsTable({ apiResponse }) {
  const [headers, setHeaders] = useState([]);

  useEffect(() => {
    if (apiResponse?.leads?.length) {
      // Collect all unique field names across leads
      const uniqueFields = new Set();
      apiResponse.leads.forEach((lead) => {
        lead.field_data.forEach((field) => {
          uniqueFields.add(field.name);
        });
      });
      setHeaders([...uniqueFields]);
    }
  }, [apiResponse]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">
        Total Leads: {apiResponse?.totalLeads}
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">#</th>
              {headers.map((head) => (
                <th key={head} className="border p-2 capitalize">
                  {head.replace(/_/g, " ")}
                </th>
              ))}
              <th className="border p-2">Status</th>
              <th className="border p-2">Created At</th>
            </tr>
          </thead>
          <tbody>
            {apiResponse?.leads?.map((lead, idx) => {
              const fieldMap = {};
              lead.field_data.forEach((f) => {
                fieldMap[f.name] = f.values.join(", ");
              });

              return (
                <tr key={lead._id} className="hover:bg-gray-50">
                  <td className="border p-2">{idx + 1}</td>
                  {headers.map((head) => (
                    <td key={head} className="border p-2">
                      {fieldMap[head] || "-"}
                    </td>
                  ))}
                  <td className="border p-2">{lead.status}</td>
                  <td className="border p-2">
                    {new Date(lead.createdAt).toLocaleString()}
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
