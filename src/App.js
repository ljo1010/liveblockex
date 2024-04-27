import { useMap, useMyPresence, useOthers, useHistory, useBatch, } from "./liveblocks.config";

import "./App.css";
import { useState } from "react";

const COLORS = ["#DC2626", "#D97706", "#059669", "#7C3AED", "#DB2777"];

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function getRandomColor() {
  return COLORS[getRandomInt(COLORS.length)];
}

export default function App() {
  const shapes = useMap("shapes");

  if (shapes == null) {
    return <div className="loading">Loading</div>;
  }

  return <Canvas shapes={shapes} />;
}

function Canvas({ shapes }) {
  const [isDragging, setIsDragging] = useState(false);
  const [{ selectedShape }, setPresence] = useMyPresence();
  const others = useOthers();
  const history = useHistory();
  const batch = useBatch();
  
  const insertRectangle = () => {
    batch(()=> {
    const shapeId = Date.now().toString();
    
    const rectangle = {
      x: getRandomInt(300),
      y: getRandomInt(300),
      fill: getRandomColor(),
    };
    shapes.set(shapeId, rectangle);
    setPresence({ selectedShape: shapeId}, { addToHistory: true });
  });
  };

  const deleteRectangle = () => {
    shapes.delete(selectedShape);
    setPresence({selectedShape: null})
  };

  const onShapePointerDown = (e, shapeId) => {
    history.pause();
    e.stopPropagation();

    setPresence({ selectedShape: shapeId}, { addToHistory: true });

    setIsDragging(true);
  };

  const onCanvasPointerUp = (e) => {
    if (!isDragging) {
      setPresence({ selectedShape: null }, { addToHistory: true });
    }

    setIsDragging(false);

    history.resume();
  };

  const onCanvasPointerMove = (e) => {
    e.preventDefault();
  
    if (isDragging){
      const shape = shapes.get(selectedShape);
      if (shape) {
        shapes.set(selectedShape, {
          ...shape,
          x: e.clientX - 50,
          y: e.clientY - 50,
        });
      }
    }
  };
    


  return (
    <>
      <div className="canvas"
      onPointerMove={onCanvasPointerMove}
      onPointerUp={onCanvasPointerUp}
      >
        {Array.from(shapes, ([shapeId, shape]) => {
          let selectionColor = selectedShape === shapeId ? "blue" : Array.from(others).some((user) => user.presence?.selectedShape === shapeId) ? "green" : undefined;

          return (
          <Rectangle 
                  key={shapeId}
                  shape={shape}
                  id={shapeId}
                  onShapePointerDown={onShapePointerDown}
                  selectionColor={selectionColor}
                  />
                );
        })}
      </div>
      <div className="toolbar">
        <button onClick={insertRectangle}>Rectangle</button>
        <button onClick={deleteRectangle} disabled={selectedShape == null}>
          Delete
        </button>
        <button onClick={history.undo}>Ubdo</button>
        <button onClick={history.undo}>Redo</button>

      </div>
    </>
  );
}


const Rectangle = ({ shape, id, onShapePointerDown, selectionColor }) => {
  const { x, y, fill } = shape;

  return (
    <div
      onPointerDown={(e) => onShapePointerDown(e, id)}
      className="rectangle"
      style={{
        transform: `translate(${x}px, ${y}px)`,
        backgroundColor: fill ? fill : "#CCC",
        borderColor: selectionColor || "transparent",
      }}
    ></div>
  );
};