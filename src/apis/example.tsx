// ExampleComponent.tsx
import React, { useEffect } from 'react';
import api from "./axios/api";

interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

const ExampleComponent: React.FC = () => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result: Post[] = await api.get('/posts');
        console.log('Data:', result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Example Component</h1>
    </div>
  );
};

export default ExampleComponent;
