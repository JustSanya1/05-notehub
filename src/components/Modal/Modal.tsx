import { createPortal } from "react-dom";
import css from "./Modal.module.css";
import NoteForm from "../NoteForm/NoteForm";
import type { NoteFormProps } from '../../types/form';

interface ModalProps extends NoteFormProps{
  handleBackdropClick: (e:React.MouseEvent<HTMLDivElement>) => void,
}

export default function Modal({ onSubmit, closeModal, handleBackdropClick}: ModalProps) {



    return createPortal(
<div
  className={css.backdrop}
  role="dialog"
  aria-modal="true"
  onClick={e => handleBackdropClick(e)}      
>
  <div className={css.modal}>
          <NoteForm onSubmit={onSubmit} closeModal={closeModal} />
  </div>
</div>,
document.body)
}