import { useEffect, useState } from "react";
import { getLeads, deleteLead } from "../api/leads";
import { Link } from "react-router-dom";

export default function LeadsList() {
  const [leads, setLeads] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchLeads = async (p = 1) => {
    const res = await getLeads({ page: p, limit: 10 });
    setLeads(res.data.data);
    setPage(res.data.page);
    setTotalPages(res.data.totalPages);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleDelete = async (id) => {
    await deleteLead(id);
    fetchLeads(page);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl mb-2">Leads</h2>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Email</th>
            <th>Company</th>
            <th>Status</th>
            <th>Score</th>
            <th>Value</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id}>
              <td>{lead.email}</td>
              <td>{lead.company}</td>
              <td>{lead.status}</td>
              <td>{lead.score}</td>
              <td>{lead.leadValue}</td>
              <td className="flex gap-2">
                {/* ✅ Edit Button */}
                <Link
                  to={`/leads/${lead.id}/edit`}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  Edit
                </Link>

                {/* ✅ Delete Button */}
                <button
                  onClick={() => handleDelete(lead.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-2 flex gap-2">
        <button disabled={page <= 1} onClick={() => fetchLeads(page - 1)}>
          Prev
        </button>
        <span>
          Page {page} / {totalPages}
        </span>
        <button disabled={page >= totalPages} onClick={() => fetchLeads(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}
