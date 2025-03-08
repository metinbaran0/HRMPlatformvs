import { useState, useEffect } from 'react';
import { Comment, CommentsResponse } from '../types/comment';
import { fetchCompanyAdminComments, getMockCompanyAdminComments } from '../services/commentService';

// API bağlantısı varsa gerçek veriyi, yoksa mock veriyi kullanacak hook
export const useCompanyAdminComments = (useMockData: boolean = false): CommentsResponse => {
  const [data, setData] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getComments = async () => {
      try {
        setIsLoading(true);
        
        let comments: Comment[];
        if (useMockData) {
          // Mock veri kullan
          comments = getMockCompanyAdminComments();
          // API çağrısını simüle etmek için küçük bir gecikme
          await new Promise(resolve => setTimeout(resolve, 800));
        } else {
          // Gerçek API'den veri çek
          comments = await fetchCompanyAdminComments();
        }
        
        // Yorumları tarihe göre sırala (yeniden eskiye)
        const sortedComments = comments.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        setData(sortedComments);
        setError(null);
      } catch (err) {
        setError('Yorumlar yüklenirken bir hata oluştu.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    getComments();
  }, [useMockData]);

  return { data, isLoading, error };
}; 