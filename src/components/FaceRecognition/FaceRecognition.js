import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({ imageUrl, box }) => {
  console.log(box);
  const boxes = box.map((face, i) => {
    return <div key={i} className='bounding-box' style={{top: face.topRow, left: face.leftCol, bottom: face.bottomRow, right: face.rightCol}}></div>
  })
  return (
    <div className="center ma">
      <div className='absolute mt2'>
        <img id='inputimage' src={imageUrl} alt="detection" width='500px' height='auto'/>
        {boxes}
      </div>
    </div>
  )
}

export default FaceRecognition;