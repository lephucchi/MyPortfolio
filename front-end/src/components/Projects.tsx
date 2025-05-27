import { useState, useEffect } from 'react';
import axios from 'axios';
import type { Project } from '../types';
import { useAuth } from '../context/AuthContext';

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<string>('');
  const [newProject, setNewProject] = useState({
    title: '',
    githubLink: '',
    documentation: '',
  });
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const { token } = useAuth();

  // Lấy danh sách project khi component mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('http://localhost:5000/projects');
        setProjects(response.data);
      } catch (err: any) {
        setError('Failed to fetch projects');
      }
    };
    fetchProjects();
  }, []);

  // Xử lý thay đổi input
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setNewProject({ ...newProject, [e.target.name]: e.target.value });
  };

  // Xử lý chọn file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnail(e.target.files[0]);
    }
  };

  // Xử lý submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError('Please login to create a project');
      return;
    }

    const formData = new FormData();
    formData.append('title', newProject.title);
    formData.append('githubLink', newProject.githubLink);
    formData.append('documentation', newProject.documentation);
    if (thumbnail) {
      formData.append('thumbnail', thumbnail);
    }

    try {
      await axios.post('http://localhost:5000/projects', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      // Reset form
      setNewProject({ title: '', githubLink: '', documentation: '' });
      setThumbnail(null);
      // Lấy lại danh sách project
      const response = await axios.get('http://localhost:5000/projects');
      setProjects(response.data);
      setError('');
    } catch (err: any) {
      setError('Failed to create project');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Projects</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Form tạo project mới */}
      {token && (
        <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Create New Project</h2>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={newProject.title}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="githubLink" className="block text-sm font-medium text-gray-700">
              GitHub Link
            </label>
            <input
              type="url"
              name="githubLink"
              id="githubLink"
              value={newProject.githubLink}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="documentation" className="block text-sm font-medium text-gray-700">
              Documentation
            </label>
            <textarea
              name="documentation"
              id="documentation"
              value={newProject.documentation}
              onChange={handleInputChange}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700">
              Thumbnail
            </label>
            <input
              type="file"
              name="thumbnail"
              id="thumbnail"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          >
            Create Project
          </button>
        </form>
      )}

      {/* Danh sách project */}
      <div className="space-y-4">
        {projects.map((project) => (
          <div key={project.id} className="bg-white p-4 rounded-lg shadow-md">
            {project.thumbnailUrl && (
              <img
                src={`http://localhost:5000${project.thumbnailUrl}`}
                alt={project.title}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
            )}
            <h2 className="text-xl font-semibold">{project.title}</h2>
            <p className="text-gray-600">{project.documentation}</p>
            <p className="text-gray-500 mt-2">
              GitHub:{' '}
              <a href={project.githubLink} className="text-blue-500 hover:underline">
                {project.githubLink}
              </a>
            </p>
            <p className="text-gray-500 mt-2">Technologies: {project.technologies}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;