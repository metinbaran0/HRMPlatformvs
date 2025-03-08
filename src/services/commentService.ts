import { Comment } from '../types/comment';

// API'den yorumları çekmek için servis
export const fetchCompanyAdminComments = async (): Promise<Comment[]> => {
  try {
    const response = await fetch('/api/comments');
    const data = await response.json();
    
    // Sadece COMPANY_ADMIN rolüne sahip kullanıcıların yorumlarını filtrele
    return data.filter((comment: Comment) => comment.user.role === 'COMPANY_ADMIN');
  } catch (error) {
    console.error('Yorumlar yüklenirken hata oluştu:', error);
    throw error;
  }
};

// Mock veri (gerçek API olmadığında kullanılacak)
export const getMockCompanyAdminComments = (): Comment[] => {
  return [
    {
      id: '1',
      text: 'Bu hikaye gerçekten etkileyici. Şirketimizin vizyonunu yansıtıyor.',
      createdAt: '2023-11-15T14:30:00Z',
      user: {
        id: 'admin1',
        name: 'Ahmet Yılmaz',
        role: 'COMPANY_ADMIN'
      }
    },
    {
      id: '2',
      text: 'Ekibimizin başarısını gösteren harika bir örnek. Tebrikler!',
      createdAt: '2023-11-14T09:15:00Z',
      user: {
        id: 'admin2',
        name: 'Ayşe Demir',
        role: 'COMPANY_ADMIN'
      }
    },
    {
      id: '3',
      text: 'Bu projenin geliştirilmesinde emeği geçen herkese teşekkürler.',
      createdAt: '2023-11-13T16:45:00Z',
      user: {
        id: 'admin3',
        name: 'Mehmet Kaya',
        role: 'COMPANY_ADMIN'
      }
    },
    {
      id: '4',
      text: 'Gelecek dönem için benzer projeleri desteklemeye devam edeceğiz.',
      createdAt: '2023-11-12T11:20:00Z',
      user: {
        id: 'admin1',
        name: 'Ahmet Yılmaz',
        role: 'COMPANY_ADMIN'
      }
    },
    {
      id: '5',
      text: 'Müşteri memnuniyeti odaklı yaklaşımımız burada da kendini gösteriyor.',
      createdAt: '2023-11-10T13:50:00Z',
      user: {
        id: 'admin4',
        name: 'Zeynep Öztürk',
        role: 'COMPANY_ADMIN'
      }
    }
  ];
}; 