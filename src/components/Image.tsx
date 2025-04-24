import * as fabric from 'fabric';
import React,{useEffect, useRef} from 'react';

const ImageComponent = ({canvas,check,s,addImageToSide}) => {
    const inputRef = useRef<HTMLInputElement | null>(null);

    useEffect(()=>{
        if(check && inputRef.current){
            inputRef.current.value='';
            s(false);
        }
    },[check,s])
    
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const imgObj = e.target.files?.[0];
        const reader = new FileReader();
        
        if (imgObj) {
            reader.readAsDataURL(imgObj);
        }

        reader.onload = (e) => {
            const imageUrl = e.target?.result as string;

            addImageToSide(imageUrl);

            const imageElement = document.createElement('img');
            imageElement.src = imageUrl;

            imageElement.onload = function () {
                const image = new fabric.Image(imageElement, {
                    hasBorders: true,
                    hasControls: true,
                    selectable: true,
                    lockScalingFlip: true, 
                });

                const scaleFactor = Math.min(
                    (canvas.width! * 0.8) / image.width!,
                    (canvas.height! * 0.8) / image.height!
                );
                image.scale(scaleFactor);

                
                image.set({
                    left: (canvas.width! - image.width! * scaleFactor) / 2,
                    top: (canvas.height! - image.height! * scaleFactor) / 2,
                });

                canvas.add(image);
                canvas.setActiveObject(image);
                const activeObj = canvas.getActiveObject();
                    if (activeObj) {
                        activeObj.set({
                        cornerColor: 'green',
                        cornerSize: 12,
                        transparentCorners: false,
                        cornerStyle: 'circle',
                    });
                }
                canvas.renderAll();
                
                image.on('scaling', function (e) {  //when image is being scaled we first get eh top,left,widthetc and compare with canvas boundaries 
                    let obj = e.transform?.target;
                    obj.setCoords();
                    
                    let top=obj.getBoundingRect().top;
                    let left=obj.getBoundingRect().left;
                    let height=obj.getBoundingRect().height;
                    let width=obj.getBoundingRect().width

                    if(top+height>canvas.height){
                        obj.scaleY=1;
                        obj.setCoords();
                        let h=obj.getScaledHeight();

                        obj.scaleY=(canvas.height-top)/h;
                        obj.setCoords();
                        canvas.renderAll();

                    }

                    if(top<0){
                        obj.scaleY=1;
                        obj.setCoords();
                        let h=obj.getScaledHeight();
                        obj.scaleY=(height+top)/h;
                        obj.top=0;
                        obj.setCoords();
                        canvas.renderAll();

                    }

                    if(left+width>canvas.width){
                        obj.scaleX=1;
                        obj.setCoords();
                        let w=obj.getScaledWidth();

                        obj.scaleX=(canvas.width-left)/w;
                        obj.setCoords();
                        canvas.renderAll();
                    }

                    if(left<0){
                        obj.scaleX=1;
                        obj.setCoords();
                        let w=obj.getScaledWidth();
                        obj.scaleX=(width+left)/w;
                        obj.left=0;
                        obj.setCoords();
                        canvas.renderAll();
                    }
                });
                
                image.on('moving', function () {
                    image.setCoords();
                    const boundingRect = image.getBoundingRect();

                    if (boundingRect.left < 0) image.left -= boundingRect.left;
                    if (boundingRect.top < 0) image.top -= boundingRect.top;
                    if (boundingRect.left + boundingRect.width > canvas.width!) {
                        image.left -= (boundingRect.left + boundingRect.width - canvas.width!);
                    }
                    if (boundingRect.top + boundingRect.height > canvas.height!) {
                        image.top -= (boundingRect.top + boundingRect.height - canvas.height!);
                    }
                });
                
                image.on('rotating', function () {
                    image.setCoords();
                });
            };
        };
    };

    return (
        <div>
            <input
                type="file"
                accept="image/*"
                ref={inputRef}
                style={{
                    position: 'absolute',
                    top: '10%',
                    left: '40%',
                    backgroundColor: 'blue',
                    transform: 'translateZ(0)'
                }}
                onChange={handleImageUpload}

            />
        </div>
    );
};

export default ImageComponent;
