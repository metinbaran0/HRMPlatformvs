// Public API çağrıları için ayrı bir servis
export const fetchPublicComments = async (page = 0, size = 10) => {
  try {
    // Doğru endpoint'i kullan
    const response = await fetch(
      `http://localhost:9090/v1/api/comment/v1/api/public/comments?page=${page}&size=${size}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.warn(`Public API HTTP error! status: ${response.status}`);
      
      // Hata durumunda alternatif endpoint'i dene
      const alternativeResponse = await fetch(
        `http://localhost:9090/v1/api/public/comments?page=${page}&size=${size}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      
      if (!alternativeResponse.ok) {
        throw new Error(`HTTP error! status: ${alternativeResponse.status}`);
      }
      
      const alternativeData = await alternativeResponse.json();
      console.log("Alternative API response:", alternativeData);
      return alternativeData.data || [];
    }

    const data = await response.json();
    console.log("Public comments API response:", data);
    
    return data.data || [];
  } catch (error) {
    console.error("Yorumlar yüklenirken hata oluştu:", error);
    throw error;
  }
}; 