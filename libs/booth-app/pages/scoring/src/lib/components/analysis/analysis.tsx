import { useLangContext } from '@betaschool-reborn/vital-test/multiple-language'
import gif from './scanner.gif'
import styles from './style.module.css'
import { KDButton } from '@betaschool-reborn/vital-test/lit-components'
import { BUTTON_SIZES } from '@kyndryl-design-system/shidoka-foundation/components/button/defs'
// import { KDButton } from '@betaschool-reborn/vital-test/lit-components'
// import { BUTTON_SIZES } from '@kyndryl-design-system/shidoka-foundation/components/button/defs'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ImageAnnotator, useImageAnnotator } from 'react-image-label';
import { ArrayXY, PointArray } from '@svgdotjs/svg.js';

import { Polygon, Rectangle, Circle, Ellipse } from "react-image-label";
import { AnnotateImageResponse } from '../../type/gcv.type'
let p = new Polygon(
  [
    [550, 224],
    [519, 222],
    [474, 261],
    [430, 341],
    [416, 383],
    [427, 399],
    [446, 414],
    [528, 396],
    [604, 372],
    [633, 325],
    [654, 313],
    [648, 282],
    [638, 231],
    [596, 208],
    [562, 208],
  ],
  ["strawberry"]
);

export const AnalysisScreen = ({backToCapture, img, gvc} : {
  img: string,
  backToCapture: () => void,
  gvc: AnnotateImageResponse
}) => {
  const {ttt} = useLangContext()
  const { setHandles, annotator } = useImageAnnotator();

  const boundaryList = useMemo(() => {
    const re: Polygon[] = []
    for (const vertex of (gvc.textAnnotations?.map(x => x) || [])) {
      re.push(
        new Polygon(vertex.boundingPoly.vertices.map(x => [x.x, x.y]), [vertex.description])
      )
    }
    return re
  }, [gvc])


  return <>
    <h3>{ttt('Kết quả', 'Result')}</h3>
    {/* <img src={img} className={styles.img} alt="Scanner GIF"></img> */}
    <ImageAnnotator
        setHandles={setHandles}
        shapes={boundaryList}
        imageUrl={img}
        // onAdded={shape => setDialog({ show: true, shape })}
        // onContextMenu={shape => setDialog({ show: true, shape })}
        onReady={annotator => {  }} />
    
    <KDButton size={BUTTON_SIZES.LARGE} onClick={backToCapture}>{ttt('Quay về', 'Back to screen')}</KDButton>
  </>
}