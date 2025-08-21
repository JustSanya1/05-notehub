import { createPortal } from "react-dom";
import css from "./Modal.module.css";
import { useEffect } from "react";


interface ModalProps
{
  children: React.ReactNode;
  closeModal: () => void;
}

export default function Modal({ children, closeModal }: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
  
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
    }, [closeModal]);

    const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) {
        closeModal();
      }
    };


    return createPortal(
<div
  className={css.backdrop}
  role="dialog"
  aria-modal="true"
  onClick={e => handleBackdropClick(e)}      
>
  <div className={css.modal}>
    {children}
  </div>
</div>,
document.body)
}