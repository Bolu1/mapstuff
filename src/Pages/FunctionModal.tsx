import React, { useMemo } from "react";

interface IProps {
  downloadScreenshot: ()=> void;
  findCenter: () => void;
  isCompleted: boolean;
  setMapType: React.Dispatch<React.SetStateAction<string>>;
  setIsCompleted: React.Dispatch<React.SetStateAction<boolean>>;
  // cancelPolygonHandler: () => void;
}

const FunctionModal = (props: IProps) => {
  return (
    <div>
      <div className="">
        <div className="absmodal m-20 bg-white min-w-[20rem] min-h-[20rem] absolute">
          <button
            onClick={() => {
              props.findCenter();
            }}
            className="bg-black rounded text-lg p-3 m-6"
          >
            Draw
          </button>

          <button
            onClick={() => {
              props.setMapType("satellite");
            }}
            className="bg-green-800 rounded text-lg p-3 m-6"
          >
            Satellite
          </button>

          <button
            onClick={() => {
              props.setMapType("roadmap");
            }}
            className="bg-blue-300 rounded text-lg p-3 m-6"
          >
            Roadmap
          </button>
          <div className=" flex">
            {props.isCompleted == false ? (
              <button
                onClick={() => {
                  props.setIsCompleted(true);
                }}
                className="bg-blue-300 rounded text-lg p-3 m-6"
              >
                Done
              </button>
            ) : (
              <button
                onClick={() => {
                  props.downloadScreenshot();
                }}
                className="bg-blue-300 rounded text-lg p-3 m-6"
              >
                Screenshot
              </button>
            )}

            <div className="">
                <button
                  onClick={() => {
                    // props.cancelPolygonHandler();
                  }}
                  className="bg-red-600 rounded text-lg p-3 m-6"
                >
                  Cancel
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FunctionModal;
