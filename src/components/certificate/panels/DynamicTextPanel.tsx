import * as fabric from 'fabric'
import { Button } from '@/components/ui/button';

interface Props {
    canvas: fabric.Canvas;
    fillColor: string;
    fontSize: number;
    fontFamily: string;
    updateCanvasToDB: (obj: any) => void;
    setSelectedTextObj: (obj: fabric.Textbox) => void;
}

const DynamicTextPanel = ({fillColor, fontSize, fontFamily, canvas, setSelectedTextObj, updateCanvasToDB}: Props) => {
    const handleDynamicAddText = () => {
        const initialText = "{Hello}";
        const textObj = new fabric.Textbox(initialText, {
          fill: fillColor,
          fontSize: fontSize,
          fontFamily: fontFamily,
          editable: true,
          width: 200,
          left: 100,
          top: 100,
          hasControls: true, 
          lockUniScaling: true, 
          id: crypto.randomUUID(),
          customType: "dynamic",
        });
      
        let originalContent = "Hello";
        let isEditing = false;
      
        canvas.add(textObj);
        canvas.setActiveObject(textObj);
        setSelectedTextObj(textObj);
      
        textObj.on('editing:entered', () => {
          isEditing = true;
          textObj.set({ text: originalContent });
          canvas.renderAll();
        });
      
        textObj.on('editing:exited', () => {
          isEditing = false;
          originalContent = textObj.text.replace(/[{}]/g, '');
          textObj.set({ text: `{${originalContent}}` });
          canvas.renderAll();
        });
      
        textObj.on('changed', () => {
          if (isEditing) {
            const newText = textObj.text.replace(/[{}]/g, '');
            if (newText !== textObj.text) {
              textObj.set({ text: newText });
              canvas.renderAll();
            }
            originalContent = newText;
          }
        });
      
        canvas.on('object:removed', (options) => {
          if (options.target === textObj) {
            textObj.off('editing:entered');
            textObj.off('editing:exited');
            textObj.off('changed');
          }
        });
      
        textObj.on('scaling', () => {
          const scaleX = typeof textObj.scaleX === 'number' ? textObj.scaleX : 1;
          const newFontSize = fontSize * scaleX;
          textObj.set({
            fontSize: newFontSize,
            scaleX: 1,
            scaleY: 1,
            width: textObj.width * textObj.scaleX
          });
          canvas.renderAll();
        });
        
        updateCanvasToDB(textObj.toObject(['id', 'customType']))
    };

    return (
        <div className="bg-blue-100 w-76 h-full p-4">
            <h2 className="text-xl font-bold mb-4">Dynamic Text</h2>
            <Button onClick={handleDynamicAddText} className="w-full">
                Add Dynamic Text
            </Button>
        </div>
    )
}

export default DynamicTextPanel