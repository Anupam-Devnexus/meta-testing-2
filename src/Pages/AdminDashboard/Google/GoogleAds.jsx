import { useEffect } from "react";
import useMetaLeads from "../../../Zustand/MetaLeadsGet";
import metainsights from "../../../Zustand/MetaIns";
import useNewMetaLeads from "../../../Zustand/NewMetaLeads";
import DynamicDataTable from "../../../Components/Tables/DynamicDataTable";

export default function GoogleAds() {
  const { metaleads, fetchMetaLeads } = useMetaLeads();
  const { fetchinsights } = metainsights();
  const { fetchNewMeta } = useNewMetaLeads();

  useEffect(() => {
    fetchMetaLeads();
    fetchinsights();
    fetchNewMeta();
  }, []);
  console.log(metaleads)

  // Extract leads array dynamically
  const leadsData = metaleads?.leads || [];

  return (
    <section className="w-full bg-gray-50 min-h-screen p-4">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">
        Google Ads Leads
      </h1>

      {leadsData.length === 0 ? (
        <p className="text-gray-500">No leads found.</p>
      ) : (
        <DynamicDataTable apiData={leadsData} />
      )}
    </section>
  );
}
