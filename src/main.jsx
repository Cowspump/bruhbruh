import React, { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Check, ChevronLeft, Copy, QrCode, Share } from 'lucide-react'
import './index.css'
import { requisites } from './data/document'

function AppHeader() {
  return (
    <header className="relative flex h-header shrink-0 items-center justify-center border-b border-[#f3f3f3]">
      <button
        type="button"
        aria-label="Назад"
        className="absolute left-2 flex h-11 w-11 items-center justify-center text-ink transition-transform active:scale-90"
        onClick={() => window.history.back()}
      >
        <ChevronLeft size={25} strokeWidth={1.8} />
      </button>
      <h1 className="text-[15px] font-semibold tracking-[-0.02em]">Удостоверение личности</h1>
    </header>
  )
}

function SegmentedControl({ value, onChange }) {
  return (
    <div className="flex h-10 rounded-control bg-track p-0.5" role="tablist" aria-label="Раздел документа">
      {[
        ['document', 'Документ'],
        ['details', 'Реквизиты'],
      ].map(([id, label]) => (
        <button
          key={id}
          type="button"
          role="tab"
          aria-selected={value === id}
          className={`flex-1 rounded-segment text-[13px] font-medium transition ${
            value === id ? 'bg-white text-ink shadow-sm' : 'text-[#3c3c3c]'
          }`}
          onClick={() => onChange(id)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

function DocumentView() {
  return (
    <div className="document-frame">
      <img src="/assets/udoF.png" alt="Удостоверение личности" />
    </div>
  )
}

async function copyValue(value) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value)
      return true
    }
  } catch {
    // Use the fallback below when clipboard permissions are unavailable.
  }

  const textarea = document.createElement('textarea')
  textarea.value = value
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()
  const copied = document.execCommand('copy')
  textarea.remove()
  return copied
}

function RequisiteRow({ label, value }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!await copyValue(value)) return
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1200)
  }

  return (
    <div className="requisite-row">
      <div className="min-w-0">
        <dt className="requisite-label">{label}</dt>
        <dd className="requisite-value">{value}</dd>
      </div>
      <button
        type="button"
        aria-label={`Скопировать: ${label}`}
        className={`copy-button active:bg-black/5 ${copied ? 'is-copied' : ''}`}
        onClick={handleCopy}
      >
        {copied ? <Check size={24} strokeWidth={1.75} /> : <Copy size={24} strokeWidth={1.75} />}
      </button>
      <span className="sr-only" aria-live="polite">{copied ? 'Скопировано' : ''}</span>
    </div>
  )
}

function DetailsView() {
  return (
    <div className="requisites-list">
      <dl>
        {requisites.map((requisite) => <RequisiteRow key={requisite.label} {...requisite} />)}
      </dl>
      <p className="requisites-note"></p>
    </div>
  )
}

function ActionButton({ variant, icon: Icon, children, onClick }) {
  return (
    <button
      type="button"
      className={`flex h-btn w-full items-center justify-center gap-2 rounded-btn text-[15px] font-semibold transition active:scale-[0.985] ${
        variant === 'primary'
          ? 'bg-primary text-white active:opacity-90'
          : 'border-2 border-primary-soft bg-white text-primary active:bg-primary-tint'
      }`}
      onClick={onClick}
    >
      <Icon size={20} strokeWidth={2} />
      {children}
    </button>
  )
}

function App() {
  const [tab, setTab] = useState('document')
  const [dialogOpen, setDialogOpen] = useState(false)
  const dialogRef = useRef(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (dialogOpen && !dialog.open) dialog.showModal()
    if (!dialogOpen && dialog.open) dialog.close()
  }, [dialogOpen])

  return (
    <main className="min-h-dvh bg-[#e8e8e8] sm:flex sm:items-center sm:justify-center sm:p-4">
      <div className="app-shell flex h-dvh w-full max-w-[430px] flex-col bg-white sm:h-[min(844px,calc(100dvh-32px))] sm:overflow-hidden sm:rounded-[30px] sm:shadow-[0_18px_45px_rgba(0,0,0,0.18)]">
        <AppHeader />
        <section className="content-scroll flex-1 overflow-y-auto overscroll-contain px-4 pt-4">
          <SegmentedControl value={tab} onChange={setTab} />
          <p className="mt-3 text-center text-[11px] text-[#969696]"></p>
          <div className="mt-4 pb-5">{tab === 'document' ? <DocumentView /> : <DetailsView />}</div>
        </section>
        <footer className={`shrink-0 bg-white px-4 pb-[max(16px,env(safe-area-inset-bottom))] ${tab === 'document' ? 'space-y-2.5 pt-3' : 'pt-3'}`}>
          {tab === 'document' ? (
            <>
              <ActionButton variant="primary" icon={QrCode} onClick={() => setDialogOpen(true)}>Предъявить документ</ActionButton>
              <ActionButton variant="secondary" icon={Share} onClick={() => setDialogOpen(true)}>Отправить документ</ActionButton>
            </>
          ) : (
            <ActionButton variant="secondary" icon={Share} onClick={() => setDialogOpen(true)}>Отправить реквизиты</ActionButton>
          )}
        </footer>
      </div>
      <dialog ref={dialogRef} onClose={() => setDialogOpen(false)}>
        <p>Учебная версия: действие не реализовано</p>
        <button type="button" onClick={() => setDialogOpen(false)}>Закрыть</button>
      </dialog>
    </main>
  )
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
