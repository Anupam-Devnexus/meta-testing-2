import React, { useEffect, useMemo } from "react";
import useCaleads from "../../../Zustand/Caleads";
import DynamicDataTable from "../../../Components/Tables/DynamicDataTable";

const Caleads = () => {
  const { data, loading, error, fetchCaleads } = useCaleads();

  useEffect(() => {
    fetchCaleads();
  }, []);
  console.log(data)

  const apiResponse = useMemo(() => data || { message: "", totalLeads: 0, leads: [] }, [data]);

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      {loading && <div className="p-6">Loading...</div>}
      {error && <div className="p-6 text-red-600">{error}</div>}
      {!loading && !error && <DynamicDataTable apiData={apiResponse} />}
    </div>
  );
};

export default Caleads;
