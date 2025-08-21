import type { FormikHelpers } from "formik";

export interface InitialFormValues{
    title: string,
    content: string,
    tag:string,
}
export interface NoteFormProps{
    onSubmit: (values: InitialFormValues, actions: FormikHelpers<InitialFormValues>) => void;
    closeModal: () => void;
}