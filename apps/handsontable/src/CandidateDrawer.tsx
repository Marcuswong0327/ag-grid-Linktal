import type { ReactNode } from "react";
import type { Candidate } from "./data";

interface Props {
  candidate: Candidate & { company: string };
  onClose: () => void;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="drawer__field">
      <label>{label}</label>
      <div className="drawer__value">{children}</div>
    </div>
  );
}

export function CandidateDrawer({ candidate, onClose }: Props) {
  return (
    <aside className="drawer" role="complementary" aria-label="Candidate profile">
        <header className="drawer__header">
          <div className="drawer__avatar">
            {candidate.firstName[0]}
            {candidate.lastName[0]}
          </div>
          <div className="drawer__header-text">
            <h2>{candidate.name}</h2>
            <p className="muted">
              {candidate.currentTitle} @ {candidate.currentCompany}
            </p>
          </div>
          <button className="drawer__close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </header>

        <div className="drawer__body">
          <Field label="Candidate ID">{candidate.candidateId}</Field>

          <Field label="Current Stage">
            <span className={`badge badge--${candidate.stage}`}>
              {candidate.stage}
            </span>
          </Field>

          <Field label="Job">
            {candidate.job}
            <span className="muted"> @ {candidate.company}</span>
          </Field>

          <Field label="Email">
            <a href={`mailto:${candidate.email}`}>{candidate.email}</a>
          </Field>

          <Field label="Phone">{candidate.phone}</Field>

          <Field label="Location">{candidate.location}</Field>

          <Field label="Availability">{candidate.availability}</Field>

          <Field label="Expected Salary">
            {candidate.expectedSalary.toLocaleString(undefined, {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0,
            })}
          </Field>

          <Field label="Source">
            <span className="tag tag--source">{candidate.source}</span>
          </Field>

          <Field label="Applied Date">{candidate.appliedDate}</Field>

          <Field label="Last Contacted">{candidate.lastContacted}</Field>

          <Field label="Next Follow-up">{candidate.nextFollowUp}</Field>

          <Field label="Education">{candidate.education}</Field>

          <Field label="Years Experience">{candidate.years} years</Field>

          <Field label="Rating">
            {"★".repeat(candidate.rating)}
            <span className="muted"> ({candidate.rating}/5)</span>
          </Field>

          <Field label="CV">
            {candidate.hasCv ? (
              <span className="tag tag--cv">📎 Resume attached</span>
            ) : (
              <span className="muted">No CV uploaded</span>
            )}
          </Field>

          <Field label="Skills">
            <div className="chips">
              {candidate.skills.map((s) => (
                <span key={s} className="chip">
                  {s}
                </span>
              ))}
            </div>
          </Field>

          <Field label="Work History">
            <ul className="timeline">
              {candidate.history.map((h, i) => (
                <li key={i}>
                  <b>{h.role}</b> — {h.company}{" "}
                  <span className="muted">({h.period})</span>
                </li>
              ))}
            </ul>
          </Field>

          <Field label="Notes">
            <p className="drawer__notes">{candidate.notes}</p>
          </Field>
        </div>
      </aside>
  );
}
