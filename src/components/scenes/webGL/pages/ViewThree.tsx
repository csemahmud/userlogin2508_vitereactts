import TestThree from "../logic/TestThree";

const ViewThree: React.FC = () => {
    return (
      <div className="p-6 z-35">
        <h1 className="text-2xl font-bold mb-4">Three.js Demo</h1>
        <TestThree />
      </div>
    );
  };

export default ViewThree