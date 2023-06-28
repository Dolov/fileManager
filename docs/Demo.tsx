import React, { FC } from 'react'
import FileManager from 'react-file-manager';
import type { FileManagerProps } from 'react-file-manager'


export interface DemoProps {
  
}

const data: FileManagerProps["data"] = [
  {
    id: "1av",
    name: "v1",
    leaf: false,
    children: [
      {
        id: "sfa",
        name: '使用说明',
        leaf: false,
        children: [
          {
            name: 'reac12t使用说12明.md',
            leaf: true,
            id: "123azcvdfa",
            url: "https://dolov-upic.oss-cn-beijing.aliyuncs.com/README.md"
          },
        ]
      },
      {
        id: "asd.",
        name: 'reac12t使用说明.md',
        leaf: true,
        url: "https://dolov-upic.oss-cn-beijing.aliyuncs.com/README.md"
      },
    ]
  },
  {
    id: "2z",
    name: "v2",
    leaf: false,
    children: [
      {
        id: "1asdfb2",
        name: 'react使32用说明.md',
        leaf: true,
      },
    ]
  },
  {
    id: "3876fgs",
    name: "v3",
    leaf: false,
    children: [
      {
        name: 'react使用34说明.md',
        leaf: true,
      },
    ]
  },
  {
    id: "1212bb12",
    name: "v4",
    leaf: false,
    children: [
      {
        id: "12ss121a2",
        name: 'react使用说明.md',
        leaf: true,
      },
    ]
  },
  {
    id: "12121gsba2",
    name: "v5",
    leaf: false,
    children: [
      {
        id: "12121bxvbaa2",
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
        id: "121a2hdgd1baab2",
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
    id: "121a21zdvbfafabab2",
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
  {
    id: "121a21baaffaafdfafa12bab2",
    name: '.gitignore',
    leaf: true,
    url: 'https://dolov-upic.oss-cn-beijing.aliyuncs.com/.gitignore'
  },
  {
    id: "121a21baaffbab2",
    name: 'readme.md',
    leaf: true,
    url: "https://dolov-upic.oss-cn-beijing.aliyuncs.com/README.md"
  },
  {
    id: "121affbab2",
    name: 'shisongyan.jpg',
    leaf: true,
    url: "https://dolov-upic.oss-cn-beijing.aliyuncs.com/friends.png?Expires=1686901925&OSSAccessKeyId=TMP.3Kea52ie84UYgTzB6bEeCHJMPk8ukBUSNH3kWG3ogg41Lx91K635aSfXBcwXJiC3yDes5jHgSBpwmGjGqgSp5pGKQLir3d&Signature=xdhB%2B5S5ISqBKp6UQlLZimKAn7w%3D"
  },
  {
    id: "121affba12b2",
    name: 'shisongy1an.jpg',
    leaf: true,
    url: "https://dolov-upic.oss-cn-beijing.aliyuncs.com/img2excel-favicon.png"
  },
]

const Demo: FC<DemoProps> = (props) => {
  const {  } = props
  const [fileData, setFileData] = React.useState(data)

  const onRename = (file, newName) => {

  }

  const onChange = (files) => {
    setFileData(files)
  }

  return (
    <FileManager
      onRename={onRename}
      data={fileData}
      uploadUrl='https://upload.clickapaas.com/api/upload'
      onChange={onChange}
      // uploadUrl='http://localhost:3000/api/upload'
    />
  )
}

export default Demo
