import { useEffect, useState } from 'react';

interface ContactPage {
  title: string;
  content: string;
}

const ContactPage: React.FC = () => {
  const [data, setData] = useState<ContactPage | null>(null);

  useEffect(() => {
    import('../assets/data/pages/about.json').then((json) => {
      setData(json as ContactPage);
    });
  }, []);

  if (!data) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col py-[7rem] items-center justify-center w-screen h-screen absolute top-0 left-0 right-0 z-2">
      <div className="w-screen p-6 max-h-screen ">
        <h1 className="text-3xl font-bold mb-4">{data.title}</h1>
        <p className="text-md max-w-3xl overflow-y-auto  font-medium leading-relaxed whitespace-pre-line">
          {data.content}
        </p>
      </div>
    </div>
  );
};

export default ContactPage;
