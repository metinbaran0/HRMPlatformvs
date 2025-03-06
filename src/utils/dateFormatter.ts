// Tarih formatını düzenleyen yardımcı fonksiyon
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  
  // Geçerli bir tarih değilse boş string döndür
  if (isNaN(date.getTime())) {
    return '';
  }
  
  return new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}; 