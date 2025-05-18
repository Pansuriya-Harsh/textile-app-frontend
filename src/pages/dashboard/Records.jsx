import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RecordModal from "../../components/RecordModal";
import api from "../../utils/api";
import "../../styles/Records.css";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.vfs;

export default function Records() {
  const { yearId, partyId } = useParams();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [records, setRecords] = useState([]);
  const [partyName, setPartyName] = useState("");
  const [filters, setFilters] = useState({
    designNumber: "",
    startDate: "",
    endDate: "",
  });

  const fetchRecords = async () => {
    try {
      const res = await api.get(`/records/party/${partyId}`);
      setRecords(res.data);
    } catch (err) {
      console.error("Error fetching records:", err);
    }
  };

  const fetchPartyName = async () => {
    try {
      const res = await api.get(`/parties/party/${partyId}`);
      setPartyName(res.data.name);
    } catch (err) {
      console.error("Failed to fetch party name:", err);
    }
  };

  const addRecord = async (newRecord) => {
    try {
      await api.post(
        "/records",
        { ...newRecord, partyId },
        { headers: { "Content-Type": "application/json" } }
      );
      setShowModal(false);
      fetchRecords();
    } catch (err) {
      console.error("Error adding record:", err);
      alert("Failed to add record.");
    }
  };

  useEffect(() => {
    fetchRecords();
    fetchPartyName();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partyId]);

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleEmptyValue = (inp) => {
    if (inp) {
      return inp;
    } else {
      return "-";
    }
  };

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [viewMode, setViewMode] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const handleView = (record) => {
    setSelectedRecord(record);
    setViewMode(true);
  };

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setEditMode(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await api.delete(`/records/${id}`);
        fetchRecords();
      } catch (err) {
        console.error("Error deleting record:", err);
      }
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredRecords = records.filter((rec) => {
    const matchDesign =
      !filters.designNumber ||
      rec.designNumber
        .toLowerCase()
        .includes(filters.designNumber.toLowerCase());
    const recDate = new Date(rec.outwardDate);
    const matchStart =
      !filters.startDate || recDate >= new Date(filters.startDate);
    const matchEnd = !filters.endDate || recDate <= new Date(filters.endDate);
    return matchDesign && matchStart && matchEnd;
  });

  const exportToPDF = () => {
    const tableBody = [
      [
        "Lot No",
        "Challan No",
        "Outward Date",
        "Design No",
        "Design Type",
        "Quantity",
        "Qty Type",
        "Rate",
        "Amount",
        "Bill No",
        "Party",
        "Firm",
      ],
      ...filteredRecords.map((rec) => [
        rec.lotNumber,
        rec.challanNumber,
        formatDate(rec.outwardDate),
        rec.designNumber,
        rec.designDetail,
        rec.quantity,
        rec.quantityType,
        rec.rate,
        rec.amount,
        rec.billNumber,
        rec.billName,
        rec.firm,
      ]),
    ];

    const docDefinition = {
      pageSize: "A4",
      pageMargins: [10, 20, 10, 20],
      content: [
        { text: `${partyName}`, style: "header", alignment: "center" },
        {
          table: {
            headerRows: 1,
            body: tableBody,
            widths: [
              30,
              40,
              50,
              40,
              50,
              30,
              40,
              30,
              40,
              30,
              50,
              30,
            ],
          },
          fontSize: 7,
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
        },
      },
    };

    pdfMake.createPdf(docDefinition).download(`${partyName}_Records.pdf`);
  };

  return (
    <div className="records-dashboard">
      {/* Top Header */}
      <div className="records-header">
        <div className="header-left">
          <h2>{partyName}</h2>
        </div>
        <div className="header-actions">
          <button
            onClick={() => navigate(`/dashboard/financial-year/${yearId}`)}
            className="btn-back"
          >
            ← Back
          </button>
          <button onClick={() => setShowModal(true)} className="btn-primary">
            + Add Record
          </button>
        </div>
      </div>

      <div className="search-container">
        <h3 className="search-title">Search Records</h3>
        <div className="input-grid">
          <div className="search-fields">
            <div className="input-group">
              <label>Design No.</label>
              <input
                type="text"
                name="designNumber"
                placeholder="Enter design number"
                value={filters.designNumber}
                onChange={handleFilterChange}
              />
            </div>
            <div className="input-group">
              <label>Start Date</label>
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
              />
            </div>
            <div className="input-group">
              <label>End Date</label>
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
              />
            </div>
          </div>
          <div className="button-group">
            <button
              onClick={() =>
                setFilters({ designNumber: "", startDate: "", endDate: "" })
              }
              className="btn-reset"
            >
              Reset
            </button>
            <button onClick={exportToPDF} className="btn-search">
              Save as PDF
            </button>
          </div>
        </div>
      </div>

      {/* Record Table */}
      <div className="records-table">
        {filteredRecords.length === 0 ? (
          <p>No records available.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Challan</th>
                <th>Lot No</th>
                <th>Outward Date</th>
                <th>Design</th>
                <th>Qty</th>
                <th>Rate</th>
                <th>Amount</th>
                <th>Bill No</th>
                <th>Party</th>
                <th>Firm</th>
                <th>Note</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((rec) => (
                <tr key={rec._id}>
                  <td>{rec.challanNumber}</td>
                  <td>{rec.lotNumber}</td>
                  <td>{formatDate(rec.outwardDate)}</td>
                  <td>
                    {rec.designNumber} - {rec.designDetail}
                  </td>
                  <td>
                    {rec.quantity} {rec.quantityType}
                  </td>
                  <td>{rec.rate}</td>
                  <td>{rec.amount}</td>
                  <td>{rec.billNumber}</td>
                  <td>{rec.billName}</td>
                  <td>{handleEmptyValue(rec.firm)}</td>
                  <td>{handleEmptyValue(rec.note)}</td>
                  <td>
                    <FaEye onClick={() => handleView(rec)} className="icon" />
                    <FaEdit onClick={() => handleEdit(rec)} className="icon" />
                    <FaTrash
                      onClick={() => handleDelete(rec._id)}
                      className="icon delete"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <RecordModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={addRecord}
        />
      )}

      {viewMode && (
        <RecordModal
          isOpen={viewMode}
          initialData={selectedRecord}
          onClose={() => setViewMode(false)}
          readOnly={true}
        />
      )}

      {editMode && (
        <RecordModal
          isOpen={editMode}
          initialData={selectedRecord}
          onClose={() => setEditMode(false)}
          onSubmit={async (updatedRecord) => {
            try {
              await api.put(`/records/${selectedRecord._id}`, updatedRecord);
              fetchRecords();
              setEditMode(false);
            } catch (err) {
              console.error("Error updating record:", err);
            }
          }}
        />
      )}
    </div>
  );
}
