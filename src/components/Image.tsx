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

                // Center image and add to canvas
                image.set({
                    left: (canvas.width! - image.width! * scaleFactor) / 2,
                    top: (canvas.height! - image.height! * scaleFactor) / 2,
                });

                canvas.add(image);
                canvas.renderAll();

              
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
                }}
                onChange={handleImageUpload}
            />
        </div>
    );
};

export default ImageComponent;
