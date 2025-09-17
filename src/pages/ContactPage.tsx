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
    <div className="content w-screen h-screen flex items-center justify-center absolute top-0 left-0 z-2">
      <div className="wrapper  w-screen   h-[70vh] overflow-auto flex flex-col items-center ">
        <div className="max-w-3xl px-4">
          <h1 className="text-3xl font-bold">{data.title}</h1>
          <p className="text-md font-medium leading-relaxed whitespace-pre-line mt-4">
            {data.content}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
