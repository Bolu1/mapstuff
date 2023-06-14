import React, { useMemo } from "react";

interface IProps{
  findCenter: ()=> void
  setMapType: React.Dispatch<React.SetStateAction<string>>
}

const FunctionModal = (props:IProps) => {
  return (
    <div>
      <div className="absmodal m-20 bg-white min-w-[20rem] min-h-[20rem] absolute">
        <button
          onClick={() => {
            props.findCenter()
          }}
          className="bg-black rounded text-lg p-3 m-6"
        >
          Draw
        </button>

        <button
          onClick={() => {
            props.setMapType('satellite')
          }}
          className="bg-green-800 rounded text-lg p-3 m-6"
        >
          Satellite
        </button>

        <button
          onClick={() => {
            props.setMapType('roadmap')
          }}
          className="bg-blue-300 rounded text-lg p-3 m-6"
        >
          Roadmap
        </button>
        
      </div>
    </div>
  );
};

export default FunctionModal;
