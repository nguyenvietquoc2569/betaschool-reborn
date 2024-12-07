import { useLangContext } from '@betaschool-reborn/vital-test/multiple-language'
import styles from './style.module.css'
import Webcam from "react-webcam"
import { KDButton } from '@betaschool-reborn/vital-test/lit-components'
import { BUTTON_KINDS, BUTTON_SIZES } from '@kyndryl-design-system/shidoka-foundation/components/button/defs'
import { useCallback, useEffect, useRef, useState } from 'react'



export const CaptureScreen = ({score}: {score: (x: string) => void}) => {
  const {ttt} = useLangContext()
  const webcamRef = useRef<Webcam>(null)
  const [imgSrc, setImgSrc] = useState<string | null | undefined>('')

  const capture = useCallback(() => {
    const imageSrc = webcamRef?.current?.getScreenshot();
    setImgSrc(imageSrc);
  }, [webcamRef]);

  const retake = () => {
    setImgSrc(null);
  };

  const [deviceId, setDeviceId] = useState(0);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);


  const handleDevices = 
    (mediaDevices: MediaDeviceInfo[]) =>
      setDevices(mediaDevices.filter(({ kind }: any) => kind === "videoinput"))

  useEffect(
    () => {
      navigator.mediaDevices.enumerateDevices().then(handleDevices);
    },
    [handleDevices]
  );


  const svgIcon = () => (
    <svg
          width="100%"
          height="100%"
          className="svg"
          viewBox="0 0 260 200"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink">
          <defs>
              <mask id="overlay-mask" x="0" y="0" width="100%" height="100%">
                  <rect x="0" y="0" width="100%" height="100%" fill="#fff"/>
                  <circle cx="50%" cy="50%" r="70" />
              </mask>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" mask="url(#overlay-mask)" fillOpacity="0.7"/>
      </svg>
  );
  
  return <>
    { !imgSrc && <h3>{ttt('Vui lòng đặt Answer Sheet vào khay đọc bài', 'Please place the answer sheet to the reading place')}</h3> }
    <div className={styles['container']}>
      {imgSrc ? (
        <img src={imgSrc} alt="webcam" />
      ) : <div className={styles['webcam-container']}>
            <Webcam ref={webcamRef} screenshotFormat="image/jpeg"
              videoConstraints={{ deviceId: devices[deviceId % devices.length]?.deviceId || '' }}
            >
            </Webcam>
            {/* <div className={styles['overlay-container']}>
              {svgIcon()}
            </div> */}
          </div>
      }
     
    </div>
    
    {imgSrc ? ( <div>
      <KDButton size={BUTTON_SIZES.LARGE} kind={BUTTON_KINDS.PRIMARY_APP} onClick={() => score(imgSrc)}>{ttt('Chấm bài', 'Score the answersheet')}</KDButton>
      <KDButton size={BUTTON_SIZES.LARGE} kind={BUTTON_KINDS.TERTIARY} onClick={retake} style={{marginLeft: '16px'}}>{ttt('Chụp lại', 'Retake')}</KDButton>
      </div>
    ) : ( <div>
      <KDButton size={BUTTON_SIZES.LARGE} kind={BUTTON_KINDS.PRIMARY_APP} onClick={capture}>{ttt('Chụp tờ trả lời', 'Capture the answersheet')}</KDButton>
      <KDButton size={BUTTON_SIZES.LARGE} kind={BUTTON_KINDS.TERTIARY} onClick={()=>setDeviceId(deviceId + 1)} style={{marginLeft: '16px'}}>{ttt('Chuyển camera', 'Switch camera')}</KDButton>





      </div>
    )}
  </>
}