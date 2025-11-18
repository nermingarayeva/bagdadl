import axios from "axios";
import { useEffect, useState } from "react";

const AdminComments = () => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    axios
      .get("http://localhost:5000/api/testimonials/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("Admin Commentlər:", res.data);
        setComments(res.data);
      })
      .catch((err) => console.log("Xəta:", err));
  }, []);

  const deleteComment = async (id) => {
    const token = localStorage.getItem("adminToken");

    try {
      await axios.delete(`http://localhost:5000/api/testimonials/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setComments(comments.filter((c) => c._id !== id));
    } catch (err) {
      console.log("Silinmə xətası:", err);
    }
  };

  const approveComment = async (id) => {
    const token = localStorage.getItem("adminToken");

    try {
      const res = await axios.put(
        `http://localhost:5000/api/testimonials/${id}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setComments(
        comments.map((c) => (c._id === id ? res.data : c))
      );
    } catch (err) {
      console.log("Təsdiqləmə xətası:", err);
    }
  };

  return (
    <div>
      <h1>Yorumlar</h1>

      {comments.length === 0 && <p>Heç bir rəy yoxdur.</p>}

      {comments.map((c) => (
        <div className="comment" key={c._id}>
          <p>
            <b>{c.email}</b>
            <span style={{ color: c.approved ? "green" : "red", marginLeft: 10 }}>
              {c.approved ? "✔ Təsdiqlənib" : "⏳ Gözləyir"}
            </span>
          </p>

          <p>{c.message}</p>

          {!c.approved && (
            <button onClick={() => approveComment(c._id)}>
              Təsdiqlə
            </button>
          )}

          <button onClick={() => deleteComment(c._id)} style={{ marginLeft: 10 }}>
            Sil
          </button>

          <hr />
        </div>
      ))}
    </div>
  );
};

export default AdminComments;
