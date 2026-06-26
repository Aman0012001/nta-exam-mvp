import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, LogOut, Database, FileText, CheckCircle2, 
  AlertTriangle, RefreshCw, Trash2, ArrowLeft, 
  Eye, Search, Download, X, Calendar, Clock, 
  Award, BarChart2, Check, AlertCircle, FileSpreadsheet,
  Users, UserPlus
} from 'lucide-react';
import './Admin.css';

export default function AdminDashboard() {
  const [token, setToken] = useState(localStorage.getItem('nta_admin_token'));
  const [username, setUsername] = useState(localStorage.getItem('nta_admin_username'));
  const navigate = useNavigate();

  // Navigation Tabs: 'questions' | 'results' | 'students'
  const [activeTab, setActiveTab] = useState('results');

  // Loading States
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null); // 'upload' | 'delete-id'

  // DB Summary Stats
  const [questionsList, setQuestionsList] = useState([]);
  const [summaryStats, setSummaryStats] = useState({
    totalQuestions: 0,
    totalCandidates: 0,
    completedAttempts: 0,
    activeAttempts: 0
  });

  // Results State
  const [studentResults, setStudentResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSet, setFilterSet] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [sortField, setSortField] = useState('submittedAt');
  const [sortDirection, setSortDirection] = useState('desc');

  // Question Upload State
  const [jsonText, setJsonText] = useState('');
  const [parsedQuestionsPreview, setParsedQuestionsPreview] = useState([]);
  const [clearExisting, setClearExisting] = useState(true);
  const [statusMsg, setStatusMsg] = useState(null); // { type: 'success' | 'error', text: '' }
  const [dragOver, setDragOver] = useState(false);

  // Detail Modal State
  const [selectedResult, setSelectedResult] = useState(null);

  // CSV Drag and Drop file ref
  const fileInputRef = useRef(null);
  const studentFileInputRef = useRef(null);

  // Student Management State
  const [allowedStudents, setAllowedStudents] = useState([]);
  const [studentName, setStudentName] = useState('');
  const [studentRoll, setStudentRoll] = useState('');
  const [studentStatusMsg, setStudentStatusMsg] = useState(null);
  const [studentLoading, setStudentLoading] = useState(false);
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [studentDragOver, setStudentDragOver] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
    } else {
      fetchSummary();
      fetchCurrentQuestions();
      fetchResults();
      fetchStudents();
    }
  }, [token]);

  // ── Student Management Functions ──────────────────────────────────────
  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/admin/students', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 401 || res.status === 403) {
        handleLogout();
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setAllowedStudents(data);
      }
    } catch (err) {
      console.error('Error fetching students:', err);
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!studentName.trim() || !studentRoll.trim()) return;
    setStudentStatusMsg(null);
    setStudentLoading(true);
    try {
      const res = await fetch('/api/admin/students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: studentName.trim(), rollNumber: studentRoll.trim() })
      });
      if (res.status === 401 || res.status === 403) {
        handleLogout();
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add student');
      setStudentStatusMsg({ type: 'success', text: `Student "${data.name}" (${data.rollNumber}) added successfully.` });
      setStudentName('');
      setStudentRoll('');
      fetchStudents();
    } catch (err) {
      setStudentStatusMsg({ type: 'error', text: err.message });
    } finally {
      setStudentLoading(false);
    }
  };

  const handleDeleteStudent = async (id, rollNumber) => {
    if (!window.confirm(`Remove student ${rollNumber} from the allowed list?`)) return;
    try {
      const res = await fetch(`/api/admin/students/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 401 || res.status === 403) {
        handleLogout();
        return;
      }
      if (res.ok) {
        fetchStudents();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete student');
      }
    } catch (err) {
      alert('Network error');
    }
  };

  const parseStudentCSV = (text) => {
    const rows = text.split(/\r?\n/).filter(r => r.trim());
    if (rows.length < 2) return [];
    const parsed = [];
    for (let i = 1; i < rows.length; i++) {
      const cols = rows[i].split(',').map(c => c.trim().replace(/^"|"$/g, ''));
      if (cols.length >= 2 && cols[0] && cols[1]) {
        parsed.push({ name: cols[0], rollNumber: cols[1] });
      }
    }
    return parsed;
  };

  const handleStudentFileImport = (file) => {
    if (!file || !file.name.endsWith('.csv')) {
      setStudentStatusMsg({ type: 'error', text: 'Please upload a .csv file' });
      return;
    }
    const reader = new FileReader();
    reader.onload = async (event) => {
      const students = parseStudentCSV(event.target.result);
      if (students.length === 0) {
        setStudentStatusMsg({ type: 'error', text: 'No valid student rows found in CSV. Expected: Name,RollNumber' });
        return;
      }
      setStudentLoading(true);
      try {
        const res = await fetch('/api/admin/students/import', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ students })
        });
        if (res.status === 401 || res.status === 403) {
          handleLogout();
          return;
        }
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Import failed');
        setStudentStatusMsg({ type: 'success', text: data.message });
        fetchStudents();
      } catch (err) {
        setStudentStatusMsg({ type: 'error', text: err.message });
      } finally {
        setStudentLoading(false);
      }
    };
    reader.readAsText(file);
  };

  const filteredStudents = allowedStudents.filter(s =>
    s.name.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
    s.rollNumber.toLowerCase().includes(studentSearchQuery.toLowerCase())
  );

  const fetchSummary = async () => {
    try {
      const res = await fetch('/api/admin/summary', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSummaryStats(prev => ({ ...prev, ...data }));
      }
    } catch (err) {
      console.error('Error fetching summary:', err);
    }
  };

  const fetchCurrentQuestions = async () => {
    try {
      const res = await fetch('/api/questions');
      if (res.ok) {
        const data = await res.json();
        setQuestionsList(data);
        setSummaryStats(prev => ({ ...prev, totalQuestions: data.length }));
      }
    } catch (err) {
      console.error('Error fetching questions:', err);
    }
  };

  const fetchResults = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/results', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStudentResults(data);
      }
    } catch (err) {
      console.error('Error fetching results:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('nta_admin_token');
    localStorage.removeItem('nta_admin_username');
    navigate('/admin/login');
  };

  // --- CSV / JSON File Parsers ---
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
  };

  const processFile = (file) => {
    const reader = new FileReader();
    const isCSV = file.name.endsWith('.csv');
    const isJSON = file.name.endsWith('.json');

    if (!isCSV && !isJSON) {
      setStatusMsg({ type: 'error', text: 'Unsupported file type. Please upload a .json or .csv file.' });
      return;
    }

    reader.onload = (event) => {
      const text = event.target.result;
      if (isJSON) {
        try {
          const parsed = JSON.parse(text);
          setJsonText(JSON.stringify(parsed, null, 2));
          validateQuestions(parsed);
          setStatusMsg({ type: 'success', text: `Loaded ${parsed.length || 0} questions from JSON. Review preview below.` });
        } catch (err) {
          setStatusMsg({ type: 'error', text: 'Invalid JSON file structure.' });
        }
      } else if (isCSV) {
        try {
          const parsed = parseCSV(text);
          setJsonText(JSON.stringify(parsed, null, 2));
          validateQuestions(parsed);
          setStatusMsg({ type: 'success', text: `Parsed ${parsed.length} questions from CSV. Review preview below.` });
        } catch (err) {
          setStatusMsg({ type: 'error', text: 'Failed to parse CSV file: ' + err.message });
        }
      }
    };
    reader.readAsText(file);
  };

  const parseCSV = (text) => {
    const rows = [];
    let currentRow = [];
    let currentField = '';
    let inQuotes = false;
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const nextChar = text[i + 1];
      
      if (inQuotes) {
        if (char === '"') {
          if (nextChar === '"') {
            currentField += '"';
            i++; 
          } else {
            inQuotes = false;
          }
        } else {
          currentField += char;
        }
      } else {
        if (char === '"') {
          inQuotes = true;
        } else if (char === ',') {
          currentRow.push(currentField.trim());
          currentField = '';
        } else if (char === '\r' || char === '\n') {
          currentRow.push(currentField.trim());
          currentField = '';
          if (currentRow.some(val => val !== '')) {
            rows.push(currentRow);
          }
          currentRow = [];
          if (char === '\r' && nextChar === '\n') {
            i++; 
          }
        } else {
          currentField += char;
        }
      }
    }
    if (currentField.trim() || currentRow.length > 0) {
      currentRow.push(currentField.trim());
      rows.push(currentRow);
    }

    if (rows.length === 0) return [];
    
    // Assume standard NTA CSV format:
    // Subject, Topic, QuestionText, Option1, Option2, Option3, Option4, CorrectOptionNumber
    const parsedQuestions = [];
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row.length < 6) continue; // Skip malformed rows
      
      const subject = row[0] || 'Physics';
      const topic = row[1] || 'General';
      const question = row[2];
      
      const answer = parseInt(row[row.length - 1], 10);
      
      // Get all columns between QuestionText and CorrectOption
      const options = [];
      for (let j = 3; j < row.length - 1; j++) {
        if (row[j] !== undefined && row[j] !== '') {
          options.push(row[j]);
        }
      }
      
      if (question) {
        parsedQuestions.push({
          subject,
          topic,
          question,
          options,
          answer
        });
      }
    }
    return parsedQuestions;
  };

  const validateQuestions = (questions) => {
    if (!Array.isArray(questions)) {
      setParsedQuestionsPreview([]);
      return;
    }

    const validated = questions.map((q, index) => {
      const questionText = q.question || q.questionText;
      const correctOption = q.answer !== undefined ? q.answer : q.correctOption;
      const options = q.options || [];
      const subject = q.subject || 'Physics';
      const topic = q.topic || 'General';

      const errors = [];
      if (!questionText) errors.push('Missing question text');
      if (!options || options.length < 2) errors.push('Must have at least 2 options');
      if (correctOption === undefined || isNaN(correctOption) || correctOption < 1 || correctOption > options.length) {
        errors.push(`Invalid correct option index (${correctOption}). Must be 1-based index (1-${options.length})`);
      }

      return {
        index: index + 1,
        subject,
        topic,
        questionText: questionText || '',
        options,
        correctOption,
        isValid: errors.length === 0,
        errors
      };
    });

    setParsedQuestionsPreview(validated);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg(null);

    let parsedQuestions;
    try {
      parsedQuestions = JSON.parse(jsonText);
      if (!Array.isArray(parsedQuestions)) {
        throw new Error('Root JSON must be an array of questions.');
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Parsing error: ' + err.message });
      return;
    }

    // Verify all are valid
    const invalidCount = parsedQuestionsPreview.filter(q => !q.isValid).length;
    if (invalidCount > 0) {
      setStatusMsg({ type: 'error', text: `Cannot import. There are ${invalidCount} validation errors in the parsed questions. Please check the preview table.` });
      return;
    }

    setActionLoading('upload');
    try {
      const res = await fetch('/api/admin/upload-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          questions: parsedQuestions
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload questions');
      }

      setStatusMsg({ type: 'success', text: data.message });
      setJsonText('');
      setParsedQuestionsPreview([]);
      fetchCurrentQuestions();
      fetchSummary();
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message });
    } finally {
      setActionLoading(null);
    }
  };

  const handleTextareaChange = (e) => {
    const val = e.target.value;
    setJsonText(val);
    try {
      const parsed = JSON.parse(val);
      validateQuestions(parsed);
    } catch (err) {
      // Ignored: parsing failure means user is still typing JSON
    }
  };

  // --- Student Results Management ---
  const handleDeleteAttempt = async (attemptId) => {
    if (!window.confirm('WARNING: Are you sure you want to delete this candidate attempt? This action is permanent and deletes all answers and candidate records.')) {
      return;
    }

    setActionLoading(`delete-${attemptId}`);
    try {
      const res = await fetch(`/api/admin/attempts/${attemptId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        fetchResults();
        fetchSummary();
      } else {
        alert(data.error || 'Failed to delete attempt');
      }
    } catch (err) {
      console.error('Error deleting attempt:', err);
      alert('Network error when deleting attempt');
    } finally {
      setActionLoading(null);
    }
  };

  // --- CSV Export results ---
  const handleExportCSV = () => {
    if (filteredResults.length === 0) return;

    const headers = [
      'Roll Number',
      'Name',
      'Exam Set',
      'Status',
      'Started At',
      'Submitted At',
      'Total Questions',
      'Correct Answers',
      'Incorrect Answers',
      'Unanswered',
      'Score Obtained',
      'Accuracy %',
      'Time Taken (Mins)'
    ];

    const rows = filteredResults.map(r => {
      const attempt = r.attempts[0] || {};
      const timeMins = attempt.timeTakenSecs 
        ? Math.round(attempt.timeTakenSecs / 60) 
        : 'N/A';
      return [
        r.rollNumber,
        r.name,
        r.examSet,
        attempt.status || 'N/A',
        new Date(attempt.startedAt).toLocaleString(),
        attempt.submittedAt ? new Date(attempt.submittedAt).toLocaleString() : 'N/A',
        summaryStats.totalQuestions,
        attempt.correct ?? 0,
        attempt.incorrect ?? 0,
        attempt.totalNotAnswered ?? 0,
        `${attempt.score ?? 0} / ${attempt.maxScore ?? 0}`,
        `${attempt.accuracy ?? 0}%`,
        timeMins
      ];
    });

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `nta_results_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- Search and Filtering Logic ---
  const filteredResults = studentResults.filter(candidate => {
    const attempt = candidate.attempts[0] || {};
    const matchesSearch = 
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      candidate.rollNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSet = filterSet === 'ALL' || candidate.examSet === filterSet;
    const matchesStatus = filterStatus === 'ALL' || (attempt.status || 'in-progress') === filterStatus.toLowerCase();

    return matchesSearch && matchesSet && matchesStatus;
  });

  // Sorting
  const sortedResults = [...filteredResults].sort((a, b) => {
    let aVal, bVal;

    if (sortField === 'name' || sortField === 'rollNumber' || sortField === 'examSet') {
      aVal = a[sortField];
      bVal = b[sortField];
    } else {
      const aAttempt = a.attempts[0] || {};
      const bAttempt = b.attempts[0] || {};
      aVal = aAttempt[sortField];
      bVal = bAttempt[sortField];
    }

    if (aVal === undefined || aVal === null) return 1;
    if (bVal === undefined || bVal === null) return -1;

    if (typeof aVal === 'string') {
      return sortDirection === 'asc' 
        ? aVal.localeCompare(bVal) 
        : bVal.localeCompare(aVal);
    } else {
      return sortDirection === 'asc' 
        ? aVal - bVal 
        : bVal - aVal;
    }
  });

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // --- Topic Analysis calculations for selected result ---
  const calculateTopicAnalysis = (attempt) => {
    if (!attempt || !attempt.responses) return [];

    const topicMap = {};
    attempt.responses.forEach(r => {
      const topic = r.topic || 'General';
      if (!topicMap[topic]) {
        topicMap[topic] = { correct: 0, total: 0 };
      }
      topicMap[topic].total++;
      if ((r.status === 'answered' || r.status === 'answered-marked') && r.selectedOption === r.correctOption) {
        topicMap[topic].correct++;
      }
    });

    return Object.entries(topicMap).map(([topic, stats]) => {
      const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
      return { topic, ...stats, accuracy };
    });
  };

  // Group current questions by topic to show statistics
  const topicStats = questionsList.reduce((acc, q) => {
    acc[q.topic] = (acc[q.topic] || 0) + 1;
    return acc;
  }, {});

  const sampleCsvText = `Subject,Topic,Question,Option1,Option2,Option3,Option4,CorrectAnswer
Physics,Laws of Motion,"A block of mass 5 kg is placed on a frictionless inclined plane...",5 m/s²,4.33 m/s²,10 m/s²,2.5 m/s²,1
Physics,Work & Energy,"A spring with k=200 N/m is compressed by 0.1 m. What is the potential energy?",2 J,1 J,0.5 J,20 J,2`;

  return (
    <div className="admin-dashboard-container">
      {/* HEADER NAV */}
      <header className="admin-dashboard-header">
        <div className="header-logo">
          <Database size={24} className="logo-icon" />
          <div>
            <h1>NTA Administration Center</h1>
            <span className="subtitle">Secure Testing Management Portal</span>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="admin-tabs-row">
          <button 
            className={`admin-tab-btn ${activeTab === 'results' ? 'active' : ''}`}
            onClick={() => setActiveTab('results')}
          >
            <BarChart2 size={16} /> Candidate Results
          </button>
          <button 
            className={`admin-tab-btn ${activeTab === 'questions' ? 'active' : ''}`}
            onClick={() => setActiveTab('questions')}
          >
            <Database size={16} /> Questions Database
          </button>
          <button 
            className={`admin-tab-btn ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => setActiveTab('students')}
          >
            <Users size={16} /> Students
          </button>
        </div>

        <div className="header-user">
          <button onClick={() => navigate('/')} className="back-portal-btn">
            <ArrowLeft size={16} /> Exit to Portal
          </button>
          <span>Logged in: <strong>{username}</strong></span>
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={16} /> Log Out
          </button>
        </div>
      </header>

      {/* DASHBOARD CONTENT */}
      <main className="admin-dashboard-content">

        {/* TAB 1: STUDENT RESULTS */}
        {activeTab === 'results' && (
          <div className="results-tab-content">
            
            {/* KPI Summary Cards */}
            <section className="kpi-dashboard-row">
              <div className="kpi-card">
                <div className="kpi-icon-box bg-blue">
                  <Calendar size={24} />
                </div>
                <div className="kpi-details">
                  <span className="kpi-value">{studentResults.length}</span>
                  <span className="kpi-label">Registered Candidates</span>
                </div>
              </div>
              <div className="kpi-card">
                <div className="kpi-icon-box bg-green">
                  <CheckCircle2 size={24} />
                </div>
                <div className="kpi-details">
                  <span className="kpi-value">
                    {studentResults.filter(c => (c.attempts[0]?.status || '') === 'submitted').length}
                  </span>
                  <span className="kpi-label">Submitted Tests</span>
                </div>
              </div>
              <div className="kpi-card">
                <div className="kpi-icon-box bg-yellow">
                  <Clock size={24} />
                </div>
                <div className="kpi-details">
                  <span className="kpi-value">
                    {studentResults.filter(c => (c.attempts[0]?.status || '') === 'in-progress').length}
                  </span>
                  <span className="kpi-label">Active / In Progress</span>
                </div>
              </div>
              <div className="kpi-card">
                <div className="kpi-icon-box bg-purple">
                  <Award size={24} />
                </div>
                <div className="kpi-details">
                  <span className="kpi-value">
                    {studentResults.length > 0 
                      ? Math.max(...studentResults.map(c => c.attempts[0]?.score || 0))
                      : 0}
                  </span>
                  <span className="kpi-label">Top Score Recorded</span>
                </div>
              </div>
            </section>

            {/* Results List Section */}
            <div className="admin-card table-section-card">
              <div className="table-header-controls">
                <h3><FileText size={18} /> Candidate Reports Registry</h3>
                
                <div className="filters-container">
                  {/* Search Input */}
                  <div className="search-bar-wrapper">
                    <Search size={16} className="search-icon" />
                    <input 
                      type="text" 
                      placeholder="Search Roll No or Name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  {/* Filter Select Set */}
                  <div className="select-filter-wrapper">
                    <span>Set:</span>
                    <select value={filterSet} onChange={(e) => setFilterSet(e.target.value)}>
                      <option value="ALL">All Sets</option>
                      <option value="SET-A">SET-A</option>
                      <option value="SET-B">SET-B</option>
                      <option value="SET-C">SET-C</option>
                      <option value="SET-D">SET-D</option>
                    </select>
                  </div>

                  {/* Filter Select Status */}
                  <div className="select-filter-wrapper">
                    <span>Status:</span>
                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                      <option value="ALL">All Status</option>
                      <option value="SUBMITTED">Submitted</option>
                      <option value="IN-PROGRESS">In Progress</option>
                    </select>
                  </div>

                  {/* CSV Export */}
                  <button 
                    onClick={handleExportCSV} 
                    className="export-btn"
                    disabled={filteredResults.length === 0}
                  >
                    <Download size={16} /> Export CSV
                  </button>
                </div>
              </div>

              {/* Data Table */}
              <div className="results-table-wrapper">
                {loading ? (
                  <div className="table-loading-overlay">
                    <RefreshCw className="spinner-icon" size={32} />
                    <p>Loading candidate registry records...</p>
                  </div>
                ) : sortedResults.length === 0 ? (
                  <div className="empty-table-state">
                    <AlertCircle size={40} className="empty-icon" />
                    <p>No candidate records found matching the criteria.</p>
                  </div>
                ) : (
                  <table className="results-data-table">
                    <thead>
                      <tr>
                        <th onClick={() => toggleSort('rollNumber')} className="sortable-header">
                          Roll Number {sortField === 'rollNumber' && (sortDirection === 'asc' ? '▲' : '▼')}
                        </th>
                        <th onClick={() => toggleSort('name')} className="sortable-header">
                          Candidate Name {sortField === 'name' && (sortDirection === 'asc' ? '▲' : '▼')}
                        </th>
                        <th onClick={() => toggleSort('examSet')} className="sortable-header">
                          Set {sortField === 'examSet' && (sortDirection === 'asc' ? '▲' : '▼')}
                        </th>
                        <th onClick={() => toggleSort('status')} className="sortable-header">
                          Status {sortField === 'status' && (sortDirection === 'asc' ? '▲' : '▼')}
                        </th>
                        <th onClick={() => toggleSort('submittedAt')} className="sortable-header">
                          Date Submitted {sortField === 'submittedAt' && (sortDirection === 'asc' ? '▲' : '▼')}
                        </th>
                        <th onClick={() => toggleSort('score')} className="sortable-header">
                          Score {sortField === 'score' && (sortDirection === 'asc' ? '▲' : '▼')}
                        </th>
                        <th onClick={() => toggleSort('accuracy')} className="sortable-header">
                          Accuracy {sortField === 'accuracy' && (sortDirection === 'asc' ? '▲' : '▼')}
                        </th>
                        <th onClick={() => toggleSort('timeTakenSecs')} className="sortable-header">
                          Duration {sortField === 'timeTakenSecs' && (sortDirection === 'asc' ? '▲' : '▼')}
                        </th>
                        <th className="actions-header">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedResults.map((c) => {
                        const attempt = c.attempts[0];
                        const hasAttempt = !!attempt;
                        const durationMins = hasAttempt && attempt.timeTakenSecs 
                          ? Math.round(attempt.timeTakenSecs / 60) 
                          : null;
                        
                        return (
                          <tr key={c.id}>
                            <td className="roll-no-cell">{c.rollNumber}</td>
                            <td className="name-cell">{c.name}</td>
                            <td><span className="exam-set-badge">{c.examSet}</span></td>
                            <td>
                              <span className={`status-badge ${hasAttempt ? attempt.status : 'no-attempt'}`}>
                                {hasAttempt ? attempt.status : 'No Attempt'}
                              </span>
                            </td>
                            <td className="date-cell">
                              {hasAttempt && attempt.submittedAt 
                                ? new Date(attempt.submittedAt).toLocaleString() 
                                : hasAttempt 
                                  ? 'Exam in progress'
                                  : 'Not started'}
                            </td>
                            <td className="score-cell">
                              {hasAttempt ? (
                                <strong>{attempt.score} <span className="score-denominator">/ {attempt.maxScore}</span></strong>
                              ) : (
                                '--'
                              )}
                            </td>
                            <td className="accuracy-cell">
                              {hasAttempt ? (
                                <div className="accuracy-pill-wrapper">
                                  <span className={`accuracy-pill ${attempt.accuracy >= 75 ? 'high' : attempt.accuracy >= 45 ? 'mid' : 'low'}`}>
                                    {attempt.accuracy}%
                                  </span>
                                </div>
                              ) : (
                                '--'
                              )}
                            </td>
                            <td className="duration-cell">
                              {durationMins !== null ? `${durationMins}m` : '--'}
                            </td>
                            <td className="action-cells">
                              <button 
                                onClick={() => setSelectedResult({ ...c, attempt })} 
                                className="action-btn view-btn"
                                title="View detailed score sheet"
                                disabled={!hasAttempt}
                              >
                                <Eye size={14} /> View
                              </button>
                              <button 
                                onClick={() => handleDeleteAttempt(attempt.id)} 
                                className="action-btn delete-btn"
                                title="Delete attempt"
                                disabled={!hasAttempt || actionLoading === `delete-${attempt?.id}`}
                              >
                                {actionLoading === `delete-${attempt?.id}` ? (
                                  <RefreshCw size={14} className="spinner-icon" />
                                ) : (
                                  <Trash2 size={14} />
                                )}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: QUESTIONS DATABASE */}
        {activeTab === 'questions' && (
          <div className="questions-tab-content">
            <div className="dashboard-grid">
              
              {/* Left Panel: DB Stats & Expected formats */}
              <div className="dashboard-left-panel">
                <div className="admin-card stats-card">
                  <h3><Database size={18} /> Database Status</h3>
                  <div className="big-stat">
                    <span className="stat-num">{summaryStats.totalQuestions}</span>
                    <span className="stat-label">Total Questions Seeded</span>
                  </div>
                  
                  <div className="topic-list-container">
                    <h4>Questions by Topic</h4>
                    {Object.keys(topicStats).length === 0 ? (
                      <p className="no-topics">No topics seeded in database yet.</p>
                    ) : (
                      <ul className="topic-list">
                        {Object.entries(topicStats).map(([topic, count]) => (
                          <li key={topic}>
                            <span className="topic-name">{topic}</span>
                            <span className="topic-count">{count}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <div className="admin-card template-card">
                  <h3><FileSpreadsheet size={18} /> Expected CSV Template</h3>
                  <p>When seeding with a CSV spreadsheet, include the exact column header format shown below:</p>
                  <pre className="json-template csv-template">
                    {sampleCsvText}
                  </pre>
                  <p className="template-tip">⚠️ <em>Note: Option numbers mapping the answer field must be 1-based (index numbers 1 to 4).</em></p>
                </div>
              </div>

              {/* Right Panel: File Upload Form & Previews */}
              <div className="dashboard-right-panel">
                <div className="admin-card upload-card">
                  <h3><Upload size={20} /> Bulk Upload Questions</h3>
                  <p className="card-subtitle">Import your examination. Drag and drop file, browse, or paste JSON below.</p>

                  {statusMsg && (
                    <div className={`status-banner ${statusMsg.type}`}>
                      {statusMsg.type === 'success' ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
                      <span>{statusMsg.text}</span>
                    </div>
                  )}

                  <form onSubmit={handleUploadSubmit} className="upload-form">
                    
                    {/* Drag and Drop Container */}
                    <div 
                      className={`drag-drop-zone ${dragOver ? 'drag-active' : ''}`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current.click()}
                    >
                      <Upload className="upload-cloud-icon" size={36} />
                      <p className="drag-text-primary">Drag & Drop <strong>.json</strong> or <strong>.csv</strong> here</p>
                      <p className="drag-text-secondary">or click to browse local files</p>
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        accept=".json,.csv"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                      />
                    </div>

                    <div className="upload-options-row" style={{ marginTop: '16px' }}>
                      <div className="clear-db-checkbox-wrapper">
                        <span className="caution-text-warning">
                          ⚠️ Warning: Importing will wipe all existing database questions, student registration sessions, and completed attempts.
                        </span>
                      </div>
                    </div>

                    <div className="form-group text-area-group">
                      <label>Question Data JSON Array (Auto-populated from files)</label>
                      <textarea
                        placeholder="Paste your JSON array format directly, or drop a file to auto-populate..."
                        value={jsonText}
                        onChange={handleTextareaChange}
                        required
                      ></textarea>
                    </div>

                    {/* Pre-Upload Validation Preview Table */}
                    {parsedQuestionsPreview.length > 0 && (
                      <div className="pre-upload-preview-container">
                        <h4>🔍 File Parsing Preview & Validation ({parsedQuestionsPreview.length} questions)</h4>
                        <div className="preview-table-wrapper">
                          <table className="preview-table">
                            <thead>
                              <tr>
                                <th>No</th>
                                <th>Subject</th>
                                <th>Topic</th>
                                <th>Question Text</th>
                                <th>Options Count</th>
                                <th>Correct Index</th>
                                <th>Validation</th>
                              </tr>
                            </thead>
                            <tbody>
                              {parsedQuestionsPreview.slice(0, 15).map(q => (
                                <tr key={q.index} className={q.isValid ? 'row-valid' : 'row-invalid'}>
                                  <td>{q.index}</td>
                                  <td>{q.subject}</td>
                                  <td>{q.topic}</td>
                                  <td className="preview-qtext" title={q.questionText}>{q.questionText}</td>
                                  <td>{q.options.length}</td>
                                  <td>Option {q.correctOption}</td>
                                  <td>
                                    {q.isValid ? (
                                      <span className="validation-status badge-ok"><Check size={12} /> Valid</span>
                                    ) : (
                                      <span className="validation-status badge-err" title={q.errors.join(', ')}>
                                        <AlertCircle size={12} /> Error
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        {parsedQuestionsPreview.length > 15 && (
                          <div className="preview-more-indicator">
                            ... and {parsedQuestionsPreview.length - 15} more questions.
                          </div>
                        )}
                      </div>
                    )}

                    <button 
                      type="submit" 
                      className="upload-submit-btn" 
                      disabled={actionLoading === 'upload' || !jsonText || parsedQuestionsPreview.some(q => !q.isValid)}
                    >
                      {actionLoading === 'upload' ? (
                        <>
                          <RefreshCw className="spinner-icon" size={16} />
                          Overwriting database questions...
                        </>
                      ) : (
                        <>
                          <Database size={16} />
                          Clear & Seed New Questions
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 3: STUDENTS MANAGEMENT */}
        {activeTab === 'students' && (
          <div className="students-tab-content">

            {/* KPI Cards */}
            <section className="kpi-dashboard-row">
              <div className="kpi-card">
                <div className="kpi-icon-box bg-blue">
                  <Users size={24} />
                </div>
                <div className="kpi-details">
                  <span className="kpi-value">{allowedStudents.length}</span>
                  <span className="kpi-label">Registered Students</span>
                </div>
              </div>
            </section>

            <div className="students-grid">

              {/* Left: Add Student Form + CSV Import */}
              <div className="students-left-panel">
                <div className="admin-card">
                  <h3><UserPlus size={18} /> Add Student</h3>

                  {studentStatusMsg && (
                    <div className={`status-banner ${studentStatusMsg.type}`}>
                      {studentStatusMsg.type === 'success' ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
                      <span>{studentStatusMsg.text}</span>
                    </div>
                  )}

                  <form onSubmit={handleAddStudent} className="add-student-form">
                    <div className="form-group">
                      <label>Student Name</label>
                      <input
                        type="text"
                        placeholder="Enter full name"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Roll Number</label>
                      <input
                        type="text"
                        placeholder="e.g. JEE2024-123456"
                        value={studentRoll}
                        onChange={(e) => setStudentRoll(e.target.value)}
                        required
                      />
                    </div>
                    <button type="submit" className="upload-submit-btn" disabled={studentLoading || !studentName.trim() || !studentRoll.trim()}>
                      {studentLoading ? (
                        <><RefreshCw className="spinner-icon" size={16} /> Adding...</>
                      ) : (
                        <><UserPlus size={16} /> Add Student</>
                      )}
                    </button>
                  </form>
                </div>

                <div className="admin-card">
                  <h3><Upload size={18} /> Import Students CSV</h3>
                  <p className="card-subtitle">Upload a CSV file with columns: <strong>Name, RollNumber</strong></p>

                  <div
                    className={`drag-drop-zone ${studentDragOver ? 'drag-active' : ''}`}
                    onDragOver={(e) => { e.preventDefault(); setStudentDragOver(true); }}
                    onDragLeave={() => setStudentDragOver(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setStudentDragOver(false);
                      const file = e.dataTransfer.files[0];
                      if (file) handleStudentFileImport(file);
                    }}
                    onClick={() => studentFileInputRef.current.click()}
                  >
                    <Upload className="upload-cloud-icon" size={36} />
                    <p className="drag-text-primary">Drag & Drop <strong>.csv</strong> here</p>
                    <p className="drag-text-secondary">or click to browse</p>
                    <input
                      type="file"
                      ref={studentFileInputRef}
                      accept=".csv"
                      onChange={(e) => {
                        if (e.target.files[0]) handleStudentFileImport(e.target.files[0]);
                        e.target.value = '';
                      }}
                      style={{ display: 'none' }}
                    />
                  </div>

                  <div className="csv-template-box">
                    <h4>CSV Template</h4>
                    <pre className="json-template csv-template">{`Name,RollNumber\nRahul Sharma,JEE2024-100001\nPriya Singh,JEE2024-100002\nAmit Kumar,JEE2024-100003`}</pre>
                  </div>
                </div>
              </div>

              {/* Right: Students Table */}
              <div className="students-right-panel">
                <div className="admin-card table-section-card">
                  <div className="table-header-controls">
                    <h3><Users size={18} /> Allowed Students Registry</h3>
                    <div className="filters-container">
                      <div className="search-bar-wrapper">
                        <Search size={16} className="search-icon" />
                        <input
                          type="text"
                          placeholder="Search name or roll number..."
                          value={studentSearchQuery}
                          onChange={(e) => setStudentSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="results-table-wrapper">
                    {filteredStudents.length === 0 ? (
                      <div className="empty-table-state">
                        <AlertCircle size={40} className="empty-icon" />
                        <p>No students registered yet. Add students manually or import a CSV.</p>
                      </div>
                    ) : (
                      <table className="results-data-table">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Roll Number</th>
                            <th>Added On</th>
                            <th className="actions-header">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredStudents.map((s, idx) => (
                            <tr key={s.id}>
                              <td>{idx + 1}</td>
                              <td className="name-cell">{s.name}</td>
                              <td className="roll-no-cell">{s.rollNumber}</td>
                              <td className="date-cell">{new Date(s.createdAt).toLocaleDateString()}</td>
                              <td className="action-cells">
                                <button
                                  onClick={() => handleDeleteStudent(s.id, s.rollNumber)}
                                  className="action-btn delete-btn"
                                  title="Remove student"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* STUDENT RESULT DETAILS MODAL */}
      {selectedResult && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-card">
            
            {/* Modal Header */}
            <div className="modal-header">
              <div>
                <h2>Exam Submission Sheet</h2>
                <span className="roll-number">Roll Number: <strong>{selectedResult.rollNumber}</strong></span>
              </div>
              <button className="modal-close-btn" onClick={() => setSelectedResult(null)}>
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="modal-body">
              
              {/* Candidate Info Grid */}
              <div className="candidate-modal-info">
                <div className="info-block">
                  <span className="label">Name</span>
                  <span className="val">{selectedResult.name}</span>
                </div>
                <div className="info-block">
                  <span className="label">Exam Set</span>
                  <span className="val">{selectedResult.examSet}</span>
                </div>
                <div className="info-block">
                  <span className="label">Status</span>
                  <span className="val uppercase font-bold">{selectedResult.attempt?.status || 'in-progress'}</span>
                </div>
                <div className="info-block">
                  <span className="label">Started At</span>
                  <span className="val">{new Date(selectedResult.attempt?.startedAt).toLocaleTimeString()}</span>
                </div>
                <div className="info-block">
                  <span className="label">Submitted At</span>
                  <span className="val">
                    {selectedResult.attempt?.submittedAt 
                      ? new Date(selectedResult.attempt.submittedAt).toLocaleTimeString() 
                      : 'Active Attempt'}
                  </span>
                </div>
                <div className="info-block">
                  <span className="label">Time Taken</span>
                  <span className="val">
                    {selectedResult.attempt?.timeTakenSecs 
                      ? `${Math.round(selectedResult.attempt.timeTakenSecs / 60)} minutes` 
                      : 'Ongoing Session'}
                  </span>
                </div>
              </div>

              {/* Performance Summary Cards */}
              <div className="performance-summary-grid">
                <div className="score-summary-circle-container">
                  <div className="score-summary-circle">
                    <span className="obtained-score">{selectedResult.attempt?.score ?? 0}</span>
                    <span className="divider-score">/</span>
                    <span className="max-score-denom">{selectedResult.attempt?.maxScore ?? 0}</span>
                  </div>
                  <div className="score-text-label">Final Marks Obtained</div>
                </div>

                <div className="numeric-breakdown-card">
                  <h4>Statistics Summary</h4>
                  <div className="stat-breakdown-row">
                    <span className="row-label">Correct Answers (+4 each):</span>
                    <span className="row-val text-green font-semibold">+{selectedResult.attempt?.correct ?? 0} ({((selectedResult.attempt?.correct ?? 0)*4)} Marks)</span>
                  </div>
                  <div className="stat-breakdown-row">
                    <span className="row-label">Wrong Answers (-1 each):</span>
                    <span className="row-val text-red font-semibold">-{selectedResult.attempt?.incorrect ?? 0} (-{selectedResult.attempt?.incorrect ?? 0} Marks)</span>
                  </div>
                  <div className="stat-breakdown-row">
                    <span className="row-label">Unanswered (0 each):</span>
                    <span className="row-val text-muted">{selectedResult.attempt?.totalNotAnswered ?? 0}</span>
                  </div>
                  <div className="stat-breakdown-row total-row">
                    <span className="row-label">Percentage Accuracy:</span>
                    <span className="row-val font-bold text-accent">{selectedResult.attempt?.accuracy ?? 0}%</span>
                  </div>
                </div>
              </div>

              {/* Topic Performance List */}
              <div className="topic-performance-section">
                <h3>Subject Topic Performance</h3>
                <div className="topic-grid">
                  {calculateTopicAnalysis(selectedResult.attempt).map(t => (
                    <div className="topic-stat-box" key={t.topic}>
                      <div className="topic-stat-header">
                        <span className="topic-name">{t.topic}</span>
                        <span className="topic-fraction">{t.correct} / {t.total} Correct</span>
                      </div>
                      <div className="topic-progress-bar-bg">
                        <div 
                          className="topic-progress-bar-fill" 
                          style={{ 
                            width: `${t.accuracy}%`, 
                            backgroundColor: t.accuracy >= 75 ? '#10b981' : t.accuracy >= 45 ? '#f59e0b' : '#ef4444' 
                          }}
                        />
                      </div>
                      <span className="topic-percentage-label">{t.accuracy}% Accuracy</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Response Log audit */}
              <div className="response-audit-section">
                <h3>Question Response Log Audit</h3>
                <div className="responses-list">
                  {selectedResult.attempt?.responses && selectedResult.attempt.responses.length > 0 ? (
                    selectedResult.attempt.responses.map((resp, i) => {
                      const isCorrect = (resp.status === 'answered' || resp.status === 'answered-marked') && resp.selectedOption === resp.correctOption;
                      const isUnanswered = !resp.selectedOption;
                      const isIncorrect = !isUnanswered && !isCorrect;

                      return (
                        <div key={resp.id} className={`response-audit-card ${isCorrect ? 'border-green' : isIncorrect ? 'border-red' : 'border-gray'}`}>
                          <div className="response-audit-header">
                            <span className="question-no-badge">Q {i + 1}</span>
                            <span className="question-topic-badge">{resp.topic}</span>
                            {isCorrect && <span className="score-delta badge-green">+4 Marks</span>}
                            {isIncorrect && <span className="score-delta badge-red">-1 Mark</span>}
                            {isUnanswered && <span className="score-delta badge-gray">0 Marks</span>}
                          </div>
                          
                          <p className="resp-question-text">{resp.questionText}</p>
                          
                          <div className="options-audit-grid">
                            {resp.options.map((opt, oIdx) => {
                              const optionNum = oIdx + 1;
                              const isSelected = resp.selectedOption === optionNum;
                              const isCorrectOption = resp.correctOption === optionNum;

                              let optClass = '';
                              if (isCorrectOption) optClass = 'opt-correct';
                              else if (isSelected && isIncorrect) optClass = 'opt-incorrect';
                              else if (isSelected) optClass = 'opt-selected';

                              return (
                                <div key={oIdx} className={`option-audit-row ${optClass}`}>
                                  <span className="option-letter">{String.fromCharCode(65 + oIdx)}.</span>
                                  <span className="option-text">{opt}</span>
                                  {isCorrectOption && <span className="answer-indicator-text">(Correct Answer)</span>}
                                  {isSelected && <span className="answer-indicator-text">(Student Choice)</span>}
                                </div>
                              );
                            })}
                          </div>
                          <div className="status-meta">
                            <span>Status: <strong>{resp.status}</strong></span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="no-responses-meta">No question responses stored for this attempt.</p>
                  )}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="modal-footer-bar">
              <button className="modal-close-action-btn" onClick={() => setSelectedResult(null)}>
                Close Audit Sheet
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
