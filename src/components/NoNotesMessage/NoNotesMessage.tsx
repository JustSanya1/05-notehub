import css from "./NoNotesMessage.module.css"
export default function NoNotesMessage() {
    return (
        <p className={css.text}>Zero notes found by given query, please try again...</p>
    )
}