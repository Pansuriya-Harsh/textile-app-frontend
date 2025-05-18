import { useEffect, useState } from "react";
import axios from "../../utils/api";
import "../../styles/FinancialYear.css";
import { useNavigate } from "react-router-dom";

const FinancialYear = () => {
  const navigate = useNavigate();
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchYears = async () => {
    try {
      const response = await axios.get("financial-years/list");
      setYears(response.data.financialYears);
    } catch (err) {
      console.error("Error fetching years:", err);
    } finally {
      setLoading(false);
    }
  };

  const addYear = async () => {
    try {
      await axios.post("financial-years/create");
      fetchYears();
    } catch (err) {
      console.error("Error adding year:", err);
    }
  };

  useEffect(() => {
    fetchYears();
  }, []);

  const showAddButton = () => {
    const today = new Date();
    if (today.getMonth() < 3) return false;
    const currentLabel = `${today.getFullYear()}-${(today.getFullYear() + 1)
      .toString()
      .slice(-2)}`;
    return !years.some((y) => y.year === currentLabel);
  };

  return (
    <div className="financial-container">
      <h2 className="financial-title">Financial Year</h2>
      {loading ? (
        <p style={{ color: "white" }}>Loading...</p>
      ) : (
        <div className="button-group">
          {years.map((yearObj) => (
            <button
              key={yearObj._id}
              className="year-button"
              onClick={() => navigate(`/dashboard/financial-year/${yearObj._id}`)}
            >
              {yearObj.year}
            </button>
          ))}
          {showAddButton() && (
            <button onClick={addYear} className="add-button">
              + Add Financial Year
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default FinancialYear;
