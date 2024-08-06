import { useRef } from "react";
import ReactQuill from 'react-quill'
// import { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import "./qill-editor-for-problem.scss";
// import ImageResize from './vendor.resize.js'

// import ImageUploader from 'quill-image-uploader'
// import Quill from "quill"
// import { getBaseUrlForServiceFromFrontend, SecurePost } from '@betaschool-reborn/vital-test/utils';
// import Image from 'quill/formats/image'



interface PropType {
  html: string,
  onChange: (htmlMakeUp: string) => void
}

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "imageBlot" // #5 Optinal if using custom formats
];

export function ProblemQuilEditor(props: PropType) {

  const handleProcedureContentChange = (content: any, delta: any, source: any, editor: any) => {
    // setHtmlMakeUp(content)
    if (source === 'user') props.onChange(content)
    // setUsedPlaceholderList(makeUpHtmlToPlaceListHolder(content))
  };

  const refEditor = useRef<any>()

  return (
        <ReactQuill ref={refEditor} value={props.html} formats={formats} modules={modules} onChange={handleProcedureContentChange} />
  )
}
// const upload = (file: any) => {
  // return new Promise((resolve, reject) => {
  //   _upload(file).then(({ url, meta }: any) => {
  //     resolve(url)
  //   }).catch(e => {
  //     reject(e)
  //   })
  // })
// }
// const _upload = (file: any) => {
//   console.log('before upload')
//   // return a Promise that resolves in a link to the uploaded image
//   return new Promise((resolve, reject) => {

//     const data = new FormData()
//     data.append('file', file)
//     SecurePost(getBaseUrlForServiceFromFrontend(), {
//       url: '/api/v1/media/uploadb2media',
//       data
//     }).then((data: any) => {
//       if (data.status === 200) {
//         if (data.data.code === 200) {
//           // props.newFileAdded(data.data.meta)
//           resolve({
//             url: `${data.data.files[0]}`,
//             meta: data.data.meta[0]
//           })
//           // resolve(`${getBaseUrlForServiceFromFrontend()}${apisPath.GETMEDIA}${data.data.meta.filename}`)
//         }
//       }
//     }).catch((e: any) => {
//       console.log(e)
//     })
//   });
// }

const modules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],
    [{ 'header': 1 }, { 'header': 2 }],               // custom button values
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction
    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],
    ['clean'],                                         // remove formatting button
    // ['image']
  ],
  // imageUploader: {
  //   upload: upload
  // },
  // imageResize: true
}

// Upload file
// Quill.register('modules/imageUploader', ImageUploader)
// Quill.register('modules/imageResize', ImageResize);
// Quill.register({
//   // ...
//   'formats/image': Image
// });