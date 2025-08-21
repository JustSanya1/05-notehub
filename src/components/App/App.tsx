import { useState,useEffect } from 'react'
import css from './App.module.css'
import { keepPreviousData, useQuery, useMutation, useQueryClient} from '@tanstack/react-query';
import { createNote, deleteNote, fetchNotes } from '../../services/noteService';
import NoteList from '../NoteList/NoteList';
import Pagination from '../Pagination/Pagination';
import Modal from '../Modal/Modal';
import type { FormikHelpers } from 'formik';
import type { InitialFormValues } from '../../types/form';
import SearchBox from '../SearchBox/SearchBox';
import { useDebouncedCallback } from 'use-debounce';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import Loader from '../Loader/Loader';


export default function App() {
  const [page, setPage] = useState<number>(1);
  const [query, setQuery] = useState<string>('');
  const [modalIsOpen, setModalState] = useState<boolean>(false);
	const queryClient = useQueryClient();



  const { isLoading, isError, isFetching, data } = useQuery({
    queryKey: ['repoData', page, query],
   queryFn: () => fetchNotes(query, page),
   placeholderData:keepPreviousData,
  })

  const mutation = useMutation({
    mutationFn:(newNote:InitialFormValues) => createNote(newNote),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repoData'] });
      console.log('all good while mutating')
    },
    onError: () => { console.log('error while mutating') } }
  )
  
  const mutationDelete = useMutation({
    mutationFn:(id:string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['repoData'] });
      console.log('all good while mutating')
    },
    onError: () => { console.log('error while mutating') } }
)
  
  
  const notes = (data && data.notes) ? data.notes : [];  
  const totalPages = (data && data.notes) ? data.totalPages : 0;  

  const onSubmit= (values: InitialFormValues, actions: FormikHelpers<InitialFormValues>) => {
    actions.resetForm()
    mutation.mutate(values)
    closeModal()
    
  }
  const openModal = () => setModalState(true);
  const closeModal = () => setModalState(false);
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  };

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
  }, [modalIsOpen]);
  
  const  onDelete = (id: string) => {
    mutationDelete.mutate(id);
  }


  const onChange = useDebouncedCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  }, 1000)



  return (
    <>
      <div className={css.app}>
        
	  <header className={css.toolbar}>
      <SearchBox onChange={onChange} query={query} />
		  <button className={css.button} onClick={() => openModal()} >Create note +</button>
      </header>
        
    {(isFetching || isLoading) ? (<Loader />)
      : (isError || notes.length === 0)
        ? (<ErrorMessage />)
        : (<>
            <Pagination totalPages={totalPages} page={page} setPage={setPage} /> 
            <NoteList notes={notes} onDelete={onDelete} />
          </>)} 
      
        
  {modalIsOpen && <Modal onSubmit={onSubmit} closeModal={closeModal} handleBackdropClick={handleBackdropClick}/>}
</div>

    </>
  )
}
