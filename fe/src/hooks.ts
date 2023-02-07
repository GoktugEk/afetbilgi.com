/* eslint-disable no-restricted-syntax */

import axios from "axios";
import { useQuery } from "react-query";
// import { Theme, useMediaQuery } from '@mui/material'

import { TreeNodeType } from "./variables/TreeNode";

const dataPoints = [
  { name: 'Geçici Barınma Alanları', path: 'barinma.json' },
  { name: 'Güvenli Toplanma Alanları', path: 'toplanma.json' },
  { name: 'Para Bağışı İmkanları', path: 'bagis.json' },
  { name: 'Eşya Bağışı İmkanları', path: 'yardim_toplama_merkezleri.json' },
];

const baseQuestionData = Promise.all(dataPoints.map(async (dp) => {
  const res = await axios.get(`https://raw.githubusercontent.com/alpaylan/afetbilgi.com/main/data/${dp.path}?v=2`);

  return res.data;
})).then((data) => ({
    type: 'question',
    text: 'Lütfen bilgi almak istediğiniz konuyu seçiniz.',
    options: dataPoints.map((dp, i) => ({
      name: dp.name,
      value: data[i],
    }))
  })
);

export const useQuestionData = (paths: string[]) => useQuery(`questionData-${paths.join(',')}`, async () => {
  let currNode = await baseQuestionData;

  for (const path of paths) {
    if (currNode.type !== TreeNodeType.NODE_TYPE_QUESTION) {
      throw new Error('this is not a question node');
    }

    const decodedPath = decodeURIComponent(path);

    currNode = currNode.options.find(o => o.name === decodedPath)?.value as any;
  }

  return currNode;
});

// export const useMobile = () => {
//   const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

//   return isMobile;
// };
