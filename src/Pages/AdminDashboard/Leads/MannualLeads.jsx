import { useEffect } from "react";
import useLeadStore from "../../../Zustand/LeadsGet";
import DynamicDataTable from "../../../Components/Tables/DynamicDataTable";

export default function ManualLeads() {
  const { data, loading, error, fetchData } = useLeadStore();

  useEffect(() => {
    fetchData();
  }, []);


  const leads = data?.leads || [];
  const api = "https://dbbackend.devnexussolutions.com/User/leads"
  console.log("Leads Data:", leads);
  return (
    <div className="p-4">
      {loading && <p className="text-yellow-600">Loading leads...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && !error && leads.length > 0 && (
        <DynamicDataTable
          apiData={leads}
          patchApi={api}
        />
      )}

      {!loading && !error && leads.length === 0 && (
        <p className="text-gray-500">No leads found.</p>
      )}
    </div>
  );
}
