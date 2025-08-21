import { Formik, Form, Field, ErrorMessage } from 'formik';
import css from './NoteForm.module.css';
import * as Yup from "yup";
import type { NoteTag } from '../../types/note';
import type { InitialFormValues } from '../../types/form';
import { createNote} from '../../services/noteService';
import { useMutation } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import type { FormikHelpers } from 'formik';

const initialValues:InitialFormValues = {
    title: "",
    content: "",
    tag: "Todo",
}
interface NoteFormProps{
    closeModal: () => void;
}

const FormSchema = Yup.object().shape({
    title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title is too long")
    .required("Title is required"),
    content: Yup.string()
    .max(500, "Content of note must contain below 500 symbols"),
    tag: Yup.mixed<NoteTag>()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
    .required("Tag is required"),
})


export default function NoteForm({closeModal}:NoteFormProps) {
    const queryClient = useQueryClient();

    const mutation = useMutation({
    mutationFn:(newNote:InitialFormValues) => createNote(newNote),
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['notes'] });
        closeModal()
    },
    onError: () => {} }
    )
    const onSubmit= (values: InitialFormValues, actions: FormikHelpers<InitialFormValues>) => {
    actions.resetForm()
    mutation.mutate(values)

  }
    
return (
<Formik initialValues={initialValues} onSubmit={onSubmit} validationSchema={FormSchema}>
    {({ isValid }) => (
        <Form className={css.form}>
            <div className={css.formGroup}>
                <label htmlFor="title">Title</label>
                <Field id="title" type="text" name="title" className={css.input} />
                <ErrorMessage component="span" name="title" className={css.error} />
            </div>

            <div className={css.formGroup}>
                <label htmlFor="content">Content</label>
                <Field
                    as="textarea"
                    id="content"
                    name="content"
                    rows={8}
                    className={css.textarea}
                />
                <ErrorMessage component="span" name="content" className={css.error} />
            </div>

            <div className={css.formGroup}>
                <label htmlFor="tag">Tag</label>
                <Field as="select" id="tag" name="tag" className={css.select}>
                    <option value="Todo">Todo</option>
                    <option value="Work">Work</option>
                    <option value="Personal">Personal</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Shopping">Shopping</option>
                </Field>
                <ErrorMessage component="span" name="tag" className={css.error} />
            </div>

            <div className={css.actions}>
                    <button onClick={() => closeModal()} type="button" className={css.cancelButton}>
                    Cancel
                </button>
                <button
                    type="submit"
                    className={css.submitButton}
                    disabled={!isValid}
                >
                    Create note
                </button>
            </div>
        </Form>)}
</Formik>
    )
}