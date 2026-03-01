import { useState } from 'react';

export function useModal() {
    const [modal, setModal] = useState({ open: false, title: '', message: '', type: 'info', onConfirm: null });

    const openModal = (title, message, type = 'info', onConfirm = null) => {
        setModal({ open: true, title, message, type, onConfirm });
    };

    const closeModal = () => {
        setModal({ ...modal, open: false });
    };

    const handleConfirm = () => {
        if (modal.onConfirm) modal.onConfirm();
        closeModal();
    };

    return { modal, openModal, closeModal, handleConfirm };
}

export default function Modal({ modal, onClose, onConfirm }) {
    if (!modal.open) return null;

    return (
        <div className={`modal-overlay ${modal.open ? 'open' : ''}`} onClick={onClose}>
            <div className={`modal ${modal.type}`} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
                <div className="modal-header">
                    <div className="modal-title">{modal.title}</div>
                    <button className="modal-close" onClick={onClose} aria-label="Close modal">✕</button>
                </div>
                <div className="modal-body">{modal.message}</div>
                <div className="modal-footer">
                    <button className="btn-outline" onClick={onClose}>Cancel</button>
                    <button className="btn-primary" onClick={onConfirm}>Confirm</button>
                </div>
            </div>
        </div>
    );
}
