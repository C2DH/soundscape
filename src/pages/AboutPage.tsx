import { useEffect, useState } from 'react';

interface AboutData {
  title: string;
  content: string;
}

const About: React.FC = () => {
  const [data, setData] = useState<AboutData | null>(null);

  useEffect(() => {
    import('../assets/data/pages/about.json').then((json) => {
      setData(json as AboutData);
    });
  }, []);

  if (!data) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col  overflow-y-auto py-[7rem] items-center justify-center w-screen h-screen absolute top-0 left-0 z-2">
      <div className="w-screen max-w-3xl p-6 max-h-screen">
        <h1 className="text-3xl font-bold mb-4">{data.title}</h1>
        <p className="text-md font-medium leading-relaxed whitespace-pre-line">{data.content}</p>
      </div>
    </div>
  );
};

export default About;
