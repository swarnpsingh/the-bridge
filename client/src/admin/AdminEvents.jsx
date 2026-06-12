import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  adminGetEvents,
  adminApproveEvent,
  adminDeleteEvent,
  adminAddEvent,
} from "../api";
import { useBreakpoint } from "../hooks/useBreakpoint";

const fmtDate = (s) =>
  s
    ? new Date(s).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

const Th = ({ children }) => (
  <th
    style={{
      padding: "10px 16px",
      fontSize: 11,
      fontWeight: 600,
      color: "var(--text-subtle)",
      textTransform: "uppercase",
      letterSpacing: ".04em",
      textAlign: "left",
    }}
  >
    {children}
  </th>
);

const Td = ({ children, style }) => (
  <td
    style={{
      padding: "12px 16px",
      fontSize: 13,
      color: "var(--text-muted)",
      ...style,
    }}
  >
    {children}
  </td>
);

const EMPTY_FORM = {
  title: "",
  description: "",
  date: "",
  time: "",
  format: "Online",
  location: "",
  host: "",
};

export default function AdminEvents() {
  const navigate = useNavigate();
  const { isMobile } = useResponsive();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminGetEvents();
      setEvents(Array.isArray(res.data) ? res.data : []);
    } catch {
      navigate("/admin/login", { replace: true });
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    load();
  }, [load]);

  const handleApprove = async (id) => {
    setActionLoading(id + "-a");
    try {
      await adminApproveEvent(id);
      setEvents((prev) =>
        prev.map((e) => (e._id === id ? { ...e, approved: true } : e)),
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event permanently?")) return;
    setActionLoading(id + "-d");
    try {
      await adminDeleteEvent(id);
      setEvents((prev) => prev.filter((e) => e._id !== id));
    } finally {
      setActionLoading(null);
    }
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!form.title || !form.date) {
      setFormError("Title and date are required.");
      return;
    }
    setSubmitting(true);
    setFormError("");
    try {
      const res = await adminAddEvent(form);
      setEvents((prev) => [res.data, ...prev]);
      setForm(EMPTY_FORM);
      setShowForm(false);
    } catch {
      setFormError("Failed to create event. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const pending = events.filter((e) => !e.approved);
  const approved = events.filter((e) => e.approved);

  const inputStyle = {
    width: "100%",
    padding: "9px 12px",
    border: "1px solid var(--border)",
    borderRadius: 8,
    fontSize: 13,
    background: "var(--surface-muted)",
    color: "var(--text-strong)",
    outline: "none",
    boxSizing: "border-box",
  };

  if (loading)
    return (
      <div
        style={{
          textAlign: "center",
          padding: "60px 0",
          color: "var(--text-subtle)",
          fontSize: 14,
        }}
      >
        Loading...
      </div>
    );

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 28,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "var(--text-strong)",
              letterSpacing: "-0.5px",
              marginBottom: 4,
            }}
          >
            Events
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-muted)" }}>
            {pending.length} pending · {approved.length} approved
          </p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          style={{
            padding: "9px 18px",
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 500,
            background: showForm ? "var(--surface-muted)" : "var(--brand)",
            color: showForm ? "var(--text-muted)" : "var(--brand-contrast)",
            border: "1px solid var(--border)",
            cursor: "pointer",
          }}
        >
          {showForm ? "Cancel" : "+ Add event"}
        </button>
      </div>

      {/* Add event form */}
      {showForm && (
        <div
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 14,
            padding: 24,
            marginBottom: 28,
          }}
        >
          <h2
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: "var(--text-strong)",
              marginBottom: 18,
            }}
          >
            New event (auto-approved)
          </h2>
          <form onSubmit={handleAddEvent}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: 14,
                marginBottom: 14,
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    fontWeight: 500,
                    color: "var(--text-muted)",
                    marginBottom: 5,
                  }}
                >
                  Title *
                </label>
                <input
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }
                  style={inputStyle}
                  required
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    fontWeight: 500,
                    color: "var(--text-muted)",
                    marginBottom: 5,
                  }}
                >
                  Host
                </label>
                <input
                  value={form.host}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, host: e.target.value }))
                  }
                  style={inputStyle}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    fontWeight: 500,
                    color: "var(--text-muted)",
                    marginBottom: 5,
                  }}
                >
                  Date *
                </label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, date: e.target.value }))
                  }
                  style={inputStyle}
                  required
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    fontWeight: 500,
                    color: "var(--text-muted)",
                    marginBottom: 5,
                  }}
                >
                  Time
                </label>
                <input
                  type="time"
                  value={form.time}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, time: e.target.value }))
                  }
                  style={inputStyle}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    fontWeight: 500,
                    color: "var(--text-muted)",
                    marginBottom: 5,
                  }}
                >
                  Format
                </label>
                <select
                  value={form.format}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, format: e.target.value }))
                  }
                  style={inputStyle}
                >
                  <option>Online</option>
                  <option>In-person</option>
                </select>
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    fontWeight: 500,
                    color: "var(--text-muted)",
                    marginBottom: 5,
                  }}
                >
                  Location
                </label>
                <input
                  value={form.location}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, location: e.target.value }))
                  }
                  style={inputStyle}
                />
              </div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: 500,
                  color: "var(--text-muted)",
                  marginBottom: 5,
                }}
              >
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                rows={3}
                style={{
                  ...inputStyle,
                  resize: "vertical",
                  fontFamily: "inherit",
                }}
              />
            </div>
            {formError && (
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: 8,
                  background: "var(--danger-soft)",
                  border:
                    "1px solid color-mix(in srgb, var(--danger) 24%, transparent)",
                  fontSize: 13,
                  color: "var(--danger)",
                  marginBottom: 14,
                }}
              >
                {formError}
              </div>
            )}
            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: "10px 24px",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                background: submitting ? "var(--text-subtle)" : "var(--brand)",
                color: "var(--brand-contrast)",
                border: "none",
                cursor: submitting ? "not-allowed" : "pointer",
              }}
            >
              {submitting ? "Creating..." : "Create event"}
            </button>
          </form>
        </div>
      )}

      {/* Pending */}
      {pending.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "var(--text-subtle)",
              textTransform: "uppercase",
              letterSpacing: ".06em",
              marginBottom: 10,
            }}
          >
            Pending approval — {pending.length}
          </div>
          <div
            className="table-scroll"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 14,
              overflow: "hidden",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr
                  style={{
                    borderBottom: "1px solid var(--border)",
                    background: "var(--surface-muted)",
                  }}
                >
                  <Th>Event</Th>
                  <Th>Submitted by</Th>
                  <Th>Date</Th>
                  <Th>Format</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {pending.map((event) => (
                  <tr
                    key={event._id}
                    style={{ borderBottom: "1px solid var(--border)" }}
                  >
                    <Td>
                      <div
                        style={{
                          fontWeight: 600,
                          color: "var(--text-strong)",
                          fontSize: 13,
                        }}
                      >
                        {event.title}
                      </div>
                      {event.description && (
                        <div
                          style={{
                            fontSize: 12,
                            color: "var(--text-subtle)",
                            marginTop: 2,
                            maxWidth: 220,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {event.description}
                        </div>
                      )}
                    </Td>
                    <Td>
                      <div>{event.submittedBy?.name || "—"}</div>
                      <div style={{ fontSize: 11 }}>
                        {event.submittedBy?.email || ""}
                      </div>
                    </Td>
                    <Td>{fmtDate(event.date)}</Td>
                    <Td>
                      <span
                        style={{
                          fontSize: 11,
                          padding: "3px 10px",
                          borderRadius: 20,
                          fontWeight: 500,
                          background:
                            event.format === "Online" ? "#dbeafe" : "#d1fae5",
                          color:
                            event.format === "Online" ? "#1e40af" : "#065f46",
                        }}
                      >
                        {event.format}
                      </span>
                    </Td>
                    <Td>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          onClick={() => handleApprove(event._id)}
                          disabled={!!actionLoading}
                          style={{
                            padding: "6px 14px",
                            borderRadius: 7,
                            fontSize: 12,
                            fontWeight: 600,
                            background: "#d1fae5",
                            color: "#065f46",
                            border: "1px solid #6ee7b7",
                            cursor: "pointer",
                          }}
                        >
                          {actionLoading === event._id + "-a"
                            ? "..."
                            : "Approve"}
                        </button>
                        <button
                          onClick={() => handleDelete(event._id)}
                          disabled={!!actionLoading}
                          style={{
                            padding: "6px 14px",
                            borderRadius: 7,
                            fontSize: 12,
                            fontWeight: 600,
                            background: "var(--danger-soft)",
                            color: "var(--danger)",
                            border:
                              "1px solid color-mix(in srgb, var(--danger) 30%, transparent)",
                            cursor: "pointer",
                          }}
                        >
                          {actionLoading === event._id + "-d"
                            ? "..."
                            : "Reject"}
                        </button>
                      </div>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Approved */}
      <div>
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "var(--text-subtle)",
            textTransform: "uppercase",
            letterSpacing: ".06em",
            marginBottom: 10,
          }}
        >
          Approved — {approved.length}
        </div>
        {approved.length === 0 ? (
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 14,
              padding: "32px 24px",
              textAlign: "center",
              color: "var(--text-subtle)",
              fontSize: 14,
            }}
          >
            No approved events yet.
          </div>
        ) : (
          <div
            className="table-scroll"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 14,
              overflow: "hidden",
            }}
          >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr
                  style={{
                    borderBottom: "1px solid var(--border)",
                    background: "var(--surface-muted)",
                  }}
                >
                  <Th>Event</Th>
                  <Th>Date</Th>
                  <Th>Format</Th>
                  <Th>RSVPs</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {approved.map((event) => (
                  <tr
                    key={event._id}
                    style={{ borderBottom: "1px solid var(--border)" }}
                  >
                    <Td>
                      <div
                        style={{
                          fontWeight: 600,
                          color: "var(--text-strong)",
                          fontSize: 13,
                        }}
                      >
                        {event.title}
                      </div>
                      {event.host && (
                        <div
                          style={{
                            fontSize: 12,
                            color: "var(--text-subtle)",
                            marginTop: 2,
                          }}
                        >
                          by {event.host}
                        </div>
                      )}
                    </Td>
                    <Td>{fmtDate(event.date)}</Td>
                    <Td>
                      <span
                        style={{
                          fontSize: 11,
                          padding: "3px 10px",
                          borderRadius: 20,
                          fontWeight: 500,
                          background:
                            event.format === "Online" ? "#dbeafe" : "#d1fae5",
                          color:
                            event.format === "Online" ? "#1e40af" : "#065f46",
                        }}
                      >
                        {event.format}
                      </span>
                    </Td>
                    <Td>{event.rsvps?.length ?? 0}</Td>
                    <Td>
                      <button
                        onClick={() => handleDelete(event._id)}
                        disabled={!!actionLoading}
                        style={{
                          padding: "6px 14px",
                          borderRadius: 7,
                          fontSize: 12,
                          fontWeight: 600,
                          background: "var(--danger-soft)",
                          color: "var(--danger)",
                          border:
                            "1px solid color-mix(in srgb, var(--danger) 30%, transparent)",
                          cursor: "pointer",
                        }}
                      >
                        {actionLoading === event._id + "-d" ? "..." : "Delete"}
                      </button>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
