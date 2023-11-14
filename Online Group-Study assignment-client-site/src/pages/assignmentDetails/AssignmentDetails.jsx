
import axios from "axios";
import { useContext } from "react";
import { useLoaderData } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { context } from "../../components/Context/AuthContext";


const AssignmentDetails = () => {

    const assignmentInfo = useLoaderData();
    const { _id, title, imageURL, marks, difficultyLevel, dueDate, description, } = assignmentInfo;

    const { user } = useContext(context);

    const handleSubmission = (e) => {

        e.preventDefault();
        const form = new FormData(e.currentTarget);

        const PDFLink = form.get('PDFLink');
        const quickNote = form.get('quickNote');
        const submittedUser = user.email;
        const status = ('Pending');

        const data = {
            PDFLink,
            quickNote,
            submittedUser,
            status,
            assignmentInfo
        }

        // data create or post using axios
        axios.post('https://online-group-study-assignment-server-site.vercel.app/myAssignment', data, { withCredentials: true }, {
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                if (response.status === 200) {
                    toast('Assignment submitted successfully');
                } else {
                    throw new Error('Failed to add the user');
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    return (
        <div className="card card-side">
            <ToastContainer></ToastContainer>
            <figure>
                <img src={imageURL} alt="image" className="w-1/2" />
            </figure>
            <div className="card-body w-1/2">
                <h2 className="card-title font-bold">Title: {title}</h2>
                <h1 className="font-bold">Marks: {marks}</h1>
                <p className="font-bold">Difficulty Level: {difficultyLevel}</p>
                <p className="font-bold">Due Date: {dueDate}</p>
                <p>{description}</p>

                {/* open the modal using document.getElementById('ID').showModal() method */}
                <button className="btn bg-blue-400" onClick={() => document.getElementById(`my_modal_${_id}`).showModal()}>Take Assignment</button>
                <dialog id={`my_modal_${_id}`} className="modal">
                    <div className="modal-box">
                        <form method="dialog" className="card-body" onSubmit={handleSubmission}>
                            <h3 className="font-bold text-lg">Assignment Submission</h3>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">PDF Link</span>
                                </label>
                                <input type="text" placeholder="PDF Link" name='PDFLink' className="input input-bordered" />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Quick Note</span>
                                </label>
                                <input type="text" placeholder="Quick Note" name='quickNote' className="input input-bordered" />
                            </div>
                            <button className="btn btn-primary my-4" onClick={() => document.getElementById(`my_modal_${_id}`).close()}>Submit Assignment</button>
                            <p>Press Esc button to exit!!!</p>
                        </form>
                    </div>
                </dialog>
            </div>
        </div>
    )
}

export default AssignmentDetails