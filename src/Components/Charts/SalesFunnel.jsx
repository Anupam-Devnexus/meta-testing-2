import React, { useState } from "react";

const defaultFunnelStages = [
  { name: "Leads", value: 500 },
  { name: "Contacted", value: 350 },
  { name: "Qualified", value: 200 },
  { name: "Proposals", value: 120 },
  { name: "Closed", value: 60 },
];

const SalesFunnel = ({ stages }) => {
  const maxValue = Math.max(...stages.map((stage) => stage.value));

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-full mx-auto">
      <div className="flex flex-col gap-2">
        {stages.map((stage, idx) => {
          const widthPercent = (stage.value / maxValue) * 100;
          return (
            <div key={idx} className="flex items-center gap-4">
              <span className="w-24 font-semibold">{stage.name}</span>
              <div className="flex-1 bg-gray-200 h-12 rounded-md relative">
                <div
                  className="bg-blue-500 h-12 rounded-md transition-all duration-500"
                  style={{ width: `${widthPercent}%` }}
                  title={`${stage.value} leads`}
                ></div>
                <span className="absolute right-2 top-2 text-white font-semibold">
                  {stage.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const FunnelCreator = () => {
  const [creating, setCreating] = useState(false);
  const [stages, setStages] = useState([]);
  const [stageName, setStageName] = useState("");
  const [stageValue, setStageValue] = useState("");
  const [showFunnel, setShowFunnel] = useState(false);

  const addStage = () => {
    if (stageName && stageValue) {
      setStages([...stages, { name: stageName, value: Number(stageValue) }]);
      setStageName("");
      setStageValue("");
    }
  };

  const handleSubmit = () => {
    if (stages.length > 0) {
      setShowFunnel(true);
    }
  };

  const handleSkip = () => {
    setStages(defaultFunnelStages);
    setShowFunnel(true);
  };

  return (
    <div className="p-6">
      {!creating && !showFunnel && (
        <button
          onClick={() => setCreating(true)}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
        >
          Create Sales Funnel
        </button>
      )}

      {creating && !showFunnel && (
        <div className="bg-gray-50 p-6 rounded-lg shadow-md space-y-4">
          <h2 className="text-xl font-bold">Add Funnel Stages</h2>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Stage Name"
              value={stageName}
              onChange={(e) => setStageName(e.target.value)}
              className="border p-2 rounded-md flex-1"
            />
            <input
              type="number"
              placeholder="Value"
              value={stageValue}
              onChange={(e) => setStageValue(e.target.value)}
              className="border p-2 rounded-md w-32"
            />
            <button
              onClick={addStage}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            >
              Add
            </button>
          </div>

          <ul className="list-disc pl-6">
            {stages.map((s, idx) => (
              <li key={idx} className="text-gray-700">
                {s.name} - {s.value}
              </li>
            ))}
          </ul>

          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Submit
            </button>
            <button
              onClick={handleSkip}
              className="px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
            >
              Skip
            </button>
          </div>
        </div>
      )}

      {showFunnel && <SalesFunnel stages={stages} />}
    </div>
  );
};

export default FunnelCreator;
