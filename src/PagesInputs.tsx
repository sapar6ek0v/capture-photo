/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */

import { useEffect, useState } from "react";

/* eslint-disable @typescript-eslint/no-unused-vars */
interface Props {
  value: any;
  setValue: any;
  setValues: any;
}

export default function PagesInputs({ value, setValue, setValues }: Props) {
  const [pages, setPages] = useState<Array<ReturnType<typeof setValues>>>(value && value.length ? value : [setValues()]);
  const [pageIndex, setPageIndex] = useState<number>(0);

  const onPageChange = (key: string) => (event: any) => {
    pages[pageIndex][key] = event.target.value;
    setPages(() => [...pages]);
  };

  const keys = pages && pages.length ? pages.map(el => Object.keys(el)) : [];

  useEffect(() => {
    setValue(pages);
  }, [pages]);

  return (
    <div>
      {pages && pages.map((_, idx) => (
        <button key={idx} onClick={() => setPageIndex(idx)}>page {idx + 1}</button>
      ))}
      <button onClick={() => setPages([...pages, setValues()])}>Добавить страницу</button>
      {pages && pages.length > 1 ?
        <button onClick={() => setPages(pages.filter((_, idx) => idx !== pageIndex))}>Удалить страницу</button> : null}
      <div>
        {pages && pages.length &&
          <div>
            <input
              type="text"
              value={pages[pageIndex] && pages[pageIndex][keys[pageIndex][1]] ? pages[pageIndex][keys[pageIndex][1]] : ''}
              onChange={onPageChange(keys[pageIndex] ? keys[pageIndex][1] : '')}
            />
            <textarea
              value={pages[pageIndex] && pages[pageIndex][keys[pageIndex][2]] ? pages[pageIndex][keys[pageIndex][2]] : ''}
              onChange={onPageChange(keys[pageIndex] ? keys[pageIndex][2] : '')}
            ></textarea>
          </div>
        }
      </div>
    </div>
  )
}
