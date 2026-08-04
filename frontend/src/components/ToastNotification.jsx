export function ToastNotification({ toasts, onDismiss }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type || 'info'}`}>
          <span className="toast-icon">
            {t.type === 'success' ? '✓' : t.type === 'alert' ? '⚠' : 'ℹ'}
          </span>
          <div className="toast-body">
            <strong>{t.title}</strong>
            {t.message && <p>{t.message}</p>}
          </div>
          <button className="toast-close" onClick={() => onDismiss(t.id)}>✕</button>
        </div>
      ))}
    </div>
  )
}
