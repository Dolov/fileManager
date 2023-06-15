import React, { FC } from 'react'
import FileManager from 'file-manager';
import type { FileManagerProps } from 'file-manager'


export interface DemoProps {
  
}

const data: FileManagerProps["data"] = [
  {
    id: "1",
    name: "v1",
    leaf: false,
    children: [
      {
        name: 'react使用说明.md',
        leaf: true,
      },
    ]
  },
  {
    id: "2",
    name: "v2",
    leaf: false,
    children: [
      {
        id: "12",
        name: 'react使用说明.md',
        leaf: true,
      },
    ]
  },
  {
    id: "3",
    name: "v3",
    leaf: false,
    children: [
      {
        name: 'react使用说明.md',
        leaf: true,
      },
    ]
  },
  {
    id: "121212",
    name: "v4",
    leaf: false,
    children: [
      {
        id: "12121a2",
        name: 'react使用说明.md',
        leaf: true,
      },
    ]
  },
  {
    id: "12121ba2",
    name: "v5",
    leaf: false,
    children: [
      {
        id: "12121baa2",
        name: 'react使用说明.md',
        leaf: true,
      },
    ]
  },
  {
    name: "v6",
    id: "12121baab2",
    leaf: false,
    children: [
      {
        id: "121a21baab2",
        name: 'react使用说明.md',
        leaf: true,
      },
    ]
  },
  {
    id: "121a21babab2",
    name: '会议纪要.docx',
    leaf: true,
  },
  {
    id: "121a21bfafabab2",
    name: '会议纪要1.xls',
    leaf: true,
  },
  {
    id: "121a21bafafafabab2",
    name: '会议纪要2.xls',
    leaf: true,
  },{
    id: "121a21baafafafafabab2",
    name: '会议纪要3.xls',
    leaf: true,
  },{
    id: "121a21baafafafadfafabab2",
    name: '会议纪要4.xls',
    leaf: true,
  },
  {
    id: "121a21baafaafafadfafabab2",
    name: '会议纪要5.js',
    leaf: true,
  },
  {
    id: "121a21baaffadfafabab2",
    name: '会议纪要6.ts',
    leaf: true,
  },
  {
    id: "121a21baaffbaadfafabab2",
    name: '会议纪要7会议纪要7会议纪要7会议纪要7会议纪要7会议纪要7会议纪要7纪要7会议纪要7会议纪要7会议纪要7纪要7会议纪要7会议纪要7.jsx',
    leaf: true,
  },
  {
    id: "121a21baaffaafdfafabab2",
    name: '会议纪要8.ts',
    leaf: true,
  },
]

const Demo: FC<DemoProps> = (props) => {
  const {  } = props
  return (
    <FileManager data={data} />
  )
}

export default Demo
