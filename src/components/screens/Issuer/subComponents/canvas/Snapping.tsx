import { Line } from 'fabric'

const snappingDistance = 10;
const GUIDELINE_OFFSET = 1;


let isSnapped = false;
let lastSnapPosition = { x: null, y: null };

export const handleMoving =(canvas, obj, guideLines, setGuideLines)=>{
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Get the actual bounding box that accounts for rotation
    const boundingRect = obj.getBoundingRect();
    const left = boundingRect.left;
    const top = boundingRect.top;
    const right = left + boundingRect.width;
    const bottom = top + boundingRect.height;
    const centerX = left + boundingRect.width / 2;
    const centerY = top + boundingRect.height / 2;

    const offsetX = boundingRect.left - obj.left;
    const offsetY = boundingRect.top - obj.top;

    let newGuideLines = [];
    clearGuideLines(canvas);

    let snapX = null;
    let snapY = null;
    let guidelineX = null;
    let guidelineY = null;
    
    const canvasCenterX = canvasWidth / 2;
    const canvasCenterY = canvasHeight / 2;

    if (!isSnapped) {     
        if (Math.abs(left) < snappingDistance) {
            snapX = -offsetX;
            guidelineX = { pos: 0, id: "vertical-left" };
        }
        
        if (Math.abs(top) < snappingDistance) {
            snapY = -offsetY;
            guidelineY = { pos: 0, id: "horizontal-top" };
        }

        if (Math.abs(right - canvasWidth) < snappingDistance) {
            snapX = canvasWidth - boundingRect.width - offsetX;
            guidelineX = { pos: canvasWidth - GUIDELINE_OFFSET, id: "vertical-right" };
        }

        if (Math.abs(bottom - canvasHeight) < snappingDistance) {
            snapY = canvasHeight - boundingRect.height - offsetY;
            guidelineY = { pos: canvasHeight - GUIDELINE_OFFSET, id: "horizontal-bottom" };
        }

        if (!snapX && Math.abs(centerX - canvasCenterX) < snappingDistance) {
            snapX = canvasCenterX - boundingRect.width / 2 - offsetX;
            guidelineX = { pos: canvasCenterX, id: "vertical-center" };
        }

        if (!snapY && Math.abs(centerY - canvasCenterY) < snappingDistance) {
            snapY = canvasCenterY - boundingRect.height / 2 - offsetY;
            guidelineY = { pos: canvasCenterY, id: "horizontal-center" };
        }
    } else {
        // If we're currently snapped, only check if we've moved beyond the snap threshold
        const movedBeyondThresholdX = Math.abs(obj.left - lastSnapPosition.x) > snappingDistance / 2;
        const movedBeyondThresholdY = Math.abs(obj.top - lastSnapPosition.y) > snappingDistance / 2;
        
        if (movedBeyondThresholdX || movedBeyondThresholdY) {
            isSnapped = false;
            lastSnapPosition = { x: null, y: null };
        }
    }

   
    const newPosition = { left: obj.left, top: obj.top };
    let snapped = false;

    if (snapX !== null) {
        newPosition.left = obj.left + (snapX - obj.left) * 0.5;;
        if (guidelineX && !guidelineExists(canvas, guidelineX.id)) {
            const line = createVerticalGuideline(canvas, guidelineX.pos, guidelineX.id);
            newGuideLines.push(line);
            canvas.add(line);
        }
        snapped = true;
        lastSnapPosition.x = newPosition.left;
    }

    if (snapY !== null) {
        newPosition.top = obj.top + (snapY - obj.top) * 0.5;;
        if (guidelineY && !guidelineExists(canvas, guidelineY.id)) {
            const line = createHorizontalGuideline(canvas, guidelineY.pos, guidelineY.id);
            newGuideLines.push(line);
            canvas.add(line);
        }
        snapped = true;
        lastSnapPosition.y = newPosition.top;
    }

    // Update snapped state
    isSnapped = snapped;

    // Only set position if we actually need to change it
    if (snapped && (newPosition.left !== obj.left || newPosition.top !== obj.top)) {
        obj.set(newPosition).setCoords();
    }

    if (!snapped) {
        clearGuideLines(canvas);
    } else {
        setGuideLines(newGuideLines);
    }
};

// Rest of your helper functions remain exactly the same
export const createVerticalGuideline = (canvas, x, id) => {
    return new Line([x, -10, x, canvas.height + 10], { 
        id,
        stroke: "red",
        strokeWidth: 1,
        selectable: false,
        evented: false,
        strokeDashArray: [5, 5],
        opacity: 0.8,
        hasControls: false,
        hasBorders: false,
        hoverCursor: 'default',
        lockMovementX: true,
        lockMovementY: true,
        lockRotation: true,
        lockScalingX: true,
        lockScalingY: true,
        zIndex: 1000,
        strokeLineCap: 'square' 
    });
};

export const createHorizontalGuideline = (canvas, y, id) => {
    return new Line([-10, y, canvas.width + 10, y], {
        id,
        stroke: "red",
        strokeWidth: 1,
        selectable: false,
        evented: false,
        strokeDashArray: [5, 5],
        opacity: 0.8,
        hasControls: false,
        hasBorders: false,
        hoverCursor: 'default',
        lockMovementX: true,
        lockMovementY: true,
        lockRotation: true,
        lockScalingX: true,
        lockScalingY: true,
        zIndex: 1000,
        strokeLineCap: 'square' 
    });
};

export const clearGuideLines = (canvas) => {
    const objects = canvas.getObjects();
    objects.forEach((obj) => {
        if (obj.id && (obj.id.startsWith("vertical-") || obj.id.startsWith("horizontal-"))) {
            canvas.remove(obj);
        }
    });
};

const guidelineExists = (canvas, id) => {
    const objects = canvas.getObjects();
    return objects.some((obj) => obj.id === id);
};