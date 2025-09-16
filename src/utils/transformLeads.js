export function transformLeads(apiResponse) {
  if (!apiResponse?.leads) return [];

  return apiResponse.leads.map((lead) => {
    const flatFields = {};
    lead.field_data.forEach((f) => {
      flatFields[f.name] = f.values?.[0] || "";
    });

    return {
      _id: lead._id,
      status: lead.status,
      leadgen_id: lead.leadgen_id,
      form_id: lead.form_id,
      page_id: lead.page_id,
      campaign_name: lead.campaign_name,
      created_time: lead.created_time,
      createdAt: lead.createdAt,
      updatedAt: lead.updatedAt,
      ...flatFields,
    };
  });
}
