import css from './SearchBox.module.css';

interface SearchBoxProps{
    query:string,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchBox({query, onChange}:SearchBoxProps) {
    return (
<input
  onChange={onChange}
  defaultValue={query}
  className={css.input}
  type="text"
  placeholder="Search notes"
 />
    )
}