import React from "react";
export default function JobDetailsModal({ job, onClose, onApply, appliedJobs }) {
  const app = appliedJobs.find(a => a.jobId === job.id);
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex">
      <div className="bg-white p-6 m-auto rounded w-96">
        <h2 className="text-xl font-bold">{job.title}</h2>
        <p className="mt-2">{job.description}</p>
        <p className="mt-4 text-sm text-gray-600">Location: {job.location}</p>
        <p className="text-sm text-gray-600">Pay: ₹{job.salary}/day</p>
        <p className="text-sm text-gray-600 mt-2">Posted by: {job.employerName}</p>

        <div className="mt-6 flex justify-end gap-2">
          {!app ? (
            <button onClick={() => onApply(job.id)} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">Apply</button>
          ) : (
            <span className="text-yellow-600">Status: {app.status}</span>
          )}
          <button onClick={onClose} className="px-3 py-1 border rounded">Close</button>
        </div>
      </div>
    </div>
  );
}
