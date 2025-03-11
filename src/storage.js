export const saveDataToJson = (data) => {
    let storedData = localStorage.getItem("donationData");
    let jsonData = storedData ? JSON.parse(storedData) : [];
  
    jsonData.push(data);
  
    const jsonBlob = new Blob([JSON.stringify(jsonData, null, 2)], {
      type: "application/json",
    });
  
    const link = document.createElement("a");
    link.href = URL.createObjectURL(jsonBlob);
    link.download = "storage.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  