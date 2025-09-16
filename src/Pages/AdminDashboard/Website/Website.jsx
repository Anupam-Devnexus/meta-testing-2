import { useEffect } from "react";
import useContactStore from "../../../Zustand/Contact";
import DynamicDataTable from "../../../Components/Tables/DynamicDataTable";

export default function Website() {
  // Zustand store for contact submissions
  const { data, loading, error, fetchContacts } = useContactStore();

  // Fetch contacts on mount
  useEffect(() => {
    fetchContacts();
  }, []);

  // Safely extract submissions
  const submissions = data?.submissions || [];
  console.log(submissions)
  const api = "https://dbbackend.devnexussolutions.com/auth/api/contact"

  return (
    <section className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Contact Submissions</h1>
        <span className="text-sm text-gray-500">
          Total Submissions: {data?.TotoalLeads || submissions.length}
        </span>
      </div>

      {/* Status Messages */}
      {loading && <p className="text-blue-600 font-medium animate-pulse">Loading submissions...</p>}
      {error && <p className="text-red-600 font-medium">Error: {error}</p>}
      {!loading && !error && submissions.length === 0 && (
        <p className="text-gray-500">No submissions found.</p>
      )}

      {/* Data Table */}
      {!loading && !error && submissions.length > 0 && (
        <div className="overflow-x-auto bg-white rounded-lg shadow border">
          <DynamicDataTable apiData={submissions} patchApi={api} />
        </div>
      )}
    </section>
  );
}
