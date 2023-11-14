import { useContext } from 'react';
import { context } from '../../components/Context/AuthContext';
import { useEffect } from 'react';
import { useState } from 'react';

const MyAssignments = () => {

  const { user } = useContext(context);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const apiUrl = `https://online-group-study-assignment-server-site.vercel.app/mySubmittedAssignment?submittedUser=${user.email}`;

  useEffect(() => {
    fetch(apiUrl, { credentials: 'include' })
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, [apiUrl, user]);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto m-12">
          <table className="table">
            <thead>
              <tr>
                <th>Index</th>
                <th>Assignment Title</th>
                <th>Assignment Status</th>
                <th>Assignment Marks</th>
                <th>My Obtain Marks</th>
                <th>Feedback</th>
              </tr>
            </thead>
            <tbody>
              {data.map((assignment, index) => (
                <tr key={assignment._id}>
                  <th>{index + 1}</th>
                  <td>{assignment.assignmentInfo.title}</td>
                  <td>{assignment.status}</td>
                  <td>{assignment.assignmentInfo.marks}</td>
                  <td>{assignment.givenMarks}</td>
                  <td>{assignment.quickNote}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyAssignments;
