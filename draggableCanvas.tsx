import { useEffect } from "react";
import { loadImage } from "../utils";

interface ShapeArrType {
  x: number;
  y: number;
}

interface Props {
  coOrdinates: Array<ShapeArrType>;
  dataUri: string;
  onPointsUpdate: Function;
}

const DraggablePointsCanvas = ({
  coOrdinates,
  dataUri,
  onPointsUpdate,
}: Props) => {
  useEffect(() => {
    const startDraggableCtx = async () => {
      // Load image and get dimention
      const image: any = await loadImage(dataUri);
      // canvas related vars
      const canvas: any = document.getElementById("edit_doc_canvas");

      // Draw image on canvas
      canvas.width = image.width;
      canvas.height = image.height;

      const ctx = canvas.getContext("2d");
      //   ctx.save();

      //   ctx.translate(canvas.width / 2, canvas.height / 2);
      //   ctx.rotate((90 * Math.PI) / 180);

      //   /// here, translate back:
      //   ctx.translate(-canvas.width / 2, -canvas.height / 2);

      //   ctx.restore();

      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      const cw = canvas.width;
      const ch = canvas.height;

      // document.body.appendChild(canvas);

      // save relevant information about shapes drawn on the canvas
      // define one circle and save it in the shapes[] array
      let offsetX: number, offsetY: number;
      let shapes: Array<ShapeArrType> = coOrdinates;

      // drag related vars
      let isDragging = false;
      let startX: number, startY: number;

      // hold the index of the shape being dragged (if any)
      let selectedShapeIndex: number;
      const radius: number = 30;

      // used to calc canvas position relative to window
      function reOffset() {
        let BB = canvas.getBoundingClientRect();
        offsetX = BB.left;
        offsetY = BB.top;
      }
      reOffset();

      // listen for window events
      window.onscroll = function () {
        reOffset();
      };
      window.onresize = function () {
        reOffset();
      };
      canvas.onresize = function () {
        reOffset();
      };

      // listen for touches events
      canvas.ontouchstart = handleMouseDown;
      canvas.ontouchmove = handleMouseMove;
      canvas.ontouchend = handleMouseUp;

      // listen for mouse events
      canvas.onmousedown = handleMouseDown;
      canvas.onmousemove = handleMouseMove;
      canvas.onmouseup = handleMouseUp;
      canvas.onmouseout = handleMouseOut;

      // draw the shapes on the canvas
      drawAll();

      // given mouse X & Y (mx & my) and shape object
      // return true/false whether mouse is inside the shape
      function isMouseInShape(
        mx: number,
        my: number,
        shape: ShapeArrType,
        radius: number
      ) {
        // this is a circle
        let dx = mx - shape.x;
        let dy = my - shape.y;
        // math test to see if mouse is inside circle
        if (dx * dx + dy * dy < radius * radius * 2) {
          // yes, mouse is inside this circle
          return true;
        }
        // the mouse isn't in any of the shapes
        return false;
      }

      function handleMouseDown(e: any) {
        // tell the browser we're handling this event
        e.preventDefault();
        e.stopPropagation();
        // calculate the current mouse position
        // startX = parseInt(e.clientX - offsetX);
        startX = e.touches
          ? parseInt(String(e.touches[0].clientX - offsetX))
          : parseInt(String(e.clientX - offsetX));
        startY = e.touches
          ? parseInt(String(e.touches[0].clientY - offsetY))
          : parseInt(String(e.clientY - offsetY));

        // test mouse position against all shapes
        // post result if mouse is in a shape
        for (var i = 0; i < shapes.length; i++) {
          if (isMouseInShape(startX, startY, shapes[i], radius)) {
            // the mouse is inside this shape
            // select this shape
            selectedShapeIndex = i;
            // set the isDragging flag
            isDragging = true;
            // and return (==stop looking for
            // further shapes under the mouse)
            return;
          }
        }
      }

      function handleMouseUp(e: any) {
        // return if we're not dragging
        if (!isDragging) {
          return;
        }
        // tell the browser we're handling this event
        e.preventDefault();
        e.stopPropagation();
        // the drag is over -- clear the isDragging flag
        isDragging = false;
      }

      function handleMouseOut(e: any) {
        // return if we're not dragging
        if (!isDragging) {
          return;
        }
        // tell the browser we're handling this event
        e.preventDefault();
        e.stopPropagation();
        // the drag is over -- clear the isDragging flag
        isDragging = false;
      }

      function handleMouseMove(e: any) {
        // return if we're not dragging
        if (!isDragging) {
          return;
        }
        // tell the browser we're handling this event
        e.preventDefault();
        e.stopPropagation();
        // calculate the current mouse position
        let mouseX = e.touches
          ? parseInt(String(e.touches[0].clientX - offsetX))
          : parseInt(String(e.clientX - offsetX));
        let mouseY = e.touches
          ? parseInt(String(e.touches[0].clientY - offsetY))
          : parseInt(String(e.clientY - offsetY));

        // how far has the mouse dragged from its previous mousemove position?
        let dx = mouseX - startX;
        let dy = mouseY - startY;
        // move the selected shape by the drag distance
        let selectedShape = shapes[selectedShapeIndex];
        selectedShape.x += dx;
        selectedShape.y += dy;
        // clear the canvas and redraw all shapes
        drawAll();
        // update the starting drag position (== the current mouse position)
        startX = mouseX;
        startY = mouseY;

        // Set updated points in state
        onPointsUpdate(shapes);
      }

      // clear the canvas and
      // redraw all shapes in their current positions
      function drawAll() {
        ctx.clearRect(0, 0, cw, ch);
        ctx.drawImage(image, 0, 0, image.width, image.height);

        for (var i = 0; i < shapes.length; i++) {
          let shape = shapes[i];
          // it's a circle
          ctx.beginPath();
          ctx.arc(shape.x, shape.y, radius, 0, Math.PI * 2);
          ctx.fillStyle = "#0075F3";
          ctx.lineWidth = 2;
          ctx.fill();
          ctx.stroke();
          ctx.closePath();

          ctx.beginPath();
          ctx.strokeStyle = "white";
          ctx.lineWidth = 5;
          ctx.moveTo(shape.x, shape.y);
          ctx.lineTo(
            shapes[i - 1 >= 0 ? i - 1 : 3].x,
            shapes[i - 1 >= 0 ? i - 1 : 3].y
          );
          ctx.stroke();
          ctx.closePath();
        }
      }
    };
    startDraggableCtx();

    //eslint-disable-next-line
  }, [coOrdinates, dataUri]);

  return <canvas id="edit_doc_canvas"></canvas>;
};

export default DraggablePointsCanvas;
