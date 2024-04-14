import React, { useState } from "react";

function FileUploader() {
  const [fileContent, setFileContent] = useState(null);
  console.log("🚀 ~ fileContent:", fileContent);

  const handleFileChange = event => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        try {
          const text = e.target.result;
          const jsonData = JSON.parse(text);
          setFileContent(jsonData);
          // Here jsonData can be used to render on MapBox
        } catch (error) {
          console.error("Error parsing JSON!", error);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      <input type="file" onChange={handleFileChange} accept=".json" />
      {/* Render your MapBox component here */}
    </div>
  );
}

export default FileUploader;
