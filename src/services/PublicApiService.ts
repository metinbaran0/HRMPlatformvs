// Public API çağrıları için ayrı bir servis
export const fetchPublicComments = async (page = 0, size = 10) => {
  try {
    const response = await fetch(
      `http://localhost:9090/v1/api/public/comments?page=${page}&size=${size}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Yorumlar yüklenirken hata oluştu:", error);
    throw error;
  }
}; 