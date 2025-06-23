import { useState, useEffect } from "react";
import { getDoc } from "firebase/firestore";

import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import Navbar from "../components/Navbar";

export default function EmployerDashboard() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingJobId, setEditingJobId] = useState(null);
  const [editedJob, setEditedJob] = useState({});
  const [applicants, setApplicants] = useState({});

  const fetchJobs = async () => {
    const q = query(collection(db, "jobs"), where("postedBy", "==", auth.currentUser.uid));
    const querySnapshot = await getDocs(q);
    const jobsData = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setJobs(jobsData);
  };

  const fetchApplicants = async (jobId) => {
  const q = query(collection(db, "applications"), where("jobId", "==", jobId));
  const snapshot = await getDocs(q);
  const data = await Promise.all(
    snapshot.docs.map(async (docSnap) => {
      const appData = docSnap.data();
      const studentDoc = await getDoc(doc(db, "users", appData.studentId));
      const studentData = studentDoc.exists() ? studentDoc.data() : {};
      return {
        id: docSnap.id,
        ...appData,
        studentName: studentData.name || "Unknown",
        studentEmail: studentData.email || "N/A",
      };
    })
  );
  setApplicants((prev) => ({ ...prev, [jobId]: data }));
};


  useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged((user) => {
    if (user) {
      fetchJobs();
    }
  });

  return () => unsubscribe(); // cleanup
}, []);


  const handlePostJob = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "jobs"), {
        title,
        description,
        location,
        salary,
        postedBy: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      });

      setTitle("");
      setDescription("");
      setLocation("");
      setSalary("");

      alert("Job posted successfully!");
      fetchJobs();
    } catch (err) {
      alert("Failed to post job: " + err.message);
    }
    setLoading(false);
  };

  const handleDelete = async (jobId) => {
    await deleteDoc(doc(db, "jobs", jobId));
    fetchJobs();
  };

  const handleEdit = (job) => {
    setEditingJobId(job.id);
    setEditedJob({ ...job });
  };

  const handleSaveEdit = async (id) => {
    await updateDoc(doc(db, "jobs", id), editedJob);
    setEditingJobId(null);
    fetchJobs();
  };

  return (
    <>
      <Navbar />
      <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-600">Post a Job</h2>
        <form onSubmit={handlePostJob}>
          <input type="text" placeholder="Job Title" className="w-full p-3 mb-4 border rounded"
            value={title} onChange={(e) => setTitle(e.target.value)} required />
          <textarea placeholder="Job Description" className="w-full p-3 mb-4 border rounded"
            value={description} onChange={(e) => setDescription(e.target.value)} required />
          <input type="text" placeholder="Location" className="w-full p-3 mb-4 border rounded"
            value={location} onChange={(e) => setLocation(e.target.value)} required />
          <input type="text" placeholder="Salary" className="w-full p-3 mb-4 border rounded"
            value={salary} onChange={(e) => setSalary(e.target.value)} required />
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700" disabled={loading}>
            {loading ? "Posting..." : "Post Job"}
          </button>
        </form>
      </div>

      {/* Job Listings */}
      <div className="max-w-3xl mx-auto mt-8 bg-white p-6 rounded shadow-md">
        <h3 className="text-xl font-semibold mb-4">Your Posted Jobs</h3>
        {jobs.length === 0 ? (
          <p className="text-gray-500">No jobs posted yet.</p>
        ) : (
          <ul className="space-y-4">
            {jobs.map((job) => (
              <li key={job.id} className="p-4 border rounded shadow-sm">
                {editingJobId === job.id ? (
                  <>
                    <input className="w-full mb-2 border p-2 rounded"
                      value={editedJob.title} onChange={(e) => setEditedJob({ ...editedJob, title: e.target.value })} />
                    <textarea className="w-full mb-2 border p-2 rounded"
                      value={editedJob.description} onChange={(e) => setEditedJob({ ...editedJob, description: e.target.value })} />
                    <input className="w-full mb-2 border p-2 rounded"
                      value={editedJob.location} onChange={(e) => setEditedJob({ ...editedJob, location: e.target.value })} />
                    <input className="w-full mb-2 border p-2 rounded"
                      value={editedJob.salary} onChange={(e) => setEditedJob({ ...editedJob, salary: e.target.value })} />
                    <button onClick={() => handleSaveEdit(job.id)} className="bg-green-600 text-white px-4 py-1 rounded">Save</button>
                  </>
                ) : (
                  <>
                    <h4 className="text-lg font-bold">{job.title}</h4>
                    <p>{job.description}</p>
                    <p className="text-sm text-gray-600">📍 {job.location} | 💰 {job.salary}</p>
                    <div className="flex gap-3 mt-3">
                      <button onClick={() => fetchApplicants(job.id)} className="text-sm text-white bg-blue-500 px-3 py-1 rounded hover:bg-blue-600">
                        Applicants
                      </button>
                      <button onClick={() => handleEdit(job)} className="text-sm text-yellow-700 border border-yellow-600 px-3 py-1 rounded hover:bg-yellow-100">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(job.id)} className="text-sm text-red-600 border border-red-500 px-3 py-1 rounded hover:bg-red-100">
                        Delete
                      </button>
                    </div>

                    {applicants[job.id] && (
  <div className="mt-3 text-sm bg-gray-50 p-3 border rounded">
    <strong className="text-base">Applicants:</strong>
    {applicants[job.id].length === 0 ? (
      <p className="text-gray-600">No applications yet.</p>
    ) : (
      <ul className="divide-y mt-2">
        {applicants[job.id].map((app, index) => (
          <li key={index} className="py-2 flex justify-between items-center">
            <div>
              <p className="font-medium">{app.studentName || "Unknown"}</p>
              <p className="text-xs text-gray-600">{app.studentEmail || "N/A"}</p>
              <p className="text-xs text-gray-500">Status: {app.status}</p>
            </div>
            <select
              value={app.status}
              onChange={async (e) => {
                const newStatus = e.target.value;
                try {
                  await updateDoc(doc(db, "applications", app.id), {
                    status: newStatus,
                  });

                  setApplicants((prev) => ({
                    ...prev,
                    [job.id]: prev[job.id].map((a, i) =>
                      i === index ? { ...a, status: newStatus } : a
                    ),
                  }));
                } catch (err) {
                  alert("Failed to update status");
                }
              }}
              className="border text-sm rounded px-2 py-1"
            >
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
            </select>
          </li>
        ))}
      </ul>
    )}
  </div>
)}

                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
