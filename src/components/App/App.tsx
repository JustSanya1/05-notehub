import { useState } from 'react'
import css from './App.module.css'
import { keepPreviousData, useQuery} from '@tanstack/react-query';
import NoteList from '../NoteList/NoteList';
import Pagination from '../Pagination/Pagination';
import Modal from '../Modal/Modal';
import SearchBox from '../SearchBox/SearchBox';
import { useDebouncedCallback } from 'use-debounce';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import Loader from '../Loader/Loader';
import NoteForm from '../NoteForm/NoteForm';
import { fetchNotes } from '../../services/noteService';
import NoNotesMessage from '../NoNotesMessage/NoNotesMessage';

export default function App() {
  const [page, setPage] = useState<number>(1);
  const [query, setQuery] = useState<string>('');
  const [modalIsOpen, setModalState] = useState<boolean>(false);


  const { isLoading, isError, isFetching, data } = useQuery({
    queryKey: ['notes', page, query],
   queryFn: () => fetchNotes(query, page),
   placeholderData:keepPreviousData,
  })
  
  const notes = (data && data.notes) ? data.notes : [];  
  const totalPages = (data && data.notes) ? data.totalPages : 0;  


  const openModal = () => setModalState(true);
  const closeModal = () => setModalState(false);

  const onChange = useDebouncedCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(1)
    setQuery(event.target.value);
  }, 1000)


  return (
    <>
      <div className={css.app}>
        
	  <header className={css.toolbar}>
      <SearchBox onChange={onChange} query={query} />
		  <button className={css.button} onClick={() => openModal()} >Create note +</button>
      </header>
        
    {/* {(isFetching || isLoading) ? (<Loader />)
      : (isError || notes.length === 0)
        ? (<ErrorMessage />)
        : ()}  */}
      
        {(isFetching || isLoading) ? (<Loader />)
        : (isError ) ? (<ErrorMessage />)
        : (notes.length === 0) ? (<NoNotesMessage />)
        : (<>
          {notes.length > 1 && <Pagination totalPages={totalPages} page={page} setPage={setPage} />} 
          <NoteList notes={notes} />
          </>)
          }

  {modalIsOpen && <Modal children={<NoteForm closeModal={closeModal}/>} closeModal={closeModal} />}
</div>

    </>
  )
}
