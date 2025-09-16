export default function StatCard({ icon: Icon, title, value, bgColor = "bg-white", onClick }) {
  return (
    <div
    onClick={onClick}
      className={`flex flex-col items-center justify-center rounded-lg shadow-lg p-6 w-64 h-40 ${bgColor} transition-transform hover:scale-105 cursor-pointer`}
    >
      {Icon && <Icon className="text-5xl text-indigo-600 mb-3" />}
      <h3 className="text-gray-500 uppercase tracking-wide font-semibold">{title}</h3>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}
