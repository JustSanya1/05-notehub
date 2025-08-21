import axios from "axios"
import type {Note} from "../types/note"

interface fetchResult{
    notes: Note[],
    totalPages: number,
}

interface headersParams{
    headers: {
        Authorization: string,
    }
}

interface FetchParams extends headersParams{
    params: {
        page: number,
        search: string,
        perPage: number,
    }
}
interface CreateBody{
    title: string,
    content: string,
    tag:string,
}

export async function fetchNotes(keyWord: string, page: number): Promise<fetchResult>{
const fetchParams:FetchParams = {
  params: {
    page: page,
    search: keyWord,
    perPage: 12, 
  },
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
  }
}

const fetchResponse = await axios.get<fetchResult>('https://notehub-public.goit.study/api/notes', fetchParams)
return fetchResponse.data;
}

export async function createNote({ title, content, tag }:CreateBody): Promise<Note> {
    const createBody: CreateBody = {
        title: title,
        content: content,
        tag: tag,
    }

    const createResponse = await axios.post<Note>('https://notehub-public.goit.study/api/notes', createBody,  {headers: {Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`}})
    return createResponse.data;
}

export async function deleteNote(id: string):Promise<Note> {
    const deleteResponse = await axios.delete<Note>(`https://notehub-public.goit.study/api/notes/${id}`,
    { headers: { Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`}})
    return deleteResponse.data;
}