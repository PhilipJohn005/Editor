import { FabricImage } from 'fabric';
import { scale } from 'pdf-lib';
import React,{useEffect,useState,useRef} from 'react'

const Video = ({canvas,canvasRef}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [videoSrc,setVideoSrc]=useState<String|null>(null);
  const [fabricVideo,setFabricVideo]=useState<FabricImage|null>(null);
  const [recordingChunks,setRecordingChunks]=useState([]);
  const [isRecording,setIsRecording]=useState(false);
  const [loadPercentage,setLoadPercentage]=useState(0);
  const [uploadMessage,setUploadMessage]=useState("");
  const [recordingTime,setRecordingTime]=useState(0);
  const [isPlaying,setIsPlaying]=useState(false);


  const handleVideoUpload=(event)=>{
    const file=event?.target?.files[0]
    if(file){
      setLoadPercentage(0);
      setVideoSrc(null);
      setUploadMessage("");

      const url=URL.createObjectURL(file);
      setVideoSrc(url);

      const videoElement=document.createElement("video");
      videoElement.src=url;
      videoElement.crossOrigin="anonymous";


      videoElement.addEventListener("loadeddata",()=>{
        const videoWidth=videoElement.videoWidth;
        const videoHeight=videoElement.videoHeight;
        videoElement.width=videoWidth;
        videoElement.height=videoHeight;

        const canvasWidth=canvas.width;
        const canvasHeight=canvas.height;

        const scale=Math.min(
          canvasWidth/videoWidth,
          canvasHeight/videoHeight
        )
        
        canvas.renderAll();
        const fabricImage=new FabricImage(videoElement,{
          left:0,
          top:0,
          scaleX:scale,
          scaleY:scale,
        })

        setFabricVideo(fabricImage);
        canvas.add(fabricImage);
        canvas.renderAll();
        setUploadMessage("Uploaded");
        setTimeout(()=>{
          setUploadMessage("");
        },3000)
      });
      videoElement.addEventListener("progress",()=>{
        if(videoElement.buffered.length>0){
          const bufferedEnd=videoElement.buffered.end(
            videoElement.buffered.length-1
          );
          const duration=videoElement.duration;
          if(duration>0){
            setLoadPercentage((bufferedEnd/duration)*100);
          }
        }
      });
      
      videoElement.addEventListener("error",(error)=>{
        console.error("video load error",error);
      });
      videoRef.current=videoElement;
    }
  };


  const handlePlayPauseVideo=()=>{
    if(videoRef.current){
      if(videoRef.current.paused){
        videoRef.current.play();
        videoRef.current.addEventListener("timeupdate",()=>{
          if (videoRef.current) {
            fabricVideo?.setElement(videoRef.current);
          }
          canvas.renderAll();
        });
        setIsPlaying(true);
      }else{
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }

  const handleStopVideo=()=>{
    if(videoRef.current){
      videoRef.current.pause();
      videoRef.current.currentTime=0;
      setIsPlaying(false);
      canvas.renderAll();
    }
  }

  const handleVideoUploadButtonClick=()=>{
    if(fileInputRef.current)fileInputRef.current.click();
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        style={{display:"none"}}
        onChange={handleVideoUpload}
      />
      <button onClick={handleVideoUploadButtonClick} className='bg-gray-500'>Upload</button>

      {videoSrc && (
        <div className='bottom transform darkmode'>
          <div className='toolbar'>
            <button onClick={handlePlayPauseVideo} className='bg-gray-500'>
              {isPlaying ? "Pause" : "Play"}
            </button>
            <button onClick={handleStopVideo} className='bg-gray-500'>Stop</button>
          </div>  
        </div>
      )}

    </>
  )
}

export default Video
