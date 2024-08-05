import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./Header";

export default function Dashboard() {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [mark, setMark] = useState("");
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editid, setEditid] = useState(-1);
  const [showModal, setShowModal] = useState(false);
  const apiUrl = "http://localhost:8000/auth";

  //Edit
  const [editTitle, setEditTitle] = useState("");
  const [editSubject, setEditSubject] = useState("");
  const [editMark, setEditMark] = useState("");

  const handelSubmit = async () => {
    setError("");
    if (title.trim() !== "" && subject.trim() !== "" && mark.trim() !== "") {
      try {
        const response = await fetch(apiUrl + "/lists");
        const data = await response.json();

        // Find if there is already a record with the same title and subject
        const existingRecord = data.find(
          (item) => item.title === title && item.subject === subject
        );

        if (existingRecord) {
          // If a record is found, update it
          const updatedMark = parseInt(existingRecord.mark) + parseInt(mark);
          const updateResponse = await fetch(
            apiUrl + "/lists/" + existingRecord._id,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ ...existingRecord, mark: updatedMark }),
            }
          );
          if (updateResponse.ok) {
            // Update local state
            setTodos((prevTodos) =>
              prevTodos.map((item) =>
                item._id === existingRecord._id
                  ? { ...item, mark: updatedMark }
                  : item
              )
            );
            setMessage("List updated successfully");
            setTimeout(() => {
              setMessage("");
            }, 3000);
          } else {
            throw new Error("Unable to update list");
          }
        } else {
          // If no record is found, create a new one
          const createResponse = await fetch(apiUrl + "/lists", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ title, subject, mark }),
          });
          if (createResponse.ok) {
            const newItem = await createResponse.json();
            setTodos((prevTodos) => [...prevTodos, newItem]);
            setMessage("List added successfully");
            setTimeout(() => {
              setMessage("");
            }, 3000);
          } else {
            throw new Error("Unable to create list");
          }
        }
        setTitle("");
        setSubject("");
        setMark("");
        setShowModal(false);
      } catch (error) {
        setError(error.message || "An error occurred");
      }
    } else {
      setError("All fields are required");
    }
  };

  useEffect(() => {
    getItems();
  }, []);

  const getItems = () => {
    fetch(apiUrl + "/lists")
      .then((res) => res.json())
      .then((res) => {
        setTodos(res);
      });
  };

  const handelEdit = (item) => {
    setEditid(item._id);
    setEditTitle(item.title);
    setEditSubject(item.subject);
    setEditMark(item.mark);
  };

  const handelUpdate = () => {
    setError("");
    fetch(apiUrl + "/lists/" + editid, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: editTitle,
        subject: editSubject,
        mark: editMark,
      }),
    })
      .then((res) => {
        if (res.ok) {
          const updatedTodos = todos.map((item) => {
            if (item._id === editid) {
              item.title = editTitle;
              item.subject = editSubject;
              item.mark = editMark;
            }
            return item;
          });
          setTodos(updatedTodos);
          setEditTitle("");
          setEditSubject("");
          setEditMark("");
          setMessage("List updated successfully");
          setTimeout(() => {
            setMessage("");
          }, 3000);
          setEditid(-1);
        } else {
          setError("Unable to create list");
        }
      })
      .catch(() => {
        setError("Unable to create list");
      });
  };

  const handelEditCancel = () => {
    setEditid(-1);
  };

  const handelDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this list!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // User confirmed deletion
        fetch(apiUrl + "/lists/" + id, {
          method: "DELETE",
        })
          .then(() => {
            const updatedTodos = todos.filter((item) => item._id !== id);
            setTodos(updatedTodos);
            Swal.fire("Deleted!", "Your List has been deleted.", "success");
            setMessage("Your List has been deleted");
            setTimeout(() => {
              setMessage("");
            }, 3000);
          })
          .catch((error) => {
            Swal.fire("Error!", "Failed to delete list.", "error");
            console.error("Error deleting item:", error);
          });
      }
    });
  };

  return (
    <>
      <div>
        <Header />
        <div className="row p-3 bg-success text-light">
          <h1>Teacher Portal Project With MERN stack</h1>
        </div>
        <div className="container mb-3 mt-3">
          {message && <p className="text-success">{message}</p>}
          {error && <p className="text-danger">{error}</p>}
          <Button variant="dark" onClick={() => setShowModal(true)}>
            Add
          </Button>
        </div>

        {/* Modal for adding new item */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Add New List</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter name"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Subject</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Mark</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Mark"
                  value={mark}
                  onChange={(e) => setMark(e.target.value)}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button variant="dark" onClick={handelSubmit}>
              Add
            </Button>
          </Modal.Footer>
        </Modal>
        <div className="container mt-3">
          {/* <h1>Tasks</h1> */}
          <table className="table">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Subject</th>
                <th>Mark</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {todos.map((item) => (
                <tr key={item._id}>
                  <td>
                    {editid === -1 || editid !== item._id ? (
                      item.title
                    ) : (
                      <input
                        placeholder="Title"
                        onChange={(e) => setEditTitle(e.target.value)}
                        value={editTitle}
                        className="form-control"
                        type="text"
                      />
                    )}
                  </td>
                  <td>
                    {editid === -1 || editid !== item._id ? (
                      item.subject
                    ) : (
                      <input
                        placeholder="Subject"
                        onChange={(e) => setEditSubject(e.target.value)}
                        value={editSubject}
                        className="form-control"
                        type="text"
                      />
                    )}
                  </td>
                  <td>
                    {editid === -1 || editid !== item._id ? (
                      item.mark
                    ) : (
                      <input
                        placeholder="Mark"
                        onChange={(e) => setEditMark(e.target.value)}
                        value={editMark}
                        className="form-control"
                        type="text"
                      />
                    )}
                  </td>
                  <td>
                    {editid === -1 || editid !== item._id ? (
                      <>
                        <button
                          className="btn btn-warning me-2"
                          onClick={() => handelEdit(item)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handelDelete(item._id)}
                        >
                          Delete
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="btn btn-success me-2"
                          onClick={handelUpdate}
                        >
                          Update
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={handelEditCancel}
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
