const AboutMe: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">About Me</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold">Le Phuc Chi</h2>
        <p className="text-gray-700 mt-2">Data Engineer & Backend Developer</p>
        <p className="text-gray-600 mt-2">
          With 3 years of experience in building scalable data pipelines and backend systems, I specialize in TypeScript, Node.js, and PostgreSQL.
        </p>
        <h3 className="text-lg font-semibold mt-4">Skills</h3>
        <ul className="list-disc list-inside text-gray-600">
          <li>Programming: TypeScript, Python, SQL</li>
          <li>Frameworks: NestJS, React</li>
          <li>Databases: PostgreSQL, MongoDB</li>
          <li>Tools: Docker, AWS</li>
        </ul>
      </div>
    </div>
  );
};

export default AboutMe;