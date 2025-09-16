import { useState } from "react";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const statusOptions = ["new", "in progress", "converted", "closed"];

const initialValues = {
  date: new Date().toISOString(),
  name: "",
  email: "",
  phone: "",
  city: "",
  budget: "",
  requirement: "",
  source: "",
  Campaign: "",
  status: "new",
  remarks1: "",
  remarks2: "",
  dynamicFields: [],
};

const validationSchema = Yup.object({
  name: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  phone: Yup.string().matches(/^[0-9]{10}$/, "Must be 10 digits").required("Required"),
  city: Yup.string().required("Required"),
  budget: Yup.number().typeError("Must be a number").required("Required"),
  requirement: Yup.string().required("Required"),
  source: Yup.string().required("Required"),
  Campaign: Yup.string().required("Required"),
  status: Yup.string().required("Required"),
});

export default function AddLeads() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [formToSubmit, setFormToSubmit] = useState(null);

  const token = localStorage.getItem("userDetails");
  const details = token ? JSON.parse(token).token : null;

  const handleFormSubmit = (values, { resetForm }) => {
    setFormToSubmit({ values, resetForm });
    setShowConfirm(true);
  };

  const confirmAndSubmit = async () => {
    if (!formToSubmit) return;

    const { values, resetForm } = formToSubmit;

    try {
      const response = await fetch(
        "https://dbbackend.devnexussolutions.com/auth/api/Add-leads",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${details}`,
          },
          body: JSON.stringify(values),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Lead submitted successfully!");
        resetForm();
        setFormToSubmit(null);
        setShowConfirm(false);
      } else {
        toast.error(data?.message || "Submission failed. Check console.");
      }
    } catch (error) {
      console.error("Submission Error:", error);
      toast.error("An error occurred during submission.");
    }
  };

  return (
    <section className="p-4 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Create Leads</h1>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleFormSubmit}
      >
        {({ isSubmitting, values }) => (
          <Form className="bg-white p-6 rounded-2xl shadow-xl space-y-6">
            {/* Static Fields */}
            <div className="grid sm:grid-cols-2 gap-5">
              {[
                { label: "Name", name: "name" },
                { label: "Email", name: "email", type: "email" },
                { label: "Phone", name: "phone" },
                { label: "City", name: "city" },
                { label: "Budget", name: "budget" },
                { label: "Requirement", name: "requirement" },
                { label: "Source", name: "source" },
                { label: "Campaign", name: "Campaign" },
                { label: "Remarks 1", name: "remarks1" },
                { label: "Remarks 2", name: "remarks2" },
              ].map(({ label, name, type = "text" }) => (
                <div key={name} className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
                  <Field
                    name={name}
                    type={type}
                    className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <ErrorMessage name={name} component="div" className="text-red-500 text-sm mt-1" />
                </div>
              ))}
            </div>

            {/* Status Dropdown */}
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Status</label>
              <Field
                as="select"
                name="status"
                className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white text-gray-800"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="status" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Dynamic Fields */}
            <FieldArray name="dynamicFields">
              {({ push, remove }) => (
                <div className="space-y-3">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-md font-semibold text-gray-800">Additional Fields</h3>
                    <button
                      type="button"
                      onClick={() => push({ label: "", value: "" })}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                    >
                      + Add Field
                    </button>
                  </div>

                  {values.dynamicFields.map((_, index) => (
                    <div key={index} className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 items-center">
                      <Field
                        name={`dynamicFields[${index}].label`}
                        placeholder="Label"
                        className="border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                      <Field
                        name={`dynamicFields[${index}].value`}
                        placeholder="Value"
                        className="border p-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-red-600 text-sm hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </FieldArray>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 font-semibold transition"
            >
              {isSubmitting ? "Submitting..." : "Submit Lead"}
            </button>
          </Form>
        )}
      </Formik>

      {/* Toast Notification */}
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md space-y-5 animate-slideIn">
            <h3 className="text-lg font-semibold text-gray-800">
              Do you want to add more fields before submitting?
            </h3>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition text-sm"
              >
                Yes, Add More
              </button>
              <button
                onClick={confirmAndSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
              >
                Confirm Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
