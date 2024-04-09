import React from "react";
import FileList from "./components/FileList";

const App: React.FC = () => {
  return (
    <div className="container mx-auto mt-10">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h1 className="mb-4 text-xl font-bold text-gray-700">
          Tuza File Browser
        </h1>
        <FileList />
      </div>
    </div>
  );
};

export default App;
