import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from 'axios';

const SubmittedAssignments = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const apiUrl = "https://online-group-study-assignment-server-site.vercel.app/allSubmittedAssignment?status=Pending";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl, { withCredentials: true });
        const data = await response.json();
        setData(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error("Error fetching data", error);
      }
    };
    fetchData();
  }, []); // Empty dependency array for initial fetching

  const handleSubmission = async (e, _id) => {
    e.preventDefault();

    try {
      const form = new FormData(e.currentTarget);
      const givenMarks = form.get("givenMarks");
      const quickNote = form.get("quickNote");
      const status = "Complete";

      const updatedData = {
        givenMarks,
        quickNote,
        status,
      };

      const response = await axios.put(`https://online-group-study-assignment-server-site.vercel.app/myAssignment/${_id}`, updatedData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        toast("Data updated successfully");
        const updatedData = data.filter((item) => item._id !== _id);
        setData(updatedData);
      } else {
        toast("Failed to update the data");
      }
    } catch (error) {
      toast.error("Error updating data");
    }
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto m-12">
          <ToastContainer />
          <table className="table">
            <thead>
              <tr>
                <th>Index</th>
                <th>Assignment Title</th>
                <th>User</th>
                <th>Assignment Status</th>
                <th>Assignment Marks</th>
                <th>Obtained Marks</th>
                <th>Feedback</th>
              </tr>
            </thead>
            <tbody>
              {data.map((assignment, index) => (
                <tr key={assignment._id}>
                  <th>{index + 1}</th>
                  <td>{assignment.assignmentInfo.title}</td>
                  <td>{assignment.submittedUser}</td>
                  <td>{assignment.status}</td>
                  <td>{assignment.assignmentInfo.marks}</td>
                  <td>{assignment.assignmentInfo?.givenMarks}</td>
                  <td>
                    <button
                      className="btn bg-blue-400"
                      onClick={() => document.getElementById(`my_modal_${assignment._id}`).showModal()}
                    >
                      Give Marks
                    </button>
                    <dialog id={`my_modal_${assignment._id}`} className="modal">
                      <div className="modal-box">
                        <form method="dialog" className="card-body" onSubmit={(e) => handleSubmission(e, assignment._id)}>
                          <h3 className="font-bold text-lg">Assignment ID: {assignment._id}</h3>
                          <h3 className="font-semibold text-lg">Assignment PDF Link: {assignment.PDFLink}</h3>
                          <h3 className="font-semibold text-lg">Assignment Marks: {assignment.assignmentInfo.marks}</h3>
                          <div className="form-control">
                            <label className="label">
                              <span className="label-text">Given Marks</span>
                            </label>
                            <input type="text" placeholder="Given Marks" name="givenMarks" className="input input-bordered" />
                          </div>
                          <div className="form-control">
                            <label className="label">
                              <span className="label-text">Quick Note</span>
                            </label>
                            <input type="text" placeholder="Quick Note" name="quickNote" className="input input-bordered" />
                          </div>
                          <button
                            className="btn btn-primary my-4"
                            onClick={() => document.getElementById(`my_modal_${assignment._id}`).close()}
                          >
                            Submit
                          </button>
                          <p>Press <span className="btn">Esc</span> button to exit!!!</p>
                        </form>
                      </div>
                    </dialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SubmittedAssignments;
