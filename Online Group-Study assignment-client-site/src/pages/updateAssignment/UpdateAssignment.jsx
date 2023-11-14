import { useLoaderData } from "react-router-dom";
import DatePicker from 'react-datepicker';
import { ToastContainer, toast } from "react-toastify";
import { useState } from "react";

const UpdateAssignment = () => {

    const assignmentInfo = useLoaderData();
    const { _id, imageURL, title, marks, description } = assignmentInfo;

    const [dueDate, setDueDate] = useState(null);

    const handleFormSubmit = (e) => {
        e.preventDefault();

        const form = new FormData(e.currentTarget);

        const title = form.get('title');
        const description = form.get('description');
        const marks = form.get('marks');
        const imageURL = form.get('imageURL');
        const difficultyLevel = form.get('difficultyLevel');

        const updateData = {
            title,
            description,
            marks,
            imageURL,
            difficultyLevel,
            dueDate,
        };

        const apiUrl = `https://online-group-study-assignment-server-site.vercel.app/assignment/${_id}`;

        fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData),
            credentials: 'include',
        })
            .then((response) => {
                if (response.ok) {
                    toast('Assignment updated successfully');
                } else {
                    toast('Failed to update Assignment');
                }
            })
            .catch((error) => {
                console.log(error);
                toast('Error updating data:', error);
            });
    };

    return (
        <div>
            <ToastContainer></ToastContainer>
            <form className="card-body" onSubmit={handleFormSubmit}>
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Title:</span>
                    </label>
                    <input type="text" defaultValue={title} name='title' className="input input-bordered" required />
                </div>
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Description:</span>
                    </label>
                    <textarea type="text" defaultValue={description} name='description' className="input input-bordered" required />
                </div>
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Marks:</span>
                    </label>
                    <input type="text" defaultValue={marks} name='marks' className="input input-bordered" required />
                </div>
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Image URL:</span>
                    </label>
                    <input type="text" defaultValue={imageURL} name='imageURL' className="input input-bordered" required />
                </div>
                <div>
                    <label className="mr-4">Difficulty Level:</label>
                    <select name="difficultyLevel">
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>
                </div>
                <div>
                    <label className="mr-4">Due Date:</label>
                    <DatePicker selected={dueDate} onChange={(date) => setDueDate(date)} className="input input-bordered" />
                </div>
                <div className="flex items-center justify-center m-4">
                    <button className="btn w-full" type="submit">Update Assignment</button>
                </div>
            </form>
        </div>
    );
}

export default UpdateAssignment;
