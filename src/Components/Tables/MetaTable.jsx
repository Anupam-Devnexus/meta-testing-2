import data from "../../Datastore/MetaData.json";

export default function MetaTable() {
  const leads = data.leads;

  return (
    <div className=" min-h-screen">
      
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="px-4 py-3">Full Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">City</th>
              <th className="px-4 py-3">Firm Type</th>
              <th className="px-4 py-3">Promoted?</th>
              <th className="px-4 py-3">Challenge</th>
              <th className="px-4 py-3">Budget</th>
              <th className="px-4 py-3">Created At</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {leads.map((lead) => (
              <tr
                key={lead._id}
                className="hover:bg-gray-50 transition duration-200"
              >
                <td className="px-4 py-2">{lead.AllFields.full_name}</td>
                <td className="px-4 py-2">{lead.AllFields.email}</td>
                <td className="px-4 py-2">{lead.AllFields.phone_number}</td>
                <td className="px-4 py-2">{lead.AllFields.city}</td>
                <td className="px-4 py-2">
                  {lead.AllFields["are_you_an_individual_ca_or_part_of_a_firm?"]
                    ?.replace(/_/g, " ")
                    .replace(/-/g, "–")}
                </td>
                <td className="px-4 py-2">
                  {lead.AllFields["have_you_already_promoted_your_services_online?"]
                    ?.replace(/_/g, " ")}
                </td>
                <td className="px-4 py-2">
                  {lead.AllFields["what’s_your_biggest_current_challenge?"]
                    ?.replace(/_/g, " ")}
                </td>
                <td className="px-4 py-2">
                  {lead.AllFields["what_is_your_monthly_marketing_budget?"]
                    ?.replace(/_/g, " ")}
                </td>
                <td className="px-4 py-2">
                  {new Date(lead.created_at).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
