import React, { useState, useRef, useEffect } from 'react';
import { uploadPolicy, fetchPolicyByCategory, updatePolicyByCategory } from '../services/api';

const TEMPLATE = {
  category: 'accessories',
  title: 'Accessories Return Policy',
  icon: '👜',
  sections: [
    {
      heading: 'Return Window',
      content: 'Accessories may be returned within 30 days of purchase in original condition.',
    },
    {
      heading: 'Non-Returnable Items',
      content: 'Personalized accessories and engraved items are non-returnable.',
    },
  ],
};

export default function UploadModal({ onClose, onSuccess, editingCategory }) {
  const [mode, setMode] = useState('form'); // 'form' | 'json' | 'file'
  const [jsonText, setJsonText] = useState(JSON.stringify(TEMPLATE, null, 2));
  const [form, setForm] = useState({
    category: '',
    title: '',
    icon: '📄',
    sections: [{ heading: '', content: '' }],
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!editingCategory);
  const [error, setError] = useState('');

  // File upload state
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (editingCategory) {
      setInitialLoading(true);
      fetchPolicyByCategory(editingCategory)
        .then((policy) => {
          // Exclude internal id and _id fields for the JSON text editor
          const { id, _id, __v, createdAt, updatedAt, sections, ...rest } = policy;
          const cleanSections = sections.map((s) => ({ heading: s.heading, content: s.content }));
          const cleanPolicy = { ...rest, sections: cleanSections };

          setForm(cleanPolicy);
          setJsonText(JSON.stringify(cleanPolicy, null, 2));
        })
        .catch(() => setError('Failed to load policy data.'))
        .finally(() => setInitialLoading(false));
    }
  }, [editingCategory]);

  const handleAddSection = () => {
    setForm((f) => ({ ...f, sections: [...f.sections, { heading: '', content: '' }] }));
  };

  const handleRemoveSection = (index) => {
    setForm((f) => ({
      ...f,
      sections: f.sections.filter((_, i) => i !== index),
    }));
  };

  const handleSectionChange = (i, field, val) => {
    setForm((f) => {
      const sections = [...f.sections];
      sections[i] = { ...sections[i], [field]: val };
      return { ...f, sections };
    });
  };

  // ── File handling ──
  const processFile = (file) => {
    setError('');
    const allowedTypes = ['application/json', 'text/plain'];
    const allowedExts = ['.json', '.txt'];
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();

    if (!allowedTypes.includes(file.type) && !allowedExts.includes(ext)) {
      setError('Only .json and .txt files are supported.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be under 5MB.');
      return;
    }

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      setFilePreview(content.substring(0, 1000) + (content.length > 1000 ? '\n...' : ''));
    };
    reader.readAsText(file);
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
  };

  const clearFile = () => {
    setSelectedFile(null);
    setFilePreview('');
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const parseFileContent = (content, fileName) => {
    const ext = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();

    if (ext === '.json') {
      return JSON.parse(content);
    }

    // For .txt files, auto-structure into a policy
    const baseName = fileName.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    const lines = content.split('\n').filter((l) => l.trim());

    // Try to split into sections by blank-line-separated paragraphs
    const paragraphs = content.split(/\n\s*\n/).filter((p) => p.trim());
    const sections = paragraphs.map((p, i) => {
      const sectionLines = p.trim().split('\n');
      const heading = sectionLines[0].replace(/^#+\s*/, '').trim();
      const body = sectionLines.length > 1 ? sectionLines.slice(1).join('\n').trim() : heading;
      return {
        heading: sectionLines.length > 1 ? heading : `Section ${i + 1}`,
        content: sectionLines.length > 1 ? body : p.trim(),
      };
    });

    return {
      category: baseName.toLowerCase(),
      title: `${baseName.charAt(0).toUpperCase() + baseName.slice(1)} Return Policy`,
      icon: '📄',
      sections: sections.length > 0 ? sections : [{ heading: 'Policy Content', content }],
    };
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      let payload;

      if (mode === 'file') {
        if (!selectedFile) throw new Error('Please select a file first.');
        const content = await selectedFile.text();
        payload = parseFileContent(content, selectedFile.name);
      } else if (mode === 'json') {
        payload = JSON.parse(jsonText);
      } else {
        payload = form;
      }

      if (!payload.category || !payload.title || !payload.sections?.length) {
        throw new Error('category, title, and at least one section are required.');
      }

      if (editingCategory) {
        await updatePolicyByCategory(editingCategory, payload);
      } else {
        await uploadPolicy(payload);
      }

      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Operation failed.');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="modal-overlay">
        <div className="modal" style={{ alignItems: 'center', justifyContent: 'center', height: 200 }}>
          <div className="spinner" style={{ borderColor: 'var(--border)', borderTopColor: 'var(--accent)', width: 32, height: 32, borderWidth: 3 }}></div>
          <p style={{ marginTop: 16, color: 'var(--text-secondary)' }}>Loading policy...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>{editingCategory ? 'Edit Policy Document' : 'Upload Policy Document'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-tabs">
          <button className={`modal-tab ${mode === 'form' ? 'active' : ''}`} onClick={() => setMode('form')}>
            Form Builder
          </button>
          <button className={`modal-tab ${mode === 'json' ? 'active' : ''}`} onClick={() => setMode('json')}>
            JSON Upload
          </button>
          <button className={`modal-tab ${mode === 'file' ? 'active' : ''}`} onClick={() => setMode('file')}>
            File Upload
          </button>
        </div>

        <div className="modal-body">
          {mode === 'form' ? (
            <div className="form-fields">
              <div className="field-row">
                <div className="field">
                  <label>Category *</label>
                  <input
                    type="text"
                    placeholder="e.g. accessories"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  />
                </div>
                <div className="field field-sm">
                  <label>Icon (emoji)</label>
                  <input
                    type="text"
                    placeholder="👜"
                    value={form.icon}
                    onChange={(e) => setForm({ ...form, icon: e.target.value })}
                    maxLength={2}
                  />
                </div>
              </div>
              <div className="field">
                <label>Policy Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Accessories Return Policy"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              <div className="sections-builder">
                <label>Sections *</label>
                {form.sections.map((sec, i) => (
                  <div key={i} className="section-block">
                    <div className="section-block-header">
                      <div className="section-num">Section {i + 1}</div>
                      {form.sections.length > 1 && (
                        <button
                          className="section-remove-btn"
                          onClick={() => handleRemoveSection(i)}
                          title="Remove section"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      placeholder="Heading (e.g. Return Window)"
                      value={sec.heading}
                      onChange={(e) => handleSectionChange(i, 'heading', e.target.value)}
                    />
                    <textarea
                      placeholder="Policy content..."
                      value={sec.content}
                      onChange={(e) => handleSectionChange(i, 'content', e.target.value)}
                      rows={3}
                    />
                  </div>
                ))}
                <button className="add-section-btn" onClick={handleAddSection}>
                  + Add Section
                </button>
              </div>
            </div>
          ) : mode === 'json' ? (
            <div className="json-upload">
              <p className="json-hint">Paste or edit the JSON policy document below:</p>
              <textarea
                className="json-textarea"
                value={jsonText}
                onChange={(e) => setJsonText(e.target.value)}
                rows={16}
                spellCheck={false}
              />
            </div>
          ) : (
            <div className="file-upload">
              <div
                className={`file-dropzone ${dragOver ? 'drag-over' : ''} ${selectedFile ? 'has-file' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleFileDrop}
                onClick={() => !selectedFile && fileInputRef.current?.click()}
              >
                {selectedFile ? (
                  <div className="file-selected">
                    <div className="file-icon">📄</div>
                    <div className="file-info">
                      <span className="file-name">{selectedFile.name}</span>
                      <span className="file-size">
                        {(selectedFile.size / 1024).toFixed(1)} KB
                      </span>
                    </div>
                    <button className="file-clear-btn" onClick={(e) => { e.stopPropagation(); clearFile(); }}>
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="file-placeholder">
                    <div className="file-upload-icon">
                      <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <p className="file-drop-text">
                      <strong>Drop your file here</strong> or click to browse
                    </p>
                    <p className="file-drop-hint">Supports .json and .txt files (max 5MB)</p>
                  </div>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".json,.txt"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />

              {filePreview && (
                <div className="file-preview">
                  <div className="file-preview-label">File Preview</div>
                  <pre className="file-preview-content">{filePreview}</pre>
                </div>
              )}

              <div className="file-format-info">
                <div className="format-card">
                  <strong>.json</strong>
                  <span>Structured policy with category, title, icon, and sections array</span>
                </div>
                <div className="format-card">
                  <strong>.txt</strong>
                  <span>Plain text — auto-converted into sections by paragraphs</span>
                </div>
              </div>
            </div>
          )}

          {error && <div className="modal-error">{error}</div>}
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? (editingCategory ? 'Saving...' : 'Uploading...') : (editingCategory ? 'Save Changes' : 'Upload Policy')}
          </button>
        </div>
      </div>
    </div>
  );
}
