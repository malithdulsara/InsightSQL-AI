import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Database, Search, Sparkles, AlertCircle, Loader2, RefreshCw, Table2 } from "lucide-react";
import "./App.css";

function App() {
  const [question, setQuestion] = useState("");
  const [tableData, setTableData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!question.trim()) return;
    
    setLoading(true);
    setError("");
    setTableData([]);
    setColumns([]); 

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/chat", {
        question: question,
      });

      if (response.data.data && response.data.data.error) {
        setError(`Database Error: ${response.data.data.error}`);
      } 
      else if (response.data.status === "success" && response.data.data && response.data.data.data) {
        setColumns(response.data.data.columns); 
        setTableData(response.data.data.data);  
      } else {
        setError("No data retrieved or empty results returned from the database.");
      }
    } catch (err) {
      setError("Failed to connect to backend server. Make sure FastAPI is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid min-vh-screen d-flex flex-column p-0 position-relative z-1">
      
      {/* Header */}
      <header className="px-4 py-3 bg-white border-bottom sticky-top shadow-sm z-3">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
            <div className="p-2 bg-primary bg-opacity-10 rounded border border-primary border-opacity-25">
              <Database className="text-primary" size={22} />
            </div>
            <div>
              <h1 className="h6 mb-0 fw-bold text-dark">InsightSQL AI</h1>
              <span className="text-secondary d-block" style={{ fontSize: "11px" }}>Enterprise Data Gateway</span>
            </div>
          </div>
          <div className="badge bg-light border text-dark rounded-pill px-3 py-2 d-flex align-items-center gap-2 shadow-sm" style={{ fontSize: "11px", fontWeight: "500" }}>
            <span className="spinner-grow spinner-grow-sm text-success" style={{ width: "6px", height: "6px" }}></span>
            MySQL Node Active
          </div>
        </div>
      </header>

      <div className="container-fluid flex-grow-1 px-4 px-md-5 py-5 d-flex flex-column align-items-center">

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="card modern-card w-100 p-4 p-md-5 mb-4"
          style={{ maxWidth: "900px" }}
        >
          <div className="text-center mb-4">
            <div className="d-inline-flex align-items-center gap-2 px-3 py-1.5 rounded-pill bg-primary bg-opacity-10 text-primary border border-primary border-opacity-10 mb-3" style={{ fontSize: "12px", fontWeight: "600" }}>
              <Sparkles size={14} /> AI Orchestration Layer
            </div>
            <h2 className="fw-bold text-dark mb-2">Ask your database anything</h2>
            <p className="text-secondary small px-md-5">
              Type your query in plain English. The LLM compiles validated SQL queries instantly against your enterprise schema.
            </p>
          </div>

          <div className="d-flex flex-column flex-sm-row gap-3">
            <div className="input-group modern-input-group flex-grow-1">
              <span className="bg-transparent border-0 text-secondary ps-3 d-flex align-items-center">
                <Search size={18} />
              </span>
              <input
                type="text"
                placeholder="e.g., Show all products in electronics category..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="form-control modern-input shadow-none"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="btn modern-btn d-flex align-items-center justify-content-center gap-2 shadow-sm"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  <span>Execute</span>
                  <Sparkles size={14} />
                </>
              )}
            </button>
          </div>
        </motion.div>

        <div className="w-100 mt-2" style={{ maxWidth: "1400px" }}>
          <AnimatePresence mode="wait">
            
            {loading && (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-5 card modern-card"
              >
                <Loader2 className="text-primary animate-spin mb-3 mx-auto" size={32} />
                <p className="text-secondary small fw-medium">Compiling query & generating rows...</p>
              </motion.div>
            )}

            {error && (
              <motion.div 
                key="error"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="alert alert-danger card modern-card border-danger border-opacity-25 text-danger p-3 d-flex gap-3 align-items-center bg-danger bg-opacity-10"
              >
                <AlertCircle size={24} className="shrink-0" />
                <div>
                  <strong className="d-block small">Execution Engine Error</strong>
                  <span style={{ fontSize: "13px" }}>{error}</span>
                </div>
              </motion.div>
            )}


            {tableData.length > 0 && !loading && (
              <motion.div 
                key="table-card"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 15 }}
                className="card modern-table-card shadow-sm"
              >
                <div className="card-header bg-white border-bottom px-4 py-3 d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-2 text-dark">
                    <Table2 className="text-primary" size={18} />
                    <span className="fw-bold small">Query Result Output</span>
                    <span className="text-secondary" style={{ fontSize: "11px" }}>({tableData.length} rows found)</span>
                  </div>
                  <button onClick={() => { setTableData([]); setColumns([]); }} className="btn btn-link text-secondary p-0 text-decoration-none btn-sm d-flex align-items-center gap-1" style={{ fontSize: "12px" }}>
                    <RefreshCw size={12} /> Clear
                  </button>
                </div>

                <div className="table-responsive w-100">
                  <table className="table modern-table mb-0 text-left align-middle">
                    <thead>
                      <tr>
                        {columns.map((colName, index) => (
                          <th key={index}>{colName.replace(/_/g, ' ')}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.map((row, rowIndex) => (
                        <motion.tr 
                          key={rowIndex}
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: rowIndex * 0.02 }}
                        >
                          {row.map((cell, cellIndex) => (
                            <td key={cellIndex} className="text-nowrap">
                              {typeof cell === "number" && cell.toString().includes(".") 
                                ? cell.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) 
                                : cell?.toString() || <span className="text-muted fst-italic">null</span>}
                            </td>
                          ))}
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-4 text-secondary mt-auto border-top bg-white" style={{ fontSize: "12px" }}>
        &copy; 2026 InsightSQL. Powered by LangChain Classic & Groq.
      </footer>
    </div>
  );
}

export default App;