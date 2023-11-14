import axios from "axios";
import { useContext, useState } from "react";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { ToastContainer, toast } from "react-toastify";
import { context } from "../../components/Context/AuthContext";


const CreateAssignment = () => {

  const { user } = useContext(context);
  const [dueDate, setDueDate] = useState(null);


  const handleFormSubmit = (e) => {
    e.preventDefault();

    const form = new FormData(e.currentTarget);

    const title = form.get('title');
    const description = form.get('description');
    const marks = form.get('marks');
    const imageURL = form.get('imageURL');
    const difficultyLevel = form.get('difficultyLevel');
    const manageCreator = user.email;

    const data = { title, description, marks, imageURL, difficultyLevel, dueDate, manageCreator }

    // data create or post using axios
    axios.post('https://online-group-study-assignment-server-site.vercel.app/assignment', data, { withCredentials: true }, {
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then((response) => {
        if (response.status === 200) {
          toast('Assignment created successfully');
        } else {
          throw new Error('Failed to add the user');
        }
      })
      .catch((error) => {
        console.error(error);
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
          <input type="text" placeholder="Title" name='title' className="input input-bordered" required />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Description:</span>
          </label>
          <textarea type="text" placeholder="Description" name='description' className="input input-bordered" required />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">Marks:</span>
          </label>
          <input type="text" placeholder="Marks" name='marks' className="input input-bordered" required />
        </div>
        <div className="form-control">
          <label className="label">
            <span className="label-text">imageURL Image URL:</span>
          </label>
          <input type="text" placeholder="imageURL Image URL" name='imageURL' className="input input-bordered" required />
        </div>
        <div >
          <label className="mr-4" >Difficulty Level:</label>
          <select name="difficultyLevel" >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
        <div >
          <label className="mr-4" >Due Date:</label>
          <DatePicker selected={dueDate} onChange={(date) => setDueDate(date)} className="input input-bordered" />
        </div>
        <div className="flex items-center justify-center m-4">
          <button className="btn w-full" type="submit">Create Assignment</button>
        </div>
      </form>
    </div>
  )
}

export default CreateAssignment