import { useState, useEffect } from 'react';
import axios from 'axios';
import type { Study } from '../types';

const Studies: React.FC = () => {
  const [studies, setStudies] = useState<Study[]>([]);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchStudies = async () => {
      try {
        const response = await axios.get('http://backend:5000/studies');
        setStudies(response.data);
      } catch (err: any) {
        setError('Failed to fetch studies');
      }
    };
    fetchStudies();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Studies</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="space-y-4">
        {studies.map((study) => (
          <div key={study.id} className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">{study.title}</h2>
            <div className="text-gray-600">
              {study.content.includes('youtube.com') || study.content.includes('youtu.be') ? (
                <iframe
                  width="100%"
                  height="315"
                  src={study.content}
                  title={study.title}
                  frameBorder="0"
                  allowFullScreen
                />
              ) : (
                <p>{study.content}</p>
              )}
            </div>
            <p className="text-gray-500 mt-2">Author: {study.author.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Studies;