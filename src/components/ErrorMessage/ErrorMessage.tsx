import css from "./ErrorMessage.module.css"
export default function ErrorMessage() {
    return (
        <p className={css.text}>There was an error or zero notes found by given query, please try again...</p>
    )
}