import { useState, useEffect } from "react";
import { createLead, getLead, updateLead } from "../api/leads";
import { useNavigate, useParams } from "react-router-dom";

export default function LeadForm() {
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", company: "",
    score: 0, leadValue: 0, status: "new", source: "website"
  });
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      getLead(id).then(res => setForm(res.data));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (id) await updateLead(id, form);
    else await createLead(form);
    navigate("/leads");
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-2">
      <input placeholder="First Name" value={form.firstName}
        onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
      <input placeholder="Last Name" value={form.lastName}
        onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
      <input placeholder="Email" value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input placeholder="Company" value={form.company}
        onChange={(e) => setForm({ ...form, company: e.target.value })} />
      <input type="number" placeholder="Score" value={form.score}
        onChange={(e) => setForm({ ...form, score: parseInt(e.target.value) })} />
      <input type="number" placeholder="Lead Value" value={form.leadValue}
        onChange={(e) => setForm({ ...form, leadValue: parseFloat(e.target.value )})} />
      <select value={form.status}
        onChange={(e) => setForm({ ...form, status: e.target.value })}>
        <option value="new">New</option>
        <option value="contacted">Contacted</option>
        <option value="qualified">Qualified</option>
        <option value="lost">Lost</option>
        <option value="won">Won</option>
      </select>
      <select value={form.source}
        onChange={(e) => setForm({ ...form, source: e.target.value })}>
        <option value="website">Website</option>
        <option value="facebook_ads">Facebook Ads</option>
        <option value="google_ads">Google Ads</option>
        <option value="referral">Referral</option>
        <option value="events">Events</option>
        <option value="other">Other</option>
      </select>
      <button type="submit" className="bg-green-500 text-white px-4 py-2">
        {id ? "Update Lead" : "Create Lead"}
      </button>
    </form>
  );
}
