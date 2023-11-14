import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AiFillDelete } from 'react-icons/ai';
import { ToastContainer, toast } from "react-toastify";
import { context } from "../../components/Context/AuthContext";

const Assignments = () => {
  
  const { user } = useContext(context);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [difficultyLevel, setDifficultyLevel] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12); // Number of items to display per page

  useEffect(() => {
    const apiUrl =
      difficultyLevel === "all"
        ? "https://online-group-study-assignment-server-site.vercel.app/assignment"
        : `https://online-group-study-assignment-server-site.vercel.app/assignment?difficulty=${difficultyLevel}`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, [difficultyLevel]);

  const handleFilterChange = (event) => {
    const filter = event.target.value;
    setDifficultyLevel(filter);
    setCurrentPage(1); // Reset to the first page when changing the filter
  };

  // handle delete
  const handleDelete = (assignmentId) => {

    const assignment = data.find((item) => item._id === assignmentId);
    if (user.email === assignment.manageCreator) {
      
      fetch(`https://online-group-study-assignment-server-site.vercel.app/assignment/${assignmentId}`, {
        method: 'DELETE',
      })
        .then((deleteResponse) => {
          if (deleteResponse.ok) {
            const updatedData = data.filter((item) => item._id !== assignmentId);
            setData(updatedData);
            toast('Assignment Deleted');
          } else {
            toast('Error deleting assignment');
          }
        })
        .catch((deleteError) => {
          console.error('Error deleting assignment:', deleteError);
          toast('Error deleting assignment');
        });
    } else {
      toast('Permission denied: You are not the creator of this assignment.');
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="m-4">
      <ToastContainer />
      <label htmlFor="difficultyLevel" className="text-2xl font-semibold mr-4">
        Filter by Difficulty:
      </label>
      <select
        id="difficultyLevel"
        name="difficultyLevel"
        value={difficultyLevel}
        onChange={handleFilterChange}
      >
        <option value="all">All</option>
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </select>

      {loading ? (
        <p>Loading...</p>
      ) : data.length > 0 ? (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
            {currentItems.map((item) => (
              <div key={item._id}>
                <div className="card w-86 bg-base-100 shadow-xl">
                  {user && (
                    <div
                      className="cursor-pointer m-4 text-2xl w-3"
                      onClick={() => handleDelete(item._id)}
                    >
                      <AiFillDelete />
                    </div>
                  )}
                  <figure className="px-10 pt-10">
                    <img src={item.thumbnail} alt="Image Url" className="rounded-xl" />
                  </figure>
                  <div className="card-body items-center text-center">
                    <h2 className="card-title">Title: {item.title}</h2>
                    <p>Marks: {item.marks}</p>
                    <p>Difficulty: {item.difficultyLevel}</p>
                    <p>
                      Description:{" "}
                      {item.description.length > 50
                        ? `${item.description.slice(0, 30)}...`
                        : item.description}
                    </p>
                    <p>Due Date: {item.dueDate}</p>
                    <div className="flex justify-between">
                      <div className="card-actions">
                        <Link to={`/assignmentDetails/${item._id}`}>
                          <button className="btn bg-blue-400">Details</button>
                        </Link>
                      </div>
                      <div className="card-actions">
                        <Link to={`/updateAssignment/${item._id}`}>
                          <button className="btn bg-blue-400">Update</button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="join flex justify-center">
            {data.length > itemsPerPage && (
              <ul className="pagination">
                {Array(Math.ceil(data.length / itemsPerPage))
                  .fill()
                  .map((_, index) => (
                    <li
                      key={index}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`join-item btn ${currentPage === index + 1 ? "btn-active" : ""
                        }`}
                    >
                      {index + 1}
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </div>
      ) : (
        <p>No assignments found for the selected difficulty level.</p>
      )}
    </div>
  );
};

export default Assignments;
