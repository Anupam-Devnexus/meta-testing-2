import data from "./Datastore/Allusers.json";

export default function AlluserTable() {
  return (
    <div className="min-h-screen bg-[var(--bg-color)] p-2">
      <div className="max-w-8xl mx-auto bg-white rounded-xl shadow-md p-6">


        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead className="bg-[var(--primary-color)] text-white">
              <tr>
                <th className="py-2 px-4 text-left">#</th>
                <th className="py-2 px-4 text-left">Name</th>
                <th className="py-2 px-4 text-left">Username</th>
                <th className="py-2 px-4 text-left">Role</th>

                <th className="py-2 px-4 text-left">Email</th>
                <th className="py-2 px-4 text-left">Password</th>
                <th className="py-2 px-4 text-left">Action</th>

              </tr>
            </thead>
            <tbody>
              {data.map((user, index) => (
                <tr
                  key={index}
                  className={`border-b hover:bg-[var(--bg-color)] transition`}
                >
                  <td className="py-2 px-4">{index + 1}</td>
                  <td className="py-2 px-4">{user.name}</td>
                  <td className="py-2 px-4">{user.username}</td>
                  <td className="py-2 px-4">{user.role}</td>

                  <td className="py-2 px-4">{user.email}</td>
                  <td className="py-2 px-4">{user.password}</td>
                  <td className="py-2 px-4">Edit Delete</td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
