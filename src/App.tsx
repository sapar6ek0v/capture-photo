/* eslint-disable @typescript-eslint/no-explicit-any */
// import { useState } from 'react'
import './App.css'
// import PagesInputs from './PagesInputs';
import { TakePhoto } from './TakePhoto';

export class Page {
  id: number = 0;
  title: string = '';
  text: string = '';
}

function App() {
  // const [count, setCount] = useState({
  //   title: '',
  //   pages: localStorage.getItem('pages') ? JSON.parse(localStorage.getItem('pages') || '') : [],
  // });

  // const [pages, setPages] = useState({
  //   title: '',
  //   pages: [{ id: 0, title: 'teet', text: 'tetet' }, { id: 0, title: 'ete', text: 'tetee' }],
  // });

  // const handlePagesChange = (value: any) => {
  //   setCount(() => ({ ...count, pages: value }));
  //   localStorage.setItem('pages', JSON.stringify(value));
  // }

  // const handleUpdatePagesChange = (value: any) => {
  //   setPages(() => ({ ...count, pages: value }));
  // }
  // console.log(count.pages)
  return (
    <>
      {/* <div>
        <h1>create pages</h1>
        <PagesInputs value={count.pages} setValue={handlePagesChange} setValues={() => new Page()} />
      </div>
      <div>
        <h1>update pages</h1>
        <PagesInputs value={pages.pages} setValue={handleUpdatePagesChange} setValues={() => new Page()} />
      </div> */}
      <TakePhoto />
    </>
  )
}

export default App
