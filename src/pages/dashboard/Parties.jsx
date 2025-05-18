import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "../../utils/api";
import "../../styles/Parties.css";

export default function Parties() {
  const { yearId } = useParams();
  const [parties, setParties] = useState([]);
  const [newParty, setNewParty] = useState("");
  const [editingPartyId, setEditingPartyId] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const fetchParties = async () => {
    try {
      const res = await api.get(`/parties/${yearId}`);
      setParties(res.data);
    } catch (err) {
      console.error("Error fetching parties:", err);
    }
  };

  useEffect(() => {
    fetchParties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yearId]);

  const addParty = async () => {
    if (!newParty.trim()) return;
    try {
      await api.post("/parties", { name: newParty, financialYearId: yearId });
      setNewParty("");
      setShowModal(false);
      fetchParties();
    } catch (err) {
      console.error("Error adding party:", err);
    }
  };

  const updateParty = async (id) => {
    try {
      await api.put(`/parties/${id}`, { name: editedName });
      setEditingPartyId(null);
      fetchParties();
    } catch (err) {
      console.error("Error updating party:", err);
    }
  };

  const deleteParty = async (id) => {
    try {
      await api.delete(`/parties/${id}`);
      fetchParties();
    } catch (err) {
      console.error("Error deleting party:", err);
    }
  };

  return (
    <div className="parties-container">
      <div className="header-container">
        <Link to="/dashboard" className="back-button">
          ← Back to Financial Years
        </Link>
        <button className="add-party-btn" onClick={() => setShowModal(true)}>
          + Add Party
        </button>
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add New Party</h3>
            <input
              type="text"
              placeholder="Enter party name"
              value={newParty}
              onChange={(e) => setNewParty(e.target.value)}
            />
            <div className="modal-actions">
              <button className="create-btn" onClick={addParty}>
                Create
              </button>
              <button
                className="cancel-btn"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="party-list-grid">
        {parties.length === 0 ? (
          <p className="no-party-msg">No parties found.</p>
        ) : (
          parties.map((party) => (
            <div key={party._id} className="party-card">
              {editingPartyId === party._id ? (
                <>
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                  />
                  <div className="card-actions">
                    <button
                      className="edit-btn"
                      onClick={() => updateParty(party._id)}
                    >
                      Save
                    </button>
                    <button
                      className="cancel-btn"
                      onClick={() => setEditingPartyId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h4>{party.name}</h4>
                  <div className="card-actions">
                    <button
                      className="edit-btn"
                      onClick={() => {
                        setEditingPartyId(party._id);
                        setEditedName(party.name);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => deleteParty(party._id)}
                    >
                      Delete
                    </button>
                    <button
                      className="open-btn"
                      onClick={() =>
                        navigate(`/dashboard/${yearId}/parties/${party._id}`)
                      }
                    >
                      Open
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
