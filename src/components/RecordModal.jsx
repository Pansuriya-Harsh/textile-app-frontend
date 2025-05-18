import { useState, useEffect } from "react";
import "../styles/RecordModal.css";

export default function RecordModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  readOnly = false,
}) {
  const [form, setForm] = useState({
    lotNumber: "",
    challanNumber: "",
    inwardDate: "",
    outwardDate: "",
    paymentDate: "",
    designNumber: "",
    designDetail: "",
    quantity: "",
    quantityType: "pcs",
    rate: "",
    billNumber: "",
    firm: "",
    note: "",
    billName: "",
  });

  useEffect(() => {
    if (initialData) {
      const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        if (isNaN(date)) return "";
        return date.toISOString().split("T")[0];
      };
      setForm({
        ...initialData,
        outwardDate: formatDate(initialData.outwardDate),
        inwardDate: formatDate(initialData.inwardDate),
        paymentDate: formatDate(initialData.paymentDate),
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (readOnly) return;

    setForm((prev) => ({
      ...prev,
      [name]: name === "firm" ? value.toLowerCase() : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const normalizedForm = {
      ...form,
      challanNumber: parseInt(form.challanNumber, 10),
      quantity: parseFloat(form.quantity),
      rate: parseFloat(form.rate),
      billNumber: parseInt(form.billNumber, 10),
    };
    onSubmit(normalizedForm);
  };

  if (!isOpen) return null;

  const getTitle = () => {
    if (readOnly) return "View Record";
    if (initialData) return "Edit Record";
    return "Add Record";
  };

  return (
    <div className="record-modal-overlay">
      <div className="record-modal">
        <h3>{getTitle()}</h3>
        <form onSubmit={handleSubmit}>
          <label>Lot number: <span className="required-asterisk">*</span></label>
          <input
            name="lotNumber"
            placeholder="Lot Number"
            value={form.lotNumber}
            onChange={handleChange}
            readOnly={readOnly}
            required
          />
          <label>Challan number: <span className="required-asterisk">*</span></label>
          <input
            name="challanNumber"
            type="number"
            placeholder="Challan Number"
            value={form.challanNumber}
            onChange={handleChange}
            readOnly={readOnly}
            required
          />
          <label>Design number: <span className="required-asterisk">*</span></label>
          <input
            name="designNumber"
            placeholder="Design Number"
            value={form.designNumber}
            onChange={handleChange}
            readOnly={readOnly}
            required
          />
          <label>Design details: <span className="required-asterisk">*</span></label>
          <input
            name="designDetail"
            placeholder="Design Detail"
            value={form.designDetail}
            onChange={handleChange}
            readOnly={readOnly}
            required
          />
          <label>Quantity: <span className="required-asterisk">*</span></label>
          <input
            name="quantity"
            type="number"
            step="0.01"
            placeholder="Quantity"
            value={form.quantity}
            onChange={handleChange}
            readOnly={readOnly}
            required
          />
          <label>Quantity type: <span className="required-asterisk">*</span></label>
          <select
            name="quantityType"
            value={form.quantityType}
            onChange={handleChange}
            disabled={readOnly}
            required
          >
            <option value="pcs">pcs</option>
            <option value="meter">meter</option>
          </select>
          <label>Rate: <span className="required-asterisk">*</span></label>
          <input
            name="rate"
            type="number"
            step="0.01"
            placeholder="Rate"
            value={form.rate}
            onChange={handleChange}
            readOnly={readOnly}
            required
          />
          <label>Bill number: <span className="required-asterisk">*</span></label>
          <input
            name="billNumber"
            type="number"
            placeholder="Bill Number"
            value={form.billNumber}
            onChange={handleChange}
            readOnly={readOnly}
            required
          />
          <label>Outward date: <span className="required-asterisk">*</span></label>
          <input
            name="outwardDate"
            type="date"
            value={form.outwardDate}
            onChange={handleChange}
            readOnly={readOnly}
            required
          />
          <label>Inward date:</label>
          <input
            name="inwardDate"
            type="date"
            value={form.inwardDate}
            onChange={handleChange}
            readOnly={readOnly}
          />
          <label>Payment date:</label>
          <input
            name="paymentDate"
            type="date"
            value={form.paymentDate}
            onChange={handleChange}
            readOnly={readOnly}
          />
          <label>Party: <span className="required-asterisk">*</span></label>
          <input 
            name="billName"
            placeholder="Party"
            value={form.billName}
            onChange={handleChange}
            readOnly={readOnly}
          />
          <label>Firm:</label>
          <input
            name="firm"
            placeholder="Firm"
            value={form.firm}
            onChange={handleChange}
            readOnly={readOnly}
          />
          <label>Note:</label>
          <textarea
            name="note"
            placeholder="Note"
            value={form.note}
            onChange={handleChange}
            readOnly={readOnly}
          />

          <div className="modal-actions">
            {!readOnly && (
              <button type="submit">{initialData ? "Update" : "Create"}</button>
            )}
            <button type="button" onClick={onClose} className="cancel-btn">
              {readOnly ? "Close" : "Cancel"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
