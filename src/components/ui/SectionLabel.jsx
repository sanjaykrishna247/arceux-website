export default function SectionLabel({ index, children }) {
  return (
    <div className="section-label">
      <span className="section-label__index">{index}</span>
      <span className="section-label__rule" aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
}
