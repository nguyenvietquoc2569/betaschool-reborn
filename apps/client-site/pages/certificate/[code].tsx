import React from 'react'
import Head from 'next/head'
import {CertificateModel, serializeDoc} from '@betaschool-reborn/database-model/index'
import { InferGetServerSidePropsType } from 'next'
import { ECertificateType } from '@betaschool-reborn/beta-data-type'
import { connectDB } from '../../middleware/connect'
import { CertSwitch } from '../../ui-component/certificate/cert-switch/cert-switch'
import { Page404 } from '../../ui-component/certificate/error-page/page-error'
import { getAbsoluteBase } from '../../middleware/getAbsolute'
import { genLinkThumbnail } from '../../middleware/thumbnail-gen'
import axios from 'axios'


export const Certificate = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return <>
    <Head>
      <title>{props.error ? 'Error !!!' : `Betaschool Certificate Number ${props.cert.certNumber}`}</title>
      {!props.error && props.cert && props.cert.certType===ECertificateType.testResult && <>
        <meta property="og:url" content={`${getAbsoluteBase()}/certificate/${props.cert.certNumber}`} />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content={`Betaschool - Chứng Chỉ cấp cho: ${props.cert.studenInfo.name.toUpperCase()}`}
        />
         <meta
          property="og:description"
          content={`Chúc mừng ${props.cert.studenInfo.name.toUpperCase()} hoàn thành kì thi: ${props.cert.sourceTest.exam.name} tại Betaschool. Chứng chỉ này ghi nhận những thành tựu của ${props.cert.studenInfo.name.toUpperCase()} tại Betaschool. Chúng tôi trân trọng biết ơn bạn đã đồng hành cùng chúng tôi`}
        />
        <meta property="og:image" content={props.cert.thumbnail} />

      </>}
    </Head>
    {!props.error && <CertSwitch cert={props.cert}></CertSwitch>}
    {props.error && <Page404 error={props.error}></Page404>}
  </>
}

export default Certificate

export const getServerSideProps = async (context) => {
  await connectDB()
  let curs = await (CertificateModel.findOne({certNumber: (context.params.code as string).toUpperCase(), signedBy: {$ne: null}, active: true})
    .populate('requestBy'))
    .populate({
      path:'sourceTest',
      populate: {
        path: 'exam'
      }
    })
    .populate('signedBy')
  if (!curs) {
    return {
      props: {
        cert: serializeDoc(curs),
        error: 'Không tìm thấy chứng chỉ trong cơ sở dữ liệu',
        code: context.params.code
      },
    };
  } else {
    if (curs.certType===ECertificateType.testResult && !curs.thumbnail) {
      let link = genLinkThumbnail(`${getAbsoluteBase()}/certificate/${curs.certNumber}`)
      curs.thumbnail = link
      await curs.updateOne(curs)
      try {
        await axios.get(link)
      } catch (e) {
        console.log(e)
      }
      
    }
  }
  return {
    props: {
      cert: serializeDoc(curs),
      error: '',
      code: context.params.code
    },
  };
}

// export async function getStaticProps(context) {
//   const { db } = await connectToDatabase();
//   const movies = await db
//     .collection("movies")
//     .find({})
//     .sort({ metacritic: -1 })
//     .limit(1000)
//     .toArray();
//   return {
//     props: {
//       movies: JSON.parse(JSON.stringify(movies)),
//     },
//   };
// }